const c=document.getElementById("gameCanvas"),x=c.getContext("2d"),ht=document.getElementById("healthText"),wt=document.getElementById("weaponText"),st=document.getElementById("scoreText"),go=document.getElementById("gameOverScreen"),fs=document.getElementById("finalScore"),rb=document.getElementById("restartButton");let W=0,H=0,D=1,run=1,score=0,kills=0,coins=0,lt=0,ls=0,t=0,est=0,wst=0,pst=0,lgt=0,met=0,orb=0,dtm=0,dcd=0,pa=0,px=0,py=0,badWeaponRolls=0;let E=[],B=[],WP=[],P=[],C=[],EX=[],L=[],PT=[],M=[],BH=[];const K={},MAXC=120,hi=new Image();hi.src="hippo.png";
const pl={x:0,y:0,radius:18,hitRadius:10,speed:295,health:150,maxHealth:150,shield:0,color:"#55ccff",weaponKey:"pistol",lastDX:1,lastDY:0,dvx:0,dvy:0};

const G={
pistol:{name:"Pistol",type:"normal",damage:42,fireRate:350,bulletSpeed:800,bulletSize:5,color:"#fff",tier:0,range:520,visual:"tracer"},
plasma:{name:"Plasma SMG",type:"normal",damage:22,fireRate:80,bulletSpeed:850,bulletSize:5,color:"#00eaff",tier:1,range:520,visual:"plasma"},
frost:{name:"Frost Repeater",type:"frost",damage:28,fireRate:115,bulletSpeed:760,bulletSize:6,slow:.5,slowTime:2500,color:"#9fe8ff",tier:1,range:500,visual:"frost"},
railgun:{name:"Railgun",type:"railgun",damage:155,fireRate:850,bulletSpeed:1600,bulletSize:5,pierce:7,color:"#e600ff",tier:1,range:950,visual:"rail"},
shotgun:{name:"Titan Shotgun",type:"shotgun",damage:38,fireRate:620,bulletSpeed:720,bulletSize:6,pellets:9,spread:.8,knockback:50,color:"#ff9d00",tier:2,range:310,visual:"spark"},
starfire:{name:"Starfire Wand",type:"homing",damage:58,fireRate:250,bulletSpeed:540,bulletSize:8,homingStrength:7,color:"#ff4fd8",tier:2,range:600,visual:"comet"},
flame:{name:"Flamethrower",type:"flame",damage:14,fireRate:52,bulletSpeed:560,bulletSize:9,spread:.78,burnDamage:8,burnTime:1900,color:"#ff5a1f",tier:2,range:300,visual:"flame"},
singularity:{name:"Singularity Gun",type:"singularity",damage:0,fireRate:1250,bulletSpeed:420,bulletSize:15,pullRadius:300,pullStrength:520,blastRadius:205,blastDamage:145,blackHoleTime:700,color:"#6d3cff",tier:3,range:450,visual:"singularity"},
solar:{name:"Solar Blades",type:"orbit",blades:7,color:"#ffda44",tier:3,range:0,visual:"blade"},
nova:{name:"Nova Lance",type:"nova",damage:75,fireRate:420,bulletSpeed:900,bulletSize:7,sideShots:2,color:"#ff6bff",tier:3,range:560,visual:"lance"},
void:{name:"Void Cannon",type:"explosive",damage:95,fireRate:1000,bulletSpeed:475,bulletSize:14,explosionRadius:145,explosionDamage:115,color:"#8c52ff",tier:4,range:500,visual:"void"},
arc:{name:"Arc Blaster",type:"arc",damage:72,fireRate:630,chainDamage:55,chains:8,chainRange:225,color:"#66ffff",tier:4,range:430,visual:"arc"},
prism:{name:"Prism Cannon",type:"prism",damage:82,fireRate:650,bulletSpeed:1050,bulletSize:6,splits:3,splitRange:260,color:"#ff74e8",tier:5,range:610,visual:"prism"}
};

const U={
heal:{name:"HEAL",color:"#40ff75",w:20,d:0},shield:{name:"SHIELD",color:"#5ac8ff",w:18,d:0},magnet:{name:"MAGNET",color:"#c451ff",w:15,d:20000,m:2},haste:{name:"HASTE",color:"#ffe600",w:12,d:18000,m:2},berserk:{name:"BERSERK",color:"#ff0055",w:10,d:17000,m:2},vampire:{name:"VAMPIRE",color:"#a80038",w:9,d:22000,m:2},fmj:{name:"FMJ",color:"#c8c8c8",w:9,d:22000,m:2},ricochet:{name:"RICOCHET",color:"#b6ff5c",w:7,d:22000,m:2},quad:{name:"DAMAGE",color:"#ff3838",w:7,d:16000,m:2},chain:{name:"CHAIN",color:"#00ffff",w:7,d:20000,m:2},meteors:{name:"METEORS",color:"#ff6b35",w:5,d:20000,m:2},overdrive:{name:"OVERDRIVE",color:"#ff7b00",w:4,d:16000,m:2},lightning:{name:"LIGHTNING",color:"#68f7ff",w:4,d:20000,m:2},multishot:{name:"MULTI",color:"#ff8cff",w:3,d:22000,m:2},chainreaction:{name:"REACTION",color:"#ff3c6f",w:3,d:22000,m:2},nuke:{name:"NUKE",color:"#fff",w:1.8,d:0},powersurge:{name:"POWER SURGE",color:"#fff",w:.8,d:5500,m:1}
};

