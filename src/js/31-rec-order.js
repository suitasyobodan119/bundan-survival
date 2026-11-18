/* ===================== 育成のおすすめ順（装備箱に誘導しない）＋ おすすめ達成ボーナス ===================== */
// 装備箱・装備を鍛える は「寄り道」。目標の案内では、町を育てるものを先にすすめる
const OPTIONAL_PAD=id=>id==='box'||id==='forge';
cheapestPad=function(afford){let b=null,bc=1e9,ob=null,oc=1e9,coreAny=false;
  for(const p of PADS){if(p.id==='sell'||!unlocked(p)||(p.lock&&p.lock()))continue;const r=padRem(p.id);if(r==null)continue;
    const opt=OPTIONAL_PAD(p.id);if(!opt)coreAny=true;if(afford&&r>S.coins)continue;
    if(opt){if(r<oc){oc=r;ob=p}}else if(r<bc){bc=r;b=p}}
  if(afford)return b||(coreAny?null:ob);return b||ob};
let recId=null;
const calcRec=()=>{const p=cheapestPad(true)||cheapestPad(false);return p?p.id:null};
// 装備を全部「金」にしたら、装備箱はもう売らない（買っても損になるだけなので）
(()=>{const bp=PADMAP.box;if(!bp)return;const ou=bp.unlock;bp.unlock=()=>(ou?ou():true)&&Object.keys(EQ).some(k=>(S.eq[k]||0)<3)})();
// おすすめどおりに買うと、代金の1割が戻ってくる
levelUp=(o=>function(id){const cost=padCost(id),rec=recId===id&&!OPTIONAL_PAD(id);o(id);
  if(rec&&cost>0&&!S.ta){const bonus=Math.max(2,Math.round(cost*.1));S.coins+=bonus;addMerit(1);S.recN=(S.recN||0)+1;
    setTimeout(()=>{toast(`おすすめ達成ボーナス！ ${bonus}コイン戻ってきた`,'ok');float(P.x,P.y-60,`ボーナス +${bonus}`,'#ffd84a',16)},700);ga('rec_bonus',{item:id,bonus})}
  recId=calcRec()})(levelUp);
// これまで装備箱をたくさん買っていた人へ、1回だけ一部を返金
function boxCompensate(){if(S.ta||S.boxFix)return;S.boxFix=1;const n=S.boxN||0;if(n<3){save();return}
  let sp=0;for(let i=0;i<n;i++)sp+=Math.min(500,60+30*i);const c=Math.min(3000,Math.round(sp*.3));S.coins+=c;save();ga('box_refund',{n,coins:c});
  setTimeout(()=>pop('装備箱の見直し',`装備箱に使ったコインの一部 ${c}枚をお返ししました。これからは「目標」が、町を育てるおすすめ順に案内します`),2500)}

