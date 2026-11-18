// --- 1. CAREER PROFILE & SAVE DATA (IDENTITY, MONEY, UNLOCKS) ---
let saveData = JSON.parse(localStorage.getItem("apexCareerSave")) || {
  name: "",
  coins: 500,
  xp: 0,
  level: 1,
  unlockedCars: [0],
  unlockedChars: [0]
};

function persistSave() {
  saveData.level = 1 + Math.floor(saveData.xp / 250);
  localStorage.setItem("apexCareerSave", JSON.stringify(saveData));
  updateIdentityUI();
}

function updateIdentityUI() {
  const ranks = ["ROOKIE", "STREET RACER", "PRO DRIFTER", "HIGHWAY KING", "APEX LEGEND"];
  const rankName = ranks[Math.min(ranks.length - 1, saveData.level - 1)];
  document.getElementById("playerTitle").innerText = (saveData.name || "RACER").toUpperCase();
  document.getElementById("playerRank").innerText = `LEVEL ${saveData.level} • ${rankName}`;
  document.getElementById("headerAvatar").innerText = (saveData.name || "R")[0].toUpperCase();
  document.getElementById("walletCoins").innerText = saveData.coins;
}

// --- 2. REALISTIC CARS, 3D PEOPLE (CHARACTERS) & LEVEL TRACKS ---
const CARS = [
  { name: "TATA CURVV EV", brand: "INDIAN COUPE SUV", type: "suv", price: 0, color: 0xd50000, speed: 1.0, brake: 0.92, steer: 0.24, specs: "240 km/h • Aero EV" },
  { name: "MAHINDRA THAR ROXX", brand: "INDIAN 4x4 OFFROAD", type: "jeep", price: 400, color: 0x18181c, speed: 1.04, brake: 0.90, steer: 0.24, specs: "220 km/h • 4x4 Beast" },
  { name: "BMW M4 COMPETITION", brand: "GERMAN M-POWER", type: "coupe", price: 900, color: 0x0066ff, speed: 1.10, brake: 0.86, steer: 0.26, specs: "310 km/h • Twin-Turbo" },
  { name: "TESLA CYBERTRUCK", brand: "AMERICAN ELECTRIC", type: "cyber", price: 1400, color: 0xb0bec5, speed: 1.12, brake: 0.88, steer: 0.23, specs: "290 km/h • Steel Armor" },
  { name: "FORD MUSTANG GT", brand: "AMERICAN MUSCLE", type: "muscle", price: 2000, color: 0xff6d00, speed: 1.15, brake: 0.87, steer: 0.25, specs: "305 km/h • 5.0L V8" },
  { name: "PORSCHE 911 GT3", brand: "GERMAN TRACK ICON", type: "coupe", price: 2800, color: 0xf5f5f7, speed: 1.18, brake: 0.83, steer: 0.28, specs: "330 km/h • Precision Grip" },
  { name: "MERCEDES AMG GT", brand: "GERMAN LUXURY", type: "coupe", price: 3600, color: 0x00c853, speed: 1.20, brake: 0.84, steer: 0.27, specs: "325 km/h • V8 Biturbo" },
  { name: "NISSAN GT-R NISMO", brand: "JAPANESE LEGEND", type: "coupe", price: 4500, color: 0x757575, speed: 1.22, brake: 0.82, steer: 0.28, specs: "335 km/h • AWD God" },
  { name: "LAMBORGHINI REVUELTO", brand: "ITALIAN HYPERCAR", type: "super", price: 6000, color: 0xffc400, speed: 1.26, brake: 0.80, steer: 0.29, specs: "355 km/h • V12 Hybrid" },
  { name: "BUGATTI CHIRON SPORT", brand: "FRENCH HYPER-KING", type: "super", price: 8500, color: 0x00b0ff, speed: 1.32, brake: 0.78, steer: 0.30, specs: "420 km/h • W16 Quad" }
];

const PAINT_SWATCHES = [0xd50000, 0x0066ff, 0x18181c, 0xf5f5f7, 0xffc400, 0x00c853, 0xff6d00, 0x90a4ae];

