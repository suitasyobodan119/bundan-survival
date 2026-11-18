/* ===================== 🎍 出初式イベント（2027/1/1〜1/18）＋ミニゲーム「出初式 一斉放水」 ===================== */
// 期間外は何も出ない。確認用：?dezome で期間外でもON、?dezome=0 でOFF
const DZ_FROM=Date.parse('2027-01-01T00:00:00+09:00'),DZ_TO=Date.parse('2027-01-19T00:00:00+09:00');
const DZ=()=>{const q=location.search;if(/[?&]dezome=0/.test(q))return false;if(/[?&]dezome/.test(q))return true;const n=Date.now();return n>=DZ_FROM&&n<DZ_TO};
const DZ_TIPS=['出初式は、新しい年のはじめに消防の仲間が集まって、1年の安全をちかう行事だよ','出初式では、ポンプ車の放水や行進などが見られるよ（内容は地域によってちがいます）','冬は火事が多い季節。ストーブのまわりに、燃えやすい物を置かないでね','お正月も、消防団は町の安全を見守っています','火事を見つけたら、大きな声で知らせて、119番に通報しよう'];
const DZ_COL=['#e5432a','#2f8fe0','#f2b705','#3fae5a'];
const DZ_PITCH=[74,76,79,81]; // レ・ミ・ソ・ラ（お正月っぽい音階）
function dzKadomatsu(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='rgba(40,60,90,.18)';c.beginPath();c.ellipse(0,4,18,5,0,0,7);c.fill();
  c.fillStyle='#4f8a3a';for(const [dx,h] of [[-6,40],[0,48],[6,36]]){c.beginPath();c.moveTo(dx-3.5,-4);c.lineTo(dx-3.5,-h+5);c.lineTo(dx+3.5,-h);c.lineTo(dx+3.5,-4);c.fill();c.fillStyle='#8cc96b';c.fillRect(dx-3.5,-h+2,7,3);c.fillStyle='#4f8a3a'}
  c.fillStyle='#2f6b2a';for(const a of [-1,1]){c.beginPath();c.ellipse(a*11,-10,9,4,a*.6,0,7);c.fill()}
  c.fillStyle='#c8a36a';c.fillRect(-13,-10,26,14);c.strokeStyle='#8a6a2a';c.lineWidth=1.5;for(let i=-9;i<=9;i+=6){c.beginPath();c.moveTo(i,-10);c.lineTo(i,4);c.stroke()}
  c.fillStyle='#e5432a';c.fillRect(-13,-4,26,2.5);c.restore()}
/* --- 本編：詰所に門松、空はお正月の金色 --- */
drawPads=(o=>function(t){o(t);if(!DZ())return;const sp=PADMAP.sell;dzKadomatsu(cx,sp.x-74,sp.y-6,1);dzKadomatsu(cx,sp.x+74,sp.y-6,1)})(drawPads);
drawWeather=(o=>function(t){o(t);if(!DZ()||isNight())return;cx.fillStyle='rgba(255,215,120,.07)';cx.fillRect(0,0,W,H)})(drawWeather);
update=(o=>function(dt){o(dt);if(!DZ()||!S.started||S.ta)return;const d=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
  if(S.dzDay!==d&&!paused){S.dzDay=d;save();pop('🎍 あけましておめでとう！','1/18まで出初式イベント。ミニゲーム「出初式 一斉放水」で遊べるよ（最初の画面・MENU）')}})(update);
