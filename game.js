// --- 1. REALISTIC DATA: CARS, PAINTS, DRIVERS & TRACKS ---
const CARS = [
  { name: "BMW M4 GTS", brand: "GERMAN PERFORMANCE", bodyType: "coupe", defaultColor: 0x0066ff, speed: 1.08, steer: 0.25, specs: "310 km/h • Twin-Turbo M-Power" },
  { name: "TATA CURVV EV", brand: "INDIAN FUTURISTIC SUV", bodyType: "suv", defaultColor: 0xff3b30, speed: 1.02, steer: 0.23, specs: "240 km/h • Coupe SUV Aero" },
  { name: "TESLA CYBERTRUCK", brand: "AMERICAN ELECTRIC", bodyType: "cyber", defaultColor: 0xb0bec5, speed: 1.06, steer: 0.22, specs: "280 km/h • Exoskeleton Steel" },
  { name: "MAHINDRA THAR ROXX", brand: "INDIAN 4x4 OFFROAD", bodyType: "jeep", defaultColor: 0x111111, speed: 0.98, steer: 0.24, specs: "210 km/h • 4x4 Monster Torque" },
  { name: "LAMBORGHINI AVENTADOR", brand: "ITALIAN HYPERCAR", bodyType: "super", defaultColor: 0xffd700, speed: 1.18, steer: 0.28, specs: "350 km/h • V12 Naturally Aspirated" },
  { name: "PORSCHE 911 GT3", brand: "GERMAN TRACK LEGEND", bodyType: "coupe", defaultColor: 0xffffff, speed: 1.14, steer: 0.27, specs: "325 km/h • Rear-Engine Grip" },
  { name: "FORD MUSTANG GT", brand: "AMERICAN MUSCLE", bodyType: "muscle", defaultColor: 0xd50000, speed: 1.10, steer: 0.24, specs: "295 km/h • 5.0L V8 Coyote" },
  { name: "BUGATTI CHIRON", brand: "FRENCH HYPER-BEAST", bodyType: "super", defaultColor: 0x00b0ff, speed: 1.24, steer: 0.29, specs: "420 km/h • W16 Quad-Turbo" },
  { name: "MERCEDES AMG GT", brand: "GERMAN LUXURY SPORT", bodyType: "coupe", defaultColor: 0x00e676, speed: 1.12, steer: 0.26, specs: "318 km/h • AMG Biturbo" },
  { name: "NISSAN GT-R NISMO", brand: "JAPANESE GODZILLA", bodyType: "coupe", defaultColor: 0x757575, speed: 1.15, steer: 0.27, specs: "330 km/h • AWD Twin-Turbo" }
];

const PAINT_COLORS = [
  { name: "Racing Blue", hex: 0x0066ff },
  { name: "Crimson Red", hex: 0xd50000 },
  { name: "Matte Black", hex: 0x18181c },
  { name: "Pearl White", hex: 0xf5f5f7 },
  { name: "Solar Gold", hex: 0xffc400 },
  { name: "Emerald Green", hex: 0x00c853 },
  { name: "Sunset Orange", hex: 0xff6d00 },
  { name: "Titanium Silver", hex: 0x90a4ae }
];

const DRIVERS = [
  { id: 0, name: "Aarav Sharma", role: "Speed Specialist", icon: "🏎️", helmet: 0x00f3ff, bonusSpeed: 1.08, bonusNitro: 1.2, desc: "+8% Top Speed & Super Nitro" },
  { id: 1, name: "Vikram Rathore", role: "Drift Master", icon: "🕶️", helmet: 0xff2a6d, bonusSpeed: 1.0, bonusNitro: 1.0, desc: "+20% Sharp Steering Control" },
  { id: 2, name: "Kabir Singh", role: "Highway King", icon: "🔥", helmet: 0xffd700, bonusSpeed: 1.05, bonusNitro: 1.1, desc: "+2x Score Multiplier" },
  { id: 3, name: "Rohan Verma", role: "Tech Racer", icon: "⚡", helmet: 0x00e676, bonusSpeed: 1.03, bonusNitro: 1.15, desc: "+50% Bonus Coins Value" }
];

