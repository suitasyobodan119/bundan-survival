/* ===================== 設定 ===================== */
const KEY='bundan-survival-v3';
const RAD=[0,390,540,700,880,1060];
const CAPS=[0,10,20,35,55,80];
const MULT=[0,1,1.5,2,3];
const UP={
  axe:{name:'斧',icon:'axe',cost:[null,5,20,60,150,400],fx:l=>`木を切るのが速くなった！ 1本で木材${1+l}個`},
  bag:{name:'リュック',icon:'bag',cost:[null,8,25,70,180],fx:l=>`背中に${CAPS[l]}個まで持てる！`},
  hose:{name:'ホース',icon:'hose',cost:[null,10,30,80,200,500],fx:l=>'放水が強く、遠くまで届く！'},
  truck:{name:'ポンプ車',icon:'truck',cost:[30,100,260,650],fx:l=>l===1?'自動で火事とヒノコを消しに行く！ 近くで「乗る」もできる':'ポンプ車がパワーアップ！'},
  yagura:{name:'火の見やぐら',icon:'tower',cost:[null,50,150,400,1000],fx:l=>'町が広がった！ 木もヒノコも増える'},
  price:{name:'買取アップ',icon:'price',cost:[null,30,90,250],fx:l=>`売ったときのコインが${MULT[l]}倍！`},
  levee:{name:'堤防',icon:'levee',cost:[60,160,380],fx:l=>`堤防が${l}段高くなった！ 土嚢が少なくても町を守れる`},
  rail:{name:'トロッコ',icon:'cart',cost:[80,220,520],fx:l=>`${['','南','西','東'][l]}の森にトロッコ駅ができた！ 木を置くと自動で売ってくれる`},
  box:{name:'装備箱',icon:'chest',fx:()=>''},
  d_mt:{name:'山田分団',icon:'mt',cost:[800],fx:()=>'大きな公園の森がある分団。ときどき林野火災が起きる'},
  d_res:{name:'千里丘分団',icon:'town',cost:[1200],fx:()=>'家が多い分団。ときどき地震が起きる'},
  d_s:{name:'岸部分団',icon:'lake',cost:[1800],fx:()=>'池のある分団。ゲリラ豪雨で浸水が起きる'},
  d_n:{name:'豊津分団',icon:'city',cost:[2500],fx:()=>'オフィスビルが多い分団。高層ビル火災が起きる'},
  d_nw:{name:'千二分団',icon:'town',cost:[1000],fx:()=>'古い木造の家が多い分団。火がとなりへ燃え移る延焼火災が起きる'},
  d_ne:{name:'豊津分団',icon:'city',cost:[1500],fx:()=>'駅前の商店街がある分団。ヒノコの大群がやってくる'},
  d_sw:{name:'吹一分団',icon:'city',cost:[2200],fx:()=>'工場が多い分団。大きな工場火災が起きる'},
  d_se:{name:'吹二分団',icon:'town',cost:[3000],fx:()=>'公園と夏祭りの分団。熱中症の救護出動がある'},
  bus:{name:'路線バス',icon:'bus',cost:[200],fx:()=>'バス停に立つと、ほかの分団へすぐ行ける！'},
  soho:{name:'操法大会',icon:'hose'},
  amb:{name:'救急車',icon:'amb',cost:[150],fx:()=>'救急出動は救急車に乗って向かおう。クイズのヒントが使えて、ごほうび1.5倍'},
  tank:{name:'水槽車',icon:'tank',cost:[250],fx:()=>'ポンプ車についていって、放水パワーが2倍になる'},
  ladder:{name:'はしご車',icon:'ladder',cost:[400],fx:()=>'乗って出動すると、高いところの火事と救助ができる'},
  crew:{name:'団員',icon:'crew',fx:()=>'木を切って売ってくれる。コインは買取所の横にたまる'},
};
const PADS=[
  {id:'sell',x:0,y:80},
  {id:'axe',x:-250,y:84,unlock:()=>S.f.sold},
  {id:'hose',x:-160,y:84,unlock:()=>S.f.mon},
  {id:'bag',x:-205,y:164,unlock:()=>S.lv.axe>=2},
  {id:'crew',x:108,y:168,unlock:()=>S.earned>=22},
  {id:'truck',x:212,y:90,unlock:()=>S.earned>=30||S.f.ext},
  {id:'yagura',x:100,y:-118,unlock:()=>S.lv.truck>=1},
  {id:'price',x:-98,y:168,unlock:()=>S.lv.yagura>=2},
  {id:'levee',x:-290,y:-150,unlock:()=>(S.tyN||0)>=1},
  {id:'amb',x:318,y:62,unlock:()=>!!S.f.emerg},
  {id:'tank',x:318,y:-28,unlock:()=>(S.rank||0)>=1},
  {id:'ladder',x:318,y:-118,unlock:()=>(S.rank||0)>=2},
  {id:'d_mt',x:90,y:-1000,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<2?'部長になると開ける':null},
  {id:'d_res',x:1000,y:190,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<3?'副分団長になると開ける':null},
  {id:'d_s',x:90,y:1000,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<4?'分団長になると開ける':null},
  {id:'d_n',x:-1000,y:190,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<5?'副団長になると開ける':null},
  {id:'d_nw',x:-700,y:-720,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<2?'部長になると開ける':null},
  {id:'d_ne',x:700,y:-720,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<3?'副分団長になると開ける':null},
  {id:'d_sw',x:-700,y:720,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<4?'分団長になると開ける':null},
  {id:'d_se',x:700,y:720,unlock:()=>S.lv.yagura>=5,lock:()=>(S.rank||0)<5?'副団長になると開ける':null},
  {id:'bus',x:175,y:205,unlock:()=>DIST.some(d=>S.lv[d.id])},
  {id:'soho',x:-95,y:-95,unlock:()=>(S.rank||0)>=1},
  {id:'box',x:-300,y:168,unlock:()=>S.lv.yagura>=2||(S.rank||0)>=1},
  {id:'rail',get x(){return RAILS[Math.min(S.lv.rail||0,2)].pad.x},get y(){return RAILS[Math.min(S.lv.rail||0,2)].pad.y},unlock:()=>(S.lv.rail||0)<3&&S.lv.yagura>=RAILS[Math.min(S.lv.rail||0,2)].need},
];
const PADMAP=Object.fromEntries(PADS.map(p=>[p.id,p]));
const BLD=[
  {id:'tsume',x:0,y:-6,w:132,h:70,ht:40},
  {id:'shop',x:-205,y:-2,w:124,h:64,ht:32},
  {id:'garage',x:212,y:-8,w:120,h:62,ht:36},
  {id:'tower',x:0,y:-128,w:52,h:30,ht:0},
  {id:'hr',x:300,y:330,w:96,h:60,ht:170},
  {id:'hr',x:-1690,y:-30,w:96,h:60,ht:170},{id:'hr',x:-1230,y:-140,w:96,h:60,ht:190},{id:'hr',x:-1700,y:380,w:96,h:60,ht:150},
];
const PILE={x:78,y:112}, PARK={x:212,y:52}, START={x:0,y:210};
const ROOFS=['#6f86ad','#9b6b4f','#5f7d6a','#b0715f','#8a7aa8','#4f7f94'];

