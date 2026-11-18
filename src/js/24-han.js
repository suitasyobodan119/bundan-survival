/* ===================== 班（春日班・別所班） ===================== */
const HANS=[{id:'h_kasuga',name:'春日',parent:'千二',home:{x:-430,y:250}},{id:'h_bessho',name:'別所',parent:'山田',home:{x:430,y:250}}];
const HANOFF=[210,230];
const hanAtHome=h=>(S.home||'吹三')===h.parent;
function hanBase(h){if(hanAtHome(h))return {x:h.home.x,y:h.home.y,d:null};const d=DIST.find(d=>distName(d.id)===h.parent+'分団');return d?{x:d.x+HANOFF[0],y:d.y+HANOFF[1],d}:null}
const hanMine=h=>hanAtHome(h)&&S.han===h.name;
const hanOpen=h=>!!(S.lv[h.id]||hanMine(h));
function hanAvail(h){const b=hanBase(h);if(!b)return false;return b.d?!!S.lv[b.d.id]:inArea(b.x,b.y,30)}
const HNPC={};
for(const h of HANS){
  UP[h.id]={name:h.name+'班',icon:'crew',get cost(){return [hanAtHome(h)?300:600]},fx:()=>`${h.parent}分団 ${h.name}班の詰所ができた！ 班の団員が近くの火事とヒノコを消してくれる`};
  const pad={id:h.id,get x(){const b=hanBase(h);return b?b.x:99999},get y(){const b=hanBase(h);return b?b.y+82:99999},unlock:()=>hanAvail(h)&&!hanOpen(h)};PADS.push(pad);PADMAP[h.id]=pad;
  BLD.push({id:'han',hh:h,get x(){const b=hanBase(h);return b?b.x:99999},get y(){const b=hanBase(h);return b?b.y:99999},get w(){return hanOpen(h)?74:0},get h(){return hanOpen(h)?40:-400},ht:26});
  HNPC[h.id]={x:0,y:0,face:1,spray:null,mv:false,h}}
const hanNpcs=()=>HANS.filter(h=>hanOpen(h)&&hanBase(h)&&inArea(hanBase(h).x,hanBase(h).y,0)).map(h=>HNPC[h.id]);
function hanReset(){for(const h of HANS){const b=hanBase(h),n=HNPC[h.id];if(b){n.x=b.x+20;n.y=b.y+48}n.spray=null}}
function hanClear(){for(const h of HANS){const b=hanBase(h);if(!b)continue;trees=trees.filter(t=>dist(t.x,t.y,b.x,b.y+30)>80);houses=houses.filter(o=>dist(o.x,o.y,b.x,b.y+30)>85||o.st!=='ok')}}
genWorld=(o=>function(){o();hanClear()})(genWorld);
resetWorld=(o=>function(){o();hanReset()})(resetWorld);
padCost=(o=>function(id){if(id.startsWith('h_')){const h=HANS.find(x=>x.id===id);return hanOpen(h)?null:UP[id].cost[0]}return o(id)})(padCost);
padLvText=(o=>function(id){if(id.startsWith('h_'))return '';return o(id)})(padLvText);
levelUp=(o=>function(id){if(!id.startsWith('h_'))return o(id);S.paid[id]=0;const p=PADMAP[id];burst(p.x,p.y,'#f3b648',34);snd('buy');buzz(40);shake=6;S.lv[id]=1;hanReset();pop(`${UP[id].name} 結成！`,UP[id].fx())})(levelUp);
function updHan(dt){for(const n of hanNpcs()){const h=n.h,b=hanBase(h),R=380;
  let tg=nearest(mons,n.x,n.y,m=>!m.dead&&dist(m.x,m.y,b.x,b.y)<R);if(!tg)tg=nearest(houses,n.x,n.y,o=>o.st==='fire'&&!o.ev&&active(o)&&dist(o.x,o.y,b.x,b.y)<R);
  let tx=b.x+20,ty=b.y+48,stop=6;if(tg){tx=tg.x;ty=tg.y+30;stop=85}
  const d=dist(n.x,n.y,tx,ty);n.mv=d>stop;if(n.mv){const sp=120;n.x+=(tx-n.x)/d*sp*dt;n.y+=(ty-n.y)/d*sp*dt;n.face=tx>n.x?1:-1}
  if(tg&&d<130)spray(n,115,4+2*yl(),dt,true);else n.spray=null}}
drawBld=(o=>function(b,t){if(b.id!=='han')return o(b,t);const h=b.hh;if(!hanOpen(h))return;const c=bcol(h.parent);
  box(b.x,b.y,74,40,26,'#f3ede2',c);cx.fillStyle='#a3b0c1';cx.fillRect(b.x-26,b.y+20-22,30,22);cx.fillStyle='#7d5b3f';cx.fillRect(b.x+12,b.y+20-20,12,20);
  label(`${h.name}班`,b.x,b.y-20-26+14,12,'#fff',null,'rgba(27,39,64,.85)');label(`${h.parent}分団`,b.x,b.y-20-26-4,9,'#fff',c);flag(b.x+30,b.y-20-26+2,c,h.name+'班')})(drawBld);
function drawHanNpc(n,t){drawPerson(n.x,n.y,n.face,bcol(n.h.parent),0,0,true,t,n.mv,false);if(n.mv||n.spray)label(`${n.h.name}班`,n.x,n.y-44,9,'#fff',bcol(n.h.parent))}
setHome=(o=>function(n){const [p,b]=String(n).split('/');S.han=b||null;o(p);if(TA_MAIN&&S.ta)TA_MAIN.han=S.han;hanClear();hanReset();save();if(b)pop(`${homeName()}に所属！`,`${b}班の詰所が町にできた。班の団員が近くの火事を消してくれる`)})(setHome);
pickHome=(o=>function(first){o(first);const g=document.querySelector('.modal .hgrid');if(!g)return;
  g.querySelectorAll('.hbtn').forEach(x=>x.classList.toggle('on',x.dataset.v===S.home&&!S.han));
  g.insertAdjacentHTML('afterend',`<p class="note" style="margin:2px 0 0">班に所属している人はこちら</p><div class="hgrid">${HANS.map(h=>`<button class="hbtn ${S.home===h.parent&&S.han===h.name?'on':''}" data-act="home" data-v="${h.parent}/${h.name}">${h.parent}分団<br>${h.name}班</button>`).join('')}</div>`)})(pickHome);
taStart=(o=>function(){const hn=(TA_MAIN||S).han;o();S.han=hn||null;hanReset()})(taStart);
update=(o=>function(dt){o(dt);updHan(dt)})(update);

