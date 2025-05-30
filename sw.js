// ===== SERVICE WORKER FOR MODERN FOOD DELIVERY APP =====

const CACHE_NAME = 'food-delivery-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const IMAGE_CACHE = 'images-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://static.line-scdn.net/liff/edge/2/sdk.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('❌ Service Worker: Failed to cache static assets', err);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE && 
                                   cacheName !== IMAGE_CACHE;
                        })
                        .map(cacheName => {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle different types of requests
    if (url.pathname === '/' || url.pathname === '/index.html') {
        // App shell - cache first
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isStaticAsset(request.url)) {
        // Static assets - cache first
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isImageRequest(request.url)) {
        // Images - cache first with fallback
        event.respondWith(cacheFirstWithFallback(request, IMAGE_CACHE));
    } else if (isAPIRequest(request.url)) {
        // API requests - network first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // Other requests - network first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Update cache in background
            updateCache(request, cacheName);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first failed:', error);
        return getOfflineFallback(request);
    }
}

// Cache first with offline fallback
async function cacheFirstWithFallback(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Image cache failed:', error);
        return getImageFallback();
    }
}

// Network first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Network first failed:', error);
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        return cachedResponse || getOfflineFallback(request);
    }
}

// Background cache update
function updateCache(request, cacheName) {
    fetch(request)
        .then(response => {
            if (response && response.status === 200) {
                return caches.open(cacheName);
            }
        })
        .then(cache => {
            if (cache) {
                cache.put(request, response.clone());
            }
        })
        .catch(err => console.log('Background update failed:', err));
}

// Helper functions
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.woff') || 
           url.includes('.woff2') ||
           url.includes('fonts.googleapis.com') ||
           url.includes('cdnjs.cloudflare.com');
}

function isImageRequest(url) {
    return url.includes('.jpg') || 
           url.includes('.jpeg') || 
           url.includes('.png') || 
           url.includes('.gif') || 
           url.includes('.webp') || 
           url.includes('.svg') ||
           url.includes('images.unsplash.com') ||
           url.includes('cdn-icons-png.flaticon.com');
}

function isAPIRequest(url) {
    return url.includes('/api/') || 
           url.includes('firebase') ||
           url.includes('static.line-scdn.net');
}

// Offline fallbacks
function getOfflineFallback(request) {
    if (request.destination === 'document') {
        return new Response(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>🍔 Food Delivery - Offline</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 24px;
                        opacity: 0.8;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 16px;
                        font-weight: 700;
                    }
                    p {
                        font-size: 1.1rem;
                        margin-bottom: 32px;
                        opacity: 0.9;
                        max-width: 400px;
                        line-height: 1.6;
                    }
                    .retry-btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        backdrop-filter: blur(10px);
                    }
                    .retry-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }
                </style>
            </head>
            <body>
                <div class="offline-icon">🛜</div>
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Try Again
                </button>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

function getImageFallback() {
    // SVG placeholder for images
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="16" 
                  fill="#6b7280" text-anchor="middle" dy="0.3em">
                🍽️ Image not available offline
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store'
        }
    });
}

// Message handling for cache updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(event.data.payload))
        );
    }
});

// Background sync for offline orders
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    try {
        const orders = await getStoredOrders();
        for (const order of orders) {
            await submitOrder(order);
            await removeStoredOrder(order.id);
        }
        console.log('✅ Orders synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync orders:', error);
    }
}

async function getStoredOrders() {
    // Get orders from IndexedDB or localStorage
    return [];
}

async function submitOrder(order) {
    // Submit order to server
    return fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
}

async function removeStoredOrder(orderId) {
    // Remove order from local storage
    return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Your food order update',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: data.data || {},
        actions: [
            {
                action: 'view',
                title: 'View Order',
                icon: '/icon-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icon-dismiss.png'
            }
        ],
        vibrate: [200, 100, 200],
        tag: data.tag || 'food-delivery',
        renotify: true
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || '🍔 Food Delivery', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/orders/' + event.notification.data.orderId)
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
    } else {
        // Default action - open app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('✅ Service Worker: Loaded successfully'); 