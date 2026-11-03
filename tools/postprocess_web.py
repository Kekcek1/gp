#!/usr/bin/env python3
"""Inject a mobile rotation hint and small PWA polish into a Ren'Py web build."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "dist" / "web" / "index.html"
WEB_ICON = ROOT / "web-icon.png"
WEB_ICONS = ROOT / "dist" / "web" / "icons"

STYLE = """
    <style id="work-novela-responsive">
      html, body { background: #070b14; }
      #canvas { touch-action: none; }
      #rotate-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 99999;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #f2f7ff;
        background: radial-gradient(circle at 50% 35%, #162948 0%, #070b14 72%);
        font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        padding: 24px;
      }
      #rotate-overlay .card {
        max-width: 440px;
        padding: 28px 24px;
        border: 1px solid #2c4b74;
        border-radius: 20px;
        background: rgba(9, 18, 33, 0.88);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
      }
      #rotate-overlay .phone {
        width: 58px;
        height: 100px;
        margin: 0 auto 18px;
        border: 3px solid #9fd8ff;
        border-radius: 12px;
        transform: rotate(90deg);
        animation: rotate-hint 2.2s ease-in-out infinite;
      }
      #rotate-overlay h1 {
        margin: 0 0 8px;
        font-size: 24px;
        font-weight: 650;
        letter-spacing: 0.2px;
      }
      #rotate-overlay p {
        margin: 0;
        color: #b9c9de;
        font-size: 15px;
        line-height: 1.45;
      }
      @keyframes rotate-hint {
        0%, 20% { transform: rotate(90deg); }
        55%, 100% { transform: rotate(0deg); }
      }
      @media (orientation: portrait) and (max-width: 1100px) {
        #rotate-overlay { display: flex; }
      }
    </style>
"""

OVERLAY = """
  <div id="rotate-overlay" role="status" aria-live="polite">
    <div class="card">
      <div class="phone" aria-hidden="true"></div>
      <h1>Поверните устройство</h1>
      <p>Игра рассчитана на горизонтальный экран. Поверните телефон или планшет, чтобы интерфейс и текст были крупными и читаемыми.</p>
    </div>
  </div>
"""


def generate_icons() -> None:
    if not WEB_ICON.exists():
        return
    WEB_ICONS.mkdir(parents=True, exist_ok=True)
    source = Image.open(WEB_ICON).convert("RGB")
    sizes = (72, 96, 128, 144, 152, 192, 384, 512)
    for size in sizes:
        icon = source.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(WEB_ICONS / f"icon-{size}x{size}.png", optimize=True)
    # Maskable icons: 80% safe area on a dark background.
    bg = Image.new("RGB", (512, 512), (7, 11, 20))
    inner = source.resize((410, 410), Image.Resampling.LANCZOS)
    bg.paste(inner, (51, 51))
    for size in sizes:
        icon = bg.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(WEB_ICONS / f"icon-{size}x{size}-maskable.png", optimize=True)
    print(f"icons regenerated: {len(sizes) * 2}")


def update_manifest() -> None:
    manifest_path = ROOT / "dist" / "web" / "manifest.json"
    if not manifest_path.exists():
        return
    import json

    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    data.update({
        "name": "Призраки Везенбергского квартала",
        "short_name": "Призраки",
        "description": "Визуальная новелла о призраках Везенбергского квартала.",
        "lang": "ru",
        "background_color": "#070b14",
        "theme_color": "#070b14",
        "orientation": "landscape",
    })
    manifest_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("manifest updated")


def main() -> int:
    if not INDEX.exists():
        print(f"Not found: {INDEX}")
        return 1
    text = INDEX.read_text(encoding="utf-8")
    if "work-novela-responsive" in text:
        print("already processed")
        generate_icons()
        update_manifest()
        return 0
    text = text.replace('<html lang="en-us">', '<html lang="ru">')
    text = text.replace(
        '<meta name="theme-color" content="#000" />',
        '<meta name="theme-color" content="#070b14" />\n'
        '  <meta name="apple-mobile-web-app-capable" content="yes" />\n'
        '  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n'
        '  <meta name="mobile-web-app-capable" content="yes" />',
    )
    text = text.replace("</head>", STYLE + "</head>")
    text = text.replace("</body>", OVERLAY + "</body>")
    INDEX.write_text(text, encoding="utf-8")
    generate_icons()
    update_manifest()
    print(f"processed: {INDEX}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
