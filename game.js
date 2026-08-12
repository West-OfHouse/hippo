const c=document.getElementById("gameCanvas"),x=c.getContext("2d"),
ht=document.getElementById("healthText"),wt=document.getElementById("weaponText"),
st=document.getElementById("scoreText"),lvT=document.getElementById("levelText"),
xpB=document.getElementById("xpBar"),shHUD=document.getElementById("shieldHUD"),
shT=document.getElementById("shieldText"),lscr=document.getElementById("levelScreen"),
cards=document.getElementById("upgradeCards"),go=document.getElementById("gameOverScreen"),
fs=document.getElementById("finalScore"),rb=document.getElementById("restartButton"),
dbtn=document.getElementById("dashButton"),jz=document.getElementById("joystickZone"),
jb=document.getElementById("joystickBase"),js=document.getElementById("joystickStick");

let W=0,H=0,D=1,run=1,score=0,kills=0,lv=1,xp=0,pending=0,choosing=0,choiceIndex=0;
let lt=0,ls=0,t=0,est=0,wst=0,pst=0,lgt=0,met=0,orb=0,dtm=0,dcd=0;
let boost=0,inv=0,berserk=0,surge=0,speedBoost=0,ghost=0,freeze=0,deadeye=0;
let weaponTime=0,badW=0,shotN=0,rx=0,prismBudget=0;
let E=[],B=[],WP=[],P=[],C=[],EX=[],L=[],PT=[],M=[],BH=[];
let jx=0,jy=0,jactive=0,jid=null,jcx=0,jcy=0;

const K={},MAXC=145,hi=new Image();hi.src="hippo.png";

const pl={
x:0,y:0,radius:18,hitRadius:10,speed:295,
health:25,maxHealth:25,tempHP:0,shield:0,
color:"#55ccff",weaponKey:"pistol",
lastDX:1,lastDY:0,dvx:0,dvy:0,secondWind:0
};

const UP={
fmj:0,multishot:0,ricochet:0,haste:0,damage:0,prismup:0,conduction:0,
vampire:0,speed:0,health:0,magnet:0,
lightning:0,meteors:0,chainreaction:0,solar:0
};

const UD={
fmj:{n:"FMJ",t:"WEAPON MOD",r:"uncommon",d:"+1 projectile penetration per level.",e:"AP ROUNDS: penetrated targets increase projectile damage."},
multishot:{n:"MULTISHOT",t:"WEAPON MOD",r:"rare",d:"Each weapon gains its own stronger multi-projectile behavior.",e:"FULL SALVO: maximum weapon-specific multishot pattern."},
ricochet:{n:"RICOCHET",t:"WEAPON MOD",r:"rare",d:"Chance for eligible shots to redirect into another nearby hippo.",e:"PINBALL: 60% chance and up to 2 redirects."},
haste:{n:"HASTE",t:"WEAPON MOD",r:"uncommon",d:"+10% fire rate per level.",e:"OVERCLOCK: every 10th volley repeats instantly."},
damage:{n:"DAMAGE",t:"WEAPON MOD",r:"uncommon",d:"+15% weapon damage per level.",e:"EXECUTIONER: hits execute enemies below 20% HP."},
prismup:{n:"PRISM",t:"WEAPON MOD",r:"rare",d:"Adds more shards to Prism Cannon fractures.",e:"KALEIDOSCOPE: +12 shards and much wider fractures."},
conduction:{n:"CONDUCTION",t:"WEAPON MOD",r:"epic",d:"Plasma hits release chain lightning. Also improves the Lightning ability.",e:"SUPERCONDUCTOR: Plasma and Lightning can fork into multiple branches."},

vampire:{n:"VAMPIRE",t:"PASSIVE",r:"rare",d:"Kills restore increasing amounts of HP.",e:"BLOODLUST: overhealing becomes temporary HP."},
speed:{n:"SPEED",t:"PASSIVE",r:"common",d:"+5% movement speed per level.",e:"AFTERIMAGE: dashing grants a temporary movement boost."},
health:{n:"HEALTH",t:"PASSIVE",r:"common",d:"+5 max HP and immediately heal 5.",e:"SECOND WIND: survive lethal damage once at 50% HP."},
magnet:{n:"MAGNET",t:"PASSIVE",r:"uncommon",d:"Increases XP attraction range and pull strength.",e:"GRAVITY WELL: huge XP attraction radius."},

lightning:{n:"LIGHTNING",t:"ABILITY",r:"epic",d:"Periodically strikes hippos with chaining lightning.",e:"THUNDERSTORM: 3 separate automatic strikes."},
meteors:{n:"METEORS",t:"ABILITY",r:"epic",d:"Targets strong hippos with increasingly large meteors.",e:"EXTINCTION: enormous meteors target the toughest enemies."},
chainreaction:{n:"CHAIN REACTION",t:"ABILITY",r:"epic",d:"Dead hippos explode. Also improves Arc and Prism recursion.",e:"CRITICAL MASS: reaction kills can explode again."},
solar:{n:"SOLAR BLADES",t:"ABILITY",r:"legendary",d:"Starts with 2 blades. Levels add blades and damage.",e:"SOLAR GUARD: 5 defensive blades."}
};

const G={
pistol:{name:"Pistol",type:"normal",damage:42,fireRate:350,bulletSpeed:800,bulletSize:5,color:"#fff",tier:0,range:520,visual:"tracer"},
plasma:{name:"Plasma SMG",type:"plasma",damage:22,fireRate:80,bulletSpeed:850,bulletSize:5,color:"#00eaff",tier:1,range:520,visual:"plasma"},
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
heal:{name:"HEAL",color:"#40ff75",w:16},
shield:{name:"SHIELD",color:"#5ac8ff",w:14},
freeze:{name:"FREEZE",color:"#8be9ff",w:9},
shockwave:{name:"SHOCKWAVE",color:"#fff07a",w:9},
speedboost:{name:"SPEED",color:"#58ff9c",w:8},
deadeye:{name:"DEADEYE",color:"#ff934d",w:5},
ghost:{name:"GHOST",color:"#d0d9ff",w:4},
berserk:{name:"BERSERK",color:"#ff2400",w:1.5},
surge:{name:"POWER SURGE",color:"#ffd700",w:.9},
nuke:{name:"NUKE",color:"#fff",w:.18}
};

const ET={
normal:{hp:70,r:21,spd:100,xp:1.5,outline:null},
fast:{hp:50,r:16,spd:153,xp:1.5,outline:"#49dfff"},
big:{hp:250,r:31,spd:81,xp:5,outline:"#ff9c45"},
tank:{hp:600,r:43,spd:60,xp:10,outline:"#ff3d3d"},
frenzy:{hp:100,r:18,spd:176,xp:3,outline:"#ffe34d"},
mega:{hp:1500,r:57,spd:51,xp:25,outline:"#ff4dff"}
};

function rs(){
D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
c.width=W*D;c.height=H*D;c.style.width=W+"px";c.style.height=H+"px";
x.setTransform(D,0,0,D,0,0)
}
addEventListener("resize",rs);

