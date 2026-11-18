/* Clue Duel's old address, retired (Master Keys v09). Installed copies of the old app still run their old offline
   worker at /clue-duel/; when they check for an update they get this one, which removes the old app's offline copy,
   switches itself off and reloads the open pages, so they land on the forwarding page and go on to /master-keys/.
   Only caches named "clue-duel-…" are removed: Master Keys keeps its own ("master-keys-…"). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('clue-duel-')).map(k => caches.delete(k)));
    try { await self.clients.claim(); } catch (err) { /* ignore */ }
    await self.registration.unregister();
    const wins = await self.clients.matchAll({ type: 'window' });
    for (const w of wins) { try { await w.navigate(w.url); } catch (err) { /* the old app's "New version ready" bar reloads it instead */ } }
  })());
});
