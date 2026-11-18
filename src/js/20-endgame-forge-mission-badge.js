/* ===================== 終盤：鍛冶・詰所強化・施設・今日の任務・バッジ ===================== */
const eqp=k=>(S.eqp&&S.eqp[k])||0;
const eqB=(k,arr)=>arr[S.eq[k]]*(1+.2*eqp(k));
const plusTot=()=>Object.keys(S.eqp||{}).reduce((a,k)=>a+(S.eqp[k]||0),0);
function forgeSlot(){let b=null,bv=9;for(const k of Object.keys(EQ)){if(!S.eq[k])continue;const v=eqp(k);if(v<5&&v<bv){bv=v;b=k}}return b}
const FAC={park:{name:'公園',x:-330,y:330,cost:2000,need:()=>S.lv.yagura>=4,fx:'人を助けたり火を消したときの「ありがとう」コインが1.5倍！'},
  bousai:{name:'防災倉庫',x:-380,y:-60,cost:3000,need:()=>S.lv.yagura>=4&&(S.tyN||0)>=1,fx:'台風が来たら、倉庫から土嚢がすぐ届く！'},
  museum:{name:'消防記念館',x:400,y:-210,cost:5000,need:()=>S.lv.yagura>=5,fx:'功績が1.5倍たまる！ 階級が上がりやすくなる'}};
const DLV_COST=[500,1500,4000];
UP.forge={name:'装備を鍛える',icon:'anvil',fx:()=>''};
PADS.push({id:'forge',x:-345,y:-10,unlock:()=>S.lv.yagura>=3&&Object.values(S.eq).some(v=>v>0)});
for(const k in FAC){const f=FAC[k];UP[k]={name:f.name,icon:'fac_'+k,cost:[f.cost],fx:()=>f.fx};PADS.push({id:k,x:f.x,y:f.y,unlock:f.need});BLD.push({id:'fac',k,x:f.x,y:f.y,w:0,h:-240,ht:0})}
for(const d of DIST){const id='dlv_'+d.id;UP[id]={get name(){return distName(d.id).replace('分団','')+'の詰所'},icon:'tsume'};PADS.push({id,x:d.x-95,y:d.y+150,unlock:()=>!!S.lv[d.id]&&((S.dcrew||{})[d.id]||0)>=1})}
PADS.forEach(p=>PADMAP[p.id]=p);
const wLv=w=>w.home?((S.dlv||{})[w.home]||0):0;

padCost=(o=>function(id){
  if(id==='forge'){const k=forgeSlot();return k?Math.round(250*Math.pow(1.4,plusTot())):null}
  if(id.startsWith('dlv_')){const l=(S.dlv||{})[id.slice(4)]||0;return l<3?DLV_COST[l]:null}
  if(id.startsWith('dc_')){const k=id.slice(3),n=(S.dcrew||{})[k]||0;return n<3+((S.dlv||{})[k]||0)?Math.round(60*Math.pow(1.6,n)):null}
  return o(id)})(padCost);
padLvText=(o=>function(id){
  if(id==='forge'){const k=forgeSlot();return k?`${EQ[k].name}+${eqp(k)+1}`:''}
  if(id.startsWith('dlv_'))return '強化'+(((S.dlv||{})[id.slice(4)]||0)+1);
  if(FAC[id])return '';return o(id)})(padLvText);
