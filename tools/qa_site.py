import json
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUT = Path(r"G:\NewWorkNovel\docs\audit")
BASE = "http://127.0.0.1:8781"
OUT.mkdir(parents=True, exist_ok=True)


def driver(width, height, mobile=False):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--hide-scrollbars")
    options.add_argument("--window-size=%d,%d" % (width, height))
    options.add_argument("--autoplay-policy=no-user-gesture-required")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    d = webdriver.Chrome(options=options)
    d.execute_cdp_cmd(
        "Emulation.setDeviceMetricsOverride",
        {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": mobile},
    )
    return d


results = {}
for label, width, height, mobile, path in (
    ("landing_desktop", 1440, 900, False, "/"),
    ("landing_mobile", 390, 844, True, "/"),
    ("concepts_desktop", 1440, 900, False, "/concepts/"),
):
    d = driver(width, height, mobile)
    try:
        d.get(BASE + path)
        time.sleep(2)
        d.save_screenshot(str(OUT / f"site_{label}.png"))
        logs = d.get_log("browser")
        results[label] = {
            "title": d.title,
            "errors": [x for x in logs if x["level"] in ("SEVERE", "ERROR")],
            "scrollWidth": d.execute_script("return document.documentElement.scrollWidth"),
            "innerWidth": d.execute_script("return innerWidth"),
        }
    finally:
        d.quit()

# Game page: wait for canvas, screenshot menu, ensure no "Серии" text in DOM is impossible (canvas),
# but we can verify the build script removed the button and capture the menu for visual inspection.
d = driver(1280, 720, False)
try:
    d.get(BASE + "/play/")
    deadline = time.time() + 90
    state = None
    while time.time() < deadline:
        state = d.execute_script(
            "const c=document.querySelector('canvas');"
            "return c ? {w:c.width,h:c.height,title:document.title} : null;"
        )
        if state and state["w"] >= 1000:
            break
        time.sleep(1)
    time.sleep(6)
    d.save_screenshot(str(OUT / "site_play_menu.png"))
    logs = d.get_log("browser")
    results["play"] = {
        "state": state,
        "errors": [x for x in logs if x["level"] in ("SEVERE", "ERROR")],
    }
finally:
    d.quit()

print(json.dumps(results, ensure_ascii=False, indent=2))
