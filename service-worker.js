/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-54aad56';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./povidky_malostranske_001.html","./povidky_malostranske_002.html","./povidky_malostranske_006.html","./povidky_malostranske_007.html","./povidky_malostranske_008.html","./povidky_malostranske_009.html","./povidky_malostranske_010.html","./povidky_malostranske_011.html","./povidky_malostranske_012.html","./povidky_malostranske_013.html","./povidky_malostranske_014.html","./povidky_malostranske_015.html","./povidky_malostranske_016.html","./povidky_malostranske_017.html","./povidky_malostranske_018.html","./resources.html","./resources/image001_fmt.jpeg","./resources/image003_fmt.jpeg","./resources/image004_fmt.jpeg","./resources/index.xml","./resources/obalka_povidky_malostr_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
