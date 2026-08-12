const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
const healthText=document.getElementById("healthText"),weaponText=document.getElementById("weaponText"),scoreText=document.getElementById("scoreText");
const gameOverScreen=document.getElementById("gameOverScreen"),finalScore=document.getElementById("finalScore"),restartButton=document.getElementById("restartButton");

let width=0,height=0,pixelRatio=1,gameRunning=true,score=0,kills=0,coins=0,lastTime=0,lastShot=0,survivalTime=0;
let enemySpawnTimer=0,weaponSpawnTimer=0,powerupSpawnTimer=0,lightningTimer=0,meteorTimer=0,orbitAngle=0,dashTime=0,dashCooldown=0;
let enemies=[],bullets=[],weaponPickups=[],powerups=[],coinDrops=[],explosions=[],lightningEffects=[],particles=[],meteors=[],weaponBag=[];

const hippoImage=new Image();
hippoImage.src="hippo.png";

const player={
  x:0,y:0,
  radius:18,
  hitRadius:10,
  speed:295,
  health:150,
  maxHealth:150,
  shield:0,
  color:"#55ccff",
  weaponKey:"pistol",
  lastDX:1,
  lastDY:0,
  dashVX:0,
  dashVY:0
};

const WEAPONS={
  pistol:{name:"Pistol",type:"normal",damage:42,fireRate:350,bulletSpeed:800,bulletSize:6,color:"#fff"},
  plasma:{name:"Plasma SMG",type:"normal",damage:22,fireRate:80,bulletSpeed:850,bulletSize:5,color:"#00eaff"},
  shotgun:{name:"Titan Shotgun",type:"shotgun",damage:38,fireRate:620,bulletSpeed:720,bulletSize:7,pellets:9,spread:.8,knockback:50,color:"#ff9d00"},
  railgun:{name:"Railgun",type:"railgun",damage:155,fireRate:850,bulletSpeed:1600,bulletSize:7,pierce:7,color:"#e600ff"},
  void:{name:"Void Cannon",type:"explosive",damage:95,fireRate:1000,bulletSpeed:475,bulletSize:14,explosionRadius:145,explosionDamage:115,color:"#8c52ff"},
  arc:{name:"Arc Blaster",type:"arc",damage:72,fireRate:630,chainDamage:52,chains:5,chainRange:175,color:"#66ffff"},
  starfire:{name:"Starfire Wand",type:"homing",damage:58,fireRate:250,bulletSpeed:540,bulletSize:8,homingStrength:7,color:"#ff4fd8"},
  frost:{name:"Frost Repeater",type:"frost",damage:28,fireRate:115,bulletSpeed:760,bulletSize:6,slow:.5,slowTime:2500,color:"#9fe8ff"},
  solar:{name:"Solar Blades",type:"orbit",damage:90,blades:4,color:"#ffda44"},
  nova:{name:"Nova Lance",type:"nova",damage:75,fireRate:420,bulletSpeed:900,bulletSize:8,sideShots:2,color:"#ff6bff"},
  singularity:{name:"Singularity Gun",type:"singularity",damage:35,fireRate:1250,bulletSpeed:380,bulletSize:16,pullRadius:180,pullStrength:170,explosionRadius:115,explosionDamage:85,color:"#6d3cff"},

  prism:{
    name:"Prism Cannon",
    type:"prism",
    damage:82,
    fireRate:650,
    bulletSpeed:1050,
    bulletSize:7,
    splits:3,
    splitRange:260,
    color:"#ff74e8"
  },

  swarm:{
    name:"Swarm Launcher",
    type:"swarm",
    damage:42,
    fireRate:900,
    bulletSpeed:460,
    bulletSize:7,
    missiles:6,
    homingStrength:8,
    explosionRadius:55,
    explosionDamage:45,
    color:"#ffcc4d"
  },

  flame:{
    name:"Flamethrower",
    type:"flame",
    damage:13,
    fireRate:55,
    bulletSpeed:460,
    bulletSize:8,
    spread:.55,
    burnDamage:7,
    burnTime:1800,
    color:"#ff5a1f"
  }
};

const POWERUPS={
  heal:{name:"HEAL",color:"#40ff75"},
  shield:{name:"SHIELD",color:"#5ac8ff"},
  quad:{name:"DAMAGE",color:"#ff3838"},
  haste:{name:"HASTE",color:"#ffe600"},
  overdrive:{name:"OVERDRIVE",color:"#ff7b00"},
  nuke:{name:"NUKE",color:"#fff"},
  magnet:{name:"MAGNET",color:"#c451ff"},
  berserk:{name:"BERSERK",color:"#ff0055"},
  fmj:{name:"FMJ",color:"#c8c8c8"},
  chain:{name:"CHAIN",color:"#00ffff"},

  lightning:{
    name:"LIGHTNING",
    color:"#68f7ff"
  },

  meteors:{
    name:"METEORS",
    color:"#ff6b35"
  },

  multishot:{
    name:"MULTI",
    color:"#ff8cff"
  },

  ricochet:{
    name:"RICOCHET",
    color:"#b6ff5c"
  },

  chainreaction:{
    name:"REACTION",
    color:"#ff3c6f"
  },

  vampire:{
    name:"VAMPIRE",
    color:"#a80038"
  },

  coinrush:{
    name:"COIN RUSH",
    color:"#ffd700"
  },

  powersurge:{
    name:"POWER SURGE",
    color:"#ffffff"
  }
};

const buffs={
  quad:{stacks:0,time:0,maxStacks:3},
  haste:{stacks:0,time:0,maxStacks:3},
  overdrive:{stacks:0,time:0,maxStacks:3},
  magnet:{stacks:0,time:0,maxStacks:2},
  berserk:{stacks:0,time:0,maxStacks:3},
  fmj:{stacks:0,time:0,maxStacks:3},
  chain:{stacks:0,time:0,maxStacks:3},
  lightning:{stacks:0,time:0,maxStacks:3},
  meteors:{stacks:0,time:0,maxStacks:3},
  multishot:{stacks:0,time:0,maxStacks:3},
  ricochet:{stacks:0,time:0,maxStacks:3},
  chainreaction:{stacks:0,time:0,maxStacks:3},
  vampire:{stacks:0,time:0,maxStacks:3},
  coinrush:{stacks:0,time:0,maxStacks:3},
  powersurge:{stacks:0,time:0,maxStacks:1}
};

let pointerActive=false,pointerX=0,pointerY=0;
const keys={};

function resizeCanvas(){
  pixelRatio=Math.min(window.devicePixelRatio||1,2);

  width=window.innerWidth;
  height=window.innerHeight;

  canvas.width=width*pixelRatio;
  canvas.height=height*pixelRatio;

  canvas.style.width=width+"px";
  canvas.style.height=height+"px";

  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
}

window.addEventListener("resize",resizeCanvas);

canvas.addEventListener("mousedown",e=>{
  if(e.button!==0)return;

  pointerActive=true;
  pointerX=e.clientX;
  pointerY=e.clientY;
});

window.addEventListener("mousemove",e=>{
  if(pointerActive){
    pointerX=e.clientX;
    pointerY=e.clientY;
  }
});

