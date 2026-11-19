/* OrlandoChrome · Offline-First Service Worker (PWA Ready) */
const CACHE_NAME = 'orlandochrome-arcade-v354';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=arcade354',
  './game.js?v=arcade354',
  './qrcode.min.js',
  './app.js?v=arcade354',
  './sound.js?v=pure240',
  './oc-logo.png',
  './oc-logo.svg',
  './oc-logo.png?v=oc314',
  './oc-logo.svg?v=oc314',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  './favicon.ico',
  './favicon-32.png',
  './favicon-16.png',
  './manifest.json',
  './manifest.json?v=oc314'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Always bypass live cloud sync streams (Google Firebase Firestore & ntfy)
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('ntfy.sh')) return;
  
  // Navigation requests: always fetch fresh from network to prevent stale HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

/* OrlandoChrome v100 Centennial Service Worker Background Storage Guard */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'STORE_MASTER_BACKUP') {
    event.waitUntil(
      caches.open('orlandochrome-master-backup-v1').then((cache) => {
        return cache.put(
          new Request('/__orlandochrome_master_state.json'),
          new Response(JSON.stringify(event.data.payload), {
            headers: {
              'Content-Type': 'application/json',
              'X-Backup-Timestamp': String(Date.now()),
              'X-Centennial-Version': 'v100'
            }
          })
        );
      }).catch(() => {})
    );
  }
});
