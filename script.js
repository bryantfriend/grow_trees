const trees = [
    { name: "Baby Sprout", color: "#a7f3d0", trunk: "M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z", leaves: "M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" },
    { name: "Apple Tree", color: "#86efac", trunk: "M 40 115 C 45 90 50 80 50 70 L 70 70 C 70 80 75 90 80 115 Z", leaves: "M 30 75 C 10 75 5 50 20 40 C 15 15 35 5 50 10 C 60 -10 85 -5 90 15 C 110 10 115 35 100 50 C 115 60 105 85 85 80 C 75 95 55 95 50 85 C 40 95 25 90 30 75 Z" },
    { name: "Lemon Tree", color: "#fef08a", trunk: "M 48 115 C 48 95 53 85 53 75 L 67 75 C 67 85 72 95 72 115 Z", leaves: "M 40 85 C 20 85 15 60 30 50 C 25 25 45 15 60 20 C 70 0 95 5 100 25 C 120 20 125 45 110 60 C 125 70 115 95 95 90 C 85 105 65 105 60 95 C 50 105 35 100 40 85 Z" },
    { name: "Cherry Blossom", color: "#fpc0cb", trunk: "M 42 115 C 45 90 51 80 51 70 L 69 70 C 69 80 75 90 78 115 Z", leaves: "M 35 75 C 15 75 10 50 25 40 C 20 15 40 5 55 10 C 65 -10 90 -5 95 15 C 115 10 120 35 105 50 C 120 60 110 85 90 80 C 80 95 60 95 55 85 C 45 95 30 90 35 75 Z" },
    { name: "Orange Tree", color: "#fdba74", trunk: "M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z", leaves: "M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" },
    { name: "Plum Tree", color: "#d8b4fe", trunk: "M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z", leaves: "M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" },
    { name: "Pine Tree", color: "#6ee7b7", trunk: "M 50 115 L 50 70 L 70 70 L 70 115 Z", leaves: "M 10 85 L 60 10 L 110 85 Z M 20 65 L 60 -10 L 100 65 Z" },
    { name: "Maple Tree", color: "#fca5a5", trunk: "M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z", leaves: "M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" },
    { name: "Oak Tree", color: "#bbf7d0", trunk: "M 40 115 C 40 90 48 80 48 70 L 72 70 C 72 80 80 90 80 115 Z", leaves: "M 25 85 C 5 85 0 60 15 50 C 10 25 30 15 45 20 C 55 0 80 5 85 25 C 105 20 110 45 95 60 C 110 70 100 95 80 90 C 70 105 50 105 45 95 C 35 105 20 100 25 85 Z" },
    { name: "Sky Guardian", color: "#1565C0", trunk: "M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z", leaves: "M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" }
];

// STATE VARIABLES
let plantedTrees = [0, null, null]; // Slots: 0, 1, 2
let activeTreeIndex = 0; 
let progress = [0, 0, 0];
let hydration = [100, 100, 100];
let nutrition = [100, 100, 100];
let dancing = false;
let coins = 0;

// AUTOMATION & UPGRADES (0 to 5)
let upgTiers = { water: 0, trim: 0, feed: 0 };
const UPG_DATA = {
    water: [
        { name: "Steel Bucket", desc: "Bigger capacity (+Hydration)", cost: 100, icon: "🪣" },
        { name: "Swift Spout", desc: "Fills instantly (no delay)", cost: 300, icon: "⚡" },
        { name: "Coin Infusion", desc: "Watering yields 2x Gold", cost: 600, icon: "💰" },
        { name: "Miracle Grow", desc: "Watering also grants +XP", cost: 1200, icon: "🌱" },
        { name: "Auto-Sprinkler", desc: "AUTOMATION: +5 Hydr/sec passively!", cost: 2500, icon: "🚿" }
    ],
    trim: [
        { name: "Sharper Shears", desc: "2x XP per leaf clipped", cost: 150, icon: "🗡️" },
        { name: "Golden Blades", desc: "2x Gold per leaf clipped", cost: 400, icon: "🪙" },
        { name: "Leaf Blower", desc: "Snapping one leaf clears all", cost: 900, icon: "💨" },
        { name: "Composting", desc: "Snipping gives +Nutrition", cost: 1500, icon: "🍂" },
        { name: "Auto-Drone", desc: "AUTOMATION: Drones instantly snip leaves!", cost: 3000, icon: "🚁" }
    ],
    feed: [
        { name: "Premium Soil", desc: "Bigger capacity (+Nutrition)", cost: 200, icon: "🟫" },
        { name: "Easy-Rip Bag", desc: "Halves shake effort required", cost: 500, icon: "🎒" },
        { name: "Golden Fertilizer", desc: "Feeding yields 2x Gold", cost: 1000, icon: "🌟" },
        { name: "Hydrating Mulch", desc: "Feeding also grants +Hydration", cost: 1800, icon: "🌊" },
        { name: "Auto-Feeder Bot", desc: "AUTOMATION: +5 Nutr/sec passively!", cost: 3500, icon: "🤖" }
    ]
};

