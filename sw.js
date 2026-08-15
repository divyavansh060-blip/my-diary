const CACHE_NAME = "my-diary-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .catch((error) => {
                console.error("Cache error:", error);
            })
    );

    self.skipWaiting();
});


self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })
            .catch(() => {

                return caches.match("./index.html");

            })

    );

});
