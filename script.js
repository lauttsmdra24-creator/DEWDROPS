(()=>{
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));


function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn&&fn(c.getContext('2d'));return c}
const R=(x,px,py,w,h,col)=>{x.fillStyle=col;x.fillRect(px,py,w,h)};
function E(x,cx,cy,rx,ry,col){x.fillStyle=col;for(let j=Math.floor(cy-ry);j<=Math.ceil(cy+ry);j++)for(let i=Math.floor(cx-rx);i<=Math.ceil(cx+rx);i++){if(((i+.5-cx)/rx)**2+((j+.5-cy)/ry)**2<=1)x.fillRect(i,j,1,1)}}
function hex(h){return [1,3,5].map(i=>parseInt(h.substr(i,2),16))}
function lerpHex(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}
function outline(c,col){const x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a),C=hex(col);
 const op=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&a[(j*w+i)*4+3]>0;
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(!op(i,j)&&(op(i+1,j)||op(i-1,j)||op(i,j+1)||op(i,j-1))){const k=(j*w+i)*4;o[k]=C[0];o[k+1]=C[1];o[k+2]=C[2];o[k+3]=255}}
 x.putImageData(new ImageData(o,w,h),0,0);return c}
function rng(s){return()=>(s=(s*16807)%2147483647)/2147483647}

/* ---------- foods ---------- */
const OL='#4a2c3f';
const FOODS=[
{id:'cupcake',sweet:true,spr:()=>mk(24,24,x=>{
 for(let y=13;y<=21;y++){const k=y-13,l=4+Math.floor(k*.3),r=19-Math.floor(k*.3);R(x,l,y,r-l+1,1,y%2?'#d99a5b':'#c98748')}
 for(let i=6;i<=17;i+=3)R(x,i,13,1,9,'#b3703a');
 E(x,12,12,8,3,'#ff7eb8');E(x,12,9,6.5,3,'#ff95c6');E(x,12,6,4.5,2.6,'#ffadd5');E(x,12,3.5,2,1.6,'#ffc4e2');
 R(x,9,8,2,1,'#ffd3ea');R(x,10,5,1,1,'#fff');
 [[8,10,'#4fc3f7'],[14,9,'#fff176'],[12,7,'#81c784'],[15,12,'#fff'],[7,12,'#fff176']].forEach(([a,b,c])=>R(x,a,b,1,1,c))})},
{id:'salad',sweet:false,spr:()=>mk(24,24,x=>{
 E(x,8,10,4.5,3.5,'#6ccf5a');E(x,15,9,5,4,'#8be06b');E(x,11.5,7,4.5,3.5,'#58b947');E(x,12,11,5,3,'#79d760');
 E(x,7,12,2.2,2.2,'#ff5a4d');R(x,6,11,1,1,'#ffb0a8');E(x,17,12.5,2,2,'#ff5a4d');E(x,12,13,2.3,2.3,'#b7e07a');R(x,12,13,1,1,'#eaf8c4');
 for(let y=14;y<=21;y++){const k=y-14,l=3+Math.floor(k*.45),r=20-Math.floor(k*.45);R(x,l,y,r-l+1,1,y===14?'#e8f4ff':(y%3?'#79b7ea':'#6aa7dc'))}
 R(x,8,22,8,1,'#5a97cc')})},
{id:'cake',sweet:true,spr:()=>mk(24,24,x=>{
 R(x,2,21,20,2,'#e8f1fb');
 R(x,3,10,17,3,'#5b2f1d');R(x,3,10,17,1,'#7c4430');
 R(x,3,13,17,2,'#fff6e6');R(x,3,15,17,3,'#9a5a36');R(x,3,18,17,1,'#fff6e6');R(x,3,19,17,2,'#b87b4d');
 R(x,5,13,1,1,'#5b2f1d');R(x,10,13,1,2,'#5b2f1d');R(x,16,13,1,1,'#5b2f1d');
 E(x,11,7,2.2,2.2,'#e53935');R(x,10,6,1,1,'#fff');R(x,12,3,1,2,'#3d7a2a')})},
{id:'pineapple',sweet:false,spr:()=>mk(24,24,x=>{
 E(x,12,15,6.5,7.5,'#ffc233');
 for(let j=8;j<=22;j++)for(let i=5;i<=19;i++){if(((i+.5-12)/6.5)**2+((j+.5-15)/7.5)**2<=1&&((i+j)%4===0||(i-j+40)%4===0))R(x,i,j,1,1,'#d98e00')}
 R(x,9,11,1,3,'#fff0a0');
 [[11,1,2,7],[8,3,2,5],[14,3,2,5],[6,5,2,4],[16,5,2,4]].forEach(([a,b,c,d])=>R(x,a,b,c,d,'#3d9b2f'));R(x,12,1,1,7,'#2a7a20')})},
{id:'icecream',sweet:true,spr:()=>mk(24,24,x=>{
 for(let y=15;y<=22;y++){const k=y-15,hw=Math.max(1,Math.round(6-k*.6));for(let i=12-hw;i<12+hw;i++)R(x,i,y,1,1,((i+y)%4===0)?'#b9772f':'#e9ae5e')}
 E(x,12,12,7,4,'#ff8fb1');E(x,12,7.5,5.5,4,'#fff0cf');E(x,12,3,1.7,1.7,'#e53935');
 R(x,7,15,1,2,'#ff8fb1');R(x,16,15,1,1,'#ff8fb1');R(x,9,10,2,1,'#ffc2d4');R(x,10,5,2,1,'#fff')})},
{id:'watermelon',sweet:false,spr:()=>mk(24,24,x=>{
 E(x,12,10,10.5,10.5,'#3cae4a');E(x,12,10,9.5,9.5,'#c4ecaa');E(x,12,10,8.5,8.5,'#ff5d6a');x.clearRect(0,0,24,10);
 [[8,13],[12,15],[16,13],[10,17],[14,18]].forEach(([a,b])=>R(x,a,b,1,2,'#2b1b1b'));R(x,6,11,2,1,'#ff9aa3')})},
{id:'roll',sweet:true,spr:()=>mk(24,24,x=>{
 E(x,12,13,9.5,8.5,'#e9a24f');E(x,12,13,8.5,7.5,'#fde7b8');E(x,12,13,6.8,6,'#e9a24f');E(x,12,13,5.8,5,'#fff0cc');E(x,12,13,4,3.6,'#e9a24f');E(x,12,13,3,2.6,'#fff0cc');E(x,12,13,1.6,1.4,'#e9a24f');
 E(x,12,4.5,4.5,2.4,'#fff');E(x,12,3.5,2.6,2.4,'#ff5252');R(x,11,2,1,1,'#ffb3b3');R(x,12,4,1,1,'#ffd54f')})},
{id:'donut',sweet:true,spr:()=>mk(24,24,x=>{
 E(x,12,12,10.5,8.5,'#d98f4a');E(x,12,11,10,7.5,'#f3b46c');E(x,12,11,9.2,6.8,'#ff7eb8');
 E(x,4.5,13,1.6,1.6,'#ff7eb8');E(x,19.5,13,1.6,1.6,'#ff7eb8');
 x.globalCompositeOperation='destination-out';E(x,12,11.5,3.2,2.4,'#000');x.globalCompositeOperation='source-over';
 [[7,8,'#fff'],[15,8,'#4fc3f7'],[17,11,'#fff176'],[6,12,'#81c784'],[9,14,'#fff176'],[14,15,'#fff'],[12,7,'#ff5252']].forEach(([a,b,c])=>R(x,a,b,2,1,c));
 R(x,6,9,3,1,'#ffb7d9')})}
];
FOODS.forEach(f=>{f.c=f.spr();outline(f.c,OL)});
const SWEETS=FOODS.filter(f=>f.sweet);
const ORDER=['cupcake','salad','cake','pineapple','icecream','watermelon','roll','donut'];

