import json
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUT = Path(r"G:\NewWorkNovel\docs\audit\github_pages.png")
URL = "https://kekcek1.github.io/gp/"

options = Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--hide-scrollbars")
options.add_argument("--window-size=1280,720")
options.add_argument("--autoplay-policy=no-user-gesture-required")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
driver = webdriver.Chrome(options=options)
try:
    driver.execute_cdp_cmd(
        "Emulation.setDeviceMetricsOverride",
        {"width": 1280, "height": 720, "deviceScaleFactor": 1, "mobile": False},
    )
    driver.get(URL)
    deadline = time.time() + 90
    state = None
    while time.time() < deadline:
        state = driver.execute_script(
            "const c=document.querySelector('canvas');"
            "return c ? {w:c.width,h:c.height,title:document.title,rotate:getComputedStyle(document.getElementById('rotate-overlay')).display} : null;"
        )
        if state and state["w"] > 0:
            break
        time.sleep(1)
    time.sleep(8)
    driver.save_screenshot(str(OUT))
    logs = driver.get_log("browser")
    errors = [entry for entry in logs if entry["level"] in ("SEVERE", "ERROR")]
    print(json.dumps({"url": URL, "state": state, "errors": errors, "screenshot": str(OUT)}, ensure_ascii=False, indent=2))
finally:
    driver.quit()
