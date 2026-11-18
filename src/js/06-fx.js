/* ===================== 演出 ===================== */
function float(x,y,txt,col,size){floats.push({x,y,txt,col:col||'#fff',size:size||14,life:1})}
function burst(x,y,c,n){for(let i=0;i<n;i++){const a=Math.random()*7,s=60+Math.random()*140;parts.push({k:'conf',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-90,life:1,c:i%3===0?'#e5432a':i%3===1?c:'#22355c'})}}
function fly(item,x,y,tx,ty){parts.push({k:'fly',item,sx:x,sy:y,tx,ty,t:0,life:1})}
function toast(m,k){const el=document.createElement('div');el.className='toast '+(k||'');el.textContent=m;const b=document.getElementById('toasts');b.appendChild(el);while(b.children.length>2)b.firstChild.remove();setTimeout(()=>el.remove(),3200)}
function pop(h,p){const el=document.getElementById('pop');document.getElementById('popH').textContent=h;document.getElementById('popP').textContent=p;el.classList.remove('show');void el.offsetWidth;el.classList.add('show')}
function bump(id){const el=document.getElementById(id);el.classList.add('bump');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('bump'),120)}

