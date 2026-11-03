import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUT = Path(r"G:\NewWorkNovel\docs\audit")
URL = "http://127.0.0.1:8783/"


def make_driver(width, height, mobile, dsf=1):
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


for width, height, mobile, label in (
    (1280, 720, False, "desktop"),
    (844, 390, True, "landscape"),
    (390, 844, True, "portrait"),
):
    d = make_driver(width, height, mobile)
    d.get(URL)
    time.sleep(42)
    d.save_screenshot(str(OUT / f"theme2_{label}.png"))
    print("saved", f"theme2_{label}.png")
    errors = [x for x in d.get_log("browser") if x.get("level") == "SEVERE"]
    print(label, "severe errors:", len(errors))
    for e in errors[:3]:
        print(" ", e.get("message", "")[:200])
    d.quit()
