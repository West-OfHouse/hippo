const c=document.getElementById("gameCanvas"),x=c.getContext("2d"),ht=document.getElementById("healthText"),wt=document.getElementById("weaponText"),st=document.getElementById("scoreText"),lvT=document.getElementById("levelText"),xpB=document.getElementById("xpBar"),shHUD=document.getElementById("shieldHUD"),shT=document.getElementById("shieldText"),lscr=document.getElementById("levelScreen"),cards=document.getElementById("upgradeCards"),go=document.getElementById("gameOverScreen"),fs=document.getElementById("finalScore"),rb=document.getElementById("restartButton"),dbtn=document.getElementById("dashButton"),jz=document.getElementById("joystickZone"),jb=document.getElementById("joystickBase"),js=document.getElementById("joystickStick");
let W=0,H=0,D=1,run=1,score=0,kills=0,lv=1,xp=0,pending=0,choosing=0,choiceIndex=0,lt=0,ls=0,t=0,est=0,wst=0,pst=0,lgt=0,met=0,megaMet=0,orb=0,dtm=0,dcd=0,boost=0,inv=0,berserk=0,surge=0,weaponTime=0,badW=0,shotN=0,rx=0,prismBudget=0;
let E=[],B=[],WP=[],P=[],C=[],EX=[],L=[],PT=[],M=[],BH=[],jx=0,jy=0,jactive=0,jid=null,jcx=0,jcy=0;
const K={},MAXC=145,hi=new Image();hi.src="hippo.png";
const pl={x:0,y:0,radius:18,hitRadius:10,speed:295,health:25,maxHealth:25,tempHP:0,shield:0,color:"#55ccff",weaponKey:"pistol",lastDX:1,lastDY:0,dvx:0,dvy:0,secondWind:0};

const UP={fmj:0,multishot:0,ricochet:0,lightning:0,meteors:0,chainreaction:0,vampire:0,haste:0,damage:0,speed:0,health:0,magnet:0,solar:0};
const UD={
fmj:{n:"FMJ",t:"WEAPON MOD",r:"uncommon",d:"+1 projectile penetration per level.",e:"AP ROUNDS: penetrated hippos increase projectile damage."},
multishot:{n:"MULTISHOT",t:"WEAPON MOD",r:"rare",d:"+1 projectile. Arc gains additional starting beams.",e:"MIRROR SHOT: volleys also fire backward."},
ricochet:{n:"RICOCHET",t:"WEAPON MOD",r:"rare",d:"+1 enemy or wall bounce. Damage falls with each bounce.",e:"PINBALL: wall bounces no longer consume charges."},
haste:{n:"HASTE",t:"WEAPON MOD",r:"uncommon",d:"+10% fire rate per level.",e:"OVERCLOCK: every 10th volley duplicates instantly."},
damage:{n:"DAMAGE",t:"WEAPON MOD",r:"uncommon",d:"+15% damage per level.",e:"EXECUTIONER: hits kill enemies below 20% HP."},
vampire:{n:"VAMPIRE",t:"PASSIVE",r:"rare",d:"Kills restore increasing amounts of HP.",e:"BLOODLUST: overhealing becomes temporary HP."},
speed:{n:"SPEED",t:"PASSIVE",r:"common",d:"+5% movement speed per level.",e:"AFTERIMAGE: dashing grants +50% speed temporarily."},
health:{n:"HEALTH",t:"PASSIVE",r:"common",d:"+5 max HP and immediately heal 5.",e:"SECOND WIND: survive lethal damage once at 50% HP."},
magnet:{n:"MAGNET",t:"PASSIVE",r:"uncommon",d:"Increases XP attraction range and pull strength.",e:"GRAVITY WELL: massive XP attraction radius."},
lightning:{n:"LIGHTNING",t:"ABILITY",r:"epic",d:"Automatic lightning. Improves damage, chains and frequency.",e:"THUNDERSTORM: each event starts 3 separate strikes."},
meteors:{n:"METEORS",t:"ABILITY",r:"epic",d:"Random meteor bombardment.",e:"EXTINCTION: giant meteors target dense hippo clusters."},
chainreaction:{n:"CHAIN REACTION",t:"ABILITY",r:"epic",d:"Dead hippos explode. Improves Arc and Prism chaining.",e:"CRITICAL MASS: reaction kills explode again."},
solar:{n:"SOLAR BLADES",t:"ABILITY",r:"legendary",d:"Starts with 2 blades. More levels add blades, damage and knockback.",e:"SOLAR GUARD: 5 stronger defensive blades."}
};

const G={
pistol:{name:"Pistol",type:"normal",damage:42,fireRate:350,bulletSpeed:800,bulletSize:5,color:"#fff",tier:0,range:520,visual:"tracer"},
plasma:{name:"Plasma SMG",type:"normal",damage:22,fireRate:80,bulletSpeed:850,bulletSize:5,color:"#00eaff",tier:1,range:520,visual:"plasma"},
frost:{name:"Frost Repeater",type:"frost",damage:28,fireRate:115,bulletSpeed:760,bulletSize:6,slowTime:2500,color:"#9fe8ff",tier:1,range:500,visual:"frost"},
railgun:{name:"Railgun",type:"railgun",damage:155,fireRate:850,bulletSpeed:1600,bulletSize:5,pierce:7,color:"#e600ff",tier:1,range:950,visual:"rail"},
shotgun:{name:"Titan Shotgun",type:"shotgun",damage:38,fireRate:620,bulletSpeed:720,bulletSize:6,pellets:9,spread:.8,knockback:145,color:"#ff9d00",tier:2,range:310,visual:"spark"},
starfire:{name:"Starfire Wand",type:"homing",damage:58,fireRate:250,bulletSpeed:540,bulletSize:8,homingStrength:7,color:"#ff4fd8",tier:2,range:600,visual:"comet"},
flame:{name:"Flamethrower",type:"flame",damage:14,fireRate:52,bulletSpeed:560,bulletSize:9,spread:.78,burnDamage:8,burnTime:1900,color:"#ff5a1f",tier:2,range:300,visual:"flame"},
singularity:{name:"Singularity Gun",type:"singularity",damage:0,fireRate:1750,bulletSpeed:420,bulletSize:15,pullRadius:340,pullStrength:1050,blastRadius:220,blastDamage:150,blackHoleTime:900,color:"#6d3cff",tier:3,range:450,visual:"singularity"},
nova:{name:"Nova Lance",type:"nova",damage:75,fireRate:420,bulletSpeed:900,bulletSize:7,sideShots:2,color:"#ff6bff",tier:3,range:560,visual:"lance"},
void:{name:"Void Cannon",type:"explosive",damage:95,fireRate:1000,bulletSpeed:475,bulletSize:14,explosionRadius:145,explosionDamage:115,color:"#8c52ff",tier:4,range:500,visual:"void"},
arc:{name:"Arc Blaster",type:"arc",damage:78,fireRate:600,chainDamage:64,chains:8,chainRange:245,color:"#66ffff",tier:4,range:450,visual:"arc"},
prism:{name:"Prism Cannon",type:"prism",damage:82,fireRate:650,bulletSpeed:1050,bulletSize:6,splits:10,splitSpread:1.45,color:"#ff74e8",tier:5,range:610,visual:"prism"}
};

