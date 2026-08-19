// Generates public/signs-of-ai-writing.pdf — a one-page field guide built from
// the live taxonomy (lib/taxonomy.js), so it can never drift from the site.
// Runs automatically before `next build` (see package.json "prebuild").
//   node scripts/build-taxonomy-pdf.mjs
import { createWriteStream, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import PDFDocument from "pdfkit";
import { TAXONOMY } from "../lib/taxonomy.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "public", "signs-of-ai-writing.pdf");

const INK = "#23201C";
const RED = "#C42B1C";
const MUTED = "#6E6656";
const LINE = "#E4DDCC";
const N = TAXONOMY.length;

// pdfkit's built-in fonts have no emoji glyphs (they render as mojibake), so
// strip emoji from tells for the PDF only. The website keeps them.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu;
const stripEmoji = (s) => s.replace(EMOJI_RE, "").replace(/\s{2,}/g, " ").trim();

mkdirSync(join(ROOT, "public"), { recursive: true });

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 46, bottom: 42, left: 46, right: 46 },
  info: {
    Title: `The ${N} signs of AI writing`,
    Author: "UnSlopIt.ai",
    Subject: "The AI slop taxonomy — the tells that give AI-written text away",
    Keywords:
      "AI slop, signs of AI writing, overused ChatGPT words, AI writing tells",
    // Fixed date keeps regenerated output byte-stable (no git churn).
    CreationDate: new Date("2026-01-01T00:00:00Z"),
  },
});
doc.pipe(createWriteStream(OUT));

const left = doc.page.margins.left;
const width = doc.page.width - left - doc.page.margins.right;

// Header
doc
  .font("Helvetica-Bold")
  .fontSize(9)
  .fillColor(RED)
  .text("UNSLOPIT.AI", left, doc.page.margins.top, { characterSpacing: 1.5 });
doc
  .font("Times-Bold")
  .fontSize(22)
  .fillColor(INK)
  .text(`The ${N} signs of AI writing`, { characterSpacing: -0.2 });
doc
  .font("Helvetica")
  .fontSize(8.5)
  .fillColor(MUTED)
  .text(
    "The tells that give AI-written text away — the words-and-patterns list. The full taxonomy, with a real example for each, lives at unslopit.ai/learn.",
    { width }
  );
doc.moveDown(0.4);
const ruleY = doc.y;
doc
  .moveTo(left, ruleY)
  .lineTo(left + width, ruleY)
  .lineWidth(1)
  .strokeColor(RED)
  .stroke();
doc.moveDown(0.7);

// Items
TAXONOMY.forEach((c, i) => {
  const nn = String(i + 1).padStart(2, "0");
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(RED)
    .text(`${nn}  `, left, doc.y, { continued: true })
    .font("Times-Bold")
    .fontSize(11)
    .fillColor(INK)
    .text(c.title);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(MUTED)
    .text(c.tells.map(stripEmoji).filter(Boolean).join("   ·   "), left, doc.y + 1, {
      width,
    });
  doc.moveDown(0.42);
});

// Footer (flows directly after the list)
doc.moveDown(0.3);
const footY = doc.y;
doc
  .moveTo(left, footY)
  .lineTo(left + width, footY)
  .lineWidth(0.5)
  .strokeColor(LINE)
  .stroke();
doc.moveDown(0.5);
doc
  .font("Helvetica")
  .fontSize(8)
  .fillColor(MUTED)
  .text("Free to share.", left, doc.y, { continued: true })
  .fillColor(RED)
  .text("  Unslop your draft at unslopit.ai", { link: "https://unslopit.ai/" });

doc.end();
console.log(`Wrote ${OUT} (${N} categories)`);
