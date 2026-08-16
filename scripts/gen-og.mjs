// Generates public/og.png (1200x630) for social/OG cards.
//   node scripts/gen-og.mjs
// Self-contained SVG (explicit hex, no CSS vars/animation) so it rasterizes
// consistently. Re-run if the brand mark or colors change.

import sharp from "sharp";

const W = 1200;
const H = 630;
const PAPER = "#F4F1EA";
const INK = "#23201C";
const RED = "#C42B1C";
const MUTED = "#6E6656";
const LINE = "#E4DDCC";
const CARD = "#FDFBF6";

const o = `fill="${CARD}" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

const keyRows = [
  { y: 176, xs: [140, 162, 184, 206, 228, 250, 272, 294] },
  { y: 200, xs: [150, 172, 194, 216, 238, 260, 282] },
  { y: 224, xs: [160, 182, 204, 226, 248, 270] },
];
const keys = keyRows
  .flatMap((r) => r.xs.map((x) => `<circle cx="${x}" cy="${r.y}" r="7" ${o}/>`))
  .join("");

const typewriter = `
<svg x="822" y="150" width="330" height="311" viewBox="42 0 340 320">
  <line x1="62" y1="292" x2="362" y2="292" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  <rect x="150" y="28" width="122" height="96" rx="2" ${o}/>
  <line x1="164" y1="50" x2="252" y2="50" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>
  <line x1="164" y1="68" x2="258" y2="68" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>
  <line x1="164" y1="86" x2="236" y2="86" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>
  <line x1="160" y1="67" x2="260" y2="65" stroke="${RED}" stroke-width="3" stroke-linecap="round"/>
  <rect x="118" y="122" width="186" height="18" rx="9" ${o}/>
  <circle cx="108" cy="131" r="8" ${o}/>
  <circle cx="314" cy="131" r="8" ${o}/>
  <path d="M116 146 L306 146 L330 244 Q330 252 322 252 L100 252 Q92 252 92 244 Z" ${o}/>
  ${keys}
  <rect x="176" y="238" width="80" height="8" rx="4" ${o}/>
</svg>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <text x="90" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="26" letter-spacing="5" fill="${MUTED}">UNSLOPIT.AI</text>
  <text x="84" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="${INK}">Text that sounds</text>
  <text x="84" y="398" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" font-style="italic" fill="${RED}">human.</text>
  <text x="90" y="478" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${MUTED}">Humanize AI text — keep your meaning.</text>
  ${typewriter}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");
