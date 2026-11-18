/* ===================== モーダル ===================== */
let paused=false;
function modal(html){document.getElementById('modalRoot').innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="box">${html}</div></div>`;paused=true}
function closeModal(){document.getElementById('modalRoot').innerHTML='';paused=false;last=performance.now();if(S&&S.boxes)setTimeout(tryOpenBox,350)}
const INAPP=/Line\/|Instagram|FBAN|FBAV|FB_IAB|Twitter|MicroMessenger|GSA\//i.test(navigator.userAgent);
const WARN=INAPP?`<div class="warn"><b>アプリの中で開いています。</b>画面が動いてしまうときは、右上や右下のメニューから「ブラウザで開く（Safariで開く）」を選ぶと快適に遊べます。</div>`:'';
const LOOP=`<ul class="loop">
<li><span class="n">1</span><span>木に近づく → 自動で切って<b>木材</b>ゲット</span></li>
<li><span class="n">2</span><span>ヒノコに近づく → 放水で倒して<b>炎の石</b>ゲット</span></li>
<li><span class="n">3</span><span>詰所の<b>買取所</b>に運ぶ → <b>コイン</b>に変わる</span></li>
<li><span class="n">4</span><span>光る丸に立つ → コインで<b>斧・ホース・ポンプ車</b>を買って強くなる</span></li>
<li><span class="n">5</span><span><b>出動指令</b>が出たら、合う車両に乗って出動！ 火事はポンプ車か歩きで、救急は救急車、高層ビル火災ははしご車で</span></li>
<li><span class="n">6</span><span>班長になると<b>分団対抗の操法大会</b>に出場できる。部長からは<b>新しい分団</b>を結成でき、<b>路線バス</b>で行き来できる</span></li>
<li><span class="n">7</span><span>はしご車とポンプ車は水を積んだ分しか放水できない。<b>消火栓・防火水槽・川</b>の近くに止めると補給できる</span></li>
<li><span class="n">8</span><span><b>台風</b>が来る前に、川の堤防に<b>土嚢</b>を積んで町を守ろう</span></li>
</ul>`;
function intro(){modal(`<h2>分団サバイバル</h2><p class="lead">消防団になって、町を火事から守ろう！<br>はじめに所属する分団を選んでね</p>${loopShort()}${WARN}<button class="btn" data-act="start">スタート</button><button class="btn sub" data-act="ta">🏆 3分チャレンジ（フェスタ用）</button><p class="note">画面のどこでも、指でなぞると歩きます<br>遊んだら MENU の「感想を送る」から感想を教えてね</p><p class="fic">※このゲームはフィクションです。登場する分団名や、地域で起きる災害の設定は、実際の地域とは関係ありません。</p>`)}
function cont(){modal(`<h2>おかえり！</h2><p class="lead">前回のつづきから遊べます</p><p class="note">コイン ${S.coins}枚・やぐら Lv${S.lv.yagura}・団員 ${S.crew}人</p>${WARN}<button class="btn" data-act="close">つづきから</button><button class="btn sub" data-act="reset">はじめから</button>`)}
function eqHtml(){return `<div class="eqgrid">${Object.keys(EQ).map(k=>`<div class="eqi r${S.eq[k]}"><b>${EQ[k].name}：${RARE[S.eq[k]]}${eqp(k)?'+'+eqp(k):''}</b>${EQ[k].fx[S.eq[k]]||'まだ持っていない'}</div>`).join('')}</div>`}
function rankHtml(){const nx=S.rank<6?`次の「${RANKS[S.rank+1]}」まで 功績あと${RANK_REQ[S.rank+1]-S.merit}`:'最高の階級！';return `<p class="lead">階級：${RANKS[S.rank]}（功績 ${S.merit}）</p><div class="prog"><i style="width:${rankProg()*100}%"></i></div><p class="note">${nx}<br>火を消す・ヒノコを倒す・人を助ける・台風から町を守ると功績がたまる</p>`}
function menu(){modal(`<h2>メニュー</h2><button class="btn sub" data-act="pickhome">所属分団：${homeName()}（変える）</button>${rankHtml()}<div class="row2"><button class="btn sub" data-act="ta">🏆 3分チャレンジ</button><button class="btn sub" data-act="bgm">BGM：${S.bgmOff?'OFF':'ON'}</button><button class="btn sub" data-act="sfx">効果音：${S.muted?'OFF':'ON'}</button></div>${dailyHtml()}${badgeHtml()}<h3 class="sec">装備</h3>${eqHtml()}<details class="how"><summary>遊び方</summary>${LOOP}</details><button class="btn" data-act="close">ゲームにもどる</button><button class="btn sub" data-act="savequit">セーブしてやめる</button><a class="fb" href="https://forms.gle/12nXo4Chy7ChWuWP6" target="_blank" rel="noopener">感想を送る（1分）</a><button class="btn sub" data-act="reset">次の人のために最初からにする</button><p class="fic">※このゲームはフィクションです。登場する分団名や、地域で起きる災害の設定は、実際の地域とは関係ありません。</p>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;audio();
  if(a==='start'){S.started=true;save();closeModal();if(!S.homeSet)pickHome(true)}
  else if(a==='home')setHome(b.dataset.v);
  else if(a==='pickhome')pickHome(false);
  else if(a==='close')closeModal();
  else if(a==='qa')quizAnswer(+b.dataset.i);
  else if(a==='shgo')sohoStart();
  else if(a==='go')goDispatch(b.dataset.v);
  else if(a==='bus')travel(b.dataset.v);
  else if(a==='shtap')sohoTap();
  else if(a==='qhint')quizHint();
  else if(a==='qdone')quizDone();
  else if(a==='savequit'){const ok=save();modal(ok?`<h2>セーブしました</h2><p class="lead">このまま閉じてOK。次に開くと、つづきから遊べます。</p><p class="note">同じスマホ・同じブラウザで開いてね</p><button class="btn" data-act="close">ゲームにもどる</button>`:`<h2>セーブできません</h2><p>このブラウザではセーブが使えない設定になっています。Safariで開くとセーブできます。</p><button class="btn" data-act="close">ゲームにもどる</button>`)}
  else if(a==='reset')resetConfirm();});
document.getElementById('menuBtn').addEventListener('click',()=>{audio();menu()});

