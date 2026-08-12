const c=document.getElementById("gameCanvas"),x=c.getContext("2d"),ht=document.getElementById("healthText"),wt=document.getElementById("weaponText"),st=document.getElementById("scoreText"),lvT=document.getElementById("levelText"),xpB=document.getElementById("xpBar"),shHUD=document.getElementById("shieldHUD"),shT=document.getElementById("shieldText"),lscr=document.getElementById("levelScreen"),cards=document.getElementById("upgradeCards"),go=document.getElementById("gameOverScreen"),fs=document.getElementById("finalScore"),rb=document.getElementById("restartButton"),dbtn=document.getElementById("dashButton");
let W=0,H=0,D=1,run=1,score=0,kills=0,lv=1,xp=0,pending=0,choosing=0,choiceIndex=0,lt=0,ls=0,t=0,est=0,wst=0,pst=0,lgt=0,met=0,megaMet=0,orb=0,dtm=0,dcd=0,boost=0,inv=0,berserk=0,surge=0,weaponTime=0,pa=0,px=0,py=0,badW=0,shotN=0,rx=0,prismBudget=0;
let E=[],B=[],WP=[],P=[],C=[],EX=[],L=[],PT=[],M=[],BH=[];const K={},MAXC=145,hi=new Image();hi.src="hippo.png";
const pl={x:0,y:0,radius:18,hitRadius:10,speed:295,health:150,maxHealth:150,tempHP:0,shield:0,color:"#55ccff",weaponKey:"pistol",lastDX:1,lastDY:0,dvx:0,dvy:0,secondWind:0};

const UP={fmj:0,multishot:0,ricochet:0,lightning:0,meteors:0,chainreaction:0,vampire:0,haste:0,damage:0,speed:0,health:0,magnet:0,solar:0};
const UD={
fmj:{n:"FMJ",t:"WEAPON MOD",r:"uncommon",d:"+1 projectile penetration per level.",e:"AP ROUNDS: each penetrated hippo gives the projectile +15% damage."},
multishot:{n:"MULTISHOT",t:"WEAPON MOD",r:"rare",d:"+1 extra projectile per level.",e:"MIRROR SHOT: every volley also fires backward."},
ricochet:{n:"RICOCHET",t:"WEAPON MOD",r:"rare",d:"+1 enemy or wall bounce per level.",e:"PINBALL: wall bounces no longer consume ricochet charges."},
haste:{n:"HASTE",t:"WEAPON MOD",r:"uncommon",d:"+10% fire rate per level.",e:"OVERCLOCK: every 10th volley duplicates instantly."},
damage:{n:"DAMAGE",t:"WEAPON MOD",r:"uncommon",d:"+15% damage per level.",e:"EXECUTIONER: hits kill enemies already below 20% HP."},
vampire:{n:"VAMPIRE",t:"PASSIVE",r:"rare",d:"Kills restore increasing amounts of HP.",e:"BLOODLUST: overhealing becomes temporary HP."},
speed:{n:"SPEED",t:"PASSIVE",r:"common",d:"+5% movement speed per level.",e:"AFTERIMAGE: dashing grants +50% speed for 1.5 seconds."},
health:{n:"HEALTH",t:"PASSIVE",r:"common",d:"+25 max HP and immediately heal 25.",e:"SECOND WIND: survive lethal damage once at 50% HP with 2s invulnerability."},
magnet:{n:"MAGNET",t:"PASSIVE",r:"uncommon",d:"Increases XP attraction range and pull strength.",e:"GRAVITY WELL: massive XP attraction radius with very strong pull."},
lightning:{n:"LIGHTNING",t:"ABILITY",r:"epic",d:"Automatic lightning. Levels improve damage, chaining and frequency.",e:"THUNDERSTORM: every lightning event begins 3 separate strikes."},
meteors:{n:"METEORS",t:"ABILITY",r:"epic",d:"Random meteor bombardment. Levels improve frequency, damage and radius.",e:"EXTINCTION: giant meteors periodically target the densest hippo cluster."},
chainreaction:{n:"CHAIN REACTION",t:"ABILITY",r:"epic",d:"Hippos explode when killed. Also improves Arc and Prism chaining.",e:"CRITICAL MASS: reaction kills explode again and Arc/Prism reach maximum chaining."},
solar:{n:"SOLAR BLADES",t:"ABILITY",r:"legendary",d:"+1 orbiting blade per level. Blades damage and knock hippos away.",e:"SOLAR GUARD: 5 stronger blades with increased knockback and orbit radius."}
};

const G={
pistol:{name:"Pistol",type:"normal",damage:42,fireRate:350,bulletSpeed:800,bulletSize:5,color:"#fff",tier:0,range:520,visual:"tracer"},
plasma:{name:"Plasma SMG",type:"normal",damage:22,fireRate:80,bulletSpeed:850,bulletSize:5,color:"#00eaff",tier:1,range:520,visual:"plasma"},
frost:{name:"Frost Repeater",type:"frost",damage:28,fireRate:115,bulletSpeed:760,bulletSize:6,slowTime:2500,color:"#9fe8ff",tier:1,range:500,visual:"frost"},
railgun:{name:"Railgun",type:"railgun",damage:155,fireRate:850,bulletSpeed:1600,bulletSize:5,pierce:7,color:"#e600ff",tier:1,range:950,visual:"rail"},
shotgun:{name:"Titan Shotgun",type:"shotgun",damage:38,fireRate:620,bulletSpeed:720,bulletSize:6,pellets:9,spread:.8,knockback:50,color:"#ff9d00",tier:2,range:310,visual:"spark"},
starfire:{name:"Starfire Wand",type:"homing",damage:58,fireRate:250,bulletSpeed:540,bulletSize:8,homingStrength:7,color:"#ff4fd8",tier:2,range:600,visual:"comet"},
flame:{name:"Flamethrower",type:"flame",damage:14,fireRate:52,bulletSpeed:560,bulletSize:9,spread:.78,burnDamage:8,burnTime:1900,color:"#ff5a1f",tier:2,range:300,visual:"flame"},
singularity:{name:"Singularity Gun",type:"singularity",damage:0,fireRate:1750,bulletSpeed:420,bulletSize:15,pullRadius:340,pullStrength:1050,blastRadius:220,blastDamage:150,blackHoleTime:900,color:"#6d3cff",tier:3,range:450,visual:"singularity"},
nova:{name:"Nova Lance",type:"nova",damage:75,fireRate:420,bulletSpeed:900,bulletSize:7,sideShots:2,color:"#ff6bff",tier:3,range:560,visual:"lance"},
void:{name:"Void Cannon",type:"explosive",damage:95,fireRate:1000,bulletSpeed:475,bulletSize:14,explosionRadius:145,explosionDamage:115,color:"#8c52ff",tier:4,range:500,visual:"void"},
arc:{name:"Arc Blaster",type:"arc",damage:78,fireRate:600,chainDamage:64,chains:8,chainRange:245,color:"#66ffff",tier:4,range:450,visual:"arc"},
prism:{name:"Prism Cannon",type:"prism",damage:82,fireRate:650,bulletSpeed:1050,bulletSize:6,splits:10,splitSpread:1.45,color:"#ff74e8",tier:5,range:610,visual:"prism"}
};

