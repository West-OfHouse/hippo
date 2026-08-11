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
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ======================================================
// IMAGES
// ======================================================

const hippoImage = new Image();
hippoImage.src = "hippo.png";


// ======================================================
// GAME STATE
// ======================================================

let gameRunning = true;

let score = 0;

let lastTime = 0;

let enemySpawnTimer = 0;

let weaponSpawnTimer = 0;

let lastShot = 0;


// ======================================================
// PLAYER
// ======================================================

const player = {
    x: width / 2,
    y: height / 2,

    radius: 18,

    speed: 250,

    health: 100,
    maxHealth: 100,

    color: "#4fc3f7",

    weapon: null
};


// ======================================================
// WEAPONS
// ======================================================

const WEAPONS = {
    pistol: {
        name: "Pistol",

        damage: 25,
        fireRate: 500,

        bulletSpeed: 600,
        bulletSize: 5,

        color: "#ffffff"
    },

    smg: {
        name: "SMG",

        damage: 10,
        fireRate: 120,

        bulletSpeed: 650,
        bulletSize: 4,

        color: "#00e5ff"
    },

    shotgun: {
        name: "Shotgun",

        damage: 18,
        fireRate: 800,

        bulletSpeed: 550,
        bulletSize: 5,

        pellets: 5,
        spread: 0.4,

        color: "#ff9800"
    },

    rifle: {
        name: "Rifle",

        damage: 45,
        fireRate: 700,

        bulletSpeed: 850,
        bulletSize: 6,

        color: "#ffeb3b"
    }
};

player.weapon = WEAPONS.pistol;


// ======================================================
// ARRAYS
// ======================================================

let enemies = [];
let bullets = [];
let weaponPickups = [];


// ======================================================
// WEAPON SPAWN BAG
// ======================================================

let weaponBag = [];

function refillWeaponBag() {
    weaponBag = [
        "smg",
        "shotgun",
        "rifle"
    ];

    for (let i = weaponBag.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
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

let pointerX = player.x;
let pointerY = player.y;


// DESKTOP MOUSE

canvas.addEventListener("mousedown", (event) => {
    pointerActive = true;

    pointerX = event.clientX;
    pointerY = event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
    if (!pointerActive) return;

    pointerX = event.clientX;
    pointerY = event.clientY;
});

window.addEventListener("mouseup", () => {
    pointerActive = false;
});


// MOBILE TOUCH

canvas.addEventListener(
    "touchstart",
    (event) => {
        event.preventDefault();

        const touch = event.touches[0];

        pointerActive = true;

        pointerX = touch.clientX;
        pointerY = touch.clientY;
    },
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    (event) => {
        event.preventDefault();

        const touch = event.touches[0];

        pointerX = touch.clientX;
        pointerY = touch.clientY;
    },
    { passive: false }
);

canvas.addEventListener(
    "touchend",
    (event) => {
        event.preventDefault();

        pointerActive = false;
    },
    { passive: false }
);

canvas.addEventListener(
    "touchcancel",
    () => {
        pointerActive = false;
    }
);


// ======================================================
// OPTIONAL WASD DESKTOP MOVEMENT
// ======================================================

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});


// ======================================================
// ENEMY SPAWNING
// ======================================================

function spawnEnemy() {
    const side = Math.floor(
        Math.random() * 4
    );

    let x;
    let y;

    const margin = 50;

    if (side === 0) {
        x = Math.random() * width;
        y = -margin;
    }

    else if (side === 1) {
        x = width + margin;
        y = Math.random() * height;
    }

    else if (side === 2) {
        x = Math.random() * width;
        y = height + margin;
    }

    else {
        x = -margin;
        y = Math.random() * height;
    }

    const difficulty =
        1 + score / 500;

    enemies.push({
        x,
        y,

        radius: 24,

        speed:
            70 +
            Math.random() * 30 +
            difficulty * 3,

        health:
            50 +
            difficulty * 8,

        damage: 15,

        hitCooldown: 0
    });
}