addEventListener("keydown",e=>{
let k=e.key.toLowerCase();
if(choosing){
if(["w","a","arrowup","arrowleft"].includes(k)){e.preventDefault();moveChoice(-1);return}
if(["s","d","arrowdown","arrowright"].includes(k)){e.preventDefault();moveChoice(1);return}
if(k===" "||k==="enter"){e.preventDefault();selectChoice();return}
}
K[k]=1;
if(k===" "){e.preventDefault();dash()}
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

const rr=o=>o.hitRadius??o.radius;
const hit=(a,b)=>{let r=rr(a)+rr(b),dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy<r*r};
const dd=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const rp=(p=70)=>({x:p+Math.random()*Math.max(1,W-p*2),y:p+Math.random()*Math.max(1,H-p*2)});

function ons(e){
let h=e.radius*1.325,p=14;
return e.x-h>=p&&e.x+h<=W-p&&e.y-h>=p&&e.y+h<=H-p
}
function UL(k){return Math.min(5,(UP[k]||0)+(surge>0?2:0))}
function need(n=lv){return Math.floor(8+n*3.7+n*n*.45)}
function weighted(a){
if(!a.length)return null;
let z=a.reduce((s,o)=>s+o.w,0),r=Math.random()*z;
for(const o of a){r-=o.w;if(r<=0)return o.k}
return a[a.length-1].k
}
function rarityWeight(r){return r==="common"?10:r==="uncommon"?8:r==="rare"?6.5:r==="epic"?5:3.8}
function gain(v){
xp+=v;
while(xp>=need()){xp-=need();lv++;pending++}
if(pending&&!choosing)openLevel()
}
function maxed(){return Object.values(UP).every(v=>v>=5)}
function finish(){
run=0;choosing=0;lscr.classList.add("hidden");
fs.textContent=`BUILD MAXED | Score: ${score} | Level: ${lv} | Kills: ${kills}`;
go.classList.remove("hidden")
}

function openLevel(){
if(!pending)return;
if(maxed()){finish();return}
choosing=1;run=0;choiceIndex=0;lscr.classList.remove("hidden");

let pool=Object.keys(UP).filter(k=>UP[k]<5),pick=[];

while(pool.length&&pick.length<3){
let a=pool.map(k=>({k,w:rarityWeight(UD[k].r)*(UP[k]?1.45:1)}));
let k=weighted(a);pick.push(k);pool.splice(pool.indexOf(k),1)
}

cards.innerHTML="";

for(const k of pick){
let u=UD[k],cur=UP[k],next=cur+1,evo=next===5,d=document.createElement("button");
let tc=u.t==="ABILITY"?"#df9bff":u.t==="PASSIVE"?"#8ed7ff":"#ff9b9b";
let tb=u.t==="ABILITY"?"#361448":u.t==="PASSIVE"?"#142b40":"#401a1a";

d.className=`upgrade rarity-${u.r}`+(evo?" evo":"");
d.dataset.key=k;
d.innerHTML=`<div class="upgradeTop"><span class="type" style="background:${tb};color:${tc}">${u.t}</span><span class="rarity">${u.r.toUpperCase()}</span></div><h2>${u.n}</h2><div class="lv">LV ${cur} → ${next}${evo?" • EVOLUTION":""}</div><p>${evo?u.e:u.d}</p>`;
d.onclick=()=>chooseUp(k);cards.appendChild(d)
}

refreshChoice()
}
function refreshChoice(){[...cards.children].forEach((q,i)=>q.classList.toggle("selected",i===choiceIndex))}
function moveChoice(n){let a=cards.children.length;if(a){choiceIndex=(choiceIndex+n+a)%a;refreshChoice()}}
function selectChoice(){let q=cards.children[choiceIndex];if(q)chooseUp(q.dataset.key)}
function chooseUp(k){
UP[k]++;
if(k==="health"){pl.maxHealth+=5;pl.health=Math.min(pl.maxHealth,pl.health+5)}
pending--;choosing=0;lscr.classList.add("hidden");
if(maxed()){finish();return}
if(pending)setTimeout(openLevel,0);
else{run=1;lt=performance.now()}
}

function weaponChoice(){
let late=Math.min(1,t/150+lv/32),pity=Math.min(1,badW/5);
let a=Object.entries(G).filter(([k])=>k!=="pistol"&&k!==pl.weaponKey).map(([k,g])=>{
let w=g.tier===1?24:g.tier===2?23:g.tier===3?20:g.tier===4?15:10;
w*=1+(g.tier>=3?(late*.7+pity):0);
if(badW>=5&&g.tier<3)w=0;
return{k,w}
});
let k=weighted(a);
if(!k)return null;
badW=G[k].tier>=3?0:badW+1;
return k
}

function puChoice(){
if(Math.random()<.42)return null;

let a=[];

for(const[k,v]of Object.entries(PU)){
if(k==="heal"&&pl.health>=pl.maxHealth)continue;
if(k==="shield"&&pl.shield>=100)continue;
if(k==="berserk"&&(berserk>0||P.some(p=>p.key==="berserk")))continue;
if(k==="surge"&&(surge>0||P.some(p=>p.key==="surge")))continue;
if(k==="ghost"&&(ghost>0||P.some(p=>p.key==="ghost")))continue;
if(k==="speedboost"&&(speedBoost>0||P.some(p=>p.key==="speedboost")))continue;
if(k==="freeze"&&freeze>0)continue;
a.push({k,w:v.w})
}

return weighted(a)
}

function spawnSide(){
let a=[
{s:0,v:pl.y/H},
{s:2,v:1-pl.y/H},
{s:3,v:pl.x/W},
{s:1,v:1-pl.x/W}
].sort((a,b)=>b.v-a.v);

return Math.random()<.84?a[0].s:Math.random()<.72?a[1].s:Math.floor(Math.random()*4)
}

function enemyType(){
let a=[{k:"normal",w:40}];
if(lv>=2)a.push({k:"fast",w:23+lv*.12});
if(lv>=4)a.push({k:"big",w:15+lv*.2});
if(lv>=8)a.push({k:"tank",w:5+lv*.1});
if(lv>=10)a.push({k:"frenzy",w:12+lv*.16});
if(lv>=18)a.push({k:"mega",w:2+lv*.06});
return weighted(a)
}

function hpScale(){return 1+lv*.025+Math.max(0,lv-20)*.012}

function se(){
if(E.length>=245)return;

let s=spawnSide(),m=80,a,b;

if(!s){a=Math.random()*W;b=-m}
else if(s===1){a=W+m;b=Math.random()*H}
else if(s===2){a=Math.random()*W;b=H+m}
else{a=-m;b=Math.random()*H}

let ty=enemyType(),z=ET[ty],dx=pl.x-a,dy=pl.y-b,d=Math.hypot(dx,dy)||1;
let v=z.spd*(.9+Math.random()*.2),h=z.hp*hpScale();

E.push({
x:a,y:b,radius:z.r,type:ty,
elite:!["normal","fast","frenzy"].includes(ty),
vx:dx/d*v*.86,vy:dy/d*v*.86,
baseMaxSpeed:v,
steering:ty==="frenzy"?95:ty==="fast"?88:72+Math.random()*18,
health:h,maxHealth:h,damage:25,xpv:z.xp,
hitCooldown:0,slowTimer:0,burnTime:0,burnTick:0,burnDamage:0,
dead:0,bladeHit:0
})
}

function sw(){
WP.length=0;
let k=weaponChoice();if(!k)return;
let p=rp();
WP.push({x:p.x,y:p.y,radius:23,hitRadius:31,weaponKey:k,life:15000})
}

function sp(){
let k=puChoice();if(!k)return;
let p=rp();
P.push({x:p.x,y:p.y,radius:19,hitRadius:28,key:k,life:18000,pulse:0})
}

function sc(a,b,v){
let near=null,bd=105;

for(const q of C){
let cx=q.cx??q.x,cy=q.cy??q.y,d=Math.hypot(cx-a,cy-b);
if(d<bd){bd=d;near=q}
}

let cx,cy;

if(near&&Math.random()<.88){
cx=near.cx??near.x;cy=near.cy??near.y
}else{
cx=a+(Math.random()-.5)*12;cy=b+(Math.random()-.5)*12
}

let n=Math.min(4,Math.max(1,Math.ceil(v/2))),each=v/n;

if(C.length+n>MAXC){
let q=near||C[Math.floor(Math.random()*C.length)];
if(q)q.value+=v;
return
}

for(let i=0;i<n;i++){
let A=Math.random()*Math.PI*2,R=4+Math.random()*19,S=5+Math.random()*20;
C.push({
x:cx+Math.cos(A)*R,y:cy+Math.sin(A)*R,
vx:Math.cos(A)*S,vy:Math.sin(A)*S,
radius:6,life:38000,value:each,nukeVacuum:0,cx,cy
})
}
}

function fn(src=pl,ex=new Set(),vis=1,max=Infinity){
let q=null,bd=1e9;
for(const e of E){
if(e.dead||ex.has(e)||(vis&&!ons(e)))continue;
let d=dd(src,e);
if(d<=max&&d<bd){bd=d;q=e}
}
return q
}

const gw=()=>G[pl.weaponKey];

function critMul(){return deadeye>0&&Math.random()<.28?3:1}
function dmgMul(){return(1+UL("damage")*.15)*(berserk>0?2.1:1)}
function fireRate(w){return Math.max(22,w.fireRate/(1+UL("haste")*.1)/(berserk>0?2.7:1))}

function hp(a,b,col="#fff"){
for(let i=0;i<3;i++){
PT.push({
x:a,y:b,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,
radius:2+Math.random()*2,life:180,color:col,gravity:0
})
}
}

function blood(a,b,s=1){
for(let i=0;i<Math.min(38,18+10*s);i++){
let A=Math.random()*Math.PI*2,S=70+Math.random()*260*s;
PT.push({
x:a,y:b,vx:Math.cos(A)*S,vy:Math.sin(A)*S,
radius:2+Math.random()*5*s,life:450+Math.random()*500,
color:Math.random()<.5?"#7a0000":"#d00000",gravity:110
})
}
}

function kill(e,src=""){
if(!e||e.dead)return;

e.dead=1;kills++;score+=10;
blood(e.x,e.y,e.radius/22);
sc(e.x,e.y,e.xpv);

let v=UL("vampire");

if(v){
let h=.6*v;
if(pl.health<pl.maxHealth)pl.health=Math.min(pl.maxHealth,pl.health+h);
else if(v>=5)pl.tempHP=Math.min(25,pl.tempHP+h)
}

let r=UL("chainreaction");

if(r&&(src!=="reaction"||r>=5)&&rx<26){
rx++;
boom(e.x,e.y,48+r*13,24+r*12,210,"#ff3c6f","reaction")
}
}

function de(e,d,k=0,a=0,col="#fff",src=""){
if(!e||e.dead)return;

let cm=src==="weapon"?critMul():1;
let actual=d*dmgMul()*cm;

if(cm>1){
for(let i=0;i<8;i++){
PT.push({
x:e.x,y:e.y,vx:(Math.random()-.5)*240,vy:(Math.random()-.5)*240,
radius:2+Math.random()*3,life:280,color:"#ffb45b",gravity:0
})
}
}

if(UL("damage")>=5&&e.health/e.maxHealth<.2){
kill(e,src);return
}

e.health-=actual;

if(k){
let resist=e.type==="mega"?.32:e.type==="tank"?.48:e.type==="big"?.68:1;
e.vx+=Math.cos(a)*k*2.5*resist;
e.vy+=Math.sin(a)*k*2.5*resist
}

hp(e.x,e.y,col);

if(e.health<=0)kill(e,src)
}

function boom(a,b,r,d,du=300,col="#c45cff",src=""){
EX.push({x:a,y:b,radius:0,maxRadius:r,life:du,duration:du,color:col});

for(const e of E){
if(e.dead)continue;
let q=Math.hypot(e.x-a,e.y-b);
if(q<r)de(e,d*(.4+(1-q/r)*.6),0,0,col,src)
}
}

function cb(a,w,o={}){
B.push({
x:o.x??pl.x,y:o.y??pl.y,
vx:Math.cos(a)*(o.speed??w.bulletSpeed),
vy:Math.sin(a)*(o.speed??w.bulletSpeed),
angle:a,
radius:o.radius??w.bulletSize,
damage:o.damage??w.damage,
color:o.color??w.color,
type:o.type??w.type,
visual:o.visual??w.visual,
pierce:(o.pierce??w.pierce??0)+UL("fmj"),
hitEnemies:new Set(),
ricochets:0,
explosionRadius:o.explosionRadius??w.explosionRadius??0,
explosionDamage:o.explosionDamage??w.explosionDamage??0,
homingStrength:o.homingStrength??w.homingStrength??0,
slowTime:w.slowTime||0,
knockback:w.knockback||0,
burnDamage:w.burnDamage||0,
burnTime:w.burnTime||0,
splits:w.splits||0,
splitSpread:w.splitSpread||0,
prismGen:o.prismGen??0,
life:o.life??(w.type==="singularity"?2200:3000)
})
}

function ricChance(){
let r=UL("ricochet");
return r===1?.15:r===2?.25:r===3?.35:r===4?.45:r>=5?.6:0
}

function ricMax(){
return UL("ricochet")>=5?2:UL("ricochet")>0?1:0
}

function eligibleRic(b){
return ["normal","plasma","railgun","frost","homing","shotgun","nova","explosive","prism"].includes(b.type)
}

function tryRicochet(b,e){
if(!UL("ricochet")||!eligibleRic(b))return false;
if(b.type==="prismShard"||b.type==="flame"||b.type==="singularity"||b.type==="arc")return false;
if(b.ricochets>=ricMax())return false;
if(Math.random()>ricChance())return false;

let q=fn(e,new Set(b.hitEnemies),1,180);
if(!q)return false;

b.ricochets++;

let mult=b.ricochets===1?.6:.35;
b.damage*=mult;

if(b.explosionDamage)b.explosionDamage*=mult;

let a=Math.atan2(q.y-e.y,q.x-e.x),s=Math.hypot(b.vx,b.vy);

b.x=e.x+Math.cos(a)*(e.radius+b.radius+3);
b.y=e.y+Math.sin(a)*(e.radius+b.radius+3);
b.vx=Math.cos(a)*s;
b.vy=Math.sin(a)*s;
b.angle=a;

return true
}

function chainVisual(a,b,col="#66ffff"){
L.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,life:145,color:col})
}

