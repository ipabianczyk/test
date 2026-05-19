/**
 * MostPomocy.pl - Service Worker
 * Odpowiada za tryb offline i szybkie ładowanie zasobów.
 */

const CACHE_NAME = 'most-pomocy-v1';
const OFFLINE_URL = '/offline.html';

// Zasoby do zapamiętania w Cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // Tutaj możesz dodać fonty i kluczowe grafiki
];

// Instalacja SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Buforowanie zasobów krytycznych');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktywacja i czyszczenie starych wersji
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Usuwanie starego cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Przechwytywanie zapytań (Network First z fallbackiem do Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
