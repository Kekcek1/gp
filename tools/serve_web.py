#!/usr/bin/env python3
"""Local web server for dist/web with correct MIME types and auto-open."""
from __future__ import annotations

import http.server
import mimetypes
import os
import socket
import sys
import threading
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "dist" / "web"

mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("application/octet-stream", ".data")
mimetypes.add_type("application/zip", ".zip")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("text/css", ".css")


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, fmt: str, *args) -> None:
        sys.stdout.write("[web] " + fmt % args + "\n")


def free_port(start: int = 8765) -> int:
    for port in range(start, start + 30):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return start


def main() -> int:
    if not (WEB / "index.html").exists():
        print(f"Web build not found: {WEB / 'index.html'}")
        print("Build it with: python tools/build_all.py --web")
        return 1
    port = free_port()
    os.chdir(WEB)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://127.0.0.1:{port}/"
    print(f"Призраки Везенбергского квартала: {url}")
    print("Остановить сервер: Ctrl+C")
    threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nСервер остановлен.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
