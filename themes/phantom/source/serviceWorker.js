var CACHE = 'cache-update-and-refresh';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
		'/',
    './',
    './?utm_source=web_app_manifest',
		'./index.html',
		'./logo/logo.png',
		'./logo/logo.svg',
		'./fonts/fontawesome-webfont.woff2?v=4.5.0',
		'./build-assets/js/concat.min.js',
    './build-assets/css/concat.min.css',
    './page/2/',
    './page/3/',
    './page/4/',
    './page/5/',
    './page/6/',
    './page/7/',
    './page/8/',
    './page/9/',
    // './css/featherlight/1-7-0.min.css',
    // './css/font-awesome.min.css',
    // './css/featherlight/1-7-0.gallery.min.css',
    // './sass/main.css',
    // './js/skel.min.js',
    // './js/util.js',
    // './js/jquery.min.js',
    // './js/jquery.detect_swipe.min.js',
    // './js/featherlight.min.js',
    // './js/featherlight.gallery.min.js',
    // './js/main.js',
		'./images/flatiron-bw.jpg',
		'./images/comey-sq.jpg',
		'./images/humans-to-candy.jpg',
		'./images/thinking.sq.jpg',
		'./images/lens.sq.jpg',
		'./images/optim-HomeRun@450x450.jpg',
		'./images/snorkel-down@450x450.jpg',
		'./images/optim-reqs-want-need-balance.jpg',
		'./images/conflicted-lady-liberty.jpg',
		'./images/bishop-bistro@450x450.jpg',
		'./images/optim-flying-v-sq.jpg',
		'./images/optim-library-Wikimedia@450x450.jpg',
		'./images/hexo_logo.svg',
		'./search.xml',
    './content.json'
    ]);
  }));
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // You can use `respondWith()` to answer ASAP...
  evt.respondWith(fromCache(evt.request));
  // ...and `waitUntil()` to prevent the worker to be killed until
  // the cache is updated.
  evt.waitUntil(
    update(evt.request)
    // Finally, send a message to the client to inform it about the
    // resource is up to date.
    .then(refresh)
  );
});

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}


// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

// Sends a message to the clients.
function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      // Encode which resource has been updated. By including the
      // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
      // check if the content has changed.
      var message = {
        type: 'refresh',
        url: response.url,
        // Notice not all servers return the ETag header. If this is not
        // provided you should use other cache headers or rely on your own
        // means to check if the content has changed.
        eTag: response.headers.get('etag') || response.headers.get('ETag')
      };
      // Tell the client about the update.
      client.postMessage(JSON.stringify(message));
    });
  });
}
