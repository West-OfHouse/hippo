const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const healthText = document.getElementById("healthText");
const weaponText = document.getElementById("weaponText");
const scoreText = document.getElementById("scoreText");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

let width = 0;
let height = 0;
let pixelRatio = 1;

const hippoImage = new Image();
hippoImage.src = "hippo.png";

const player = {
    x: 0,
    y: 0,
    radius: 18,
    speed: 295,
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
        damage: 42,
        fireRate: 350,
        bulletSpeed: 800,
        bulletSize: 6,
        color: "#ffffff"
    },

    plasma: {
        name: "Plasma SMG",
        type: "normal",
        damage: 22,
        fireRate: 80,
        bulletSpeed: 850,
        bulletSize: 5,
        color: "#00eaff"
    },

    shotgun: {
        name: "Titan Shotgun",
        type: "shotgun",
        damage: 38,
        fireRate: 620,
        bulletSpeed: 720,
        bulletSize: 7,
        pellets: 9,
        spread: 0.8,
        knockback: 50,
        color: "#ff9d00"
    },

    railgun: {
        name: "Railgun",
        type: "railgun",
        damage: 155,
        fireRate: 850,
        bulletSpeed: 1600,
        bulletSize: 7,
        pierce: 7,
        color: "#e600ff"
    },

    void: {
        name: "Void Cannon",
        type: "explosive",
        damage: 95,
        fireRate: 1000,
        bulletSpeed: 475,
        bulletSize: 14,
        explosionRadius: 145,
        explosionDamage: 115,
        color: "#8c52ff"
    },

    arc: {
        name: "Arc Blaster",
        type: "arc",
        damage: 72,
        fireRate: 630,
        chainDamage: 52,
        chains: 5,
        chainRange: 175,
        color: "#66ffff"
    },

    starfire: {
        name: "Starfire Wand",
        type: "homing",
        damage: 58,
        fireRate: 250,
        bulletSpeed: 540,
        bulletSize: 8,
        homingStrength: 7,
        color: "#ff4fd8"
    },

    frost: {
        name: "Frost Repeater",
        type: "frost",
        damage: 28,
        fireRate: 115,
        bulletSpeed: 760,
        bulletSize: 6,
        slow: 0.5,
        slowTime: 2500,
        color: "#9fe8ff"
    },

    solar: {
        name: "Solar Blades",
        type: "orbit",
        damage: 90,
        fireRate: 0,
        blades: 4,
        color: "#ffda44"
    },

    nova: {
        name: "Nova Lance",
        type: "nova",
        damage: 75,
        fireRate: 420,
        bulletSpeed: 900,
        bulletSize: 8,
        sideShots: 2,
        color: "#ff6bff"
    },

    singularity: {
        name: "Singularity Gun",
        type: "singularity",
        damage: 35,
        fireRate: 1250,
        bulletSpeed: 380,
        bulletSize: 16,
        pullRadius: 180,
        pullStrength: 170,
        explosionRadius: 115,
        explosionDamage: 85,
        color: "#6d3cff"
    }
};


// ======================================================
// POWERUPS
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
        name: "DAMAGE",
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
// STACKABLE BUFFS
// ======================================================

