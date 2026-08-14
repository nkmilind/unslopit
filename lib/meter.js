// Signed, tamper-resistant free-edit counter stored in an httpOnly cookie.
// The cookie value is `count.signature`; the signature is an HMAC keyed by
// METER_SECRET, so a user can't just edit the number in devtools. Clearing
// cookies / incognito still resets it — this is a soft funnel gate, by design.

import crypto from "crypto";

const SECRET =
  process.env.METER_SECRET || "unslopit-dev-meter-secret-change-me";

if (!process.env.METER_SECRET && process.env.NODE_ENV === "production") {
  // Guessable signatures in prod — set METER_SECRET to make the gate meaningful.
  console.warn("METER_SECRET is not set; free-edit metering is trivially bypassable.");
}

export const FREE_ANON_LIMIT = 3;
export const METER_COOKIE = "usi_free";

// Local dev escape hatch: set METER_DISABLED=1 in .env.local to lift all
// free-edit limits (anon + account) for unlimited testing. Never set this in
// production — it's read server-side only.
export function meteringDisabled() {
  return process.env.METER_DISABLED === "1";
}

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(String(value)).digest("hex");
}

// Verified count from a raw cookie value, or 0 if missing/tampered/invalid.
export function readCount(cookieValue) {
  if (typeof cookieValue !== "string") return 0;
  const idx = cookieValue.lastIndexOf(".");
  if (idx === -1) return 0;
  const countPart = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);
  const expected = sign(countPart);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 0;
  const n = parseInt(countPart, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Cookie value for a given count, signed so it survives readCount().
export function serializeCount(count) {
  return `${count}.${sign(count)}`;
}

export function meterCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // http on localhost would drop a secure cookie
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  };
}
