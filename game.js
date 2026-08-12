const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
const healthText=document.getElementById("healthText"),weaponText=document.getElementById("weaponText"),scoreText=document.getElementById("scoreText");
const gameOverScreen=document.getElementById("gameOverScreen"),finalScore=document.getElementById("finalScore"),restartButton=document.getElementById("restartButton");

let width=0,height=0,pixelRatio=1,gameRunning=true,score=0,coins=0,lastTime=0,lastShot=0,survivalTime=0;
let enemySpawnTimer=0,weaponSpawnTimer=0,powerupSpawnTimer=0,teslaTimer=0,orbitAngle=0;
let enemies=[],bullets=[],weaponPickups=[],powerups=[],coinDrops=[],explosions=[],lightningEffects=[],particles=[],weaponBag=[];

const hippoImage=new Image();
hippoImage.src="hippo.png";

const player={
  x:0,y:0,
  radius:18,
  hitRadius:10,
  speed:295,
  health:150,maxHealth:150,
  shield:0,
  color:"#55ccff",
  weaponKey:"pistol"
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
  singularity:{name:"Singularity Gun",type:"singularity",damage:35,fireRate:1250,bulletSpeed:380,bulletSize:16,pullRadius:180,pullStrength:170,explosionRadius:115,explosionDamage:85,color:"#6d3cff"}
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
  tesla:{name:"TESLA",color:"#68f7ff"}
};

const buffs={
  quad:{stacks:0,time:0,maxStacks:3},
  haste:{stacks:0,time:0,maxStacks:3},
  overdrive:{stacks:0,time:0,maxStacks:3},
  magnet:{stacks:0,time:0,maxStacks:2},
  berserk:{stacks:0,time:0,maxStacks:3},
  fmj:{stacks:0,time:0,maxStacks:3},
  chain:{stacks:0,time:0,maxStacks:3},
  tesla:{stacks:0,time:0,maxStacks:3}
};

let pointerActive=false,pointerX=0,pointerY=0;
const keys={};

function resizeCanvas(){
  pixelRatio=Math.min(window.devicePixelRatio||1,2);
  width=window.innerWidth;height=window.innerHeight;
  canvas.width=width*pixelRatio;canvas.height=height*pixelRatio;
  canvas.style.width=width+"px";canvas.style.height=height+"px";
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
}
window.addEventListener("resize",resizeCanvas);

canvas.addEventListener("mousedown",e=>{if(e.button!==0)return;pointerActive=true;pointerX=e.clientX;pointerY=e.clientY});
window.addEventListener("mousemove",e=>{if(pointerActive){pointerX=e.clientX;pointerY=e.clientY}});
window.addEventListener("mouseup",e=>{if(e.button===0)pointerActive=false});

window.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();keys[k]=true;
  if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k))e.preventDefault();
});
window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
window.addEventListener("blur",()=>{pointerActive=false;for(const k in keys)keys[k]=false});

canvas.addEventListener("touchstart",e=>{
  e.preventDefault();
  const t=e.touches[0];
  pointerActive=true;pointerX=t.clientX;pointerY=t.clientY;
},{passive:false});

canvas.addEventListener("touchmove",e=>{
  e.preventDefault();
  const t=e.touches[0];
  pointerX=t.clientX;pointerY=t.clientY;
},{passive:false});

canvas.addEventListener("touchend",e=>{e.preventDefault();pointerActive=false},{passive:false});
canvas.addEventListener("touchcancel",()=>pointerActive=false);

const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const radiusOf=o=>o.hitRadius??o.radius;
const touching=(a,b)=>{
  const r=radiusOf(a)+radiusOf(b),dx=a.x-b.x,dy=a.y-b.y;
  return dx*dx+dy*dy<r*r;
};
const randomPos=(p=80)=>({
  x:p+Math.random()*Math.max(1,width-p*2),
  y:p+Math.random()*Math.max(1,height-p*2)
});

