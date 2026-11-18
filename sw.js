// 分団サバイバル：オフラインでも開けるようにするサービスワーカー
// ゲーム本体は「ネット優先」（更新がすぐ届く）、絵やアイコンは「保存したもの優先」
// 絵やアイコンを同じ名前で差し替えたら、下の 'bs-v1' を 'bs-v2' のように変える（古い保存分が消える）
const V='bs-v1';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(ca=>ca.put(r.mode==='navigate'?'index.html':r,c));return res}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r).then(m=>m||caches.match('./'))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(ca=>ca.put(r,c))}return res})))});
