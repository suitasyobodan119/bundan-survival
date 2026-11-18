/* ===================== 分団・路線バス・ゲリラ豪雨・分団対抗 ===================== */
const HOME_STOP={key:'home',get name(){return homeName()},x:175,y:205};
const distOf=(x,y)=>Math.hypot(x,y)<radius()?null:DIST.find(d=>dist(x,y,d.x,d.y)<d.r)||null;
const townName=()=>{const d=distOf(P.x,P.y);return d?d.name:homeName()};
function busOpt(did){const d=DIST.find(d=>d.id===did);return S.lv.bus&&d&&S.lv[did]?[{k:'bus:'+did,label:`バスで${d.name}へ`}]:[]}
function support(did){const d=DIST.find(d=>d.id===did);if(!d)return;addMerit(3);float(P.x,P.y-80,`${d.name}「応援ありがとう！」`,'#ffe08a',14)}
let busAway=true,busFx=null;
const stops=()=>S.lv.bus?[HOME_STOP,...openD().map(d=>({key:d.id,name:d.name,x:d.stop.x,y:d.stop.y}))]:[];
function updBus(dt){if(busFx){busFx.t+=dt;if(busFx.t>2.5)busFx=null}
  if(!S.lv.bus||P.ride)return;const st=stops(),s=st.find(s=>dist(P.x,P.y,s.x,s.y)<30);
  if(!s){if(!st.some(q=>dist(P.x,P.y,q.x,q.y)<52))busAway=true;return}
  if(!busAway)return;busAway=false;const others=st.filter(o=>o.key!==s.key);if(!others.length)return;
  modal(`<h2>路線バス</h2><p class="lead">${s.name} バス停<br>どこへ行く？</p>${others.map(o=>`<button class="btn" data-act="bus" data-v="${o.key}">${o.name}</button>`).join('')}<button class="btn sub" data-act="close">やめる</button>`)}
function travel(key){closeModal();if(P.ride)unboard();const dst=key==='home'?HOME_STOP:(()=>{const d=DIST.find(d=>d.id===key);return{name:d.name,x:d.stop.x,y:d.stop.y}})();
  P.x=dst.x;P.y=dst.y+40;cam.x=P.x;cam.y=P.y;busAway=false;busFx={x:dst.x,y:dst.y,t:0};toast(`路線バスで${dst.name}に着いた`,'ok');snd('new')}
function drawBusStops(t){
  for(const d of openD()){const s=d.sell,on=dist(P.x,P.y,s.x,s.y)<34;cx.fillStyle=on?'rgba(61,147,219,.35)':'rgba(255,255,255,.85)';cx.beginPath();cx.arc(s.x,s.y,30,0,7);cx.fill();
    cx.strokeStyle='#2f78b8';cx.lineWidth=3;cx.setLineDash([7,5]);cx.beginPath();cx.arc(s.x,s.y,30,0,7);cx.stroke();cx.setLineDash([]);icon('wood',s.x-11,s.y-5,.8);icon('coin',s.x+12,s.y,.9);label('買取所',s.x,s.y+44,12,'#fff','#2f78b8')}
  for(const s of stops()){cx.strokeStyle='#2fa86b';cx.lineWidth=2.5;cx.setLineDash([6,5]);cx.beginPath();cx.arc(s.x,s.y,28,0,7);cx.stroke();cx.setLineDash([]);
    cx.fillStyle='#5d6b84';cx.fillRect(s.x-2,s.y-44,4,40);cx.fillStyle='#2fa86b';cx.beginPath();cx.arc(s.x,s.y-48,11,0,7);cx.fill();icon('bus',s.x,s.y-48,.55);label('バス停',s.x,s.y+40,11,'#fff','#2fa86b')}
  if(busFx){const x=busFx.x-40+busFx.t*160,y=busFx.y-6;cx.globalAlpha=clamp(2.5-busFx.t,0,1);drawBus(x,y);cx.globalAlpha=1}}