/* heart & sparkle */
function heartC(fill,edge,hi){const g=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'];const c=mk(9,8,x=>{g.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='X')R(x,i+1,j+1,1,1,fill)}));R(x,2,2,1,1,hi);R(x,2,3,1,1,hi)});return outline(c,edge)}
const HFULL=heartC('#ff4f7b','#a32050','#ffc0d2'),HEMPTY=heartC('#d3e6f2','#86a6bd','#eef7fc');
const HURL=HFULL.toDataURL();
const SPURL=outline(mk(9,9,x=>{['...X...','...X...','..XXX..','XXXXXXX','..XXX..','...X...','...X...'].forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='X')R(x,i+1,j+1,1,1,'#fff3a0')}))}),'#e8a000').toDataURL();

/* ---------- Dewdrop sprite ---------- */
const DW=52,DH=66;
const PAL={
 normal:{top:'#6fded8',left:'#52cdd1',rim:'#9af2ef',bands:['#36b5c6','#1b9bb8','#0b81a7','#05689a'],edgeTop:'#3aaab8',edge:'#06607f',visor:['#9aebee','#b3f3f4','#c9fafa'],visorEdge:'#80dde6',gloss:'#f4ffff',leaf:'#ffefce',leaf2:'#f9dcae',leafEdge:'#e3c18a',vein:'#ecc994',feet:'#0a6f98',feetEdge:'#05506f',feetHi:'#2f9ac2'},
 angry:{top:'#ffb490',left:'#ff9e7a',rim:'#ffd6c0',bands:['#f2806a','#e26852','#c9504a','#a63a4a'],edgeTop:'#e07a62',edge:'#7a2433',visor:['#ffd8c6','#ffe2d4','#ffece2'],visorEdge:'#ffbea6',gloss:'#fff8f2',leaf:'#ffefce',leaf2:'#f9dcae',leafEdge:'#e3c18a',vein:'#ecc994',feet:'#a5333f',feetEdge:'#6e1c2a',feetHi:'#c8505c'}
};
const sq=(u,v,n)=>Math.pow(Math.abs(u),n)+Math.pow(Math.abs(v),n)<=1;
const bodyM=(i,j)=>sq((i+.5-24-(j-36)*.1)/18.8,(j+.5-36-(i-24)*.09)/18.8,2.5);
const visM=(i,j)=>sq((i+.5-24.5)/13.4,(j+.5-31+Math.sin(i*.5)*.5)/10.4,3);
function leafM(i,j){const ax=29.5,ay=22.5,bx=44,by=3.5,dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),px=i+.5-ax,py=j+.5-ay,t=(px*dx+py*dy)/(L*L);if(t<0||t>1)return null;
 const sd=(px*dy-py*dx)/L,w=4.8*Math.sin(Math.PI*Math.pow(t,.8)),ok=sd>=0?sd<=w*1.1:-sd<=w*.75;if(!ok)return null;
 const vein=Math.abs(sd)<.55||(t>.3&&t<.75&&Math.abs(Math.abs(sd)-(t-.25)*2.4)<.5);return{t,v:vein?2:1}}
