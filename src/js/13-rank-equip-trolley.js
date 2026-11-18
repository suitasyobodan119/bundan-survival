/* ===================== 階級・装備・トロッコ ===================== */
const RANKS=['団員','班長','部長','副分団長','分団長','副団長','団長'];
const RANK_REQ=[0,30,100,220,400,650,1000,1e9];
const rankProg=()=>S.rank>=6?1:clamp((S.merit-RANK_REQ[S.rank])/(RANK_REQ[S.rank+1]-RANK_REQ[S.rank]),0,1);
function addMerit(n){if(!n)return;S.merit=(S.merit||0)+n;while(S.rank<6&&S.merit>=RANK_REQ[S.rank+1]){S.rank++;rankUp()}}
function rankUp(){snd('buy');buzz([40,40,80]);burst(P.x,P.y-30,'#f3b648',40);
  pop(`昇進！ ${RANKS[S.rank]}になった`,'ごほうびの装備箱をもらった');const rk=RANKS[S.rank];setTimeout(()=>{quiz('nyudan','消防団まめちしき',`${rk}になったきみに問題！ 正解でコインのごほうび`,false,ok=>{if(ok){const c=10*yl();drop('coin',P.x,P.y,c)}});giveBox(`${rk}への昇進祝い`)},1600)}
const EQ={helmet:{name:'ヘルメット',fx:['','体力 +1','体力 +2','体力 +3']},coat:{name:'防火衣',fx:['','放水の強さ +15%','放水の強さ +30%','放水の強さ +50%']},
  boots:{name:'長靴',fx:['','歩く速さ +8%','歩く速さ +15%','歩く速さ +25%']},nozzle:{name:'筒先',fx:['','放水が届く距離 +10','放水が届く距離 +20','放水が届く距離 +35']}};
const RARE=['なし','銅','銀','金'];
const HELM=['#e8ecf2','#c98a4b','#dfe5ec','#f3c24a'],STRIPE=['#f3e05a','#e9a86a','#ffffff','#ffd84a'],BOOT=['#2b2f3a','#7a4a22','#7d8796','#b8860b'];
let boxReason=[];
function giveBox(reason){S.boxes=(S.boxes||0)+1;boxReason.push(reason||'');tryOpenBox()}
function tryOpenBox(){if(paused||!S.boxes)return;S.boxes--;openBox(boxReason.shift()||'')}
function openBox(reason){
  const slots=Object.keys(EQ),slot=slots[Math.floor(Math.random()*slots.length)],r=Math.random(),rare=r<.12?3:r<.42?2:1;
  const cur=S.eq[slot];let res;
  if(rare>cur){S.eq[slot]=rare;if(slot==='helmet')P.hp=maxHp();res=`<p class="lead">${EQ[slot].fx[rare]}</p><p class="note">キャラクターの見た目も変わったよ</p>`}
  else{const c=Math.max([0,10,25,60][rare]*yl(),reason==='装備屋で買った'?Math.round(Math.min(500,60+30*Math.max(0,(S.boxN||1)-1))*.5):0);S.coins+=c;S.earned+=c;res=`<p class="lead">もう同じか、もっと良い物を持っているので<br>コイン ${c}枚にかえた</p>`}
  modal(`<h2>装備箱</h2><p class="note">${reason}</p><div class="medal r0 shake" id="boxMedal">開けるよ…</div><div id="boxRes" hidden><p class="lead" style="font-size:20px">${RARE[rare]}の${EQ[slot].name}！</p>${res}</div><button class="btn" data-act="close" id="boxOk" hidden>やったね！</button>`);
  snd('new');
  setTimeout(()=>{const m=document.getElementById('boxMedal');if(!m)return;m.className='medal r'+rare+' shake';m.innerHTML=`${RARE[rare]}の<br>${EQ[slot].name}`;document.getElementById('boxRes').hidden=false;document.getElementById('boxOk').hidden=false;snd(rare===3?'buy':'coin');if(rare===3)buzz([60,40,60])},900);
}
const RAILS=[
  {need:2,st:{x:40,y:470},pad:{x:40,y:520}},
  {need:3,st:{x:-470,y:130},pad:{x:-470,y:180}},
  {need:4,st:{x:470,y:130},pad:{x:470,y:180}},
];
const TERM={x:40,y:130};
const carts=RAILS.map(()=>({pos:0,st:'load',t:0,w:0,s:0}));
const builtRails=()=>RAILS.slice(0,S.lv.rail||0);
function nearestDeposit(x,y){const sell=PADMAP.sell;let b={x:sell.x,y:sell.y},bd=dist(x,y,sell.x,sell.y);
  builtRails().forEach((r,i)=>{const d=dist(x,y,r.st.x,r.st.y);if(d<bd){bd=d;b={x:r.st.x,y:r.st.y,line:i}}});
  for(const d of openD()){const dd=dist(x,y,d.sell.x,d.sell.y);if(dd<bd){bd=dd;b={x:d.sell.x,y:d.sell.y,dsell:d.id}}}return b}