function addCoins(amount) {
    coins += amount;
    const pop = document.createElement('div');
    pop.innerText = `+${amount} 💰`;
    pop.className = 'fixed text-3xl font-bold text-yellow-500 pointer-events-none z-50 animate-pop-in drop-shadow-lg';
    pop.style.left = '50%'; pop.style.top = '60%'; pop.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(pop);
    setTimeout(() => { pop.style.transform = 'translate(-50%, -150px) scale(0.8)'; pop.style.opacity = '0'; pop.style.transition = 'all 1s ease-out'; }, 50);
    setTimeout(() => pop.remove(), 1050);
    updateUI();
}

// ==========================================
// CORE RENDERING & MODALS
// ==========================================

window.startGame = function() {
    const intro = document.getElementById('menuScreen');
    if (intro) intro.classList.add('hidden');
    
    const game = document.getElementById('gameScreen');
    if (game) game.classList.remove('hidden');
    
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.volume = 0.2;
        bgm.play().catch(e => console.log("Audio autoplay blocked", e));
    }
};

window.setActiveTree = function(slotIndex) {
    if (plantedTrees[slotIndex] === null) return;
    activeTreeIndex = slotIndex;
    renderGroveStage();
    updateUI();
};

window.openPlantModal = function(slotIndex) {
    const modal = document.getElementById('plantTreeModal');
    const grid = document.getElementById('plantModalGrid');
    const costDisp = document.getElementById('plantCostDisplay');
    
    let plantedCount = plantedTrees.filter(t => t !== null).length;
    const cost = plantedCount === 1 ? 500 : 1000;
    
    costDisp.innerText = `Cost: ${cost} 💰`;
    grid.innerHTML = '';
    
    trees.forEach((tree, idx) => {
        grid.innerHTML += `
            <div class="flex flex-col items-center bg-slate-50 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onclick="plantTreeSpecies(${slotIndex}, ${idx}, ${cost})">
                <div class="w-12 h-12 rounded-full mb-2 flex items-center justify-center border-2 border-slate-300" style="background-color: ${tree.color}"><span class="text-xl">🌳</span></div>
                <span class="text-[10px] font-bold text-slate-700 text-center">${tree.name}</span>
            </div>
        `;
    });
    
    modal.classList.remove('hidden');
};

window.plantTreeSpecies = function(slotIndex, speciesIndex, cost) {
    if (coins >= cost) {
        coins -= cost;
        plantedTrees[slotIndex] = speciesIndex;
        progress[slotIndex] = 0;
        hydration[slotIndex] = 100;
        nutrition[slotIndex] = 100;
        document.getElementById('plantTreeModal').classList.add('hidden');
        toast(`Planted ${trees[speciesIndex].name}! 🌱`);
        activeTreeIndex = slotIndex;
        renderGroveStage();
        updateUI();
    } else {
        toast(`Not enough coins! Need ${cost} 💰`);
    }
};

