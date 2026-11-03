import json
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUT = Path(r"G:\NewWorkNovel\docs\audit")
BASE = "https://kekcek1.github.io/gp"
OUT.mkdir(parents=True, exist_ok=True)


def make(width, height, mobile=False):
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
for label, path, width, height, mobile in (
    ("live_landing_desktop", "/", 1440, 900, False),
    ("live_landing_mobile", "/", 390, 844, True),
    ("live_concepts", "/concepts/", 1440, 900, False),
):
    d = make(width, height, mobile)
    try:
        d.get(BASE + path + "?v=" + str(int(time.time())))
        time.sleep(2)
        d.save_screenshot(str(OUT / f"{label}.png"))
        results[label] = {
            "title": d.title,
            "errors": [x for x in d.get_log("browser") if x["level"] in ("SEVERE", "ERROR")],
            "width": d.execute_script("return [innerWidth, document.documentElement.scrollWidth]"),
        }
    finally:
        d.quit()

d = make(1280, 720, False)
try:
    d.get(BASE + "/play/?v=" + str(int(time.time())))
    deadline = time.time() + 120
    state = None
    while time.time() < deadline:
        state = d.execute_script(
            "const c=document.querySelector('canvas');"
            "const r=document.getElementById('rotate-overlay');"
            "return c ? {w:c.width,h:c.height,title:document.title,rotate:r?getComputedStyle(r).display:null} : null;"
        )
        if state and state["w"] >= 1000:
            break
        time.sleep(1)
    time.sleep(8)
    d.save_screenshot(str(OUT / "live_play_menu.png"))
    results["live_play"] = {
        "state": state,
        "errors": [x for x in d.get_log("browser") if x["level"] in ("SEVERE", "ERROR")],
    }
finally:
    d.quit()

print(json.dumps(results, ensure_ascii=False, indent=2))
