
const introOverlay = document.getElementById('intro-overlay');
const enterWallBtn = document.getElementById('enter-wall-btn');
const wallContent = document.getElementById('wall-content');
const gameContainer = document.getElementById('game-container');
const charMenu = document.getElementById('menu-screen');
const goToGameBtn = document.getElementById('go-to-game-btn');
const demoOverlay = document.getElementById('demogorgon-overlay');
const input = document.getElementById('message-input');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const demoBtn = document.getElementById('demo-btn');


const audioIntro = document.getElementById('music-intro');
const audioChase = document.getElementById('music-chase');
const muteBtn = document.getElementById('mute-btn'); 

let isMuted = false;

if(audioIntro) audioIntro.volume = 0.5;
if(audioChase) audioChase.volume = 0.4;


if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
        
        e.stopPropagation(); 
        e.preventDefault();

        console.log("Mute butonuna basıldı!"); 
        
        isMuted = !isMuted; 
        
        if (audioIntro) audioIntro.muted = isMuted;
        if (audioChase) audioChase.muted = isMuted;
        
        
        muteBtn.innerText = isMuted ? '🔇' : '🔊';
        
        
        muteBtn.style.color = isMuted ? '#666' : '#dc2626';
    });
} else {
    console.error("HATA: 'mute-btn' ID'li buton bulunamadı!");
}

function playMusic(type) {
    
    if(audioIntro) { audioIntro.pause(); audioIntro.currentTime = 0; }
    if(audioChase) { audioChase.pause(); audioChase.currentTime = 0; }

   
    if (type === 'intro' && audioIntro) {
        audioIntro.muted = isMuted;
        audioIntro.play().catch(e => console.log("Otomatik oynatma bekleniyor..."));
    }
    if (type === 'chase' && audioChase) {
        audioChase.muted = isMuted; 
        audioChase.play().catch(e => console.log("Oyun sesi hatası", e));
    }
}

let isWallPlaying = false;
let timeoutId = null;

const alphabet = [
    { char: 'A', color: 'white' }, { char: 'B', color: 'blue' }, { char: 'C', color: 'red' },
    { char: 'D', color: 'cyan' }, { char: 'E', color: 'orange' }, { char: 'F', color: 'yellow' },
    { char: 'G', color: 'red' }, { char: 'H', color: 'green' }, { char: 'I', color: 'purple' },
    { char: 'J', color: 'white' }, { char: 'K', color: 'blue' }, { char: 'L', color: 'orange' },
    { char: 'M', color: 'red' }, { char: 'N', color: 'yellow' }, { char: 'O', color: 'red' },
    { char: 'P', color: 'cyan' }, { char: 'Q', color: 'green' }, { char: 'R', color: 'green' },
    { char: 'S', color: 'white' }, { char: 'T', color: 'yellow' }, { char: 'U', color: 'blue' },
    { char: 'V', color: 'red' }, { char: 'W', color: 'purple' }, { char: 'X', color: 'cyan' },
    { char: 'Y', color: 'orange' }, { char: 'Z', color: 'red' }
];

const colorMap = {
    white: { on: '#fff', shadow: '0 0 20px #fff, 0 0 40px #fff' },
    blue: { on: '#4aa8ff', shadow: '0 0 20px #4aa8ff, 0 0 40px #00f' },
    red: { on: '#ff4444', shadow: '0 0 20px #ff4444, 0 0 40px #f00' },
    cyan: { on: '#00ffff', shadow: '0 0 20px #00ffff, 0 0 40px #0ff' },
    orange: { on: '#ffaa00', shadow: '0 0 20px #ffaa00, 0 0 40px #fa0' },
    yellow: { on: '#ffff00', shadow: '0 0 20px #ffff00, 0 0 40px #ff0' },
    green: { on: '#55ff55', shadow: '0 0 20px #55ff55, 0 0 40px #0f0' },
    purple: { on: '#d655ff', shadow: '0 0 20px #d655ff, 0 0 40px #a0f' },
};

function createLetter(item) {
    const container = document.createElement('div');
    
    
    container.className = "flex flex-col items-center justify-start w-11 md:w-28 relative group cursor-pointer active:scale-95 transition-transform letter-container mx-[2px] md:mx-3";
    
    container.dataset.char = item.char;
    container.dataset.color = item.color;

    
    let wireStyle = "border-color: #1a1a1a; width: 140%; left: -20%;";

    if (['A', 'I', 'R'].includes(item.char)) {
        wireStyle += "clip-path: inset(0 0 0 50%);"; 
    }

    container.innerHTML = `
        <div class="wire opacity-80" style="${wireStyle}"></div>
        
        <div class="w-3 h-4 md:w-6 md:h-8 bg-green-900 rounded-sm relative z-10 shadow-sm mb-[-2px] md:mb-[-6px]"></div>
        
        <div class="bulb bulb-base w-7 h-11 md:w-14 md:h-20 rounded-[50%] relative z-10" 
             style="background-color: ${item.color === 'white' ? '#ddd' : item.color};">
             <div class="absolute top-2 left-2 w-2 h-3 md:w-4 md:h-5 bg-white opacity-40 rounded-full transform -rotate-45"></div>
        </div>
        
        <div class="mt-1 md:mt-4 text-3xl md:text-8xl font-wall text-black opacity-90 relative z-10 select-none" 
             style="transform: rotate(${Math.random() * 10 - 5}deg); text-shadow: 1px 1px 2px rgba(255,255,255,0.2);">
             ${item.char}
        </div>
    `;

    container.addEventListener('click', () => {
        if (isWallPlaying) return;
        lightUp(container, item.color, 600);
    });
    return container;
}
function renderWall() {
    const row1 = document.getElementById('row-1');
    const row2 = document.getElementById('row-2');
    const row3 = document.getElementById('row-3');
    if (!row1) return;

    row1.innerHTML = '';
    row2.innerHTML = '';
    row3.innerHTML = '';

   
    alphabet.slice(0, 8).forEach(item => row1.appendChild(createLetter(item)));
    
    alphabet.slice(8, 17).forEach(item => row2.appendChild(createLetter(item)));
    
    alphabet.slice(17, 26).forEach(item => row3.appendChild(createLetter(item)));
}

