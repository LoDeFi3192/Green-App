// Bloom — service worker for offline app shell
const CACHE = 'bloom-v2';
const ASSETS = [
  './',
  './index.html',
  './bloom-app.css',
  './bloom-app.jsx',
  './bloom-data.jsx',
  './bloom-firebase.jsx',
  './bloom-shell.jsx',
  './bloom-screen-auth.jsx',
  './bloom-screen-home.jsx',
  './bloom-screen-detail.jsx',
  './bloom-screen-add.jsx',
  './bloom-screen-care.jsx',
  './bloom-screen-journal.jsx',
  './bloom-screen-profile.jsx',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache Firebase / Google / unpkg — always go to network
  if (url.hostname.includes('firebase') || url.hostname.includes('google') || url.hostname.includes('gstatic') || url.hostname.includes('unpkg')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && url.origin === self.location.origin){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