const PU={heal:{name:"HEAL",color:"#40ff75",w:20},shield:{name:"SHIELD",color:"#5ac8ff",w:18},berserk:{name:"BERSERK",color:"#ff2400",w:13},nuke:{name:"NUKE",color:"#fff",w:5},surge:{name:"POWER SURGE",color:"#ffd700",w:3}};
const ET={
normal:{hp:70,r:21,spd:94,dmg:17,xp:1.5,outline:null},
fast:{hp:50,r:16,spd:145,dmg:13,xp:1.5,outline:"#49dfff"},
big:{hp:250,r:31,spd:76,dmg:24,xp:5,outline:"#ff9c45"},
tank:{hp:600,r:43,spd:56,dmg:32,xp:10,outline:"#ff3d3d"},
frenzy:{hp:100,r:18,spd:168,dmg:20,xp:3,outline:"#ffe34d"},
mega:{hp:1500,r:57,spd:48,dmg:40,xp:25,outline:"#ff4dff"}
};

function rs(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;c.style.width=W+"px";c.style.height=H+"px";x.setTransform(D,0,0,D,0,0)}addEventListener("resize",rs);
c.addEventListener("mousedown",e=>{if(e.button)return;pa=1;px=e.clientX;py=e.clientY});addEventListener("mousemove",e=>{if(pa){px=e.clientX;py=e.clientY}});addEventListener("mouseup",e=>{if(!e.button)pa=0});
c.addEventListener("touchstart",e=>{e.preventDefault();let q=e.touches[0];pa=1;px=q.clientX;py=q.clientY},{passive:false});c.addEventListener("touchmove",e=>{e.preventDefault();let q=e.touches[0];px=q.clientX;py=q.clientY},{passive:false});c.addEventListener("touchend",e=>{e.preventDefault();pa=0},{passive:false});
addEventListener("keydown",e=>{let k=e.key.toLowerCase();if(choosing){if(["w","a","arrowup","arrowleft"].includes(k)){e.preventDefault();moveChoice(-1);return}if(["s","d","arrowdown","arrowright"].includes(k)){e.preventDefault();moveChoice(1);return}if(k===" "||k==="enter"){e.preventDefault();selectChoice();return}}K[k]=1;if(k===" "){e.preventDefault();dash()}if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k))e.preventDefault()});
addEventListener("keyup",e=>K[e.key.toLowerCase()]=0);dbtn.addEventListener("pointerdown",e=>{e.preventDefault();dash()});

const dd=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),rr=o=>o.hitRadius??o.radius,hit=(a,b)=>{let r=rr(a)+rr(b),dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy<r*r},rp=(p=70)=>({x:p+Math.random()*Math.max(1,W-p*2),y:p+Math.random()*Math.max(1,H-p*2)});
function ons(e){let h=e.radius*1.325,p=14;return e.x-h>=p&&e.x+h<=W-p&&e.y-h>=p&&e.y+h<=H-p}
function UL(k){return Math.min(5,(UP[k]||0)+(surge>0?2:0))}
function need(n=lv){return Math.floor(8+n*3.7+n*n*.45)}
function gain(v){xp+=v;while(xp>=need()){xp-=need();lv++;pending++}if(pending&&!choosing)openLevel()}
function weighted(a){if(!a.length)return null;let z=a.reduce((s,o)=>s+o.w,0),r=Math.random()*z;for(const o of a){r-=o.w;if(r<=0)return o.k}return a[a.length-1].k}
function rarityWeight(r){return r==="common"?10:r==="uncommon"?8:r==="rare"?6.5:r==="epic"?5:r==="legendary"?3.8:5}
function maxed(){return Object.values(UP).every(v=>v>=5)}
function finish(){run=0;choosing=0;lscr.classList.add("hidden");fs.textContent=`BUILD MAXED | Score: ${score} | Level: ${lv} | Kills: ${kills}`;go.classList.remove("hidden")}

function openLevel(){
 if(!pending)return;
 if(maxed()){finish();return}
 choosing=1;run=0;choiceIndex=0;lscr.classList.remove("hidden");
 let pool=Object.keys(UP).filter(k=>UP[k]<5),pick=[];
 while(pool.length&&pick.length<3){let a=pool.map(k=>({k,w:rarityWeight(UD[k].r)*(UP[k]?1.45:1)})),k=weighted(a);if(!k)break;pick.push(k);pool.splice(pool.indexOf(k),1)}
 cards.innerHTML="";
 for(const k of pick){
  let u=UD[k],cur=UP[k],next=cur+1,evo=next===5,d=document.createElement("button"),tc=u.t==="ABILITY"?"#df9bff":u.t==="PASSIVE"?"#8ed7ff":"#ff9b9b",tb=u.t==="ABILITY"?"#361448":u.t==="PASSIVE"?"#142b40":"#401a1a";
  d.className=`upgrade rarity-${u.r}`+(evo?" evo":"");d.dataset.key=k;
  d.innerHTML=`<div class="upgradeTop"><span class="type" style="background:${tb};color:${tc}">${u.t}</span><span class="rarity">${u.r.toUpperCase()}</span></div><h2>${u.n}</h2><div class="lv">CURRENT LV ${cur} → LV ${next}${evo?" • EVOLUTION":""}</div><p>${evo?u.e:u.d}</p>`;
  d.onclick=()=>chooseUp(k);cards.appendChild(d)
 }
 refreshChoice()
}
function refreshChoice(){[...cards.children].forEach((q,i)=>q.classList.toggle("selected",i===choiceIndex))}
function moveChoice(n){let a=cards.children.length;if(!a)return;choiceIndex=(choiceIndex+n+a)%a;refreshChoice()}
function selectChoice(){let q=cards.children[choiceIndex];if(q)chooseUp(q.dataset.key)}
function chooseUp(k){
 UP[k]++;
 if(k==="health"){pl.maxHealth+=25;pl.health=Math.min(pl.maxHealth,pl.health+25)}
 pending--;choosing=0;lscr.classList.add("hidden");
 if(maxed()){finish();return}
 if(pending)setTimeout(openLevel,0);else{run=1;lt=performance.now()}
}

