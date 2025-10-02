#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { packAsync } from "free-tex-packer-core";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printUsageAndExit() {
  console.log(
    "Usage: node scripts/pack-sprites.mjs --input <dir> --out <outDir> [--name <atlasName>] [--pot] [--size <N>]"
  );
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (key === "--input") args.input = argv[++i];
    else if (key === "--out") args.out = argv[++i];
    else if (key === "--name") args.name = argv[++i];
    else if (key === "--size") args.size = Number(argv[++i]);
    else if (key === "--pot") args.pot = true;
    else if (key === "-h" || key === "--help") printUsageAndExit();
  }
  return args;
}

function isPng(file) {
  return /(\.png)$/i.test(file);
}

function readPngFilesRecursive(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...readPngFilesRecursive(abs, baseDir));
    else if (entry.isFile() && isPng(entry.name)) {
      const rel = path.relative(baseDir, abs).replace(/\\/g, "/");
      files.push({ path: rel, contents: fs.readFileSync(abs) });
    }
  }
  return files;
}

function buildAnimationsMap(filePaths) {
  // Detect sequences by filename: prefix + optional '_' or '-' + number, e.g. fighter_run_0021.png or fighter_wallslide0083.png
  const seqRegex = /^(.*?)(?:[_-]?)(\d+)\.png$/i;
  /** @type {Record<string, string[]>} */
  const animations = {};
  for (const rel of filePaths) {
    const basename = path.basename(rel);
    const match = basename.match(seqRegex);
    if (!match) continue;
    const prefixRaw = match[1];
    const prefix = prefixRaw.replace(/[_-]$/, "");
    const key = prefix; // animation key
    if (!animations[key]) animations[key] = [];
    animations[key].push(basename.replace(/\\/g, "/"));
  }
  // Sort frames within each animation by numeric index in filename
  const indexRegex = /(\d+)(?=\.png$)/;
  for (const key of Object.keys(animations)) {
    animations[key].sort((a, b) => {
      const ia = Number(a.match(indexRegex)?.[0] ?? 0);
      const ib = Number(b.match(indexRegex)?.[0] ?? 0);
      return ia - ib;
    });
  }
  return animations;
}

async function main() {
  const args = parseArgs(process.argv);
  const inputDir =
    args.input || path.resolve(__dirname, "../examples/sprites/stickman/Fighter sprites");
  const outDir = args.out || path.resolve(__dirname, "../dist/atlases");
  const atlasName = args.name || "fighter";
  const maxSize = Number.isFinite(args.size) ? Math.max(64, args.size) : 2048;
  const powerOfTwo = Boolean(args.pot ?? true);

  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    printUsageAndExit();
  }

  fs.mkdirSync(outDir, { recursive: true });

  const files = readPngFilesRecursive(inputDir);
  if (files.length === 0) {
    console.error(`No PNG files found under: ${inputDir}`);
    process.exit(2);
  }

  const animations = buildAnimationsMap(files.map((f) => f.path));

  const options = {
    textureName: atlasName,
    width: maxSize,
    height: maxSize,
    fixedSize: false,
    powerOfTwo,
    padding: 2,
    extrude: 1,
    allowRotation: false,
    detectIdentical: true,
    allowTrim: true,
    trimMode: "trim",
    removeFileExtension: false,
    prependFolderName: false,
    exporter: "Pixi",
    packer: "MaxRectsPacker",
    packerMethod: "Smart",
    basis: false,
    tinify: false,
    // JSON formatting
    pretty: true,
  };

  console.log(`Packing ${files.length} sprites from ${inputDir} → ${outDir}/${atlasName}.png|json`);

  const outFiles = await packAsync(files, options);

  // Write files and inject animations into JSON
  for (const out of outFiles) {
    const outPath = path.join(outDir, out.name);
    if (out.name.endsWith(".json")) {
      const json = JSON.parse(out.buffer.toString("utf-8"));
      // Attach animations using frame names present in the atlas
      const inAtlas = new Set(Object.keys(json.frames || {}));
      const animationsFiltered = {};
      for (const [key, frames] of Object.entries(animations)) {
        const existing = frames.filter((f) => inAtlas.has(f));
        if (existing.length > 1) animationsFiltered[key] = existing;
      }
      json.animations = animationsFiltered;
      fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
    } else {
      fs.writeFileSync(outPath, out.buffer);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