// खरीदने योग्य 3D कैरेक्टर्स (Realistic People Models)
const CHARACTERS = [
  { name: "AARAV", role: "ROOKIE DRIVER", price: 0, jacket: 0x1e3a8a, pants: 0x111827, skin: 0xe0ac69, hair: 0x111111, speedBonus: 1.0, coinBonus: 1, bonusText: "स्टैंडर्ड रेसिंग स्किल" },
  { name: "VIKRAM", role: "HIGHWAY PRO", price: 350, jacket: 0xb91c1c, pants: 0x1f2937, skin: 0xd2996c, hair: 0x1c1917, speedBonus: 1.05, coinBonus: 1, bonusText: "+5% एक्स्ट्रा टॉप स्पीड" },
  { name: "KABIR", role: "DRIFT SPECIALIST", price: 750, jacket: 0x047857, pants: 0x0f172a, skin: 0xc68642, hair: 0x09090b, speedBonus: 1.03, coinBonus: 2, bonusText: "2x कॉइन कमाई बोनस" },
  { name: "ROHAN", role: "TURBO ENGINEER", price: 1300, jacket: 0xd97706, pants: 0x18181b, skin: 0xf1c27d, hair: 0x27272a, speedBonus: 1.08, coinBonus: 2, bonusText: "+8% स्पीड & 2x कॉइन्स" },
  { name: "DEV", role: "APEX CHAMPION", price: 2200, jacket: 0x6d28d9, pants: 0x09090b, skin: 0xe0ac69, hair: 0xfafaf9, speedBonus: 1.12, coinBonus: 3, bonusText: "+12% स्पीड & 3x कॉइन्स" }
];

// लेवल के हिसाब से खुलने वाले रोड (Level-Locked Highways)
const TRACKS = [
  { name: "Mumbai Coastal Road", reqLevel: 1, sky: 0x5dade2, fog: 0x85c1e9, road: 0x2c3e50, desc: "Level 1 • दिन का हाईवे" },
  { name: "Delhi-Jaipur Night", reqLevel: 2, sky: 0x090d16, fog: 0x090d16, road: 0x171a24, desc: "Level 2 • नाइट एक्सप्रेसवे" },
  { name: "Manali Snow Highway", reqLevel: 3, sky: 0xd6eaf8, fog: 0xebf5fb, road: 0x34495e, desc: "Level 3 • बर्फीला पहाड़ी रोड" },
  { name: "Cyber Tokyo Drift", reqLevel: 4, sky: 0x14052e, fog: 0x1d0842, road: 0x11111a, desc: "Level 4 • फ्यूचर नियॉन ट्रैक" }
];

let selectedCarIdx = 0;
let selectedPaintHex = CARS[0].color;
let selectedCharIdx = 0;
let selectedTrackIdx = 0;

// --- 3. THREE.JS 3D ENGINE ---
const container = document.getElementById("canvas-wrapper");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.05);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(18, 35, 22);
scene.add(dirLight);

// --- 4. REALISTIC 3D HUMAN CHARACTER BUILDER ---
function build3DPerson(charData) {
  const person = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: charData.skin, roughness: 0.5 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: charData.jacket, roughness: 0.4 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: charData.pants, roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: charData.hair, roughness: 0.8 });

  // जूते और पैर
  [-0.14, 0.14].forEach(lx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.78, 0.2), pantsMat);
    leg.position.set(lx, 0.42, 0);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    shoe.position.set(lx, 0.06, 0.05);
    person.add(leg, shoe);
  });

  // जैकेट / धड़
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.28), jacketMat);
  torso.position.y = 1.16;
  person.add(torso);

  // हाथ
  [-0.35, 0.35].forEach(ax => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.65, 0.16), jacketMat);
    arm.position.set(ax, 1.15, 0);
    person.add(arm);
  });

  // सिर और बाल
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
  head.position.y = 1.74;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
  hair.position.y = 1.76;
  // काला चश्मा (Sunglasses)
  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.1), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  glasses.position.set(0, 1.75, 0.19);

  person.add(head, hair, glasses);
  return person;
}