const BF={};for(const k in U)if(U[k].d)BF[k]={stacks:0,time:0,maxStacks:U[k].m||1};

function rs(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;c.style.width=W+"px";c.style.height=H+"px";x.setTransform(D,0,0,D,0,0)}addEventListener("resize",rs);
c.addEventListener("mousedown",e=>{if(e.button)return;pa=1;px=e.clientX;py=e.clientY});addEventListener("mousemove",e=>{if(pa){px=e.clientX;py=e.clientY}});addEventListener("mouseup",e=>{if(!e.button)pa=0});addEventListener("keydown",e=>{let k=e.key.toLowerCase();K[k]=1;if(k===" "||k==="spacebar"){e.preventDefault();dash()}if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k))e.preventDefault()});addEventListener("keyup",e=>K[e.key.toLowerCase()]=0);addEventListener("blur",()=>{pa=0;for(const k in K)K[k]=0});
c.addEventListener("touchstart",e=>{e.preventDefault();let q=e.touches[0];pa=1;px=q.clientX;py=q.clientY},{passive:false});c.addEventListener("touchmove",e=>{e.preventDefault();let q=e.touches[0];px=q.clientX;py=q.clientY},{passive:false});c.addEventListener("touchend",e=>{e.preventDefault();pa=0},{passive:false});c.addEventListener("touchcancel",()=>pa=0);

const dd=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),rr=o=>o.hitRadius??o.radius,hit=(a,b)=>{let r=rr(a)+rr(b),dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy<r*r},rp=(p=80)=>({x:p+Math.random()*Math.max(1,W-p*2),y:p+Math.random()*Math.max(1,H-p*2)});
function ons(e){let h=e.radius*1.325,p=14;return e.x-h>=p&&e.x+h<=W-p&&e.y-h>=p&&e.y+h<=H-p}
function es(k){let n=BF[k]?.stacks||0;return BF.powersurge?.time>0&&k!=="powersurge"?n*2:n}
function wc(a){let z=a.reduce((s,o)=>s+o.w,0),r=Math.random()*z;for(const o of a){r-=o.w;if(r<=0)return o.k}return a[a.length-1].k}
function weaponWeights(){let late=Math.min(1,t/180+score/5000),pity=Math.min(1,badWeaponRolls/6);return Object.entries(G).filter(([k])=>k!=="pistol").map(([k,g])=>{let w=1;if(g.tier===1)w=30-10*late;if(g.tier===2)w=27-4*late;if(g.tier===3)w=18+8*late;if(g.tier===4)w=9+10*late;if(g.tier===5)w=4+8*late;w*=1+(g.tier>=3?pity*1.5:0);if(badWeaponRolls>=6&&g.tier<3)w=0;return{k,w}})}
function cw(){let k=wc(weaponWeights());badWeaponRolls=G[k].tier>=3?0:badWeaponRolls+1;return k}
function cp(){let a=[];for(const[k,u]of Object.entries(U)){let w=u.w,b=BF[k];if(b?.stacks)w*=b.stacks>=b.maxStacks?.08:.28;if(k==="heal"&&pl.health>pl.maxHealth*.8)w*=.35;if(k==="shield"&&pl.shield>120)w*=.4;a.push({k,w})}return wc(a)}

function spawnSide(){
 let d=[{s:0,v:pl.y/H},{s:2,v:1-pl.y/H},{s:3,v:pl.x/W},{s:1,v:1-pl.x/W}].sort((a,b)=>b.v-a.v);
 if(Math.random()<.82)return d[0].s;
 return Math.random()<.7?d[1].s:Math.floor(Math.random()*4);
}
function se(){
 let s=spawnSide(),m=55,a,b;
 if(!s){a=Math.random()*W;b=-m}
 else if(s===1){a=W+m;b=Math.random()*H}
 else if(s===2){a=Math.random()*W;b=H+m}
 else{a=-m;b=Math.random()*H}
 let q=1+score/850+t/130,r=19+Math.random()*4,v=70+Math.random()*28+q*2.65,dx=pl.x-a,dy=pl.y-b,d=Math.hypot(dx,dy)||1,h=70+q*12;
 E.push({x:a,y:b,radius:r,vx:dx/d*v*.7,vy:dy/d*v*.7,baseMaxSpeed:v,steering:120+Math.random()*35,health:h,maxHealth:h,damage:17+q*.45,hitCooldown:0,slowTimer:0,burnTime:0,burnTick:0,burnDamage:0,dead:0,bladeHit:0});
}

function sw(){let p=rp();WP.push({x:p.x,y:p.y,radius:23,weaponKey:cw(),life:24000})}
function sp(){let p=rp();P.push({x:p.x,y:p.y,radius:19,key:cp(),life:24000,pulse:0})}
function sc(a,b){let n=1+Math.floor(Math.random()*3),v=1;if(C.length>=MAXC){let z=null,bd=1e9;for(const q of C){let d=Math.hypot(q.x-a,q.y-b);if(d<bd){bd=d;z=q}}if(z)z.value+=n;return}let room=MAXC-C.length;if(n>room){v+=n-room;n=room}for(let i=0;i<n;i++){let A=Math.random()*Math.PI*2,S=35+Math.random()*80;C.push({x:a,y:b,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:6,life:35000,value:i===0?v:1,nukeVacuum:0})}}

