/* ===================== 所属分団・水利・ミニマップ ===================== */
const ALL9=['吹一','吹二','吹三','千一','千二','豊津','岸部','山田','千里丘'];
const homeName=()=>((S&&S.home)||'吹三')+'分団'+((S&&S.han&&typeof HANS!=='undefined'&&HANS.some(h=>h.parent===S.home&&h.name===S.han))?` ${S.han}班`:'');
const DPREF={d_mt:'山田',d_res:'岸部',d_s:'吹一',d_n:'豊津',d_nw:'千二',d_ne:'千里丘',d_sw:'吹二',d_se:'吹三'};
function distName(id){let n=DPREF[id];if(S&&S.home===n)n=ALL9.find(x=>!Object.values(DPREF).includes(x));return n+'分団'}
DIST.forEach(d=>{Object.defineProperty(d,'name',{get:()=>distName(d.id),configurable:true});Object.defineProperty(UP[d.id],'name',{get:()=>distName(d.id),configurable:true});Object.defineProperty(UP['dc_'+d.id],'name',{get:()=>distName(d.id)+'の団員',configurable:true})});
function pickHome(first){modal(`<h2>所属分団を選ぼう</h2><p class="lead">きみはどの分団の団員？</p><div class="hgrid">${ALL9.map(n=>`<button class="hbtn ${(S.home||'吹三')===n?'on':''}" data-act="home" data-v="${n}">${n}分団</button>`).join('')}</div><p class="fic">あとからメニューで変えられます。※分団名はゲーム上のもので、実際の地域とは関係ありません。</p>${first?'':'<button class="btn sub" data-act="close">やめる</button>'}`)}
function setHome(n){S.home=n;S.homeSet=true;save();closeModal();pop(`${n}分団に所属！`,'この分団の団員として町を守ろう');snd('buy')}
/* 水利 */
const HYDS=[];
(function(){const pts=[[150,52,'hyd'],[270,116,'hyd'],[-270,116,'hyd'],[510,116,'hyd'],[-510,116,'hyd'],[750,116,'hyd'],[-750,116,'hyd'],[960,116,'hyd'],[-960,116,'hyd'],[34,430,'hyd'],[34,720,'hyd'],[34,-560,'hyd'],[34,-860,'hyd'],[-430,430,'tank'],[470,460,'tank'],[-460,-430,'tank'],[440,-470,'tank']];
  for(const [x,y,k] of pts)HYDS.push({x,y,k});DIST.forEach(d=>{HYDS.push({x:d.x-160,y:d.y+110,k:'hyd',d:d.id},{x:d.x+170,y:d.y-90,k:'tank',d:d.id})})})();
const tCap=()=>100*(S.lv.tank?2.5:1)*(1+.25*(S.lv.truck-1));
function waterSrc(v){let b=null,bd=1e9;for(const h of HYDS){if(!inArea(h.x,h.y,0))continue;const d=dist(v.x,v.y,h.x,h.y);if(d<bd){bd=d;b=h}}
  const ry=riverY(v.x),side=v.y>ry?1:-1,rp={x:v.x,y:ry+side*52,k:'river'};if(inArea(rp.x,rp.y,0)){const d=dist(v.x,v.y,rp.x,rp.y);if(d<bd){bd=d;b=rp}}return b}
let wTip=false,wW=0;
function updWater(dt){if(!S.lv.truck)return;if(T.w==null)T.w=tCap();const ws=waterSrc(T);T.conn=ws&&dist(T.x,T.y,ws.x,ws.y)<(ws.k==='river'?40:82)?ws:null;
  if(T.conn)T.w=Math.min(tCap(),T.w+60*dt);if(T.w<1&&!T.conn){T.refill=true;if(!wTip){wTip=true;toast('ポンプ車の水がなくなった！ 消火栓・防火水槽・川などの「水利」で補給しよう','ng')}}if(T.w>=tCap()*.95)T.refill=false}