// --- 5. REALISTIC 3D CAR BUILDER ---
function buildRealisticCar(carData, paintHex, isPlayer = false) {
  const car = new THREE.Group();
  const paintMat = new THREE.MeshStandardMaterial({ color: paintHex, metalness: 0.78, roughness: 0.18 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.6 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0b132b, metalness: 0.92, roughness: 0.08, transparent: true, opacity: 0.85 });

  if (carData.type === "cyber") {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.68, 4.4), paintMat);
    body.position.y = 0.62;
    const top = new THREE.Mesh(new THREE.ConeGeometry(1.45, 1.15, 4), paintMat);
    top.rotation.y = Math.PI / 4;
    top.position.set(0, 1.38, 0);
    car.add(body, top);
  } else if (carData.type === "jeep" || carData.type === "suv") {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.75, 4.1), paintMat);
    body.position.y = 0.68;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.65, 2.25), glassMat);
    cabin.position.set(0, 1.32, -0.15);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.1, 2.3), paintMat);
    roof.position.set(0, 1.66, -0.15);
    car.add(body, cabin, roof);
  } else {
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.52, 4.35), paintMat);
    chassis.position.y = 0.5;
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.24, 1.45), paintMat);
    hood.position.set(0, 0.76, isPlayer ? -1.2 : 1.2);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.52, 1.85), glassMat);
    cabin.position.set(0, 0.98, 0.1);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.4), paintMat);
    roof.position.set(0, 1.25, 0.15);
    car.add(chassis, hood, cabin, roof);
  }

  // फ्रंट ग्रिल और साइड मिरर
  const grill = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.26, 0.12), trimMat);
  grill.position.set(0, 0.48, isPlayer ? -2.16 : 2.16);
  car.add(grill);

  [-1.06, 1.06].forEach(mx => {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), paintMat);
    mirror.position.set(mx, 0.88, isPlayer ? -0.55 : 0.55);
    car.add(mirror);
  });

  // 4 पहिये
  const tireGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.36, 20);
  const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 12);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });

  car.wheels = [];
  [[-1.0, 0.45, 1.3], [1.0, 0.45, 1.3], [-1.0, 0.45, -1.3], [1.0, 0.45, -1.3]].forEach(pos => {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, trimMat);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    tire.rotation.z = Math.PI / 2;
    rim.rotation.z = Math.PI / 2;
    wg.add(tire, rim);
    wg.position.set(...pos);
    car.add(wg);
    car.wheels.push(wg);
  });

  // हेडलाइट्स और रियलिस्टिक ब्रेक लाइट्स
  const lGeo = new THREE.BoxGeometry(0.45, 0.14, 0.1);
  const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  car.tailLights = [];

  [-0.65, 0.65].forEach(lx => {
    const hl = new THREE.Mesh(lGeo, isPlayer ? headMat : new THREE.MeshBasicMaterial({ color: 0xff0022 }));
    hl.position.set(lx, 0.56, -2.17);
    const tMat = new THREE.MeshBasicMaterial({ color: isPlayer ? 0x990000 : 0xffffff });
    const tl = new THREE.Mesh(lGeo, tMat);
    tl.position.set(lx, 0.56, 2.17);
    car.add(hl, tl);
    if (isPlayer) car.tailLights.push(tMat);
  });

  return car;
}

let playerCar = buildRealisticCar(CARS[0], selectedPaintHex, true);
scene.add(playerCar);

let showroomPerson = build3DPerson(CHARACTERS[0]);
showroomPerson.position.set(-1.65, 0, 0.4);
scene.add(showroomPerson);

// --- 6. ROAD & ENVIRONMENT ---
const roadMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.85 });
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

const roadLines = [];
for (let z = 15; z > -240; z -= 11) {
  [-2.35, 2.35].forEach(lx => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 3.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    l.position.set(lx, 0.03, z);
    scene.add(l);
    roadLines.push(l);
  });
}

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

    const h = 12 + Math.random() * 20;
    const b = new THREE.Mesh(new THREE.BoxGeometry(7, h, 9), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    b.position.set(side * 16.5, h / 2, z);
    scene.add(b);
    envProps.push(b);
  });
}

function applyTrackTheme(idx) {
  const t = TRACKS[idx];
  scene.background = new THREE.Color(t.sky);
  scene.fog = new THREE.FogExp2(t.fog, 0.011);
  roadMat.color.setHex(t.road);
  hemiLight.intensity = idx === 1 || idx === 3 ? 0.45 : 1.1;
}