function weaponChoice(){let late=Math.min(1,t/150+lv/32),pity=Math.min(1,badW/5),a=Object.entries(G).filter(([k])=>k!=="pistol").map(([k,g])=>{let w=g.tier===1?24:g.tier===2?23:g.tier===3?20:g.tier===4?15:10;w*=1+(g.tier>=3?(late*.7+pity):0);if(badW>=5&&g.tier<3)w=0;return{k,w}}),k=weighted(a);badW=G[k].tier>=3?0:badW+1;return k}
function puChoice(){
 let a=[];
 for(const[k,v]of Object.entries(PU)){
  if(k==="heal"&&pl.health>=pl.maxHealth)continue;
  if(k==="shield"&&pl.shield>=300)continue;
  a.push({k,w:v.w})
 }
 return weighted(a)
}

function spawnSide(){let a=[{s:0,v:pl.y/H},{s:2,v:1-pl.y/H},{s:3,v:pl.x/W},{s:1,v:1-pl.x/W}].sort((a,b)=>b.v-a.v);return Math.random()<.84?a[0].s:Math.random()<.72?a[1].s:Math.floor(Math.random()*4)}
function enemyType(){let a=[{k:"normal",w:40}];if(lv>=2)a.push({k:"fast",w:23+lv*.12});if(lv>=4)a.push({k:"big",w:15+lv*.2});if(lv>=8)a.push({k:"tank",w:5+lv*.1});if(lv>=10)a.push({k:"frenzy",w:12+lv*.16});if(lv>=18)a.push({k:"mega",w:2+lv*.06});return weighted(a)}
function hpScale(){return 1+lv*.025+Math.max(0,lv-20)*.012}
function se(){if(E.length>=245)return;let s=spawnSide(),m=80,a,b;if(!s){a=Math.random()*W;b=-m}else if(s===1){a=W+m;b=Math.random()*H}else if(s===2){a=Math.random()*W;b=H+m}else{a=-m;b=Math.random()*H}let ty=enemyType(),z=ET[ty],dx=pl.x-a,dy=pl.y-b,d=Math.hypot(dx,dy)||1,v=z.spd*(.9+Math.random()*.2),h=z.hp*hpScale();E.push({x:a,y:b,radius:z.r,type:ty,elite:!["normal","fast","frenzy"].includes(ty),vx:dx/d*v*.7,vy:dy/d*v*.7,baseMaxSpeed:v,steering:ty==="frenzy"?162:ty==="fast"?146:120+Math.random()*35,health:h,maxHealth:h,damage:z.dmg,xpv:z.xp,hitCooldown:0,slowTimer:0,burnTime:0,burnTick:0,burnDamage:0,dead:0,bladeHit:0})}

function sw(){let p=rp();WP.push({x:p.x,y:p.y,radius:23,weaponKey:weaponChoice(),life:30000})}
function sp(){let k=puChoice();if(!k)return;let p=rp();P.push({x:p.x,y:p.y,radius:19,key:k,life:22000,pulse:0})}

function sc(a,b,v){
 let near=null,bd=105;
 for(const q of C){let cx=q.cx??q.x,cy=q.cy??q.y,d=Math.hypot(cx-a,cy-b);if(d<bd){bd=d;near=q}}
 let cx,cy;
 if(near&&Math.random()<.88){cx=near.cx??near.x;cy=near.cy??near.y;cx+=(a-cx)*.05;cy+=(b-cy)*.05}else{cx=a+(Math.random()-.5)*12;cy=b+(Math.random()-.5)*12}
 let n=Math.min(4,Math.max(1,Math.ceil(v/2))),each=v/n;
 if(C.length+n>MAXC){let q=near||C[Math.floor(Math.random()*C.length)];if(q){q.value+=v;q.radius=Math.min(10,q.radius+.25)}return}
 for(let i=0;i<n;i++){let A=Math.random()*Math.PI*2,R=4+Math.random()*19,S=5+Math.random()*20;C.push({x:cx+Math.cos(A)*R,y:cy+Math.sin(A)*R,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:6,life:38000,value:each,nukeVacuum:0,cx,cy})}
}

function fn(src=pl,ex=new Set(),vis=1,max=Infinity){let q=null,bd=1e9;for(const e of E){if(e.dead||ex.has(e)||(vis&&!ons(e)))continue;let d=dd(src,e);if(d<=max&&d<bd){bd=d;q=e}}return q}
const gw=()=>G[pl.weaponKey];
function dmgMul(){return(1+UL("damage")*.15)*(berserk>0?1.65:1)}
function fireRate(w){return Math.max(30,w.fireRate/(1+UL("haste")*.1)/(berserk>0?1.35:1))}
function hp(a,b,col="#fff"){for(let i=0;i<3;i++)PT.push({x:a,y:b,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,radius:2+Math.random()*2,life:180,color:col,gravity:0})}
function blood(a,b,s=1){for(let i=0;i<Math.min(38,18+10*s);i++){let A=Math.random()*Math.PI*2,S=70+Math.random()*260*s;PT.push({x:a,y:b,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:2+Math.random()*5*s,life:450+Math.random()*500,color:Math.random()<.5?"#7a0000":"#d00000",gravity:110})}}
function kill(e,src=""){if(!e||e.dead)return;e.dead=1;kills++;score+=10;blood(e.x,e.y,e.radius/22);sc(e.x,e.y,e.xpv);let v=UL("vampire");if(v){let h=.6*v;if(pl.health<pl.maxHealth)pl.health=Math.min(pl.maxHealth,pl.health+h);else if(v>=5)pl.tempHP=Math.min(100,pl.tempHP+h)}let r=UL("chainreaction");if(r&&(src!=="reaction"||r>=5)&&rx<26){rx++;boom(e.x,e.y,48+r*13,24+r*12,210,"#ff3c6f","reaction")}}
function de(e,d,k=0,a=0,col="#fff",src=""){if(!e||e.dead)return;let actual=d*dmgMul();if(UL("damage")>=5&&e.health/e.maxHealth<.2){kill(e,src);return}e.health-=actual;if(k){e.vx+=Math.cos(a)*k*2.5;e.vy+=Math.sin(a)*k*2.5}hp(e.x,e.y,col);if(e.health<=0)kill(e,src)}
function boom(a,b,r,d,du=300,col="#c45cff",src=""){EX.push({x:a,y:b,radius:0,maxRadius:r,life:du,duration:du,color:col});for(const e of E){if(e.dead)continue;let q=Math.hypot(e.x-a,e.y-b);if(q<r)de(e,d*(.4+(1-q/r)*.6),0,0,col,src)}}

