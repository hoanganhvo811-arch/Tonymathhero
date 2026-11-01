import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcHtml = path.join(rootDir, 'dist', 'index.html');
const destDistHtml = path.join(rootDir, 'dist', 'tony-math-hero.html');
const destRootHtml = path.join(rootDir, 'tony-math-hero.html');

if (fs.existsSync(srcHtml)) {
  fs.copyFileSync(srcHtml, destDistHtml);
  fs.copyFileSync(srcHtml, destRootHtml);
  const sizeKb = (fs.statSync(destRootHtml).size / 1024).toFixed(1);

  // Copy icons and manifest to root if running locally via file:///
  const publicIcons = path.join(rootDir, 'public', 'icons');
  const rootIcons = path.join(rootDir, 'icons');
  if (fs.existsSync(publicIcons)) {
    fs.cpSync(publicIcons, rootIcons, { recursive: true });
  }
  const publicManifest = path.join(rootDir, 'public', 'manifest.webmanifest');
  const rootManifest = path.join(rootDir, 'manifest.webmanifest');
  if (fs.existsSync(publicManifest)) {
    fs.copyFileSync(publicManifest, rootManifest);
  }

  console.log(`\n🎉 ĐÃ ĐÓNG GÓI THÀNH CÔNG TONY MATH HERO (PHASE 23 - PWA & MULTI-PLATFORM)!`);
  console.log(`📦 Bản PWA Production (Deploy Hosting): ${path.join(rootDir, 'dist')}`);
  console.log(`   ├── index.html (PWA App Shell - ${sizeKb} KB)`);
  console.log(`   ├── manifest.webmanifest (Web App Manifest)`);
  console.log(`   ├── sw.js (Offline Cache Service Worker)`);
  console.log(`   └── icons/ (192px, 512px, maskable, apple-touch-icon)`);
  console.log(`📦 Bản HTML Độc lập (Chơi Offline không cần server):`);
  console.log(`   👉 ${destRootHtml} (${sizeKb} KB)`);
  console.log(`   Double-click trực tiếp file "tony-math-hero.html" để chơi ngay!\n`);
} else {
  console.error('Không tìm thấy file dist/index.html!');
}
