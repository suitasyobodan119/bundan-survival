/* ===================== ストーリー「分団の1年」（7章＋エンディング） ===================== */
// 章ごとに3つ前後の課題。ぜんぶ達成すると団長・先輩のセリフとごほうび → 次の章。最終章をクリアするとエンディング（出初式）
const CAST={dancho:{name:'団長',img:'img/dancho.webp'},senpai:{name:'さくら先輩',img:'img/senpai.webp'},me:{name:'きみ',img:'img/shinjin.webp'}};
const stN=k=>(S.st&&S.st[k])||0;
const CHAPTERS=[
  {t:'入団',ic:'🔰',who:'dancho',
   intro:['{home}分団へようこそ！ 今日からきみも消防団員だ','消防団は、ふだんは仕事や学校がある町の人たちが、火事や災害のときに集まって町を守るチームなんだ','まずは町に慣れよう。木を切って詰所の「買取所」に運べば、活動のコインになるぞ'],
   goals:[{t:'木材を売ってコインにする',ok:()=>!!S.f.sold,h:'木に近づくと自動で切れる。買取所の丸に運ぼう'},{t:'火事を1件消す',n:()=>stN('ext'),need:1,h:'燃えている家に近づくと放水するよ'},{t:'ヒノコを5匹たおす',n:()=>stN('kill'),need:5,h:'ヒノコに近づくと放水で倒せる'}],
   clear:['よくやった！ もう立派な団員の仲間入りだ','次は「ポンプ車」だ。さくら先輩が教えてくれるぞ']},
  {t:'はじめての出動',ic:'🚒',who:'senpai',
   intro:['さくらです、よろしくね！ 消防団にもポンプ車があるんだよ','ポンプ車があれば、遠くの火事にもすぐ行けるし、水もいっぱい出せる。コインをためて配備しよう！'],
   goals:[{t:'ポンプ車を配備する',ok:()=>S.lv.truck>=1,h:'詰所の光る丸でコインを払おう'},{t:'火事を10件消す',n:()=>stN('ext'),need:10,h:'ポンプ車に乗ると強い放水ができる'},{t:'団員を2人にふやす',n:()=>S.crew||0,need:2,h:'「団員をふやす」の丸で仲間を呼べる'}],
   clear:['ナイス出動！ 仲間もふえて、分団らしくなってきたね','消防団は訓練も大事。次は「操法」に挑戦だよ']},
  {t:'訓練の日々',ic:'🏋️',who:'senpai',
   intro:['「操法」っていうのは、ポンプ車やホースを、決められた順番で、速く正確にあつかう訓練のこと','本番の火事であわてないように、消防団はふだんから練習しているんだ。班長になったら操法大会に出られるよ'],
   goals:[{t:'班長に昇進する',n:()=>S.rank||0,need:1,h:'火事を消したりヒノコを倒すと「功績」がたまる'},{t:'操法大会に出る',n:()=>stN('n_soho'),need:1,h:'詰所の「操法大会」の丸に立とう'},{t:'人を3人助ける',n:()=>stN('rescue'),need:3,h:'地震や浸水・救急のときに助けられる'}],
   clear:['いい動きだったよ！ 訓練の成果が出てるね','ここからは大きな災害にもそなえよう。団長の話を聞いて！']},
  {t:'災害にそなえる',ic:'🌀',who:'dancho',
   intro:['消防団の仕事は火事だけじゃない。台風や大雨、地震のときにも町の人を守るんだ','台風が来たら、土のうを積んで、お年寄りや子どもを避難所へ案内しよう'],
   goals:[{t:'台風をのりきる',n:()=>S.tyN||0,need:1,h:'台風の予報が出たら、土のうと避難誘導の準備を'},{t:'避難所へ3人案内する',n:()=>stN('evac'),need:3,h:'台風のとき、逃げおくれた人を避難所へ'},{t:'部長に昇進する',n:()=>S.rank||0,need:2,h:'出動や救助で功績をためよう'}],
   clear:['りっぱな防災活動だった。町の人も安心しているぞ','いよいよ操法大会の本番だ。金メダルをねらえ！']},
  {t:'操法大会',ic:'🥇',who:'senpai',
   intro:['操法大会は、分団どうしで操法の速さと正確さをきそう大会だよ','わたしたちも本番に向けて特訓してきた。いっしょに金メダルをとろう！'],
   goals:[{t:'操法大会で金メダルをとる',n:()=>stN('sohog'),need:1,h:'順番どおり、すばやくタップ！'},{t:'今日の任務をぜんぶ達成する',n:()=>stN('dailyall'),need:1,h:'MENUの「今日の任務」を3つクリア'}],
   clear:['やったー！ 金メダル！！ 練習してきてよかったね','次は町全体を守る番だよ。ほかの分団の仲間をふやそう']},
  {t:'吹田の仲間',ic:'🤝',who:'dancho',
   intro:['町はひとつの分団だけでは守りきれない。となりの分団と力を合わせるのが消防団だ','高い建物の火事には「はしご車」も必要になる。仲間と装備をそろえよう'],
   goals:[{t:'2つめの分団を結成する',n:()=>openD().length,need:1,h:'火の見やぐらLv5・部長になると、町のはしの丸が開く'},{t:'はしご車を配備する',ok:()=>!!S.lv.ladder,h:'部長になると詰所で配備できる'},{t:'高層ビル火災を消す',n:()=>stN('hr'),need:1,h:'はしご車に乗って出動しよう'}],
   clear:['みごとな連携だった。吹田の町がひとつになってきたな','さあ、1年のしめくくり。新年の「出初式」だ！']},
  {t:'出初式',ic:'🎍',who:'dancho',last:true,
   intro:['「出初式」は、新しい年のはじめに、消防の仲間が集まって、1年の安全をちかう式なんだ','ポンプ車の点検や放水で、町の人に元気な姿を見せる。最後の仕上げだ、がんばれ！'],
   goals:[{t:'副分団長に昇進する',n:()=>S.rank||0,need:3,h:'出動・救助・操法でどんどん功績をためよう'},{t:'バッジを12個あつめる',n:()=>(S.badges||[]).length,need:12,h:'MENUのバッジ一覧を見てみよう'}],
   clear:['1年間、本当によくがんばった！ きみはもう、町にとってなくてはならない消防団員だ']}];