function electricalChain(start,damage,jumps,range,color,exclude=new Set(),forks=0){
let used=new Set(exclude);
used.add(start);

let fronts=[{e:start,d:damage}];
let total=0,cap=14;

while(fronts.length&&total<cap){
let f=fronts.shift(),cur=f.e;

for(let branch=0;branch<=forks&&total<cap;branch++){
let q=null,bd=1e9;

for(const e of E){
if(e.dead||used.has(e)||!ons(e))continue;
let dist=Math.hypot(e.x-cur.x,e.y-cur.y);
if(dist<range&&dist<bd){bd=dist;q=e}
}

if(!q)continue;

chainVisual(cur,q,color);
de(q,f.d,0,0,color);
used.add(q);
total++;

if(total<jumps)fronts.push({e:q,d:f.d*.88})
}
}
}

function plasmaConduction(e,baseDamage){
let cd=UL("conduction");
if(!cd)return;

let jumps=cd;
let range=125+cd*20;
let dmg=baseDamage*(.22+cd*.07);
let forks=cd>=5?1:0;

electricalChain(e,dmg,jumps,range,"#66ffff",new Set([e]),forks)
}

function lightningConduction(start,baseDamage){
let cd=UL("conduction");
if(!cd)return;

let extra=cd>=5?2:cd>=3?1:0;
let rangeBonus=cd*15;
let dmg=baseDamage*(.22+cd*.06);
let forks=cd>=5?1:cd>=3&&Math.random()<.35?1:0;

electricalChain(start,dmg,cd+extra,110+rangeBonus,"#9afcff",new Set([start]),forks)
}

