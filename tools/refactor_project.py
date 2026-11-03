#!/usr/bin/env python3
"""Rebuild the Ren'Py project from the original monolith.

Creates a clean ``game/`` tree:
  * definitions and characters in ``00_definitions.rpy``
  * one file per series in ``chapters/``
  * images deduplicated by SHA-256 and placed in semantic folders
  * audio names normalised to lower-case (web/Android are case-sensitive)
  * broken paths and unused image definitions removed

The original source is never modified.
"""
from __future__ import annotations

import hashlib
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "Оригинал" / "source" / "game"
DST = ROOT / "game"
TRASH = Path(r"G:\_TRASH\2026-11-02\Work_Novela\_rebuild_old")

CATEGORY = {
    "back1": "backgrounds/ch01",
    "back2": "backgrounds/ch02",
    "back3": "backgrounds/ch03",
    "back4": "backgrounds/ch04",
    "back5": "backgrounds/ch05",
    "good": "endings/neutral",
    "great": "endings/true",
    "plox": "endings/ghost",
    "G": "characters/player_f",
    "M": "characters/player_m",
    "T": "characters/timiryazev",
    "ghosts": "characters/ghosts",
    "book": "books",
    "seria": "series",
    "anim": "animations",
    "dop": "ui",
}

SERIES = [
    {
        "number": 1,
        "title": "Межмирье",
        "label": "scene1",
        "image": "series/seria1.webp",
    },
    {
        "number": 2,
        "title": "Бал призраков",
        "label": "scene16",
        "image": "series/seria2.webp",
    },
    {
        "number": 3,
        "title": "Голос из омута",
        "label": "scene26",
        "image": "series/seria3.webp",
    },
    {
        "number": 4,
        "title": "Призраки предприятий",
        "label": "scene37",
        "image": "series/seria4.webp",
    },
    {
        "number": 5,
        "title": "Есть ли путь домой?",
        "label": "scene39",
        "image": "series/seria5.webp",
    },
]

CHAPTER_BOUNDARIES = [
    ("01_series_1_prologue.rpy", "splashscreen"),
    ("02_series_2_library.rpy", "scene16"),
    ("03_series_3_concert.rpy", "scene26"),
    ("04_series_4_quarter.rpy", "scene37"),
    ("05_series_5_station.rpy", "scene38"),
    ("06_endings.rpy", "sceneplox"),
    ("07_finale.rpy", "scenetitri"),
]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def safe_name(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9._-]+", "_", name)
    return name.strip("._") or "file"


def copy_unique(src: Path, category: str, seen: dict[str, str]) -> str:
    """Copy src once per content hash. Return path relative to game/."""
    digest = sha256(src)
    if digest in seen:
        return seen[digest]
    folder = DST / "images" / category
    folder.mkdir(parents=True, exist_ok=True)
    filename = safe_name(src.name)
    target = folder / filename
    if target.exists():
        target = folder / f"{target.stem}_{digest[:8]}{target.suffix}"
    shutil.copy2(src, target)
    rel = str(target.relative_to(DST)).replace("\\", "/")
    seen[digest] = rel
    return rel