window.addEventListener("mouseup",e=>{
  if(e.button===0){
    pointerActive=false;
  }
});

window.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();

  keys[k]=true;

  if(k===" "||k==="spacebar"){
    e.preventDefault();
    startDash();
  }

  if([
    "w","a","s","d",
    "arrowup","arrowdown",
    "arrowleft","arrowright"
  ].includes(k)){
    e.preventDefault();
  }
});

window.addEventListener("keyup",e=>{
  keys[e.key.toLowerCase()]=false;
});

window.addEventListener("blur",()=>{
  pointerActive=false;

  for(const k in keys){
    keys[k]=false;
  }
});

canvas.addEventListener("touchstart",e=>{
  e.preventDefault();

  const t=e.touches[0];

  pointerActive=true;
  pointerX=t.clientX;
  pointerY=t.clientY;
},{passive:false});

canvas.addEventListener("touchmove",e=>{
  e.preventDefault();

  const t=e.touches[0];

  pointerX=t.clientX;
  pointerY=t.clientY;
},{passive:false});

canvas.addEventListener("touchend",e=>{
  e.preventDefault();
  pointerActive=false;
},{passive:false});

canvas.addEventListener("touchcancel",()=>{
  pointerActive=false;
});

const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

const radiusOf=o=>o.hitRadius??o.radius;

const touching=(a,b)=>{
  const r=radiusOf(a)+radiusOf(b);
  const dx=a.x-b.x;
  const dy=a.y-b.y;

  return dx*dx+dy*dy<r*r;
};

const randomPos=(p=80)=>({
  x:p+Math.random()*Math.max(1,width-p*2),
  y:p+Math.random()*Math.max(1,height-p*2)
});

function onScreen(e){
  const half=e.radius*1.325;
  const pad=14;

  return (
    e.x-half>=pad &&
    e.x+half<=width-pad &&
    e.y-half>=pad &&
    e.y+half<=height-pad
  );
}

function effectiveStacks(k){
  const normal=buffs[k]?.stacks||0;

  if(
    buffs.powersurge.time>0 &&
    k!=="powersurge"
  ){
    return normal*2;
  }

  return normal;
}

function refillWeaponBag(){
  weaponBag=[
    "plasma",
    "shotgun",
    "railgun",
    "void",
    "arc",
    "starfire",
    "frost",
    "solar",
    "nova",
    "singularity",
    "prism",
    "swarm",
    "flame"
  ];

  for(let i=weaponBag.length-1;i>0;i--){
    const j=Math.floor(
      Math.random()*(i+1)
    );

    [
      weaponBag[i],
      weaponBag[j]
    ]=[
      weaponBag[j],
      weaponBag[i]
    ];
  }
}

function spawnEnemy(){
  const side=Math.floor(Math.random()*4);
  const m=50;

  let x,y;

  if(side===0){
    x=Math.random()*width;
    y=-m;
  }else if(side===1){
    x=width+m;
    y=Math.random()*height;
  }else if(side===2){
    x=Math.random()*width;
    y=height+m;
  }else{
    x=-m;
    y=Math.random()*height;
  }

  const difficulty=
    1+
    kills/65+
    survivalTime/90;

  const radius=
    19+
    Math.random()*4;

  const maxSpeed=
    70+
    Math.random()*28+
    difficulty*3;

  const dx=player.x-x;
  const dy=player.y-y;
  const d=Math.hypot(dx,dy)||1;

  const startSpeed=
    maxSpeed*.7;

  const hp=
    70+
    difficulty*12;

  enemies.push({
    x,y,
    radius,

    vx:
      dx/d*
      startSpeed,

    vy:
      dy/d*
      startSpeed,

    baseMaxSpeed:
      maxSpeed,

    steering:
      120+
      Math.random()*35,

    health:hp,
    maxHealth:hp,

    damage:
      17+
      difficulty*.45,

    hitCooldown:0,
    slowTimer:0,

    burnTime:0,
    burnTick:0,
    burnDamage:0,

    dead:false,
    bladeHit:0
  });
}

function spawnWeaponPickup(){
  if(!weaponBag.length){
    refillWeaponBag();
  }

  const p=randomPos();

  weaponPickups.push({
    x:p.x,
    y:p.y,

    radius:23,

    weaponKey:
      weaponBag.pop(),

    life:22000
  });
}

function spawnPowerup(){
  const ks=
    Object.keys(POWERUPS);

  const key=
    ks[
      Math.floor(
        Math.random()*ks.length
      )
    ];

  const p=randomPos();

  powerups.push({
    x:p.x,
    y:p.y,

    radius:19,

    key,

    life:22000,
    pulse:0
  });
}

function spawnCoins(x,y){
  let count=
    1+
    Math.floor(
      Math.random()*3
    );

  if(effectiveStacks("coinrush")){
    count+=
      2*
      effectiveStacks("coinrush");
  }

  for(let i=0;i<count;i++){
    const a=
      Math.random()*
      Math.PI*2;

    const s=
      35+
      Math.random()*80;

    coinDrops.push({
      x,y,

      vx:
        Math.cos(a)*s,

      vy:
        Math.sin(a)*s,

      radius:6,

      life:35000,

      value:1,

      nukeVacuum:false
    });
  }
}

function findNearestEnemy(
  source=player,
  excluded=new Set(),
  visibleOnly=true
){
  let best=null;
  let bestD=Infinity;

  for(const e of enemies){
    if(
      e.dead ||
      excluded.has(e) ||
      (
        visibleOnly &&
        !onScreen(e)
      )
    ){
      continue;
    }

    const d=
      dist(source,e);

    if(d<bestD){
      bestD=d;
      best=e;
    }
  }

  return best;
}

const weapon=()=>
  WEAPONS[player.weaponKey];

function damageMult(){
  return (
    1+
    effectiveStacks("quad")*
    1.25
  )*
  (
    1+
    effectiveStacks("berserk")*
    .45
  );
}

function fireRate(w){
  return Math.max(
    30,

    w.fireRate*
    Math.pow(
      .8,
      effectiveStacks("haste")
    )*
    Math.pow(
      .82,
      effectiveStacks("overdrive")
    )*
    Math.pow(
      .9,
      effectiveStacks("berserk")
    )
  );
}

function createBloodExplosion(x,y){
  for(let i=0;i<26;i++){
    const a=
      Math.random()*
      Math.PI*2;

    const s=
      70+
      Math.random()*280;

    particles.push({
      x,y,

      vx:
        Math.cos(a)*s,

      vy:
        Math.sin(a)*s,

      radius:
        2+
        Math.random()*5,

      life:
        500+
        Math.random()*500,

      color:
        Math.random()<.5
          ?"#7b0000"
          :"#d00000",

      gravity:120
    });
  }
}

function createHitParticles(x,y){
  for(let i=0;i<3;i++){
    particles.push({
      x,y,

      vx:
        (Math.random()-.5)*
        150,

      vy:
        (Math.random()-.5)*
        150,

      radius:
        2+
        Math.random()*2,

      life:180,

      color:"#fff",

      gravity:0
    });
  }
}

