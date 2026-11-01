// Comprehensive Automated Verification Suite for Phase 23 (Cross-Platform Packaging & PWA Release)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pwaService } from '../services/pwa/pwaService';
import { detectDevice } from '../services/pwa/usePwaStore';
import { createDefaultSettings } from '../services/persistence/persistenceService';
import { persistenceService } from '../services/persistence/persistenceService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

async function runPhase23Tests() {
  console.log('🧪 Starting Phase 23 (Cross-Platform Packaging & PWA Release) Test Suite...\n');

  // TEST 1: Web App Manifest
  console.log('Test 1: Web App Manifest Verification');
  const manifestPath = path.join(rootDir, 'public', 'manifest.webmanifest');
  assert(fs.existsSync(manifestPath), 'manifest.webmanifest must exist');
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestRaw);

  assert(manifest.name === 'TONY MATH HERO – The Legend of Seven Kingdoms', 'Manifest name must match official title');
  assert(manifest.short_name === 'TONY MATH HERO', 'Manifest short_name must be TONY MATH HERO');
  assert(manifest.display === 'standalone', 'Display mode must be standalone');
  assert(manifest.theme_color === '#0f172a', 'Theme color must match dark slate #0f172a');
  assert(manifest.background_color === '#070b14', 'Background color must match #070b14');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'Must have at least 4 icons');
  assert(manifest.icons.some((i: any) => i.sizes === '192x192'), 'Must have 192x192 icon');
  assert(manifest.icons.some((i: any) => i.sizes === '512x512'), 'Must have 512x512 icon');
  assert(manifest.icons.some((i: any) => i.purpose === 'maskable'), 'Must have maskable icon for Android adaptive icons');
  console.log('✅ Passed Test 1: Web App Manifest verified.');

  // TEST 2: App Icons File Integrity
  console.log('\nTest 2: App Icons File Integrity & Signatures');
  const icons = [
    'public/favicon.svg',
    'public/icons/icon-192.png',
    'public/icons/icon-512.png',
    'public/icons/icon-maskable-512.png',
    'public/icons/apple-touch-icon.png',
    'public/icons/icon.svg',
    'public/icons/icon-maskable.svg',
  ];

  for (const relPath of icons) {
    const fullPath = path.join(rootDir, relPath);
    assert(fs.existsSync(fullPath), `Icon file ${relPath} must exist`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 100, `Icon file ${relPath} must not be empty`);

    if (relPath.endsWith('.png')) {
      const buf = fs.readFileSync(fullPath);
      // Verify PNG magic bytes: 89 50 4E 47
      assert(
        buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47,
        `File ${relPath} must be a valid PNG image with standard magic header`
      );
    }
  }
  console.log('✅ Passed Test 2: All 7 App Icons verified with valid headers.');

  // TEST 3: Service Worker Integrity
  console.log('\nTest 3: Service Worker (sw.js) Offline Caching Engine');
  const swPath = path.join(rootDir, 'public', 'sw.js');
  assert(fs.existsSync(swPath), 'public/sw.js must exist');
  const swCode = fs.readFileSync(swPath, 'utf-8');

  assert(swCode.includes('tony-math-hero-v23.0.0'), 'Cache name must be versioned to v23.0.0');
  assert(swCode.includes("addEventListener('install'"), 'SW must handle install event');
  assert(swCode.includes("addEventListener('activate'"), 'SW must handle activate event');
  assert(swCode.includes("addEventListener('fetch'"), 'SW must handle fetch event');
  assert(swCode.includes('navigate'), 'SW must have navigation fallback for offline access');
  assert(swCode.includes('fonts.googleapis.com'), 'SW must cache Google Fonts for offline Vietnamese typography');
  console.log('✅ Passed Test 3: Service Worker precache & runtime offline strategies verified.');

  // TEST 4: PWA Service & Offline Readiness Modules
  console.log('\nTest 4: PWA Service & Offline Readiness Assessment');
  const readiness = await pwaService.checkOfflineReadiness();
  assert(readiness.isReady === true, 'Offline readiness must be true');
  assert(readiness.modules.length === 5, 'Must assess all 5 core game modules');
  assert(
    readiness.modules.every((m) => m.status === 'ready' || m.status === 'cached'),
    'All modules must be ready or cached'
  );

  const estimate = await pwaService.getStorageEstimate();
  assert(estimate.usageBytes > 0, 'Storage usage estimate must be positive');
  assert(typeof estimate.formattedUsage === 'string', 'Formatted usage must be string');
  console.log(`✅ Passed Test 4: PWA Service reports: ${estimate.formattedUsage}, all modules ready.`);

  // TEST 5: Responsive & Adaptive Graphics Presets
  console.log('\nTest 5: Device Detection & Adaptive Graphics Presets');
  const device = detectDevice();
  assert(typeof device.isMobile === 'boolean', 'isMobile must be boolean');
  assert(typeof device.isDesktop === 'boolean', 'isDesktop must be boolean');

  const defaultSettings = createDefaultSettings();
  assert(['cinematic', 'high', 'medium', 'low'].includes(defaultSettings.graphicsQuality), 'Must have valid graphics preset');
  assert(defaultSettings.particlesEnabled === true, 'Particles enabled by default');
  console.log(`✅ Passed Test 5: Device detection functional, default graphics quality is "${defaultSettings.graphicsQuality}".`);

  // TEST 6: Deployment & Hosting Config (Vercel & Netlify)
  console.log('\nTest 6: Hosting & Deployment Readiness Configuration');
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
  assert(Array.isArray(vercelConfig.rewrites), 'vercel.json must have SPA rewrites');

  const redirectsPath = path.join(rootDir, 'public', '_redirects');
  assert(fs.existsSync(redirectsPath), 'public/_redirects must exist');
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
  assert(redirectsContent.includes('/index.html'), '_redirects must redirect to /index.html 200');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert(indexHtml.includes('manifest.webmanifest'), 'index.html must link manifest.webmanifest');
  assert(indexHtml.includes('viewport-fit=cover'), 'index.html must support viewport-fit=cover for iPhone safe areas');
  assert(indexHtml.includes('apple-mobile-web-app-capable'), 'index.html must have apple-mobile-web-app-capable');
  console.log('✅ Passed Test 6: Hosting configs (Vercel, Netlify) & HTML PWA meta tags verified.');

  // TEST 7: Save System Backup & Cross-Platform Restore
  console.log('\nTest 7: Cross-Platform Data Backup & Restore');
  const backupJson = persistenceService.exportBackupData();
  assert(backupJson.includes('22.0.0'), 'Backup JSON must contain schemaVersion 22.0.0');
  const restoreRes = persistenceService.importBackupData(backupJson);
  assert(restoreRes.success === true, 'Self-import of backup must succeed');
  console.log('✅ Passed Test 7: Cross-platform backup & restore verified.');

  console.log('\n🎉 ALL 7/7 PHASE 23 CROSS-PLATFORM & PWA TESTS PASSED FLAWLESSLY! 🎉\n');
}

runPhase23Tests().catch((err) => {
  console.error('❌ Phase 23 Test Failed:', err);
  process.exit(1);
});
