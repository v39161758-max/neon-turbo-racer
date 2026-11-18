// --- 1. CAREER PROFILE & SAVE DATA ---
let saveData = JSON.parse(localStorage.getItem("apexCareerSaveV4")) || {
  name: "VISHAL",
  coins: 500,
  xp: 0,
  level: 1,
  unlockedCars: [0],
  unlockedChars: [0]
};

function persistSave() {
  saveData.level = 1 + Math.floor(saveData.xp / 250);
  localStorage.setItem("apexCareerSaveV4", JSON.stringify(saveData));
  updateIdentityUI();
}

function updateIdentityUI() {
  const ranks = ["ROOKIE", "STREET RACER", "PRO DRIFTER", "HIGHWAY KING", "APEX LEGEND"];
  const rankName = ranks[Math.min(ranks.length - 1, saveData.level - 1)];
  document.getElementById("playerTitle").innerText = "RACER " + (saveData.name || "VISHAL").toUpperCase();
  document.getElementById("playerRank").innerText = "LEVEL " + saveData.level + " • " + rankName;
  document.getElementById("headerAvatar").innerText = (saveData.name || "V")[0].toUpperCase();
  document.getElementById("walletCoins").innerText = saveData.coins;
}

document.getElementById("editNameChip").addEventListener("click", () => {
  const newName = prompt("Enter Driver Name:", saveData.name);
  if (newName && newName.trim()) {
    saveData.name = newName.trim();
    persistSave();
  }
});

// --- 2. CARS, CHARACTERS & TRACKS ---
const CARS = [
  { name: "TATA CURVV EV", brand: "INDIAN COUPE SUV", type: "suv", price: 0, color: 0xd50000, speed: 1.0, steer: 0.24, specs: "240 km/h • Aero Electric" },
  { name: "MAHINDRA THAR ROXX", brand: "INDIAN 4x4 OFFROAD", type: "jeep", price: 400, color: 0x18181c, speed: 1.04, steer: 0.24, specs: "220 km/h • 4x4 Torque" },
  { name: "BMW M4 COMPETITION", brand: "GERMAN M-POWER", type: "coupe", price: 900, color: 0x0066ff, speed: 1.10, steer: 0.26, specs: "310 km/h • Twin-Turbo" },
  { name: "TESLA CYBERTRUCK", brand: "AMERICAN ELECTRIC", type: "cyber", price: 1400, color: 0xb0bec5, speed: 1.12, steer: 0.23, specs: "290 km/h • Steel Armor" },
  { name: "FORD MUSTANG GT", brand: "AMERICAN MUSCLE", type: "muscle", price: 2000, color: 0xff6d00, speed: 1.15, steer: 0.25, specs: "305 km/h • 5.0L V8" },
  { name: "PORSCHE 911 GT3", brand: "GERMAN TRACK ICON", type: "coupe", price: 2800, color: 0xf5f5f7, speed: 1.18, steer: 0.28, specs: "330 km/h • Precision Grip" },
  { name: "MERCEDES AMG GT", brand: "GERMAN LUXURY", type: "coupe", price: 3600, color: 0x00c853, speed: 1.20, steer: 0.27, specs: "325 km/h • V8 Biturbo" },
  { name: "NISSAN GT-R NISMO", brand: "JAPANESE LEGEND", type: "coupe", price: 4500, color: 0x757575, speed: 1.22, steer: 0.28, specs: "335 km/h • AWD Godzilla" },
  { name: "LAMBORGHINI REVUELTO", brand: "ITALIAN HYPERCAR", type: "super", price: 6000, color: 0xffc400, speed: 1.26, steer: 0.29, specs: "355 km/h • V12 Hybrid" },
  { name: "BUGATTI CHIRON SPORT", brand: "FRENCH HYPER-KING", type: "super", price: 8500, color: 0x00b0ff, speed: 1.32, steer: 0.30, specs: "420 km/h • W16 Quad" }
];

const PAINT_SWATCHES = [0xd50000, 0x0066ff, 0x18181c, 0xf5f5f7, 0xffc400, 0x00c853, 0xff6d00, 0x90a4ae];

