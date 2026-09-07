// Draws every pack icon from one mark: a rocket whose exhaust is three stacked
// chevrons — the layering the family is built on — tinted with the colour of the
// ecosystem the pack serves. The rasteriser is librsvg: no CSS custom
// properties, colours go inline.
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const GROUND = "#15171C";

const ACCENTS = {
  "aeris-dx": "#8B95A8",
  "aeris-git": "#F05033",
  "aeris-rust": "#DE5A25",
  "aeris-ts": "#3178C6",
  "aeris-python": "#FFD343",
  "aeris-css": "#CC6699",
  "aeris-tailwind": "#38BDF8",
  "aeris-vue": "#42B883",
  "aeris-nuxt": "#00DC82",
};

const exhaust = (y, accent, opacity) =>
  `<path d="M 100 ${y} L 128 ${y - 22} L 156 ${y}" fill="none" stroke="${accent}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;

const svg = (accent) => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="58" fill="${GROUND}"/>

  <!-- fins, flush with the base so they read as part of the hull -->
  <path d="M 98 126 L 64 176 L 98 168 Z" fill="${accent}" opacity="0.5"/>
  <path d="M 158 126 L 192 176 L 158 168 Z" fill="${accent}" opacity="0.5"/>

  <!-- body -->
  <path d="M 128 32 C 152 64 158 104 158 144 L 158 168 L 98 168 L 98 144 C 98 104 104 64 128 32 Z" fill="${accent}"/>
  <circle cx="128" cy="94" r="17" fill="${GROUND}"/>
  <rect x="111" y="168" width="34" height="11" rx="4" fill="${accent}" opacity="0.75"/>

  <!-- exhaust: the same three layers as the packs -->
  ${exhaust(206, accent, 0.85)}
  ${exhaust(230, accent, 0.38)}
</svg>`;

for (const [dir, accent] of Object.entries(ACCENTS)) {
  await sharp(Buffer.from(svg(accent))).png({ compressionLevel: 9 }).toFile(`packages/${dir}/logo.png`);
  console.log(`packages/${dir}/logo.png  ${accent}`);
}
writeFileSync("logo.svg", svg("#8B95A8"));