function arcBeam(e,w,used=new Set()){
let cr=UL("chainreaction"),q=e,d=w.damage,f={x:pl.x,y:pl.y},h=new Set(used);
let chains=w.chains+cr*2,range=w.chainRange+cr*18;

for(let i=0;i<chains&&q;i++){
L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:150,color:w.color});
de(q,d,0,0,w.color,"weapon");

h.add(q);used.add(q);f=q;
d=i?d*.95:w.chainDamage;

let z=null,bd=1e9;

for(const p of E){
if(p.dead||h.has(p)||!ons(p))continue;
let u=Math.hypot(p.x-f.x,p.y-f.y);
if(u<range&&u<bd){bd=u;z=p}
}

q=z
}
}

function arcVolley(w){
let ml=UL("multishot");
let beams=Math.max(1,ml);
let used=new Set();

for(let i=0;i<beams;i++){
let q=fn(pl,used,1,w.range);
if(!q)break;
arcBeam(q,w,used)
}
}

function singularityActive(){return B.some(b=>b.type==="singularity")||BH.length}

function multishotPattern(a,w){
let m=UL("multishot");

switch(w.type){

case"normal":{
let n=1+m,spread=.105;
for(let i=0;i<n;i++)cb(a+(i-(n-1)/2)*spread,w);
break
}

case"plasma":{
let n=1+m,spread=.075;
for(let i=0;i<n;i++)cb(a+(i-(n-1)/2)*spread,w);
break
}

case"frost":{
let n=1+m,spread=.14;
for(let i=0;i<n;i++){
let off=(i-(n-1)/2)*spread;
if(m>=4)off*=.85;
cb(a+off,w)
}
break
}

case"railgun":{
let n=1+Math.ceil(m/2),spread=.075;
for(let i=0;i<n;i++){
let extra=i>0;
cb(a+(i-(n-1)/2)*spread,w,{damage:w.damage*(extra?.72:1)})
}
break
}

case"shotgun":{
let pellets=w.pellets+m*3;
let spread=w.spread+m*.035;
for(let i=0;i<pellets;i++)cb(a+(Math.random()-.5)*spread,w);
break
}

case"homing":{
let n=1+m;
let used=new Set();

for(let i=0;i<n;i++){
let q=fn(pl,used,1,w.range);

if(q){
used.add(q);
let aa=Math.atan2(q.y-pl.y,q.x-pl.x);
cb(aa,w)
}else cb(a+(i-(n-1)/2)*.12,w)
}
break
}

case"flame":{
let n=1+m;
let spread=.18+m*.08;

for(let i=0;i<n;i++){
let off=n===1?0:(i/(n-1)-.5)*spread;
cb(a+off+(Math.random()-.5)*.12,w,{
type:"flame",
life:900,
speed:w.bulletSpeed*(.85+Math.random()*.35),
radius:w.bulletSize+Math.random()*5
})
}
break
}

case"singularity":{
let n=1+Math.ceil(m/2);
let spread=.32+m*.11;

for(let i=0;i<n;i++){
let off=n===1?0:(i/(n-1)-.5)*spread;
cb(a+off,w)
}
break
}

case"nova":{
cb(a,w);

let sides=w.sideShots+m;

for(let i=1;i<=sides;i++){
let off=.13+.12*i;
cb(a-off,w,{visual:"lanceSide",damage:w.damage*.78});
cb(a+off,w,{visual:"lanceSide",damage:w.damage*.78})
}
break
}

case"explosive":{
let n=1+m,spread=.13;

for(let i=0;i<n;i++){
let extra=i!==Math.floor((n-1)/2);
cb(a+(i-(n-1)/2)*spread,w,{
damage:w.damage*(extra?.72:1),
explosionDamage:w.explosionDamage*(extra?.7:1)
})
}
break
}

case"arc":{
arcVolley(w);
break
}

case"prism":{
let n=1+m,spread=.12;
for(let i=0;i<n;i++)cb(a+(i-(n-1)/2)*spread,w);
break
}

default:cb(a,w)
}
}

function volley(a,w,free=0){
multishotPattern(a,w);

if(!free&&UL("haste")>=5&&++shotN%10===0){
multishotPattern(a,w)
}
}

function shoot(now){
let w=gw();

if(w.type==="singularity"&&singularityActive())return;

let q=fn(pl,new Set(),1,w.range||Infinity);

if(!q||now-ls<fireRate(w))return;

ls=now;
volley(Math.atan2(q.y-pl.y,q.x-pl.x),w)
}

function prismBonus(){
let p=UL("prismup");
return p===0?0:p===1?2:p===2?4:p===3?6:p===4?8:12
}

function prism(b,e){
if(b.type!=="prism"&&b.type!=="prismShard")return;

let cr=UL("chainreaction"),maxGen=Math.min(5,cr),gen=b.prismGen||0;

if((b.type==="prismShard"&&gen>=maxGen)||prismBudget>=120)return;

let cols=["#ff4fd8","#72f7ff","#fff16e","#b779ff","#7dff9b","#ff8b4a","#6ca8ff","#ff6f91"];
let base=b.angle;

let n=gen===0
?b.splits+prismBonus()
:Math.max(2,6-gen+Math.floor(UL("prismup")/2));

n=Math.min(n,120-prismBudget);
prismBudget+=n;

let spread=gen===0
?b.splitSpread+(UL("prismup")>=5?.55:0)
:1.05+gen*.12;

for(let i=0;i<n;i++){
let f=n===1?0:i/(n-1)-.5;
let a=base+f*spread+(Math.random()-.5)*.11;

cb(a,G.prism,{
x:e.x+Math.cos(base)*10,
y:e.y+Math.sin(base)*10,
damage:b.damage*(gen===0?.48:.6),
type:"prismShard",
visual:"prismShard",
color:cols[(i+gen)%cols.length],
speed:1030+Math.random()*220,
radius:Math.max(2.5,4-gen*.2),
life:650,
prismGen:gen+1
})
}
}

function singularity(a,b){
let w=G.singularity;

BH.push({
x:a,y:b,life:w.blackHoleTime,duration:w.blackHoleTime,
pullRadius:w.pullRadius,pullStrength:w.pullStrength,
blastRadius:w.blastRadius,blastDamage:w.blastDamage,
color:w.color,pt:0
})
}

function singularityBoom(q){
boom(q.x,q.y,q.blastRadius,q.blastDamage,400,"#b26cff","weapon");

for(let i=0;i<45;i++){
let A=Math.random()*Math.PI*2,S=150+Math.random()*500;
PT.push({
x:q.x,y:q.y,
vx:Math.cos(A)*S,vy:Math.sin(A)*S,
radius:2+Math.random()*4,
life:300+Math.random()*350,
color:Math.random()<.5?"#d7b8ff":"#7b33ff",
gravity:0
})
}
}