function fn(src=pl,ex=new Set(),vis=1,max=Infinity){let z=null,bd=1e9;for(const e of E){if(e.dead||ex.has(e)||(vis&&!ons(e)))continue;let d=dd(src,e);if(d>max)continue;if(d<bd){bd=d;z=e}}return z}
const gw=()=>G[pl.weaponKey];
function dm(){return(1+es("quad")*1.25)*(1+es("berserk")*.45)}
function fr(w){return Math.max(30,w.fireRate*Math.pow(.8,es("haste"))*Math.pow(.82,es("overdrive"))*Math.pow(.9,es("berserk")))}

function hp(a,b,col="#fff"){for(let i=0;i<3;i++)PT.push({x:a,y:b,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,radius:2+Math.random()*2,life:180,color:col,gravity:0})}
function blood(a,b){for(let i=0;i<24;i++){let A=Math.random()*Math.PI*2,S=70+Math.random()*260;PT.push({x:a,y:b,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:2+Math.random()*5,life:450+Math.random()*500,color:Math.random()<.5?"#7a0000":"#d00000",gravity:110})}}
function ke(e){if(!e||e.dead)return;e.dead=1;kills++;score+=10;blood(e.x,e.y);sc(e.x,e.y);let v=es("vampire");if(v)pl.health=Math.min(pl.maxHealth,pl.health+1.5*v);let r=es("chainreaction");if(r)boom(e.x,e.y,65+r*20,28+r*18,220,"#ff3c6f")}
function de(e,d,k=0,a=0,col="#fff"){if(!e||e.dead)return;e.health-=d*dm();if(k){e.vx+=Math.cos(a)*k*2.5;e.vy+=Math.sin(a)*k*2.5}hp(e.x,e.y,col);if(e.health<=0)ke(e)}
function chain(s,d,n,r,col,ex=new Set()){let f={x:s.x,y:s.y},Hh=new Set(ex);Hh.add(s);for(let i=0;i<n;i++){let q=null,bd=1e9;for(const e of E){if(e.dead||Hh.has(e)||!ons(e))continue;let z=Math.hypot(e.x-f.x,e.y-f.y);if(z<r&&z<bd){bd=z;q=e}}if(!q)break;L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:130,color:col});de(q,d,0,0,col);Hh.add(q);f={x:q.x,y:q.y};d*=.86}}

function cb(a,w,o={}){
 B.push({x:o.x??pl.x,y:o.y??pl.y,vx:Math.cos(a)*(o.speed??w.bulletSpeed),vy:Math.sin(a)*(o.speed??w.bulletSpeed),angle:a,radius:o.radius??w.bulletSize,damage:o.damage??w.damage,color:o.color??w.color,type:o.type??w.type,visual:o.visual??w.visual,pierce:(o.pierce??w.pierce??0)+es("fmj")*2,hitEnemies:new Set(),explosionRadius:o.explosionRadius??w.explosionRadius??0,explosionDamage:o.explosionDamage??w.explosionDamage??0,homingStrength:o.homingStrength??w.homingStrength??0,slow:w.slow||0,slowTime:w.slowTime||0,knockback:w.knockback||0,pullRadius:w.pullRadius||0,pullStrength:w.pullStrength||0,burnDamage:w.burnDamage||0,burnTime:w.burnTime||0,splitRange:w.splitRange||0,splits:w.splits||0,ricochets:es("ricochet"),life:o.life??(w.type==="singularity"?2200:3000),trail:[]});
}

function fa(e,w){let q=e,d=w.damage,f={x:pl.x,y:pl.y},h=new Set(),n=w.chains+es("overdrive")+es("chain");for(let i=0;i<n&&q;i++){if(!ons(q))break;L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:145,color:w.color});de(q,d,0,0,w.color);h.add(q);f={x:q.x,y:q.y};d=i?d*.94:w.chainDamage;let z=null,bd=1e9;for(const p of E){if(p.dead||h.has(p)||!ons(p))continue;let u=Math.hypot(p.x-f.x,p.y-f.y);if(u<w.chainRange+es("chain")*25&&u<bd){bd=u;z=p}}q=z}}

function shoot(now){
 let w=gw();if(w.type==="orbit")return;
 let q=fn(pl,new Set(),1,w.range||Infinity);if(!q||now-ls<fr(w))return;
 ls=now;let a=Math.atan2(q.y-pl.y,q.x-pl.x),m=es("multishot");
 if(w.type==="shotgun"){for(let i=0;i<w.pellets+m*2;i++)cb(a+(Math.random()-.5)*w.spread,w);return}
 if(w.type==="arc"){fa(q,w);return}
 if(w.type==="flame"){for(let i=0;i<2+m;i++)cb(a+(Math.random()-.5)*w.spread,w,{type:"flame",visual:"flame",life:900,speed:w.bulletSpeed*(.85+Math.random()*.35),radius:w.bulletSize+Math.random()*5});return}
 if(w.type==="nova"){cb(a,w);let n=w.sideShots+es("overdrive")+m;for(let i=1;i<=n;i++){cb(a-.18*i,w,{visual:i===1?"lanceSide":"lance"});cb(a+.18*i,w,{visual:i===1?"lanceSide":"lance"})}return}
 cb(a,w);
 let n=es("overdrive")+m;for(let i=1;i<=n;i++){cb(a-.1*i,w);cb(a+.1*i,w)}
}

function ps(b,e){
 if(b.type!=="prism"||!b.splits)return;
 let a=E.filter(q=>!q.dead&&q!==e&&ons(q)&&Math.hypot(q.x-e.x,q.y-e.y)<b.splitRange).sort((q,z)=>dd(e,q)-dd(e,z)).slice(0,b.splits+es("multishot"));
 const cols=["#ff4fd8","#72f7ff","#fff16e","#b779ff","#7dff9b"];
 for(let i=0;i<a.length;i++){let q=a[i];cb(Math.atan2(q.y-e.y,q.x-e.x),G.prism,{x:e.x,y:e.y,damage:b.damage*.65,type:"prismShard",visual:"prismShard",color:cols[i%cols.length],speed:1100,radius:4,life:900})}
}

