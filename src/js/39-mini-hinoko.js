/* ===================== 30秒ヒノコたたき（ミニゲーム） ===================== */
// 待ち時間にサッと遊べる。?mini で開くといきなりこの画面から始まる
const HK_DIFF={
  e:{name:'やさしい',icon:'🙂',iv:.85,max:6, sp:[35,60],  r:38,hp2:0,  big:0, bigHp:0, note:'ゆっくり動くヒノコをタップ'},
  n:{name:'ふつう',  icon:'🔥',iv:.5, max:11,sp:[70,115], r:30,hp2:.25,big:9, bigHp:6, note:'2回たたくヒノコや、大ヒノコも出る'},
  h:{name:'ハード',  icon:'💀',iv:.17,max:30,sp:[110,180],r:25,hp2:.35,big:3.5,bigHp:9, note:'ヒノコがワラワラ！ 巨大ヒノコは割れて分裂する'}};
const HK_TIME=30,HK_KEY='bundan-mini-rank';
let hk=null,hkGlobal=null,hkPress=[];
const hkRank=()=>{try{return JSON.parse(localStorage.getItem(HK_KEY)||'[]')}catch(e){return[]}};
function hkLoadGlobal(){if(!TA_FORM.csv)return Promise.resolve(null);
  return fetch(TA_FORM.csv+'&_='+Date.now(),{cache:'no-store'}).then(r=>r.text()).then(tx=>{
    hkGlobal=tx.trim().split(/\r?\n/).slice(1).map(l=>l.split('","').map(c=>c.replace(/^"|"$/g,''))).filter(c=>/^ミニ/.test(c[4]||'')).map(c=>({n:c[1]||'',b:c[2]||'',s:+(c[3]||0),d:(c[4]||'').replace(/^ミニ/,''),t:c[0]||''})).filter(x=>x.s>0);return hkGlobal}).catch(()=>null)}
function hkTop(dk,extra){const nm=HK_DIFF[dk].name,seen=new Set(),out=[];
  for(const x of [...(extra||[]),...(hkGlobal||[]).filter(x=>x.d===nm),...hkRank().filter(x=>x.d===nm)]){const k=x.n+'|'+x.s;if(seen.has(k))continue;seen.add(k);out.push(x)}
  return out.sort((a,b)=>b.s-a.s)}
function hkTable(list,me){if(!list.length)return '<p class="hkn">まだ記録がないよ。1位をねらおう！</p>';
  return `<table class="hkt">${list.slice(0,3).map((x,i)=>`<tr class="${x===me?'me':''}"><td>${['🥇','🥈','🥉'][i]}</td><td>${esc(safeName(x.n))}<small>${esc(x.b||'')}</small></td><td><b>${x.s}</b>点</td></tr>`).join('')}</table>`}
function hkEl(){let o=document.getElementById('hk');if(o)return o;
  document.body.insertAdjacentHTML('beforeend',`<div id="hk" hidden><canvas id="hkCv"></canvas><div id="hkHud"><span id="hkScore">0点</span><span id="hkCombo"></span><span id="hkTime">30</span></div><div id="hkBar"><i></i></div><div id="hkPanel"></div></div>`);
  o=document.getElementById('hk');const cv=document.getElementById('hkCv');
  cv.addEventListener('pointerdown',e=>{e.preventDefault();hkTap(e.clientX,e.clientY)});
  o.addEventListener('pointerdown',()=>{const n=performance.now();hkPress.push(n);hkPress=hkPress.filter(t=>n-t<1500)},true);
  o.addEventListener('click',e=>{const b=e.target.closest('[data-hk]');if(!b)return;const a=b.dataset.hk;
    // 連打の勢いで押してしまわないように：0.9秒に3回以上タップしていたらボタンは無視
    const n=performance.now();if(hkPress.filter(t=>n-t<900).length>=3){b.classList.add('hkshake');setTimeout(()=>b.classList.remove('hkshake'),400);return}
    if(a==='e'||a==='n'||a==='h')hkStart(a);else if(a==='again')hkStart(hk.dk);else if(a==='menu')hkIntro();else if(a==='close')hkClose();else if(a==='save')hkSave();else if(a==='ranks')hkRanks()});
  addEventListener('resize',hkResize);return o}