const buffs = {
    quad: {
        stacks: 0,
        time: 0,
        maxStacks: 3
    },

    haste: {
        stacks: 0,
        time: 0,
        maxStacks: 3
    },

    overdrive: {
        stacks: 0,
        time: 0,
        maxStacks: 3
    },

    magnet: {
        stacks: 0,
        time: 0,
        maxStacks: 2
    },

    berserk: {
        stacks: 0,
        time: 0,
        maxStacks: 3
    }
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

let orbitAngle = 0;

let enemies = [];
let bullets = [];

let weaponPickups = [];
let powerups = [];

let explosions = [];
let lightningEffects = [];
let particles = [];

let weaponBag = [];


// ======================================================
// INPUT
// ======================================================

let pointerActive = false;

let pointerX = 0;
let pointerY = 0;

const keys = {};


// ======================================================
// CANVAS
// ======================================================

function resizeCanvas() {
    pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width =
        width * pixelRatio;

    canvas.height =
        height * pixelRatio;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    if (
        !player.x ||
        !player.y
    ) {
        player.x =
            width / 2;

        player.y =
            height / 2;
    }
}

window.addEventListener(
    "resize",
    resizeCanvas
);


// ======================================================
// WEAPON BAG
// ======================================================

function refillWeaponBag() {
    weaponBag = [
        "plasma",
        "shotgun",
        "railgun",
        "void",
        "arc",
        "starfire",
        "frost",
        "solar",
        "nova",
        "singularity"
    ];

    for (
        let i =
            weaponBag.length - 1;

        i > 0;

        i--
    ) {
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
// DESKTOP INPUT
// ======================================================

canvas.addEventListener(
    "mousedown",
    event => {
        pointerActive = true;

        pointerX =
            event.clientX;

        pointerY =
            event.clientY;
    }
);

canvas.addEventListener(
    "mousemove",
    event => {
        if (!pointerActive) {
            return;
        }

        pointerX =
            event.clientX;

        pointerY =
            event.clientY;
    }
);

window.addEventListener(
    "mouseup",
    () => {
        pointerActive = false;
    }
);


// ======================================================
// MOBILE INPUT
// ======================================================

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

    {
        passive: false
    }
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

    {
        passive: false
    }
);

canvas.addEventListener(
    "touchend",
    event => {
        event.preventDefault();

        pointerActive = false;
    },

    {
        passive: false
    }
);

canvas.addEventListener(
    "touchcancel",
    () => {
        pointerActive = false;
    }
);


// ======================================================
// KEYBOARD INPUT
// ======================================================

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
// UTILITIES
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


function randomMapPosition(
    padding = 80
) {
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
// ENEMY SPAWNING
// ======================================================

function spawnEnemy() {
    const side =
        Math.floor(
            Math.random() *
            4
        );

    const margin = 50;

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
        650;


    // Smaller hippos
    const radius =
        19 +
        Math.random() *
        4;


    const enemy = {
        x,
        y,

        radius,

        speed:
            67 +
            Math.random() *
            32 +
            difficulty *
            3,

        baseSpeed: 0,

        health:
            70 +
            difficulty *
            12,

        maxHealth: 0,

        damage:
            17 +
            difficulty *
            0.45,

        hitCooldown: 0,

        slowTimer: 0,

        dead: false,

        bladeHit: 0
    };


    enemy.baseSpeed =
        enemy.speed;

    enemy.maxHealth =
        enemy.health;


    enemies.push(enemy);
}


// ======================================================
// WEAPON PICKUPS
// ======================================================

function spawnWeaponPickup() {
    if (
        weaponBag.length ===
        0
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


// ======================================================
// POWERUP SPAWNING
// ======================================================

function spawnPowerup() {
    const keysList =
        Object.keys(
            POWERUPS
        );


    const key =
        keysList[
            Math.floor(
                Math.random() *
                keysList.length
            )
        ];


    const pos =
        randomMapPosition();


    powerups.push({
        x: pos.x,
        y: pos.y,

        radius: 19,

        key,

        life: 14000,

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

    let nearestDistance =
        Infinity;


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
// WEAPON HELPERS
// ======================================================

function getCurrentWeapon() {
    return WEAPONS[
        player.weaponKey
    ];
}


function getDamageMultiplier() {
    let multiplier = 1;


    // Damage stacks
    multiplier *=
        1 +
        buffs.quad.stacks *
        1.25;


    // Berserk damage stacks
    multiplier *=
        1 +
        buffs.berserk.stacks *
        0.45;


    return multiplier;
}


function getFireRate(weapon) {
    let rate =
        weapon.fireRate;


    // Haste stacks
    rate *=
        Math.pow(
            0.80,
            buffs.haste.stacks
        );


    // Overdrive stacks
    rate *=
        Math.pow(
            0.82,
            buffs.overdrive.stacks
        );


    // Berserk stacks
    rate *=
        Math.pow(
            0.90,
            buffs.berserk.stacks
        );


    return Math.max(
        35,
        rate
    );
}


// ======================================================
// DAMAGE
// ======================================================

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


    const target =
        findNearestEnemy();


    if (!target) {
        return;
    }


    lastShot = time;


    const angle =
        Math.atan2(
            target.y -
            player.y,

            target.x -
            player.x
        );


    // SHOTGUN

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


    // ARC BLASTER

    if (
        weapon.type ===
        "arc"
    ) {
        fireArcWeapon(
            target,
            weapon
        );

        return;
    }


    // NOVA LANCE

    if (
        weapon.type ===
        "nova"
    ) {
        createBullet(
            angle,
            weapon
        );


        const sideCount =
            weapon.sideShots +
            buffs.overdrive.stacks;


        const spread =
            0.18;


        for (
            let i = 1;
            i <=
            sideCount;
            i++
        ) {
            createBullet(
                angle -
                spread *
                i,

                weapon
            );


            createBullet(
                angle +
                spread *
                i,

                weapon
            );
        }

        return;
    }


    // NORMAL SHOT

    createBullet(
        angle,
        weapon
    );


    // OVERDRIVE STACKING
    // Each stack adds two extra shots

    for (
        let i = 1;
        i <=
        buffs.overdrive.stacks;
        i++
    ) {
        const spread =
            0.10 *
            i;


        createBullet(
            angle -
            spread,

            weapon
        );


        createBullet(
            angle +
            spread,

            weapon
        );
    }
}


// ======================================================
// CREATE BULLET
// ======================================================

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

        pullRadius:
            weapon.pullRadius ||
            0,

        pullStrength:
            weapon.pullStrength ||
            0,

        life:
            weapon.type ===
            "singularity"
                ? 1900
                : 3000
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


    const totalChains =
        weapon.chains +
        buffs.overdrive.stacks;


    for (
        let i = 0;
        i <
        totalChains;
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

        let best =
            Infinity;


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
                d <
                best
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
    damage,
    duration = 300,
    color = "#c45cff"
) {
    explosions.push({
        x,
        y,

        radius: 0,

        maxRadius:
            radius,

        life:
            duration,

        duration,

        color
    });


    for (
        const enemy
        of enemies
    ) {
        if (
            enemy.dead
        ) {
            continue;
        }


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
// STACK POWERUPS
// ======================================================

function addTimedStack(
    key,
    durationPerPickup
) {
    const buff =
        buffs[key];


    buff.stacks =
        Math.min(
            buff.maxStacks,
            buff.stacks + 1
        );


    // Adds time instead of resetting it
    buff.time +=
        durationPerPickup;


    // Max 30 seconds stored
    buff.time =
        Math.min(
            buff.time,
            30000
        );
}


// ======================================================
// ACTIVATE POWERUP
// ======================================================

function activatePowerup(key) {
    switch (key) {
        case "heal":

            player.health =
                Math.min(
                    player.maxHealth,

                    player.health +
                    80
                );

            break;


        case "shield":

            player.shield =
                Math.min(
                    250,

                    player.shield +
                    85
                );

            break;


        case "quad":

            addTimedStack(
                "quad",
                7000
            );

            break;


        case "haste":

            addTimedStack(
                "haste",
                8000
            );

            break;


        case "overdrive":

            addTimedStack(
                "overdrive",
                6500
            );

            break;


        case "magnet":

            addTimedStack(
                "magnet",
                10000
            );

            break;


        case "berserk":

            addTimedStack(
                "berserk",
                7500
            );

            break;


        case "nuke":

            createExplosion(
                player.x,
                player.y,

                Math.max(
                    width,
                    height
                ) *
                1.45,

                999999,

                550,

                "#ffffff"
            );

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


    // Berserk also stacks movement speed

    speed *=
        1 +
        buffs.berserk.stacks *
        0.12;


    // KEYBOARD

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


    // TOUCH / MOUSE

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
            enemy.hitCooldown <=
            0
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
// BULLET UPDATE
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


        // HOMING

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


        // SINGULARITY PULL

        if (
            bullet.type ===
            "singularity"
        ) {
            for (
                const enemy
                of enemies
            ) {
                if (
                    enemy.dead
                ) {
                    continue;
                }


                const dx =
                    bullet.x -
                    enemy.x;

                const dy =
                    bullet.y -
                    enemy.y;


                const d =
                    Math.hypot(
                        dx,
                        dy
                    );


                if (
                    d > 1 &&
                    d <
                    bullet.pullRadius
                ) {
                    const pull =
                        bullet.pullStrength *
                        (
                            1 -
                            d /
                            bullet.pullRadius
                        ) *
                        delta;


                    enemy.x +=
                        dx /
                        d *
                        pull;


                    enemy.y +=
                        dy /
                        d *
                        pull;
                }
            }
        }


        bullet.x +=
            bullet.vx *
            delta;


        bullet.y +=
            bullet.vy *
            delta;


        const expired =
            bullet.life <= 0 ||

            bullet.x < -180 ||

            bullet.x >
            width + 180 ||

            bullet.y < -180 ||

            bullet.y >
            height + 180;


        if (expired) {
            if (
                bullet.type ===
                "singularity"
            ) {
                createExplosion(
                    bullet.x,
                    bullet.y,

                    bullet.explosionRadius,
                    bullet.explosionDamage,

                    350,

                    bullet.color
                );
            }


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


                // FROST

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


                // VOID EXPLOSION

                if (
                    bullet.type ===
                    "explosive"
                ) {
                    createExplosion(
                        bullet.x,
                        bullet.y,

                        bullet.explosionRadius,
                        bullet.explosionDamage,

                        300,

                        bullet.color
                    );


                    removeBullet =
                        true;

                    break;
                }


                // SINGULARITY EXPLOSION

                if (
                    bullet.type ===
                    "singularity"
                ) {
                    createExplosion(
                        bullet.x,
                        bullet.y,

                        bullet.explosionRadius,
                        bullet.explosionDamage,

                        350,

                        bullet.color
                    );


                    removeBullet =
                        true;

                    break;
                }


                // RAILGUN

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

function updateSolarBlades(delta) {
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
        3.8;


    // Overdrive adds blades

    const bladeCount =
        weapon.blades +
        buffs.overdrive.stacks;


    for (
        let i = 0;
        i <
        bladeCount;
        i++
    ) {
        const angle =
            orbitAngle +
            (
                Math.PI *
                2 /
                bladeCount
            ) *
            i;


        const blade = {
            x:
                player.x +
                Math.cos(
                    angle
                ) *
                72,

            y:
                player.y +
                Math.sin(
                    angle
                ) *
                72,

            radius: 12
        };


        for (
            const enemy
            of enemies
        ) {
            if (
                enemy.dead
            ) {
                continue;
            }


            if (
                circlesTouch(
                    blade,
                    enemy
                ) &&

                performance.now() -
                enemy.bladeHit >
                230
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
// MAGNET
// ======================================================

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


    const range =
        300 +
        buffs.magnet.stacks *
        90;


    const speed =
        350 +
        buffs.magnet.stacks *
        80;


    if (
        d <
        range &&
        d > 1
    ) {
        pickup.x +=
            dx /
            d *
            speed *
            delta;


        pickup.y +=
            dy /
            d *
            speed *
            delta;
    }
}


// ======================================================
// PICKUPS UPDATE
// ======================================================

function updatePickups(delta) {
    // WEAPONS

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
            buffs.magnet.stacks >
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


    // POWERUPS

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
            buffs.magnet.stacks >
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
        const buff =
            buffs[key];


        if (
            buff.time <= 0
        ) {
            continue;
        }


        buff.time -=
            elapsed;


        if (
            buff.time <= 0
        ) {
            buff.time = 0;

            buff.stacks = 0;
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


// ======================================================
// EFFECT UPDATE
// ======================================================

function updateEffects(delta) {
    // PARTICLES

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


    // EXPLOSIONS

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


        const progress =
            Math.max(
                0,

                Math.min(
                    1,

                    1 -
                    e.life /
                    e.duration
                )
            );


        // Prevents negative radius crash

        e.radius =
            Math.max(
                0,

                e.maxRadius *
                progress
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


    // LIGHTNING

    for (
        let i =
            lightningEffects.length -
            1;

        i >= 0;

        i--
    ) {
        lightningEffects[i]
            .life -=
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
// DRAW BACKGROUND
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
// DRAW HIPPOS
// ======================================================

function drawEnemies() {
    for (
        const enemy
        of enemies
    ) {
        // Smaller image
        const size =
            enemy.radius *
            2.65;


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


        // HP BAR

        if (
            enemy.health <
            enemy.maxHealth
        ) {
            const barWidth =
                32;


            ctx.fillStyle =
                "#250000";


            ctx.fillRect(
                enemy.x -
                barWidth /
                2,

                enemy.y -
                enemy.radius -
                8,

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
                8,

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


        ctx.shadowBlur =
            bullet.type ===
            "singularity"
                ? 25
                : 12;


        ctx.shadowColor =
            bullet.color;


        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,

            Math.max(
                0,
                bullet.radius
            ),

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            bullet.color;

        ctx.fill();


        // Singularity outer ring

        if (
            bullet.type ===
            "singularity"
        ) {
            ctx.beginPath();

            ctx.arc(
                bullet.x,
                bullet.y,

                Math.max(
                    0,

                    bullet.radius +
                    8
                ),

                0,
                Math.PI *
                2
            );


            ctx.strokeStyle =
                "rgba(255,255,255,0.6)";


            ctx.lineWidth = 2;

            ctx.stroke();
        }


        ctx.restore();
    }
}


// ======================================================
// DRAW SOLAR BLADES
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


    const bladeCount =
        weapon.blades +
        buffs.overdrive.stacks;


    for (
        let i = 0;
        i <
        bladeCount;
        i++
    ) {
        const angle =
            orbitAngle +
            (
                Math.PI *
                2 /
                bladeCount
            ) *
            i;


        const x =
            player.x +
            Math.cos(
                angle
            ) *
            72;


        const y =
            player.y +
            Math.sin(
                angle
            ) *
            72;


        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.rotate(angle);


        ctx.shadowBlur = 15;

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
// DRAW WEAPON PICKUPS
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


        const words =
            weapon.name.split(
                " "
            );


        if (
            words.length >
            1
        ) {
            ctx.fillText(
                words[0],

                pickup.x,

                pickup.y -
                5
            );


            ctx.fillText(
                words
                    .slice(1)
                    .join(" "),

                pickup.x,

                pickup.y +
                6
            );
        }

        else {
            ctx.fillText(
                weapon.name,

                pickup.x,
                pickup.y
            );
        }


        ctx.restore();
    }
}


// ======================================================
// DRAW POWERUPS
// ======================================================

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


        ctx.shadowBlur = 20;

        ctx.shadowColor =
            data.color;


        ctx.beginPath();


        ctx.arc(
            pickup.x,
            pickup.y,

            Math.max(
                0,

                pickup.radius *
                pulse
            ),

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
            "bold 8px Arial";


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
    // PARTICLES

    for (
        const particle
        of particles
    ) {
        ctx.beginPath();


        ctx.arc(
            particle.x,
            particle.y,

            Math.max(
                0,
                particle.radius
            ),

            0,
            Math.PI *
            2
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fill();
    }


    // EXPLOSIONS

    for (
        const explosion
        of explosions
    ) {
        ctx.save();


        ctx.globalAlpha =
            Math.max(
                0,

                explosion.life /
                explosion.duration
            );


        ctx.beginPath();


        ctx.arc(
            explosion.x,
            explosion.y,

            Math.max(
                0,
                explosion.radius
            ),

            0,
            Math.PI *
            2
        );


        ctx.strokeStyle =
            explosion.color;


        ctx.lineWidth = 10;

        ctx.stroke();


        ctx.restore();
    }


    // LIGHTNING

    for (
        const lightning
        of lightningEffects
    ) {
        ctx.save();


        ctx.shadowBlur = 15;

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
            i <
            segments;
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
// DRAW ACTIVE BUFFS
// ======================================================

function drawBuffs() {
    let y = 62;


    ctx.textAlign =
        "left";


    ctx.font =
        "bold 12px Arial";


    const labels = {
        quad:
            "DAMAGE",

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
        const buff =
            buffs[key];


        if (
            buff.stacks <= 0 ||
            buff.time <= 0
        ) {
            continue;
        }


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            `${labels[key]} x${buff.stacks} ${(buff.time / 1000).toFixed(1)}s`,

            12,
            y
        );


        y += 17;
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
        buffs[key].stacks = 0;

        buffs[key].time = 0;
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
            8500
        ) {
            weaponSpawnTimer = 0;

            spawnWeaponPickup();
        }


        if (
            powerupSpawnTimer >=
            9000
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
// START GAME
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
