// ===== NBSC GCO Service Worker =====
const CACHE_NAME = 'nbsc-gco-v1';

// Files to cache on install
const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/extras.css',
  '/script.js',
  '/extras.js',
  '/offline.html',
  '/assets/nbsc-logo.png',
  '/assets/logo.png',
  '/assets/building.jpg',
  '/assets/default-avatar.svg',
  '/about/vision-mission.html',
  '/about/goals-values.html',
  '/about/quality-policy.html',
  '/about/orgchart.html',
  '/about/about.css',
  '/about/about.js',
  '/about/orgchart.css',
];

// ===== INSTALL — cache core assets =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ===== ACTIVATE — clean old caches =====
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

// ===== FETCH — cache-first for assets, network-first for pages =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // For HTML pages: network-first, fallback to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // For assets (CSS, JS, images): cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Return offline page for image requests that fail
        if (request.destination === 'image') {
          return caches.match('/assets/default-avatar.svg');
        }
      });
    })
  );
});