const PU={
heal:{name:"HEAL",color:"#40ff75",w:18},
shield:{name:"SHIELD",color:"#5ac8ff",w:16},
berserk:{name:"BERSERK",color:"#ff2400",w:2},
nuke:{name:"NUKE",color:"#fff",w:.25},
surge:{name:"POWER SURGE",color:"#ffd700",w:1.2}
};

const ET={
normal:{hp:70,r:21,spd:100,xp:1.5,outline:null},
fast:{hp:50,r:16,spd:153,xp:1.5,outline:"#49dfff"},
big:{hp:250,r:31,spd:81,xp:5,outline:"#ff9c45"},
tank:{hp:600,r:43,spd:60,xp:10,outline:"#ff3d3d"},
frenzy:{hp:100,r:18,spd:176,xp:3,outline:"#ffe34d"},
mega:{hp:1500,r:57,spd:51,xp:25,outline:"#ff4dff"}
};

function rs(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;c.style.width=W+"px";c.style.height=H+"px";x.setTransform(D,0,0,D,0,0)}addEventListener("resize",rs);

addEventListener("keydown",e=>{
 let k=e.key.toLowerCase();
 if(choosing){
  if(["w","a","arrowup","arrowleft"].includes(k)){e.preventDefault();moveChoice(-1);return}
  if(["s","d","arrowdown","arrowright"].includes(k)){e.preventDefault();moveChoice(1);return}
  if(k===" "||k==="enter"){e.preventDefault();selectChoice();return}
 }
 K[k]=1;if(k===" "){e.preventDefault();dash()}
});
addEventListener("keyup",e=>K[e.key.toLowerCase()]=0);

function joyStart(e){
 if(choosing||!run)return;
 let p=e.changedTouches[0];if(!p)return;
 e.preventDefault();jid=p.identifier;jactive=1;jcx=p.clientX;jcy=p.clientY;
 jb.style.display="block";jb.style.left=jcx+"px";jb.style.top=jcy+"px";joyMove(e)
}
function joyMove(e){
 if(!jactive)return;
 let p=[...e.touches].find(t=>t.identifier===jid);if(!p)return;
 e.preventDefault();
 let dx=p.clientX-jcx,dy=p.clientY-jcy,d=Math.hypot(dx,dy),m=48;
 if(d>m){dx=dx/d*m;dy=dy/d*m}
 jx=dx/m;jy=dy/m;js.style.transform=`translate(${dx}px,${dy}px)`
}
function joyEnd(e){
 if(!jactive)return;
 if([...e.changedTouches].some(t=>t.identifier===jid)){
  jactive=0;jid=null;jx=jy=0;jb.style.display="none";js.style.transform="translate(0,0)"
 }
}
jz.addEventListener("touchstart",joyStart,{passive:false});
jz.addEventListener("touchmove",joyMove,{passive:false});
jz.addEventListener("touchend",joyEnd,{passive:false});
jz.addEventListener("touchcancel",joyEnd,{passive:false});
dbtn.addEventListener("touchstart",e=>{e.preventDefault();dash()},{passive:false});
dbtn.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch"){e.preventDefault();dash()}});

const dd=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),rr=o=>o.hitRadius??o.radius,hit=(a,b)=>{let r=rr(a)+rr(b),dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy<r*r},rp=(p=70)=>({x:p+Math.random()*Math.max(1,W-p*2),y:p+Math.random()*Math.max(1,H-p*2)});
function ons(e){let h=e.radius*1.325,p=14;return e.x-h>=p&&e.x+h<=W-p&&e.y-h>=p&&e.y+h<=H-p}
function UL(k){return Math.min(5,(UP[k]||0)+(surge>0?2:0))}
function need(n=lv){return Math.floor(8+n*3.7+n*n*.45)}
function weighted(a){if(!a.length)return null;let z=a.reduce((s,o)=>s+o.w,0),r=Math.random()*z;for(const o of a){r-=o.w;if(r<=0)return o.k}return a[a.length-1].k}
function gain(v){xp+=v;while(xp>=need()){xp-=need();lv++;pending++}if(pending&&!choosing)openLevel()}
function rarityWeight(r){return r==="common"?10:r==="uncommon"?8:r==="rare"?6.5:r==="epic"?5:3.8}
function maxed(){return Object.values(UP).every(v=>v>=5)}
function finish(){run=0;choosing=0;lscr.classList.add("hidden");fs.textContent=`BUILD MAXED | Score: ${score} | Level: ${lv} | Kills: ${kills}`;go.classList.remove("hidden")}

