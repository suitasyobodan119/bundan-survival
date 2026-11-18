/* ===================== 昼と夜・BGM・フェスタ3分チャレンジ ===================== */
const CYCLE=240;
function nightAmt(){const p=((S.clock||0)%CYCLE+CYCLE)%CYCLE;if(p<150)return 0;if(p<165)return (p-150)/15;if(p<225)return 1;return 1-(p-225)/15}
const isNight=()=>nightAmt()>.5;
let wasNight=false,nFireT=20;
function updDay(dt){
  if(!S.f.mon&&!S.ta)return;
  S.clock=(S.clock||0)+dt;const n=isNight();
  if(n&&!wasNight){toast('🌙 夜になった！ ヒノコが増えるぞ。そのかわり炎の石が多めに出る','warn');snd('boss');nFireT=12}
  if(!n&&wasNight){toast('☀️ 朝になった！ 夜をのりきった','ok');addMerit(3);snd('new')}
  wasNight=n;
  if(n&&!ty){nFireT-=dt;if(nFireT<=0){nFireT=26+Math.random()*10;const burning=houses.filter(h=>h.st==='fire').length;
    if(burning<3){const c=houses.filter(h=>h.st==='ok'&&active(h)&&!h.person&&dist(h.x,h.y,P.x,P.y)>160&&Math.hypot(h.x,h.y)<radius()-40);if(c.length){const h=c[Math.floor(Math.random()*c.length)];ignite(h);toast('🔥 夜の火事！ 赤い矢印の方へ急げ','warn')}}}}
}
killMon=(o=>function(m){o(m);if(isNight())drop('stone',m.x,m.y,m.boss?4:1)})(killMon);
drawHouse=(o=>function(h,t){o(h,t);const d=nightAmt();if(d<=0||h.st!=='ok')return;const k=Math.abs(Math.round(h.x*7+h.y*13))%5;if(k===0)return;
  cx.fillStyle=`rgba(255,214,120,${.95*d})`;if(k!==1)cx.fillRect(h.x-h.w/4-4,h.y+h.h/2-h.ht+6,8,8);if(k!==2)cx.fillRect(h.x+h.w/4-4,h.y+h.h/2-h.ht+6,8,8)})(drawHouse);