function createDeathParticles(x,y){
  for(let i=0;i<7;i++){
    particles.push({
      x,y,

      vx:
        (Math.random()-.5)*
        220,

      vy:
        (Math.random()-.5)*
        220,

      radius:
        2+
        Math.random()*3,

      life:350,

      color:"#fff",

      gravity:0
    });
  }
}

function damageEnemy(
  e,
  dmg,
  knockback=0,
  angle=0
){
  if(!e||e.dead)return;

  e.health-=
    dmg*
    damageMult();

  if(knockback){
    e.vx+=
      Math.cos(angle)*
      knockback*
      2.5;

    e.vy+=
      Math.sin(angle)*
      knockback*
      2.5;
  }

  createHitParticles(
    e.x,
    e.y
  );

  if(e.health<=0){
    e.dead=true;

    kills++;
    score+=10;

    createBloodExplosion(
      e.x,
      e.y
    );

    spawnCoins(
      e.x,
      e.y
    );

    if(
      effectiveStacks("vampire")
    ){
      player.health=
        Math.min(
          player.maxHealth,

          player.health+
          1.5*
          effectiveStacks("vampire")
        );
    }

    if(
      effectiveStacks(
        "chainreaction"
      )
    ){
      createExplosion(
        e.x,
        e.y,

        65+
        effectiveStacks(
          "chainreaction"
        )*
        20,

        28+
        effectiveStacks(
          "chainreaction"
        )*
        18,

        220,

        "#ff3c6f"
      );
    }
  }
}

function chainFromEnemy(
  start,
  damage,
  chains,
  range,
  color,
  excluded=new Set()
){
  let from={
    x:start.x,
    y:start.y
  };

  let dmg=damage;

  const hit=
    new Set(excluded);

  hit.add(start);

  for(let i=0;i<chains;i++){
    let next=null;
    let best=Infinity;

    for(const e of enemies){
      if(
        e.dead ||
        hit.has(e) ||
        !onScreen(e)
      ){
        continue;
      }

      const d=
        Math.hypot(
          e.x-from.x,
          e.y-from.y
        );

      if(
        d<range &&
        d<best
      ){
        best=d;
        next=e;
      }
    }

    if(!next)break;

    lightningEffects.push({
      x1:from.x,
      y1:from.y,

      x2:next.x,
      y2:next.y,

      life:130,

      color
    });

    damageEnemy(
      next,
      dmg
    );

    hit.add(next);

    from={
      x:next.x,
      y:next.y
    };

    dmg*=.82;
  }
}

function createBullet(
  angle,
  w,
  extra={}
){
  bullets.push({
    x:
      extra.x ??
      player.x,

    y:
      extra.y ??
      player.y,

    vx:
      Math.cos(angle)*
      (
        extra.speed ??
        w.bulletSpeed
      ),

    vy:
      Math.sin(angle)*
      (
        extra.speed ??
        w.bulletSpeed
      ),

    angle,

    radius:
      extra.radius ??
      w.bulletSize,

    damage:
      extra.damage ??
      w.damage,

    color:
      extra.color ??
      w.color,

    type:
      extra.type ??
      w.type,

    pierce:
      (
        extra.pierce ??
        w.pierce ??
        0
      )+
      effectiveStacks("fmj")*
      2,

    hitEnemies:new Set(),

    explosionRadius:
      extra.explosionRadius ??
      w.explosionRadius ??
      0,

    explosionDamage:
      extra.explosionDamage ??
      w.explosionDamage ??
      0,

    homingStrength:
      extra.homingStrength ??
      w.homingStrength ??
      0,

    slow:
      w.slow||0,

    slowTime:
      w.slowTime||0,

    knockback:
      w.knockback||0,

    pullRadius:
      w.pullRadius||0,

    pullStrength:
      w.pullStrength||0,

    burnDamage:
      w.burnDamage||0,

    burnTime:
      w.burnTime||0,

    splitRange:
      w.splitRange||0,

    splits:
      w.splits||0,

    ricochets:
      effectiveStacks(
        "ricochet"
      ),

    life:
      extra.life ??
      (
        w.type==="singularity"
          ?1900
          :3000
      )
  });
}

function fireArc(first,w){
  let cur=first;
  let dmg=w.damage;

  let start={
    x:player.x,
    y:player.y
  };

  const hit=new Set();

  const chains=
    w.chains+
    effectiveStacks("overdrive");

  for(
    let i=0;
    i<chains&&cur;
    i++
  ){
    if(!onScreen(cur))break;

    lightningEffects.push({
      x1:start.x,
      y1:start.y,

      x2:cur.x,
      y2:cur.y,

      life:130,

      color:w.color
    });

    damageEnemy(
      cur,
      dmg
    );

    hit.add(cur);

    start={
      x:cur.x,
      y:cur.y
    };

    dmg=w.chainDamage;

    let next=null;
    let best=Infinity;

    for(const e of enemies){
      if(
        e.dead ||
        hit.has(e) ||
        !onScreen(e)
      ){
        continue;
      }

      const d=
        Math.hypot(
          e.x-start.x,
          e.y-start.y
        );

      if(
        d<w.chainRange &&
        d<best
      ){
        best=d;
        next=e;
      }
    }

    cur=next;
  }
}

function shoot(time){
  const w=weapon();

  if(w.type==="orbit")return;

  const target=
    findNearestEnemy();

  if(!target)return;

  if(
    time-lastShot<
    fireRate(w)
  ){
    return;
  }

  lastShot=time;

  const angle=
    Math.atan2(
      target.y-player.y,
      target.x-player.x
    );

  const multi=
    effectiveStacks(
      "multishot"
    );

  if(w.type==="shotgun"){
    for(
      let i=0;
      i<
      w.pellets+
      multi*2;
      i++
    ){
      createBullet(
        angle+
        (
          Math.random()-.5
        )*
        w.spread,

        w
      );
    }

    return;
  }

  if(w.type==="arc"){
    fireArc(
      target,
      w
    );

    return;
  }

  if(w.type==="swarm"){
    const visible=
      enemies.filter(
        e=>
          !e.dead &&
          onScreen(e)
      );

    for(
      let i=0;
      i<
      w.missiles+
      multi*2;
      i++
    ){
      const t=
        visible.length
          ?visible[
            i%
            visible.length
          ]
          :target;

      const a=
        Math.atan2(
          t.y-player.y,
          t.x-player.x
        )+
        (
          Math.random()-.5
        )*
        .35;

      createBullet(
        a,
        w,
        {
          type:"swarm",
          homingStrength:
            w.homingStrength,
          explosionRadius:
            w.explosionRadius,
          explosionDamage:
            w.explosionDamage,
          life:3500
        }
      );
    }

    return;
  }

  if(w.type==="flame"){
    for(
      let i=0;
      i<1+multi;
      i++
    ){
      createBullet(
        angle+
        (
          Math.random()-.5
        )*
        w.spread,

        w,

        {
          type:"flame",

          life:550,

          speed:
            w.bulletSpeed*
            (
              .8+
              Math.random()*.4
            ),

          radius:
            w.bulletSize+
            Math.random()*4
        }
      );
    }

    return;
  }

  if(w.type==="nova"){
    createBullet(
      angle,
      w
    );

    const n=
      w.sideShots+
      effectiveStacks(
        "overdrive"
      )+
      multi;

    for(let i=1;i<=n;i++){
      createBullet(
        angle-.18*i,
        w
      );

      createBullet(
        angle+.18*i,
        w
      );
    }

    return;
  }

  createBullet(
    angle,
    w
  );

  for(
    let i=1;
    i<=
    effectiveStacks("overdrive")+
    multi;
    i++
  ){
    const s=.1*i;

    createBullet(
      angle-s,
      w
    );

    createBullet(
      angle+s,
      w
    );
  }
}

