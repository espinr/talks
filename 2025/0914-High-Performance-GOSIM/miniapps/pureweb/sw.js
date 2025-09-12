const CACHE_NAME = 'superapp-v1.0.0';
const urlsToCache = [
  '/',
  '/superapp.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-72.png',
  '/icon-96.png',
  '/icon-128.png',
  '/icon-144.png',
  '/icon-152.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All files cached');
        return self.skipWaiting(); // Force activation
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate event');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetch event for', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it's a stream and can only be read once
            const responseToCache = response.clone();

            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return a fallback page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/superapp.html');
            }
            
            // Return a placeholder for images
            if (event.request.destination === 'image') {
              return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>', {
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            }
          });
      })
  );
});

// Background sync for messages (when online again)
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push event', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New message received!',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SuperApp', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Helper function to sync messages
async function syncMessages() {
  try {
    // This would typically sync with your backend
    console.log('Service Worker: Syncing messages...');
    
    // Simulate API call
    const response = await fetch('/api/sync-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastSync: Date.now()
      })
    });
    
    if (response.ok) {
      console.log('Service Worker: Messages synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Message sync failed', error);
    throw error; // This will retry the sync
  }
}

// Update cache when new version is available
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodically clean up old cache entries
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Remove entries older than 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader && new Date(dateHeader).getTime() < sevenDaysAgo) {
        await cache.delete(request);
        console.log('Service Worker: Removed old cache entry', request.url);
      }
    }
  }
}