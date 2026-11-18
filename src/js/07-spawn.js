/* ===================== 物の出現 ===================== */
function drop(k,x,y,n){for(let i=0;i<n;i++){const a=Math.random()*7,s=40+Math.random()*70;drops.push({k,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,z:0,vz:120+Math.random()*80,t:0})}if(drops.length>160)drops.splice(0,drops.length-160)}
function spawnMon(boss){
  const R=radius();
  for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,d=boss?R-50:R*(.62+Math.random()*.32);const x=Math.cos(a)*d,y=Math.sin(a)*d;
    if(Math.hypot(x,y)<310)continue;if(!boss&&dist(x,y,P.x,P.y)<170)continue;
    const hp=boss?110*Math.pow(1.8,yl()-2):6*Math.pow(1.7,yl()-1);
    mons.push({x,y,hp,max:hp,boss:!!boss,t:Math.random()*9,hit:0,house:null});return true}
  return false;
}
function ignite(h){h.ev=false;h.st='fire';h.hp=12*(1+.6*(yl()-1));h.burn=0;h.sm=0}

