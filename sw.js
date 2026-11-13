/* OrlandoChrome · Offline-First Service Worker (PWA Ready) */
const CACHE_NAME = 'orlandochrome-pwa-v76';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=pure76',
  './qrcode.min.js',
  './app.js?v=pure76',
  './sound.js?v=pure76',
  './oc-logo.png',
  './oc-logo.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  './favicon.ico',
  './favicon-32.png',
  './favicon-16.png',
  './manifest.json',
  './manifest.json?v=pure76'
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