function buildBase(P){return mk(DW,DH,x=>{
 for(let j=0;j<DH;j++)for(let i=0;i<DW;i++){const a=leafM(i,j);if(!a)continue;const e=!leafM(i+1,j)||!leafM(i-1,j)||!leafM(i,j+1)||!leafM(i,j-1);R(x,i,j,1,1,e?P.leafEdge:(a.v===2?P.vein:(a.t<.3?P.leaf2:P.leaf)))}
 [[15,57.3],[32,60.6]].forEach(([cx,cy])=>{E(x,cx,cy,3.3,2.8,P.feetEdge);E(x,cx,cy,2.3,1.9,P.feet);R(x,Math.round(cx)-1,Math.round(cy)-1,1,1,P.feetHi)});
 const thr=[37,41,45,49],cols=[P.left].concat(P.bands);
 for(let j=0;j<DH;j++)for(let i=0;i<DW;i++){if(!bodyM(i,j))continue;
  const edge=!bodyM(i+1,j)||!bodyM(i-1,j)||!bodyM(i,j+1)||!bodyM(i,j-1);let col;
  if(edge)col=j<44?P.edgeTop:P.edge;
  else if(visM(i,j)){const ve=!visM(i+1,j)||!visM(i-1,j)||!visM(i,j+1)||!visM(i,j-1);const jj=j+(((i+j)&1)?.8:-.8);col=ve?P.visorEdge:(jj<24?P.visor[0]:jj<31?P.visor[1]:P.visor[2])}
  else if(j<22)col=P.top;
  else if(i>24&&j<48&&!bodyM(i+3,j))col=P.rim;
  else{const jj=j+(((i+j)&1)?.9:-.9);col=cols[thr.filter(t=>jj>=t).length]}
  R(x,i,j,1,1,col)}
 [[30,23],[31,22],[32,22],[33,22],[34,23],[35,23],[36,24],[36,25],[37,28]].forEach(([a,b])=>R(x,a,b,1,1,P.gloss));
})}
const BASE={normal:buildBase(PAL.normal),angry:buildBase(PAL.angry)};
const CR={};
function crownC(n){if(CR[n])return CR[n];const c=mk(DW,DH,x=>{[[15,19,4.1],[29,18,4.1],[22,15.5,5.6]].forEach(([cx,cy,r],k)=>{if(k===2||k<n-1)puff(x,cx,cy,r,TW)})});outline(c,'#7da3d2');CR[n]=c;return c}

function drawDew(cv,st,t){
 const x=cv.getContext('2d');x.clearRect(0,0,DW,DH);
 const m=st.mode;let ox=0,oy=0,eyes='open',mouth='neutral',blush=false;
 const blink=(t%3.6)<.13;
 if(m==='idle'){oy=Math.round(Math.sin(t*2.4)*1.1);eyes=blink?'blink':'open'}
 else if(m==='boop'){oy=2;eyes='squint';mouth='o'}
 else if(m==='happy'){oy=-Math.round(Math.abs(Math.sin(t*8))*2.5);eyes='happy';mouth='smile';blush=true}
 else if(m==='joy'){oy=-Math.round(Math.abs(Math.sin(t*10))*4);eyes='happy';mouth='smile';blush=true}
 else if(m==='eat'){oy=Math.round(Math.sin(t*16));eyes='happy';mouth=Math.sin(t*16)>0?'open':'smile';blush=true}
 else if(m==='refuse'){ox=Math.round(Math.sin(t*38)*2);eyes='squint';mouth='wavy'}
 else if(m==='angry'){ox=Math.round(Math.sin(t*60)*1.5);oy=Math.round(Math.sin(t*30));eyes='angry';mouth='frown'}
 else if(m==='sleepy'){oy=1+Math.round(Math.sin(t*1.6));eyes=Math.sin(t*1.6)>.2?'half':'sleep';mouth='o';blush=true}
 else if(m==='sleep'){oy=2+Math.round(Math.sin(t*1.3)*.8);eyes='sleep';mouth='neutral';blush=true}
 x.drawImage(m==='angry'?BASE.angry:BASE.normal,ox,oy);
 if(st.crown)x.drawImage(crownC(st.crown),ox,oy);
 const D='#07243f',D2='#17609a';
 const p=(i,j,c)=>{x.fillStyle=c;x.fillRect(i+ox,j+oy,1,1)};
 const eye=(cx,cy,half)=>{for(let j=-4;j<=4;j++)for(let i=-3;i<=3;i++){if((i/3.5)**2+(j/4)**2<=1&&(!half||j>=0))p(cx+i,cy+j,(i<=1&&j>=1)?D2:D)}
  if(!half){p(cx+1,cy-3,'#fff');p(cx+2,cy-3,'#fff');p(cx+1,cy-2,'#fff');p(cx+2,cy-2,'#fff');p(cx-2,cy+2,'#bfe8ff')}else{for(let i=-2;i<=2;i++)p(cx+i,cy-1,D)}};
 const LE=17,RE=31,EY=32;
 const arc=(cx,cy,pts)=>pts.forEach(([a,b])=>p(cx+a,cy+b,D));
 const UP=[[-3,1],[-3,2],[-2,0],[-1,-1],[0,-1],[1,-1],[2,0],[3,1],[3,2]],DOWN=[[-3,-1],[-2,0],[-1,1],[0,1],[1,1],[2,0],[3,-1]];
 if(eyes==='open'){eye(LE,EY);eye(RE,EY)}
 else if(eyes==='half'){eye(LE,EY,1);eye(RE,EY,1)}
 else if(eyes==='blink'||eyes==='squint'){[LE,RE].forEach(c=>{for(let i=-3;i<=3;i++){p(c+i,EY,D);p(c+i,EY+1,D)}})}
 else if(eyes==='happy'){arc(LE,EY,UP);arc(RE,EY,UP)}
 else if(eyes==='sleep'){arc(LE,EY+1,DOWN);arc(RE,EY+1,DOWN)}
 else if(eyes==='angry'){eye(LE,EY+1);eye(RE,EY+1);for(let k=0;k<9;k++){const yy=EY-8+Math.floor(k*.45);p(LE-5+k,yy,D);p(LE-5+k,yy+1,D);p(RE+5-k,yy,D);p(RE+5-k,yy+1,D)}}
 const mx=24,my=36;
 if(mouth==='neutral')arc(mx,my,[[-2,0],[-1,1],[0,0],[1,1],[2,0]]);
 else if(mouth==='smile'){[[-3,0,7],[-2,1,5],[-1,2,3]].forEach(([a,b,w])=>{for(let i=0;i<w;i++)p(mx+a+i,my+b,b===2?'#ff8fa8':D)})}
 else if(mouth==='open'){for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){if((i/3.2)**2+(j/3.2)**2<=1)p(mx+i,my+1+j,j>0?'#ff8fa8':D)}}
 else if(mouth==='o'){for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){if((i/2.2)**2+(j/2.2)**2<=1)p(mx+i,my+1+j,D)}}
 else if(mouth==='frown')arc(mx,my+1,[[-3,1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,1]]);
 else if(mouth==='wavy')arc(mx,my,[[-3,1],[-2,0],[-1,1],[0,0],[1,1],[2,0],[3,1]]);
 if(blush){[[13,37],[35,37]].forEach(([a,b])=>{x.globalAlpha=.75;for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++)if((i/2.4)**2+(j/1.4)**2<=1)p(a+i,b+j,'#ff8db4');x.globalAlpha=1})}
 if(m==='angry'){if(Math.sin(t*12)>-.3)['XX.XX','X...X','.....','X...X','XX.XX'].forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='X')x.fillStyle='#ff3b3b',x.fillRect(2+i,14+j,1,1)}));
  [13,35].forEach((sx,k)=>{const yy=14-((t*14+k*5)%9);x.globalAlpha=.8;x.fillStyle='#fff';x.fillRect(sx,Math.round(yy),2,2);x.globalAlpha=1})}
 if(m==='refuse'){[[44,26],[43,27],[44,27],[45,27],[43,28],[44,28],[45,28],[44,29]].forEach(([a,b])=>{x.fillStyle='#7fd3ff';x.fillRect(a,b,1,1)})}
}

