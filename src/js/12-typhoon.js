/* ===================== 台風・洪水 ===================== */
const SEG_X=[];for(let x=60;x<=1020;x+=120)SEG_X.push(-x,x);
const segs=SEG_X.map(x=>({x,y:riverY(x)+42,sacks:0}));
const SACK_MAX=8;
const activeSegs=()=>segs.filter(g=>Math.hypot(g.x,g.y)<radius()-20);
const segPad=g=>({x:g.x,y:g.y+40});
const segH=g=>Math.max(0,(S.lv.levee||0)-1)+Math.floor(g.sacks/2);
let ty=null,zones=[],sandT=0;
const tyWater=()=>Math.min(6,2+Math.floor((S.tyN||0)/2));
const needSacks=g=>g.danger?clamp((tyWater()-Math.max(0,(S.lv.levee||0)-1))*2,2,SACK_MAX):0;
const inZone=(x,y)=>zones.some(z=>dist(x,y,z.x,z.y)<z.r);
const walkMul=()=>(inRiver(P.x,P.y)&&!onBridge(P.x,P.y)?.25:1)*(inZone(P.x,P.y)?.65:1);
function startTyphoon(){
  em=null;hr=null;if(rain)endRain(true);if(eq){eq.hs.forEach(h=>{h.person=false;h.st='ok'});eq=null}
  ty={ph:'warn',t:75,W:tyWater(),lvl:0,flooded:new Set(),rescued:0,checked:false,boat:false};
  for(const g of segs){g.sacks=0;g.danger=false}
  if(S.lv.bousai){S.sand=cap();setTimeout(()=>toast('防災倉庫から土嚢が届いた！ 堤防に積もう','ok'),600)}
  const as=activeSegs();as.slice().sort(()=>Math.random()-.5).slice(0,Math.min(as.length,2+Math.floor((S.tyN||0)/2),5)).forEach(g=>g.danger=true);ty.atRisk=houses.filter(h=>active(h)&&h.y>riverY(h.x)&&as.some(g=>dist(h.x,h.y,g.x,g.y)<260));
  const rk=ty.atRisk.slice().sort(()=>Math.random()-.5).slice(0,Math.min(ty.atRisk.length,3+Math.floor((S.tyN||0)/2),5));
  ty.evT=rk.length;evac=rk.map(h=>({h,x:h.x+h.w/2+8,y:h.y+h.h/2+6,st:'wait',face:-1,kid:Math.random()<.4}));
  snd('boss');buzz([80,60,80]);pop('台風が接近中！','あと75秒。住民を避難所へ誘導し、危ない堤防に土嚢を積もう');
}
let evac=[];
function updEvac(dt){let lead=P;for(const e of evac){if(e.st==='wait'){if(dist(P.x,P.y,e.x,e.y)<42){e.st='follow';float(e.x,e.y-40,'ついていきます！','#fff',13);snd('new')}continue}
  if(e.st!=='follow')continue;const d=dist(e.x,e.y,lead.x,lead.y);if(d>24){const sp=Math.min(260,(d-20)*6);e.x+=(lead.x-e.x)/d*sp*dt;e.y+=(lead.y-e.y)/d*sp*dt;e.face=lead.x>e.x?1:-1}e.mv=d>26;lead=e;
  if(dist(e.x,e.y,SHELTER.x,SHELTER.y)<70){e.st='safe';ty.evN=(ty.evN||0)+1;stAdd('evac');dmAdd('evac');drop('coin',e.x,e.y,3);addMerit(2);float(e.x,e.y-40,'避難完了！','#fff',14);snd('buy')}}}