/* --- ミニゲーム「出初式 一斉放水」：落ちてくる合図に合わせてタップ。全員そろうと「一斉！」 --- */
const dzGame={short:'出初式',name:'出初式 一斉放水',icon:'🎍',time:30,rhythm:true,desc:'【1/18まで】太鼓のリズムに合わせてタップ！ みんなで放水をそろえよう',
  how:'上から落ちてくる「合図」が線に重なった瞬間に、その列をタップ！ ぴったりだと「ピッタリ！」。何人かいっしょの合図を全部そろえると「一斉！」でボーナス',
  diffs:{e:{L:3,bpm:92,fall:2,note:'3人・ゆっくり'},n:{L:4,bpm:108,fall:1.6,note:'4人・ときどき一斉'},h:{L:4,bpm:126,fall:1.2,note:'速い！ 一斉がたくさん'}},
  chart(D,dk){const r=mulberry(dk==='h'?777:dk==='n'?555:333),b=60/D.bpm,out=[];let t=2.2,bar=0;
    while(t<D.fall+27.5){for(let k=0;k<4;k++){const tt=t+k*b,first=k===0;
        if(dk==='e'){if(first&&bar%4===3)out.push({t:tt,ln:[0,2]});else if(r()<.85)out.push({t:tt,ln:[r()*D.L|0]})}
        else if(dk==='n'){if(first&&bar%2===1){const a=r()*D.L|0;out.push({t:tt,ln:[a,(a+2)%D.L]})}else{out.push({t:tt,ln:[r()*D.L|0]});if(k===3&&r()<.4)out.push({t:tt+b/2,ln:[r()*D.L|0]})}}
        else{if(first&&bar%2===0){const a=r()*D.L|0;out.push({t:tt,ln:r()<.4?[0,1,2,3]:[a,(a+1)%D.L,(a+3)%D.L].slice(0,2+(r()<.5))})}else{out.push({t:tt,ln:[r()*D.L|0]});if(r()<.55)out.push({t:tt+b/2,ln:[r()*D.L|0]})}}}
      t+=4*b;bar++}
    const end=out.length?out[out.length-1].t+b:t;out.push({t:end,ln:[...Array(D.L).keys()],fin:true});
    return out.filter(n=>n.t-D.fall<29.6)},
  init(D,W,H,m){const ns=[];for(const c of this.chart(D,m.dk))for(const ln of c.ln)ns.push({t:c.t,ln,g:c,st:0});
    return {D,ns,time:0,beat:2.2,bn:0,arcs:[],fx:[],combo:0,best:0,pf:0,gd:0,ms:0,isse:0,flash:[0,0,0,0],judge:null}},
  geo(s,W,H){const L=s.D.L,lw=Math.min(110,W/L),x0=(W-lw*L)/2;return {L,lw,x0,hy:H-190,top:118}},
  info:s=>s.combo>=5?`${s.combo}コンボ！`:'',
  summary:s=>`ピッタリ ${s.pf}・OK ${s.gd}・ミス ${s.ms}・一斉 ${s.isse}回・最大 ${s.best}コンボ`,
  tip:()=>'🎍 出初式まめちしき：'+DZ_TIPS[Math.random()*DZ_TIPS.length|0],
  update(s,dt,m){s.time+=dt;const b=60/s.D.bpm;
    while(s.time>=s.beat){if(AC&&!S.muted){const t=AC.currentTime+.005,k=s.bn%4;if(k===0)INST.taiko(t,AC.destination,.3);else if(k===2)INST.taiko(t,AC.destination,.18);else INST.rim(t,AC.destination)}s.beat+=b;s.bn++}
    for(const n of s.ns)if(!n.st&&s.time-n.t>.17){n.st=-1;s.ms++;s.combo=0;s.judge={t:'ミス',c:'#9aa3b2',a:0,ln:n.ln}}
    s.arcs=s.arcs.filter(a=>(a.t+=dt)<1.4);for(let i=0;i<4;i++)s.flash[i]=Math.max(0,s.flash[i]-dt*3);if(s.judge)s.judge.a+=dt},
  down(s,px,py){const W=innerWidth,H=innerHeight,g=this.geo(s,W,H),ln=Math.floor((px-g.x0)/g.lw);if(ln<0||ln>=g.L)return;
    let best=null,bd=1;for(const n of s.ns){if(n.st||n.ln!==ln)continue;const d=Math.abs(n.t-s.time);if(d<bd){bd=d;best=n}}
    s.flash[ln]=1;
    if(!best||bd>.17){if(best&&bd<.4){s.combo=0;s.judge={t:'はやい！',c:'#9aa3b2',a:0,ln}}return}
    const pf=bd<.075;best.st=1;s.combo++;s.best=Math.max(s.best,s.combo);if(pf)s.pf++;else s.gd++;
    let pts=(pf?10:5)+Math.floor(s.combo/10)*2;
    s.arcs.push({ln,t:0,c:DZ_COL[ln],big:pf});
    if(AC&&!S.muted)INST.lead('flute',mf(DZ_PITCH[ln]+(best.g.fin?12:0)),AC.currentTime+.005,.35,pf?.09:.06,AC.destination);
    const grp=s.ns.filter(n=>n.g===best.g);
    if(grp.length>1&&grp.every(n=>n.st===1)){pts+=best.g.fin?40:15;s.isse++;s.judge={t:best.g.fin?'フィナーレ 一斉放水！':'一斉！',c:'#ffd84a',a:0,ln:-1,big:true};mgFloat(s,innerWidth/2,g.hy-150,best.g.fin?'+40':'+15','#ffd84a');buzz([30,30,30]);if(AC&&!S.muted)snd('fanfare')}
    else s.judge={t:pf?'ピッタリ！':'OK',c:pf?'#fff':'#cfe8ff',a:0,ln};
    mgAdd(pts);buzz(12)},
  draw(s,c,W,H,now){const g=this.geo(s,W,H);
    const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#5fb4ff');sky.addColorStop(.62,'#bfe3ff');sky.addColorStop(1,'#fff6df');c.fillStyle=sky;c.fillRect(0,0,W,H);
    c.fillStyle='#fff';c.globalAlpha=.85;for(const [x,y,r] of [[.18,.22,26],[.26,.21,18],[.74,.3,30],[.84,.29,20]]){c.beginPath();c.arc(W*x,H*y,r,0,7);c.arc(W*x+r,H*y+4,r*.8,0,7);c.fill()}c.globalAlpha=1;
    // 紅白幕
    const my=H-96;for(let x=0;x<W;x+=26){c.fillStyle=(x/26|0)%2?'#e5432a':'#fff';c.fillRect(x,my,26,40)}c.fillStyle='#d8c9a6';c.fillRect(0,my+40,W,H-my-40);
    dzKadomatsu(c,16,H-10,.85);dzKadomatsu(c,W-16,H-10,.85);
    // 放水のアーチ
    for(const a of s.arcs){const x0=g.x0+g.lw*(a.ln+.5),p=Math.min(1,a.t/.5),fade=a.t>.9?1-(a.t-.9)/.5:1,top=g.top+(a.big?10:70),dir=(a.ln+.5)<g.L/2?1:-1,span=W*.5;
      c.strokeStyle=a.c;c.globalAlpha=Math.max(0,fade)*.85;c.lineWidth=a.big?9:6;c.lineCap='round';c.beginPath();
      for(let i=0;i<=24*p;i++){const u=i/24,x=x0+dir*u*span,y=g.hy+30-(4*u*(1-u))*(g.hy+30-top)*1.0;if(i===0)c.moveTo(x,y);else c.lineTo(x,y)}c.stroke();
      c.globalAlpha=Math.max(0,fade)*.5;c.fillStyle='#fff';for(let i=0;i<6;i++){const u=Math.min(p,(i+1)/7),x=x0+dir*u*span+Math.sin(now/90+i)*3,y=g.hy+30-(4*u*(1-u))*(g.hy+30-top);c.beginPath();c.arc(x,y,2.5,0,7);c.fill()}c.globalAlpha=1}
    // 列と判定ライン
    for(let i=0;i<g.L;i++){const x=g.x0+g.lw*i;c.fillStyle=`rgba(255,255,255,${.18+s.flash[i]*.3})`;c.fillRect(x+4,g.top,g.lw-8,g.hy-g.top+26);
      c.strokeStyle=DZ_COL[i];c.lineWidth=5;c.globalAlpha=.9;c.beginPath();c.arc(x+g.lw/2,g.hy,24,0,7);c.stroke();c.globalAlpha=1}
    // 合図（落ちてくる水玉）
    for(const n of s.ns){if(n.st)continue;const p=1-(n.t-s.time)/s.D.fall;if(p<0)continue;const x=g.x0+g.lw*(n.ln+.5),y=g.top+(g.hy-g.top)*p;
      if(n.g.ln.length>1){c.fillStyle='rgba(255,216,74,.55)';c.beginPath();c.arc(x,y,27,0,7);c.fill()}
      c.fillStyle=DZ_COL[n.ln];c.beginPath();c.arc(x,y,19,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(x-6,y-6,5,0,7);c.fill()}
    // 団員（ホースを持って並ぶ）
    for(let i=0;i<g.L;i++){const x=g.x0+g.lw*(i+.5),y=g.hy+58,j=s.flash[i]*4;
      c.fillStyle='rgba(40,60,90,.2)';c.beginPath();c.ellipse(x,y+24,16,5,0,0,7);c.fill();
      c.fillStyle='#22355c';c.fillRect(x-11,y-6-j,22,28);c.fillStyle='#f28c28';c.fillRect(x-11,y+4-j,22,3);
      c.fillStyle='#ffd8b5';c.beginPath();c.arc(x,y-14-j,9,0,7);c.fill();c.fillStyle='#22355c';c.beginPath();c.arc(x,y-17-j,9.5,Math.PI,0);c.fill();c.fillRect(x-11,y-18-j,22,3);
      c.strokeStyle='#d8dde6';c.lineWidth=5;c.beginPath();c.moveTo(x-12,y+20);c.quadraticCurveTo(x-6,y-2-j,x+2,y-24-j);c.stroke();c.fillStyle=DZ_COL[i];c.beginPath();c.arc(x+2,y-26-j,4,0,7);c.fill()}
    // 判定の文字
    if(s.judge&&s.judge.a<.7){const j=s.judge,x=j.ln<0?W/2:g.x0+g.lw*(j.ln+.5),y=(j.ln<0?g.hy-110:g.hy-56)-j.a*30;c.globalAlpha=1-j.a/.7;c.textAlign='center';c.font=`900 ${j.big?34:22}px "Dela Gothic One",sans-serif`;c.lineWidth=6;c.strokeStyle='#1b2740';c.strokeText(j.t,x,y);c.fillStyle=j.c;c.fillText(j.t,x,y);c.globalAlpha=1}
    mgFx(s,c,1/60)}};
(()=>{if(!DZ())return;const rest=Object.entries(MG);for(const [k] of rest)delete MG[k];MG.dezome=dzGame;for(const [k,v] of rest)MG[k]=v})();
(()=>{if(DZ()||!/[?&]mini=dezome/.test(location.search))return;setTimeout(()=>{mgHub();toast('🎍 出初式イベントは終了しました。ほかのミニゲームで遊んでね')},700)})();
// 最初の画面の入口ボタン（ハロウィンと同じ形）
let dzSeen=false;
function dzEntry(from){if(!DZ()||S.ta)return;const bx=document.querySelector('.modal .box');if(!bx||bx.querySelector('.dzgo'))return;const lead=bx.querySelector('.lead')||bx.querySelector('h2');if(!lead)return;
  lead.insertAdjacentHTML('afterend',`<button class="hwgo dzgo" data-act="dzgo" data-from="${from}"><span class="hwgoi">🎍</span><span><b>出初式 一斉放水</b><small>1/18まで・リズムに合わせてタップ</small></span><span class="hwgoa">▶</span></button>`);if(!dzSeen){dzSeen=true;ga('dz_seen',{where:from})}}
intro=(o=>function(){o();dzEntry('intro')})(intro);
cont=(o=>function(){o();dzEntry('cont')})(cont);
menu=(o=>function(){o();if(!DZ()||S.ta)return;const bx=document.querySelector('.modal .box'),h2=bx&&bx.querySelector('h2');if(h2&&!bx.querySelector('.dzgo'))h2.insertAdjacentHTML('afterend',`<button class="hwgo dzgo" data-act="dzgo" data-from="menu"><span class="hwgoi">🎍</span><span><b>出初式 一斉放水</b><small>1/18まで・期間限定ミニゲーム</small></span><span class="hwgoa">▶</span></button>`)})(menu);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=dzgo]');if(!b)return;snd('pick');ga('dz_entry',{from:b.dataset.from||'top'});mgIntro(MG.dezome)});
document.addEventListener('click',e=>{if(e.target.closest('[data-mg=dezome]'))ga('dz_entry',{from:'hub'})},true);
mgStart=(o=>function(G,dk){o(G,dk);if(G===dzGame)ga('dz_mini_start',{diff:MG_DN[dk]})})(mgStart);
mgEnd=(o=>function(){const z=mg&&mg.G===dzGame,dk=mg&&mg.dk,sc=mg&&mg.score;o();if(z)ga('dz_mini_finish',{diff:MG_DN[dk],score:sc})})(mgEnd);
(()=>{const st=document.createElement('style');st.textContent=`.dzgo{background:linear-gradient(135deg,#b91c1c,#d97706);box-shadow:0 4px 0 #7f1d1d,0 6px 16px rgba(185,28,28,.3)}`;document.head.appendChild(st)})();