/* ---------- scenery ---------- */
function setup(c){const W=innerWidth,H=innerHeight,sc=Math.max(3,Math.round(Math.min(W,H)/100));c.width=Math.ceil(W/sc);c.height=Math.ceil(H/sc);return{x:c.getContext('2d'),w:c.width,h:c.height}}
function circ(x,cx,cy,r,col){x.fillStyle=col;for(let j=Math.floor(cy-r);j<=Math.ceil(cy+r);j++)for(let i=Math.floor(cx-r);i<=Math.ceil(cx+r);i++){if((i+.5-cx)**2+(j+.5-cy)**2<=r*r)x.fillRect(i,j,1,1)}}
function puff(x,cx,cy,r,T){circ(x,cx,cy,r,T.shade);circ(x,cx-r*.06,cy-r*.1,r*.88,T.base);circ(x,cx-r*.32,cy-r*.4,r*.26,T.hi)}
const TW={base:'#fbf8f1',shade:'#d6e3f4',hi:'#fff'},TB={base:'#e9f1fd',shade:'#c3d6f0',hi:'#fbfdff'};
function paintSky(c,kind){const{x,w,h}=setup(c);
 const st=kind==='day'?['#80d8ff','#68cffc','#8cdcff','#b8edff']:['#547fd2','#7599e0','#9db6ec','#c8d6f6'];
 const n=18;for(let i=0;i<n;i++){const t=i/(n-1)*(st.length-1),k=Math.min(st.length-2,Math.floor(t));x.fillStyle=lerpHex(st[k],st[k+1],t-k);x.fillRect(0,Math.floor(i*h/n),w,Math.ceil(h/n)+1)}
 const r=rng(7);x.globalAlpha=.12;for(let k=0;k<9;k++)circ(x,r()*w,r()*h*.8,8+r()*18,'#fff');x.globalAlpha=1}
function paintClouds(c,mode){const{x,w,h}=setup(c);const r=rng(mode==='ground'?11:23),u=Math.min(w,h);
 if(mode==='ground'){
  for(let px=-10;px<w+20;px+=12){const R_=u*(.1+r()*.07);puff(x,px,h*.86+r()*3,R_,TB)}
  for(let px=-6;px<w+20;px+=Math.max(14,u*.12)){const R_=u*(.14+r()*.08);puff(x,px,h*1.0+r()*2,R_,TW)}
 }else{
  const TS={base:'#f7fbff',shade:'#e8f1fc',hi:'#ffffff'};

  const corner=(ax,ay,sx,sy,rmax,spX,spY)=>{const L=[];
   const add=(d,th,sz)=>{const R_=rmax*(1-.72*d)*sz;L.push({px:ax+sx*d*spX*Math.cos(th),py:ay+sy*d*spY*Math.sin(th),R_,d})};
   add(0,0,1.05);
   for(let k=0;k<30;k++){const d=Math.pow(r(),.85),th=r()*Math.PI/2;add(d,th,.55+r()*.65)}
   for(let k=0;k<7;k++){add(.15+k/7*.8,.03+r()*.1,.5+r()*.5);add(.15+k/9*.8,Math.PI/2-.03-r()*.1,.4+r()*.5)}
   for(let k=0;k<3;k++)add(1.05+r()*.18,r()<.5?r()*.25:Math.PI/2-r()*.25,.2+r()*.14);
   L.sort((a,b)=>b.d-a.d).forEach(o=>puff(x,o.px,o.py,o.R_,TS))};
  x.globalAlpha=.94;
  const spX=Math.min(w*.34,u*.7),spY=Math.min(h*.24,u*.5);
  corner(-2,h*.98,1,-1,u*.17,spX,spY);corner(w+2,h*.98,-1,-1,u*.18,spX*.95,spY);
  corner(-2,h*.02,1,1,u*.1,spX*.75,spY*.7);corner(w+2,h*.02,-1,1,u*.105,spX*.75,spY*.7);
  x.globalAlpha=1}}
