// --- 1. CAREER PROFILE & SAVE DATA ---
let saveData = JSON.parse(localStorage.getItem("apexCareerSaveV6")) || {
  name: "VISHAL",
  coins: 500,
  xp: 0,
  level: 1,
  unlockedCars: [0],
  unlockedChars: [0]
};

function persistSave() {
  saveData.level = 1 + Math.floor(saveData.xp / 250);
  localStorage.setItem("apexCareerSaveV6", JSON.stringify(saveData));
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
  { name: "TATA CURVV EV", brand: "INDIAN COUPE SUV", type: "suv", price: 0, color: "#d50000", speed: 1.0, steer: 14, specs: "240 km/h • Aero Electric" },
  { name: "MAHINDRA THAR ROXX", brand: "INDIAN 4x4 OFFROAD", type: "jeep", price: 400, color: "#212121", speed: 1.05, steer: 14, specs: "220 km/h • 4x4 Torque" },
  { name: "BMW M4 COMPETITION", brand: "GERMAN M-POWER", type: "coupe", price: 900, color: "#0066ff", speed: 1.12, steer: 16, specs: "310 km/h • Twin-Turbo" },
  { name: "TESLA CYBERTRUCK", brand: "AMERICAN ELECTRIC", type: "cyber", price: 1400, color: "#90a4ae", speed: 1.14, steer: 13, specs: "290 km/h • Steel Armor" },
  { name: "FORD MUSTANG GT", brand: "AMERICAN MUSCLE", type: "muscle", price: 2000, color: "#ff6d00", speed: 1.18, steer: 15, specs: "305 km/h • 5.0L V8" },
  { name: "PORSCHE 911 GT3", brand: "GERMAN TRACK ICON", type: "coupe", price: 2800, color: "#f5f5f7", speed: 1.22, steer: 17, specs: "330 km/h • Precision Grip" },
  { name: "MERCEDES AMG GT", brand: "GERMAN LUXURY", type: "coupe", price: 3600, color: "#00c853", speed: 1.25, steer: 16, specs: "325 km/h • V8 Biturbo" },
  { name: "NISSAN GT-R NISMO", brand: "JAPANESE LEGEND", type: "coupe", price: 4500, color: "#616161", speed: 1.28, steer: 17, specs: "335 km/h • AWD Godzilla" },
  { name: "LAMBORGHINI REVUELTO", brand: "ITALIAN HYPERCAR", type: "super", price: 6000, color: "#ffc400", speed: 1.32, steer: 18, specs: "355 km/h • V12 Hybrid" },
  { name: "BUGATTI CHIRON SPORT", brand: "FRENCH HYPER-KING", type: "super", price: 8500, color: "#00b0ff", speed: 1.38, steer: 19, specs: "420 km/h • W16 Quad" }
];

const PAINT_SWATCHES = ["#d50000", "#0066ff", "#212121", "#f5f5f7", "#ffc400", "#00c853", "#ff6d00", "#90a4ae"];

const CHARACTERS = [
  { name: "AARAV", role: "ROOKIE DRIVER", price: 0, jacket: "#1e3a8a", pants: "#111827", skin: "#e0ac69", speedBonus: 1.0, coinBonus: 1, bonusText: "Perk: Balanced Telemetry" },
  { name: "VIKRAM", role: "HIGHWAY PRO", price: 350, jacket: "#b91c1c", pants: "#1f2937", skin: "#d2996c", speedBonus: 1.05, coinBonus: 1, bonusText: "Perk: +5% Top Speed" },
  { name: "KABIR", role: "DRIFT SPECIALIST", price: 750, jacket: "#047857", pants: "#0f172a", skin: "#c68642", speedBonus: 1.03, coinBonus: 2, bonusText: "Perk: 2x Cash Multiplier" },
  { name: "ROHAN", role: "TURBO ENGINEER", price: 1300, jacket: "#d97706", pants: "#18181b", skin: "#f1c27d", speedBonus: 1.08, coinBonus: 2, bonusText: "Perk: +8% Speed & 2x Cash" },
  { name: "DEV", role: "APEX CHAMPION", price: 2200, jacket: "#6d28d9", pants: "#09090b", skin: "#e0ac69", speedBonus: 1.12, coinBonus: 3, bonusText: "Perk: +12% Speed & 3x Cash" }
];

