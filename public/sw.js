/**
 * Service Worker - Offline Caching for PWA
 * Caches stable URLs that exist in both dev and production output.
 */

// Cache version - update BUILD_VERSION on each deploy for cache-busting
const BUILD_VERSION = '20260424-react-cleanup';
const CACHE_NAME = `syh-portfolio-v1-${BUILD_VERSION}`;
const STATIC_ASSETS = [
    '/404.html',
    '/sw.js',
    '/images/profile-picture.webp',
    '/images/og-preview.png',
    '/offline.html',
];

// Install - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('syh-portfolio-') && name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const acceptHeader = event.request.headers.get('accept');
    if (event.request.mode === 'navigate' || (acceptHeader && acceptHeader.includes('text/html'))) {
        event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    return undefined;
                });
        })
    );
});
