// 分団サバイバル 自動テスト： node tests/smoke.js （playwright が必要）
// ゲームを開いて、はじめから・メニュー・ミニゲーム・つづきから まで通し、エラーが出ないか確かめる
const { chromium } = require('playwright');
const path=require('path');
const URL='file://'+path.resolve(__dirname,'..','index.html');
(async()=>{const b=await chromium.launch();const errs=[];let ok=true;
 const check=(name,v)=>{console.log((v?'OK  ':'NG  ')+name);if(!v)ok=false};
 const pg=await b.newPage({viewport:{width:393,height:852},deviceScaleFactor:2});
 pg.on('pageerror',e=>errs.push(e.message));
 await pg.route(/googletagmanager|docs\.google\.com|fonts\.(googleapis|gstatic)/,r=>r.fulfill({body:''}));
 await pg.goto(URL+(process.argv[2]||''));await pg.waitForTimeout(700);
 check('最初の画面が出る',await pg.evaluate(()=>!!document.querySelector('[data-act=start]')));
 await pg.click('[data-act=start]');await pg.waitForTimeout(200);
 const br=await pg.$('[data-act=home]');if(br){await br.click();await pg.waitForTimeout(200)}
 await pg.evaluate(()=>{while(document.querySelector('.modal'))closeModal()});
 await pg.waitForTimeout(1500);
 check('ゲームが始まる',await pg.evaluate(()=>S.started));
 await pg.evaluate(()=>menu());await pg.waitForTimeout(200);
 check('メニューが開く',await pg.evaluate(()=>!!document.querySelector('.modal h2')));
 check('メニューに章の課題が出る',await pg.evaluate(()=>!!document.querySelector('.modal .chcard')));
 await pg.evaluate(()=>{closeModal();xferOpen()});await pg.waitForTimeout(300);
 check('引き継ぎ画面が開く',await pg.evaluate(()=>/#save=/.test(document.querySelector('[data-act=xcopy]')?.dataset.v||'')));
 await pg.evaluate(()=>{closeModal();mgHub()});await pg.waitForTimeout(200);
 check('ミニゲーム一覧が開く',await pg.evaluate(()=>document.querySelectorAll('#mgPanel [data-mg]').length>=5));
 await pg.evaluate(()=>{mgClose();S.earned=50;save()});
 await pg.reload();await pg.waitForTimeout(800);
 check('つづきから が出る',await pg.evaluate(()=>/おかえり/.test(document.querySelector('.modal h2')?.textContent||'')));
 if(process.env.SHOT)await pg.screenshot({path:process.env.SHOT});
 check('エラーなし'+(errs.length?'：'+errs.join(' / '):''),errs.length===0);
 await b.close();process.exit(ok?0:1)})();