function lightUp(element, colorName, duration = null) {
    const bulb = element.querySelector('.bulb');
    const color = colorMap[colorName];
    bulb.classList.remove('bulb-base');
    bulb.classList.add('bulb-lit');
    bulb.style.backgroundColor = color.on;
    bulb.style.boxShadow = color.shadow;
    if (duration) setTimeout(() => lightDown(element, colorName), duration);
}

function lightDown(element, colorName) {
    if (!element) return;
    const bulb = element.querySelector('.bulb');
    const bulbColor = colorName === 'white' ? '#ddd' : colorName;
    bulb.classList.add('bulb-base');
    bulb.classList.remove('bulb-lit');
    bulb.style.backgroundColor = bulbColor;
    bulb.style.boxShadow = 'inset -2px -2px 6px rgba(0,0,0,0.3)';
}

async function playMessage() {
    const text = input.value;
    if (!text) return;
    isWallPlaying = true;
    updateUIState(true);
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');

    for (let i = 0; i < cleanText.length; i++) {
        if (!isWallPlaying) break;
        const char = cleanText[i];
        const letterEl = document.querySelector(`.letter-container[data-char="${char}"]`);
        if (letterEl) {
            lightUp(letterEl, letterEl.dataset.color);
            await new Promise(r => { timeoutId = setTimeout(r, 1000); });
            lightDown(letterEl, letterEl.dataset.color);
        }
        await new Promise(r => { timeoutId = setTimeout(r, 300); });
    }
    stopMessage();
}

function stopMessage() {
    isWallPlaying = false;
    clearTimeout(timeoutId);
    document.querySelectorAll('.letter-container').forEach(el => lightDown(el, el.dataset.color));
    updateUIState(false);
}

function updateUIState(playing) {
    input.disabled = playing;
    if (playing) { playBtn.classList.add('hidden'); stopBtn.classList.remove('hidden'); }
    else { playBtn.classList.remove('hidden'); stopBtn.classList.add('hidden'); updatePlayBtn(); }
}

function updatePlayBtn() {
    if (input.value.length > 0 && !isWallPlaying) {
        playBtn.disabled = false;
        playBtn.classList.remove('bg-gray-800', 'text-gray-600', 'cursor-not-allowed');
        playBtn.classList.add('bg-red-700', 'hover:bg-red-600', 'text-white', 'shadow-[0_0_15px_rgba(220,38,38,0.4)]');
    } else {
        playBtn.disabled = true;
        playBtn.classList.add('bg-gray-800', 'text-gray-600', 'cursor-not-allowed');
        playBtn.classList.remove('bg-red-700', 'hover:bg-red-600', 'text-white', 'shadow-[0_0_15px_rgba(220,38,38,0.4)]');
    }
}

function triggerDemogorgon() {
    stopMessage();
    demoOverlay.classList.remove('opacity-0');
    demoOverlay.classList.add('animate-flicker');
    const letters = document.querySelectorAll('.letter-container');
    const interval = setInterval(() => {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        lightUp(randomLetter, randomLetter.dataset.color, 200);
    }, 100);
    setTimeout(() => {
        clearInterval(interval);
        demoOverlay.classList.add('opacity-0');
        demoOverlay.classList.remove('animate-flicker');
        letters.forEach(el => lightDown(el, el.dataset.color));
    }, 3000);
}

if (enterWallBtn) {
    enterWallBtn.addEventListener('click', () => {
        
        playMusic('intro'); 

        introOverlay.classList.add('opacity-0', 'pointer-events-none');
        wallContent.style.display = 'block';
        setTimeout(() => {
            wallContent.classList.remove('opacity-0', 'scale-105', 'filter', 'blur-sm', 'pointer-events-none');
        }, 50);
        renderWall();
        initCharSelection();
    });
}

if (goToGameBtn) {
    goToGameBtn.addEventListener('click', () => {
        triggerDemogorgon();
        setTimeout(() => {
            wallContent.style.opacity = '0';
            setTimeout(() => {
                wallContent.style.display = 'none';
                gameContainer.style.display = 'block';
                gameContainer.classList.remove('hidden');
                charMenu.style.display = 'flex';
            }, 1000);
        }, 2000);
    });
}