function cloudSprite(){return mk(40,18,x=>{[[8,12,6],[16,9,8],[26,10,7],[33,13,5],[22,13,7]].forEach(([cx,cy,r])=>puff(x,cx,cy,r,TW))})}
function buildFloaters(){document.querySelectorAll('.floaters').forEach((f,k)=>{const r=rng(31+k*7);for(let i=0;i<4;i++){const c=cloudSprite();const s=2+Math.floor(r()*3);c.style.width=40*s+'px';c.style.top=(4+r()*38)+'%';c.style.opacity=.75+r()*.25;c.style.animationDuration=(70+r()*80)+'s';c.style.animationDelay=-(r()*150)+'s';f.appendChild(c)}})}
function paintAll(){document.querySelectorAll('canvas[data-sky]').forEach(c=>paintSky(c,c.dataset.sky));document.querySelectorAll('canvas[data-clouds]').forEach(c=>paintClouds(c,c.dataset.clouds))}
function paintMoon(){const c=$('#moon');const x=c.getContext('2d');x.clearRect(0,0,18,18);circ(x,9,9,7.5,'#fff3b8');x.globalCompositeOperation='destination-out';circ(x,13,7,6.5,'#000');x.globalCompositeOperation='source-over';circ(x,5,11,1,'#f0dc8c');outline(c,'#e8c860');c.style.width=18*Math.max(3,Math.round(Math.min(innerWidth,innerHeight)/70))+'px'}
function buildSparks(){const s=$('#sparks'),r=rng(77);for(let i=0;i<18;i++){const e=document.createElement('i'),z=14+Math.floor(r()*4)*5;e.style.cssText=`left:${r()*96}%;top:${r()*92}%;width:${z}px;height:${z}px;background-image:url(${SPURL});animation-delay:${-r()*2.4}s;animation-duration:${1.8+r()*1.8}s`;s.appendChild(e)}}
function buildStars(){const s=$('#stars');const r=rng(5);for(let i=0;i<22;i++){const d=document.createElement('div');d.className='star';const z=r()<.3?6:4;d.style.cssText=`left:${r()*100}%;top:${r()*55}%;width:${z}px;height:${z}px;animation-delay:${-r()*3}s;animation-duration:${1.8+r()*2}s`;s.appendChild(d)}}


function paintTrayCloud(){
 const t=$('#tray');if(!t)return;
 let c=$('#trayCloud');
 if(!c){c=document.createElement('canvas');c.id='trayCloud';c.className='traycloud';t.prepend(c)}
 const sc=Math.max(3,Math.round(Math.min(innerWidth,innerHeight)/100));
 const Wu=t.offsetWidth/sc,Hu=t.offsetHeight/sc;
 if(Wu<10||Hu<10)return;
 const pu=Math.round(Hu*.4),cw=Math.ceil(Wu+pu*2),ch=Math.ceil(Hu+pu*2);
 c.width=cw;c.height=ch;
 c.style.width=cw*sc+'px';c.style.height=ch*sc+'px';c.style.left=-pu*sc+'px';c.style.top=-pu*sc+'px';
 const x=c.getContext('2d'),r=rng(9),L=[];
 const x0=pu,x1=pu+Wu,y0=pu,y1=pu+Hu,mid=(y0+y1)/2;
 
 L.push({x:x0+Hu*.1,y:mid+Hu*.04,r:Hu*.44});
 L.push({x:x1-Hu*.1,y:mid-Hu*.02,r:Hu*.42});
 for(let px=x0+Hu*.2;px<=x1-Hu*.2;px+=Hu*.3)L.push({x:px,y:mid+(r()-.5)*Hu*.12,r:Hu*(.38+r()*.1)});
 
 let px=x0+Hu*.12;
 while(px<x1-Hu*.1){const rr=Hu*(.22+r()*.2);L.push({x:px,y:y0+Hu*.18-r()*Hu*.1,r:rr,top:1});px+=rr*(.75+r()*.5)}
 
 px=x0+Hu*.1;
 while(px<x1-Hu*.05){const rr=Hu*(.18+r()*.1);L.push({x:px,y:y1-Hu*.1+(r()-.5)*Hu*.04,r:rr});px+=rr*(.9+r()*.4)}
 L.forEach(o=>circ(x,o.x,o.y,o.r,TW.shade));
 L.forEach(o=>circ(x,o.x-o.r*.05,o.y-o.r*.1,o.r*.9,TW.base));
 L.filter(o=>o.top).forEach(o=>circ(x,o.x-o.r*.35,o.y-o.r*.45,Math.max(1,o.r*.17),'#fff'))
}