// ======================================================
// WEAPON PICKUPS
// ======================================================

function spawnWeaponPickup() {
    if (weaponBag.length === 0) {
        refillWeaponBag();
    }

    const weaponKey = weaponBag.pop();

    const padding = 80;

    const safeWidth =
        Math.max(
            1,
            width - padding * 2
        );

    const safeHeight =
        Math.max(
            1,
            height - padding * 2
        );

    weaponPickups.push({
        x:
            padding +
            Math.random() *
            safeWidth,

        y:
            padding +
            Math.random() *
            safeHeight,

        radius: 20,

        weaponKey,

        life: 15000
    });
}


// ======================================================
// TARGETING
// ======================================================

function findNearestEnemy() {
    let nearest = null;

    let nearestDistance = Infinity;

    for (const enemy of enemies) {
        const dx =
            enemy.x - player.x;

        const dy =
            enemy.y - player.y;

        const distanceSquared =
            dx * dx +
            dy * dy;

        if (
            distanceSquared <
            nearestDistance
        ) {
            nearestDistance =
                distanceSquared;

            nearest = enemy;
        }
    }

    return nearest;
}


// ======================================================
// SHOOTING
// ======================================================

function shoot(time) {
    if (enemies.length === 0) {
        return;
    }

    if (
        time - lastShot <
        player.weapon.fireRate
    ) {
        return;
    }

    lastShot = time;

    const enemy =
        findNearestEnemy();

    if (!enemy) {
        return;
    }

    const angle =
        Math.atan2(
            enemy.y - player.y,
            enemy.x - player.x
        );

    if (player.weapon.pellets) {
        for (
            let i = 0;
            i < player.weapon.pellets;
            i++
        ) {
            const spread =
                (
                    Math.random() -
                    0.5
                ) *
                player.weapon.spread;

            createBullet(
                angle + spread
            );
        }
    }

    else {
        createBullet(angle);
    }
}


function createBullet(angle) {
    bullets.push({
        x: player.x,
        y: player.y,

        vx:
            Math.cos(angle) *
            player.weapon.bulletSpeed,

        vy:
            Math.sin(angle) *
            player.weapon.bulletSpeed,

        damage:
            player.weapon.damage,

        radius:
            player.weapon.bulletSize,

        color:
            player.weapon.color
    });
}


// ======================================================
// COLLISION
// ======================================================

function circlesTouch(a, b) {
    const dx =
        a.x - b.x;

    const dy =
        a.y - b.y;

    const distanceSquared =
        dx * dx +
        dy * dy;

    const combinedRadius =
        a.radius +
        b.radius;

    return (
        distanceSquared <
        combinedRadius *
        combinedRadius
    );
}


// ======================================================
// PLAYER UPDATE
// ======================================================

