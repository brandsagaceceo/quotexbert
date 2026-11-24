import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const branding = new URL('../public/branding/', import.meta.url);

for (const name of ['quotexbert-qx-icon', 'quotexbert-wordmark']) {
  const { data, info } = await sharp(fileURLToPath(new URL(`${name}.png`, branding)))
    .trim({ threshold: 0 })
    .extend({
      top: 1, bottom: 1, left: 1, right: 1,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(new URL(`${name}-display.webp`, branding), data);
  console.log(`${name}-display.webp: ${info.width}x${info.height}, ${data.length} bytes`);
}