function openLevel(){
 if(!pending)return;if(maxed()){finish();return}
 choosing=1;run=0;choiceIndex=0;lscr.classList.remove("hidden");
 let pool=Object.keys(UP).filter(k=>UP[k]<5),pick=[];
 while(pool.length&&pick.length<3){
  let a=pool.map(k=>({k,w:rarityWeight(UD[k].r)*(UP[k]?1.45:1)})),k=weighted(a);
  pick.push(k);pool.splice(pool.indexOf(k),1)
 }
 cards.innerHTML="";
 for(const k of pick){
  let u=UD[k],cur=UP[k],next=cur+1,evo=next===5,d=document.createElement("button"),tc=u.t==="ABILITY"?"#df9bff":u.t==="PASSIVE"?"#8ed7ff":"#ff9b9b",tb=u.t==="ABILITY"?"#361448":u.t==="PASSIVE"?"#142b40":"#401a1a";
  d.className=`upgrade rarity-${u.r}`+(evo?" evo":"");d.dataset.key=k;
  d.innerHTML=`<div class="upgradeTop"><span class="type" style="background:${tb};color:${tc}">${u.t}</span><span class="rarity">${u.r.toUpperCase()}</span></div><h2>${u.n}</h2><div class="lv">LV ${cur} → ${next}${evo?" • EVOLUTION":""}</div><p>${evo?u.e:u.d}</p>`;
  d.onclick=()=>chooseUp(k);cards.appendChild(d)
 }
 refreshChoice()
}
function refreshChoice(){[...cards.children].forEach((q,i)=>q.classList.toggle("selected",i===choiceIndex))}
function moveChoice(n){let a=cards.children.length;if(a){choiceIndex=(choiceIndex+n+a)%a;refreshChoice()}}
function selectChoice(){let q=cards.children[choiceIndex];if(q)chooseUp(q.dataset.key)}
function chooseUp(k){
 UP[k]++;if(k==="health"){pl.maxHealth+=5;pl.health=Math.min(pl.maxHealth,pl.health+5)}
 pending--;choosing=0;lscr.classList.add("hidden");
 if(maxed()){finish();return}
 if(pending)setTimeout(openLevel,0);else{run=1;lt=performance.now()}
}

function weaponChoice(){
 let late=Math.min(1,t/150+lv/32),pity=Math.min(1,badW/5),a=Object.entries(G).filter(([k])=>k!=="pistol"&&k!==pl.weaponKey).map(([k,g])=>{
  let w=g.tier===1?24:g.tier===2?23:g.tier===3?20:g.tier===4?15:10;
  w*=1+(g.tier>=3?(late*.7+pity):0);if(badW>=5&&g.tier<3)w=0;return{k,w}
 }),k=weighted(a);
 if(!k)return null;badW=G[k].tier>=3?0:badW+1;return k
}
function puChoice(){
 let a=[];
 for(const[k,v]of Object.entries(PU)){
  if(k==="heal"&&pl.health>=pl.maxHealth)continue;
  if(k==="shield"&&pl.shield>=100)continue;
  if(k==="berserk"&&(berserk>0||P.some(p=>p.key==="berserk")))continue;
  if(k==="surge"&&(surge>0||P.some(p=>p.key==="surge")))continue;
  a.push({k,w:v.w})
 }
 return weighted(a)
}

function spawnSide(){let a=[{s:0,v:pl.y/H},{s:2,v:1-pl.y/H},{s:3,v:pl.x/W},{s:1,v:1-pl.x/W}].sort((a,b)=>b.v-a.v);return Math.random()<.84?a[0].s:Math.random()<.72?a[1].s:Math.floor(Math.random()*4)}
function enemyType(){let a=[{k:"normal",w:40}];if(lv>=2)a.push({k:"fast",w:23+lv*.12});if(lv>=4)a.push({k:"big",w:15+lv*.2});if(lv>=8)a.push({k:"tank",w:5+lv*.1});if(lv>=10)a.push({k:"frenzy",w:12+lv*.16});if(lv>=18)a.push({k:"mega",w:2+lv*.06});return weighted(a)}
function hpScale(){return 1+lv*.025+Math.max(0,lv-20)*.012}
function se(){
 if(E.length>=245)return;
 let s=spawnSide(),m=80,a,b;if(!s){a=Math.random()*W;b=-m}else if(s===1){a=W+m;b=Math.random()*H}else if(s===2){a=Math.random()*W;b=H+m}else{a=-m;b=Math.random()*H}
 let ty=enemyType(),z=ET[ty],dx=pl.x-a,dy=pl.y-b,d=Math.hypot(dx,dy)||1,v=z.spd*(.9+Math.random()*.2),h=z.hp*hpScale();
 E.push({x:a,y:b,radius:z.r,type:ty,elite:!["normal","fast","frenzy"].includes(ty),vx:dx/d*v*.86,vy:dy/d*v*.86,baseMaxSpeed:v,steering:ty==="frenzy"?95:ty==="fast"?88:72+Math.random()*18,health:h,maxHealth:h,damage:25,xpv:z.xp,hitCooldown:0,slowTimer:0,burnTime:0,burnTick:0,burnDamage:0,dead:0,bladeHit:0})
}

function sw(){
 WP.length=0;let k=weaponChoice();if(!k)return;
 let p=rp();WP.push({x:p.x,y:p.y,radius:23,hitRadius:31,weaponKey:k,life:15000})
}
function sp(){
 let k=puChoice();if(!k)return;
 let p=rp();P.push({x:p.x,y:p.y,radius:19,hitRadius:28,key:k,life:22000,pulse:0})
}

function sc(a,b,v){
 let near=null,bd=105;
 for(const q of C){let cx=q.cx??q.x,cy=q.cy??q.y,d=Math.hypot(cx-a,cy-b);if(d<bd){bd=d;near=q}}
 let cx,cy;if(near&&Math.random()<.88){cx=near.cx??near.x;cy=near.cy??near.y}else{cx=a+(Math.random()-.5)*12;cy=b+(Math.random()-.5)*12}
 let n=Math.min(4,Math.max(1,Math.ceil(v/2))),each=v/n;
 if(C.length+n>MAXC){let q=near||C[Math.floor(Math.random()*C.length)];if(q)q.value+=v;return}
 for(let i=0;i<n;i++){let A=Math.random()*Math.PI*2,R=4+Math.random()*19,S=5+Math.random()*20;C.push({x:cx+Math.cos(A)*R,y:cy+Math.sin(A)*R,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:6,life:38000,value:each,nukeVacuum:0,cx,cy})}
}

