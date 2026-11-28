/* Versioned app shell only. Personal data stays in LocalStorage/IndexedDB. */
const CACHE='mypanda-shell-1.6.1';
const files=['index.html','push.js?v=1.6.1','manifest.webmanifest','logo.png','icon.png','apple-touch-icon.png'];
const url=p=>new URL(p,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(files.map(p=>new Request(url(p),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('mypanda-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url),root=new URL(self.registration.scope);if(r.method!=='GET'||u.origin!==root.origin||!u.pathname.startsWith(root.pathname))return;const path=u.pathname.slice(root.pathname.length);if(path==='version.json')return;const navigation=r.mode==='navigate'&&(path===''||path==='index.html'),asset=files.some(p=>url(p)===u.href);if(!navigation&&!asset)return;event.respondWith((async()=>{const cache=await caches.open(CACHE),key=navigation?url('index.html'):r;try{const response=await fetch(r,{cache:'no-store'});if(response.ok){if(response.type==='basic'&&!navigation)try{await cache.put(key,response.clone())}catch{}return response}if(response.status<500)return response;throw Error('network')}catch(e){const saved=await cache.match(key);if(saved)return saved;throw e}})())});
self.addEventListener('push',event=>{
 let test=false;try{test=event.data?.json()?.type==='test'}catch{}
 event.waitUntil(self.registration.showNotification('myPanda',{
 body:test?'Notifica di prova ricevuta.':'Hai un promemoria del tuo garage. Apri myPanda per consultarlo.',
 icon:new URL('icon.png',self.registration.scope).href,
 tag:test?'mypanda-test':undefined
 }));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of windows)if(c.url.startsWith(self.registration.scope)){await c.focus();return}await self.clients.openWindow(self.registration.scope)})())});