const chGoalDone=g=>{try{return g.ok?!!g.ok():g.n()>=g.need}catch(e){return false}};
const chCur=()=>CHAPTERS[(S.ch||1)-1];
const chDone=()=>(S.ch||1)>CHAPTERS.length;
// 「操法大会に出た回数」などを数えておく（今日の任務と同じタイミング）
dmAdd=(o=>function(k,v){if(S&&S.started&&!S.ta)S.st['n_'+k]=(S.st['n_'+k]||0)+(v||1);return o(k,v)})(dmAdd);
BADGES.push(['story','🎍','ストーリークリア（出初式）',()=>(S.ch||1)>CHAPTERS.length]);

// セリフ画面
const say=(who,txt)=>{const c=CAST[who]||CAST.dancho;return `<div class="say"><img class="sayimg" src="${c.img}" alt="" width="72" height="72"><div class="saybody"><b>${c.name}</b><p>${txt.replace('{home}',S.home||'吹三')}</p></div></div>`};
let chQ=null;
function chTalk(lines,who,title,after,extra,btn){chQ={lines,who,title,after,extra,btn,i:0};chTalkShow()}
function chTalkShow(){const q=chQ,last=q.i>=q.lines.length-1;
  modal(`<p class="chlabel">${q.title}</p>${say(q.who,q.lines[q.i])}${last&&q.extra?q.extra:''}<button class="btn" data-act="chnext">${last?(q.btn||'がんばる！'):'つぎへ ▶'}</button><p class="chdots">${q.lines.map((_,i)=>i===q.i?'●':'○').join(' ')}</p>`);snd('pick')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='chnext'&&chQ){if(chQ.i<chQ.lines.length-1){chQ.i++;chTalkShow()}else{const f=chQ.after;chQ=null;closeModal();if(f)f()}}
  else if(a==='chstory'){closeModal();chStoryList()}
  else if(a==='chend'){closeModal();chEnding(true)}});
function chGoalsHtml(ch,mini){return `<div class="chgoals">${ch.goals.map(g=>{const d=chGoalDone(g),p=g.ok?(d?1:0):Math.min(1,g.n()/g.need);
  return `<div class="chg ${d?'done':''}"><span>${d?'✅':'⬜'} ${g.t}${!g.ok&&g.need>1?` <small>${Math.min(g.n(),g.need)}/${g.need}</small>`:''}</span>${mini||d?'':`<small class="chh">${g.h}</small>`}${d||g.ok?'':`<div class="prog"><i style="width:${p*100}%"></i></div>`}</div>`}).join('')}</div>`}
