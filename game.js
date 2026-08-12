const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const healthText = document.getElementById("healthText");
const weaponText = document.getElementById("weaponText");
const scoreText = document.getElementById("scoreText");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");


// ======================================================
// CANVAS
// ======================================================

let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    if (!player.x || !player.y) {
        player.x = width / 2;
        player.y = height / 2;
    }
}

window.addEventListener("resize", resizeCanvas);


// ======================================================
// IMAGE
// ======================================================

const hippoImage = new Image();
hippoImage.src = "hippo.png";


// ======================================================
// PLAYER
// ======================================================

const player = {
    x: 0,
    y: 0,

    radius: 18,

    speed: 270,

    health: 150,
    maxHealth: 150,

    color: "#55ccff",

    weaponKey: "pistol",

    shield: 0
};


// ======================================================
// WEAPONS
// ======================================================

const WEAPONS = {

    pistol: {
        name: "Pistol",
        type: "normal",

        damage: 40,
        fireRate: 380,

        bulletSpeed: 750,
        bulletSize: 6,

        color: "#ffffff"
    },


    plasma: {
        name: "Plasma SMG",
        type: "normal",

        damage: 20,
        fireRate: 85,

        bulletSpeed: 800,
        bulletSize: 5,

        color: "#00eaff"
    },


    shotgun: {
        name: "Titan Shotgun",
        type: "shotgun",

        damage: 35,
        fireRate: 650,

        bulletSpeed: 700,
        bulletSize: 7,

        pellets: 8,
        spread: 0.75,

        knockback: 45,

        color: "#ff9d00"
    },


    railgun: {
        name: "Railgun",
        type: "railgun",

        damage: 140,
        fireRate: 900,

        bulletSpeed: 1500,
        bulletSize: 7,

        pierce: 6,

        color: "#e600ff"
    },


    void: {
        name: "Void Cannon",
        type: "explosive",

        damage: 85,
        fireRate: 1100,

        bulletSpeed: 450,
        bulletSize: 13,

        explosionRadius: 130,
        explosionDamage: 100,

        color: "#8c52ff"
    },


    arc: {
        name: "Arc Blaster",
        type: "arc",

        damage: 65,
        fireRate: 700,

        chainDamage: 45,
        chains: 4,
        chainRange: 160,

        color: "#66ffff"
    },


    starfire: {
        name: "Starfire Wand",
        type: "homing",

        damage: 52,
        fireRate: 280,

        bulletSpeed: 500,
        bulletSize: 8,

        homingStrength: 6,

        color: "#ff4fd8"
    },


    frost: {
        name: "Frost Repeater",
        type: "frost",

        damage: 24,
        fireRate: 125,

        bulletSpeed: 700,
        bulletSize: 6,

        slow: 0.55,
        slowTime: 2200,

        color: "#9fe8ff"
    },


    solar: {
        name: "Solar Blades",
        type: "orbit",

        damage: 80,
        fireRate: 0,

        blades: 4,

        color: "#ffda44"
    }
};


// ======================================================
// POWER UPS
// ======================================================

const POWERUPS = {

    heal: {
        name: "HEAL",
        color: "#40ff75"
    },

    shield: {
        name: "SHIELD",
        color: "#5ac8ff"
    },

    quad: {
        name: "QUAD",
        color: "#ff3838"
    },

    haste: {
        name: "HASTE",
        color: "#ffe600"
    },

    overdrive: {
        name: "OVERDRIVE",
        color: "#ff7b00"
    },

    nuke: {
        name: "NUKE",
        color: "#ffffff"
    },

    magnet: {
        name: "MAGNET",
        color: "#c451ff"
    },

    berserk: {
        name: "BERSERK",
        color: "#ff0055"
    }
};


// ======================================================
// ACTIVE BUFFS
// ======================================================

const buffs = {
    quad: 0,
    haste: 0,
    overdrive: 0,
    magnet: 0,
    berserk: 0
};


// ======================================================
// GAME STATE
// ======================================================

let gameRunning = true;

let score = 0;

let lastTime = 0;
let lastShot = 0;

let enemySpawnTimer = 0;
let weaponSpawnTimer = 0;
let powerupSpawnTimer = 0;

let enemies = [];
let bullets = [];
let weaponPickups = [];
let powerups = [];

let explosions = [];
let lightningEffects = [];
let particles = [];

let orbitAngle = 0;


// ======================================================
// WEAPON BAG
// ======================================================

let weaponBag = [];

