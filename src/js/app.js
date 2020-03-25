// script in footer

<
script >
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          return registration.update()
        })
        .catch(() => console.log('service worker not registered'))
    })
  } <
  /script>

// waar het stukloopt

self.addEventListener('install', event => {
  console.log('Installing service worker')
  event.waitUntil(
    caches.open(CORE_CACHE_VERSION).then(function(cache) {
      return cache.addAll(CORE_ASSETS).then(() => self.skipWaiting());
    })
  );
});