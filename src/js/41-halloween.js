/* ===================== 🎃 ハロウィン期間限定（2026/10/24〜10/31） ===================== */
// 期間外は何も出ない。確認用：?halloween で期間外でもON、?halloween=0 でOFF
const HW_FROM=Date.parse('2026-10-24T00:00:00+09:00'),HW_TO=Date.parse('2026-11-01T00:00:00+09:00');
const HW=()=>{const q=location.search;if(/[?&]halloween=0/.test(q))return false;if(/[?&]halloween/.test(q))return true;const n=Date.now();return n>=HW_FROM&&n<HW_TO};
const hwS=()=>{if(!S.hw)S.hw={candy:0,items:[],head:'witch',cape:false,joined:false,day:''};return S.hw};
const HW_TIPS=['かぼちゃのランタンは、ろうそくよりLEDライトが安心だよ','ふわふわ・ひらひらの衣装は火が燃えうつりやすい。ろうそくやコンロに近づかないでね','仮装で顔をかくすと前が見えにくい。夜道は明るい色の服や反射材で安全に','おばけの飾りを電気ストーブやライトにかぶせないでね。熱で燃えることがあるよ','もしも服に火がついたら「止まって・たおれて・ころがる」。走ると火が大きくなるよ'];
const hwTip=()=>HW_TIPS[Math.random()*HW_TIPS.length|0];

// かぼちゃ（ジャック・オ・ランタン）を描く。頭の上に小さな炎＝ヒノコのなごり
function hwPumpkin(c,x,y,r,t,o){o=o||{};c.save();c.translate(x,y);
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,r*.95,r*.85,r*.22,0,0,7);c.fill();
  const fl=Math.sin(t/90)*r*.08;c.fillStyle='#ffd25a';c.beginPath();c.moveTo(-r*.18,-r*.92);c.quadraticCurveTo(0,-r*1.55-fl,r*.18,-r*.92);c.fill();
  c.fillStyle='#4f7a2a';c.fillRect(-r*.1,-r*1.02,r*.2,r*.28);
  const g=c.createRadialGradient(-r*.3,-r*.35,r*.15,0,0,r*1.1);g.addColorStop(0,o.hit?'#fff3d6':'#ffb347');g.addColorStop(1,o.boss?'#c2410c':'#ea7a12');c.fillStyle=g;
  for(const k of [-.55,.55,0]){c.beginPath();c.ellipse(k*r,0,r*(k?.6:.62),r*.85,0,0,7);c.fill()}
  c.strokeStyle='rgba(150,60,0,.35)';c.lineWidth=Math.max(1,r*.06);for(const k of [-.32,.32]){c.beginPath();c.ellipse(k*r,0,r*.32,r*.84,0,0,7);c.stroke()}
  const lit=o.dead?'#5a2a00':'#ffe066';c.fillStyle=lit;
  const ey=-r*.18,ex=r*.36,es=r*.2;for(const sx of [-1,1]){c.beginPath();c.moveTo(sx*ex-es,ey+es*.7);c.lineTo(sx*ex,ey-es);c.lineTo(sx*ex+es,ey+es*.7);c.closePath();c.fill()}
  c.beginPath();c.moveTo(-r*.5,r*.25);for(let i=0;i<=6;i++)c.lineTo(-r*.5+i*r/6,r*.25+(i%2?r*.18:0));c.lineTo(r*.42,r*.52);c.lineTo(-r*.42,r*.52);c.closePath();c.fill();
  if(o.boss){c.fillStyle='#3b1f5c';c.beginPath();c.moveTo(-r*.9,-r*.78);c.lineTo(r*.9,-r*.78);c.lineTo(r*.15,-r*2.1);c.closePath();c.fill();c.fillStyle='#f59e0b';c.fillRect(-r*.62,-r*1.0,r*1.24,r*.14)}
  c.restore()}
function hwGhost(c,x,y,r,t,o){o=o||{};c.save();c.translate(x,y+Math.sin(t/300+x)*3);c.globalAlpha=o.a==null?.95:o.a;
  c.fillStyle='#fff';c.beginPath();c.arc(0,-r*.2,r*.8,Math.PI,0);c.lineTo(r*.8,r*.7);for(let i=0;i<4;i++){const bx=r*.8-(i+.5)*r*.4;c.quadraticCurveTo(bx+r*.1,r*.95,bx,r*.7)}c.lineTo(-r*.8,-r*.2);c.fill();
  c.strokeStyle='rgba(27,39,64,.25)';c.lineWidth=2;c.stroke();c.fillStyle='#1b2740';c.beginPath();c.ellipse(-r*.28,-r*.25,r*.11,r*.16,0,0,7);c.ellipse(r*.28,-r*.25,r*.11,r*.16,0,0,7);c.fill();
  if(o.bag){c.fillStyle='#f97316';c.beginPath();c.arc(r*.85,r*.35,r*.28,0,7);c.fill();c.fillStyle='#1b2740';c.fillRect(r*.78,r*.28,r*.14,r*.06)}
  c.restore()}
