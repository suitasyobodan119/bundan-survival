/* ===================== 状態 ===================== */
let S;
function fresh(){return{v:3,started:false,coins:0,frac:0,wood:0,stone:0,lv:{axe:1,bag:1,hose:1,truck:0,yagura:1,price:1,levee:0,rail:0,amb:0,tank:0,ladder:0,d_mt:0,d_res:0,d_s:0,d_n:0,d_nw:0,d_ne:0,d_sw:0,d_se:0,bus:0,park:0,bousai:0,museum:0},eqp:{},dlv:{},st:{},badges:[],dcrew:{},crew:0,paid:{},f:{},earned:0,pile:0,seen:['sell'],muted:false,uz:.8,px:null,py:null,sand:0,tyN:0,tyT:null,merit:0,rank:0,eq:{helmet:0,coat:0,boots:0,nozzle:0},boxN:0,boxes:0,rs:[{w:0,s:0},{w:0,s:0},{w:0,s:0}]}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s&&s.v===3?s:null}catch(e){return null}}
function save(){if(S&&S.ta)return true;if(S){if(!P.ride){S.px=Math.round(P.x);S.py=Math.round(P.y)}}try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}}

const radius=()=>RAD[S.lv.yagura];
const cap=()=>CAPS[S.lv.bag];
const carry=()=>S.wood+S.stone;
const chopInt=()=>.32*Math.pow(.75,S.lv.axe-1);
const woodPer=()=>1+S.lv.axe;
const hosePow=()=>4*Math.pow(1.6,S.lv.hose-1)*(1+eqB('coat',[0,.15,.3,.5]))*(P.hose?2.5:1);
const hoseRange=()=>86+12*S.lv.hose+eqB('nozzle',[0,10,20,35])+(P.hose?40:0);
const maxHp=()=>5+S.eq.helmet+(S.eq.helmet?Math.floor(eqp('helmet')/2):0);
const spdMul=()=>1+eqB('boots',[0,.08,.15,.25]);
const truckPow=()=>10*Math.pow(1.7,S.lv.truck-1)*(S.lv.tank?2:1);
const truckRange=()=>150+20*S.lv.truck;
const truckSpeed=()=>150+25*S.lv.truck;
const crewMax=()=>1+2*S.lv.yagura;
const crewCost=()=>Math.round(15*Math.pow(1.6,S.crew));
const yl=()=>S.lv.yagura;
function padCost(id){if(id==='soho')return null;if(id.startsWith('dc_')){const n=(S.dcrew||{})[id.slice(3)]||0;return n<3?Math.round(60*Math.pow(1.6,n)):null}if(id==='box')return Math.min(500,60+30*(S.boxN||0));if(id==='crew')return S.crew<crewMax()?crewCost():null;const c=UP[id].cost[S.lv[id]];return c==null?null:c}
function padRem(id){const c=padCost(id);return c==null?null:c-(S.paid[id]||0)}
const unlocked=p=>!p.unlock||p.unlock();
const padName=id=>UP[id].name;
function padLvText(id){if(id==='crew')return `${S.crew+1}人目`;if(id==='box')return '';if(id==='rail')return ['南の駅','西の駅','東の駅'][S.lv.rail]||'';if(id.startsWith('dc_'))return `${((S.dcrew||{})[id.slice(3)]||0)+1}人目`;if(VEHS.includes(id)||id.startsWith('d_')||id==='bus')return '';if(id==='truck'&&S.lv.truck===0)return '';return 'Lv'+(S.lv[id]+1)}

