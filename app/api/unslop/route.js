import { NextResponse, after } from "next/server";
import { cookies } from "next/headers";
import { buildSystemPrompt, UNSLOP_TOOL } from "../../../lib/slop-prompt";
import { logPatternCounts } from "../../../lib/pattern-log";
import { injectTypo } from "../../../lib/typo";
import {
  FREE_ANON_LIMIT,
  METER_COOKIE,
  readCount,
  serializeCount,
  meterCookieOptions,
  meteringDisabled,
} from "../../../lib/meter";
import { createClient } from "../../../lib/supabase-server";
import { FREE_ACCOUNT_LIMIT, getAccountUsage, setAccountUsage } from "../../../lib/usage";

// POST /api/unslop  { text: string } -> { rewritten: string, changes: [{was, why}] }
// The Anthropic key lives ONLY here, server-side, as an env var. Never in the browser.

const MAX_WORDS = 1000; // per request; chunk longer drafts client-side or raise with care
const MODEL = "claude-sonnet-4-5"; // fast + strong for rewriting; check docs.claude.com for current models

function wordCount(t) {
  const m = (t || "").trim().match(/\S+/g);
  return m ? m.length : 0;
}

async function callClaude(text, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system,
      tools: [UNSLOP_TOOL],
      tool_choice: { type: "tool", name: UNSLOP_TOOL.name },
      messages: [{ role: "user", content: `TEXT TO UNSLOP:\n\n${text}` }],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    // Carry the HTTP status so the caller can tell an auth failure (expired /
    // invalid / revoked key → 401, or a permission problem → 403) apart from a
    // transient blip. The Anthropic error type is kept for the server log.
    const err = new Error(data?.error?.message || `Anthropic API error (${res.status})`);
    err.status = res.status;
    err.anthropicType = data?.error?.type;
    throw err;
  }

  // Forced tool_choice guarantees a tool_use block whose `input` the API has
  // already parsed and validated against the schema — no JSON.parse of free text.
  const call = (data.content || []).find(
    (b) => b.type === "tool_use" && b.name === UNSLOP_TOOL.name
  );
  if (!call || typeof call.input !== "object" || call.input === null) {
    throw new Error("Model did not return the unslop_result tool call.");
  }
  return call.input;
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server missing ANTHROPIC_API_KEY. Add it to .env.local (see README)." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body?.text === "string" ? body.text : "";
  const level = typeof body?.level === "string" ? body.level : undefined;
  const addTypo = body?.addTypo === true;
  const system = buildSystemPrompt({ level }); // validates level internally
  const words = wordCount(text);
  if (words === 0) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }
  if (words > MAX_WORDS) {
    return Response.json(
      { error: `Draft is ${words} words; limit is ${MAX_WORDS} per request.` },
      { status: 413 }
    );
  }

  // Who is this? Signed-in users are metered per account (edits 4–6); everyone
  // else by the anonymous cookie (edits 1–3). Gate BEFORE spending a Claude call.
  const cookieStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const bypass = meteringDisabled();
  let tier, limit, used;
  if (bypass) {
    tier = "dev";
    limit = Infinity;
    used = 0;
  } else if (user) {
    tier = "account";
    limit = FREE_ACCOUNT_LIMIT;
    try {
      used = await getAccountUsage(user.id);
    } catch (e) {
      console.error("usage read error:", e);
      return Response.json(
        { error: "Couldn't check your edit balance. Try again in a moment." },
        { status: 502 }
      );
    }
    if (used >= limit) {
      return NextResponse.json(
        {
          gate: "paywall",
          tier,
          used,
          remaining: 0,
          limit,
          error: "You've used all your free account edits.",
        },
        { status: 402 }
      );
    }
  } else {
    tier = "anon";
    limit = FREE_ANON_LIMIT;
    used = readCount(cookieStore.get(METER_COOKIE)?.value);
    if (used >= limit) {
      return NextResponse.json(
        {
          gate: "signup",
          tier,
          used,
          remaining: 0,
          limit,
          error: `You've used your ${FREE_ANON_LIMIT} free edits.`,
        },
        { status: 402 }
      );
    }
  }

  // One retry: LLMs occasionally break the JSON contract.
  try {
    let result;
    try {
      result = await callClaude(text, system);
    } catch (e) {
      // Don't retry an auth/permission failure — an expired or invalid key won't
      // fix itself, and it's not the transient kind of error a retry is for.
      if (e?.status === 401 || e?.status === 403) throw e;
      // One retry for a transient failure (5xx / overload, or a missing tool call).
      result = await callClaude(text, system);
    }

    if (typeof result?.rewritten !== "string") {
      throw new Error("Model response missing 'rewritten' field.");
    }

    // Successful edit — consume one credit on the appropriate tier.
    const newUsed = used + 1;
    if (bypass) {
      // dev bypass: no gate, no counting
    } else if (tier === "account") {
      try {
        await setAccountUsage(user.id, newUsed);
      } catch (e) {
        // The user already got their edit; log the miss rather than fail.
        console.error("usage write error:", e);
      }
    } else {
      cookieStore.set(METER_COOKIE, serializeCount(newUsed), meterCookieOptions());
    }

    // Optional human typo — applied here, with its location returned so the
    // client can mark it (rather than hiding it in the text).
    let rewritten = result.rewritten;
    let typo = null;
    if (addTypo) {
      const t = injectTypo(rewritten);
      rewritten = t.text;
      if (t.index >= 0) typo = { word: t.word, index: t.index };
    }

    // Anonymous aggregate logging — runs after the response is sent so it never
    // adds latency or breaks the edit. Records category ids + word count only,
    // never the draft text (see lib/pattern-log.js and the retention note).
    after(() =>
      logPatternCounts({ categories: result.categories, wordCount: words })
    );

    return Response.json({
      rewritten,
      changes: Array.isArray(result.changes) ? result.changes.slice(0, 8) : [],
      flagged: Array.isArray(result.flagged) ? result.flagged.slice(0, 8) : [],
      words,
      tier,
      used: bypass ? 0 : newUsed,
      remaining: bypass ? null : Math.max(0, limit - newUsed),
      limit: bypass ? null : limit,
      typo,
    });
  } catch (err) {
    console.error("unslop error:", err);
    // An expired / invalid / revoked API key (or a permission problem) is a
    // server-side configuration issue, NOT the user's free-edit limit. Return a
    // distinct status + message so the UI never misreports it as "out of free
    // edits." The real cause (err.message / anthropicType) is in the log above.
    if (err?.status === 401 || err?.status === 403) {
      return Response.json(
        {
          error:
            "The editor is temporarily unavailable — a problem on our end, not your free-edit limit. Please try again later.",
        },
        { status: 503 }
      );
    }
    return Response.json(
      { error: "The edit didn't come back. Try again or shorten the draft." },
      { status: 502 }
    );
  }
}
