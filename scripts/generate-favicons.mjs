/**
 * Resize/convert only the approved square PNG. Never reconstruct the artwork.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const master = readFileSync(resolve(root, 'public/branding/quotexbert-qx-icon.png'));

async function resizeIcon(size) {
  return sharp(master).resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.png', size: 32 },
];

for (const { name, size } of sizes) {
  writeFileSync(resolve(root, 'public', name), await resizeIcon(size));
  console.log(`Converted ${name} (${size}x${size})`);
}

// Keep existing SVG URLs compatible without tracing or inventing vector paths.
const embeddedPng = await resizeIcon(64);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="QuoteXbert QX icon"><image width="64" height="64" href="data:image/png;base64,${embeddedPng.toString('base64')}"/></svg>\n`;
for (const name of ['favicon.svg', 'icon.svg']) {
  writeFileSync(resolve(root, 'public', name), svg);
}

const frameSizes = [16, 32, 48];
const frames = await Promise.all(frameSizes.map(resizeIcon));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (const [index, frame] of frames.entries()) {
  const entry = 6 + index * 16;
  header[entry] = header[entry + 1] = frameSizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
}
writeFileSync(resolve(root, 'app', 'favicon.ico'), Buffer.concat([header, ...frames]));
console.log('Converted existing browser and web app icons; original PNG master unchanged.');
