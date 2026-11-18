// --- 1. THREE.JS 3D SCENE SETUP ---
const container = document.getElementById("canvas-wrapper");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090a1a, 0.015);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4.2, 8.5);
camera.lookAt(0, 1, -10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// लाइटिंग (Lights)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00f3ff, 1.1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --- 2. SOUND ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === "coin") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === "levelup") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === "crash") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// --- 3. 3D ROAD & ENVIRONMENT ---
const roadWidth = 12;
const roadGeo = new THREE.PlaneGeometry(roadWidth, 250);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x151726, roughness: 0.7 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.z = -100;
scene.add(road);

// सड़क के किनारे नियॉन बॉर्डर
const borderGeo = new THREE.BoxGeometry(0.3, 0.3, 250);
const leftBorderMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
const rightBorderMat = new THREE.MeshBasicMaterial({ color: 0xff2a6d });

const leftBorder = new THREE.Mesh(borderGeo, leftBorderMat);
leftBorder.position.set(-roadWidth / 2, 0.15, -100);
scene.add(leftBorder);

const rightBorder = new THREE.Mesh(borderGeo, rightBorderMat);
rightBorder.position.set(roadWidth / 2, 0.15, -100);
scene.add(rightBorder);

// सड़क की चलती हुई सफेद पट्टियाँ
const roadLines = [];
const lineGeo = new THREE.BoxGeometry(0.2, 0.05, 3);
const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
for (let z = 10; z > -180; z -= 10) {
  [-2, 2].forEach(lx => {
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(lx, 0.03, z);
    scene.add(line);
    roadLines.push(line);
  });
}

// सड़क के दोनों तरफ 3D बिल्डिंग्स और खंभे
const scenery = [];
function createScenery() {
  for (let z = 0; z > -180; z -= 12) {
    [-1, 1].forEach(side => {
      const h = 6 + Math.random() * 18;
      const bGeo = new THREE.BoxGeometry(4, h, 5);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x101326,
        emissive: side === -1 ? 0x002233 : 0x220011
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(side * (roadWidth / 2 + 5 + Math.random() * 3), h / 2, z);
      scene.add(building);
      scenery.push(building);
    });
  }
}
createScenery();

// --- 4. 3D SPORTS CAR BUILDER ---
function build3DCar(bodyColor, stripeColor, isPlayer = false) {
  const carGroup = new THREE.Group();

  // मुख्य चेसिस (नीचे की बॉडी)
  const chassisGeo = new THREE.BoxGeometry(1.9, 0.65, 4.0);
  const chassisMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.6, roughness: 0.2 });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.y = 0.55;
  carGroup.add(chassis);

  // केबिन (ऊपर का हिस्सा)
  const cabinGeo = new THREE.BoxGeometry(1.45, 0.5, 2.0);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0a0a12, metalness: 0.9, roughness: 0.1 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.05, -0.1);
  carGroup.add(cabin);

  // रेसिंग स्ट्राइप
  const stripeGeo = new THREE.BoxGeometry(0.4, 0.67, 4.02);
  const stripeMat = new THREE.MeshBasicMaterial({ color: stripeColor });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = 0.55;
  carGroup.add(stripe);

  // रियर स्पॉइलर (Spoiler)
  const wingGeo = new THREE.BoxGeometry(1.95, 0.12, 0.4);
  const wing = new THREE.Mesh(wingGeo, stripeMat);
  wing.position.set(0, 1.15, isPlayer ? 1.75 : -1.75);
  carGroup.add(wing);

  // 4 पहिये (Wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const wheelPositions = [
    [-0.95, 0.42, 1.2], [0.95, 0.42, 1.2],
    [-0.95, 0.42, -1.2], [0.95, 0.42, -1.2]
  ];
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(...pos);
    carGroup.add(wheel);
  });

  // हेडलाइट्स और टेललाइट्स
  const lightGeo = new THREE.BoxGeometry(0.4, 0.18, 0.1);
  const frontMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

  [-0.6, 0.6].forEach(lx => {
    const fLight = new THREE.Mesh(lightGeo, isPlayer ? frontMat : tailMat);
    fLight.position.set(lx, 0.55, -2.01);
    carGroup.add(fLight);

    const bLight = new THREE.Mesh(lightGeo, isPlayer ? tailMat : frontMat);
    bLight.position.set(lx, 0.55, 2.01);
    carGroup.add(bLight);
  });

  return carGroup;
}

