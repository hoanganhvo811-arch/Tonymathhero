// TONY MATH HERO – Progressive Web App Service Worker (v23.0.0)
const CACHE_NAME = 'tony-math-hero-v23.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Precache warning:', err);
      });
    })
  );
});

// Activate: Clean old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME && k.startsWith('tony-math-hero-'))
            .map((k) => {
              console.log('[PWA SW] Removing outdated cache:', k);
              return caches.delete(k);
            })
        );
      }),
    ])
  );
});

// Fetch: Network-first for navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests or unsupported schemes (like chrome-extension://)
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline fallback
          const cache = await caches.open(CACHE_NAME);
          const cachedNavigate = (await cache.match(req)) || (await cache.match('./index.html')) || (await cache.match('./'));
          if (cachedNavigate) return cachedNavigate;
          return new Response(
            '<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#0f172a;color:#fff;"><h1>⚡ TONY MATH HERO - Ngoại Tuyến</h1><p>Ứng dụng đang hoạt động không có mạng. Vui lòng mở trang chính.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Google Fonts & Fonts Static
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const networkRes = await fetch(req);
          if (networkRes.status === 200) {
            cache.put(req, networkRes.clone());
          }
          return networkRes;
        } catch {
          return cached || new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // 3. Static Assets (Scripts, CSS, Images, Audio, Icons)
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        // Fetch in background to update cache (stale-while-revalidate for local assets)
        fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
            }
          })
          .catch(() => {});
        return cachedRes;
      }

      // Not in cache: fetch from network and cache
      return fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // Fallback if image
          if (req.destination === 'image') {
            return caches.match('./icons/icon.svg');
          }
          return new Response('Offline asset unavailable', { status: 503 });
        });
    })
  );
});

// Messages from UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
