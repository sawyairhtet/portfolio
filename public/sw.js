// Cache name is versioned per build: the inject-sw-cache-version plugin in
// vite.config.js fills in the build hash below (in dist/sw.js), so every
// deploy activates a fresh cache and the activate handler purges the old one.
// The placeholder must appear EXACTLY once in this file (the plugin replaces
// the first occurrence). In dev it stays literal, which is fine: DesktopShell
// unregisters all service workers in dev mode.
const CACHE = 'portfolio-__BUILD_HASH__';

// Hashed build output and self-hosted fonts never change at a given URL, so
// cache-first is safe for them. Everything else static (unhashed images,
// icons, root-level scripts like head-bootstrap.js) is served from cache for
// speed but refreshed in the background, so an edit reaches returning
// visitors on their next view instead of never.
const IMMUTABLE_PATHS = /^\/(assets|fonts)\//;
const STATIC_EXTENSIONS = /\.(?:woff2?|ttf|otf|png|jpg|jpeg|webp|svg|ico|css|js)$/i;

self.addEventListener('install', event => {
    // Only what the offline fallback needs. HTML pages are deliberately not
    // precached: navigations are network-first and fall back to offline.html.
    event.waitUntil(
        caches
            .open(CACHE)
            .then(cache =>
                cache.addAll([
                    '/offline.html',
                    // Front-door (editorial) fonts. The full Adwaita fonts used by
                    // /desktop are runtime-cached (cache-first) on first visit, so
                    // they are intentionally not precached here.
                    '/fonts/AdwaitaSans-Regular.subset.woff2',
                    '/fonts/AdwaitaMono-Regular.subset.woff2',
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
                    names
                        .filter(n => n.startsWith('portfolio-') && n !== CACHE)
                        .map(n => caches.delete(n))
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

    // Navigations: network only, offline fallback. HTML is never cached, so a
    // deploy is visible on the next load.
    if (isNavigation) {
        event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
        return;
    }

    // Hashed assets and fonts: cache-first.
    if (IMMUTABLE_PATHS.test(url.pathname)) {
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

    // Other static files: stale-while-revalidate.
    if (STATIC_EXTENSIONS.test(url.pathname)) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                const cached = await cache.match(event.request);
                const refresh = fetch(event.request)
                    .then(response => {
                        if (response.ok) cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => undefined);
                event.waitUntil(refresh.then(() => undefined));
                if (cached) return cached;
                const fresh = await refresh;
                return fresh || Response.error();
            })()
        );
        return;
    }

    event.respondWith(fetch(event.request));
});