function hwCandy(c,x,y,r,t){c.save();c.translate(x,y);c.rotate(Math.sin(t/200)*.4);c.fillStyle='#ec4899';c.beginPath();c.moveTo(-r*1.5,-r*.6);c.lineTo(-r*.8,0);c.lineTo(-r*1.5,r*.6);c.fill();c.beginPath();c.moveTo(r*1.5,-r*.6);c.lineTo(r*.8,0);c.lineTo(r*1.5,r*.6);c.fill();
  c.fillStyle='#f472b6';c.beginPath();c.arc(0,0,r*.85,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=r*.18;c.beginPath();c.arc(0,0,r*.45,.3,2.8);c.stroke();c.restore()}

/* --- 本編：ヒノコがかぼちゃに、空は紫、町にかぼちゃとおばけ、団員は帽子 --- */
drawMon=(o=>function(m,t){if(!HW())return o(m,t);const r=m.boss?44:16,bob=Math.sin(m.t*6)*2;shadow(m.x,m.y+4,r*.9,r*.3);
  hwPumpkin(cx,m.x,m.y-r*.85+bob,r*1.05,t,{boss:m.boss,hit:m.hit>0});
  if(m.hp<m.max||m.boss){const bw=m.boss?110:34,bx=m.x-bw/2,by=m.y-r*2.4;cx.fillStyle='rgba(27,39,64,.78)';rr(bx-2,by-2,bw+4,m.boss?11:8,4);cx.fill();cx.fillStyle='#ff6b4a';cx.fillRect(bx,by,bw*clamp(m.hp/m.max,0,1),m.boss?7:4);
    if(m.boss)label('大かぼちゃヒノコ',m.x,by-12,13,'#fff',null,'#7c2d12')}})(drawMon);
drawPerson=(o=>function(x,y,face,body,wood,stone,small,t,moving,chop,sand){
  const me=!small&&body==='#22355c',h=me?hwS():null;
  if(HW()&&me&&h.cape){const s=1,bob=moving?Math.abs(Math.sin(t/90))*2:0;cx.fillStyle='rgba(255,255,255,.92)';cx.beginPath();cx.moveTo(x-9,y-24-bob);cx.lineTo(x+9,y-24-bob);cx.lineTo(x+12+Math.sin(t/120)*2,y-2);cx.lineTo(x-12+Math.sin(t/140)*2,y-2);cx.closePath();cx.fill()}
  o(x,y,face,body,wood,stone,small,t,moving,chop,sand);if(!HW())return;
  const s=small?.85:1,bob=moving?Math.abs(Math.sin(t/90))*2:0,hy=y-30*s-bob;
  if(me&&h.head==='pumpkin'){hwPumpkin(cx,x,hy+1,9.5,t,{});return}
  // とんがり帽子（紫に橙の帯）
  cx.fillStyle=me?'#5b2a86':'#3b1f5c';cx.beginPath();cx.moveTo(x-9*s,hy-2*s);cx.lineTo(x+9*s,hy-2*s);cx.lineTo(x+face*5*s,hy-17*s);cx.closePath();cx.fill();
  cx.fillStyle='#f59e0b';cx.fillRect(x-7*s,hy-5*s,14*s,2.5*s)})(drawPerson);
drawPads=(o=>function(t){o(t);if(!HW())return;
  for(const h of houses){const k=((Math.round(h.x)*73856093)^(Math.round(h.y)*19349663))>>>0;if(k%3)continue;hwPumpkin(cx,h.x+h.w/2+10,h.y+h.h/2-6,7,t,{})}
  for(let i=0;i<4;i++){const a=t/4000+i*1.7,gx=P.x+Math.cos(a)*(220+i*40),gy=P.y+Math.sin(a*1.3)*160-40;hwGhost(cx,gx,gy,13,t,{a:.55})}})(drawPads);
drawWeather=(o=>function(t){o(t);if(!HW())return;cx.fillStyle='rgba(76,29,149,.13)';cx.fillRect(0,0,W,H);
  const g=cx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(20,10,40,0)');g.addColorStop(1,'rgba(20,10,40,.32)');cx.fillStyle=g;cx.fillRect(0,0,W,H)})(drawWeather);
// ヒノコを倒すとキャンディ
killMon=(o=>function(m){o(m);if(!HW()||S.ta)return;const h=hwS();if(m.boss||Math.random()<.35){const n=m.boss?5:1;h.candy+=n;float(m.x,m.y-52,`🍬+${n}`,'#f9a8d4',15)}})(killMon);
// 期間中に遊ぶと記念バッジ（期間が終わってももらった人のバッジは残る）
BADGES.push(['hw2026','🎃','2026ハロウィン参加',()=>!!(S.hw&&S.hw.joined)]);
badgeHtml=(o=>function(){if(HW()||(S.badges||[]).includes('hw2026'))return o();const i=BADGES.findIndex(b=>b[0]==='hw2026'),b=BADGES.splice(i,1)[0];const r=o();BADGES.splice(i,0,b);return r})(badgeHtml);
update=(o=>function(dt){o(dt);if(!HW()||!S.started||S.ta)return;const h=hwS();
  if(!h.joined){h.joined=true;checkBadges()}
  const d=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);if(h.day!==d&&!paused){h.day=d;save();pop('🎃 ハロウィンイベント開催中！','10/31まで。ヒノコがかぼちゃに！ 倒すとキャンディ🍬。MENUの「ハロウィン交換所」と、ミニゲーム「ハロウィン夜回り」もあるよ')}})(update);
// メニュー：ハロウィン交換所
const HW_SHOP=[{id:'pumpkin',ic:'🎃',name:'かぼちゃヘルメット',cost:15},{id:'cape',ic:'👻',name:'おばけマント',cost:30}];
function hwShopHtml(){const h=hwS();return `<div class="hwshop"><h3 class="sec">🎃 ハロウィン交換所 <small>10/31まで</small></h3><p class="hwc">キャンディ <b>🍬 ${h.candy}</b>こ（ヒノコを倒すと出るよ）</p>
  ${HW_SHOP.map(it=>{const has=h.items.includes(it.id),wear=it.id==='pumpkin'?h.head==='pumpkin':h.cape;return has?`<button class="btn sub" data-act="hwwear" data-v="${it.id}">${it.ic} ${it.name}：${wear?'つけている（はずす）':'つける'}</button>`
    :`<button class="btn ${h.candy>=it.cost?'':'sub'}" data-act="hwbuy" data-v="${it.id}">${it.ic} ${it.name}と交換（🍬${it.cost}）</button>`}).join('')}
  <button class="btn hkmenu" data-act="hwmini"><b>🎃 ハロウィン夜回り</b><small>期間限定ミニゲーム</small></button></div>`}
menu=(o=>function(){o();if(!HW()||S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const h2=bx.querySelector('h2');if(h2)h2.insertAdjacentHTML('afterend',hwShopHtml())})(menu);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act^=hw]');if(!b)return;const a=b.dataset.act,h=hwS();
  if(a==='hwmini'){closeModal();mgIntro(MG.halloween);return}
  const it=HW_SHOP.find(x=>x.id===b.dataset.v);if(!it)return;
  if(a==='hwbuy'){if(h.candy<it.cost){toast(`キャンディがあと${it.cost-h.candy}こ足りないよ`);return}h.candy-=it.cost;h.items.push(it.id);if(it.id==='pumpkin')h.head='pumpkin';else h.cape=true;snd('buy');toast(`${it.ic} ${it.name}をゲット！`,'ok');ga('hw_buy',{item:it.id})}
  else if(a==='hwwear'){if(it.id==='pumpkin')h.head=h.head==='pumpkin'?'witch':'pumpkin';else h.cape=!h.cape;snd('pick')}
  save();const box=document.querySelector('.modal .hwshop');if(box)box.outerHTML=hwShopHtml()});