function hkResize(){const cv=document.getElementById('hkCv');if(!cv)return;const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';cv.getContext('2d').setTransform(d,0,0,d,0,0)}
function hkPanel(html){const p=document.getElementById('hkPanel');p.innerHTML=html?`<div class="hkbox">${html}</div>`:'';p.hidden=!html}
function hkIntro(){audio();const o=hkEl();o.hidden=false;paused=true;hkResize();if(hk&&hk.raf)cancelAnimationFrame(hk.raf);hk={st:'menu',ms:[],fx:[],dk:hk&&hk.dk||'e'};hkDrawBg(performance.now());
  hkPanel(`<h2>30秒 ヒノコたたき</h2><p class="hkl">ヒノコをタップして消そう！ 30秒で何点とれるかな？</p>
  ${Object.entries(HK_DIFF).map(([k,d])=>`<button class="btn ${k==='h'?'hkhard':k==='n'?'':'sub'}" data-hk="${k}"><b>${d.icon} ${d.name}</b><small>${d.note}</small></button>`).join('')}
  <button class="btn sub" data-hk="ranks">🏆 ランキングを見る</button><button class="btn sub" data-hk="close">${/[?&]mini/.test(location.search)?'本編「分団サバイバル」で遊ぶ':'ゲームにもどる'}</button>`);
  hkLoadGlobal()}
function hkRanks(){const body=()=>Object.entries(HK_DIFF).map(([k,d])=>`<h3 class="hks">${d.icon} ${d.name}</h3>${hkTable(hkTop(k))}`).join('');
  hkPanel(`<h2>🏆 ヒノコたたき ランキング</h2><p class="hkl">難しさごとの上位3位</p><div id="hkRk">${body()}</div><button class="btn" data-hk="menu">もどる</button>`);
  hkLoadGlobal().then(()=>{const b=document.getElementById('hkRk');if(b)b.innerHTML=body()})}
function hkClose(){const o=document.getElementById('hk');if(o)o.hidden=true;if(hk&&hk.raf)cancelAnimationFrame(hk.raf);hk=null;paused=!!document.querySelector('.modal');last=performance.now()}
function hkStart(dk){audio();const D=HK_DIFF[dk];if(hk&&hk.raf)cancelAnimationFrame(hk.raf);
  hk={st:'count',dk,D,t:HK_TIME,cd:3,ms:[],fx:[],score:0,kills:0,big:0,combo:0,best:0,lastHit:0,spawn:0,bigT:D.big?D.big*.6:0,saved:false,raf:0,last:performance.now()};
  hkPanel('');document.getElementById('hkScore').textContent='0点';ga('mini_start',{diff:D.name,game:'ヒノコ'});hk.raf=requestAnimationFrame(hkLoop)}
function hkSpawn(big){const D=hk.D,W=innerWidth,H=innerHeight,side=Math.random()*4|0,m=20;let x,y;
  if(side===0){x=Math.random()*W;y=H+m}else if(side===1){x=-m;y=H*.3+Math.random()*H*.6}else if(side===2){x=W+m;y=H*.3+Math.random()*H*.6}else{x=Math.random()*W;y=H*.55+Math.random()*H*.4}
  const sp=(D.sp[0]+Math.random()*(D.sp[1]-D.sp[0]))*(big?.55:1)*(hk.t<10?1.15:1);
  const tx=W*(.15+Math.random()*.7),ty=H*(.18+Math.random()*.6),a=Math.atan2(ty-y,tx-x);
  const hp=big?D.bigHp:(Math.random()<D.hp2?2:1);
  hk.ms.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:big?D.r*2.4:D.r*(hp===2?1.12:1),hp,max:hp,big,age:0,life:big?14:5+Math.random()*3,ph:Math.random()*7,hit:0})}