/* ---------- audio ---------- */
const AC=window.AudioContext||window.webkitAudioContext;
let ac=null,master=null,musicGain=null,muted=false,musicMode='happy',step=0,nextT=0,timer=null;
const MEL=[
'E5','G5','E5','C5','D5','E5','G5',null, 'E5','A5','E5','C5','B4','C5','E5',null,
'F5','A5','F5','C5','A4','C5','F5',null, 'D5','G5','D5','B4','G4','B4','D5',null,
'C5','E5','G5','E5','C6','G5','E5',null, 'C5','E5','A5','E5','C6','A5','E5',null,
'A4','C5','F5','C5','A5','F5','C5',null, 'B4','D5','G5','D5','B5','G5','D5',null];
const CH=[['C3','E3','G3'],['A2','C3','E3'],['F2','A2','C3'],['G2','B2','D3']];
function nf(n){const m=/^([A-G])(#?)(\d)$/.exec(n);const b={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0);return 440*Math.pow(2,(12*(+m[3]+1)+b-69)/12)}
function tone(f,t,d,type,vol,dest){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(dest||musicGain);o.start(t);o.stop(t+d+.05)}
function sched(){if(!ac)return;while(nextT<ac.currentTime+.3){const i=step%64,bar=Math.floor(i/8)%4,pos=i%8;
 if(musicMode==='happy'){const n=MEL[i];if(n){const f=nf(n);tone(f,nextT,.32,'triangle',.17);tone(f*2,nextT,.14,'sine',.04)}
  if(pos===0||pos===4)tone(nf(CH[bar][0]),nextT,.85,'sine',.2);
  if(pos===2||pos===6)tone(nf(CH[bar][1])*2,nextT,.3,'sine',.05),tone(nf(CH[bar][2])*2,nextT+.0,.3,'sine',.04);
  nextT+=.22}
 else{const n=MEL[i];if(i%2===0&&n)tone(nf(n),nextT,1.3,'sine',.12);if(pos===0)CH[bar].forEach(c=>tone(nf(c),nextT,3.4,'sine',.06));nextT+=.5}
 step++}}
function initAudio(){if(!AC)return;if(!ac){ac=new AC();master=ac.createGain();master.gain.value=muted?0:.5;master.connect(ac.destination);musicGain=ac.createGain();musicGain.gain.value=.55;musicGain.connect(master);nextT=ac.currentTime+.1;timer=setInterval(sched,60)}
 if(ac.state==='suspended')ac.resume()}
function sfx(k){if(!ac||muted)return;const t=ac.currentTime;
 if(k==='eat')[0,.11,.22].forEach((o,i)=>tone(300+i*70,t+o,.1,'square',.1,master));
 else if(k==='good')[523,659,784,1047].forEach((f,i)=>tone(f,t+.3+i*.08,.2,'triangle',.16,master));
 else if(k==='no'){tone(190,t,.18,'sawtooth',.1,master);tone(140,t+.17,.28,'sawtooth',.1,master)}
 else if(k==='heart')tone(880+Math.random()*400,t,.25,'sine',.12,master);
 else if(k==='angry')[0,.12,.24,.36].forEach((o,i)=>tone(150-i*12,t+o,.14,'sawtooth',.11,master));
 else if(k==='boop')tone(420,t,.09,'sine',.18,master);
 else if(k==='pick')tone(660,t,.06,'square',.06,master);
 else if(k==='win')[523,659,784,659,784,1047].forEach((f,i)=>tone(f,t+i*.12,.25,'triangle',.15,master))}
function setMuted(m){muted=m;$('#snd').classList.toggle('off',m);if(master)master.gain.value=m?0:.5}
$('#snd').addEventListener('click',e=>{initAudio();setMuted(!muted)});
document.addEventListener('visibilitychange',()=>{if(!ac)return;document.hidden?ac.suspend():ac.resume()});

/* ---------- pages ---------- */
let cur=1;
function gotoPage(n){cur=n;[1,2,3].forEach(i=>$('#p'+i).classList.toggle('active',i===n));musicMode=n===3?'sleep':'happy'}

/* ---------- layout ---------- */
const dewCv=$('#dew2'),dew3=$('#dew3');
[dewCv,dew3].forEach(c=>{c.width=DW;c.height=DH});
const hearts=[];
function layout(){
 const W_=innerWidth,H=innerHeight,port=H>W_;
 const sc=(aw,ah)=>Math.max(3,Math.floor(Math.min(aw/DW,ah/DH)));
 let s=port?sc(W_*.74,H*.45):sc(W_*.42,H*.7);dewCv.style.width=DW*s+'px';dewCv.style.height=DH*s+'px';
 const dewW=DW*s;
 const bs=Math.max(2,Math.round(dewW*.2/24));const wc=$('#want');wc.style.width=24*bs+'px';wc.style.height=24*bs+'px';
 const vm=Math.min(W_,H),availH=Math.min(H*.68,H-vm*.16-H*.14);
 s=sc(W_*.88,availH);dew3.style.width=DW*s+'px';dew3.style.height=DH*s+'px';
 const tg=port?Math.min(W_*.19,H*.1):Math.min(W_*.085,H*.17),fs=Math.max(2,Math.round(tg/24));
 document.querySelectorAll('.food canvas').forEach(c=>{c.style.width=24*fs+'px';c.style.height=24*fs+'px'});
 const hs=Math.max(3,Math.round(Math.min(W_,H)/110));hearts.forEach(c=>{c.style.width=9*hs+'px';c.style.height=8*hs+'px'});
 const ws=Math.max(2,Math.round(dewW*.26/22));wk.cv.style.width=22*ws+'px';wk.cv.style.height=17*ws+'px';wk.w=22*ws;wk.h=17*ws;wk.speed=Math.max(30,dewW*.14);
 paintTrayCloud();
}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{paintAll();paintMoon();layout()},120)});

/* ---------- game ---------- */
const PR={idle:0,happy:1,boop:1,refuse:2,eat:3,joy:3,angry:4,sleepy:5,sleep:6};
const G={mode:'idle',until:0,crown:0};
const GOAL=5;
let fed=0,target=null,locked=false,petUntil=0,tapTimes=[],lastHeart=0,lastZ=0,lastZ3=0;
const bubble=$('#bubble'),fx2=$('#fx2'),fx3=$('#fx3');

function buildHud(){const h=$('#hearts');h.innerHTML='';hearts.length=0;for(let i=0;i<GOAL;i++){const c=mk(9,8);c.getContext('2d').drawImage(HEMPTY,0,0);h.appendChild(c);hearts.push(c)}}
function updateHud(pop){hearts.forEach((c,i)=>{const x=c.getContext('2d');x.clearRect(0,0,9,8);x.drawImage(i<fed?HFULL:HEMPTY,0,0);if(pop&&i===fed-1){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}})}
function newTarget(){let n;do{n=SWEETS[Math.floor(Math.random()*SWEETS.length)]}while(n===target&&SWEETS.length>1);target=n;const x=$('#want').getContext('2d');x.clearRect(0,0,24,24);x.drawImage(n.c,0,0);bubble.classList.remove('hide')}
function setMode(m,ms){const now=performance.now();if(PR[m]<PR[G.mode]&&now<G.until)return;G.mode=m;G.until=now+ms}

function spawnImg(fx,src,w,left,top,cls){const i=document.createElement('img');i.src=src;i.style.cssText=`width:${w}px;left:${left}%;top:${top}%`;if(cls)i.className=cls;fx.appendChild(i);setTimeout(()=>i.remove(),1500);return i}
function spawnHeart(fx){const w=Math.max(24,Math.round(dewCv.clientWidth*.1));spawnImg(fx,HURL,w,20+Math.random()*50,8+Math.random()*16)}
function spawnSparkles(fx){const w=Math.max(18,Math.round(dewCv.clientWidth*.07));for(let k=0;k<6;k++){const a=k/6*Math.PI*2,i=spawnImg(fx,SPURL,w,44,30,'sp');i.style.setProperty('--dx',Math.cos(a)*dewCv.clientWidth*.3+'px');i.style.setProperty('--dy',Math.sin(a)*dewCv.clientWidth*.3+'px')}}
function spawnZ(fx,cv){const z=document.createElement('div');z.className='z';z.textContent=Math.random()<.5?'Z':'z';z.style.left=(58+Math.random()*14)+'%';z.style.top=(10+Math.random()*10)+'%';fx.appendChild(z);setTimeout(()=>z.remove(),2700)}

