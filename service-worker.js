// ==========================================
// Preoperative Tests – Service Worker
// Network-first for JavaScript so updated
// clinical rules are loaded after deployment.
// ==========================================

const CACHE_NAME = "preoperative-tests-v3";

const APP_SHELL = [
    "./",
    "./index.html",
    "./patient.html",
    "./comorbidities.html",
    "./medications.html",
    "./surgical.html",
    "./investigations.html",
    "./style.css",
    "./index.js",
    "./patient.js",
    "./comorbidities.js",
    "./medications.js",
    "./surgical.js",
    "./investigations.js"
];


// ==========================================
// INSTALL
// ==========================================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(APP_SHELL);
            })
    );

    // Activate the new Service Worker immediately
    self.skipWaiting();
});


// ==========================================
// ACTIVATE
// ==========================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))

                );

            })
            .then(() => {

                // Take control of all open pages
                return self.clients.claim();

            })

    );

});


// ==========================================
// FETCH
// ==========================================

self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Only handle files from this website
    if (url.origin !== self.location.origin) {
        return;
    }


    // ======================================
    // JavaScript
    // Network First
    // ======================================

    const isJavaScript =
        url.pathname.endsWith(".js");


    // ======================================
    // HTML
    // Network First
    // ======================================

    const isHTML =
        request.mode === "navigate" ||
        url.pathname.endsWith(".html") ||
        url.pathname === "/" ||
        url.pathname.endsWith("/");


    // ======================================
    // CSS
    // Network First
    // ======================================

    const isCSS =
        url.pathname.endsWith(".css");


    // ======================================
    // HTML / JS / CSS
    // ======================================

    if (
        isJavaScript ||
        isHTML ||
        isCSS
    ) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (
                        response &&
                        response.ok
                    ) {

                        const responseClone =
                            response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });

                    }

                    return response;

                })

                .catch(() => {

                    return caches
                        .match(request)

                        .then(cached => {

                            if (cached) {
                                return cached;
                            }

                            // Offline fallback
                            if (isHTML) {

                                return caches.match(
                                    "./index.html"
                                );

                            }

                            return Response.error();

                        });

                })

        );

        return;
    }


    // ======================================
    // Other resources
    // Cache First
    // ======================================

    event.respondWith(

        caches.match(request)

            .then(cached => {

                if (cached) {
                    return cached;
                }

                return fetch(request)

                    .then(response => {

                        if (
                            response &&
                            response.ok
                        ) {

                            const responseClone =
                                response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                });

                        }

                        return response;

                    });

            })

    );

});