function hkTap(px,py){if(!hk||hk.st!=='play')return;let best=null,bd=1e9;
  for(const m of hk.ms){const d=Math.hypot(px-m.x,py-m.y);if(d<m.r*1.25+10&&d<bd){bd=d;best=m}}
  hk.fx.push({k:'splash',x:px,y:py,t:0});
  if(!best){hk.combo=0;return}
  best.hp--;best.hit=.15;snd('chop');buzz(15);
  if(best.hp>0){hk.fx.push({k:'drop',x:best.x,y:best.y,t:0});return}
  const now=performance.now();hk.combo=now-hk.lastHit<1100?hk.combo+1:1;hk.lastHit=now;hk.best=Math.max(hk.best,hk.combo);
  let pts=best.big?10:best.max;if(hk.combo>=5)pts+=1;hk.score+=pts;hk.kills++;if(best.big)hk.big++;
  hk.ms.splice(hk.ms.indexOf(best),1);snd(best.big?'boss':'kill');if(best.big)buzz([40,30,60]);
  hk.fx.push({k:'pop',x:best.x,y:best.y,t:0,txt:'+'+pts,big:best.big});
  for(let i=0;i<(best.big?22:9);i++){const a=Math.random()*7,s=60+Math.random()*(best.big?260:150);hk.fx.push({k:'p',x:best.x,y:best.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,c:Math.random()<.5?'#7cc6ff':'#ffffff'})}
  // ハードの巨大ヒノコは、消すと小さいヒノコに分裂
  if(best.big&&hk.dk==='h')for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.random()*.5,s=150;hk.ms.push({x:best.x,y:best.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:hk.D.r*.85,hp:1,max:1,big:false,age:0,life:4,ph:Math.random()*7,hit:0})}
  document.getElementById('hkScore').textContent=hk.score+'点';
  document.getElementById('hkCombo').textContent=hk.combo>=3?`${hk.combo}コンボ！`:''}
