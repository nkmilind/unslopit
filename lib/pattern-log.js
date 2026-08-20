// Anonymous aggregate logging for evidence-based statistics. One row per edit:
// which taxonomy categories the model flagged, an approximate word count, and a
// timestamp — NEVER the draft text or any change fragments. Uses the
// service-role key (bypasses RLS); never import into client code.
import { TAXONOMY } from "./taxonomy";

const SUPABASE_URL = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TABLE = "pattern_counts";
const VALID = new Set(TAXONOMY.map((c) => c.id));

// Insert one aggregate row. Fire-and-forget: swallows all errors so a logging
// failure can never affect the user's edit. Logs only category ids + word
// count; the table has no column for text.
export async function logPatternCounts({ categories, wordCount }) {
  if (!SUPABASE_URL || !SERVICE_KEY) return; // logging simply off when unconfigured
  const categoriesClean = Array.isArray(categories)
    ? [...new Set(categories.filter((c) => VALID.has(c)))]
    : [];
  const word_count = Number.isFinite(wordCount)
    ? Math.max(0, Math.trunc(wordCount))
    : 0;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify([{ categories: categoriesClean, word_count }]),
    });
    if (!res.ok) {
      console.error(`pattern log failed (${res.status}):`, await res.text());
    }
  } catch (e) {
    console.error("pattern log error:", e);
  }
}