function createExplosion(
  x,
  y,
  radius,
  damage,
  duration=300,
  color="#c45cff"
){
  explosions.push({
    x,y,

    radius:0,
    maxRadius:radius,

    life:duration,
    duration,

    color
  });

  for(const e of enemies){
    if(e.dead)continue;

    const d=
      Math.hypot(
        e.x-x,
        e.y-y
      );

    if(d<radius){
      damageEnemy(
        e,

        damage*
        (
          .4+
          (
            1-
            d/radius
          )*
          .6
        )
      );
    }
  }
}

function addStack(
  key,
  duration
){
  const b=buffs[key];

  b.stacks=
    Math.min(
      b.maxStacks,
      b.stacks+1
    );

  b.time=
    Math.min(
      60000,
      b.time+duration
    );
}

function nukeCoinVacuum(){
  for(const c of coinDrops){
    c.nukeVacuum=true;
  }
}

function activatePowerup(key){
  if(key==="heal"){
    player.health=
      Math.min(
        player.maxHealth,
        player.health+80
      );
  }

  else if(key==="shield"){
    player.shield=
      Math.min(
        300,
        player.shield+100
      );
  }

  else if(key==="quad"){
    addStack(
      "quad",
      14000
    );
  }

  else if(key==="haste"){
    addStack(
      "haste",
      16000
    );
  }

  else if(key==="overdrive"){
    addStack(
      "overdrive",
      14000
    );
  }

  else if(key==="magnet"){
    addStack(
      "magnet",
      20000
    );
  }

  else if(key==="berserk"){
    addStack(
      "berserk",
      15000
    );
  }

  else if(key==="fmj"){
    addStack(
      "fmj",
      22000
    );
  }

  else if(key==="chain"){
    addStack(
      "chain",
      20000
    );
  }

  else if(key==="lightning"){
    addStack(
      "lightning",
      20000
    );
  }

  else if(key==="meteors"){
    addStack(
      "meteors",
      20000
    );
  }

  else if(key==="multishot"){
    addStack(
      "multishot",
      22000
    );
  }

  else if(key==="ricochet"){
    addStack(
      "ricochet",
      22000
    );
  }

  else if(key==="chainreaction"){
    addStack(
      "chainreaction",
      22000
    );
  }

  else if(key==="vampire"){
    addStack(
      "vampire",
      24000
    );
  }

  else if(key==="coinrush"){
    addStack(
      "coinrush",
      22000
    );
  }

  else if(key==="powersurge"){
    buffs.powersurge.stacks=1;
    buffs.powersurge.time=5500;
  }

  else if(key==="nuke"){
    createExplosion(
      player.x,
      player.y,

      Math.max(
        width,
        height
      )*
      1.45,

      999999,

      550,

      "#fff"
    );

    nukeCoinVacuum();
  }
}

function startDash(){
  if(
    !gameRunning ||
    dashCooldown>0 ||
    dashTime>0
  ){
    return;
  }

  let dx=0;
  let dy=0;

  if(keys.w||keys.arrowup)dy--;
  if(keys.s||keys.arrowdown)dy++;
  if(keys.a||keys.arrowleft)dx--;
  if(keys.d||keys.arrowright)dx++;

  if(!dx&&!dy){
    dx=player.lastDX;
    dy=player.lastDY;
  }

  const d=
    Math.hypot(
      dx,
      dy
    )||1;

  player.dashVX=
    dx/d*
    900;

  player.dashVY=
    dy/d*
    900;

  dashTime=.18;
  dashCooldown=1.05;
}

function updatePlayer(dt){
  if(dashCooldown>0){
    dashCooldown-=dt;
  }

  if(dashTime>0){
    dashTime-=dt;

    player.x+=
      player.dashVX*
      dt;

    player.y+=
      player.dashVY*
      dt;
  }

  else{
    let dx=0;
    let dy=0;

    if(keys.w||keys.arrowup)dy--;
    if(keys.s||keys.arrowdown)dy++;
    if(keys.a||keys.arrowleft)dx--;
    if(keys.d||keys.arrowright)dx++;

    const speed=
      player.speed*
      (
        1+
        effectiveStacks(
          "berserk"
        )*
        .12
      );

    if(dx||dy){
      const d=
        Math.hypot(dx,dy);

      dx/=d;
      dy/=d;

      player.lastDX=dx;
      player.lastDY=dy;

      player.x+=
        dx*
        speed*
        dt;

      player.y+=
        dy*
        speed*
        dt;
    }

    else if(pointerActive){
      dx=
        pointerX-
        player.x;

      dy=
        pointerY-
        player.y;

      const d=
        Math.hypot(dx,dy);

      if(d>5){
        dx/=d;
        dy/=d;

        player.lastDX=dx;
        player.lastDY=dy;

        const m=
          Math.min(
            speed*dt,
            d
          );

        player.x+=dx*m;
        player.y+=dy*m;
      }
    }
  }

  player.x=
    Math.max(
      player.radius,

      Math.min(
        width-
        player.radius,

        player.x
      )
    );

  player.y=
    Math.max(
      player.radius,

      Math.min(
        height-
        player.radius,

        player.y
      )
    );
}

function updateEnemies(dt){
  for(
    let i=
      enemies.length-1;

    i>=0;

    i--
  ){
    const e=enemies[i];

    if(e.dead){
      enemies.splice(
        i,
        1
      );

      continue;
    }

    let maxSpeed=
      e.baseMaxSpeed;

    if(e.slowTimer>0){
      e.slowTimer-=
        dt*
        1000;

      maxSpeed*=.5;
    }

    if(e.burnTime>0){
      e.burnTime-=
        dt*
        1000;

      e.burnTick-=
        dt*
        1000;

      if(e.burnTick<=0){
        e.burnTick=250;

        damageEnemy(
          e,
          e.burnDamage
        );
      }
    }

    const dx=
      player.x-
      e.x;

    const dy=
      player.y-
      e.y;

    const d=
      Math.hypot(
        dx,
        dy
      )||1;

    const desiredVX=
      dx/d*
      maxSpeed;

    const desiredVY=
      dy/d*
      maxSpeed;

    let sx=
      desiredVX-
      e.vx;

    let sy=
      desiredVY-
      e.vy;

    const sl=
      Math.hypot(
        sx,
        sy
      );

    const maxSteer=
      e.steering*
      dt;

    if(
      sl>maxSteer &&
      sl>0
    ){
      sx=
        sx/sl*
        maxSteer;

      sy=
        sy/sl*
        maxSteer;
    }

    e.vx+=sx;
    e.vy+=sy;

    const v=
      Math.hypot(
        e.vx,
        e.vy
      );

    if(v>maxSpeed){
      e.vx=
        e.vx/v*
        maxSpeed;

      e.vy=
        e.vy/v*
        maxSpeed;
    }

    e.x+=e.vx*dt;
    e.y+=e.vy*dt;

    e.hitCooldown-=
      dt*
      1000;

    if(
      dashTime<=0 &&
      touching(player,e) &&
      e.hitCooldown<=0
    ){
      let damage=
        e.damage;

      if(player.shield>0){
        const absorbed=
          Math.min(
            player.shield,
            damage
          );

        player.shield-=
          absorbed;

        damage-=
          absorbed;
      }

      player.health-=
        damage;

      e.hitCooldown=
        650;

      e.vx-=
        dx/d*
        90;

      e.vy-=
        dy/d*
        90;

      if(player.health<=0){
        player.health=0;
        endGame();
      }
    }
  }
}

