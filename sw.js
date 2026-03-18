const CACHE_NAME = 'ceci-game-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/game.js',
  './js/player.js',
  './js/input.js',
  './js/platform.js',
  './js/camera.js',
  './js/level.js',
  './js/renderer.js',
  './js/enemy.js',
  './js/item.js',
  './js/audio.js',
  './js/particles.js',
  './js/powerup.js',
  './js/touch.js',
  './assets/levels/level1.json',
  './assets/levels/level2.json',
  './assets/levels/level3.json',
  './manifest.json'
];

// Instala o service worker e faz cache de todos os assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Limpa caches antigos ao ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Estrategia cache-first (ideal para jogo offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Nao cachear respostas invalidas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