function ric(b,e){if(b.ricochets<=0)return 0;let q=fn(e,new Set(b.hitEnemies),1,350);if(!q)return 0;let a=Math.atan2(q.y-e.y,q.x-e.x),s=Math.hypot(b.vx,b.vy);b.x=e.x;b.y=e.y;b.angle=a;b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.ricochets--;return 1}

function boom(a,b,r,d,du=300,col="#c45cff"){EX.push({x:a,y:b,radius:0,maxRadius:r,life:du,duration:du,color:col});for(const e of E){if(e.dead)continue;let q=Math.hypot(e.x-a,e.y-b);if(q<r)de(e,d*(.4+(1-q/r)*.6),0,0,col)}}

function singularity(a,b){
 let w=G.singularity;BH.push({x:a,y:b,life:w.blackHoleTime,duration:w.blackHoleTime,pullRadius:w.pullRadius,pullStrength:w.pullStrength,blastRadius:w.blastRadius,blastDamage:w.blastDamage,color:w.color,particleTimer:0});
 for(let i=0;i<30;i++){let A=Math.random()*Math.PI*2,R=55+Math.random()*w.pullRadius*.85;PT.push({x:a+Math.cos(A)*R,y:b+Math.sin(A)*R,vx:0,vy:0,radius:1.5+Math.random()*2.5,life:w.blackHoleTime+100,color:Math.random()<.5?"#a574ff":"#fff",gravity:0,suckX:a,suckY:b,suckSpeed:250+Math.random()*250,suck:1,spin:(Math.random()<.5?-1:1)*(2+Math.random()*4)})}
}
function singularityBoom(q){
 boom(q.x,q.y,q.blastRadius,q.blastDamage,380,"#b26cff");
 for(let i=0;i<48;i++){let A=Math.random()*Math.PI*2,S=160+Math.random()*500;PT.push({x:q.x,y:q.y,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:2+Math.random()*4,life:350+Math.random()*350,color:Math.random()<.5?"#d7b8ff":"#7b33ff",gravity:0})}
 for(const e of E){if(e.dead)continue;let dx=e.x-q.x,dy=e.y-q.y,d=Math.hypot(dx,dy)||1;if(d<q.blastRadius*1.35){let f=220*(1-Math.min(1,d/(q.blastRadius*1.35)));e.vx+=dx/d*f;e.vy+=dy/d*f}}
}

function add(k,d){let b=BF[k];if(!b)return;b.stacks=Math.min(b.maxStacks,b.stacks+1);b.time=Math.min(50000,b.time+d)}
function act(k){let u=U[k];if(k==="heal")pl.health=Math.min(pl.maxHealth,pl.health+80);else if(k==="shield")pl.shield=Math.min(300,pl.shield+100);else if(k==="nuke"){boom(pl.x,pl.y,Math.max(W,H)*1.45,999999,550,"#fff");for(const q of C)q.nukeVacuum=1}else if(k==="powersurge"){BF.powersurge.stacks=1;BF.powersurge.time=u.d}else add(k,u.d)}

function dash(){if(!run||dcd>0||dtm>0)return;let a=0,b=0;if(K.w||K.arrowup)b--;if(K.s||K.arrowdown)b++;if(K.a||K.arrowleft)a--;if(K.d||K.arrowright)a++;if(!a&&!b){a=pl.lastDX;b=pl.lastDY}let d=Math.hypot(a,b)||1;pl.dvx=a/d*900;pl.dvy=b/d*900;dtm=.18;dcd=1.05}
function up(dt){if(dcd>0)dcd-=dt;if(dtm>0){dtm-=dt;pl.x+=pl.dvx*dt;pl.y+=pl.dvy*dt}else{let a=0,b=0;if(K.w||K.arrowup)b--;if(K.s||K.arrowdown)b++;if(K.a||K.arrowleft)a--;if(K.d||K.arrowright)a++;let s=pl.speed*(1+es("berserk")*.12);if(a||b){let d=Math.hypot(a,b);a/=d;b/=d;pl.lastDX=a;pl.lastDY=b;pl.x+=a*s*dt;pl.y+=b*s*dt}else if(pa){a=px-pl.x;b=py-pl.y;let d=Math.hypot(a,b);if(d>5){let nx=a/d,ny=b/d,m=Math.min(s*dt,d);pl.lastDX=nx;pl.lastDY=ny;pl.x+=nx*m;pl.y+=ny*m}}}pl.x=Math.max(pl.radius,Math.min(W-pl.radius,pl.x));pl.y=Math.max(pl.radius,Math.min(H-pl.radius,pl.y))}

