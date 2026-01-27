const CACHE_NAME = 'btc-frame-v1';
const ASSETS = [
  './',
  './index.html',
  './js/config.js',
  './js/api.js',
  './js/main.js',
  './css/style.css',
  './css/theme-minimal.css',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});