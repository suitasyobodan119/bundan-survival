/* ===================== 乗り物・出動指令・高層ビル火災 ===================== */
const RIDES={truck:{name:'ポンプ車',get v(){return T},own:()=>S.lv.truck>=1,spd:()=>truckSpeed()*1.5},
  amb:{name:'救急車',get v(){return VEH.amb},own:()=>!!S.lv.amb,spd:()=>290},
  ladder:{name:'はしご車',get v(){return VEH.ladder},own:()=>!!S.lv.ladder,spd:()=>250},
  boat:{name:'救助ボート',get v(){return BOAT},own:()=>boatOn(),spd:()=>(inZone(BOAT.x,BOAT.y)||inRiver(BOAT.x,BOAT.y))?230:70}};
const boatOn=()=>!!((ty&&ty.boat)||rain);
const RIDE_TIP={boat:'救助ボートで出動！ 水の中を速く進める',truck:'ポンプ車で出動！ 近くの火とヒノコに放水する',amb:'救急車で出動！ 倒れた人のところへ',ladder:'はしご車で出動！ 高いところの火事と救助ができる'};
const rideV=()=>P.ride?RIDES[P.ride].v:null;
function board(k){const v=RIDES[k].v;P.ride=k;P.x=v.x;P.y=v.y;P.spray=null}
function unboard(){const v=rideV();P.ride=null;let x=v.x,y=v.y+34;if(blocked(x,y)){x=v.x;y=v.y}P.x=x;P.y=y}
function nearRide(){let b=null,bd=80;for(const k in RIDES){if(!RIDES[k].own())continue;const v=RIDES[k].v,d=dist(P.x,P.y,v.x,v.y);if(d<bd){bd=d;b=k}}return b}
function dispatch(title,sub,opts){modal(`<h2>出動指令！</h2><p class="lead">${title}</p><p class="note">${sub}</p>${opts.map(o=>`<button class="btn ${o.k==='walk'?'sub':''}" data-act="go" data-v="${o.k}">${o.label}</button>`).join('')}`)}
function goDispatch(k){if(k.startsWith('bus:')){travel(k.slice(4));return}closeModal();if(k!=='walk'&&RIDES[k]&&RIDES[k].own()){board(k);toast(`詰所から${RIDES[k].name}で出動！ 矢印の方へ向かおう`,'ok');snd('boss')}}
let HRB=BLD.find(b=>b.id==='hr');const HRBS=()=>BLD.filter(b=>b.id==='hr');
let hr=null,hrT=100,hrW=0;
const winXY=(c,r,b=HRB)=>({x:b.x-b.w/2+15+c*22,y:b.y+b.h/2-b.ht+16+r*21});
function startHR(){const bs=HRBS().filter(b=>inArea(b.x,b.y,0));if(!bs.length)return;HRB=bs[Math.floor(Math.random()*bs.length)];const hd=distOf(HRB.x,HRB.y);const cols=[0,1,2,3].sort(()=>Math.random()-.5);
  hr={t:150,fires:[0,1,2].map(i=>({c:cols[i],r:i%2,hp:26})),people:[{c:cols[3],r:2,saved:false},{c:cols[0],r:3,saved:false}],rt:0,near:false,aim:null};
  snd('boss');buzz([80,60,80]);dispatch(hd?`${hd.name}から応援要請！ 高層ビル火災`:'マンションで高層ビル火災！','高い階はホースが届かない。はしご車で出動して、放水と救助をしよう。はしご車の水は少ないので、消火栓・防火水槽につなぐか、近くのポンプ車から送水してもらおう',[{k:'ladder',label:'はしご車で出動'},{k:'walk',label:'あとで行く'}])}