function hkLoop(now){if(!hk)return;const dt=Math.min(.05,(now-hk.last)/1000);hk.last=now;const W=innerWidth,H=innerHeight,D=hk.D;
  if(hk.st==='count'){const p=Math.ceil(hk.cd);hk.cd-=dt;if(Math.ceil(hk.cd)!==p&&hk.cd>0)snd('tick');if(hk.cd<=0){hk.st='play';snd('boss')}}
  else if(hk.st==='play'){hk.t-=dt;const rush=hk.t<10;
    hk.spawn-=dt*(rush?1.6:1);const cap=D.max+(rush?Math.round(D.max*.4):0);
    while(hk.spawn<=0){hk.spawn+=D.iv*(.6+Math.random()*.8);if(hk.ms.filter(m=>!m.big).length<cap)hkSpawn(false)}
    if(D.big){hk.bigT-=dt;if(hk.bigT<=0){hk.bigT=D.big*(.8+Math.random()*.4);if(hk.ms.filter(m=>m.big).length<(hk.dk==='h'?3:1))hkSpawn(true)}}
    if(hk.t<=0){hk.t=0;document.getElementById('hkTime').textContent='0';document.querySelector('#hkBar i').style.transform='scaleX(0)';hkEnd();return}}
  for(const m of hk.ms){m.age+=dt;m.ph+=dt*6;m.hit=Math.max(0,m.hit-dt);
    // ふわふわ蛇行。ハードは急に向きを変える
    const wob=hk.dk==='h'?140:70;m.vx+=Math.cos(m.ph*.7)*wob*dt;m.vy+=Math.sin(m.ph*.9)*wob*dt;
    if(hk.dk==='h'&&Math.random()<dt*.8){const a=Math.random()*7,s=Math.hypot(m.vx,m.vy);m.vx=Math.cos(a)*s;m.vy=Math.sin(a)*s}
    if(m.age<m.life){if(m.x<m.r&&m.vx<0||m.x>W-m.r&&m.vx>0)m.vx*=-1;if(m.y<110+m.r&&m.vy<0||m.y>H-m.r&&m.vy>0)m.vy*=-1}
    m.x+=m.vx*dt;m.y+=m.vy*dt}
  hk.ms=hk.ms.filter(m=>m.x>-80&&m.x<W+80&&m.y>-80&&m.y<H+80);
  for(const f of hk.fx){f.t+=dt;if(f.k==='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=300*dt}}
  hk.fx=hk.fx.filter(f=>f.t<(f.k==='pop'?.8:.5));
  hkDraw(now);
  document.getElementById('hkTime').textContent=hk.st==='count'?'':Math.ceil(hk.t);
  document.getElementById('hkTime').classList.toggle('low',hk.st==='play'&&hk.t<10);
  document.querySelector('#hkBar i').style.transform=`scaleX(${hk.t/HK_TIME})`;
  if(hk.st!=='end')hk.raf=requestAnimationFrame(hkLoop)}
function hkDrawBg(now){const c=document.getElementById('hkCv').getContext('2d'),W=innerWidth,H=innerHeight;
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b2740');g.addColorStop(.7,'#3a2a3f');g.addColorStop(1,'#5a2e2a');c.fillStyle=g;c.fillRect(0,0,W,H);
  // 町のシルエット
  c.fillStyle='#141c2e';let x=0,i=0;while(x<W){const w=46+(i*37%40),h=60+(i*53%90);c.fillRect(x,H-h,w-6,h);c.beginPath();c.moveTo(x-4,H-h);c.lineTo(x+(w-6)/2,H-h-22);c.lineTo(x+w-2,H-h);c.fill();
    c.fillStyle='rgba(255,200,90,.55)';if(i%2===0)c.fillRect(x+10,H-h+18,10,10);c.fillStyle='#141c2e';x+=w;i++}
  const glow=c.createRadialGradient(W/2,H,10,W/2,H,H*.7);glow.addColorStop(0,'rgba(255,110,40,'+(.18+.06*Math.sin(now/300))+')');glow.addColorStop(1,'rgba(255,110,40,0)');c.fillStyle=glow;c.fillRect(0,0,W,H)}
function hkFlame(c,m,now){const r=m.r,wob=Math.sin(m.ph)*r*.08;c.save();c.translate(m.x,m.y);if(m.hit>0)c.translate((Math.random()-.5)*6,0);
  const outer=m.big?'#c81e1e':m.max===2?'#e5432a':'#ff8a1f',inner=m.big?'#ff7a1f':'#ffd34d';
  const g=c.createRadialGradient(0,r*.2,r*.1,0,0,r*1.2);g.addColorStop(0,inner);g.addColorStop(1,outer);
  c.fillStyle=g;c.beginPath();c.moveTo(0,-r*1.35+wob);c.bezierCurveTo(r*.9,-r*.5,r*1.05,r*.35,0,r);c.bezierCurveTo(-r*1.05,r*.35,-r*.9,-r*.5,0,-r*1.35-wob);c.fill();
  if(m.hit>0){c.fillStyle='rgba(124,198,255,.6)';c.fill()}
  // 顔
  c.fillStyle='#1b2740';const ey=r*.1,ex=r*.32,er=Math.max(2.5,r*.13);c.beginPath();c.arc(-ex,ey,er,0,7);c.arc(ex,ey,er,0,7);c.fill();
  if(m.big){c.strokeStyle='#1b2740';c.lineWidth=Math.max(2,r*.08);c.beginPath();c.moveTo(-ex-er*1.6,ey-er*2.2);c.lineTo(-ex+er,ey-er*1.1);c.moveTo(ex+er*1.6,ey-er*2.2);c.lineTo(ex-er,ey-er*1.1);c.stroke();
    // 体力ゲージ
    c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-r*.8,r*1.15,r*1.6,7);c.fillStyle='#7cc6ff';c.fillRect(-r*.8,r*1.15,r*1.6*m.hp/m.max,7)}
  else if(m.max===2&&m.hp===2){c.fillStyle='#fff';c.font=`900 ${Math.round(r*.5)}px sans-serif`;c.textAlign='center';c.fillText('2',0,-r*.35)}
  c.restore()}
function hkDraw(now){hkDrawBg(now);const c=document.getElementById('hkCv').getContext('2d'),W=innerWidth,H=innerHeight;
  for(const m of hk.ms)hkFlame(c,m,now);
  for(const f of hk.fx){const a=1-f.t/(f.k==='pop'?.8:.5);c.globalAlpha=Math.max(0,a);
    if(f.k==='splash'){c.strokeStyle='#7cc6ff';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,12+f.t*90,0,7);c.stroke()}
    else if(f.k==='drop'){c.fillStyle='#7cc6ff';c.beginPath();c.arc(f.x,f.y-f.t*40,6,0,7);c.fill()}
    else if(f.k==='p'){c.fillStyle=f.c;c.beginPath();c.arc(f.x,f.y,3.5,0,7);c.fill()}
    else if(f.k==='pop'){c.fillStyle=f.big?'#ffd84d':'#fff';c.font=`900 ${f.big?34:22}px "Dela Gothic One",sans-serif`;c.textAlign='center';c.strokeStyle='#1b2740';c.lineWidth=4;c.strokeText(f.txt,f.x,f.y-30-f.t*40);c.fillText(f.txt,f.x,f.y-30-f.t*40)}}
  c.globalAlpha=1;
  if(hk.st==='count'){const n=Math.ceil(hk.cd);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.textAlign='center';c.font='900 120px "Dela Gothic One",sans-serif';c.fillText(n>0?n:'',W/2,H/2+40);
    c.font='900 22px sans-serif';c.fillText(`${hk.D.icon} ${hk.D.name}　ヒノコをタップ！`,W/2,H/2-90)}
  if(hk.st==='play'&&hk.t<10&&hk.t>9){c.fillStyle='#ffd84d';c.textAlign='center';c.font='900 34px "Dela Gothic One",sans-serif';c.strokeStyle='#1b2740';c.lineWidth=5;c.strokeText('ラスト10秒！',W/2,H*.4);c.fillText('ラスト10秒！',W/2,H*.4)}}
