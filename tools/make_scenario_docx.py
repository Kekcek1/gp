#!/usr/bin/env python3
"""Build the full-scenario Word documents.

* ``Сценарий_с_помеченными_ошибками.docx`` - original text, confirmed errors red,
  with a suggested correction in red brackets.
* ``Сценарий_исправленный.docx`` - the same text with only those grammar fixes.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = Path(r"G:\NewWorkNovel\docs\script")
ORIGINAL = SCRIPT / "scenario_original.json"
CORRECTED = SCRIPT / "scenario.json"
RED = RGBColor(0xC0, 0x00, 0x00)
GRAY = RGBColor(0x70, 0x70, 0x70)
BLUE = RGBColor(0x1F, 0x4E, 0x79)

FIXES = [
    ("Как-будто", "Как будто", "Сложный союз «как будто» пишется раздельно"),
    ("Не смотря на", "Несмотря на", "Предлог «несмотря на» пишется слитно"),
    ("почвувствовал", "почувствовал", "Опечатка: пропущена буква «о»"),
    ("столкнулсь", "столкнулся", "Опечатка: пропущена буква «я»"),
    ("Не верно.", "Неверно.", "Наречие «неверно» пишется слитно"),
    ("этого не достаточно", "этого недостаточно", "Наречие «недостаточно» пишется слитно"),
    ("своей дрогой", "своей дорогой", "Опечатка: правильное слово — «дорогой»"),
    ("что бы ты мог", "чтобы ты мог", "Союз «чтобы» пишется слитно"),
    ("пшел вон", "пошел вон", "Опечатка: правильно «пошел»"),
    ("пшла вон", "пошла вон", "Опечатка: правильно «пошла»"),
]


def set_cell_shading(cell, color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color)
    tc_pr.append(shd)


def set_repeat_table_header(row) -> None:
    tr = row._tr
    trPr = tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    tblHeader.set(qn("w:val"), "true")
    trPr.append(tblHeader)


def style_document(doc: Document) -> None:
    section = doc.sections[0]
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.4)
    section.right_margin = Cm(1.8)

    normal = doc.styles["Normal"]
    normal.font.name = "Georgia"
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.15
    rpr = normal.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:eastAsia"), "Georgia")
    rfonts.set(qn("w:cs"), "Georgia")

    for name, size, color in (("Heading 1", 20, BLUE), ("Heading 2", 14, BLUE), ("Heading 3", 11, GRAY)):
        style = doc.styles[name]
        style.font.name = "Segoe UI"
        style.font.size = Pt(size)
        style.font.color.rgb = color
        style.font.bold = True
        style.paragraph_format.space_before = Pt(14)
        style.paragraph_format.space_after = Pt(6)


def add_title_page(doc: Document, nodes: list[dict], marked: bool) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("ПРИЗРАКИ\nВЕЗЕНБЕРГСКОГО КВАРТАЛА")
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.size = Pt(28)
    run.font.color.rgb = BLUE

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Полный сценарий визуальной новеллы")
    run.font.name = "Segoe UI"
    run.font.size = Pt(15)
    run.font.color.rgb = GRAY

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Версия 2.0 · 2026")
    run.font.name = "Segoe UI"
    run.font.size = Pt(11)
    run.font.color.rgb = GRAY

    doc.add_paragraph()
    if marked:
        text = (
            "В этом документе собран весь текст сценария: пять серий, все ветки, "
            "меню и три финала. Орфографические и грамматические ошибки выделены "
            "красным; в красных квадратных скобках указано предлагаемое исправление. "
            "Сюжет, реплики и порядок сцен не изменялись."
        )
    else:
        text = (
            "В этом документе собран весь текст сценария после внесения только "
            "орфографических и грамматических исправлений. Сюжет, реплики и порядок "
            "сцен не изменялись."
        )
    p = doc.add_paragraph(text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    say_count = sum(1 for node in nodes if node["type"] == "say")
    option_count = sum(1 for node in nodes if node["type"] == "option")
    label_count = sum(1 for node in nodes if node["type"] == "label")
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = "Light Grid Accent 1"
    hdr = table.rows[0].cells
    for cell, value in zip(hdr, ("Серий", "Меток", "Реплик", "Вариантов")):
        cell.text = value
        for run in cell.paragraphs[0].runs:
            run.bold = True
    row = table.add_row().cells
    for cell, value in zip(row, ("5", str(label_count), str(say_count), str(option_count))):
        cell.text = value

    doc.add_paragraph()
    p = doc.add_paragraph()
    run = p.add_run("Условные обозначения")
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.color.rgb = BLUE
    p = doc.add_paragraph()
    run = p.add_run("Красный текст")
    run.font.color.rgb = RED
    run.bold = True
    p.add_run(" — найденная ошибка. ")
    run = p.add_run("[→ исправление]")
    run.font.color.rgb = RED
    run.italic = True
    p.add_run(" — предлагаемая правка.")
    p = doc.add_paragraph()
    run = p.add_run("Серый текст")
    run.font.color.rgb = GRAY
    p.add_run(" — служебная метка сцены (label), не часть повествования.")
    p = doc.add_paragraph()
    run = p.add_run("Синий текст")
    run.font.color.rgb = BLUE
    p.add_run(" — заголовки серий и варианты выбора.")
    doc.add_page_break()


def find_matches(text: str) -> list[dict]:
    matches: list[dict] = []
    for old, new, note in FIXES:
        start = 0
        while True:
            index = text.find(old, start)
            if index < 0:
                break
            matches.append({
                "start": index,
                "end": index + len(old),
                "old": old,
                "new": new,
                "note": note,
            })
            start = index + len(old)
    matches.sort(key=lambda item: (item["start"], -(item["end"] - item["start"])))
    # Drop overlaps, keeping the first (longest at same start).
    result = []
    last_end = -1
    for item in matches:
        if item["start"] >= last_end:
            result.append(item)
            last_end = item["end"]
    return result


def add_marked_text(paragraph, text: str) -> list[dict]:
    matches = find_matches(text)
    position = 0
    for item in matches:
        if item["start"] > position:
            paragraph.add_run(text[position:item["start"]])
        run = paragraph.add_run(text[item["start"]:item["end"]])
        run.font.color.rgb = RED
        run.bold = True
        correction = paragraph.add_run(f" [→ {item['new']}]")
        correction.font.color.rgb = RED
        correction.italic = True
        position = item["end"]
    if position < len(text):
        paragraph.add_run(text[position:])
    return matches


def add_corrected_text(paragraph, text: str) -> None:
    for old, new, _ in FIXES:
        text = text.replace(old, new)
    paragraph.add_run(text)


def build(marked: bool, output: Path) -> tuple[int, list[dict]]:
    nodes = json.loads((ORIGINAL if marked else CORRECTED).read_text(encoding="utf-8"))
    doc = Document()
    style_document(doc)
    add_title_page(doc, nodes, marked)

    chapter = ""
    label = ""
    current_h2 = None
    error_rows: list[dict] = []
    error_number = 0

    for node in nodes:
        kind = node["type"]
        if kind == "chapter":
            chapter = node["text"]
            doc.add_heading(chapter, level=1)
            current_h2 = None
            label = ""
        elif kind == "label":
            label = node["text"]
            if label not in {"splashscreen", "start"}:
                p = doc.add_paragraph()
                run = p.add_run(f"label {label}")
                run.font.name = "Consolas"
                run.font.size = Pt(8)
                run.font.color.rgb = GRAY
        elif kind == "menu_start":
            p = doc.add_paragraph()
            run = p.add_run("ВЫБОР")
            run.bold = True
            run.font.color.rgb = BLUE
            run.font.name = "Segoe UI"
            run.font.size = Pt(9)
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
        elif kind == "prompt":
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.5)
            if marked:
                matches = add_marked_text(p, node["text"])
            else:
                add_corrected_text(p, node["text"])
                matches = []
            p.runs[0].italic = True if p.runs else False
            for item in matches:
                error_number += 1
                error_rows.append({
                    "number": error_number,
                    "chapter": chapter,
                    "label": label,
                    "old": item["old"],
                    "new": item["new"],
                    "note": item["note"],
                })
        elif kind == "option":
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.left_indent = Cm(0.9)
            if marked:
                matches = add_marked_text(p, node["text"])
            else:
                add_corrected_text(p, node["text"])
                matches = []
            for run in p.runs:
                run.font.color.rgb = BLUE
            for item in matches:
                error_number += 1
                error_rows.append({
                    "number": error_number,
                    "chapter": chapter,
                    "label": label,
                    "old": item["old"],
                    "new": item["new"],
                    "note": item["note"],
                })
        elif kind == "say":
            p = doc.add_paragraph()
            p.paragraph_format.first_line_indent = Cm(0.0)
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            if node.get("speaker"):
                run = p.add_run(f"{node['speaker']}: ")
                run.bold = True
                run.font.color.rgb = BLUE
            if marked:
                matches = add_marked_text(p, node["text"])
            else:
                add_corrected_text(p, node["text"])
                matches = []
            for item in matches:
                error_number += 1
                error_rows.append({
                    "number": error_number,
                    "chapter": chapter,
                    "label": label,
                    "old": item["old"],
                    "new": item["new"],
                    "note": item["note"],
                })

    if marked:
        doc.add_page_break()
        doc.add_heading("Сводка исправлений", level=1)
        p = doc.add_paragraph(
            "Ниже перечислены только подтверждённые орфографические и грамматические "
            "исправления. Смысл реплик не менялся."
        )
        table = doc.add_table(rows=1, cols=5)
        table.style = "Light Grid Accent 1"
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        headers = ("№", "Серия", "Было", "Стало", "Комментарий")
        for cell, value in zip(table.rows[0].cells, headers):
            cell.text = value
            for run in cell.paragraphs[0].runs:
                run.bold = True
        set_repeat_table_header(table.rows[0])
        for row_data in error_rows:
            cells = table.add_row().cells
            values = (
                str(row_data["number"]),
                row_data["chapter"],
                row_data["old"],
                row_data["new"],
                row_data["note"],
            )
            for cell, value in zip(cells, values):
                cell.text = value
        doc.add_paragraph()
        p = doc.add_paragraph(
            "Полный список автоматических замечаний LanguageTool (включая стилистические "
            "и спорные) сохранён в файлах grammar_report.csv и grammar_summary.md. "
            "Они не вносились в текст автоматически, чтобы не менять авторский стиль."
        )
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = GRAY

    doc.save(output)
    return error_number, error_rows


def main() -> int:
    marked_path = SCRIPT / "Сценарий_с_помеченными_ошибками.docx"
    clean_path = SCRIPT / "Сценарий_исправленный.docx"
    count, rows = build(True, marked_path)
    build(False, clean_path)
    print(f"marked errors: {count}")
    print(f"written: {marked_path}")
    print(f"written: {clean_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
