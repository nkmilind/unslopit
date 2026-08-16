// Generates public/wordmark-square.svg + .png — a square (1:1) stacked lockup
// of the wordmark for square logo slots (e.g. Google Ad Manager).
//   node scripts/gen-wordmark-square.mjs
// Reuses the Fraunces subset already embedded in public/wordmark.svg.

import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";

const src = readFileSync("public/wordmark.svg", "utf8");
const b64 = src.match(/base64,([^)]+)\)/)[1];

const S = 1200; // square side
const FS = 300; // font size
// Strike bar over the "Slop" line — coordinates set after measuring in-browser.
const STRIKE = { x: 226, y: 653, w: 684, h: 28, rot: -4, cx: 568, cy: 667 };

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" role="img" aria-label="UnSlopIt.ai">
  <style>
    @font-face{font-family:'FrauncesWM';font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${b64}) format('woff2');}
    .wm{font-family:'FrauncesWM',Georgia,'Times New Roman',serif;font-weight:700;}
    .slop{fill:#6E6656;}
  </style>
  <text class="wm" text-anchor="middle" font-size="${FS}" fill="#23201C">
    <tspan x="600" y="447">Un</tspan>
    <tspan class="slop" x="600" y="747">Slop</tspan>
    <tspan x="600" y="1047">It.ai</tspan>
  </text>
  <rect x="${STRIKE.x}" y="${STRIKE.y}" width="${STRIKE.w}" height="${STRIKE.h}" rx="6" fill="#C42B1C" transform="rotate(${STRIKE.rot} ${STRIKE.cx} ${STRIKE.cy})"/>
</svg>
`;

writeFileSync("public/wordmark-square.svg", svg);
console.log("wrote public/wordmark-square.svg");

const pngSvg = svg.replace("<svg ", `<svg width="${S}" height="${S}" `);
await sharp(Buffer.from(pngSvg)).png().toFile("public/wordmark-square.png");
console.log(`wrote public/wordmark-square.png — ${S}x${S}`);