const TRACKS = [
  { id: 0, name: "Mumbai Sea Link", icon: "🌊", sky: 0x4da6ff, fog: 0x80c1ff, road: 0x2b2e3b, env: "coast", desc: "दिन की रोशनी • समुद्र किनारा" },
  { id: 1, name: "Delhi-Jaipur Night", icon: "🌃", sky: 0x070b19, fog: 0x070b19, road: 0x161822, env: "night", desc: "रात का एक्सप्रेसवे • हेडलाइट्स" },
  { id: 2, name: "Manali Snow Pass", icon: "🏔️", sky: 0xcfd8dc, fog: 0xeceff1, road: 0x37474f, env: "snow", desc: "बर्फीली पहाड़ियाँ • ठंडा कोहरा" },
  { id: 3, name: "Cyber Neon City", icon: "⚡", sky: 0x120428, fog: 0x1a0638, road: 0x11111a, env: "cyber", desc: "फ्यूचर हाईवे • नियॉन लाइट्स" }
];

let selectedCarIdx = 0;
let selectedColorHex = CARS[0].defaultColor;
let selectedDriverIdx = 0;
let selectedTrackIdx = 0;

// --- 2. THREE.JS REALISTIC 3D ENGINE ---
const container = document.getElementById("canvas-wrapper");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(20, 40, 25);
scene.add(dirLight);

// --- 3. REALISTIC CAR BUILDER (WITH DRIVER INSIDE) ---
function createRealisticCar(carData, paintHex, driverHelmetColor = 0x00f3ff, isPlayer = false) {
  const car = new THREE.Group();
  const paintMat = new THREE.MeshStandardMaterial({
    color: paintHex,
    metalness: 0.75,
    roughness: 0.18
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x121318, roughness: 0.6 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0a101d, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.85 });

  // बॉडी शेप (SUV, Jeep, Cybertruck, या Supercar)
  if (carData.bodyType === "cyber") {
    const lower = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.65, 4.4), paintMat);
    lower.position.y = 0.6;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.45, 1.15, 4), paintMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 1.35, 0);
    car.add(lower, roof);
  } else if (carData.bodyType === "jeep" || carData.bodyType === "suv") {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.75, 4.1), paintMat);
    body.position.y = 0.68;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.68, 2.3), glassMat);
    cabin.position.set(0, 1.35, -0.15);
    const roofTop = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.1, 2.32), paintMat);
    roofTop.position.set(0, 1.7, -0.15);
    car.add(body, cabin, roofTop);
  } else {
    // स्पोर्ट्स / सुपरकार एयरोडायनामिक बॉडी
    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.52, 4.3), paintMat);
    lower.position.y = 0.5;
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.25, 1.4), paintMat);
    hood.position.set(0, 0.78, isPlayer ? -1.2 : 1.2);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.52, 1.85), glassMat);
    cabin.position.set(0, 0.98, 0.1);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.4), paintMat);
    roof.position.set(0, 1.25, 0.15);
    car.add(lower, hood, cabin, roof);
  }

  // केबिन के अंदर बैठा 3D ड्राइवर (हेलमेट और कंधे)
  const driverSeat = new THREE.Group();
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshStandardMaterial({ color: driverHelmetColor, metalness: 0.6, roughness: 0.2 })
  );
  helmet.position.set(-0.32, 1.02, 0.05);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  visor.position.set(-0.32, 1.03, isPlayer ? -0.12 : 0.22);
  driverSeat.add(helmet, visor);
  car.add(driverSeat);

  // फ्रंट ग्रिल (BMW/Audi/Tata स्टाइल) और बम्पर
  const grill = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.12), darkTrimMat);
  grill.position.set(0, 0.48, isPlayer ? -2.14 : 2.14);
  car.add(grill);

  // साइड मिरर्स (Side Mirrors)
  [-1.06, 1.06].forEach(mx => {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), paintMat);
    mirror.position.set(mx, 0.88, isPlayer ? -0.55 : 0.55);
    car.add(mirror);
  });

  // 4 रियलिस्टिक पहिये (Tires + Metallic Rims)
  const tireGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.36, 20);
  const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 12);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.9, roughness: 0.2 });

  car.wheels = [];
  [[-1.0, 0.45, 1.3], [1.0, 0.45, 1.3], [-1.0, 0.45, -1.3], [1.0, 0.45, -1.3]].forEach(pos => {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, darkTrimMat);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    tire.rotation.z = Math.PI / 2;
    rim.rotation.z = Math.PI / 2;
    wg.add(tire, rim);
    wg.position.set(...pos);
    car.add(wg);
    car.wheels.push(wg);
  });

  // हेडलाइट्स और टेललाइट्स
  const lightGeo = new THREE.BoxGeometry(0.45, 0.14, 0.1);
  const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });

  [-0.65, 0.65].forEach(lx => {
    const hl = new THREE.Mesh(lightGeo, isPlayer ? headMat : tailMat);
    hl.position.set(lx, 0.56, -2.15);
    const tl = new THREE.Mesh(lightGeo, isPlayer ? tailMat : headMat);
    tl.position.set(lx, 0.56, 2.15);
    car.add(hl, tl);
  });

  return car;
}

