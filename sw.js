const CACHE_NAME = 'slime-chronicles-v3';

// App shell + character data. Images and audio are cached as they are visited (see fetch handler).
const ASSETS_TO_CACHE = [
  // pages
  '/',
  '/index.html',
  '/overview.html',
  '/codex.html',
  '/character.html',
  '/factions.html',
  '/skills.html',
  '/records.html',
  '/chronicle.html',
  '/manifest.json',
  // styles
  '/css/character-base.css',
  '/css/character-battle-evolution.css',
  '/css/character-misc.css',
  '/css/character-overview-bio.css',
  '/css/character-profile-header.css',
  '/css/character-relationships.css',
  '/css/character-responsive.css',
  '/css/character-skills.css',
  '/css/character.css',
  '/css/chronicle.css',
  '/css/codex.css',
  '/css/factions.css',
  '/css/index.css',
  '/css/overview.css',
  '/css/records.css',
  '/css/shared.css',
  '/css/skills.css',
  // scripts
  '/js/animations.js',
  '/js/character.js',
  '/js/chronicle.js',
  '/js/codex.js',
  '/js/components/BattleSimulator.js',
  '/js/components/CommandPalette.js',
  '/js/components/GreatSageWidget.js',
  '/js/components/MainNavigation.js',
  '/js/components/SkillSynthesizer.js',
  '/js/effects.js',
  '/js/factions.js',
  '/js/game-state-optimized.js',
  '/js/overview.js',
  '/js/performance-optimizer.js',
  '/js/records.js',
  '/js/shared.js',
  '/js/skills.js',
  '/js/utils/EventBus.js',
  '/js/utils/SoundEngine.js',
  // data
  '/data/characters-basic.json',
  '/data/characters/adalmann.json',
  '/data/characters/apito.json',
  '/data/characters/benimaru.json',
  '/data/characters/beretta.json',
  '/data/characters/carrera.json',
  '/data/characters/chloe.json',
  '/data/characters/clayman.json',
  '/data/characters/dagruel.json',
  '/data/characters/diablo.json',
  '/data/characters/gabiru.json',
  '/data/characters/gazef.json',
  '/data/characters/geld.json',
  '/data/characters/guy.json',
  '/data/characters/hakuro.json',
  '/data/characters/hinata.json',
  '/data/characters/kumara.json',
  '/data/characters/leon.json',
  '/data/characters/luminous.json',
  '/data/characters/milim.json',
  '/data/characters/ramiris.json',
  '/data/characters/ranga.json',
  '/data/characters/rigurd.json',
  '/data/characters/rimuru.json',
  '/data/characters/shion.json',
  '/data/characters/shuna.json',
  '/data/characters/souei.json',
  '/data/characters/testarossa.json',
  '/data/characters/ultima.json',
  '/data/characters/veldora.json',
  '/data/characters/velgrynd.json',
  '/data/characters/velzard.json',
  '/data/characters/yuuki.json',
  '/data/characters/zegion.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

// Stale-while-revalidate for same-origin GETs
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    // ignoreSearch so chronicle.html?event=... still resolves offline
    caches.match(request, { ignoreSearch: request.mode === 'navigate' }).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          // 206 (audio range requests) can't be cached
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
