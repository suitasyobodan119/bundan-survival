/* ===================== 音：BGMを作り直し（ドラム・ベース・和音つき）＋ファンファーレ ===================== */
// 曲はすべてこのゲームのために作ったオリジナル。音源ファイルは使わず、ブラウザの中で鳴らす（通信ゼロ・著作権の心配なし）
// 書き方：1小節＝8つ（8分音符）。「.」は前の音をのばす、「_」は休み、「|」は小節の区切り（読みやすさ用）
const NOTE={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const nm=s=>{const m=/^([A-G][#b]?)(\d)$/.exec(s);return m?12*(+m[2]+1)+NOTE[m[1]]:0};
function seq(str){const out=[];for(const tk of str.replace(/\|/g,' ').split(/\s+/).filter(Boolean)){if(tk==='.'){const p=out[out.length-1];if(p)p.len++;out.push(null)}else if(tk==='_')out.push(0);else out.push({n:nm(tk),len:1})}return out}
const SONG2={
  day:{bpm:120,lead:'triangle',lg:.05,
    mel:seq('E5 . G5 . A5 G5 E5 . | C5 . D5 E5 . . _ _ | A5 . C6 . A5 G5 F5 . | G5 . . . _ _ D5 E5 | G5 . E5 . G5 A5 C6 . | A5 G5 E5 . C5 . D5 E5 | F5 . A5 . G5 . E5 D5 | C5 . . . _ _ _ _'),
    ch:['C3 E3 G3','A2 C3 E3','F2 A2 C3','G2 B2 D3','C3 E3 G3','A2 C3 E3','F2 A2 C3','G2 B2 D3'],bass:'r_o_f_or',dr:{k:'x___x___',s:'__x___x_',h:'_x_x_x_x'}},
  night:{bpm:84,lead:'sine',lg:.06,
    mel:seq('E5 . . . C5 . D5 . | C5 . A4 . . . _ _ | G4 . C5 . E5 . D5 . | D5 . . . _ _ _ _ | E5 . . . G5 . A5 . | A5 . G5 E5 . . _ _ | D5 . E5 . C5 . B4 . | B4 . . . _ _ _ _'),
    ch:['A2 C3 E3','F2 A2 C3','C3 E3 G3','G2 B2 D3','A2 C3 E3','F2 A2 C3','G2 B2 D3','E2 G#2 B2'],bass:'r___f___',dr:{k:'x_______',s:'________',h:'____x___',w:'x___x___'}},
  alert:{bpm:150,lead:'square',lg:.026,
    mel:seq('D5 F5 A5 F5 D5 F5 A5 D6 | C6 A5 F5 A5 C6 . A5 . | Bb5 . A5 . G5 . F5 . | G5 . A5 . C6 . . . | D6 . C6 A5 . F5 G5 A5 | F5 . D5 . . . F5 G5 | A5 G5 F5 G5 A5 . Bb5 . | A5 . . . C#6 . E6 .'),
    ch:['D3 F3 A3','D3 F3 A3','Bb2 D3 F3','C3 E3 G3','D3 F3 A3','D3 F3 A3','Bb2 D3 F3','A2 C#3 E3'],bass:'rror rro',dr:{k:'x__xx___',s:'__x___x_',h:'xxxxxxxx'}},
  dezome:{bpm:108,lead:'flute',lg:.05,
    mel:seq('A5 . B5 A5 G5 . E5 . | D5 . E5 G5 A5 . . . | B5 . D6 . B5 A5 G5 . | A5 . . . _ _ E5 G5 | A5 . G5 E5 D5 . E5 . | G5 . A5 . B5 . A5 . | G5 E5 D5 E5 G5 . A5 . | D5 . . . _ _ _ _'),
    ch:['D3 A3','G2 D3','D3 A3','A2 E3','D3 A3','G2 D3','A2 E3','D3 A3'],bass:'r___f___',dr:{t:'x_xxx___',r:'______x_',h:'_x___x__'}}};
let nzBuf=null,rvb=null,bus2=null;
function sndBus(){if(bus2||!AC||!bgmG)return bus2;
  const comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;
  try{bgmG.disconnect()}catch(e){}bgmG.connect(comp).connect(AC.destination);
  // ほんのり響き（部屋の残響）
  rvb=AC.createConvolver();const L=AC.sampleRate*1.2,ir=AC.createBuffer(2,L,AC.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}rvb.buffer=ir;
  const wet=AC.createGain();wet.gain.value=.16;rvb.connect(wet).connect(bgmG);
  nzBuf=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const d=nzBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  bus2=bgmG;return bus2}
function env(g,t,a,peak,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d)}
function osc(type,f,t,d,peak,dest,a,send){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g,t,a||.012,peak,d);o.connect(g).connect(dest);if(send&&rvb)g.connect(rvb);o.start(t);o.stop(t+d+.05);return o}
function noise(t,d,peak,type,freq,dest){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nzBuf;f.type=type;f.frequency.value=freq;env(g,t,.003,peak,d);s.connect(f).connect(g).connect(dest);s.start(t,Math.random()*.3);s.stop(t+d+.02)}
const INST={
  lead(type,f,t,d,g,dest){if(type==='flute'){const o=osc('triangle',f,t,d,g,dest,.04,true),l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=5.5;lg.gain.value=f*.012;l.connect(lg).connect(o.frequency);l.start(t+.12);l.stop(t+d+.05);osc('sine',f*2,t,d*.8,g*.18,dest,.05)}
    else if(type==='square'){const f2=AC.createBiquadFilter();f2.type='lowpass';f2.frequency.value=2600;f2.connect(dest);osc('square',f,t,d,g,f2,.01,true);osc('square',f*1.004,t,d,g*.5,f2)}
    else osc(type,f,t,d,g,dest,.012,true)},
  bass(f,t,d,dest){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.connect(dest);osc('triangle',f,t,d,.11,lp,.008);osc('sine',f/2,t,d,.06,lp,.008)},
  pad(fs,t,d,dest){for(const f of fs)osc('sine',f,t,d,.018,dest,.25,true)},
  kick(t,dest,g){const o=AC.createOscillator(),a=AC.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.16);env(a,t,.003,g||.22,.2);o.connect(a).connect(dest);o.start(t);o.stop(t+.25)},
  snare(t,dest){noise(t,.12,.09,'bandpass',1900,dest);osc('triangle',190,t,.08,.05,dest,.002)},
  hat(t,dest,g){noise(t,.035,g||.03,'highpass',7500,dest)},
  wood(t,dest){osc('sine',1750,t,.06,.08,dest,.001);osc('sine',1180,t,.05,.05,dest,.001)},  // 拍子木（カチッ）
  taiko(t,dest,g){const o=AC.createOscillator(),a=AC.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(58,t+.3);env(a,t,.004,g||.26,.45);o.connect(a).connect(dest);o.start(t);o.stop(t+.5);noise(t,.06,.05,'lowpass',600,dest)},
  rim(t,dest){osc('square',820,t,.03,.04,dest,.001);noise(t,.03,.05,'bandpass',3200,dest)}};
let b2Step=0,b2Next=0,b2Mode='day';
const dzOn=()=>typeof DZ==='function'&&DZ();
const mgRhythm=()=>{const el=document.getElementById('mg');return !!(el&&!el.hidden&&typeof mg!=='undefined'&&mg&&mg.G&&mg.G.rhythm)};
bgmTick=function(){if(!AC)return;if(!bgmG){bgmG=AC.createGain();bgmG.gain.value=0;bgmG.connect(AC.destination)}sndBus();
  const on=!S.muted&&!S.bgmOff&&!document.hidden&&S.started&&!mgRhythm();bgmG.gain.setTargetAtTime(on?.9:0,AC.currentTime,.15);
  if(!on){b2Next=0;return}
  const now=AC.currentTime;if(b2Next<now-.2)b2Next=now+.06;
  if(b2Step%8===0){const m=alarmOn()?'alert':isNight()?'night':dzOn()?'dezome':'day';if(m!==b2Mode){b2Mode=m;b2Step=0}}
  const sg=SONG2[b2Mode],st=60/sg.bpm/2,N=sg.mel.length;
  while(b2Next<now+.3){const i=b2Step%N,bar=i>>3,j=i&7,t=b2Next,n=sg.mel[i];
    if(n&&n.n)INST.lead(sg.lead,mf(n.n),t,st*n.len*.95+.04,sg.lg,bgmG);
    if(j===0)INST.pad(sg.ch[bar%sg.ch.length].split(' ').map(x=>mf(nm(x)+12)),t,st*7.6,bgmG);
    const root=nm(sg.ch[bar%sg.ch.length].split(' ')[0]),bc=sg.bass[j];
    if(bc&&bc!=='_'&&bc!==' '){const f=mf(bc==='o'?root+12:bc==='f'?root+7:root);INST.bass(f,t,st*(bc==='r'&&sg.bass[j+1]==='_'?1.8:.9),bgmG)}
    const dr=sg.dr;if(dr.k&&dr.k[j]==='x')INST.kick(t,bgmG);if(dr.s&&dr.s[j]==='x')INST.snare(t,bgmG);if(dr.h&&dr.h[j]==='x')INST.hat(t,bgmG);
    if(dr.w&&dr.w[j]==='x'&&bar%2===0)INST.wood(t,bgmG);if(dr.t&&dr.t[j]==='x')INST.taiko(t,bgmG,j===0?.28:.18);if(dr.r&&dr.r[j]==='x')INST.rim(t,bgmG);
    b2Next+=st;b2Step++}};
// ファンファーレ（章クリアなど）と拍子木
snd=(o=>function(k){if(k==='fanfare'){if(!AC||S.muted)return;const t=AC.currentTime+.02,d=AC.destination;[[72,0],[76,.12],[79,.24],[84,.36]].forEach(([n,dt])=>{osc('square',mf(n),t+dt,.5,.05,d,.01);osc('triangle',mf(n-12),t+dt,.5,.06,d,.01)});osc('triangle',mf(88),t+.6,.9,.06,d,.02);osc('square',mf(84),t+.6,.9,.035,d,.02);return}
  if(k==='wood'){if(!AC||S.muted)return;INST.wood(AC.currentTime+.01,AC.destination);return}return o(k)})(snd);
chClear=(o=>function(){o();setTimeout(()=>snd('fanfare'),150)})(chClear);
