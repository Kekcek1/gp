#!/usr/bin/env python3
"""Apply only confirmed grammar/spelling fixes to the Ren'Py chapters.

The plot, wording and branching are not changed. Every replacement is logged.
"""
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME = ROOT / "game" / "chapters"
LOG = Path(r"G:\NewWorkNovel\docs\script\grammar_fixes_applied.csv")

# (regex, replacement, expected minimum count, note)
FIXES = [
    (r"Как-будто", "Как будто", 2, "Сложный союз «как будто» пишется раздельно"),
    (r"Не смотря на", "Несмотря на", 4, "Производный предлог «несмотря на» пишется слитно"),
    (r"почвувствовал", "почувствовал", 1, "Опечатка: пропущена буква «о»"),
    (r"столкнулсь", "столкнулся", 1, "Опечатка: пропущена буква «я» (мужская ветка)"),
    (r"Не верно\.", "Неверно.", 16, "Наречие «неверно» пишется слитно"),
    (r"этого не достаточно", "этого недостаточно", 2, "Наречие «недостаточно» пишется слитно"),
    (r"своей дрогой", "своей дорогой", 2, "Опечатка: 「дорогой」 (путь)"),
    (r"что бы ты мог", "чтобы ты мог", 2, "Союз «чтобы» пишется слитно"),
    (r"пшел вон", "пошел вон", 1, "Опечатка: 「пошел」"),
    (r"пшла вон", "пошла вон", 1, "Опечатка: 「пошла」"),
]


def main() -> int:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    total = 0
    for path in sorted(GAME.glob("*.rpy")):
        text = path.read_text(encoding="utf-8-sig")
        original = text
        for pattern, replacement, expected, note in FIXES:
            matches = list(re.finditer(pattern, text))
            if len(matches) < expected:
                print(f"WARNING: {path.name}: expected {expected} of {pattern!r}, found {len(matches)}")
            for match in matches:
                line = text.count("\n", 0, match.start()) + 1
                rows.append({
                    "file": path.name,
                    "line": line,
                    "old": match.group(0),
                    "new": replacement,
                    "note": note,
                })
                total += 1
            text = re.sub(pattern, replacement, text)
        if text != original:
            path.write_text(text, encoding="utf-8")

    with LOG.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["file", "line", "old", "new", "note"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"applied: {total}")
    for item in FIXES:
        found = sum(1 for row in rows if row["old"] == item[1] or row["new"] == item[1])
        print(f"  {item[1]!r}: {found}")
    print(f"log: {LOG}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
