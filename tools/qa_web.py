#!/usr/bin/env python3
"""Browser QA for the built web version (canvas-based Ren'Py UI)."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(r"G:\NewWorkNovel\docs\audit")
URL = "http://127.0.0.1:8765/index.html"


def make_driver(width: int, height: int):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--hide-scrollbars")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--autoplay-policy=no-user-gesture-required")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    return webdriver.Chrome(options=options)


def wait_game(driver, timeout: float = 45.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        state = driver.execute_script(
            "const c=document.querySelector('canvas');"
            "return c ? {w:c.width,h:c.height,rect:c.getBoundingClientRect().toJSON(),iw:innerWidth,ih:innerHeight,dpr:devicePixelRatio} : null;"
        )
        if state and state["w"] > 0:
            time.sleep(1.0)
            return
        time.sleep(0.5)
    raise RuntimeError("Canvas did not appear")


def click_canvas(driver, vx: int, vy: int) -> None:
    canvas = driver.find_element("css selector", "canvas")
    rect = canvas.rect
    x = vx * rect["width"] / 1280
    y = vy * rect["height"] / 720
    ActionChains(driver).move_to_element_with_offset(
        canvas, x - rect["width"] / 2, y - rect["height"] / 2
    ).pause(0.4).click().perform()


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    results = {}
    for label, width, height in (
        ("desktop_1280x720", 1280, 720),
        ("mobile_landscape_844x390", 844, 390),
        ("mobile_portrait_390x844", 390, 844),
    ):
        driver = make_driver(width, height)
        try:
            driver.execute_cdp_cmd(
                "Emulation.setDeviceMetricsOverride",
                {
                    "width": width,
                    "height": height,
                    "deviceScaleFactor": 1,
                    "mobile": label.startswith("mobile"),
                },
            )
            driver.get(URL)
            wait_game(driver)
            time.sleep(3.0)
            state = driver.execute_script(
                "const c=document.querySelector('canvas');"
                "const r=document.getElementById('rotate-overlay');"
                "return {canvas:{w:c.width,h:c.height,rect:c.getBoundingClientRect().toJSON()},"
                "inner:[innerWidth,innerHeight],dpr:devicePixelRatio,title:document.title,"
                "rotate:r?getComputedStyle(r).display:null};"
            )
            path = OUT / f"web_{label}.png"
            driver.save_screenshot(str(path))
            logs = driver.get_log("browser")
            errors = [entry for entry in logs if entry["level"] in ("SEVERE", "ERROR")]
            results[label] = {"state": state, "screenshot": str(path), "errors": errors}
            print(label, json.dumps(state, ensure_ascii=False))
            if label == "desktop_1280x720":
                # Main menu -> "Серии" (actual canvas pixels on 1280x720).
                click_canvas(driver, 95, 410)
                time.sleep(2.5)
                series_path = OUT / "web_series_gallery_1280x720.png"
                driver.save_screenshot(str(series_path))
                results["series_gallery"] = {
                    "screenshot": str(series_path),
                    "errors": [entry for entry in driver.get_log("browser") if entry["level"] in ("SEVERE", "ERROR")],
                }
                print("series gallery", series_path)
        finally:
            driver.quit()
    (OUT / "web_qa.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
