const treeData = [
    { name: "Baby Sprout", color: "#4CAF50", co2Factor: 0.1, o2Factor: 0.2, pmFactor: 0.05 },
    { name: "Happy Oak", color: "#2E7D32", co2Factor: 0.8, o2Factor: 1.2, pmFactor: 0.3 },
    { name: "Sunny Birch", color: "#8BC34A", co2Factor: 0.5, o2Factor: 0.9, pmFactor: 0.2 },
    { name: "Waving Willow", color: "#1B5E20", co2Factor: 0.6, o2Factor: 1.0, pmFactor: 0.25 },
    { name: "Red Maple", color: "#E53935", co2Factor: 0.7, o2Factor: 1.1, pmFactor: 0.28 },
    { name: "Blue Spruce", color: "#006064", co2Factor: 0.9, o2Factor: 1.3, pmFactor: 0.35 },
    { name: "Golden Larch", color: "#FBC02D", co2Factor: 0.4, o2Factor: 0.7, pmFactor: 0.15 },
    { name: "Pink Cherry", color: "#F06292", co2Factor: 0.3, o2Factor: 0.6, pmFactor: 0.12 },
    { name: "Bishkek Elm", color: "#388E3C", co2Factor: 1.0, o2Factor: 1.5, pmFactor: 0.4 },
    { name: "Sky Guardian", color: "#1565C0", co2Factor: 1.5, o2Factor: 2.0, pmFactor: 0.5 }
];

let unlockedCount = 1;
let activeTreeIndex = 0;
let progress = new Array(10).fill(0);
let dancing = false;

// Science Fair Logic
let pollutionSources = { factory: false, traffic: false };
let activeConcepts = { inversion: false };
let isRaining = false;

const BISHKEK_FACTS = [
    "Rain naturally scrubs PM2.5 and PM10 from the atmosphere.",
    "PM2.5 particles are 30x smaller than a human hair.",
    "Mature trees can catch 20kg of coal dust annually on their leaves.",
    "Urban forests reduce local temperatures by up to 5°C.",
    "Planting trees is the most cost-effective way to filter PM2.5."
];

function init() {
    renderGrove();
    updateUI();
    startSimulationLoops();
}

window.startGame = function() {
    const menu = document.getElementById('menuScreen');
    const game = document.getElementById('gameScreen');
    menu.classList.add('opacity-0');
    setTimeout(() => {
        menu.style.display = 'none';
        game.classList.remove('hidden');
        game.classList.add('animate-fade-in');
        init();
    }, 500);
};

function renderGrove() {
    const grid = document.getElementById('groveGrid');
    if (!grid) return;
    grid.innerHTML = '';
    treeData.forEach((tree, idx) => {
        const item = document.createElement('div');
        const isUnlocked = idx < unlockedCount;
        item.className = `grove-item p-2 rounded-xl border-2 cursor-pointer transition-all shrink-0 ${isUnlocked ? 'bg-white border-slate-100' : 'bg-slate-200 opacity-40'} ${idx === activeTreeIndex ? 'border-green-500 ring-2 ring-green-100 scale-105' : ''}`;
        item.onclick = () => isUnlocked && switchTree(idx);
        item.innerHTML = `<div class="text-xl">${isUnlocked ? '🌳' : '🔒'}</div>`;
        grid.appendChild(item);
    });
}

function switchTree(idx) {
    activeTreeIndex = idx;
    renderGrove();
    updateUI();
}

function updateUI() {
    const current = treeData[activeTreeIndex];
    const prog = progress[activeTreeIndex];
    
    document.getElementById('treeTitle').innerText = current.name;
    document.getElementById('leaves').setAttribute('fill', current.color);
    document.getElementById('treeProgress').style.width = prog + '%';
    
    const scale = 0.9 + (prog / 400);
    document.getElementById('treeSVG').style.transform = `scale(${scale})`;
    document.getElementById('butterflyContainer').style.display = prog >= 100 ? 'block' : 'none';

    calculateImpact();
}

function calculateImpact() {
    let totalFilter = 0;
    let totalCO2 = 0;
    let totalO2 = 0;

    progress.forEach((p, i) => {
        const t = treeData[i];
        totalFilter += t.pmFactor * (p/100);
        totalCO2 += t.co2Factor * (p/100) * 50;
        totalO2 += t.o2Factor * (p/100) * 30;
    });

    let load = (pollutionSources.factory ? 40 : 0) + (pollutionSources.traffic ? 30 : 0) + (activeConcepts.inversion ? 30 : 0);
    const health = Math.max(0, 100 - load + (totalFilter * 25));
    const healthPercent = Math.min(100, health);

    // Dashboard
    document.getElementById('statPM').innerText = `${Math.floor(totalFilter * 20)}%`;
    document.getElementById('statCO2').innerText = `${Math.floor(totalCO2)}g`;
    document.getElementById('statO2').innerText = `${Math.floor(totalO2)}L`;

    // Lung Color
    const lungColor = healthPercent > 70 ? '#fca5a5' : (healthPercent > 40 ? '#94a3b8' : '#475569');
    document.getElementById('lungFill').setAttribute('fill', lungColor);

    // Gauge
    const angle = -80 + (healthPercent * 1.6);
    document.getElementById('gaugeNeedle').style.transform = `rotate(${angle}deg)`;
    document.getElementById('aqiStatus').innerText = healthPercent > 70 ? 'HEALTHY' : (healthPercent > 40 ? 'LOW QUALITY' : 'HAZARDOUS');
    document.getElementById('aqiStatus').style.color = healthPercent > 70 ? '#22c55e' : (healthPercent > 40 ? '#eab308' : '#ef4444');

    const smog = document.getElementById('smogOverlay');
    smog.style.opacity = Math.min(0.6, (load/150) - (totalFilter/10) + 0.1);
}