function hkEnd(){hk.st='end';snd('buy');buzz([60,40,60]);const D=hk.D;ga('mini_finish',{game:'ヒノコ',diff:D.name,score:hk.score,kills:hk.kills});
  hkTimeUp();const k=hk;hkLoadGlobal();
  setTimeout(()=>{if(hk!==k)return;hkResult();hkLock(1500)},1600)}
function hkTimeUp(){const c=document.getElementById('hkCv').getContext('2d'),W=innerWidth,H=innerHeight;hkDraw(performance.now());
  c.fillStyle='rgba(10,14,26,.6)';c.fillRect(0,0,W,H);c.textAlign='center';c.strokeStyle='#1b2740';c.lineWidth=8;
  c.font='900 52px "Dela Gothic One",sans-serif';c.fillStyle='#ffd84d';c.strokeText('タイムアップ！',W/2,H/2-30);c.fillText('タイムアップ！',W/2,H/2-30);
  c.font='900 64px "Dela Gothic One",sans-serif';c.fillStyle='#fff';c.strokeText(hk.score+'点',W/2,H/2+60);c.fillText(hk.score+'点',W/2,H/2+60)}
function hkLock(ms){const b=document.querySelector('#hkPanel .hkbox');if(!b)return;b.classList.add('lock');setTimeout(()=>b.classList.remove('lock'),ms)}
function hkResult(me){const D=hk.D,list=hkTop(hk.dk,me?[me]:null),place=me?list.indexOf(me)+1:list.filter(x=>x.s>hk.score).length+1;
  hkPanel(`<h2>${D.icon} ${D.name} しゅうりょう！</h2><div class="hkscore">${hk.score}<small>点</small></div>
  <p class="hkl">消したヒノコ ${hk.kills}匹${hk.big?`・巨大ヒノコ ${hk.big}匹`:''}・最高 ${hk.best}コンボ<br>${place<=3?`<b class="hkin">${D.name}ランキング ${place}位に入るよ！</b>`:'よくがんばった！'}</p>
  ${me?'':`<label class="nm">なまえ（8文字まで）<input id="hkName" maxlength="8" placeholder="ニックネーム" autocomplete="off"></label><button class="btn" data-hk="save">ランキングに登録</button>`}
  <h3 class="hks">${D.name}ランキング（上位3位）</h3><div id="hkTopBox">${hkTable(list,me)}</div>
  <a class="fb ig" href="${IG_URL}" target="_blank" rel="noopener">📷 Instagramをフォローしてね</a>
  <button class="btn sub" data-hk="again">もう一回（${D.name}）</button><button class="btn sub" data-hk="menu">難しさを変える・ランキング</button><button class="btn sub" data-hk="close">${/[?&]mini/.test(location.search)?'本編「分団サバイバル」で遊ぶ':'ゲームにもどる'}</button>`)}
function hkSave(){if(!hk||hk.saved)return;const el=document.getElementById('hkName'),v=(el&&el.value||'').trim();
  if(v&&ngName(v)){if(!document.getElementById('hkNg'))el.closest('label').insertAdjacentHTML('afterend','<p class="hkng" id="hkNg">そのなまえは使えないよ。ほかのなまえにしてね</p>');el.value='';el.focus();ga('name_blocked',{});return}
  const D=hk.D,me={n:v.slice(0,8)||'ななし',b:homeName(),s:hk.score,d:D.name,t:new Date().toISOString()};hk.saved=true;
  const r=hkRank();r.push(me);r.sort((a,b)=>b.s-a.s);try{localStorage.setItem(HK_KEY,JSON.stringify(r.slice(0,90)))}catch(x){}
  hkSend(me);ga('mini_save',{game:'ヒノコ',diff:D.name,score:me.s});hkResult(me)}
