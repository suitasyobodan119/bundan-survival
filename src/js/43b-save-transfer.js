/* ===================== 記録の引き継ぎ・ホーム画面に追加（PWA） ===================== */
// 遊んだ記録は端末のブラウザの中にしかない。Instagram→Safari や 機種変更 で消えないよう、
// 「引き継ぎリンク」で記録ごと別のブラウザへ運べるようにする。リンクの # より後ろはサーバーにもGAにも送られない
const XFER_URL='https://suitasyobodan119.github.io/bundan-survival/';
const b64u=u8=>{let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const ub64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
async function pipeBytes(u8,stream){const r=new Response(new Blob([u8]).stream().pipeThrough(stream));return new Uint8Array(await r.arrayBuffer())}
async function saveEncode(){save();const json=JSON.stringify(Object.assign({},S,{daily:undefined}));const raw=new TextEncoder().encode(json);
  if(window.CompressionStream){try{return 'z'+b64u(await pipeBytes(raw,new CompressionStream('deflate-raw')))}catch(e){}}
  return 'j'+b64u(raw)}
async function saveDecode(code){code=(code||'').trim().replace(/^.*#save=/,'').replace(/\s+/g,'');if(code.length<10)throw new Error('short');
  const k=code[0],u=ub64(code.slice(1));let raw;
  if(k==='z'){if(!window.DecompressionStream)throw new Error('old');raw=await pipeBytes(u,new DecompressionStream('deflate-raw'))}else if(k==='j')raw=u;else throw new Error('kind');
  const s=JSON.parse(new TextDecoder().decode(raw));if(!s||s.v!==3||!s.lv)throw new Error('data');return s}
const saveSummary=s=>`${s.home||'吹三'}分団・${RANKS[s.rank||0]}／コイン ${s.coins||0}枚／やぐら Lv${(s.lv||{}).yagura||1}／バッジ ${(s.badges||[]).length}個`;
const inApp=()=>/Instagram|FBAN|FBAV|Line\//i.test(navigator.userAgent);
const isIOS=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;

async function xferOpen(){let code='';try{code=await saveEncode()}catch(e){}
  const url=XFER_URL+'#save='+code;
  modal(`<h2>📦 記録の引き継ぎ</h2>
  <p class="lead">別のブラウザや新しいスマホで、<br>いまの続きから遊べます</p>
  <div class="tsucard"><b>いまの記録</b>${saveSummary(S)}</div>
  ${inApp()?`<p class="xwarn">いまはInstagramなどのアプリの中で開いています。このまま遊ぶと、Safari・Chromeとは記録が別になります。下のリンクをコピーして、Safari（Androidは Chrome）のアドレス欄に貼りつけて開いてね</p>`:''}
  <button class="btn" data-act="xcopy" data-v="${url}">🔗 引き継ぎリンクをコピー</button>
  ${navigator.share?`<button class="btn sub" data-act="xshare" data-v="${url}">📤 LINEやメールで自分に送る</button>`:''}
  <details class="how"><summary>コードを貼りつけて読みこむ</summary><p class="note" style="margin-top:6px">別の端末でコピーした引き継ぎリンク（またはコード）を貼りつけてね</p><textarea id="xin" rows="3" placeholder="https://…#save=… を貼りつけ" autocomplete="off"></textarea><button class="btn sub" data-act="xload">読みこむ</button><p class="hkng" id="xerr" hidden></p></details>
  <p class="note">リンクには遊んだ記録だけが入っています（名前や連絡先は入りません）。人に送ると、その人もあなたの続きから遊べてしまうので、自分だけで使ってね</p>
  <button class="btn sub" data-act="close">ゲームにもどる</button>`);ga('save_open',{inapp:inApp()?1:0})}
async function xcopy(text){try{await navigator.clipboard.writeText(text);return true}catch(e){}
  try{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}catch(e){return false}}
// 読みこみ：今の記録は「前のデータにもどす」に残してから入れ替える
function xferAsk(s,from){const cur=S&&S.earned>0;
  modal(`<h2>📦 引き継ぎデータがあります</h2><div class="tsucard"><b>引き継ぐ記録</b>${saveSummary(s)}</div>${cur?`<div class="tsucard" style="background:#eef2f7"><b style="color:#33415e">この端末のいまの記録</b>${saveSummary(S)}</div>`:''}
  <button class="btn" data-act="xyes">この記録で続きから遊ぶ</button><button class="btn sub" data-act="xno">やめる</button>${cur?'<p class="note">入れ替えても、いまの記録は MENU の「前のデータにもどす」で元にもどせます</p>':''}`);
  xferAsk.s=s;xferAsk.from=from}
function xferApply(){const s=xferAsk.s;if(!s)return;try{if(S&&!S.ta&&S.earned>0)localStorage.setItem(BK_KEY,JSON.stringify({at:Date.now(),S}));s.started=true;localStorage.setItem(KEY,JSON.stringify(s))}catch(e){toast('この端末に保存できませんでした');return}
  ga('save_import',{from:xferAsk.from||'link'});xferNoSave=true;location.replace(location.pathname+location.search)}
let xferNoSave=false;
save=(o=>function(){if(xferNoSave)return true;return o()})(save);
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='xfer')xferOpen();
  else if(a==='xcopy'){const ok=await xcopy(b.dataset.v);b.textContent=ok?'✅ コピーしました！ Safari／Chromeに貼りつけてね':'コピーできませんでした。長押しで選んでね';ga('save_export',{via:'copy'})}
  else if(a==='xshare'){try{await navigator.share({title:'分団サバイバルの引き継ぎ',text:'分団サバイバルの続きはここから（自分用）',url:b.dataset.v});ga('save_export',{via:'share'})}catch(x){}}
  else if(a==='xload'){const el=document.getElementById('xin'),er=document.getElementById('xerr');try{xferAsk(await saveDecode(el.value),'paste')}catch(x){er.hidden=false;er.textContent=x.message==='old'?'この端末のブラウザが古くて読みこめません。Safari／Chromeを新しくしてね':'読みこめませんでした。リンクを最後までコピーできているか確かめてね'}}
  else if(a==='xyes')xferApply();
  else if(a==='xno'){xferAsk.s=null;closeModal();if(!S.started)intro();else if(S.earned>0)cont()}});