function dash(){
if(!run||choosing||dcd>0||dtm>0)return;

let a=jactive?jx:((K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0));
let b=jactive?jy:((K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0));

if(!a&&!b){a=pl.lastDX;b=pl.lastDY}

let d=Math.hypot(a,b)||1;

pl.dvx=a/d*900;
pl.dvy=b/d*900;
dtm=.225;
dcd=1.05;

if(UL("speed")>=5)boost=1.5
}

function hurt(z){
if(inv>0||ghost>0)return;

if(pl.shield>0){
let a=Math.min(pl.shield,z);
pl.shield-=a;z-=a
}

if(pl.tempHP>0){
let a=Math.min(pl.tempHP,z);
pl.tempHP-=a;z-=a
}

pl.health-=z;

if(pl.health<=0&&UL("health")>=5&&!pl.secondWind){
pl.secondWind=1;
pl.health=pl.maxHealth*.5;
inv=2
}else if(pl.health<=0){
pl.health=0;
end()
}
}

function up(dt){
if(dcd>0)dcd-=dt;
if(boost>0)boost-=dt;
if(inv>0)inv-=dt;
if(berserk>0)berserk-=dt;
if(surge>0)surge-=dt;
if(speedBoost>0)speedBoost-=dt;
if(ghost>0)ghost-=dt;
if(freeze>0)freeze-=dt;
if(deadeye>0)deadeye-=dt;

if(weaponTime>0){
weaponTime-=dt*1000;

if(weaponTime<=0){
pl.weaponKey="pistol";
weaponTime=0
}
}

if(dtm>0){
dtm-=dt;
pl.x+=pl.dvx*dt;
pl.y+=pl.dvy*dt
}else{
let a=jactive?jx:((K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0));
let b=jactive?jy:((K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0));
let d=Math.hypot(a,b);

let s=pl.speed*
(1+UL("speed")*.05)*
(boost>0?1.5:1)*
(berserk>0?1.35:1)*
(speedBoost>0?1.65:1);

if(d>.08){
let str=Math.min(1,d);
a/=d;b/=d;
pl.lastDX=a;pl.lastDY=b;
pl.x+=a*s*str*dt;
pl.y+=b*s*str*dt
}
}

pl.x=Math.max(pl.radius,Math.min(W-pl.radius,pl.x));
pl.y=Math.max(pl.radius,Math.min(H-pl.radius,pl.y))
}

function ue(dt){
for(let i=E.length-1;i>=0;i--){
let e=E[i];

if(e.dead){E.splice(i,1);continue}

let ms=e.baseMaxSpeed;

if(freeze>0)ms=0;
else if(e.slowTimer>0){
e.slowTimer-=dt*1000;
ms*=.5
}

if(e.burnTime>0){
e.burnTime-=dt*1000;
e.burnTick-=dt*1000;

if(e.burnTick<=0){
e.burnTick=250;
de(e,e.burnDamage,0,0,"#ff5a1f","weapon")
}
}

if(e.dead)continue;

let dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy)||1;

if(ms>0){
let vx=dx/d*ms,vy=dy/d*ms;
let sx=vx-e.vx,sy=vy-e.vy,sl=Math.hypot(sx,sy),mx=e.steering*dt;

if(sl>mx){
sx=sx/sl*mx;
sy=sy/sl*mx
}

e.vx+=sx;
e.vy+=sy;

let v=Math.hypot(e.vx,e.vy);

if(v>ms*1.08){
e.vx=e.vx/v*ms*1.08;
e.vy=e.vy/v*ms*1.08
}
}else{
e.vx*=Math.pow(.03,dt);
e.vy*=Math.pow(.03,dt)
}

e.x+=e.vx*dt;
e.y+=e.vy*dt;
e.hitCooldown-=dt*1000;

if(dtm<=0&&ghost<=0&&hit(pl,e)&&e.hitCooldown<=0){
hurt(25);
e.hitCooldown=650
}
}
}

function projectileWall(b){
if(b.x+b.radius<0||b.x-b.radius>W||b.y+b.radius<0||b.y-b.radius>H)return true;
return false
}

function ub(dt){
for(let i=B.length-1;i>=0;i--){
let b=B[i];
b.life-=dt*1000;

if(b.type==="homing"){
let q=fn(b,b.hitEnemies,1,500);

if(q){
let a=Math.atan2(q.y-b.y,q.x-b.x);
let z=Math.atan2(Math.sin(a-b.angle),Math.cos(a-b.angle));

b.angle+=z*b.homingStrength*dt;

let s=Math.hypot(b.vx,b.vy);

b.vx=Math.cos(b.angle)*s;
b.vy=Math.sin(b.angle)*s
}
}

b.x+=b.vx*dt;
b.y+=b.vy*dt;

if(projectileWall(b)){
if(b.type==="singularity"){
singularity(
Math.max(20,Math.min(W-20,b.x)),
Math.max(20,Math.min(H-20,b.y))
)
}

B.splice(i,1);
continue
}

if(b.life<=0){
if(b.type==="singularity")singularity(b.x,b.y);
B.splice(i,1);
continue
}

let rm=0;

for(const e of E){
if(e.dead||b.hitEnemies.has(e)||!hit(b,e))continue;

b.hitEnemies.add(e);

if(b.type==="singularity"){
singularity(b.x,b.y);
rm=1;
break
}

de(e,b.damage,b.knockback,b.angle,b.color,"weapon");

if(b.type==="plasma"&&!e.dead){
plasmaConduction(e,b.damage*dmgMul())
}

if(b.type==="frost"){
e.slowTimer=b.slowTime
}

if(b.type==="flame"&&!e.dead){
e.burnTime=Math.max(e.burnTime,b.burnTime);
e.burnDamage=Math.max(e.burnDamage,b.burnDamage*dmgMul());
e.burnTick=0
}

prism(b,e);

if(b.type==="explosive"){
boom(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color,"weapon");

if(tryRicochet(b,e)){
rm=0;
break
}

rm=1;
break
}

if(b.pierce>0){
b.pierce--;

if(UL("fmj")>=5)b.damage*=1.15;

continue
}

if(tryRicochet(b,e)){
rm=0;
break
}

rm=1;
break
}

if(rm)B.splice(i,1)
}
}

function ubh(dt){
for(let i=BH.length-1;i>=0;i--){
let q=BH[i];
q.life-=dt*1000;
q.pt-=dt*1000;

let p=1-q.life/q.duration;

for(const e of E){
if(e.dead)continue;

let dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy);

if(d>2&&d<q.pullRadius){
let f=q.pullStrength*(1-d/q.pullRadius)*(1+p)*dt;
e.vx+=dx/d*f;
e.vy+=dy/d*f
}
}

if(q.pt<=0){
q.pt=35;

for(let z=0;z<4;z++){
let A=Math.random()*Math.PI*2,R=80+Math.random()*q.pullRadius*.75;

PT.push({
x:q.x+Math.cos(A)*R,
y:q.y+Math.sin(A)*R,
vx:-Math.cos(A)*(180+Math.random()*240),
vy:-Math.sin(A)*(180+Math.random()*240),
radius:1+Math.random()*3,
life:350,
color:"#b788ff",
gravity:0
})
}
}

if(q.life<=0){
singularityBoom(q);
BH.splice(i,1)
}
}
}