function refillWeaponBag() {

    weaponBag = [
        "plasma",
        "shotgun",
        "railgun",
        "void",
        "arc",
        "starfire",
        "frost",
        "solar"
    ];

    for (let i = weaponBag.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            weaponBag[i],
            weaponBag[j]
        ] = [
            weaponBag[j],
            weaponBag[i]
        ];
    }
}


// ======================================================
// INPUT
// ======================================================

let pointerActive = false;
let pointerX = 0;
let pointerY = 0;

const keys = {};


// DESKTOP

canvas.addEventListener("mousedown", event => {

    pointerActive = true;

    pointerX = event.clientX;
    pointerY = event.clientY;
});

canvas.addEventListener("mousemove", event => {

    if (!pointerActive) return;

    pointerX = event.clientX;
    pointerY = event.clientY;
});

window.addEventListener("mouseup", () => {
    pointerActive = false;
});


// MOBILE

canvas.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        const touch =
            event.touches[0];

        pointerActive = true;

        pointerX =
            touch.clientX;

        pointerY =
            touch.clientY;
    },

    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    event => {

        event.preventDefault();

        const touch =
            event.touches[0];

        pointerX =
            touch.clientX;

        pointerY =
            touch.clientY;
    },

    { passive: false }
);

canvas.addEventListener(
    "touchend",
    event => {

        event.preventDefault();

        pointerActive = false;
    },

    { passive: false }
);


// WASD

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;
    }
);

window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


// ======================================================
// UTILS
// ======================================================

function distance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );
}


function circlesTouch(a, b) {

    const r =
        a.radius +
        b.radius;

    const dx =
        a.x -
        b.x;

    const dy =
        a.y -
        b.y;

    return (
        dx * dx +
        dy * dy <
        r * r
    );
}


function randomMapPosition(padding = 80) {

    return {
        x:
            padding +
            Math.random() *
            Math.max(
                1,
                width -
                padding * 2
            ),

        y:
            padding +
            Math.random() *
            Math.max(
                1,
                height -
                padding * 2
            )
    };
}


// ======================================================
// ENEMIES
// ======================================================

function spawnEnemy() {

    const side =
        Math.floor(
            Math.random() *
            4
        );

    const margin = 60;

    let x;
    let y;

    if (side === 0) {

        x =
            Math.random() *
            width;

        y = -margin;
    }

    else if (side === 1) {

        x =
            width +
            margin;

        y =
            Math.random() *
            height;
    }

    else if (side === 2) {

        x =
            Math.random() *
            width;

        y =
            height +
            margin;
    }

    else {

        x = -margin;

        y =
            Math.random() *
            height;
    }


    const difficulty =
        1 +
        score /
        600;


    let radius =
        23 +
        Math.random() *
        5;


    enemies.push({

        x,
        y,

        radius,

        speed:
            65 +
            Math.random() *
            35 +
            difficulty *
            3,

        baseSpeed: 0,

        health:
            70 +
            difficulty *
            12,

        maxHealth: 0,

        damage:
            18 +
            difficulty *
            0.5,

        hitCooldown: 0,

        slowTimer: 0,

        dead: false
    });


    const enemy =
        enemies[
            enemies.length - 1
        ];

    enemy.baseSpeed =
        enemy.speed;

    enemy.maxHealth =
        enemy.health;
}


// ======================================================
// PICKUPS
// ======================================================

function spawnWeaponPickup() {

    if (
        weaponBag.length === 0
    ) {
        refillWeaponBag();
    }


    const pos =
        randomMapPosition();


    weaponPickups.push({

        x: pos.x,
        y: pos.y,

        radius: 23,

        weaponKey:
            weaponBag.pop(),

        life: 20000
    });
}


function spawnPowerup() {

    const keys =
        Object.keys(
            POWERUPS
        );


    const key =
        keys[
            Math.floor(
                Math.random() *
                keys.length
            )
        ];


    const pos =
        randomMapPosition();


    powerups.push({

        x: pos.x,
        y: pos.y,

        radius: 19,

        key,

        life: 13000,

        pulse: 0
    });
}


// ======================================================
// TARGETING
// ======================================================

function findNearestEnemy(
    source = player,
    excluded = new Set()
) {

    let nearest = null;
    let nearestDistance = Infinity;


    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead ||
            excluded.has(enemy)
        ) {
            continue;
        }


        const d =
            distance(
                source,
                enemy
            );


        if (
            d <
            nearestDistance
        ) {

            nearestDistance = d;

            nearest = enemy;
        }
    }


    return nearest;
}


// ======================================================
// DAMAGE
// ======================================================

