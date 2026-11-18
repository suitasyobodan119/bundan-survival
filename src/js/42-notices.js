/* ===================== 消防団からのお知らせ（期間が過ぎたら自動で消える） ===================== */
const NOTICES=[
  {id:'yobo2026',until:'2026-11-15T00:00:00+09:00',ic:'🔥',title:'11月9日（月）〜14日（土） 火災予防広報',
   lines:['この期間、吹田市消防団が地域で火災予防を呼びかけます','空気が乾く季節。ストーブやコンロなど、おうちの火の元に気をつけよう！'],
   link:{href:IG_URL,label:'📷 活動のようすはInstagramで'}},
  {id:'bousai2026',until:'2026-11-22T00:00:00+09:00',ic:'🏕️',title:'11月21日（土） 吹田市地域防災総合訓練',
   lines:['10:00〜12:00（展示ブースは14:00まで）','会場：千里北公園 蓮間池東部／自然体験交流センター（わくわくの郷）','※内容は変わることがあります。くわしくは市のホームページで'],
   link:{href:'https://www.city.suita.osaka.jp/anzen/1017894/1017903/1017904/index.html',label:'吹田市のページを見る'}}];
const noticesOn=()=>NOTICES.filter(n=>Date.now()<Date.parse(n.until));
function noticeHtml(){const ns=noticesOn();if(!ns.length)return '';
  return `<div class="ntc"><b class="ntch">📢 消防団からのお知らせ</b>${ns.map(n=>`<details class="ntci"${ns.length===1?' open':''}><summary>${n.ic} ${n.title}</summary>${n.lines.map(l=>`<span>${l}</span>`).join('')}${n.link?`<a class="fb" href="${n.link.href}" target="_blank" rel="noopener" data-ntc="${n.id}">${n.link.label}</a>`:''}</details>`).join('')}</div>`}
const ntcAdd=(sel,where)=>{const bx=document.querySelector(sel);if(!bx||bx.querySelector('.ntc'))return;const h=noticeHtml();if(!h)return;
  const t=where==='afterh2'?bx.querySelector('h2'):null;if(t)t.insertAdjacentHTML('afterend',h);else bx.insertAdjacentHTML('beforeend',h)};
menu=(o=>function(){o();if(S.ta)return;const bx=document.querySelector('.modal .box');if(!bx)return;const anchor=bx.querySelector('[data-act=mghub]')||bx.querySelector('h2');if(anchor&&!bx.querySelector('.ntc')){const h=noticeHtml();if(h)anchor.insertAdjacentHTML('afterend',h)}})(menu);
intro=(o=>function(){o();ntcAdd('.modal .box')})(intro);
cont=(o=>function(){o();ntcAdd('.modal .box')})(cont);
mgHub=(o=>function(){o();ntcAdd('#mgPanel .hkbox')})(mgHub);
document.addEventListener('click',e=>{const a=e.target.closest('[data-ntc]');if(a)ga('notice_click',{id:a.dataset.ntc})},true);
(()=>{const st=document.createElement('style');st.textContent=`
.ntc{margin:8px 0;padding:8px 10px;border-radius:14px;background:#eef6ff;border:2px solid #3d93db;text-align:left}
.ntch{display:block;font-size:13px;color:#1b4f8a;margin-bottom:4px}
.ntci{border-top:1px dashed #b9d6f2;padding:6px 0 2px}.ntci:first-of-type{border-top:0}
.ntci summary{font-weight:800;font-size:14px;cursor:pointer;color:#1b2740;line-height:1.45}
.ntci span{display:block;font-size:12px;line-height:1.6;color:#33415e;margin-top:3px}
.ntci a.fb{display:block;margin-top:6px;text-align:center;font-size:13px}`;document.head.appendChild(st)})();

