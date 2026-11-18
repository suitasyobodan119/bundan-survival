/* ===================== 音 ===================== */
let AC=null;const lastS={};
function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function tone(f,d,type,g,slide,delay){if(!AC||S.muted)return;const t=AC.currentTime+(delay||0),o=AC.createOscillator(),a=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);a.gain.setValueAtTime(g||.06,t);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a).connect(AC.destination);o.start(t);o.stop(t+d+.02)}
let combo=0,comboT=0;
function snd(k){if(!AC||S.muted)return;const now=performance.now();if(lastS[k]&&now-lastS[k]<45)return;lastS[k]=now;
  if(k==='chop')tone(200,.09,'triangle',.1,80);
  else if(k==='pick'){combo=Math.min(combo+1,16);comboT=.6;tone(520+combo*45,.07,'sine',.07)}
  else if(k==='coin'){combo=Math.min(combo+1,16);comboT=.6;tone(900+combo*30,.05,'square',.03);tone(1300+combo*30,.07,'square',.025,null,.04)}
  else if(k==='buy'){[523,659,784,1047].forEach((f,i)=>tone(f,.16,'square',.05,null,i*.08))}
  else if(k==='hurt')tone(220,.22,'sawtooth',.07,70);
  else if(k==='kill'){tone(700,.12,'triangle',.08,1400);tone(300,.15,'sine',.06,120,.03)}
  else if(k==='boss'){tone(110,.5,'sawtooth',.08,70);tone(110,.5,'sawtooth',.08,70,.55)}
  else if(k==='tick')tone(1500,.03,'square',.02);
  else if(k==='new'){tone(880,.1,'sine',.06);tone(1320,.14,'sine',.06,null,.1)}
}
function buzz(ms){try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}

