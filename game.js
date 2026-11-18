const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

// गेम वेरिएबल्स
let gameRunning = false;
let score = 0;
let coins = 0;
let level = 1;
let baseSpeed = 5;
let nitroActive = false;
let roadOffset = 0;
let highScore = localStorage.getItem("neonRacerHigh") || 0;

document.getElementById("highScoreText").innerText = `बेस्ट स्कोर: ${highScore}`;

// वेब ऑडियो API से बिना MP3 के साउंड इफेक्ट्स बनाना
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "coin") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === "crash") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  }
}

// खिलाड़ी की कार
const player = {
  x: 175,
  y: 520,
  width: 50,
  height: 90,
  speed: 7,
  color: "#00f3ff"
};

let enemies = [];
let coinList = [];
let keys = { left: false, right: false };

// कीबोर्ड कंट्रोल (टेस्टिंग के लिए)
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

// मोबाइल टच कंट्रोल
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

// कार ड्रॉ करने का फंक्शन
function drawCar(x, y, w, h, color, isPlayer = false) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();
  ctx.shadowBlur = 0;

  // कार का शीशा (Windshield)
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(x + 7, y + (isPlayer ? 20 : 45), w - 14, 22);

  // हेडलाइट्स
  ctx.fillStyle = isPlayer ? "#ffffff" : "#ffeb3b";
  ctx.fillRect(x + 6, isPlayer ? y + 2 : y + h - 6, 10, 4);
  ctx.fillRect(x + w - 16, isPlayer ? y + 2 : y + h - 6, 10, 4);

  // नाइट्रो बूस्ट की आग
  if (isPlayer && nitroActive) {
    ctx.fillStyle = "#ff5722";
    ctx.beginPath();
    ctx.moveTo(x + 15, y + h);
    ctx.lineTo(x + 25, y + h + 28 + Math.random() * 12);
    ctx.lineTo(x + 35, y + h);
    ctx.fill();
  }
}

// दुश्मन गाड़ियाँ और कॉइन्स बनाना
function spawnObjects() {
  if (Math.random() < 0.025 + level * 0.003) {
    const lanes = [40, 128, 218, 305];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ["#ff0055", "#ff9800", "#9c27b0", "#e91e63"];
    
    // एक ही जगह दो गाड़ियाँ न आएं
    const overlap = enemies.some(en => en.x === lane && en.y < 150);
    if (!overlap) {
      enemies.push({
        x: lane,
        y: -100,
        width: 50,
        height: 90,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  if (Math.random() < 0.025) {
    const lanes = [65, 153, 243, 330];
    coinList.push({
      x: lanes[Math.floor(Math.random() * lanes.length)],
      y: -30,
      radius: 14
    });
  }
}

// मुख्य गेम लूप
function update() {
  if (!gameRunning) return;

  const currentSpeed = nitroActive ? baseSpeed * 1.75 : baseSpeed;
  score += nitroActive ? 2 : 1;
  
  const displayScore = Math.floor(score / 10);
  level = 1 + Math.floor(displayScore / 300);
  baseSpeed = 5 + (level - 1) * 1.2;

  document.getElementById("score").innerText = displayScore;
  document.getElementById("level").innerText = level;
  document.getElementById("coins").innerText = coins;

  // कार को दाएं-बाएं चलाना
  if (keys.left && player.x > 25) player.x -= player.speed;
  if (keys.right && player.x < canvas.width - player.width - 25) player.x += player.speed;

  // सड़क बनाना
  ctx.fillStyle = "#1e1e30";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  roadOffset = (roadOffset + currentSpeed) % 60;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 30]);
  ctx.lineDashOffset = -roadOffset;

  [110, 200, 290].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, canvas.height);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  spawnObjects();

  // कॉइन्स दिखाना और पकड़ना
  coinList.forEach((c, i) => {
    c.y += currentSpeed;
    ctx.fillStyle = "#ffd700";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffd700";
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (
      c.x > player.x - 10 && c.x < player.x + player.width + 10 &&
      c.y > player.y - 10 && c.y < player.y + player.height + 10
    ) {
      coins++;
      score += 150;
      playSound("coin");
      coinList.splice(i, 1);
    } else if (c.y > canvas.height + 30) {
      coinList.splice(i, 1);
    }
  });

  // ट्रैफिक गाड़ियाँ और टक्कर चेक करना
  enemies.forEach((en, i) => {
    en.y += currentSpeed - 1.5;
    drawCar(en.x, en.y, en.width, en.height, en.color);

    if (
      player.x < en.x + en.width - 8 &&
      player.x + player.width - 8 > en.x &&
      player.y < en.y + en.height - 8 &&
      player.y + player.height - 8 > en.y
    ) {
      gameOver();
    }

    if (en.y > canvas.height + 100) enemies.splice(i, 1);
  });

  drawCar(player.x, player.y, player.width, player.height, player.color, true);
  requestAnimationFrame(update);
}

// गेम ओवर फंक्शन
function gameOver() {
  gameRunning = false;
  playSound("crash");
  
  const finalDisplayScore = Math.floor(score / 10);
  if (finalDisplayScore > highScore) {
    highScore = finalDisplayScore;
    localStorage.setItem("neonRacerHigh", highScore);
  }

  document.getElementById("title").innerText = "CRASHED!";
  document.getElementById("highScoreText").innerText = `बेस्ट स्कोर: ${highScore}`;
  document.getElementById("finalScore").innerText =
    `आपका स्कोर: ${finalDisplayScore} | कॉइन्स: ${coins}`;
  document.getElementById("startBtn").innerText = "फिर से खेलें";
  document.getElementById("overlay").style.display = "flex";
}

// गेम स्टार्ट बटन
document.getElementById("startBtn").addEventListener("click", () => {
  score = 0;
  coins = 0;
  level = 1;
  baseSpeed = 5;
  enemies = [];
  coinList = [];
  player.x = 175;
  gameRunning = true;
  document.getElementById("overlay").style.display = "none";
  update();
});
