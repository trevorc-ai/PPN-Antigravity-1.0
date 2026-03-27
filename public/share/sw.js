// PPN Share — Service Worker
// Cache-first strategy for full offline capability
// v2: local qrcode.min.js cached (replaces CDN reference), icon assets added

const CACHE = 'ppn-share-v2';
const SHELL = [
  '/share/',
  '/share/index.html',
  '/share/manifest.json',
  '/share/qrcode.min.js',
  '/share/icon-192.png',
  '/share/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Cache-first for shell assets; network-first for everything else
  if (SHELL.some(url => e.request.url.includes(url.replace('https://', '')))) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
  } else {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