function updatePlayer(delta) {
    let moveX = 0;
    let moveY = 0;


    // WASD

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {
        moveY -= 1;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        moveY += 1;
    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        moveX -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        moveX += 1;
    }


    // If keyboard is being used

    if (
        moveX !== 0 ||
        moveY !== 0
    ) {
        const length =
            Math.sqrt(
                moveX * moveX +
                moveY * moveY
            );

        moveX /= length;
        moveY /= length;

        player.x +=
            moveX *
            player.speed *
            delta;

        player.y +=
            moveY *
            player.speed *
            delta;
    }


    // Otherwise use mouse/touch

    else if (pointerActive) {
        const dx =
            pointerX -
            player.x;

        const dy =
            pointerY -
            player.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance > 5) {
            const dirX =
                dx /
                distance;

            const dirY =
                dy /
                distance;

            const movement =
                player.speed *
                delta;

            player.x +=
                dirX *
                Math.min(
                    movement,
                    distance
                );

            player.y +=
                dirY *
                Math.min(
                    movement,
                    distance
                );
        }
    }


    // Keep player on screen

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

        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance > 0) {
            enemy.x +=
                dx /
                distance *
                enemy.speed *
                delta;

            enemy.y +=
                dy /
                distance *
                enemy.speed *
                delta;
        }


        if (enemy.hitCooldown > 0) {
            enemy.hitCooldown -=
                delta *
                1000;
        }


        if (
            circlesTouch(
                player,
                enemy
            )
        ) {
            if (
                enemy.hitCooldown <= 0
            ) {
                player.health -=
                    enemy.damage;

                enemy.hitCooldown =
                    700;

                if (
                    player.health <= 0
                ) {
                    player.health = 0;

                    endGame();
                }
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

        bullet.x +=
            bullet.vx *
            delta;

        bullet.y +=
            bullet.vy *
            delta;


        if (
            bullet.x < -50 ||
            bullet.x > width + 50 ||
            bullet.y < -50 ||
            bullet.y > height + 50
        ) {
            bullets.splice(
                i,
                1
            );

            continue;
        }


        for (
            let j =
                enemies.length - 1;

            j >= 0;

            j--
        ) {
            const enemy =
                enemies[j];

            if (
                circlesTouch(
                    bullet,
                    enemy
                )
            ) {
                enemy.health -=
                    bullet.damage;

                bullets.splice(
                    i,
                    1
                );


                if (
                    enemy.health <= 0
                ) {
                    enemies.splice(
                        j,
                        1
                    );

                    score += 10;
                }

                break;
            }
        }
    }
}


// ======================================================
// WEAPON PICKUP UPDATE
// ======================================================

function updateWeaponPickups(delta) {
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
            player.weapon =
                WEAPONS[
                    pickup.weaponKey
                ];

            weaponPickups.splice(
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
    ctx.fillStyle = "#182119";

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
    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
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
    for (const enemy of enemies) {
        if (
            hippoImage.complete &&
            hippoImage.naturalWidth > 0
        ) {
            const size =
                enemy.radius *
                2.8;

            ctx.drawImage(
                hippoImage,

                enemy.x -
                size / 2,

                enemy.y -
                size / 2,

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
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ff4081";

            ctx.fill();
        }
    }
}


// ======================================================
// DRAW BULLETS
// ======================================================

function drawBullets() {
    for (const bullet of bullets) {
        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            bullet.color;

        ctx.fill();
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


        ctx.beginPath();

        ctx.arc(
            pickup.x,
            pickup.y,
            pickup.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,0,0,0.55)";

        ctx.fill();


        ctx.strokeStyle =
            weapon.color;

        ctx.lineWidth = 4;

        ctx.stroke();


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 11px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillText(
            weapon.name,
            pickup.x,
            pickup.y
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
        "Weapon: " +
        player.weapon.name;

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

    score = 0;

    player.x =
        width / 2;

    player.y =
        height / 2;

    player.health =
        player.maxHealth;

    player.weapon =
        WEAPONS.pistol;

    lastShot = 0;

    enemySpawnTimer = 0;

    weaponSpawnTimer = 0;

    pointerActive = false;

    weaponBag = [];

    refillWeaponBag();


    gameRunning = true;

    gameOverScreen.classList.add(
        "hidden"
    );

    spawnWeaponPickup();
    spawnWeaponPickup();

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


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    drawBackground();


    if (gameRunning) {
        enemySpawnTimer +=
            delta *
            1000;

        weaponSpawnTimer +=
            delta *
            1000;


        const enemySpawnRate =
            Math.max(
                350,
                1200 -
                score *
                1.5
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
            8000
        ) {
            weaponSpawnTimer = 0;

            spawnWeaponPickup();
        }


        updatePlayer(delta);

        updateEnemies(delta);

        updateBullets(delta);

        updateWeaponPickups(delta);

        shoot(time);

        updateHUD();
    }


    drawWeaponPickups();

    drawEnemies();

    drawBullets();

    drawPlayer();


    requestAnimationFrame(
        gameLoop
    );
}


// ======================================================
// START GAME
// ======================================================

refillWeaponBag();

spawnWeaponPickup();
spawnWeaponPickup();

updateHUD();

lastTime =
    performance.now();

requestAnimationFrame(
    gameLoop
);