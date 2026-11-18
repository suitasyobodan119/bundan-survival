/* ===================== 団員 ===================== */
function addWorker(x,y,home){workers.push({x,y,st:'seek',tg:null,wood:0,t:0,face:1,home:home||null})}
function updWorker(w,dt){
  const sp=95,sell=PADMAP.sell;
  const move=(tx,ty,r)=>{const d=dist(w.x,w.y,tx,ty);if(d<(r||22))return true;w.x+=(tx-w.x)/d*sp*dt;w.y+=(ty-w.y)/d*sp*dt;w.face=tx>w.x?1:-1;return false};
  if(w.st==='seek'){
    if(!w.tg||w.tg.st!=='up'){let b=null,bd=1e9;for(const tr of trees){if(tr.st!=='up'||tr.fire||!active(tr))continue;const taken=workers.some(o=>o!==w&&o.tg===tr);const d=dist(w.x,w.y,tr.x,tr.y)+(taken?400:0);if(d<bd){bd=d;b=tr}}w.tg=b}
    if(!w.tg)return;if(move(w.tg.x,w.tg.y+6,24)){w.st='chop';w.t=0}
  }else if(w.st==='chop'){
    w.t+=dt;if(w.t>.9/(1+.35*wLv(w))){w.t=0;const tr=w.tg;if(tr&&tr.st==='up'){tr.hp--;tr.shake=.15;chips(tr.x,tr.y-14);if(tr.hp<=0){tr.st='stump';tr.t=20;w.wood+=2}}
      if(!tr||tr.st!=='up')w.st=w.wood>=6?'ret':'seek'}
  }else{
    if(!w.dep)w.dep=nearestDeposit(w.x,w.y);const dp=w.dep;
    if(move(dp.x,dp.y,26)){if(dp.line!=null){S.rs[dp.line].w+=w.wood;float(dp.x,dp.y-30,'+'+w.wood,'#d9a46e',12)}else if(dp.dsell){const v=Math.floor(w.wood*MULT[S.lv.price]*(1+.5*wLv(w)));S.coins+=v;S.earned+=v;float(dp.x,dp.y-30,'+'+v,'#f3b648',13)}else{const v=w.wood*MULT[S.lv.price];S.pile+=v;S.earned+=v;float(PILE.x,PILE.y-20,'+'+Math.floor(v),'#f3b648',13)}w.wood=0;w.dep=null;w.st='seek'}
  }
}
function chips(x,y){for(let i=0;i<4;i++){const a=-Math.PI/2+(Math.random()-.5)*2;parts.push({k:'chip',x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90,life:.6})}}

