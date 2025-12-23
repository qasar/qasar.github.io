// Service Worker for aggressive caching - makes repeat visits instant
// Version 1.0.0 - Update this version number when you want to force cache refresh
// Note: Most content is static, so caching is very aggressive

const CACHE_NAME = 'qyco-v1.0.0';
const STATIC_CACHE_NAME = 'qyco-static-v1.0.0';
const IMAGE_CACHE_NAME = 'qyco-images-v1.0.0';
const WRITINGS_CACHE_NAME = 'qyco-writings-v1.0.0'; // Shorter cache for writings page

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/style.css',
  '/favicon.ico',
  '/assets/tom5t-adobe-license.png'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'reload'})));
    }).then(function() {
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete old caches that don't match current version
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME &&
              cacheName !== WRITINGS_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Skip Google Analytics and other tracking
  if (url.hostname.includes('google-analytics.com') || 
      url.hostname.includes('googletagmanager.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return cached version
      // For writings page, still check network in background for updates
      if (response) {
        // If it's the writings page, fetch in background to update cache
        if (url.pathname.includes('/writings/')) {
          fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(WRITINGS_CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            }
          }).catch(function() {
            // Network failed, that's okay - use cached version
          });
        }
        return response;
      }
      
      // Cache miss - fetch from network
      return fetch(event.request).then(function(response) {
        // Don't cache non-GET requests or non-successful responses
        if (event.request.method !== 'GET' || !response || response.status !== 200) {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Determine cache based on resource type
        let cacheName = CACHE_NAME;
        if (event.request.destination === 'image') {
          cacheName = IMAGE_CACHE_NAME;
        } else if (url.pathname.includes('/assets/') || 
                   url.pathname.endsWith('.css') || 
                   url.pathname.endsWith('.js')) {
          cacheName = STATIC_CACHE_NAME;
        } else if (url.pathname.includes('/writings/')) {
          // Writings page updates more frequently - use separate cache
          cacheName = WRITINGS_CACHE_NAME;
        }
        
        // Cache the response
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(function(error) {
        // Network error - return offline page if available
        console.log('Fetch failed:', error);
        // You could return a custom offline page here
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Background sync for offline actions (optional)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic if needed
  return Promise.resolve();
}