function getDamageMultiplier() {

    let multiplier = 1;


    if (buffs.quad > 0) {
        multiplier *= 4;
    }


    if (
        buffs.berserk >
        0
    ) {
        multiplier *= 1.8;
    }


    return multiplier;
}


function damageEnemy(
    enemy,
    damage,
    knockback = 0,
    angle = 0
) {

    if (
        !enemy ||
        enemy.dead
    ) {
        return;
    }


    enemy.health -=
        damage *
        getDamageMultiplier();


    if (
        knockback >
        0
    ) {

        enemy.x +=
            Math.cos(angle) *
            knockback;

        enemy.y +=
            Math.sin(angle) *
            knockback;
    }


    createHitParticles(
        enemy.x,
        enemy.y
    );


    if (
        enemy.health <= 0
    ) {

        enemy.dead = true;

        score += 10;

        createDeathParticles(
            enemy.x,
            enemy.y
        );
    }
}


// ======================================================
// SHOOTING
// ======================================================

function getCurrentWeapon() {

    return WEAPONS[
        player.weaponKey
    ];
}


function getFireRate(
    weapon
) {

    let rate =
        weapon.fireRate;


    if (
        buffs.haste >
        0
    ) {
        rate *= 0.55;
    }


    if (
        buffs.overdrive >
        0
    ) {
        rate *= 0.45;
    }


    if (
        buffs.berserk >
        0
    ) {
        rate *= 0.7;
    }


    return rate;
}


function shoot(time) {

    const weapon =
        getCurrentWeapon();


    if (
        weapon.type ===
        "orbit"
    ) {
        return;
    }


    if (
        enemies.length ===
        0
    ) {
        return;
    }


    if (
        time -
        lastShot <
        getFireRate(weapon)
    ) {
        return;
    }


    const enemy =
        findNearestEnemy();


    if (!enemy) return;


    lastShot = time;


    const angle =
        Math.atan2(
            enemy.y -
            player.y,

            enemy.x -
            player.x
        );


    if (
        weapon.type ===
        "shotgun"
    ) {

        for (
            let i = 0;
            i <
            weapon.pellets;
            i++
        ) {

            const spread =
                (
                    Math.random() -
                    0.5
                ) *
                weapon.spread;


            createBullet(
                angle +
                spread,

                weapon
            );
        }

        return;
    }


    if (
        weapon.type ===
        "arc"
    ) {

        fireArcWeapon(
            enemy,
            weapon
        );

        return;
    }


    createBullet(
        angle,
        weapon
    );


    if (
        buffs.overdrive >
        0
    ) {

        createBullet(
            angle - 0.15,
            weapon
        );

        createBullet(
            angle + 0.15,
            weapon
        );
    }
}


function createBullet(
    angle,
    weapon
) {

    bullets.push({

        x: player.x,
        y: player.y,

        vx:
            Math.cos(angle) *
            weapon.bulletSpeed,

        vy:
            Math.sin(angle) *
            weapon.bulletSpeed,

        angle,

        radius:
            weapon.bulletSize,

        damage:
            weapon.damage,

        color:
            weapon.color,

        type:
            weapon.type,

        pierce:
            weapon.pierce ||
            0,

        hitEnemies:
            new Set(),

        explosionRadius:
            weapon.explosionRadius ||
            0,

        explosionDamage:
            weapon.explosionDamage ||
            0,

        homingStrength:
            weapon.homingStrength ||
            0,

        slow:
            weapon.slow ||
            0,

        slowTime:
            weapon.slowTime ||
            0,

        knockback:
            weapon.knockback ||
            0,

        life: 3000
    });
}


// ======================================================
// ARC BLASTER
// ======================================================

function fireArcWeapon(
    firstEnemy,
    weapon
) {

    let current =
        firstEnemy;

    let currentDamage =
        weapon.damage;

    const hit =
        new Set();


    let start = {
        x: player.x,
        y: player.y
    };


    for (
        let i = 0;
        i <
        weapon.chains;
        i++
    ) {

        if (!current) {
            break;
        }


        lightningEffects.push({

            x1: start.x,
            y1: start.y,

            x2: current.x,
            y2: current.y,

            life: 130,

            color:
                weapon.color
        });


        damageEnemy(
            current,
            currentDamage
        );


        hit.add(current);


        start = {
            x: current.x,
            y: current.y
        };


        currentDamage =
            weapon.chainDamage;


        let next = null;
        let best = Infinity;


        for (
            const enemy
            of enemies
        ) {

            if (
                hit.has(enemy) ||
                enemy.dead
            ) {
                continue;
            }


            const d =
                Math.hypot(

                    enemy.x -
                    start.x,

                    enemy.y -
                    start.y
                );


            if (
                d <
                weapon.chainRange &&
                d < best
            ) {

                best = d;

                next = enemy;
            }
        }


        current = next;
    }
}


