/* ===================== 描画 ===================== */
let W=0,H=0,DPR=1,SC=1;const cam={x:START.x,y:START.y};
function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';SC=clamp(Math.min(W/430,H/700),.7,1.6)}
const sc=()=>SC*zoom*S.uz;
const ZMIN=.55,ZMAX=1.3;
function setZoom(z){S.uz=clamp(z,ZMIN,ZMAX);document.getElementById('zIn').disabled=S.uz>=ZMAX-.01;document.getElementById('zOut').disabled=S.uz<=ZMIN+.01}
document.getElementById('zIn').addEventListener('click',()=>{setZoom(S.uz*1.2);save()});
document.getElementById('zOut').addEventListener('click',()=>{setZoom(S.uz/1.2);save()});
const toScreen=(x,y)=>({x:(x-cam.x)*sc()+W/2,y:(y-cam.y)*sc()+H*.58});
function setWorld(){const s=sc(),sx=(Math.random()-.5)*shake,sy=(Math.random()-.5)*shake;cx.setTransform(DPR*s,0,0,DPR*s,DPR*(W/2-cam.x*s+sx),DPR*(H*.58-cam.y*s+sy))}
function setScreen(){cx.setTransform(DPR,0,0,DPR,0,0)}
function inView(x,y,m){const s=toScreen(x,y);return s.x>-m&&s.x<W+m&&s.y>-m&&s.y<H+m}
function shadow(x,y,rx,ry){cx.fillStyle='rgba(40,60,90,.16)';cx.beginPath();cx.ellipse(x,y,rx,ry,0,0,7);cx.fill()}
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
function label(t,x,y,size,color,bg,stroke){cx.font=`${size}px "Dela Gothic One","Hiragino Sans",sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
  if(bg){const w=cx.measureText(t).width+14;cx.fillStyle=bg;rr(x-w/2,y-size*.78,w,size*1.56,size*.7);cx.fill()}
  if(stroke){cx.lineWidth=4;cx.strokeStyle=stroke;cx.lineJoin='round';cx.strokeText(t,x,y)}
  cx.fillStyle=color;cx.fillText(t,x,y)}
function box(x,y,w,h,ht,wall,roof){shadow(x+4,y+h/2-2,w*.58,8);cx.fillStyle=wall;cx.fillRect(x-w/2,y+h/2-ht,w,ht);cx.fillStyle=roof;cx.fillRect(x-w/2,y-h/2-ht,w,h);cx.fillStyle='rgba(255,255,255,.2)';cx.fillRect(x-w/2,y-h/2-ht,w,4);cx.fillStyle='rgba(0,0,0,.12)';cx.fillRect(x-w/2,y+h/2-ht,w,3)}

/* アイコン */
function icon(k,x,y,s){cx.save();cx.translate(x,y);cx.scale(s,s);
  if(k==='coin'){cx.fillStyle='#c8901f';cx.beginPath();cx.arc(0,1,9,0,7);cx.fill();cx.fillStyle='#f3b648';cx.beginPath();cx.arc(0,0,8.5,0,7);cx.fill();cx.strokeStyle='#c8901f';cx.lineWidth=1.6;cx.beginPath();cx.arc(0,0,4.5,0,7);cx.stroke();cx.fillStyle='rgba(255,255,255,.6)';cx.fillRect(-5,-6,3,3)}
  else if(k==='wood'){cx.fillStyle='#9a6a3a';rr(-10,-4.5,20,9,4);cx.fill();cx.fillStyle='#d9a46e';cx.beginPath();cx.ellipse(9,0,3.2,4.5,0,0,7);cx.fill();cx.strokeStyle='#7a4f2a';cx.lineWidth=1;cx.beginPath();cx.ellipse(9,0,1.4,2.2,0,0,7);cx.stroke()}
  else if(k==='stone'){cx.fillStyle='#c62b1b';cx.beginPath();cx.moveTo(0,-9);cx.lineTo(8,-2);cx.lineTo(4,8);cx.lineTo(-4,8);cx.lineTo(-8,-2);cx.closePath();cx.fill();cx.fillStyle='#ff7a52';cx.beginPath();cx.moveTo(0,-9);cx.lineTo(8,-2);cx.lineTo(0,0);cx.lineTo(-8,-2);cx.closePath();cx.fill();cx.fillStyle='rgba(255,255,255,.65)';cx.fillRect(-3,-5,3,2)}
  else if(k==='axe'){cx.strokeStyle='#7a4f2a';cx.lineWidth=3.5;cx.lineCap='round';cx.beginPath();cx.moveTo(-7,10);cx.lineTo(5,-8);cx.stroke();cx.fillStyle='#9aa7b8';cx.beginPath();cx.moveTo(1,-11);cx.quadraticCurveTo(14,-10,12,2);cx.lineTo(4,-3);cx.closePath();cx.fill();cx.fillStyle='#dfe6ef';cx.fillRect(9,-7,2,7)}
  else if(k==='hose'){cx.strokeStyle='#d7a52b';cx.lineWidth=3;cx.beginPath();cx.arc(-3,2,7.5,0,7);cx.stroke();cx.beginPath();cx.arc(-3,2,3.5,0,7);cx.stroke();cx.fillStyle='#8c96a6';cx.fillRect(4,-8,9,4);cx.fillStyle='#3d93db';cx.beginPath();cx.arc(15,-6,2.4,0,7);cx.fill()}
  else if(k==='bag'){cx.fillStyle='#22355c';rr(-9,-7,18,17,5);cx.fill();cx.fillStyle='#3c5486';rr(-9,-7,18,7,4);cx.fill();cx.strokeStyle='#22355c';cx.lineWidth=2.5;cx.beginPath();cx.arc(0,-8,5,Math.PI,0);cx.stroke();cx.fillStyle='#f3b648';cx.fillRect(-2,-2,4,3)}
  else if(k==='crew'){cx.fillStyle='#ee8a3a';rr(-8,-1,16,12,4);cx.fill();cx.fillStyle='#f2c7a1';cx.beginPath();cx.arc(0,-6,5.5,0,7);cx.fill();cx.fillStyle='#fff';cx.fillRect(-6,-11,12,3);cx.fillStyle='#e5432a';cx.fillRect(-8,5,16,2)}
  else if(k==='truck'){cx.fillStyle='#d8331f';rr(-12,-6,18,10,2);cx.fill();cx.fillStyle='#e5432a';rr(4,-9,9,13,2);cx.fill();cx.fillStyle='#bfe0f5';cx.fillRect(6,-7,5,4);cx.fillStyle='#23262e';cx.beginPath();cx.arc(-7,5,3,0,7);cx.arc(8,5,3,0,7);cx.fill();cx.fillStyle='#fff';cx.fillRect(-12,-1,25,1.5)}
  else if(k==='tower'){cx.strokeStyle='#5a4532';cx.lineWidth=2;cx.beginPath();cx.moveTo(-7,11);cx.lineTo(-3,-5);cx.moveTo(7,11);cx.lineTo(3,-5);cx.moveTo(-6,5);cx.lineTo(6,5);cx.moveTo(-5,0);cx.lineTo(5,0);cx.stroke();cx.fillStyle='#e5432a';cx.beginPath();cx.moveTo(-8,-5);cx.lineTo(0,-12);cx.lineTo(8,-5);cx.closePath();cx.fill();cx.fillStyle='#f3b648';cx.fillRect(-2,-5,4,3)}
  else if(k==='sand'){cx.fillStyle='#cdb27a';rr(-9,-6,18,12,4);cx.fill();cx.fillStyle='#9c8350';cx.fillRect(-1.5,-6,3,12)}
  else if(k==='levee'){cx.fillStyle='#3d93db';cx.fillRect(-13,0,26,8);cx.fillStyle='#8a9a78';cx.beginPath();cx.moveTo(-11,9);cx.lineTo(-5,-6);cx.lineTo(5,-6);cx.lineTo(11,9);cx.closePath();cx.fill();cx.fillStyle='#cdb27a';rr(-6,-11,12,5,2);cx.fill()}
  else if(k==='chest'){cx.fillStyle='#8a5a2b';rr(-11,-7,22,15,3);cx.fill();cx.fillStyle='#a8703a';rr(-11,-11,22,7,3);cx.fill();cx.fillStyle='#f3b648';cx.fillRect(-11,-5,22,2.5);cx.fillRect(-2,-7,4,6)}
  else if(k==='cart'){cx.fillStyle='#5b6f8f';cx.beginPath();cx.moveTo(-11,-7);cx.lineTo(11,-7);cx.lineTo(8,4);cx.lineTo(-8,4);cx.closePath();cx.fill();cx.fillStyle='#23262e';cx.beginPath();cx.arc(-6,6,3,0,7);cx.arc(6,6,3,0,7);cx.fill();icon('wood',0,-9,.6)}
  else if(k==='amb'){cx.fillStyle='#f6f7f9';rr(-12,-9,25,14,2);cx.fill();cx.strokeStyle='#9aa3b2';cx.lineWidth=1;cx.stroke();cx.fillStyle='#e5432a';cx.fillRect(-12,-2,25,2.5);cx.fillStyle='#23262e';cx.beginPath();cx.arc(-7,6,3,0,7);cx.arc(8,6,3,0,7);cx.fill()}
  else if(k==='tank'){icon('truck',0,2,1);cx.fillStyle='#c9ced8';rr(-12,-12,15,6,3);cx.fill()}
  else if(k==='ladder'){icon('truck',0,2,1);cx.strokeStyle='#9aa3b2';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(-13,-6);cx.lineTo(10,-13);cx.moveTo(-13,-3);cx.lineTo(10,-10);cx.stroke()}
  else if(k==='mt'){cx.fillStyle='#5f7d6a';cx.beginPath();cx.moveTo(-13,9);cx.lineTo(-3,-9);cx.lineTo(7,9);cx.closePath();cx.fill();cx.fillStyle='#3f8a64';cx.beginPath();cx.moveTo(-2,9);cx.lineTo(6,-4);cx.lineTo(14,9);cx.closePath();cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.moveTo(-6,-3);cx.lineTo(-3,-9);cx.lineTo(0,-3);cx.closePath();cx.fill()}
  else if(k==='town'){for(const [ox,c] of [[-7,'#b0715f'],[6,'#6f86ad']]){cx.fillStyle='#f1ebe0';cx.fillRect(ox-6,-2,12,10);cx.fillStyle=c;cx.beginPath();cx.moveTo(ox-8,-1);cx.lineTo(ox,-9);cx.lineTo(ox+8,-1);cx.closePath();cx.fill()}}
  else if(k==='bus'){cx.fillStyle='#f6f7f9';rr(-13,-9,26,15,3);cx.fill();cx.fillStyle='#2fa86b';cx.fillRect(-13,-1,26,3);cx.fillStyle='#bfe0f5';cx.fillRect(-10,-7,6,4);cx.fillRect(-2,-7,6,4);cx.fillRect(6,-7,5,4);cx.fillStyle='#23262e';cx.beginPath();cx.arc(-7,7,3,0,7);cx.arc(7,7,3,0,7);cx.fill()}
  else if(k==='lake'){cx.fillStyle='#8cc1ea';cx.beginPath();cx.ellipse(0,3,13,7,0,0,7);cx.fill();cx.fillStyle='#f1ebe0';cx.fillRect(-4,-10,9,8);cx.fillStyle='#b0715f';cx.beginPath();cx.moveTo(-6,-9);cx.lineTo(0,-14);cx.lineTo(7,-9);cx.closePath();cx.fill()}
  else if(k==='city'){for(const [ox,h] of [[-7,18],[2,24],[10,14]]){cx.fillStyle='#9aa8ba';cx.fillRect(ox-4,10-h,8,h);cx.fillStyle='#bfe0f5';for(let y=12-h;y<8;y+=5)cx.fillRect(ox-2,y,4,2)}}
  else if(k==='price'){icon('coin',-3,2,.9);cx.fillStyle='#2fa86b';cx.beginPath();cx.moveTo(8,-11);cx.lineTo(14,-3);cx.lineTo(10,-3);cx.lineTo(10,4);cx.lineTo(6,4);cx.lineTo(6,-3);cx.lineTo(2,-3);cx.closePath();cx.fill()}
  cx.restore()}

function drawGround(){
  setScreen();cx.fillStyle='#e3eaf1';cx.fillRect(0,0,W,H);setWorld();
  const R=radius();cx.fillStyle='#f5f8fb';cx.beginPath();cx.arc(0,0,R,0,7);cx.fill();
  for(const d of openD()){cx.fillStyle=d.col;cx.beginPath();cx.arc(d.x,d.y,d.r,0,7);cx.fill()}
  cx.fillStyle='#dde5ed';cx.beginPath();cx.ellipse(0,40,300,215,0,0,7);cx.fill();
  cx.fillStyle='#cfd8e2';cx.fillRect(-R,128,R*2,24);cx.fillRect(-12,-R,24,R*2);
  cx.fillStyle='#e5ebf1';for(let x=-R;x<R;x+=40)cx.fillRect(x,139,20,2);
  for(const d of openD()){cx.fillStyle='#cfd8e2';if(d.id==='d_s')cx.fillRect(-12,1000,24,d.by-30-1000);else if(d.id==='d_mt')cx.fillRect(-12,d.by+30,24,-1000-(d.by+30));else cx.fillRect(d.x-d.r,128,d.r*2,24)}
  if(S.lv.d_s)drawLake();
}
let fogC=null,fogX=null;
function drawFog(){
  if(!fogC){fogC=document.createElement('canvas');fogX=fogC.getContext('2d')}
  if(fogC.width!==cv.width||fogC.height!==cv.height){fogC.width=cv.width;fogC.height=cv.height}
  const s=sc(),cs=[{x:0,y:0,r:radius()},...openD()];
  fogX.setTransform(1,0,0,1,0,0);fogX.clearRect(0,0,fogC.width,fogC.height);fogX.fillStyle='rgba(52,68,98,.55)';fogX.fillRect(0,0,fogC.width,fogC.height);
  fogX.setTransform(DPR*s,0,0,DPR*s,DPR*(W/2-cam.x*s),DPR*(H*.58-cam.y*s));fogX.globalCompositeOperation='destination-out';fogX.fillStyle='#000';
  for(const c of cs){fogX.beginPath();fogX.arc(c.x,c.y,c.r,0,7);fogX.fill()}
  fogX.globalCompositeOperation='source-over';
  cx.save();cx.setTransform(1,0,0,1,0,0);cx.drawImage(fogC,0,0);cx.restore();
  cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=3;cx.setLineDash([10,8]);
  for(const c of cs){cx.beginPath();let on=false;for(let a=0;a<=Math.PI*2+.02;a+=.02){const x=c.x+Math.cos(a)*c.r,y=c.y+Math.sin(a)*c.r;if(cs.some(o=>o!==c&&dist(x,y,o.x,o.y)<o.r-2)){on=false;continue}if(!on){cx.moveTo(x,y);on=true}else cx.lineTo(x,y)}cx.stroke()}
  cx.setLineDash([]);
  if(S.lv.yagura>=5)for(const d of DIST)if(!S.lv[d.id])label(d.name,d.x,d.y,20,'#fff',null,'rgba(27,39,64,.6)');
}
function drawPads(t){
  for(const p of PADS){
    if(p.id==='sell'){
      const on=dist(P.x,P.y,p.x,p.y)<34;cx.fillStyle=on?'rgba(61,147,219,.35)':'rgba(255,255,255,.85)';cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.fill();
      cx.strokeStyle='#2f78b8';cx.lineWidth=3;cx.setLineDash([7,5]);cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.stroke();cx.setLineDash([]);
      icon('wood',p.x-12,p.y-6,.85);icon('stone',p.x-12,p.y+8,.7);
      cx.fillStyle='#2f78b8';cx.beginPath();cx.moveTo(p.x-1,p.y-4);cx.lineTo(p.x+5,p.y+1);cx.lineTo(p.x-1,p.y+6);cx.closePath();cx.fill();
      icon('coin',p.x+14,p.y+1,1);
      label('買取所',p.x,p.y+46,13,'#fff','#2f78b8');
      const m=MULT[S.lv.price];cx.font='bold 11px "Zen Kaku Gothic New",sans-serif';cx.fillStyle='#2f78b8';cx.textAlign='center';cx.fillText(`木材${m}・炎の石${3*m}コイン`,p.x,p.y+66);
      continue}
    if(!unlocked(p))continue;if(p.id==='soho'){drawSoho(p,t);continue}const c=padCost(p.id);if(c==null)continue;
    if(p.lock&&p.lock()){cx.fillStyle='rgba(255,255,255,.7)';cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.fill();cx.strokeStyle='#9aa3b2';cx.lineWidth=2.5;cx.setLineDash([7,5]);cx.beginPath();cx.arc(p.x,p.y,32,0,7);cx.stroke();cx.setLineDash([]);icon(UP[p.id].icon,p.x,p.y-4,1.2);label(UP[p.id].name,p.x,p.y-48,12,'#fff','#9aa3b2');label(p.lock(),p.x,p.y+46,11,'#fff','#5d6b84');continue}
    const paid=S.paid[p.id]||0,rem=c-paid,aff=rem<=S.coins,on=dist(P.x,P.y,p.x,p.y)<34,pulse=aff?1+.07*Math.sin(t/160):1,R=32*pulse;
    if(aff){const g=cx.createRadialGradient(p.x,p.y,10,p.x,p.y,58);g.addColorStop(0,'rgba(243,182,72,.55)');g.addColorStop(1,'rgba(243,182,72,0)');cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,58,0,7);cx.fill()}
    cx.fillStyle=on?'rgba(243,182,72,.5)':'rgba(255,255,255,.9)';cx.beginPath();cx.arc(p.x,p.y,R,0,7);cx.fill();
    cx.strokeStyle=aff?'#c8901f':'#22355c';cx.lineWidth=2.5;cx.setLineDash([7,5]);cx.beginPath();cx.arc(p.x,p.y,R,0,7);cx.stroke();cx.setLineDash([]);
    if(paid>0){cx.strokeStyle='#e5432a';cx.lineWidth=5;cx.beginPath();cx.arc(p.x,p.y,R,-Math.PI/2,-Math.PI/2+Math.PI*2*paid/c);cx.stroke()}
    icon(UP[p.id].icon,p.x,p.y-7,1.25);
    icon('coin',p.x-12,p.y+15,.62);label(String(rem),p.x+5,p.y+15,12,aff?'#8a5a00':'#22355c');
    const lt=`${padName(p.id)} ${padLvText(p.id)}`.trim();label(lt,p.x,p.y-48,12,'#fff','#22355c');
    if(aff)label('買える！',p.x,p.y-70+Math.sin(t/200)*2,12,'#fff','#e5432a');
    else if(p.newT)label('NEW',p.x,p.y-70,11,'#22355c','#f3b648');
  }
  if(S.pile>=1){const n=Math.min(14,Math.ceil(S.pile/4));for(let i=0;i<n;i++)icon('coin',PILE.x+((i%4)-1.5)*7,PILE.y-Math.floor(i/4)*5,.75);label(String(Math.floor(S.pile)),PILE.x,PILE.y+16,11,'#8a5a00',null,'#fff')}
}
function drawBld(b,t){
  if(b.id==='tsume'){box(b.x,b.y,b.w,b.h,b.ht,'#f3ede2','#e5432a');cx.fillStyle='#7d5b3f';cx.fillRect(b.x-16,b.y+b.h/2-26,32,26);label('詰所',b.x,b.y-b.h/2-b.ht+20,15,'#fff',null,'#b8321e')}
  else if(b.id==='shop'){box(b.x,b.y,b.w,b.h,b.ht,'#eef1f5','#3c5486');for(let i=0;i<5;i++){cx.fillStyle=i%2?'#fff':'#e5432a';cx.fillRect(b.x-b.w/2+i*b.w/5,b.y+b.h/2-b.ht,b.w/5,8)}label('装備屋',b.x,b.y-b.h/2-b.ht+18,14,'#fff')}
  else if(b.id==='garage'){box(b.x,b.y,b.w,b.h,b.ht,'#d7dee6','#5b6f8f');cx.fillStyle='#a3b0c1';cx.fillRect(b.x-b.w/2+12,b.y+b.h/2-b.ht+5,b.w-24,b.ht-5);for(let i=0;i<4;i++){cx.fillStyle='rgba(0,0,0,.1)';cx.fillRect(b.x-b.w/2+12,b.y+b.h/2-b.ht+9+i*7,b.w-24,1.5)}label('車庫',b.x,b.y-b.h/2-b.ht+18,14,'#fff')}
  else if(b.id==='tower')drawTower(t);
  else if(b.id==='hr')drawHighrise(t,b);
  else if(b.id==='dt')drawDistBld(b,t);
}
function drawTower(t){
  const lv=yl(),x=0,by=-114,th=58+lv*16,tw=8,bw=22,top=by-th;shadow(x+6,by,30,8);
  const g=cx.createRadialGradient(x,top+6,2,x,top+6,36+lv*10);g.addColorStop(0,`rgba(243,182,72,${.35+.08*Math.sin(t/160)})`);g.addColorStop(1,'rgba(243,182,72,0)');cx.fillStyle=g;cx.fillRect(x-120,top-100,240,220);
  cx.strokeStyle='#5a4532';cx.lineWidth=4;cx.beginPath();cx.moveTo(x-bw,by);cx.lineTo(x-tw,top+10);cx.moveTo(x+bw,by);cx.lineTo(x+tw,top+10);cx.stroke();
  cx.lineWidth=1.6;cx.beginPath();const n=3+lv;for(let i=0;i<n;i++){const y1=by-(th-10)*i/n,y2=by-(th-10)*(i+1)/n,w1=bw-(bw-tw)*i/n,w2=bw-(bw-tw)*(i+1)/n;cx.moveTo(x-w1,y1);cx.lineTo(x+w2,y2);cx.moveTo(x+w1,y1);cx.lineTo(x-w2,y2);cx.moveTo(x-w2,y2);cx.lineTo(x+w2,y2)}cx.stroke();
  cx.fillStyle='#6b513a';cx.fillRect(x-17,top+8,34,5);cx.strokeStyle='#5a4532';cx.lineWidth=2;cx.beginPath();cx.moveTo(x-13,top-6);cx.lineTo(x-13,top+8);cx.moveTo(x+13,top-6);cx.lineTo(x+13,top+8);cx.stroke();
  cx.fillStyle='#e5432a';cx.beginPath();cx.moveTo(x-19,top-4);cx.lineTo(x,top-20);cx.lineTo(x+19,top-4);cx.closePath();cx.fill();
  cx.fillStyle='#f3b648';cx.beginPath();cx.arc(x,top+1,5.5,Math.PI,0);cx.fill();cx.fillRect(x-5.5,top+1,11,2);
  label('やぐら Lv'+lv,x,by+12,11,'#fff','#5a4532');
}
function drawTree(tr,t){
  const {x,y}=tr;
  if(tr.st==='stump'){cx.fillStyle='#7a5536';cx.beginPath();cx.ellipse(x,y,9,5,0,0,7);cx.fill();cx.fillStyle='#b98a5c';cx.beginPath();cx.ellipse(x,y-2,7,3.5,0,0,7);cx.fill();return}
  const sx=tr.shake>0?Math.sin(t/18)*3:0;shadow(x+2,y+2,18,6);
  cx.fillStyle='#6b4a30';cx.fillRect(x-4,y-14,8,14);
  if(tr.fire){drawTreeFire(tr,t);return}
  const lay=[[-14,22,30,'#2f6b4f'],[-28,18,24,'#367a59'],[-40,13,18,'#3f8a64']];
  for(const [oy,hw,hh,c] of lay){cx.fillStyle=c;cx.beginPath();cx.moveTo(x+sx-hw,y+oy);cx.lineTo(x+sx,y+oy-hh);cx.lineTo(x+sx+hw,y+oy);cx.closePath();cx.fill();
    cx.fillStyle='rgba(255,255,255,.85)';cx.beginPath();cx.moveTo(x+sx-hw*.45,y+oy-hh*.55);cx.lineTo(x+sx,y+oy-hh);cx.lineTo(x+sx+hw*.45,y+oy-hh*.55);cx.closePath();cx.fill()}
  if(tr.hp<3){cx.fillStyle='rgba(27,39,64,.6)';rr(x-14,y-62,28,6,3);cx.fill();cx.fillStyle='#f3b648';cx.fillRect(x-13,y-61,26*tr.hp/3,4)}
}

function drawRiver(t){
  const R=openD().length?1980:radius()+90,x0=-R,x1=R,rise=ty?ty.lvl*6:0;
  cx.fillStyle='#ddd2bb';cx.beginPath();for(let x=x0;x<=x1;x+=24)cx.lineTo(x,riverY(x)-36-rise);for(let x=x1;x>=x0;x-=24)cx.lineTo(x,riverY(x)+34+rise*.6);cx.closePath();cx.fill();
  cx.fillStyle=ty&&ty.ph!=='warn'?'#6e9cc4':'#8cc1ea';cx.beginPath();for(let x=x0;x<=x1;x+=24)cx.lineTo(x,riverY(x)-26-rise);for(let x=x1;x>=x0;x-=24)cx.lineTo(x,riverY(x)+26+rise*.6);cx.closePath();cx.fill();
  const sp=ty&&ty.ph==='storm'?.5:.06;cx.strokeStyle='rgba(255,255,255,.55)';cx.lineWidth=2;cx.beginPath();
  for(let i=0;i<46;i++){const x=((i*137+t*sp)%(x1-x0))+x0,y=riverY(x)+((i*53)%36)-18;cx.moveTo(x,y);cx.lineTo(x+14,y)}cx.stroke();
  const by=riverY(0);cx.fillStyle='rgba(40,60,90,.15)';cx.fillRect(-20,by-36,44,76);cx.fillStyle='#a5764a';cx.fillRect(-22,by-40,44,78);cx.fillStyle='#8a5f38';for(let y=by-38;y<by+36;y+=8)cx.fillRect(-22,y,44,2);cx.fillStyle='#6b4a30';cx.fillRect(-25,by-40,4,78);cx.fillRect(21,by-40,4,78);
}
function drawLevees(t){
  const L=S.lv.levee||0;
  for(const g of activeSegs()){const x=g.x,y=g.y;
    cx.fillStyle='#93a47f';rr(x-55,y-7-L*5,110,13+L*5,5);cx.fill();cx.fillStyle='#b3c39d';cx.fillRect(x-55,y-7-L*5,110,3);
    for(let i=0;i<g.sacks;i++){const lv=Math.floor(i/2),half=i%2;for(let j=0;j<3;j++){const sx=x-44+(half*3+j)*16+(lv%2)*6,sy=y-11-L*5-lv*7;cx.fillStyle='#cdb27a';rr(sx-7,sy-4,14,8,3);cx.fill();cx.fillStyle='#9c8350';cx.fillRect(sx-1,sy-4,2,8)}}
    if(ty&&ty.ph==='warn'&&g.danger){const pd=segPad(g),need=needSacks(g),ok=g.sacks>=need,on=dist(P.x,P.y,pd.x,pd.y)<40,pl=ok?1:1+.07*Math.sin(t/150);
      if(!ok){const gr=cx.createRadialGradient(pd.x,pd.y,8,pd.x,pd.y,56);gr.addColorStop(0,'rgba(229,67,42,.45)');gr.addColorStop(1,'rgba(229,67,42,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(pd.x,pd.y,56,0,7);cx.fill()}
      cx.fillStyle=on?'rgba(243,182,72,.55)':'rgba(255,255,255,.88)';cx.beginPath();cx.arc(pd.x,pd.y,28*pl,0,7);cx.fill();
      cx.strokeStyle=ok?'#2fa86b':'#e5432a';cx.lineWidth=2.5;cx.setLineDash([6,5]);cx.beginPath();cx.arc(pd.x,pd.y,28*pl,0,7);cx.stroke();cx.setLineDash([]);
      label('危ない！',x,y-28,10,'#fff','#e5432a');
      if(ok)label('OK',pd.x,pd.y,15,'#2fa86b');else{icon('sand',pd.x-10,pd.y,.8);label(`${g.sacks}/${need}`,pd.x+11,pd.y,11,'#e5432a')}}
    else if(ty&&ty.checked&&g.danger&&segH(g)<ty.W&&ty.ph!=='warn')label('あふれた',x,y-26,11,'#fff','#e5432a');
    else if(ty&&ty.ph==='storm'&&g.danger)label(segH(g)>=ty.W?'持ちこたえている':'あぶない',x,y-26,10,'#fff',segH(g)>=ty.W?'#2fa86b':'#e5432a');
  }
  if(S.tyT==null&&!ty)return;
  const d=DEPOT,warn=ty&&ty.ph==='warn';
  if(warn){const on=dist(P.x,P.y,d.x,d.y)<40;cx.fillStyle=on?'rgba(243,182,72,.5)':'rgba(255,255,255,.85)';cx.beginPath();cx.arc(d.x,d.y+4,34,0,7);cx.fill();cx.strokeStyle='#c8901f';cx.lineWidth=2.5;cx.setLineDash([6,5]);cx.beginPath();cx.arc(d.x,d.y+4,34,0,7);cx.stroke();cx.setLineDash([])}
  shadow(d.x,d.y+8,28,8);const rows=[4,3,2];rows.forEach((n,r)=>{for(let c=0;c<n;c++){const sx=d.x-(n-1)*8+c*16,sy=d.y+4-r*8;cx.fillStyle='#cdb27a';rr(sx-7,sy-4,14,8,3);cx.fill();cx.fillStyle='#9c8350';cx.fillRect(sx-1,sy-4,2,8)}});
  label('土嚢置き場',d.x,d.y+30,11,'#fff',warn?'#e5432a':'#8a6a44');
}
function drawZones(t){for(const z of zones){const g=cx.createRadialGradient(z.x,z.y,z.r*.2,z.x,z.y,z.r);g.addColorStop(0,'rgba(60,120,190,.7)');g.addColorStop(1,'rgba(60,120,190,.3)');cx.fillStyle=g;cx.beginPath();cx.arc(z.x,z.y,z.r,0,7);cx.fill();
  cx.strokeStyle='rgba(255,255,255,.45)';cx.lineWidth=2;for(let k=0;k<3;k++){const r=z.r*.25+((t/25+k*z.r*.25)%(z.r*.75));cx.beginPath();cx.arc(z.x,z.y,r,0,7);cx.stroke()}}}
function drawWeather(t){if(!ty){if(rain&&distOf(P.x,P.y)&&distOf(P.x,P.y).id==='d_s'){cx.fillStyle='rgba(20,32,58,.18)';cx.fillRect(0,0,W,H);cx.strokeStyle='rgba(205,222,245,.55)';cx.lineWidth=1.5;cx.beginPath();for(let i=0;i<110;i++){const x=((i*73.3+t*.35)%(W+120))-60,y=((i*151.7+t*1.1)%(H+60))-30;cx.moveTo(x,y);cx.lineTo(x-9,y+20)}cx.stroke()}return}let a=ty.ph==='warn'?.24*(1-ty.t/60):ty.ph==='storm'?.34:.12*(ty.t/50);
  cx.fillStyle=`rgba(20,32,58,${a})`;cx.fillRect(0,0,W,H);
  if(ty.ph==='storm'||(ty.ph==='warn'&&ty.t<15)){const n=ty.ph==='storm'?140:45;cx.strokeStyle='rgba(205,222,245,.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<n;i++){const x=((i*73.3+t*.35)%(W+120))-60,y=((i*151.7+t*1.1)%(H+60))-30;cx.moveTo(x,y);cx.lineTo(x-9,y+20)}cx.stroke()}}
function drawHouseBase(h,t){
  if(h.st==='ruin'){shadow(h.x,h.y+h.h/2,h.w*.5,6);cx.fillStyle='#5b5f66';cx.fillRect(h.x-h.w/2,h.y-h.h/2,h.w,h.h);cx.fillStyle='#3f4349';for(let i=0;i<5;i++)cx.fillRect(h.x-h.w/2+4+i*7,h.y-4+(i%2)*5,8,5);return}
  box(h.x,h.y,h.w,h.h,h.ht,'#f1ebe0',h.st==='fire'?'#7b4a3c':h.roof);
  cx.fillStyle='#39506f';cx.fillRect(h.x-h.w/4-4,h.y+h.h/2-h.ht+6,8,8);cx.fillRect(h.x+h.w/4-4,h.y+h.h/2-h.ht+6,8,8);
  if(h.st==='fire'){const s=.75+h.burn/45*.8,fx=h.x,fy=h.y-h.ht;
    for(let i=0;i<6;i++){const a=t/120+i*1.7,ox=Math.sin(a)*8*s+(i-2.5)*5*s,oy=-Math.abs(Math.cos(a*1.3))*14*s;cx.fillStyle=i%2?'rgba(255,190,60,.92)':'rgba(240,90,40,.88)';cx.beginPath();cx.ellipse(fx+ox,fy+oy-6*s,6*s,11*s,0,0,7);cx.fill()}
    cx.fillStyle='rgba(255,240,170,.9)';cx.beginPath();cx.ellipse(fx,fy-8*s,4*s,7*s,0,0,7);cx.fill();
    const bw=46,bx=h.x-bw/2,byy=h.y-h.h/2-h.ht-38,mx=12*(1+.6*(yl()-1));cx.fillStyle='rgba(27,39,64,.75)';rr(bx-2,byy-2,bw+4,9,4);cx.fill();cx.fillStyle='#ff6b4a';cx.fillRect(bx,byy,bw*clamp(h.hp/mx,0,1),5)}
}
function drawHouse(h,t){if(h.st==='collapsed')drawCollapsed(h,t);else drawHouseBase(h,t);
  if(h.st==='flood'){cx.fillStyle='rgba(70,130,195,.65)';cx.fillRect(h.x-h.w/2-5,h.y+h.h/2-12,h.w+10,14);cx.fillStyle='rgba(255,255,255,.5)';cx.fillRect(h.x-h.w/2,h.y+h.h/2-12,h.w*.4,2)}
  if(h.person){const px=h.x,py=h.y-h.h/2-h.ht+4;drawPerson(px,py,1,'#6b8fd1',0,0,true,t,true,false);cx.strokeStyle='#f2c7a1';cx.lineWidth=3;cx.lineCap='round';const w=Math.sin(t/120)*5;cx.beginPath();cx.moveTo(px-7,py-18);cx.lineTo(px-11+w,py-32);cx.moveTo(px+7,py-18);cx.lineTo(px+11-w,py-32);cx.stroke();label('たすけて！',px,py-48,11,'#fff','#e5432a')}
}
function drawMon(m,t){
  const r=m.boss?44:16,bob=Math.sin(m.t*6)*2,x=m.x,y=m.y+bob;shadow(m.x,m.y+4,r*.9,r*.3);
  const g=cx.createRadialGradient(x,y-r*.6,r*.2,x,y-r*.4,r*1.2);g.addColorStop(0,m.hit>0?'#fff':'#ffd25a');g.addColorStop(.55,m.hit>0?'#ffe0d0':'#ff8a2a');g.addColorStop(1,m.boss?'#b81d12':'#e5432a');
  cx.fillStyle=g;cx.beginPath();cx.moveTo(x-r,y-r*.2);
  const tips=m.boss?5:3;for(let i=0;i<=tips;i++){const px=x-r+2*r*i/tips,py=y-r*1.4-Math.abs(Math.sin(m.t*5+i))*r*.5-(i%2?0:r*.25);cx.quadraticCurveTo(px-r/tips,y-r,px,py)}
  cx.quadraticCurveTo(x+r*1.1,y,x+r*.6,y);cx.quadraticCurveTo(x,y+r*.3,x-r*.6,y);cx.quadraticCurveTo(x-r*1.1,y,x-r,y-r*.2);cx.fill();
  const ex=r*.32,ey=y-r*.55,er=r*.2;cx.fillStyle='#fff';cx.beginPath();cx.arc(x-ex,ey,er,0,7);cx.arc(x+ex,ey,er,0,7);cx.fill();
  const lx=clamp((P.x-x)/200,-1,1)*er*.4,ly=clamp((P.y-y)/200,-1,1)*er*.4;cx.fillStyle='#1b2740';cx.beginPath();cx.arc(x-ex+lx,ey+ly,er*.55,0,7);cx.arc(x+ex+lx,ey+ly,er*.55,0,7);cx.fill();
  if(m.boss){cx.strokeStyle='#5a1208';cx.lineWidth=3;cx.beginPath();cx.moveTo(x-ex-er,ey-er*1.4);cx.lineTo(x-ex+er,ey-er*.8);cx.moveTo(x+ex+er,ey-er*1.4);cx.lineTo(x+ex-er,ey-er*.8);cx.stroke()}
  if(m.hp<m.max||m.boss){const bw=m.boss?110:34,bx=x-bw/2,by=y-r*2.1;cx.fillStyle='rgba(27,39,64,.78)';rr(bx-2,by-2,bw+4,m.boss?11:8,4);cx.fill();cx.fillStyle='#ff6b4a';cx.fillRect(bx,by,bw*clamp(m.hp/m.max,0,1),m.boss?7:4);
    if(m.boss)label('大ヒノコ',x,by-12,13,'#fff',null,'#b81d12')}
}
function drawPerson(x,y,face,body,wood,stone,small,t,moving,chop,sand){
  const s=small?.85:1,bob=moving?Math.abs(Math.sin(t/90))*2:0;shadow(x,y+2,10*s,4*s);
  const me=!small&&body==='#22355c';cx.fillStyle=me?BOOT[S.eq.boots]:'#2b2f3a';cx.fillRect(x-5*s,y-6*s,4*s,7*s);cx.fillRect(x+1*s,y-6*s,4*s,7*s);
  const n=Math.min(wood+stone,16),nw=Math.min(wood,n);
  for(let i=0;i<n;i++){const bx=x-face*10*s,by=y-22*s-bob-i*4.4*s;if(i<nw){cx.fillStyle='#9a6a3a';cx.fillRect(bx-7*s,by-2.5*s,14*s,4.5*s);cx.fillStyle='#d9a46e';cx.fillRect(bx+(face>0?-7:5)*s,by-2.5*s,2*s,4.5*s)}else{cx.fillStyle='#d23a24';cx.beginPath();cx.moveTo(bx,by-4*s);cx.lineTo(bx+5*s,by);cx.lineTo(bx,by+3*s);cx.lineTo(bx-5*s,by);cx.closePath();cx.fill()}}
  if(sand){const m=Math.min(sand,14);for(let i=0;i<m;i++){const bx=x-face*10*s,by=y-22*s-bob-(n+i)*5*s;cx.fillStyle='#cdb27a';rr(bx-7*s,by-3*s,14*s,6*s,2.5*s);cx.fill();cx.fillStyle='#9c8350';cx.fillRect(bx-1*s,by-3*s,2*s,6*s)}}
  if(wood+stone>16)label(String(wood+stone),x-face*10*s,y-22*s-bob-n*4.4*s-8,10,'#fff','#7a4f2a');
  if(me){cx.fillStyle='#5d6b84';cx.fillRect(x-face*7-1,y-48-bob,2,30);cx.fillStyle=homeCol();cx.beginPath();cx.moveTo(x-face*7,y-48-bob);cx.lineTo(x-face*7-face*14,y-44-bob);cx.lineTo(x-face*7,y-39-bob);cx.closePath();cx.fill()}cx.fillStyle=body;rr(x-9*s,y-22*s-bob,18*s,17*s,5*s);cx.fill();if(me){cx.fillStyle=homeCol();cx.fillRect(x-9*s,y-22*s-bob,3.5*s,17*s);cx.fillRect(x+5.5*s,y-22*s-bob,3.5*s,17*s)}
  cx.fillStyle=me?STRIPE[S.eq.coat]:'#f3e05a';cx.fillRect(x-9*s,y-12*s-bob,18*s,2.5*s);if(me&&S.eq.coat)cx.fillRect(x-9*s,y-17*s-bob,18*s,1.5*s);
  cx.fillStyle='#f2c7a1';cx.beginPath();cx.arc(x,y-28*s-bob,7*s,0,7);cx.fill();
  cx.fillStyle=small?'#fff':me?HELM[S.eq.helmet]:'#e8ecf2';cx.beginPath();cx.arc(x,y-30*s-bob,7.5*s,Math.PI,0);cx.fill();cx.fillRect(x-8.5*s,y-31*s-bob,17*s,2.5*s);
  cx.fillStyle='#2b2f3a';cx.fillRect(x+face*3*s-1,y-27*s-bob,2,2);
  if(chop){const a=Math.sin(t/40)>0?-.9:.5;cx.save();cx.translate(x+face*9*s,y-18*s-bob);cx.rotate(a*face);cx.scale(face,1);icon('axe',6,-4,.75*s);cx.restore()}
}
function drawTruck(x,y,f,t,lit,ridden){
  shadow(x,y+2,40,8);cx.save();cx.translate(x,y);cx.scale(f,1);
  cx.fillStyle='#23262e';cx.beginPath();cx.arc(-22,-3,7.5,0,7);cx.arc(20,-3,7.5,0,7);cx.fill();cx.fillStyle='#9aa3b2';cx.beginPath();cx.arc(-22,-3,3,0,7);cx.arc(20,-3,3,0,7);cx.fill();
  cx.fillStyle='#cf2e1b';rr(-38,-32,58,26,4);cx.fill();
  cx.fillStyle='#e5432a';rr(12,-44,26,38,6);cx.fill();
  cx.fillStyle='#bfe0f5';cx.fillRect(19,-40,15,11);
  if(ridden){cx.fillStyle='#e8ecf2';cx.beginPath();cx.arc(26,-33,4,Math.PI,0);cx.fill();cx.fillStyle='#f2c7a1';cx.fillRect(23,-33,6,3)}
  cx.fillStyle='#fff';cx.fillRect(-38,-18,76,3);
  cx.fillStyle='#c9ced8';cx.fillRect(-36,-37,44,4);for(let i=0;i<6;i++)cx.fillRect(-34+i*8,-40,2,8);
  cx.fillStyle='#d7a52b';cx.beginPath();cx.arc(-14,-22,6,0,7);cx.fill();cx.fillStyle='#a87d16';cx.beginPath();cx.arc(-14,-22,2.5,0,7);cx.fill();
  cx.fillStyle=lit&&Math.floor(t/150)%2?'#ff3b2f':'#ffd0c6';cx.fillRect(16,-48,18,5);
  cx.restore();
  if(lit&&Math.floor(t/150)%2){const g=cx.createRadialGradient(x+f*25,y-46,1,x+f*25,y-46,26);g.addColorStop(0,'rgba(255,59,47,.45)');g.addColorStop(1,'rgba(255,59,47,0)');cx.fillStyle=g;cx.fillRect(x+f*25-30,y-76,60,60)}
}
function drawDrop(d){const y=d.y-d.z;cx.fillStyle='rgba(40,60,90,.15)';cx.beginPath();cx.ellipse(d.x,d.y+3,6,2.5,0,0,7);cx.fill();icon(d.k,d.x,y-4,d.k==='wood'?.75:.8)}

function draw(t){
  drawGround();drawRiver(t);drawZones(t);drawLevees(t);drawRails(t);drawShelter(t);drawBusStops(t);drawHyds(t);
  const s=sc(),m=80/s;
  // 放水の範囲
  if(!P.ride){cx.strokeStyle='rgba(61,147,219,.18)';cx.lineWidth=2;cx.beginPath();cx.arc(P.x,P.y,hoseRange(),0,7);cx.stroke()}
  drawPads(t);
  const list=[];
  for(const tr of trees)if(inView(tr.x,tr.y,m*s))list.push({y:tr.y,f:()=>drawTree(tr,t)});
  for(const h of houses)if(inView(h.x,h.y,m*s))list.push({y:h.y+h.h/2,f:()=>drawHouse(h,t)});
  for(const b of BLD)list.push({y:b.y+b.h/2,f:()=>drawBld(b,t)});
  for(const n of hanNpcs())list.push({y:n.y,f:()=>drawHanNpc(n,t)});
  for(const w of workers)list.push({y:w.y,f:()=>drawPerson(w.x,w.y,w.face,w.home?bcol(distName(w.home)):homeCol(),w.wood,0,true,t,w.st!=='chop',w.st==='chop')});
  builtRails().forEach((r,i)=>{const c=cartXY(i);list.push({y:c.y,f:()=>drawCart(i,t)})});
  for(const mo of mons)list.push({y:mo.y,f:()=>drawMon(mo,t)});
  for(const k of VEHS)if(S.lv[k])list.push({y:VEH[k].y,f:()=>drawVeh(k,VEH[k],t)});
  if(em)list.push({y:em.y,f:()=>drawPatient(em,t)});
  for(const e of evac)list.push({y:e.y,f:()=>drawEvacuee(e,t)});
  for(const l of logs)list.push({y:l.y,f:()=>drawLog(l,t)});
  if(boatOn())list.push({y:BOAT.y,f:()=>drawBoat(t)});
  if(S.lv.truck>=1)list.push({y:T.y+1,f:()=>drawTruckWater()});
  if(S.lv.truck>=1)list.push({y:T.y,f:()=>drawTruck(T.x,T.y,T.face,t,!!T.spray||T.moving||P.ride==='truck',P.ride==='truck')});
  if(!P.ride)list.push({y:P.y,f:()=>{if(P.hurt>0&&Math.floor(t/80)%2)return;drawPerson(P.x,P.y,P.face,'#22355c',S.wood,S.stone,false,t,P.moving,!!P.chopping,S.sand)}});
  for(const d of drops)list.push({y:d.y,f:()=>drawDrop(d)});
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  drawNight(t);
  // 放水
  for(const src of [P,T,VEH.ladder,...hanNpcs()]){const tg=src.spray;if(!tg)continue;const big=src===T,ox=src.x+src.face*(big?30:10),oy=src.y-(big?36:18);
    cx.strokeStyle=big?'rgba(61,147,219,.5)':'rgba(61,147,219,.35)';cx.lineWidth=big?6:3;cx.beginPath();cx.moveTo(ox,oy);cx.quadraticCurveTo((ox+tg.x)/2,Math.min(oy,tg.y)-50,tg.x,tg.y-(tg.boss?40:24));cx.stroke()}
  for(const p of parts){
    if(p.k==='conf'){cx.globalAlpha=Math.max(0,p.life);cx.fillStyle=p.c;cx.fillRect(p.x-2.5,p.y-2.5,5,5)}
    else if(p.k==='chip'){cx.globalAlpha=Math.max(0,p.life/.6);cx.fillStyle='#c79a63';cx.fillRect(p.x-2,p.y-1.5,4,3)}
    else if(p.k==='fly'){cx.globalAlpha=1;const q=p.t,x=p.sx+(p.tx-p.sx)*q,y=p.sy+(p.ty-p.sy)*q-Math.sin(q*Math.PI)*30;icon(p.item,x,y,.7)}
    else if(p.k==='drop'){const src=p.src,big=p.big,ox=src.x+src.face*(big?30:10),oy=src.y-(big?36:18),q=p.t,x=ox+(p.tx-ox)*q,y=oy+(p.ty-oy)*q-Math.sin(q*Math.PI)*45;cx.globalAlpha=.85;cx.fillStyle='#3d93db';cx.beginPath();cx.arc(x,y,big?4:2.6,0,7);cx.fill()}
    else if(p.k==='smoke'){cx.globalAlpha=Math.max(0,p.life*.45);cx.fillStyle='#6d7380';cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}}
  cx.globalAlpha=1;
  for(const f of floats){cx.globalAlpha=clamp(f.life*1.5,0,1);label(f.txt,f.x,f.y,f.size,f.col,null,'rgba(27,39,64,.85)')}
  cx.globalAlpha=1;
  drawFog();
  setScreen();drawWeather(t);
  // 目標の矢印
  const tg=guide.tg;
  if(tg){const sp=toScreen(tg.x,tg.y),mg=40,top=150,bot=H-90,col=guide.mode==='alert'?'#e5432a':guide.mode==='gold'?'#f3b648':'#ffffff';
    if(sp.x>mg&&sp.x<W-mg&&sp.y>top&&sp.y<bot){const b=Math.sin(t/170)*6,yy=sp.y-70*sc()+b;cx.fillStyle=col;cx.strokeStyle='#22355c';cx.lineWidth=2.5;cx.beginPath();cx.moveTo(sp.x,yy+16);cx.lineTo(sp.x-13,yy);cx.lineTo(sp.x-5,yy);cx.lineTo(sp.x-5,yy-14);cx.lineTo(sp.x+5,yy-14);cx.lineTo(sp.x+5,yy);cx.lineTo(sp.x+13,yy);cx.closePath();cx.fill();cx.stroke()}
    else{const ps=toScreen(P.x,P.y),ang=Math.atan2(sp.y-ps.y,sp.x-ps.x),r=Math.min(W,H)*.32;let ex=clamp(ps.x+Math.cos(ang)*r,mg,W-mg),ey=clamp(ps.y+Math.sin(ang)*r,top,bot);
      cx.save();cx.translate(ex,ey);cx.rotate(ang);const pl=1+.12*Math.sin(t/150);cx.scale(pl,pl);cx.fillStyle=col;cx.strokeStyle='#22355c';cx.lineWidth=2.5;cx.beginPath();cx.moveTo(22,0);cx.lineTo(-12,-16);cx.lineTo(-5,0);cx.lineTo(-12,16);cx.closePath();cx.fill();cx.stroke();cx.restore()}}
  if(hr&&!(tg&&tg.x===HRB.x&&tg.y===HRB.y)){const sp=toScreen(HRB.x,HRB.y);if(!(sp.x>0&&sp.x<W&&sp.y>140&&sp.y<H)){const ex=clamp(sp.x,26,W-26),ey=clamp(sp.y,160,H-40);cx.fillStyle='#e5432a';cx.beginPath();cx.arc(ex,ey,15,0,7);cx.fill();label('ビル',ex,ey+1,10,'#fff')}}
  if(em&&em!==tg){const sp=toScreen(em.x,em.y);if(!(sp.x>0&&sp.x<W&&sp.y>140&&sp.y<H)){const ex=clamp(sp.x,26,W-26),ey=clamp(sp.y,160,H-40);cx.fillStyle='#e5432a';cx.beginPath();cx.arc(ex,ey,15,0,7);cx.fill();label('救',ex,ey+1,13,'#fff')}}
  for(const tr of trees){if(!tr.fire||tr===tg)continue;const sp=toScreen(tr.x,tr.y);if(sp.x>0&&sp.x<W&&sp.y>140&&sp.y<H)continue;const ex=clamp(sp.x,26,W-26),ey=clamp(sp.y,160,H-40);cx.fillStyle='#e5432a';cx.beginPath();cx.arc(ex,ey,14,0,7);cx.fill();label('林',ex,ey+1,12,'#fff');break}
  for(const h of houses){if(h.st!=='fire'||h===tg||!active(h))continue;const sp=toScreen(h.x,h.y);if(sp.x>0&&sp.x<W&&sp.y>140&&sp.y<H)continue;const ex=clamp(sp.x,26,W-26),ey=clamp(sp.y,160,H-40);cx.fillStyle='#e5432a';cx.beginPath();cx.arc(ex,ey,14,0,7);cx.fill();label('火',ex,ey+1,13,'#fff')}
  if(joy){cx.fillStyle='rgba(27,39,64,.12)';cx.strokeStyle='rgba(27,39,64,.3)';cx.lineWidth=2;cx.beginPath();cx.arc(joy.ox,joy.oy,52,0,7);cx.fill();cx.stroke();cx.fillStyle='rgba(229,67,42,.85)';cx.beginPath();cx.arc(joy.ox+joy.dx,joy.oy+joy.dy,22,0,7);cx.fill()}
}

