/* ===================== 避難所・倒木・救助ボート ===================== */
let rain=null;
const BOAT={x:0,y:0,face:1,moving:false};
function spawnLogs(){logs=[];const n=3;for(let k=0;k<80&&logs.length<n;k++){const onH=Math.random()<.6,x=onH?(Math.random()*2-1)*(radius()*.7):0,y=onH?140:(Math.random()*2-1)*(radius()*.7);
  if(Math.hypot(x,y)<200||PADS.some(p=>dist(x,y,p.x,p.y)<70)||logs.some(l=>dist(x,y,l.x,l.y)<120)||blocked(x,y)||dist(x,y,P.x,P.y)<60||inRiver(x,y))continue;logs.push({x,y,hp:3,t:0,vert:!onH})}}
let logT=0;
function updLogs(dt){if(!logs.length||P.ride)return;const l=nearest(logs,P.x,P.y);if(!l||dist(P.x,P.y,l.x,l.y)>58)return;
  logT+=dt;P.chopping=l;if(logT>=chopInt()){logT=0;l.hp--;chips(l.x,l.y-6);snd('chop');if(l.hp<=0){logs.splice(logs.indexOf(l),1);drop('wood',l.x,l.y,3);drop('coin',l.x,l.y,2);addMerit(1);float(l.x,l.y-30,'道が通れるようになった！','#fff',13)}}}
let boatT=0,wetW=0;
function updBoat(dt){
  if(P.ride==='boat'){const h=nearest(houses,BOAT.x,BOAT.y,o=>o.person&&o.st==='flood'&&dist(o.x,o.y,BOAT.x,BOAT.y)<60);if(h){boatT+=dt;if(boatT>1){boatT=0;rescuePerson(h);float(h.x,h.y-70,'ボートで救助！','#fff',13)}}else boatT=0;return}
  if(!P.ride){const h=nearest(houses,P.x,P.y,o=>o.person&&o.st==='flood'&&dist(o.x,o.y,P.x,P.y)<50);if(h){wetW-=dt;if(wetW<=0){wetW=2.5;float(P.x,P.y-60,'水が深い！ 救助ボートで行こう','#ffd0c6',13)}}}}
function drawBoat(t){const x=BOAT.x,y=BOAT.y,f=BOAT.face;shadow(x,y+4,30,6);cx.save();cx.translate(x,y);cx.scale(f,1);
  cx.fillStyle='#ee7a2a';rr(-28,-14,56,16,8);cx.fill();cx.fillStyle='#ffb36b';rr(-24,-12,48,6,3);cx.fill();cx.fillStyle='#22355c';cx.fillRect(18,-20,3,8);
  if(P.ride==='boat'){cx.fillStyle='#22355c';rr(-6,-30,12,14,4);cx.fill();cx.fillStyle='#f2c7a1';cx.beginPath();cx.arc(0,-34,5,0,7);cx.fill();cx.fillStyle='#e8ecf2';cx.beginPath();cx.arc(0,-36,5.5,Math.PI,0);cx.fill()}
  cx.restore();label('救助ボート',x,y-46,10,'#fff','#ee7a2a')}
function drawShelter(t){if(!ty||ty.ph!=='warn')return;const s=SHELTER,on=evac.some(e=>e.st==='follow');
  cx.strokeStyle=on?'#2fa86b':'#5d6b84';cx.lineWidth=3;cx.setLineDash([7,5]);cx.beginPath();cx.arc(s.x,s.y,40,0,7);cx.stroke();cx.setLineDash([]);
  cx.fillStyle='#2fa86b';rr(s.x-8,s.y-40,16,26,3);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.moveTo(s.x-4,s.y-22);cx.lineTo(s.x,s.y-32);cx.lineTo(s.x+4,s.y-22);cx.closePath();cx.fill();
  label('避難所',s.x,s.y+50,11,'#fff','#2fa86b')}
function drawEvacuee(e,t){drawPerson(e.x,e.y,e.face,e.kid?'#f3b648':'#8a7aa8',0,0,true,t,e.st==='follow'&&e.mv,false);
  if(e.st==='wait'){const b=Math.sin(t/180)*3;label('避難させて！',e.x,e.y-44+b,10,'#fff','#e5432a')}}
function drawLog(l,t){shadow(l.x,l.y+4,44,6);cx.save();cx.translate(l.x,l.y);if(l.vert)cx.rotate(Math.PI/2);
  cx.fillStyle='#7a5536';rr(-40,-8,80,14,6);cx.fill();cx.fillStyle='#d9a46e';cx.beginPath();cx.ellipse(40,-1,4,7,0,0,7);cx.fill();cx.fillStyle='#2f6b4f';cx.beginPath();cx.ellipse(-36,-6,16,10,0,0,7);cx.fill();cx.restore();
  if(l.hp<3){cx.fillStyle='rgba(27,39,64,.6)';rr(l.x-14,l.y-30,28,6,3);cx.fill();cx.fillStyle='#f3b648';cx.fillRect(l.x-13,l.y-29,26*l.hp/3,4)}}

