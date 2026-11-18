/* ===================== 土嚢を積み終わったら自動で手放す ===================== */
function sandDone(){if(!ty)return true;if(ty.ph!=='warn')return true;const as=activeSegs().filter(g=>g.danger);return as.length>0&&as.every(g=>g.sacks>=needSacks(g))}
update=(o=>function(dt){o(dt);if(S.sand>0&&sandDone()){const n=S.sand;S.sand=0;toast(ty?`堤防は全部OK！ 余った土嚢${n}個は置いていったよ`:`台風が終わったので、土嚢${n}個を置いていったよ`,'ok')}})(update);