function ue(dt){
 for(let i=E.length-1;i>=0;i--){
  let e=E[i];if(e.dead){E.splice(i,1);continue}
  let ms=e.baseMaxSpeed;if(e.slowTimer>0){e.slowTimer-=dt*1000;ms*=.5}
  if(e.burnTime>0){e.burnTime-=dt*1000;e.burnTick-=dt*1000;if(e.burnTick<=0){e.burnTick=250;de(e,e.burnDamage,0,0,"#ff5a1f")}}
  if(e.dead)continue;
  let dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy)||1,vx=dx/d*ms,vy=dy/d*ms,sx=vx-e.vx,sy=vy-e.vy,sl=Math.hypot(sx,sy),mx=e.steering*dt;
  if(sl>mx&&sl){sx=sx/sl*mx;sy=sy/sl*mx}
  e.vx+=sx;e.vy+=sy;let v=Math.hypot(e.vx,e.vy);if(v>ms){e.vx=e.vx/v*ms;e.vy=e.vy/v*ms}
  e.x+=e.vx*dt;e.y+=e.vy*dt;e.hitCooldown-=dt*1000;
  if(dtm<=0&&hit(pl,e)&&e.hitCooldown<=0){let z=e.damage;if(pl.shield>0){let a=Math.min(pl.shield,z);pl.shield-=a;z-=a}pl.health-=z;e.hitCooldown=650;e.vx-=dx/d*90;e.vy-=dy/d*90;if(pl.health<=0){pl.health=0;end()}}
 }
}

function ub(dt){
 for(let i=B.length-1;i>=0;i--){
  let b=B[i];b.life-=dt*1000;
  b.trail.push({x:b.x,y:b.y,life:180});if(b.trail.length>8)b.trail.shift();
  for(const q of b.trail)q.life-=dt*1000;

  if(b.type==="homing"){let q=fn(b,b.hitEnemies,1,500);if(q){let a=Math.atan2(q.y-b.y,q.x-b.x),df=Math.atan2(Math.sin(a-b.angle),Math.cos(a-b.angle));b.angle+=df*b.homingStrength*dt;let s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(b.angle)*s;b.vy=Math.sin(b.angle)*s}}
  b.x+=b.vx*dt;b.y+=b.vy*dt;

  let expired=b.life<=0||b.x<-180||b.x>W+180||b.y<-180||b.y>H+180;
  if(expired){if(b.type==="singularity")singularity(Math.max(20,Math.min(W-20,b.x)),Math.max(20,Math.min(H-20,b.y)));B.splice(i,1);continue}

  let rm=0;
  for(const e of E){
   if(e.dead||b.hitEnemies.has(e)||!hit(b,e))continue;
   b.hitEnemies.add(e);
   if(b.type==="singularity"){singularity(b.x,b.y);rm=1;break}
   de(e,b.damage,b.knockback,b.angle,b.color);

   let ch=es("chain");if(ch)chain(e,b.damage*.45,1+ch,120+ch*45,"#00ffff",b.hitEnemies);
   if(b.type==="frost")e.slowTimer=b.slowTime;
   if(b.type==="flame"&&!e.dead){e.burnTime=Math.max(e.burnTime,b.burnTime);e.burnDamage=Math.max(e.burnDamage,b.burnDamage*dm());e.burnTick=0}
   ps(b,e);

   if(b.type==="explosive"){boom(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color);rm=1;break}
   if(ric(b,e))break;
   if(b.pierce>0){b.pierce--;continue}
   rm=1;break;
  }
  if(rm)B.splice(i,1);
 }
}

function ubh(dt){
 for(let i=BH.length-1;i>=0;i--){
  let q=BH[i];q.life-=dt*1000;q.particleTimer-=dt*1000;let p=1-q.life/q.duration,str=.35+p*.9;
  for(const e of E){if(e.dead)continue;let dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy);if(d>2&&d<q.pullRadius){let f=q.pullStrength*(1-d/q.pullRadius)*str*dt;e.vx+=dx/d*f;e.vy+=dy/d*f;e.x+=dx/d*f*.18;e.y+=dy/d*f*.18}}
  if(q.particleTimer<=0){q.particleTimer=35;for(let z=0;z<3;z++){let A=Math.random()*Math.PI*2,R=80+Math.random()*q.pullRadius*.8;PT.push({x:q.x+Math.cos(A)*R,y:q.y+Math.sin(A)*R,vx:0,vy:0,radius:1+Math.random()*2.5,life:500,color:Math.random()<.5?"#8d55ff":"#eee4ff",gravity:0,suckX:q.x,suckY:q.y,suckSpeed:350+Math.random()*350,suck:1,spin:(Math.random()<.5?-1:1)*(3+Math.random()*4)})}}
  if(q.life<=0){singularityBoom(q);BH.splice(i,1)}
 }
}

function us(dt){let w=gw();if(w.type!=="orbit")return;orb+=dt*4.2;let n=w.blades+es("overdrive")+es("multishot");for(let i=0;i<n;i++){let a=orb+Math.PI*2/n*i,q={x:pl.x+Math.cos(a)*72,y:pl.y+Math.sin(a)*72,radius:13};for(const e of E)if(!e.dead&&hit(q,e)&&performance.now()-e.bladeHit>150){e.bladeHit=performance.now();ke(e)}}}
function ul(dt){let s=es("lightning");if(!s)return;lgt+=dt*1000;let r=Math.max(600,1500-s*200);if(lgt<r)return;lgt=0;let a=E.filter(e=>!e.dead&&ons(e));if(!a.length)return;let q=a[Math.floor(Math.random()*a.length)],d=45+s*20;L.push({x1:q.x+(Math.random()-.5)*50,y1:-20,x2:q.x,y2:q.y,life:180,color:"#68f7ff"});de(q,d,0,0,"#68f7ff");chain(q,d*.7,1+s*2,150+s*35,"#68f7ff")}
function um(dt){let s=es("meteors");if(!s)return;met+=dt*1000;let r=Math.max(800,1900-s*250);if(met<r)return;met=0;M.push({x:50+Math.random()*Math.max(1,W-100),y:70+Math.random()*Math.max(1,H-140),life:650,duration:650,radius:42+s*8,damage:80+s*30})}
function umo(dt){for(let i=M.length-1;i>=0;i--){M[i].life-=dt*1000;if(M[i].life<=0){boom(M[i].x,M[i].y,M[i].radius,M[i].damage,300,"#ff6b35");M.splice(i,1)}}}