function hkSend(e){if(!formOn())return;try{const act=TA_FORM.url.replace(/\/viewform.*$/,'/formResponse');let ifr=document.getElementById('taIfr');
  if(!ifr){ifr=document.createElement('iframe');ifr.name='taIfr';ifr.id='taIfr';ifr.style.display='none';document.body.appendChild(ifr)}
  const f=document.createElement('form');f.method='POST';f.action=act;f.target='taIfr';f.style.display='none';
  const add=(k,v)=>{if(!k)return;const i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;f.appendChild(i)};
  add(TA_FORM.name,e.n);add(TA_FORM.branch,e.b);add(TA_FORM.score,String(e.s));add(TA_FORM.mode,'ミニ'+e.d);
  document.body.appendChild(f);f.submit();setTimeout(()=>f.remove(),3000)}catch(x){}}
// メニューに入口を追加
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const h=bx.querySelector('h2');if(!h)return;
  h.insertAdjacentHTML('afterend','<button class="btn hkmenu" data-act="hk"><b>🔥 30秒ヒノコたたき</b><small>サッと遊べるミニゲーム（やさしい／ふつう／ハード）</small></button>')})(menu);
document.addEventListener('click',e=>{if(e.target.closest('[data-act=hk]')){closeModal();hkIntro()}});
// ?mini で開いたら、すぐミニゲームの画面

(()=>{const st=document.createElement('style');st.textContent=`
#hk{position:fixed;inset:0;z-index:60;touch-action:none;user-select:none;-webkit-user-select:none}
#hk[hidden]{display:none}
#hkCv{position:absolute;inset:0;display:block}
#hkHud{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;align-items:center;gap:10px;padding:0 14px;pointer-events:none;font-family:var(--display);color:#fff}
#hkScore{font-size:30px;text-shadow:0 2px 0 #1b2740}
#hkCombo{flex:1;font-size:18px;color:#ffd84d;text-shadow:0 2px 0 #1b2740}
#hkTime{font-size:40px;min-width:56px;text-align:right;text-shadow:0 2px 0 #1b2740}
#hkTime.low{color:#ff6b57;animation:hkp .5s infinite alternate}@keyframes hkp{to{transform:scale(1.15)}}
#hkBar{position:absolute;left:14px;right:14px;top:calc(env(safe-area-inset-top,0px) + 58px);height:8px;border-radius:99px;background:rgba(255,255,255,.2);overflow:hidden;pointer-events:none}
#hkBar i{display:block;height:100%;background:#ffd84d;transform-origin:left center}
#hkPanel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,14,26,.55);overflow:auto}
#hkPanel[hidden]{display:none}
.hkshake{animation:ngshk .35s}
.hkbox{width:min(420px,100%);background:#fff;border-radius:20px;padding:18px 16px;box-shadow:0 10px 40px rgba(0,0,0,.4);max-height:100%;overflow:auto}
.hkbox h2{margin:0 0 6px;font-family:var(--display);font-weight:400;font-size:24px;color:var(--shu);text-align:center}
.hkbox .btn{width:100%;margin-top:8px}.hkbox .btn small,.btn.hkmenu small{display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:12px;opacity:.9;font-weight:700;letter-spacing:0}
.hkbox .btn.hkhard{background:#1b2740}
.hkl{margin:4px 0 6px;text-align:center;font-weight:700;font-size:14px;line-height:1.6}
.hkin{color:var(--shu)}
.hkscore{text-align:center;font-family:var(--display);font-size:64px;line-height:1.1;color:var(--shu)}.hkscore small{font-size:22px;margin-left:4px}
.hks{margin:14px 0 4px;font-size:15px;text-align:center}
.hkt{width:100%;border-collapse:collapse;font-size:20px;font-weight:900}.hkt td{padding:6px 4px;border-bottom:1px solid #eee}.hkt td:first-child{width:40px;font-size:24px}.hkt td:last-child{text-align:right;white-space:nowrap}.hkt b{font-family:var(--display);font-weight:400;font-size:26px;color:var(--shu)}.hkt small{display:block;font-size:11px;color:#6b7486;font-weight:700}.hkt tr.me td{background:#fff4d6}
.hkn{text-align:center;color:#6b7486;font-weight:700}
.hkbox.lock .btn,.hkbox.lock a,.hkbox.lock input{pointer-events:none;opacity:.45}.hkbox .btn,.hkbox a{transition:opacity .3s}
.hkng{color:#c62828;font-weight:800;margin:4px 0 0;text-align:center}
.hkbox .fb.ig{display:block;margin-top:12px;text-align:center}
.btn.hkmenu{background:#e5432a}.btn.hkmenu small{display:block;font-size:11px;font-weight:700;opacity:.9}`;document.head.appendChild(st)})();