function ricochetBullet(b,e){
  if(b.ricochets<=0){
    return false;
  }

  const excluded=
    new Set(
      b.hitEnemies
    );

  const next=
    findNearestEnemy(
      e,
      excluded,
      true
    );

  if(!next){
    return false;
  }

  const a=
    Math.atan2(
      next.y-e.y,
      next.x-e.x
    );

  const speed=
    Math.hypot(
      b.vx,
      b.vy
    );

  b.x=e.x;
  b.y=e.y;

  b.angle=a;

  b.vx=
    Math.cos(a)*
    speed;

  b.vy=
    Math.sin(a)*
    speed;

  b.ricochets--;

  return true;
}

function prismSplit(b,e){
  if(
    b.type!=="prism" ||
    b.splits<=0
  ){
    return;
  }

  const candidates=
    enemies
      .filter(
        x=>
          !x.dead &&
          x!==e &&
          onScreen(x) &&
          Math.hypot(
            x.x-e.x,
            x.y-e.y
          )<
          b.splitRange
      )
      .sort(
        (a,c)=>
          dist(e,a)-
          dist(e,c)
      )
      .slice(
        0,
        b.splits+
        effectiveStacks(
          "multishot"
        )
      );

  for(const t of candidates){
    const a=
      Math.atan2(
        t.y-e.y,
        t.x-e.x
      );

    createBullet(
      a,
      WEAPONS.prism,

      {
        x:e.x,
        y:e.y,

        damage:
          b.damage*.65,

        type:"prismShard",

        speed:950,

        radius:5,

        pierce:
          effectiveStacks(
            "fmj"
          ),

        life:900
      }
    );
  }
}

function updateBullets(dt){
  for(
    let i=
      bullets.length-1;

    i>=0;

    i--
  ){
    const b=bullets[i];

    b.life-=
      dt*
      1000;

    if(
      b.type==="homing" ||
      b.type==="swarm"
    ){
      const target=
        findNearestEnemy(
          b,
          b.hitEnemies,
          true
        );

      if(target){
        const ta=
          Math.atan2(
            target.y-b.y,
            target.x-b.x
          );

        const diff=
          Math.atan2(
            Math.sin(
              ta-b.angle
            ),
            Math.cos(
              ta-b.angle
            )
          );

        b.angle+=
          diff*
          b.homingStrength*
          dt;

        const speed=
          Math.hypot(
            b.vx,
            b.vy
          );

        b.vx=
          Math.cos(
            b.angle
          )*
          speed;

        b.vy=
          Math.sin(
            b.angle
          )*
          speed;
      }
    }

    if(b.type==="singularity"){
      for(const e of enemies){
        if(e.dead)continue;

        const dx=
          b.x-e.x;

        const dy=
          b.y-e.y;

        const d=
          Math.hypot(
            dx,
            dy
          );

        if(
          d>1 &&
          d<b.pullRadius
        ){
          const f=
            b.pullStrength*
            (
              1-
              d/b.pullRadius
            )*
            dt;

          e.vx+=
            dx/d*f;

          e.vy+=
            dy/d*f;
        }
      }
    }

    b.x+=
      b.vx*
      dt;

    b.y+=
      b.vy*
      dt;

    const expired=
      b.life<=0 ||
      b.x<-180 ||
      b.x>width+180 ||
      b.y<-180 ||
      b.y>height+180;

    if(expired){
      if(
        b.type==="singularity"
      ){
        createExplosion(
          b.x,
          b.y,

          b.explosionRadius,
          b.explosionDamage,

          350,

          b.color
        );
      }

      bullets.splice(
        i,
        1
      );

      continue;
    }

    let remove=false;

    for(const e of enemies){
      if(
        e.dead ||
        b.hitEnemies.has(e)
      ){
        continue;
      }

      if(!touching(b,e)){
        continue;
      }

      b.hitEnemies.add(e);

      damageEnemy(
        e,
        b.damage,
        b.knockback,
        b.angle
      );

      if(
        effectiveStacks(
          "chain"
        )
      ){
        chainFromEnemy(
          e,

          b.damage*.45,

          1+
          effectiveStacks(
            "chain"
          ),

          120+
          effectiveStacks(
            "chain"
          )*
          45,

          "#00ffff",

          b.hitEnemies
        );
      }

      if(b.type==="frost"){
        e.slowTimer=
          b.slowTime;
      }

      if(b.type==="flame"){
        e.burnTime=
          Math.max(
            e.burnTime,
            b.burnTime
          );

        e.burnDamage=
          Math.max(
            e.burnDamage,
            b.burnDamage*
            damageMult()
          );

        e.burnTick=0;
      }

      prismSplit(
        b,
        e
      );

      if(
        b.type==="explosive" ||
        b.type==="singularity" ||
        b.type==="swarm"
      ){
        createExplosion(
          b.x,
          b.y,

          b.explosionRadius,
          b.explosionDamage,

          b.type==="singularity"
            ?350
            :250,

          b.color
        );

        remove=true;

        break;
      }

      if(
        ricochetBullet(
          b,
          e
        )
      ){
        break;
      }

      if(b.pierce>0){
        b.pierce--;
        continue;
      }

      remove=true;
      break;
    }

    if(remove){
      bullets.splice(
        i,
        1
      );
    }
  }
}

function updateLightning(dt){
  if(
    !effectiveStacks(
      "lightning"
    )
  ){
    return;
  }

  lightningTimer+=
    dt*
    1000;

  const s=
    effectiveStacks(
      "lightning"
    );

  const rate=
    Math.max(
      320,
      1200-s*180
    );

  if(
    lightningTimer<
    rate
  ){
    return;
  }

  lightningTimer=0;

  const visible=
    enemies.filter(
      e=>
        !e.dead &&
        onScreen(e)
    );

  if(!visible.length){
    return;
  }

  const target=
    visible[
      Math.floor(
        Math.random()*
        visible.length
      )
    ];

  const damage=
    45+
    s*20;

  lightningEffects.push({
    x1:
      target.x+
      (
        Math.random()-.5
      )*
      50,

    y1:-20,

    x2:target.x,
    y2:target.y,

    life:180,

    color:"#68f7ff"
  });

  damageEnemy(
    target,
    damage
  );

  chainFromEnemy(
    target,

    damage*.7,

    1+s*2,

    150+s*35,

    "#68f7ff"
  );
}

