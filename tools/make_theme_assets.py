#!/usr/bin/env python3
"""Generate glass/cyan GUI assets for the selected interface style."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(r"G:\Work_Novela")
GUI = ROOT / "game" / "gui"

INK = (242, 248, 255)
CYAN = (143, 227, 255)
CYAN_DIM = (90, 170, 205)
DARK = (8, 20, 33)
DARK_2 = (12, 28, 44)


def rounded(size, radius, fill, border=None, width=2, accent_top=False):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((1, 1, size[0] - 2, size[1] - 2), radius=radius, fill=fill, outline=border, width=width)
    if accent_top:
        d.line((radius, 3, size[0] - radius, 3), fill=(CYAN[0], CYAN[1], CYAN[2], 170), width=2)
    return img


def save(img, rel):
    path = GUI / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)


def button(name, fill, border, top=False):
    save(rounded((96, 64), 18, fill, border, 2, top), f"button/{name}_background.png")


def main():
    # Core 9-patch panels.
    save(rounded((96, 96), 22, (10, 24, 40, 224), (143, 216, 255, 110), 2, True), "panel.png")
    save(rounded((96, 96), 22, (10, 24, 40, 236), (143, 216, 255, 150), 2, True), "panel_bright.png")
    save(rounded((96, 96), 22, (8, 19, 32, 230), (143, 216, 255, 80), 1), "frame.png")

    # Nameplate.
    name = Image.new("RGBA", (96, 48), (0, 0, 0, 0))
    d = ImageDraw.Draw(name, "RGBA")
    d.rounded_rectangle((1, 1, 94, 46), radius=14, fill=(15, 40, 58, 238), outline=(143, 227, 255, 190), width=2)
    save(name, "namebox.png")

    # Textbox: full-width glass panel with margins.
    textbox = Image.new("RGBA", (1280, 200), (0, 0, 0, 0))
    d = ImageDraw.Draw(textbox, "RGBA")
    d.rounded_rectangle((36, 14, 1244, 190), radius=24, fill=(8, 20, 34, 232), outline=(143, 216, 255, 120), width=2)
    d.line((64, 18, 1216, 18), fill=(143, 227, 255, 150), width=2)
    d.line((64, 20, 400, 20), fill=(143, 227, 255, 60), width=1)
    save(textbox, "textbox.png")

    # Main menu and game menu panels.
    menu_panel = Image.new("RGBA", (420, 620), (0, 0, 0, 0))
    d = ImageDraw.Draw(menu_panel, "RGBA")
    d.rounded_rectangle((2, 2, 418, 618), radius=30, fill=(7, 18, 31, 228), outline=(143, 216, 255, 110), width=2)
    d.line((40, 6, 380, 6), fill=(143, 227, 255, 150), width=2)
    save(menu_panel, "main_menu_panel.png")

    # Overlays.
    overlay = Image.new("RGBA", (1280, 720), (4, 10, 18, 190))
    d = ImageDraw.Draw(overlay, "RGBA")
    for i in range(30):
        alpha = int(70 * (1 - i / 30))
        d.rounded_rectangle((i * 8, i * 5, 1280 - i * 8, 720 - i * 5), radius=30, outline=(143, 227, 255, alpha), width=1)
    save(overlay, "overlay/game_menu.png")
    save(Image.new("RGBA", (1280, 720), (4, 10, 18, 200)), "overlay/confirm.png")
    save(Image.new("RGBA", (420, 620), (0, 0, 0, 0)), "overlay/main_menu.png")

    # Buttons.
    button("idle", (10, 26, 43, 190), (143, 216, 255, 80))
    button("hover", (18, 48, 72, 230), (143, 227, 255, 220), True)
    button("selected_idle", (18, 48, 72, 220), (143, 227, 255, 200), True)
    button("selected_hover", (25, 66, 95, 240), (200, 245, 255, 255), True)
    button("insensitive", (10, 22, 34, 120), (143, 216, 255, 38))

    button("choice_idle", (11, 30, 50, 224), (143, 216, 255, 105))
    button("choice_hover", (20, 55, 82, 242), (143, 227, 255, 235), True)
    button("choice_insensitive", (10, 22, 34, 130), (143, 216, 255, 45))

    button("quick_idle", (8, 20, 33, 120), (143, 216, 255, 45))
    button("quick_hover", (16, 42, 64, 210), (143, 227, 255, 170))

    button("slot_idle", (9, 23, 38, 210), (143, 216, 255, 70))
    button("slot_hover", (17, 44, 67, 235), (143, 227, 255, 190), True)

    # Check / radio marks.
    for name, selected in (("check_foreground", False), ("check_selected_foreground", True),
                           ("radio_foreground", False), ("radio_selected_foreground", True)):
        img = Image.new("RGBA", (28, 28), (0, 0, 0, 0))
        d = ImageDraw.Draw(img, "RGBA")
        if "radio" in name:
            d.ellipse((5, 5, 23, 23), outline=(143, 216, 255, 180), width=2)
            if selected:
                d.ellipse((10, 10, 18, 18), fill=CYAN)
        else:
            d.rounded_rectangle((5, 5, 23, 23), radius=5, outline=(143, 216, 255, 180), width=2)
            if selected:
                d.line((9, 14, 13, 18, 20, 9), fill=CYAN, width=3)
        save(img, f"button/{name}.png")

    # Bars / sliders / scrollbars.
    def track(size, fill, radius):
        img = Image.new("RGBA", size, (0, 0, 0, 0))
        d = ImageDraw.Draw(img, "RGBA")
        d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill)
        return img

    save(track((64, 16), (10, 30, 47, 220), 8), "bar/left.png")
    save(track((64, 16), (10, 30, 47, 220), 8), "bar/right.png")
    save(track((16, 64), (10, 30, 47, 220), 8), "bar/top.png")
    save(track((16, 64), (10, 30, 47, 220), 8), "bar/bottom.png")

    for state, fill in (("idle", (10, 30, 47, 230)), ("hover", (17, 48, 70, 240))):
        save(track((256, 16), fill, 8), f"slider/horizontal_{state}_bar.png")
        save(track((16, 256), fill, 8), f"slider/vertical_{state}_bar.png")
        thumb = Image.new("RGBA", (30, 30), (0, 0, 0, 0))
        d = ImageDraw.Draw(thumb, "RGBA")
        d.ellipse((3, 3, 27, 27), fill=CYAN if state == "hover" else CYAN_DIM, outline=INK, width=2)
        save(thumb, f"slider/horizontal_{state}_thumb.png")
        save(thumb, f"slider/vertical_{state}_thumb.png")

    for state, fill in (("idle", (10, 30, 47, 210)), ("hover", (18, 52, 76, 240))):
        save(track((14, 64), fill, 7), f"scrollbar/vertical_{state}_bar.png")
        save(track((64, 14), fill, 7), f"scrollbar/horizontal_{state}_bar.png")
        thumb = Image.new("RGBA", (14, 64), (0, 0, 0, 0))
        d = ImageDraw.Draw(thumb, "RGBA")
        d.rounded_rectangle((1, 1, 12, 62), radius=6, fill=(CYAN_DIM if state == "idle" else CYAN))
        save(thumb, f"scrollbar/vertical_{state}_thumb.png")
        thumb_h = Image.new("RGBA", (64, 14), (0, 0, 0, 0))
        d = ImageDraw.Draw(thumb_h, "RGBA")
        d.rounded_rectangle((1, 1, 62, 12), radius=6, fill=(CYAN_DIM if state == "idle" else CYAN))
        save(thumb_h, f"scrollbar/horizontal_{state}_thumb.png")

    # Phone variants: reuse the same assets.
    for folder in ("bar", "button", "scrollbar", "slider"):
        src = GUI / folder
        dst = GUI / "phone" / folder
        dst.mkdir(parents=True, exist_ok=True)
        for path in src.glob("*.png"):
            shutil.copy2(path, dst / path.name)
    print("theme assets generated")


if __name__ == "__main__":
    main()
