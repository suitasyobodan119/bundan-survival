/* ===================== 目標 ===================== */
function nearest(list,x,y,ok){let b=null,bd=1e9;for(const o of list){if(ok&&!ok(o))continue;const d=dist(x,y,o.x,o.y);if(d<bd){bd=d;b=o}}return b}
let guide={t:'',tg:null,mode:''};
function cheapestPad(afford){let b=null,bc=1e9;for(const p of PADS){if(p.id==='sell'||!unlocked(p)||(p.lock&&p.lock()))continue;const r=padRem(p.id);if(r==null)continue;if(afford&&r>S.coins)continue;if(r<bc){bc=r;b=p}}return b}
function updGuide(){
  const tree=nearest(trees,P.x,P.y,o=>o.st==='up'&&active(o));
  const fire=nearest(houses,P.x,P.y,o=>o.st==='fire'&&active(o));
  const boss=mons.find(m=>m.boss);
  const mon=nearest(mons,P.x,P.y,m=>!m.boss);
  const sell=PADMAP.sell;let g;
  if(!S.f.chopped)g={t:'木に近づこう。自動で木を切って木材がもらえる',tg:tree};
  else if(!S.f.sold)g=carry()>0?{t:'木材を詰所の「買取所」の丸に運ぶとコインになる',tg:sell}:{t:'木に近づいて木材を集めよう',tg:tree};
  else if(hr&&P.ride!=='ladder')g={t:`高層ビル火災！ はしご車に乗って出動しよう（あと${Math.ceil(hr.t)}秒）`,tg:VEH.ladder,mode:'alert'};
  else if(hr)g={t:`高層ビルに近づくと、はしごで放水と救助ができる（あと${Math.ceil(hr.t)}秒）`,tg:{x:HRB.x,y:HRB.y},mode:'alert'};
  else if(rain&&rain.hs.some(h=>h.person)){const h=nearest(rain.hs,P.x,P.y,o=>o.person);g=P.ride==='boat'?{t:'浸水した家のそばまでボートで行こう',tg:h,mode:'alert'}:{t:`${distName('d_s')}で浸水！ 救助ボートに乗って助けよう（あと${Math.ceil(rain.t)}秒）`,tg:BOAT,mode:'alert'}}
  else if(eq&&eq.hs.some(h=>h.person)){const h=nearest(eq.hs,P.x,P.y,o=>o.person);g={t:P.ride&&dist(P.x,P.y,h.x,h.y)<150?'車から降りて、倒れた家のそばに立とう':`地震！ 倒れた家のそばに立って、取り残された人を助けよう（あと${Math.ceil(eq.t)}秒）`,tg:h,mode:'alert'}}
  else if(trees.some(t=>t.fire)){const tr=nearest(trees,P.x,P.y,o=>o.fire);g={t:'山で林野火災！ 燃え広がる前に放水で消そう',tg:tr,mode:'alert'}}
  else if(em&&S.lv.amb&&P.ride!=='amb')g={t:`救急出動！ まず救急車に乗ろう（あと${Math.ceil(em.t)}秒）`,tg:VEH.amb,mode:'alert'};
  else if(em)g={t:`救急出動！ 倒れた人のところへ急ごう（あと${Math.ceil(em.t)}秒）`,tg:em,mode:'alert'};
  else if(cheapestPad(true)){const p=cheapestPad(true);g={t:`コインで「${padName(p.id)}」が買える！ 光っている丸に立とう`,tg:p,mode:'gold'}}
  else if(boss)g={t:'大ヒノコが来た！ ポンプ車で消そう',tg:boss,mode:'alert'};
  else if(fire)g={t:'火事だ！ 近づくと放水する。消すとお礼のコインが出る',tg:fire,mode:'alert'};
  else if(P.hp<=2&&mon&&dist(P.x,P.y,mon.x,mon.y)<200)g={t:'体力が少ない！ 少し離れると回復する',tg:sell,mode:'alert'};
  else if(mon&&(!S.f.killed||dist(P.x,P.y,mon.x,mon.y)<300))g={t:'ヒノコに近づくと放水！ 倒すと「炎の石」（高く売れる）',tg:mon,mode:'alert'};
  else if(carry()>=cap()){const dp=nearestDeposit(P.x,P.y);g={t:dp.line!=null?'背中がいっぱい！ 近くのトロッコ駅に置こう':'背中がいっぱい！ 買取所でコインにかえよう',tg:dp}}
  else if(S.pile>=5)g={t:'団員が稼いだコインを受け取ろう',tg:PILE,mode:'gold'};
  else{const p=cheapestPad(false);
    if(p){const need=padRem(p.id)-S.coins;g={t:`あと ${need} コインで「${padName(p.id)}」！ 集めて売ろう`,tg:carry()>=cap()*.7?sell:(tree||sell)}}
    else g={t:'木を切ってヒノコを倒し、町を守ろう',tg:tree}}
  if(P.ride==='truck'&&T.w!=null&&T.w<tCap()*.15&&!T.conn){const ws=waterSrc(T);g={t:'ポンプ車の水が少ない！ 消火栓・防火水槽・川の近くに止めて補給しよう',tg:ws,mode:'alert'}}
  const tg2=tyGuide();if(tg2)g=tg2;
  if(wp){if(dist(P.x,P.y,wp.x,wp.y)<70){wp=null;toast('目的地に着いた')}else if(g.mode!=='alert')g={t:'地図でえらんだ場所へ向かおう',tg:wp,mode:''}}
  if(P.ride&&g.tg===tree)g.tg=null;
  guide=g;
  const el=document.getElementById('goal');el.className=g.mode||'';
  document.getElementById('goalTag').textContent=g.mode==='gold'?'コイン':g.mode==='alert'?'出動':'目標';
  const gt=document.getElementById('goalText');if(gt.textContent!==g.t)gt.textContent=g.t;
}

