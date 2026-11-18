/* ===================== 更新 ===================== */
const vehBlocked=(x,y)=>blocked(x,y)||(Math.abs(y-riverY(x))<36&&Math.abs(x)>16)||((x+190)/150)**2+((y-1560)/90)**2<1;
let riverW=0;
function viaBridge(v,tx,ty){const sv=Math.sign(v.y-riverY(v.x))||1,st=Math.sign(ty-riverY(tx))||1;if(sv===st)return null;const by=riverY(0);if(Math.abs(v.x)>12||Math.abs(v.y-by)>80)return{x:0,y:by+sv*72};return{x:0,y:by+st*72}}
function moveBody(o,ix,iy,sp,dt,r,veh){
  const nx=o.x+ix*sp*dt,ny=o.y+iy*sp*dt;
  const bl=veh?vehBlocked:blocked;if(!bl(nx,o.y))o.x=nx;if(!bl(o.x,ny))o.y=ny;
  const m=r||14;if(!inArea(o.x,o.y,m)){let best=null,bd=1e9;for(const c of [{x:0,y:0,r:radius()},...openD()]){const d=dist(o.x,o.y,c.x,c.y)-c.r;if(d<bd){bd=d;best=c}}const d=dist(o.x,o.y,best.x,best.y)||1,Rr=best.r-m;o.x=best.x+(o.x-best.x)*Rr/d;o.y=best.y+(o.y-best.y)*Rr/d}
}
function damage(target,pw,dt){
  if(target.fire){target.fhp-=pw*dt;if(target.fhp<=0){target.fire=false;ffSaved++;drop('coin',target.x,target.y,2);addMerit(1);float(target.x,target.y-50,'消えた！','#fff',13)}return}
  if(target.max!==undefined){target.hp-=pw*dt;target.hit=.08;if(target.hp<=0&&!target.dead)killMon(target)}
  else{target.hp-=pw*dt;if(target.hp<=0&&target.st==='fire')extinguish(target)}
}
function killMon(m){
  m.dead=true;S.f.killed=true;addMerit(m.boss?15:1);if(m.boss)setTimeout(()=>giveBox('大ヒノコを倒したごほうび'),1200);const n=m.boss?10+5*yl():2+Math.floor(yl()/2);
  drop('stone',m.x,m.y,n);if(m.boss){drop('coin',m.x,m.y,15*yl());pop('大ヒノコ撃退！','炎の石とコインをたくさん拾おう');shake=10}
  else float(m.x,m.y-30,'撃退！','#fff',16);
  burst(m.x,m.y-10,'#ff9a3c',m.boss?40:14);snd('kill');buzz(25);
}
function extinguish(h){h.st='ok';h.burn=0;h.ev=false;S.f.ext=true;addMerit(3);drop('coin',h.x,h.y,3+2*yl());float(h.x,h.y-50,'ありがとう！','#fff',15);burst(h.x,h.y-20,'#3d93db',14);snd('kill')}
function spray(src,range,pw,dt,auto){
  let tg=null,bd=range;
  for(const m of mons){if(m.dead)continue;const d=dist(src.x,src.y,m.x,m.y);if(d<bd){bd=d;tg=m}}
  if(!tg)for(const h of houses){if(h.st!=='fire'||!active(h)||(auto&&h.ev))continue;const d=dist(src.x,src.y,h.x,h.y);if(d<bd){bd=d;tg=h}}
  if(!tg)for(const tr of trees){if(!tr.fire||auto)continue;const d=dist(src.x,src.y,tr.x,tr.y);if(d<bd){bd=d;tg=tr}}
  src.spray=tg;
  if(tg){damage(tg,pw,dt);src.face=tg.x>src.x?1:-1;
    if(Math.random()<.8)parts.push({k:'drop',src,tx:tg.x+(Math.random()-.5)*(tg.boss?50:22),ty:tg.y-(tg.boss?40:24)+(Math.random()-.5)*14,t:0,life:1,big:src===T})}
}
function hurt(n,from){
  P.hp-=n;P.hurt=1;P.since=0;shake=7;snd('hurt');buzz(60);
  const d=dist(P.x,P.y,from.x,from.y)||1;moveBody(P,(P.x-from.x)/d,(P.y-from.y)/d,900,.04);
  if(P.hp<=0){const lw=Math.floor(S.wood/2),ls=Math.floor(S.stone/2);S.wood-=lw;S.stone-=ls;drop('wood',P.x,P.y,lw);drop('stone',P.x,P.y,ls);
    P.x=START.x;P.y=START.y;P.hp=maxHp();P.hurt=2;toast('やられた！ 詰所で復活。ホースを強くするとヒノコに勝ちやすい','ng')}
}
function update(dt){
  const [ix,iy]=input();
  if(ix||iy){if(!moved){moved=true;document.getElementById('hint').hidden=true}}
  // 移動
  if(P.ride&&P.ride!=='boat'){const V=rideV();if(Math.abs(V.y-riverY(V.x))<70&&Math.abs(V.x)>16&&(ix||iy)){riverW-=dt;if(riverW<=0){riverW=3;float(V.x,V.y-60,'車は川を渡れない！ 橋を通ろう','#ffd0c6',13)}}}
  if(P.ride){const V=rideV();moveBody(V,ix,iy,RIDES[P.ride].spd(),dt,24,P.ride!=='boat');if(Math.abs(ix)>.1)V.face=ix>0?1:-1;V.moving=!!(ix||iy);P.x=V.x;P.y=V.y}
  else{moveBody(P,ix,iy,165*walkMul()*spdMul(),dt);if(Math.abs(ix)>.1)P.face=ix>0?1:-1;P.moving=!!(ix||iy)}
  P.hurt=Math.max(0,P.hurt-dt);P.since+=dt;
  if(P.since>4&&P.hp<maxHp()){regenT+=dt;if(regenT>2){regenT=0;P.hp++}}

  // 木を切る
  if(!P.ride){let tr=null;for(const t of trees){if(t.st==='up'&&!t.fire&&active(t)&&dist(P.x,P.y,t.x,t.y+4)<44){tr=t;break}}
    if(tr&&carry()<cap()){P.chopT+=dt;P.chopping=tr;if(P.chopT>=chopInt()){P.chopT=0;tr.hp--;tr.shake=.15;chips(tr.x,tr.y-16);snd('chop');
      if(tr.hp<=0){tr.st='stump';tr.t=20;drop('wood',tr.x,tr.y-6,woodPer());S.f.chopped=true;dmAdd('chop');shake=2}}}
    else{P.chopping=null;if(tr&&carry()>=cap()){P.full+=dt;if(P.full>1.2){P.full=0;float(P.x,P.y-60,'いっぱい！','#e5432a',14)}}}}
  for(const t of trees){t.shake=Math.max(0,t.shake-dt);if(t.st==='stump'){t.t-=dt;if(t.t<=0&&dist(P.x,P.y,t.x,t.y)>60){t.st='up';t.hp=3}}}

  // 拾う
  const mag=P.ride?130:80;
  for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;
    if(d.z>0||d.vz>0){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=500*dt;d.z+=d.vz*dt;if(d.z<0){d.z=0;d.vz=d.vz<-60?-d.vz*.35:0;d.vx*=.5;d.vy*=.5}}
    if(d.t<.4)continue;
    const can=d.k==='coin'||carry()<cap();const dd=dist(d.x,d.y,P.x,P.y);
    if(can&&dd<mag){const s=380;d.x+=(P.x-d.x)/dd*s*dt;d.y+=(P.y-d.y)/dd*s*dt}
    if(can&&dd<16){
      if(d.k==='coin'){S.coins++;S.earned++;snd('coin');bump('pCoin')}else{S[d.k]++;snd('pick');bump('pBag')}
      drops.splice(i,1);continue}
    if(d.t>60)drops.splice(i,1)}
  comboT-=dt;if(comboT<=0)combo=0;

  // 売る
  const sp=[PADMAP.sell,...openD().map(d=>d.sell)].find(q=>dist(P.x,P.y,q.x,q.y)<34)||PADMAP.sell;sellT+=dt;
  if(sellT>.045){sellT=0;if(dist(P.x,P.y,sp.x,sp.y)<34&&carry()>0){
    const k=S.stone>0?'stone':'wood';S[k]--;const v=(k==='stone'?3:1)*MULT[S.lv.price];S.frac+=v;const w=Math.floor(S.frac);S.frac-=w;S.coins+=w;S.earned+=w;if(w)dmAdd('sell',w);
    fly(k,P.x,P.y-34,sp.x,sp.y-60);if(w)float(sp.x+(Math.random()-.5)*30,sp.y-40,'+'+w,'#f3b648',15);S.f.sold=true;snd('coin');bump('pCoin')}}

  // 団員のコイン
  pileT+=dt;if(pileT>.03){pileT=0;if(S.pile>=1&&dist(P.x,P.y,PILE.x,PILE.y)<36){const n=Math.max(1,Math.floor(S.pile/25));const w=Math.min(n,Math.floor(S.pile));S.pile-=w;S.coins+=w;fly('coin',PILE.x,PILE.y-10,P.x,P.y-30);snd('coin');bump('pCoin')}}

  // 買う
  payT+=dt;
  if(payT>.035){payT=0;
    for(const p of PADS){if(p.id==='sell'||!unlocked(p)||(p.lock&&p.lock()))continue;const c=padCost(p.id);if(c==null)continue;if(dist(P.x,P.y,p.x,p.y)>34)continue;
      const rem=c-(S.paid[p.id]||0);
      if(rem>0&&S.coins>0){const ch=Math.min(S.coins,rem,Math.max(1,Math.ceil(c/28)));S.coins-=ch;S.paid[p.id]=(S.paid[p.id]||0)+ch;fly('coin',P.x,P.y-34,p.x,p.y);snd('tick')}
      if(c-(S.paid[p.id]||0)<=0)levelUp(p.id)}}

  // 放水
  if(!P.ride)spray(P,hoseRange(),hosePow(),dt);else P.spray=null;
  // ポンプ車
  if(S.lv.truck>=1){
    if(P.ride!=='truck'){
      const tg=nearest(mons.filter(m=>!m.dead).concat(houses.filter(h=>h.st==='fire'&&active(h)&&!h.ev)),T.x,T.y);
      let tx=PARK.x,ty=PARK.y,stop=6;if(T.refill){const ws=waterSrc(T);if(ws){tx=ws.x;ty=ws.y;stop=30}}else if(tg){tx=tg.x;ty=tg.y+20;stop=truckRange()*.7}else if(zones.some(z=>!z.ev)){const z=nearest(zones.filter(z=>!z.ev),T.x,T.y);tx=z.x;ty=z.y+10;stop=Math.max(20,z.r*.35)}
      {const L=VEH.ladder;if(S.lv.ladder&&P.ride==='ladder'&&!T.refill&&L.w!=null&&(L.w<LCAP()*.35||dist(T.x,T.y,L.x,L.y)<130)){tx=L.x-L.face*70;ty=L.y+12;stop=40}}
      const wp=viaBridge(T,tx,ty);if(wp){tx=wp.x;ty=wp.y;stop=4}
      const d=dist(T.x,T.y,tx,ty);T.moving=d>stop;
      if(T.moving){const s=truckSpeed();T.x+=(tx-T.x)/d*s*dt;T.y+=(ty-T.y)/d*s*dt;if(Math.abs(tx-T.x)>4)T.face=tx>T.x?1:-1}
    }
    if(T.w>0||T.conn){spray(T,truckRange(),truckPow(),dt,P.ride!=='truck');if(T.spray&&!T.conn)T.w=Math.max(0,T.w-5*dt)}else{T.spray=null;if(P.ride==='truck'&&nearest(houses,T.x,T.y,h=>h.st==='fire'&&dist(h.x,h.y,T.x,T.y)<truckRange())){wW-=dt;if(wW<=0){wW=3;float(T.x,T.y-70,'水がない！ 水利で補給しよう','#ffd0c6',13)}}}
  }

  // ヒノコ
  if(!S.f.mon&&(S.lv.axe>=2||S.earned>=12)){S.f.mon=true;monT=0}
  if(S.f.mon&&!ty){monT-=dt;if(monT<=0){monT=(7+Math.random()*5)*(isNight()?.45:1);if(mons.filter(m=>!m.boss).length<1+yl()+(isNight()?2:0))spawnMon()}}
  if(yl()>=2&&!ty){bossT-=dt;if(bossT<=0){bossT=150;if(!mons.some(m=>m.boss)&&spawnMon(true)){snd('boss');buzz([80,60,80]);shake=8;pop('大ヒノコ 出現！','ポンプ車で一気に消そう')}}}
  for(const m of mons){if(m.dead)continue;m.t+=dt;m.hit=Math.max(0,m.hit-dt);
    const sp=m.boss?26:44,dp=dist(m.x,m.y,P.x,P.y);let tx,ty;
    if(!P.ride&&dp<(m.boss?230:170)){tx=P.x;ty=P.y}
    else{if(!m.house||m.house.st!=='ok'||!active(m.house))m.house=nearest(houses,m.x,m.y,h=>h.st==='ok'&&active(h));if(m.house){tx=m.house.x;ty=m.house.y}else{tx=0;ty=0}}
    const d=dist(m.x,m.y,tx,ty)||1;m.x+=(tx-m.x)/d*sp*dt+Math.sin(m.t*3)*10*dt;m.y+=(ty-m.y)/d*sp*dt+Math.cos(m.t*2.4)*10*dt;
    if(m.house&&m.house.st==='ok'&&dist(m.x,m.y,m.house.x,m.house.y)<26){ignite(m.house);if(!m.boss)m.dead=true;else m.house=null}
    if(m.boss){for(const h of houses){if(h.st==='ok'&&dist(m.x,m.y,h.x,h.y)<50)ignite(h)}}
    if(!P.ride&&P.hurt<=0&&dp<(m.boss?44:24))hurt(m.boss?2:1,m)}
  mons=mons.filter(m=>!m.dead);

  // 家
  for(const h of houses){
    if(h.st==='fire'){h.burn+=dt;h.sm-=dt;if(h.sm<=0){h.sm=.2;parts.push({k:'smoke',x:h.x+(Math.random()-.5)*16,y:h.y-h.h/2-h.ht,r:6,life:1})}
      if(h.burn>45){h.st='ruin';h.t=40;float(h.x,h.y-40,'焼けてしまった…','#ffd0c6',13)}}
    else if(h.st==='ruin'){h.t-=dt;if(h.t<=0)h.st='ok'}}

  updTyphoon(dt);updRail(dt);updEmerg(dt);updVehicles(dt);updForest(dt);updQuake(dt);updSoho(dt);updHighrise(dt);updLogs(dt);updBoat(dt);updBus(dt);updRain(dt);updWater(dt);
  for(const w of workers)updWorker(w,dt);

  // 演出
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];
    if(p.k==='conf'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=280*dt;p.life-=dt*1.1}
    else if(p.k==='chip'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.life-=dt}
    else if(p.k==='fly'){p.t+=dt*4.5;if(p.t>=1)p.life=0}
    else if(p.k==='drop'){p.t+=dt*3.4;if(p.t>=1)p.life=0}
    else if(p.k==='smoke'){p.y-=26*dt;p.x+=8*dt;p.r+=10*dt;p.life-=dt*.7}
    if(p.life<=0)parts.splice(i,1)}
  if(parts.length>500)parts.splice(0,parts.length-500);
  for(let i=floats.length-1;i>=0;i--){const f=floats[i];f.y-=34*dt;f.life-=dt*.9;if(f.life<=0)floats.splice(i,1)}
  shake=Math.max(0,shake-dt*20);

  // 新しい丸
  for(const p of PADS){if(!S.seen.includes(p.id)&&unlocked(p)){S.seen.push(p.id);p.newT=8;toast(`NEW！「${padName(p.id)}」が買えるようになった`,'ok');snd('new')}if(p.newT)p.newT=Math.max(0,p.newT-dt)}
}

