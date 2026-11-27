/* OrlandoChrome · Offline-First Service Worker (PWA Ready) */
const CACHE_NAME = 'orlandochrome-arcade-v419_good_vs_bad_clarity';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=arcade392_arsenal_overhaul',
  './game.js?v=arcade419_good_vs_bad_clarity',
  './assets/core-geometry-db.json?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t1.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t6.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t6-body.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t6-guns.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-t6-showcase.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t1.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t6.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t6-body.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t6-guns.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-t6-showcase.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t1.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t6.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t6-body.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t6-guns.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-t6-showcase.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-wing-r-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-wing-r-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-wing-r-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-wing-r-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-wing-r-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-wing-r-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-wing-r-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-wing-r-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-wing-r-t2.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-wing-r-t3.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-wing-r-t4.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-meteor-wing-r-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-dynamo-bezel-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-bezel-t5.png?v=arcade419_good_vs_bad_clarity',
  './assets/core-helix-glass-shell.png?v=arcade419_good_vs_bad_clarity',
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
  './assets/shield-barrier-dynamo.png?v=arcade419_good_vs_bad_clarity',
  './assets/shield-barrier-helix.png?v=arcade419_good_vs_bad_clarity',
  './assets/shield-barrier-meteor.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-shield-dynamo.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-shield-helix.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-shield-meteor.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-core-dynamo-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-core-helix-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-core-meteor-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-missiles-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-cluster-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-supercharge-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-chronos-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-singularity-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/powerup-catalyst-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-seeker-ring-3d.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-dynamo-hyper_comet.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-dynamo-corruptor_laser.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-dynamo-gravity_well.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-dynamo-emp_detonator.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-dynamo-phase_stalker.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-helix-hyper_comet.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-helix-corruptor_laser.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-helix-gravity_well.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-helix-emp_detonator.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-helix-phase_stalker.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-meteor-hyper_comet.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-meteor-corruptor_laser.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-meteor-gravity_well.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-meteor-emp_detonator.png?v=arcade419_good_vs_bad_clarity',
  './assets/hazard-powered-meteor-phase_stalker.png?v=arcade419_good_vs_bad_clarity',
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
      fetch(event.request, { cache: 'no-cache' })
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
    fetch(event.request, { cache: 'no-cache' })
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