// ======================================================
// EXPLOSIONS
// ======================================================

function createExplosion(
    x,
    y,
    radius,
    damage
) {

    explosions.push({

        x,
        y,

        radius: 0,

        maxRadius:
            radius,

        life: 300
    });


    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.dead
        ) continue;


        const d =
            Math.hypot(
                enemy.x - x,
                enemy.y - y
            );


        if (
            d <
            radius
        ) {

            const falloff =
                1 -
                d /
                radius;


            damageEnemy(
                enemy,

                damage *
                (
                    0.4 +
                    falloff *
                    0.6
                )
            );
        }
    }
}


// ======================================================
// POWER UPS
// ======================================================

function activatePowerup(key) {

    switch (key) {

        case "heal":

            player.health =
                Math.min(
                    player.maxHealth,

                    player.health +
                    75
                );

            break;


        case "shield":

            player.shield =
                Math.min(
                    150,
                    player.shield +
                    75
                );

            break;


        case "quad":

            buffs.quad =
                8000;

            break;


        case "haste":

            buffs.haste =
                10000;

            break;


        case "overdrive":

            buffs.overdrive =
                7000;

            break;


        case "magnet":

            buffs.magnet =
                12000;

            break;


        case "berserk":

            buffs.berserk =
                9000;

            break;


        case "nuke":

            explosions.push({

                x:
                    width / 2,

                y:
                    height / 2,

                radius: 0,

                maxRadius:
                    Math.max(
                        width,
                        height
                    ),

                life: 500
            });


            for (
                const enemy
                of enemies
            ) {

                damageEnemy(
                    enemy,
                    999999
                );
            }

            break;
    }
}


// ======================================================
// PLAYER UPDATE
// ======================================================

function updatePlayer(delta) {

    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {
        dy -= 1;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        dy += 1;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        dx -= 1;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        dx += 1;
    }


    let speed =
        player.speed;


    if (
        buffs.berserk >
        0
    ) {
        speed *= 1.35;
    }


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.hypot(
                dx,
                dy
            );


        dx /= length;
        dy /= length;


        player.x +=
            dx *
            speed *
            delta;

        player.y +=
            dy *
            speed *
            delta;
    }


    else if (
        pointerActive
    ) {

        dx =
            pointerX -
            player.x;

        dy =
            pointerY -
            player.y;


        const d =
            Math.hypot(
                dx,
                dy
            );


        if (
            d > 5
        ) {

            const amount =
                Math.min(
                    speed *
                    delta,

                    d
                );


            player.x +=
                dx /
                d *
                amount;

            player.y +=
                dy /
                d *
                amount;
        }
    }


    player.x =
        Math.max(
            player.radius,

            Math.min(
                width -
                player.radius,

                player.x
            )
        );


    player.y =
        Math.max(
            player.radius,

            Math.min(
                height -
                player.radius,

                player.y
            )
        );
}


// ======================================================
// ENEMY UPDATE
// ======================================================

function updateEnemies(delta) {

    for (
        let i =
            enemies.length - 1;

        i >= 0;

        i--
    ) {

        const enemy =
            enemies[i];


        if (
            enemy.dead
        ) {

            enemies.splice(
                i,
                1
            );

            continue;
        }


        if (
            enemy.slowTimer >
            0
        ) {

            enemy.slowTimer -=
                delta *
                1000;
        }

        else {

            enemy.speed =
                enemy.baseSpeed;
        }


        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;


        const d =
            Math.hypot(
                dx,
                dy
            );


        if (
            d > 0
        ) {

            enemy.x +=
                dx /
                d *
                enemy.speed *
                delta;

            enemy.y +=
                dy /
                d *
                enemy.speed *
                delta;
        }


        enemy.hitCooldown -=
            delta *
            1000;


        if (
            circlesTouch(
                player,
                enemy
            ) &&
            enemy.hitCooldown <= 0
        ) {

            let damage =
                enemy.damage;


            if (
                player.shield >
                0
            ) {

                const absorbed =
                    Math.min(
                        player.shield,
                        damage
                    );


                player.shield -=
                    absorbed;

                damage -=
                    absorbed;
            }


            player.health -=
                damage;


            enemy.hitCooldown =
                650;


            if (
                player.health <=
                0
            ) {

                player.health = 0;

                endGame();
            }
        }
    }
}