function updateMeteors(dt){
  if(
    !effectiveStacks(
      "meteors"
    )
  ){
    return;
  }

  meteorTimer+=
    dt*
    1000;

  const s=
    effectiveStacks(
      "meteors"
    );

  const rate=
    Math.max(
      450,
      1500-s*220
    );

  if(
    meteorTimer<
    rate
  ){
    return;
  }

  meteorTimer=0;

  const visible=
    enemies.filter(
      e=>
        !e.dead &&
        onScreen(e)
    );

  let x,y;

  if(
    visible.length &&
    Math.random()<.65
  ){
    const e=
      visible[
        Math.floor(
          Math.random()*
          visible.length
        )
      ];

    x=
      e.x+
      (
        Math.random()-.5
      )*
      90;

    y=
      e.y+
      (
        Math.random()-.5
      )*
      90;
  }

  else{
    x=
      50+
      Math.random()*
      Math.max(
        1,
        width-100
      );

    y=
      70+
      Math.random()*
      Math.max(
        1,
        height-140
      );
  }

  meteors.push({
    x,y,

    life:650,
    duration:650,

    radius:
      34+
      s*7,

    damage:
      70+
      s*28
  });
}

function updateMeteorObjects(dt){
  for(
    let i=
      meteors.length-1;

    i>=0;

    i--
  ){
    const m=meteors[i];

    m.life-=
      dt*
      1000;

    if(m.life<=0){
      createExplosion(
        m.x,
        m.y,

        m.radius,
        m.damage,

        300,

        "#ff6b35"
      );

      meteors.splice(
        i,
        1
      );
    }
  }
}

function updateSolarBlades(dt){
  const w=weapon();

  if(w.type!=="orbit"){
    return;
  }

  orbitAngle+=
    dt*
    3.8;

  const count=
    w.blades+
    effectiveStacks(
      "overdrive"
    )+
    effectiveStacks(
      "multishot"
    );

  for(let i=0;i<count;i++){
    const a=
      orbitAngle+
      Math.PI*2/count*i;

    const blade={
      x:
        player.x+
        Math.cos(a)*72,

      y:
        player.y+
        Math.sin(a)*72,

      radius:12
    };

    for(const e of enemies){
      if(e.dead)continue;

      if(
        touching(blade,e) &&
        performance.now()-
        e.bladeHit>
        230
      ){
        damageEnemy(
          e,
          w.damage
        );

        e.bladeHit=
          performance.now();

        if(
          effectiveStacks(
            "chain"
          )
        ){
          chainFromEnemy(
            e,

            w.damage*.35,

            effectiveStacks(
              "chain"
            ),

            130+
            effectiveStacks(
              "chain"
            )*
            35,

            "#00ffff"
          );
        }
      }
    }
  }
}

function pullTowardPlayer(
  p,
  dt,
  range,
  speed
){
  const dx=
    player.x-p.x;

  const dy=
    player.y-p.y;

  const d=
    Math.hypot(
      dx,
      dy
    );

  if(
    d>1 &&
    d<range
  ){
    p.x+=
      dx/d*
      speed*
      dt;

    p.y+=
      dy/d*
      speed*
      dt;
  }
}

function updatePickups(dt){
  for(
    let i=
      weaponPickups.length-1;

    i>=0;

    i--
  ){
    const p=
      weaponPickups[i];

    p.life-=
      dt*
      1000;

    if(p.life<=0){
      weaponPickups.splice(
        i,
        1
      );

      continue;
    }

    if(
      touching(
        player,
        p
      )
    ){
      player.weaponKey=
        p.weaponKey;

      weaponPickups.splice(
        i,
        1
      );
    }
  }

  for(
    let i=
      powerups.length-1;

    i>=0;

    i--
  ){
    const p=
      powerups[i];

    p.life-=
      dt*
      1000;

    p.pulse+=
      dt*
      5;

    if(
      effectiveStacks(
        "magnet"
      )
    ){
      pullTowardPlayer(
        p,
        dt,

        130+
        effectiveStacks(
          "magnet"
        )*
        25,

        220+
        effectiveStacks(
          "magnet"
        )*
        35
      );
    }

    if(p.life<=0){
      powerups.splice(
        i,
        1
      );

      continue;
    }

    if(
      touching(
        player,
        p
      )
    ){
      activatePowerup(
        p.key
      );

      powerups.splice(
        i,
        1
      );
    }
  }
}

function updateCoins(dt){
  for(
    let i=
      coinDrops.length-1;

    i>=0;

    i--
  ){
    const c=
      coinDrops[i];

    c.life-=
      dt*
      1000;

    c.x+=
      c.vx*
      dt;

    c.y+=
      c.vy*
      dt;

    c.vx*=
      Math.pow(
        .02,
        dt
      );

    c.vy*=
      Math.pow(
        .02,
        dt
      );

    if(c.nukeVacuum){
      pullTowardPlayer(
        c,
        dt,
        99999,
        1050
      );
    }

    else if(
      effectiveStacks(
        "magnet"
      )
    ){
      pullTowardPlayer(
        c,
        dt,

        165+
        effectiveStacks(
          "magnet"
        )*
        35,

        360+
        effectiveStacks(
          "magnet"
        )*
        45
      );
    }

    else{
      pullTowardPlayer(
        c,
        dt,
        90,
        430
      );
    }

    if(c.life<=0){
      coinDrops.splice(
        i,
        1
      );

      continue;
    }

    if(
      touching(
        player,
        c
      )
    ){
      coins+=c.value;

      coinDrops.splice(
        i,
        1
      );
    }
  }
}

function updateBuffs(dt){
  const ms=
    dt*
    1000;

  for(const k in buffs){
    const b=buffs[k];

    if(!b.time){
      continue;
    }

    b.time-=ms;

    if(b.time<=0){
      b.time=0;
      b.stacks=0;
    }
  }
}

function updateEffects(dt){
  for(
    let i=
      particles.length-1;

    i>=0;

    i--
  ){
    const p=
      particles[i];

    p.vy+=
      (p.gravity||0)*
      dt;

    p.x+=
      p.vx*
      dt;

    p.y+=
      p.vy*
      dt;

    p.life-=
      dt*
      1000;

    if(p.life<=0){
      particles.splice(
        i,
        1
      );
    }
  }

  for(
    let i=
      explosions.length-1;

    i>=0;

    i--
  ){
    const e=
      explosions[i];

    e.life-=
      dt*
      1000;

    e.radius=
      Math.max(
        0,

        e.maxRadius*
        Math.max(
          0,

          Math.min(
            1,

            1-
            e.life/
            e.duration
          )
        )
      );

    if(e.life<=0){
      explosions.splice(
        i,
        1
      );
    }
  }

  for(
    let i=
      lightningEffects.length-1;

    i>=0;

    i--
  ){
    lightningEffects[i].life-=
      dt*
      1000;

    if(
      lightningEffects[i]
        .life<=0
    ){
      lightningEffects.splice(
        i,
        1
      );
    }
  }
}