function pull(q,dt,r,s){let dx=pl.x-q.x,dy=pl.y-q.y,d=Math.hypot(dx,dy);if(d>1&&d<r){q.x+=dx/d*s*dt;q.y+=dy/d*s*dt}}
function upp(dt){for(let i=WP.length-1;i>=0;i--){let q=WP[i];q.life-=dt*1000;if(q.life<=0){WP.splice(i,1);continue}if(hit(pl,q)){pl.weaponKey=q.weaponKey;WP.splice(i,1)}}for(let i=P.length-1;i>=0;i--){let q=P[i];q.life-=dt*1000;q.pulse+=dt*5;let m=es("magnet");if(m)pull(q,dt,130+m*25,220+m*35);if(q.life<=0){P.splice(i,1);continue}if(hit(pl,q)){act(q.key);P.splice(i,1)}}}
function uc(dt){for(let i=C.length-1;i>=0;i--){let q=C[i];q.life-=dt*1000;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.pow(.02,dt);q.vy*=Math.pow(.02,dt);let m=es("magnet");if(q.nukeVacuum)pull(q,dt,99999,1150);else if(m)pull(q,dt,165+m*35,380+m*45);else pull(q,dt,90,430);if(q.life<=0){C.splice(i,1);continue}if(hit(pl,q)){coins+=q.value;C.splice(i,1)}}}
function ubf(dt){let ms=dt*1000;for(const k in BF){let b=BF[k];if(!b.time)continue;b.time-=ms;if(b.time<=0){b.time=0;b.stacks=0}}}

