import { TAXONOMY } from "../../lib/taxonomy";

const SITE = "https://unslopit.ai";

// /llms.txt is generated, not hand-maintained: the taxonomy section is built
// from lib/taxonomy.js, so adding a category updates this, the sitemap
// (app/sitemap.js), and the /learn hub from a single edit. Static by default
// (no request access) → prerendered at build and served from the CDN.
export const dynamic = "force-static";

export function GET() {
  const taxonomy = TAXONOMY.map(
    (c) => `- [${c.title}](${SITE}/learn/${c.id}): ${c.blurb}`
  ).join("\n");

  const body = `# UnSlopIt

> UnSlopIt removes AI slop from writing. It strips the tells that give AI away — buzzwords, stock framings, chatbot sign-offs, false balance — and returns a clean draft plus a red-pen list of every change, while keeping your meaning and facts intact. Instant AI editing; a human-editing option is on the way.

## Pages

- [Home](${SITE}/): Paste an AI draft and get a de-slopped version. Choose edit strength (light, medium, full), optionally add a natural human typo, and see both a redline and a clean result with a change list.
- [What is AI slop?](${SITE}/learn): Defines AI slop and links to a page for each of the ${TAXONOMY.length} taxonomy categories.
- [How to humanize AI text](${SITE}/humanize-ai-text): A 5-step method to edit an AI draft into human writing — cut empty claims, add specifics only you know, fix the rhythm, strip the tells, read it aloud — with a before/after worked example.
- [The SLOP Equation](${SITE}/slop-equation): An interactive, sourced estimate of how much unedited AI text is published every day — SLOP = S × L × O × P (sources, length, AI output share, and the human-review pass rate). Embeddable at ${SITE}/slop-equation/embed; published under CC BY 4.0.
- [About](${SITE}/about): What UnSlopIt does, how the free tier works, who maintains the taxonomy, and an FAQ.

## The AI slop taxonomy — one page per category

${taxonomy}

## Notes

- Positioning: the goal is writing people want to read, not evading AI detectors.
- This file is generated from the site's taxonomy, so new taxonomy and guide pages appear automatically.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
