#!/usr/bin/env node
// Builds the PLACEHOLDER hero clips from the two 10-second brand films.
//
//   FFMPEG=/path/to/ffmpeg node scripts/make-placeholder-videos.mjs [sourceDir]
//
// sourceDir defaults to ../Videos and must hold the two brand-film masters named below.
// Output (all without an audio track, as the brief requires):
//   public/videos/home-hero.{mp4,webm,jpg} + home-hero-720.mp4        20 s, all eight shots
//   …plus a portrait poster, {name}-mobile.jpg, for each
//   public/videos/industries/{slug}.{mp4,webm,jpg} + {slug}-720.mp4   that industry's shot,
//                                                                     slowed 2x and cross-faded
//                                                                     into a seamless loop
// When the real films arrive, drop them in under the same names (or change the paths in
// content/home.ts and content/industries.ts) and delete this script.

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.argv[2] ?? join(root, "..", "Videos"));
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const work = join(tmpdir(), "atsuya-placeholder-video");
const out = join(root, "public", "videos");

const INDUSTRY = join(src, "Brand_film_of_industrial_shots_3c0c6cf2_1080p.mp4");
const LOCATIONS = join(src, "Brand_film_shots_of_locations_d9eedefa_1080p.mp4");

// Shot boundaries in frames (24 fps), found with ffmpeg's scene detector.
const shots = {
  dairy: [INDUSTRY, 0, 58],
  manufacturing: [INDUSTRY, 58, 121],
  "quick-commerce": [INDUSTRY, 121, 179],
  retail: [INDUSTRY, 179, 240],
  qsr: [LOCATIONS, 0, 60],
  "oil-and-gas": [LOCATIONS, 60, 119],
  horeca: [LOCATIONS, 119, 179],
  "smart-buildings": [LOCATIONS, 179, 240],
};

// The order the brief gives for the home film.
const homeOrder = ["manufacturing", "quick-commerce", "qsr", "smart-buildings", "oil-and-gas", "dairy", "retail", "horeca"];

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const mb = (file) => `${(statSync(file).size / 1024 / 1024).toFixed(2)} MB`;

for (const file of [INDUSTRY, LOCATIONS]) {
  if (!existsSync(file)) {
    console.error(`Missing source film: ${file}`);
    process.exit(1);
  }
}

rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
mkdirSync(join(out, "industries"), { recursive: true });

// A 9:16 centre crop of the first frame: the poster phones get, so it is not upscaled to cover.
const PORTRAIT = "crop=608:1080:(iw-608)/2:0,scale=720:1280:flags=lanczos";

const x264 = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-an"];
const vp9 = ["-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-row-mt", "1", "-deadline", "good", "-cpu-used", "3", "-an"];

// 1. Cut each shot to a near-lossless intermediate.
for (const [slug, [file, from, to]] of Object.entries(shots)) {
  run(["-i", file, "-an", "-vf", `trim=start_frame=${from}:end_frame=${to},setpts=PTS-STARTPTS`, "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", join(work, `${slug}.mkv`)]);
}

// 2. Home film: all eight shots, in the brief's order.
{
  const inputs = homeOrder.flatMap((slug) => ["-i", join(work, `${slug}.mkv`)]);
  const concat = `${homeOrder.map((_, i) => `[${i}:v]`).join("")}concat=n=${homeOrder.length}:v=1:a=0`;
  const master = join(work, "home.mkv");
  run([...inputs, "-filter_complex", `${concat}[v]`, "-map", "[v]", "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", master]);

  const base = join(out, "home-hero");
  run(["-i", master, ...x264, "-preset", "slow", "-b:v", "2150k", "-maxrate", "2600k", "-bufsize", "5200k", `${base}.mp4`]);
  run(["-i", master, ...vp9, "-b:v", "1650k", "-minrate", "800k", "-maxrate", "2400k", `${base}.webm`]);
  run(["-i", master, "-vf", "scale=1280:720", ...x264, "-preset", "slow", "-b:v", "880k", "-maxrate", "1100k", "-bufsize", "2200k", `${base}-720.mp4`]);
  run(["-i", master, "-frames:v", "1", "-q:v", "3", `${base}.jpg`]);
  run(["-i", master, "-frames:v", "1", "-vf", PORTRAIT, "-q:v", "4", `${base}-mobile.jpg`]);
  console.log(`home-hero  mp4 ${mb(`${base}.mp4`)}  webm ${mb(`${base}.webm`)}  720p ${mb(`${base}-720.mp4`)}`);
}

// 3. Industry loops: 2x motion-interpolated slow motion, tail cross-faded into the head.
const FADE = 0.5;
for (const [slug, [, from, to]] of Object.entries(shots)) {
  const slow = join(work, `${slug}-slow.mkv`);
  run(["-i", join(work, `${slug}.mkv`), "-vf", "setpts=2*PTS,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none", "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", slow]);

  const duration = ((to - from) * 2) / 24;
  const loop = join(work, `${slug}-loop.mkv`);
  const graph = [
    "[0:v]split=2[a][b]",
    `[a]trim=0:${FADE},setpts=PTS-STARTPTS[head]`,
    `[b]trim=${FADE}:${duration},setpts=PTS-STARTPTS[body]`,
    `[body][head]xfade=transition=fade:duration=${FADE}:offset=${(duration - 2 * FADE).toFixed(3)}[v]`,
  ].join(";");
  run(["-i", slow, "-filter_complex", graph, "-map", "[v]", "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", loop]);

  const base = join(out, "industries", slug);
  run(["-i", loop, ...x264, "-preset", "slow", "-crf", "25", "-maxrate", "3500k", "-bufsize", "7000k", `${base}.mp4`]);
  run(["-i", loop, ...vp9, "-crf", "35", "-b:v", "0", `${base}.webm`]);
  run(["-i", loop, "-vf", "scale=1280:720", ...x264, "-preset", "slow", "-crf", "27", "-maxrate", "1400k", "-bufsize", "2800k", `${base}-720.mp4`]);
  run(["-i", loop, "-frames:v", "1", "-q:v", "3", `${base}.jpg`]);
  run(["-i", loop, "-frames:v", "1", "-vf", PORTRAIT, "-q:v", "4", `${base}-mobile.jpg`]);
  console.log(`${slug.padEnd(16)} mp4 ${mb(`${base}.mp4`)}  webm ${mb(`${base}.webm`)}  720p ${mb(`${base}-720.mp4`)}`);
}

rmSync(work, { recursive: true, force: true });
console.log("Done.");