function drawHyds(t){const near=S.lv.truck&&(P.ride==='truck'||T.refill);for(const h of HYDS){if(!inArea(h.x,h.y,0)||!inView(h.x,h.y,60))continue;
  if(h.k==='hyd'){shadow(h.x,h.y+2,8,3);cx.fillStyle='#d8331f';rr(h.x-5,h.y-16,10,16,3);cx.fill();cx.fillStyle='#b8321e';cx.fillRect(h.x-8,h.y-12,16,4);cx.fillStyle='#e8ecf2';cx.beginPath();cx.arc(h.x,h.y-17,4,Math.PI,0);cx.fill();if(near)label('消火栓',h.x,h.y-28,10,'#fff','#d8331f')}
  else{shadow(h.x,h.y+6,22,5);cx.fillStyle='#2f78b8';rr(h.x-20,h.y-10,40,16,4);cx.fill();cx.fillStyle='#8cc1ea';cx.fillRect(h.x-16,h.y-8,32,5);cx.fillStyle='#22355c';cx.fillRect(h.x-1,h.y-30,2,20);cx.fillStyle='#fff';rr(h.x-18,h.y-40,36,12,3);cx.fill();cx.fillStyle='#d8331f';cx.font='bold 8px sans-serif';cx.textAlign='center';cx.fillText('防火水槽',h.x,h.y-31)}}
  if(S.lv.truck&&T.conn&&(T.spray||T.w<tCap()-1)){cx.strokeStyle='#d7a52b';cx.lineWidth=3;cx.beginPath();cx.moveTo(T.x,T.y-10);cx.quadraticCurveTo((T.x+T.conn.x)/2,(T.y+T.conn.y)/2+20,T.conn.x,T.conn.y-8);cx.stroke()}}
function drawTruckWater(){if(!S.lv.truck||T.w==null)return;const f=clamp(T.w/tCap(),0,1),x=T.x-22,y=T.y-60;cx.fillStyle='rgba(27,39,64,.7)';rr(x-2,y-2,48,9,4);cx.fill();cx.fillStyle=f<.2?'#ff6b4a':'#3d93db';cx.fillRect(x,y,44*f,5);if(T.conn)label('補給中',T.x,y-10,9,'#fff','#2f78b8');else if(f<.05)label('水がない',T.x,y-10,9,'#fff','#e5432a')}
/* ミニマップ */
let wp=null;const mini=document.getElementById('mini'),mx=mini.getContext('2d');let miniT=0,miniS=1;
function drawMini(){const sz=mini.width,dpr=sz/112;const cs=[{x:0,y:0,r:radius()},...openD()];let ext=0;for(const c of cs)ext=Math.max(ext,Math.abs(c.x)+c.r,Math.abs(c.y)+c.r);miniS=(sz/2-6*dpr)/ext;const S2=miniS,o=sz/2,X=x=>o+x*S2,Y=y=>o+y*S2;
  mx.clearRect(0,0,sz,sz);for(const c of cs){mx.fillStyle='#f5f8fb';mx.beginPath();mx.arc(X(c.x),Y(c.y),c.r*S2,0,7);mx.fill()}
  mx.strokeStyle='#8cc1ea';mx.lineWidth=3*dpr;mx.beginPath();for(let x=-ext;x<=ext;x+=40){const p=[X(x),Y(riverY(x))];x===-ext?mx.moveTo(...p):mx.lineTo(...p)}mx.stroke();
  const dot=(x,y,c,r)=>{mx.fillStyle=c;mx.beginPath();mx.arc(X(x),Y(y),r*dpr,0,7);mx.fill()};
  for(const s of stops())dot(s.x,s.y,'#2fa86b',2.5);
  for(const h of houses)if(h.st==='fire'&&active(h))dot(h.x,h.y,'#e5432a',3);for(const tr of trees)if(tr.fire)dot(tr.x,tr.y,'#ff8a2a',2.5);
  if(em)dot(em.x,em.y,'#e5432a',4);if(hr)dot(HRB.x,HRB.y,'#e5432a',4);if(rain)for(const h of rain.hs)if(h.person)dot(h.x,h.y,'#3d93db',3.5);if(eq)for(const h of eq.hs)if(h.person)dot(h.x,h.y,'#e5432a',3.5);
  for(const m of mons)if(m.boss)dot(m.x,m.y,'#b81d12',4);
  if(S.lv.truck)dot(T.x,T.y,'#d8331f',2.5);if(wp){mx.strokeStyle='#f3b648';mx.lineWidth=2*dpr;mx.beginPath();mx.arc(X(wp.x),Y(wp.y),5*dpr,0,7);mx.stroke()}
  mx.fillStyle='#fff';mx.beginPath();mx.arc(X(P.x),Y(P.y),4.5*dpr,0,7);mx.fill();dot(P.x,P.y,'#22355c',3)}
mini.addEventListener('click',e=>{const r=mini.getBoundingClientRect(),sz=mini.width,px=(e.clientX-r.left)/r.width*sz,py=(e.clientY-r.top)/r.height*sz;const x=(px-sz/2)/miniS,y=(py-sz/2)/miniS;
  if(!inArea(x,y,0)){toast('そこはまだ行けない場所です');return}wp={x,y};toast('地図でえらんだ場所に矢印を出した','ok');snd('new')});

