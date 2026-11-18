/* ===================== ループ ===================== */
let last=performance.now();
function resetWorld(){genWorld();ty=null;evac=[];logs=[];em=null;emT=40;eq=null;hr=null;hrT=100;ff=false;ffT=80;eqT=110;sh=null;for(const k of VEHS){VEH[k].x=PADMAP[k].x;VEH[k].y=PADMAP[k].y}zones=[];for(const g of segs)g.sacks=0;mons=[];drops=[];workers=[];parts=[];floats=[];P.x=START.x;P.y=START.y;if(S.px!=null&&!blocked(S.px,S.py)&&Math.hypot(S.px,S.py)<radius()-20){P.x=S.px;P.y=S.py}P.hp=maxHp();P.ride=null;T.x=PARK.x;T.y=PARK.y;cam.x=P.x;cam.y=P.y;monT=3;bossT=90;
  for(let i=0;i<S.crew;i++)addWorker(PADMAP.crew.x+(i%3)*12,PADMAP.crew.y);for(const d of DIST){const n=(S.dcrew||{})[d.id]||0;for(let i=0;i<n;i++)addWorker(d.x+(i%4)*14,d.y+150,d.id)}rain=null;rainT=120;busFx=null;moved=false}
function loop(t){
  const dt=Math.min(.05,(t-last)/1000);last=t;
  if(!paused&&!document.hidden)update(dt);
  zoom+=((P.ride?.85:1)-zoom)*Math.min(1,dt*3);
  cam.x+=(P.x-cam.x)*Math.min(1,dt*6);cam.y+=(P.y-cam.y)*Math.min(1,dt*6);
  updGuide();hud();draw(t);if(++miniT%(S.lite?8:3)===0)drawMini();requestAnimationFrame(loop);
}
function boot(data){
  S=(data&&data.S)||load()||fresh();
  S.seen=S.seen||['sell'];if(S.lv.levee==null)S.lv.levee=0;if(S.lv.rail==null)S.lv.rail=0;for(const k of ['amb','tank','ladder','d_mt','d_res','d_s','d_n','d_nw','d_ne','d_sw','d_se','bus'])if(S.lv[k]==null)S.lv[k]=0;if(!S.dcrew)S.dcrew={};if(!S.home)S.home='吹三';if(S.homeSet==null)S.homeSet=S.earned>0;if(S.sohoCD==null)S.sohoCD=0;if(S.merit==null)S.merit=0;if(S.rank==null)S.rank=0;if(!S.eq)S.eq={helmet:0,coat:0,boots:0,nozzle:0};if(S.boxN==null)S.boxN=0;if(S.boxes==null)S.boxes=0;if(!S.rs)S.rs=[{w:0,s:0},{w:0,s:0},{w:0,s:0}];if(S.tyN==null)S.tyN=0;if(S.tyT===undefined)S.tyT=null;if(!S.eqp)S.eqp={};if(S.clock==null)S.clock=0;if(!S.dlv)S.dlv={};if(!S.st)S.st={};if(!S.badges)S.badges=[];for(const k of ['park','bousai','museum'])if(S.lv[k]==null)S.lv[k]=0;S.sand=0;if(!S.uz)S.uz=.8;setZoom(S.uz);
  resize();addEventListener('resize',resize);resetWorld();checkBadges(true);
  if(/[?&]festa/.test(location.search))taIntro();else if(!S.started)intro();else if(S.earned>0)cont();
  setInterval(save,3000);addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();last=performance.now()});
  requestAnimationFrame(t=>{last=t;loop(t)});
}
if(window.claude&&window.claude.hot&&typeof window.claude.hot.snapshot==='function')window.claude.hot.snapshot(()=>({S}));
(window.claude&&window.claude.hot&&window.claude.hot.ready)?window.claude.hot.ready(boot):boot((window.claude&&window.claude.hot&&window.claude.hot.data)||{});
