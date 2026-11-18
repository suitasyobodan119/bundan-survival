/* ===================== やさしいモード・送水・ホース延長・心肺蘇生・119番・分団の色・入団案内・記録送信 ===================== */
const IG_URL='https://www.instagram.com/suitasyobodan119_osaka/';
const QUIZ_URL='https://suitasyobodan119.github.io/suita-quiz/';
/* 3分チャレンジの記録を送るGoogleフォーム（設定すると自動で送信・全体ランキングを表示） */
const TA_FORM={url:'https://docs.google.com/forms/d/e/1FAIpQLSe5b_khrUeY_KmapciDBqdcZAxfW5sPCqSYf7DYgvVGGiXOxA/viewform',name:'entry.2112119961',branch:'entry.1680314537',score:'entry.795622279',mode:'entry.271835211',csv:'https://docs.google.com/spreadsheets/d/167GdvtAofBcuODDnAPcAphLB2fkS4dVyswtTv-sDtWA/gviz/tq?tqx=out:csv&headers=1&tq='+encodeURIComponent('select *')+'&sheet='+encodeURIComponent('フォームの回答 1')};
const BCOL={'吹一':'#d8402a','吹二':'#f08a24','吹三':'#2f78b8','千一':'#2fa86b','千二':'#8a5cc2','豊津':'#159c9c','岸部':'#3a4fa8','山田':'#8a5a2a','千里丘':'#e0558f'};
const bcol=n=>{const s=String(n);const k=Object.keys(BCOL).find(k=>s.startsWith(k));return k?BCOL[k]:'#e5432a'};
const homeCol=()=>bcol((S&&S.home)||'吹三');

/* --- 1. やさしいモード --- */
function easyFill(){if(!S.easy)return;if(S.lv.truck&&T.w!=null)T.w=tCap();const L=VEH.ladder;if(S.lv.ladder&&L.w!=null)L.w=LCAP()}

/* --- 2. ポンプ車からはしご車へ送水 --- */
let relayT=0;
function updRelay(dt){const L=VEH.ladder;if(!S.lv.ladder||!S.lv.truck||L.w==null)return;
  if(!L.conn&&dist(T.x,T.y,L.x,L.y)<120&&(T.conn||T.w>0)){L.conn={x:T.x,y:T.y-6,k:'pump'};if(L.w<LCAP()||L.spray||(hr&&hr.aim)){L.w=Math.min(LCAP(),L.w+45*dt);if(!T.conn)T.w=Math.max(0,T.w-5*dt)}
    relayT-=dt;if(relayT<=0&&P.ride==='ladder'){relayT=6;float(T.x,T.y-80,'ポンプ車から送水中！','#cfe8ff',13)}}}

/* --- 3. ホース延長 --- */
const HOSE_LEN=260;let hoseTip=false;
let hoseDw=0;
const fireNear=(x,y,r)=>houses.some(o=>o.st==='fire'&&dist(o.x,o.y,x,y)<r)||mons.some(m=>!m.dead&&dist(m.x,m.y,x,y)<r)||trees.some(t=>t.fire&&dist(t.x,t.y,x,y)<r);
function updHose(dt){if(P.ride){P.hose=null;return}
  if(P.hose){const d=dist(P.x,P.y,P.hose.x,P.hose.y);if(d>HOSE_LEN){P.hose=null;if(P.spray){float(P.x,P.y-60,'ホースが届かない！ 消火栓にもどってつなぎ直そう','#ffd0c6',13)}}return}
  const h=nearest(HYDS,P.x,P.y,o=>o.k!=='river'&&inArea(o.x,o.y,0)&&dist(o.x,o.y,P.x,P.y)<34);
  if(h){hoseDw+=dt;if(hoseDw<.6)return}else{hoseDw=0}
  if(h){hoseDw=0;P.hose=h;snd('new');float(h.x,h.y-46,'ホースをつないだ！ 放水が強くなる','#fff',14);if(!hoseTip){hoseTip=true;toast(`消火栓につなぐと、放水が強く遠くまで届く！ ホースは${Math.round(HOSE_LEN/26)}本分（約${Math.round(HOSE_LEN/26)*20}m）までのばせる`,'ok')}}}