function cb(a,w,o={}){
 let r=UL("ricochet");
 B.push({x:o.x??pl.x,y:o.y??pl.y,vx:Math.cos(a)*(o.speed??w.bulletSpeed),vy:Math.sin(a)*(o.speed??w.bulletSpeed),angle:a,radius:o.radius??w.bulletSize,damage:o.damage??w.damage,color:o.color??w.color,type:o.type??w.type,visual:o.visual??w.visual,pierce:(o.pierce??w.pierce??0)+UL("fmj"),ric:r,postRic:0,postTravel:0,postLimit:o.postLimit??290,hitEnemies:new Set(),explosionRadius:o.explosionRadius??w.explosionRadius??0,explosionDamage:o.explosionDamage??w.explosionDamage??0,homingStrength:o.homingStrength??w.homingStrength??0,slowTime:w.slowTime||0,knockback:w.knockback||0,burnDamage:w.burnDamage||0,burnTime:w.burnTime||0,splits:w.splits||0,splitSpread:w.splitSpread||0,prismGen:o.prismGen??0,life:o.life??(w.type==="singularity"?2200:3000),trail:[]})
}
function bounceDamage(b){b.damage*=.85;if(b.explosionDamage)b.explosionDamage*=.85}
function beginPostRic(b){if(!b.postRic&&b.ric<=0){b.postRic=1;b.postTravel=0}}
function consumeRic(b){if(b.ric<=0)return false;b.ric--;bounceDamage(b);beginPostRic(b);return true}

function chain(s,d,n,r,col,ex=new Set()){let f={x:s.x,y:s.y},h=new Set(ex);h.add(s);for(let i=0;i<n;i++){let q=null,bd=1e9;for(const e of E){if(e.dead||h.has(e)||!ons(e))continue;let z=Math.hypot(e.x-f.x,e.y-f.y);if(z<r&&z<bd){bd=z;q=e}}if(!q)break;L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:135,color:col});de(q,d,0,0,col);h.add(q);f={x:q.x,y:q.y};d*=.95}}

function fa(e,w){
 let cr=UL("chainreaction"),q=e,d=w.damage,f={x:pl.x,y:pl.y},h=new Set(),chains=w.chains+cr*2,range=w.chainRange+cr*18;
 for(let i=0;i<chains&&q;i++){
  L.push({x1:f.x,y1:f.y,x2:q.x,y2:q.y,life:150,color:w.color});de(q,d,0,0,w.color);h.add(q);f={x:q.x,y:q.y};d=i?d*.95:w.chainDamage;
  let z=null,bd=1e9;for(const p of E){if(p.dead||h.has(p)||!ons(p))continue;let u=Math.hypot(p.x-f.x,p.y-f.y);if(u<range&&u<bd){bd=u;z=p}}q=z
 }
}

function singularityActive(){return B.some(b=>b.type==="singularity")||BH.length}

function volley(a,w,free=0){
 let ml=UL("multishot"),n=1+ml,spread=w.type==="singularity"?.31:.11;

 if(w.type==="shotgun"){for(let i=0;i<w.pellets+ml*2;i++)cb(a+(Math.random()-.5)*w.spread,w);return}
 if(w.type==="arc"){let q=fn(pl,new Set(),1,w.range);if(q)fa(q,w);return}
 if(w.type==="flame"){for(let i=0;i<1+ml;i++)cb(a+(Math.random()-.5)*w.spread,w,{type:"flame",life:900,speed:w.bulletSpeed*(.85+Math.random()*.35),radius:w.bulletSize+Math.random()*5});return}
 if(w.type==="nova"){cb(a,w);for(let i=1;i<=w.sideShots+ml;i++){cb(a-.18*i,w,{visual:"lanceSide"});cb(a+.18*i,w,{visual:"lanceSide"})}return}

 for(let i=0;i<n;i++){let off=(i-(n-1)/2)*spread;cb(a+off,w)}

 if(ml>=5){
  for(let i=0;i<n;i++){let off=(i-(n-1)/2)*spread;cb(a+Math.PI+off,w)}
 }

 if(!free&&UL("haste")>=5&&++shotN%10===0)volley(a,w,1)
}

function shoot(now){let w=gw();if(w.type==="singularity"&&singularityActive())return;let q=fn(pl,new Set(),1,w.range||Infinity);if(!q||now-ls<fireRate(w))return;ls=now;volley(Math.atan2(q.y-pl.y,q.x-pl.x),w)}

function prism(b,e){
 if(b.type!=="prism"&&b.type!=="prismShard")return;
 let cr=UL("chainreaction"),maxGen=Math.min(5,cr),gen=b.prismGen||0;
 if(b.type==="prismShard"&&gen>=maxGen)return;
 if(prismBudget>=100)return;
 let cols=["#ff4fd8","#72f7ff","#fff16e","#b779ff","#7dff9b","#ff8b4a","#6ca8ff"],base=b.angle,n=gen===0?b.splits+UL("multishot"):Math.max(2,6-gen);
 n=Math.min(n,100-prismBudget);prismBudget+=n;
 let spread=gen===0?b.splitSpread:1.05+gen*.12;
 for(let i=0;i<n;i++){let f=n===1?0:i/(n-1)-.5,a=base+f*spread+(Math.random()-.5)*.11;cb(a,G.prism,{x:e.x+Math.cos(base)*12,y:e.y+Math.sin(base)*12,damage:b.damage*(gen===0?.48:.62),type:"prismShard",visual:"prismShard",color:cols[(i+gen)%cols.length],speed:1030+Math.random()*220,radius:Math.max(2.5,4-gen*.25),life:650,postLimit:230,prismGen:gen+1})}
}

function singularity(a,b){let w=G.singularity;BH.push({x:a,y:b,life:w.blackHoleTime,duration:w.blackHoleTime,pullRadius:w.pullRadius,pullStrength:w.pullStrength,blastRadius:w.blastRadius,blastDamage:w.blastDamage,color:w.color,pt:0});for(let i=0;i<36;i++){let A=Math.random()*Math.PI*2,R=55+Math.random()*w.pullRadius*.9;PT.push({x:a+Math.cos(A)*R,y:b+Math.sin(A)*R,vx:0,vy:0,radius:1+Math.random()*3,life:w.blackHoleTime+100,color:Math.random()<.5?"#a574ff":"#fff",suckX:a,suckY:b,suckSpeed:350+Math.random()*400,suck:1,spin:(Math.random()<.5?-1:1)*(2+Math.random()*4)})}}
function singularityBoom(q){boom(q.x,q.y,q.blastRadius,q.blastDamage,400,"#b26cff");for(let i=0;i<55;i++){let A=Math.random()*Math.PI*2,S=180+Math.random()*550;PT.push({x:q.x,y:q.y,vx:Math.cos(A)*S,vy:Math.sin(A)*S,radius:2+Math.random()*4,life:350+Math.random()*350,color:Math.random()<.5?"#d7b8ff":"#7b33ff"})}}