function fn(src=pl,ex=new Set(),vis=1,max=Infinity){let q=null,bd=1e9;for(const e of E){if(e.dead||ex.has(e)||(vis&&!ons(e)))continue;let d=dd(src,e);if(d<=max&&d<bd){bd=d;q=e}}return q}
const gw=()=>G[pl.weaponKey];
function dmgMul(){return(1+UL("damage")*.15)*(berserk>0?2.1:1)}
function fireRate(w){return Math.max(22,w.fireRate/(1+UL("haste")*.1)/(berserk>0?2.7:1))}
function hp(a,b,col="#fff"){for(let i=0;i<3;i++)PT.push({x:a,y:b,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,radius:2+Math.random()*2,life:180,color:col,gravity:0})}
function blood(a,b,s=1){for(let i=0;i<Math.min(38,18+10*s);i++){let A=Math.random()*Math.PI*2,S=70+Math.random()*260*s;PT.push({x:a,y:b,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:2+Math.random()*5*s,life:450+Math.random()*500,color:Math.random()<.5?"#7a0000":"#d00000",gravity:110})}}
function kill(e,src=""){
 if(!e||e.dead)return;e.dead=1;kills++;score+=10;blood(e.x,e.y,e.radius/22);sc(e.x,e.y,e.xpv);
 let v=UL("vampire");if(v){let h=.6*v;if(pl.health<pl.maxHealth)pl.health=Math.min(pl.maxHealth,pl.health+h);else if(v>=5)pl.tempHP=Math.min(25,pl.tempHP+h)}
 let r=UL("chainreaction");if(r&&(src!=="reaction"||r>=5)&&rx<26){rx++;boom(e.x,e.y,48+r*13,24+r*12,210,"#ff3c6f","reaction")}
}
function de(e,d,k=0,a=0,col="#fff",src=""){
 if(!e||e.dead)return;
 let actual=d*dmgMul();
 if(UL("damage")>=5&&e.health/e.maxHealth<.2){kill(e,src);return}
 e.health-=actual;
 if(k){let resist=e.type==="mega"?.32:e.type==="tank"?.48:e.type==="big"?.68:1;e.vx+=Math.cos(a)*k*2.5*resist;e.vy+=Math.sin(a)*k*2.5*resist}
 hp(e.x,e.y,col);if(e.health<=0)kill(e,src)
}
function boom(a,b,r,d,du=300,col="#c45cff",src=""){EX.push({x:a,y:b,radius:0,maxRadius:r,life:du,duration:du,color:col});for(const e of E){if(e.dead)continue;let q=Math.hypot(e.x-a,e.y-b);if(q<r)de(e,d*(.4+(1-q/r)*.6),0,0,col,src)}}

function cb(a,w,o={}){
 let r=UL("ricochet");
 B.push({x:o.x??pl.x,y:o.y??pl.y,vx:Math.cos(a)*(o.speed??w.bulletSpeed),vy:Math.sin(a)*(o.speed??w.bulletSpeed),angle:a,radius:o.radius??w.bulletSize,damage:o.damage??w.damage,color:o.color??w.color,type:o.type??w.type,visual:o.visual??w.visual,pierce:(o.pierce??w.pierce??0)+UL("fmj"),ric:r,postRic:0,postTravel:0,postLimit:o.postLimit??290,hitEnemies:new Set(),explosionRadius:o.explosionRadius??w.explosionRadius??0,explosionDamage:o.explosionDamage??w.explosionDamage??0,homingStrength:o.homingStrength??w.homingStrength??0,slowTime:w.slowTime||0,knockback:w.knockback||0,burnDamage:w.burnDamage||0,burnTime:w.burnTime||0,splits:w.splits||0,splitSpread:w.splitSpread||0,prismGen:o.prismGen??0,life:o.life??(w.type==="singularity"?2200:3000)})
}
function bounceDamage(b){b.damage*=.85;if(b.explosionDamage)b.explosionDamage*=.85}
function consumeRic(b){if(b.ric<=0)return false;b.ric--;bounceDamage(b);if(b.ric<=0){b.postRic=1;b.postTravel=0}return true}

function chain(s,d,n,r,col,ex=new Set()){
 let f={x:s.x,y:s.y},h=new Set(ex);h.add(s);
 for(let i=0;i<n;i++){
  let q=null,bd=1e9;
  for(const e of E){if(e.dead||h.has(e)||!ons(e))continue;let z=Math.hypot(e.x-f.x,e.y-f.y);if(z<r&&z<bd){bd=z;q=e}}
  if(!q)break;L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:135,color:col});de(q,d,0,0,col);h.add(q);f=q;d*=.95
 }
}

function arcBeam(e,w,used=new Set()){
 let cr=UL("chainreaction"),q=e,d=w.damage,f={x:pl.x,y:pl.y},h=new Set(used),chains=w.chains+cr*2,range=w.chainRange+cr*18;
 for(let i=0;i<chains&&q;i++){
  L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:150,color:w.color});de(q,d,0,0,w.color);h.add(q);used.add(q);f=q;d=i?d*.95:w.chainDamage;
  let z=null,bd=1e9;for(const p of E){if(p.dead||h.has(p)||!ons(p))continue;let u=Math.hypot(p.x-f.x,p.y-f.y);if(u<range&&u<bd){bd=u;z=p}}q=z
 }
}
function arcVolley(w){
 let ml=UL("multishot"),beams=Math.max(1,ml),used=new Set();
 for(let i=0;i<beams;i++){let q=fn(pl,used,1,w.range);if(!q)break;arcBeam(q,w,used)}
}

