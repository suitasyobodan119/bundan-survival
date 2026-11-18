/* ===================== 団員モード（?dan で開いた端末は、GAで団員として分けて記録） ===================== */
const isMember=()=>{try{return localStorage.getItem('suita119-member')==='1'}catch(e){return false}};
setTimeout(()=>{if(isMember()&&/[?&]dan/.test(location.search))toast('団員モード：この端末の記録は「団員」として分けて集計します','ok')},1500);