/* --- 期間限定ミニゲーム「ハロウィン夜回り」 --- */
const hwGame={short:'ハロウィン',name:'ハロウィン夜回り',icon:'🎃',time:30,desc:'【10/31まで】かぼちゃヒノコを消そう。おばけ（仮装した子ども）はタップしないで！',
  how:'かぼちゃヒノコをタップして消そう！ 白いおばけは仮装した子どもだからタップしたらダメ（−3点）。ピンクのキャンディは＋5点！',
  diffs:{e:{iv:.8,max:6,sp:[40,65],r:34,ghost:.22,candy:.06,big:0,note:'ゆっくり・おばけは少なめ'},n:{iv:.48,max:10,sp:[70,115],r:28,ghost:.3,candy:.06,big:9,note:'おばけが増える・大かぼちゃも出る'},h:{iv:.2,max:24,sp:[110,175],r:24,ghost:.38,candy:.05,big:4,note:'ワラワラ！ おばけとまちがえないで'}},
  init(D,W,H){return {D,ms:[],fx:[],spawn:0,bigT:D.big?D.big*.5:0,kills:0,ghostHit:0,candy:0,combo:0,last:0,best:0}},
  info:s=>s.combo>=3?`${s.combo}コンボ！`:'',summary:s=>`消したかぼちゃヒノコ ${s.kills}匹・キャンディ ${s.candy}こ・まちがえておばけ ${s.ghostHit}回`,
  tip:()=>'🔥 ハロウィンの火の用心：'+hwTip(),
  spawn(s,k){const D=s.D,W=innerWidth,H=innerHeight,side=Math.random()*3|0;let x=side===0?Math.random()*W:side===1?-30:W+30,y=side===0?H+30:H*.3+Math.random()*H*.55;
    const tx=W*(.15+Math.random()*.7),ty=H*(.25+Math.random()*.55),a=Math.atan2(ty-y,tx-x),sp=(D.sp[0]+Math.random()*(D.sp[1]-D.sp[0]))*(k==='b'?.55:k==='g'?.8:1)*(mg.t<10?1.15:1);
    s.ms.push({k,x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:k==='b'?D.r*2.2:k==='c'?D.r*.6:D.r,hp:k==='b'?7:(k==='p'&&Math.random()<.25?2:1),max:0,age:0,life:k==='c'?3.5:5+Math.random()*3,ph:Math.random()*7,hit:0});s.ms[s.ms.length-1].max=s.ms[s.ms.length-1].hp},
  update(s,dt,m){const D=s.D,W=innerWidth,H=innerHeight,rush=m.t<10;s.spawn-=dt*(rush?1.5:1);
    while(s.spawn<=0){s.spawn+=D.iv*(.6+Math.random()*.8);if(s.ms.filter(x=>x.k!=='b').length<D.max+(rush?D.max*.4|0:0)){const r=Math.random();this.spawn(s,r<D.candy?'c':r<D.candy+D.ghost?'g':'p')}}
    if(D.big){s.bigT-=dt;if(s.bigT<=0){s.bigT=D.big*(.8+Math.random()*.4);if(!s.ms.some(x=>x.k==='b'))this.spawn(s,'b')}}
    for(const x of s.ms){x.age+=dt;x.ph+=dt*5;x.hit=Math.max(0,x.hit-dt);x.vx+=Math.cos(x.ph*.7)*60*dt;x.vy+=Math.sin(x.ph*.9)*60*dt;
      if(x.age<x.life){if(x.x<x.r&&x.vx<0||x.x>W-x.r&&x.vx>0)x.vx*=-1;if(x.y<110+x.r&&x.vy<0||x.y>H-x.r&&x.vy>0)x.vy*=-1}x.x+=x.vx*dt;x.y+=x.vy*dt}
    s.ms=s.ms.filter(x=>x.x>-90&&x.x<W+90&&x.y>-90&&x.y<H+90)},
  down(s,px,py){let best=null,bd=1e9;for(const x of s.ms){const d=Math.hypot(px-x.x,py-x.y);if(d<x.r*1.2+8&&d<bd){bd=d;best=x}}
    (s.rings=s.rings||[]).push({x:px,y:py,t:0});if(!best){s.combo=0;return}
    if(best.k==='g'){s.ghostHit++;s.combo=0;mgAdd(-3);mgFloat(s,best.x,best.y-30,'仮装した子どもだよ！ −3','#c4b5fd');snd('hurt');buzz(80);best.vx*=-1.5;best.vy*=-1.5;return}
    if(best.k==='c'){s.candy++;mgAdd(5);mgFloat(s,best.x,best.y-20,'🍬+5','#f9a8d4');snd('coin');s.ms.splice(s.ms.indexOf(best),1);if(!S.ta)hwS().candy++;return}
    best.hp--;best.hit=.15;snd('chop');buzz(15);if(best.hp>0)return;
    const now=performance.now();s.combo=now-s.last<1100?s.combo+1:1;s.last=now;s.best=Math.max(s.best,s.combo);
    let pts=best.k==='b'?10:best.max;if(s.combo>=5)pts++;mgAdd(pts);s.kills++;mgFloat(s,best.x,best.y-20,'+'+pts,best.k==='b'?'#ffd84d':'#fff');snd(best.k==='b'?'boss':'kill');
    s.ms.splice(s.ms.indexOf(best),1);if(best.k==='b'&&mg.dk==='h')for(let i=0;i<3;i++)this.spawn(s,'p')},
  draw(s,c,W,H,now){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1e1033');g.addColorStop(.7,'#3b1f5c');g.addColorStop(1,'#5b2a2a');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#fef3c7';c.beginPath();c.arc(W*.78,150,34,0,7);c.fill();c.fillStyle='#1e1033';c.beginPath();c.arc(W*.78+14,142,30,0,7);c.fill();
    c.fillStyle='#140a24';let x=0,i=0;while(x<W){const w=50+(i*37%40),h=60+(i*53%90);c.fillRect(x,H-h,w-6,h);c.beginPath();c.moveTo(x-4,H-h);c.lineTo(x+(w-6)/2,H-h-22);c.lineTo(x+w-2,H-h);c.fill();if(i%2===0)hwPumpkin(c,x+18,H-h+30,8,now,{});c.fillStyle='#140a24';x+=w;i++}
    for(const e of s.ms){if(e.k==='p'||e.k==='b'){hwPumpkin(c,e.x,e.y,e.r,now,{boss:e.k==='b',hit:e.hit>0});if(e.max===2&&e.hp===2){c.fillStyle='#fff';c.font=`900 ${Math.round(e.r*.5)}px sans-serif`;c.textAlign='center';c.fillText('2',e.x,e.y-e.r*1.15)}
        if(e.k==='b'){c.fillStyle='rgba(0,0,0,.35)';c.fillRect(e.x-e.r*.8,e.y+e.r*1.05,e.r*1.6,7);c.fillStyle='#fbbf24';c.fillRect(e.x-e.r*.8,e.y+e.r*1.05,e.r*1.6*e.hp/e.max,7)}}
      else if(e.k==='g')hwGhost(c,e.x,e.y,e.r,now,{bag:true});else hwCandy(c,e.x,e.y,e.r,now)}
    s.rings=(s.rings||[]).filter(f=>(f.t+=1/60)<.4);for(const f of s.rings){c.globalAlpha=1-f.t/.4;c.strokeStyle='#a5f3fc';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,10+f.t*80,0,7);c.stroke();c.globalAlpha=1}
    mgFx(s,c,1/60)}};