levelUp=(o=>function(id){
  if(id==='forge'){S.paid[id]=0;const p=PADMAP[id];burst(p.x,p.y,'#f3b648',40);snd('buy');buzz([30,30,60]);shake=6;const k=forgeSlot();if(!k)return;S.eqp[k]=eqp(k)+1;if(k==='helmet')P.hp=maxHp();
    pop(`${RARE[S.eq[k]]}の${EQ[k].name}+${S.eqp[k]}！`,k==='helmet'?`体力 ${maxHp()}`:'効果が20%アップした');return}
  if(id.startsWith('dlv_')){S.paid[id]=0;const p=PADMAP[id];burst(p.x,p.y,'#f3b648',34);snd('buy');buzz(40);shake=6;const k=id.slice(4);S.dlv[k]=(S.dlv[k]||0)+1;
    pop(`${UP[id].name} 強化${S.dlv[k]}！`,`この分団の団員が速く働き、売上が${1+.5*S.dlv[k]}倍に。団員も${3+S.dlv[k]}人まで増やせる`);return}
  if(FAC[id]){S.paid[id]=0;const p=PADMAP[id];burst(p.x,p.y,'#f3b648',50);snd('buy');buzz([40,40,80]);shake=8;S.lv[id]=1;pop(`${FAC[id].name} 完成！`,FAC[id].fx);return}
  return o(id)})(levelUp);
genWorld=(o=>function(){o();const near=(x,y)=>PADS.some(p=>(p.id==='forge'||FAC[p.id]||p.id.startsWith('dlv_'))&&dist(x,y,p.x,p.y)<62);trees=trees.filter(t=>!near(t.x,t.y));houses=houses.filter(h=>!near(h.x,h.y))})(genWorld);
addMerit=(o=>function(n){return o(n&&S.lv.museum?Math.ceil(n*1.5):n)})(addMerit);

/* --- フック --- */
function stAdd(k,v){S.st[k]=(S.st[k]||0)+(v||1)}
extinguish=(o=>function(h){o(h);stAdd('ext');dmAdd('ext');if(S.lv.park)drop('coin',h.x,h.y,Math.ceil((3+2*yl())*.5))})(extinguish);
killMon=(o=>function(m){const b=m.boss;o(m);stAdd('kill');if(b)stAdd('boss');dmAdd('kill')})(killMon);
rescuePerson=(o=>function(h){o(h);stAdd('rescue');dmAdd('rescue');if(S.lv.park)drop('coin',h.x,h.y,Math.ceil((5+2*yl())*.5))})(rescuePerson);

/* --- 今日の任務 --- */
const DM=[{k:'ext',n:()=>3,t:n=>`火事を${n}件消す`},{k:'kill',n:()=>5+yl(),t:n=>`ヒノコを${n}匹たおす`},{k:'chop',n:()=>10+2*yl(),t:n=>`木を${n}本切る`},
  {k:'sell',n:()=>100*yl(),t:n=>`木や石を売って${n}コインかせぐ`},{k:'rescue',n:()=>2,t:n=>`人を${n}人助ける`,need:()=>(S.rank||0)>=1},
  {k:'emerg',n:()=>1,t:()=>'救急出動で救命に成功する',need:()=>!!S.f.emerg},{k:'soho',n:()=>1,t:()=>'操法大会に出る',need:()=>(S.rank||0)>=1},
  {k:'evac',n:()=>3,t:n=>`台風のとき${n}人を避難所へ`,need:()=>(S.tyN||0)>=1}];
const today=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
function ensureDaily(){const td=today();if(S.daily&&S.daily.d===td)return S.daily;
  let h=0;for(const c of td)h=(h*31+c.charCodeAt(0))|0;const r=mulberry(h);const pool=DM.filter(m=>!m.need||m.need());const l=[];
  while(l.length<3&&pool.length){const m=pool.splice(Math.floor(r()*pool.length),1)[0];const n=m.n();l.push({k:m.k,n,c:0,t:m.t(n)})}
  S.daily={d:td,l,all:false};return S.daily}
function dmAdd(k,v){if(!S||!S.started)return;const D=ensureDaily();for(const m of D.l){if(m.k!==k||m.done)continue;m.c=Math.min(m.n,m.c+(v||1));
  if(m.c>=m.n){m.done=true;const c=30*yl();drop('coin',P.x,P.y,c);toast(`今日の任務 達成！「${m.t}」 +${c}コイン`,'ok');snd('new')}}
  if(!D.all&&D.l.every(m=>m.done)){D.all=true;stAdd('dailyall');setTimeout(()=>{pop('今日の任務 ぜんぶ達成！','ごほうびの装備箱をもらった');giveBox('今日の任務 ぜんぶ達成')},900)}}
