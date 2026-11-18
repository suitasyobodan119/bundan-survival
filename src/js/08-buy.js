/* ===================== 購入 ===================== */
function levelUp(id){
  S.paid[id]=0;const p=PADMAP[id];burst(p.x,p.y,'#f3b648',34);snd('buy');buzz(40);shake=6;
  if(id==='box'){S.boxN=(S.boxN||0)+1;giveBox('装備屋で買った');return}
  if(id.startsWith('dc_')){const k=id.slice(3);S.dcrew=S.dcrew||{};S.dcrew[k]=(S.dcrew[k]||0)+1;addWorker(p.x,p.y,k);pop(`${UP[id].name}が入団！`,'この分団の木を切って、近くの買取所で売ってくれる');return}
  if(id==='bus'){S.lv.bus=1;pop('路線バス 開通！',UP.bus.fx());return}
  if(id.startsWith('d_')){S.lv[id]=1;pop(`${UP[id].name}を結成！`,UP[id].fx());return}
  if(VEHS.includes(id)){S.lv[id]=1;const v=VEH[id];v.x=PADMAP[id].x;v.y=PADMAP[id].y;pop(`${UP[id].name} 配備！`,UP[id].fx());return}
  if(id==='crew'){S.crew++;addWorker(p.x,p.y);pop('団員が入団！',UP.crew.fx());return}
  S.lv[id]++;const L=S.lv[id];
  if(id==='truck'&&L===1){T.x=PARK.x;T.y=PARK.y;pop('ポンプ車 登場！',UP.truck.fx(1));return}
  if(id==='yagura'){for(let i=0;i<2;i++)spawnMon();if(L===2)bossT=60}
  pop(`${UP[id].name} Lv${L}！`,UP[id].fx(L));
}