// Event Listeners
if (input) input.addEventListener('input', updatePlayBtn);
if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !isWallPlaying) playMessage(); });
if (playBtn) playBtn.addEventListener('click', playMessage);
if (stopBtn) stopBtn.addEventListener('click', stopMessage);
if (clearBtn) clearBtn.addEventListener('click', () => { stopMessage(); input.value = ''; updatePlayBtn(); });
if (demoBtn) demoBtn.addEventListener('click', triggerDemogorgon);



const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;


let gameSpeed = 3.0;
let maxSpeed = 16.0;
let score = 0;
let highScore = localStorage.getItem('strangerHighScore') || 0;
let waffleCount = 0;
let isGameOver = false;
let isPlaying = false;
let isUpsideDown = false;
let frame = 0;
let bgScrollX = 0;
let currentPlatformY = 0;
let nextSpawnX = 0;
let currentTunnelHeight = 300; 
let lastPortalFrame = 0;
let wobbleEffect = 0;

const assets = {
    mike: document.getElementById('char-mike'),
    will: document.getElementById('char-will'),
    eleven: document.getElementById('char-eleven'),
    dustin: document.getElementById('char-dustin'),
    lucas: document.getElementById('char-lucas'),
    max: document.getElementById('char-max'),
    demogorgon: document.getElementById('char-demo'),
    vecna: document.getElementById('char-vecna'),
    upsideDownBg: document.getElementById('bg-upsidedown'),
    normalBg: document.getElementById('bg-normal'),
    waffle: document.getElementById('item-waffle')
};

const charOptions = [
    { id: 'mike', name: 'Mike', key: 'm', img: assets.mike },
    { id: 'will', name: 'Will', key: 'w', img: assets.will },
    { id: 'eleven', name: 'Eleven', key: 'e', img: assets.eleven },
    { id: 'dustin', name: 'Dustin', key: 'd', img: assets.dustin },
    { id: 'lucas', name: 'Lucas', key: 'l', img: assets.lucas },
    { id: 'max', name: 'Max', key: 'x', img: assets.max }
];

let selectedPlayers = [];
let players = [];
let obstacles = [];
let platforms = [];
let eggos = [];
let bgLayers = [];
let particles = [];

let demogorgonX = 250; 
let demogorgonY = 200;
let monsterTimer = 0; 

let skyGradient;
let upsideDownGradient;

function createGradients() {
    if (!ctx) return;
    skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, "#1e3799");
    skyGradient.addColorStop(1, "#0c2461");

    upsideDownGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    upsideDownGradient.addColorStop(0, "#4a0000");
    upsideDownGradient.addColorStop(1, "#1a0000");
}

class BackgroundLayer {
    constructor(speedModifier, color) {
        this.speedModifier = speedModifier; this.color = color;
        this.x = 0; this.width = canvas.width; this.objects = [];
        for (let i = 0; i < 30; i++) { this.objects.push({ x: Math.random() * canvas.width * 2, y: canvas.height, w: Math.random() * 60 + 30, h: Math.random() * 500 + 100 }); }
    }
    update() { this.x -= gameSpeed * this.speedModifier; if (this.x <= -this.width) this.x = 0; }
    draw() {
        ctx.fillStyle = this.color;
        [this.x, this.x + this.width].forEach(offsetX => {
            this.objects.forEach(obj => {
                let drawX = obj.x + offsetX;
                if (drawX > -200 && drawX < canvas.width + 200) ctx.fillRect(drawX, canvas.height - obj.h, obj.w, obj.h);
            });
        });
    }
}

