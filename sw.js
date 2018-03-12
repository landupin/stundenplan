var dataCacheName = 'stundenplan-1';
var cacheName = 'stundenplan-cache-1';
var filesToCache = [
    '/',
    '/index.html',
    '/js/jquery-3.3.1.min.js',
    '/js/jquery-ui.min.js',
    '/js/materialize.min.js',
    '/css/materialize.min.css',
    '/a_stundenplan.json',
    '/b_stundenplan.json',
    '/samstag.json',
    '/icon.png',
    '/manifest.json'
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * This happens because the service worker is not yet activated. The code
     * below essentially lets you activate the service worker faster.
     */
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});