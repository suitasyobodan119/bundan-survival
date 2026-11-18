/* ===================== 指令が重なったときの「指令リスト」 ===================== */
const DEV_NAME={spread:'延焼火災',swarm:'ヒノコの大群',factory:'工場火災',heat:'熱中症の救護'};
function incidents(){const L=[],s=x=>Math.max(0,Math.ceil(x));
  if(hr){const on=P.ride==='ladder';L.push({k:'hr',ic:'🏢',name:'高層ビル火災',t:hr.t,mk:{x:HRB.x,y:HRB.y},tg:on?{x:HRB.x,y:HRB.y}:VEH.ladder,
    g:on?`高層ビルに近づくと、はしごで放水と救助ができる（あと${s(hr.t)}秒）`:`高層ビル火災！ はしご車に乗って出動しよう（あと${s(hr.t)}秒）`})}
  if(em){const need=S.lv.amb&&P.ride!=='amb';L.push({k:'em',ic:'🚑',name:'救急出動',t:em.t,mk:em,tg:need?VEH.amb:em,
    g:need?`救急出動！ まず救急車に乗ろう（あと${s(em.t)}秒）`:`救急出動！ 倒れた人のところへ急ごう（あと${s(em.t)}秒）`})}
  if(eq&&eq.hs.some(h=>h.person)){const h=nearest(eq.hs,P.x,P.y,o=>o.person);L.push({k:'eq',ic:'🏚️',name:'地震の救助',t:eq.t,mk:h,tg:h,
    g:P.ride&&dist(P.x,P.y,h.x,h.y)<150?'車から降りて、倒れた家のそばに立とう':`地震！ 倒れた家のそばに立って、取り残された人を助けよう（あと${s(eq.t)}秒）`})}
  if(rain&&rain.hs.some(h=>h.person)){const h=nearest(rain.hs,P.x,P.y,o=>o.person);L.push({k:'rain',ic:'🌧️',name:'浸水の救助',t:rain.t,mk:h,tg:P.ride==='boat'?h:BOAT,
    g:P.ride==='boat'?'浸水した家のそばまでボートで行こう':`浸水！ 救助ボートに乗って助けよう（あと${s(rain.t)}秒）`})}
  if(dEv){const g=devGuide();if(g)L.push({k:'dev',ic:'📣',name:DEV_NAME[dEv.k]||'応援要請',t:dEv.t,mk:g.tg,tg:g.tg,g:g.t})}
  if(ty){const g=tyGuide();if(g&&g.tg)L.push({k:'ty',ic:'🌀',name:'台風',t:ty.ph==='warn'?ty.t:null,mk:g.tg,tg:g.tg,g:g.t})}
  // 林野火災・大ヒノコは時間制限のない「その場の災害」なので指令リストには入れない（ポンプ車・班も自動で消しに行く）
  for(const x of L){const at=x.k==='dev'?DCENT(dEv.id):(x.mk?distOf(x.mk.x,x.mk.y):null);x.at=(at?at.name:homeName()).replace(/分団$/,'')}
  // 残り時間が少ない順
  return L.sort((a,b)=>(a.t==null?1e4:a.t)-(b.t==null?1e4:b.t))}
let ordPin=null,ordList=[],ordN=0,ordHtml='';
function ordCur(){return ordList.find(x=>x.k===ordPin)||ordList[0]}
const waterLow=()=>{const L=VEH.ladder;return (P.ride==='truck'&&T.w!=null&&T.w<tCap()*.15&&!T.conn)||(P.ride==='ladder'&&L.w!=null&&L.w<LCAP()*.2&&!L.conn)};
let ordOpenUntil=0;
function drawOrders(){let el=document.getElementById('orders'),mo=document.getElementById('ordMore');
  if(!el){document.getElementById('goal').insertAdjacentHTML('afterend','<div id="orders" hidden></div>');el=document.getElementById('orders')}
  if(!mo){document.getElementById('goal').insertAdjacentHTML('beforeend','<button id="ordMore" hidden></button>');mo=document.getElementById('ordMore')}
  const tb=document.getElementById('toasts'),n=ordList.length,open=n>=2&&performance.now()<ordOpenUntil;
  const mt=n>=2?`ほか${n-1}件 ${open?'▲':'▼'}`:'';if(mo.textContent!==mt)mo.textContent=mt;mo.hidden=n<2;
  if(!open){if(!el.hidden){el.hidden=true;ordHtml='';tb.style.top=''}return}
  const cur=ordCur(),h=ordList.map((x,i)=>`<button class="orow ${x===cur?'cur':''}" data-ord="${x.k}"><span class="on">${x===cur?'▶':i+1}</span><span class="onm">${x.ic} ${x.name}<em>📍${x.at}</em></span><small>${x.t==null?'急いで':'あと'+Math.max(0,Math.ceil(x.t))+'秒'}</small></button>`).join('');
  if(h!==ordHtml){el.innerHTML=h;ordHtml=h;el.hidden=false;tb.style.top=(el.getBoundingClientRect().bottom+6)+'px'}el.hidden=false}