window.openUpgradesModal = function(type) {
    const modal = document.getElementById('toolUpgradesModal');
    const title = document.getElementById('upgModalTitle');
    const emoji = document.getElementById('upgModalEmoji');
    const list = document.getElementById('upgModalList');
    
    // Set headers
    if(type==='water'){ title.innerText="Water Upgrades"; emoji.innerText="💧"; emoji.className="w-12 h-12 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center text-2xl shadow-inner"; }
    else if(type==='trim'){ title.innerText="Trim Upgrades"; emoji.innerText="✂️"; emoji.className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-2xl shadow-inner"; }
    else { title.innerText="Feed Upgrades"; emoji.innerText="🌾"; emoji.className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-2xl shadow-inner"; }
    
    const currentTier = upgTiers[type];
    const tiersData = UPG_DATA[type];
    list.innerHTML = '';
    
    tiersData.forEach((tier, index) => {
        const isBought = index < currentTier;
        const isNext = index === currentTier;
        const isLocked = index > currentTier;
        
        let statusHtml = ``;
        let btnHtml = ``;
        if(isBought) {
            statusHtml = `<span class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Acquired</span>`;
            btnHtml = `<button class="opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl py-2 px-4 text-xs font-bold" disabled>Purchased</button>`;
        } else if (isNext) {
            statusHtml = `<span class="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Available</span>`;
            btnHtml = `<button onclick="buyUpgrade('${type}')" class="bg-${type==='water'?'cyan':(type==='trim'?'indigo':'orange')}-500 hover:brightness-110 text-white rounded-xl py-2 px-4 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all text-xs font-bold">Buy (${tier.cost} 💰)</button>`;
        } else {
            statusHtml = `<span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Locked</span>`;
            btnHtml = `<button class="opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl py-2 px-4 text-xs font-bold" disabled>Requires Prev</button>`;
        }
        
        list.innerHTML += `
            <div class="flex items-center justify-between p-3 border-2 ${isNext ? 'border-blue-400 bg-blue-50/30 ring-4 ring-blue-50' : 'border-slate-100 bg-slate-50'} rounded-2xl relative overflow-hidden transition-all ${isLocked ? 'grayscale opacity-70' : ''}">
                <div class="flex items-center gap-3">
                    <div class="text-3xl">${tier.icon}</div>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-sm text-slate-800">${tier.name}</h3>
                            ${statusHtml}
                        </div>
                        <p class="text-xs text-slate-500">${tier.desc}</p>
                    </div>
                </div>
                ${btnHtml}
            </div>
        `;
    });
    
    modal.classList.remove('hidden');
};

window.buyUpgrade = function(type) {
    const nextTierIndex = upgTiers[type];
    if (nextTierIndex >= 5) return;
    const tierData = UPG_DATA[type][nextTierIndex];
    if (coins >= tierData.cost) {
        coins -= tierData.cost;
        upgTiers[type]++;
        toast(`${tierData.name} Unlocked! ✨`);
        openUpgradesModal(type); // refresh
        updateUI();
    } else {
        toast(`Not enough coins! Need ${tierData.cost} 💰`);
    }
};

function generateTreeSVG(slotIndex, isSad) {
    const speciesId = plantedTrees[slotIndex];
    if (speciesId === null) return '';
    const tree = trees[speciesId];
    return `
    <svg id="treeSVG-${slotIndex}" class="w-full aspect-square animate-[sway_4s_ease-in-out_infinite] origin-bottom transition-all duration-700 drop-shadow-[0_10px_10px_rgba(34,197,94,0.3)] ${isSad ? 'grayscale opacity-80 hue-rotate-15 brightness-75' : ''}" viewBox="0 0 120 120">
        <path class="svg-trunk" d="${tree.trunk}" fill="#8B5A2B" stroke="#4a3018" stroke-width="2.5" stroke-linejoin="round"/>
        <path class="svg-leaves" d="${tree.leaves}" fill="${tree.color}" stroke="#065f46" stroke-width="3" stroke-linejoin="round"/>
        <g id="face-${slotIndex}">
            <ellipse cx="40" cy="65" rx="6" ry="3.5" fill="#fecdd3" opacity="0.9"/>
            <ellipse cx="80" cy="65" rx="6" ry="3.5" fill="#fecdd3" opacity="0.9"/>
            <circle cx="50" cy="58" r="5" fill="#1e293b"/>
            <circle cx="48" cy="56" r="2" fill="#ffffff"/>
            <circle cx="70" cy="58" r="5" fill="#1e293b"/>
            <circle cx="68" cy="56" r="2" fill="#ffffff"/>
            <path id="mouth-${slotIndex}" d="${isSad ? 'M 56 65 Q 60 55 64 65' : 'M 56 61 Q 60 67 64 61'}" stroke="#1e293b" fill="none" stroke-width="2.5" stroke-linecap="round"/>
        </g>
    </svg>`;
}

function renderGroveStage() {
    const stage = document.getElementById('groveStage');
    if(!stage) return;
    
    stage.innerHTML = `
        <div class="absolute inset-x-0 bottom-6 sm:bottom-4 flex justify-center -z-10 pointer-events-none opacity-90 drop-shadow-sm">
            <div class="w-full max-w-[95%] sm:max-w-md h-8 sm:h-12 bg-green-500/20 rounded-[100%] blur-[2px] border-b-[4px] border-green-600/30"></div>
        </div>
    `;
    
    [0, 1, 2].forEach(slot => {
        const isPlanted = plantedTrees[slot] !== null;
        const isActive = activeTreeIndex === slot;
        const isSad = isPlanted && (hydration[slot] < 20 || nutrition[slot] < 20);
        let scale = isPlanted ? (0.8 + (progress[slot] / 400)) : 1;
        if(isSad) scale -= 0.15;
        
        if (isPlanted) {
            stage.innerHTML += `
            <div id="treeSlot-${slot}" class="flex-1 max-w-[33%] min-h-[140px] relative cursor-pointer group flex flex-col justify-end items-center transition-all ${isActive ? '-translate-y-2' : ''}" onclick="setActiveTree(${slot})">
                <div class="absolute -top-6 ${isActive ? 'bg-green-500 text-white shadow-md' : 'bg-slate-800 text-white scale-0 group-hover:scale-100'} px-2 py-0.5 rounded-full text-[9px] font-bold z-50 transition-all text-center uppercase truncate w-24">${trees[plantedTrees[slot]].name}</div>
                <div class="w-full h-full flex items-end justify-center pointer-events-none" style="transform: scale(${scale}); transform-origin: bottom;">
                    ${generateTreeSVG(slot, isSad)}
                </div>
            </div>`;
        } else {
            let pCount = plantedTrees.filter(t => t !== null).length;
            let canPlant = false; let costStr = ""; let btnAction = "";
            if (slot === 1 && pCount === 1) { canPlant = true; costStr = "Plant (500 💰)"; btnAction = `openPlantModal(${slot})`; }
            else if (slot === 2 && pCount === 2) { canPlant = true; costStr = "Plant (1000 💰)"; btnAction = `openPlantModal(${slot})`; }
            else { canPlant = false; costStr = "Locked"; btnAction = `toast('Plant previous slots first!')`; }
            
            stage.innerHTML += `
            <div id="treeSlot-${slot}" class="flex-1 max-w-[28%] h-[60%] sm:h-2/3 mb-4 mx-2 relative cursor-pointer group flex flex-col justify-center items-center border-[3px] border-dashed border-slate-300 rounded-3xl ${canPlant ? 'hover:bg-slate-50/50 hover:border-slate-400 hover:-translate-y-1 transition-all opacity-100' : 'opacity-40'} z-10" onclick="${btnAction}">
                <div class="absolute inset-0 bg-white/40 rounded-3xl -z-10"></div>
                <svg class="w-8 h-8 sm:w-16 sm:h-16 opacity-30 grayscale brightness-0 drop-shadow-md" viewBox="0 0 120 120">
                   <path d="M 45 115 C 45 95 52 85 52 75 L 68 75 C 68 85 75 95 75 115 Z M 35 80 C 15 80 10 55 25 45 C 20 20 40 10 55 15 C 65 -5 90 0 95 20 C 115 15 120 40 105 55 C 120 65 110 90 90 85 C 80 100 60 100 55 90 C 45 100 30 95 35 80 Z" fill="#000" />
                </svg>
                <div class="bg-slate-700 text-white rounded-full px-2 py-0.5 mt-2 absolute -bottom-3 text-[7px] sm:text-[9px] font-bold uppercase whitespace-nowrap drop-shadow-sm font-mono tracking-wider">${costStr}</div>
            </div>`;
        }
    });
}

function updateUI() {
    document.getElementById('coinDisplay').innerText = Math.floor(coins);
    
    // Play coin animation
    const cb = document.getElementById('headerCoinBox');
    if(cb) {
        cb.classList.add('scale-110', 'bg-yellow-100');
        setTimeout(() => cb.classList.remove('scale-110', 'bg-yellow-100'), 200);
    }
    
    const plantedCount = plantedTrees.filter(t => t !== null).length;
    document.getElementById('treeCountDisplay').innerText = `${plantedCount}/3`;
    
    const currentSpeciesIndex = plantedTrees[activeTreeIndex];
    if (currentSpeciesIndex !== null) {
        const currentProg = progress[activeTreeIndex];
        const currentLevel = Math.floor(currentProg / 10) + 1;
        document.getElementById('treeTitle').innerText = trees[currentSpeciesIndex].name;
        document.getElementById('growthLevel').innerText = `Lvl ${currentLevel} (${Math.floor(currentProg)}/100 XP)`;
        
        document.getElementById('barGrowth').style.width = currentProg + '%';
        document.getElementById('barHydration').style.width = hydration[activeTreeIndex] + '%';
        document.getElementById('barNutrition').style.width = nutrition[activeTreeIndex] + '%';
        
        document.getElementById('labelHydration').innerText = Math.floor(hydration[activeTreeIndex]) + '%';
        document.getElementById('labelNutrition').innerText = Math.floor(nutrition[activeTreeIndex]) + '%';
        
        const isSad = (hydration[activeTreeIndex] < 20 || nutrition[activeTreeIndex] < 20);
        let scale = 0.8 + (currentProg / 400);
        if(isSad) scale -= 0.15;
    }
    
    // Button hide logic for grow
    const btnUpgrade = document.getElementById('btnGrowTree');
    if (btnUpgrade) {
        if(plantedCount >= 3) {
            btnUpgrade.classList.add('hidden');
        } else {
            btnUpgrade.classList.remove('hidden');
        }
    }
}

// ==========================================
// INTERACTIONS & TOOLS
// ==========================================

window.toggleCareMenu = function() {
    const menu = document.getElementById('careSubMenu');
    const mainActionRow = document.getElementById('mainActionRow');
    const btnUpgrade = document.getElementById('btnGrowTree');
    const btnTakeCare = document.getElementById('btnTakeCare');
    
    if (menu) {
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden'); menu.classList.add('grid');
            if (mainActionRow) { mainActionRow.classList.remove('gap-3'); mainActionRow.classList.add('gap-2'); }
            [btnUpgrade, btnTakeCare].forEach(btn => {
                if (btn) {
                    btn.classList.remove('py-3', 'sm:py-4', 'flex-col');
                    btn.classList.add('py-1', 'sm:py-2', 'flex-row', 'gap-2');
                }
            });
            if (btnUpgrade) { const upCost = btnUpgrade.querySelector('span.font-mono'); if (upCost) upCost.classList.add('hidden'); }
            const careSub = document.getElementById('careToggleLabel'); if (careSub) careSub.classList.add('hidden');
        } else {
            menu.classList.add('hidden'); menu.classList.remove('grid');
            if (mainActionRow) { mainActionRow.classList.remove('gap-2'); mainActionRow.classList.add('gap-3'); }
            [btnUpgrade, btnTakeCare].forEach(btn => {
                if(btn) {
                    btn.classList.add('py-3', 'sm:py-4', 'flex-col');
                    btn.classList.remove('py-1', 'sm:py-2', 'flex-row', 'gap-2');
                }
            });
            if (btnUpgrade) { const upCost = btnUpgrade.querySelector('span.font-mono'); if (upCost) upCost.classList.remove('hidden'); }
            const careSub = document.getElementById('careToggleLabel'); if (careSub) careSub.classList.remove('hidden');
        }
    }
};

window.showEcoModal = function() { document.getElementById('ecoModal').classList.remove('hidden'); };
window.showInfoModal = window.showEcoModal; // Map legacy button to the new pollution modal

window.simulateDonate = function() {
    document.getElementById('ecoModal').classList.add('hidden');
    toast("Thank you for your simulated donation! +500 💰");
    addCoins(500);
};

let ghost = null;
let currentTool = null;
let isFilled = false;
let fillTime = 0;
let shakeCount = 0;
let lastShakeX = 0;

window.startDrag = function(e, type) {
    if (dancing) return;
    currentTool = type;
    
    ghost = document.createElement('div');
    ghost.className = 'fixed pointer-events-none z-[100] flex items-center justify-center drop-shadow-2xl transition-transform text-4xl';
    
    if(type === 'water') {
        const fillPath = isFilled ? 'M12 20 L38 20 L38 38 L12 38 Z' : 'M12 38 L38 38 L38 38 L12 38 Z';
        ghost.innerHTML = `<div class="w-12 h-12"><svg viewBox="0 0 60 40" class="w-full h-full"><path d="M10 16 L40 16 L40 40 L10 40 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M40 25 L55 15 L55 20 L40 30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M10 20 Q0 20 0 30 Q0 40 10 40" fill="none" stroke="#cbd5e1" stroke-width="4"/><path id="ghostWater" d="${fillPath}" fill="#3b82f6" class="transition-all duration-300"/></svg></div>`;
        const well = document.getElementById('waterWell');
        if(well) { well.style.display = 'flex'; setTimeout(() => well.classList.remove('scale-0'), 10); }
    } else if (type === 'trim') ghost.innerHTML = '✂️';
    else ghost.innerHTML = '🌾';
    
    document.body.appendChild(ghost);
    moveGhost(e);

    document.addEventListener('pointermove', handleDrag);
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);
    e.preventDefault();
};

