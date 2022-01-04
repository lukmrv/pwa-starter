// This is the naive way - if content of any files change - change cacheName and if online - will be updated and added to the shell (on hard reload)
const cacheName = "v1.0.0";

const assets = ["/", "/index.html", "/icon.png"];

// caching all resources
self.addEventListener("install", (installEvent) => {
	installEvent.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName);
			console.log("[Service Worker] Caching all: app shell and content");
			await cache.addAll(assets);
		})()
	);
});

// fetching app shell (cache)
self.addEventListener("fetch", (e) => {
	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
			if (r) {
				return r;
			}
			const response = await fetch(e.request);
			const cache = await caches.open(cacheName);
			console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
			cache.put(e.request, response.clone());
			return response;
		})()
	);
});

// clearing old cache
self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key === cacheName) {
						return;
					}
					return caches.delete(key);
				})
			);
		})
	);
});