// 開いたURLに引き継ぎリンクが付いていたら（head でGAより先に取り出して sessionStorage に入れてある）
setTimeout(async()=>{let code=null;try{code=sessionStorage.getItem('bs-import');sessionStorage.removeItem('bs-import')}catch(e){}if(!code)return;
  try{xferAsk(await saveDecode(code),'link')}catch(x){toast('引き継ぎリンクを読みこめませんでした')}},700);

/* --- ホーム画面に追加 --- */
let installEv=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEv=e});
addEventListener('appinstalled',()=>ga('pwa_installed',{}));
function homeAddOpen(){
  modal(`<h2>📲 ホーム画面に追加</h2><p class="lead">アプリのように、アイコンからすぐ遊べます。<br>記録も消えにくくなります</p>
  ${inApp()?`<p class="xwarn">Instagramなどのアプリの中では追加できません。先に「記録の引き継ぎ」でリンクをコピーして、Safari（Androidは Chrome）で開いてから追加してね</p><button class="btn" data-act="xfer">📦 記録の引き継ぎへ</button>`
  :installEv?`<button class="btn" data-act="pwago">ホーム画面に追加する</button>`
  :isIOS()?`<ol class="steps"><li>画面の下（または上）の <b>共有ボタン</b>（四角から矢印が出ているマーク）をタップ</li><li>メニューを下にずらして <b>「ホーム画面に追加」</b> をタップ</li><li>右上の <b>「追加」</b> をタップ</li></ol>`
  :`<ol class="steps"><li>右上の <b>︙</b> メニューをタップ</li><li><b>「ホーム画面に追加」</b>（または「アプリをインストール」）をタップ</li></ol>`}
  <button class="btn sub" data-act="close">ゲームにもどる</button>`);ga('pwa_guide',{inapp:inApp()?1:0})}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;
  if(b.dataset.act==='homeadd')homeAddOpen();
  else if(b.dataset.act==='pwago'&&installEv){installEv.prompt();const r=await installEv.userChoice.catch(()=>({}));ga('pwa_prompt',{result:r.outcome||''});installEv=null;closeModal()}});
// メニューに2つのボタン
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const sq=bx.querySelector('[data-act=savequit]');
  const h=`<div class="row2 xrow"><button class="btn sub" data-act="xfer">📦 記録の引き継ぎ</button>${standalone()?'':'<button class="btn sub" data-act="homeadd">📲 ホーム画面に追加</button>'}</div>`;
  if(sq)sq.insertAdjacentHTML('afterend',h);else bx.insertAdjacentHTML('beforeend',h)})(menu);
// サービスワーカー（オフラインでも開ける・ホーム画面アプリ用）。https のときだけ
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
// 記録をブラウザに消されにくくする（対応ブラウザのみ）
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persisted().then(p=>{if(!p&&standalone())navigator.storage.persist()})}catch(e){}
if(standalone())setTimeout(()=>ga('pwa_open',{}),1500);
(()=>{const st=document.createElement('style');st.textContent=`
.xwarn{background:#fff1f0;border-left:4px solid #e5432a;border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.6;color:#7a1d12;text-align:left;margin:6px 0}
#xin{width:100%;box-sizing:border-box;border:2px solid #c9d3e2;border-radius:10px;padding:8px;font:inherit;font-size:13px;margin-top:6px}
.steps{text-align:left;font-size:14px;line-height:1.7;padding-left:1.4em;margin:8px 0}.steps li{margin:4px 0}
.xrow .btn{font-size:14px}`;document.head.appendChild(st)})();
