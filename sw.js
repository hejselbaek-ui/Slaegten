// Gemmer appen og de låste data på telefonen, så den virker offline.
// Data hentes altid fra nettet først; den gemte kopi bruges kun uden forbindelse.
const CACHE='slaegten-v45';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','fonts/open-sans-latin-300-normal.woff2','fonts/open-sans-latin-400-normal.woff2','fonts/open-sans-latin-600-normal.woff2'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