function onScreen(e){
  const half=e.radius*1.325,pad=14;
  return e.x-half>=pad&&e.x+half<=width-pad&&e.y-half>=pad&&e.y+half<=height-pad;
}

function refillWeaponBag(){
  weaponBag=["plasma","shotgun","railgun","void","arc","starfire","frost","solar","nova","singularity"];
  for(let i=weaponBag.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [weaponBag[i],weaponBag[j]]=[weaponBag[j],weaponBag[i]];
  }
}

function spawnEnemy(){
  const side=Math.floor(Math.random()*4),m=50;
  let x,y;

  if(side===0){x=Math.random()*width;y=-m}
  else if(side===1){x=width+m;y=Math.random()*height}
  else if(side===2){x=Math.random()*width;y=height+m}
  else{x=-m;y=Math.random()*height}

  const difficulty=1+score/650,radius=19+Math.random()*4,maxSpeed=70+Math.random()*28+difficulty*3;
  const dx=player.x-x,dy=player.y-y,d=Math.hypot(dx,dy)||1,startSpeed=maxSpeed*.7;
  const hp=70+difficulty*12;

  enemies.push({
    x,y,radius,
    vx:dx/d*startSpeed,
    vy:dy/d*startSpeed,
    baseMaxSpeed:maxSpeed,
    steering:120+Math.random()*35,
    health:hp,maxHealth:hp,
    damage:17+difficulty*.45,
    hitCooldown:0,
    slowTimer:0,
    dead:false,
    bladeHit:0
  });
}

function spawnWeaponPickup(){
  if(!weaponBag.length)refillWeaponBag();
  const p=randomPos();
  weaponPickups.push({x:p.x,y:p.y,radius:23,weaponKey:weaponBag.pop(),life:20000});
}

function spawnPowerup(){
  const ks=Object.keys(POWERUPS),key=ks[Math.floor(Math.random()*ks.length)],p=randomPos();
  powerups.push({x:p.x,y:p.y,radius:19,key,life:20000,pulse:0});
}

function spawnCoins(x,y){
  const count=1+Math.floor(Math.random()*3);

  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2,s=35+Math.random()*80;

    coinDrops.push({
      x,y,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      radius:6,
      life:30000,
      value:1
    });
  }
}

function findNearestEnemy(source=player,excluded=new Set(),visibleOnly=true){
  let best=null,bestD=Infinity;

  for(const e of enemies){
    if(e.dead||excluded.has(e))continue;
    if(visibleOnly&&!onScreen(e))continue;

    const d=dist(source,e);

    if(d<bestD){
      bestD=d;
      best=e;
    }
  }

  return best;
}

const weapon=()=>WEAPONS[player.weaponKey];

function damageMult(){
  return (1+buffs.quad.stacks*1.25)*(1+buffs.berserk.stacks*.45);
}

function fireRate(w){
  return Math.max(
    35,
    w.fireRate*
    Math.pow(.8,buffs.haste.stacks)*
    Math.pow(.82,buffs.overdrive.stacks)*
    Math.pow(.9,buffs.berserk.stacks)
  );
}

function damageEnemy(e,dmg,knockback=0,angle=0){
  if(!e||e.dead)return;

  e.health-=dmg*damageMult();

  if(knockback){
    e.vx+=Math.cos(angle)*knockback*2.5;
    e.vy+=Math.sin(angle)*knockback*2.5;
  }

  createHitParticles(e.x,e.y);

  if(e.health<=0){
    e.dead=true;
    score+=10;

    createBloodExplosion(e.x,e.y);
    spawnCoins(e.x,e.y);
  }
}

