var CACHE = 'mision-cambridge-ifm-2026-v3';
var RECURSOS = [
  './', './index.html', './css/tokens.css', './css/app.css',
  './js/data.js', './js/utils.js', './js/app.js', './js/search.js',
  './js/render/inicio.js', './js/render/agenda.js', './js/render/promocion.js',
  './js/render/economia.js', './js/render/reuniones.js', './js/render/documentos.js',
  './js/render/vuelos.js', './js/render/hospedajes.js',
  './datos/mission.json', './datos/people.json', './datos/agenda.json',
  './datos/flights.json', './datos/lodging.json', './datos/meetings.json',
  './datos/economy.json', './datos/promo.json', './datos/documents.json',
  './datos/fuentes.json', './datos/i18n.json',
  './assets/brand/logo-sety.png', './documentos/agenda-ifm-cambridge-2026.pdf',
  './assets/people/p01.webp', './assets/people/p02.webp', './assets/people/p03.webp',
  './assets/people/p04.webp', './assets/people/p05.webp',
  './assets/fonts/lato-300-latin.woff2', './assets/fonts/lato-300-latin-ext.woff2',
  './assets/fonts/lato-400-latin.woff2', './assets/fonts/lato-400-latin-ext.woff2',
  './assets/fonts/lato-700-latin.woff2', './assets/fonts/lato-700-latin-ext.woff2',
  './assets/fonts/lato-900-latin.woff2', './assets/fonts/lato-900-latin-ext.woff2'
];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(RECURSOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(function (resp) {
    return resp || fetch(event.request).then(function (r) {
      if (r && r.status === 200 && r.type === 'basic') {
        var copia = r.clone();
        caches.open(CACHE).then(function (c) { c.put(event.request, copia); });
      }
      return r;
    });
  }));
});
