#!/usr/bin/env python3
"""Move runtime/dead files out of the game folder into _TRASH."""
from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(r"G:\Work_Novela")
TRASH = Path(r"G:\_TRASH\2026-11-03\Work_Novela")
LOG = Path(r"G:\NewWorkNovel\docs\cleanup_theme_log.txt")

TARGETS = [
    ROOT / "game" / "cache",
    ROOT / "game" / "saves",
    ROOT / "log.txt",
    ROOT / "traceback.txt",
    ROOT / "errors.txt",
    ROOT / "game" / "gui" / "game_menu.png",
    ROOT / "game" / "gui" / "main_menu.png",
    ROOT / "game" / "gui" / "overlay" / "main_menu.png",
]


def move(path: Path) -> bool:
    if not path.exists():
        return False
    rel = path.relative_to(ROOT)
    dest = TRASH / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        if dest.is_dir():
            shutil.rmtree(dest)
        else:
            dest.unlink()
    shutil.move(str(path), str(dest))
    return True


def main() -> None:
    moved = []
    for path in TARGETS:
        if move(path):
            moved.append(path.relative_to(ROOT).as_posix())
    for path in sorted(ROOT.joinpath("game").rglob("*.rpyc")):
        if move(path):
            moved.append(path.relative_to(ROOT).as_posix())

    with LOG.open("w", encoding="utf-8") as f:
        f.write("# Очистка игровой папки перед релизом\n\n")
        f.write(f"Дата: {datetime.now():%Y-%m-%d %H:%M}\n\n")
        f.write("Перемещено в `G:\\_TRASH\\2026-11-03\\Work_Novela`:\n")
        for item in moved:
            f.write(f"- `{item}`\n")
    print(f"moved: {len(moved)}")
    print(f"log: {LOG}")


if __name__ == "__main__":
    main()
