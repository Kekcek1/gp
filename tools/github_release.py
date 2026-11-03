#!/usr/bin/env python3
"""Create a GitHub release and upload build assets.

The token is read from Windows Credential Manager and is never printed.
"""
from __future__ import annotations

import ctypes
import ctypes.wintypes as wintypes
import json
import sys
from pathlib import Path

import requests

REPO = "Kekcek1/gp"
API = "https://api.github.com"
TAG = "v2.0.0"
NAME = "Призраки Везенбергского квартала 2.0.0"
BODY = """Визуальная новелла «Призраки Везенбергского квартала» 2.0.0.

- Пять серий, 112 сцен, 91 меню, три финала.
- Веб/PWA: https://kekcek1.github.io/gp/play/
- Пять вариантов интерфейса: https://kekcek1.github.io/gp/concepts/
- APK для Android и портативная Windows-сборка.

Сюжет оригинала сохранён; изменена только орфография. Звук по умолчанию 50%.
"""

ASSETS = [
    Path(r"G:\Work_Novela\dist\android\GhostsOfWesenberg-2.0.0.apk"),
    Path(r"G:\Work_Novela\dist\windows\GhostsOfWesenberg-2.0.0-win.zip"),
    Path(r"G:\Work_Novela\dist\GhostsOfWesenberg-2.0.0-web.zip"),
]


class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ("Flags", wintypes.DWORD),
        ("Type", wintypes.DWORD),
        ("TargetName", wintypes.LPWSTR),
        ("Comment", wintypes.LPWSTR),
        ("LastWritten", wintypes.FILETIME),
        ("CredentialBlobSize", wintypes.DWORD),
        ("CredentialBlob", ctypes.POINTER(ctypes.c_byte)),
        ("Persist", wintypes.DWORD),
        ("AttributeCount", wintypes.DWORD),
        ("Attributes", ctypes.c_void_p),
        ("TargetAlias", wintypes.LPWSTR),
        ("UserName", wintypes.LPWSTR),
    ]


def read_credential(target: str):
    CRED_TYPE_GENERIC = 1
    ptr = ctypes.POINTER(CREDENTIAL)()
    ok = ctypes.windll.advapi32.CredReadW(target, CRED_TYPE_GENERIC, 0, ctypes.byref(ptr))
    if not ok:
        return None, None
    try:
        cred = ptr.contents
        raw = ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize)
        password = raw.decode("utf-16-le").rstrip("\x00")
        return cred.UserName, password
    finally:
        ctypes.windll.advapi32.CredFree(ptr)


def token() -> str:
    for target in ("git:https://github.com", "git:https://Kekcek1@github.com"):
        user, secret = read_credential(target)
        if secret:
            print(f"credential: {target} user={user} token_len={len(secret)}")
            return secret
    raise SystemExit("No GitHub credential found in Windows Credential Manager")


def main() -> int:
    secret = token()
    headers = {
        "Authorization": f"Bearer {secret}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "WorkNovela-release",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    who = requests.get(f"{API}/user", headers=headers, timeout=30)
    print("auth:", who.status_code, who.json().get("login") if who.ok else who.text[:200])
    if not who.ok:
        return 1

    release = None
    r = requests.get(f"{API}/repos/{REPO}/releases/tags/{TAG}", headers=headers, timeout=30)
    if r.ok:
        release = r.json()
        print("release exists:", release["html_url"])
    else:
        r = requests.post(
            f"{API}/repos/{REPO}/releases",
            headers=headers,
            json={
                "tag_name": TAG,
                "target_commitish": "main",
                "name": NAME,
                "body": BODY,
                "draft": False,
                "prerelease": False,
            },
            timeout=60,
        )
        print("create release:", r.status_code)
        if not r.ok:
            print(r.text[:500])
            return 1
        release = r.json()
        print("release:", release["html_url"])

    existing = {asset["name"]: asset for asset in release.get("assets", [])}
    upload_url = release["upload_url"].split("{", 1)[0]
    for path in ASSETS:
        if not path.exists():
            print("missing:", path)
            continue
        if path.name in existing:
            print("asset exists:", path.name, existing[path.name]["size"])
            continue
        print("uploading:", path.name, f"{path.stat().st_size / 1024 / 1024:.1f} MB")
        with path.open("rb") as fh:
            resp = requests.post(
                upload_url,
                headers={
                    "Authorization": f"Bearer {secret}",
                    "Accept": "application/vnd.github+json",
                    "Content-Type": "application/octet-stream",
                    "User-Agent": "WorkNovela-release",
                },
                params={"name": path.name},
                data=fh,
                timeout=1800,
            )
        print("  ->", resp.status_code, resp.json().get("name") if resp.headers.get("content-type", "").startswith("application/json") else "")
        if not resp.ok:
            print(resp.text[:400])
    return 0


if __name__ == "__main__":
    sys.exit(main())
