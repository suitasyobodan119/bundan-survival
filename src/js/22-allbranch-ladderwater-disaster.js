/* ===================== 全分団・はしご車の水・分団ごとの災害 ===================== */
const NEWD=['d_nw','d_ne','d_sw','d_se'];
const DCENT=id=>DIST.find(d=>d.id===id);
const STATION=(()=>{const d=DCENT('d_ne');return{x:d.x,y:d.y-190}})();
const FEST=(()=>{const d=DCENT('d_se');return{x:d.x,y:d.y-210}})();
const FACPOS=[[-190,-200],[190,-210],[-300,60],[300,40]];
BLD.push({id:'station',x:STATION.x,y:STATION.y,w:150,h:44,ht:30});
function roadOf(d){const sx=d.y<0?0:(d.x<0?-600:600),sy=d.y<0?-560:140;return [sx,sy,d.x,d.y+40]}
function segD(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let q=((px-ax)*dx+(py-ay)*dy)/l;q=clamp(q,0,1);return Math.hypot(px-ax-q*dx,py-ay-q*dy)}
genWorld=(o=>function(){o();const r=mulberry(2468);const add=[];
  const ok=(x,y,d)=>dist(x,y,d.x,d.y)<500&&Math.hypot(x,y)>1090&&Math.abs(y-riverY(x))>62&&!nearDistStuff(x,y)&&dist(x,y,STATION.x,STATION.y)>120&&dist(x,y,FEST.x,FEST.y)>130;
  for(const id of NEWD){const d=DCENT(id);const step=id==='d_nw'?66:id==='d_sw'?96:84;
    if(id==='d_sw')FACPOS.forEach(([dx,dy])=>add.push({x:d.x+dx,y:d.y+dy,w:120,h:60,ht:34,roof:'#8796aa',st:'ok',hp:0,burn:0,t:0,sm:0,fac:true,dk:id}));
    for(let gx=d.x-520;gx<=d.x+520;gx+=step)for(let gy=d.y-520;gy<=d.y+520;gy+=step){const x=gx+(r()-.5)*step*.45,y=gy+(r()-.5)*step*.45;if(!ok(x,y,d))continue;
      if(id==='d_sw'&&FACPOS.some(([dx,dy])=>dist(x,y,d.x+dx,d.y+dy)<110))continue;
      if(segD(x,y,...roadOf(d))<40)continue;
      const v=r();
      if(id==='d_nw'){if(v<.58)add.push({x,y,w:36+r()*8,h:30+r()*6,ht:18,roof:['#6b4a3a','#7a5a3a','#5f4a3f','#80604a'][Math.floor(r()*4)],st:'ok',hp:0,burn:0,t:0,sm:0,old:true,dk:id});else if(v<.74)trees.push(mkTree(x,y))}
      else if(id==='d_ne'){if(v<.55)add.push({x,y,w:46+r()*12,h:34+r()*6,ht:22,roof:['#e5432a','#3d93db','#f3b648','#2fa86b','#8a7aa8'][Math.floor(r()*5)],st:'ok',hp:0,burn:0,t:0,sm:0,shop:true,dk:id});else if(v<.66)trees.push(mkTree(x,y))}
      else if(id==='d_sw'){if(v<.3)add.push({x,y,w:44,h:34,ht:20,roof:ROOFS[Math.floor(r()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0,dk:id});else if(v<.55)trees.push(mkTree(x,y))}
      else{if(v<.42)add.push({x,y,w:44+r()*12,h:34+r()*8,ht:20,roof:ROOFS[Math.floor(r()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0,dk:id});else if(v<.72)trees.push(mkTree(x,y))}}}
  houses.push(...add);
  trees=trees.filter(t=>!NEWD.some(id=>segD(t.x,t.y,...roadOf(DCENT(id)))<34&&dist(t.x,t.y,DCENT(id).x,DCENT(id).y)<560)&&dist(t.x,t.y,STATION.x,STATION.y)>110&&dist(t.x,t.y,FEST.x,FEST.y)>120&&!(DCENT('d_sw')&&FACPOS.some(([dx,dy])=>dist(t.x,t.y,DCENT('d_sw').x+dx,DCENT('d_sw').y+dy)<95)))})(genWorld);

/* --- はしご車の水 --- */
const LCAP=()=>20;
let lTip=false,lW=0;
function updLadderWater(dt){if(!S.lv.ladder)return;const L=VEH.ladder;if(L.w==null)L.w=LCAP();const ws=waterSrc(L);L.conn=ws&&dist(L.x,L.y,ws.x,ws.y)<(ws.k==='river'?40:82)?ws:null;
  if(L.conn)L.w=Math.min(LCAP(),L.w+45*dt);
  if(P.ride==='ladder'&&L.w<1&&!L.conn){if(!lTip){lTip=true;toast('はしご車の水がなくなった！ 消火栓・防火水槽・川につないで補給しよう','ng')}lW-=dt;if(lW<=0){lW=2.5;float(L.x,L.y-80,'水がない！ 水利につなごう','#ffd0c6',13)}}}
drawVeh=(o=>function(kind,v,t){o(kind,v,t);if(kind!=='ladder'||v.w==null)return;const f=clamp(v.w/LCAP(),0,1),x=v.x-22,y=v.y-66;
  if(v.conn&&(v.spray||v.w<LCAP()-.5||(hr&&hr.aim))){cx.strokeStyle='#d7a52b';cx.lineWidth=3;cx.beginPath();cx.moveTo(v.x,v.y-10);cx.quadraticCurveTo((v.x+v.conn.x)/2,(v.y+v.conn.y)/2+20,v.conn.x,v.conn.y-8);cx.stroke()}
  cx.fillStyle='rgba(27,39,64,.7)';rr(x-2,y-2,48,9,4);cx.fill();cx.fillStyle=f<.25?'#ff6b4a':'#3d93db';cx.fillRect(x,y,44*f,5);
  if(v.conn)label(v.conn.k==='pump'?'送水中':'補給中',v.x,y-10,9,'#fff','#2f78b8');else if(f<.05)label('水がない',v.x,y-10,9,'#fff','#e5432a')})(drawVeh);

/* --- 分団ごとの災害（千二・豊津・吹一・吹二） --- */
let dEv=null,devT=130;
const DEVK={d_nw:'spread',d_ne:'swarm',d_sw:'factory',d_se:'heat'};
const HEAT_TIPS=['すずしい日かげへ運ぼう','首やわきの下を冷やそう','水分と塩分をとろう','意識がないときは119番！'];
function devOpts(id,k){const o=[];if(k==='heat'){if(S.lv.amb)o.push({k:'amb',label:'救急車で出動'})}else if(S.lv.truck)o.push({k:'truck',label:'ポンプ車で出動'});return [...o,...busOpt(id),{k:'walk',label:'歩いて向かう'}]}
function startDev(id){const d=DCENT(id),k=DEVK[id],nm=d.name;
  if(k==='spread'){const c=houses.filter(h=>h.dk===id&&h.st==='ok'&&dist(h.x,h.y,d.x,d.y)<380);if(!c.length)return;const h=c[Math.floor(Math.random()*c.length)];ignite(h);h.ev=true;
    dEv={k,id,t:120,list:[h],sp:7,max:7};dispatch(`${nm}から応援要請！ 延焼火災`,'古い木造の家が多く、火がとなりの家に燃え移っていく。早く消そう！ ポンプ車はイベントの火事には自動で行きません',devOpts(id,k))}
  else if(k==='swarm'){const ms=[];for(let i=0,k=0;i<7&&k<200;k++){const a=Math.random()*Math.PI*2,rr0=440+Math.random()*60,x=d.x+Math.cos(a)*rr0,y=d.y+Math.sin(a)*rr0;if(houses.some(h=>h.st==='ok'&&dist(h.x,h.y,x,y)<90)||inRiver(x,y))continue;i++;const hp=6*Math.pow(1.7,yl()-1);const m={x,y,hp,max:hp,boss:false,t:Math.random()*9,hit:0,house:null,sw:true};mons.push(m);ms.push(m)}
    dEv={k,id,t:100,ms,killed:0};dispatch(`${nm}から応援要請！ ヒノコの大群`,'駅前の商店街にヒノコの大群が向かっている。家に火がつく前に倒そう！',devOpts(id,k))}
  else if(k==='factory'){const c=houses.filter(h=>h.fac&&h.st==='ok');if(!c.length)return;const h=c[Math.floor(Math.random()*c.length)];ignite(h);h.ev=true;h.hp=120*(1+.6*(yl()-1));h.fmax=h.hp;
    dEv={k,id,t:120,h};dispatch(`${nm}から応援要請！ 工場火災`,'大きな工場が燃えている。たくさんの水が必要！ 水がなくなったら消火栓・防火水槽で補給しながら消そう',devOpts(id,k))}
  else if(k==='heat'){const ps=[[-60,30],[70,10],[0,-60]].map(([dx,dy])=>({x:FEST.x+dx,y:FEST.y+dy,care:0,ok:false}));dEv={k,id,t:90,ps,tip:0};
    dispatch(`${nm}から応援要請！ 夏祭りで熱中症`,'具合が悪くなった人がいる。そばに行って手当てしよう（救急車だと早い）',devOpts(id,k))}
  snd('boss');buzz([80,60,80])}
function endDev(ok,msg){const e=dEv;dEv=null;devT=150+Math.random()*40;const d=DCENT(e.id);
  pop(ok?`${msg} 成功！`:`${msg} おわり`,ok?`${d.name}「応援ありがとう！」`:'次はもっと早く駆けつけよう');
  if(ok){drop('coin',P.x,P.y,15*yl());addMerit(6);support(e.id);stAdd('dev');setTimeout(()=>giveBox(`${d.name}の${msg}`),1500)}else addMerit(1)}
function updDev(dt){
  const opened=NEWD.filter(id=>S.lv[id]);if(!opened.length)return;
  if(!dEv){if(ty||hr||eq||ff||rain||em)return;devT-=dt;if(devT<=0){devT=40;startDev(opened[Math.floor(Math.random()*opened.length)])}return}
  const e=dEv;e.t-=dt;
  if(e.k==='spread'){e.sp-=dt;if(e.sp<=0){e.sp=7;const burning=e.list.filter(h=>h.st==='fire');if(e.list.length<e.max)for(const b of burning){const n=nearest(houses,b.x,b.y,h=>h.st==='ok'&&h.dk===e.id&&!e.list.includes(h)&&dist(h.x,h.y,b.x,b.y)<150);if(n){ignite(n);n.ev=true;e.list.push(n);float(n.x,n.y-50,'燃え移った！','#ffd0c6',13);break}}}
    if(!e.list.some(h=>h.st==='fire')){const lost=e.list.filter(h=>h.st==='ruin').length;endDev(lost===0,'延焼火災')}else if(e.t<=0){e.list.forEach(h=>{if(h.st==='fire'){h.st='ok';h.ev=false}});endDev(false,'延焼火災')}}
  else if(e.k==='swarm'){if(!e.ms.some(m=>!m.dead&&mons.includes(m)))endDev(e.ms.length-e.killed<=2,'ヒノコの大群 撃退');else if(e.t<=0){e.ms.forEach(m=>m.dead=true);endDev(false,'ヒノコの大群 撃退')}}
  else if(e.k==='factory'){if(e.h.st!=='fire')endDev(e.h.st==='ok','工場火災 鎮火');else if(e.t<=0){e.h.st='ok';e.h.ev=false;endDev(false,'工場火災 鎮火')}}
  else if(e.k==='heat'){const near=P.ride==='amb'?VEH.amb:(P.ride?null:P);
    for(const p of e.ps){if(p.ok)continue;if(near&&dist(near.x,near.y,p.x,p.y)<(P.ride==='amb'?70:40)){p.care+=dt*(P.ride==='amb'?2:1);if(p.care>=2){p.ok=true;addMerit(2);drop('coin',p.x,p.y,4+yl());float(p.x,p.y-50,HEAT_TIPS[e.tip++%HEAT_TIPS.length],'#fff',14);burst(p.x,p.y-20,'#2fa86b',16);snd('buy')}}}
    if(e.ps.every(p=>p.ok))endDev(true,'熱中症の手当て');else if(e.t<=0)endDev(false,'熱中症の手当て')}}
killMon=(o=>function(m){o(m);if(m.sw&&dEv&&dEv.k==='swarm')dEv.killed++})(killMon);
function devGuide(){const e=dEv;if(!e)return null;const nm=DCENT(e.id).name;
  if(e.k==='spread'){const h=nearest(e.list,P.x,P.y,o=>o.st==='fire');return h&&{t:`${nm}で延焼火災！ 燃え移る前に消そう（燃えている家 ${e.list.filter(h=>h.st==='fire').length}軒・あと${Math.ceil(e.t)}秒）`,tg:h,mode:'alert'}}
  if(e.k==='swarm'){const m=nearest(e.ms,P.x,P.y,m=>!m.dead);const n=e.ms.filter(m=>!m.dead).length;return m&&{t:`${nm}にヒノコの大群！ 商店街を守ろう（のこり${n}匹）`,tg:m,mode:'alert'}}
  if(e.k==='factory')return {t:`${nm}で工場火災！ たくさん放水しよう。水がなくなったら水利で補給（あと${Math.ceil(e.t)}秒）`,tg:e.h,mode:'alert'};
  if(e.k==='heat'){const p=nearest(e.ps,P.x,P.y,p=>!p.ok);return p&&{t:`${nm}の夏祭りで熱中症！ そばで手当てしよう（あと${Math.ceil(e.t)}秒）`,tg:p,mode:'alert'}}}
function setGuide(g){guide=g;const el=document.getElementById('goal');el.className=g.mode||'';document.getElementById('goalTag').textContent=g.mode==='gold'?'コイン':g.mode==='alert'?'出動':'目標';const gt=document.getElementById('goalText');if(gt.textContent!==g.t)gt.textContent=g.t}
updGuide=(o=>function(){o();let g=null;
  if(dEv&&guide.mode!=='alert')g=devGuide();
  const L=VEH.ladder;if(P.ride==='ladder'&&L.w!=null&&L.w<LCAP()*.2&&!L.conn){const ws=waterSrc(L);if(ws)g={t:'はしご車の水が少ない！ 消火栓・防火水槽・川の近くに止めてつなごう',tg:ws,mode:'alert'}}
  if(g)setGuide(g)})(updGuide);

/* --- 描画（工場・駅・夏祭り・道路・患者） --- */
drawHouse=(o=>function(h,t){o(h,t);if(!h.fac||h.st==='ruin')return;const top=h.y-h.h/2-h.ht;
  cx.fillStyle='#6f7d92';for(let i=0;i<4;i++){const x0=h.x-h.w/2+i*h.w/4;cx.beginPath();cx.moveTo(x0,top+h.h*.55);cx.lineTo(x0+h.w/4,top+h.h*.15);cx.lineTo(x0+h.w/4,top+h.h*.55);cx.closePath();cx.fill()}
  cx.fillStyle='#9aa3b2';cx.fillRect(h.x+h.w/2-18,top-30,10,40);cx.fillStyle='#e5432a';cx.fillRect(h.x+h.w/2-18,top-30,10,5);
  label('工場',h.x,h.y+h.h/2-h.ht/2,10,'#22355c');
  if(h.st==='fire'&&h.fmax){const f=clamp(h.hp/h.fmax,0,1);cx.fillStyle='rgba(27,39,64,.7)';rr(h.x-32,top-48,64,8,4);cx.fill();cx.fillStyle='#ff6b4a';cx.fillRect(h.x-31,top-47,62*f,6)}})(drawHouse);
drawBld=(o=>function(b,t){if(b.id!=='station')return o(b,t);if(!S.lv.d_ne&&dist(cam.x,cam.y,b.x,b.y)>900)return;
  cx.fillStyle='#b9c2cf';cx.fillRect(b.x-260,b.y+b.h/2+6,520,6);cx.fillStyle='#8a94a6';for(let x=-256;x<260;x+=18)cx.fillRect(b.x+x,b.y+b.h/2+4,4,10);
  box(b.x,b.y,b.w,b.h,b.ht,'#eef1f5','#2f78b8');cx.fillStyle='#bfe0f5';for(let i=0;i<5;i++)cx.fillRect(b.x-60+i*26,b.y+b.h/2-b.ht+8,16,10);
  label('駅',b.x,b.y-b.h/2-b.ht+14,14,'#fff',null,'#1f5c94')})(drawBld);
drawBusStops=(o=>function(t){
  for(const d of openD()){if(!NEWD.includes(d.id))continue;cx.strokeStyle='#cfd8e2';cx.lineWidth=24;cx.lineCap='butt';cx.beginPath();
    const [sx,sy,ex,ey]=roadOf(d);cx.moveTo(sx,sy);cx.lineTo(ex,ey);cx.stroke()}
  if(S.lv.d_se&&dist(cam.x,cam.y,FEST.x,FEST.y)<900){const f=FEST;cx.fillStyle='#ead9b8';cx.beginPath();cx.ellipse(f.x,f.y,120,70,0,0,7);cx.fill();
    cx.fillStyle='#8a5a3a';cx.fillRect(f.x-26,f.y-60,52,30);cx.fillStyle='#e5432a';cx.fillRect(f.x-30,f.y-64,60,6);cx.fillStyle='#fff';cx.fillRect(f.x-30,f.y-44,60,4);
    for(let i=0;i<9;i++){const a=i/9*Math.PI*2,x=f.x+Math.cos(a)*105,y=f.y+Math.sin(a)*58;cx.fillStyle=i%2?'#e5432a':'#f3b648';cx.beginPath();cx.ellipse(x,y-26,5,7,0,0,7);cx.fill();cx.fillStyle='#5d6b84';cx.fillRect(x-1,y-20,2,20)}
    label('夏祭り',f.x,f.y-80,12,'#fff','#e5432a')}
  o(t)})(drawBusStops);
function drawHeat(t){if(!dEv||dEv.k!=='heat')return;for(const p of dEv.ps){if(p.ok)continue;const pl=1+.15*Math.sin(t/140);cx.strokeStyle='rgba(229,67,42,.8)';cx.lineWidth=3;cx.beginPath();cx.ellipse(p.x,p.y,30*pl,12*pl,0,0,7);cx.stroke();
  shadow(p.x,p.y+3,18,5);cx.fillStyle='#f3b648';rr(p.x-13,p.y-8,22,10,4);cx.fill();cx.fillStyle='#2b2f3a';cx.fillRect(p.x-21,p.y-6,9,6);cx.fillStyle='#f2c7a1';cx.beginPath();cx.arc(p.x+13,p.y-4,6,0,7);cx.fill();
  label('熱中症',p.x,p.y-30,12,'#fff','#e5432a');if(p.care>0){cx.fillStyle='rgba(27,39,64,.7)';rr(p.x-18,p.y-48,36,6,3);cx.fill();cx.fillStyle='#2fa86b';cx.fillRect(p.x-17,p.y-47,34*clamp(p.care/2,0,1),4)}}}
drawPads=(o=>function(t){o(t);drawHeat(t)})(drawPads);
resetWorld=(o=>function(){o();dEv=null;devT=130;lTip=false})(resetWorld);
update=(o=>function(dt){o(dt);updLadderWater(dt);updDev(dt)})(update);
BADGES.push(['dist8','🗺️','全9分団 そろう',()=>openD().length>=8],['dev3','🚨','分団の応援出動（3回）',()=>(S.st.dev||0)>=3]);

