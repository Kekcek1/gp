#!/usr/bin/env python3
"""One-command build helper for Work_Novela."""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SDK = Path(r"G:\programs\renpy-8.5.0-sdk")
RENPY = SDK / "renpy.exe"
LAUNCHER = SDK / "launcher"


def run(args: list[str]) -> None:
    print(">", " ".join(str(x) for x in args))
    subprocess.run(args, cwd=ROOT, check=True)


def lint() -> None:
    run([str(RENPY), str(ROOT), "lint"])


def verify() -> None:
    run([sys.executable, str(ROOT / "tools" / "verify_story.py")])


def web() -> None:
    out = ROOT / "dist" / "web"
    if out.exists():
        shutil.rmtree(out)
    run([
        str(RENPY), str(LAUNCHER), "web_build", str(ROOT),
        "--destination", str(out),
    ])
    run([sys.executable, str(ROOT / "tools" / "postprocess_web.py")])
    stale = ROOT / "dist" / "web.zip"
    if stale.exists():
        stale.unlink()
    archive = ROOT / "dist" / "GhostsOfWesenberg-2.0.0-web.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for path in out.rglob("*"):
            if path.is_file():
                z.write(path, path.relative_to(out).as_posix())
    print(f"Web build: {archive}")


def windows() -> None:
    out = ROOT / "dist" / "windows"
    out.mkdir(parents=True, exist_ok=True)
    run([
        str(RENPY), str(LAUNCHER), "distribute", str(ROOT),
        "--destination", str(out), "--package", "win",
    ])
    zips = sorted(out.glob("*-win.zip"), key=lambda p: p.stat().st_mtime, reverse=True)
    if zips:
        with zipfile.ZipFile(zips[0]) as archive:
            archive.extractall(out)
        print(f"Windows build: {out}")


def android() -> None:
    out = ROOT / "dist" / "android"
    out.mkdir(parents=True, exist_ok=True)
    run([
        str(RENPY), str(LAUNCHER), "android_build", str(ROOT),
        "--destination", str(out),
    ])
    print(f"Android build: {out}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Work_Novela")
    parser.add_argument("--lint", action="store_true", help="run Ren'Py lint")
    parser.add_argument("--verify", action="store_true", help="verify story integrity")
    parser.add_argument("--web", action="store_true", help="build web/PWA")
    parser.add_argument("--windows", action="store_true", help="build Windows EXE zip")
    parser.add_argument("--android", action="store_true", help="build Android APK")
    parser.add_argument("--all", action="store_true", help="lint + verify + web + windows + android")
    args = parser.parse_args()
    if not any(vars(args).values()):
        parser.print_help()
        return 0
    if args.all:
        args.lint = args.verify = args.web = args.windows = args.android = True
    if args.lint:
        lint()
    if args.verify:
        verify()
    if args.web or args.windows or args.android:
        run([sys.executable, str(ROOT / "tools" / "make_icons.py")])
    if args.web:
        web()
    if args.windows:
        windows()
    if args.android:
        android()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
