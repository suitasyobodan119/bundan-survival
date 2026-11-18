/* ===================== ミニゲーム集（ホースつなぎ・合体・土嚢テトリス・はしご車スタック） ===================== */
// 共通の枠：難しさ選び → 3・2・1 → プレイ → タイムアップ → 結果（難しさ別ランキング上位3位・Instagram）
const MG_KEY='bundan-mg-rank';
let mg=null,mgGlobal=null,mgPress=[];
const mgRankLocal=()=>{try{return JSON.parse(localStorage.getItem(MG_KEY)||'[]')}catch(e){return[]}};
const MG_DN={e:'やさしい',n:'ふつう',h:'ハード'},MG_DI={e:'🙂',n:'🔥',h:'💀'};
function mgLoadGlobal(){if(!TA_FORM.csv)return Promise.resolve(null);
  return fetch(TA_FORM.csv+'&_='+Date.now(),{cache:'no-store'}).then(r=>r.text()).then(tx=>{
    mgGlobal=tx.trim().split(/\r?\n/).slice(1).map(l=>l.split('","').map(c=>c.replace(/^"|"$/g,''))).map(c=>{const m=(c[4]||'').match(/^ミニ(.+)・(.+)$/);return m?{g:m[1],d:m[2],n:c[1]||'',b:c[2]||'',s:+(c[3]||0)}:null}).filter(x=>x&&x.s>0);return mgGlobal}).catch(()=>null)}
function mgTop(G,dk,extra){const dn=MG_DN[dk],seen=new Set(),out=[];
  for(const x of [...(extra||[]),...(mgGlobal||[]),...mgRankLocal()]){if(x.g!==G.short||x.d!==dn)continue;const k=x.n+'|'+x.s;if(seen.has(k))continue;seen.add(k);out.push(x)}
  return out.sort((a,b)=>b.s-a.s)}
const mgCanQuery=()=>/[?&]mini/.test(location.search);
function mgEl(){let o=document.getElementById('mg');if(o)return o;
  document.body.insertAdjacentHTML('beforeend',`<div id="mg" hidden><canvas id="mgCv"></canvas><div id="mgHud"><span id="mgScore"></span><span id="mgInfo"></span><span id="mgTime"></span></div><div id="mgBar"><i></i></div><div id="mgCtl" hidden></div><div id="mgPanel"></div></div>`);
  o=document.getElementById('mg');const cv=document.getElementById('mgCv');
  const pos=e=>({x:e.clientX,y:e.clientY});
  cv.addEventListener('pointerdown',e=>{e.preventDefault();if(mg&&mg.st==='play'&&mg.G.down)mg.G.down(mg.s,pos(e).x,pos(e).y)});
  cv.addEventListener('pointermove',e=>{if(mg&&mg.st==='play'&&mg.G.move)mg.G.move(mg.s,pos(e).x,pos(e).y)});
  cv.addEventListener('pointerup',e=>{if(mg&&mg.st==='play'&&mg.G.up)mg.G.up(mg.s,pos(e).x,pos(e).y)});
  o.addEventListener('pointerdown',()=>{const n=performance.now();mgPress.push(n);mgPress=mgPress.filter(t=>n-t<1500)},true);
  o.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-mgc]');if(!b||!mg||mg.st!=='play')return;e.preventDefault();mg.G.ctl(mg.s,b.dataset.mgc)});
  o.addEventListener('click',e=>{const b=e.target.closest('[data-mg]');if(!b)return;const a=b.dataset.mg;
    const n=performance.now();if(mg&&mg.st==='end'&&mgPress.filter(t=>n-t<900).length>=3){b.classList.add('hkshake');setTimeout(()=>b.classList.remove('hkshake'),400);return}
    if(a==='e'||a==='n'||a==='h')mgStart(mg.G,a);else if(a==='again')mgStart(mg.G,mg.dk);else if(a==='intro')mgIntro(mg.G);else if(a==='hub')mgHub();
    else if(a==='close')mgClose();else if(a==='save')mgSave();else if(a==='ranks')mgRanks(mg.G);
    else if(a==='hinoko'){mgClose(true);hkIntro()}else if(MG[a])mgIntro(MG[a])});
  addEventListener('resize',mgResize);return o}
function mgResize(){const cv=document.getElementById('mgCv');if(!cv)return;const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';cv.getContext('2d').setTransform(d,0,0,d,0,0)}
function mgPanel(html,lock){const p=document.getElementById('mgPanel');p.innerHTML=html?`<div class="hkbox mgbox">${html}</div>`:'';p.hidden=!html;
  if(lock){const b=p.querySelector('.hkbox');b.classList.add('lock');setTimeout(()=>b.classList.remove('lock'),lock)}}
function mgBg(c,W,H,top,bot){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top||'#1b2740');g.addColorStop(1,bot||'#33415e');c.fillStyle=g;c.fillRect(0,0,W,H)}
function mgOpen(){audio();const o=mgEl();o.hidden=false;paused=true;mgResize();if(mg&&mg.raf)cancelAnimationFrame(mg.raf);document.getElementById('mgCtl').hidden=true;
  const c=document.getElementById('mgCv').getContext('2d');mgBg(c,innerWidth,innerHeight);['mgScore','mgInfo','mgTime'].forEach(i=>document.getElementById(i).textContent='');document.querySelector('#mgBar i').style.transform='scaleX(1)'}
const mgCloseLbl=()=>mgCanQuery()?'本編「分団サバイバル」で遊ぶ':'ゲームにもどる';
function mgHub(){mgOpen();mg={st:'hub',G:mg&&mg.G};
  mgPanel(`<h2>🎮 ミニゲーム</h2><p class="hkl">サッと遊べる消防団ミニゲーム。どれで遊ぶ？</p>
  <button class="btn mgg" data-mg="hinoko"><b>🔥 30秒ヒノコたたき</b><small>ヒノコをタップして消す</small></button>
  ${Object.entries(MG).map(([k,G])=>`<button class="btn mgg" data-mg="${k}"><b>${G.icon} ${G.name}</b><small>${G.desc}</small></button>`).join('')}
  <button class="btn sub" data-mg="close">${mgCloseLbl()}</button>`);mgLoadGlobal()}