const CHARACTERS = [
  { name: "AARAV", role: "ROOKIE DRIVER", price: 0, jacket: 0x1e3a8a, pants: 0x111827, skin: 0xe0ac69, speedBonus: 1.0, coinBonus: 1, bonusText: "Perk: Balanced Telemetry" },
  { name: "VIKRAM", role: "HIGHWAY PRO", price: 350, jacket: 0xb91c1c, pants: 0x1f2937, skin: 0xd2996c, speedBonus: 1.05, coinBonus: 1, bonusText: "Perk: +5% Top Speed" },
  { name: "KABIR", role: "DRIFT SPECIALIST", price: 750, jacket: 0x047857, pants: 0x0f172a, skin: 0xc68642, speedBonus: 1.03, coinBonus: 2, bonusText: "Perk: 2x Cash Multiplier" },
  { name: "ROHAN", role: "TURBO ENGINEER", price: 1300, jacket: 0xd97706, pants: 0x18181b, skin: 0xf1c27d, speedBonus: 1.08, coinBonus: 2, bonusText: "Perk: +8% Speed & 2x Cash" },
  { name: "DEV", role: "APEX CHAMPION", price: 2200, jacket: 0x6d28d9, pants: 0x09090b, skin: 0xe0ac69, speedBonus: 1.12, coinBonus: 3, bonusText: "Perk: +12% Speed & 3x Cash" }
];

const TRACKS = [
  { name: "Mumbai Coastal Road", reqLevel: 1, sky: 0x5dade2, fog: 0x85c1e9, road: 0x2c3e50, desc: "Level 1 • Daylight Sea Link" },
  { name: "Delhi-Jaipur Night", reqLevel: 2, sky: 0x090d16, fog: 0x090d16, road: 0x171a24, desc: "Level 2 • Midnight Expressway" },
  { name: "Manali Snow Highway", reqLevel: 3, sky: 0xd6eaf8, fog: 0xebf5fb, road: 0x34495e, desc: "Level 3 • Alpine Fog & Ice" },
  { name: "Cyber Tokyo Drift", reqLevel: 4, sky: 0x14052e, fog: 0x1d0842, road: 0x11111a, desc: "Level 4 • Future Neon City" }
];

let selectedCarIdx = 0, selectedPaintHex = CARS[0].color, selectedCharIdx = 0, selectedTrackIdx = 0;

function switchPage(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- 3. 3D ENGINE INITIALIZATION (WITH CDN FALLBACK) ---
let scene, camera, renderer, hemiLight, playerCar, showroomPerson, roadMat;
let roadLines = [], envProps = [];

function start3D() {
  if (typeof THREE === "undefined") {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.onload = () => initWorld();
    document.head.appendChild(s);
  } else {
    initWorld();
  }
}

function initWorld() {
  const container = document.getElementById("canvas-wrapper");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.1);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
  dirLight.position.set(18, 35, 22);
  scene.add(dirLight);

  roadMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.85 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 320), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.z = -130;
  scene.add(road);

  const walkMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const leftWalk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 320), walkMat);
  leftWalk.position.set(-10, 0.15, -130);
  const rightWalk = leftWalk.clone();
  rightWalk.position.x = 10;
  scene.add(leftWalk, rightWalk);

  for (let z = 15; z > -240; z -= 11) {
    [-2.35, 2.35].forEach(lx => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 3.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      l.position.set(lx, 0.03, z);
      scene.add(l);
      roadLines.push(l);
    });
  }

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

      const h = 14 + Math.random() * 22;
      const b = new THREE.Mesh(new THREE.BoxGeometry(7, h, 9), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      b.position.set(side * 16.5, h / 2, z);
      scene.add(b);
      envProps.push(b);
    });
  }

  playerCar = buildRealisticCar(CARS[0], selectedPaintHex, true);
  scene.add(playerCar);

  showroomPerson = build3DPerson(CHARACTERS[0]);
  showroomPerson.position.set(-1.65, 0, 0.4);
  scene.add(showroomPerson);

  applyTrackTheme(0);
  animate();
}

function build3DPerson(ch) {
  const p = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: ch.skin });
  const jacket = new THREE.MeshStandardMaterial({ color: ch.jacket });
  const pants = new THREE.MeshStandardMaterial({ color: ch.pants });
  [-0.14, 0.14].forEach(lx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.78, 0.2), pants);
    leg.position.set(lx, 0.42, 0);
    p.add(leg);
  });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.28), jacket);
  torso.position.y = 1.16;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), skin);
  head.position.y = 1.74;
  p.add(torso, head);
  return p;
}