drawHyds=(o=>function(t){o(t);
  if(P.hose){const h=P.hose,d=dist(P.x,P.y,h.x,h.y),sag=Math.max(0,40-d*.12);cx.strokeStyle=d>HOSE_LEN*.85?'#e5432a':'#d7a52b';cx.lineWidth=3.5;cx.beginPath();cx.moveTo(h.x,h.y-8);cx.quadraticCurveTo((h.x+P.x)/2,(h.y+P.y)/2+sag,P.x,P.y-14);cx.stroke()}
  else if(!P.ride){const h=nearest(HYDS,P.x,P.y,o=>o.k!=='river'&&inArea(o.x,o.y,0)&&dist(o.x,o.y,P.x,P.y)<140);if(h&&fireNear(h.x,h.y,450))label('ここに立つとホースをつなげる',h.x,h.y+22,10,'#fff','#d8331f')}})(drawHyds);

/* --- 4. 心肺蘇生リズムゲーム --- */
let cpr=null;
function cprGame(title,cb){cpr={taps:[],t0:0,cb,done:false,dur:12};
  modal(`<h2>${title}</h2><p class="lead">AEDが届くまで胸骨圧迫！</p><p class="note">胸の真ん中を<b>強く・速く（1分間に100〜120回）・休まず</b>押そう。光る丸のリズムに合わせてタップ！</p>
  <div class="cpr"><div class="cprbeat"></div><button class="cprbtn" id="cprBtn" data-act="cprtap">押す！</button></div>
  <div class="cprmeter"><span id="cprBpm">--</span><small>回/分</small></div><div class="prog"><i id="cprProg" style="width:0%"></i></div><p class="note" id="cprMsg">押すとスタート（12秒）</p>`)}
