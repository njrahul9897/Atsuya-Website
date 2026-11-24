// Draws the modelled scenes in /illustrations as isometric vector art.
//   npm run build:illustrations
// Static layers are written to public/illustrations as SVG images; the animated layers and the
// stacking order go to illustrations/generated, which the page imports.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { exportScene, type Exported } from "../illustrations/export";
import { buildSite, SITE } from "../illustrations/model/site";
import { buildOps, OPS } from "../illustrations/model/ops";

const root = process.cwd();
const publicDir = join(root, "public", "illustrations");
const generatedDir = join(root, "illustrations", "generated");
mkdirSync(publicDir, { recursive: true });
mkdirSync(generatedDir, { recursive: true });
const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

function write(id: string, scene: Exported) {
  // Clear the last run: the number of layers can change.
  for (const file of readdirSync(publicDir)) if (new RegExp(`^${id}(-\\d+)?\\.svg$`).test(file)) rmSync(join(publicDir, file));
  let images = 0;
  const layers = scene.layers.map((layer) => {
    if (layer.kind === "inline") return { kind: "inline" as const, markup: layer.markup };
    const name = `${id}-${images++}.svg`;
    const svg = layer.svg;
    writeFileSync(join(publicDir, name), svg);
    return { kind: "image" as const, src: `/illustrations/${name}`, bytes: svg.length };
  });
  const flat = scene.flat;
  writeFileSync(join(publicDir, `${id}.svg`), flat);
  writeFileSync(join(generatedDir, `${id}.json`), JSON.stringify({ viewBox: scene.viewBox, anchors: scene.anchors, layers }, null, 1) + "\n");
  console.log(`${id}: ${scene.stats.nodes} nodes, ${scene.stats.cycles} cycles, ${scene.stats.layers} layers`);
  for (const layer of layers) console.log(layer.kind === "image" ? `  image  ${layer.src}  ${kb(layer.bytes)}` : `  inline ${kb(layer.markup.length)}`);
  console.log(`  flat   /illustrations/${id}.svg  ${kb(flat.length)}`);
}

const started = Date.now();
write("site", exportScene(buildSite(), { id: "site", ground: { x0: -0.6, z0: -0.6, x1: SITE.x + 0.6, z1: SITE.z + 0.6 } }));
write("ops", exportScene(buildOps(), { id: "ops", ground: { x0: -0.4, z0: -0.4, x1: OPS.x + 0.4, z1: OPS.z + 0.4 } }));
console.log(`done in ${Date.now() - started} ms`);
