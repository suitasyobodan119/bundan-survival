/* ===================== ランキング2分割・最初はシンプル・軽いモード・小型ポンプ操法・計測・お知らせ ===================== */
function loopShort(){const li=LOOP.match(/<li>[\s\S]*?<\/li>/g)||[];return `<ul class="loop">${li.slice(0,4).join('')}</ul><details class="how"><summary>もっと知りたい人へ（出動・操法・台風など）</summary><ul class="loop">${li.slice(4).join('')}</ul></details><p class="note">さいしょは木を切って売るだけでOK！ できることは少しずつ増えていくよ</p>`}
const ga=(n,p)=>{try{if(typeof window.gtag==='function')window.gtag('event',n,p||{})}catch(e){}};

/* --- 7. ランキングを「やさしい」「ふつう」に分ける --- */
let rankMode='e';
const modeOf=x=>x&&x.e?'e':'n';
const MODE_NAME={e:'やさしい',n:'ふつう'};
function rankTabs(act,m){return `<div class="rtabs">${['e','n'].map(k=>`<button class="rtab ${m===k?'on':''}" data-act="${act}" data-v="${k}">${MODE_NAME[k]}モード</button>`).join('')}</div>`}
taRankHtml=function(hi,m){m=m||rankMode;const r=taRank().filter(x=>modeOf(x)===m).slice(0,10);if(!r.length)return `<p class="note">${MODE_NAME[m]}モードは、まだ記録がないよ。1位をねらおう！</p>`;
  return `<table class="rk">${r.map((x,i)=>`<tr class="${hi!=null&&i===hi?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(x.n)}<small>${esc(x.b||'')}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`};
taIntro=function(){rankMode=taEasy?'e':'n';
  modal(`<h2>3分チャレンジ</h2><p class="lead">3分間で、コインを何枚かせげるか！</p><ul class="loop"><li><span class="n">1</span><span>木を切って、買取所で売ろう</span></li><li><span class="n">2</span><span>ヒノコを倒して火事を消すと、コインがもらえる</span></li><li><span class="n">3</span><span>斧やホースを買うと、もっとかせげる！ 最後の1分は夜になるぞ</span></li></ul>
  <button class="btn sub" data-act="taeasy">${taEasy?'やさしいモード（水が減らない）':'ふつうモード（水が減る）'}　▶ 切りかえ</button>
  <h3 class="sec">ランキング <small>${MODE_NAME[rankMode]}モード</small></h3>${taRankHtml(null,rankMode)}
  <button class="btn" data-act="tago">スタート！</button>${TA_FORM.csv?'<button class="btn sub" data-act="taall">🏆 フェスタ全体ランキング</button>':''}<button class="btn sub" data-act="tahome">所属：${homeName()}（変える）</button><button class="btn sub" data-act="taexit">ふつうに遊ぶ</button>`)};
taEnd=function(){taScore=S.earned;const m=S.easy?'e':'n';const r=taRank().filter(x=>modeOf(x)===m),place=r.filter(x=>x.s>taScore).length+1;snd('buy');ga('ta_finish',{score:taScore,mode:MODE_NAME[m],branch:homeName()});
  modal(`<h2>タイムアップ！</h2><div class="medal r${place<=3?4-place:0}">${taScore}枚</div><p class="lead">${MODE_NAME[m]}モード ${place<=10?`ランキング ${place}位に入るよ！`:'よくがんばった！'}</p><p class="note">消した火事 ${S.st.ext||0}件・倒したヒノコ ${S.st.kill||0}匹・斧 Lv${S.lv.axe}・ホース Lv${S.lv.hose}</p><label class="nm">なまえ（8文字まで）<input id="taName" maxlength="8" placeholder="ニックネーム" autocomplete="off"></label><button class="btn" data-act="tasave">ランキングに登録</button><button class="btn sub" data-act="tago">登録しないでもう一回</button>`)};
taSave=function(){if(taSaved)return;const n=(document.getElementById('taName').value||'').trim().slice(0,8)||'ななし';taSaved=true;const m=S.easy?'e':'n';
  const e={n,b:homeName(),s:taScore,d:Date.now(),e:m==='e'};sendForm(e);let r=taRank();r.push(e);r.sort((a,b)=>b.s-a.s||a.d-b.d);
  const keep=[...r.filter(x=>modeOf(x)==='e').slice(0,50),...r.filter(x=>modeOf(x)==='n').slice(0,50)];try{localStorage.setItem(TA_KEY,JSON.stringify(keep))}catch(x){}
  const list=r.filter(x=>modeOf(x)===m),i=list.indexOf(e);rankMode=m;
  modal(`<h2>ランキング</h2><p class="lead">${MODE_NAME[m]}モード</p>${taRankHtml(i<10?i:null,m)}${i>=10?`<p class="note">${esc(n)}：${i+1}位（${taScore}枚）</p>`:''}<button class="btn" data-act="tanext">次の人へ</button><button class="btn sub" data-act="taexit">ふつうのモードにもどる</button><button class="btn sub mini" data-act="taclr">ランキングを消す（係の人用）</button>${REAL}`)};
let allMode='e',allCache=null;
showAll=async function(){modal('<h2>フェスタ全体ランキング</h2><p class="note">読みこみ中…</p>');allCache=null;
  try{const rr=await fetch(TA_FORM.csv+'&_='+Date.now(),{cache:'no-store'});const tx=await rr.text();allCache=tx.trim().split(/\r?\n/).slice(1).map(l=>l.split('","').map(c=>c.replace(/^"|"$/g,''))).map(c=>({ts:c[0]||'',n:c[1]||'',b:c[2]||'',s:+(c[3]||0),e:/やさしい/.test(c[4]||''),mini:/^ミニ/.test(c[4]||'')})).filter(x=>x.s>0&&!x.mini)}catch(x){}
  allMode=rankMode;allShow()};
function allShow(){if(!allCache){modal('<h2>フェスタ全体ランキング</h2><p class="note">読みこめませんでした。電波のよいところで試してね</p><button class="btn" data-act="tanext">もどる</button>');return}
  const r=allCache.filter(x=>modeOf(x)===allMode).sort((a,b)=>b.s-a.s).slice(0,10);
  modal(`<h2>フェスタ全体ランキング</h2>${rankTabs('allm',allMode)}${r.length?`<table class="rk">${r.map((x,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(x.n)}<small>${esc(x.b)}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`:`<p class="note">${MODE_NAME[allMode]}モードの記録はまだないよ</p>`}<button class="btn" data-act="tanext">もどる</button>`)}

/* --- 2. 最初はシンプルに --- */
const early=()=>!S.ta&&S.lv.yagura<2;
function tipOnce(k,title,body){S.tips=S.tips||{};if(S.tips[k]||S.ta||paused)return false;S.tips[k]=1;save();
  modal(`<h2>${title}</h2><p class="lead" style="text-align:left;font-weight:500;line-height:1.7">${body}</p><button class="btn" data-act="close">わかった！</button>`);return true}
updDay=(o=>function(dt){if(!S.ta&&(S.lv.yagura<2||!S.f.mon))return;const was=wasNight;o(dt);if(isNight()&&!was)tipOnce('night','🌙 はじめての夜','夜になると<b>ヒノコと火事が増える</b>よ。<br>そのかわり、ヒノコを倒すと<b>炎の石</b>が多めに出る。家の窓の明かりと赤い矢印をたよりに町を守ろう！')})(updDay);
updTsu=(o=>function(dt){if(early())return;o(dt)})(updTsu);
easyFill=function(){if(!(S.easy||early()))return;if(S.lv.truck&&T.w!=null)T.w=tCap();const L=VEH.ladder;if(S.lv.ladder&&L.w!=null)L.w=LCAP()};
dmAdd=(o=>function(k,v){const before=S.daily&&S.daily.l?S.daily.l.filter(m=>m.done).length:0;o(k,v);const after=S.daily&&S.daily.l?S.daily.l.filter(m=>m.done).length:0;
  if(after>before)setTimeout(()=>tipOnce('daily','📅 今日の任務','<b>今日の任務</b>をひとつ達成したよ！<br>任務は毎日3つかわる。MENUから見られるよ。3つぜんぶ達成すると<b>装備箱</b>がもらえる'),1200)})(dmAdd);
checkBadges=(o=>function(s){const n=o(s);if(n&&!s)setTimeout(()=>tipOnce('badge','🏅 バッジ','はじめての<b>バッジ</b>をゲット！<br>バッジは全部で20種類以上。MENUで集めたバッジを見られるよ'),1500);return n})(checkBadges);

/* --- 6. 軽いモード --- */
resize=(o=>function(){o();if(S&&S.lite&&DPR>1){DPR=1;cv.width=W;cv.height=H}})(resize);
drawNight=(o=>function(t){if(!S.lite)return o(t);const d=nightAmt();if(d<=0)return;cx.save();cx.setTransform(1,0,0,1,0,0);cx.fillStyle=`rgba(14,22,58,${.38*d})`;cx.fillRect(0,0,cv.width,cv.height);cx.restore()})(drawNight);
let fpsAcc=0,fpsN=0,fpsLast=0,fpsT=0;
function fpsCheck(){const now=performance.now();if(fpsLast){const d=now-fpsLast;if(d<500&&!paused){fpsAcc+=d;fpsN++}}fpsLast=now;
  if(fpsN>=240){const avg=fpsAcc/fpsN;fpsAcc=0;fpsN=0;if(avg>34&&!S.lite&&!S.liteAsked&&!paused){S.liteAsked=true;save();
    modal(`<h2>動きが重いみたい</h2><p class="lead">「軽いモード」にすると、動きがなめらかになるかも</p><p class="note">画面が少しあらくなり、夜の明かりがシンプルになります。MENUからいつでも切りかえられます</p><button class="btn" data-act="liteon">軽いモードにする</button><button class="btn sub" data-act="close">このままでいい</button>`)}}}
hud=(o=>function(){o();fpsCheck()})(hud);
update=(o=>function(dt){o(dt);if(S.lite&&parts.length>50)parts.splice(0,parts.length-50)})(update);
function setLite(v){S.lite=v;save();resize();toast(v?'軽いモードにしたよ':'軽いモードをやめたよ','ok')}

/* --- 3. 小型ポンプ操法 --- */
let shKind='pump';
const SH_PUMP=['吸管を防火水そうに投入！','第1線 ホースを3本延長！','第1線 筒先を結合・放水始め！','第2線 ホースを3本延長！','第2線 筒先を結合・放水始め！','2本の筒先で標的を倒せ！'],SH_KOGATA=['小型ポンプを据えて吸管を投入！','ホースを3本延長（1線）！','筒先を結合・エンジン始動！','放水！ 標的を倒せ！'];
function sohoBegin(kind){shKind=kind;SH_STEPS.splice(0,SH_STEPS.length,...(kind==='kogata'?SH_KOGATA:SH_PUMP));sohoStart();const h=document.querySelector('.modal h2');if(h)h.textContent=kind==='kogata'?'小型ポンプ操法':'ポンプ車操法';ga('soho_start',{kind})}

/* --- 5. 一日分団長体験のお知らせ（10月14日まで） --- */
const ICHI_END=new Date(2026,9,14,23,59,59).getTime();
const ichiOn=()=>Date.now()<=ICHI_END;
const ICHI_URL='https://www.city.suita.osaka.jp/anzen/1017917/1017946/1045026.html';
const ICHI=()=>ichiOn()?`<div class="ichi"><b>📣 一日分団長を体験しませんか？</b><span>消防団といっしょに、消防団の車で吹田市内を巡回する体験です</span><span>11月9日（月）〜13日（金）の各日 18:30〜19:30／無料</span><span>吹田市内在住の18〜45歳＋同伴者1人（6〜45歳）／各日 先着1組2人</span><span>申し込みしめきり <b>10月14日（水）23:59</b>（吹田市の電子申込）</span><a class="fb ig" href="${ICHI_URL}" target="_blank" rel="noopener">申し込み・くわしくはこちら</a></div>`:'';
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const h=bx.querySelector('h2');
  const d=document.createElement('div');d.innerHTML=`${ICHI()}<div class="row2"><button class="btn sub" data-act="lite">軽いモード：${S.lite?'ON':'OFF'}</button><button class="btn sub" data-act="kogata">🚒 小型ポンプ操法</button></div>`;if(h)h.after(d)})(menu);
intro=(o=>function(){o();const bx=document.querySelector('.modal .box');if(!bx||!ichiOn())return;const d=document.createElement('div');d.innerHTML=ICHI();bx.appendChild(d)})(intro);

document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='taeasy'){rankMode=taEasy?'e':'n';taIntro()}
  else if(a==='allm'){allMode=b.dataset.v;allShow()}
  else if(a==='lite'){setLite(!S.lite);b.textContent=`軽いモード：${S.lite?'ON':'OFF'}`}
  else if(a==='liteon'){setLite(true);closeModal()}
  else if(a==='kogata'){if((S.rank||0)<1&&!S.ta){toast('班長になると出場できるよ','ng');return}if(S.sohoCD>0){toast(`あと${Math.ceil(S.sohoCD)}秒で出場できる`,'ng');return}closeModal();setTimeout(()=>sohoBegin('kogata'),50)}
  else if(a==='shgo2'){sohoBegin('kogata')}
  else if(a==='shgo1'){sohoBegin('pump')}});

/* --- 4. 計測（Googleアナリティクス） --- */
setHome=(o=>function(n){o(n);ga('select_branch',{branch:homeName()})})(setHome);
taStart=(o=>function(){o();ga('ta_start',{mode:S.easy?'やさしい':'ふつう',branch:homeName()})})(taStart);
rankUp=(o=>function(){o();ga('rank_up',{rank:RANKS[S.rank]})})(rankUp);
levelUp=(o=>function(id){const before=JSON.stringify(S.lv);o(id);if(id==='yagura')ga('yagura_up',{level:S.lv.yagura});else if(id.startsWith('d_')&&!id.startsWith('dlv'))ga('district_open',{district:distName(id)});else if(['truck','amb','ladder','tank'].includes(id))ga('vehicle',{id})})(levelUp);
cprEnd=(o=>function(){const c=cpr;o();if(c)ga('cpr_result',{taps:c.taps.length})})(cprEnd);
goDispatch=(o=>function(k){ga('dispatch',{how:k});o(k)})(goDispatch);

