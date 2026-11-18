/* ===================== HUD ===================== */
let hudKey='';
function hud(){
  const tn=townName()+(nightAmt()>.5?' 🌙':''),te=document.getElementById('hTown');if(te.textContent!==tn)te.textContent=tn;
  const k=[S.coins,carry(),cap(),P.hp,S.muted,S.sand,maxHp(),S.rank,S.merit].join(',');if(k!==hudKey){hudKey=k;setTimeout(hudFit,0);
    document.getElementById('hCoin').textContent=S.coins>=10000?(Math.floor(S.coins/1000)/10)+'万':S.coins;
    document.getElementById('hRank').textContent=RANKS[S.rank];document.getElementById('hRankBar').style.width=(rankProg()*100)+'%';
    document.getElementById('hBag').textContent=S.sand>0?`${S.sand}/${cap()}`:`${carry()}/${cap()}`;document.getElementById('pBag').classList.toggle('sand',S.sand>0);
    document.getElementById('pBag').classList.toggle('full',carry()>=cap());
    document.getElementById('hHeart').innerHTML=maxHp()>5?`<i></i><b class="hpn">${Math.max(0,Math.ceil(P.hp))}/${maxHp()}</b>`:Array.from({length:maxHp()},(_,i)=>`<i class="${i<P.hp?'':'off'}"></i>`).join('');
    document.getElementById('muteBtn').textContent=S.muted?'🔇':'🔊'}
  const rb=document.getElementById('ride');const nk=P.ride?null:nearRide();const show=!!P.ride||!!nk;
  rb.hidden=!show;if(show){const tx=P.ride?`${RIDES[P.ride].name}から降りる`:`${RIDES[nk].name}に乗る`;if(rb.textContent!==tx)rb.textContent=tx;rb.classList.toggle('off',!!P.ride)}
  document.getElementById('hint').hidden=moved||show;
}
document.getElementById('ride').addEventListener('click',()=>{audio();
  if(P.ride){const k=P.ride;unboard();if(k==='truck')toast('ポンプ車はふだんの火事を自動で消しに行きます')}
  else{const k=nearRide();if(k){board(k);toast(RIDE_TIP[k],'ok')}}
  snd('new')});
document.getElementById('zfix').addEventListener('click',()=>{resetZoom();setTimeout(placeZoomBar,400)});
document.getElementById('muteBtn').addEventListener('click',()=>{audio();S.muted=!S.muted;save()});