let playerCar = createRealisticCar(CARS[0], selectedColorHex, DRIVERS[0].helmet, true);
scene.add(playerCar);

// --- 4. REALISTIC ROAD & ENVIRONMENT ---
const roadWidth = 14;
const roadMat = new THREE.MeshStandardMaterial({ color: 0x2b2e3b, roughness: 0.85 });
const road = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, 320), roadMat);
road.rotation.x = -Math.PI / 2;
road.position.z = -130;
scene.add(road);

// दोनों तरफ फुटपाथ
const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x454a59 });
const leftWalk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 320), sidewalkMat);
leftWalk.position.set(-10, 0.15, -130);
const rightWalk = leftWalk.clone();
rightWalk.position.x = 10;
scene.add(leftWalk, rightWalk);

// सड़क की सफेद पट्टियाँ
const roadLines = [];
const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
for (let z = 15; z > -240; z -= 11) {
  [-2.35, 2.35].forEach(lx => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 3.5), lineMat);
    l.position.set(lx, 0.03, z);
    scene.add(l);
    roadLines.push(l);
  });
}

// सड़क के किनारे पेड़, खंभे और इमारतें
const envProps = [];
for (let z = 0; z > -240; z -= 16) {
  [-1, 1].forEach(side => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2), new THREE.MeshStandardMaterial({ color: 0x4e342e }));
    trunk.position.y = 1;
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5), new THREE.MeshStandardMaterial({ color: 0x2e7d32 }));
    crown.position.y = 2.8;
    tree.add(trunk, crown);
    tree.position.set(side * 9.5, 0.3, z);
    scene.add(tree);
    envProps.push(tree);

    const h = 12 + Math.random() * 22;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(7, h, 9),
      new THREE.MeshStandardMaterial({ color: 0x1c2237, roughness: 0.5 })
    );
    b.position.set(side * 16.5, h / 2, z);
    scene.add(b);
    envProps.push(b);
  });
}

function applyTrackEnvironment(trackIdx) {
  const t = TRACKS[trackIdx];
  scene.background = new THREE.Color(t.sky);
  scene.fog = new THREE.FogExp2(t.fog, 0.011);
  roadMat.color.setHex(t.road);
  hemiLight.intensity = t.env === "night" || t.env === "cyber" ? 0.45 : 1.1;
}

// --- 5. PAGE NAVIGATION & UI BUILDERS ---
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// PAGE 1: रियलिस्टिक लोडिंग एनिमेशन
let loadPct = 0;
const loadMsgs = [
  "3D हाई-रेज़ोल्यूशन कार मॉडल्स लोड हो रहे हैं...",
  "मेटैलिक पेंट और रिफ्लेक्शन तैयार हो रहे हैं...",
  "रियलिस्टिक ट्रैक्स और ट्रैफिक सेट हो रहा है...",
  "शोरूम तैयार है!"
];
const loadInterval = setInterval(() => {
  loadPct += 5;
  document.getElementById("progress-fill").style.width = loadPct + "%";
  document.getElementById("progress-percent").innerText = loadPct + "%";
  document.getElementById("loading-status").innerText = loadMsgs[Math.min(3, Math.floor(loadPct / 26))];
  if (loadPct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      applyTrackEnvironment(0);
      showScreen("page-garage");
    }, 350);
  }
}, 80);

// PAGE 2: CAR & COLOR SELECTOR
function rebuildShowroomCar() {
  const carData = CARS[selectedCarIdx];
  document.getElementById("carBrand").innerText = carData.brand;
  document.getElementById("carName").innerText = carData.name;
  document.getElementById("carSpecs").innerText = carData.specs;

  scene.remove(playerCar);
  playerCar = createRealisticCar(carData, selectedColorHex, DRIVERS[selectedDriverIdx].helmet, true);
  scene.add(playerCar);
}