function moveGhost(e) { if(ghost) { ghost.style.left = (e.clientX - 20) + 'px'; ghost.style.top = (e.clientY - 20) + 'px'; } }

function handleDrag(e) {
    moveGhost(e);
    
    // Tier checking
    const wTier = upgTiers.water;
    const tTier = upgTiers.trim;
    const fTier = upgTiers.feed;

    if (currentTool === 'water') {
        // TIER 2: Swift Spout (No Delay)
        if (wTier >= 2 && !isFilled) {
            isFilled = true;
            fillTime = 0; // instantly ready
            const gw = document.getElementById('ghostWater'); if(gw) gw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); 
            const cw = document.getElementById('canWaterFill'); if(cw) cw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); 
            toast("Instant fill! ⚡");
            const wStatus = document.getElementById('waterStatus'); if(wStatus){ wStatus.innerText='FULL'; wStatus.classList.remove('bg-red-500','hidden'); wStatus.classList.add('bg-blue-500'); }
        }

        const well = document.getElementById('waterWell').getBoundingClientRect();
        if (e.clientX > well.left && e.clientX < well.right && e.clientY > well.top && e.clientY < well.bottom) {
            if (!isFilled && wTier < 2) {
                isFilled = true; fillTime = Date.now();
                const gw = document.getElementById('ghostWater'); if(gw) gw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); 
                const cw = document.getElementById('canWaterFill'); if(cw) cw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); 
                toast("Watering can filled! 💧");
                const wStatus = document.getElementById('waterStatus'); if(wStatus){ wStatus.innerText='FULL'; wStatus.classList.remove('bg-red-500','hidden'); wStatus.classList.add('bg-blue-500'); }
            }
        } else {
            const activeSlot = document.getElementById(`treeSlot-${activeTreeIndex}`);
            if(!activeSlot) return;
            const treeRect = activeSlot.getBoundingClientRect();
            if (e.clientX > treeRect.left && e.clientX < treeRect.right && e.clientY > treeRect.top && e.clientY < treeRect.bottom) {
                if (isFilled && (wTier >= 2 || (Date.now() - fillTime > 700))) {
                    isFilled = false;
                    ghost.style.transform = 'rotate(-45deg)';
                    playPourAnimation(e.clientX, e.clientY);
                    
                    const cw = document.getElementById('canWaterFill'); if(cw) cw.setAttribute('d', 'M12 38 L38 38 L38 38 L12 38 Z');
                    const wStatus = document.getElementById('waterStatus'); if(wStatus){ wStatus.innerText='EMPTY'; wStatus.classList.remove('bg-blue-500'); wStatus.classList.add('bg-red-500'); }
                    setTimeout(() => {
                        let gain = 30;
                        if (wTier >= 1) gain = 50; // Steel Bucket
                        hydration[activeTreeIndex] = Math.min(100, hydration[activeTreeIndex] + gain);
                        
                        let coinGain = 5;
                        if (wTier >= 3) coinGain = 10; // Coin Infusion
                        
                        let msg = `+${gain} Hydration 💧 | +${coinGain} 💰`;
                        
                        // TIER 4: Miracle Grow Water
                        if (wTier >= 4) {
                            progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + 10);
                            msg += ` | +10 XP 🌱`;
                        }

                        toast(msg);
                        addCoins(coinGain);
                        
                        spawnActionFeedback(e.clientX, e.clientY, "✨");
                        updateUI();
                    }, 500);
                    endDrag(); 
                }
            }
        }
    }
    
    if (currentTool === 'trim') {
        const activeSlot = document.getElementById(`treeSlot-${activeTreeIndex}`);
        const leaves = activeSlot ? activeSlot.querySelectorAll('.excess-leaf') : [];
        if (tTier >= 3 && leaves.length > 0) {
            // TIER 3: Leaf blower -> instantly trims all leaves over bounding box
            const treeRect = activeSlot.getBoundingClientRect();
            if (e.clientX > treeRect.left && e.clientX < treeRect.right && e.clientY > treeRect.top && e.clientY < treeRect.bottom) {
                leaves.forEach(l => snipLeaf(l, e.clientX, e.clientY, true)); // batch snip
            }
        } else {
            leaves.forEach(leaf => {
                const rect = leaf.getBoundingClientRect();
                if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                    snipLeaf(leaf, e.clientX, e.clientY, false);
                }
            });
        }
    }
    
    if (currentTool === 'feed') {
        const activeSlot = document.getElementById(`treeSlot-${activeTreeIndex}`);
        if(!activeSlot) return;
        const treeRect = activeSlot.getBoundingClientRect();
        
        if (e.clientX > treeRect.left && e.clientX < treeRect.right && e.clientY > treeRect.top && e.clientY < treeRect.bottom) {
            const deltaX = Math.abs(e.clientX - lastShakeX);
            if (deltaX > 15) {
                shakeCount++;
                lastShakeX = e.clientX;
                spawnFertilizerParticle(e.clientX, e.clientY);
                
                let shakesRequired = fTier >= 2 ? 5 : 10; // TIER 2: Easy-Rip Bag
                
                if (shakeCount > shakesRequired) {
                    let gain = 40;
                    if(fTier >= 1) gain = 70; // Premium Soil
                    nutrition[activeTreeIndex] = Math.min(100, nutrition[activeTreeIndex] + gain);
                    
                    let coinGain = 10;
                    if(fTier >= 3) coinGain = 20; // Golden Fertilizer
                    
                    let msg = `+${gain} Nutrition 🍎 | +${coinGain} 💰`;
                    
                    // TIER 4: Hydrating Mulch
                    if(fTier >= 4) {
                        hydration[activeTreeIndex] = Math.min(100, hydration[activeTreeIndex] + 20);
                        msg += ` | +20 💧`;
                    }
                    
                    toast(msg);
                    addCoins(coinGain);
                    
                    // Bounce
                    activeSlot.classList.add('scale-105');
                    setTimeout(() => activeSlot.classList.remove('scale-105'), 300);
                    updateUI();
                    endDrag();
                }
            }
        } else {
            lastShakeX = e.clientX;
        }
    }
}

