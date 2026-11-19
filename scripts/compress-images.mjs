/**
 * scripts/compress-images.mjs — recompress the raster assets in /public in place.
 *
 * CHANGE: 2026-11-19 — added during the "images / fonts / Edge CPU" fix.
 *
 * Run:  node scripts/compress-images.mjs            (scripts/optimize:images)
 *       node scripts/compress-images.mjs --dry-run  (report only)
 *
 * Design decisions (see docs/HISTORY.md §18):
 *  - Filenames are NEVER changed. Every image path is a public contract: it is
 *    referenced from page TSX, Tailwind `bg-[url()]` classes, MongoDB-seeded module
 *    documents, JSON-LD and email HTML. A rename would silently break all of them.
 *  - The real format is detected from the bytes, not the extension: several legacy
 *    files (e.g. assets/images/1523381210434-*.jpg) are actually PNG data.
 *  - Two PNG candidates are compared: palette-quantised and lossless. The smaller
 *    wins. Palette PNG keeps alpha and is visually fine at q92 for these graphics.
 *  - website-thumbnail.png and video-thumbnail.jpg are SKIPPED. Their exact bytes /
 *    dimensions / colour type are asserted by the SEO work (AGENTS §5.2), and they
 *    are served `immutable` for a year.
 *  - A candidate is only written if it decodes cleanly at the original dimensions
 *    AND is smaller than the original. Nothing is half-written (rename is atomic).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public');
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP = new Set(['website-thumbnail.png', 'video-thumbnail.jpg']);
const EXT_RE = /\.(png|jpe?g|webp)$/i;
const MIN_BYTES = 4 * 1024; // tiny files have nothing to gain and only churn git

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT_RE.test(entry.name)) yield full;
  }
}

async function candidate(input, format, hasAlpha) {
  if (format === 'jpeg') {
    // mozjpeg produces ~10-15% smaller files than libjpeg at the same quality.
    // Flatten transparency onto white — JPEG has no alpha channel.
    let pipe = sharp(input, { limitInputPixels: false });
    if (hasAlpha) pipe = pipe.flatten({ background: '#ffffff' });
    return pipe.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();
  }
  if (format === 'webp') {
    return sharp(input, { limitInputPixels: false }).webp({ quality: 82 }).toBuffer();
  }
  // PNG: compare palette vs lossless and keep the smaller one.
  const lossless = await sharp(input, { limitInputPixels: false })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  const palette = await sharp(input, { limitInputPixels: false })
    .png({ palette: true, quality: 92, effort: 10 })
    .toBuffer();
  return palette.length < lossless.length ? palette : lossless;
}

const files = [...walk(ROOT)];
let totalBefore = 0;
let totalAfter = 0;
let changed = 0;

for (const file of files) {
  if (SKIP.has(path.basename(file))) continue;
  const before = fs.statSync(file);
  if (before.size < MIN_BYTES) continue;

  let meta;
  try {
    meta = await sharp(file, { limitInputPixels: false }).metadata();
  } catch {
    console.log(`SKIP (unreadable) ${path.relative(process.cwd(), file)}`);
    continue;
  }
  const format = meta.format; // 'jpeg' | 'png' | 'webp'
  if (!['jpeg', 'png', 'webp'].includes(format)) continue;

  let out;
  try {
    out = await candidate(file, format, Boolean(meta.hasAlpha));
    const check = await sharp(out, { limitInputPixels: false }).metadata();
    if (check.width !== meta.width || check.height !== meta.height) {
      throw new Error(`dimension drift ${meta.width}x${meta.height} -> ${check.width}x${check.height}`);
    }
  } catch (err) {
    console.log(`SKIP (${err.message}) ${path.relative(process.cwd(), file)}`);
    continue;
  }

  totalBefore += before.size;
  if (out.length >= before.size) {
    totalAfter += before.size;
    console.log(`KEEP  ${String(Math.round(out.length / 1024)).padStart(5)}KB ${path.relative(process.cwd(), file)}`);
    continue;
  }
  totalAfter += out.length;
  changed++;
  const rel = path.relative(process.cwd(), file);
  if (DRY_RUN) {
    console.log(`DRY   ${String(Math.round(before.size / 1024)).padStart(5)}KB -> ${String(Math.round(out.length / 1024)).padStart(5)}KB ${rel}`);
  } else {
    const tmp = `${file}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, out);
    fs.renameSync(tmp, file);
    console.log(`OPT   ${String(Math.round(before.size / 1024)).padStart(5)}KB -> ${String(Math.round(out.length / 1024)).padStart(5)}KB ${rel}`);
  }
}

const saved = totalBefore - totalAfter;
console.log(`\n${changed} file(s) ${DRY_RUN ? 'would be' : 'were'} optimised. ` +
  `${(totalBefore / 1048576).toFixed(1)}MB -> ${(totalAfter / 1048576).toFixed(1)}MB ` +
  `(${(100 * saved / (totalBefore || 1)).toFixed(1)}% saved).`);