const TRACKS = [
  { name: "Mumbai Coastal Road", reqLevel: 1, skyTop: "#1e88e5", skyBot: "#90caf9", ground: "#263238", road: "#37474f", desc: "Level 1 • Daylight Sea Link" },
  { name: "Delhi-Jaipur Night", reqLevel: 2, skyTop: "#05070e", skyBot: "#141b33", ground: "#0a0d14", road: "#1c202b", desc: "Level 2 • Midnight Expressway" },
  { name: "Manali Snow Highway", reqLevel: 3, skyTop: "#90a4ae", skyBot: "#eceff1", ground: "#cfd8dc", road: "#455a64", desc: "Level 3 • Alpine Fog & Ice" },
  { name: "Cyber Tokyo Drift", reqLevel: 4, skyTop: "#120428", skyBot: "#311b92", ground: "#090414", road: "#161622", desc: "Level 4 • Future Neon City" }
];

let selectedCarIdx = 0, selectedPaintHex = CARS[0].color, selectedCharIdx = 0, selectedTrackIdx = 0;

function switchPage(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- 3. COLOR SWATCHES & UI ---
const swatchBox = document.getElementById("colorSwatches");
PAINT_SWATCHES.forEach((hex, idx) => {
  const s = document.createElement("div");
  s.className = "swatch" + (idx === 0 ? " selected" : "");
  s.style.backgroundColor = hex;
  s.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach(el => el.classList.remove("selected"));
    s.classList.add("selected");
    selectedPaintHex = hex;
  });
  swatchBox.appendChild(s);
});

function refreshGarageUI() {
  const c = CARS[selectedCarIdx];
  const isUnlocked = saveData.unlockedCars.includes(selectedCarIdx);
  document.getElementById("carBrand").innerText = c.brand;
  document.getElementById("carName").innerText = c.name;
  document.getElementById("carSpecs").innerText = c.specs;
  const btn = document.getElementById("carActionBtn");
  btn.className = isUnlocked ? "btn-primary" : "btn-buy";
  btn.innerText = isUnlocked ? "SELECT & CONTINUE ➔" : "💰 BUY VEHICLE ($" + c.price + ")";
}

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
      renderTrackCards();
    });
    grid.appendChild(card);
  });
}

document.getElementById("backChar").addEventListener("click", () => switchPage("page-character"));

// --- 4. BUILT-IN ZERO-DEPENDENCY 3D PERSPECTIVE ENGINE ---
const canvas = document.getElementById("game3DCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let gameRunning = false, distance = 0, raceCoins = 0, currentSpeed = 14, braking = false, nitro = false, hoodCam = false;
let playerX = 0; // -180 to +180
let showroomAngle = 0;
let enemies = [];
let coinList = [];
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
  distance = 0; raceCoins = 0; currentSpeed = 14; playerX = 0;
  enemies = []; coinList = [];
  document.getElementById("resultModal").classList.add("hidden");
  switchPage("page-race");
  gameRunning = true;
}

document.getElementById("startRaceBtn").addEventListener("click", launchRace);
document.getElementById("retryRaceBtn").addEventListener("click", launchRace);
document.getElementById("toGarageModalBtn").addEventListener("click", () => {
  gameRunning = false;
  refreshGarageUI();
  switchPage("page-garage");
});

