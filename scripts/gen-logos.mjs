// Draws every pack icon from one mark: three stacked chevrons — the layering the
// family is built on — tinted with the colour of the ecosystem the pack serves.
import { writeFileSync } from "node:fs";
import sharp from "sharp";

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

// The rasteriser is librsvg: no CSS custom properties, colours go inline.
const chevron = (y, accent, opacity) =>
  `<path d="M 72 ${y} L 128 ${y - 46} L 184 ${y}" fill="none" stroke="${accent}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;

const svg = (accent) => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="58" fill="#15171C"/>
  ${chevron(198, accent, 0.3)}
  ${chevron(154, accent, 0.62)}
  ${chevron(110, accent, 1)}
</svg>`;

for (const [dir, accent] of Object.entries(ACCENTS)) {
  const buf = Buffer.from(svg(accent));
  await sharp(buf).png({ compressionLevel: 9 }).toFile(`packages/${dir}/logo.png`);
  console.log(`packages/${dir}/logo.png  ${accent}`);
}
writeFileSync("logo.svg", svg("#8B95A8"));