function cprTap(){if(!cpr||cpr.done)return;const now=performance.now();if(!cpr.t0){cpr.t0=now;cpr.timer=setInterval(cprTick,100)}cpr.taps.push(now);snd('tick');buzz(15);
  const b=document.getElementById('cprBtn');if(b){b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit')}
  const n=cpr.taps.length;if(n>=3){const iv=(cpr.taps[n-1]-cpr.taps[n-4<0?0:n-4])/(Math.min(3,n-1));const bpm=Math.round(60000/iv);const el=document.getElementById('cprBpm');if(el){el.textContent=bpm;el.className=bpm<100?'slow':bpm>120?'fast':'ok'}
    const m=document.getElementById('cprMsg');if(m)m.textContent=bpm<100?'もっと速く！':bpm>120?'速すぎ！ 少しゆっくり':'いいリズム！ そのまま'}}
function cprTick(){if(!cpr)return;const e=(performance.now()-cpr.t0)/1000;const p=document.getElementById('cprProg');if(p)p.style.width=Math.min(100,e/cpr.dur*100)+'%';if(e>=cpr.dur)cprEnd()}
function cprEnd(){const c=cpr;if(!c||c.done)return;c.done=true;clearInterval(c.timer);const iv=[];for(let i=1;i<c.taps.length;i++)iv.push(c.taps[i]-c.taps[i-1]);
  const good=iv.filter(x=>x>=500&&x<=600).length,ok2=iv.filter(x=>x>=470&&x<=640).length,rate=iv.length?ok2/iv.length:0,avg=iv.length?Math.round(60000/(iv.reduce((a,b)=>a+b,0)/iv.length)):0,ok=rate>=.6&&c.taps.length>=16;
  stAdd('cpr');if(ok)stAdd('cprok');
  modal(`<h2>${ok?'救命成功！':'救急隊に引き継いだ'}</h2><div class="medal r${ok?(rate>.85?3:2):0}">${Math.round(rate*100)}点</div><p class="lead">平均 ${avg}回/分・${c.taps.length}回押した</p><p class="note">${ok?'AEDが届いて、救急隊に引き継げた！':'リズムは1分間に100〜120回。「もしもしカメよ」くらいの速さだよ'}<br>本物の心肺蘇生は、消防署の救命講習で練習できます</p><button class="btn" data-act="cprdone" data-ok="${ok?1:0}">OK</button>`)}
function cprDone(ok){const c=cpr;cpr=null;closeModal();if(c&&c.cb)c.cb(ok)}
quiz=(o=>function(bank,title,sub,hint,cb){if(bank==='kyukyu'&&!cpr&&!qsetOn&&Math.random()<.45){cprGame('救急出動！ 倒れた人が息をしていない',ok=>cb&&cb(ok));return}return o(bank,title,sub,hint,cb)})(quiz);

/* --- 5. 119番通報ゲーム --- */
let tsu=null,tsuCD=150;
const TSU_STEPS=[
  {q:'「119番 消防です。火事ですか、救急ですか？」',a:['火事です！','もしもし？','えーっと……'],tip:'最初に「火事」か「救急」かを伝えよう'},
  {q:'「場所はどこですか？」',a:['さくら町3丁目5番です。コンビニの向かいです','家の近くです','あっちの方です'],tip:'住所や目印になる建物を伝えよう'},
  {q:'「何が燃えていますか？」',a:['2階建ての家の1階が燃えています','なんか煙が出てます','わかりません'],tip:'何がどのくらい燃えているか伝えよう'},
  {q:'「逃げおくれた人やけが人はいますか？」',a:['中に1人残っているかもしれません','知りません','たぶん大丈夫'],tip:'人が残っているかは、とても大事な情報だよ'},
  {q:'「あなたのお名前と電話番号を教えてください」',a:['ふくだです。電話番号は○○○です','言いたくないです','もう切ります'],tip:'名前と電話番号を伝えて、電話は切らずに待とう'}];
function tsuGame(house,practice){const order=TSU_STEPS.map(s=>{const idx=[0,1,2].sort(()=>Math.random()-.5);return idx});tsu={i:0,miss:0,order,house,practice};tsuShow()}
function tsuShow(fb){const s=TSU_STEPS[tsu.i];modal(`<h2>119番通報</h2><div class="tsucard"><b>見たこと</b>さくら町3丁目5番・コンビニの向かい／2階建ての家の1階から火／中に1人いるかも</div><p class="tsuq">📞 ${s.q}</p>${tsu.order[tsu.i].map(k=>`<button class="btn sub" data-act="tsu" data-v="${k}">${s.a[k]}</button>`).join('')}${fb?`<p class="note ng">${fb}</p>`:''}<p class="note">${tsu.i+1} / ${TSU_STEPS.length}</p>`)}
function tsuAnswer(k){const s=TSU_STEPS[tsu.i];if(k!==0){tsu.miss++;snd('hurt');tsuShow('ちがうよ。'+s.tip);return}snd('tick');tsu.i++;if(tsu.i<TSU_STEPS.length){tsuShow();return}
  const t=tsu;tsu=null;stAdd('tsuho');const perfect=t.miss===0;
  modal(`<h2>通報できた！</h2><div class="medal r${perfect?3:t.miss<=2?2:1}">${perfect?'満点':`ミス${t.miss}`}</div><p class="lead">「すぐに消防車が向かいます！」</p><p class="note">火事・救急のときは、あわてずに<br>①火事か救急か ②場所 ③何が起きたか ④けが人 ⑤名前と電話番号 を伝えよう</p><button class="btn" data-act="tsudone" data-p="${t.practice?1:0}">OK</button>`);
  if(!t.practice){addMerit(perfect?4:2);drop('coin',P.x,P.y,(perfect?6:3)*yl());if(t.house&&t.house.st==='fire')t.house.hp*=.5}}
function updTsu(dt){if(S.ta||!S.f.ext||paused)return;tsuCD-=dt;if(tsuCD>0)return;if(ty||hr||eq||em||dEv||P.ride)return;
  const h=nearest(houses,P.x,P.y,o=>o.st==='fire'&&!o.ev&&active(o)&&dist(o.x,o.y,P.x,P.y)<420);if(!h)return;tsuCD=300;tsuGame(h,false)}

/* --- 6. 分団の色（旗・法被） --- */
function flag(x,y,col,txt){cx.fillStyle='#5d6b84';cx.fillRect(x-1.5,y-46,3,46);cx.fillStyle=col;cx.beginPath();cx.moveTo(x+1.5,y-46);cx.lineTo(x+34,y-40);cx.lineTo(x+1.5,y-30);cx.closePath();cx.fill();cx.fillStyle='#fff';cx.font='bold 8px sans-serif';cx.textAlign='left';cx.textBaseline='middle';cx.fillText(txt,x+4,y-39)}
drawDistBld=(o=>function(b,t){o(b,t);const n=b.d.name.replace('分団','');flag(b.x+b.w/2-6,b.y-b.h/2-b.ht+4,bcol(n),n)})(drawDistBld);
drawBld=(o=>function(b,t){o(b,t);if(b.id==='tsume'){const n=(S.home||'吹三');flag(b.x+b.w/2-8,b.y-b.h/2-b.ht+4,homeCol(),n)}})(drawBld);
let townCol='';
hud=(o=>function(){o();const el=document.getElementById('hTown');const c=bcol(townName());if(c!==townCol){townCol=c;el.style.background=c}})(hud);

/* --- 8. 記録送信 --- */
const formOn=()=>!!(TA_FORM.url&&TA_FORM.name&&TA_FORM.score);
function sendForm(e){if(!formOn())return;try{const act=TA_FORM.url.replace(/\/viewform.*$/,'/formResponse');let ifr=document.getElementById('taIfr');if(!ifr){ifr=document.createElement('iframe');ifr.name='taIfr';ifr.id='taIfr';ifr.style.display='none';document.body.appendChild(ifr)}
  const f=document.createElement('form');f.method='POST';f.action=act;f.target='taIfr';f.acceptCharset='UTF-8';f.style.display='none';
  const add=(k,v)=>{if(!k)return;const x=document.createElement('input');x.type='hidden';x.name=k;x.value=v;f.appendChild(x)};
  add(TA_FORM.name,e.n);add(TA_FORM.branch,e.b);add(TA_FORM.score,String(e.s));add(TA_FORM.mode,e.e?'やさしい':'ふつう');
  document.body.appendChild(f);f.submit();setTimeout(()=>f.remove(),3000);toast('フェスタ全体ランキングに送ったよ','ok')}catch(x){}}
async function loadAll(){if(!TA_FORM.csv)return null;try{const r=await fetch(TA_FORM.csv+'&_='+Date.now(),{cache:'no-store'});const tx=await r.text();const rows=tx.trim().split(/\r?\n/).slice(1).map(l=>l.split(','));return rows.map(c=>({n:(c[1]||'').replace(/"/g,''),b:(c[2]||'').replace(/"/g,''),s:+(c[3]||'0').replace(/"/g,''),e:/やさしい/.test(c[4]||''),mini:/^ミニ/.test(c[4]||'')})).filter(x=>x.s>0&&!x.mini).sort((a,b)=>b.s-a.s).slice(0,10)}catch(x){return null}}
async function showAll(){modal('<h2>フェスタ全体ランキング</h2><p class="note">読みこみ中…</p>');const r=await loadAll();if(!r){modal('<h2>フェスタ全体ランキング</h2><p class="note">読みこめませんでした。電波のよいところで試してね</p><button class="btn" data-act="tanext">もどる</button>');return}
  modal(`<h2>フェスタ全体ランキング</h2><table class="rk">${r.map((x,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(x.n)}<small>${esc(x.b)}${x.e?'・やさしい':''}</small></td><td>${x.s}枚</td></tr>`).join('')}</table><button class="btn" data-act="tanext">もどる</button>`)}

/* --- 7. 入団案内（本物の消防団へ） --- */
const REAL=`<div class="real"><b>本物の吹田市消防団を見てみよう</b><a class="fb ig" href="${IG_URL}" target="_blank" rel="noopener">📷 公式Instagram</a><div class="qzlinks"><a class="fb qz" href="https://suitasyobodan119.github.io/suita-quiz/" target="_blank" rel="noopener"><b>救急救命</b><small>クイズ</small></a><a class="fb qz" href="https://suitasyobodan119.github.io/suita-quiz/sonae.html" target="_blank" rel="noopener"><b>備え（地震）</b><small>クイズ</small></a><a class="fb qz" href="https://suitasyobodan119.github.io/suita-quiz/nyudan.html" target="_blank" rel="noopener"><b>消防団って何？</b><small>クイズ</small></a></div><span>消防団は、ふだんは仕事や学校がある地域の人たちが、火事や災害のときに町を守る組織です</span></div>`;
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;
  const fb=bx.querySelector('a.fb');const div=document.createElement('div');div.innerHTML=`<h3 class="sec">ミニゲームで練習</h3><div class="row2"><button class="btn sub" data-act="cprprac">❤️ 心肺蘇生</button><button class="btn sub" data-act="tsuprac">📞 119番通報</button></div><button class="btn sub" data-act="easy">やさしいモード：${S.easy?'ON（水が減らない）':'OFF'}</button>${REAL}`;
  if(fb)bx.insertBefore(div,fb);else bx.appendChild(div)})(menu);
taIntro=(o=>function(){o();const bx=document.querySelector('.modal .box');if(!bx)return;const go=bx.querySelector('[data-act=tago]');const d=document.createElement('div');
  d.innerHTML=`<button class="btn sub" data-act="taeasy">やさしいモード：${taEasy?'ON（水が減らない）':'OFF'}</button>${TA_FORM.csv?'<button class="btn sub" data-act="taall">🏆 フェスタ全体ランキング</button>':''}`;bx.insertBefore(d,go.nextSibling)})(taIntro);
let taEasy=true;
taStart=(o=>function(){o();S.easy=taEasy})(taStart);
taSave=(o=>function(){o();
  const bx=document.querySelector('.modal .box');if(bx){const d=document.createElement('div');d.innerHTML=REAL;bx.appendChild(d)}})(taSave);
taRankHtml=(o=>function(hi){const h=o(hi);const r=taRank().slice(0,10);let i=0;return h.replace(/<\/small><\/td>/g,()=>{const x=r[i++];return (x&&x.e?'・やさしい':'')+'</small></td>'})})(taRankHtml);

document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='cprtap'&&!matchMedia('(pointer:coarse)').matches)cprTap();
  else if(a==='cprdone')cprDone(b.dataset.ok==='1');
  else if(a==='cprprac')cprGame('心肺蘇生の練習',ok=>{if(ok)toast('ばっちり！ 本番でもこのリズムで','ok')});
  else if(a==='tsuprac')tsuGame(null,true);
  else if(a==='tsu')tsuAnswer(+b.dataset.v);
  else if(a==='tsudone')closeModal();
  else if(a==='easy'){S.easy=!S.easy;save();b.textContent=`やさしいモード：${S.easy?'ON（水が減らない）':'OFF'}`}
  else if(a==='taeasy'){taEasy=!taEasy;b.textContent=`やさしいモード：${taEasy?'ON（水が減らない）':'OFF'}`}
  else if(a==='taall')showAll()});
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#cprBtn')&&matchMedia('(pointer:coarse)').matches){e.preventDefault();cprTap()}},{passive:false});

update=(o=>function(dt){o(dt);updRelay(dt);updHose(dt);updTsu(dt);easyFill()})(update);
BADGES.push(['cpr','❤️','心肺蘇生 成功',()=>(S.st.cprok||0)>=1],['tsuho','📞','119番通報 できた',()=>(S.st.tsuho||0)>=1]);

