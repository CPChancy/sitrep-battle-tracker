// Offline cache for SITREP.
// Bump VERSION whenever you change any app file so phones pick up the update.
const VERSION = 'fsc-v15';
const CORE = ['./', './index.html', './styles.css', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './js/utils.js', './js/scenarios.js', './js/deployment.js', './js/briefing.js', './js/storage.js', './js/calculator.js',
  './js/saved-games.js', './js/setup.js', './js/navigation.js', './js/app.js'];

self.addEventListener('install', e => {
  // Download every file fresh, not from the browser's own cache, so a new version never stores old copies.
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(CORE.map(url => new Request(url, {cache:'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Cache-first, then network; anything fetched (including Google Fonts) is stored for offline use.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