function chainFromEnemy(start,damage,chains,range,color,excluded=new Set()){
  let from={x:start.x,y:start.y},dmg=damage;
  const hit=new Set(excluded);
  hit.add(start);

  for(let i=0;i<chains;i++){
    let next=null,best=Infinity;

    for(const e of enemies){
      if(e.dead||hit.has(e)||!onScreen(e))continue;

      const d=Math.hypot(e.x-from.x,e.y-from.y);

      if(d<range&&d<best){
        best=d;
        next=e;
      }
    }

    if(!next)break;

    lightningEffects.push({
      x1:from.x,y1:from.y,
      x2:next.x,y2:next.y,
      life:130,color
    });

    damageEnemy(next,dmg);

    hit.add(next);
    from={x:next.x,y:next.y};
    dmg*=.82;
  }
}

function shoot(time){
  const w=weapon();
  if(w.type==="orbit")return;

  const target=findNearestEnemy();
  if(!target||time-lastShot<fireRate(w))return;

  lastShot=time;

  const angle=Math.atan2(target.y-player.y,target.x-player.x);

  if(w.type==="shotgun"){
    for(let i=0;i<w.pellets;i++)createBullet(angle+(Math.random()-.5)*w.spread,w);
    return;
  }

  if(w.type==="arc"){
    fireArc(target,w);
    return;
  }

  if(w.type==="nova"){
    createBullet(angle,w);

    const n=w.sideShots+buffs.overdrive.stacks;

    for(let i=1;i<=n;i++){
      createBullet(angle-.18*i,w);
      createBullet(angle+.18*i,w);
    }

    return;
  }

  createBullet(angle,w);

  for(let i=1;i<=buffs.overdrive.stacks;i++){
    createBullet(angle-.1*i,w);
    createBullet(angle+.1*i,w);
  }
}

function createBullet(angle,w){
  bullets.push({
    x:player.x,y:player.y,
    vx:Math.cos(angle)*w.bulletSpeed,
    vy:Math.sin(angle)*w.bulletSpeed,
    angle,
    radius:w.bulletSize,
    damage:w.damage,
    color:w.color,
    type:w.type,
    pierce:(w.pierce||0)+buffs.fmj.stacks*2,
    hitEnemies:new Set(),
    explosionRadius:w.explosionRadius||0,
    explosionDamage:w.explosionDamage||0,
    homingStrength:w.homingStrength||0,
    slow:w.slow||0,
    slowTime:w.slowTime||0,
    knockback:w.knockback||0,
    pullRadius:w.pullRadius||0,
    pullStrength:w.pullStrength||0,
    life:w.type==="singularity"?1900:3000
  });
}

function fireArc(first,w){
  let cur=first,dmg=w.damage,start={x:player.x,y:player.y};
  const hit=new Set(),chains=w.chains+buffs.overdrive.stacks;

  for(let i=0;i<chains&&cur;i++){
    if(!onScreen(cur))break;

    lightningEffects.push({
      x1:start.x,y1:start.y,
      x2:cur.x,y2:cur.y,
      life:130,color:w.color
    });

    damageEnemy(cur,dmg);
    hit.add(cur);

    start={x:cur.x,y:cur.y};
    dmg=w.chainDamage;

    let next=null,best=Infinity;

    for(const e of enemies){
      if(e.dead||hit.has(e)||!onScreen(e))continue;

      const d=Math.hypot(e.x-start.x,e.y-start.y);

      if(d<w.chainRange&&d<best){
        best=d;
        next=e;
      }
    }

    cur=next;
  }
}

function createExplosion(x,y,radius,damage,duration=300,color="#c45cff"){
  explosions.push({x,y,radius:0,maxRadius:radius,life:duration,duration,color});

  for(const e of enemies){
    if(e.dead)continue;

    const d=Math.hypot(e.x-x,e.y-y);

    if(d<radius){
      damageEnemy(e,damage*(.4+(1-d/radius)*.6));
    }
  }
}

function addStack(key,duration){
  const b=buffs[key];
  b.stacks=Math.min(b.maxStacks,b.stacks+1);
  b.time=Math.min(60000,b.time+duration);
}

