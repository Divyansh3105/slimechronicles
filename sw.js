const CACHE_NAME = 'slime-chronicles-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/overview.html',
  '/codex.html',
  '/character.html',
  '/factions.html',
  '/skills.html',
  '/records.html',
  '/chronicle.html',
  '/css/shared.css',
  '/css/index.css',
  '/css/character.css',
  '/css/skills.css',
  '/css/codex.css',
  '/css/factions.css',
  '/css/records.css',
  '/css/overview.css',
  '/css/Chronicle.css',
  '/js/shared.js',
  '/js/effects.js',
  '/js/animations.js',
  '/js/character.js',
  '/js/skills.js',
  '/js/codex.js',
  '/js/factions.js',
  '/js/records.js',
  '/js/Chronicle.js',
  '/js/overview.js',
  '/js/utils/EventBus.js',
  '/js/utils/SoundEngine.js',
  '/js/components/MainNavigation.js',
  '/js/components/CommandPalette.js',
  '/js/components/GreatSageWidget.js',
  '/js/components/SkillSynthesizer.js',
  '/js/components/BattleSimulator.js',
  '/data/characters-basic.json'
];

// Install Event - Precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching offline assets for Slime Chronicles');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Purging old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Dynamic Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.debug('Network offline, served from cache if available:', event.request.url);
      });

      return cachedResponse || fetchPromise;
    })
  );
});