function dailyHtml(){const D=ensureDaily();return `<h3 class="sec">今日の任務 <small>毎日かわるよ</small></h3><div class="dm">${D.l.map(m=>`<div class="dmi ${m.done?'done':''}"><span>${m.done?'✅':'⬜'} ${m.t}</span><div class="prog"><i style="width:${m.c/m.n*100}%"></i></div><small>${m.c}/${m.n}</small></div>`).join('')}</div><p class="note">1つ達成で${30*yl()}コイン、3つぜんぶで装備箱</p>`}

/* --- バッジ --- */
const BADGES=[
  ['ext1','🔥','はじめての消火',()=>S.st.ext>=1],['ext50','🧯','消火のプロ（50件）',()=>S.st.ext>=50],['kill30','💥','ヒノコハンター（30匹）',()=>S.st.kill>=30],
  ['boss','👹','大ヒノコ討伐',()=>S.st.boss>=1],['resc10','🙌','人命救助（10人）',()=>S.st.rescue>=10],['emerg5','🚑','救命の達人（5回）',()=>(S.emN||0)>=5],
  ['ty1','🌀','台風をのりきる',()=>(S.tyN||0)>=1],['typerf','🛡️','完璧な防災',()=>S.st.typerf>=1],['evac10','🏫','避難誘導（10人）',()=>S.st.evac>=10],
  ['truck','🚒','ポンプ車配備',()=>S.lv.truck>=1],['ladder','🪜','はしご車配備',()=>!!S.lv.ladder],['hr','🏢','高層ビル火災 鎮火',()=>S.st.hr>=1],
  ['gold','🥇','操法大会 金メダル',()=>S.st.sohog>=1],['dist1','🗾','2つめの分団を結成',()=>openD().length>=1],['dist4','🏯','吹田をまもる（5分団そろう）',()=>openD().length>=4],
  ['dancho','⭐','団長になる',()=>(S.rank||0)>=6],['daily','📅','今日の任務 完全達成',()=>S.st.dailyall>=1],['forge','⚒️','装備を鍛える（合計+5）',()=>plusTot()>=5],
  ['fac','🏞️','町づくり（施設3つ）',()=>Object.keys(FAC).every(k=>S.lv[k])],['rich','💰','コイン1万枚かせぐ',()=>S.earned>=10000]];
function checkBadges(silent){let n=0;for(const [id,ic,nm,f] of BADGES){if(S.badges.includes(id))continue;let ok=false;try{ok=f()}catch(e){}if(!ok)continue;S.badges.push(id);n++;
  if(!silent){toast(`${ic} バッジ獲得「${nm}」`,'ok');snd('new');addMerit(3)}}return n}
function badgeHtml(){return `<h3 class="sec">バッジ <small>${S.badges.length}/${BADGES.length}</small></h3><div class="bdg">${BADGES.map(([id,ic,nm])=>{const g=S.badges.includes(id);return `<div class="bi ${g?'on':''}"><span>${g?ic:'🔒'}</span><small>${nm}</small></div>`}).join('')}</div>`}
let bdgT=0;
update=(o=>function(dt){o(dt);bdgT+=dt;if(bdgT>1){bdgT=0;checkBadges(false)}})(update);