function us(dt){
let n=UL("solar");
if(!n)return;

orb+=dt*4.2;

let count=Math.min(5,n+1);
let r=n>=5?82:70+n*2;
let damage=16+n*6;
let kb=6+n*2.5;

for(let i=0;i<count;i++){
let a=orb+Math.PI*2/count*i;

let q={
x:pl.x+Math.cos(a)*r,
y:pl.y+Math.sin(a)*r,
radius:12
};

for(const e of E){
if(e.dead||!hit(q,e)||performance.now()-e.bladeHit<=220)continue;

e.bladeHit=performance.now();

let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;
let res=e.type==="mega"?.25:e.type==="tank"?.4:e.type==="big"?.65:1;

e.vx+=dx/d*kb*res;
e.vy+=dy/d*kb*res;

de(e,damage,0,0,"#ffda44","solar")
}
}
}

function ul(dt){
let s=UL("lightning");
if(!s)return;

lgt+=dt*1000;

let rate=1800-s*180;

if(lgt<rate)return;

lgt=0;

let starts=s>=5?3:1;

for(let j=0;j<starts;j++){
let candidates=E.filter(e=>!e.dead&&ons(e));
if(!candidates.length)break;

let q=candidates[Math.floor(Math.random()*candidates.length)];
let d=35+s*12;

L.push({
x1:q.x+(Math.random()-.5)*60,
y1:-20,
x2:q.x,
y2:q.y,
life:180,
color:"#68f7ff"
});

de(q,d,0,0,"#68f7ff");

electricalChain(
q,
d*.72,
1+s,
140+s*20,
"#68f7ff",
new Set([q]),
0
);

lightningConduction(q,d)
}
}

function meteorTarget(excluded=new Set()){
let priorities=["mega","tank","big"];

for(const ty of priorities){
let a=E.filter(e=>!e.dead&&ons(e)&&e.type===ty&&!excluded.has(e));
if(a.length){
a.sort((a,b)=>b.health-a.health);
return a[0]
}
}

let a=E.filter(e=>!e.dead&&ons(e)&&!excluded.has(e));
a.sort((a,b)=>b.health-a.health);

return a[0]||null
}

function meteorStats(n){
return{
r:n===1?45:n===2?60:n===3?80:n===4?105:145,
damage:65+n*45,
delay:n>=5?850:700,
knock:n>=4?45+n*15:0
}
}

function spawnMeteor(target,n){
if(!target)return;

let s=meteorStats(n);
let lead=.35+n*.045;

let tx=target.x+target.vx*lead;
let ty=target.y+target.vy*lead;

tx=Math.max(s.r,Math.min(W-s.r,tx));
ty=Math.max(s.r,Math.min(H-s.r,ty));

M.push({
x:tx,y:ty,
life:s.delay,
duration:s.delay,
radius:s.r,
damage:s.damage,
knock:s.knock,
targetType:target.type,
mega:n>=5
})
}

function um(dt){
let n=UL("meteors");
if(!n)return;

met+=dt*1000;

let rate=Math.max(700,2300-n*260);

if(met<rate)return;

met=0;

let count=n>=5?2:1;
let used=new Set();

for(let i=0;i<count;i++){
let q=meteorTarget(used);
if(!q)break;
used.add(q);
spawnMeteor(q,n)
}
}

function umo(dt){
for(let i=M.length-1;i>=0;i--){
let m=M[i];
m.life-=dt*1000;

if(m.life<=0){
EX.push({
x:m.x,y:m.y,radius:0,maxRadius:m.radius,
life:400,duration:400,
color:m.mega?"#fff2a8":"#ff6b35"
});

for(const e of E){
if(e.dead)continue;

let dx=e.x-m.x,dy=e.y-m.y,d=Math.hypot(dx,dy)||1;

if(d>m.radius)continue;

let f=1-d/m.radius;

de(e,m.damage*(.45+.55*f),0,0,m.mega?"#fff2a8":"#ff6b35");

if(m.knock){
let resist=e.type==="mega"?.25:e.type==="tank"?.4:e.type==="big"?.65:1;
e.vx+=dx/d*m.knock*f*resist;
e.vy+=dy/d*m.knock*f*resist
}
}

for(let z=0;z<Math.min(60,20+m.radius/3);z++){
let A=Math.random()*Math.PI*2,S=100+Math.random()*350;

PT.push({
x:m.x,y:m.y,
vx:Math.cos(A)*S,
vy:Math.sin(A)*S,
radius:2+Math.random()*5,
life:350+Math.random()*300,
color:m.mega?"#fff2a8":"#ff6b35",
gravity:100
})
}

M.splice(i,1)
}
}
}

function shockwave(){
EX.push({
x:pl.x,y:pl.y,radius:0,maxRadius:260,
life:450,duration:450,color:"#fff07a"
});

for(const e of E){
if(e.dead)continue;

let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;

if(d>260)continue;

let resist=e.type==="mega"?.35:e.type==="tank"?.5:e.type==="big"?.7:1;
let f=1-d/260;

e.vx+=dx/d*310*f*resist;
e.vy+=dy/d*310*f*resist;

de(e,45*f,0,0,"#fff07a")
}
}

function pull(q,dt,r,s){
let dx=pl.x-q.x,dy=pl.y-q.y,d=Math.hypot(dx,dy);

if(d>1&&d<r){
q.x+=dx/d*s*dt;
q.y+=dy/d*s*dt
}
}

function upp(dt){
for(let i=WP.length-1;i>=0;i--){
let q=WP[i];
q.life-=dt*1000;

if(q.life<=0){
WP.splice(i,1);
continue
}

if(hit(pl,q)){
pl.weaponKey=q.weaponKey;
weaponTime=30000;
ls=0;
WP.splice(i,1)
}
}

for(let i=P.length-1;i>=0;i--){
let q=P[i];
q.life-=dt*1000;
q.pulse+=dt*5;

if(q.life<=0){
P.splice(i,1);
continue
}

if(hit(pl,q)){
if(q.key==="heal")pl.health=pl.maxHealth;
else if(q.key==="shield")pl.shield=Math.min(100,pl.shield+50);
else if(q.key==="freeze")freeze=3;
else if(q.key==="shockwave")shockwave();
else if(q.key==="speedboost")speedBoost=8;
else if(q.key==="deadeye")deadeye=10;
else if(q.key==="ghost")ghost=5;
else if(q.key==="berserk")berserk=14;
else if(q.key==="surge")surge=6;
else if(q.key==="nuke"){
for(const e of E)if(!e.dead&&ons(e))kill(e);
for(const z of C)z.nukeVacuum=1
}

P.splice(i,1)
}
}
}

function magnetStats(){
let m=UL("magnet");

return m===0?{r:88,s:455}:
m===1?{r:150,s:480}:
m===2?{r:210,s:510}:
m===3?{r:270,s:545}:
m===4?{r:340,s:585}:
{r:440,s:760}
}

function uc(dt){
let ms=magnetStats();

for(let i=C.length-1;i>=0;i--){
let q=C[i];

q.life-=dt*1000;
q.x+=q.vx*dt;
q.y+=q.vy*dt;

q.vx*=Math.pow(.025,dt);
q.vy*=Math.pow(.025,dt);

if(!q.nukeVacuum&&q.cx!==undefined){
let dx=q.cx-q.x,dy=q.cy-q.y,d=Math.hypot(dx,dy);

if(d>14){
let s=Math.min(72,(d-14)*1.7);
q.x+=dx/d*s*dt;
q.y+=dy/d*s*dt
}
}

if(q.nukeVacuum)pull(q,dt,99999,1150);
else pull(q,dt,ms.r,ms.s);

if(q.life<=0)C.splice(i,1);
else if(hit(pl,q)){
gain(q.value);
C.splice(i,1)
}
}
}