function endDrag(e) {
    if(ghost) ghost.remove();
    ghost = null; currentTool = null; shakeCount = 0;
    const well = document.getElementById('waterWell');
    if(well) { well.classList.add('scale-0'); setTimeout(() => well.style.display = 'none', 300); }
    document.removeEventListener('pointermove', handleDrag);
    document.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointercancel', endDrag);
}

// Spawners & Mini FX
function spawnExcessLeaves() {
    setInterval(() => {
        if(plantedTrees[activeTreeIndex] === null) return;
        
        // TIER 5 AUTO-DRONE check
        if (upgTiers.trim >= 5) {
            // Automation handles it instantly, don't even render.
            // Just gain XP/Coins passively!
            if(Math.random() > 0.6) {
                progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + 5);
                addCoins(1);
                updateUI();
            }
            return;
        }

        const activeSlot = document.querySelector(`#treeSVG-${activeTreeIndex}`);
        if(!activeSlot) return;
        
        if(Math.random() > 0.4 && document.querySelectorAll('.excess-leaf').length < 6) {
            const leaf = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            leaf.setAttribute('class', 'excess-leaf drop-shadow-sm cursor-crosshair');
            const x = Math.random() * 60 + 30; const y = Math.random() * 50 + 20; 
            leaf.setAttribute('d', `M ${x} ${y} l 12 -15 l 8 10 Z`);
            leaf.setAttribute('fill', '#059669'); leaf.setAttribute('stroke', '#064e3b');
            leaf.setAttribute('stroke-width', '1'); leaf.style.transition = 'all 0.3s ease';
            leaf.style.opacity = '0';
            const face = activeSlot.querySelector(`#face-${activeTreeIndex}`);
            if(face) activeSlot.insertBefore(leaf, face);
            else activeSlot.appendChild(leaf);
            setTimeout(() => leaf.style.opacity = '1', 50);
        }
    }, 2000);
}