// ミニゲーム一覧の先頭に、期間中だけ表示
(()=>{if(!HW())return;const rest=Object.entries(MG);for(const [k] of rest)delete MG[k];MG.halloween=hwGame;for(const [k,v] of rest)MG[k]=v})();
// 結果画面に「火の用心」豆知識
mgResult=(o=>function(me){o(me);if(!mg||!mg.G||!mg.G.tip)return;const b=document.querySelector('#mgPanel .hkscore');if(b&&!document.querySelector('#mgPanel .hktip'))b.insertAdjacentHTML('afterend',`<p class="hktip">${mg.G.tip()}</p>`)})(mgResult);
// 期間外に ?mini=halloween で来た人には「終了しました」
(()=>{if(HW()||!/[?&]mini=halloween/.test(location.search))return;setTimeout(()=>{mgHub();toast('🎃 ハロウィンイベントは終了しました。ほかのミニゲームで遊んでね')},700)})();
(()=>{const st=document.createElement('style');st.textContent=`
.hwshop{margin:8px 0 4px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,#3b1f5c,#7c2d12);color:#fff}
.hwshop .sec{color:#fde68a;margin:0 0 4px}.hwshop .sec small{color:#fed7aa}.hwshop .hwc{margin:0 0 6px;font-weight:700}.hwshop .hwc b{font-size:20px}
.hwshop .btn.sub{background:rgba(255,255,255,.92);color:#1b2740}.hwshop .btn{margin-top:6px}
.hktip{margin:6px 0 4px;padding:8px 10px;border-radius:10px;background:#fff4e5;border-left:4px solid #f59e0b;color:#7c2d12;font-size:13px;font-weight:700;line-height:1.55;text-align:left}`;document.head.appendChild(st)})();