function singularityActive(){return B.some(b=>b.type==="singularity")||BH.length}
function volley(a,w,free=0){
 let ml=UL("multishot"),n=1+ml,spread=w.type==="singularity"?.36:.11;
 if(w.type==="shotgun"){for(let i=0;i<w.pellets+ml*2;i++)cb(a+(Math.random()-.5)*w.spread,w);return}
 if(w.type==="arc"){arcVolley(w);return}
 if(w.type==="flame"){for(let i=0;i<1+ml;i++)cb(a+(Math.random()-.5)*w.spread,w,{type:"flame",life:900,speed:w.bulletSpeed*(.85+Math.random()*.35),radius:w.bulletSize+Math.random()*5});return}
 if(w.type==="nova"){cb(a,w);for(let i=1;i<=w.sideShots+ml;i++){cb(a-.18*i,w);cb(a+.18*i,w)}return}
 for(let i=0;i<n;i++)cb(a+(i-(n-1)/2)*spread,w);
 if(ml>=5)for(let i=0;i<n;i++)cb(a+Math.PI+(i-(n-1)/2)*spread,w);
 if(!free&&UL("haste")>=5&&++shotN%10===0)volley(a,w,1)
}
function shoot(now){
 let w=gw();if(w.type==="singularity"&&singularityActive())return;
 let q=fn(pl,new Set(),1,w.range||Infinity);if(!q||now-ls<fireRate(w))return;
 ls=now;volley(Math.atan2(q.y-pl.y,q.x-pl.x),w)
}

function prism(b,e){
 if(b.type!=="prism"&&b.type!=="prismShard")return;
 let cr=UL("chainreaction"),maxGen=Math.min(5,cr),gen=b.prismGen||0;
 if((b.type==="prismShard"&&gen>=maxGen)||prismBudget>=100)return;
 let cols=["#ff4fd8","#72f7ff","#fff16e","#b779ff","#7dff9b","#ff8b4a","#6ca8ff"],base=b.angle,n=gen===0?b.splits+UL("multishot"):Math.max(2,6-gen);
 n=Math.min(n,100-prismBudget);prismBudget+=n;
 for(let i=0;i<n;i++){
  let f=n===1?0:i/(n-1)-.5,a=base+f*(gen===0?b.splitSpread:1.05+gen*.12)+(Math.random()-.5)*.11;
  cb(a,G.prism,{x:e.x,y:e.y,damage:b.damage*(gen===0?.48:.62),type:"prismShard",visual:"prismShard",color:cols[(i+gen)%cols.length],speed:1030+Math.random()*220,radius:4,life:650,postLimit:230,prismGen:gen+1})
 }
}

function singularity(a,b){let w=G.singularity;BH.push({x:a,y:b,life:w.blackHoleTime,duration:w.blackHoleTime,pullRadius:w.pullRadius,pullStrength:w.pullStrength,blastRadius:w.blastRadius,blastDamage:w.blastDamage,color:w.color})}
function singularityBoom(q){boom(q.x,q.y,q.blastRadius,q.blastDamage,400,"#b26cff")}

function dash(){
 if(!run||choosing||dcd>0||dtm>0)return;
 let a=jactive?jx:((K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)),b=jactive?jy:((K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0));
 if(!a&&!b){a=pl.lastDX;b=pl.lastDY}
 let d=Math.hypot(a,b)||1;pl.dvx=a/d*900;pl.dvy=b/d*900;dtm=.225;dcd=1.05;if(UL("speed")>=5)boost=1.5
}

function hurt(z){
 if(inv>0)return;
 if(pl.shield>0){let a=Math.min(pl.shield,z);pl.shield-=a;z-=a}
 if(pl.tempHP>0){let a=Math.min(pl.tempHP,z);pl.tempHP-=a;z-=a}
 pl.health-=z;
 if(pl.health<=0&&UL("health")>=5&&!pl.secondWind){pl.secondWind=1;pl.health=pl.maxHealth*.5;inv=2}
 else if(pl.health<=0){pl.health=0;end()}
}

function up(dt){
 if(dcd>0)dcd-=dt;if(boost>0)boost-=dt;if(inv>0)inv-=dt;if(berserk>0)berserk-=dt;if(surge>0)surge-=dt;
 if(weaponTime>0){weaponTime-=dt*1000;if(weaponTime<=0){pl.weaponKey="pistol";weaponTime=0}}
 if(dtm>0){dtm-=dt;pl.x+=pl.dvx*dt;pl.y+=pl.dvy*dt}
 else{
  let a=jactive?jx:((K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)),b=jactive?jy:((K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0)),d=Math.hypot(a,b);
  let s=pl.speed*(1+UL("speed")*.05)*(boost>0?1.5:1)*(berserk>0?1.35:1);
  if(d>.08){let str=Math.min(1,d);a/=d;b/=d;pl.lastDX=a;pl.lastDY=b;pl.x+=a*s*str*dt;pl.y+=b*s*str*dt}
 }
 pl.x=Math.max(pl.radius,Math.min(W-pl.radius,pl.x));pl.y=Math.max(pl.radius,Math.min(H-pl.radius,pl.y))
}

function ue(dt){
 for(let i=E.length-1;i>=0;i--){
  let e=E[i];if(e.dead){E.splice(i,1);continue}
  let ms=e.baseMaxSpeed;
  if(e.slowTimer>0){e.slowTimer-=dt*1000;ms*=.5}
  if(e.burnTime>0){e.burnTime-=dt*1000;e.burnTick-=dt*1000;if(e.burnTick<=0){e.burnTick=250;de(e,e.burnDamage,0,0,"#ff5a1f")}}
  if(e.dead)continue;
  let dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy)||1,vx=dx/d*ms,vy=dy/d*ms,sx=vx-e.vx,sy=vy-e.vy,sl=Math.hypot(sx,sy),mx=e.steering*dt;
  if(sl>mx){sx=sx/sl*mx;sy=sy/sl*mx}
  e.vx+=sx;e.vy+=sy;let v=Math.hypot(e.vx,e.vy);
  if(v>ms*1.08){e.vx=e.vx/v*ms*1.08;e.vy=e.vy/v*ms*1.08}
  e.x+=e.vx*dt;e.y+=e.vy*dt;e.hitCooldown-=dt*1000;
  if(dtm<=0&&hit(pl,e)&&e.hitCooldown<=0){hurt(25);e.hitCooldown=650}
 }
}