function snipLeaf(leaf, cx, cy, isBatch) {
    leaf.style.transform = 'translateY(50px) rotate(45deg)';
    leaf.style.opacity = '0';
    leaf.classList.remove('excess-leaf');
    
    // Tier 1 logic
    let gain = upgTiers.trim >= 1 ? 20 : 10;
    let coinGain = upgTiers.trim >= 2 ? 4 : 2; // Tier 2 Golden Blades
    
    if(!isBatch) spawnActionFeedback(Math.random() * innerWidth, Math.random() * innerHeight, `+${gain} XP`);
    setTimeout(() => { 
        leaf.remove(); 
        progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + gain);
        // Tier 4 Composting
        if (upgTiers.trim >= 4) {
            nutrition[activeTreeIndex] = Math.min(100, nutrition[activeTreeIndex] + 5);
        }
        addCoins(coinGain); 
        updateUI();
    }, 300);
    
    const mouth = document.getElementById(`mouth-${activeTreeIndex}`);
    if(mouth) {
        mouth.setAttribute('d', 'M 56 61 Q 60 70 64 61');
        setTimeout(() => mouth.setAttribute('d', 'M 56 61 Q 60 67 64 61'), 400);
    }
}

function spawnActionFeedback(x, y, text) {
    const feedback = document.createElement('div');
    feedback.innerText = text; feedback.className = 'fixed pointer-events-none z-[120] text-3xl font-bold font-mono animate-pop-in drop-shadow-lg';
    feedback.style.left = (x - 20) + 'px'; feedback.style.top = (y - 30) + 'px';
    document.body.appendChild(feedback);
    setTimeout(() => { feedback.style.transform = `translateY(-30px) scale(1.5)`; feedback.style.opacity='0'; feedback.style.transition='all 0.6s ease-out'; }, 50);
    setTimeout(() => feedback.remove(), 700);
}