function mgIntro(G){mgOpen();mg={st:'menu',G,dk:mg&&mg.G===G?mg.dk:'e'};
  mgPanel(`<h2>${G.icon} ${G.name}</h2><p class="hkl">${G.how}</p>
  ${['e','n','h'].map(k=>`<button class="btn ${k==='h'?'hkhard':k==='n'?'':'sub'}" data-mg="${k}"><b>${MG_DI[k]} ${MG_DN[k]}</b><small>${G.diffs[k].note}</small></button>`).join('')}
  <button class="btn sub" data-mg="ranks">🏆 ランキングを見る</button><button class="btn sub" data-mg="hub">← ほかのミニゲーム</button><button class="btn sub" data-mg="close">${mgCloseLbl()}</button>`);mgLoadGlobal()}
function mgRanks(G){const body=()=>['e','n','h'].map(k=>`<h3 class="hks">${MG_DI[k]} ${MG_DN[k]}</h3>${hkTable(mgTop(G,k))}`).join('');
  mgPanel(`<h2>🏆 ${G.name}</h2><p class="hkl">難しさごとの上位3位</p><div id="mgRk">${body()}</div><button class="btn" data-mg="intro">もどる</button>`);
  mgLoadGlobal().then(()=>{const b=document.getElementById('mgRk');if(b)b.innerHTML=body()})}
function mgClose(keep){const o=document.getElementById('mg');if(o)o.hidden=true;if(mg&&mg.raf)cancelAnimationFrame(mg.raf);if(!keep){paused=!!document.querySelector('.modal');last=performance.now()}}
function mgStart(G,dk){audio();if(mg&&mg.raf)cancelAnimationFrame(mg.raf);const D=G.diffs[dk];
  mg={st:'count',G,dk,D,cd:3,t:G.time,score:0,s:null,last:performance.now(),raf:0,saved:false};mg.s=G.init(D,innerWidth,innerHeight,mg);
  mgPanel('');const ctl=document.getElementById('mgCtl');ctl.hidden=!G.ctlHtml;if(G.ctlHtml)ctl.innerHTML=G.ctlHtml;
  ga('mini_start',{diff:MG_DN[dk],game:G.short});mg.raf=requestAnimationFrame(mgLoop)}
function mgAdd(p){mg.score=Math.max(0,mg.score+p)}
function mgLoop(now){if(!mg||!mg.G)return;const dt=Math.min(.05,(now-mg.last)/1000);mg.last=now;const W=innerWidth,H=innerHeight,c=document.getElementById('mgCv').getContext('2d');
  if(mg.st==='count'){const p=Math.ceil(mg.cd);mg.cd-=dt;if(Math.ceil(mg.cd)!==p&&mg.cd>0)snd('tick');if(mg.cd<=0){mg.st='play';snd('boss')}}
  else if(mg.st==='play'){mg.G.update(mg.s,dt,mg);if(mg.G.time){mg.t-=dt;if(mg.t<=0){mg.t=0;mg.why='タイムアップ！'}}if(mg.why){mgEnd();return}}
  mg.G.draw(mg.s,c,W,H,now,mg);
  if(mg.st==='count'){c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.textAlign='center';c.font='900 120px "Dela Gothic One",sans-serif';c.fillText(Math.ceil(mg.cd)||'',W/2,H/2+40);c.font='900 20px sans-serif';c.fillText(`${mg.G.icon} ${mg.G.name}（${MG_DN[mg.dk]}）`,W/2,H/2-90)}
  document.getElementById('mgScore').textContent=mg.score+'点';document.getElementById('mgInfo').textContent=mg.G.info?mg.G.info(mg.s):'';
  const tm=document.getElementById('mgTime');tm.textContent=mg.G.time?(mg.st==='count'?'':Math.ceil(mg.t)):'';tm.classList.toggle('low',mg.G.time&&mg.st==='play'&&mg.t<10);
  document.querySelector('#mgBar i').style.transform=`scaleX(${mg.G.time?mg.t/mg.G.time:1})`;
  mg.raf=requestAnimationFrame(mgLoop)}
function mgEnd(){mg.st='end';document.getElementById('mgScore').textContent=mg.score+'点';snd('buy');buzz([60,40,60]);document.getElementById('mgCtl').hidden=true;ga('mini_finish',{diff:MG_DN[mg.dk],game:mg.G.short,score:mg.score});
  const c=document.getElementById('mgCv').getContext('2d'),W=innerWidth,H=innerHeight;mg.G.draw(mg.s,c,W,H,performance.now(),mg);
  c.fillStyle='rgba(10,14,26,.6)';c.fillRect(0,0,W,H);c.textAlign='center';c.strokeStyle='#1b2740';c.lineWidth=8;
  let fz=44;c.font=`900 ${fz}px "Dela Gothic One",sans-serif`;while(fz>20&&c.measureText(mg.why).width>W-30){fz-=2;c.font=`900 ${fz}px "Dela Gothic One",sans-serif`}c.fillStyle='#ffd84d';c.strokeText(mg.why,W/2,H/2-30);c.fillText(mg.why,W/2,H/2-30);
  c.font='900 64px "Dela Gothic One",sans-serif';c.fillStyle='#fff';c.strokeText(mg.score+'点',W/2,H/2+60);c.fillText(mg.score+'点',W/2,H/2+60);
  const k=mg;mgLoadGlobal();setTimeout(()=>{if(mg!==k)return;mgResult();},1600)}