/* tray */
function buildTray(){const t=$('#tray');t.innerHTML='';ORDER.forEach(id=>{const f=FOODS.find(o=>o.id===id);const el=document.createElement('div');el.className='food';const c=mk(24,24);c.getContext('2d').drawImage(f.c,0,0);el.appendChild(c);t.appendChild(el);bindFood(el,f)})}
function bindFood(el,item){let d=null;
 el.addEventListener('pointerdown',e=>{if(locked||d)return;e.preventDefault();initAudio();el.setPointerCapture(e.pointerId);d={id:e.pointerId,sx:e.clientX,sy:e.clientY};el.classList.add('drag');el.style.transition='none';el.style.transform='scale(1.15)';sfx('pick')});
 el.addEventListener('pointermove',e=>{if(!d||d.id!==e.pointerId)return;el.style.transform=`translate(${e.clientX-d.sx}px,${e.clientY-d.sy}px) scale(1.15)`});
 const end=e=>{if(!d||d.id!==e.pointerId)return;d=null;el.classList.remove('drag');
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dr=dewCv.getBoundingClientRect(),pad=dr.width*.06;
  const hit=e.type==='pointerup'&&cx>dr.left-pad&&cx<dr.right+pad&&cy>dr.top&&cy<dr.bottom+pad;
  if(hit){const ok=feed(item);
   if(ok){const mx=dr.left+dr.width*.47,my=dr.top+dr.height*.52;const sx0=parseFloat(el.style.transform.match(/translate\(([-\d.]+)px/)?.[1]||0),sy0=parseFloat(el.style.transform.match(/translate\([-\d.]+px,\s*([-\d.]+)px/)?.[1]||0);
    el.style.transition='transform .28s ease-in';el.style.transform=`translate(${sx0+(mx-cx)}px,${sy0+(my-cy)}px) scale(0)`;
    setTimeout(()=>{el.style.transition='none';el.style.transform='scale(0)';void el.offsetWidth;el.style.transition='transform .4s cubic-bezier(.3,1.6,.5,1)';el.style.transform=''},700);return}}
  el.style.transition='transform .3s cubic-bezier(.3,1.6,.5,1)';el.style.transform=''};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)}

function feed(item){
 if(locked)return false;
 if(G.mode==='angry'){sfx('no');return false}
 if(item.id===target.id){
  sfx('eat');setMode('eat',950);fed++;updateHud(true);spawnSparkles(fx2);bubble.classList.add('hide');
  if(fed>=GOAL){locked=true;hideWalker();setTimeout(()=>sfx('win'),400);
   setTimeout(()=>{G.mode='sleepy';G.until=Infinity},1000);
   setTimeout(()=>{gotoPage(3)},3600)}
  else{setTimeout(()=>{sfx('good');newTarget()},950)}
  return true}
 sfx('no');setMode('refuse',900);bubble.classList.remove('shake');void bubble.offsetWidth;bubble.classList.add('shake');return false}

/* petting & tapping */
const wrap=$('#dewHit');
let lastP=null,lastSign=0,revs=[],down=null;
function inHead(e){const r=dewCv.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top+r.height*.22&&e.clientY<=r.top+r.height*.70}
wrap.addEventListener('pointermove',e=>{if(locked||G.mode==='angry')return;const now=performance.now();
 if(!inHead(e)){lastP=null;return}
 if(lastP){const dx=e.clientX-lastP.x,dy=e.clientY-lastP.y,d=Math.abs(dx)>=Math.abs(dy)?dx:dy;if(Math.abs(d)>2){const s=Math.sign(d);if(lastSign&&s!==lastSign)revs.push(now);lastSign=s}}
 lastP={x:e.clientX,y:e.clientY};revs=revs.filter(v=>now-v<900);if(revs.length>=3)petUntil=now+650});
wrap.addEventListener('pointerleave',()=>{lastP=null});
wrap.addEventListener('pointerdown',e=>{initAudio();down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}});
wrap.addEventListener('pointermove',e=>{if(down)down.moved=Math.max(down.moved,Math.hypot(e.clientX-down.x,e.clientY-down.y))});
wrap.addEventListener('pointerup',e=>{if(!down)return;const now=performance.now(),tap=now-down.t<380&&down.moved<12;down=null;
 if(!tap||locked||G.mode==='angry')return;
 tapTimes.push(now);tapTimes=tapTimes.filter(v=>now-v<1800);
 if(tapTimes.length>=5){tapTimes=[];petUntil=0;setMode('angry',2400);sfx('angry')}
 else{setMode('boop',240);sfx('boop')}});
wrap.addEventListener('pointercancel',()=>{down=null});

/* smoll cloud */
const WKF=[0,1].map(f=>{const c=mk(22,17,x=>{
 const ly=f?12:13,ry=f?13:12;R(x,6,12,3,ly===13?3:2,'#9db8de');R(x,14,12,3,ry===13?3:2,'#9db8de');
 [[6,8,4.4],[16,8,4.4],[11,5.6,5.6],[11,8.6,5]].forEach(([cx,cy,r])=>puff(x,cx,cy,r,TW));
 R(x,8,6,1,2,'#2b3f66');R(x,14,6,1,2,'#2b3f66');R(x,6,8,2,1,'#ffb3c9');R(x,15,8,2,1,'#ffb3c9');R(x,10,9,1,1,'#2b3f66');R(x,11,10,1,1,'#2b3f66');R(x,12,9,1,1,'#2b3f66')});
 return outline(c,'#7b9fcc')});