let railT=0;
function updRail(dt){
  railT+=dt;
  builtRails().forEach((r,i)=>{
    const st=S.rs[i],c=carts[i],len=dist(r.st.x,r.st.y,TERM.x,TERM.y),sp=170;
    if(railT>.045&&!P.ride&&dist(P.x,P.y,r.st.x,r.st.y)<38&&carry()>0){const k=S.stone>0?'stone':'wood';S[k]--;st[k==='stone'?'s':'w']++;fly(k,P.x,P.y-34,r.st.x,r.st.y-10);snd('pick');if(!S.f.rail){S.f.rail=true;toast('トロッコが詰所まで運んで、コインにしてくれる','ok')}}
    if(c.st==='load'){c.pos=0;if(st.w+st.s>0){c.t+=dt;if(c.t>.5){c.t=0;const tw=Math.min(st.w,40),ts=Math.min(st.s,40-tw);st.w-=tw;st.s-=ts;c.w=tw;c.s=ts;c.st='go'}}}
    else if(c.st==='go'){c.pos+=sp*dt/len;if(c.pos>=1){c.pos=1;const v=(c.w+c.s*3)*MULT[S.lv.price];S.pile+=v;S.earned+=v;float(PILE.x,PILE.y-24,'+'+Math.floor(v),'#f3b648',15);snd('coin');c.w=c.s=0;c.st='back'}}
    else{c.pos-=sp*dt/len;if(c.pos<=0){c.pos=0;c.st='load'}}
  });
  if(railT>.045)railT=0;
}
function cartXY(i){const r=RAILS[i],c=carts[i];return{x:r.st.x+(TERM.x-r.st.x)*c.pos,y:r.st.y+(TERM.y-r.st.y)*c.pos}}
function drawRails(t){
  const br=builtRails();if(!br.length)return;
  for(const r of br){const dx=TERM.x-r.st.x,dy=TERM.y-r.st.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
    cx.strokeStyle='#8a6a44';cx.lineWidth=4;cx.beginPath();for(let d=0;d<L;d+=16){const x=r.st.x+ux*d,y=r.st.y+uy*d;cx.moveTo(x-nx*9,y-ny*9);cx.lineTo(x+nx*9,y+ny*9)}cx.stroke();
    cx.strokeStyle='#7d8796';cx.lineWidth=2.5;cx.beginPath();for(const o of[-6,6]){cx.moveTo(r.st.x+nx*o,r.st.y+ny*o);cx.lineTo(TERM.x+nx*o,TERM.y+ny*o)}cx.stroke();
    const s=r.st;shadow(s.x,s.y+14,40,8);cx.fillStyle='#c9b08c';cx.fillRect(s.x-34,s.y-6,68,20);cx.fillStyle='#5b6f8f';cx.fillRect(s.x-38,s.y-30,76,8);cx.fillStyle='#6b4a30';cx.fillRect(s.x-34,s.y-22,4,18);cx.fillRect(s.x+30,s.y-22,4,18);
    const i=RAILS.indexOf(r),st=S.rs[i],n=Math.min(12,Math.ceil((st.w+st.s)/4));for(let k=0;k<n;k++)icon(k%3===2&&st.s?'stone':'wood',s.x-24+(k%6)*9,s.y+8-Math.floor(k/6)*6,.55);
    const on=dist(P.x,P.y,s.x,s.y)<38;cx.strokeStyle=on?'#f3b648':'#2f78b8';cx.lineWidth=2.5;cx.setLineDash([6,5]);cx.beginPath();cx.arc(s.x,s.y+4,40,0,7);cx.stroke();cx.setLineDash([]);
    label('トロッコ駅',s.x,s.y-44,12,'#fff','#2f78b8');if(st.w+st.s)label(String(st.w+st.s),s.x+44,s.y-30,10,'#fff','#8a6a44')}
  cx.fillStyle='#6b4a30';cx.fillRect(TERM.x-16,TERM.y-14,32,10);cx.fillStyle='#8a6a44';cx.fillRect(TERM.x-12,TERM.y-22,24,8);
}
function drawCart(i,t){const {x,y}=cartXY(i),c=carts[i];shadow(x,y+3,14,4);
  cx.fillStyle='#23262e';cx.beginPath();cx.arc(x-8,y,3.5,0,7);cx.arc(x+8,y,3.5,0,7);cx.fill();
  cx.fillStyle='#5b6f8f';cx.beginPath();cx.moveTo(x-14,y-16);cx.lineTo(x+14,y-16);cx.lineTo(x+11,y-2);cx.lineTo(x-11,y-2);cx.closePath();cx.fill();cx.fillStyle='#e5432a';cx.fillRect(x-14,y-18,28,3);
  if(c.w+c.s){for(let k=0;k<4;k++)icon(k===3&&c.s?'stone':'wood',x-9+k*6,y-19-(k%2)*3,.5)}}