const playerCar = build3DCar(0x00f3ff, 0xffffff, true);
scene.add(playerCar);

// नाइट्रो आग (3D Flame)
const flameGeo = new THREE.ConeGeometry(0.35, 1.5, 8);
const flameMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
const nitroFlame = new THREE.Mesh(flameGeo, flameMat);
nitroFlame.rotation.x = Math.PI / 2;
nitroFlame.position.set(0, 0.5, 2.6);
nitroFlame.visible = false;
playerCar.add(nitroFlame);

// --- 5. GAME STATE & CONTROLS ---
let gameRunning = false;
let score = 0;
let coins = 0;
let level = 1;
let baseSpeed = 0.85;
let nitroActive = false;
let highScore = localStorage.getItem("cyber3DHigh") || 0;

document.getElementById("highScoreText").innerText = `🏆 बेस्ट स्कोर: ${highScore}`;

let enemies = [];
let coinMeshes = [];
const lanes = [-4, 0, 4];
let targetX = 0;
let keys = { left: false, right: false };

window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") nitroActive = true;
});
window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") nitroActive = false;
});

const bindTouch = (id, onStart, onEnd) => {
  const btn = document.getElementById(id);
  btn.addEventListener("touchstart", e => { e.preventDefault(); onStart(); });
  btn.addEventListener("touchend", e => { e.preventDefault(); onEnd(); });
  btn.addEventListener("mousedown", onStart);
  btn.addEventListener("mouseup", onEnd);
};
bindTouch("leftBtn", () => keys.left = true, () => keys.left = false);
bindTouch("rightBtn", () => keys.right = true, () => keys.right = false);
bindTouch("nitroBtn", () => nitroActive = true, () => nitroActive = false);

// लेवल के हिसाब से वातावरण बदलना
function checkLevelTheme(newLevel) {
  const banner = document.getElementById("levelBanner");
  if (newLevel === 2) {
    scene.fog.color.setHex(0x2b1005);
    leftBorderMat.color.setHex(0xff9800);
    rightBorderMat.color.setHex(0xffd700);
    banner.innerText = "🔥 LEVEL 2: SUNSET HIGHWAY!";
  } else if (newLevel >= 3) {
    scene.fog.color.setHex(0x031f0e);
    leftBorderMat.color.setHex(0x00ff66);
    rightBorderMat.color.setHex(0x00f3ff);
    banner.innerText = "⚡ LEVEL 3: MATRIX OVERDRIVE!";
  }
  banner.style.opacity = 1;
  playSound("levelup");
  setTimeout(() => { banner.style.opacity = 0; }, 2500);
}

// --- 6. SPAWN TRAFFIC & 3D COINS ---
const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 16);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xaa6600, metalness: 0.8 });

function spawnEntities() {
  // ट्रैफिक गाड़ियाँ
  if (Math.random() < 0.03 + level * 0.005) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const tooClose = enemies.some(en => en.position.x === laneX && en.position.z < -95);
    if (!tooClose) {
      const colors = [0xff2a6d, 0xff9800, 0xaa00ff, 0x00e676];
      const col = colors[Math.floor(Math.random() * colors.length)];
      const enemyCar = build3DCar(col, 0x111111, false);
      enemyCar.position.set(laneX, 0, -140);
      scene.add(enemyCar);
      enemies.push(enemyCar);
    }
  }

  // 3D घूमते हुए कॉइन्स
  if (Math.random() < 0.035) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    coin.position.set(laneX, 0.8, -140);
    scene.add(coin);
    coinMeshes.push(coin);
  }
}

