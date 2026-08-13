import { NextResponse } from "next/server";
import { SLOP_SYSTEM_PROMPT } from "../../../lib/slop-prompt";
import {
  FREE_ANON_LIMIT,
  METER_COOKIE,
  readCount,
  serializeCount,
  meterCookieOptions,
} from "../../../lib/meter";

// POST /api/unslop  { text: string } -> { rewritten: string, changes: [{was, why}] }
// The Anthropic key lives ONLY here, server-side, as an env var. Never in the browser.

const MAX_WORDS = 3000; // per request; chunk longer drafts client-side or raise with care
const MODEL = "claude-sonnet-4-5"; // fast + strong for rewriting; check docs.claude.com for current models

function wordCount(t) {
  const m = (t || "").trim().match(/\S+/g);
  return m ? m.length : 0;
}

async function callClaude(text) {
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
      system: SLOP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: `TEXT TO UNSLOP:\n\n${text}` }],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Anthropic API error (${res.status})`);
  }

  const raw = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return JSON.parse(raw.replace(/```json|```/g, "").trim());
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

  // Free-edit gate: block the request that would exceed the anonymous limit,
  // before spending a Claude call. Only successful edits below consume a credit.
  const used = readCount(request.cookies.get(METER_COOKIE)?.value);
  if (used >= FREE_ANON_LIMIT) {
    return NextResponse.json(
      {
        gate: "signup",
        used,
        remaining: 0,
        limit: FREE_ANON_LIMIT,
        error: `You've used your ${FREE_ANON_LIMIT} free edits.`,
      },
      { status: 402 }
    );
  }

  // One retry: LLMs occasionally break the JSON contract.
  try {
    let result;
    try {
      result = await callClaude(text);
    } catch (firstErr) {
      if (firstErr instanceof SyntaxError) {
        result = await callClaude(text);
      } else {
        throw firstErr;
      }
    }

    if (typeof result?.rewritten !== "string") {
      throw new Error("Model response missing 'rewritten' field.");
    }

    // Successful edit — consume one credit and persist the signed count.
    const newUsed = used + 1;
    const response = NextResponse.json({
      rewritten: result.rewritten,
      changes: Array.isArray(result.changes) ? result.changes.slice(0, 8) : [],
      words,
      used: newUsed,
      remaining: Math.max(0, FREE_ANON_LIMIT - newUsed),
      limit: FREE_ANON_LIMIT,
    });
    response.cookies.set(METER_COOKIE, serializeCount(newUsed), meterCookieOptions());
    return response;
  } catch (err) {
    console.error("unslop error:", err);
    return Response.json(
      { error: "The edit didn't come back. Try again or shorten the draft." },
      { status: 502 }
    );
  }
}
