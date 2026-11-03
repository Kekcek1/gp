#!/usr/bin/env python3
"""Verify that the refactored project preserves the original story and assets."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(r"G:\NewWorkNovel\reference\script_original.rpy")
GAME = ROOT / "game"
OUT = Path(r"G:\NewWorkNovel\docs\integrity_report.txt")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def main() -> int:
    original = read(SRC)
    original_body = original[original.index("label splashscreen:"):]

    chapter_files = sorted((GAME / "chapters").glob("*.rpy"))
    rebuilt_body = "\n".join(read(p) for p in chapter_files)
    # Remove generated headers and normalise line endings.
    rebuilt_lines = []
    for line in rebuilt_body.splitlines():
        if line.startswith("# ") and line.endswith(".rpy"):
            continue
        if line.startswith("# Сгенерировано"):
            continue
        rebuilt_lines.append(line)
    rebuilt_body = "\n".join(rebuilt_lines)

    def normalise(text: str) -> list[str]:
        result = []
        for line in text.splitlines():
            line = line.rstrip()
            if not line.strip():
                continue
            if line.lstrip().startswith("#"):
                continue
            result.append(line)
        return result

    orig_lines = normalise(original_body)
    new_lines = normalise(rebuilt_body)

    def compat(line: str) -> str:
        line = line.replace("play music ghost fadein", "play music ghostWorld fadein")
        line = line.replace('exclude = "][\\{}<>', 'exclude = "][\\\\{}<>')
        line = line.replace('№;~,\\ "', '№;~, "')
        # Grammar-only fixes applied in tools/apply_grammar_fixes.py.
        for old, new in (
            ("Как-будто", "Как будто"),
            ("Не смотря на", "Несмотря на"),
            ("почвувствовал", "почувствовал"),
            ("столкнулсь", "столкнулся"),
            ("Не верно.", "Неверно."),
            ("этого не достаточно", "этого недостаточно"),
            ("своей дрогой", "своей дорогой"),
            ("что бы ты мог", "чтобы ты мог"),
            ("пшел вон", "пошел вон"),
            ("пшла вон", "пошла вон"),
        ):
            line = line.replace(old, new)
        return line

    orig_normalised = [compat(line) for line in orig_lines]
    new_normalised = [compat(line) for line in new_lines]

    diff = []
    if len(orig_normalised) != len(new_lines):
        diff.append(f"line count: original={len(orig_normalised)}, rebuilt={len(new_lines)}")
    for i, (a, b) in enumerate(zip(orig_normalised, new_normalised), 1):
        if a != b:
            diff.append(f"line {i}:\n  original: {a}\n  rebuilt:  {b}")

    labels_orig = set(re.findall(r"^\s*label\s+(\w+)\s*:", original, re.M))
    labels_new = set(re.findall(r"^\s*label\s+(\w+)\s*:", rebuilt_body, re.M))
    jumps = re.findall(r"^\s+jump\s+(\w+)", rebuilt_body, re.M)
    missing_jumps = sorted({j for j in jumps if j not in labels_new and j not in {"start"}})

    images = re.findall(r'^image\s+\w+\s*=\s*"([^"]+)"', rebuilt_body, re.M)
    missing_images = sorted(p for p in images if not (GAME / p).exists())
    audio = re.findall(r'^define\s+\w+\s*=\s*"audio/([^"]+)"', rebuilt_body, re.M)
    missing_audio = sorted(p for p in audio if not (GAME / "audio" / p).exists())

    menus = len(re.findall(r"^\s+menu\s*:", rebuilt_body, re.M))
    says = len(re.findall(r'^\s{4,}["].*["]\s*$', rebuilt_body, re.M))

    lines = [
        "Проверка целостности проекта",
        "=" * 32,
        f"Файлов глав: {len(chapter_files)}",
        f"Labels: оригинал={len(labels_orig)}, новый={len(labels_new)}",
        f"Меню: {menus}",
        f"Реплик (эвристика): {says}",
        f"Пропавшие jump-цели: {missing_jumps or 'нет'}",
        f"Пропавшие изображения: {missing_images or 'нет'}",
        f"Пропавшие аудио: {missing_audio or 'нет'}",
        f"Расхождения текста: {len(diff)}",
    ]
    if diff:
        lines += ["", *diff]
    report = "\n".join(lines) + "\n"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(report, encoding="utf-8")
    print(report)
    return 0 if not (missing_jumps or missing_images or missing_audio or diff) else 1


if __name__ == "__main__":
    sys.exit(main())