const wk={el:document.createElement('div'),cv:mk(22,17),x:0,y:0,dir:1,state:'gone',frame:0,ft:0,w:66,h:51,speed:40,spawnAt:0,gs:0,gx:0,gy:0,sc:1,drag:null};
wk.el.className='walker';wk.el.appendChild(wk.cv);$('#walkLayer').appendChild(wk.el);
function drawWalker(){const x=wk.cv.getContext('2d');x.clearRect(0,0,22,17);x.drawImage(WKF[wk.frame],0,0)}
function hideWalker(){wk.state='gone';wk.spawnAt=0;wk.el.style.display='none'}
function spawnWalker(){const dr=dewCv.getBoundingClientRect();wk.state='walk';wk.spawnAt=0;wk.dir=Math.random()<.5?1:-1;const side=wk.dir>0?-1:1;
 wk.x=clamp(dr.left+dr.width/2+side*dr.width*.72-wk.w/2,4,innerWidth-wk.w-4);wk.y=dr.top+dr.height*.93-wk.h;wk.el.style.display='block';wk.el.style.zIndex=3;wk.frame=0;drawWalker()}
function startGive(){wk.state='give';wk.gs=performance.now();wk.gx=wk.x;wk.gy=wk.y;wk.sc=1;sfx('good');setMode('joy',2300);petUntil=0}
function finishGive(now){wk.state='gone';wk.el.style.display='none';G.crown=Math.min(3,G.crown+1);spawnSparkles(fx2);wk.spawnAt=now+4500}
function updateWalker(now,dt){
 if(wk.state==='gone'){if(wk.spawnAt&&now>wk.spawnAt&&!locked&&G.crown<3)spawnWalker();return}
 if(locked){hideWalker();return}
 const dr=dewCv.getBoundingClientRect(),dcx=dr.left+dr.width/2,gy=dr.top+dr.height*.93-wk.h;let bob=0;
 if(wk.state==='walk'){
  const range=Math.max(dr.width*.74,wk.w*2);wk.x+=wk.dir*wk.speed*dt;const cx=wk.x+wk.w/2;
  if(cx>dcx+range)wk.dir=-1;else if(cx<dcx-range)wk.dir=1;
  if(wk.x<4){wk.x=4;wk.dir=1}if(wk.x>innerWidth-wk.w-4){wk.x=innerWidth-wk.w-4;wk.dir=-1}
  wk.y+=(gy-wk.y)*Math.min(1,dt*8);
  if(now-wk.ft>210){wk.ft=now;wk.frame^=1;drawWalker()}
  bob=-Math.abs(Math.sin(now/210*Math.PI))*wk.w*.06}
 else if(wk.state==='drag'){if(now-wk.ft>110){wk.ft=now;wk.frame^=1;drawWalker()}}
 else if(wk.state==='give'){const pr=Math.min(1,(now-wk.gs)/380),e=pr*pr*(3-2*pr);
  const tx=dr.left+dr.width*(22/DW)-wk.w/2,ty=dr.top+dr.height*(14/DH)-wk.h/2;wk.x=wk.gx+(tx-wk.gx)*e;wk.y=wk.gy+(ty-wk.gy)*e;wk.sc=1-.55*e;if(pr>=1){finishGive(now);return}}
 const k=wk.state==='give'?wk.sc:1;
 wk.el.style.transform=`translate(${wk.x}px,${wk.y+bob}px) scale(${wk.dir*k},${k})`}
wk.el.addEventListener('pointerdown',e=>{if(locked||wk.state!=='walk')return;e.preventDefault();initAudio();wk.el.setPointerCapture(e.pointerId);wk.state='drag';wk.drag={id:e.pointerId,ox:e.clientX-wk.x,oy:e.clientY-wk.y};wk.el.style.zIndex=20;sfx('pick')});
wk.el.addEventListener('pointermove',e=>{if(wk.state!=='drag'||wk.drag.id!==e.pointerId)return;wk.x=e.clientX-wk.drag.ox;wk.y=e.clientY-wk.drag.oy});
const wkEnd=e=>{if(wk.state!=='drag'||wk.drag.id!==e.pointerId)return;const dr=dewCv.getBoundingClientRect(),cx=wk.x+wk.w/2,cy=wk.y+wk.h/2,pad=dr.width*.05;
 const hit=e.type==='pointerup'&&cx>dr.left-pad&&cx<dr.right+pad&&cy>dr.top&&cy<dr.bottom+pad;
 wk.el.style.zIndex=3;if(hit&&G.mode!=='angry'&&!locked)startGive();else wk.state='walk'};
wk.el.addEventListener('pointerup',wkEnd);wk.el.addEventListener('pointercancel',wkEnd);

/* reset */
function resetGame(){fed=0;locked=false;G.mode='idle';G.until=0;G.crown=0;petUntil=0;tapTimes=[];hideWalker();wk.spawnAt=performance.now()+1800;updateHud();newTarget();buildTray();layout();gotoPage(2)}

/* ---------- loop ---------- */
let lastT=0;
function frame(now){
 const dt=Math.min(.05,Math.max(0,(now-lastT)/1000));lastT=now;
 if(cur===2){
  if(G.mode!=='idle'&&G.mode!=='sleepy'&&G.mode!=='sleep'&&G.mode!=='happy'&&now>G.until)G.mode='idle';
  if(G.mode==='happy'&&now>petUntil)G.mode='idle';
  if(!locked&&now<petUntil&&PR[G.mode]<=PR.happy){G.mode='happy';G.until=petUntil}
  if((G.mode==='happy'||G.mode==='joy')&&now-lastHeart>380){lastHeart=now;spawnHeart(fx2);if(Math.random()<.45)sfx('heart')}
  if(G.mode==='sleepy'&&now-lastZ>1000){lastZ=now;spawnZ(fx2)}
  updateWalker(now,dt);
  drawDew(dewCv,G,now/1000)}
 else if(cur===3){if(now-lastZ3>1200){lastZ3=now;spawnZ(fx3)}drawDew(dew3,{mode:'sleep',crown:G.crown},now/1000)}
 requestAnimationFrame(frame)}

/* ---------- init ---------- */
$('#playBtn').addEventListener('click',()=>{initAudio();sfx('good');resetGame()});
$('#again').addEventListener('click',()=>{initAudio();sfx('good');resetGame()});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerdown',()=>{if(ac&&ac.state==='suspended')ac.resume()});
buildHud();buildTray();paintAll();paintMoon();buildStars();buildSparks();buildFloaters();layout();updateHud();newTarget();
requestAnimationFrame(frame);
})();