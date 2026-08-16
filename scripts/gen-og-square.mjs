// Generates public/og-square.png (1200x1200) — a square social card.
//   node scripts/gen-og-square.mjs
// Centered vertical stack (eyebrow, typewriter, hero line, tagline) on the
// brand paper. Self-contained SVG (explicit hex) so it rasterizes consistently.

import sharp from "sharp";

const S = 1200;
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

// Typewriter centered near the top. viewBox aspect 340:320.
const twW = 380;
const twX = (S - twW) / 2;
const typewriter = `
<svg x="${twX}" y="250" width="${twW}" height="${(twW * 320) / 340}" viewBox="42 0 340 320">
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

const ff = "font-family=\"Georgia, 'Times New Roman', serif\"";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${PAPER}"/>
  <text x="600" y="185" text-anchor="middle" ${ff} font-size="30" letter-spacing="6" fill="${MUTED}">UNSLOPIT.AI</text>
  ${typewriter}
  <text x="600" y="790" text-anchor="middle" ${ff} font-size="84" font-weight="700" fill="${INK}">Text that sounds</text>
  <text x="600" y="898" text-anchor="middle" ${ff} font-size="84" font-weight="700" font-style="italic" fill="${RED}">human.</text>
  <text x="600" y="986" text-anchor="middle" ${ff} font-size="32" fill="${MUTED}">Humanize AI text — keep your meaning.</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og-square.png");
console.log(`wrote public/og-square.png — ${S}x${S}`);
