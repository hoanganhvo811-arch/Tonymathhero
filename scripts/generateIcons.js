import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal pure-Node PNG encoder without external binaries
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(crcData), 8 + len);
  return chunk;
}

function createPng(width, height, getRgbaPixel) {
  // 1. Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // 2. IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  // 3. Scanlines with Filter 0 (None)
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getRgbaPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = writeChunk('IDAT', compressedData);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Fantasy Shield Artist function for high quality PNG icon rendering
function heroIconPixelShader(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background Dark Slate / Navy Blue
  let r = 15, g = 23, b = 42, a = 255;
  if (!isMaskable && dist > 0.94) {
    // Rounded corner cutout for standard icon
    const cornerRadius = 0.44;
    const qx = Math.max(0, Math.abs(dx) - (1 - cornerRadius));
    const qy = Math.max(0, Math.abs(dy) - (1 - cornerRadius));
    const cornerDist = Math.sqrt(qx * qx + qy * qy);
    if (cornerDist > cornerRadius) {
      return [0, 0, 0, 0];
    }
  }

  // Radial dark background gradient
  const bgGrad = 1 - Math.min(dist * 0.5, 0.7);
  r = Math.round(24 * bgGrad);
  g = Math.round(36 * bgGrad);
  b = Math.round(58 * bgGrad);

  // Scale for shield
  const scale = isMaskable ? 0.72 : 0.85;
  const sx = dx / scale;
  const sy = (dy + 0.04) / scale;

  // Mathematical Shield Boundary Formula:
  // Top: sy > -0.65
  // Sides: |sx| < 0.65 - 0.25 * (sy + 0.65) when sy <= 0.1
  // Bottom taper: |sx| < 0.65 * (0.8 - sy) when sy > 0.1
  let inShield = false;
  let inGoldRim = false;
  let inInnerShield = false;

  const topLimit = -0.68;
  const bottomLimit = 0.82;

  if (sy >= topLimit && sy <= bottomLimit) {
    let maxWidth = 0.62;
    if (sy < 0.0) {
      maxWidth = 0.56 + 0.08 * (1 - Math.abs(sy + 0.3) * 2);
    } else {
      const t = (sy - 0.0) / 0.82;
      maxWidth = 0.64 * Math.max(0, 1 - Math.pow(t, 1.4));
    }

    if (Math.abs(sx) <= maxWidth) {
      inShield = true;
      if (Math.abs(sx) >= maxWidth - 0.09 || sy <= topLimit + 0.09) {
        inGoldRim = true;
      } else {
        inInnerShield = true;
      }
    }
  }

  // Draw Shield
  if (inGoldRim) {
    // Radiant Golden Rim
    const goldGrad = 0.5 + 0.5 * (1 - sy);
    r = Math.round(250 * goldGrad + 254 * (1 - goldGrad));
    g = Math.round(204 * goldGrad + 180 * (1 - goldGrad));
    b = Math.round(21 * goldGrad + 10 * (1 - goldGrad));
  } else if (inInnerShield) {
    // Royal Blue Shield Face
    const blueGrad = 0.5 + 0.5 * (1 - (sy + 0.5));
    r = Math.round(2 + 20 * blueGrad);
    g = Math.round(132 * blueGrad);
    b = Math.round(199 * blueGrad + 40);

    // Center Star Crest (Cross / Diamond Star)
    const starDist = Math.abs(sx) + Math.abs(sy + 0.05);
    if (starDist < 0.22) {
      // Golden 8-pointed core
      r = 254;
      g = 240;
      b = 138;
      if (starDist < 0.08) {
        // Emerald core jewel
        r = 16;
        g = 185;
        b = 129;
      }
    }

    // Crossed Swords Hilts / Crown
    if (sy < -0.38 && Math.abs(sx) < 0.25) {
      r = 250;
      g = 204;
      b = 21;
    }
  } else {
    // Ambient floating golden magic stars
    if (Math.abs(dist - 0.88) < 0.02) {
      r = Math.round(r + 40);
      g = Math.round(g + 35);
      b = Math.round(b + 5);
    }
  }

  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), a];
}

console.log('Rendering PWA PNG Icons...');

// 1. icon-192.png
const png192 = createPng(192, 192, (x, y, w, h) => heroIconPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
console.log('✓ Generated public/icons/icon-192.png (192x192)');

// 2. icon-512.png
const png512 = createPng(512, 512, (x, y, w, h) => heroIconPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
console.log('✓ Generated public/icons/icon-512.png (512x512)');

// 3. icon-maskable-512.png
const pngMaskable = createPng(512, 512, (x, y, w, h) => heroIconPixelShader(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), pngMaskable);
console.log('✓ Generated public/icons/icon-maskable-512.png (512x512 maskable)');

// 4. apple-touch-icon.png (180x180)
const pngApple = createPng(180, 180, (x, y, w, h) => heroIconPixelShader(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), pngApple);
console.log('✓ Generated public/icons/apple-touch-icon.png (180x180)');

console.log('🎉 ALL PWA PNG ICONS GENERATED SUCCESSFULLY!');