// ======================================================
// BULLETS
// ======================================================

function updateBullets(delta) {

    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        bullet.life -=
            delta *
            1000;


        if (
            bullet.type ===
            "homing"
        ) {

            const target =
                findNearestEnemy(
                    bullet
                );


            if (target) {

                const targetAngle =
                    Math.atan2(
                        target.y -
                        bullet.y,

                        target.x -
                        bullet.x
                    );


                let difference =
                    targetAngle -
                    bullet.angle;


                difference =
                    Math.atan2(
                        Math.sin(
                            difference
                        ),

                        Math.cos(
                            difference
                        )
                    );


                bullet.angle +=
                    difference *
                    bullet.homingStrength *
                    delta;


                const speed =
                    Math.hypot(
                        bullet.vx,
                        bullet.vy
                    );


                bullet.vx =
                    Math.cos(
                        bullet.angle
                    ) *
                    speed;


                bullet.vy =
                    Math.sin(
                        bullet.angle
                    ) *
                    speed;
            }
        }


        bullet.x +=
            bullet.vx *
            delta;

        bullet.y +=
            bullet.vy *
            delta;


        if (
            bullet.life <= 0 ||
            bullet.x < -150 ||
            bullet.x > width + 150 ||
            bullet.y < -150 ||
            bullet.y > height + 150
        ) {

            bullets.splice(
                i,
                1
            );

            continue;
        }


        let removeBullet =
            false;


        for (
            const enemy
            of enemies
        ) {

            if (
                enemy.dead ||
                bullet.hitEnemies.has(
                    enemy
                )
            ) {
                continue;
            }


            if (
                circlesTouch(
                    bullet,
                    enemy
                )
            ) {

                bullet.hitEnemies.add(
                    enemy
                );


                damageEnemy(
                    enemy,

                    bullet.damage,

                    bullet.knockback,

                    bullet.angle
                );


                if (
                    bullet.type ===
                    "frost"
                ) {

                    enemy.speed =
                        enemy.baseSpeed *
                        bullet.slow;

                    enemy.slowTimer =
                        bullet.slowTime;
                }


                if (
                    bullet.type ===
                    "explosive"
                ) {

                    createExplosion(
                        bullet.x,
                        bullet.y,

                        bullet.explosionRadius,
                        bullet.explosionDamage
                    );

                    removeBullet =
                        true;

                    break;
                }


                if (
                    bullet.pierce >
                    0
                ) {

                    bullet.pierce--;

                    continue;
                }


                removeBullet =
                    true;

                break;
            }
        }


        if (
            removeBullet
        ) {

            bullets.splice(
                i,
                1
            );
        }
    }
}


// ======================================================
// SOLAR BLADES
// ======================================================

function updateSolarBlades(
    delta
) {

    const weapon =
        getCurrentWeapon();


    if (
        weapon.type !==
        "orbit"
    ) {
        return;
    }


    orbitAngle +=
        delta *
        3.5;


    for (
        let i = 0;
        i <
        weapon.blades;
        i++
    ) {

        const angle =
            orbitAngle +
            (
                Math.PI *
                2 /
                weapon.blades
            ) *
            i;


        const blade = {

            x:
                player.x +
                Math.cos(
                    angle
                ) *
                75,

            y:
                player.y +
                Math.sin(
                    angle
                ) *
                75,

            radius: 13
        };


        for (
            const enemy
            of enemies
        ) {

            if (
                enemy.dead
            ) continue;


            if (
                circlesTouch(
                    blade,
                    enemy
                ) &&
                (
                    !enemy.bladeHit ||
                    performance.now() -
                    enemy.bladeHit >
                    250
                )
            ) {

                damageEnemy(
                    enemy,
                    weapon.damage
                );


                enemy.bladeHit =
                    performance.now();
            }
        }
    }
}


// ======================================================
// PICKUPS UPDATE
// ======================================================

function updatePickups(delta) {

    for (
        let i =
            weaponPickups.length - 1;

        i >= 0;

        i--
    ) {

        const pickup =
            weaponPickups[i];


        pickup.life -=
            delta *
            1000;


        if (
            buffs.magnet > 0
        ) {

            pullPickupToPlayer(
                pickup,
                delta
            );
        }


        if (
            pickup.life <= 0
        ) {

            weaponPickups.splice(
                i,
                1
            );

            continue;
        }


        if (
            circlesTouch(
                player,
                pickup
            )
        ) {

            player.weaponKey =
                pickup.weaponKey;


            weaponPickups.splice(
                i,
                1
            );
        }
    }


    for (
        let i =
            powerups.length - 1;

        i >= 0;

        i--
    ) {

        const pickup =
            powerups[i];


        pickup.life -=
            delta *
            1000;


        pickup.pulse +=
            delta *
            5;


        if (
            buffs.magnet >
            0
        ) {

            pullPickupToPlayer(
                pickup,
                delta
            );
        }


        if (
            pickup.life <= 0
        ) {

            powerups.splice(
                i,
                1
            );

            continue;
        }


        if (
            circlesTouch(
                player,
                pickup
            )
        ) {

            activatePowerup(
                pickup.key
            );


            powerups.splice(
                i,
                1
            );
        }
    }
}


