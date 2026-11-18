/* ===================== 🎃 ハロウィン：最初の画面に入口ボタン ＋ GAでハロウィンだけ数える ===================== */
// 最初の画面（はじめて／おかえり）に大きなボタン。モーダルは閉じずに上に重ねるので、もどると元の画面に戻る
let hwSeen=false;
const hwEntryHtml=from=>`<button class="hwgo" data-act="hwgo" data-from="${from}"><span class="hwgoi">🎃</span><span><b>ハロウィン夜回り</b><small>10/31まで・30秒の期間限定ゲーム</small></span><span class="hwgoa">▶</span></button>`;
function hwEntry(from){if(!HW()||S.ta)return;const bx=document.querySelector('.modal .box');if(!bx||bx.querySelector('.hwgo'))return;
  const lead=bx.querySelector('.lead')||bx.querySelector('h2');if(!lead)return;lead.insertAdjacentHTML('afterend',hwEntryHtml(from));
  if(!hwSeen){hwSeen=true;ga('hw_seen',{where:from})}}
intro=(o=>function(){o();hwEntry('intro')})(intro);
cont=(o=>function(){o();hwEntry('cont')})(cont);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=hwgo]');if(!b)return;snd('pick');ga('hw_entry',{from:b.dataset.from||'top'});mgIntro(MG.halloween)});
// MENU の交換所ボタン・ミニゲーム一覧から入った人も数える
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=hwmini],[data-mg=halloween]');if(!b)return;ga('hw_entry',{from:b.dataset.act==='hwmini'?'menu':'hub'})},true);
// ハロウィン夜回りだけの記録（mini_start などは今までどおり全ゲーム共通でも送る）
const isHw=()=>mg&&mg.G===hwGame;
mgStart=(o=>function(G,dk){o(G,dk);if(G===hwGame)ga('hw_mini_start',{diff:MG_DN[dk]})})(mgStart);
mgEnd=(o=>function(){const hw=isHw(),dk=mg&&mg.dk,sc=mg&&mg.score;o();if(hw)ga('hw_mini_finish',{diff:MG_DN[dk],score:sc})})(mgEnd);
mgSave=(o=>function(){const hw=isHw(),was=mg&&mg.saved;o();if(hw&&!was&&mg&&mg.saved)ga('hw_mini_save',{diff:MG_DN[mg.dk],score:mg.score})})(mgSave);
(()=>{const st=document.createElement('style');st.textContent=`
.hwgo{display:flex;align-items:center;gap:10px;width:100%;margin:10px 0 6px;padding:10px 12px;border:0;border-radius:16px;cursor:pointer;text-align:left;font:inherit;color:#fff;
  background:linear-gradient(135deg,#4c1d95,#c2410c);box-shadow:0 4px 0 #2e1065,0 6px 16px rgba(76,29,149,.35);animation:hwgoP 1.6s ease-in-out infinite}
.hwgo:active{transform:translateY(3px);box-shadow:0 1px 0 #2e1065}
.hwgoi{font-size:34px;line-height:1;flex:none}
.hwgo b{display:block;font-family:"Dela Gothic One",sans-serif;font-weight:400;font-size:18px;letter-spacing:.02em;color:#fde68a}
.hwgo small{display:block;font-size:12px;font-weight:700;color:#fed7aa;margin-top:2px}
.hwgoa{margin-left:auto;flex:none;font-size:18px;color:#fde68a}
@keyframes hwgoP{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
@media (prefers-reduced-motion:reduce){.hwgo{animation:none}}`;document.head.appendChild(st)})();

