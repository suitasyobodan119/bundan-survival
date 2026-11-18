/* ===================== 3つのクイズにいつでも挑戦 ===================== */
const QSETS={kyukyu:{name:'救急救命クイズ',short:'救急救命',ic:'🚑',url:'https://suitasyobodan119.github.io/suita-quiz/'},
  sonae:{name:'備えクイズ（地震）',short:'備え（地震）',ic:'🏠',url:'https://suitasyobodan119.github.io/suita-quiz/sonae.html'},
  nyudan:{name:'消防団って何？クイズ',short:'消防団って何？',ic:'🚒',url:'https://suitasyobodan119.github.io/suita-quiz/nyudan.html'}};
let qsetOn=null;
function qsetStart(bank){const Q=QSETS[bank];qsetOn={bank,i:0,ok:0,n:5};ga('quiz_start',{bank});qsetNext()}
function qsetNext(){const s=qsetOn,Q=QSETS[s.bank];
  quiz(s.bank,`${Q.ic} ${Q.name}`,`${s.i+1}問目 / ${s.n}問（いま ${s.ok}問正解）`,false,ok=>{if(ok)s.ok++;s.i++;if(s.i<s.n)setTimeout(qsetNext,60);else setTimeout(qsetEnd,60)})}
function qsetEnd(){const s=qsetOn;qsetOn=null;const Q=QSETS[s.bank],perfect=s.ok===s.n;
  S.st['q_'+s.bank]=Math.max(S.st['q_'+s.bank]||0,s.ok);stAdd('quiz');
  const c=S.ta?0:s.ok*3*yl();if(c)drop('coin',P.x,P.y,c);if(perfect&&!S.ta)addMerit(3);ga('quiz_end',{bank:s.bank,score:s.ok});
  modal(`<h2>${Q.ic} ${Q.name}</h2><div class="medal r${perfect?3:s.ok>=3?2:s.ok>=1?1:0}">${s.ok}/${s.n}問</div><p class="lead">${perfect?'全問正解！ すごい！':s.ok>=3?'よくできました！':'もう一回チャレンジしてみよう'}</p>${c?`<p class="note">ごほうび コイン${c}枚</p>`:''}
  <a class="fb fbbig" href="${Q.url}" target="_blank" rel="noopener">⏱ 本番のスピードクイズ（全10問）に挑戦</a><button class="btn" data-act="qsagain" data-v="${s.bank}">もう一回（5問）</button><button class="btn sub" data-act="close">ゲームにもどる</button>`)}
const QSET_ROW=()=>`<h3 class="sec">クイズに挑戦 <small>5問ずつ・正解でコイン</small></h3><div class="qsrow">${Object.entries(QSETS).map(([k,q])=>`<button class="btn sub" data-act="qset" data-v="${k}"><span>${q.ic}</span><b>${q.short}</b><small>クイズ</small></button>`).join('')}</div>`;
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;
  const h=[...bx.querySelectorAll('h3.sec')].find(x=>x.textContent.includes('ミニゲーム'));const d=document.createElement('div');d.innerHTML=QSET_ROW();
  if(h&&h.nextElementSibling)h.nextElementSibling.after(d);else bx.appendChild(d)})(menu);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='qset'||a==='qsagain'){closeModal();setTimeout(()=>qsetStart(b.dataset.v),60)}});
BADGES.push(['quizall','🎓','クイズ博士（3種類とも5問全問正解）',()=>['kyukyu','sonae','nyudan'].every(k=>(S.st['q_'+k]||0)>=5)]);