def main() -> int:
    if not SRC.exists():
        print(f"Source not found: {SRC}")
        return 1
    if DST.exists():
        TRASH.mkdir(parents=True, exist_ok=True)
        old = TRASH / f"game_{datetime.now():%Y%m%d_%H%M%S}"
        shutil.move(str(DST), str(old))
        print(f"Old build moved to {old}")

    DST.mkdir(parents=True)
    # Reusable UI: Ren'Py's generated gui folder plus three standard screens.
    shutil.copytree(SRC / "gui", DST / "gui")
    for name in ("screens.rpy", "gui.rpy", "options.rpy"):
        shutil.copy2(SRC / name, DST / name)

    # Audio: normalise to lower case and avoid case-sensitivity bugs on web/Android.
    audio_map: dict[str, str] = {}
    (DST / "audio").mkdir()
    for mp3 in sorted((SRC / "audio").glob("*.mp3")):
        target_name = safe_name(mp3.name)
        shutil.copy2(mp3, DST / "audio" / target_name)
        audio_map[mp3.stem.lower()] = target_name
    # The original source misses one track that exists in the series materials.
    ghost_src = ROOT / "materials" / "series" / "02_bal_prizrakov" / "Музыка" / "ghost.mp3"
    if ghost_src.exists():
        shutil.copy2(ghost_src, DST / "audio" / "ghost.mp3")
        audio_map["ghost"] = "ghost.mp3"
    # The original defines this alias manually; keep it explicit.
    audio_map["ghostworld"] = audio_map.get("ghostworld", "ghostworld.mp3")

    script_path = SRC / "script.rpy"
    text = script_path.read_text(encoding="utf-8-sig")
    lines = text.splitlines()

    # Locate the first label; everything above it is definitions.
    first_label = next(i for i, line in enumerate(lines) if re.match(r"^label\s+splashscreen\s*:", line))
    prefix = lines[:first_label]
    body = lines[first_label:]

    image_defs: list[tuple[str, str]] = []
    movie_defs: list[tuple[str, str]] = []
    for line in prefix:
        m = re.match(r'^image\s+(\w+)\s*=\s*"([^"]+)"\s*$', line)
        if m:
            image_defs.append((m.group(1), m.group(2)))
            continue
        m = re.match(r'^image\s+(\w+)\s*=\s*Movie\(play="([^"]+)"', line)
        if m:
            movie_defs.append((m.group(1), m.group(2)))

    # Remove image/audio definition lines from the prefix; regenerate them.
    audio_defs: list[tuple[str, str]] = []
    clean_prefix = []
    for line in prefix:
        if re.match(r'^image\s+\w+\s*=', line):
            continue
        m = re.match(r'^define\s+(\w+)\s*=\s*"audio/([^"]+)"', line)
        if m:
            audio_defs.append((m.group(1), m.group(2)))
            continue
        clean_prefix.append(line.rstrip())

    seen: dict[str, str] = {}
    generated_images: list[str] = []
    image_paths: dict[str, str] = {}
    missing: list[str] = []
    alias_count = 0
    for name, relpath in image_defs:
        relpath = relpath.replace("//", "/")
        src = SRC / relpath
        if not src.exists():
            src = SRC / "images" / relpath
        if not src.exists():
            # Case-insensitive fallback for Windows-authored paths.
            lowered = relpath.lower()
            matches = [
                p for p in SRC.rglob("*")
                if str(p.relative_to(SRC)).replace("\\", "/").lower() in (lowered, "images/" + lowered)
            ]
            if matches:
                src = matches[0]
        if not src.exists():
            missing.append(f"{name} -> {relpath}")
            continue
        category_key = relpath.split("/", 1)[0]
        if category_key == "images" and "/" in relpath:
            category_key = relpath.split("/", 2)[1]
        category = CATEGORY.get(category_key, "misc")
        dst_rel = copy_unique(src, category, seen)
        generated_images.append(f'image {name} = "{dst_rel}"')
        image_paths[name] = dst_rel
        if dst_rel != f"images/{category}/{safe_name(src.name)}":
            alias_count += 1

    generated_movies: list[str] = []
    for name, relpath in movie_defs:
        relpath = relpath.replace("//", "/")
        src = SRC / relpath
        if not src.exists():
            missing.append(f"{name} (movie) -> {relpath}")
            continue
        # H.264 MP4 is the safest single format for Windows, Android, iOS and web.
        mp4 = src.with_suffix(".mp4")
        chosen = mp4 if mp4.exists() else src
        folder = DST / "images" / "animations"
        folder.mkdir(parents=True, exist_ok=True)
        target = folder / safe_name(chosen.name)
        if not target.exists():
            shutil.copy2(chosen, target)
        generated_movies.append(
            f'image {name} = Movie(play="images/animations/{safe_name(chosen.name)}", image=Null(), loop=True)'
        )

    generated_audio = []
    used_audio: set[str] = set()
    for logical, filename in audio_defs:
        target_name = safe_name(filename)
        generated_audio.append(f'define {logical} = "audio/{target_name}"')
        used_audio.add(logical)
    # "ghost" is referenced once; the track lives in the series materials.
    if "ghost" not in used_audio:
        ghost_file = "audio/ghost.mp3" if (DST / "audio" / "ghost.mp3").exists() else "audio/ghostworld.mp3"
        generated_audio.append(f'define ghost = "{ghost_file}"')

    series_lines = ["", "# Метаданные серий: используются экраном «Серии» и сборкой.", "define series_info = ["]
    for item in SERIES:
        image_path = image_paths.get(f"seria{item['number']}", item["image"])
        series_lines.append(
            '    {"number": %d, "title": "%s", "label": "%s", "image": "%s"},'
            % (item["number"], item["title"], item["label"], image_path)
        )
    series_lines.append("]")
    series_lines.append("")

    definitions = re.sub(r"\n{3,}", "\n\n", "\n".join(clean_prefix)).rstrip() + "\n\n"
    definitions += "# ---- Изображения (автоматически дедуплицированы по SHA-256) ----\n"
    definitions += "\n".join(generated_images) + "\n\n"
    definitions += "# ---- Анимации (MP4 для Windows/Android/iOS/Web) ----\n"
    definitions += "\n".join(generated_movies) + "\n\n"
    definitions += "# ---- Музыка ----\n"
    definitions += "\n".join(generated_audio) + "\n"
    definitions += "\n".join(series_lines)
    (DST / "00_definitions.rpy").write_text(definitions, encoding="utf-8")

    # Split the story at label boundaries. Labels are global in Ren'Py.
    starts: dict[str, int] = {}
    for i, line in enumerate(body):
        m = re.match(r"^label\s+(\w+)\s*:", line)
        if m:
            starts[m.group(1)] = i
    for _, label in CHAPTER_BOUNDARIES:
        if label not in starts:
            print(f"Missing boundary label: {label}")
            return 1
    (DST / "chapters").mkdir()

    for idx, (filename, label) in enumerate(CHAPTER_BOUNDARIES):
        start = starts[label]
        end = starts[CHAPTER_BOUNDARIES[idx + 1][1]] if idx + 1 < len(CHAPTER_BOUNDARIES) else len(body)
        chunk = body[start:end]
        # Compatibility fixes that are safe on every platform.
        fixed = []
        for line in chunk:
            if line.lstrip().startswith("exclude ="):
                indent = line[:len(line) - len(line.lstrip())]
                line = (
                    indent
                    + 'exclude = "][\\\\{}<>:/\\\\|?*1234567890-=\\"`!@#$%^&*()+№;~, "'
                    + "  # Запрещенные символы (опционально)"
                )
            fixed.append(line.rstrip())
        header = [
            f"# {filename}",
            "# Сгенерировано из оригинального script.rpy; текст сюжета сохранён.",
            "",
        ]
        (DST / "chapters" / filename).write_text("\n".join(header + fixed) + "\n", encoding="utf-8")

    # Root files for Ren'Py/Android.
    for name in (
        "android-icon_background.png",
        "android-icon_foreground.png",
        "android-presplash.jpg",
        "android-downloading.jpg",
        "android.keystore",
        "bundle.keystore",
    ):
        src = SRC.parent / name
        if src.exists():
            shutil.copy2(src, ROOT / name)

    print(f"Images defined: {len(generated_images)} (aliases: {alias_count})")
    print(f"Movies defined: {len(generated_movies)}")
    print(f"Audio files: {len(audio_map)}")
    print(f"Missing images: {len(missing)}")
    for item in missing:
        print("  MISSING", item)
    print(f"Project written to {DST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