function wall(b){
 let hw=0;
 if(b.x-b.radius<0&&b.vx<0){b.x=b.radius;b.vx*=-1;hw=1}
 if(b.x+b.radius>W&&b.vx>0){b.x=W-b.radius;b.vx*=-1;hw=1}
 if(b.y-b.radius<0&&b.vy<0){b.y=b.radius;b.vy*=-1;hw=1}
 if(b.y+b.radius>H&&b.vy>0){b.y=H-b.radius;b.vy*=-1;hw=1}
 if(!hw)return true;
 if(b.type==="prismShard")return false;
 b.angle=Math.atan2(b.vy,b.vx);
 if(UL("ricochet")>=5){bounceDamage(b);return true}
 if(b.ric>0){consumeRic(b);return true}
 return false
}

function ub(dt){
 for(let i=B.length-1;i>=0;i--){
  let b=B[i],spd=Math.hypot(b.vx,b.vy);b.life-=dt*1000;

  if(b.postRic){b.postTravel+=spd*dt;if(b.postTravel>=b.postLimit){B.splice(i,1);continue}}

  if(b.type==="homing"){
   let q=fn(b,b.hitEnemies,1,500);
   if(q){
    let a=Math.atan2(q.y-b.y,q.x-b.x),z=Math.atan2(Math.sin(a-b.angle),Math.cos(a-b.angle));
    b.angle+=z*b.homingStrength*dt;let s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(b.angle)*s;b.vy=Math.sin(b.angle)*s
   }
  }

  b.x+=b.vx*dt;b.y+=b.vy*dt;

  if((UL("ricochet")||b.type==="prismShard")&&["normal","railgun","frost","homing","prism","prismShard","nova","explosive","shotgun"].includes(b.type)){
   if(!wall(b)){
    if(b.type==="explosive")boom(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color);
    B.splice(i,1);continue
   }
  }else if(b.x<-180||b.x>W+180||b.y<-180||b.y>H+180){
   if(b.type==="singularity")singularity(b.x,b.y);
   B.splice(i,1);continue
  }

  if(b.life<=0){if(b.type==="singularity")singularity(b.x,b.y);B.splice(i,1);continue}

  let rm=0;
  for(const e of E){
   if(e.dead||b.hitEnemies.has(e)||!hit(b,e))continue;
   b.hitEnemies.add(e);

   if(b.type==="singularity"){singularity(b.x,b.y);rm=1;break}

   de(e,b.damage,b.knockback,b.angle,b.color);

   if(b.type==="frost")e.slowTimer=b.slowTime;
   if(b.type==="flame"&&!e.dead){
    e.burnTime=Math.max(e.burnTime,b.burnTime);
    e.burnDamage=Math.max(e.burnDamage,b.burnDamage*dmgMul());
    e.burnTick=0
   }

   prism(b,e);

   if(b.type==="explosive"){boom(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color);rm=1;break}

   if(b.pierce>0){b.pierce--;if(UL("fmj")>=5)b.damage*=1.15;continue}

   if(b.ric>0){
    let q=fn(e,new Set(b.hitEnemies),1,260);
    if(q){
     let a=Math.atan2(q.y-e.y,q.x-e.x),s=Math.hypot(b.vx,b.vy);
     b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.angle=a;consumeRic(b);break
    }
   }

   rm=1;break
  }

  if(rm)B.splice(i,1)
 }
}

function ubh(dt){
 for(let i=BH.length-1;i>=0;i--){
  let q=BH[i];q.life-=dt*1000,p=1-q.life/q.duration;
  for(const e of E){
   let dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy);
   if(d>2&&d<q.pullRadius){let f=q.pullStrength*(1-d/q.pullRadius)*(1+p)*dt;e.vx+=dx/d*f;e.vy+=dy/d*f}
  }
  if(q.life<=0){singularityBoom(q);BH.splice(i,1)}
 }
}

function us(dt){
 let n=UL("solar");if(!n)return;orb+=dt*4.2;
 let count=Math.min(5,n+1),r=n>=5?82:70+n*2,damage=18+n*7,kb=25+n*10;

 for(let i=0;i<count;i++){
  let a=orb+Math.PI*2/count*i,q={x:pl.x+Math.cos(a)*r,y:pl.y+Math.sin(a)*r,radius:12};
  for(const e of E){
   if(!e.dead&&hit(q,e)&&performance.now()-e.bladeHit>220){
    e.bladeHit=performance.now();let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1,res=e.type==="mega"?.3:e.type==="tank"?.45:e.type==="big"?.7:1;
    e.vx+=dx/d*kb*res;e.vy+=dy/d*kb*res;de(e,damage,0,0,"#ffda44","solar")
   }
  }
 }
}

function ul(dt){
 let s=UL("lightning");if(!s)return;lgt+=dt*1000;if(lgt<1800-s*180)return;lgt=0;
 for(let j=0;j<(s>=5?3:1);j++){let q=fn(pl,new Set(),1,Infinity);if(!q)break;de(q,35+s*12,0,0,"#68f7ff");chain(q,(35+s*12)*.75,1+s,140+s*20,"#68f7ff")}
}