function drawBus(x,y){shadow(x,y+3,44,7);cx.fillStyle='#23262e';cx.beginPath();cx.arc(x-24,y,7,0,7);cx.arc(x+24,y,7,0,7);cx.fill();cx.fillStyle='#f6f7f9';rr(x-44,y-36,88,32,6);cx.fill();cx.fillStyle='#2fa86b';cx.fillRect(x-44,y-16,88,7);cx.fillStyle='#bfe0f5';for(let i=0;i<5;i++)cx.fillRect(x-38+i*16,y-31,12,10)}
function drawDistBld(b,t){const d=b.d;box(b.x,b.y,b.w,b.h,b.ht,'#f3ede2','#e5432a');cx.fillStyle='#7d5b3f';cx.fillRect(b.x-14,b.y+b.h/2-24,28,24);label(d.name,b.x,b.y-b.h/2-b.ht+18,13,'#fff',null,'#b8321e');label('詰所',b.x,b.y+b.h/2-b.ht/2-4,10,'#22355c')}
/* ゲリラ豪雨（岸部分団） */
let rainT=120;
function startRain(){const c=houses.filter(h=>h.ds&&h.st==='ok').sort(()=>Math.random()-.5).slice(0,3);if(c.length<2)return;
  const zs=c.map(h=>({x:h.x,y:h.y,r:10,max:115,grow:true,ev:true}));zones.push(...zs);c.forEach(h=>{h.st='flood';h.person=true});
  const d=DIST.find(d=>d.id==='d_s'),z=zs[0],a=Math.atan2(d.stop.y-z.y,d.stop.x-z.x);BOAT.x=z.x+Math.cos(a)*(z.max*.85);BOAT.y=z.y+Math.sin(a)*(z.max*.85);for(const q of [d.stop,d.sell]){const dd=dist(BOAT.x,BOAT.y,q.x,q.y);if(dd<95){const k=(95-dd)/(dd||1);BOAT.x+=(BOAT.x-q.x)*k;BOAT.y+=(BOAT.y-q.y)*k}}
  rain={t:120,hs:c,zones:zs};snd('boss');buzz([80,60,80]);
  dispatch(`${distName('d_s')}から応援要請！ ゲリラ豪雨で浸水`,'家に取り残された人がいる。救助ボートに乗って助けよう',[...busOpt('d_s'),{k:'walk',label:'歩いて向かう'}])}
function updRain(dt){if(!S.lv.d_s||ty)return;
  if(!rain){rainT-=dt;if(rainT<=0){rainT=150+Math.random()*40;startRain()}return}
  rain.t-=dt;for(const z of rain.zones){if(z.grow){z.r=Math.min(z.max,z.r+40*dt);if(z.r>=z.max)z.grow=false}if(P.ride==='truck'&&dist(T.x,T.y,z.x,z.y)<z.r+70)z.r=Math.max(40,z.r-(16+8*S.lv.truck)*dt)}
  if(!rain.hs.some(h=>h.person)||rain.t<=0)endRain()}
function endRain(silent){const r=rain;rain=null;if(P.ride==='boat')unboard();const sv=r.hs.filter(h=>!h.person).length;r.hs.forEach(h=>{h.person=false;h.st='ok'});zones=zones.filter(z=>!r.zones.includes(z));
  if(silent)return;const all=sv===r.hs.length;pop(all?'浸水救助 完了！':'浸水救助 おわり',`助けた人 ${sv}/${r.hs.length}`);addMerit(all?6:1);if(all){support('d_s');setTimeout(()=>giveBox('岸部分団の浸水救助'),1500)}}
const LAKEc=()=>LAKE;
function drawLake(){if(dist(cam.x,cam.y,LAKE.x,LAKE.y)>1400)return;cx.fillStyle='#ddd2bb';cx.beginPath();cx.ellipse(LAKE.x,LAKE.y,LAKE.rx+12,LAKE.ry+10,0,0,7);cx.fill();cx.fillStyle='#8cc1ea';cx.beginPath();cx.ellipse(LAKE.x,LAKE.y,LAKE.rx,LAKE.ry,0,0,7);cx.fill();
  cx.strokeStyle='rgba(255,255,255,.5)';cx.lineWidth=2;cx.beginPath();for(let i=0;i<6;i++){const x=LAKE.x-80+i*30,y=LAKE.y-20+(i%3)*18;cx.moveTo(x,y);cx.lineTo(x+16,y)}cx.stroke()}
/* 分団対抗 操法大会 */
const RIVALS=['吹一','吹二','千一','千二','豊津','岸部','山田','千里丘'];

