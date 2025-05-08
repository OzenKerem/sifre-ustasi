// Service Worker
const CACHE_NAME = 'sifre-ustasi-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-audience-light-applause-354.mp3'
];

// Service Worker Kurulumu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktifleştirme olayı - Eski cache'leri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch olayı - Cache First, ardından Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'ten döndür
        if (response) {
          return response;
        }
        
        // Cache'te yoksa ağdan al ve cache'e ekle
        return fetch(event.request.clone())
          .then(response => {
            // Sadece geçerli yanıtları cache'e ekle
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Ağ başarısız olursa ve istek bir sayfa içinse, offline sayfasını dön
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Diğer durumlar için bir hata ile başarısız ol
            return new Response('İnternet bağlantısı yok');
          });
      })
  );
});