function updHighrise(dt){
  if(!S.lv.ladder||ty)return;
  if(!hr){hrT-=dt;if(hrT<=0){hrT=170+Math.random()*40;startHR()}return}
  hr.t-=dt;const L=VEH.ladder;hr.near=P.ride==='ladder'&&dist(L.x,L.y,HRB.x,HRB.y+HRB.h/2)<200;hr.aim=null;
  if(hr.near){const f=hr.fires.find(f=>f.hp>0);if(f&&!(L.w>0||L.conn)){hrW-=dt;if(hrW<=0){hrW=2.5;float(L.x,L.y-80,'水がない！ 消火栓などにつなごう','#ffd0c6',13)}}if(f&&(L.w>0||L.conn)){f.hp-=(8+2*yl())*dt;if(!L.conn)L.w=Math.max(0,L.w-6*dt);hr.aim=winXY(f.c,f.r);if(f.hp<=0){addMerit(2);drop('coin',HRB.x,HRB.y+50,3);const w=winXY(f.c,f.r);float(w.x,w.y-10,'消えた！','#fff',13);snd('kill')}}
    const p=hr.people.find(p=>!p.saved);if(p){hr.rt+=dt;if(!hr.aim)hr.aim=winXY(p.c,p.r);if(hr.rt>2.2){hr.rt=0;p.saved=true;const w=winXY(p.c,p.r);addMerit(3);drop('coin',HRB.x,HRB.y+50,6+2*yl());float(w.x,w.y-10,'はしごで救助！','#fff',13);burst(w.x,w.y,'#3d93db',12);snd('buy')}}}
  else if(!P.ride&&dist(P.x,P.y,HRB.x,HRB.y)<220){hrW-=dt;if(hrW<=0){hrW=2.5;float(P.x,P.y-60,'高すぎて届かない！ はしご車で出動しよう','#ffd0c6',13)}}
  const fo=hr.fires.every(f=>f.hp<=0),ps=hr.people.every(p=>p.saved);
  if((fo&&ps)||hr.t<=0){const ok=fo&&ps,sv=hr.people.filter(p=>p.saved).length;hr=null;
    pop(ok?'高層ビル火災 鎮火・全員救助！':'高層ビル火災 おわり',`助けた人 ${sv}/2`);if(ok){stAdd('hr');drop('coin',P.x,P.y,25*yl());addMerit(10);const hd=distOf(HRB.x,HRB.y);if(hd)support(hd.id);setTimeout(()=>giveBox('高層ビル火災で全員を救助'),1500)}else addMerit(2)}
}
function drawHighrise(t,b){box(b.x,b.y,b.w,b.h,b.ht,'#dfe5ec','#9aa8ba');
  for(let r=0;r<7;r++)for(let c=0;c<4;c++){const w=winXY(c,r);cx.fillStyle='#8fb3d6';cx.fillRect(w.x-7,w.y-7,14,12);cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(w.x-7,w.y-7,14,3)}
  cx.fillStyle='#7d5b3f';cx.fillRect(b.x-12,b.y+b.h/2-24,24,24);label('マンション',b.x,b.y+b.h/2-b.ht-b.h/2-12,12,'#fff','#5d6b84');
  if(!hr||b!==HRB)return;
  for(const f of hr.fires){if(f.hp<=0)continue;const w=winXY(f.c,f.r);cx.fillStyle='#3a2a22';cx.fillRect(w.x-7,w.y-7,14,12);
    for(let i=0;i<4;i++){const a=t/100+i*1.9;cx.fillStyle=i%2?'rgba(255,190,60,.95)':'rgba(240,90,40,.9)';cx.beginPath();cx.ellipse(w.x+Math.sin(a)*4,w.y-8-Math.abs(Math.cos(a))*8,5,10,0,0,7);cx.fill()}
    if(Math.random()<.3)parts.push({k:'smoke',x:w.x,y:w.y-16,r:5,life:1})}
  for(const p of hr.people){if(p.saved)continue;const w=winXY(p.c,p.r);cx.fillStyle='#f2c7a1';cx.beginPath();cx.arc(w.x,w.y-1,4,0,7);cx.fill();cx.strokeStyle='#f2c7a1';cx.lineWidth=2;const k=Math.sin(t/120)*3;cx.beginPath();cx.moveTo(w.x-4,w.y+2);cx.lineTo(w.x-8+k,w.y-8);cx.moveTo(w.x+4,w.y+2);cx.lineTo(w.x+8-k,w.y-8);cx.stroke();label('たすけて！',w.x,w.y-20,10,'#fff','#e5432a')}
  const L=VEH.ladder;if(hr.near&&hr.aim){cx.strokeStyle='#c9ced8';cx.lineWidth=4;cx.beginPath();cx.moveTo(L.x,L.y-40);cx.lineTo(hr.aim.x,hr.aim.y+8);cx.stroke();cx.lineWidth=1.5;cx.beginPath();const n=10;for(let i=1;i<n;i++){const q=i/n,x=L.x+(hr.aim.x-L.x)*q,y=L.y-40+(hr.aim.y+8-L.y+40)*q;cx.moveTo(x-4,y);cx.lineTo(x+4,y)}cx.stroke();
    const f=hr.fires.find(f=>f.hp>0);if(f&&(L.w>0||L.conn)){const w=winXY(f.c,f.r);for(let i=0;i<3;i++){const q=((t/300)+i/3)%1;cx.fillStyle='rgba(61,147,219,.85)';cx.beginPath();cx.arc(L.x+(w.x-L.x)*q,L.y-40+(w.y-L.y+40)*q-Math.sin(q*Math.PI)*20,3.5,0,7);cx.fill()}}}
}

