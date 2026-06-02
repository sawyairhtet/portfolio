const CACHE = 'portfolio-v3';

const STATIC_EXTENSIONS = /\.(?:woff2?|ttf|otf|png|jpg|jpeg|webp|svg|ico|css|js)$/i;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                '/',
                '/offline.html',
                '/index.html',
                '/404.html',
                '/fonts/AdwaitaSans-Regular.woff2',
                '/fonts/AdwaitaSans-Italic.woff2',
                '/fonts/AdwaitaMono-Regular.woff2',
            ])
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(names =>
                Promise.all(
                    names.filter(n => n.startsWith('portfolio-') && n !== CACHE).map(n => caches.delete(n))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    const isNavigation =
        event.request.mode === 'navigate' ||
        (event.request.headers.get('accept') || '').includes('text/html');

    if (isNavigation) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const cloned = response.clone();
                    caches.open(CACHE).then(cache => cache.put(event.request, cloned));
                    return response;
                })
                .catch(() => caches.match('/offline.html'))
        );
        return;
    }

    if (STATIC_EXTENSIONS.test(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;

                return fetch(event.request).then(response => {
                    if (response.ok) {
                        const cloned = response.clone();
                        caches.open(CACHE).then(cache => cache.put(event.request, cloned));
                    }
                    return response;
                });
            })
        );
        return;
    }

    event.respondWith(fetch(event.request));
});