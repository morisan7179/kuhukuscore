const CACHE_NAME = "kuhukuscore-cache-v2"; // ★バージョンUP必須
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// インストール時にキャッシュ
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュ削除
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// fetch時にキャッシュ or ネット or fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request)
        .then((res) => {
          return res;
        })
        .catch(() => {
          // ネットもキャッシュも無い場合はindex.htmlを返してSPA壊さない
          return caches.match("/index.html");
        });
    })
  );
});