function drawBackground(){
  ctx.fillStyle="#111820";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  ctx.strokeStyle=
    "rgba(255,255,255,.035)";

  ctx.lineWidth=1;

  for(
    let x=0;
    x<width;
    x+=50
  ){
    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      height
    );

    ctx.stroke();
  }

  for(
    let y=0;
    y<height;
    y+=50
  ){
    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();
  }
}

function drawPlayer(){
  if(
    buffs.powersurge.time>0
  ){
    ctx.save();

    ctx.shadowBlur=35;
    ctx.shadowColor="#fff";

    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,

      player.radius+
      18+
      Math.sin(
        performance.now()/70
      )*
      5,

      0,
      Math.PI*2
    );

    ctx.strokeStyle="#fff";
    ctx.lineWidth=5;

    ctx.stroke();

    ctx.restore();
  }

  if(player.shield>0){
    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,
      player.radius+8,
      0,
      Math.PI*2
    );

    ctx.strokeStyle="#55cfff";
    ctx.lineWidth=4;

    ctx.stroke();
  }

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    player.radius,
    0,
    Math.PI*2
  );

  ctx.fillStyle=
    dashTime>0
      ?"#fff"
      :player.color;

  ctx.fill();

  ctx.strokeStyle="#fff";
  ctx.lineWidth=3;

  ctx.stroke();
}

function drawEnemies(){
  for(const e of enemies){
    const size=
      e.radius*
      2.65;

    if(
      hippoImage.complete &&
      hippoImage.naturalWidth
    ){
      ctx.drawImage(
        hippoImage,

        e.x-size/2,
        e.y-size/2,

        size,
        size
      );
    }

    else{
      ctx.beginPath();

      ctx.arc(
        e.x,
        e.y,
        e.radius,
        0,
        Math.PI*2
      );

      ctx.fillStyle="#ff456c";

      ctx.fill();
    }

    if(e.health<e.maxHealth){
      const w=32;

      ctx.fillStyle="#250000";

      ctx.fillRect(
        e.x-w/2,
        e.y-e.radius-8,
        w,
        4
      );

      ctx.fillStyle="#ff4444";

      ctx.fillRect(
        e.x-w/2,
        e.y-e.radius-8,

        w*
        Math.max(
          0,
          e.health/
          e.maxHealth
        ),

        4
      );
    }
  }
}

function drawCoins(){
  for(const c of coinDrops){
    ctx.save();

    ctx.shadowBlur=
      c.nukeVacuum
        ?18
        :8;

    ctx.shadowColor="#ffd700";

    ctx.beginPath();

    ctx.arc(
      c.x,
      c.y,
      c.radius,
      0,
      Math.PI*2
    );

    ctx.fillStyle="#ffd700";

    ctx.fill();

    ctx.strokeStyle="#fff2a8";
    ctx.lineWidth=2;

    ctx.stroke();

    ctx.restore();
  }
}

