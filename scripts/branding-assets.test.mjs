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

async function assertResizedMaster(actualPng, size) {
  const expected = await sharp(fileURLToPath(new URL('quotexbert-qx-icon.png', branding)))
    .resize(size, size).ensureAlpha().raw().toBuffer();
  const actual = await sharp(actualPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(actual.info.width, size);
  assert.equal(actual.info.height, size);
  assert.deepEqual(actual.data, expected);
}

test('all browser and web app icons are direct resizes of the approved square PNG', async () => {
  const publicDir = new URL('../public/', import.meta.url);
  for (const [name, size] of [
    ['favicon-16x16.png', 16], ['favicon-32x32.png', 32],
    ['favicon-192x192.png', 192], ['favicon-512x512.png', 512],
    ['apple-touch-icon.png', 180], ['favicon.png', 32],
  ]) {
    await assertResizedMaster(await readFile(new URL(name, publicDir)), size);
  }
  for (const name of ['favicon.svg', 'icon.svg']) {
    const svg = await readFile(new URL(name, publicDir), 'utf8');
    const embedded = svg.match(/data:image\/png;base64,([^"]+)/);
    assert.ok(embedded, name);
    assert.equal(svg.includes('<path'), false, 'No reconstructed lettering');
    await assertResizedMaster(Buffer.from(embedded[1], 'base64'), 64);
  }
  const ico = await readFile(new URL('../app/favicon.ico', import.meta.url));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (let index = 0; index < 3; index++) {
    const entry = 6 + index * 16;
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    await assertResizedMaster(ico.subarray(offset, offset + length), [16, 32, 48][index]);
  }
});

test('manifest points to the converted QX icons without claiming unprepared maskable assets', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.theme_color, '#800020');
  assert.deepEqual(manifest.icons.map(icon => [icon.src, icon.sizes, icon.purpose]), [
    ['/favicon-192x192.png?v=qx', '192x192', 'any'],
    ['/favicon-512x512.png?v=qx', '512x512', 'any'],
  ]);
});

test('the legacy logo URL resolves to the approved QX icon', async () => {
  const publicDir = new URL('../public/', import.meta.url);
  assert.deepEqual(
    await readFile(new URL('logo.svg', publicDir)),
    await readFile(new URL('icon.svg', publicDir)),
  );
});
