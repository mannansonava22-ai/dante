/* ============================================================
   Dante.<3 — Portfolio server
   ------------------------------------------------------------
   Serves the static site and handles POST /api/contact.

   Email delivery: Resend (https://resend.com)
   - The API key lives only in the server environment.
   - The recipient is fixed server-side and cannot be changed
     by a visitor.
   - No dependencies: Node 20+ built-ins only.
   ============================================================ */

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_RECIPIENT = "mannansonava22@gmail.com";

/* ----------------------------------------------------------
   Environment
   ---------------------------------------------------------- */
function loadEnv() {
  const file = join(ROOT, ".env");
  if (!existsSync(file)) return;

  try {
    const text = readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  } catch {
    console.warn("[server] Could not read .env — continuing with process environment.");
  }
}

loadEnv();

const PORT = Number(process.env.PORT) || 5174;
const HOST = process.env.HOST || "127.0.0.1";
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const FROM_EMAIL = String(process.env.CONTACT_FROM_EMAIL || "").trim();
const TO_EMAIL = String(process.env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT).trim() || DEFAULT_RECIPIENT;
const RESEND_API_URL = String(process.env.RESEND_API_URL || "https://api.resend.com/emails").trim();
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const RATE_LIMIT = Math.max(1, Number(process.env.CONTACT_RATE_LIMIT) || 5);
const RATE_WINDOW_MS = Math.max(10_000, Number(process.env.CONTACT_RATE_WINDOW_MS) || 15 * 60_000);
const MIN_FILL_MS = Math.max(0, Number(process.env.CONTACT_MIN_FILL_MS) || 1500);
const MAX_BODY_BYTES = 32 * 1024;

/* ----------------------------------------------------------
   Static file serving
   ---------------------------------------------------------- */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

const DENY_FILES = new Set([
  "server.mjs",
  "package.json",
  "package-lock.json",
  ".env",
  ".env.example",
  ".gitignore",
  "README.md"
]);

function baseHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  };
}

function send(res, status, body = "", headers = {}) {
  res.writeHead(status, { ...baseHeaders(), ...headers });
  res.end(body);
}

