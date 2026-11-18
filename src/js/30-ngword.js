/* ===================== ランキング名のNGワードチェック ===================== */
// 判定用に文字をそろえる：全角半角・大小文字・カタカナ→ひらがな・記号や空白を除去
function ngNorm(s){
  let t=String(s||'').normalize('NFKC').toLowerCase();
  t=t.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
  return t.replace(/[\s　・･.,、。!！?？*＊_＿\-‐−―~〜～'"`´^|/\\()（）\[\]「」『』【】<>＜＞{}@#$%&+=:;○●◯◎□■☆★♪♡♥❤︎♂♀…]/g,'')}
// 英字の言いかえ（f*ck → fck、sh1t → shit など）
const ngLeet=t=>t.replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t').replace(/[^a-z]/g,'');
// 名前のどこかに入っていたらNG（はっきり不適切な言葉）
const NG_SUB=[
  // 暴力・脅し
  '死','殺','しねよ','しねや','しねしね','しんでしまえ','しんじまえ','ころすぞ','ころせ','ころしたる','ころしてや','ぶっころ','ぶっとば','きえろ','くたばれ','じさつ','自殺','爆破','てろりすと',
  // 悪口
  'ばかやろ','ばかやろう','あほんだら','くそ','糞','かすやろ','ぶさいく','きもい','きしょい','きっしょ','うざい','うぜえ','うぜー','ぶすやろ','でぶやろ','ちびやろ','はげやろ','馬鹿','阿呆','屑','ごみくず','ざこ','雑魚','のろま','いんきゃ','陰キャ',
  // 下品・性的
  'うんこ','うんち','ちんこ','ちんぽ','ちんちん','ちんげ','まんこ','おまんこ','おっぱい','ちくび','乳首','巨乳','爆乳','きんたま','金玉','ぺにす','せっくす','えっち','えろい','えろす','えろがき','おなに','ぱいずり','ふぇら','れいぷ','ちかん','痴漢','へんたい','変態','ぜんら','全裸','はだか','裸','淫','姦','ぱんつ','おしっこ','うんぴ','あなる','すかとろ','どうてい','童貞','しょじょ','処女','らぶほ',
  // 差別・薬物・犯罪
  'きちがい','気違い','がいじ','害児','障害者','かたわ','めくら','つんぼ','しなじん','支那','ぶらく','部落','ちょんこ','くろんぼ','にがー','にぐろ','ほもやろ','おかまやろ','まやく','麻薬','かくせいざい','覚醒剤','こかいん','大麻','売春','ばいしゅん','強盗','ごうとう','誘拐','ゆうかい','犯罪',
  // URL・連絡先っぽいもの
  'http','www'];
// 名前全体がこれと同じならNG（短いので部分一致だと普通の名前まで弾いてしまう言葉）
const NG_EXACT=['しね','しんで','ばか','ばーか','あほ','あほう','かす','くず','ごみ','ぶす','でぶ','はげ','ちび','ぼけ','まぬけ','うざ','きも','きもお','くさい','えろ','えっろ','ほも','れず','おかま','ちん','まん','ちょん','てろ','たいま','しゃぶ','ころす','しり','けつ','ちんちん','ぱんつ'];
const NG_EN=['fuck','fck','fuk','shit','bitch','dick','cock','pussy','porn','sex','nigg','nazi','rape','cunt','penis','vagina','boob','xxx','anal','killyou','killer','slut','whore','bastard','asshole','motherf','wtf','stfu','idiot','stupid','loser','retard'];
const NG_EN_EXACT=['die','kill','ass','fag','gay','hoe','sux','baka','aho','unko','unti','chinko','manko','shine','kuso','ero','hentai','oppai'];
// 「しーね」「ばっか」「うんんこ」のような崩し方もまとめて見る
function ngVariants(t){const a=t.replace(/[ーっッ]/g,''),b=a.replace(/(.)\1+/g,'$1'),c=t.replace(/(.)\1+/g,'$1');return [...new Set([t,a,b,c])]}
// 「う○こ」「ち×こ」のような伏せ字：言葉の途中の伏せた文字は何にでも一致するとみなす
const NG_MASK=/[○●◯◎×✕✖＊*□■☆★]/g;
function ngMasked(s){let m=String(s||'').normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(NG_MASK,'\u0000');
  if(!m.includes('\u0000'))return false;m=m.replace(/[^\u0000\u3040-\u309f\u4e00-\u9fffa-z]/g,'');
  const fit=(seg,w)=>[...w].every((c,i)=>seg[i]==='\u0000'||seg[i]===c),hasReal=seg=>seg[0]!=='\u0000'&&seg[seg.length-1]!=='\u0000'; // 伏せ字は真ん中だけ（「あんぱんまん☆」の飾りは対象外）
  for(const w of NG_SUB.concat(NG_EXACT)){if(w.length<2)continue;const exact=NG_EXACT.includes(w)&&!NG_SUB.includes(w);
    if(exact){if(m.length===w.length&&hasReal(m)&&fit(m,w))return true;continue}
    for(let i=0;i+w.length<=m.length;i++){const seg=m.slice(i,i+w.length);if(seg.includes('\u0000')&&hasReal(seg)&&fit(seg,w))return true}}
  return false}
function ngName(s){
  if(ngMasked(s))return true;
  const t=ngNorm(s);if(!t)return false;
  for(const v of ngVariants(t)){
    if(NG_EXACT.includes(v))return true;
    if(NG_SUB.some(w=>v.includes(w)))return true}
  const en=ngLeet(t);
  if(en){const enc=en.replace(/(.)\1+/g,'$1');
    if(NG_EN.some(w=>en.includes(w)||enc.includes(w)))return true;
    if(NG_EN_EXACT.includes(en)||NG_EN_EXACT.includes(enc))return true}
  if(/\d{6,}/.test(t))return true; // 電話番号など
  return false}
const safeName=n=>ngName(n)?'ななし':(n||'ななし');
// 登録時：NGなら登録せず、その場で直してもらう
taSave=(o=>function(){if(taSaved)return o();const el=document.getElementById('taName');const v=(el&&el.value||'').trim();
  if(v&&ngName(v)){let m=document.getElementById('ngMsg');if(!m){el.closest('label').insertAdjacentHTML('afterend','<p class="note ngmsg" id="ngMsg"></p>');m=document.getElementById('ngMsg')}
    m.textContent='そのなまえは使えないよ。ほかのなまえにしてね';m.classList.remove('shk');void m.offsetWidth;m.classList.add('shk');
    el.value='';el.focus();snd('hurt');buzz(60);ga('name_blocked',{});return}
  o()})(taSave);
// 表示時：シートや端末に残っている名前もNGなら「ななし」で表示
rankTable=function(list,m,hiEntry){const r=list.filter(x=>modeOf(x)===m).slice(0,10);
  if(!r.length)return `<p class="note">${MODE_NAME[m]}モードは、まだ記録がないよ。1位をねらおう！</p>`;
  return `<table class="rk">${r.map((x,i)=>`<tr class="${hiEntry&&x===hiEntry?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'位'}</td><td>${esc(safeName(x.n))}<small>${esc(x.b||'')}</small></td><td>${x.s}枚</td></tr>`).join('')}</table>`};
(()=>{const st=document.createElement('style');st.textContent='.ngmsg{color:#c62828!important;font-weight:800;margin:4px 0 0!important}.ngmsg.shk{animation:ngshk .35s}@keyframes ngshk{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}';document.head.appendChild(st)})();

