#!/usr/bin/env python3
"""Render five UI concept boards for the visual novel.

Each board shows the same three moments in a different visual style:
main menu, dialogue and choice. The images are design mockups, not the final UI.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(r"G:\Work_Novela")
OUT = Path(r"G:\NewWorkNovel\ui_concepts")
FONTS = Path(r"C:\Windows\Fonts")

W, H = 1600, 1000
M = 32
HEAD = 108
MAIN_W = 980
SIDE_W = W - (M * 2) - MAIN_W - 20
DIALOG_BOX = (M, HEAD, M + MAIN_W, 760)
CHOICE_BOX = (M, 780, M + MAIN_W, 968)
MENU_BOX = (M + MAIN_W + 20, HEAD, W - M, 968)

TITLE_ART = ROOT / "game" / "images" / "ui" / "main_menu.webp"
LIBRARY = ROOT / "game" / "images" / "backgrounds" / "ch02" / "1.webp"
STREET = ROOT / "game" / "images" / "backgrounds" / "ch01" / "3.webp"
GHOST = ROOT / "game" / "images" / "characters" / "ghosts" / "ht1.webp"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(image.convert("RGB"), size, Image.Resampling.LANCZOS)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if draw.textlength(candidate, font=fnt) <= width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def text_block(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    box: tuple[int, int, int, int],
    spacing: int = 8,
    align: str = "left",
) -> int:
    x1, y1, x2, y2 = box
    lines = wrap(draw, text, fnt, x2 - x1)
    y = y1
    for line in lines:
        tw = draw.textlength(line, font=fnt)
        x = x1 if align == "left" else x1 + (x2 - x1 - tw) / 2
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + spacing
    return y


def rounded(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paste_sprite(canvas: Image.Image, path: Path, box: tuple[int, int, int, int]) -> None:
    sprite = Image.open(path).convert("RGBA")
    sprite = ImageOps.contain(sprite, (box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    x = box[2] - sprite.width
    y = box[3] - sprite.height
    canvas.alpha_composite(sprite, (x, y))


def base_header(canvas: Image.Image, draw: ImageDraw.ImageDraw, number: int, name: str, desc: str, accent, text_color):
    draw.text((M, 20), f"ВАРИАНТ {number:02d}", font=font("segoeuib.ttf", 18), fill=accent)
    draw.text((M, 44), name, font=font("georgiab.ttf", 36), fill=text_color)
    draw.text((M + 560, 52), desc, font=font("segoeui.ttf", 17), fill=text_color)
    draw.line((M, HEAD - 12, W - M, HEAD - 12), fill=accent, width=2)


def menu_panel(canvas, draw, style):
    x1, y1, x2, y2 = MENU_BOX
    art = Image.open(TITLE_ART)
    art = art.crop((0, 0, art.width, int(art.height * 0.70)))
    bg = cover(art, (x2 - x1, y2 - y1))
    bg = ImageEnhance.Brightness(bg).enhance(style["menu_brightness"])
    canvas.paste(bg, (x1, y1))
    overlay = Image.new("RGBA", (x2 - x1, y2 - y1), style["menu_overlay"])
    canvas.alpha_composite(overlay, (x1, y1))
    if style["blur"]:
        region = canvas.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(1.2))
        canvas.paste(region, (x1, y1))

    draw.text((x1 + 28, y1 + 28), "ПРИЗРАКИ", font=font(style["hfont"], 20), fill=style["accent"])
    draw.text((x1 + 28, y1 + 58), "Везенбергского\nквартала", font=font(style["titlefont"], 34), fill=style.get("menu_text", style["light"]), spacing=6)
    draw.text((x1 + 28, y1 + 160), "Визуальная новелла", font=font(style["font"], 16), fill=style.get("menu_text_muted", style["muted"]))

    if style["border"]:
        draw.rectangle((x1 + 8, y1 + 8, x2 - 8, y2 - 8), outline=style["accent"], width=style["border"])
    buttons = ["Начать", "Продолжить", "Настройки", "Об игре", "Выход"]
    y = y1 + 220
    for i, label in enumerate(buttons):
        bx1, by1, bx2, by2 = x1 + 28, y, x2 - 28, y + 52
        if style["button"] == "solid":
            rounded(draw, (bx1, by1, bx2, by2), style["radius"], fill=style["button_fill"], outline=style["accent"], width=1)
        elif style["button"] == "line":
            draw.rectangle((bx1, by1, bx2, by2), outline=style["accent"], width=2)
        else:
            rounded(draw, (bx1, by1, bx2, by2), style["radius"], fill=style["button_fill"])
        draw.text((bx1 + 18, by1 + 13), label, font=font(style["font"], 20), fill=style.get("button_text", style["light"]))
        y += 62

    draw.text((x1 + 28, y2 - 38), "16+  ·  v2.0.0", font=font(style["font"], 14), fill=style["muted"])


def dialog_panel(canvas, draw, style):
    x1, y1, x2, y2 = DIALOG_BOX
    bg = cover(Image.open(LIBRARY), (x2 - x1, y2 - y1))
    bg = ImageEnhance.Brightness(bg).enhance(style["scene_brightness"])
    bg = ImageEnhance.Color(bg).enhance(style["scene_saturation"])
    canvas.paste(bg, (x1, y1))
    overlay = Image.new("RGBA", (x2 - x1, y2 - y1), style["scene_overlay"])
    canvas.alpha_composite(overlay, (x1, y1))
    if style["blur"]:
        region = canvas.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(0.8))
        canvas.paste(region, (x1, y1))

    paste_sprite(canvas, GHOST, (x1 + 520, y1 + 20, x2 - 10, y2 - 10))

    # Stats pill.
    px, py = x1 + 18, y1 + 18
    rounded(draw, (px, py, px + 330, py + 38), 10, fill=style["stat_fill"], outline=style["accent"], width=1)
    draw.text((px + 12, py + 9), "Призрак 2   ·   Явь 3   ·   Книги 1", font=font(style["font"], 15), fill=style.get("stat_text", style["light"]))

    # Dialogue box.
    db = (x1 + 24, y2 - 220, x2 - 24, y2 - 24)
    if style["dialog_style"] == "paper":
        rounded(draw, db, style["radius"], fill=style["dialog_fill"], outline=style["accent"], width=2)
    elif style["dialog_style"] == "glass":
        rounded(draw, db, style["radius"], fill=style["dialog_fill"], outline=style["accent"], width=1)
    else:
        draw.rectangle(db, fill=style["dialog_fill"], outline=style["accent"], width=2)
    draw.text((db[0] + 24, db[1] + 14), "Климент Аркадьевич", font=font(style["namefont"], 20), fill=style["accent"])
    text_block(
        draw,
        "Ты попал в призрачное междумирье Везенбергского квартала. Здесь время идёт иначе, а старые стены помнят больше, чем кажется.",
        font(style["font"], 21),
        style["text"],
        (db[0] + 24, db[1] + 48, db[2] - 24, db[3] - 14),
        spacing=5,
    )
    draw.text((db[2] - 84, db[3] - 30), "▼", font=font("segoeui.ttf", 15), fill=style["muted"])


def choice_panel(canvas, draw, style):
    x1, y1, x2, y2 = CHOICE_BOX
    bg = cover(Image.open(STREET), (x2 - x1, y2 - y1))
    bg = bg.filter(ImageFilter.GaussianBlur(2.0))
    bg = ImageEnhance.Brightness(bg).enhance(0.45)
    canvas.paste(bg, (x1, y1))
    overlay = Image.new("RGBA", (x2 - x1, y2 - y1), style["choice_overlay"])
    canvas.alpha_composite(overlay, (x1, y1))

    draw.text((x1 + 22, y1 + 15), "Что будем делать?", font=font(style["hfont"], 21), fill=style.get("choice_text", style["light"]))
    labels = ["Войти в библиотеку", "Поговорить с Тимирязевым", "Осмотреть часы"]
    bw = (x2 - x1 - 88) // 3
    for i, label in enumerate(labels):
        bx1 = x1 + 22 + i * (bw + 22)
        by1 = y1 + 58
        bx2, by2 = bx1 + bw, y2 - 22
        if style["button"] == "solid":
            rounded(draw, (bx1, by1, bx2, by2), style["radius"], fill=style["button_fill"], outline=style["accent"], width=1)
        elif style["button"] == "line":
            draw.rectangle((bx1, by1, bx2, by2), outline=style["accent"], width=2)
        else:
            rounded(draw, (bx1, by1, bx2, by2), style["radius"], fill=style["button_fill"])
        lines = wrap(draw, label, font(style["font"], 17), bw - 28)
        ty = by1 + (by2 - by1 - len(lines) * 22) / 2
        for line in lines:
            tw = draw.textlength(line, font=font(style["font"], 17))
            draw.text((bx1 + (bw - tw) / 2, ty), line, font=font(style["font"], 17), fill=style.get("button_text", style["light"]))
            ty += 22


STYLES = [
    {
        "number": 1,
        "name": "Архивный Петербург",
        "desc": "Тёмная академическая палитра, бумага, латунь, серифы.",
        "accent": (200, 169, 107),
        "light": (242, 236, 222),
        "text": (28, 37, 48),
        "muted": (162, 160, 150),
        "hfont": "georgiab.ttf",
        "titlefont": "georgiab.ttf",
        "namefont": "georgiab.ttf",
        "font": "georgia.ttf",
        "radius": 4,
        "border": 2,
        "button": "line",
        "button_fill": (0, 0, 0, 0),
        "dialog_style": "paper",
        "dialog_fill": (232, 223, 200, 245),
        "stat_fill": (15, 23, 32, 210),
        "menu_overlay": (8, 15, 24, 180),
        "scene_overlay": (18, 28, 38, 40),
        "choice_overlay": (10, 16, 24, 170),
        "menu_brightness": 0.55,
        "scene_brightness": 0.9,
        "scene_saturation": 0.75,
        "blur": False,
    },
    {
        "number": 2,
        "name": "Модерн Обводного",
        "desc": "Бордо, золото, плавные линии и театральная подача.",
        "accent": (221, 177, 102),
        "light": (249, 235, 211),
        "text": (249, 235, 211),
        "muted": (190, 158, 130),
        "hfont": "georgiai.ttf",
        "titlefont": "georgiai.ttf",
        "namefont": "georgiai.ttf",
        "font": "georgia.ttf",
        "radius": 24,
        "border": 2,
        "button": "line",
        "button_fill": (0, 0, 0, 0),
        "dialog_style": "glass",
        "dialog_fill": (36, 12, 22, 225),
        "stat_fill": (30, 9, 18, 220),
        "menu_overlay": (38, 9, 19, 185),
        "scene_overlay": (48, 12, 28, 70),
        "choice_overlay": (34, 8, 18, 185),
        "menu_brightness": 0.5,
        "scene_brightness": 0.8,
        "scene_saturation": 0.7,
        "blur": False,
    },
    {
        "number": 3,
        "name": "Призрачный минимализм",
        "desc": "Матовое стекло, холодный циан, чистые формы.",
        "accent": (143, 227, 255),
        "light": (244, 250, 255),
        "text": (244, 250, 255),
        "muted": (164, 190, 207),
        "hfont": "segoeuib.ttf",
        "titlefont": "segoeuil.ttf",
        "namefont": "segoeuib.ttf",
        "font": "segoeui.ttf",
        "radius": 26,
        "border": 0,
        "button": "glass",
        "button_fill": (12, 26, 42, 210),
        "button_text": (244, 250, 255),
        "dialog_style": "glass",
        "dialog_fill": (12, 24, 38, 210),
        "stat_fill": (12, 24, 38, 180),
        "menu_overlay": (7, 13, 24, 150),
        "scene_overlay": (7, 18, 30, 45),
        "choice_overlay": (7, 13, 24, 160),
        "menu_brightness": 0.5,
        "scene_brightness": 0.85,
        "scene_saturation": 0.85,
        "blur": True,
    },
    {
        "number": 4,
        "name": "Газетный нуар",
        "desc": "Чёрно-кремовая редакция, красный акцент, плотная типографика.",
        "accent": (214, 69, 61),
        "light": (242, 238, 229),
        "text": (20, 20, 20),
        "muted": (150, 145, 135),
        "hfont": "impact.ttf",
        "titlefont": "impact.ttf",
        "namefont": "segoeuib.ttf",
        "font": "georgia.ttf",
        "radius": 0,
        "border": 3,
        "button": "solid",
        "button_fill": (214, 69, 61, 255),
        "dialog_style": "paper",
        "dialog_fill": (242, 238, 229, 250),
        "stat_fill": (10, 10, 10, 220),
        "menu_overlay": (8, 8, 8, 185),
        "scene_overlay": (10, 10, 10, 70),
        "choice_overlay": (8, 8, 8, 180),
        "menu_brightness": 0.4,
        "scene_brightness": 0.7,
        "scene_saturation": 0.5,
        "blur": False,
    },
    {
        "number": 5,
        "name": "Акварельный квартал",
        "desc": "Светлая бумага, приглушённая акварель, мягкие рамки.",
        "accent": (63, 111, 107),
        "light": (247, 242, 232),
        "text": (47, 62, 66),
        "muted": (96, 112, 109),
        "hfont": "constantia.ttf" if (FONTS / "constantia.ttf").exists() else "georgia.ttf",
        "titlefont": "constantia.ttf" if (FONTS / "constantia.ttf").exists() else "georgia.ttf",
        "namefont": "georgiab.ttf",
        "font": "georgia.ttf",
        "radius": 18,
        "border": 2,
        "button": "paper",
        "button_fill": (247, 242, 232, 245),
        "button_text": (47, 62, 66),
        "stat_text": (47, 62, 66),
        "menu_text": (47, 62, 66),
        "menu_text_muted": (55, 72, 70),
        "choice_text": (47, 62, 66),
        "dialog_style": "paper",
        "dialog_fill": (247, 242, 232, 245),
        "stat_fill": (247, 242, 232, 210),
        "menu_overlay": (247, 242, 232, 165),
        "scene_overlay": (247, 242, 232, 30),
        "choice_overlay": (247, 242, 232, 120),
        "menu_brightness": 1.0,
        "scene_brightness": 1.05,
        "scene_saturation": 0.55,
        "blur": False,
    },
]


def draw_board(style: dict) -> Image.Image:
    canvas = Image.new("RGBA", (W, H), (10, 15, 23, 255))
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.rectangle((0, 0, W, H), fill=(8, 13, 21, 255))
    base_header(canvas, draw, style["number"], style["name"], style["desc"], style["accent"], style["light"])
    menu_panel(canvas, draw, style)
    dialog_panel(canvas, draw, style)
    choice_panel(canvas, draw, style)

    # Style-specific finishing touches.
    if style["number"] == 1:
        draw.rectangle((M + 6, HEAD + 6, MENU_BOX[2] - 6, CHOICE_BOX[3] - 6), outline=(200, 169, 107, 90), width=1)
    elif style["number"] == 2:
        for box in (DIALOG_BOX, CHOICE_BOX, MENU_BOX):
            draw.arc((box[0] + 10, box[1] + 10, box[0] + 110, box[1] + 110), 180, 270, fill=style["accent"], width=2)
            draw.arc((box[2] - 110, box[3] - 110, box[2] - 10, box[3] - 10), 0, 90, fill=style["accent"], width=2)
    elif style["number"] == 3:
        draw.line((M, HEAD - 12, W - M, HEAD - 12), fill=(143, 227, 255, 160), width=2)
    elif style["number"] == 4:
        draw.rectangle((M, HEAD, W - M, CHOICE_BOX[3]), outline=(214, 69, 61, 200), width=4)
        draw.line((M, HEAD + 70, W - M, HEAD + 70), fill=(242, 238, 229, 80), width=1)
    elif style["number"] == 5:
        for box in (DIALOG_BOX, CHOICE_BOX, MENU_BOX):
            draw.rounded_rectangle((box[0] - 4, box[1] - 4, box[2] + 4, box[3] + 4), radius=22, outline=(63, 111, 107, 110), width=2)

    return canvas.convert("RGB")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for style in STYLES:
        image = draw_board(style)
        name = f"style_{style['number']:02d}.png"
        image.save(OUT / name, optimize=True)
        print(OUT / name)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