// --- 7. MAIN 3D ANIMATION LOOP ---
function animate() {
  requestAnimationFrame(animate);

  if (!gameRunning) {
    // मेनू स्क्रीन पर कार धीरे-धीरे घूमेगी
    playerCar.rotation.y += 0.01;
    renderer.render(scene, camera);
    return;
  }

  playerCar.rotation.y = 0;
  const speed = nitroActive ? baseSpeed * 1.75 : baseSpeed;
  score += nitroActive ? 2 : 1;

  const displayScore = Math.floor(score / 8);
  const newLevel = 1 + Math.floor(displayScore / 350);
  if (newLevel > level) {
    level = newLevel;
    baseSpeed += 0.18;
    checkLevelTheme(level);
  }

  document.getElementById("score").innerText = displayScore;
  document.getElementById("level").innerText = level;
  document.getElementById("coins").innerText = coins;
  document.getElementById("speed").innerText = Math.floor(speed * 165) + " km/h";

  // नाइट्रो इफेक्ट और कैमरा ज़ूम
  nitroFlame.visible = nitroActive;
  if (nitroActive) {
    nitroFlame.scale.set(1, 0.8 + Math.random() * 0.6, 1);
    camera.fov += (78 - camera.fov) * 0.1;
  } else {
    camera.fov += (65 - camera.fov) * 0.1;
  }
  camera.updateProjectionMatrix();

  // कार स्टीयरिंग और टिल्ट (झुकाव)
  if (keys.left && targetX > -4.3) {
    targetX -= 0.22;
    playerCar.rotation.z = 0.12;
  } else if (keys.right && targetX < 4.3) {
    targetX += 0.22;
    playerCar.rotation.z = -0.12;
  } else {
    playerCar.rotation.z *= 0.85;
  }
  playerCar.position.x += (targetX - playerCar.position.x) * 0.2;

  // सड़क की लाइनें और बिल्डिंग्स आगे बढ़ाना
  roadLines.forEach(line => {
    line.position.z += speed;
    if (line.position.z > 15) line.position.z -= 190;
  });

  scenery.forEach(b => {
    b.position.z += speed;
    if (b.position.z > 20) b.position.z -= 192;
  });

  spawnEntities();

  // 3D कॉइन्स अपडेट और कलेक्शन
  for (let i = coinMeshes.length - 1; i >= 0; i--) {
    const c = coinMeshes[i];
    c.position.z += speed;
    c.rotation.z += 0.08;

    if (
      Math.abs(c.position.x - playerCar.position.x) < 1.3 &&
      Math.abs(c.position.z - playerCar.position.z) < 2.2
    ) {
      coins++;
      score += 150;
      playSound("coin");
      scene.remove(c);
      coinMeshes.splice(i, 1);
    } else if (c.position.z > 15) {
      scene.remove(c);
      coinMeshes.splice(i, 1);
    }
  }

  // दुश्मन 3D गाड़ियाँ और टक्कर चेक
  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    en.position.z += speed * 0.72;

    if (
      Math.abs(en.position.x - playerCar.position.x) < 1.55 &&
      Math.abs(en.position.z - playerCar.position.z) < 3.5
    ) {
      endGame();
      return;
    }

    if (en.position.z > 18) {
      scene.remove(en);
      enemies.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
}

function endGame() {
  gameRunning = false;
  playSound("crash");

  const finalDisplayScore = Math.floor(score / 8);
  if (finalDisplayScore > highScore) {
    highScore = finalDisplayScore;
    localStorage.setItem("cyber3DHigh", highScore);
  }

  document.getElementById("title").innerText = "WRECKED IN 3D!";
  document.getElementById("highScoreText").innerText = `🏆 बेस्ट स्कोर: ${highScore}`;
  document.getElementById("finalScore").innerText =
    `स्कोर: ${finalDisplayScore}  |  कॉइन्स: ${coins}  |  लेवल: ${level}`;
  document.getElementById("startBtn").innerText = "फिर से रेस करें";
  document.getElementById("overlay").style.display = "flex";
}

document.getElementById("startBtn").addEventListener("click", () => {
  // रीसेट गेम
  score = 0;
  coins = 0;
  level = 1;
  baseSpeed = 0.85;
  targetX = 0;
  playerCar.position.set(0, 0, 0);
  scene.fog.color.setHex(0x090a1a);
  leftBorderMat.color.setHex(0x00f3ff);
  rightBorderMat.color.setHex(0xff2a6d);

  enemies.forEach(en => scene.remove(en));
  coinMeshes.forEach(c => scene.remove(c));
  enemies = [];
  coinMeshes = [];

  gameRunning = true;
  document.getElementById("overlay").style.display = "none";
});

// स्क्रीन साइज़ बदलने पर 3D कैमरा एडजस्ट करें
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
                         