function chCardHtml(mini){if(chDone())return `<div class="chcard done"><b>🎍 ストーリークリア！</b><small>ここからは団長をめざそう</small><button class="btn sub" data-act="chend">エンディングをもう一度見る</button></div>`;
  const ch=chCur(),n=S.ch||1;return `<div class="chcard"><b>${ch.ic} 第${n}章「${ch.t}」 <small>${n}/${CHAPTERS.length}</small></b>${chGoalsHtml(ch,mini)}${mini?'':'<button class="btn sub" data-act="chstory">これまでのお話</button>'}</div>`}
function chStoryList(){const n=Math.min(S.ch||1,CHAPTERS.length);
  modal(`<h2>📖 分団の1年</h2>${CHAPTERS.slice(0,n).map((c,i)=>`<details class="how"><summary>${c.ic} 第${i+1}章「${c.t}」${i+1<(S.ch||1)?' ✅':''}</summary>${c.intro.map(l=>say(c.who,l)).join('')}${i+1<(S.ch||1)?c.clear.map(l=>say(c.who,l)).join(''):''}</details>`).join('')}${CHAPTERS.length>n?`<p class="note">あと${CHAPTERS.length-n}章。つづきは課題をクリアすると読めるよ</p>`:''}<button class="btn" data-act="close">ゲームにもどる</button>`)}
// 章のはじまり・クリア
function chStart(){const ch=chCur(),n=S.ch;S.chSeen=n;save();ga('chapter_start',{ch:n});
  chTalk(ch.intro,ch.who,`${ch.ic} 第${n}章「${ch.t}」`,()=>{pop(`第${n}章「${ch.t}」`,'MENUで課題を確認できるよ');snd('new')},chGoalsHtml(ch,true))}
function chClear(){const ch=chCur(),n=S.ch,c=(n===CHAPTERS.length?300:60*n)*yl();S.ch=n+1;save();ga('chapter_clear',{ch:n});
  chTalk(ch.clear,ch.who,`${ch.ic} 第${n}章「${ch.t}」クリア！`,()=>{drop('coin',P.x,P.y,c);addMerit(5);snd('buy');burst(P.x,P.y-30,'#ffd84a',36);toast(`第${n}章クリア！ ごほうび ${c}コイン`,'ok');if(ch.last)setTimeout(()=>chEnding(false),900);else giveBox(`第${n}章クリア`)},`<div class="chreward">🎁 ごほうび：${c}コイン${ch.last?'':'＋装備箱'}</div>`,ch.last?'エンディングへ':'つぎの章へ')}
function chEnding(again){if(!again)ga('story_clear',{});
  modal(`<div class="endart"><img src="img/ending.webp" alt="出初式で一斉放水する消防団"></div><h2>🎍 出初式</h2>
  <p class="lead">新しい年の出初式。<br>ポンプ車の放水が、青い空にアーチをえがいた</p>${say('dancho','分団の1年、おつかれさま。きみのおかげで、町は今年も安心だ')}${say('senpai','また一緒に出動しようね！ これからも、よろしく！')}
  <div class="endmsg">ほんものの消防団も、ふだんは仕事や学校がある町の人たちが活動しています。<br>吹田市消防団の活動は Instagram で見られるよ</div>
  <a class="fb ig" href="${IG_URL}" target="_blank" rel="noopener">📷 吹田市消防団のInstagramを見る</a>
  ${navigator.share?'<button class="btn sub" data-act="chshare">🎉 クリアを友だちに知らせる</button>':''}
  <button class="btn" data-act="close">このまま遊ぶ（団長をめざそう）</button>
  <p class="credit">分団サバイバル　制作：吹田市消防団 広報チーム<br>※このゲームはフィクションです</p>`);snd('buy')}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act=chshare]');if(!b)return;try{await navigator.share({title:'分団サバイバル',text:'消防団ゲーム「分団サバイバル」のストーリーをクリアした！ 🎍',url:'https://suitasyobodan119.github.io/bundan-survival/?utm_source=share&utm_medium=clear'});ga('story_share',{})}catch(x){}});