updGuide=(o=>function(){o();
  if(S.started&&S.f.sold)ordList=incidents();else ordList=[];
  if(ordPin&&!ordList.some(x=>x.k===ordPin))ordPin=null;
  const n=ordList.length;
  if(n>=2&&n>ordN&&!S.ta){snd('tick');ga('orders_overlap',{n})}
  ordN=n;
  if(n>=2&&!waterLow()){const c=ordCur();setGuide({t:`📍${c.at}：${c.g}`,tg:c.tg,mode:'alert'});document.getElementById('goalTag').textContent=`指令${ordList.indexOf(c)+1}/${n}`}
  drawOrders();recId=calcRec()})(updGuide);
document.addEventListener('click',e=>{if(e.target.closest('#ordMore')){ordOpenUntil=performance.now()<ordOpenUntil?0:performance.now()+3000;snd('pick');drawOrders();return}
  const b=e.target.closest('[data-ord]');if(!b)return;ordPin=b.dataset.ord;ordOpenUntil=0;const x=ordList.find(o=>o.k===ordPin);if(x)snd('pick');updGuide()});
cv.addEventListener('pointerdown',()=>{if(ordOpenUntil){ordOpenUntil=0;drawOrders()}});
// 新しい指令が来たとき、ほかの指令も出ていればお知らせ
let ordLater=null;
dispatch=(o=>function(title,sub,opts){const prev=ordList.length?ordCur():null;o(title,sub,opts);const n=incidents().length;
  if(n>=2){const b=document.querySelector('.modal .box .btn');if(b)b.insertAdjacentHTML('beforebegin',`<p class="note ordnote">⚠️ ほかにも指令が出ています（全部で${n}件）。画面上の「ほか◯件」を押すと一覧が見られるよ</p>`);
    if(prev){ordLater=prev.k;const box=document.querySelector('.modal .box');if(box)[...box.querySelectorAll('[data-act=go]')].forEach(x=>{if(/あとで/.test(x.textContent))x.remove()});box.insertAdjacentHTML('beforeend',`<button class="btn sub" data-act="ordlater">あとで向かう（${prev.name}を続ける）</button>`)}}})(dispatch);
document.addEventListener('click',e=>{if(!e.target.closest('[data-act=ordlater]'))return;closeModal();if(ordLater){ordPin=ordLater;const x=incidents().find(o=>o.k===ordLater);toast(`「${x?x.name:'いまの指令'}」を続けよう。新しい指令は「ほか◯件」から選べるよ`,'ok')}ga('dispatch',{how:'later'});updGuide()});
// 地図の上に、指令の番号を出す
drawWeather=(o=>function(t){o(t);if(ordList.length<2)return;const x=ordCur();if(!x||!x.mk)return;
  const sp=toScreen(x.mk.x,x.mk.y);if(!(sp.x>0&&sp.x<W&&sp.y>140&&sp.y<H))return;
  const ex=sp.x,ey=sp.y-96*sc()+Math.sin(t/200)*3;cx.fillStyle='#e5432a';cx.strokeStyle='#fff';cx.lineWidth=3;cx.beginPath();cx.arc(ex,ey,15,0,7);cx.fill();cx.stroke();label('▶',ex+1,ey+1,13,'#fff')})(drawWeather);
// 「おすすめ」の目印
drawPads=(o=>function(t){o(t);if(!recId||ordList.length)return;const p=PADMAP[recId];if(!p||!unlocked(p))return;const b=Math.sin(t/220)*3;label('★おすすめ',p.x,p.y-80+b,12,'#4a3306','#ffd84a')})(drawPads);
update=(o=>function(dt){o(dt);if(!boxCompensate.done&&S.started){boxCompensate.done=1;boxCompensate()}})(update);
(()=>{const st=document.createElement('style');st.textContent=`
#orders{pointer-events:auto;align-self:flex-start;width:min(300px,calc(100% - 124px));background:rgba(255,255,255,.96);border-radius:12px;box-shadow:0 4px 14px rgba(27,39,64,.25);padding:6px;display:flex;flex-direction:column;gap:4px;border:2px solid var(--shu)}
#orders[hidden]{display:none}
#orders .oh{font-weight:900;font-size:12px;color:var(--shu);padding:2px 4px 0}
#orders .orow{display:flex;align-items:center;gap:6px;border:0;border-radius:8px;background:#f1f3f7;padding:5px 6px;font:inherit;font-size:13px;font-weight:700;color:var(--ink);text-align:left;cursor:pointer}
#orders .orow.cur{background:var(--shu);color:#fff}
#orders .on{flex:none;width:20px;height:20px;border-radius:50%;background:#fff;color:var(--shu);display:grid;place-items:center;font-size:12px;font-weight:900;box-shadow:0 0 0 2px var(--shu)}
#orders .onm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#orders small{flex:none;font-size:11px;opacity:.85}
#ordMore{pointer-events:auto;flex:none;margin-left:auto;border:0;border-radius:999px;background:#fff;color:var(--shu);font:inherit;font-size:12px;font-weight:900;padding:5px 9px;cursor:pointer;white-space:nowrap}
#ordMore[hidden]{display:none}
#orders .onm em{display:block;font-style:normal;font-size:11px;font-weight:700;opacity:.8}
.ordnote{color:#b3261e!important;font-weight:700}`;document.head.appendChild(st)})();