// --- 7. PAGE NAVIGATION & STORE LOGIC ---
function switchPage(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// PAGE 1: LOADING & NAME IDENTITY
let pct = 0;
const timer = setInterval(() => {
  pct += 10;
  document.getElementById("barFill").style.width = pct + "%";
  document.getElementById("barPct").innerText = pct + "%";
  if (pct >= 100) {
    clearInterval(timer);
    if (saveData.name) {
      enterShowroom();
    } else {
      document.getElementById("loadText").innerText = "अपनी ड्राइवर पहचान बनाएं:";
      document.getElementById("nameSetupBox").classList.remove("hidden");
    }
  }
}, 90);

function enterShowroom() {
  updateIdentityUI();
  document.getElementById("identity-header").classList.remove("hidden");
  applyTrackTheme(0);
  refreshGarageUI();
  switchPage("page-garage");
}

document.getElementById("enterGarageBtn").addEventListener("click", () => {
  const val = document.getElementById("driverNameInput").value.trim();
  saveData.name = val || "VISHAL";
  persistSave();
  enterShowroom();
});

// PAGE 2: CAR SHOWROOM
function refreshGarageUI() {
  const c = CARS[selectedCarIdx];
  const isUnlocked = saveData.unlockedCars.includes(selectedCarIdx);
  document.getElementById("carBrand").innerText = c.brand;
  document.getElementById("carName").innerText = c.name;
  document.getElementById("carSpecs").innerText = c.specs;

  const btn = document.getElementById("carActionBtn");
  if (isUnlocked) {
    btn.className = "btn-primary";
    btn.innerText = "चुनें और आगे बढ़ें ➔";
  } else {
    btn.className = "btn-buy";
    btn.innerText = `💰 खरीदें (₹${c.price})`;
  }

  scene.remove(playerCar);
  playerCar = buildRealisticCar(c, selectedPaintHex, true);
  scene.add(playerCar);
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
    alert(`पर्याप्त पैसे नहीं हैं! इस कार के लिए ₹${c.price} चाहिए। रेस करके पैसे कमाएं!`);
  }
});

// PAGE 3: 3D CHARACTER STORE
function refreshCharacterUI() {
  const ch = CHARACTERS[selectedCharIdx];
  const isUnlocked = saveData.unlockedChars.includes(selectedCharIdx);
  document.getElementById("charRole").innerText = ch.role;
  document.getElementById("charName").innerText = ch.name;
  document.getElementById("charBonus").innerText = ch.bonusText;

  const btn = document.getElementById("charActionBtn");
  if (isUnlocked) {
    btn.className = "btn-primary";
    btn.innerText = "इस कैरेक्टर से आगे बढ़ें ➔";
  } else {
    btn.className = "btn-buy";
    btn.innerText = `💰 कैरेक्टर खरीदें (₹${ch.price})`;
  }

  scene.remove(showroomPerson);
  showroomPerson = build3DPerson(ch);
  showroomPerson.position.set(-1.65, 0, 0.4);
  scene.add(showroomPerson);
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
    alert(`इस कैरेक्टर के लिए ₹${ch.price} चाहिए!`);
  }
});

// PAGE 4: LEVEL-LOCKED TRACKS
function renderTrackCards() {
  const grid = document.getElementById("trackList");
  grid.innerHTML = "";
  TRACKS.forEach((t, idx) => {
    const locked = saveData.level < t.reqLevel;
    const card = document.createElement("div");
    card.className = "track-card" + (idx === selectedTrackIdx ? " selected" : "") + (locked ? " locked" : "");
    card.innerHTML = `
      ${locked ? `<span class="lock-badge">🔒 LVL ${t.reqLevel}</span>` : ""}
      <h3>${t.name}</h3>
      <p style="font-size:11px;color:#cbd5e1;margin-top:4px;">${t.desc}</p>
    `;
    card.addEventListener("click", () => {
      if (locked) {
        alert(`यह रोड Level ${t.reqLevel} पर खुलेगा! अभी आपका Level ${saveData.level} है।`);
        return;
      }
      selectedTrackIdx = idx;
      applyTrackTheme(idx);
      renderTrackCards();
    });
    grid.appendChild(card);
  });
}

document.getElementById("backChar").addEventListener("click", () => switchPage("page-character"));

// --- 8. PAGE 5: REALISTIC DRIVING PHYSICS (GAS, BRAKE, NITRO) ---
let gameRunning = false;
let distance = 0;
let raceCoins = 0;
let currentSpeed = 0.85;
let braking = false;
let nitro = false;
let hoodCam = false;
let targetX = 0;
let enemies = [];
let coinMeshes = [];
const lanes = [-4.6, 0, 4.6];
let keys = { left: false, right: false };

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
  distance = 0;
  raceCoins = 0;
  currentSpeed = 0.85;
  targetX = 0;
  playerCar.position.set(0, 0, 0);
  playerCar.rotation.set(0, 0, 0);
  showroomPerson.visible = false;

  enemies.forEach(e => scene.remove(e));
  coinMeshes.forEach(c => scene.remove(c));
  enemies = [];
  coinMeshes = [];

  document.getElementById("resultModal").classList.add("hidden");
  applyTrackTheme(selectedTrackIdx);
  switchPage("page-race");
   