function ufx(dt){
for(let i=PT.length-1;i>=0;i--){
let p=PT[i];

p.life-=dt*1000;
p.vy+=(p.gravity||0)*dt;
p.x+=p.vx*dt;
p.y+=p.vy*dt;

if(p.life<=0)PT.splice(i,1)
}

for(let i=EX.length-1;i>=0;i--){
let e=EX[i];

e.life-=dt*1000;
e.radius=e.maxRadius*Math.max(0,Math.min(1,1-e.life/e.duration));

if(e.life<=0)EX.splice(i,1)
}

for(let i=L.length-1;i>=0;i--){
L[i].life-=dt*1000;
if(L[i].life<=0)L.splice(i,1)
}
}

function bg(){
x.fillStyle="#111820";
x.fillRect(0,0,W,H);

x.strokeStyle="#ffffff08";

for(let a=0;a<W;a+=50){
x.beginPath();x.moveTo(a,0);x.lineTo(a,H);x.stroke()
}

for(let b=0;b<H;b+=50){
x.beginPath();x.moveTo(0,b);x.lineTo(W,b);x.stroke()
}
}

function dp(){
if(surge>0){
x.save();
x.shadowBlur=30;x.shadowColor="#ffd700";
x.strokeStyle="#ffd700";x.lineWidth=4;
x.beginPath();
x.arc(pl.x,pl.y,pl.radius+17+Math.sin(performance.now()/70)*4,0,Math.PI*2);
x.stroke();
x.restore()
}

if(ghost>0){
x.save();
x.globalAlpha=.35;
x.shadowBlur=25;x.shadowColor="#d8deff";
x.beginPath();x.arc(pl.x,pl.y,pl.radius+10,0,Math.PI*2);
x.fillStyle="#d8deff";x.fill();
x.restore()
}

if(deadeye>0){
x.save();
x.strokeStyle="#ff934d";
x.lineWidth=2;
x.beginPath();x.arc(pl.x,pl.y,pl.radius+13,0,Math.PI*2);
x.stroke();
x.restore()
}

if(pl.shield>0){
x.beginPath();
x.arc(pl.x,pl.y,pl.radius+8,0,Math.PI*2);
x.strokeStyle="#55cfff";
x.lineWidth=4;
x.stroke()
}

x.beginPath();
x.arc(pl.x,pl.y,pl.radius,0,Math.PI*2);
x.fillStyle=inv>0?"#fff":berserk>0?"#ff4b32":pl.color;
x.fill();
x.strokeStyle="#fff";
x.lineWidth=3;
x.stroke()
}

function dee(){
for(const e of E){
let s=e.radius*2.65,z=ET[e.type];

if(z.outline){
x.save();
x.strokeStyle=z.outline;
x.lineWidth=e.type==="mega"?7:e.type==="tank"?6:3;
x.shadowBlur=12;
x.shadowColor=z.outline;
x.beginPath();
x.arc(e.x,e.y,e.radius+7,0,Math.PI*2);
x.stroke();
x.restore()
}

if(freeze>0){
x.save();
x.globalAlpha=.35;
x.fillStyle="#78dcff";
x.beginPath();
x.arc(e.x,e.y,e.radius+3,0,Math.PI*2);
x.fill();
x.restore()
}

if(hi.complete&&hi.naturalWidth)x.drawImage(hi,e.x-s/2,e.y-s/2,s,s);
else{
x.fillStyle=z.outline||"#888";
x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.fill()
}

if(e.elite||e.health<e.maxHealth){
let w=e.radius*1.8;

x.fillStyle="#250000";
x.fillRect(e.x-w/2,e.y-e.radius-10,w,5);

x.fillStyle=e.type==="mega"?"#ff4dff":e.type==="tank"?"#ff3d3d":"#f44";
x.fillRect(e.x-w/2,e.y-e.radius-10,w*Math.max(0,e.health/e.maxHealth),5)
}
}
}

function dc(){
for(const q of C){
x.save();
x.shadowBlur=q.nukeVacuum?16:7;
x.shadowColor="#ffd700";
x.fillStyle="#ffd700";
x.beginPath();
x.arc(q.x,q.y,q.radius,0,Math.PI*2);
x.fill();
x.restore()
}
}

function db(){
for(const b of B){
x.save();
x.shadowBlur=16;
x.shadowColor=b.color;

if(b.visual==="tracer"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle="#fff";
x.fillRect(-12,-2,24,4)
}

else if(b.visual==="plasma"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle=b.color;
x.fillRect(-16,-3,32,6);
x.globalAlpha=.35;
x.fillRect(-24,-1,48,2)
}

else if(b.visual==="rail"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle="#fff";
x.fillRect(-36,-2,72,4);
x.globalAlpha=.4;
x.fillStyle=b.color;
x.fillRect(-48,-5,96,10)
}

else if(b.visual==="frost"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle=b.color;
x.beginPath();
x.moveTo(12,0);
x.lineTo(2,-7);
x.lineTo(-3,-3);
x.lineTo(-10,-8);
x.lineTo(-6,0);
x.lineTo(-10,8);
x.lineTo(-3,3);
x.lineTo(2,7);
x.closePath();
x.fill()
}

else if(b.visual==="spark"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle="#fff2a3";
x.beginPath();
x.moveTo(10,0);
x.lineTo(-5,-4);
x.lineTo(-2,0);
x.lineTo(-5,4);
x.fill()
}

else if(b.visual==="comet"){
x.fillStyle=b.color;
x.beginPath();
x.arc(b.x,b.y,b.radius,0,Math.PI*2);
x.fill();

x.globalAlpha=.35;

for(let i=1;i<=3;i++){
x.beginPath();
x.arc(
b.x-b.vx*.008*i,
b.y-b.vy*.008*i,
b.radius*(1-i*.18),
0,Math.PI*2
);
x.fill()
}
}

else if(b.visual==="flame"){
let q=Math.max(0,b.life/900);

x.globalAlpha=.55+.4*q;
x.beginPath();
x.arc(b.x,b.y,b.radius*(1.4+(1-q)*.9),0,Math.PI*2);

x.fillStyle=q>.65?"#fff36e":q>.3?"#ff8a00":"#df2900";
x.fill()
}

else if(b.visual==="singularity"){
x.beginPath();
x.arc(b.x,b.y,b.radius+3,0,Math.PI*2);
x.fillStyle="#020005";
x.fill();

x.strokeStyle="#b98cff";
x.lineWidth=3;
x.stroke();

x.globalAlpha=.3;
x.beginPath();
x.arc(b.x,b.y,b.radius+9+Math.sin(performance.now()/70)*3,0,Math.PI*2);
x.stroke()
}

else if(b.visual==="void"){
x.beginPath();
x.arc(b.x,b.y,b.radius,0,Math.PI*2);
x.fillStyle="#16002c";
x.fill();

x.lineWidth=4;
x.strokeStyle="#a765ff";
x.stroke();

x.globalAlpha=.25;
x.beginPath();
x.arc(b.x,b.y,b.radius+8,0,Math.PI*2);
x.stroke()
}

else if(b.visual==="lance"||b.visual==="lanceSide"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle=b.color;
x.beginPath();
x.moveTo(18,0);
x.lineTo(-9,-4);
x.lineTo(-5,0);
x.lineTo(-9,4);
x.fill()
}

else if(b.visual==="prism"||b.visual==="prismShard"){
x.translate(b.x,b.y);x.rotate(b.angle);
x.fillStyle=b.color;
x.beginPath();
x.moveTo(14,0);
x.lineTo(-8,-6);
x.lineTo(-5,0);
x.lineTo(-8,6);
x.closePath();
x.fill();

x.globalAlpha=.35;
x.strokeStyle="#fff";
x.stroke()
}

else{
x.fillStyle=b.color;
x.beginPath();
x.arc(b.x,b.y,b.radius,0,Math.PI*2);
x.fill()
}

x.restore()
}
}