function sendJson(res, status, data, headers = {}) {
  send(res, status, JSON.stringify(data), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
}

async function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" }, { Allow: "GET, HEAD" });
    return;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (decoded === "/") decoded = "/index.html";

  const filePath = resolve(join(ROOT, decoded));
  const rel = relative(ROOT, filePath);

  if (!rel || rel.startsWith("..") || isAbsolute(rel) || rel.split(sep).some((part) => part.startsWith("."))) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (DENY_FILES.has(rel.replaceAll("\\", "/"))) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const ext = extname(filePath).toLowerCase();
  if (!MIME[ext]) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  let info;
  try {
    info = statSync(filePath);
  } catch {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (!info.isFile()) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  let body;
  try {
    body = await readFile(filePath);
  } catch {
    send(res, 500, "Internal server error", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const cache = ext === ".html" ? "no-cache" : "public, max-age=3600";
  res.writeHead(200, {
    ...baseHeaders(),
    "Content-Type": MIME[ext],
    "Content-Length": body.length,
    "Cache-Control": cache
  });
  res.end(req.method === "HEAD" ? undefined : body);
}

/* ----------------------------------------------------------
   Contact endpoint helpers
   ---------------------------------------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, max);
}

function cleanMessage(value) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, 5000);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function getClientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return forwarded;
  }
  return req.socket.remoteAddress || "unknown";
}

const rateBuckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter((stamp) => now - stamp < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    rateBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(ip, recent);

  if (rateBuckets.size > 5000) {
    for (const [key, stamps] of rateBuckets) {
      if (!stamps.some((stamp) => now - stamp < RATE_WINDOW_MS)) rateBuckets.delete(key);
    }
  }

  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function validateContact(payload) {
  const data = payload && typeof payload === "object" ? payload : {};
  const name = clean(data.name, 80);
  const email = clean(data.email, 254).toLowerCase();
  const subject = clean(data.subject, 120);
  const message = cleanMessage(data.message);
  const errors = {};

  if (name.length < 2) errors.name = "Please enter your full name.";
  if (name.length > 80) errors.name = "Name is too long.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (subject.length < 3) errors.subject = "Please add a short subject.";
  if (subject.length > 120) errors.subject = "Subject is too long.";
  if (message.length < 10) errors.message = "Please write a message of at least 10 characters.";
  if (message.length > 5000) errors.message = "Message is too long.";

  const startedAt = Number(data.startedAt);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    errors.form = "Please refresh the page and try again.";
  } else {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS) errors.form = "Please take a moment to complete the form.";
    if (elapsed > 2 * 60 * 60 * 1000) errors.form = "This form expired. Please refresh and try again.";
  }

  if (String(data.website || "").trim()) errors.form = "Submission rejected.";

  return { name, email, subject, message, errors };
}

async function sendWithResend({ name, email, subject, message }) {
  if (!RESEND_API_KEY || !FROM_EMAIL) {
    return { ok: false, code: "not_configured" };
  }

  const text = [
    "New portfolio message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    message
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1b1526">
      <h2 style="margin:0 0 16px">New portfolio message</h2>
      <p style="margin:0 0 6px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 6px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <div style="padding:16px;border-radius:12px;background:#f5f1fb;white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>`.trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Portfolio contact — ${subject}`,
        text,
        html
      }),
      signal: controller.signal
    });

    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    if (!response.ok || !data.id) {
      console.error(`[contact] Resend rejected the message (HTTP ${response.status}).`);
      return { ok: false, code: "delivery_failed" };
    }

    console.log(`[contact] Message accepted by Resend (${data.id}).`);
    return { ok: true, id: data.id };
  } catch (error) {
    console.error(`[contact] Resend request failed: ${error.name === "AbortError" ? "timeout" : error.message}`);
    return { ok: false, code: "delivery_failed" };
  } finally {
    clearTimeout(timer);
  }
}

async function handleContact(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" }, { Allow: "POST" });
    return;
  }

  // Same-origin browser requests only. Non-browser clients normally omit Origin.
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        sendJson(res, 403, { ok: false, error: "Forbidden" });
        return;
      }
    } catch {
      sendJson(res, 403, { ok: false, error: "Forbidden" });
      return;
    }
  }

  if (!String(req.headers["content-type"] || "").toLowerCase().includes("application/json")) {
    sendJson(res, 415, { ok: false, error: "Unsupported media type" });
    return;
  }

  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
    sendJson(res, 413, { ok: false, error: "Payload too large" });
    return;
  }

  if (isRateLimited(getClientIp(req))) {
    sendJson(res, 429, { ok: false, error: "Too many requests" }, { "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)) });
    return;
  }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw);
  } catch (error) {
    sendJson(res, error.status === 413 ? 413 : 400, {
      ok: false,
      error: error.status === 413 ? "Payload too large" : "Invalid JSON"
    });
    return;
  }

  const { name, email, subject, message, errors } = validateContact(payload);

  if (Object.keys(errors).length) {
    sendJson(res, 400, { ok: false, error: "Validation failed", fields: errors });
    return;
  }

  const result = await sendWithResend({ name, email, subject, message });

  if (!result.ok) {
    const status = result.code === "not_configured" ? 503 : 502;
    sendJson(res, status, { ok: false, code: result.code, error: "Unable to send message" });
    return;
  }

  sendJson(res, 200, { ok: true, id: result.id });
}

/* ----------------------------------------------------------
   Server
   ---------------------------------------------------------- */
const server = createServer(async (req, res) => {
  let pathname = "/";
  try {
    pathname = new URL(req.url || "/", "http://localhost").pathname;
  } catch {
    send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (pathname === "/api/contact") {
    try {
      await handleContact(req, res);
    } catch (error) {
      console.error("[contact] Unhandled error:", error?.message || error);
      if (!res.headersSent) sendJson(res, 500, { ok: false, error: "Internal server error" });
      else res.end();
    }
    return;
  }

  try {
    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error("[server] Static request failed:", error?.message || error);
    if (!res.headersSent) send(res, 500, "Internal server error", { "Content-Type": "text/plain; charset=utf-8" });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[server] Portfolio running at http://${HOST}:${PORT}`);
  if (!RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY is not set — email delivery will return 503 until configured.");
  }
  if (!FROM_EMAIL) {
    console.warn("[contact] CONTACT_FROM_EMAIL is not set — email delivery will return 503 until configured.");
  }
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
