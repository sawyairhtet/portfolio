/**
 * Service Worker - Offline Caching for PWA
 * Caches static assets for offline access
 */

// Cache version - update BUILD_VERSION on each deploy for cache-busting
const BUILD_VERSION = '20260209';
const CACHE_NAME = `syh-portfolio-v1-${BUILD_VERSION}`;
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/app.js',
    '/js/core/sound-manager.js',
    '/js/core/theme-manager.js',
    '/js/core/window-manager.js',
    '/js/apps/terminal.js',
    '/js/ui/context-menu.js',
    '/js/ui/dialog.js',
    '/js/ui/notifications.js',
    '/js/config/data.js',
    '/images/profile-picture.jpg',
    '/images/noble-numbat.jpg',
    '/assets/icon.png',
    '/manifest.json',
    '/offline.html'
];

// Install - cache static assets
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

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('syh-portfolio-') && name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests (fonts, analytics, etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for HTML pages
                        // Guard against null accept header to prevent crash
                        const acceptHeader = event.request.headers.get('accept');
                        if (acceptHeader && acceptHeader.includes('text/html')) {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});

