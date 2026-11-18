/* ===================== 林野火災・地震・操法大会 ===================== */
let ffT=80,ff=false,ffSaved=0,ffLost=0,eqT=110,eq=null;
function igniteTree(tr){tr.fire=true;tr.fhp=7;tr.fb=0;tr.sp=5}
function updForest(dt){
  if(!S.lv.d_mt||ty)return;
  const burning=trees.filter(t=>t.fire);
  if(!burning.length){
    if(ff){ff=false;const tot=ffSaved+ffLost,c=ffSaved*2*yl();pop('林野火災 鎮火！',`消し止めた木 ${ffSaved}/${tot}`);if(c)drop('coin',P.x,P.y,c);addMerit(ffLost===0?6:2);if(ffLost===0){support('d_mt');setTimeout(()=>giveBox('林野火災を完全に消し止めた'),1500)}}
    ffT-=dt;if(ffT<=0){ffT=100+Math.random()*40;startFF()}return}
  for(const tr of burning){tr.fb+=dt;tr.sp-=dt;
    if(Math.random()<dt*3)parts.push({k:'smoke',x:tr.x+(Math.random()-.5)*14,y:tr.y-46,r:6,life:1});
    if(tr.sp<=0){tr.sp=8;const n=nearest(trees,tr.x,tr.y,o=>o!==tr&&o.mt&&o.st==='up'&&!o.fire&&dist(o.x,o.y,tr.x,tr.y)<90);if(n)igniteTree(n)}
    if(tr.fb>50){tr.fire=false;tr.st='stump';tr.t=40;ffLost++;float(tr.x,tr.y-40,'燃えてしまった…','#ffd0c6',12)}}
}
function startFF(){const c=trees.filter(t=>t.mt&&t.st==='up'&&!t.fire);if(c.length<3)return;const a=c[Math.floor(Math.random()*c.length)];
  igniteTree(a);c.filter(o=>o!==a&&dist(o.x,o.y,a.x,a.y)<100).slice(0,2).forEach(igniteTree);ff=true;ffSaved=0;ffLost=0;
  snd('boss');buzz([80,60,80]);dispatch(`${distName('d_mt')}から応援要請！ 林野火災`,'燃え広がる前に放水で消そう。ポンプ車はイベントの火事には自動で行きません',(S.lv.truck?[{k:'truck',label:'ポンプ車で出動'}]:[]).concat(busOpt('d_mt'),[{k:'walk',label:'歩いて向かう'}]))}
function drawTreeFire(tr,t){const x=tr.x,y=tr.y-30,s=.9+tr.fb/50*.6;
  for(let i=0;i<7;i++){const a=t/110+i*1.6,ox=Math.sin(a)*7*s+(i-3)*4*s,oy=-Math.abs(Math.cos(a*1.3))*12*s;cx.fillStyle=i%2?'rgba(255,190,60,.92)':'rgba(240,90,40,.9)';cx.beginPath();cx.ellipse(x+ox,y+oy,6*s,12*s,0,0,7);cx.fill()}
  cx.fillStyle='rgba(255,240,170,.9)';cx.beginPath();cx.ellipse(x,y-4,4*s,8*s,0,0,7);cx.fill();
  cx.fillStyle='rgba(27,39,64,.7)';rr(x-16,y-34,32,6,3);cx.fill();cx.fillStyle='#ff6b4a';cx.fillRect(x-15,y-33,30*clamp(tr.fhp/7,0,1),4)}
function updQuake(dt){
  if(!S.lv.d_res||ty)return;
  if(eq){eq.t-=dt;if(eq.shake>0){eq.shake-=dt;shake=Math.max(shake,11)}
    for(const h of eq.hs){if(!h.person)continue;if(!P.ride&&dist(P.x,P.y,h.x,h.y)<46){h.dig=(h.dig||0)+dt;if(Math.random()<dt*6)chips(h.x,h.y-10);if(h.dig>2.5){h.dig=0;rescuePerson(h)}}else h.dig=Math.max(0,(h.dig||0)-dt*.5)}
    if(eq.t<=0||!eq.hs.some(h=>h.person))endQuake();return}
  eqT-=dt;if(eqT<=0){eqT=130+Math.random()*40;startQuake()}
}
function startQuake(){const c=houses.filter(h=>h.res&&h.st==='ok').sort(()=>Math.random()-.5);if(c.length<6)return;
  const hs=c.slice(0,4);hs.forEach(h=>{h.st='collapsed';h.person=true;h.dig=0});c.slice(4,6).forEach(h=>{ignite(h);h.ev=true});
  eq={t:120,shake:2.5,hs,saved:0};snd('boss');buzz([200,100,200]);dispatch(`${distName('d_res')}から応援要請！ 地震`,'倒れた家のそばに立つと救助できる（車からは降りてね）。火事も起きている',(S.lv.truck?[{k:'truck',label:'ポンプ車で出動'}]:[]).concat(busOpt('d_res'),[{k:'walk',label:'歩いて向かう'}]))}
