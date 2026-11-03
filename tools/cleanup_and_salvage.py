#!/usr/bin/env python3
"""Salvage useful material, organise series, and move the rest to _TRASH.

Nothing is deleted permanently. Everything moved keeps its relative path under
G:\\_TRASH\\2026-11-02\\Work_Novela.
"""
from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(r"G:\Work_Novela")
TRASH = Path(r"G:\_TRASH\2026-11-02\Work_Novela")
SALVAGE = ROOT / "materials" / "reference"
SERIES = ROOT / "materials" / "series"

MOVED: list[tuple[str, str]] = []
COPIED: list[tuple[str, str]] = []


def copy_tree(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    if dst.exists():
        dst = dst.with_name(dst.name + "_" + datetime.now().strftime("%H%M%S"))
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(src, dst)
    COPIED.append((str(src.relative_to(ROOT)), str(dst.relative_to(ROOT))))


def copy_file(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    COPIED.append((str(src.relative_to(ROOT)), str(dst.relative_to(ROOT))))


def move(src: Path, dest_rel: Path | None = None) -> None:
    if not src.exists():
        return
    rel = dest_rel or src.relative_to(ROOT)
    dst = TRASH / rel
    if dst.exists():
        dst = dst.with_name(dst.name + "_" + datetime.now().strftime("%H%M%S"))
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(dst))
    MOVED.append((str(src.relative_to(ROOT)), str(dst)))


def main() -> int:
    SALVAGE.mkdir(parents=True, exist_ok=True)
    SERIES.mkdir(parents=True, exist_ok=True)

    # 1. Salvage art and story material that can help a future 2D remake.
    copy_tree(ROOT / "02_Ближе_к_новеле" / "assets" / "portraits", SALVAGE / "art_web" / "portraits")
    copy_tree(ROOT / "02_Ближе_к_новеле" / "assets" / "rooms", SALVAGE / "art_web" / "rooms")
    copy_tree(ROOT / "02_Ближе_к_новеле" / "assets" / "cutscenes", SALVAGE / "art_web" / "cutscenes")
    copy_tree(ROOT / "02_Ближе_к_новеле" / "assets" / "props_new", SALVAGE / "art_web" / "props")
    copy_tree(ROOT / "02_Ближе_к_новеле" / "assets" / "fonts", SALVAGE / "art_web" / "fonts")
    copy_tree(ROOT / "_dev" / "variant2_art", SALVAGE / "art_variant2")
    copy_file(ROOT / "03_Вид_сверху" / "assets" / "world.png", SALVAGE / "art_topdown" / "world.png")
    copy_file(ROOT / "03_Вид_сверху" / "assets" / "library_interior.png", SALVAGE / "art_topdown" / "library_interior.png")
    copy_tree(ROOT / "03_Вид_сверху" / "assets" / "characters", SALVAGE / "art_topdown" / "characters")

    copy_file(ROOT / "02_Ближе_к_новеле" / "js" / "original_story.js", SALVAGE / "story" / "original_story_web.js")
    copy_file(ROOT / "_dev" / "original_script.txt", SALVAGE / "story" / "original_script.txt")
    copy_file(ROOT / "_dev" / "original_story_dump.txt", SALVAGE / "story" / "original_story_dump.txt")
    copy_file(ROOT / "_dev" / "parse_original.py", ROOT / "tools" / "reference" / "parse_original.py")
    copy_file(ROOT / "_dev" / "verify_script_coverage.py", ROOT / "tools" / "reference" / "verify_script_coverage.py")
    copy_file(ROOT / "_dev" / "story_coverage.py", ROOT / "tools" / "reference" / "story_coverage.py")

    # 2. All series in one folder.
    series_map = {
        "1 серия": "01_mezhimirye",
        "2 серия": "02_bal_prizrakov",
        "3 серия": "03_golos_iz_omuta",
        "4 серия": "04_prizraki_predpriyatiy",
        "5 серия": "05_est_li_put_domoy",
    }
    materials = ROOT / "Оригинал" / "materials"
    for old, new in series_map.items():
        src = materials / old
        if src.exists():
            dst = SERIES / new
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dst))
            MOVED.append((str(src.relative_to(ROOT)), str(dst.relative_to(ROOT))))

    second_part = materials / "4 серия 2 ч"
    if second_part.exists():
        dst = SERIES / "04_prizraki_predpriyatiy" / "02_chast"
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(second_part), str(dst))
        MOVED.append((str(second_part.relative_to(ROOT)), str(dst.relative_to(ROOT))))

    if (materials / "Серии").exists():
        shutil.move(str(materials / "Серии"), str(SERIES / "_titles"))
        MOVED.append((str((materials / "Серии").relative_to(ROOT)), "materials/series/_titles"))
    if (materials / "книги").exists():
        shutil.move(str(materials / "книги"), str(ROOT / "materials" / "books"))
        MOVED.append((str((materials / "книги").relative_to(ROOT)), "materials/books"))
    if (materials / "доп материал").exists():
        shutil.move(str(materials / "доп материал"), str(ROOT / "materials" / "extras"))
        MOVED.append((str((materials / "доп материал").relative_to(ROOT)), "materials/extras"))

    # 3. Archives duplicate the extracted series; keep the extracted files.
    move(materials / "_archives", Path("materials/_archives_duplicates"))

    # 4. Original docs / source / old web build.
    copy_file(ROOT / "Оригинал" / "docs" / "TZ" / "ТЗ.docx", ROOT / "docs" / "legal" / "TZ.docx")
    copy_file(ROOT / "Оригинал" / "README.md", ROOT / "docs" / "reference" / "ORIGINAL_README.md")
    move(ROOT / "Оригинал" / "source", Path("Оригинал/source"))
    move(ROOT / "Оригинал" / "web-export", Path("Оригинал/web-export"))
    move(ROOT / "Оригинал" / "docs", Path("Оригинал/docs"))
    move(ROOT / "Оригинал" / "materials", Path("Оригинал/materials_emptied"))
    move(ROOT / "Оригинал", Path("Оригинал/_folder"))

    # 5. Two old game attempts and development artifacts.
    move(ROOT / "02_Ближе_к_новеле", Path("02_Ближе_к_новеле"))
    move(ROOT / "03_Вид_сверху", Path("03_Вид_сверху"))
    move(ROOT / "_dev", Path("_dev"))
    move(ROOT / "Screenshots", Path("Screenshots"))
    for name in ("README.md", "QA_REPORT.md", "start_combined.py", "start_game.py", "start_topdown.py",
                 "START_GAME.bat", "ЗАПУСТИТЬ_БЛИЖЕ_К_НОВЕЛЕ.bat", "ЗАПУСТИТЬ_ВИД_СВЕРХУ.bat", "ЗАПУСТИТЬ_ИГРУ.bat",
                 "log.txt"):
        move(ROOT / name, Path("_old_root") / name)

    # 6. Broken 1.2 GB web build made before the project root was cleaned.
    move(ROOT / "dist" / "web", Path("_bad_build/web_1.2GB"))

    # 7. Thumbs.db cleanup inside the organised materials.
    for thumbs in list((ROOT / "materials").rglob("Thumbs.db")):
        rel = thumbs.relative_to(ROOT)
        move(thumbs, Path("materials_thumbs") / rel)

    log = ROOT / "docs" / "cleanup_log.txt"
    log.parent.mkdir(parents=True, exist_ok=True)
    lines = ["# Перемещение и сохранение материалов", ""]
    lines.append("## Скопировано в проект (полезное)")
    for src, dst in COPIED:
        lines.append(f"- `{src}` → `{dst}`")
    lines += ["", "## Перемещено в _TRASH (не удалено)"]
    for src, dst in MOVED:
        lines.append(f"- `{src}` → `{dst}`")
    log.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"copied: {len(COPIED)}")
    print(f"moved: {len(MOVED)}")
    print(f"log: {log}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