function mgResult(me){const G=mg.G,dn=MG_DN[mg.dk],list=mgTop(G,mg.dk,me?[me]:null),place=me?list.indexOf(me)+1:list.filter(x=>x.s>mg.score).length+1;
  mgPanel(`<h2>${G.icon} ${G.name}</h2><p class="hkl" style="margin:0">${MG_DI[mg.dk]} ${dn}</p><div class="hkscore">${mg.score}<small>点</small></div>
  <p class="hkl">${G.summary?G.summary(mg.s):''}<br>${place<=3?`<b class="hkin">${dn}ランキング ${place}位に入るよ！</b>`:'よくがんばった！'}</p>
  ${me?'':`<label class="nm">なまえ（8文字まで）<input id="mgName" maxlength="8" placeholder="ニックネーム" autocomplete="off"></label><button class="btn" data-mg="save">ランキングに登録</button>`}
  <h3 class="hks">${dn}ランキング（上位3位）</h3><div id="mgTopBox">${hkTable(list,me)}</div>
  <a class="fb ig" href="${IG_URL}" target="_blank" rel="noopener">📷 Instagramをフォローしてね</a>
  <button class="btn sub" data-mg="again">もう一回（${dn}）</button><button class="btn sub" data-mg="intro">難しさを変える・ランキング</button><button class="btn sub" data-mg="hub">← ほかのミニゲーム</button>`,me?0:1500);
  if(!me)mgLoadGlobal().then(()=>{if(!mg||mg.st!=='end'||mg.saved)return;const b=document.getElementById('mgTopBox');if(b)b.innerHTML=hkTable(mgTop(G,mg.dk))})}
function mgSave(){if(!mg||mg.saved)return;const el=document.getElementById('mgName'),v=(el&&el.value||'').trim();
  if(v&&ngName(v)){if(!document.getElementById('mgNg'))el.closest('label').insertAdjacentHTML('afterend','<p class="hkng" id="mgNg">そのなまえは使えないよ。ほかのなまえにしてね</p>');el.value='';el.focus();ga('name_blocked',{});return}
  const me={g:mg.G.short,d:MG_DN[mg.dk],n:v.slice(0,8)||'ななし',b:homeName(),s:mg.score};mg.saved=true;
  const r=mgRankLocal();r.push(me);r.sort((a,b)=>b.s-a.s);try{localStorage.setItem(MG_KEY,JSON.stringify(r.slice(0,200)))}catch(x){}
  hkSend({n:me.n,b:me.b,s:me.s,d:`${me.g}・${me.d}`});ga('mini_save',{game:me.g,diff:me.d,score:me.s});mgResult(me)}
function mgFloat(s,x,y,txt,col){(s.fx=s.fx||[]).push({k:'txt',x,y,txt,col:col||'#fff',t:0})}
function mgFx(s,c,dt){s.fx=(s.fx||[]).filter(f=>(f.t+=dt)<.9);for(const f of s.fx){c.globalAlpha=Math.max(0,1-f.t/.9);c.textAlign='center';c.font='900 22px "Dela Gothic One",sans-serif';c.strokeStyle='#1b2740';c.lineWidth=4;c.fillStyle=f.col;c.strokeText(f.txt,f.x,f.y-f.t*40);c.fillText(f.txt,f.x,f.y-f.t*40)}c.globalAlpha=1}
const mgTop0=()=>Math.max(96,(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0)+96);

/* ---------- ① ホースつなぎパズル ---------- */
// 0=上 1=右 2=下 3=左。ビット：上1 右2 下4 左8
const HP_BIT=[1,2,4,8],HP_DX=[0,1,0,-1],HP_DY=[-1,0,1,0];
const hpOpen=(p)=>p.t==='x'?15:p.t==='s'?(p.r%2?5:10):[3,6,12,9][p.r%4];
function hpStage(s){const N=s.N;let path=null;
  for(let tries=0;tries<60&&!path;tries++){const sr=Math.random()*N|0,tr=Math.random()*N|0,seen=new Set(),st=[];
    const dfs=(x,y)=>{if(x<0||y<0||x>=N||y>=N||seen.has(x+','+y))return false;seen.add(x+','+y);st.push([x,y]);if(x===N-1&&y===tr&&st.length>=N+1)return true;
      const ds=[1,0,2,3].sort(()=>Math.random()-.5);if(Math.random()<.5)ds.sort((a,b)=>(a===1?-1:0)-(b===1?-1:0));for(const d of ds)if(dfs(x+HP_DX[d],y+HP_DY[d]))return true;st.pop();return false};
    if(dfs(0,sr)&&st.length<=N*N*.7){path=st.slice();s.sr=sr;s.tr=tr}}
  if(!path){s.sr=s.tr=Math.random()*N|0;path=[];for(let x=0;x<N;x++)path.push([x,s.sr])}
  const g=[];for(let y=0;y<N;y++){g.push([]);for(let x=0;x<N;x++){const r=Math.random();g[y].push({t:r<.12?'x':r<.56?'s':'c',r:Math.random()*4|0,w:0,lock:false})}}
  const dirTo=(a,b)=>b[0]>a[0]?1:b[0]<a[0]?3:b[1]>a[1]?2:0;
  path.forEach((p,i)=>{const inD=i===0?3:(dirTo(path[i-1],p)+2)%4,outD=i===path.length-1?1:dirTo(p,path[i+1]);g[p[1]][p[0]]={t:(inD+2)%4===outD?'s':'c',r:Math.random()*4|0,w:0,lock:false}});
  s.path=path;s.g=g;s.wait=s.D.wait;s.flowing=false;s.cur=null;s.done=0}
