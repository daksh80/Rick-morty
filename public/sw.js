const APP_SHELL_CACHE = 'rm-app-shell-v1';
const ASSET_CACHE = 'rm-assets-v1';
const API_CACHE = 'rm-api-v1';
const APP_SHELL_URLS = ['/', '/index.html', '/favicon.svg', '/icons.svg', '/manifest.webmanifest'];
const API_ORIGIN = 'https://rickandmortyapi.com';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const allowList = new Set([APP_SHELL_CACHE, ASSET_CACHE, API_CACHE]);

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (allowList.has(key)) return Promise.resolve();
            return caches.delete(key);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

const isSameOriginAsset = (requestUrl) => {
  return requestUrl.origin === self.location.origin;
};

const isApiRequest = (requestUrl) => {
  return requestUrl.origin === API_ORIGIN;
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
};

const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('Offline and no cached response found.');
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, APP_SHELL_CACHE).catch(async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        return cache.match('/index.html');
      })
    );
    return;
  }

  if (isApiRequest(requestUrl)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  const isStaticAssetRequest = ['style', 'script', 'image', 'font'].includes(request.destination);
  if (isStaticAssetRequest && isSameOriginAsset(requestUrl)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