function endQuake(){const e=eq;eq=null;e.hs.forEach(h=>{h.person=false;h.st='ok';h.dig=0});
  const all=e.saved>=e.hs.length;pop(all?'全員救助！':'地震の救助おわり',`助けた人 ${e.saved}/${e.hs.length}`);addMerit(all?6:1);if(all)support('d_res');if(all)setTimeout(()=>giveBox('地震で全員を助けた'),2400);
  setTimeout(()=>quiz('sonae','地震にそなえるクイズ','正解するとコインのごほうび',false,ok=>{if(ok)drop('coin',P.x,P.y,12*yl())}),1800)}
function drawCollapsed(h,t){shadow(h.x,h.y+h.h/2,h.w*.55,7);cx.fillStyle='#b9a58a';cx.beginPath();cx.moveTo(h.x-h.w/2-4,h.y+h.h/2);cx.lineTo(h.x-h.w/3,h.y-6);cx.lineTo(h.x+h.w/4,h.y-14);cx.lineTo(h.x+h.w/2+6,h.y+h.h/2);cx.closePath();cx.fill();
  cx.fillStyle=h.roof;cx.save();cx.translate(h.x,h.y-6);cx.rotate(-.35);cx.fillRect(-h.w/2,-8,h.w,10);cx.restore();
  cx.fillStyle='#6b4a30';for(let i=0;i<4;i++)cx.fillRect(h.x-h.w/2+i*12,h.y+4-(i%2)*6,14,3);
  if(h.dig>0){cx.strokeStyle='#2fa86b';cx.lineWidth=5;cx.beginPath();cx.arc(h.x,h.y,30,-Math.PI/2,-Math.PI/2+Math.PI*2*h.dig/2.5);cx.stroke()}}
/* 操法大会 */
let sh=null,shAway=true;
const SH_STEPS=['ホースを延ばせ！','結合！','放水始め！','標的を倒せ！'];
function updSoho(dt){if(S.sohoCD>0)S.sohoCD=Math.max(0,S.sohoCD-dt);const p=PADMAP.soho;if(!unlocked(p))return;const d=dist(P.x,P.y,p.x,p.y);
  if(d>50)shAway=true;else if(d<32&&shAway&&!P.ride&&!(S.sohoCD>0)){shAway=false;
    modal(`<h2>操法大会</h2><p class="lead">どの操法で出場する？</p><p class="note">針が緑のところに来たら「タップ」。動作を正確に決めよう。金メダルなら装備箱がもらえる<br>ポンプ車操法はホースを2線のばすので動作が多く、小型ポンプ操法は1線なので短い</p><button class="btn" data-act="shgo1">ポンプ車操法（5人・ホース2線・6動作）</button><button class="btn" data-act="shgo2">小型ポンプ操法（4人・ホース1線・4動作）</button><button class="btn sub" data-act="close">やめておく</button>`)}}
function sohoStart(){sh={step:0,pts:0,t0:performance.now(),last:performance.now(),pos:0,dir:1,log:[],z:0,w:0,done:false};
  modal(`<h2>操法大会</h2><p class="shstep" id="shStep"></p><div class="shbar" id="shBar" data-act="shtap"><div class="shzone" id="shZone"></div><div class="shpin" id="shPin"></div></div><button class="btn" data-act="shtap">タップ！</button><div class="shlog" id="shLog"></div><p class="note" id="shTime">0.0秒</p>`);
  sohoStep();requestAnimationFrame(sohoLoop)}