window.togglePollution = function(type) {
    pollutionSources[type] = !pollutionSources[type];
    const btn = document.getElementById(type === 'factory' ? 'btnFactory' : 'btnTraffic');
    btn.classList.toggle('active', pollutionSources[type]);
    
    if (type === 'factory') {
        document.getElementById('factorySmoke').classList.toggle('opacity-0', !pollutionSources.factory);
    } else {
        document.getElementById('trafficLine').classList.toggle('opacity-0', !pollutionSources.traffic);
    }
    
    calculateImpact();
    toast(`${type.toUpperCase()} impact ${pollutionSources[type] ? 'simulated' : 'removed'}`);
};

window.toggleConcept = function(type) {
    activeConcepts[type] = !activeConcepts[type];
    const btn = document.getElementById(type === 'inversion' ? 'btnInversion' : 'btnRain');
    btn.classList.toggle('active', activeConcepts[type]);

    if (type === 'inversion') {
        document.getElementById('inversionLid').classList.toggle('inversion-active', activeConcepts.inversion);
    }
    calculateImpact();
};

window.triggerRainstorm = function() {
    if (isRaining) return;
    isRaining = true;
    
    toast("Incoming Storm! Rain clears PM2.5 from the air! 🌧️⛈️");
    
    // UI Button visual
    const btn = document.getElementById('btnRain');
    btn.classList.add('active');
    
    // Background and Tree reaction
    document.body.classList.add('flash-lightning');
    setTimeout(() => document.body.classList.remove('flash-lightning'), 500);
    
    // Tree dancing
    dancing = true;
    document.getElementById('treeSVG').classList.add('dancing');
    document.getElementById('mouth').setAttribute('d', 'M46 80 Q50 84 54 80');
    
    // Spawn raindrops
    const rainLayer = document.getElementById('particleField');
    const drops = [];
    for(let i=0; i<60; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = Math.random() * -20 + '%';
        drop.style.animationDelay = Math.random() * 0.5 + 's';
        rainLayer.appendChild(drop);
        drops.push(drop);
    }
    
    // Wash smog temporarily
    const smogOverlay = document.getElementById('smogOverlay');
    smogOverlay.style.transition = "opacity 1s";
    smogOverlay.style.opacity = 0;
    
    // Boost AQI
    document.getElementById('aqiStatus').innerText = 'WASHED CLEAN';
    document.getElementById('aqiStatus').style.color = '#3b82f6';
    document.getElementById('gaugeNeedle').style.transform = `rotate(80deg)`;
    
    // End rain
    setTimeout(() => {
        drops.forEach(d => d.remove());
        isRaining = false;
        btn.classList.remove('active');
        
        // Restore tree
        document.getElementById('treeSVG').classList.remove('dancing');
        document.getElementById('mouth').setAttribute('d', 'M48,78 Q50,81 52,78');
        
        // Restore smog
        smogOverlay.style.transition = "opacity 3s";
        calculateImpact();
    }, 5000);
};

const SVG_NS = "http://www.w3.org/2000/svg";
let pmFilteredScore = 0;



