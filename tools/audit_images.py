#!/usr/bin/env python3
"""Audit every image in the project: exact hashes, sizes and perceptual hashes.

Outputs:
  docs/audit/images.csv          - one row per image
  docs/audit/image_audit.json    - machine-readable report
  docs/audit/DUPLICATES.md       - human-readable duplicate report
"""
from __future__ import annotations

import csv
import hashlib
import json
import os
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(r"G:\NewWorkNovel\docs\audit")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def dhash(path: Path, size: int = 8) -> str | None:
    try:
        with Image.open(path) as im:
            im = im.convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
            px = list(im.getdata())
        bits = []
        for row in range(size):
            for col in range(size):
                left = px[row * (size + 1) + col]
                right = px[row * (size + 1) + col + 1]
                bits.append("1" if left > right else "0")
        return "".join(f"{int(''.join(bits[i:i + 4]), 2):x}" for i in range(0, len(bits), 4))
    except Exception:
        return None


def hamming(a: str, b: str) -> int:
    return sum(c1 != c2 for c1, c2 in zip(a, b))


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    skip_parts = {".git", "__pycache__", "node_modules", "cache", "saves", "dist"}
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in IMAGE_EXT:
            continue
        rel = path.relative_to(ROOT)
        if any(part in skip_parts for part in rel.parts):
            continue
        try:
            stat = path.stat()
            with Image.open(path) as im:
                width, height = im.size
                mode = im.mode
        except Exception as exc:
            rows.append({
                "path": str(rel).replace("\\", "/"),
                "bytes": stat.st_size if "stat" in locals() else 0,
                "width": 0,
                "height": 0,
                "mode": "ERROR",
                "sha256": sha256(path),
                "dhash": None,
                "error": str(exc),
            })
            continue
        rows.append({
            "path": str(rel).replace("\\", "/"),
            "bytes": stat.st_size,
            "width": width,
            "height": height,
            "mode": mode,
            "sha256": sha256(path),
            "dhash": dhash(path),
            "error": "",
        })

    with (OUT / "images.csv").open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    exact: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        exact[row["sha256"]].append(row)
    exact_groups = [g for g in exact.values() if len(g) > 1]

    # Near-duplicates: only meaningful images, distance <= 4 of 64 bits.
    candidates = [r for r in rows if r["dhash"] and r["width"] >= 96 and r["height"] >= 96]
    near_groups: list[list[dict]] = []
    used: set[str] = set()
    for i, a in enumerate(candidates):
        if a["path"] in used:
            continue
        group = [a]
        for b in candidates[i + 1:]:
            if b["path"] in used:
                continue
            if hamming(a["dhash"], b["dhash"]) <= 4:
                group.append(b)
                used.add(b["path"])
        if len(group) > 1:
            used.add(a["path"])
            near_groups.append(group)

    report = {
        "root": str(ROOT),
        "image_count": len(rows),
        "total_bytes": sum(r["bytes"] for r in rows),
        "exact_duplicate_groups": exact_groups,
        "near_duplicate_groups": near_groups,
    }
    with (OUT / "image_audit.json").open("w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    lines = [
        "# Аудит изображений",
        "",
        f"Просканировано файлов: **{len(rows)}**  ",
        f"Суммарный размер: **{report['total_bytes'] / 1024 / 1024:.1f} МБ**  ",
        f"Групп точных дублей: **{len(exact_groups)}**  ",
        f"Групп похожих изображений (dHash ≤ 4/64): **{len(near_groups)}**",
        "",
        "## Как читать отчёт",
        "",
        "- `game/` — runtime-ассеты. Точные дубли уже заменены алиасами на один файл.",
        "- `game/gui/` — служебные файлы шаблона Ren'Py; одинаковые файлы нужны движку.",
        "- `materials/` — исходный архив. Повторы отмечены, но оставлены как источник для будущей 2D-переделки.",
        "- `docs/` — скриншоты проверки, не входят в сборку.",
        "",
        "## Точные дубли (одинаковый SHA-256)",
        "",
    ]
    exact_groups.sort(key=lambda g: (-len(g), -g[0]["bytes"]))
    if not exact_groups:
        lines.append("Точных дублей не найдено.")
    for n, group in enumerate(exact_groups, 1):
        areas = sorted({item["path"].split("/")[0] for item in group})
        area = "/".join(areas)
        lines.append(f"### Группа E{n:03d} — {len(group)} файла, {group[0]['bytes'] / 1024:.0f} КБ каждый, зона: {area}")
        lines.append("")
        for item in group:
            lines.append(f"- `{item['path']}` — {item['width']}×{item['height']}")
        lines.append("")
        if all(item["path"].startswith("game/gui/") for item in group):
            lines.append("**Действие:** служебные файлы Ren'Py, не удалять.")
        elif areas == ["game"]:
            lines.append("**Действие:** runtime-дубль; один файл оставлен, остальные имена ссылаются на него.")
        elif areas == ["materials"]:
            lines.append("**Действие:** исходный повтор; оставлен для истории, удалять только вручную.")
        else:
            lines.append("**Действие:** проверить вручную; при сомнении оставить.")
        lines.append("")

    lines += ["## Похожие изображения (возможные перерисовки/ресайзы)", ""]
    if not near_groups:
        lines.append("Похожих изображений не найдено.")
    near_groups.sort(key=lambda g: (-len(g), -g[0]["bytes"]))
    for n, group in enumerate(near_groups, 1):
        areas = sorted({item["path"].split("/")[0] for item in group})
        lines.append(f"### Группа N{n:03d} — {len(group)} файла, зона: {'/'.join(areas)}")
        lines.append("")
        for item in group:
            lines.append(
                f"- `{item['path']}` — {item['width']}×{item['height']}, "
                f"{item['bytes'] / 1024:.0f} КБ, dHash `{item['dhash']}`"
            )
        lines.append("")

    (OUT / "DUPLICATES.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"images: {len(rows)}")
    print(f"exact groups: {len(exact_groups)}")
    print(f"near groups: {len(near_groups)}")
    print(f"report: {OUT / 'DUPLICATES.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
