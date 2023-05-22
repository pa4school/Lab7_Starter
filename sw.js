// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([
        'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
        'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
        'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
        'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
        'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
        'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
      ])
    })
  )
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)

  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  // Is this request already in the cache?
  // Check if this request is already in the cache
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        // If we have a response return it, otherwise fetch it from the network
        return response || fetch(event.request).then(function (response) {
          // Add the new response to the cache
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
})
