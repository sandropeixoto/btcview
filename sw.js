const CACHE_NAME = 'btcview-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/theme-minimal.css',
  './js/config.js',
  './js/utils/quote-utils.js',
  './js/effects.js',
  './js/api.js',
  './js/main.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap'
];

// Instalação do Service Worker e Cache de Ativos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando arquivos estáticos');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Fetch: Network First caindo para Cache
self.addEventListener('fetch', (event) => {
  // Ignora chamadas para a API (queremos sempre dados frescos se houver rede)
  if (event.request.url.includes('api.coingecko.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});