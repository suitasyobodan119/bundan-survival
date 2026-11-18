/* ===================== 指令が同時に出すぎないようにする ===================== */
const ordCap=()=>(S.ta||S.easy)?1:2;
const ordActive=()=>[hr,em,eq&&eq.hs.some(h=>h.person),rain&&rain.hs.some(h=>h.person),dEv,ty].filter(Boolean).length;
const ordBusy=()=>ordActive()>=ordCap();
startHR=(o=>function(){if(ordBusy()){hrT=15;return}o()})(startHR);
startQuake=(o=>function(){if(ordBusy()){eqT=15;return}o()})(startQuake);
startRain=(o=>function(){if(ordBusy()){rainT=15;return}o()})(startRain);
startDev=(o=>function(id){if(ordBusy()){devT=20;return}o(id)})(startDev);
updEmerg=(o=>function(dt){if(!em&&ordBusy()&&emT<10)emT=10;o(dt)})(updEmerg);

