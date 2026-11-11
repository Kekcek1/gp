import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || 8080);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".zip": "application/zip",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const sendError = (res, status, message) => {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });
  res.end(message);
};

const server = createServer(async (req, res) => {
  const method = req.method || "GET";

  if (method !== "GET" && method !== "HEAD") {
    sendError(res, 405, "405 Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
  } catch {
    sendError(res, 400, "400 Bad Request");
    return;
  }

  let file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) {
    sendError(res, 403, "403 Forbidden");
    return;
  }

  try {
    let info = await stat(file);

    if (info.isDirectory()) {
      file = resolve(file, "index.html");
      info = await stat(file);
    }

    if (!info.isFile()) {
      sendError(res, 404, "404 Not Found");
      return;
    }

    const type = mime[extname(file).toLowerCase()] || "application/octet-stream";
    const headers = {
      "Content-Type": type,
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
    };

    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        sendError(res, 416, "416 Range Not Satisfiable");
        return;
      }

      let start = match[1] ? Number(match[1]) : 0;
      let end = match[2] ? Number(match[2]) : info.size - 1;

      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= info.size) {
        sendError(res, 416, "416 Range Not Satisfiable");
        return;
      }

      end = Math.min(end, info.size - 1);

      res.writeHead(206, {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${info.size}`,
        "Content-Length": end - start + 1,
      });

      if (method === "HEAD") res.end();
      else createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { ...headers, "Content-Length": info.size });
    if (method === "HEAD") res.end();
    else createReadStream(file).pipe(res);
  } catch (error) {
    if (error && error.code === "ENOENT") sendError(res, 404, "404 Not Found");
    else {
      console.error(error);
      sendError(res, 500, "500 Internal Server Error");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Игровая вселенная: http://127.0.0.1:${port}/`);
});
