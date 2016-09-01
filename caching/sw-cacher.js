importScripts('../lib/node_modules/sw-toolbox/sw-toolbox.js');

//Let's just precache two items
toolbox.precache(['index.html','mf-logo.svg']);


//We'll see the main.js and main.css appear in the cache anyway!
toolbox.router.default = toolbox.cacheFirst;

self.addEventListener("install", function(event) {
  console.log('SW: Installing service worker');
});

