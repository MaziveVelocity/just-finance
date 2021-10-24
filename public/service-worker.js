const CACHE_NAME = 'just-finance-cache-v1';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    'css/styles.css',
    'js/index.js',
    'js/idb.js',
    'icons/icon-72x72.png',
    'icons/icon-96x96.png',
    'icons/icon-128x128.png',
    'icons/icon-144x144.png',
    'icons/icon-152x152.png',
    'icons/icon-192x192.png',
    'icons/icon-384x384.png',
    'icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing: ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function (key, index) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log('Deleting cache :' + keyList[i]);
                        return caches.delete(keyList[index]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get('accept').includes('text/html')) {
                    // return the cached home page for all requests for html pages
                    return caches.match('/');
                }
            });
        })
    );
});