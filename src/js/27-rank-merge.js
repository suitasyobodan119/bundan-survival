/* ===================== ランキングは端末＋フェスタ全体をまとめて表示 ===================== */
let gRank=null,gAt=0;
async function loadGlobal(force){if(!TA_FORM.csv)return null;if(!force&&gRank&&Date.now()-gAt<30000)return gRank;
  try{const rr=await fetch(TA_FORM.csv+'&_='+Date.now(),{cache:'no-store'});const tx=await rr.text();
    gRank=tx.trim().split(/\r?\n/).slice(1).map(l=>l.split('","').map(c=>c.replace(/^"|"$/g,''))).map(c=>({ts:c[0]||'',n:c[1]||'',b:c[2]||'',s:+(c[3]||0),e:/やさしい/.test(c[4]||''),g:1,mini:/^ミニ/.test(c[4]||'')})).filter(x=>x.s>0&&!x.mini);gAt=Date.now()}catch(x){}
  return gRank}
function mergedRank(extra){const seen=new Set(),out=[];for(const x of [...(extra||[]),...(gRank||[]),...taRank()]){const k=(x.n||'')+'|'+x.s+'|'+(x.e?1:0);if(seen.has(k))continue;seen.add(k);out.push(x)}return out.sort((a,b)=>b.s-a.s||(a.d||0)-(b.d||0))}
function rankTable(list,m,hiEntry){const r=list.filter(x=>modeOf(x)===m).slice(0,10);
  if(!r.length)return `<p class="note">${MODE_NAME[m]}モードは、まだ記録がないよ。1位をねらおう！</p>`;
  return `<table class="rk">${r.map((x,i)=>`<tr class="${hiEntry&&x===hiEntry?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(x.n)}<small>${esc(x.b||'')}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`}
function rankLabel(){return gRank?'フェスタ全体':'この端末'}
taIntro=function(){rankMode=taEasy?'e':'n';
  modal(`<h2>3分チャレンジ</h2><p class="lead">3分間で、コインを何枚かせげるか！</p><ul class="loop"><li><span class="n">1</span><span>木を切って、買取所で売ろう</span></li><li><span class="n">2</span><span>ヒノコを倒して火事を消すと、コインがもらえる</span></li><li><span class="n">3</span><span>斧やホースを買うと、もっとかせげる！ 最後の1分は夜になるぞ</span></li></ul>
  <button class="btn sub modebtn" data-act="taeasy"><b>${taEasy?'やさしいモード':'ふつうモード'}</b><small>${taEasy?'水が減らない':'水が減る'}・タップで切りかえ</small></button>
  <h3 class="sec">ランキング <small id="taRankLbl">${MODE_NAME[rankMode]}モード・${rankLabel()}</small></h3><div id="taRankBox">${rankTable(mergedRank(),rankMode)}</div>
  <button class="btn" data-act="tago">スタート！</button><button class="btn sub" data-act="tahome">所属：${homeName()}（変える）</button><button class="btn sub" data-act="taexit">ふつうに遊ぶ</button>`);
  loadGlobal().then(()=>{const box=document.getElementById('taRankBox');if(!box)return;box.innerHTML=rankTable(mergedRank(),rankMode);const l=document.getElementById('taRankLbl');if(l)l.textContent=`${MODE_NAME[rankMode]}モード・${rankLabel()}`})};
taEnd=function(){taScore=S.earned;const m=S.easy?'e':'n';const list=mergedRank().filter(x=>modeOf(x)===m),place=list.filter(x=>x.s>taScore).length+1;snd('buy');ga('ta_finish',{score:taScore,mode:MODE_NAME[m],branch:homeName()});
  modal(`<h2>タイムアップ！</h2><div class="medal r${place<=3?4-place:0}">${taScore}枚</div><p class="lead">${MODE_NAME[m]}モード ${place<=10?`ランキング ${place}位に入るよ！`:'よくがんばった！'}</p><p class="note">消した火事 ${S.st.ext||0}件・倒したヒノコ ${S.st.kill||0}匹・斧 Lv${S.lv.axe}・ホース Lv${S.lv.hose}</p><label class="nm">なまえ（8文字まで）<input id="taName" maxlength="8" placeholder="ニックネーム" autocomplete="off"></label><button class="btn" data-act="tasave">ランキングに登録</button><button class="btn sub" data-act="tago">登録しないでもう一回</button>`)};
taSave=function(){if(taSaved)return;const n=(document.getElementById('taName').value||'').trim().slice(0,8)||'ななし';taSaved=true;const m=S.easy?'e':'n';
  const e={n,b:homeName(),s:taScore,d:Date.now(),e:m==='e'};sendForm(e);let r=taRank();r.push(e);r.sort((a,b)=>b.s-a.s||a.d-b.d);
  const keep=[...r.filter(x=>modeOf(x)==='e').slice(0,50),...r.filter(x=>modeOf(x)==='n').slice(0,50)];try{localStorage.setItem(TA_KEY,JSON.stringify(keep))}catch(x){}
  const list=mergedRank([e]).filter(x=>modeOf(x)===m),i=list.indexOf(e);rankMode=m;gAt=0;
  modal(`<h2>ランキング</h2><p class="lead">${MODE_NAME[m]}モード・${rankLabel()}</p>${rankTable(list,m,e)}${i>=10?`<p class="note">${esc(n)}：${i+1}位（${taScore}枚）</p>`:''}<p class="note" style="margin:6px 0 0">遊んだ感想をきかせてね</p>${FB_BTN()}<button class="btn" data-act="tanext">次の人へ</button><button class="btn sub" data-act="taexit">ふつうのモードにもどる</button><button class="btn sub mini" data-act="taclr">ランキングを消す（係の人用）</button>${REAL}`)};