let nC=null,nX=null;
function drawNight(t){const d=nightAmt();if(d<=0)return;
  if(!nC){nC=document.createElement('canvas');nX=nC.getContext('2d')}
  if(nC.width!==cv.width||nC.height!==cv.height){nC.width=cv.width;nC.height=cv.height}
  const s=sc();nX.setTransform(1,0,0,1,0,0);nX.globalCompositeOperation='source-over';nX.clearRect(0,0,nC.width,nC.height);nX.fillStyle=`rgba(14,22,58,${.58*d})`;nX.fillRect(0,0,nC.width,nC.height);
  nX.setTransform(DPR*s,0,0,DPR*s,DPR*(W/2-cam.x*s),DPR*(H*.58-cam.y*s));nX.globalCompositeOperation='destination-out';
  const L=(x,y,r,a)=>{const g=nX.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a||1})`);g.addColorStop(1,'rgba(0,0,0,0)');nX.fillStyle=g;nX.fillRect(x-r,y-r,r*2,r*2)};
  const vw=W/s,vh=H/s,near=(x,y,m)=>Math.abs(x-cam.x)<vw/2+m&&Math.abs(y-cam.y)<vh+m;
  L(P.x,P.y-16,135);
  if(S.lv.truck)L(T.x+T.face*40,T.y-10,120,.9);
  for(const k of VEHS)if(S.lv[k]&&near(VEH[k].x,VEH[k].y,120))L(VEH[k].x,VEH[k].y-10,80,.7);
  const fl=1+.08*Math.sin(t/90);
  for(const h of houses){if(!near(h.x,h.y,140))continue;if(h.st==='fire')L(h.x,h.y-h.ht,120*fl,1);else if(h.st==='ok'){const k=Math.abs(Math.round(h.x*7+h.y*13))%5;if(k)L(h.x,h.y+h.h/2-h.ht+10,22,.8)}}
  for(const tr of trees)if(tr.fire&&near(tr.x,tr.y,120))L(tr.x,tr.y-20,95*fl,1);
  for(const m of mons)if(near(m.x,m.y,80))L(m.x,m.y-10,m.boss?120:55,.85);
  L(0,-114-58-16*yl(),110,.9);
  for(const p of PADS){if(p.id==='sell'||(unlocked(p)&&padCost(p.id)!=null&&!(p.lock&&p.lock())))if(near(p.x,p.y,80))L(p.x,p.y,48,.6)}
  for(const dd of drops)if(near(dd.x,dd.y,30))L(dd.x,dd.y,22,.6);
  nX.globalCompositeOperation='source-over';
  cx.save();cx.setTransform(1,0,0,1,0,0);cx.drawImage(nC,0,0);cx.restore();
}

/* --- BGM --- */
const SONGS={
  day:{bpm:132,mel:[76,79,81,79,76,74,72,0, 76,81,84,81,79,76,81,0, 81,84,86,84,81,79,81,0, 79,81,79,76,74,0,79,0],bass:[48,48,45,45,41,41,43,43],wave:'triangle',g:.045},
  night:{bpm:92,mel:[76,0,72,0,74,0,69,0, 76,0,79,0,77,0,76,0, 72,0,74,0,76,0,72,0, 71,0,72,0,69,0,0,0],bass:[45,45,41,41,48,48,40,40],wave:'sine',g:.05},
  alert:{bpm:156,mel:[69,72,76,72,69,72,76,79, 77,76,72,69,71,72,74,76, 69,72,76,72,69,72,76,81, 79,77,76,74,72,71,69,0],bass:[45,45,45,45,41,41,43,43],wave:'square',g:.022}};
let bgmG=null,bgmNext=0,bgmStep=0,bgmMode='day',bgmChk=0;
const mf=n=>440*Math.pow(2,(n-69)/12);
function bnote(f,t,d,type,g){const o=AC.createOscillator(),a=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(g,t+.015);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a).connect(bgmG);o.start(t);o.stop(t+d+.03)}
function alarmOn(){return !!(ty||em||hr||ff||eq||rain||houses.some(h=>h.st==='fire'&&active(h)))}
function bgmTick(){if(!AC)return;if(!bgmG){bgmG=AC.createGain();bgmG.gain.value=0;bgmG.connect(AC.destination)}
  const on=!S.muted&&!S.bgmOff&&!document.hidden&&S.started;bgmG.gain.setTargetAtTime(on?1:0,AC.currentTime,.15);
  if(!on){bgmNext=0;return}
  const now=AC.currentTime;if(bgmNext<now-.2){bgmNext=now+.06}
  if(bgmStep%8===0&&bgmChk!==bgmStep){bgmChk=bgmStep;const m=alarmOn()?'alert':isNight()?'night':'day';if(m!==bgmMode){bgmMode=m;bgmStep=0;bgmChk=0}}
  const sg=SONGS[bgmMode],st=60/sg.bpm/2;
  while(bgmNext<now+.3){const i=bgmStep%sg.mel.length,n=sg.mel[i];
    if(n)bnote(mf(n),bgmNext,st*1.6,sg.wave,sg.g);
    if(i%2===0)bnote(mf(sg.bass[(i>>2)%sg.bass.length]+(i%4?7:0)),bgmNext,st*1.8,'sine',.07);
    if(bgmMode!=='night'&&i%2===1)bnote(2400,bgmNext,.03,'square',.006);
    bgmNext+=st;bgmStep++}
}
document.addEventListener('pointerdown',()=>{if(AC&&AC.state==='suspended')AC.resume()},{passive:true});

/* --- フェスタ 3分チャレンジ --- */
const TA_KEY='bundan-ta-rank',TA_LEN=180;
let TA_MAIN=null,taT=0,taPick=false,taLastSec=99,taScore=0,taSaved=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function taRank(){try{return JSON.parse(localStorage.getItem(TA_KEY))||[]}catch(e){return[]}}
function taRankHtml(hi){const r=taRank().slice(0,10);if(!r.length)return '<p class="note">まだ記録がないよ。1位をねらおう！</p>';
  return `<table class="rk">${r.map((x,i)=>`<tr class="${hi!=null&&i===hi?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(x.n)}<small>${esc(x.b||'')}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`}
function taIntro(){modal(`<h2>3分チャレンジ</h2><p class="lead">3分間で、コインを何枚かせげるか！</p><ul class="loop"><li><span class="n">1</span><span>木を切って、買取所で売ろう</span></li><li><span class="n">2</span><span>ヒノコを倒して火事を消すと、コインがもらえる</span></li><li><span class="n">3</span><span>斧やホースを買うと、もっとかせげる！ 最後の1分は夜になるぞ</span></li></ul><h3 class="sec">ランキング</h3>${taRankHtml()}<button class="btn" data-act="tago">スタート！</button><button class="btn sub" data-act="tahome">所属分団：${homeName()}（変える）</button><button class="btn sub" data-act="taexit">ふつうに遊ぶ</button>`)}
function taStart(){if(!S.ta){TA_MAIN=S;save()}const B=TA_MAIN;S=fresh();Object.assign(S,{ta:true,started:true,home:B.home||'吹三',homeSet:true,muted:B.muted,bgmOff:B.bgmOff,uz:B.uz,tyT:99999,clock:45,seen:['sell']});
  taT=TA_LEN;taLastSec=99;taSaved=false;resetWorld();emT=70;closeModal();document.getElementById('taBar').hidden=false;pop('スタート！','3分でコインをたくさんかせごう');snd('buy')}
function taTick(dt){if(!S.ta||taT<=0)return;taT-=dt;const sec=Math.ceil(taT);
  if(sec!==taLastSec){taLastSec=sec;const el=document.getElementById('taBar');el.textContent=`⏱ ${Math.floor(Math.max(0,sec)/60)}:${String(Math.max(0,sec)%60).padStart(2,'0')}　💰 ${S.earned}`;el.classList.toggle('low',sec<=30);if(sec<=10&&sec>0)snd('tick')}
  if(taT<=0)taEnd()}
function taEnd(){taScore=S.earned;const r=taRank(),place=r.filter(x=>x.s>taScore).length+1;snd('buy');
  modal(`<h2>タイムアップ！</h2><div class="medal r${place<=3?4-place:0}">${taScore}枚</div><p class="lead">${place<=10?`ランキング ${place}位に入るよ！`:'よくがんばった！'}</p><p class="note">消した火事 ${S.st.ext||0}件・倒したヒノコ ${S.st.kill||0}匹・斧 Lv${S.lv.axe}・ホース Lv${S.lv.hose}</p><label class="nm">なまえ（8文字まで）<input id="taName" maxlength="8" placeholder="ニックネーム" autocomplete="off"></label><button class="btn" data-act="tasave">ランキングに登録</button><button class="btn sub" data-act="tago">登録しないでもう一回</button>`)}
function taSave(){if(taSaved)return;const n=(document.getElementById('taName').value||'').trim().slice(0,8)||'ななし';taSaved=true;
  const r=taRank();const e={n,b:homeName(),s:taScore,d:Date.now(),e:!!S.easy};sendForm(e);r.push(e);r.sort((a,b)=>b.s-a.s||a.d-b.d);const top=r.slice(0,50);try{localStorage.setItem(TA_KEY,JSON.stringify(top))}catch(x){}
  const i=top.indexOf(e);modal(`<h2>ランキング</h2>${taRankHtml(i<10?i:null)}${i>=10?`<p class="note">${esc(n)}：${i+1}位（${taScore}枚）</p>`:''}<button class="btn" data-act="tanext">次の人へ</button><button class="btn sub" data-act="taexit">ふつうのモードにもどる</button><button class="btn sub mini" data-act="taclr">ランキングを消す（係の人用）</button>`)}
function taExit(){document.getElementById('taBar').hidden=true;if(S.ta){S=TA_MAIN||fresh();TA_MAIN=null;resetWorld();hudKey=''}closeModal();if(!S.started)intro();else if(!S.homeSet)pickHome(true)}
setHome=(o=>function(n){if(S.ta&&TA_MAIN)TA_MAIN.home=n;o(n);if(taPick){taPick=false;taIntro()}})(setHome);
menu=(o=>function(){if(!S.ta)return o();modal(`<h2>3分チャレンジ中</h2><p class="lead">のこり ${Math.ceil(taT)}秒・コイン ${S.earned}枚</p><button class="btn" data-act="close">チャレンジにもどる</button><button class="btn sub" data-act="taexit">やめて、ふつうのモードにもどる</button>`)})(menu);
dmAdd=(o=>function(k,v){if(S&&S.ta)return;o(k,v)})(dmAdd);
checkBadges=(o=>function(s){if(S&&S.ta)return 0;return o(s)})(checkBadges);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='ta')taIntro();else if(a==='tago')taStart();else if(a==='tasave')taSave();else if(a==='tanext')taIntro();else if(a==='taexit')taExit();
  else if(a==='tahome'){taPick=true;pickHome(false)}
  else if(a==='sfx'){S.muted=!S.muted;save();b.textContent=`効果音：${S.muted?'OFF':'ON'}`}
  else if(a==='bgm'){S.bgmOff=!S.bgmOff;save();b.textContent=`BGM：${S.bgmOff?'OFF':'ON'}`}
  else if(a==='taclr'){if(b.dataset.arm){try{localStorage.removeItem(TA_KEY)}catch(x){}taIntro()}else{b.dataset.arm='1';b.textContent='もう一度押すと消えます'}}});

update=(o=>function(dt){o(dt);updDay(dt);taTick(dt)})(update);
hud=(o=>function(){o();bgmTick()})(hud);

