// Generates public/wordmark.svg — the "UnSlopIt.ai" wordmark as a self-contained
// vector, with the Fraunces subset embedded so it renders correctly anywhere.
//   1) fetch + base64 the subset into /tmp/fraunces-sub.b64 (see the shell steps)
//   2) node scripts/gen-wordmark.mjs

import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";

const b64 = readFileSync("/tmp/fraunces-sub.b64", "utf8").trim();

// viewBox is tightened after measuring the text bbox in a browser.
const VB = "-20 0 405 94";
const FS = 64;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="UnSlopIt.ai">
  <style>
    @font-face{font-family:'FrauncesWM';font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${b64}) format('woff2');}
    .wm{font-family:'FrauncesWM',Georgia,'Times New Roman',serif;font-weight:700;}
    .slop{fill:#6E6656;}
  </style>
  <text class="wm" x="0" y="70" font-size="${FS}" fill="#23201C">Un<tspan class="slop">Slop</tspan>It.ai</text>
  <rect x="87.5" y="50.5" width="147" height="7" rx="2" fill="#C42B1C" transform="rotate(-4 161 54)"/>
</svg>
`;

writeFileSync("public/wordmark.svg", svg);
console.log("wrote public/wordmark.svg —", svg.length, "bytes");

// Transparent PNG at 1200-wide for non-SVG contexts.
const W = 1200;
const H = Math.round((W * 94) / 405); // viewBox aspect 405x94
const pngSvg = svg.replace("<svg ", `<svg width="${W}" height="${H}" `);
await sharp(Buffer.from(pngSvg)).png().toFile("public/wordmark.png");
console.log(`wrote public/wordmark.png — ${W}x${H}`);