const hpGame={short:'ホース',name:'ホースつなぎパズル',icon:'🧩',time:90,desc:'水が来る前に、消火栓から火事の家までホースをつなぐ',
  how:'ホースをタップすると回るよ。消火栓（左）から火事の家（右）までつなごう！ 時間がたつと水が流れ出す。早めに「放水！」を押すとボーナス',
  diffs:{e:{N:5,wait:18,flow:1.0,note:'5×5マス・水はゆっくり'},n:{N:6,wait:12,flow:.7,note:'6×6マス・ふつうの速さ'},h:{N:7,wait:7,flow:.42,note:'7×7マス・水が速い！ ステージごとに加速'}},
  init(D,W,H){const s={D,N:D.N,stage:1,fx:[],cleared:0,cells:0};hpStage(s);return s},
  geo(s,W,H){const top=mgTop0()+40,cs=Math.floor(Math.min((W-90)/s.N,(H-top-120)/s.N));return {cs,ox:Math.round((W-cs*s.N)/2),oy:top+30}},
  info:s=>`ステージ ${s.stage}`,summary:s=>`クリアしたステージ ${s.cleared}・水を通したホース ${s.cells}マス`,
  startFlow(s){s.flowing=true;s.cur={x:0,y:s.sr,inD:3,p:0};const c=s.g[s.sr][0];if(!(hpOpen(c)&HP_BIT[3]))return this.leak(s);c.lock=true;snd('new')},
  leak(s){s.fail=true;mg.why='水がもれた！';snd('hurt');buzz(120)},
  update(s,dt,m){if(s.fail)return;if(s.next>0){s.next-=dt;if(s.next<=0)hpStage(s);return}
    if(!s.flowing){s.wait-=dt;if(s.wait<=0)this.startFlow(s);return}
    const sp=s.D.flow*Math.pow(.92,s.stage-1),cu=s.cur,cell=s.g[cu.y][cu.x];cu.p+=dt/sp;cell.w=Math.max(cell.w,Math.min(1,cu.p));
    if(cu.p<1)return;const o=hpOpen(cell);let outD;
    if(cell.t==='x')outD=(cu.inD+2)%4;else{outD=[0,1,2,3].find(d=>d!==cu.inD&&(o&HP_BIT[d]))}
    s.cells++;mgAdd(10);const nx=cu.x+HP_DX[outD],ny=cu.y+HP_DY[outD];
    if(nx===s.N&&ny===s.tr){s.cleared++;const bonus=100+Math.round(Math.max(0,s.bonusWait||0)*5);mgAdd(bonus);const g=this.geo(s,innerWidth,innerHeight);mgFloat(s,innerWidth/2,g.oy+g.cs*s.N/2,`消火成功！ +${bonus}`,'#ffd84d');snd('kill');buzz([40,30,40]);s.stage++;s.next=1.2;s.flowing=false;s.bonusWait=0;return}
    if(nx<0||ny<0||nx>=s.N||ny>=s.N)return this.leak(s);
    const nc=s.g[ny][nx],inD=(outD+2)%4;if(!(hpOpen(nc)&HP_BIT[inD])||(nc.w>0&&nc.t!=='x'))return this.leak(s);
    nc.lock=true;s.cur={x:nx,y:ny,inD,p:0}},
  down(s,x,y){if(s.next>0||s.fail)return;const g=this.geo(s,innerWidth,innerHeight);
    if(!s.flowing&&x<g.ox&&y>g.oy+s.sr*g.cs-10&&y<g.oy+(s.sr+1)*g.cs+10){s.bonusWait=s.wait;mgFloat(s,g.ox,g.oy+s.sr*g.cs,'放水！','#7cc6ff');this.startFlow(s);return}
    const cx=Math.floor((x-g.ox)/g.cs),cy=Math.floor((y-g.oy)/g.cs);if(cx<0||cy<0||cx>=s.N||cy>=s.N)return;const c=s.g[cy][cx];if(c.lock){buzz(20);return}c.r=(c.r+1)%4;snd('chop')},
  draw(s,c,W,H,now){mgBg(c,W,H,'#1b2740','#2c3a58');const g=this.geo(s,W,H),cs=g.cs;
    c.fillStyle='rgba(255,255,255,.06)';c.fillRect(g.ox-6,g.oy-6,cs*s.N+12,cs*s.N+12);
    for(let y=0;y<s.N;y++)for(let x=0;x<s.N;x++){const cl=s.g[y][x],px=g.ox+x*cs,py=g.oy+y*cs,o=hpOpen(cl);
      c.fillStyle=cl.lock?'#2f4a6e':'#e9eef5';c.fillRect(px+2,py+2,cs-4,cs-4);
      const cx=px+cs/2,cy=py+cs/2,hw=cs*.17;
      const arm=(d,col)=>{c.fillStyle=col;if(d===0)c.fillRect(cx-hw,py+2,hw*2,cs/2-2+hw);if(d===2)c.fillRect(cx-hw,cy-hw,hw*2,cs/2-2+hw);if(d===3)c.fillRect(px+2,cy-hw,cs/2-2+hw,hw*2);if(d===1)c.fillRect(cx-hw,cy-hw,cs/2-2+hw,hw*2)};
      for(let d=0;d<4;d++)if(o&HP_BIT[d])arm(d,'#8a94a6');
      if(cl.w>0){c.save();c.beginPath();c.rect(px,py,cs,cs);c.clip();for(let d=0;d<4;d++)if(o&HP_BIT[d]){c.globalAlpha=Math.min(1,cl.w*1.4);arm(d,'#3d93db')}c.restore();c.globalAlpha=1}
      c.fillStyle=cl.w>0?'#3d93db':'#6b7486';c.beginPath();c.arc(cx,cy,hw*1.1,0,7);c.fill()}
    // 消火栓と火事の家
    const hy=g.oy+s.sr*cs+cs/2;c.fillStyle='#e5432a';c.fillRect(g.ox-34,hy-18,22,30);c.beginPath();c.arc(g.ox-23,hy-18,11,Math.PI,0);c.fill();c.fillStyle='#fff';c.font='900 11px sans-serif';c.textAlign='center';
    c.fillText(s.flowing?'放水中':'放水！',g.ox-23,hy+28);c.fillStyle='#e5432a';c.fillRect(g.ox-12,hy-cs*.17,12,cs*.34);
    const ty=g.oy+s.tr*cs+cs/2,tx=g.ox+cs*s.N;c.fillStyle='#e5432a';c.fillRect(tx,ty-cs*.17,10,cs*.34);c.fillStyle='#f3ede2';c.fillRect(tx+10,ty-16,30,28);c.fillStyle='#7d5b3f';c.beginPath();c.moveTo(tx+6,ty-16);c.lineTo(tx+25,ty-32);c.lineTo(tx+44,ty-16);c.fill();
    c.font='22px sans-serif';c.fillText('🔥',tx+25+Math.sin(now/120)*2,ty-30);
    if(!s.flowing&&!(s.next>0)){c.fillStyle='#ffd84d';c.font='900 18px "Dela Gothic One",sans-serif';c.fillText(`水が出るまで ${Math.ceil(s.wait)}秒`,W/2,g.oy-14)}
    mgFx(s,c,1/60)}};

