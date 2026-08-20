// Shared FAQ — rendered on /learn (full) and the homepage (condensed), and the
// source for the FAQPage JSON-LD on /learn. Keep schema and rendered text in
// sync by importing from here, not duplicating.

export const FAQ = [
  {
    q: "Is my text stored?",
    a: "No. Your draft is processed to produce the edit and is never saved — it exists in memory only for the length of the request, and the browser never talks to the AI directly (your text goes to our server, which holds the API key and returns the rewrite). We do log anonymous, non-identifying metadata about each run — which taxonomy categories were flagged, an approximate word count, and a timestamp, never the text itself — and keep those aggregate counts indefinitely so we can cite real statistics about how often each pattern shows up.",
  },
  {
    q: "Will it change what I meant?",
    a: "No. The editor preserves your meaning, facts, claims, and roughly your length — it never invents new claims or statistics. You choose how hard it edits: Light touch, Medium (default), or Full rewrite.",
  },
  {
    q: "How is this different from asking an AI to “rewrite this”?",
    a: "A general model often adds its own slop. UnSlopIt runs a purpose-built editor against a fixed taxonomy of tells and shows you exactly what it changed and why — as a redline plus a clean version.",
  },
  {
    q: "What's the “add a typo” option?",
    a: "Perfectly clean text is itself a tell. Toggle it on and the editor slips in one small, natural typo so the result reads as human-written. We mark where it landed with a spellcheck-style squiggle.",
  },
  {
    q: "Can a real person edit it?",
    a: "Human editing is on the way. Register your interest on the home page and we'll email you when it's live.",
  },
  {
    q: "Is there a limit?",
    a: "In the prototype you get a few free edits, then the option to create a free account for more. Drafts are capped at 1,000 words per pass — split longer pieces by section.",
  },
];
