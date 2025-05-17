// public/sw.js
const CACHE_NAME = 'ai-tutor-cache-v2'; // Incremented version
const PRECACHE_URLS = [
  '/',
  '/offline-cache',
  // Add any other critical static assets you want to pre-cache here
  // e.g., '/_next/static/css/...'
  // '/_next/static/js/...'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core assets.');
        // Add core assets, try to be resilient to failure (e.g. if one URL fails)
        const precachePromises = PRECACHE_URLS.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`[Service Worker] Failed to pre-cache ${url}:`, err);
          });
        });
        return Promise.all(precachePromises);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete. Skipping waiting.');
        return self.skipWaiting();
      }) // Activate worker immediately
  );
});
self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete. Claiming clients.');
      return self.clients.claim(); // Take control of all clients
    })
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return; // Do not intercept non-GET requests
  }

  // For navigation requests (HTML pages), try network first, then cache.
  // If both fail, attempt to serve a generic offline fallback (if one was cached, e.g. /offline-cache)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, clone and cache the response for future offline use.
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache.
          return caches.match(event.request)
            .then((cachedResponse) => {
              // If the specific page is in cache, serve it. Otherwise, try /offline-cache as a fallback.
              return cachedResponse || caches.match('/offline-cache') || Response.error();
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then cache it.
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache
            // (basic means same-origin, so we can read it and cache it)
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
          console.warn('[Service Worker] Fetch failed for non-navigation request:', event.request.url, error);
          // Optionally, return a placeholder for images or specific assets if fetch fails
          return Response.error();
        });
      })
  );
});
