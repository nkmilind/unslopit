// POST /api/interest  { email: string, notes?: string, words?: number } -> { ok: true }
// Captures "register interest" signups for the human-editor waitlist.
// Supabase credentials live ONLY here, server-side, as env vars. Never in the browser.

// Normalize to the bare project origin — tolerate a pasted trailing slash or /rest/v1 suffix.
const SUPABASE_URL = (process.env.SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
// Service-role key: bypasses row-level security so the server can insert.
// Must stay server-side — do NOT prefix with NEXT_PUBLIC_.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "interest_signups";

// Simple, permissive check — the real gate is the DB, this just rejects obvious junk.
function looksLikeEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function POST(request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { error: "Server missing Supabase env vars. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see README)." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!looksLikeEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 2000) : null;
  const words = Number.isFinite(body?.words) ? Math.trunc(body.words) : null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        // Upsert on the unique email so a repeat signup is a friendly no-op, not an error.
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([{ email, notes, words }]),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("interest insert failed:", res.status, detail);
      return Response.json(
        { error: "Couldn't save your interest. Please try again in a moment." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("interest error:", err);
    return Response.json(
      { error: "Couldn't save your interest. Please try again in a moment." },
      { status: 502 }
    );
  }
}
