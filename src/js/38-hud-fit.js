/* ===================== 上の段（コイン・荷物・体力・MENU）を画面に収める ===================== */
function hudFit(){const r=document.querySelector('#hud .row');if(!r)return;r.classList.remove('t1','t2','t3');
  for(const c of ['t1','t2','t3']){if(r.scrollWidth<=r.clientWidth+1)break;r.classList.add(c)}}
addEventListener('resize',()=>setTimeout(hudFit,50));if(document.fonts&&document.fonts.ready)document.fonts.ready.then(hudFit);setTimeout(hudFit,1500);

