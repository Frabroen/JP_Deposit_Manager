// Increment this version to force cache refresh on all devices
const VERSION = 7;
const CACHE = `deposit-mgr-v${VERSION}`;

self.addEventListener('install', e => {
  // Skip waiting immediately — don't wait for old SW to die
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./index.html', './manifest.json']))
  );
});

self.addEventListener('activate', e => {
  // Delete ALL old caches immediately
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network always first — never serve stale content
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .catch(() => caches.match(e.request))
  );
});

// Handle skip waiting message from client
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