function buildRealisticCar(carData, paintHex, isPlayer) {
  const car = new THREE.Group();
  const paintMat = new THREE.MeshStandardMaterial({ color: paintHex, metalness: 0.75, roughness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x111318 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0b132b, metalness: 0.9, roughness: 0.1 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.55, 4.3), paintMat);
  body.position.y = 0.52;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.55, 1.95), glassMat);
  cabin.position.set(0, 1.02, 0.05);
  car.add(body, cabin);

  const tireGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.36, 16);
  car.wheels = [];
  [[-1.0, 0.45, 1.3], [1.0, 0.45, 1.3], [-1.0, 0.45, -1.3], [1.0, 0.45, -1.3]].forEach(pos => {
    const w = new THREE.Mesh(tireGeo, trimMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(...pos);
    car.add(w);
    car.wheels.push(w);
  });

  car.tailLights = [];
  [-0.65, 0.65].forEach(lx => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.1), new THREE.MeshBasicMaterial({ color: isPlayer ? 0xffffff : 0xff0022 }));
    hl.position.set(lx, 0.56, -2.16);
    const tMat = new THREE.MeshBasicMaterial({ color: isPlayer ? 0x990000 : 0xffffff });
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.1), tMat);
    tl.position.set(lx, 0.56, 2.16);
    car.add(hl, tl);
    if (isPlayer) car.tailLights.push(tMat);
  });
  return car;
}

function applyTrackTheme(idx) {
  if (!scene) return;
  const t = TRACKS[idx];
  scene.background = new THREE.Color(t.sky);
  scene.fog = new THREE.FogExp2(t.fog, 0.011);
  roadMat.color.setHex(t.road);
  hemiLight.intensity = idx === 1 || idx === 3 ? 0.5 : 1.15;
}

// --- 4. UI CONTROLS ---
function refreshGarageUI() {
  const c = CARS[selectedCarIdx];
  const isUnlocked = saveData.unlockedCars.includes(selectedCarIdx);
  document.getElementById("carBrand").innerText = c.brand;
  document.getElementById("carName").innerText = c.name;
  document.getElementById("carSpecs").innerText = c.specs;
  const btn = document.getElementById("carActionBtn");
  btn.className = isUnlocked ? "btn-primary" : "btn-buy";
  btn.innerText = isUnlocked ? "SELECT & CONTINUE ➔" : "💰 BUY VEHICLE ($" + c.price + ")";

  if (scene && playerCar) {
    scene.remove(playerCar);
    playerCar = buildRealisticCar(c, selectedPaintHex, true);
    scene.add(playerCar);
  }
}

const swatchBox = document.getElementById("colorSwatches");
PAINT_SWATCHES.forEach((hex, idx) => {
  const s = document.createElement("div");
  s.className = "swatch" + (idx === 0 ? " selected" : "");
  s.style.backgroundColor = "#" + hex.toString(16).padStart(6, "0");
  s.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach(el => el.classList.remove("selected"));
    s.classList.add("selected");
    selectedPaintHex = hex;
    refreshGarageUI();
  });
  swatchBox.appendChild(s);
});

document.getElementById("prevCar").addEventListener("click", () => {
  selectedCarIdx = (selectedCarIdx - 1 + CARS.length) % CARS.length;
  selectedPaintHex = CARS[selectedCarIdx].color;
  refreshGarageUI();
});
document.getElementById("nextCar").addEventListener("click", () => {
  selectedCarIdx = (selectedCarIdx + 1) % CARS.length;
  selectedPaintHex = CARS[selectedCarIdx].color;
  refreshGarageUI();
});

document.getElementById("carActionBtn").addEventListener("click", () => {
  const c = CARS[selectedCarIdx];
  if (saveData.unlockedCars.includes(selectedCarIdx)) {
    refreshCharacterUI();
    switchPage("page-character");
  } else if (saveData.coins >= c.price) {
    saveData.coins -= c.price;
    saveData.unlockedCars.push(selectedCarIdx);
    persistSave();
    refreshGarageUI();
  } else {
    alert("Need $" + c.price + " to buy this car!");
  }
});

