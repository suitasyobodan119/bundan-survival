/* ===================== 感想のおねがい ===================== */
const FB_URL='https://forms.gle/12nXo4Chy7ChWuWP6';
const FB_BTN=(t)=>`<a class="fb fbbig" href="${FB_URL}" target="_blank" rel="noopener" data-act="fbsent">${t||'✉️ 感想を送る（1分）'}</a>`;
function fbAsk(){if(S.fbAsked||S.ta||paused)return;S.fbAsked=1;save();ga('fb_prompt',{});
  modal(`<h2>遊んでくれてありがとう！</h2><p class="lead">よかったら、感想を教えてください</p><p class="note">「おもしろかった？」「分かりにくかったところ」など、4つだけ。1分で終わります。<br>いただいた感想で、ゲームをもっと良くしていきます</p>${FB_BTN()}<button class="btn sub" data-act="close">あとで</button>`)}
let playAcc=0;
update=(o=>function(dt){o(dt);if(S.ta)return;playAcc+=dt;if(playAcc>5){S.playT=(S.playT||0)+playAcc;playAcc=0;if(S.playT>600&&!S.fbAsked)fbAsk()}})(update);
taSave=(o=>function(){o();const bx=document.querySelector('.modal .box');if(!bx)return;const d=document.createElement('div');d.innerHTML=`<p class="note" style="margin:6px 0 0">遊んだ感想をきかせてね</p>${FB_BTN()}`;const nx=bx.querySelector('[data-act=tanext]');if(nx)bx.insertBefore(d,nx);else bx.appendChild(d)})(taSave);
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const h=bx.querySelector('h2');const d=document.createElement('div');d.innerHTML=FB_BTN('✉️ 感想を送る（1分）・ゲームを良くするために教えてね');if(h)h.after(d)})(menu);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=fbsent]');if(!b)return;S.fbAsked=1;S.fbSent=(S.fbSent||0)+1;save();ga('fb_open',{})});

