/* ===================== 絵（Canvaで作ったイラスト）を画面に入れる ===================== */
// 最初の画面の上にタイトル絵、分団えらびに新人団員
intro=(o=>function(){o();const bx=document.querySelector('.modal .box');if(!bx||bx.querySelector('.titleart'))return;bx.insertAdjacentHTML('afterbegin','<div class="titleart"><img src="img/title.webp" alt="ポンプ車とホースでヒノコを消す消防団員たち"></div>')})(intro);
pickHome=(o=>function(first){o(first);const bx=document.querySelector('.modal .box'),h2=bx&&bx.querySelector('.lead');if(!h2||bx.querySelector('.say'))return;h2.outerHTML=say('me','ぼく（わたし）は、どの分団の団員になろう？')})(pickHome);
(()=>{const st=document.createElement('style');st.textContent=`
.titleart{flex:none;margin:-8px -6px 0;height:150px;border-radius:16px;overflow:hidden;background:#f6b37a}
.titleart img{width:100%;height:100%;object-fit:cover;object-position:50% 58%;display:block}`;document.head.appendChild(st)})();
