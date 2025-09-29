// Simple offline-first service worker for NutriMeal
const CACHE_NAME = 'nutrimeal-cache-v2';

// DEV kill-switch: if running on localhost, immediately unregister and clear caches
if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
      // Clear all caches
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      // Unregister this SW
      await self.registration.unregister();
      // Refresh all controlled clients to drop SW control
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach((client) => client.navigate(client.url));
    })());
  });

  // No fetch handling in dev
  self.addEventListener('fetch', () => {});
}
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/vite.svg',
];

self.addEventListener('install', (event) => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') return;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') return;
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? undefined : caches.delete(k)))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') return;
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-HTTP(S) requests (e.g., chrome-extension://) and non-GET methods
  if ((url.protocol !== 'http:' && url.protocol !== 'https:') || req.method !== 'GET') {
    return; // let the browser handle it
  }
  // Network-first for API calls, cache-first for others
  if (req.url.includes('openfoodfacts.org')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        // Only cache successful basic (same-origin) responses
        try {
          const copy = res.clone();
          if (copy && copy.ok && copy.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
        } catch (_) { /* ignore caching errors */ }
        return res;
      }).catch(() => caches.match('/index.html'))
    )
  );
});
