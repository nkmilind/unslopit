// UnSlopIt prompt eval runner.
//   node eval/run.mjs            # run all cases at the default (medium) level
//   node eval/run.mjs --level full
//
// Reads ANTHROPIC_API_KEY from .env.local, runs every case in cases.json
// through the REAL system prompt (imported from lib/slop-prompt.js), and
// checks two things per case:
//   - mustCut:  phrases that should be GONE from the rewrite  (leak => FAIL)
//   - mustKeep: content that should SURVIVE the rewrite       (drop => REVIEW)
// It is a signal, not a judge — always eyeball REVIEWs and the staccato case.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  buildSystemPrompt,
  DEFAULT_LEVEL,
  LEVELS,
  UNSLOP_TOOL,
} from "../lib/slop-prompt.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const MODEL = "claude-sonnet-4-5"; // keep in sync with app/api/unslop/route.js
const CONCURRENCY = 5;

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}

async function unslop(text, system) {
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
  if (!res.ok) throw new Error(data?.error?.message || `API ${res.status}`);
  const call = (data.content || []).find(
    (b) => b.type === "tool_use" && b.name === UNSLOP_TOOL.name
  );
  if (!call || typeof call.input !== "object") {
    throw new Error("no unslop_result tool call in model response");
  }
  return call.input;
}

async function pool(items, worker, n) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await worker(items[idx], idx);
      }
    })
  );
  return out;
}

const has = (hay, needle) => hay.toLowerCase().includes(needle.toLowerCase());

async function main() {
  loadEnvLocal();
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY (add it to .env.local).");
    process.exit(1);
  }
  const levelArg = process.argv.indexOf("--level");
  const level = levelArg > -1 ? process.argv[levelArg + 1] : DEFAULT_LEVEL;
  if (!LEVELS.includes(level)) {
    console.error(`Unknown level "${level}". Use one of: ${LEVELS.join(", ")}`);
    process.exit(1);
  }
  const system = buildSystemPrompt({ level });
  const cases = JSON.parse(readFileSync(join(HERE, "cases.json"), "utf8"));

  console.log(`Running ${cases.length} cases at level="${level}" against ${MODEL}\n`);

  const results = await pool(
    cases,
    async (c) => {
      try {
        const { rewritten } = await unslop(c.input, system);
        const leaked = (c.mustCut || []).filter((s) => has(rewritten, s));
        const dropped = (c.mustKeep || []).filter((s) => !has(rewritten, s));
        const status = leaked.length ? "FAIL" : dropped.length ? "REVIEW" : "PASS";
        return { ...c, rewritten, leaked, dropped, status };
      } catch (e) {
        return { ...c, status: "ERROR", error: String(e.message || e) };
      }
    },
    CONCURRENCY
  );

  const icon = { PASS: "✓", REVIEW: "?", FAIL: "✗", ERROR: "!" };
  const counts = { PASS: 0, REVIEW: 0, FAIL: 0, ERROR: 0 };
  for (const r of results) {
    counts[r.status]++;
    console.log(`${icon[r.status]} [${r.status}] ${r.label}  (${r.id})`);
    if (r.status === "ERROR") {
      console.log(`    error: ${r.error}`);
      continue;
    }
    if (r.leaked?.length) console.log(`    leaked (should be gone): ${r.leaked.join(", ")}`);
    if (r.dropped?.length) console.log(`    dropped (should survive): ${r.dropped.join(", ")}`);
    console.log(`    -> ${r.rewritten.replace(/\s+/g, " ").slice(0, 160)}`);
  }

  console.log(
    `\nSummary: ${counts.PASS} pass, ${counts.REVIEW} review, ${counts.FAIL} fail, ${counts.ERROR} error  (of ${results.length})`
  );
  console.log("REVIEW = a mustKeep phrase went missing; the model may have validly paraphrased. Read it.");

  const report = { at: new Date().toISOString(), model: MODEL, level, counts, results };
  writeFileSync(join(HERE, "last-run.json"), JSON.stringify(report, null, 2));
  console.log("Wrote eval/last-run.json");

  process.exit(counts.FAIL > 0 ? 1 : 0);
}

main();