class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
        this.x = initial ? Math.random() * canvas.width : canvas.width + Math.random() * 50;
        this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 50;
        this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.2; this.speedY = -(Math.random() * 0.3 + 0.1);
        this.alpha = Math.random() * 0.5 + 0.2; this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
        this.x -= gameSpeed * 0.1; this.wobble += 0.02; this.x += Math.sin(this.wobble) * 0.3 + this.speedX; this.y += this.speedY;
        if (this.y < -10 || this.x < -10) this.reset(false);
    }
    draw() { ctx.fillStyle = `rgba(220, 225, 255, ${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}

class Platform {
    constructor(x, y, w, h, isCeiling, isFiller = false) {
        this.x = x; this.y = y; this.w = w; this.h = h; this.isCeiling = isCeiling; this.isFiller = isFiller; this.markedForDeletion = false;
    }
    update() { this.x -= gameSpeed; if (this.x + this.w < -200) this.markedForDeletion = true; }
    draw() {
        let mainColor = isUpsideDown ? "#3a0000" : "#1a2530"; let glowColor = isUpsideDown ? "#ff0000" : "#00ffff";
        let drawW = this.w + 2; 
        ctx.fillStyle = mainColor; ctx.fillRect(this.x, this.y, drawW, this.h);
        if (!this.isFiller) { 
            ctx.fillStyle = glowColor; 
            this.isCeiling ? ctx.fillRect(this.x, this.y + this.h - 4, drawW, 4) : ctx.fillRect(this.x, this.y, drawW, 4); 
        }
    }
}

class Obstacle {
    constructor(isPortal, x, y) {
        this.isPortal = isPortal; this.x = x; this.y = y; this.w = isPortal ? 70 : 40; this.h = isPortal ? 110 : 40;
        this.pulseOffset = Math.random() * 100; this.passed = false; this.markedForDeletion = false;
    }
    update() { this.x -= gameSpeed; if (this.isPortal) this.pulseOffset += 0.1; if (this.x + this.w < -200) this.markedForDeletion = true; }
    draw() {
        if (this.isPortal) {
            ctx.save(); let centerX = this.x + this.w / 2; let centerY = this.y + this.h / 2;
            let pulse = Math.sin(this.pulseOffset) * 5;
            let portalW = this.w + pulse; let portalH = this.h + pulse;

            ctx.shadowBlur = 40; ctx.shadowColor = "rgba(100, 0, 0, 0.9)";
            ctx.fillStyle = "rgba(40, 0, 0, 0.9)";
            ctx.beginPath(); ctx.ellipse(centerX, centerY, portalW / 2 + 20, portalH / 2 + 20, 0, 0, Math.PI * 2); ctx.fill();

            ctx.shadowBlur = 20; ctx.shadowColor = "#ff0000";
            ctx.fillStyle = "#800000";
            ctx.beginPath(); ctx.ellipse(centerX, centerY, portalW / 2, portalH / 2, 0, 0, Math.PI * 2); ctx.fill();

            ctx.shadowBlur = 10; ctx.shadowColor = "#ffaa00";
            ctx.fillStyle = "rgba(255, 100, 0, 0.8)";
            ctx.beginPath(); ctx.ellipse(centerX, centerY, portalW * 0.4, portalH * 0.6, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.ellipse(centerX, centerY, portalW * 0.1, portalH * 0.2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = isUpsideDown ? "#3e0000" : "#2d3436"; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeStyle = isUpsideDown ? "#ff0000" : "#00ff00"; ctx.lineWidth = 2; ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}

class Eggo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= gameSpeed;
        if (this.x < -this.width) this.markedForDeletion = true;
    }

    draw() {
      
        if (assets.waffle && assets.waffle.complete && assets.waffle.naturalWidth !== 0) {
            ctx.drawImage(assets.waffle, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "#f1c40f"; 
            ctx.beginPath(); 
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2); 
            ctx.fill(); 
            ctx.strokeStyle = "#d35400"; 
            ctx.lineWidth = 2; 
            ctx.stroke(); 
        }
    }
}
class Player {
    constructor(config, startX, startY) {
        this.name = config.name; this.key = config.key; this.img = config.img; this.startX = startX; this.x = startX; this.y = startY;
        this.width = 40; this.height = 70; this.vy = 0; this.vx = 0;
        this.gravity = 0.25; 
        this.maxFallSpeed = 8; 
        this.gravityDir = 1; this.isDead = false; this.canFlip = false; this.hitTimer = 0; this.invincibleTimer = 0; this.rotation = 0;
    }
    update() {
        if (this.isDead) return;
        
        let rubberBand = (this.x < this.startX) ? (this.startX - this.x) * 0.05 : 0;
        this.x += this.vx + rubberBand;
        if (this.vx > 0) this.vx *= 0.9; 

        for (let p of platforms) {
            if (this.x < p.x + p.w &&
                this.x + this.width > p.x &&
                this.y < p.y + p.h &&
                this.y + this.height > p.y) {

                let overlapX = (this.width + p.w) / 2 - Math.abs((this.x + this.width / 2) - (p.x + p.w / 2));
                let overlapY = (this.height + p.h) / 2 - Math.abs((this.y + this.height / 2) - (p.y + p.h / 2));

                if (overlapX < overlapY) {
                    if (this.x < p.x) {
                        this.x = p.x - this.width;
                        this.vx = 0; 
                        this.x -= gameSpeed; 
                    } else {
                        this.x = p.x + p.w;
                    }
                } else {
                    this.vy = 0;
                    if (this.gravityDir === 1) { 
                         if (this.y < p.y) { 
                             this.y = p.y - this.height;
                             this.canFlip = true;
                         } else { 
                             this.y = p.y + p.h;
                         }
                    } else { 
                         if (this.y > p.y) { 
                             this.y = p.y + p.h;
                             this.canFlip = true;
                         } else { 
                             this.y = p.y - this.height;
                         }
                    }
                }
            }
        }

        this.vy += this.gravity * this.gravityDir; 
        if (Math.abs(this.vy) > this.maxFallSpeed) this.vy = this.maxFallSpeed * Math.sign(this.vy); 
        this.y += this.vy;
        
        this.rotation = this.canFlip ? 0 : (this.vy * 0.05);

        
        if (this.x + this.width < 0 || this.y > canvas.height + 200 || this.y < -200) {
            this.isDead = true;
        }
        
        if (this.hitTimer > 0) this.hitTimer--; 
        if (this.invincibleTimer > 0) this.invincibleTimer--;
    }

    flip() {
        if (!this.isDead && this.canFlip) {
            this.gravityDir *= -1; 
            this.vy = 0;
           
            this.vx = 2.0; 
            this.canFlip = false;
        }
    }

    draw() {
        if (this.isDead) return;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        if (this.gravityDir === -1) { ctx.scale(1, -1); }
        ctx.rotate(this.rotation);

        if (this.img && this.img.complete && this.img.naturalWidth !== 0) {
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.restore();
    }
}
function initCharSelection() {
    const grid = document.getElementById('char-selection-grid');
    const infoText = document.getElementById('selected-list');
    if (!grid) return;
    grid.innerHTML = '';
    
    charOptions.forEach((char) => {
        let box = document.createElement('div');
        
       
box.className = 'relative flex flex-col items-center justify-between w-28 h-44 md:w-32 md:h-52 bg-gray-900/30 border-2 border-gray-700 rounded-xl cursor-pointer hover:border-red-500 hover:bg-gray-800 transition-all duration-200 group hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] p-2';
        box.innerHTML = `
            <div class="absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-gray-600 checkbox-circle transition-colors z-10"></div>
            
            <div class="flex-1 flex items-center justify-center w-full overflow-hidden">
                <img src="${char.img.src}" class="w-16 md:w-28 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-lg">
            </div>
            
            <div class="flex flex-col items-center justify-end w-full mt-2">
                <span class="char-name-label text-sm md:text-2xl font-bold text-gray-500 group-hover:text-white font-title tracking-widest mb-1">${char.name.toUpperCase()}</span>
                
                <div class="flex flex-col items-center">
                    <span class="text-[8px] md:text-[10px] text-gray-500 font-mono tracking-widest opacity-60">PRESS</span>
                    <div class="char-key-box w-6 h-6 md:w-10 md:h-10 flex items-center justify-center border border-gray-600 rounded bg-black/50 text-gray-400 font-mono font-bold text-sm md:text-xl transition-colors">
                        ${char.key.toUpperCase()}
                    </div>
                </div>
            </div>
        `;

        box.onclick = () => {
            const index = selectedPlayers.indexOf(char);
            
            
            const img = box.querySelector('img');
            const nameLabel = box.querySelector('.char-name-label');
            const checkCircle = box.querySelector('.checkbox-circle');
            const keyBox = box.querySelector('.char-key-box');

            if (index === -1) { 
                
                selectedPlayers.push(char); 
                box.classList.add('border-red-600', 'bg-red-900/10', 'shadow-[0_0_30px_rgba(220,38,38,0.4)]');
                box.classList.remove('border-gray-700');
                
                img.classList.remove('grayscale');
                nameLabel.classList.add('text-red-500');
                nameLabel.classList.remove('text-gray-500');
                checkCircle.classList.add('bg-red-600', 'border-red-600');
                
                keyBox.classList.add('border-red-500', 'text-red-500', 'shadow-[0_0_10px_rgba(220,38,38,0.5)]');
                keyBox.classList.remove('border-gray-600', 'text-gray-400');
                
            } else { 
                
                selectedPlayers.splice(index, 1); 
                box.classList.remove('border-red-600', 'bg-red-900/10', 'shadow-[0_0_30px_rgba(220,38,38,0.4)]');
                box.classList.add('border-gray-700');
                
                img.classList.add('grayscale');
                nameLabel.classList.remove('text-red-500');
                nameLabel.classList.add('text-gray-500');
                checkCircle.classList.remove('bg-red-600', 'border-red-600');
                
                keyBox.classList.remove('border-red-500', 'text-red-500', 'shadow-[0_0_10px_rgba(220,38,38,0.5)]');
                keyBox.classList.add('border-gray-600', 'text-gray-400');
            }
            
            infoText.innerText = selectedPlayers.length > 0 
                ? selectedPlayers.map(p => `${p.name}`).join(" + ") 
                : "";
        };
        grid.appendChild(box);
    });
    createGradients();
}
function startGame() {
    
    if (selectedPlayers.length === 0) { alert("Please select a character!"); return; }
    
   
    playMusic('chase'); 

    
    document.getElementById('menu-screen').style.display = 'none';
    
    
    resize(); 
    resetGame(); 
    isPlaying = true; 
    animate();
}

function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'flex';
    playMusic('intro');
    resetGame();
}

function resetGame() {
    obstacles = []; platforms = []; eggos = []; players = []; particles = [];
    score = 0; waffleCount = 0;
    gameSpeed = 3.0;
    isUpsideDown = false; isGameOver = false; lastPortalFrame = 0;
    
    
    demogorgonX = 250; 
    demogorgonY = canvas.height / 2;
    monsterTimer = 0;
    
    bgLayers = [new BackgroundLayer(0.2, "#050505"), new BackgroundLayer(0.5, "#101010")];
    for (let i = 0; i < 150; i++) particles.push(new Particle());

    currentPlatformY = canvas.height / 2; 
    currentTunnelHeight = 320;
    let halfT = currentTunnelHeight / 2;
    platforms.push(new Platform(0, currentPlatformY + halfT, canvas.width, 40, false));
    platforms.push(new Platform(0, currentPlatformY - halfT - 40, canvas.width, 40, true));
    nextSpawnX = canvas.width;

    selectedPlayers.forEach((charData, index) => {
       
        let startX = 500 + (index * 60);
        let startY = (currentPlatformY + halfT) - 70 - 1;
        players.push(new Player(charData, startX, startY));
    });
    document.getElementById('game-over-screen').style.display = 'none';
}


function generateLevel() {
    if (nextSpawnX < canvas.width + 500) {
        let patternType = Math.random();
        
        
        if (patternType < 0.30) createStairPattern();
        else if (patternType < 0.55) createFloatingIslandPattern();
        else if (patternType < 0.75) createTrapPattern();
        else if (patternType < 0.90) createSqueezePattern();
        else createStandardPattern();
    }
}

function forceCenterTunnel() {
    let padding = 150; 
    let minSafe = padding + (currentTunnelHeight / 2);
    let maxSafe = canvas.height - padding - (currentTunnelHeight / 2);

    if (currentPlatformY < minSafe) currentPlatformY = minSafe;
    if (currentPlatformY > maxSafe) currentPlatformY = maxSafe;
}

function createStairPattern() {
    let steps = 4 + Math.floor(Math.random() * 3); 
    let stepWidth = 120; 
    let stepHeight = 40; 
    
    let dir = Math.random() > 0.5 ? 1 : -1;
    currentTunnelHeight = 340; 
    
    forceCenterTunnel();

    for (let i = 0; i < steps; i++) {
        let nextY = currentPlatformY + (stepHeight * dir);
        
        let limitTop = 150 + (currentTunnelHeight/2);
        let limitBottom = canvas.height - 150 - (currentTunnelHeight/2);
        
        if (nextY < limitTop) {
            dir = 1;
            nextY = limitTop + stepHeight; 
        } else if (nextY > limitBottom) {
            dir = -1; 
            nextY = limitBottom - stepHeight; 
        }

        currentPlatformY = nextY;

        let halfH = currentTunnelHeight / 2;
        let topY = currentPlatformY - halfH - 40;
        let botY = currentPlatformY + halfH;

        platforms.push(new Platform(nextSpawnX, botY, stepWidth + 20, 40, false));
        platforms.push(new Platform(nextSpawnX, topY, stepWidth + 20, 40, true));
        
        if (Math.random() < 0.3) spawnItems(nextSpawnX, stepWidth, topY, botY);
        nextSpawnX += stepWidth;
    }
}

function createFloatingIslandPattern() {
    let pWidth = 700 + Math.random() * 300; 
    currentTunnelHeight = 380; 
    
    forceCenterTunnel(); 

    let halfH = currentTunnelHeight / 2;
    let topY = currentPlatformY - halfH - 40;
    let botY = currentPlatformY + halfH;
    
    platforms.push(new Platform(nextSpawnX, botY, pWidth + 2, 40, false));
    platforms.push(new Platform(nextSpawnX, topY, pWidth + 2, 40, true));
    
    let islandStart = nextSpawnX + 150;
    let islandWidth = pWidth - 300;
    let islandY = currentPlatformY - 20;
    
    platforms.push(new Platform(islandStart, islandY, islandWidth, 40, false));
    
    spawnItems(islandStart, islandWidth, topY, islandY, topY + 50); 
    spawnItems(islandStart, islandWidth, islandY + 40, botY, botY - 50);

    nextSpawnX += pWidth;
}

function createTrapPattern() {
    let pWidth = 400 + Math.random() * 200;
    let gapSize = 110 + Math.random() * 40;
    
    currentTunnelHeight = 320;
    forceCenterTunnel(); 

    let halfH = currentTunnelHeight / 2;
    let topY = currentPlatformY - halfH - 40; 
    let botY = currentPlatformY + halfH;
    
    let trapOnFloor = Math.random() > 0.5;

    if (trapOnFloor) {
        platforms.push(new Platform(nextSpawnX, topY, pWidth + 2, 40, true));
        let part1 = (pWidth - gapSize) / 2;
        platforms.push(new Platform(nextSpawnX, botY, part1, 40, false));
        platforms.push(new Platform(nextSpawnX + part1 + gapSize, botY, part1 + 2, 40, false));
        spawnItems(nextSpawnX, pWidth, topY, botY, topY + 60); 
    } else {
        platforms.push(new Platform(nextSpawnX, botY, pWidth + 2, 40, false));
        let part1 = (pWidth - gapSize) / 2;
        platforms.push(new Platform(nextSpawnX, topY, part1, 40, true));
        platforms.push(new Platform(nextSpawnX + part1 + gapSize, topY, part1 + 2, 40, true));
        spawnItems(nextSpawnX, pWidth, topY, botY, botY - 60); 
    }
    nextSpawnX += pWidth;
}


function createStandardPattern() {
    let pWidth = 400 + Math.random() * 400; 
    
    let drift = (Math.random() - 0.5) * 50;
    currentPlatformY += drift;
    forceCenterTunnel(); 

    let halfH = currentTunnelHeight / 2;
    let topY = currentPlatformY - halfH - 40; 
    let botY = currentPlatformY + halfH;
    
    platforms.push(new Platform(nextSpawnX, botY, pWidth + 2, 40, false));
    platforms.push(new Platform(nextSpawnX, topY, pWidth + 2, 40, true));
    
    spawnItems(nextSpawnX, pWidth, topY, botY); 
    nextSpawnX += pWidth;
}


function createSqueezePattern() {
    let pWidth = 500; 
    currentTunnelHeight = 220 + Math.random() * 60; 
    
    let shift = (Math.random() - 0.5) * 60;
    currentPlatformY += shift;
    forceCenterTunnel(); 
    
    let halfH = currentTunnelHeight / 2;
    platforms.push(new Platform(nextSpawnX, currentPlatformY + halfH, pWidth + 2, 40, false));
    platforms.push(new Platform(nextSpawnX, currentPlatformY - halfH - 40, pWidth + 2, 40, true));
    
    spawnItems(nextSpawnX, pWidth, currentPlatformY - halfH - 40, currentPlatformY + halfH);
    nextSpawnX += pWidth;
}

function spawnItems(startX, width, topY, botY, forceY = null) {
    if (Math.random() < 0.25 && (frame - lastPortalFrame > 1000)) {
        let py = forceY ? forceY : (topY + botY) / 2;
        obstacles.push(new Obstacle(true, startX + width / 2 - 35, py - 55)); 
        lastPortalFrame = frame; 
        return;
    }
    
    if (!isUpsideDown && Math.random() < 0.5) {
        let ey = forceY ? forceY : (topY + botY) / 2;
        if (!forceY) ey += (Math.random() - 0.5) * 40;
        eggos.push(new Eggo(startX + width * 0.4, ey));
    }
    
    if (Math.random() < 0.6) {
        let ox = startX + width * 0.7;
        let oy;
        if (forceY) {
            oy = forceY; 
        } else {
            oy = (Math.random() > 0.5) ? topY + 45 : botY - 85;
        }
        obstacles.push(new Obstacle(false, ox, oy));
    }
}


function animate() {
    if (!isPlaying || isGameOver) return;
    if (gameSpeed < maxSpeed) gameSpeed += 0.0003;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score += 0.1; nextSpawnX -= gameSpeed;
    generateLevel();
    wobbleEffect += 0.05;

    

    
    if (isUpsideDown) {
        if (assets.upsideDownBg && assets.upsideDownBg.complete && assets.upsideDownBg.naturalWidth !== 0) {
            bgScrollX -= gameSpeed * 0.2;
            let img = assets.upsideDownBg;
            let scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            let drawnW = img.width * scale; let drawnH = img.height * scale;
            let offsetX = bgScrollX % drawnW;
            ctx.drawImage(img, offsetX, 0, drawnW, drawnH);
            ctx.drawImage(img, offsetX + drawnW, 0, drawnW, drawnH);
        } else {
            ctx.fillStyle = upsideDownGradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
            bgLayers.forEach(l => { let oc = l.color; l.color = "#300"; l.update(); l.draw(); l.color = oc; });
        }
        particles.forEach(p => { p.update(); p.draw(); });

    } else {
        if (assets.normalBg && assets.normalBg.complete && assets.normalBg.naturalWidth !== 0) {
            bgScrollX -= gameSpeed * 0.2;
            let img = assets.normalBg;

            let scale = canvas.height / img.height;

            let drawnH = canvas.height;
            let drawnW = img.width * scale;

            
            let offsetX = bgScrollX % drawnW;
            ctx.drawImage(img, offsetX, 0, drawnW, drawnH);
            ctx.drawImage(img, offsetX + drawnW, 0, drawnW, drawnH);

        } else {
            ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
            bgLayers.forEach(l => { l.update(); l.draw(); });
        }
    }

    platforms = platforms.filter(p => !p.markedForDeletion);
    obstacles = obstacles.filter(o => !o.markedForDeletion);
    eggos = eggos.filter(e => !e.markedForDeletion);

    platforms.forEach(p => { p.update(); p.draw(); });

    eggos.forEach(e => {
    e.update(); e.draw();
    players.forEach(p => {
        if (!p.isDead &&
            p.x < e.x + e.width &&
            p.x + p.width > e.x &&
            p.y < e.y + e.height &&
            p.y + p.height > e.y) {
            
            e.markedForDeletion = true;
            score += 100;
            waffleCount++;
        }
    });
});

    obstacles.forEach(o => {
        o.update(); o.draw();
        players.forEach(p => {
            if (!p.isDead && p.x < o.x + o.w - 10 && p.x + p.width > o.x + 10 && p.y < o.y + o.h - 10 && p.y + p.height > o.y + 10) {
                if (o.isPortal && !o.passed) { isUpsideDown = !isUpsideDown; o.passed = true; score += 50; p.invincibleTimer = 60; }
                else if (!o.isPortal) {
                    p.x -= 30;
                    p.hitTimer = 20;
                }
            }
        });
    });

document.getElementById('score-board').innerText = `SCORE: ${Math.floor(score)} | BEST: ${Math.floor(highScore)}`;
    let activePlayers = 0, totalY = 0, totalX = 0;
    players.forEach(p => { if (!p.isDead) { activePlayers++; totalY += p.y; totalX += p.x; } });

    if (activePlayers > 0) {
        let ty = totalY / activePlayers;
        let targetX = 250;

        if (!isUpsideDown) {
             monsterTimer++;
             let cycle = monsterTimer % 300;
             if(cycle > 250) targetX = 300;
        }

        demogorgonX += (targetX - demogorgonX) * 0.05;
        demogorgonY += (ty - demogorgonY) * 0.04;

        players.forEach(p => {
            if (!p.isDead) {
                if (p.x < demogorgonX + 60) {
                    p.isDead = true;
                }
            }
        });

        if (isUpsideDown) {
            let hoverY = demogorgonY + Math.sin(wobbleEffect) * 15;
            if (assets.vecna && assets.vecna.complete && assets.vecna.naturalWidth !== 0) {
                ctx.save();
                ctx.shadowBlur = 40; ctx.shadowColor = "rgba(255, 0, 0, 0.6)";
                ctx.drawImage(assets.vecna, demogorgonX, hoverY - 75, 180, 180);
                ctx.restore();
            } else {
                ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
                ctx.fillRect(demogorgonX, hoverY - 60, 100, 100);
            }
        } else {
            if (assets.demogorgon && assets.demogorgon.complete && assets.demogorgon.naturalWidth !== 0) {
                ctx.drawImage(assets.demogorgon, demogorgonX, demogorgonY - 60, 140, 140);
            } else {
                 ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                 ctx.fillRect(demogorgonX, demogorgonY - 60, 100, 100);
            }
        }
    }

    players.forEach(p => { if (!p.isDead) { p.update(); p.draw(); } });
    if (activePlayers === 0) gameOver();
    frame++; requestAnimationFrame(animate);
}


function gameOver() {
    isGameOver = true;

    
    if(audioChase) audioChase.pause();
    
    document.getElementById('game-over-screen').style.display = 'flex';
    
    
    document.getElementById('final-total').innerText = Math.floor(score);
    
    
    const distScoreEl = document.getElementById('dist-score');
    if(distScoreEl) distScoreEl.innerText = Math.floor(score);
    
    const waffleScoreEl = document.getElementById('waffle-score');
    if(waffleScoreEl) waffleScoreEl.innerText = waffleCount;

    if (Math.floor(score) > highScore) { 
        highScore = Math.floor(score); 
        localStorage.setItem('strangerHighScore', highScore); 
    }
}

// js/game.js dosyasının en sonundaki resize kısmını bununla değiştir:

function resize() {
    if (!canvas) return;

    // 1. Canvas'ın fiziksel boyutunu tarayıcı penceresine eşitle
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 2. Mobil cihaz kontrolü (768px altı telefon/tablet kabul edilir)
    const isMobile = window.innerWidth < 768;

    // 3. Oyun içi çizimleri (gradyanlar, arka planlar) yeni boyuta göre güncelle
    if (typeof createGradients === "function") {
        createGradients();
    }

    // 4. Giriş ekranı ve Mesaj Duvarı (HTML) için dinamik düzenlemeler
    const wallContainer = document.querySelector('.wall-scale-container');
    if (wallContainer) {
        // Tarayıcı adres çubuğu değişimlerinden etkilenmemesi için yüksekliği sabitle
        wallContainer.style.height = window.innerHeight + 'px';
        
        // Ekran genişliğine göre ölçeklendirmeyi (zoom efekti) ayarla
        if (isMobile) {
            // Mobilde içerik daralmasın diye ölçeği biraz artırıyoruz
            wallContainer.style.transform = 'scale(0.60)'; 
        } else {
            // Masaüstünde senin istediğin o ferah %75 görünümü
            wallContainer.style.transform = 'scale(0.75)'; 
        }
        
        // Ölçekleme yaparken içeriğin kaymaması için merkezi sabitle
        wallContainer.style.transformOrigin = 'center center';
    }

    // 5. Oyun menü ekranı (Character Selection) için mobil sığdırma
    const menuScreen = document.getElementById('menu-screen');
    if (menuScreen && isMobile) {
        const menuContent = menuScreen.querySelector('.relative');
        if (menuContent) {
            menuContent.style.width = '95vw';
            menuContent.style.maxHeight = '90vh';
            menuContent.style.overflowY = 'auto'; // Çok küçük ekranlarda kaydırma sağla
        }
    }
}

// Pencere boyutu değiştikçe oyunu yeniden ayarla
window.addEventListener('resize', resize);

// İlk yüklemede çalıştır
resize();

window.addEventListener('keydown', (e) => {
    if (isGameOver && e.code === 'Space') { location.reload(); return; }
    if (!isPlaying) return;

    players.forEach(p => {
        let playerKey = p.key.toLowerCase();
        let pressedKey = e.key.toLowerCase();

        if (pressedKey === playerKey ||
            (playerKey === 'w' && e.code === 'KeyW') ||
            (playerKey === 'm' && e.code === 'KeyM') ||
            (playerKey === 'e' && e.code === 'KeyE') ||
            (playerKey === 'd' && e.code === 'KeyD') ||
            (playerKey === 'l' && e.code === 'KeyL') ||
            (playerKey === 'x' && e.code === 'KeyX')) {
            p.flip();
        }
    });
});


window.addEventListener('load', () => {
    playMusic('intro');
});

document.addEventListener('click', function() {
    if (!isPlaying && audioIntro.paused) {
        playMusic('intro');
    }
}, { once: true });




window.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

    if (isGameOver) { location.reload(); return; }
    
    if (isPlaying) {
        e.preventDefault(); 
        
        players.forEach(p => {
            if (!p.isDead) p.flip();
        });
    }
}, { passive: false });