// Server-side per-account edit metering, stored in the `usage` table.
// Uses the service-role key (bypasses RLS) — never import this into client code.

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TABLE = "usage";

export const FREE_ACCOUNT_LIMIT = 3;

function headers() {
  return {
    "content-type": "application/json",
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };
}

// Edits already consumed by this account (0 if no row yet).
export async function getAccountUsage(userId) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?user_id=eq.${encodeURIComponent(
    userId
  )}&select=account_edits_used`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`usage read failed (${res.status})`);
  const rows = await res.json();
  const n = rows?.[0]?.account_edits_used;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Upsert the account's edit count to an absolute value; returns nothing.
export async function setAccountUsage(userId, value) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=user_id`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([
      { user_id: userId, account_edits_used: value, updated_at: new Date().toISOString() },
    ]),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`usage write failed (${res.status}): ${detail}`);
  }
}
