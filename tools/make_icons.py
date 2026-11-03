#!/usr/bin/env python3
"""Generate project icons and presplash art from the main-menu background."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "game" / "images" / "ui" / "main_menu.webp"
OUT = ROOT


def square_art(size: int = 1024) -> Image.Image:
    image = Image.open(ART).convert("RGB")
    width, height = image.size
    # Use the upper part of the artwork: the building without the title lettering.
    side = int(height * 0.72)
    left = int(width * 0.14)
    top = 0
    image = image.crop((left, top, left + side, top + side))
    image = ImageOps.fit(image, (size, size), Image.Resampling.LANCZOS)
    clean = Image.new("RGB", image.size)
    clean.paste(image)
    return clean


def main() -> int:
    art = square_art(1024)
    art.save(OUT / "web-icon.png", optimize=True)

    # Adaptive Android icon: blurred background + round sharp foreground.
    background = art.filter(ImageFilter.GaussianBlur(18)).point(lambda p: int(p * 0.72))
    background = ImageOps.fit(background, (512, 512), Image.Resampling.LANCZOS)
    clean_background = Image.new("RGB", background.size)
    clean_background.paste(background)
    clean_background.save(OUT / "android-icon_background.png", optimize=True)

    foreground = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    sharp = ImageOps.fit(art, (512, 512), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (512, 512), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((16, 16, 496, 496), fill=255)
    foreground.paste(sharp, (0, 0), mask)
    foreground.save(OUT / "android-icon_foreground.png", optimize=True)

    # Windows executable icon.
    sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    art.save(OUT / "icon.ico", sizes=sizes)

    # Presplash: the full title art, 1920x1080.
    presplash = Image.open(ART).convert("RGB")
    presplash = ImageOps.fit(presplash, (1920, 1080), Image.Resampling.LANCZOS)
    presplash.save(OUT / "android-presplash.jpg", quality=90, optimize=True)
    presplash.save(OUT / "web-presplash.jpg", quality=90, optimize=True)

    # A social/README preview.
    preview_dir = Path(r"G:\NewWorkNovel\docs\audit")
    preview_dir.mkdir(parents=True, exist_ok=True)
    art.resize((512, 512), Image.Resampling.LANCZOS).save(preview_dir / "icon_preview.png", optimize=True)

    print("icons and presplash generated")
    for name in ("web-icon.png", "android-icon_background.png", "android-icon_foreground.png",
                 "icon.ico", "android-presplash.jpg", "web-presplash.jpg"):
        path = OUT / name
        print(f"  {name}: {path.stat().st_size / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