function playPourAnimation(x, y) {
    for(let i=0; i<6; i++) {
        const p = document.createElement('div'); p.innerText = '💧'; p.className = 'fixed pointer-events-none z-[110] text-[10px] sm:text-sm';
        p.style.left = (x + Math.random()*30-15) + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        setTimeout(() => { p.style.transform = `translateY(50px)`; p.style.opacity='0'; p.style.transition='all 0.6s ease-in'; }, 50);
        setTimeout(() => p.remove(), 650);
    }
}
function spawnFertilizerParticle(x, y) {
    const p = document.createElement('div'); p.innerText = '🟤'; p.className = 'fixed pointer-events-none z-[110] text-[10px]';
    p.style.left = (x + Math.random()*20-10) + 'px'; p.style.top = (y + Math.random()*20-10) + 'px';
    document.body.appendChild(p);
    setTimeout(() => { p.style.transform = `translateY(30px)`; p.style.opacity='0'; p.style.transition='all 0.5s'; }, 50);
    setTimeout(() => p.remove(), 550);
}

function toast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.innerText = msg; t.style.opacity = '1'; t.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, 0)'; }, 4000);
}

// ==========================================
// SIMULATION & AUTOMATION ENGINE
// ==========================================

function startSimulationLoops() {
    // 1-Second Tamagotchi Ticks & Automation Ticks
    setInterval(() => {
        let changed = false;
        
        [0, 1, 2].forEach(slot => {
            if (plantedTrees[slot] === null) return;
            
            // Core Decay
            if (hydration[slot] > 0) { hydration[slot] = Math.max(0, hydration[slot] - 0.5); changed = true; }
            if (nutrition[slot] > 0) { nutrition[slot] = Math.max(0, nutrition[slot] - 0.3); changed = true; }
            
            // Automation Perks (Tier 5 unlocks)
            if (upgTiers.water >= 5) { hydration[slot] = Math.min(100, hydration[slot] + 1.5); changed = true; }
            if (upgTiers.feed >= 5) { nutrition[slot] = Math.min(100, nutrition[slot] + 1.5); changed = true; }
            
            // Passive Idle Growth System
            if (hydration[slot] > 50 && nutrition[slot] > 50 && progress[slot] < 100) {
                progress[slot] = Math.min(100, progress[slot] + 0.3); changed = true;
            }
        });
        
        if (changed) { updateUI(); }
    }, 1000);

    const SVG_NS = "http://www.w3.org/2000/svg";
    const carContainer = document.getElementById('carContainer');
    setInterval(() => {
        const car = document.createElementNS(SVG_NS, 'g'); car.setAttribute('class', 'car-svg');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        car.innerHTML = `
            <g transform="translate(0, 142) scale(0.6)">
                <path d="M10,20 Q10,10 25,10 Q40,10 40,20 L42,20 A3,3 0 0 1 45,23 L45,25 A2,2 0 0 1 43,27 L7,27 A2,2 0 0 1 5,25 L5,23 A3,3 0 0 1 8,20 Z" fill="${color}" />
                <path d="M15,19 Q15,12 25,12 Q35,12 35,19 Z" fill="#93c5fd" />
                <path d="M24,12 L24,19" fill="none" stroke="${color}" stroke-width="2" />
                <circle cx="15" cy="27" r="5" fill="#1e293b" /><circle cx="15" cy="27" r="2" fill="#cbd5e1" />
                <circle cx="35" cy="27" r="5" fill="#1e293b" /><circle cx="35" cy="27" r="2" fill="#cbd5e1" />
                <circle cx="1" cy="25" r="3" fill="#cbd5e1" class="smoke-puff" style="animation-duration: 1s;" />
            </g>`;
        if(carContainer) carContainer.appendChild(car); setTimeout(() => car.remove(), 10000);
    }, 3000);

    const smoke = document.getElementById('factorySmoke'); if(smoke) smoke.classList.remove('opacity-0');
    const trafficLine = document.getElementById('trafficLine'); if(trafficLine) trafficLine.classList.remove('opacity-0');
    setInterval(() => {
        const puff = document.createElementNS(SVG_NS, 'circle'); puff.setAttribute('class', 'smoke-puff');
        const isLeft = Math.random() > 0.5; puff.setAttribute('cx', isLeft ? 767.5 : 802.5); puff.setAttribute('cy', isLeft ? 60 : 40); puff.setAttribute('r', 5);
        if(smoke) smoke.appendChild(puff); setTimeout(() => puff.remove(), 3000);
    }, 1500);

    const field = document.getElementById('particleField');
    setInterval(() => {
        if (Math.random() > 0.5) return;
        const p = document.createElement('div'); p.className = 'particle';
        const s = Math.random() * 3 + 1; p.style.width = s + 'px'; p.style.height = s + 'px';
        p.style.left = '-10px'; p.style.top = Math.random() * 100 + '%'; p.style.animation = `drift ${Math.random()*4 + 2}s linear forwards`;
        if(field) field.appendChild(p); setTimeout(() => p.remove(), 6000);
    }, 500);
}

// ==========================================
// INIT
// ==========================================
plantedTrees[0] = 0; // Starts with Baby Sprout
renderGroveStage();
updateUI();
startSimulationLoops();
spawnExcessLeaves();