function drawBullets(){
  for(const b of bullets){
    ctx.save();

    ctx.shadowBlur=
      b.type==="singularity"
        ?25
        :12;

    ctx.shadowColor=
      b.color;

    ctx.beginPath();

    ctx.arc(
      b.x,
      b.y,
      Math.max(
        0,
        b.radius
      ),
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      b.color;

    ctx.fill();

    if(
      b.type==="singularity"
    ){
      ctx.beginPath();

      ctx.arc(
        b.x,
        b.y,
        b.radius+8,
        0,
        Math.PI*2
      );

      ctx.strokeStyle=
        "rgba(255,255,255,.6)";

      ctx.lineWidth=2;

      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawSolarBlades(){
  const w=weapon();

  if(w.type!=="orbit"){
    return;
  }

  const count=
    w.blades+
    effectiveStacks(
      "overdrive"
    )+
    effectiveStacks(
      "multishot"
    );

  for(let i=0;i<count;i++){
    const a=
      orbitAngle+
      Math.PI*2/count*i;

    const x=
      player.x+
      Math.cos(a)*72;

    const y=
      player.y+
      Math.sin(a)*72;

    ctx.save();

    ctx.translate(
      x,
      y
    );

    ctx.rotate(a);

    ctx.shadowBlur=15;
    ctx.shadowColor=w.color;

    ctx.fillStyle=w.color;

    ctx.fillRect(
      -5,
      -18,
      10,
      36
    );

    ctx.restore();
  }
}

function drawWeaponPickups(){
  for(const p of weaponPickups){
    const w=
      WEAPONS[
        p.weaponKey
      ];

    ctx.save();

    ctx.shadowBlur=18;
    ctx.shadowColor=w.color;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI*2
    );

    ctx.fillStyle="#111";

    ctx.fill();

    ctx.strokeStyle=w.color;
    ctx.lineWidth=4;

    ctx.stroke();

    ctx.fillStyle="#fff";

    ctx.font=
      "bold 9px Arial";

    ctx.textAlign=
      "center";

    ctx.textBaseline=
      "middle";

    const words=
      w.name.split(" ");

    if(words.length>1){
      ctx.fillText(
        words[0],
        p.x,
        p.y-5
      );

      ctx.fillText(
        words
          .slice(1)
          .join(" "),

        p.x,
        p.y+6
      );
    }

    else{
      ctx.fillText(
        w.name,
        p.x,
        p.y
      );
    }

    ctx.restore();
  }
}

function drawPowerups(){
  for(const p of powerups){
    const data=
      POWERUPS[p.key];

    const pulse=
      1+
      Math.sin(
        p.pulse
      )*
      .12;

    ctx.save();

    ctx.shadowBlur=
      p.key==="powersurge"
        ?35
        :20;

    ctx.shadowColor=
      data.color;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,

      p.radius*
      pulse*
      (
        p.key==="powersurge"
          ?1.25
          :1
      ),

      0,
      Math.PI*2
    );

    ctx.fillStyle=
      data.color;

    ctx.fill();

    if(
      p.key==="powersurge"
    ){
      ctx.strokeStyle="#ffd700";
      ctx.lineWidth=5;
      ctx.stroke();
    }

    ctx.fillStyle=
      p.key==="powersurge"
        ?"#ff5a00"
        :"#111";

    ctx.font=
      p.key==="powersurge"
        ?"bold 9px Arial"
        :"bold 8px Arial";

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.fillText(
      data.name,
      p.x,
      p.y
    );

    ctx.restore();
  }
}

function drawMeteors(){
  for(const m of meteors){
    const t=
      m.life/
      m.duration;

    ctx.save();

    ctx.globalAlpha=
      .4+
      .6*
      (1-t);

    ctx.beginPath();

    ctx.arc(
      m.x,
      m.y,

      m.radius*
      (
        .7+
        .3*
        (1-t)
      ),

      0,
      Math.PI*2
    );

    ctx.strokeStyle="#ff6b35";
    ctx.lineWidth=4;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      m.x-70*t,
      m.y-130*t
    );

    ctx.lineTo(
      m.x,
      m.y
    );

    ctx.strokeStyle="#ffd08a";
    ctx.lineWidth=8;

    ctx.stroke();

    ctx.restore();
  }
}

function drawEffects(){
  for(const p of particles){
    ctx.save();

    ctx.globalAlpha=
      Math.min(
        1,
        p.life/250
      );

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      p.color||"#fff";

    ctx.fill();

    ctx.restore();
  }

  for(const e of explosions){
    ctx.save();

    ctx.globalAlpha=
      Math.max(
        0,
        e.life/
        e.duration
      );

    ctx.beginPath();

    ctx.arc(
      e.x,
      e.y,
      e.radius,
      0,
      Math.PI*2
    );

    ctx.strokeStyle=e.color;
    ctx.lineWidth=10;

    ctx.stroke();

    ctx.restore();
  }

  for(const l of lightningEffects){
    ctx.save();

    ctx.shadowBlur=15;
    ctx.shadowColor=l.color;

    ctx.strokeStyle=l.color;
    ctx.lineWidth=4;

    ctx.beginPath();

    ctx.moveTo(
      l.x1,
      l.y1
    );

    for(let i=1;i<5;i++){
      const t=i/5;

      ctx.lineTo(
        l.x1+
        (
          l.x2-l.x1
        )*
        t+
        (
          Math.random()-.5
        )*
        15,

        l.y1+
        (
          l.y2-l.y1
        )*
        t+
        (
          Math.random()-.5
        )*
        15
      );
    }

    ctx.lineTo(
      l.x2,
      l.y2
    );

    ctx.stroke();

    ctx.restore();
  }
}

function drawBuffs(){
  let y=62;

  const labels={
    quad:"DAMAGE",
    haste:"HASTE",
    overdrive:"OVERDRIVE",
    magnet:"MAGNET",
    berserk:"BERSERK",
    fmj:"FMJ",
    chain:"CHAIN",
    lightning:"LIGHTNING",
    meteors:"METEORS",
    multishot:"MULTI",
    ricochet:"RICOCHET",
    chainreaction:"REACTION",
    vampire:"VAMPIRE",
    coinrush:"COIN RUSH",
    powersurge:"POWER SURGE"
  };

  ctx.textAlign="left";

  ctx.font=
    "bold 12px Arial";

  for(const k in buffs){
    const b=buffs[k];

    if(
      !b.stacks ||
      !b.time
    ){
      continue;
    }

    ctx.fillStyle=
      k==="powersurge"
        ?"#ffd700"
        :"#fff";

    ctx.font=
      k==="powersurge"
        ?"bold 17px Arial"
        :"bold 12px Arial";

    ctx.fillText(
      `${labels[k]} x${b.stacks} ${(b.time/1000).toFixed(1)}s`,
      12,
      y
    );

    y+=
      k==="powersurge"
        ?23
        :17;
  }

  ctx.font=
    "bold 12px Arial";

  if(player.shield>0){
    ctx.fillStyle="#70dcff";

    ctx.fillText(
      `SHIELD ${Math.ceil(player.shield)}`,
      12,
      y
    );
  }
}

function updateHUD(){
  healthText.textContent=
    `HP: ${Math.ceil(player.health)}`;

  weaponText.textContent=
    weapon().name;

  scoreText.textContent=
    `Score: ${score} | Coins: ${coins}`;
}

function endGame(){
  gameRunning=false;

  finalScore.textContent=
    `Score: ${score} | Coins: ${coins}`;

  gameOverScreen.classList.remove(
    "hidden"
  );
}

function resetGame(){
  enemies=[];
  bullets=[];
  weaponPickups=[];
  powerups=[];
  coinDrops=[];
  explosions=[];
  particles=[];
  lightningEffects=[];
  meteors=[];

  score=0;
  kills=0;
  coins=0;
  survivalTime=0;

  player.x=width/2;
  player.y=height/2;

  player.health=
    player.maxHealth;

  player.shield=0;

  player.weaponKey=
    "pistol";

  player.lastDX=1;
  player.lastDY=0;

  for(const k in buffs){
    buffs[k].stacks=0;
    buffs[k].time=0;
  }

  for(const k in keys){
    keys[k]=false;
  }

  weaponBag=[];

  refillWeaponBag();

  lastShot=0;

  enemySpawnTimer=0;
  weaponSpawnTimer=0;
  powerupSpawnTimer=0;

  lightningTimer=0;
  meteorTimer=0;

  orbitAngle=0;

  dashTime=0;
  dashCooldown=0;

  pointerActive=false;

  gameRunning=true;

  gameOverScreen.classList.add(
    "hidden"
  );

  spawnWeaponPickup();
  spawnWeaponPickup();
  spawnPowerup();

  lastTime=
    performance.now();
}

restartButton.addEventListener(
  "click",
  resetGame
);

function gameLoop(time){
  const dt=
    Math.min(
      (
        time-
        lastTime
      )/
      1000,

      .05
    );

  lastTime=time;

  drawBackground();

  if(gameRunning){
    survivalTime+=dt;

    enemySpawnTimer+=
      dt*
      1000;

    weaponSpawnTimer+=
      dt*
      1000;

    powerupSpawnTimer+=
      dt*
      1000;

    const alive=
      enemies.filter(
        e=>!e.dead
      ).length;

    const enemyRate=
      Math.max(
        95,

        1150-
        score*1.1-
        survivalTime*2.2
      );

    const powerupRate=
      Math.max(
        1800,

        9000-
        alive*150-
        survivalTime*12
      );

    if(
      enemySpawnTimer>=
      enemyRate
    ){
      enemySpawnTimer=0;

      const count=
        score>1500
          ?2
          :1;

      for(let i=0;i<count;i++){
        spawnEnemy();
      }
    }

    if(
      weaponSpawnTimer>=
      8500
    ){
      weaponSpawnTimer=0;

      spawnWeaponPickup();
    }

    if(
      powerupSpawnTimer>=
      powerupRate
    ){
      powerupSpawnTimer=0;

      let count=1;

      if(alive>=18){
        count=2;
      }

      if(alive>=32){
        count=3;
      }

      for(let i=0;i<count;i++){
        spawnPowerup();
      }
    }

    updatePlayer(dt);
    updateEnemies(dt);
    updateBullets(dt);
    updateSolarBlades(dt);

    updateLightning(dt);

    updateMeteors(dt);
    updateMeteorObjects(dt);

    updatePickups(dt);
    updateCoins(dt);

    updateBuffs(dt);
    updateEffects(dt);

    shoot(time);

    updateHUD();
  }

  drawWeaponPickups();
  drawPowerups();
  drawCoins();

  drawEnemies();

  drawBullets();
  drawSolarBlades();

  drawMeteors();

  drawPlayer();

  drawEffects();
  drawBuffs();

  requestAnimationFrame(
    gameLoop
  );
}

resizeCanvas();

player.x=
  width/2;

player.y=
  height/2;

refillWeaponBag();

spawnWeaponPickup();
spawnWeaponPickup();
spawnPowerup();

updateHUD();

lastTime=
  performance.now();

requestAnimationFrame(
  gameLoop
);
