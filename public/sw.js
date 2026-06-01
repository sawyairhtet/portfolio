const CACHE_NAME = 'syh-portfolio-__BUILD_HASH__';
const PRECACHE = [
    '/offline.html',
    '/fonts/AdwaitaSans-Regular.woff2',
    '/fonts/AdwaitaSans-Italic.woff2',
    '/fonts/AdwaitaMono-Regular.woff2',
];

function cacheResponse(request, response) {
    if (!response || response.status !== 200) return Promise.resolve();

    return caches
        .open(CACHE_NAME)
        .then(cache => cache.put(request, response.clone()))
        .catch(() => undefined);
}

function fetchAndCache(event) {
    return fetch(event.request).then(response => {
        event.waitUntil(cacheResponse(event.request, response));
        return response;
    });
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(names =>
                Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    const accept = event.request.headers.get('accept');

    if (event.request.mode === 'navigate' || (accept && accept.includes('text/html'))) {
        event.respondWith(fetchAndCache(event).catch(() => caches.match('/offline.html')));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) {
                event.waitUntil(fetchAndCache(event).catch(() => undefined));
                return cached;
            }

            return fetchAndCache(event);
        })
    );
});