function activatePowerup(key){
  if(key==="heal")player.health=Math.min(player.maxHealth,player.health+80);
  else if(key==="shield")player.shield=Math.min(300,player.shield+100);
  else if(key==="quad")addStack("quad",14000);
  else if(key==="haste")addStack("haste",16000);
  else if(key==="overdrive")addStack("overdrive",14000);
  else if(key==="magnet")addStack("magnet",20000);
  else if(key==="berserk")addStack("berserk",15000);
  else if(key==="fmj")addStack("fmj",22000);
  else if(key==="chain")addStack("chain",20000);
  else if(key==="tesla")addStack("tesla",20000);
  else if(key==="nuke")createExplosion(player.x,player.y,Math.max(width,height)*1.45,999999,550,"#fff");
}

function updatePlayer(dt){
  let dx=0,dy=0;

  if(keys.w||keys.arrowup)dy--;
  if(keys.s||keys.arrowdown)dy++;
  if(keys.a||keys.arrowleft)dx--;
  if(keys.d||keys.arrowright)dx++;

  const speed=player.speed*(1+buffs.berserk.stacks*.12);

  if(dx||dy){
    const d=Math.hypot(dx,dy);

    player.x+=dx/d*speed*dt;
    player.y+=dy/d*speed*dt;
  }else if(pointerActive){
    dx=pointerX-player.x;
    dy=pointerY-player.y;

    const d=Math.hypot(dx,dy);

    if(d>5){
      const m=Math.min(speed*dt,d);

      player.x+=dx/d*m;
      player.y+=dy/d*m;
    }
  }

  player.x=Math.max(player.radius,Math.min(width-player.radius,player.x));
  player.y=Math.max(player.radius,Math.min(height-player.radius,player.y));
}

function updateEnemies(dt){
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];

    if(e.dead){
      enemies.splice(i,1);
      continue;
    }

    let maxSpeed=e.baseMaxSpeed;

    if(e.slowTimer>0){
      e.slowTimer-=dt*1000;
      maxSpeed*=.5;
    }

    const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||1;
    const desiredVX=dx/d*maxSpeed,desiredVY=dy/d*maxSpeed;

    let sx=desiredVX-e.vx,sy=desiredVY-e.vy;

    const sl=Math.hypot(sx,sy),maxSteer=e.steering*dt;

    if(sl>maxSteer&&sl>0){
      sx=sx/sl*maxSteer;
      sy=sy/sl*maxSteer;
    }

    e.vx+=sx;
    e.vy+=sy;

    const v=Math.hypot(e.vx,e.vy);

    if(v>maxSpeed){
      e.vx=e.vx/v*maxSpeed;
      e.vy=e.vy/v*maxSpeed;
    }

    e.x+=e.vx*dt;
    e.y+=e.vy*dt;

    e.hitCooldown-=dt*1000;

    if(touching(player,e)&&e.hitCooldown<=0){
      let damage=e.damage;

      if(player.shield>0){
        const absorbed=Math.min(player.shield,damage);

        player.shield-=absorbed;
        damage-=absorbed;
      }

      player.health-=damage;
      e.hitCooldown=650;

      e.vx-=dx/d*90;
      e.vy-=dy/d*90;

      if(player.health<=0){
        player.health=0;
        endGame();
      }
    }
  }
}