function refreshCharacterUI() {
  const ch = CHARACTERS[selectedCharIdx];
  const isUnlocked = saveData.unlockedChars.includes(selectedCharIdx);
  document.getElementById("charRole").innerText = ch.role;
  document.getElementById("charName").innerText = ch.name;
  document.getElementById("charBonus").innerText = ch.bonusText;
  const btn = document.getElementById("charActionBtn");
  btn.className = isUnlocked ? "btn-primary" : "btn-buy";
  btn.innerText = isUnlocked ? "CONFIRM DRIVER ➔" : "💰 HIRE DRIVER ($" + ch.price + ")";

  if (scene && showroomPerson) {
    scene.remove(showroomPerson);
    showroomPerson = build3DPerson(ch);
    showroomPerson.position.set(-1.65, 0, 0.4);
    scene.add(showroomPerson);
  }
}

document.getElementById("prevChar").addEventListener("click", () => {
  selectedCharIdx = (selectedCharIdx - 1 + CHARACTERS.length) % CHARACTERS.length;
  refreshCharacterUI();
});
document.getElementById("nextChar").addEventListener("click", () => {
  selectedCharIdx = (selectedCharIdx + 1) % CHARACTERS.length;
  refreshCharacterUI();
});
document.getElementById("backGarage").addEventListener("click", () => switchPage("page-garage"));

document.getElementById("charActionBtn").addEventListener("click", () => {
  const ch = CHARACTERS[selectedCharIdx];
  if (saveData.unlockedChars.includes(selectedCharIdx)) {
    renderTrackCards();
    switchPage("page-track");
  } else if (saveData.coins >= ch.price) {
    saveData.coins -= ch.price;
    saveData.unlockedChars.push(selectedCharIdx);
    persistSave();
    refreshCharacterUI();
  } else {
    alert("Need $" + ch.price + " to hire this driver!");
  }
});

function renderTrackCards() {
  const grid = document.getElementById("trackList");
  grid.innerHTML = "";
  TRACKS.forEach((t, idx) => {
    const locked = saveData.level < t.reqLevel;
    const card = document.createElement("div");
    card.className = "track-card" + (idx === selectedTrackIdx ? " selected" : "") + (locked ? " locked" : "");
    card.innerHTML = (locked ? "<span class='lock-badge'>🔒 LVL " + t.reqLevel + "</span>" : "") +
      "<h3>" + t.name + "</h3><p style='font-size:11px;color:#cbd5e1;margin-top:4px;'>" + t.desc + "</p>";
    card.addEventListener("click", () => {
      if (locked) { alert("Reach Level " + t.reqLevel + " to unlock!"); return; }
      selectedTrackIdx = idx;
      applyTrackTheme(idx);
      renderTrackCards();
    });
    grid.appendChild(card);
  });
}

document.getElementById("backChar").addEventListener("click", () => switchPage("page-character"));

// --- 5. RACING LOOP ---
let gameRunning = false, distance = 0, raceCoins = 0, currentSpeed = 0.85, braking = false, nitro = false, hoodCam = false, targetX = 0;
let enemies = [], coinMeshes = [], keys = { left: false, right: false };
const lanes = [-4.6, 0, 4.6];

const bindHold = (id, downFn, upFn) => {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", e => { e.preventDefault(); downFn(); });
  el.addEventListener("touchend", e => { e.preventDefault(); upFn(); });
  el.addEventListener("mousedown", downFn);
  el.addEventListener("mouseup", upFn);
};
bindHold("leftBtn", () => keys.left = true, () => keys.left = false);
bindHold("rightBtn", () => keys.right = true, () => keys.right = false);
bindHold("brakeBtn", () => braking = true, () => braking = false);
bindHold("nitroBtn", () => nitro = true, () => nitro = false);
document.getElementById("camSwitchBtn").addEventListener("click", () => { hoodCam = !hoodCam; });

function launchRace() {
  distance = 0; raceCoins = 0; currentSpeed = 0.85; targetX = 0;
  playerCar.position.set(0, 0, 0); playerCar.rotation.set(0, 0, 0);
  showroomPerson.visible = false;
  enemies.forEach(e => scene.remove(e));
  coinMeshes.forEach(c => scene.remove(c));
  enemies = []; coinMeshes = [];
  document.getElementById("resultModal").classList.add("hidden");
  applyTrackTheme(selectedTrackIdx);
  switchPage("page-race");
  gameRunning = true;
}

