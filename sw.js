const CACHE_NAME = 'ceci-game-v6';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/game.js',
  './js/constants.js',
  './js/skins-data.js',
  './js/save-manager.js',
  './js/collision.js',
  './js/spatial-grid.js',
  './js/menu-renderer.js',
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
  './assets/levels/level4.json',
  './manifest.json'
];

// Instala o service worker e faz cache de todos os assets
// Usa cache individual para nao falhar se um asset estiver indisponivel
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`Falha ao cachear ${url}:`, err);
          })
        )
      );
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

// Estrategia cache-first com fallback para rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Nao cachear respostas invalidas ou de origens externas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        }).catch(() => {
          // Falha ao abrir cache — ignorar
        });
        return response;
      }).catch(() => {
        // Rede indisponivel e nao esta no cache — retornar fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
