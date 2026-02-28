/* ========================================
   ExpenseTracker — Service Worker
   ======================================== */

const CACHE_NAME = 'expense-tracker-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ---------- Install: Cache static assets ---------- //
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ---------- Activate: Clean old caches ---------- //
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ---------- Fetch: Cache-first, network fallback ---------- //
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and API requests
  if (request.method !== 'GET') return;
  if (request.url.includes('googleapis.com') || request.url.includes('generativelanguage.googleapis.com')) {
    // Network-only for API calls
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached, but also update cache in background (stale-while-revalidate)
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached;
      }

      // Not in cache — try network
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
    })
  );
});

// ---------- Background Sync (future-ready) ---------- //
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    console.log('[SW] Background sync triggered');
  }
});

// ---------- Push Notifications (future-ready) ---------- //
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'ExpenseTracker';
  const options = {
    body: data.body || 'Check your expense tracker',
    icon: './icons/icon-192.png',
    badge: './icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: { url: './' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './')
  );
});
