importScripts('/lib/node_modules/sw-toolbox/sw-toolbox.js');

toolbox.precache(['mf-logo.svg']);

self.addEventListener("install", function(event) {
  console.log('SW: Installing service worker');
});