const swatchContainer = document.getElementById("colorSwatches");
PAINT_COLORS.forEach((c, idx) => {
  const btn = document.createElement("div");
  btn.className = "swatch" + (idx === 0 ? " selected" : "");
  btn.style.backgroundColor = "#" + c.hex.toString(16).padStart(6, "0");
  btn.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
    btn.classList.add("selected");
    selectedColorHex = c.hex;
    rebuildShowroomCar();
  });
  swatchContainer.appendChild(btn);
});

document.getElementById("prevCar").addEventListener("click", () => {
  selectedCarIdx = (selectedCarIdx - 1 + CARS.length) % CARS.length;
  selectedColorHex = CARS[selectedCarIdx].defaultColor;
  rebuildShowroomCar();
});

document.getElementById("nextCar").addEventListener("click", () => {
  selectedCarIdx = (selectedCarIdx + 1) % CARS.length;
  selectedColorHex = CARS[selectedCarIdx].defaultColor;
  rebuildShowroomCar();
});

document.getElementById("toDriverBtn").addEventListener("click", () => showScreen("page-driver"));

// PAGE 3: DRIVER SELECTOR
const driverGrid = document.getElementById("driverGrid");
DRIVERS.forEach((d, idx) => {
  const card = document.createElement("div");
  card.className = "select-card" + (idx === 0 ? " selected" : "");
  card.innerHTML = `<div class="icon">${d.icon}</div><h3>${d.name}</h3><p>${d.desc}</p>`;
  card.addEventListener("click", () => {
    document.querySelectorAll("#driverGrid .select-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedDriverIdx = idx;
    rebuildShowroomCar();
  });
  driverGrid.appendChild(card);
});

document.getElementById("backToGarage").addEventListener("click", () => showScreen("page-garage"));
document.getElementById("toTrackBtn").addEventListener("click", () => showScreen("page-track"));

// PAGE 4: TRACK SELECTOR
const trackGrid = document.getElementById("trackGrid");
TRACKS.forEach((t, idx) => {
  const card = document.createElement("div");
  card.className = "select-card" + (idx === 0 ? " selected" : "");
  card.innerHTML = `<div class="icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p>`;
  card.addEventListener("click", () => {
    document.querySelectorAll("#trackGrid .select-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedTrackIdx = idx;
    applyTrackEnvironment(idx);
  });
  trackGrid.appendChild(card);
});

document.getElementById("backToDriver").addEventListener("click", () => showScreen("page-driver"));

// --- 6. PAGE 5: RACING GAMEPLAY ---
let gameRunning = false;
let score = 0;
let coins = 0;
let baseSpeed = 0.95;
let nitroActive = false;
let hoodCam = false;
let targetX = 0;
let enemies = [];
let coinMeshes = [];
const lanes = [-4.6, 0, 4.6];
let highScore = localStorage.getItem("apexLegendsHigh") || 0;
document.getElementById("garageHighScore").innerText = `🏆 BEST: ${highScore}`;

let keys = { left: false, right: false };
const bindTouch = (id, s, e) => {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", ev => { ev.preventDefault(); s(); });
  el.addEventListener("touchend", ev => { ev.preventDefault(); e(); });
  el.addEventListener("mousedown", s);
  el.addEventListener("mouseup", e);
};
bindTouch("leftBtn", () => keys.left = true, () => keys.left = false);
bindTouch("rightBtn", () => keys.right = true, () => keys.right = false);
bindTouch("nitroBtn", () => nitroActive = true, () => nitroActive = false);

document.getElementById("camBtn").addEventListener("click", () => { hoodCam = !hoodCam; });

function startRace() {
  score = 0;
  coins = 0;
  baseSpeed = 0.95;
  targetX = 0;
  playerCar.position.set(0, 0, 0);
  playerCar.rotation.set(0, 0, 0);
  enemies.forEach(e => scene.remove(e));
  coinMeshes.forEach(c => scene.remove(c));
  enemies = [];
  coinMeshes = [];
  document.getElementById("gameover-modal").classList.add("hidden");
  applyTrackEnvironment(selectedTrackIdx);
  showScreen("page-race");
  gameRunning = true;
}

document.getElementById("startRaceBtn").addEventListener("click", startRace);
document.getElementById("retryBtn").addEventListener("click", startRace);
document.getElementById("menuBtn").addEventListener("click", () => {
  gameRunning = false;
  showScreen("page-garage");
});

const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.16, 16);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });

function animate() {
  requestAnimationFrame(animate);

  if (!gameRunning) {
    // गैराज शोरूम कैमरा (कार के चारों ओर धीरे-धीरे घूमेगा)
    camera.position.set(3.6, 2.2, 5.2);
    camera.lookAt(0, 0.85, 0);
    playerCar.rotation.y += 0.012;
    renderer.render(scene, camera);
    return;
  }

  playerCar.rotation.y = 0;
  const carStats = CARS[selectedCarIdx];
  const driverStats = DRIVERS[selectedDriverIdx];
  const speed = (nitroActive ? baseSpeed * 1.75 * driverStats.bonusNitro : baseSpeed) * carStats.speed * driverStats.bonusSpeed;

  score += (nitroActive ? 2 : 1) * (selectedDriverIdx === 2 ? 2 : 1);
  baseSpeed += 0.00018;

  const displayScore = Math.floor(score / 8);
  document.getElementById("score").innerText = displayScore;
  document.getElementById("coins").innerText = coins;
  document.getElementById("speed").innerText = Math.floor(speed * 185);

  // पहिये घुमाना और सस्पेंशन बाउंस
  playerCar.wheels.forEach(w => { w.rotation.x -= speed * 0.5; });
  playerCar.position.y = Math.sin(score * 0.3) * 0.015;

  // कैमरा (Chase View या Hood View)
  if (hoodCam) {
    camera.position.set(playerCar.position.x, 1.58, -0.35);
    camera.lookAt(playerCar.position.x, 1.25, -35);
  } else {
    camera.position.set(playerCar.position.x * 0.65, 3.9, 8.2);
    camera.lookAt(playerCar.position.x * 0.4, 1.0, -14);
  }

  camera.fov += ((nitroActive ? 78 : 62) - camera.fov) * 0.1;
  camera.updateProjectionMatrix();

  const steerPower = carStats.steer * (selectedDriverIdx === 1 ? 1.2 : 1.0);
  if (keys.left && targetX > -4.8) {
    targetX -= steerPower;
    playerCar.rotation.z = 0.09;
  } else if (keys.right && targetX < 4.8) {
    targetX += steerPower;
    playerCar.rotation.z = -0.09;
  } else {
    playerCar.rotation.z *= 0.85;
  }
  playerCar.position.x += (targetX - playerCar.position.x) * 0.22;

  roadLines.forEach(l => { l.position.z += speed; if (l.position.z > 20) l.position.z -= 250; });
  envProps.forEach(p => { p.position.z += speed; if (p.position.z > 25) p.position.z -= 240; });

  // ट्रैफिक और कॉइन्स स्पॉन
  if (Math.random() < 0.032) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    if (!enemies.some(en => en.position.x === laneX && en.position.z < -130)) {
      const randCar = CARS[Math.floor(Math.random() * CARS.length)];
      const randPaint = PAINT_COLORS[Math.floor(Math.random() * PAINT_COLORS.length)].hex;
      const en = createRealisticCar(randCar, randPaint, 0xffffff, false);
      en.position.set(laneX, 0, -190);
      scene.add(en);
      enemies.push(en);
    }
  }

  if (Math.random() < 0.04) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const c = new THREE.Mesh(coinGeo, coinMat);
    c.rotation.x = Math.PI / 2;
    c.position.set(laneX, 0.85, -190);
    scene.add(c);
    coinMeshes.push(c);
  }

  for (let i = coinMeshes.length - 1; i >= 0; i--) {
    const c = coinMeshes[i];
    c.position.z += speed;
    c.rotation.z += 0.1;
    if (Math.abs(c.position.x - playerCar.position.x) < 1.35 && Math.abs(c.position.z - playerCar.position.z) < 2.3) {
      coins += (selectedDriverIdx === 3 ? 2 : 1);
      score += 150;
      scene.remove(c);
      coinMeshes.splice(i, 1);
    } else if (c.position.z > 18) {
      scene.remove(c);
      coinMeshes.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    en.position.z += speed * 0.68;
    en.wheels.forEach(w => { w.rotation.x +