function updateBullets(dt){
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];

    b.life-=dt*1000;

    if(b.type==="homing"){
      const target=findNearestEnemy(b,new Set(),true);

      if(target){
        const ta=Math.atan2(target.y-b.y,target.x-b.x);
        const diff=Math.atan2(Math.sin(ta-b.angle),Math.cos(ta-b.angle));

        b.angle+=diff*b.homingStrength*dt;

        const speed=Math.hypot(b.vx,b.vy);

        b.vx=Math.cos(b.angle)*speed;
        b.vy=Math.sin(b.angle)*speed;
      }
    }

    if(b.type==="singularity"){
      for(const e of enemies){
        if(e.dead)continue;

        const dx=b.x-e.x,dy=b.y-e.y,d=Math.hypot(dx,dy);

        if(d>1&&d<b.pullRadius){
          const f=b.pullStrength*(1-d/b.pullRadius)*dt;

          e.vx+=dx/d*f;
          e.vy+=dy/d*f;
        }
      }
    }

    b.x+=b.vx*dt;
    b.y+=b.vy*dt;

    const expired=b.life<=0||b.x<-180||b.x>width+180||b.y<-180||b.y>height+180;

    if(expired){
      if(b.type==="singularity"){
        createExplosion(b.x,b.y,b.explosionRadius,b.explosionDamage,350,b.color);
      }

      bullets.splice(i,1);
      continue;
    }

    let remove=false;

    for(const e of enemies){
      if(e.dead||b.hitEnemies.has(e))continue;

      if(touching(b,e)){
        b.hitEnemies.add(e);

        damageEnemy(e,b.damage,b.knockback,b.angle);

        if(buffs.chain.stacks){
          chainFromEnemy(
            e,
            b.damage*.45,
            1+buffs.chain.stacks,
            120+buffs.chain.stacks*45,
            "#00ffff",
            b.hitEnemies
          );
        }

        if(b.type==="frost")e.slowTimer=b.slowTime;

        if(b.type==="explosive"){
          createExplosion(b.x,b.y,b.explosionRadius,b.explosionDamage,300,b.color);
          remove=true;
          break;
        }

        if(b.type==="singularity"){
          createExplosion(b.x,b.y,b.explosionRadius,b.explosionDamage,350,b.color);
          remove=true;
          break;
        }

        if(b.pierce>0){
          b.pierce--;
          continue;
        }

        remove=true;
        break;
      }
    }

    if(remove)bullets.splice(i,1);
  }
}

function updateTesla(dt){
  if(!buffs.tesla.stacks)return;

  teslaTimer+=dt*1000;

  const rate=Math.max(350,1250-buffs.tesla.stacks*220);

  if(teslaTimer<rate)return;

  teslaTimer=0;

  const target=findNearestEnemy();

  if(!target)return;

  const damage=35+buffs.tesla.stacks*18;
  const chains=1+buffs.tesla.stacks*2;
  const range=150+buffs.tesla.stacks*35;

  lightningEffects.push({
    x1:player.x,y1:player.y,
    x2:target.x,y2:target.y,
    life:150,
    color:"#68f7ff"
  });

  damageEnemy(target,damage);
  chainFromEnemy(target,damage*.75,chains,range,"#68f7ff");
}

function updateSolarBlades(dt){
  const w=weapon();

  if(w.type!=="orbit")return;

  orbitAngle+=dt*3.8;

  const count=w.blades+buffs.overdrive.stacks;

  for(let i=0;i<count;i++){
    const a=orbitAngle+Math.PI*2/count*i;

    const blade={
      x:player.x+Math.cos(a)*72,
      y:player.y+Math.sin(a)*72,
      radius:12
    };

    for(const e of enemies){
      if(e.dead)continue;

      if(touching(blade,e)&&performance.now()-e.bladeHit>230){
        damageEnemy(e,w.damage);
        e.bladeHit=performance.now();

        if(buffs.chain.stacks){
          chainFromEnemy(
            e,
            w.damage*.35,
            buffs.chain.stacks,
            130+buffs.chain.stacks*35,
            "#00ffff"
          );
        }
      }
    }
  }
}

function pullTowardPlayer(p,dt,range,speed){
  const dx=player.x-p.x,dy=player.y-p.y,d=Math.hypot(dx,dy);

  if(d>1&&d<range){
    p.x+=dx/d*speed*dt;
    p.y+=dy/d*speed*dt;
  }
}

