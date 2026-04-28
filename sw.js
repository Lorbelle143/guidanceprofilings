// ===== NBSC GCO Service Worker =====
const CACHE_NAME = 'nbsc-gco-v4';

// Core files to cache on first install
const PRECACHE = [
  './index.html',
  './style.css',
  './extras.css',
  './script.js',
  './extras.js',
  './offline.html',
  './manifest.json',
  './about/vision-mission.html',
  './about/goals-values.html',
  './about/quality-policy.html',
  './about/orgchart.html',
  './about/about.css',
  './about/about.js',
  './about/orgchart.css',
  './assets/default-avatar.svg',
  './assets/nbsc-logo.png',
  './assets/logo.png',
  './assets/building.jpg',
  './assets/sir jo.png',
  './assets/sir ford.png',
  './assets/quen elizabeth.png',
  './assets/alejaga.png',
  './assets/betasa.png',
  './assets/binayao sec.png',
  './assets/cabasagan.png',
  './assets/alon alon.png',
  './assets/social sulda.png',
  './assets/j jay galagar.png',
  './assets/bryle jangao.png',
  './assets/rebe.jpg',
  './assets/alagos.png',
  './assets/college president.png',
  './assets/vice presi.png',
  './assets/dean.jpg',
];

// ===== INSTALL — cache all core files =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache each file individually so one failure won't block the rest
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(() => console.warn('[SW] Failed to cache:', url))
        )
      );
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE — remove old caches =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  // Skip cross-origin (CDN fonts, FontAwesome, EmailJS, etc.)
  try {
    if (new URL(request.url).origin !== location.origin) return;
  } catch { return; }

  // HTML pages — network first, fall back to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, clone))
            .catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Everything else — cache first, then network (stale-while-revalidate)
  event.respondWith(
    caches.match(request).then(cached => {
      // Return cached version immediately if available
      const networkFetch = fetch(request).then(response => {
        if (!response || response.status !== 200) return response;

        // Don't cache large images (> 3MB)
        const size   = parseInt(response.headers.get('content-length') || '0', 10);
        const isImg  = request.destination === 'image';
        const tooBig = isImg && size > 3 * 1024 * 1024;

        if (!tooBig) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, clone))
            .catch(() => {});
        }
        return response;
      }).catch(() => {
        // If image fails and nothing cached, return default avatar
        if (request.destination === 'image') {
          return caches.match('./assets/default-avatar.svg');
        }
      });

      return cached || networkFetch;
    })
  );
});