function ds(){
let n=UL("solar");
if(!n)return;

let count=Math.min(5,n+1);
let r=n>=5?82:70+n*2;

for(let i=0;i<count;i++){
let a=orb+Math.PI*2/count*i;
let A=pl.x+Math.cos(a)*r;
let Bb=pl.y+Math.sin(a)*r;

x.save();
x.translate(A,Bb);
x.rotate(a+.35);
x.fillStyle="#fff7a0";
x.shadowBlur=18;
x.shadowColor="#ffda44";

x.beginPath();
x.moveTo(0,-18);
x.lineTo(6,7);
x.lineTo(0,16);
x.lineTo(-6,7);
x.closePath();
x.fill();

x.restore()
}
}

function dwp(){
for(const p of WP){
let w=G[p.weaponKey];

x.save();
x.shadowBlur=18;
x.shadowColor=w.color;

x.beginPath();
x.arc(p.x,p.y,p.radius,0,Math.PI*2);
x.fillStyle="#111";
x.fill();

x.strokeStyle=w.color;
x.lineWidth=4;
x.stroke();

x.fillStyle="#fff";
x.font="bold 8px Arial";
x.textAlign="center";
x.fillText(w.name.split(" ")[0],p.x,p.y+3);

x.restore()
}
}

function dpu(){
for(const p of P){
let u=PU[p.key],q=1+Math.sin(p.pulse)*.12;

x.save();

x.shadowBlur=["surge","nuke","berserk"].includes(p.key)?30:16;
x.shadowColor=u.color;

x.beginPath();
x.arc(p.x,p.y,p.radius*q,0,Math.PI*2);
x.fillStyle=u.color;
x.fill();

x.globalAlpha=1;
x.fillStyle="#111";
x.font="bold 8px Arial";
x.textAlign="center";
x.fillText(u.name,p.x,p.y+3);

x.restore()
}
}

function dmet(){
for(const m of M){
let q=m.life/m.duration;

x.save();

x.shadowBlur=m.mega?32:18;
x.shadowColor=m.mega?"#fff2a8":"#ff6b35";

x.strokeStyle=m.mega?"#fff2a8":"#ff6b35";
x.lineWidth=m.mega?8:4;

x.beginPath();
x.arc(m.x,m.y,m.radius*(.7+.3*(1-q)),0,Math.PI*2);
x.stroke();

let meteorSize=14+(1-q)*m.radius*.35;

x.fillStyle=m.mega?"#fff2a8":"#ff6b35";
x.beginPath();
x.arc(
m.x-70*q,
m.y-130*q,
meteorSize,
0,
Math.PI*2
);
x.fill();

x.beginPath();
x.moveTo(m.x-70*q,m.y-130*q);
x.lineTo(m.x,m.y);
x.lineWidth=m.mega?16:9;
x.globalAlpha=.6;
x.stroke();

x.restore()
}
}

function dbh(){
for(const q of BH){
let p=1-q.life/q.duration;

x.save();
x.shadowBlur=35;
x.shadowColor="#6d3cff";

x.beginPath();
x.arc(q.x,q.y,18+15*p,0,Math.PI*2);
x.fillStyle="#020003";
x.fill();

x.strokeStyle="#b98cff";
x.lineWidth=4;
x.stroke();

x.globalAlpha=.16;
x.beginPath();
x.arc(q.x,q.y,q.pullRadius,0,Math.PI*2);
x.stroke();

x.restore()
}
}

function dfx(){
for(const p of PT){
x.save();
x.globalAlpha=Math.min(1,p.life/250);
x.beginPath();
x.arc(p.x,p.y,p.radius,0,Math.PI*2);
x.fillStyle=p.color;
x.fill();
x.restore()
}

for(const l of L){
x.save();
x.strokeStyle=l.color;
x.shadowBlur=14;
x.shadowColor=l.color;
x.lineWidth=4;

x.beginPath();
x.moveTo(l.x1,l.y1);

for(let i=1;i<6;i++){
let q=i/6;
x.lineTo(
l.x1+(l.x2-l.x1)*q+(Math.random()-.5)*14,
l.y1+(l.y2-l.y1)*q+(Math.random()-.5)*14
)
}

x.lineTo(l.x2,l.y2);
x.stroke();
x.restore()
}

for(const e of EX){
x.save();
x.globalAlpha=Math.max(0,e.life/e.duration);
x.strokeStyle=e.color;
x.lineWidth=8;
x.beginPath();
x.arc(e.x,e.y,e.radius,0,Math.PI*2);
x.stroke();
x.restore()
}
}

function hud(){
ht.textContent=`HP ${Math.ceil(pl.health)}${pl.tempHP?` +${Math.ceil(pl.tempHP)}`:""}`;

wt.textContent=pl.weaponKey==="pistol"
?"Pistol"
:`${gw().name} ${Math.ceil(weaponTime/1000)}s`;

st.textContent=`Score ${score}`;
lvT.textContent=`LV ${lv}`;

xpB.style.width=`${Math.min(100,xp/need()*100)}%`;

if(pl.shield>0){
shHUD.classList.remove("hidden");
shT.textContent=Math.ceil(pl.shield)
}else shHUD.classList.add("hidden")
}

function end(){
run=0;
fs.textContent=`Score: ${score} | Level: ${lv} | Kills: ${kills}`;
go.classList.remove("hidden")
}

function reset(){
E=[];B=[];WP=[];P=[];C=[];EX=[];L=[];PT=[];M=[];BH=[];

score=kills=xp=pending=0;
lv=1;t=0;

weaponTime=badW=berserk=surge=speedBoost=ghost=freeze=deadeye=boost=inv=0;

pl.x=W/2;
pl.y=H/2;
pl.health=pl.maxHealth=25;
pl.tempHP=pl.shield=0;
pl.weaponKey="pistol";
pl.secondWind=0;

for(const k in UP)UP[k]=0;

ls=est=wst=pst=lgt=met=orb=dtm=dcd=0;

run=1;
choosing=0;
jactive=0;
jx=jy=0;

jb.style.display="none";
go.classList.add("hidden");
lscr.classList.add("hidden");

sw();
lt=performance.now()
}

rb.onclick=reset;

function loop(n){
let d=Math.min((n-lt)/1000,.05);
lt=n;

bg();

if(run){
rx=0;
prismBudget=0;

t+=d;
est+=d*1000;
wst+=d*1000;
pst+=d*1000;

let er=Math.max(190,700-lv*13-t*.18);
let ec=lv>=26?3:lv>=9?2:1;

if(est>=er){
est=0;
for(let i=0;i<ec;i++)se()
}

if(wst>=15000){
wst=0;
sw()
}

let pr=Math.max(9000,16000-lv*85);

if(pst>=pr){
pst=0;
sp()
}

up(d);
ue(d);
ub(d);
ubh(d);
us(d);
ul(d);
um(d);
umo(d);
upp(d);
uc(d);
ufx(d);
shoot(n);
hud()
}

dwp();
dpu();
dc();
dee();
db();
ds();
dmet();
dbh();
dp();
dfx();

requestAnimationFrame(loop)
}

rs();
pl.x=W/2;
pl.y=H/2;
sw();
hud();
lt=performance.now();
requestAnimationFrame(loop);