function pullPickupToPlayer(
    pickup,
    delta
) {

    const dx =
        player.x -
        pickup.x;

    const dy =
        player.y -
        pickup.y;


    const d =
        Math.hypot(
            dx,
            dy
        );


    if (
        d < 300 &&
        d > 1
    ) {

        pickup.x +=
            dx /
            d *
            350 *
            delta;

        pickup.y +=
            dy /
            d *
            350 *
            delta;
    }
}


// ======================================================
// BUFF TIMERS
// ======================================================

function updateBuffs(delta) {

    const elapsed =
        delta *
        1000;


    for (
        const key
        in buffs
    ) {

        if (
            buffs[key] >
            0
        ) {

            buffs[key] -=
                elapsed;


            if (
                buffs[key] <
                0
            ) {

                buffs[key] =
                    0;
            }
        }
    }
}


// ======================================================
// PARTICLES
// ======================================================

function createHitParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        particles.push({

            x,
            y,

            vx:
                (
                    Math.random() -
                    0.5
                ) *
                180,

            vy:
                (
                    Math.random() -
                    0.5
                ) *
                180,

            radius:
                2 +
                Math.random() *
                3,

            life: 250
        });
    }
}


function createDeathParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        particles.push({

            x,
            y,

            vx:
                (
                    Math.random() -
                    0.5
                ) *
                300,

            vy:
                (
                    Math.random() -
                    0.5
                ) *
                300,

            radius:
                3 +
                Math.random() *
                5,

            life: 500
        });
    }
}


function updateEffects(delta) {

    for (
        let i =
            particles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particles[i];


        p.x +=
            p.vx *
            delta;

        p.y +=
            p.vy *
            delta;


        p.life -=
            delta *
            1000;


        if (
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );
        }
    }


    for (
        let i =
            explosions.length - 1;

        i >= 0;

        i--
    ) {

        const e =
            explosions[i];


        e.life -=
            delta *
            1000;


        e.radius =
            e.maxRadius *
            (
                1 -
                e.life /
                300
            );


        if (
            e.life <= 0
        ) {

            explosions.splice(
                i,
                1
            );
        }
    }


    for (
        let i =
            lightningEffects.length -
            1;

        i >= 0;

        i--
    ) {

        lightningEffects[i].life -=
            delta *
            1000;


        if (
            lightningEffects[i]
                .life <= 0
        ) {

            lightningEffects.splice(
                i,
                1
            );
        }
    }
}


// ======================================================
// BACKGROUND
// ======================================================

function drawBackground() {

    ctx.fillStyle =
        "#111820";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    const spacing = 50;


    for (
        let x = 0;
        x < width;
        x += spacing
    ) {

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


    for (
        let y = 0;
        y < height;
        y += spacing
    ) {

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


// ======================================================
// DRAW PLAYER
// ======================================================

function drawPlayer() {

    if (
        player.shield >
        0
    ) {

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y,
            player.radius +
            8,

            0,
            Math.PI *
            2
        );

        ctx.strokeStyle =
            "#55cfff";

        ctx.lineWidth = 4;

        ctx.stroke();
    }


    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,

        0,
        Math.PI *
        2
    );

    ctx.fillStyle =
        player.color;

    ctx.fill();


    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 3;

    ctx.stroke();
}


// ======================================================
// DRAW ENEMIES
// ======================================================

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        const size =
            enemy.radius *
            2.9;


        if (
            hippoImage.complete &&
            hippoImage.naturalWidth >
            0
        ) {

            ctx.drawImage(

                hippoImage,

                enemy.x -
                size /
                2,

                enemy.y -
                size /
                2,

                size,
                size
            );
        }


        else {

            ctx.beginPath();

            ctx.arc(
                enemy.x,
                enemy.y,
                enemy.radius,

                0,
                Math.PI *
                2
            );

            ctx.fillStyle =
                "#ff456c";

            ctx.fill();
        }


        // HP bar

        if (
            enemy.health <
            enemy.maxHealth
        ) {

            const barWidth =
                35;


            ctx.fillStyle =
                "#250000";

            ctx.fillRect(

                enemy.x -
                barWidth /
                2,

                enemy.y -
                enemy.radius -
                9,

                barWidth,
                4
            );


            ctx.fillStyle =
                "#ff4444";

            ctx.fillRect(

                enemy.x -
                barWidth /
                2,

                enemy.y -
                enemy.radius -
                9,

                barWidth *
                Math.max(
                    0,

                    enemy.health /
                    enemy.maxHealth
                ),

                4
            );
        }
    }
}


