// The SLOP equation — single source for the calculator, the /slop-equation
// article, and the /slop-equation/embed widget. Keeping the numbers here means
// the hero, the prose, and the embed can never drift apart.
//
//   SLOP = S × L × O × P   →   unedited AI words published per day
//
// S, L, and O are sourced; P is the slider — the term nobody measures.

export const SECONDS_PER_DAY = 86400;

export const SLOP = {
  S: {
    key: "S",
    name: "Sources",
    sub: "new pages published per day",
    value: 10_000_000,
    display: "10 million",
    sources: [
      "Wix — roughly 7.5M new blog posts a day; every post is one unique page.",
      "Forbes — global domain registrations run 252k–640k a day (midpoint here), assuming one indexable homepage per launch.",
      "WordPress VIP — a scaled estimate of ~2M new e-commerce listings, forum threads, and news releases a day.",
    ],
  },
  L: {
    key: "L",
    name: "Length",
    sub: "average words per page",
    value: 1100,
    display: "1,100",
    sources: [
      "Blog posts, ~1,380 words — the midpoint of Orbit Media's annual blogging survey and Digital Applied's trackers (1,333–1,427).",
      "Dynamic platform pages, ~250 words — product descriptions, forum replies, and localized news; Yoast and WordPress VIP flag 200–300 as the structural minimum.",
      "New homepages, ~400 words — a headline, a few service blurbs, and contact details; typically 300–500.",
    ],
  },
  O: {
    key: "O",
    name: "Output share",
    sub: "fraction containing AI text",
    value: 0.74,
    display: "74%",
    sources: [
      "Ahrefs, 2025 — 74% of newly created web pages contain AI-generated content.",
    ],
    sourceUrl:
      "https://ahrefs.com/blog/what-percentage-of-new-content-is-ai-generated/",
  },
  // P is the slider. Default is deliberately conservative.
  P: {
    key: "P",
    name: "Pass rate",
    sub: "fraction published with no human review",
    value: 0.1,
    display: "10%",
    min: 0,
    max: 1,
    step: 0.01,
  },
};

// Base = S × L × O — AI words published per day before the pass-rate cut.
export function slopBasePerDay() {
  return SLOP.S.value * SLOP.L.value * SLOP.O.value;
}

// SLOP = S × L × O × P — unedited AI words published per day.
export function slopPerDay(p = SLOP.P.value) {
  return slopBasePerDay() * p;
}
