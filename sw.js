/* No fetch handler: myPanda always uses the network/browser cache, never a stale app shell. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let test=false;try{test=event.data?.json()?.type==='test'}catch{}
 event.waitUntil(self.registration.showNotification('myPanda',{
 body:test?'Notifica di prova ricevuta.':'Hai un promemoria del tuo garage. Apri myPanda per consultarlo.',
 icon:new URL('icon.png',self.registration.scope).href,
 tag:test?'mypanda-test':undefined
 }));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of windows)if(c.url.startsWith(self.registration.scope)){await c.focus();return}await self.clients.openWindow(self.registration.scope)})())});
