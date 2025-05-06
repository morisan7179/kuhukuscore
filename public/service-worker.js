// public/service-worker.js
self.addEventListener("install", function (event) {
  console.log("[ServiceWorker] Install");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("[ServiceWorker] Activate");
});

self.addEventListener("fetch", function (event) {
  // 通常のネットワークフェッチ処理
});
