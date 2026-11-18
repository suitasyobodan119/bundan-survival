/* ===================== 「最初からにする」の確認と、元にもどす ===================== */
const BK_KEY=KEY+'-backup';
function resetConfirm(){const yl0=S.lv.yagura;
  modal(`<h2>最初からにする？</h2><p class="lead">いまのデータが消えて、最初からになります</p><div class="tsucard"><b>いまのデータ</b>${homeName()}・${RANKS[S.rank||0]}／コイン ${S.coins}枚／火の見やぐら Lv${yl0}／バッジ ${(S.badges||[]).length}個</div>
  <button class="btn" data-act="close">やめる（ゲームにもどる）</button><button class="btn sub danger" id="resetGo" data-act="resetgo" disabled>あと2秒…</button><p class="note">まちがえて消しても、MENUの「前のデータにもどす」で元にもどせます（この端末で、次に最初からにするまで）</p>`);
  let n=2;const t=setInterval(()=>{const b=document.getElementById('resetGo');if(!b){clearInterval(t);return}n--;if(n<=0){clearInterval(t);b.disabled=false;b.textContent='最初からにする'}else b.textContent=`あと${n}秒…`},1000)}
function resetDo(){try{if(!S.ta&&S.earned>0)localStorage.setItem(BK_KEY,JSON.stringify({at:Date.now(),S}))}catch(x){}
  const uz=S.uz,mu=S.muted,hm=S.home,hs=S.homeSet,hn=S.han;S=fresh();S.uz=uz;S.muted=mu;S.home=hm;S.homeSet=hs;S.han=hn;S.started=true;resetWorld();save();closeModal();pop('スタート！','木に近づいてみよう');ga('reset',{})}
function backup(){try{return JSON.parse(localStorage.getItem(BK_KEY))}catch(x){return null}}
function restoreDo(){const b=backup();if(!b||!b.S)return;try{localStorage.removeItem(BK_KEY)}catch(x){}S=b.S;resetWorld();save();closeModal();hudKey='';pop('前のデータにもどしたよ',`コイン ${S.coins}枚・やぐら Lv${S.lv.yagura}`)}
menu=(o=>function(){o();if(S.ta)return;const b=backup();if(!b||!b.S)return;const bx=document.querySelector('.modal .box');if(!bx)return;const rs=bx.querySelector('[data-act=reset]');const d=new Date(b.at);
  const el=document.createElement('div');el.innerHTML=`<button class="btn sub" data-act="restore">前のデータにもどす（${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}・コイン${b.S.coins}枚）</button>`;if(rs)rs.before(el);else bx.appendChild(el)})(menu);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='resetask')resetConfirm();else if(a==='resetgo'){if(!b.disabled)resetDo()}else if(a==='restore')restoreDo()});

