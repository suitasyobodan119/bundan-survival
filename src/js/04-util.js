/* ===================== ユーティリティ ===================== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const DIST=[{id:'d_mt',name:'山田分団',x:0,y:-1450,r:520,col:'#eef3ee'},{id:'d_res',name:'千里丘分団',x:1450,y:120,r:520,col:'#f5f8fb'},{id:'d_s',name:'岸部分団',x:0,y:1450,r:520,col:'#f1f6f9'},{id:'d_n',name:'豊津分団',x:-1450,y:120,r:520,col:'#f3f4f7'},{id:'d_nw',name:'千二分団',x:-1080,y:-1080,r:520,col:'#f4efe6'},{id:'d_ne',name:'豊津分団',x:1080,y:-1080,r:520,col:'#f3f3f8'},{id:'d_sw',name:'吹一分団',x:-1080,y:1080,r:520,col:'#eef0f2'},{id:'d_se',name:'吹二分団',x:1080,y:1080,r:520,col:'#f0f6ee'}];
DIST.forEach(d=>{d.bx=d.x;d.by=d.y-40;d.stop={x:d.x+95,y:d.y+70};d.sell={x:d.x-95,y:d.y+70};BLD.push({id:'dt',d,x:d.bx,y:d.by,w:116,h:60,ht:34});
  const pad={id:'dc_'+d.id,x:d.x,y:d.y+150,unlock:()=>!!S.lv[d.id]};PADS.push(pad);PADMAP[pad.id]=pad;UP[pad.id]={name:`${d.name}の団員`,icon:'crew'}});
const LAKE={x:-190,y:1560,rx:140,ry:80};
const nearDistStuff=(x,y)=>DIST.some(d=>dist(x,y,d.bx,d.by)<105||dist(x,y,d.stop.x,d.stop.y)<60||dist(x,y,d.sell.x,d.sell.y)<60||dist(x,y,d.x,d.y+150)<55||(Math.abs(x)<40&&Math.abs(y)>1000))||BLD.some(b=>b.id==='hr'&&dist(x,y,b.x,b.y)<115)||((x-LAKE.x)/(LAKE.rx+40))**2+((y-LAKE.y)/(LAKE.ry+40))**2<1;
const openD=()=>DIST.filter(d=>S.lv[d.id]);
function inArea(x,y,m){if(Math.hypot(x,y)<radius()-m)return true;for(const d of openD())if(dist(x,y,d.x,d.y)<d.r-m)return true;return false}
const active=o=>inArea(o.x,o.y,18);
function blocked(x,y){for(const b of BLD){if(Math.abs(x-b.x)<b.w/2+8&&y>b.y-b.h/2-4&&y<b.y+b.h/2+10)return true}for(const l of logs){if(Math.abs(x-l.x)<42&&Math.abs(y-l.y)<14)return true}return false}
let logs=[];
const riverY=x=>-310+16*Math.sin(x/190);
const inRiver=(x,y)=>Math.abs(y-riverY(x))<28||((x+190)/140)**2+((y-1560)/80)**2<1;
const onBridge=(x,y)=>Math.abs(x)<24&&inRiver(x,y);
const DEPOT={x:-150,y:-150};
const SHELTER={x:-75,y:42};
const RIVER_HOUSES=[[-215,-210],[-62,-196],[72,-196],[162,-192],[255,-188]];
function genWorld(){
  const r=mulberry(4242);trees=[];houses=[];
  [[-48,282],[82,292],[-8,342],[100,368],[-82,350],[-30,420]].forEach(p=>trees.push(mkTree(p[0],p[1])));
  for(let gx=-1100;gx<=1100;gx+=92)for(let gy=-1100;gy<=1100;gy+=92){
    const x=gx+(r()-.5)*46,y=gy+(r()-.5)*46,d=Math.hypot(x,y);if(d>1070)continue;
    if(Math.abs(x)<330&&y>-235&&y<255)continue;
    if(Math.abs(x)<140&&y>=255&&y<440)continue;
    if(Math.abs(y-riverY(x))<62)continue;
    if(dist(x,y,300,330)<115)continue;
    if((Math.abs(x-40)<34&&y>100&&y<540)||(Math.abs(y-140)<40&&Math.abs(x)<540))continue;
    const v=r();
    if(v<.44)trees.push(mkTree(x,y));
    else if(v<.62)houses.push({x,y,w:42+r()*14,h:34+r()*8,ht:20,roof:ROOFS[Math.floor(r()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0});
  }
  const r2=mulberry(777);
  for(let gx=-520;gx<=520;gx+=70)for(let gy=-1970;gy<=-930;gy+=70){const x=gx+(r2()-.5)*36,y=gy+(r2()-.5)*36;
    if(dist(x,y,0,-1450)>500||Math.hypot(x,y)<1090||Math.abs(x)<44)continue;const v=r2();
    if(v<.64){const t=mkTree(x,y);t.mt=true;trees.push(t)}else if(v<.69)houses.push({x,y,w:40,h:32,ht:18,roof:'#7a5a3a',st:'ok',hp:0,burn:0,t:0,sm:0})}
  for(let gx=940;gx<=1960;gx+=94)for(let gy=-420;gy<=660;gy+=94){const x=gx+(r2()-.5)*40,y=gy+(r2()-.5)*40;
    if(dist(x,y,1450,120)>500||Math.hypot(x,y)<1090||Math.abs(y-140)<46||Math.abs(y-riverY(x))<62)continue;const v=r2();
    if(v<.58)houses.push({x,y,w:44+r2()*14,h:34+r2()*8,ht:20,roof:ROOFS[Math.floor(r2()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0,res:true});else if(v<.7)trees.push(mkTree(x,y))}
  for(let gx=-520;gx<=520;gx+=92)for(let gy=930;gy<=1970;gy+=92){const x=gx+(r2()-.5)*40,y=gy+(r2()-.5)*40;
    if(dist(x,y,0,1450)>500||Math.hypot(x,y)<1090)continue;const v=r2();
    if(v<.5)houses.push({x,y,w:44+r2()*12,h:34+r2()*8,ht:20,roof:ROOFS[Math.floor(r2()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0,ds:true});else if(v<.72)trees.push(mkTree(x,y))}
  for(let gx=-1960;gx<=-940;gx+=88)for(let gy=-420;gy<=660;gy+=88){const x=gx+(r2()-.5)*36,y=gy+(r2()-.5)*36;
    if(dist(x,y,-1450,120)>500||Math.hypot(x,y)<1090||Math.abs(y-140)<44||Math.abs(y-riverY(x))<62)continue;const v=r2();
    if(v<.6)houses.push({x,y,w:46+r2()*14,h:34+r2()*8,ht:22,roof:ROOFS[Math.floor(r2()*ROOFS.length)],st:'ok',hp:0,burn:0,t:0,sm:0,dn:true});else if(v<.7)trees.push(mkTree(x,y))}
  trees=trees.filter(t=>!nearDistStuff(t.x,t.y));houses=houses.filter(h=>!nearDistStuff(h.x,h.y));
  RIVER_HOUSES.forEach(([x,y],i)=>houses.push({x,y,w:46+(i%3)*5,h:36,ht:20,roof:ROOFS[i%ROOFS.length],st:'ok',hp:0,burn:0,t:0,sm:0}));
}
function mkTree(x,y){return{x,y,hp:3,st:'up',t:0,shake:0}}

