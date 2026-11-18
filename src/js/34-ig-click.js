/* ===================== Instagramへのリンクを押した記録 ===================== */
// どの画面から押したか（メニュー・タイムアップ後のランキング など）を一緒に記録する
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href*="instagram.com"]');if(!a)return;
  const h=document.querySelector('.modal h2'),from=(h?h.textContent.trim():'画面')||'画面';
  ga('ig_click',{from:from.slice(0,30),mode:S&&S.ta?'3分チャレンジ':'ふつう',branch:homeName(),transport_type:'beacon'})},true);