function sohoStep(){const six=SH_STEPS.length>4;sh.w=(six?[26,24,20,17,15,13]:[26,22,17,13])[sh.step];sh.z=20+Math.random()*60;sh.speed=(six?[75,85,100,115,130,145]:[75,95,120,145])[sh.step];
  document.getElementById('shStep').textContent=`${sh.step+1}. ${SH_STEPS[sh.step]}`;const z=document.getElementById('shZone');z.style.left=(sh.z-sh.w/2)+'%';z.style.width=sh.w+'%'}
function sohoLoop(now){if(!sh||sh.done)return;const dt=Math.min(.05,(now-sh.last)/1000);sh.last=now;sh.pos+=sh.dir*sh.speed*dt;if(sh.pos>100){sh.pos=100;sh.dir=-1}if(sh.pos<0){sh.pos=0;sh.dir=1}
  const pin=document.getElementById('shPin');if(!pin)return;pin.style.left=sh.pos+'%';document.getElementById('shTime').textContent=((now-sh.t0)/1000).toFixed(1)+'秒';requestAnimationFrame(sohoLoop)}
function sohoTap(){if(!sh||sh.done)return;const d=Math.abs(sh.pos-sh.z);let r,cls;
  if(d<=sh.w/6){r='ピタッ！';cls='p';sh.pts+=3;snd('buy')}else if(d<=sh.w/2){r='OK';cls='';sh.pts+=2;sh.okc=(sh.okc||0)+1;snd('coin')}else{r='ミス';cls='m';sh.miss=(sh.miss||0)+1;snd('hurt')}
  sh.log.push(`<span class="${cls}">${r}</span>`);document.getElementById('shLog').innerHTML=sh.log.join('');
  sh.step++;if(sh.step<SH_STEPS.length){sohoStep();return}
  sh.done=true;const sec=(performance.now()-sh.t0)/1000,tot=sec+(sh.okc||0)*1+(sh.miss||0)*4;
  const board=ALL9.filter(n=>n!==(S.home||'吹三')).map(n=>({n:n+'分団',t:(SH_STEPS.length>4?8:5.5)+Math.random()*(SH_STEPS.length>4?9:7)})).concat([{n:homeName()+'（きみ）',t:tot,me:true}]).sort((a,b)=>a.t-b.t);const place=board.findIndex(x=>x.me)+1;
  const medal=place===1?3:place<=3?2:place<=6?1:0,score=place;
  const coin=[5,20,40,80][medal]*yl();dmAdd('soho');if(medal===3)stAdd('sohog');addMerit([1,3,6,10][medal]);S.sohoCD=90;
  setTimeout(()=>{modal(`<h2>${shKind==='kogata'?'小型ポンプ操法 大会':'分団対抗 操法大会'}</h2><div class="medal r${medal||0}">${['参加賞','銅メダル','銀メダル','金メダル'][medal]}</div><p class="lead">分団対抗 ${place}位！（記録 ${tot.toFixed(1)}秒）</p><table class="rk">${board.map((x,i)=>`<tr class="${x.me?'me':''}"><td>${i+1}位</td><td>${x.n}</td><td>${x.t.toFixed(1)}秒</td></tr>`).join('')}</table><p class="note">記録＝かかった時間＋OKは1秒・ミスは4秒のペナルティ</p><div class="shlog">${sh.log.join('')}</div><p class="note">ごほうび コイン${coin}枚${medal===3?'・装備箱':''}<br>次の大会は90秒後に出場できる</p><button class="btn" data-act="close">やったね！</button>`);
    drop('coin',P.x,P.y,coin);if(medal===3)giveBox('操法大会 金メダル');snd(medal>=2?'buy':'new')},500)}
function drawSoho(p,t){const on=dist(P.x,P.y,p.x,p.y)<34,cd=S.sohoCD>0;
  cx.fillStyle=on?'rgba(243,182,72,.5)':'rgba(255,255,255,.9)';cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.fill();
  cx.strokeStyle=cd?'#9aa3b2':'#e5432a';cx.lineWidth=2.5;cx.setLineDash([7,5]);cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.stroke();cx.setLineDash([]);
  icon('hose',p.x,p.y-4,1.3);label('操法大会',p.x,p.y-48,12,'#fff',cd?'#9aa3b2':'#e5432a');
  label(cd?`あと${Math.ceil(S.sohoCD)}秒`:'出場できる',p.x,p.y+18,10,cd?'#5d6b84':'#e5432a')}

