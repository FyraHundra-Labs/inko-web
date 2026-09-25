const CACHE = "inko-demo-v1";
const ASSETS = [
	"/demo/",
	"/demo/index.html",
	"/demo/app.css",
	"/demo/app.js",
	"/demo/app-data.js",
	"/demo/heart-path.js",
	"/demo/manifest.webmanifest",
	"/demo/assets/patrick-hand.ttf",
	"/demo/assets/icon-180.png",
	"/demo/assets/icon-192.png",
	"/demo/assets/icon-512.png",
];
self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
	event.waitUntil(
		Promise.all([
			caches
				.keys()
				.then((keys) =>
					Promise.all(
						keys
							.filter((key) => key.startsWith("inko-demo-") && key !== CACHE)
							.map((key) => caches.delete(key)),
					),
				),
			self.clients.claim(),
		]),
	);
});
self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	if (
		event.request.method !== "GET" ||
		url.origin !== self.location.origin ||
		!url.pathname.startsWith("/demo/")
	)
		return;
	event.respondWith(
		caches.match(event.request).then(
			(cached) =>
				cached ||
				fetch(event.request).catch((error) => {
					if (event.request.mode === "navigate") return caches.match("/demo/");
					throw error;
				}),
		),
	);
});