function dash(){
 if(!run||choosing||dcd>0||dtm>0)return;
 let a=0,b=0;if(K.w||K.arrowup)b--;if(K.s||K.arrowdown)b++;if(K.a||K.arrowleft)a--;if(K.d||K.arrowright)a++;
 if(!a&&!b){a=pl.lastDX;b=pl.lastDY}
 let d=Math.hypot(a,b)||1;
 pl.dvx=a/d*900;pl.dvy=b/d*900;
 dtm=.225;
 dcd=1.05;
 if(UL("speed")>=5)boost=1.5
}

function hurt(z){
 if(inv>0)return;
 if(pl.shield>0){let a=Math.min(pl.shield,z);pl.shield-=a;z-=a}
 if(pl.tempHP>0){let a=Math.min(pl.tempHP,z);pl.tempHP-=a;z-=a}
 pl.health-=z;
 if(pl.health<=0&&UL("health")>=5&&!pl.secondWind){
  pl.secondWind=1;pl.health=pl.maxHealth*.5;inv=2;
  for(const e of E){let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;if(d<220){e.vx+=dx/d*300;e.vy+=dy/d*300}}
 }else if(pl.health<=0){pl.health=0;end()}
}

function up(dt){
 if(dcd>0)dcd-=dt;if(boost>0)boost-=dt;if(inv>0)inv-=dt;if(berserk>0)berserk-=dt;if(surge>0)surge-=dt;
 if(weaponTime>0){weaponTime-=dt*1000;if(weaponTime<=0){pl.weaponKey="pistol";weaponTime=0}}
 if(dtm>0){dtm-=dt;pl.x+=pl.dvx*dt;pl.y+=pl.dvy*dt}
 else{
  let a=0,b=0;if(K.w||K.arrowup)b--;if(K.s||K.arrowdown)b++;if(K.a||K.arrowleft)a--;if(K.d||K.arrowright)a++;
  let s=pl.speed*(1+UL("speed")*.05)*(boost>0?1.5:1)*(berserk>0?1.25:1);
  if(a||b){let d=Math.hypot(a,b);a/=d;b/=d;pl.lastDX=a;pl.lastDY=b;pl.x+=a*s*dt;pl.y+=b*s*dt}
  else if(pa){a=px-pl.x;b=py-pl.y;let d=Math.hypot(a,b);if(d>5){a/=d;b/=d;pl.lastDX=a;pl.lastDY=b;let m=Math.min(s*dt,d);pl.x+=a*m;pl.y+=b*m}}
 }
 pl.x=Math.max(pl.radius,Math.min(W-pl.radius,pl.x));pl.y=Math.max(pl.radius,Math.min(H-pl.radius,pl.y))
}

function ue(dt){
 for(let i=E.length-1;i>=0;i--){
  let e=E[i];if(e.dead){E.splice(i,1);continue}
  let ms=e.baseMaxSpeed;if(e.slowTimer>0){e.slowTimer-=dt*1000;ms*=.5}
  if(e.burnTime>0){e.burnTime-=dt*1000;e.burnTick-=dt*1000;if(e.burnTick<=0){e.burnTick=250;de(e,e.burnDamage,0,0,"#ff5a1f")}}
  if(e.dead)continue;
  let dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy)||1,vx=dx/d*ms,vy=dy/d*ms,sx=vx-e.vx,sy=vy-e.vy,sl=Math.hypot(sx,sy),mx=e.steering*dt;
  if(sl>mx){sx=sx/sl*mx;sy=sy/sl*mx}
  e.vx+=sx;e.vy+=sy;let v=Math.hypot(e.vx,e.vy);if(v>ms){e.vx=e.vx/v*ms;e.vy=e.vy/v*ms}
  e.x+=e.vx*dt;e.y+=e.vy*dt;e.hitCooldown-=dt*1000;
  if(dtm<=0&&hit(pl,e)&&e.hitCooldown<=0){hurt(e.damage);e.hitCooldown=650;e.vx-=dx/d*90;e.vy-=dy/d*90}
 }
}

function wall(b){
 let bounced=0;
 if(b.x-b.radius<0&&b.vx<0){b.x=b.radius;b.vx*=-1;bounced=1}
 if(b.x+b.radius>W&&b.vx>0){b.x=W-b.radius;b.vx*=-1;bounced=1}
 if(b.y-b.radius<0&&b.vy<0){b.y=b.radius;b.vy*=-1;bounced=1}
 if(b.y+b.radius>H&&b.vy>0){b.y=H-b.radius;b.vy*=-1;bounced=1}
 if(!bounced)return true;

 b.angle=Math.atan2(b.vy,b.vx);

 if(UL("ricochet")>=5){
  bounceDamage(b);
  return true
 }

 if(b.ric>0){
  consumeRic(b);
  return true
 }

 return false
}

function ub(dt){
 for(let i=B.length-1;i>=0;i--){
  let b=B[i],spd=Math.hypot(b.vx,b.vy);b.life-=dt*1000;

  if(b.postRic){
   b.postTravel+=spd*dt;
   if(b.postTravel>=b.postLimit){B.splice(i,1);continue}
  }

  b.trail.push({x:b.x,y:b.y});if(b.trail.length>7)b.trail.shift();

  if(b.type==="homing"){
   let q=fn(b,b.hitEnemies,1,500);
   if(q){let a=Math.atan2(q.y-b.y,q.x-b.x),z=Math.atan2(Math.sin(a-b.angle),Math.cos(a-b.angle));b.angle+=z*b.homingStrength*dt;let s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(b.angle)*s;b.vy=Math.sin(b.angle)*s}
  }

  b.x+=b.vx*dt;b.y+=b.vy*dt;

  if(UL("ricochet")&&["normal","railgun","frost","homing","prism","prismShard","nova"].includes(b.type)){
   if(!wall(b)){B.splice(i,1);continue}
  }else if(b.x<-180||b.x>W+180||b.y<-180||b.y>H+180){
   if(b.type==="singularity")singularity(Math.max(20,Math.min(W-20,b.x)),Math.max(20,Math.min(H-20,b.y)));
   B.splice(i,1);continue
  }

  if(b.life<=0){
   if(b.type==="singularity")singularity(Math.max(20,Math.min(W-20,b.x)),Math.max(20,Math.min(H-20,b.y)));
   B.splice(i,1);continue
  }

  let rm=0;

  for(const e of E){
   if(e.dead||b.hitEnemies.has(e)||!hit(b,e))continue;
   b.hitEnemies.add(e);

   if(b.type==="singularity"){singularity(b.x,b.y);rm=1;break}

   de(e,b.damage,b.knockback,b.angle,b.color);

   if(b.type==="frost")e.slowTimer=b.slowTime;
   if(b.type==="flame"&&!e.dead){e.burnTime=Math.max(e.burnTime,b.burnTime);e.burnDamage=Math.max(e.burnDamage,b.burnDamage*dmgMul());e.burnTick=0}

   prism(b,e);

   if(b.type==="explosive"){boom(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color);rm=1;break}

   if(b.pierce>0){
    b.pierce--;
    if(UL("fmj")>=5)b.damage*=1.15;
    continue
   }

   if(b.ric>0){
    let q=fn(e,new Set(b.hitEnemies),1,260);
    if(q){
     let a=Math.atan2(q.y-e.y,q.x-e.x),s=Math.hypot(b.vx,b.vy);
     b.x=e.x;b.y=e.y;b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.angle=a;
     consumeRic(b);
     break
    }
   }

   rm=1;break
  }

  if(rm)B.splice(i,1)
 }
}

