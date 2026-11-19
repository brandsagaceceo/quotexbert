import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const branding = new URL('../public/branding/', import.meta.url);
const names = ['quotexbert-qx-icon', 'quotexbert-wordmark'];

test('display logos preserve every visible master pixel with an unclipped transparent border', async () => {
  for (const name of names) {
    const expected = await sharp(fileURLToPath(new URL(`${name}.png`, branding)))
      .trim({ threshold: 0 })
      .extend({
        top: 1, bottom: 1, left: 1, right: 1,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const actual = await sharp(fileURLToPath(new URL(`${name}-display.webp`, branding)))
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(actual.info.width, expected.info.width, name);
    assert.equal(actual.info.height, expected.info.height, name);
    for (let offset = 0; offset < expected.data.length; offset += 4) {
      assert.equal(actual.data[offset + 3], expected.data[offset + 3], `${name}: alpha at ${offset}`);
      if (expected.data[offset + 3] !== 0) {
        assert.deepEqual(actual.data.subarray(offset, offset + 3), expected.data.subarray(offset, offset + 3));
      }
    }
    const { width, height } = actual.info;
    for (let x = 0; x < width; x++) {
      assert.equal(actual.data[x * 4 + 3], 0);
      assert.equal(actual.data[((height - 1) * width + x) * 4 + 3], 0);
    }
    for (let y = 0; y < height; y++) {
      assert.equal(actual.data[y * width * 4 + 3], 0);
      assert.equal(actual.data[(y * width + width - 1) * 4 + 3], 0);
    }
  }
});

test('lossless display downloads are at least 40 percent smaller than the PNG masters', async () => {
  let masterBytes = 0;
  let displayBytes = 0;
  for (const name of names) {
    masterBytes += (await readFile(new URL(`${name}.png`, branding))).length;
    displayBytes += (await readFile(new URL(`${name}-display.webp`, branding))).length;
  }
  assert.ok(displayBytes <= masterBytes * 0.6, `${displayBytes} / ${masterBytes} bytes`);
});
