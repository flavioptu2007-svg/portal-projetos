/* ============================================================
   OMREdu — Service Worker
   Suporte offline para o Corretor Híbrido de Gabaritos

   - Só intercepta GET (chamadas à API de IA são POST e passam direto).
   - Nada de respostas de erro é gravado no cache.
   ============================================================ */

const CACHE_NAME = 'omredu-v2';
const ASSETS_TO_CACHE = [
  '/omredu_corretor_hibrido.html',
  '/omredu_claude.js',
];

// Recursos CDN (OpenCV.js, Google Fonts) cacheados sob demanda
const CDN_CACHE = 'omredu-cdn-v1';
const CDN_HOSTS = ['docs.opencv.org', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== CDN_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Navegação: network-first, fallback para o app em cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/omredu_corretor_hibrido.html')
      )
    );
    return;
  }

  // CDN: cache-first com atualização em segundo plano
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((response) => {
            if (response.ok || response.type === 'opaque') {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Mesmo origin: network-first com fallback para cache
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const contentType = response.headers.get('Content-Type') || '';
        if (response.ok && /javascript|css|font|image/.test(contentType)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