function updTyphoon(dt){
  if(!ty){
    if(S.tyT==null){if(S.earned>=60&&S.lv.yagura>=2)S.tyT=40}
    else{S.tyT-=dt;if(S.tyT<=0)startTyphoon()}
    return}
  ty.t-=dt;
  if(ty.ph==='warn'){
    updEvac(dt);
    sandT+=dt;
    if(sandT>.06){sandT=0;
      if(dist(P.x,P.y,DEPOT.x,DEPOT.y)<40&&S.sand<cap()){S.sand++;snd('pick');bump('pBag')}
      for(const g of activeSegs()){const pd=segPad(g);
        if(S.sand>0&&g.sacks<needSacks(g)&&dist(P.x,P.y,pd.x,pd.y)<40){S.sand--;g.sacks++;fly('sand',P.x,P.y-30,g.x,g.y-8);snd('tick');
          if(g.sacks===needSacks(g)){float(g.x,g.y-34,'OK！','#2fa86b',16);snd('new')}break}}}
    if(ty.t<=0){ty.ph='storm';ty.t=26;
      for(const m of mons)m.dead=true;mons=[];
      for(const h of houses)if(h.st==='fire'){h.st='ok';h.burn=0}
      for(const tr of trees)tr.fire=false;spawnLogs();
      pop('台風が来た！','雨でヒノコと火事は消えた。強風で木が倒れて道をふさいだ');shake=6;snd('boss');buzz([60,40,60])}
  }else if(ty.ph==='storm'){
    const el=26-ty.t;ty.lvl=Math.min(ty.W,ty.W*el/12);
    if(!P.ride)moveBody(P,1,0,24,dt);
    if(el>=12&&!ty.checked){ty.checked=true;let br=0;
      for(const g of activeSegs()){if(g.danger&&segH(g)<ty.W){br++;zones.push({x:g.x,y:g.y+75,r:12,max:170,grow:true})}}
      shake=br?10:4;
      if(br){float(P.x,P.y-64,'堤防から水があふれた！','#ffd0c6',16);snd('hurt')}else{float(P.x,P.y-64,'土嚢が町を守った！','#fff',16);snd('buy')}}
    for(const z of zones){if(z.grow){z.r=Math.min(z.max,z.r+45*dt);if(z.r>=z.max)z.grow=false}
      for(const h of houses){if(h.st!=='ruin'&&h.st!=='flood'&&active(h)&&dist(h.x,h.y,z.x,z.y)<z.r){h.st='flood';ty.flooded.add(h)}}}
    if(ty.t<=0){ty.ph='after';ty.t=50;ty.lvl=0;
      const stay=new Set(evac.filter(e=>e.st!=='safe').map(e=>e.h));evac=evac.filter(e=>e.st==='safe');
      if(zones.length){const fl=[...ty.flooded].sort((a,b)=>(stay.has(b)?1:0)-(stay.has(a)?1:0));fl.slice(0,Math.min(fl.length,1+zones.length+[...stay].filter(h=>ty.flooded.has(h)).length)).forEach(h=>h.person=true);
        const z=zones.reduce((a,b)=>a.r>b.r?a:b);const a=Math.atan2(P.y-z.y,P.x-z.x);BOAT.x=z.x+Math.cos(a)*(z.r*.7);BOAT.y=z.y+Math.sin(a)*(z.r*.7);ty.boat=true;
        pop('台風が去った','救助ボートで屋根の上の人を助けよう。倒木もどかそう')}
      else if(logs.length){ty.ph='after';ty.t=40;pop('台風が去った','倒れた木をどかして道を開けよう')}
      else endTyphoon()}
  }else if(ty.ph==='after'){
    for(let i=zones.length-1;i>=0;i--){const z=zones[i];z.r-=2.5*dt;
      if(S.lv.truck>=1&&dist(T.x,T.y,z.x,z.y)<z.r+70)z.r-=(16+8*S.lv.truck)*dt;
      if(z.r<24){zones.splice(i,1);float(z.x,z.y,'水が引いた！','#fff',14)}}
    for(const h of houses){
      if(h.st==='flood'&&!h.person&&!zones.some(z=>dist(h.x,h.y,z.x,z.y)<z.r))h.st='ok'}
    if(ty.t<=0||(!zones.length&&!houses.some(h=>h.person)&&!logs.length))endTyphoon();
  }
}
function endTyphoon(){
  for(const h of houses){h.person=false;if(h.st==='flood')h.st='ok'}
  zones=[];
  if(P.ride==='boat')unboard();ty.boat=false;logs=[];const evN=ty.evN||0,evT=ty.evT||0;evac=[];
  const tot=ty.atRisk.length,lost=ty.atRisk.filter(h=>ty.flooded.has(h)).length,safe=tot-lost,perfect=lost===0&&evN>=evT;
  const bonus=safe*3*yl()+evN*3*yl()+(perfect&&tot>0?10*yl():0);
  if(bonus)drop('coin',P.x,P.y,bonus);
  pop(perfect?'台風を完璧にのりきった！':'台風をのりきった',`守れた家 ${safe}/${tot}・避難 ${evN}/${evT}人`);
  snd('buy');burst(P.x,P.y-30,'#3d93db',30);addMerit(safe+(perfect?5:0));if(perfect&&tot>0)setTimeout(()=>giveBox('台風から町を守ったごほうび'),1500);
  if(perfect&&tot>0)stAdd('typerf');S.tyN=(S.tyN||0)+1;S.tyT=360;for(const g of segs)g.sacks=0;S.sand=0;ty=null;
}
function tyGuide(){
  if(!ty){if(S.tyT!=null&&S.tyT<15)return{t:`天気予報：まもなく台風が来ます（${Math.ceil(S.tyT)}秒）`,tg:null,mode:'alert'};return null}
  if(ty.ph==='warn'){const sec=Math.ceil(ty.t),as=activeSegs().filter(g=>g.danger),ok=as.filter(g=>g.sacks>=needSacks(g)).length;
    if(evac.some(e=>e.st==='follow'))return{t:`台風まで${sec}秒！ 避難所（詰所の前）まで連れて行こう`,tg:SHELTER,mode:'alert'};
    const ew=nearest(evac,P.x,P.y,e=>e.st==='wait');if(ew)return{t:`台風まで${sec}秒！ まず住民を避難所へ誘導しよう（あと${evac.filter(e=>e.st==='wait').length}人）`,tg:ew,mode:'alert'};
    if(ok===as.length)return{t:`準備OK！ 台風まで${sec}秒。全部の堤防に土嚢を積めた`,tg:null,mode:'gold'};
    if(S.sand===0)return{t:`台風まで${sec}秒！ 土嚢置き場で土嚢を持とう（堤防 ${ok}/${as.length}）`,tg:DEPOT,mode:'alert'};
    const g=nearest(as.filter(g=>g.sacks<needSacks(g)),P.x,P.y);return{t:`台風まで${sec}秒！ 赤く光る危ない堤防に土嚢を積もう（${ok}/${as.length}）`,tg:segPad(g),mode:'alert'}}
  if(ty.ph==='storm')return{t:'台風が来た！ 川の水がどんどん増えている…',tg:null,mode:'alert'};
  const p=nearest(houses,P.x,P.y,h=>h.person);if(p)return P.ride==='boat'?{t:'屋根の上の人のそばまでボートで行こう',tg:p,mode:'alert'}:{t:'救助ボートに乗って、屋根の上の人を助けよう',tg:ty.boat?BOAT:p,mode:'alert'};
  const lg=nearest(logs,P.x,P.y);if(lg)return{t:P.ride?'車から降りて、倒れた木を斧でどかそう':'倒れた木に近づいて、斧でどかそう',tg:lg,mode:'alert'};
  const z=nearest(zones,P.x,P.y);if(z)return{t:S.lv.truck?'ポンプ車が水を抜いている。もう少し！':'水が引くまで待とう',tg:z};
  return null;
}