document.getElementById("startRaceBtn").addEventListener("click", launchRace);
document.getElementById("retryRaceBtn").addEventListener("click", launchRace);
document.getElementById("toGarageModalBtn").addEventListener("click", () => {
  gameRunning = false;
  showroomPerson.visible = true;
  refreshGarageUI();
  switchPage("page-garage");
});

function animate() {
  requestAnimationFrame(animate);
  if (!gameRunning) {
    camera.position.set(2.8, 2.1, 5.4);
    camera.lookAt(-0.4, 0.9, 0);
    playerCar.rotation.y += 0.008;
    renderer.render(scene, camera);
    return;
  }

  playerCar.rotation.y = 0;
  const carStats = CARS[selectedCarIdx];
  const charStats = CHARACTERS[selectedCharIdx];
  const maxSpd = 1.35 * carStats.speed * charStats.speedBonus;

  if (braking) {
    currentSpeed = Math.max(0.32, currentSpeed - 0.045);
    playerCar.tailLights.forEach(m => m.color.setHex(0xff0000));
  } else if (nitro) {
    currentSpeed = Math.min(maxSpd * 1.45, currentSpeed + 0.03);
    playerCar.tailLights.forEach(m => m.color.setHex(0x880000));
  } else {
    currentSpeed += (maxSpd * 0.78 - currentSpeed) * 0.03;
    playerCar.tailLights.forEach(m => m.color.setHex(0x880000));
  }

  distance += currentSpeed * 1.8;
  document.getElementById("hudScore").innerText = Math.floor(distance);
  document.getElementById("hudCoins").innerText = raceCoins;
  document.getElementById("hudSpeed").innerText = Math.floor(currentSpeed * 185);

  playerCar.wheels.forEach(w => { w.rotation.x -= currentSpeed * 0.5; });

  if (hoodCam) {
    camera.position.set(playerCar.position.x, 1.58, -0.35);
    camera.lookAt(playerCar.position.x, 1.25, -35);
  } else {
    camera.position.set(playerCar.position.x * 0.65, 3.9, 8.2);
    camera.lookAt(playerCar.position.x * 0.4, 1.0, -14);
  }

  if (keys.left && targetX > -4.8) { targetX -= carStats.steer; playerCar.rotation.z = 0.09; }
  else if (keys.right && targetX < 4.8) { targetX += carStats.steer; playerCar.rotation.z = -0.09; }
  else { playerCar.rotation.z *= 0.85; }
  playerCar.position.x += (targetX - playerCar.position.x) * 0.22;

  roadLines.forEach(l => { l.position.z += currentSpeed; if (l.position.z > 20) l.position.z -= 250; });
  envProps.forEach(p => { p.position.z += currentSpeed; if (p.position.z > 25) p.position.z -= 240; });

  if (Math.random() < 0.032) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    if (!enemies.some(en => en.position.x === laneX && en.position.z < -130)) {
      const randCar = CARS[Math.floor(Math.random() * CARS.length)];
      const randCol = PAINT_SWATCHES[Math.floor(Math.random() * PAINT_SWATCHES.length)];
      const en = buildRealisticCar(randCar, randCol, false);
      en.position.set(laneX, 0, -190);
      scene.add(en);
      enemies.push(en);
    }
  }

  if (Math.random() < 0.045) {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const c = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 })
    );
    c.rotation.x = Math.PI / 2;
    c.position.set(laneX, 0.85, -190);
    scene.add(c);
    coinMeshes.push(c);
  }

  for (let i = coinMeshes.length - 1; i >= 0; i--) {
    const c = coinMeshes[i];
    c.position.z += currentSpeed;
    c.rotation.z += 0.1;
    if (Math.abs(c.position.x - playerCar.position.x) < 1.35 && Math.abs(c.position.z - playerCar.position.z) < 2.3) {
      raceCoins += 10 * charStats.coinBonus;
      scene.remove(c);
      coinMeshes.splice(i, 1);
    } else if (c.position.z > 18) {
      scene.remove(c);
      coinMeshes.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    en.position.z += currentSpeed * 0.65;
    if (Math.abs(en.position.x - playerCar
