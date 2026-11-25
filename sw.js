/* OrlandoChrome · Offline-First Service Worker (PWA Ready) */
const CACHE_NAME = 'orlandochrome-arcade-v397_ult_never_freeze';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=arcade397_ult_never_freeze',
  './game.js?v=arcade397_ult_never_freeze',
  './assets/core-dynamo-t1.png?v=cores15_v1',
  './assets/core-dynamo-t2.png?v=cores15_v1',
  './assets/core-dynamo-t3.png?v=cores15_v1',
  './assets/core-dynamo-t4.png?v=cores15_v1',
  './assets/core-dynamo-t5.png?v=cores15_v1',
  './assets/core-helix-t1.png?v=cores15_v1',
  './assets/core-helix-t2.png?v=cores15_v1',
  './assets/core-helix-t3.png?v=cores15_v1',
  './assets/core-helix-t4.png?v=cores15_v1',
  './assets/core-helix-t5.png?v=cores15_v1',
  './assets/core-meteor-t1.png?v=cores15_v1',
  './assets/core-meteor-t2.png?v=cores15_v1',
  './assets/core-meteor-t3.png?v=cores15_v1',
  './assets/core-meteor-t4.png?v=cores15_v1',
  './assets/core-meteor-t5.png?v=cores15_v1',
  './assets/core-dynamo-wing-r-t2.png?v=cores15_v1',
  './assets/core-dynamo-wing-r-t3.png?v=cores15_v1',
  './assets/core-dynamo-wing-r-t4.png?v=cores15_v1',
  './assets/core-dynamo-wing-r-t5.png?v=cores15_v1',
  './assets/core-helix-wing-r-t2.png?v=cores15_v1',
  './assets/core-helix-wing-r-t3.png?v=cores15_v1',
  './assets/core-helix-wing-r-t4.png?v=cores15_v1',
  './assets/core-helix-wing-r-t5.png?v=cores15_v1',
  './assets/core-meteor-wing-r-t2.png?v=cores15_v1',
  './assets/core-meteor-wing-r-t3.png?v=cores15_v1',
  './assets/core-meteor-wing-r-t4.png?v=cores15_v1',
  './assets/core-meteor-wing-r-t5.png?v=cores15_v1',
  './assets/core-helix-glass-shell.png?v=cores15_v1',
  './assets/voidbloom-3d.png?v=arcade388_voidbloom3d',
  './assets/boss-r1-sentinel.png?v=arcade389_boss_nova',
  './assets/boss-r2-corruptor.png?v=arcade389_boss_nova',
  './assets/boss-r3-singularity.png?v=arcade389_boss_nova',
  './assets/boss-r4-tempest.png?v=arcade389_boss_nova',
  './assets/boss-r5-omega.png?v=arcade389_boss_nova',
  './assets/vfx-nova-flame-meteor.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-wisps-meteor.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-corona-meteor.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-flame-dynamo.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-wisps-dynamo.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-corona-dynamo.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-flame-helix.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-wisps-helix.png?v=arcade390_vfx_ultra',
  './assets/vfx-nova-corona-helix.png?v=arcade390_vfx_ultra',
  './assets/vfx-gun-bolt-meteor.png?v=arcade390_vfx_ultra',
  './assets/vfx-gun-bolt-dynamo.png?v=arcade390_vfx_ultra',
  './assets/vfx-gun-bolt-helix.png?v=arcade390_vfx_ultra',
  './assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra',
  './qrcode.min.js',
  './app.js?v=arcade392_arsenal_overhaul',
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
