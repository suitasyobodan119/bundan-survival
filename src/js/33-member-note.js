/* ===================== 団員の記録に「越せるかな？」 ===================== */
// フェスタ前（10/10 朝まで）にシートへ入った記録は、消防団員が遊んだ記録
const DAN_UNTIL='2026/10/10 08:00';
const isDan=x=>!!(x&&x.ts&&x.ts<DAN_UNTIL);
rankTable=function(list,m,hiEntry){const r=list.filter(x=>modeOf(x)===m).slice(0,10);
  if(!r.length)return `<p class="note">${MODE_NAME[m]}モードは、まだ記録がないよ。1位をねらおう！</p>`;
  const dan=r.some(isDan);
  return `${dan?'<p class="dannote">🚒 は消防団員の記録。団員の記録を越せるかな？</p>':''}<table class="rk">${r.map((x,i)=>`<tr class="${hiEntry&&x===hiEntry?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${isDan(x)?'<span class="danb">🚒団員</span>':''}${esc(safeName(x.n))}<small>${esc(x.b||'')}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`};
allShow=function(){if(!allCache){modal('<h2>フェスタ全体ランキング</h2><p class="note">読みこめませんでした。電波のよいところで試してね</p><button class="btn" data-act="tanext">もどる</button>');return}
  modal(`<h2>フェスタ全体ランキング</h2>${rankTabs('allm',allMode)}${rankTable(allCache.slice().sort((a,b)=>b.s-a.s),allMode)}<button class="btn" data-act="tanext">もどる</button>`)};
(()=>{const st=document.createElement('style');st.textContent='.dannote{margin:2px 0 6px;font-size:13px;font-weight:800;color:#b3261e;text-align:center}.danb{display:inline-block;font-size:10px;font-weight:800;background:#e5432a;color:#fff;border-radius:6px;padding:1px 5px;margin-right:4px;vertical-align:1px}';document.head.appendChild(st)})();