// ======================================================
// DRAW BULLETS
// ======================================================

function drawBullets() {

    for (
        const bullet
        of bullets
    ) {

        ctx.save();


        ctx.shadowBlur = 12;

        ctx.shadowColor =
            bullet.color;


        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            bullet.color;

        ctx.fill();


        ctx.restore();
    }
}


// ======================================================
// SOLAR BLADES DRAW
// ======================================================

function drawSolarBlades() {

    const weapon =
        getCurrentWeapon();


    if (
        weapon.type !==
        "orbit"
    ) {
        return;
    }


    for (
        let i = 0;
        i <
        weapon.blades;
        i++
    ) {

        const angle =
            orbitAngle +
            (
                Math.PI *
                2 /
                weapon.blades
            ) *
            i;


        const x =
            player.x +
            Math.cos(
                angle
            ) *
            75;


        const y =
            player.y +
            Math.sin(
                angle
            ) *
            75;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            angle
        );


        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            weapon.color;


        ctx.fillStyle =
            weapon.color;


        ctx.fillRect(
            -5,
            -18,

            10,
            36
        );


        ctx.restore();
    }
}


// ======================================================
// DRAW PICKUPS
// ======================================================

function drawWeaponPickups() {

    for (
        const pickup
        of weaponPickups
    ) {

        const weapon =
            WEAPONS[
                pickup.weaponKey
            ];


        ctx.save();

        ctx.shadowBlur = 18;
        ctx.shadowColor =
            weapon.color;


        ctx.beginPath();

        ctx.arc(
            pickup.x,
            pickup.y,
            pickup.radius,

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            "#111";

        ctx.fill();


        ctx.strokeStyle =
            weapon.color;

        ctx.lineWidth = 4;

        ctx.stroke();


        ctx.fillStyle =
            "#fff";

        ctx.font =
            "bold 9px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillText(
            weapon.name,
            pickup.x,
            pickup.y
        );


        ctx.restore();
    }
}


function drawPowerups() {

    for (
        const pickup
        of powerups
    ) {

        const data =
            POWERUPS[
                pickup.key
            ];


        const pulse =
            1 +
            Math.sin(
                pickup.pulse
            ) *
            0.12;


        ctx.save();


        ctx.shadowBlur =
            20;

        ctx.shadowColor =
            data.color;


        ctx.beginPath();

        ctx.arc(
            pickup.x,
            pickup.y,

            pickup.radius *
            pulse,

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            data.color;

        ctx.fill();


        ctx.fillStyle =
            "#111";

        ctx.font =
            "bold 9px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillText(
            data.name,
            pickup.x,
            pickup.y
        );


        ctx.restore();
    }
}


// ======================================================
// DRAW EFFECTS
// ======================================================

function drawEffects() {

    for (
        const particle
        of particles
    ) {

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fill();
    }


    for (
        const explosion
        of explosions
    ) {

        ctx.save();


        ctx.globalAlpha =
            Math.max(
                0,

                explosion.life /
                300
            );


        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius,

            0,
            Math.PI *
            2
        );


        ctx.strokeStyle =
            "#c45cff";

        ctx.lineWidth = 10;

        ctx.stroke();


        ctx.restore();
    }


    for (
        const lightning
        of lightningEffects
    ) {

        ctx.save();

        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            lightning.color;


        ctx.strokeStyle =
            lightning.color;

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.moveTo(
            lightning.x1,
            lightning.y1
        );


        const segments = 5;


        for (
            let i = 1;
            i < segments;
            i++
        ) {

            const t =
                i /
                segments;


            const x =
                lightning.x1 +
                (
                    lightning.x2 -
                    lightning.x1
                ) *
                t +
                (
                    Math.random() -
                    0.5
                ) *
                15;


            const y =
                lightning.y1 +
                (
                    lightning.y2 -
                    lightning.y1
                ) *
                t +
                (
                    Math.random() -
                    0.5
                ) *
                15;


            ctx.lineTo(
                x,
                y
            );
        }


        ctx.lineTo(
            lightning.x2,
            lightning.y2
        );


        ctx.stroke();

        ctx.restore();
    }
}


