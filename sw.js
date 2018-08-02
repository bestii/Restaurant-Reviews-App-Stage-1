//Write Service Worker Script Here.
var CACHE_NAME = 'restaurant-cache-v1';

var urlsToCache = ['/',
  '/css/styles.css',
  '/js/config.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/js/main.js',
  '/js/register_sw.js',
  'https://fonts.gstatic.com/s/carroisgothicsc/v7/ZgNJjOVHM6jfUZCmyUqT2A2HVKjc-18gPnc.woff2',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  '/index.html',
  '/restaurant.html',
  '/data/restaurants.json'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    console.log('Opened cache');
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
          return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function (response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseToCache);
          });
          return response;
      });
  }));
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['restaurant-cache-v2'];
  event.waitUntil(caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
          }
      }));
  }));
});