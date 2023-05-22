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

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // B7. TODO - Respond to requests for the root URL by returning the
      //            cached home page from the cache RECIPE_CACHE_NAME
      if (response) {
        return response
      }
      return fetch(event.request).then(function (response) {
        if (response.status === 404) {
          return caches.match('pages/404.html')
        }
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request.url, response.clone())
          return response
        })
      })
    })
  )

  // B8. TODO - If the request URL matches anything in RECIPE_URLs,
  //            respond with the cached version instead of fetching it
  //            This will let the app work offline.
  //            Don't forget to add the fetch listener above
  //            and add RECIPE_URLs to the cache when the service worker
  //            is installed
  if (event.request.url.includes('introweb.tech/assets/json/')) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response
        }
        return fetch(event.request).then(function (response) {
          if (response.status === 404) {
            return caches.match('pages/404.html')
          }
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request.url, response.clone())
            return response
          })
        })
      })
    )
  }
})