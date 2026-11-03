#!/usr/bin/env python3
"""Parse the Ren'Py chapters into a single readable scenario.

Outputs:
  docs/script/SCENARIO_FULL.txt
  docs/script/scenario.json
"""
from __future__ import annotations

import ast
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAME = ROOT / "game"
OUT = Path(r"G:\NewWorkNovel\docs\script")

CHAPTER_TITLES = {
    "01_series_1_prologue.rpy": "Серия 1. Межмирье",
    "02_series_2_library.rpy": "Серия 2. Бал призраков",
    "03_series_3_concert.rpy": "Серия 3. Голос из омута",
    "04_series_4_quarter.rpy": "Серия 4. Призраки предприятий",
    "05_series_5_station.rpy": "Серия 5. Есть ли путь домой?",
    "06_endings.rpy": "Финал. Три исхода",
    "07_finale.rpy": "Титры",
}

TAG_RE = re.compile(r"\{[^{}]*\}")
RENPY_KEYWORDS = {
    "fit", "size", "zoom", "xalign", "yalign", "xpos", "ypos", "xoffset", "yoffset",
    "alpha", "easein", "easeout", "linear", "pause", "play", "queue", "stop", "scene",
    "show", "hide", "with", "at", "onlayer", "zorder", "rotate", "xzoom", "yzoom",
    "crop", "subpixel", "additive", "blur", "matrixcolor", "xsize", "ysize", "xmaximum",
    "ymaximum", "xminimum", "yminimum", "xfill", "yfill", "spacing", "padding",
}


def decode_string(token: str) -> str:
    try:
        value = ast.literal_eval(token)
    except Exception:
        value = token[1:-1]
        value = value.replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")
    value = TAG_RE.sub("", value)
    value = value.replace("[player_name]", "Игрок")
    value = value.replace("[t_name]", "Тимирязев")
    value = value.replace("[name]", "Игрок")
    value = re.sub(r"\[[a-zA-Z_][a-zA-Z0-9_]*\]", "…", value)
    return value


def character_map() -> dict[str, str]:
    text = (GAME / "00_definitions.rpy").read_text(encoding="utf-8-sig")
    result: dict[str, str] = {}
    for match in re.finditer(r'define\s+(\w+)\s*=\s*(?:Dynamic)?Character\("([^"]+)"', text):
        result[match.group(1)] = match.group(2)
    result["character"] = "Игрок"
    result["tmrz"] = "Тимирязев"
    return result


def parse() -> list[dict]:
    names = character_map()
    nodes: list[dict] = []
    for path in sorted((GAME / "chapters").glob("*.rpy")):
        chapter = CHAPTER_TITLES.get(path.name, path.stem)
        nodes.append({"type": "chapter", "text": chapter, "source": path.name, "line": 1})
        lines = path.read_text(encoding="utf-8-sig").splitlines()
        in_input = False
        in_credits = False
        for number, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            if "renpy.input(" in stripped:
                in_input = True
            if in_input:
                if stripped.endswith(")") or stripped.endswith(").strip()"):
                    in_input = False
                continue
            if stripped.startswith('call screen credits('):
                in_credits = True
                continue
            if in_credits:
                if stripped.startswith(")"):
                    in_credits = False
                continue

            m = re.match(r"^\s*label\s+(\w+)\s*:", line)
            if m:
                nodes.append({"type": "label", "text": m.group(1), "source": path.name, "line": number})
                continue

            if stripped == "menu:":
                nodes.append({"type": "menu_start", "text": "", "source": path.name, "line": number})
                continue

            # Menu option: "text": at the end of the line.
            m = re.match(r'^\s*"((?:[^"\\]|\\.)*)"\s*:\s*$', line)
            if m and not stripped.startswith("if "):
                nodes.append({
                    "type": "option",
                    "text": decode_string('"' + m.group(1) + '"'),
                    "source": path.name,
                    "line": number,
                })
                continue

            # Dialogue or narration. Speaker is optional.
            m = re.match(r'^\s*(?:(\w+)\s+)?("(?:[^"\\]|\\.)*")\s*(?:with\s+.+)?$', line)
            if m:
                speaker = m.group(1)
                if speaker and speaker.lower() in RENPY_KEYWORDS:
                    continue
                token = m.group(2)
                text = decode_string(token)
                if not text.strip():
                    continue
                nodes.append({
                    "type": "say",
                    "speaker": names.get(speaker, speaker) if speaker else "",
                    "text": text,
                    "source": path.name,
                    "line": number,
                })
                continue

    # Mark menu prompts: a say node immediately after menu_start is the prompt.
    for i, node in enumerate(nodes):
        if node["type"] == "say" and i and nodes[i - 1]["type"] == "menu_start":
            node["type"] = "prompt"
    return nodes


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    nodes = parse()
    (OUT / "scenario.json").write_text(json.dumps(nodes, ensure_ascii=False, indent=2), encoding="utf-8")

    lines: list[str] = []
    say_count = 0
    option_count = 0
    for node in nodes:
        kind = node["type"]
        if kind == "chapter":
            lines += ["", "=" * 72, node["text"], "=" * 72, ""]
        elif kind == "label":
            lines += ["", f"--- {node['text']} ---"]
        elif kind == "menu_start":
            lines += ["", "ВЫБОР:"]
        elif kind == "prompt":
            lines += [f"  {node['text']}"]
        elif kind == "option":
            lines += [f"  • {node['text']}"]
            option_count += 1
        elif kind == "say":
            say_count += 1
            speaker = f"{node['speaker']}: " if node["speaker"] else ""
            lines.append(f"{speaker}{node['text']}")
    text = "\n".join(lines).strip() + "\n"
    (OUT / "SCENARIO_FULL.txt").write_text(text, encoding="utf-8")
    print(f"nodes: {len(nodes)}")
    print(f"say: {say_count}")
    print(f"options: {option_count}")
    print(f"chars: {len(text)}")
    print(f"written: {OUT / 'SCENARIO_FULL.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