/* ---------- ② 消防グッズ合体ゲーム ---------- */
const MZ=[{e:'💧',n:'しずく'},{e:'🪣',n:'バケツ'},{e:'🧯',n:'消火器'},{e:'⛑️',n:'ヘルメット'},{e:'🧑‍🚒',n:'消防団員'},{e:'🚑',n:'救急車'},{e:'🚒',n:'ポンプ車'},{e:'🚁',n:'ヘリ'},{e:'🏢',n:'消防署'}];
const MZ_PT=[1,3,6,10,15,21,28,36,45,100];
const mzR=(s,l)=>s.u*(15+l*8.5);
const mzGame={short:'合体',name:'消防グッズ合体',icon:'🚒',time:75,desc:'同じ道具をくっつけて、もっと大きい道具に合体',
  how:'タップした場所に道具を落とすよ。同じもの同士がぶつかると合体！ しずく→バケツ→消火器→…→ポンプ車→ヘリ→消防署をめざそう。上の赤い線をこえて積もるとおわり',
  diffs:{e:{maxL:2,wide:1,g:900,note:'小さい道具だけが落ちてくる・箱が広い'},n:{maxL:3,wide:.92,g:1000,note:'消火器まで落ちてくる'},h:{maxL:4,wide:.8,g:1150,note:'大きい道具も落ちてくる・箱がせまい'}},
  init(D,W,H){const bw=Math.min(W-24,420)*D.wide,top=mgTop0()+70;const s={D,bs:[],x0:(W-bw)/2,x1:(W+bw)/2,top,bot:H-24,u:bw/380,cur:Math.random()*Math.min(3,D.maxL+1)|0,nx:Math.random()*Math.min(3,D.maxL+1)|0,aim:W/2,cool:0,over:0,best:0,merges:0,fx:[]};s.line=top+70;return s},
  info:s=>`次 ${MZ[s.nx].e}`,summary:s=>`いちばん大きい道具：${MZ[s.best].e} ${MZ[s.best].n}・合体 ${s.merges}回`,
  drop(s){if(s.cool>0)return;const r=mzR(s,s.cur),x=Math.max(s.x0+r,Math.min(s.x1-r,s.aim));s.bs.push({x,y:s.line-40,vx:0,vy:0,l:s.cur,r,age:0});s.cur=s.nx;s.nx=Math.random()*(s.D.maxL+1)|0;s.cool=.45;snd('pick')},
  down(s,x){s.aim=x},move(s,x){s.aim=x},up(s,x){s.aim=x;this.drop(s)},
  update(s,dt,m){s.cool-=dt;const g=s.D.g;
    for(let k=0;k<2;k++){const h=dt/2;
      for(const b of s.bs){b.age+=h;b.vy+=g*h;b.x+=b.vx*h;b.y+=b.vy*h;b.vx*=.995;
        if(b.x-b.r<s.x0){b.x=s.x0+b.r;b.vx*=-.3}if(b.x+b.r>s.x1){b.x=s.x1-b.r;b.vx*=-.3}if(b.y+b.r>s.bot){b.y=s.bot-b.r;b.vy*=-.2;b.vx*=.9}}
      for(let it=0;it<4;it++)for(let i=0;i<s.bs.length;i++)for(let j=i+1;j<s.bs.length;j++){const a=s.bs[i],b=s.bs[j];if(a.dead||b.dead)continue;
        const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,ov=a.r+b.r-d;if(ov<=0)continue;
        if(a.l===b.l){a.dead=b.dead=true;const nl=a.l+1;if(nl<MZ.length){const nb={x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:(a.vx+b.vx)/2,vy:Math.min(a.vy,b.vy)-60,l:nl,r:mzR(s,nl),age:1};s.bs.push(nb);s.best=Math.max(s.best,nl)}
          mgAdd(MZ_PT[nl]||100);s.merges++;mgFloat(s,(a.x+b.x)/2,(a.y+b.y)/2,'+'+(MZ_PT[nl]||100),nl>=6?'#ffd84d':'#fff');snd(nl>=5?'buy':'kill');if(nl>=5)buzz(40);continue}
        const nx=dx/d,ny=dy/d,ma=a.r*a.r,mb=b.r*b.r,ta=mb/(ma+mb),tb=ma/(ma+mb);a.x-=nx*ov*ta;a.y-=ny*ov*ta;b.x+=nx*ov*tb;b.y+=ny*ov*tb;
        const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const imp=rv*1.2;a.vx+=nx*imp*ta;a.vy+=ny*imp*ta;b.vx-=nx*imp*tb;b.vy-=ny*imp*tb}}
      s.bs=s.bs.filter(b=>!b.dead)}
    const high=s.bs.some(b=>b.age>1.2&&b.y-b.r<s.line&&Math.abs(b.vy)<120);s.over=high?s.over+dt:0;if(s.over>2)m.why='あふれた！'},
  draw(s,c,W,H,now){mgBg(c,W,H,'#2a3550','#1b2740');
    c.fillStyle='rgba(255,255,255,.08)';c.fillRect(s.x0,s.top,s.x1-s.x0,s.bot-s.top);c.strokeStyle='#cfd8e6';c.lineWidth=4;c.beginPath();c.moveTo(s.x0,s.top);c.lineTo(s.x0,s.bot);c.lineTo(s.x1,s.bot);c.lineTo(s.x1,s.top);c.stroke();
    c.strokeStyle=s.over>0?`rgba(229,67,42,${.6+.4*Math.sin(now/80)})`:'rgba(229,67,42,.7)';c.setLineDash([8,6]);c.lineWidth=2;c.beginPath();c.moveTo(s.x0,s.line);c.lineTo(s.x1,s.line);c.stroke();c.setLineDash([]);
    const em=(l,x,y,r)=>{c.fillStyle=['#dbeeff','#ffe9c2','#ffd1c9','#fff1b8','#ffd9b0','#e8f4ff','#ffd2cc','#e0e7ff','#fff'][l];c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle='rgba(27,39,64,.35)';c.lineWidth=2;c.stroke();c.font=`${Math.round(r*1.2)}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(MZ[l].e,x,y+r*.06);c.textBaseline='alphabetic'};
    for(const b of s.bs)em(b.l,b.x,b.y,b.r);
    if(mg.st==='play'||mg.st==='count'){const r=mzR(s,s.cur),x=Math.max(s.x0+r,Math.min(s.x1-r,s.aim));c.globalAlpha=s.cool>0?.4:1;c.strokeStyle='rgba(255,255,255,.25)';c.setLineDash([4,6]);c.beginPath();c.moveTo(x,s.line-40);c.lineTo(x,s.bot);c.stroke();c.setLineDash([]);em(s.cur,x,s.line-40,r);c.globalAlpha=1}
    c.fillStyle='#fff';c.font='900 12px sans-serif';c.textAlign='left';c.fillText('合体のじゅんばん：'+MZ.map(z=>z.e).join(''),Math.max(8,s.x0),s.top-8);
    mgFx(s,c,1/60)}};

/* ---------- ③ 土嚢テトリス ---------- */
const TT_SH=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[0,1],[1,1]],[[1,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[1,1],[2,1]],[[2,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[1,0],[1,1],[2,1]]];
const TT_C=['#b9925c','#a8834f','#c49b63','#9c7a4a','#b08856','#c2a06d','#a27c48'];
const ttGame={short:'土嚢',name:'土嚢テトリス',icon:'🧱',time:90,desc:'水位が上がる前に、土嚢で堤防を完成させる',
  how:'下のボタンで土嚢を動かして積もう。横一列そろうと堤防が完成して消えるよ。ときどき水位が上がって、下から水の列がせまってくる！',
  diffs:{e:{fall:.8,rise:20,note:'ゆっくり落ちる・水位はたまに上がる'},n:{fall:.55,rise:12,note:'ふつうの速さ'},h:{fall:.3,rise:7,note:'速い！ 水位がどんどん上がる'}},
  ctlHtml:'<button data-mgc="l">◀</button><button data-mgc="r">▶</button><button data-mgc="rot">⟳</button><button data-mgc="drop">⬇</button>',
  init(D,W,H){const s={D,C:9,R:16,b:[],fx:[],lines:0,water:0,riseT:D.rise,fallT:D.fall};for(let y=0;y<s.R;y++)s.b.push(Array(s.C).fill(0));this.spawn(s);return s},
  info:s=>`堤防 ${s.lines}列`,summary:s=>`完成させた堤防 ${s.lines}列・止めた浸水 ${s.water}列`,
  geo(s,W,H){const top=mgTop0()+20,cs=Math.floor(Math.min((W-40)/s.C,(H-top-110)/s.R));return {cs,ox:Math.round((W-cs*s.C)/2),oy:top}},
  cells(p){return p.sh.map(([x,y])=>{let a=x,b=y;for(let i=0;i<p.r;i++){const t=a;a=-b;b=t}return [a,b]})},
  fits(s,p,ox,oy,r){const q={...p,r};const cs=this.cells(q);const mnx=Math.min(...cs.map(c=>c[0])),mny=Math.min(...cs.map(c=>c[1]));
    return cs.every(([a,b])=>{const x=ox+a-mnx,y=oy+b-mny;return x>=0&&x<s.C&&y<s.R&&(y<0||!s.b[y][x])})},
  put(s,p){const cs=this.cells(p);const mnx=Math.min(...cs.map(c=>c[0])),mny=Math.min(...cs.map(c=>c[1]));return cs.map(([a,b])=>[p.x+a-mnx,p.y+b-mny])},
  spawn(s){const i=Math.random()*7|0;s.p={sh:TT_SH[i],c:TT_C[i],r:0,x:3,y:0};if(!this.fits(s,s.p,s.p.x,s.p.y,0))mg.why='土嚢が積みあがった！'},
  lock(s){for(const [x,y] of this.put(s,s.p)){if(y<0){mg.why='土嚢が積みあがった！';return}s.b[y][x]=s.p.c}snd('chop');
    let n=0,w=0;for(let y=s.R-1;y>=0;y--){if(s.b[y].every(v=>v)){if(s.b[y].some(v=>v==='w'))w++;s.b.splice(y,1);s.b.unshift(Array(s.C).fill(0));n++;y++}}
    if(n){s.lines+=n;s.water+=w;const pt=[0,100,300,500,800][n]+w*50;mgAdd(pt);const g=this.geo(s,innerWidth,innerHeight);mgFloat(s,innerWidth/2,g.oy+g.cs*s.R/2,w?`浸水を止めた！ +${pt}`:`堤防完成！ +${pt}`,'#ffd84d');snd('kill');buzz(40)}
    this.spawn(s)},
  rise(s){const top=s.b.shift();if(top.some(v=>v)){mg.why='水があふれた！';return}const gap=Math.random()*s.C|0;s.b.push(Array(s.C).fill('w').map((v,i)=>i===gap?0:v));
    if(!this.fits(s,s.p,s.p.x,s.p.y,s.p.r))s.p.y--;const g=this.geo(s,innerWidth,innerHeight);mgFloat(s,innerWidth/2,g.oy+g.cs*s.R-20,'水位が上がった！','#7cc6ff');snd('hurt')},
  update(s,dt,m){s.riseT-=dt;if(s.riseT<=0){s.riseT=s.D.rise;this.rise(s);if(m.why)return}
    s.fallT-=dt;if(s.fallT<=0){s.fallT=s.D.fall;if(this.fits(s,s.p,s.p.x,s.p.y+1,s.p.r))s.p.y++;else this.lock(s)}},
  ctl(s,a){const p=s.p;if(a==='l'&&this.fits(s,p,p.x-1,p.y,p.r))p.x--;else if(a==='r'&&this.fits(s,p,p.x+1,p.y,p.r))p.x++;
    else if(a==='rot'){const nr=(p.r+1)%4;for(const k of [0,-1,1,-2,2])if(this.fits(s,p,p.x+k,p.y,nr)){p.x+=k;p.r=nr;break}}
    else if(a==='drop'){while(this.fits(s,p,p.x,p.y+1,p.r))p.y++;this.lock(s);mgAdd(2)}},
  down(s,x,y){const g=this.geo(s,innerWidth,innerHeight);if(y>g.oy+g.cs*s.R)return;this.ctl(s,x<innerWidth*.35?'l':x>innerWidth*.65?'r':'rot')},
  draw(s,c,W,H,now){mgBg(c,W,H,'#24324d','#1b2740');const g=this.geo(s,W,H),cs=g.cs;
    c.fillStyle='rgba(255,255,255,.07)';c.fillRect(g.ox,g.oy,cs*s.C,cs*s.R);
    const blk=(x,y,col)=>{if(col==='w'){c.fillStyle='#3d93db';c.fillRect(g.ox+x*cs+1,g.oy+y*cs+1,cs-2,cs-2);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(g.ox+x*cs+3,g.oy+y*cs+4+Math.sin(now/300+x)*2,cs-6,3);return}
      c.fillStyle=col;c.fillRect(g.ox+x*cs+1,g.oy+y*cs+1,cs-2,cs-2);c.strokeStyle='rgba(60,40,20,.5)';c.lineWidth=1.5;c.strokeRect(g.ox+x*cs+3,g.oy+y*cs+3,cs-6,cs-6);c.beginPath();c.moveTo(g.ox+x*cs+cs*.3,g.oy+y*cs+cs*.25);c.lineTo(g.ox+x*cs+cs*.5,g.oy+y*cs+cs*.4);c.lineTo(g.ox+x*cs+cs*.7,g.oy+y*cs+cs*.25);c.stroke()};
    for(let y=0;y<s.R;y++)for(let x=0;x<s.C;x++)if(s.b[y][x])blk(x,y,s.b[y][x]);
    if(s.p&&!mg.why){let gy=s.p.y;while(this.fits(s,s.p,s.p.x,gy+1,s.p.r))gy++;c.globalAlpha=.25;for(const [x,y] of this.put(s,{...s.p,y:gy}))if(y>=0)blk(x,y,s.p.c);c.globalAlpha=1;for(const [x,y] of this.put(s,s.p))if(y>=0)blk(x,y,s.p.c)}
    c.fillStyle='#7cc6ff';c.font='900 12px sans-serif';c.textAlign='center';c.fillText(`水位が上がるまで ${Math.max(0,Math.ceil(s.riseT))}秒`,W/2,g.oy+cs*s.R+16);
    mgFx(s,c,1/60)}};

/* ---------- ④ はしご車スタック ---------- */
const stGame={short:'はしご',name:'はしご車スタック',icon:'🪜',time:0,desc:'はしごをタイミングよく積んで、高いビルの人を救助',
  how:'左右に動くはしごを、下のはしごにピッタリ重なるときにタップ！ ずれた分は削れるよ。10段ごとに窓の人を救助できる。はしごが外れたらおわり',
  diffs:{e:{v:130,acc:2,note:'ゆっくり動く'},n:{v:200,acc:5,note:'ふつうの速さ・だんだん速くなる'},h:{v:280,acc:9,note:'速い！ どんどん加速する'}},
  init(D,W,H){const w0=Math.min(W*.5,200),bh=24;const s={D,W,bh,w0,st:[{x:W/2-w0/2,w:w0}],cur:{x:0,w:w0,dir:1},v:D.v,cam:0,fall:[],perfect:0,combo:0,saved:0,fx:[]};return s},
  info:s=>`${s.st.length-1}段`,summary:s=>`${s.st.length-1}段・ピッタリ ${s.perfect}回・救助 ${s.saved}人`,
  update(s,dt,m){const c=s.cur;c.x+=c.dir*s.v*dt;if(c.x<-c.w*.3){c.x=-c.w*.3;c.dir=1}if(c.x+c.w>s.W+c.w*.3){c.x=s.W+c.w*.3-c.w;c.dir=-1}
    const target=Math.max(0,(s.st.length-6)*s.bh);s.cam+=(target-s.cam)*Math.min(1,dt*5);
    for(const f of s.fall){f.vy+=900*dt;f.y+=f.vy*dt}s.fall=s.fall.filter(f=>f.y<2000)},
  down(s){const c=s.cur,p=s.st[s.st.length-1];let x0=Math.max(c.x,p.x),x1=Math.min(c.x+c.w,p.x+p.w);const n=s.st.length;
    if(x1-x0<=0){s.fall.push({x:c.x,w:c.w,y:this.yOf(s,n),vy:0});mg.why='はしごが外れた！';snd('hurt');buzz(120);return}
    if(Math.abs(c.x-p.x)<5){x0=p.x;x1=p.x+p.w;s.combo++;s.perfect++;mgAdd(5);snd('buy');const W=s.W;mgFloat(s,W/2,this.yOf(s,n)-20,s.combo>=3?`ピッタリ×${s.combo}！`:'ピッタリ！','#ffd84d');
      if(s.combo>=3){const g=Math.min(8,s.w0-(x1-x0));x0-=g/2;x1+=g/2}}
    else{s.combo=0;snd('chop');const cutL=c.x<x0?{x:c.x,w:x0-c.x}:null,cutR=c.x+c.w>x1?{x:x1,w:c.x+c.w-x1}:null;for(const k of [cutL,cutR])if(k&&k.w>0)s.fall.push({...k,y:this.yOf(s,n),vy:0})}
    s.st.push({x:x0,w:x1-x0});mgAdd(10);buzz(15);const fl=s.st.length-1;
    if(fl%10===0){s.saved++;mgAdd(50);mgFloat(s,s.W/2,this.yOf(s,n)-40,`${fl}階の人を救助！ +50`,'#7cf0a8');snd('kill');buzz([40,30,40])}
    s.v+=s.D.acc;const dir=Math.random()<.5?1:-1,w=x1-x0;s.cur={x:dir>0?-w*.3:s.W-w*.7,w,dir}},
  yOf(s,i){return innerHeight-110-i*s.bh+s.cam},
  draw(s,c,W,H,now){mgBg(c,W,H,'#5d8ccc','#cfe3f7');
    // ビル（窓と救助を待つ人）
    const bx=W-70;c.fillStyle='#8a94a6';c.fillRect(bx,-2000,80,H+2100);for(let f=1;f<=60;f++){const y=this.yOf(s,f);if(y<-30||y>H)continue;c.fillStyle='#dfe7f2';c.fillRect(bx+12,y-14,22,16);c.fillRect(bx+44,y-14,22,16);
      if(f%10===0){c.fillStyle='#e5432a';c.font='900 11px sans-serif';c.textAlign='center';c.fillText(f+'階',bx+40,y+14);if(f>s.st.length-1){c.font='18px sans-serif';c.fillText('🙋',bx+23,y-1)}}}
    // はしご車
    const gy=this.yOf(s,0)+s.bh;c.fillStyle='#e5432a';c.fillRect(W/2-90,gy,180,40);c.fillStyle='#1b2740';c.beginPath();c.arc(W/2-55,gy+42,13,0,7);c.arc(W/2+55,gy+42,13,0,7);c.fill();c.fillStyle='#6d7a8f';c.fillRect(0,gy+52,W,H);
    const rung=(x,y,w,a)=>{c.globalAlpha=a==null?1:a;c.fillStyle='#d9dfe8';c.fillRect(x,y,w,s.bh-3);c.fillStyle='#9aa6b8';c.fillRect(x,y,w,4);c.fillRect(x,y+s.bh-7,w,4);for(let k=x+10;k<x+w-4;k+=16)c.fillRect(k,y,4,s.bh-3);c.globalAlpha=1};
    s.st.forEach((b,i)=>{const y=this.yOf(s,i);if(y>-40&&y<H)rung(b.x,y,b.w)});
    if(!mg.why&&(mg.st==='play'||mg.st==='count'))rung(s.cur.x,this.yOf(s,s.st.length),s.cur.w);
    for(const f of s.fall)rung(f.x,f.y,f.w,.7);
    mgFx(s,c,1/60)}};

const MG={hose:hpGame,merge:mzGame,sand:ttGame,ladder:stGame};
// メニュー：ヒノコたたきのボタンを「ミニゲーム」入口に
document.addEventListener('click',e=>{if(e.target.closest('[data-act=mghub]')){closeModal();mgHub()}},true);
menu=(o=>function(){o();if(S.ta)return;const b=document.querySelector('.modal [data-act=hk]');if(!b)return;b.dataset.act='mghub';b.innerHTML='<b>🎮 ミニゲーム（5種類）</b><small>ヒノコたたき・ホースつなぎ・合体・土嚢テトリス・はしご車</small>'})(menu);
// ヒノコたたきの画面からもミニゲーム一覧へ
hkIntro=(o=>function(){o();const p=document.querySelector('#hkPanel .hkbox');if(!p)return;const c=p.querySelector('[data-hk=close]');if(c)c.insertAdjacentHTML('beforebegin','<button class="btn sub" data-hk="hub">← ほかのミニゲーム</button>')})(hkIntro);
document.addEventListener('click',e=>{if(e.target.closest('[data-hk=hub]')){hkClose();mgHub()}},true);
(()=>{const st=document.createElement('style');st.textContent=`
#mg{position:fixed;inset:0;z-index:61;touch-action:none;user-select:none;-webkit-user-select:none}#mg[hidden]{display:none}
#mgCv{position:absolute;inset:0;display:block}
#mgHud{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;align-items:center;gap:10px;padding:0 14px;pointer-events:none;font-family:var(--display);color:#fff}
#mgScore{font-size:28px;text-shadow:0 2px 0 #1b2740}#mgInfo{flex:1;font-size:16px;color:#ffd84d;text-shadow:0 2px 0 #1b2740}
#mgTime{font-size:36px;min-width:50px;text-align:right;text-shadow:0 2px 0 #1b2740}#mgTime.low{color:#ff6b57;animation:hkp .5s infinite alternate}
#mgBar{position:absolute;left:14px;right:14px;top:calc(env(safe-area-inset-top,0px) + 56px);height:8px;border-radius:99px;background:rgba(255,255,255,.2);overflow:hidden;pointer-events:none}#mgBar i{display:block;height:100%;background:#ffd84d;transform-origin:left center}
#mgPanel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,14,26,.55);overflow:auto}#mgPanel[hidden]{display:none}
#mgCtl{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);display:flex;gap:10px;justify-content:center;padding:0 12px}#mgCtl[hidden]{display:none}
#mgCtl button{flex:1;max-width:96px;height:64px;border:0;border-radius:16px;background:rgba(255,255,255,.92);font-size:28px;font-weight:900;color:#1b2740;box-shadow:0 4px 0 rgba(0,0,0,.25);touch-action:manipulation}
#mgCtl button:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.25)}
.btn.mgg{background:#24324d;text-align:left}.btn.mgg small{display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:12px;font-weight:700;opacity:.9;letter-spacing:0}
.mgbox .btn small{display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:12px;font-weight:700;opacity:.9;letter-spacing:0}`;document.head.appendChild(st)})();
// ?mini で開くとミニゲーム一覧、?mini=hinoko|hose|merge|sand|ladder で直接
(()=>{const m=location.search.match(/[?&]mini(?:=([a-z]+))?/);if(!m)return;setTimeout(()=>{hkClose();const k=m[1];if(k==='hinoko')hkIntro();else if(k&&MG[k])mgIntro(MG[k]);else mgHub()},400)})();