function ufx(dt){
 for(let i=PT.length-1;i>=0;i--){let p=PT[i];p.life-=dt*1000;if(p.suck){let dx=p.suckX-p.x,dy=p.suckY-p.y,d=Math.hypot(dx,dy);if(d>2){let nx=dx/d,ny=dy/d,tx=-ny,ty=nx,s=p.suckSpeed*(1+Math.max(0,1-d/300)*1.5);p.x+=(nx*s+tx*p.spin*12)*dt;p.y+=(ny*s+ty*p.spin*12)*dt}else p.life=0}else{p.vy+=(p.gravity||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}if(p.life<=0)PT.splice(i,1)}
 for(let i=EX.length-1;i>=0;i--){let e=EX[i];e.life-=dt*1000;e.radius=Math.max(0,e.maxRadius*Math.max(0,Math.min(1,1-e.life/e.duration)));if(e.life<=0)EX.splice(i,1)}
 for(let i=L.length-1;i>=0;i--){L[i].life-=dt*1000;if(L[i].life<=0)L.splice(i,1)}
}

function bg(){x.fillStyle="#111820";x.fillRect(0,0,W,H);x.strokeStyle="rgba(255,255,255,.035)";x.lineWidth=1;for(let a=0;a<W;a+=50){x.beginPath();x.moveTo(a,0);x.lineTo(a,H);x.stroke()}for(let b=0;b<H;b+=50){x.beginPath();x.moveTo(0,b);x.lineTo(W,b);x.stroke()}}

function dp(){if(BF.powersurge?.time>0){x.save();x.shadowBlur=35;x.shadowColor="#fff";x.beginPath();x.arc(pl.x,pl.y,pl.radius+18+Math.sin(performance.now()/70)*5,0,Math.PI*2);x.strokeStyle="#ffd700";x.lineWidth=5;x.stroke();x.restore()}if(pl.shield>0){x.beginPath();x.arc(pl.x,pl.y,pl.radius+8,0,Math.PI*2);x.strokeStyle="#55cfff";x.lineWidth=4;x.stroke()}x.beginPath();x.arc(pl.x,pl.y,pl.radius,0,Math.PI*2);x.fillStyle=dtm>0?"#fff":pl.color;x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke()}

function dee(){for(const e of E){let s=e.radius*2.65;if(hi.complete&&hi.naturalWidth)x.drawImage(hi,e.x-s/2,e.y-s/2,s,s);else{x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.fillStyle="#ff456c";x.fill()}if(e.health<e.maxHealth){let w=32;x.fillStyle="#250000";x.fillRect(e.x-w/2,e.y-e.radius-8,w,4);x.fillStyle="#ff4444";x.fillRect(e.x-w/2,e.y-e.radius-8,w*Math.max(0,e.health/e.maxHealth),4)}}}
function dc(){for(const q of C){x.save();x.shadowBlur=q.nukeVacuum?18:8;x.shadowColor="#ffd700";x.beginPath();x.arc(q.x,q.y,q.radius,0,Math.PI*2);x.fillStyle="#ffd700";x.fill();x.strokeStyle="#fff2a8";x.lineWidth=2;x.stroke();if(q.value>1){x.fillStyle="#111";x.font="bold 8px Arial";x.textAlign="center";x.textBaseline="middle";x.fillText(q.value,q.x,q.y)}x.restore()}}

function db(){
 for(const b of B){
  x.save();
  for(let i=0;i<b.trail.length;i++){let q=b.trail[i],a=(i+1)/b.trail.length*.3;x.globalAlpha=a;x.beginPath();x.arc(q.x,q.y,Math.max(1,b.radius*(i+1)/b.trail.length*.7),0,Math.PI*2);x.fillStyle=b.color;x.fill()}
  x.globalAlpha=1;
  if(b.visual==="tracer"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=8;x.shadowColor=b.color;x.fillStyle="#fff";x.fillRect(-12,-2,20,4)}
  else if(b.visual==="plasma"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=14;x.shadowColor=b.color;x.fillStyle=b.color;x.fillRect(-10,-2.5,20,5)}
  else if(b.visual==="frost"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=10;x.shadowColor=b.color;x.fillStyle=b.color;x.beginPath();x.moveTo(10,0);x.lineTo(-6,-5);x.lineTo(-2,0);x.lineTo(-6,5);x.closePath();x.fill()}
  else if(b.visual==="rail"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=20;x.shadowColor=b.color;x.fillStyle="#fff";x.fillRect(-28,-2,56,4);x.fillStyle=b.color;x.fillRect(-34,-1,68,2)}
  else if(b.visual==="spark"){x.shadowBlur=10;x.shadowColor=b.color;x.beginPath();x.arc(b.x,b.y,b.radius,0,Math.PI*2);x.fillStyle=b.color;x.fill()}
  else if(b.visual==="comet"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=18;x.shadowColor=b.color;x.fillStyle=b.color;x.beginPath();x.moveTo(12,0);x.lineTo(-8,-6);x.lineTo(-4,0);x.lineTo(-8,6);x.closePath();x.fill()}
  else if(b.visual==="flame"){let p=Math.max(0,b.life/900),r=b.radius*(1.2+.8*(1-p));x.globalAlpha=.55+.45*p;x.shadowBlur=14;x.shadowColor="#ff3b00";x.beginPath();x.arc(b.x,b.y,r,0,Math.PI*2);x.fillStyle=p>.65?"#fff36b":p>.3?"#ff8c1a":"#e53900";x.fill()}
  else if(b.visual==="singularity"){x.shadowBlur=28;x.shadowColor=b.color;x.beginPath();x.arc(b.x,b.y,b.radius,0,Math.PI*2);x.fillStyle="#09000f";x.fill();x.strokeStyle=b.color;x.lineWidth=3;x.stroke();x.beginPath();x.arc(b.x,b.y,b.radius+7+Math.sin(performance.now()/55)*3,0,Math.PI*2);x.strokeStyle="#c6a5ff";x.lineWidth=2;x.stroke()}
  else if(b.visual==="lance"||b.visual==="lanceSide"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=18;x.shadowColor=b.color;x.fillStyle=b.visual==="lance"?"#fff":b.color;x.fillRect(-18,b.visual==="lance"?-3:-2,36,b.visual==="lance"?6:4)}
  else if(b.visual==="void"){x.shadowBlur=25;x.shadowColor=b.color;x.beginPath();x.arc(b.x,b.y,b.radius*(1+Math.sin(performance.now()/70)*.12),0,Math.PI*2);x.fillStyle="#32105d";x.fill();x.strokeStyle="#bd86ff";x.lineWidth=3;x.stroke()}
  else if(b.visual==="prism"||b.visual==="prismShard"){x.translate(b.x,b.y);x.rotate(b.angle);x.shadowBlur=18;x.shadowColor=b.color;x.beginPath();x.moveTo(14,0);x.lineTo(-8,-5);x.lineTo(-8,5);x.closePath();x.fillStyle=b.color;x.fill();x.fillStyle="#fff";x.fillRect(-3,-1,11,2)}
  else{x.shadowBlur=12;x.shadowColor=b.color;x.beginPath();x.arc(b.x,b.y,Math.max(0,b.radius),0,Math.PI*2);x.fillStyle=b.color;x.fill()}
  x.restore();
 }
}

function ds(){let w=gw();if(w.type!=="orbit")return;let n=w.blades+es("overdrive")+es("multishot");for(let i=0;i<n;i++){let a=orb+Math.PI*2/n*i,A=pl.x+Math.cos(a)*72,Bb=pl.y+Math.sin(a)*72;x.save();x.translate(A,Bb);x.rotate(a+.4);x.shadowBlur=22;x.shadowColor=w.color;x.fillStyle="#fff7a0";x.beginPath();x.moveTo(0,-25);x.lineTo(7,10);x.lineTo(0,22);x.lineTo(-7,10);x.closePath();x.fill();x.strokeStyle=w.color;x.lineWidth=3;x.stroke();x.restore()}}

function dwp(){for(const p of WP){let w=G[p.weaponKey];x.save();x.shadowBlur=18;x.shadowColor=w.color;x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle="#111";x.fill();x.strokeStyle=w.color;x.lineWidth=4;x.stroke();x.fillStyle="#fff";x.font="bold 8px Arial";x.textAlign="center";x.textBaseline="middle";let z=w.name.split(" ");if(z.length>1){x.fillText(z[0],p.x,p.y-5);x.fillText(z.slice(1).join(" "),p.x,p.y+6)}else x.fillText(w.name,p.x,p.y);x.restore()}}
function dpu(){for(const p of P){let u=U[p.key],s=p.key==="powersurge",q=1+Math.sin(p.pulse)*.12;x.save();x.shadowBlur=s?40:20;x.shadowColor=u.color;x.beginPath();x.arc(p.x,p.y,p.radius*q*(s?1.35:1),0,Math.PI*2);x.fillStyle=u.color;x.fill();if(s){x.strokeStyle="#ffd700";x.lineWidth=5;x.stroke()}x.fillStyle=s?"#ff5200":"#111";x.font=s?"bold 9px Arial":"bold 8px Arial";x.textAlign="center";x.textBaseline="middle";x.fillText(u.name,p.x,p.y);x.restore()}}
function dmet(){for(const m of M){let q=m.life/m.duration;x.save();x.globalAlpha=.4+.6*(1-q);x.beginPath();x.arc(m.x,m.y,m.radius*(.7+.3*(1-q)),0,Math.PI*2);x.strokeStyle="#ff6b35";x.lineWidth=4;x.stroke();x.beginPath();x.moveTo(m.x-70*q,m.y-130*q);x.lineTo(m.x,m.y);x.strokeStyle="#ffd08a";x.lineWidth=8;x.stroke();x.restore()}}

function dbh(){for(const q of BH){let p=1-q.life/q.duration,r=q.pullRadius*(.35+.65*p);x.save();x.globalAlpha=.35+.35*Math.sin(performance.now()/45);x.shadowBlur=35;x.shadowColor=q.color;x.beginPath();x.arc(q.x,q.y,18+12*p,0,Math.PI*2);x.fillStyle="#050008";x.fill();x.strokeStyle="#b98cff";x.lineWidth=3;x.stroke();x.globalAlpha=.2;x.beginPath();x.arc(q.x,q.y,r,0,Math.PI*2);x.strokeStyle="#8c52ff";x.lineWidth=2;x.stroke();x.restore()}}

function dfx(){for(const p of PT){x.save();x.globalAlpha=Math.min(1,p.life/250);x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle=p.color||"#fff";x.fill();x.restore()}for(const e of EX){x.save();x.globalAlpha=Math.max(0,e.life/e.duration);x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.strokeStyle=e.color;x.lineWidth=10;x.stroke();x.restore()}for(const l of L){x.save();x.shadowBlur=18;x.shadowColor=l.color;x.strokeStyle=l.color;x.lineWidth=5;x.beginPath();x.moveTo(l.x1,l.y1);for(let i=1;i<7;i++){let q=i/7;x.lineTo(l.x1+(l.x2-l.x1)*q+(Math.random()-.5)*18,l.y1+(l.y2-l.y1)*q+(Math.random()-.5)*18)}x.lineTo(l.x2,l.y2);x.stroke();x.restore()}}

function dh(){let y=62,lab={magnet:"MAGNET",haste:"HASTE",berserk:"BERSERK",vampire:"VAMPIRE",fmj:"FMJ",ricochet:"RICOCHET",quad:"DAMAGE",chain:"CHAIN",meteors:"METEORS",overdrive:"OVERDRIVE",lightning:"LIGHTNING",multishot:"MULTI",chainreaction:"REACTION",powersurge:"POWER SURGE"};x.textAlign="left";for(const k in BF){let b=BF[k];if(!b.stacks||!b.time)continue;let s=k==="powersurge";x.fillStyle=s?"#ffd700":"#fff";x.font=s?"bold 17px Arial":"bold 12px Arial";x.fillText(`${lab[k]} x${b.stacks} ${(b.time/1000).toFixed(1)}s`,12,y);y+=s?23:17}x.font="bold 12px Arial";if(pl.shield>0){x.fillStyle="#70dcff";x.fillText(`SHIELD ${Math.ceil(pl.shield)}`,12,y);y+=17}if(dcd>0){x.fillStyle="#bbb";x.fillText(`DASH ${dcd.toFixed(1)}s`,12,y)}}
function hud(){ht.textContent=`HP: ${Math.ceil(pl.health)}`;wt.textContent=gw().name;st.textContent=`Score: ${score} | Coins: ${coins}`}
function end(){run=0;fs.textContent=`Score: ${score} | Coins: ${coins}`;go.classList.remove("hidden")}
function reset(){E=[];B=[];WP=[];P=[];C=[];EX=[];L=[];PT=[];M=[];BH=[];score=0;kills=0;coins=0;t=0;badWeaponRolls=0;pl.x=W/2;pl.y=H/2;pl.health=pl.maxHealth;pl.shield=0;pl.weaponKey="pistol";pl.lastDX=1;pl.lastDY=0;for(const k in BF){BF[k].stacks=0;BF[k].time=0}for(const k in K)K[k]=0;ls=est=wst=pst=lgt=met=orb=dtm=dcd=0;pa=0;run=1;go.classList.add("hidden");sw();sw();sp();lt=performance.now()}rb.addEventListener("click",reset);

function loop(n){
 let d=Math.min((n-lt)/1000,.05);lt=n;bg();
 if(run){
  t+=d;est+=d*1000;wst+=d*1000;pst+=d*1000;
  let alive=E.reduce((q,e)=>q+(!e.dead),0);
  let er=Math.max(170,1250-score*.38-t*.9);
  let ec=score>=18000?4:score>=10000?3:score>=4500?2:1;
  if(est>=er){est=0;for(let i=0;i<ec;i++)se()}
  if(wst>=8500){wst=0;sw()}
  let pr=Math.max(5200,13000-Math.min(3800,alive*70)-Math.min(800,t*1.5));
  if(pst>=pr){pst=0;sp();if(alive>=45&&Math.random()<.12)sp()}
  up(d);ue(d);ub(d);ubh(d);us(d);ul(d);um(d);umo(d);upp(d);uc(d);ubf(d);ufx(d);shoot(n);hud();
 }
 dwp();dpu();dc();dee();db();ds();dmet();dbh();dp();dfx();dh();requestAnimationFrame(loop);
}

rs();pl.x=W/2;pl.y=H/2;sw();sw();sp();hud();lt=performance.now();requestAnimationFrame(loop);