// ======================================================
// ACTIVE BUFF DISPLAY
// ======================================================

function drawBuffs() {

    let y = 65;


    ctx.textAlign =
        "left";

    ctx.font =
        "bold 13px Arial";


    const labels = {

        quad:
            "4X DAMAGE",

        haste:
            "HASTE",

        overdrive:
            "OVERDRIVE",

        magnet:
            "MAGNET",

        berserk:
            "BERSERK"
    };


    for (
        const key
        in buffs
    ) {

        if (
            buffs[key] <=
            0
        ) {
            continue;
        }


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(

            labels[key] +
            " " +
            (
                buffs[key] /
                1000
            ).toFixed(1),

            12,
            y
        );


        y += 18;
    }


    if (
        player.shield >
        0
    ) {

        ctx.fillStyle =
            "#70dcff";


        ctx.fillText(

            "SHIELD " +
            Math.ceil(
                player.shield
            ),

            12,
            y
        );
    }
}


// ======================================================
// HUD
// ======================================================

function updateHUD() {

    healthText.textContent =
        "HP: " +
        Math.ceil(
            player.health
        );


    weaponText.textContent =
        getCurrentWeapon()
            .name;


    scoreText.textContent =
        "Score: " +
        score;
}


// ======================================================
// GAME OVER
// ======================================================

function endGame() {

    gameRunning = false;


    finalScore.textContent =
        "Score: " +
        score;


    gameOverScreen.classList.remove(
        "hidden"
    );
}


// ======================================================
// RESET
// ======================================================

function resetGame() {

    enemies = [];

    bullets = [];

    weaponPickups = [];

    powerups = [];

    explosions = [];

    particles = [];

    lightningEffects = [];


    score = 0;


    player.x =
        width / 2;

    player.y =
        height / 2;


    player.health =
        player.maxHealth;


    player.shield = 0;


    player.weaponKey =
        "pistol";


    for (
        const key
        in buffs
    ) {

        buffs[key] = 0;
    }


    weaponBag = [];

    refillWeaponBag();


    lastShot = 0;

    enemySpawnTimer = 0;

    weaponSpawnTimer = 0;

    powerupSpawnTimer = 0;


    pointerActive = false;

    orbitAngle = 0;


    gameRunning = true;


    gameOverScreen.classList.add(
        "hidden"
    );


    spawnWeaponPickup();

    spawnWeaponPickup();

    spawnPowerup();


    lastTime =
        performance.now();
}


restartButton.addEventListener(
    "click",
    resetGame
);


// ======================================================
// GAME LOOP
// ======================================================

function gameLoop(time) {

    const delta =
        Math.min(

            (
                time -
                lastTime
            ) /
            1000,

            0.05
        );


    lastTime = time;


    drawBackground();


    if (
        gameRunning
    ) {

        enemySpawnTimer +=
            delta *
            1000;


        weaponSpawnTimer +=
            delta *
            1000;


        powerupSpawnTimer +=
            delta *
            1000;


        const enemySpawnRate =
            Math.max(

                280,

                1150 -
                score *
                0.8
            );


        if (
            enemySpawnTimer >=
            enemySpawnRate
        ) {

            enemySpawnTimer = 0;

            spawnEnemy();
        }


        if (
            weaponSpawnTimer >=
            9000
        ) {

            weaponSpawnTimer = 0;

            spawnWeaponPickup();
        }


        if (
            powerupSpawnTimer >=
            11000
        ) {

            powerupSpawnTimer = 0;

            spawnPowerup();
        }


        updatePlayer(delta);

        updateEnemies(delta);

        updateBullets(delta);

        updateSolarBlades(
            delta
        );

        updatePickups(delta);

        updateBuffs(delta);

        updateEffects(delta);


        shoot(time);


        updateHUD();
    }


    drawWeaponPickups();

    drawPowerups();

    drawEnemies();

    drawBullets();

    drawSolarBlades();

    drawPlayer();

    drawEffects();

    drawBuffs();


    requestAnimationFrame(
        gameLoop
    );
}


// ======================================================
// START
// ======================================================

resizeCanvas();

player.x =
    width / 2;

player.y =
    height / 2;


refillWeaponBag();

spawnWeaponPickup();
spawnWeaponPickup();

spawnPowerup();


updateHUD();


lastTime =
    performance.now();


requestAnimationFrame(
    gameLoop
);