function updatePickups(dt){
  for(let i=weaponPickups.length-1;i>=0;i--){
    const p=weaponPickups[i];

    p.life-=dt*1000;

    if(p.life<=0){
      weaponPickups.splice(i,1);
      continue;
    }

    if(touching(player,p)){
      player.weaponKey=p.weaponKey;
      weaponPickups.splice(i,1);
    }
  }

  for(let i=powerups.length-1;i>=0;i--){
    const p=powerups[i];

    p.life-=dt*1000;
    p.pulse+=dt*5;

    if(buffs.magnet.stacks){
      pullTowardPlayer(
        p,dt,
        300+buffs.magnet.stacks*110,
        350+buffs.magnet.stacks*100
      );
    }

    if(p.life<=0){
      powerups.splice(i,1);
      continue;
    }

    if(touching(player,p)){
      activatePowerup(p.key);
      powerups.splice(i,1);
    }
  }
}

function updateCoins(dt){
  for(let i=coinDrops.length-1;i>=0;i--){
    const c=coinDrops[i];

    c.life-=dt*1000;

    c.x+=c.vx*dt;
    c.y+=c.vy*dt;

    c.vx*=Math.pow(.02,dt);
    c.vy*=Math.pow(.02,dt);

    if(buffs.magnet.stacks){
      pullTowardPlayer(
        c,dt,
        320+buffs.magnet.stacks*140,
        450+buffs.magnet.stacks*120
      );
    }else{
      pullTowardPlayer(c,dt,55,190);
    }

    if(c.life<=0){
      coinDrops.splice(i,1);
      continue;
    }

    if(touching(player,c)){
      coins+=c.value;
      score+=2*c.value;
      coinDrops.splice(i,1);
    }
  }
}

function updateBuffs(dt){
  const ms=dt*1000;

  for(const k in buffs){
    const b=buffs[k];

    if(!b.time)continue;

    b.time-=ms;

    if(b.time<=0){
      b.time=0;
      b.stacks=0;
    }
  }
}

function createHitParticles(x,y){
  for(let i=0;i<3;i++){
    particles.push({
      x,y,
      vx:(Math.random()-.5)*150,
      vy:(Math.random()-.5)*150,
      radius:2+Math.random()*2,
      life:180,
      color:"#ffffff",
      gravity:0
    });
  }
}

function createBloodExplosion(x,y){
  for(let i=0;i<24;i++){
    const a=Math.random()*Math.PI*2,s=70+Math.random()*260;

    particles.push({
      x,y,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      radius:2+Math.random()*5,
      life:450+Math.random()*500,
      color:Math.random()<.5?"#8b0000":"#d40000",
      gravity:110
    });
  }
}

function updateEffects(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];

    p.vy+=(p.gravity||0)*dt;
    p.x+=p.vx*dt;
    p.y+=p.vy*dt;
    p.life-=dt*1000;

    if(p.life<=0)particles.splice(i,1);
  }

  for(let i=explosions.length-1;i>=0;i--){
    const e=explosions[i];

    e.life-=dt*1000;
    e.radius=Math.max(0,e.maxRadius*Math.max(0,Math.min(1,1-e.life/e.duration)));

    if(e.life<=0)explosions.splice(i,1);
  }

  for(let i=lightningEffects.length-1;i>=0;i--){
    lightningEffects[i].life-=dt*1000;

    if(lightningEffects[i].life<=0){
      lightningEffects.splice(i,1);
    }
  }
}

function drawBackground(){
  ctx.fillStyle="#111820";
  ctx.fillRect(0,0,width,height);

  ctx.strokeStyle="rgba(255,255,255,.035)";
  ctx.lineWidth=1;

  for(let x=0;x<width;x+=50){
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,height);
    ctx.stroke();
  }

  for(let y=0;y<height;y+=50){
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(width,y);
    ctx.stroke();
  }
}

