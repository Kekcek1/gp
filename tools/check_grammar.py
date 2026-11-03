#!/usr/bin/env python3
"""Run a Russian LanguageTool check over the exported scenario.

Requires the local LanguageTool server files in tools/languagetool.
"""
from __future__ import annotations

import csv
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

import language_tool_python

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = Path(r"G:\NewWorkNovel\docs\script")
NODES = SCRIPT / "scenario.json"


def main() -> int:
    os.environ.setdefault("LTP_PATH", str(ROOT / "tools" / "languagetool"))
    jar_dir = ROOT / "tools" / "languagetool" / "LanguageTool-6.8"
    if jar_dir.exists():
        os.environ.setdefault("LTP_JAR_DIR_PATH", str(jar_dir))

    nodes = json.loads(NODES.read_text(encoding="utf-8"))
    checkable = []
    for index, node in enumerate(nodes):
        if node["type"] not in {"say", "prompt", "option"}:
            continue
        text = re.sub(r"\s+", " ", node["text"]).strip()
        if not text:
            continue
        checkable.append((index, text))

    tool = language_tool_python.LanguageTool("ru-RU")
    tool._picky = True
    matches: list[dict] = []

    # Batch paragraphs to reduce HTTP overhead while keeping exact offsets.
    batch: list[tuple[int, str]] = []
    batch_len = 0

    def flush() -> None:
        nonlocal batch, batch_len
        if not batch:
            return
        chunk = "\n".join(text for _, text in batch)
        starts = []
        pos = 0
        for _, text in batch:
            starts.append(pos)
            pos += len(text) + 1
        for match in tool.check(chunk):
            offset = match.offset
            # Find the paragraph containing this offset.
            line_index = 0
            for i, start in enumerate(starts):
                if start <= offset:
                    line_index = i
                else:
                    break
            node_index, text = batch[line_index]
            local_offset = offset - starts[line_index]
            if local_offset < 0 or local_offset > len(text):
                continue
            local_length = min(match.error_length, max(0, len(text) - local_offset))
            if local_length <= 0:
                continue
            matches.append({
                "node": node_index,
                "source": nodes[node_index].get("source", ""),
                "line": nodes[node_index].get("line", 0),
                "type": nodes[node_index]["type"],
                "speaker": nodes[node_index].get("speaker", ""),
                "text": text,
                "offset": local_offset,
                "length": local_length,
                "fragment": text[local_offset:local_offset + local_length],
                "message": match.message,
                "replacements": match.replacements[:5],
                "rule_id": match.rule_id,
                "category": match.category,
                "context": match.context,
            })
        batch = []
        batch_len = 0

    for index, text in checkable:
        if batch_len + len(text) > 3500 and batch:
            flush()
        batch.append((index, text))
        batch_len += len(text) + 1
    flush()
    tool.close()

    (SCRIPT / "grammar_matches.json").write_text(
        json.dumps(matches, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    with (SCRIPT / "grammar_report.csv").open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "source", "line", "type", "speaker", "fragment", "message",
                "replacements", "rule_id", "category", "text",
            ],
        )
        writer.writeheader()
        for item in matches:
            row = dict(item)
            row["replacements"] = " | ".join(item["replacements"])
            writer.writerow({k: row.get(k, "") for k in writer.fieldnames})

    by_rule = Counter(item["rule_id"] for item in matches)
    by_category = Counter(item["category"] for item in matches)
    lines = [
        "# Проверка грамматики",
        "",
        f"Проверено фрагментов: **{len(checkable)}**",
        f"Найдено замечаний: **{len(matches)}**",
        "",
        "## По категориям",
        "",
        "| Категория | Количество |",
        "|---|---:|",
    ]
    for category, count in by_category.most_common():
        lines.append(f"| {category} | {count} |")
    lines += ["", "## По правилам", "", "| Правило | Количество |", "|---|---:|"]
    for rule, count in by_rule.most_common(40):
        lines.append(f"| {rule} | {count} |")
    (SCRIPT / "grammar_summary.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"checkable: {len(checkable)}")
    print(f"matches: {len(matches)}")
    print("categories:")
    for category, count in by_category.most_common():
        print(f"  {category}: {count}")
    print("top rules:")
    for rule, count in by_rule.most_common(20):
        print(f"  {rule}: {count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
