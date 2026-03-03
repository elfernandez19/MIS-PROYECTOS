// ═══════════════════════════════════════════
// MARINO — Service Worker (PWA)
// Versión de caché: actualiza este número
// cuando publiques cambios importantes
// ═══════════════════════════════════════════

const CACHE_NAME = 'marino-v1';

// Archivos que se cachean para funcionar offline
const ASSETS = [
  '/',
  '/index.html',
  '/restaurante.html',
  '/barber.html',
  '/styles-index.css',
  '/styles-rest.css',
  '/styles-barber.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── INSTALL: cachear assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        // Ignora errores de assets que no existen aún
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: limpiar cachés viejos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: network first, cache fallback ──
self.addEventListener('fetch', event => {
  // No interceptar peticiones a Firebase/APIs externas
  if (event.request.url.includes('firebase') ||
      event.request.url.includes('gstatic') ||
      event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guardar copia en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Sin conexión: servir desde caché
        return caches.match(event.request).then(cached => {
          return cached || caches.match('/index.html');
        });
      })
  );
});