function densest(){let best=null,n=0;for(const e of E){let z=0;for(const q of E)if(Math.hypot(q.x-e.x,q.y-e.y)<170)z++;if(z>n){n=z;best=e}}return best}
function um(dt){
 let s=UL("meteors");if(!s)return;met+=dt*1000;megaMet+=dt;
 if(met>=Math.max(650,2100-s*260)){met=0;M.push({x:50+Math.random()*(W-100),y:70+Math.random()*(H-140),life:650,duration:650,radius:34+s*7,damage:50+s*22})}
 if(s>=5&&megaMet>=10){megaMet=0;let q=densest();if(q)M.push({x:q.x,y:q.y,life:900,duration:900,radius:150,damage:400,mega:1})}
}
function umo(dt){for(let i=M.length-1;i>=0;i--){let m=M[i];m.life-=dt*1000;if(m.life<=0){boom(m.x,m.y,m.radius,m.damage,300,"#ff6b35");M.splice(i,1)}}}

function pull(q,dt,r,s){let dx=pl.x-q.x,dy=pl.y-q.y,d=Math.hypot(dx,dy);if(d>1&&d<r){q.x+=dx/d*s*dt;q.y+=dy/d*s*dt}}

function upp(dt){
 for(let i=WP.length-1;i>=0;i--){
  let q=WP[i];q.life-=dt*1000;if(q.life<=0){WP.splice(i,1);continue}
  if(hit(pl,q)){pl.weaponKey=q.weaponKey;weaponTime=30000;ls=0;WP.splice(i,1)}
 }

 for(let i=P.length-1;i>=0;i--){
  let q=P[i];q.life-=dt*1000;q.pulse+=dt*5;if(q.life<=0){P.splice(i,1);continue}
  if(hit(pl,q)){
   if(q.key==="heal")pl.health=pl.maxHealth;
   else if(q.key==="shield")pl.shield=Math.min(100,pl.shield+50);
   else if(q.key==="berserk")berserk=14;
   else if(q.key==="surge")surge=6;
   else if(q.key==="nuke"){for(const e of E)if(!e.dead&&ons(e))kill(e);for(const z of C)z.nukeVacuum=1}
   P.splice(i,1)
  }
 }
}

function magnetStats(){let m=UL("magnet");return m===0?{r:88,s:455}:m===1?{r:150,s:480}:m===2?{r:210,s:510}:m===3?{r:270,s:545}:m===4?{r:340,s:585}:{r:440,s:760}}
function uc(dt){
 let ms=magnetStats();
 for(let i=C.length-1;i>=0;i--){
  let q=C[i];q.life-=dt*1000;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.pow(.025,dt);q.vy*=Math.pow(.025,dt);
  if(!q.nukeVacuum&&q.cx!==undefined){
   let dx=q.cx-q.x,dy=q.cy-q.y,d=Math.hypot(dx,dy);
   if(d>14){let s=Math.min(72,(d-14)*1.7);q.x+=dx/d*s*dt;q.y+=dy/d*s*dt}
  }
  if(q.nukeVacuum)pull(q,dt,99999,1150);else pull(q,dt,ms.r,ms.s);
  if(q.life<=0)C.splice(i,1);else if(hit(pl,q)){gain(q.value);C.splice(i,1)}
 }
}

