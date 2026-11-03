import hashlib
import shutil
from pathlib import Path

DIST = Path(r"G:\Work_Novela\dist")
TRASH = Path(r"G:\_TRASH\2026-11-03\Work_Novela\_bad_build")
TRASH.mkdir(parents=True, exist_ok=True)

# Keep one canonical APK and one canonical Windows archive.
old_apk = DIST / "android" / "GhostsOfWesenberg-2.0.0.apk"
new_apks = sorted((DIST / "android").glob("ru.wezenberg.ghosts-*-release.apk"), key=lambda p: p.stat().st_mtime)
if new_apks:
    newest = new_apks[-1]
    if old_apk.exists():
        shutil.move(str(old_apk), str(TRASH / old_apk.name))
    shutil.move(str(newest), str(old_apk))

old_win = DIST / "windows" / "GhostsOfWesenberg-2.0.0-win.zip"
new_win = DIST / "windows" / "GhostsOfWesenberg-win.zip"
if new_win.exists():
    if old_win.exists():
        shutil.move(str(old_win), str(TRASH / old_win.name))
    shutil.move(str(new_win), str(old_win))

old_log = DIST / "windows" / "GhostsOfWesenberg-win" / "log.txt"
if old_log.exists():
    old_log.unlink()

items = [
    ("GhostsOfWesenberg-2.0.0-web.zip", DIST / "GhostsOfWesenberg-2.0.0-web.zip"),
    (r"windows\GhostsOfWesenberg-2.0.0-win.zip", DIST / "windows" / "GhostsOfWesenberg-2.0.0-win.zip"),
    (r"android\GhostsOfWesenberg-2.0.0.apk", DIST / "android" / "GhostsOfWesenberg-2.0.0.apk"),
    (r"windows\GhostsOfWesenberg-win\GhostsOfWesenberg.exe", DIST / "windows" / "GhostsOfWesenberg-win" / "GhostsOfWesenberg.exe"),
]
lines = []
for rel, path in items:
    h = hashlib.sha256(path.read_bytes()).hexdigest()
    lines.append(f"{h}  {rel}")
    print(rel, path.stat().st_size, h)
(DIST / "SHA256SUMS.txt").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
print("sums written")
