importScripts('/lib/node_modules/sw-toolbox/sw-toolbox.js');

toolbox.precache(['pwa.html'],['mf-logo.svg'],['manifest.json']);

toolbox.router.default = toolbox.cacheFirst;

self.addEventListener("install", function(event) {
  console.log('SW: Installing service worker');
});

