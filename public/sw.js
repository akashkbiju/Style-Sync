// StyleSync PWA Self-Destructing Service Worker
// Automatically purges stale caches and unregisters to ensure fresh bundle loads

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Network-only: never intercept or block scripts
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
