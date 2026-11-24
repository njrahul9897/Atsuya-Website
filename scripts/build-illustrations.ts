// Draws the modelled scenes in /illustrations as isometric vector art.
//   npm run build:illustrations
// Static layers are written to public/illustrations as SVG images; the animated layers and the
// stacking order go to illustrations/generated, which the page imports.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { exportScene, type Exported } from "../illustrations/export";
import { M, SKY, type Style } from "../illustrations/model/kit";
import { buildSite, SITE } from "../illustrations/model/site";
import { buildNight, NIGHT, NIGHT_LIGHTS } from "../illustrations/model/night";

const root = process.cwd();
const publicDir = join(root, "public", "illustrations");
const generatedDir = join(root, "illustrations", "generated");
mkdirSync(publicDir, { recursive: true });
mkdirSync(generatedDir, { recursive: true });
const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

// Night: every colour is darkened and cooled toward a moonlit navy, except light sources (lamps,
// screens, LEDs, glows), which stay as bright as they are by day.
const lights = new Set<string>([SKY, ...NIGHT_LIGHTS].map((c) => c.toLowerCase()));
for (const material of Object.values(M)) {
  const style = material.userData as Style;
  if (style.emissive) lights.add(style.emissive.toLowerCase());
  if (style.glow) lights.add(style.glow.toLowerCase());
}
const MOON = [12, 26, 54];
const nightColour = (hex: string) => {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${rgb.map((c, i) => Math.round(c * 0.44 * 0.7 + MOON[i] * 0.3).toString(16).padStart(2, "0")).join("")}`;
};
const toNight = (svg: string) => svg.replace(/#[0-9a-fA-F]{6}\b/g, (hex) => (lights.has(hex.toLowerCase()) ? hex : nightColour(hex)));

function write(id: string, scene: Exported, shade: (svg: string) => string = (svg) => svg) {
  // Clear the last run: the number of layers can change.
  for (const file of readdirSync(publicDir)) if (new RegExp(`^${id}(-\\d+)?\\.svg$`).test(file)) rmSync(join(publicDir, file));
  let images = 0;
  const layers = scene.layers.map((layer) => {
    if (layer.kind === "inline") return { kind: "inline" as const, markup: shade(layer.markup) };
    const name = `${id}-${images++}.svg`;
    const svg = shade(layer.svg);
    writeFileSync(join(publicDir, name), svg);
    return { kind: "image" as const, src: `/illustrations/${name}`, bytes: svg.length };
  });
  const flat = shade(scene.flat);
  writeFileSync(join(publicDir, `${id}.svg`), flat);
  writeFileSync(join(generatedDir, `${id}.json`), JSON.stringify({ viewBox: scene.viewBox, layers }, null, 1) + "\n");
  console.log(`${id}: ${scene.stats.nodes} nodes, ${scene.stats.cycles} cycles, ${scene.stats.layers} layers`);
  for (const layer of layers) console.log(layer.kind === "image" ? `  image  ${layer.src}  ${kb(layer.bytes)}` : `  inline ${kb(layer.markup.length)}`);
  console.log(`  flat   /illustrations/${id}.svg  ${kb(flat.length)}`);
}

const started = Date.now();
write("site", exportScene(buildSite(), { id: "site", ground: { x0: -0.6, z0: -0.6, x1: SITE.x + 0.6, z1: SITE.z + 0.6 } }));
write("night", exportScene(buildNight(), { id: "night", ground: { x0: -0.4, z0: -0.4, x1: NIGHT.x + 0.4, z1: NIGHT.z + 0.4 } }), toNight);
console.log(`done in ${Date.now() - started} ms`);
