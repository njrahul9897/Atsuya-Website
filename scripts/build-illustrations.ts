// Draws the modelled scenes in /illustrations as isometric vector art.
//   npm run build:illustrations
// Static layers are written to public/illustrations as SVG images; the animated layers and the
// stacking order go to illustrations/generated, which the page imports.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { exportScene } from "../illustrations/export";
import { buildSite, SITE } from "../illustrations/model/site";

const root = process.cwd();
const publicDir = join(root, "public", "illustrations");
const generatedDir = join(root, "illustrations", "generated");
mkdirSync(publicDir, { recursive: true });
mkdirSync(generatedDir, { recursive: true });

// Clear the last run: the number of layers can change.
for (const file of readdirSync(publicDir)) if (/^site(-\d+)?\.svg$/.test(file)) rmSync(join(publicDir, file));

const started = Date.now();
const site = exportScene(buildSite(), { id: "site", ground: { x0: -0.6, z0: -0.6, x1: SITE.x + 0.6, z1: SITE.z + 0.6 } });

let images = 0;
const layers = site.layers.map((layer) => {
  if (layer.kind === "inline") return layer;
  const name = `site-${images++}.svg`;
  writeFileSync(join(publicDir, name), layer.svg);
  return { kind: "image" as const, src: `/illustrations/${name}`, bytes: layer.svg.length };
});
writeFileSync(join(publicDir, "site.svg"), site.flat);
writeFileSync(join(generatedDir, "site.json"), JSON.stringify({ viewBox: site.viewBox, layers }, null, 1) + "\n");

const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;
console.log(`site: ${site.stats.nodes} nodes, ${site.stats.cycles} cycles, ${site.stats.layers} layers, ${Date.now() - started} ms`);
for (const layer of layers) console.log(layer.kind === "image" ? `  image  ${layer.src}  ${kb(layer.bytes)}` : `  inline ${kb(layer.markup.length)}`);
console.log(`  flat   /illustrations/site.svg  ${kb(site.flat.length)}`);