// 3D Car Renderer (Draws realistic angled 3D chassis, cabin, wheels, tail-lights)
function draw3DCar(cx, cy, scale, colorHex, carType, isPlayer, isBraking, isNitro) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.beginPath();
  ctx.ellipse(0, 26, 76, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tires
  ctx.fillStyle = "#111";
  ctx.fillRect(-68, -2, 16, 30);
  ctx.fillRect(52, -2, 16, 30);

  // Lower Body Bumper
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.roundRect(-64, -22, 128, 38, 10);
  ctx.fill();

  // Upper Cabin / Roof (3D Perspective Taper)
  ctx.fillStyle = "#0d1321";
  ctx.beginPath();
  if (carType === "cyber") {
    ctx.moveTo(-54, -22);
    ctx.lineTo(0, -54);
    ctx.lineTo(54, -22);
  } else if (carType === "suv" || carType === "jeep") {
    ctx.moveTo(-54, -22);
    ctx.lineTo(-46, -52);
    ctx.lineTo(46, -52);
    ctx.lineTo(54, -22);
  } else {
    ctx.moveTo(-52, -22);
    ctx.lineTo(-38, -46);
    ctx.lineTo(38, -46);
    ctx.lineTo(52, -22);
  }
  ctx.closePath();
  ctx.fill();

  // Roof Top Highlight
  ctx.fillStyle = colorHex;
  ctx.fillRect(-36, carType === "suv" || carType === "jeep" ? -54 : -48, 72, 5);

  // Rear Spoiler
  if (carType === "coupe" || carType === "super" || carType === "muscle") {
    ctx.fillStyle = "#111";
    ctx.fillRect(-58, -28, 116, 5);
    ctx.fillRect(-42, -24, 6, 6);
    ctx.fillRect(36, -24, 6, 6);
  }

  // Tail Lights / Brake Lights
  ctx.fillStyle = isPlayer ? (isBraking ? "#ff1744" : "#b71c1c") : "#ffeb3b";
  if (isPlayer && isBraking) {
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff1744";
  }
  ctx.fillRect(-56, -12, 26, 8);
  ctx.fillRect(30, -12, 26, 8);
  ctx.shadowBlur = 0;

  // License Plate / Exhausts
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(-34, 12, 6, 0, Math.PI * 2);
  ctx.arc(34, 12, 6, 0, Math.PI * 2);
  ctx.fill();

  // Nitro Flames
  if (isPlayer && isNitro) {
    ctx.fillStyle = "#00f3ff";
    ctx.beginPath();
    ctx.arc(-34, 12, 7 + Math.random() * 5, 0, Math.PI * 2);
    ctx.arc(34, 12, 7 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 3D Human Character Renderer for Showroom
function draw3DCharacter(cx, cy, scale, ch) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 72, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = ch.pants;
  ctx.fillRect(-13, 22, 11, 46);
  ctx.fillRect(2, 22, 11, 46);

  // Shoes
  ctx.fillStyle = "#fff";
  ctx.fillRect(-14, 66, 12, 6);
  ctx.fillRect(2, 66, 12, 6);

  // Jacket Torso
  ctx.fillStyle = ch.jacket;
  ctx.beginPath();
  ctx.roundRect(-18, -24, 36, 48, 8);
  ctx.fill();

  // Arms
  ctx.fillRect(-25, -20, 7, 40);
  ctx.fillRect(18, -20, 7, 40);

  // Head
  ctx.fillStyle = ch.skin;
  ctx.beginPath();
  ctx.arc(0, -38, 13, 0, Math.PI * 2);
  ctx.fill();

  // Hair & Sunglasses
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(0, -42, 13, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-10, -40, 20, 5);

  ctx.restore();
}

// --- 5. MAIN 3D RENDER LOOP ---
function renderLoop() {
  requestAnimationFrame(renderLoop);

  const W = canvas.width;
  const H = canvas.height;
  const horizonY = H * 0.44;
  const theme = TRACKS[selectedTrackIdx];

  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, theme.skyTop);
  skyGrad.addColorStop(1, theme.skyBot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, horizonY);

  // Ground
  ctx.fillStyle = theme.ground;
  ctx.fillRect(0, horizonY, W, H - horizonY);

  // 3D Perspective Highway Trapezoid
  const roadTopW = W * 0.14;
  const roadBotW = W * 0.96;
  ctx.fillStyle = theme.road;
  ctx.beginPath();
  ctx.moveTo(W / 2 - roadTopW / 2, horizonY);
  ctx.lineTo(W / 2 + roadTopW / 2, horizonY);
  ctx.lineTo(W / 2 + roadBotW / 2, H);
  ctx.lineTo(W / 2 - roadBotW / 2, H);
  ctx.closePath();
  ctx.fill();

  // Road Edge Neon / Curb Lines
  ctx.strokeStyle = selectedTrackIdx === 3 ? "#00f3ff" : "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - roadTopW / 2, horizonY);
  ctx.lineTo(W / 2 - roadBotW / 2, H);
  ctx.moveTo(W / 2 + roadTopW / 2, horizonY);
  ctx.lineTo(W / 2 + roadBotW / 2, H);
  ctx.stroke();

  // SHOWROOM VIEW (Garage & Character Selection Pages)
  if (!gameRunning) {
    showroomAngle += 0.03;
    const bounce = Math.sin(showroomAngle * 2) * 3;
    const car = CARS[selectedCarIdx];
    const ch = CHARACTERS[selectedCharIdx];

    // Showroom Spotlight Floor
    ctx.fillStyle = "rgba(0, 243, 255, 0.14)";
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.56, 165, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw 3D Character next to Car
    draw3DCharacter(W / 2 - 115, H * 0.49, 1.25, ch);
    // Draw Selected 3D Car with Selected Metallic Color
    draw3DCar(W / 2 + 25, H * 0.53 + bounce, 1.45, selectedPaintHex, car.type, true, false, false);
    return;
  }

  // LIVE 3D RACING VIEW
  const carStats = CARS[selectedCarIdx];
  const charStats = CHARACTERS[selectedCharIdx];
  const maxSpd = 22 * carStats.speed * charStats.speedBonus;

  if (braking) currentSpeed = Math.max(5, currentSpeed - 0.8);
  else if (nitro) currentSpeed = Math.min(maxSpd * 1.45, currentSpeed + 0.6);
  else currentSpeed += (maxSpd * 0.78 - currentSpeed) * 0.04;

  distance += currentSpeed * 0.25;
  document.getElementById("hudScore").innerText = Math.floor(distance);
  document.getElementById("hudCoins").innerText = raceCoins;
  document.getElementById("hudSpeed").innerText = Math.floor(currentSpeed * 12);

  if (keys.left && playerX > -140) playerX -= carStats.steer * 0.55;
  if (keys.right && playerX < 140) playerX += carStats.steer * 0.55;

  // Moving 3D Perspective Lane Dashes & Roadside Pillars
  const stripeCycle = (distance * 18) % 100;
  for (let i = 0; i < 10; i++) {
    const zNorm = (i * 100 + stripeCycle) / 1000; // 0 (horizon) to 1 (camera)
    const persp = Math.pow(zNorm, 1.7);
    const y = horizonY + persp * (H - horizonY);
    const curW = roadTopW + persp * (roadBotW - roadTopW);

    // Center Lane Lines
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    const dashH = Math.max(2, persp * 26);
    const dashW = Math.max(1.5, persp * 6);
    ctx.fillRect(W / 2 - curW * 0.17 - dashW / 2, y, dashW, dashH);
    ctx.fillRect(W / 2 + curW * 0.17 - dashW / 2, y, dashW, dashH);

    // Roadside 3D Buildings / Light Poles
    const bW = persp * 55;
    const bH = persp * 140;
    ctx.fillStyle = selectedTrackIdx === 1 || selectedTrackIdx === 3 ? "#0f172a" : "#37474f";
    ctx.fillRect(W / 2 - curW * 0.58 - bW, y - bH, bW, bH);
    ctx.fillRect(W / 2 + curW * 0.58, y - bH, bW, bH);
  }

  // Spawn Traffic & Coins
  if (Math.random() < 0.035) {
    const lanes = [-95, 0, 95];
    const lx = lanes[Math.floor(Math.random() * lanes.length)];
    if (!enemies.some(e => e.x === lx && e.z < 0.25)) {
      const randCar = CARS[Math.floor(Math.random() * CARS.length)];
      const randCol = PAINT_SWATCHES[Math.floor(Math.random() * PAINT_SWATCHES.length)];
      enemies.push({ x: lx, z: 0.02, color: randCol, type: randCar.type });
    }
  }

  if (Math.random() < 0.045) {
    const lanes = [-95, 0, 95];
    coinList.push({ x: lanes[Math.floor(Math.random() * lanes.length)], z: 0.02 });
  }

  // Update & Draw Coins
  for (let i = coinList.length - 1; i >= 0; i--) {
    const c = coinList[i];
    c.z += currentSpeed * 0.0012;
    const persp = Math.pow(c.z, 1.7);
    const cy = horizonY + persp * (H - horizonY);
    const cx = W / 2 + c.x * (0.25 + persp * 1.35);
    const r = Math.max(3, persp * 18);

    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(cx, cy - r, r, 0, Math.PI * 2);
    ctx.fill();

    if (c.z > 0.82 && c.z < 0.96 && Math.abs(c.x - playerX) < 42) {
      raceCoins += 10 * charStats.coinBonus;
      coinList.splice(i, 1);
    } else if (c.z > 1.05) {
      coinList.splice(i, 1);
    }
  }

  // Update & Draw Traffic Cars (Sorted far to near)
  enemies.sort((a, b) => a.z - b.z);
  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    en.z += currentSpeed * 0.00085;
    const persp = Math.pow(en.z, 1.7);
    const ey = horizonY + persp * (H - horizonY);
    const ex = W / 2 + en.x * (0.25 + persp * 1.35);

    draw3DCar(ex, ey, persp * 1.15, en.color, en.type, false, false, false);

    if (en.z > 0.85 && en.z < 0.97 && Math.abs(en.x - playerX) < 46) {
      gameRunning = false;
      const earnedXP = Math.floor(distance / 10) + 40;
      const totalEarned = raceCoins + Math.floor(distance / 15);
      saveData.coins += totalEarned;
      saveData.xp += earnedXP;
      persistSave();
      document.getElementById("resultSummary").innerText = "Distance: " + Math.floor(distance) + "m | Earned: $" + totalEarned;
      document.getElementById("xpGainText").innerText = "+" + earnedXP + " XP (Level " + saveData.level + ")";
      document.getElementById("resultModal").classList.remove("hidden");
      return;
    }

    if (en.z > 1.08) enemies.