/* --- 描画 --- */
icon=(o=>function(k,x,y,s){
  if(k!=='anvil'&&k!=='tsume'&&!k.startsWith('fac_'))return o(k,x,y,s);
  cx.save();cx.translate(x,y);cx.scale(s,s);
  if(k==='anvil'){cx.fillStyle='#4a5468';cx.fillRect(-11,-2,22,6);cx.fillRect(-5,4,10,6);cx.fillRect(-9,10,18,3);cx.beginPath();cx.moveTo(-11,-2);cx.lineTo(-17,-2);cx.lineTo(-11,3);cx.fill();cx.fillStyle='#f3b648';cx.beginPath();cx.arc(6,-8,3,0,7);cx.fill();cx.fillStyle='#e5432a';cx.beginPath();cx.arc(10,-12,2,0,7);cx.fill()}
  else if(k==='tsume'){cx.fillStyle='#f3ede2';cx.fillRect(-10,-3,20,13);cx.fillStyle='#e5432a';cx.beginPath();cx.moveTo(-13,-3);cx.lineTo(0,-13);cx.lineTo(13,-3);cx.closePath();cx.fill();cx.fillStyle='#7d5b3f';cx.fillRect(-3,3,6,7)}
  else if(k==='fac_park'){cx.fillStyle='#5aa469';cx.beginPath();cx.arc(-4,-5,8,0,7);cx.fill();cx.fillStyle='#7d5b3f';cx.fillRect(-5,2,3,8);cx.fillStyle='#b0715f';cx.fillRect(3,4,11,3);cx.fillRect(4,7,2,3);cx.fillRect(11,7,2,3)}
  else if(k==='fac_bousai'){cx.fillStyle='#d7dee6';cx.fillRect(-11,-4,22,14);cx.fillStyle='#e5432a';cx.fillRect(-12,-8,24,5);cx.fillStyle='#c8a36a';for(let i=0;i<3;i++)cx.fillRect(-8+i*6,2,5,7)}
  else if(k==='fac_museum'){cx.fillStyle='#eef1f5';cx.fillRect(-12,-2,24,12);cx.fillStyle='#c8901f';cx.beginPath();cx.moveTo(-14,-2);cx.lineTo(0,-12);cx.lineTo(14,-2);cx.closePath();cx.fill();cx.fillStyle='#9aa3b2';for(let i=0;i<4;i++)cx.fillRect(-9+i*6,0,2.5,10)}
  cx.restore()})(icon);
drawBld=(o=>function(b,t){if(b.id!=='fac')return o(b,t);if(!S.lv[b.k])return;const x=b.x,y=b.y;
  if(b.k==='park'){cx.fillStyle='#a8d39a';cx.beginPath();cx.ellipse(x,y,70,40,0,0,7);cx.fill();cx.fillStyle='#d8c9a6';cx.beginPath();cx.ellipse(x+10,y+6,26,12,0,0,7);cx.fill();
    for(const [dx,dy] of [[-44,-14],[40,-18],[-30,18]]){shadow(x+dx+3,y+dy+4,12,4);cx.fillStyle='#7d5b3f';cx.fillRect(x+dx-2,y+dy-10,4,12);cx.fillStyle='#4f9a5c';cx.beginPath();cx.arc(x+dx,y+dy-16,12,0,7);cx.fill()}
    cx.fillStyle='#e5432a';cx.fillRect(x+4,y-24,3,22);cx.fillStyle='#3d93db';cx.beginPath();cx.moveTo(x+7,y-24);cx.lineTo(x+26,y-4);cx.lineTo(x+20,y-2);cx.lineTo(x+7,y-14);cx.fill();
    label('公園',x,y-48,13,'#fff',null,'#2f7a40')}
  else if(b.k==='bousai'){box(x,y-16,78,38,30,'#d7dee6','#3c5486');cx.fillStyle='#e5432a';cx.fillRect(x-39,y+3-30,78,6);cx.fillStyle='#c8a36a';for(let i=0;i<4;i++)cx.fillRect(x-30+i*16,y+8,13,8);label('防災倉庫',x,y-60,13,'#fff',null,'#3c5486')}
  else if(b.k==='museum'){box(x,y-18,92,40,36,'#f4f1ea','#8a6a2a');cx.fillStyle='#d8d2c4';for(let i=0;i<5;i++)cx.fillRect(x-40+i*19,y+2-36,5,36);cx.fillStyle='#22355c';cx.fillRect(x-8,y-12,16,14);label('消防記念館',x,y-70,13,'#fff',null,'#8a6a2a')}
})(drawBld);