function ufx(dt){
 for(let i=PT.length-1;i>=0;i--){
  let p=PT[i];p.life-=dt*1000;p.vy+=(p.gravity||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(p.life<=0)PT.splice(i,1)
 }
 for(let i=EX.length-1;i>=0;i--){EX[i].life-=dt*1000;if(EX[i].life<=0)EX.splice(i,1)}
 for(let i=L.length-1;i>=0;i--){L[i].life-=dt*1000;if(L[i].life<=0)L.splice(i,1)}
}

function bg(){x.fillStyle="#111820";x.fillRect(0,0,W,H);x.strokeStyle="#ffffff08";for(let a=0;a<W;a+=50){x.beginPath();x.moveTo(a,0);x.lineTo(a,H);x.stroke()}for(let b=0;b<H;b+=50){x.beginPath();x.moveTo(0,b);x.lineTo(W,b);x.stroke()}}

function dp(){
 if(surge>0){x.save();x.shadowBlur=30;x.shadowColor="#ffd700";x.strokeStyle="#ffd700";x.lineWidth=4;x.beginPath();x.arc(pl.x,pl.y,pl.radius+17+Math.sin(performance.now()/70)*4,0,Math.PI*2);x.stroke();x.restore()}
 if(pl.shield>0){x.beginPath();x.arc(pl.x,pl.y,pl.radius+8,0,Math.PI*2);x.strokeStyle="#55cfff";x.lineWidth=4;x.stroke()}
 x.beginPath();x.arc(pl.x,pl.y,pl.radius,0,Math.PI*2);x.fillStyle=inv>0?"#fff":berserk>0?"#ff4b32":pl.color;x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke()
}

function dee(){
 for(const e of E){
  let s=e.radius*2.65,z=ET[e.type];
  if(z.outline){
   x.save();x.strokeStyle=z.outline;x.lineWidth=e.type==="mega"?7:e.type==="tank"?6:3;x.shadowBlur=12;x.shadowColor=z.outline;
   x.beginPath();x.arc(e.x,e.y,e.radius+7,0,Math.PI*2);x.stroke();x.restore()
  }
  if(hi.complete&&hi.naturalWidth)x.drawImage(hi,e.x-s/2,e.y-s/2,s,s);
  else{x.fillStyle=z.outline||"#888";x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.fill()}
  if(e.elite||e.health<e.maxHealth){let w=e.radius*1.8;x.fillStyle="#250000";x.fillRect(e.x-w/2,e.y-e.radius-10,w,5);x.fillStyle="#f44";x.fillRect(e.x-w/2,e.y-e.radius-10,w*Math.max(0,e.health/e.maxHealth),5)}
 }
}

function dc(){for(const q of C){x.save();x.shadowBlur=q.nukeVacuum?16:7;x.shadowColor="#ffd700";x.fillStyle="#ffd700";x.beginPath();x.arc(q.x,q.y,q.radius,0,Math.PI*2);x.fill();x.restore()}}

function db(){
 for(const b of B){
  x.save();x.fillStyle=b.color;x.shadowBlur=12;x.shadowColor=b.color;
  if(b.visual==="prism"||b.visual==="prismShard"){x.translate(b.x,b.y);x.rotate(b.angle);x.beginPath();x.moveTo(12,0);x.lineTo(-7,-5);x.lineTo(-7,5);x.fill()}
  else if(b.visual==="rail"){x.translate(b.x,b.y);x.rotate(b.angle);x.fillRect(-28,-2,56,4)}
  else if(b.visual==="flame"){x.globalAlpha=.8;x.beginPath();x.arc(b.x,b.y,b.radius*1.5,0,Math.PI*2);x.fill()}
  else{x.beginPath();x.arc(b.x,b.y,b.radius,0,Math.PI*2);x.fill()}
  x.restore()
 }
}

function ds(){
 let n=UL("solar");if(!n)return;let count=Math.min(5,n+1),r=n>=5?82:70+n*2;
 for(let i=0;i<count;i++){
  let a=orb+Math.PI*2/count*i,A=pl.x+Math.cos(a)*r,Bb=pl.y+Math.sin(a)*r;
  x.save();x.translate(A,Bb);x.rotate(a);x.fillStyle="#fff7a0";x.shadowBlur=18;x.shadowColor="#ffda44";x.fillRect(-4,-16,8,32);x.restore()
 }
}

function dwp(){for(const p of WP){let w=G[p.weaponKey];x.save();x.shadowBlur=18;x.shadowColor=w.color;x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle="#111";x.fill();x.strokeStyle=w.color;x.lineWidth=4;x.stroke();x.fillStyle="#fff";x.font="bold 8px Arial";x.textAlign="center";x.fillText(w.name.split(" ")[0],p.x,p.y+3);x.restore()}}
function dpu(){for(const p of P){let u=PU[p.key];x.save();x.shadowBlur=p.key==="surge"?34:16;x.shadowColor=u.color;x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle=u.color;x.fill();x.fillStyle="#111";x.font="bold 8px Arial";x.textAlign="center";x.fillText(u.name,p.x,p.y+3);x.restore()}}
function dmet(){for(const m of M){x.beginPath();x.arc(m.x,m.y,m.radius,0,Math.PI*2);x.strokeStyle=m.mega?"#fff2a8":"#ff6b35";x.lineWidth=m.mega?8:4;x.stroke()}}
function dbh(){for(const q of BH){x.save();x.shadowBlur=30;x.shadowColor="#6d3cff";x.beginPath();x.arc(q.x,q.y,24,0,Math.PI*2);x.fillStyle="#030005";x.fill();x.strokeStyle="#b98cff";x.lineWidth=4;x.stroke();x.restore()}}
function dfx(){for(const p of PT){x.save();x.globalAlpha=Math.min(1,p.life/250);x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle=p.color;x.fill();x.restore()}for(const l of L){x.save();x.strokeStyle=l.color;x.shadowBlur=12;x.shadowColor=l.color;x.lineWidth=4;x.beginPath();x.moveTo(l.x1,l.y1);x.lineTo(l.x2,l.y2);x.stroke();x.restore()}for(const e of EX){x.save();x.globalAlpha=Math.max(0,e.life/e.duration);x.strokeStyle=e.color;x.lineWidth=8;x.beginPath();x.arc(e.x,e.y,e.maxRadius*(1-e.life/e.duration),0,Math.PI*2);x.stroke();x.restore()}}

function hud(){
 ht.textContent=`HP ${Math.ceil(pl.health)}${pl.tempHP?` +${Math.ceil(pl.tempHP)}`:""}`;
 wt.textContent=pl.weaponKey==="pistol"?"Pistol":`${gw().name} ${Math.ceil(weaponTime/1000)}s`;
 st.textContent=`Score ${score}`;lvT.textContent=`LV ${lv}`;xpB.style.width=`${Math.min(100,xp/need()*100)}%`;
 if(pl.shield>0){shHUD.classList.remove("hidden");shT.textContent=Math.ceil(pl.shield)}else shHUD.classList.add("hidden")
}

function end(){run=0;fs.textContent=`Score: ${score} | Level: ${lv} | Kills: ${kills}`;go.classList.remove("hidden")}
function reset(){
 E=[];B=[];WP=[];P=[];C=[];EX=[];L=[];PT=[];M=[];BH=[];
 score=kills=xp=pending=0;lv=1;t=0;weaponTime=badW=berserk=surge=boost=inv=0;
 pl.x=W/2;pl.y=H/2;pl.health=pl.maxHealth=25;pl.tempHP=pl.shield=0;pl.weaponKey="pistol";pl.secondWind=0;
 for(const k in UP)UP[k]=0;
 ls=est=wst=pst=lgt=met=megaMet=orb=dtm=dcd=0;run=1;choosing=0;jactive=0;jx=jy=0;
 jb.style.display="none";go.classList.add("hidden");lscr.classList.add("hidden");sw();sp();lt=performance.now()
}
rb.onclick=reset;

function loop(n){
 let d=Math.min((n-lt)/1000,.05);lt=n;bg();
 if(run){
  rx=0;prismBudget=0;t+=d;est+=d*1000;wst+=d*1000;pst+=d*1000;
  let er=Math.max(190,700-lv*13-t*.18),ec=lv>=26?3:lv>=9?2:1;
  if(est>=er){est=0;for(let i=0;i<ec;i++)se()}
  if(wst>=15000){wst=0;sw()}
  let pr=Math.max(4300,9000-lv*95);
  if(pst>=pr){pst=0;sp();if(lv>=18&&Math.random()<.18)sp()}
  up(d);ue(d);ub(d);ubh(d);us(d);ul(d);um(d);umo(d);upp(d);uc(d);ufx(d);shoot(n);hud()
 }
 dwp();dpu();dc();dee();db();ds();dmet();dbh();dp();dfx();requestAnimationFrame(loop)
}

rs();pl.x=W/2;pl.y=H/2;sw();sp();hud();lt=performance.now();requestAnimationFrame(loop);