// いつ話しかけるか：ゲーム中で、ほかの画面・出動がないとき
let chT=0,chToast={};
update=(o=>function(dt){o(dt);if(!S.started||S.ta||!S.homeSet)return;chT+=dt;if(chT<1)return;chT=0;
  if(S.ch==null){let n=1;while(n<=CHAPTERS.length&&CHAPTERS[n-1].goals.every(chGoalDone))n++;S.ch=n;S.chSeen=0;save();
    if(n>1&&S.earned>0)setTimeout(()=>pop(n>CHAPTERS.length?'ストーリーはクリア済み！':`ストーリー「分団の1年」第${n}章から`,'これまでの活躍がしっかり記録されているよ'),1500)}
  if(chDone())return;const ov=id=>{const el=document.getElementById(id);return !!el&&!el.hidden};const busy=!!document.querySelector('.modal')||ov('mg')||ov('hk')||alarmOn();
  const ch=chCur();
  ch.goals.forEach((g,i)=>{const k=S.ch+'-'+i;if(chToast[k]==null){chToast[k]=chGoalDone(g);return}if(!chToast[k]&&chGoalDone(g)){chToast[k]=true;toast(`📖 課題クリア「${g.t}」`,'ok');snd('new')}});
  if(busy)return;
  if(S.chSeen!==S.ch){if((S.earned||0)>0||S.ch>1||S.chIntroT>4)chStart();else S.chIntroT=(S.chIntroT||0)+1;return}
  if(ch.goals.every(chGoalDone))chClear()})(update);
// メニューと「おかえり」画面に今の章を出す
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const anchor=bx.querySelector('.hwshop')||bx.querySelector('h2');if(anchor)anchor.insertAdjacentHTML('afterend',chCardHtml(false))})(menu);
cont=(o=>function(){o();if(S.ch==null||chDone())return;const bx=document.querySelector('.modal .box'),btn=bx&&bx.querySelector('[data-act=close]');if(btn)btn.insertAdjacentHTML('beforebegin',chCardHtml(true))})(cont);
(()=>{const st=document.createElement('style');st.textContent=`
.say{display:flex;gap:10px;align-items:flex-start;text-align:left;margin:10px 0}
.sayimg{flex:none;width:72px;height:72px;border-radius:50%;background:linear-gradient(160deg,#ffe7c2,#ffd0a8);object-fit:cover;object-position:50% 12%;box-shadow:0 0 0 3px #fff,0 0 0 5px #e5432a}
.saybody{position:relative;flex:1;background:#f4f6fa;border-radius:14px;padding:8px 12px}
.saybody:before{content:'';position:absolute;left:-8px;top:22px;border:8px solid transparent;border-right-color:#f4f6fa;border-left:0}
.saybody b{display:block;font-size:12px;color:#e5432a}.saybody p{margin:2px 0 0;font-size:15px;line-height:1.65;color:#1b2740;font-weight:700}
.chlabel{margin:0 0 2px;font-family:"Dela Gothic One",sans-serif;font-size:18px;color:#22355c}
.chdots{margin:6px 0 0;font-size:10px;color:#9aa3b2;letter-spacing:2px}
.chcard{background:#fff8ec;border:2px solid #f3b648;border-radius:14px;padding:8px 10px;margin:8px 0;text-align:left}
.chcard>b{display:block;font-size:14px;color:#7a4a00}.chcard>b small{float:right;color:#b07b1a;font-size:12px}
.chcard.done{background:#eef9f0;border-color:#5aa469}.chcard.done>small{display:block;font-size:12px;color:#2f7a40}
.chgoals{margin-top:4px}.chg{padding:4px 0;border-top:1px dashed #f0d9a8;font-size:13px;font-weight:700;color:#33415e}.chg:first-child{border-top:0}
.chg.done{color:#2f7a40}.chg small{font-weight:700;color:#8a6a2a}.chg .chh{display:block;font-size:11px;color:#8a8f99;font-weight:500;margin-top:1px}
.chg .prog{height:5px;margin-top:3px}
.chreward{margin:6px 0;padding:8px;border-radius:12px;background:#fff4d6;font-weight:800;color:#8a5a00}
.endart{flex:none;margin:-6px -4px 0;border-radius:14px;overflow:hidden;aspect-ratio:4/3;background:#9fd3ff}.endart img{width:100%;height:100%;object-fit:cover;display:block}
.endmsg{font-size:13px;line-height:1.7;color:#33415e;background:#eef6ff;border-radius:12px;padding:8px 10px;margin:8px 0}
.credit{font-size:11px;color:#8a8f99;line-height:1.6;margin:8px 0 0}`;document.head.appendChild(st)})();