function ubh(dt){
 for(let i=BH.length-1;i>=0;i--){
  let q=BH[i];q.life-=dt*1000;q.pt-=dt*1000,p=1-q.life/q.duration,str=.7+p*1.6;
  for(const e of E){
   if(e.dead)continue;
   let dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy);
   if(d>2&&d<q.pullRadius){let f=q.pullStrength*(1-d/q.pullRadius)*str*dt;e.vx+=dx/d*f;e.vy+=dy/d*f;e.x+=dx/d*f*.32;e.y+=dy/d*f*.32}
  }
  if(q.pt<=0){
   q.pt=28;
   for(let z=0;z<4;z++){
    let A=Math.random()*Math.PI*2,R=70+Math.random()*q.pullRadius*.85;
    PT.push({x:q.x+Math.cos(A)*R,y:q.y+Math.sin(A)*R,vx:0,vy:0,radius:1+Math.random()*2.5,life:550,color:"#b788ff",suckX:q.x,suckY:q.y,suckSpeed:450+Math.random()*450,suck:1,spin:(Math.random()<.5?-1:1)*4})
   }
  }
  if(q.life<=0){singularityBoom(q);BH.splice(i,1)}
 }
}

function us(dt){
 let n=UL("solar");if(!n)return;

 orb+=dt*4.2;
 let count=n,r=n>=5?82:70+n*2;
 let bladeDamage=22+n*8;
 let bladeKB=18+n*8;
 let cd=n>=5?190:230;

 for(let i=0;i<count;i++){
  let a=orb+Math.PI*2/count*i,q={x:pl.x+Math.cos(a)*r,y:pl.y+Math.sin(a)*r,radius:12};

  for(const e of E){
   if(e.dead||!hit(q,e)||performance.now()-e.bladeHit<cd)continue;

   e.bladeHit=performance.now();

   let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;
   e.vx+=dx/d*bladeKB;
   e.vy+=dy/d*bladeKB;

   de(e,bladeDamage,0,0,"#ffda44","solar")
  }
 }
}

function ul(dt){
 let s=UL("lightning");if(!s)return;
 lgt+=dt*1000;let rate=1800-s*180;
 if(lgt<rate)return;
 lgt=0;

 let starts=s>=5?3:1;
 for(let j=0;j<starts;j++){
  let a=E.filter(e=>!e.dead&&ons(e));
  if(!a.length)break;
  let q=a[Math.floor(Math.random()*a.length)],d=35+s*12;
  L.push({x1:q.x+(Math.random()-.5)*50,y1:-20,x2:q.x,y2:q.y,life:180,color:"#68f7ff"});
  de(q,d,0,0,"#68f7ff");
  chain(q,d*.75,1+s,140+s*20,"#68f7ff")
 }
}

function densest(){let best=null,n=0;for(const e of E){if(e.dead||!ons(e))continue;let z=0;for(const q of E)if(!q.dead&&Math.hypot(q.x-e.x,q.y-e.y)<170)z++;if(z>n){n=z;best=e}}return best}

function um(dt){
 let s=UL("meteors");if(!s)return;
 met+=dt*1000;megaMet+=dt;
 if(met>=Math.max(650,2100-s*260)){met=0;M.push({x:50+Math.random()*(W-100),y:70+Math.random()*(H-140),life:650,duration:650,radius:34+s*7,damage:50+s*22})}
 if(s>=5&&megaMet>=10){megaMet=0;let q=densest();if(q)M.push({x:q.x,y:q.y,life:900,duration:900,radius:150,damage:400,mega:1})}
}
function umo(dt){for(let i=M.length-1;i>=0;i--){let m=M[i];m.life-=dt*1000;if(m.life<=0){boom(m.x,m.y,m.radius,m.damage,m.mega?500:300,m.mega?"#fff2a8":"#ff6b35");M.splice(i,1)}}}

function pull(q,dt,r,s){let dx=pl.x-q.x,dy=pl.y-q.y,d=Math.hypot(dx,dy);if(d>1&&d<r){q.x+=dx/d*s*dt;q.y+=dy/d*s*dt}}