function drawPlayer(){
  if(player.shield>0){
    ctx.beginPath();
    ctx.arc(player.x,player.y,player.radius+8,0,Math.PI*2);
    ctx.strokeStyle="#55cfff";
    ctx.lineWidth=4;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(player.x,player.y,player.radius,0,Math.PI*2);
  ctx.fillStyle=player.color;
  ctx.fill();

  ctx.strokeStyle="#fff";
  ctx.lineWidth=3;
  ctx.stroke();
}

function drawEnemies(){
  for(const e of enemies){
    const size=e.radius*2.65;

    if(hippoImage.complete&&hippoImage.naturalWidth){
      ctx.drawImage(
        hippoImage,
        e.x-size/2,
        e.y-size/2,
        size,size
      );
    }else{
      ctx.beginPath();
      ctx.arc(e.x,e.y,e.radius,0,Math.PI*2);
      ctx.fillStyle="#ff456c";
      ctx.fill();
    }

    if(e.health<e.maxHealth){
      const w=32;

      ctx.fillStyle="#250000";
      ctx.fillRect(e.x-w/2,e.y-e.radius-8,w,4);

      ctx.fillStyle="#ff4444";
      ctx.fillRect(
        e.x-w/2,
        e.y-e.radius-8,
        w*Math.max(0,e.health/e.maxHealth),
        4
      );
    }
  }
}

function drawCoins(){
  for(const c of coinDrops){
    ctx.save();

    ctx.shadowBlur=10;
    ctx.shadowColor="#ffd700";

    ctx.beginPath();
    ctx.arc(c.x,c.y,c.radius,0,Math.PI*2);

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

    ctx.shadowBlur=b.type==="singularity"?25:12;
    ctx.shadowColor=b.color;

    ctx.beginPath();
    ctx.arc(b.x,b.y,Math.max(0,b.radius),0,Math.PI*2);
    ctx.fillStyle=b.color;
    ctx.fill();

    if(b.type==="singularity"){
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.radius+8,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,.6)";
      ctx.lineWidth=2;
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawSolarBlades(){
  const w=weapon();

  if(w.type!=="orbit")return;

  const count=w.blades+buffs.overdrive.stacks;

  for(let i=0;i<count;i++){
    const a=orbitAngle+Math.PI*2/count*i;
    const x=player.x+Math.cos(a)*72,y=player.y+Math.sin(a)*72;

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(a);

    ctx.shadowBlur=15;
    ctx.shadowColor=w.color;

    ctx.fillStyle=w.color;
    ctx.fillRect(-5,-18,10,36);

    ctx.restore();
  }
}

function drawWeaponPickups(){
  for(const p of weaponPickups){
    const w=WEAPONS[p.weaponKey];

    ctx.save();

    ctx.shadowBlur=18;
    ctx.shadowColor=w.color;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);

    ctx.fillStyle="#111";
    ctx.fill();

    ctx.strokeStyle=w.color;
    ctx.lineWidth=4;
    ctx.stroke();

    ctx.fillStyle="#fff";
    ctx.font="bold 9px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    const words=w.name.split(" ");

    if(words.length>1){
      ctx.fillText(words[0],p.x,p.y-5);
      ctx.fillText(words.slice(1).join(" "),p.x,p.y+6);
    }else{
      ctx.fillText(w.name,p.x,p.y);
    }

    ctx.restore();
  }
}

function drawPowerups(){
  for(const p of powerups){
    const data=POWERUPS[p.key],pulse=1+Math.sin(p.pulse)*.12;

    ctx.save();

    ctx.shadowBlur=20;
    ctx.shadowColor=data.color;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius*pulse,0,Math.PI*2);

    ctx.fillStyle=data.color;
    ctx.fill();

    ctx.fillStyle="#111";
    ctx.font="bold 8px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.fillText(data.name,p.x,p.y);

    ctx.restore();
  }
}

function drawEffects(){
  for(const p of particles){
    ctx.save();

    ctx.globalAlpha=Math.min(1,p.life/250);

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);

    ctx.fillStyle=p.color||"#fff";
    ctx.fill();

    ctx.restore();
  }

  for(const e of explosions){
    ctx.save();

    ctx.globalAlpha=Math.max(0,e.life/e.duration);

    ctx.beginPath();
    ctx.arc(e.x,e.y,e.radius,0,Math.PI*2);

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
    ctx.moveTo(l.x1,l.y1);

    for(let i=1;i<5;i++){
      const t=i/5;

      ctx.lineTo(
        l.x1+(l.x2-l.x1)*t+(Math.random()-.5)*15,
        l.y1+(l.y2-l.y1)*t+(Math.random()-.5)*15
      );
    }

    ctx.lineTo(l.x2,l.y2);
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
    tesla:"TESLA"
  };

  ctx.textAlign="left";
  ctx.font="bold 12px Arial";

  for(const k in buffs){
    const b=buffs[k];

    if(!b.stacks||!b.time)continue;

    ctx.fillStyle="#fff";

    ctx.fillText(
      `${labels[k]} x${b.stacks} ${(b.time/1000).toFixed(1)}s`,
      12,y
    );

    y+=17;
  }

  if(player.shield>0){
    ctx.fillStyle="#70dcff";
    ctx.fillText(`SHIELD ${Math.ceil(player.shield)}`,12,y);
  }
}

