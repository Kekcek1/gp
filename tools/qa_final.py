import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

OUT = Path(r"G:\NewWorkNovel\docs\audit")
URL = "http://127.0.0.1:8783/"
cur = [0, 0]


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


def shot(d, name):
    d.save_screenshot(str(OUT / name))
    print("saved", name)


def click(d, x, y):
    global cur
    dx, dy = x - cur[0], y - cur[1]
    ActionChains(d).move_by_offset(dx, dy).click().perform()
    cur = [x, y]


# Desktop: menu, settings, dialogue, in-game menu.
d = make_driver(1280, 720)
d.get(URL)
time.sleep(42)
shot(d, "theme_final_menu_desktop.png")
click(d, 990, 464)
time.sleep(4)
shot(d, "theme_final_settings.png")
click(d, 100, 669)
time.sleep(3)
click(d, 990, 349)
time.sleep(18)
shot(d, "theme_final_dialogue.png")
ActionChains(d).send_keys(Keys.ESCAPE).perform()
time.sleep(3)
shot(d, "theme_final_game_menu.png")
errors = [x for x in d.get_log("browser") if x.get("level") == "SEVERE"]
print("desktop severe errors:", len(errors))
d.quit()

# Mobile landscape: compact main menu.
cur = [0, 0]
d = make_driver(844, 390, True)
d.get(URL)
time.sleep(42)
shot(d, "theme_final_menu_mobile.png")
errors = [x for x in d.get_log("browser") if x.get("level") == "SEVERE"]
print("mobile severe errors:", len(errors))
d.quit()

# Mobile portrait: rotation hint.
cur = [0, 0]
d = make_driver(390, 844, True)
d.get(URL)
time.sleep(10)
shot(d, "theme_final_portrait.png")
d.quit()