function upp(dt){
 for(let i=WP.length-1;i>=0;i--){
  let q=WP[i];q.life-=dt*1000;
  if(q.life<=0){WP.splice(i,1);continue}
  if(hit(pl,q)){pl.weaponKey=q.weaponKey;weaponTime=30000;ls=0;WP.splice(i,1)}
 }

 for(let i=P.length-1;i>=0;i--){
  let q=P[i];q.life-=dt*1000;q.pulse+=dt*5;
  if(q.life<=0){P.splice(i,1);continue}

  if(hit(pl,q)){
   if(q.key==="heal")pl.health=Math.min(pl.maxHealth,pl.health+80);
   else if(q.key==="shield")pl.shield=Math.min(300,pl.shield+100);
   else if(q.key==="berserk")berserk=20;
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
 if(!m)return{r:88,s:455};
 if(m===1)return{r:150,s:480};
 if(m===2)return{r:210,s:510};
 if(m===3)return{r:270,s:545};
 if(m===4)return{r:340,s:585};
 return{r:440,s:760}
}

function uc(dt){
 let ms=magnetStats();

 for(let i=C.length-1;i>=0;i--){
  let q=C[i];

  q.life-=dt*1000;
  q.x+=q.vx*dt;q.y+=q.vy*dt;
  q.vx*=Math.pow(.025,dt);q.vy*=Math.pow(.025,dt);

  if(!q.nukeVacuum&&q.cx!==undefined){
   let dx=q.cx-q.x,dy=q.cy-q.y,d=Math.hypot(dx,dy);
   if(d>14){
    let s=Math.min(72,(d-14)*1.7);
    q.x+=dx/d*s*dt;q.y+=dy/d*s*dt
   }
  }

  if(q.nukeVacuum)pull(q,dt,99999,1150);
  else pull(q,dt,ms.r,ms.s);

  if(q.life<=0){C.splice(i,1);continue}
  if(hit(pl,q)){gain(q.value);C.splice(i,1)}
 }
}

function ufx(dt){
 for(let i=PT.length-1;i>=0;i--){
  let p=PT[i];p.life-=dt*1000;

  if(p.suck){
   let dx=p.suckX-p.x,dy=p.suckY-p.y,d=Math.hypot(dx,dy);
   if(d>2){
    let nx=dx/d,ny=dy/d,tx=-ny,ty=nx,s=p.suckSpeed*(1+Math.max(0,1-d/340));
    p.x+=(nx*s+tx*p.spin*12)*dt;p.y+=(ny*s+ty*p.spin*12)*dt
   }else p.life=0
  }else{
   p.vy+=(p.gravity||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt
  }

  if(p.life<=0)PT.splice(i,1)
 }

 for(let i=EX.length-1;i>=0;i--){
  let e=EX[i];e.life-=dt*1000;e.radius=e.maxRadius*Math.max(0,Math.min(1,1-e.life/e.duration));
  if(e.life<=0)EX.splice(i,1)
 }

 for(let i=L.length-1;i>=0;i--){
  L[i].life-=dt*1000;
  if(L[i].life<=0)L.splice(i,1)
 }
}

function bg(){x.fillStyle="#111820";x.fillRect(0,0,W,H);x.strokeStyle="rgba(255,255,255,.035)";for(let a=0;a<W;a+=50){x.beginPath();x.moveTo(a,0);x.lineTo(a,H);x.stroke()}for(let b=0;b<H;b+=50){x.beginPath();x.moveTo(0,b);x.lineTo(W,b);x.stroke()}}

function dp(){
 if(surge>0){
  x.save();x.shadowBlur=35;x.shadowColor="#ffd700";
  x.beginPath();x.arc(pl.x,pl.y,pl.radius+20+Math.sin(performance.now()/60)*5,0,Math.PI*2);
  x.strokeStyle="#ffd700";x.lineWidth=5;x.stroke();x.restore()
 }

 if(pl.shield>0){
  x.beginPath();x.arc(pl.x,pl.y,pl.radius+8,0,Math.PI*2);
  x.strokeStyle="#55cfff";x.lineWidth=4;x.stroke()
 }

 x.beginPath();x.arc(pl.x,pl.y,pl.radius,0,Math.PI*2);
 x.fillStyle=inv>0?"#fff":berserk>0?"#ff4b32":pl.color;
 x.fill();x.strokeStyle="#fff";x.lineWidth=3;x.stroke()
}

function hippoRing(e){
 let z=ET[e.type];if(!z.outline)return;
 let p=1+Math.sin(performance.now()/(e.type==="frenzy"?85:130)+e.x*.01)*.08;

 x.save();
 x.shadowColor=z.outline;
 x.shadowBlur=e.type==="mega"?22:e.type==="frenzy"?15:8;
 x.strokeStyle=z.outline;
 x.lineWidth=e.type==="tank"?6:e.type==="mega"?7:3.5;

 x.beginPath();
 x.arc(e.x,e.y,(e.radius+7)*((e.type==="frenzy"||e.type==="mega")?p:1),0,Math.PI*2);
 x.stroke();

 if(e.type==="tank"||e.type==="mega"){
  x.globalAlpha=.45;x.lineWidth=2;
  x.beginPath();x.arc(e.x,e.y,e.radius+13+(e.type==="mega"?Math.sin(performance.now()/100)*4:0),0,Math.PI*2);
  x.stroke()
 }

 if(e.type==="fast"){
  x.globalAlpha=.45;
  x.beginPath();x.arc(e.x,e.y,e.radius+11,0,Math.PI*2);x.stroke()
 }

 x.restore()
}

function dee(){
 for(const e of E){
  hippoRing(e);

  let s=e.radius*2.65;
  if(hi.complete&&hi.naturalWidth)x.drawImage(hi,e.x-s/2,e.y-s/2,s,s);
  else{x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.fillStyle=ET[e.type].outline||"#888";x.fill()}

  if(e.elite||e.health<e.maxHealth){
   let w=e.radius*1.8;
   x.fillStyle="#250000";x.fillRect(e.x-w/2,e.y-e.radius-10,w,5);
   x.fillStyle=e.type==="mega"?"#ff4dff":e.type==="tank"?"#ff3d3d":"#ff6644";
   x.fillRect(e.x-w/2,e.y-e.radius-10,w*Math.max(0,e.health/e.maxHealth),5)
  }
 }
}

function dc(){for(const q of C){x.save();x.shadowBlur=q.nukeVacuum?18:8;x.shadowColor="#ffd700";x.beginPath();x.arc(q.x,q.y,q.radius,0,Math.PI*2);x.fillStyle="#ffd700";x.fill();x.restore()}}

function db(){
 for(const b of B){
  x.save();x.shadowBlur=15;x.shadowColor=b.color;

  if(["rail","plasma","tracer","lance","lanceSide"].includes(b.visual)){
   x.translate(b.x,b.y);x.rotate(b.angle);x.fillStyle=b.visual==="rail"?"#fff":b.color;
   x.fillRect(b.visual==="rail"?-30:-14,-2,b.visual==="rail"?60:28,4)
  }else if(b.visual==="frost"){
   x.translate(b.x,b.y);x.rotate(b.angle);x.fillStyle=b.color;
   x.beginPath();x.moveTo(11,0);x.lineTo(-7,-6);x.lineTo(-3,0);x.lineTo(-7,6);x.fill()
  }else if(b.visual==="flame"){
   let p=Math.max(0,b.life/900);x.globalAlpha=.6+.4*p;
   x.beginPath();x.arc(b.x,b.y,b.radius*(2-p*.7),0,Math.PI*2);
   x.fillStyle=p>.6?"#fff16a":p>.25?"#ff8a00":"#d31b00";x.fill()
  }else if(b.visual==="singularity"){
   x.beginPath();x.arc(b.x,b.y,b.radius,0,Math.PI*2);x.fillStyle="#08000e";x.fill();
   x.strokeStyle="#b98cff";x.lineWidth=3;x.stroke()
  }else if(b.visual==="prism"||b.visual==="prismShard"){
   x.translate(b.x,b.y);x.rotate(b.angle);x.fillStyle=b.color;
   x.beginPath();x.moveTo(14,0);x.lineTo(-8,-5);x.lineTo(-8,5);x.fill()
  }else{
   x.beginPath();x.arc(b.x,b.y,b.radius,0,Math.PI*2);x.fillStyle=b.color;x.fill()
  }

  x.restore()
 }
}

function ds(){
 let n=UL("solar");if(!n)return;

 let count=n,r=n>=5?82:70+n*2;

 for(let i=0;i<count;i++){
  let a=orb+Math.PI*2/count*i,A=pl.x+Math.cos(a)*r,Bb=pl.y+Math.sin(a)*r;
  x.save();x.translate(A,Bb);x.rotate(a+.4);x.shadowBlur=18;x.shadowColor="#ffda44";x.fillStyle="#fff7a0";
  x.beginPath();x.moveTo(0,-19);x.lineTo(6,8);x.lineTo(0,17);x.lineTo(-6,8);x.fill();
  x.restore()
 }
}

function dwp(){for(const p of WP){let w=G[p.weaponKey];x.save();x.shadowBlur=18;x.shadowColor=w.color;x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle="#111";x.fill();x.strokeStyle=w.color;x.lineWidth=4;x.stroke();x.fillStyle="#fff";x.font="bold 8px Arial";x.textAlign="center";x.textBaseline="middle";x.fillText(w.name.split(" ")[0],p.x,p.y);x.restore()}}
function dpu(){for(const p of P){let u=PU[p.key],q=1+Math.sin(p.pulse)*.12;x.save();x.shadowBlur=p.key==="surge"?38:20;x.shadowColor=u.color;x.beginPath();x.arc(p.x,p.y,p.radius*q*(p.key==="surge"?1.3:1),0,Math.PI*2);x.fillStyle=u.color;x.fill();x.fillStyle="#111";x.font="bold 8px Arial";x.textAlign="center";x.textBaseline="middle";x.fillText(u.name,p.x,p.y);x.restore()}}
function dmet(){for(const m of M){let q=m.life/m.duration;x.save();x.beginPath();x.arc(m.x,m.y,m.radius*(.6+.4*(1-q)),0,Math.PI*2);x.strokeStyle=m.mega?"#fff2a8":"#ff6b35";x.lineWidth=m.mega?8:4;x.stroke();x.beginPath();x.moveTo(m.x-80*q,m.y-150*q);x.lineTo(m.x,m.y);x.strokeStyle="#ffd08a";x.lineWidth=m.mega?16:8;x.stroke();x.restore()}}
function dbh(){for(const q of BH){let p=1-q.life/q.duration;x.save();x.shadowBlur=40;x.shadowColor=q.color;x.beginPath();x.arc(q.x,q.y,18+15*p,0,Math.PI*2);x.fillStyle="#030005";x.fill();x.strokeStyle="#b98cff";x.lineWidth=3;x.stroke();x.globalAlpha=.18;x.beginPath();x.arc(q.x,q.y,q.pullRadius,0,Math.PI*2);x.stroke();x.restore()}}
function dfx(){for(const p of PT){x.save();x.globalAlpha=Math.min(1,p.life/250);x.beginPath();x.arc(p.x,p.y,p.radius,0,Math.PI*2);x.fillStyle=p.color||"#fff";x.fill();x.restore()}for(const e of EX){x.save();x.globalAlpha=Math.max(0,e.life/e.duration);x.beginPath();x.arc(e.x,e.y,e.radius,0,Math.PI*2);x.strokeStyle=e.color;x.lineWidth=10;x.stroke();x.restore()}for(const l of L){x.save();x.shadowBlur=18;x.shadowColor=l.color;x.strokeStyle=l.color;x.lineWidth=5;x.beginPath();x.moveTo(l.x1,l.y1);for(let i=1;i<7;i++){let q=i/7;x.lineTo(l.x1+(l.x2-l.x1)*q+(Math.random()-.5)*18,l.y1+(l.y2-l.y1)*q+(Math.random()-.5)*18)}x.lineTo(l.x2,l.y2);x.stroke();x.restore()}}

function hud(){
 ht.textContent=`HP ${Math.ceil(pl.health)}${pl.tempHP?` +${Math.ceil(pl.tempHP)}`:""}`;
 wt.textContent=pl.weaponKey==="pistol"?"Pistol":`${gw().name} ${Math.ceil(weaponTime/1000)}s`;
 st.textContent=`Score ${score}`;
 lvT.textContent=`LV ${lv}`;
 xpB.style.width=`${Math.min(100,xp/need()*100)}%`;
 if(pl.shield>0){shHUD.classList.remove("hidden");shT.textContent=Math.ceil(pl.shield)}else shHUD.classList.add("hidden")
}

function end(){run=0;fs.textContent=`Score: ${score} | Level: ${lv} | Kills: ${kills}`;go.classList.remove("hidden")}

function reset(){
 E=[];B=[];WP=[];P=[];C=[];EX=[];L=[];PT=[];M=[];BH=[];
 score=kills=xp=pending=0;lv=1;t=0;weaponTime=badW=berserk=surge=boost=inv=0;
 pl.x=W/2;pl.y=H/2;pl.health=pl.maxHealth=150;pl.tempHP=pl.shield=0;pl.weaponKey="pistol";pl.secondWind=0;
 for(const k in UP)UP[k]=0;
 ls=est=wst=pst=lgt=met=megaMet=orb=dtm=dcd=0;
 run=1;choosing=0;choiceIndex=0;
 go.classList.add("hidden");lscr.classList.add("hidden");sw();sw();sp();lt=performance.now()
}
rb.addEventListener("click",reset);

function loop(n){
 let d=Math.min((n-lt)/1000,.05);lt=n;bg();

 if(run){
  rx=0;prismBudget=0;t+=d;est+=d*1000;wst+=d*1000;pst+=d*1000;

  let er=Math.max(190,700-lv*13-t*.18),ec=lv>=26?3:lv>=9?2:1;

  if(est>=er){est=0;for(let i=0;i<ec;i++)se()}
  if(wst>=7600){wst=0;sw()}

  let pr=Math.max(4300,9000-lv*95);
  if(pst>=pr){pst=0;sp();if(lv>=18&&Math.random()<.18)sp()}

  up(d);ue(d);ub(d);ubh(d);us(d);ul(d);um(d);umo(d);upp(d);uc(d);ufx(d);shoot(n);hud()
 }

 dwp();dpu();dc();dee();db();ds();dmet();dbh();dp();dfx();
 requestAnimationFrame(loop)
}

rs();pl.x=W/2;pl.y=H/2;sw();sw();sp();hud();lt=performance.now();requestAnimationFrame(loop);
