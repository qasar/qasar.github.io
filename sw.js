// Service Worker for aggressive caching - makes repeat visits instant
// Version 1.0.0 - Update this version number when you want to force cache refresh
// Note: Most content is static, so caching is very aggressive

const CACHE_NAME = 'qyco-v1.0.2';
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

// Fetch event - network-first for HTML, cache-first for assets
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
  
  // For HTML pages (navigation requests), use network-first strategy
  // This ensures pages always load fresh and prevents ERR_FAILED errors
  if (event.request.mode === 'navigate' || 
      (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        // If network succeeds, cache it and return
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          let cacheName = CACHE_NAME;
          if (url.pathname.includes('/writings/')) {
            cacheName = WRITINGS_CACHE_NAME;
          }
          caches.open(cacheName).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(function(error) {
        // Network failed - try cache as fallback
        console.log('Network failed, trying cache:', error);
        return caches.match(event.request).then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache, let the browser handle the error naturally
          throw error;
        });
      })
    );
    return;
  }
  
  // For static assets (images, CSS, JS), use cache-first strategy
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return cached version
      if (response) {
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
        }
        
        // Cache the response
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(function(error) {
        // Network error - return error response
        console.log('Fetch failed:', error);
        throw error; // Let browser handle the error
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