function startSimulationLoops() {
    // Car Spawner
    const carContainer = document.getElementById('carContainer');
    setInterval(() => {
        if (!pollutionSources.traffic) return;
        const car = document.createElementNS(SVG_NS, 'g');
        car.setAttribute('class', 'car-svg');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        car.innerHTML = `
            <g transform="translate(0, 142) scale(0.6)">
                <path d="M5,15 L10,5 L30,5 L38,15 L45,15 A3,3 0 0 1 48,18 L48,25 A2,2 0 0 1 46,27 L40,27 A4,4 0 0 0 32,27 L18,27 A4,4 0 0 0 10,27 L4,27 A2,2 0 0 1 2,25 L2,18 A3,3 0 0 1 5,15 Z" fill="${color}" />
                <path d="M11,14 L14,7 L23,7 L23,14 Z" fill="#93c5fd" />
                <path d="M25,14 L25,7 L29,7 L35,14 Z" fill="#93c5fd" />
                <circle cx="14" cy="27" r="4" fill="#1e293b" /><circle cx="14" cy="27" r="2" fill="#cbd5e1" />
                <circle cx="36" cy="27" r="4" fill="#1e293b" /><circle cx="36" cy="27" r="2" fill="#cbd5e1" />
                <rect x="46" y="18" width="3" height="4" fill="#fde047" rx="1"/>
                <circle cx="0" cy="25" r="3" fill="#94a3b8" class="smoke-puff" style="animation-duration: 1s;" />
            </g>`;
        carContainer.appendChild(car);
        setTimeout(() => car.remove(), 10000);
    }, 2000);

    // Smoke Puff Generator
    const smoke = document.getElementById('factorySmoke');
    setInterval(() => {
        if (!pollutionSources.factory) return;
        const puff = document.createElementNS(SVG_NS, 'circle');
        puff.setAttribute('class', 'smoke-puff');
        const isLeft = Math.random() > 0.5;
        puff.setAttribute('cx', isLeft ? 767.5 : 802.5); // Center of pipes
        puff.setAttribute('cy', isLeft ? 60 : 40);       // Top height of pipes
        puff.setAttribute('r', 5);
        smoke.appendChild(puff);
        setTimeout(() => puff.remove(), 3000);
    }, 800);

    // Background particles
    const field = document.getElementById('particleField');
    setInterval(() => {
        let density = (pollutionSources.factory ? 1 : 0) + (pollutionSources.traffic ? 1 : 0) + (activeConcepts.inversion ? 2 : 0);
        if (density === 0 && Math.random() > 0.1) return;
        for(let i=0; i<density; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const s = Math.random() * 3 + 1;
            p.style.width = s + 'px'; p.style.height = s + 'px';
            p.style.left = '-10px'; p.style.top = Math.random() * 100 + '%';
            p.style.animation = `drift ${Math.random()*4 + 2}s linear forwards`;
            field.appendChild(p);
            setTimeout(() => p.remove(), 6000);
        }
    }, 500);

    setInterval(() => toast(BISHKEK_FACTS[Math.floor(Math.random()*BISHKEK_FACTS.length)]), 10000);
}

window.pourWater = function(e) {
    document.getElementById('canIcon').classList.add('can-tilt');
    setTimeout(() => {
        spawnDrop();
        if (progress[activeTreeIndex] < 100) {
            progress[activeTreeIndex] += 10;
            if (progress[activeTreeIndex] >= 100 && activeTreeIndex === unlockedCount - 1 && unlockedCount < 10) {
                unlockedCount++;
            }
        }
        updateUI(); renderGrove();
        document.getElementById('canIcon').classList.remove('can-tilt');
    }, 400); // 400ms fits subtle animation
};

function spawnDrop() {
    const d = document.createElement('div');
    d.className = 'water-drop'; d.style.left = '50%'; d.style.top = '100px'; d.innerText = '💧';
    document.getElementById('stage').appendChild(d);
    setTimeout(() => d.remove(), 600);
}

window.showDonateModal = function() {
    document.getElementById('donateModal').classList.remove('hidden');
};

window.hideDonateModal = function() {
    document.getElementById('donateModal').classList.add('hidden');
};

window.confirmDonation = function() {
    // Hide modal first
    hideDonateModal();
    
    setTimeout(() => {
        toast("Thank you! $5 donated. A new tree has been planted! 🌳💚");
        
        // Unlock new tree logic
        if (unlockedCount < 10) {
            unlockedCount++;
            progress[unlockedCount-1] = 10; // New tree starts with 10% progress
            switchTree(unlockedCount-1);
        } else {
            // Boost growth of all trees if all unlocked
            for(let i=0; i<10; i++) {
                progress[i] = Math.min(100, progress[i] + 15);
            }
            updateUI();
        }
        
        // Exploding money effect
        for(let i=0; i<25; i++) {
            const bill = document.createElement('div');
            bill.innerText = '💵';
            bill.style.position = 'fixed'; // Use fixed relative to viewport for visual effect
            bill.style.left = '50%';
            bill.style.top = '85%';
            bill.style.transform = 'translate(-50%, -50%) scale(0.5)';
            bill.style.fontSize = Math.random() * 20 + 20 + 'px';
            bill.style.zIndex = '9999';
            bill.style.pointerEvents = 'none';
            bill.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
            document.body.appendChild(bill);
            
            // Explode outward
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 200 + 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance - 200; // Explode upwards
                bill.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random() * 360}deg) scale(1)`;
                bill.style.opacity = '0';
            }, 50);
            
            setTimeout(() => bill.remove(), 1050);
        }
    }, 300); // Wait for modal to close slightly before triggering reward
};

window.handleTreeInteraction = function() {
    if (dancing) return;
    dancing = true;
    document.getElementById('treeSVG').classList.add('dancing');
    document.getElementById('mouth').setAttribute('d', 'M46 80 Q50 84 54 80');
    setTimeout(() => {
        document.getElementById('treeSVG').classList.remove('dancing');
        document.getElementById('mouth').setAttribute('d', 'M48,78 Q50,81 52,78');
        dancing = false;
    }, 600);
};

window.boostGrowth = function() {
    toast("Sunlight Power! +5% Growth ☀️");
    progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + 5);
    updateUI(); renderGrove();
};

function toast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.style.opacity = '1'; t.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, 0)'; }, 4000);
}

window.showInfoModal = function() { document.getElementById('infoModal').classList.remove('hidden'); };
window.hideInfoModal = function() { document.getElementById('infoModal').classList.add('hidden'); };
