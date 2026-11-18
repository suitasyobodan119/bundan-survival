/* ===================== 入力 ===================== */
const VV=window.visualViewport;const zoomedIn=()=>!!(VV&&VV.scale>1.02);
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1&&zoomedIn())return;if(!e.target.closest||!e.target.closest('.box'))e.preventDefault()},{passive:false});
['gesturestart','gesturechange','dblclick'].forEach(ev=>document.addEventListener(ev,e=>{if(zoomedIn())return;e.preventDefault()},{passive:false}));
let lastTE=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTE<350&&!(e.target.closest&&e.target.closest('[data-act=shtap]'))&&e.target!==cv){e.preventDefault();const b=e.target.closest&&e.target.closest('button,a,[data-act]');if(b)b.click()}lastTE=now},{passive:false});
function resetZoom(){const m=document.querySelector('meta[name=viewport]');if(!m)return;const base='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';m.content=base+',minimum-scale=1';setTimeout(()=>{m.content=base},120);window.scrollTo(0,0)}
function placeZoomBar(){const b=document.getElementById('zbar');if(!b)return;const z=zoomedIn();b.hidden=!z;if(!z||!VV)return;b.style.transform=`translate(${VV.offsetLeft}px,${VV.offsetTop}px) scale(${1/VV.scale})`;b.style.width=(VV.width*VV.scale)+'px'}
if(VV){VV.addEventListener('resize',placeZoomBar);VV.addEventListener('scroll',placeZoomBar)}
const keys={};let joy=null,moved=false;
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
const ptrs=new Map();let pinch=null;
function pinchDist(){const a=[...ptrs.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}
cv.addEventListener('pointerdown',e=>{audio();if(AC&&AC.state==='suspended')AC.resume();cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===2){joy=null;pinch={d:pinchDist(),z:S.uz};return}
  if(ptrs.size===1)joy={id:e.pointerId,ox:e.clientX,oy:e.clientY,dx:0,dy:0}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&ptrs.size===2){setZoom(pinch.z*pinchDist()/pinch.d)}});
const endPtr=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null};
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('pointermove',e=>{if(!joy||e.pointerId!==joy.id)return;let dx=e.clientX-joy.ox,dy=e.clientY-joy.oy;const d=Math.hypot(dx,dy),m=52;if(d>m){joy.ox+=dx*(1-m/d);joy.oy+=dy*(1-m/d);dx=e.clientX-joy.ox;dy=e.clientY-joy.oy}joy.dx=dx;joy.dy=dy});
const endJoy=e=>{if(joy&&e.pointerId===joy.id)joy=null};
cv.addEventListener('pointerup',endJoy);cv.addEventListener('pointercancel',endJoy);
function input(){let ix=0,iy=0;
  if(joy){const d=Math.hypot(joy.dx,joy.dy);if(d>6){ix=joy.dx/52;iy=joy.dy/52}}
  if(keys.a||keys.arrowleft)ix=-1;if(keys.d||keys.arrowright)ix=1;if(keys.w||keys.arrowup)iy=-1;if(keys.s||keys.arrowdown)iy=1;
  const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}return[ix,iy]}


