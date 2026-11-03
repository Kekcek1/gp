import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUT = Path(r"G:\NewWorkNovel\docs\audit")
BASE = "http://127.0.0.1:8784"


def make_driver(width, height, mobile=False, dsf=1):
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--hide-scrollbars")
    opts.add_argument(f"--window-size={width},{height}")
    opts.add_argument("--autoplay-policy=no-user-gesture-required")
    opts.add_argument("--disable-application-cache")
    d = webdriver.Chrome(options=opts)
    d.execute_cdp_cmd(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": width,
            "height": height,
            "deviceScaleFactor": dsf,
            "mobile": mobile,
            "screenOrientation": {
                "type": "portraitPrimary" if height > width else "landscapePrimary",
                "angle": 0,
            },
        },
    )
    return d


def check(d, label, name, wait=2):
    d.get(BASE + label)
    time.sleep(wait)
    metrics = d.execute_script(
        "return {sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, body: document.body.scrollWidth};"
    )
    d.save_screenshot(str(OUT / name))
    errors = [x for x in d.get_log("browser") if x.get("level") == "SEVERE"]
    print(name, metrics, "severe:", len(errors))
    for e in errors[:3]:
        print(" ", e.get("message", "")[:200])


for width, height, mobile, suffix in ((1440, 900, False, "desktop"), (390, 844, True, "mobile")):
    d = make_driver(width, height, mobile)
    check(d, "/", f"site2_landing_{suffix}.png")
    check(d, "/concepts/", f"site2_concepts_{suffix}.png")
    d.quit()

d = make_driver(1280, 720, False)
d.get(BASE + "/play/")
time.sleep(42)
d.save_screenshot(str(OUT / "site2_play_menu.png"))
info = d.execute_script(
    "return {canvas: !!document.querySelector('#canvas'), w: document.querySelector('#canvas')?.width, h: document.querySelector('#canvas')?.height, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth};"
)
errors = [x for x in d.get_log("browser") if x.get("level") == "SEVERE"]
print("site2_play_menu.png", info, "severe:", len(errors))
d.quit()