function updateHUD(){
  healthText.textContent=`HP: ${Math.ceil(player.health)}`;
  weaponText.textContent=weapon().name;
  scoreText.textContent=`Score: ${score} | Coins: ${coins}`;
}

function endGame(){
  gameRunning=false;
  finalScore.textContent=`Score: ${score} | Coins: ${coins}`;
  gameOverScreen.classList.remove("hidden");
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

  score=0;
  coins=0;
  survivalTime=0;

  player.x=width/2;
  player.y=height/2;
  player.health=player.maxHealth;
  player.shield=0;
  player.weaponKey="pistol";

  for(const k in buffs){
    buffs[k].stacks=0;
    buffs[k].time=0;
  }

  for(const k in keys)keys[k]=false;

  weaponBag=[];
  refillWeaponBag();

  lastShot=0;
  enemySpawnTimer=0;
  weaponSpawnTimer=0;
  powerupSpawnTimer=0;
  teslaTimer=0;
  orbitAngle=0;
  pointerActive=false;

  gameRunning=true;
  gameOverScreen.classList.add("hidden");

  spawnWeaponPickup();
  spawnWeaponPickup();
  spawnPowerup();

  lastTime=performance.now();
}

restartButton.addEventListener("click",resetGame);

function gameLoop(time){
  const dt=Math.min((time-lastTime)/1000,.05);

  lastTime=time;

  drawBackground();

  if(gameRunning){
    survivalTime+=dt;

    enemySpawnTimer+=dt*1000;
    weaponSpawnTimer+=dt*1000;
    powerupSpawnTimer+=dt*1000;

    const alive=enemies.filter(e=>!e.dead).length;
    const enemyRate=Math.max(280,1150-score*.8);

    const powerupRate=Math.max(
      1800,
      9000-alive*150-survivalTime*12
    );

    if(enemySpawnTimer>=enemyRate){
      enemySpawnTimer=0;
      spawnEnemy();
    }

    if(weaponSpawnTimer>=8500){
      weaponSpawnTimer=0;
      spawnWeaponPickup();
    }

    if(powerupSpawnTimer>=powerupRate){
      powerupSpawnTimer=0;

      let count=1;

      if(alive>=18)count=2;
      if(alive>=32)count=3;

      for(let i=0;i<count;i++){
        spawnPowerup();
      }
    }

    updatePlayer(dt);
    updateEnemies(dt);
    updateBullets(dt);
    updateSolarBlades(dt);
    updateTesla(dt);
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
  drawPlayer();
  drawEffects();
  drawBuffs();

  requestAnimationFrame(gameLoop);
}

resizeCanvas();

player.x=width/2;
player.y=height/2;

refillWeaponBag();

spawnWeaponPickup();
spawnWeaponPickup();
spawnPowerup();

updateHUD();

lastTime=performance.now();

requestAnimationFrame(gameLoop);
