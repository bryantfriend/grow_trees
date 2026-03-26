const treeData = [
    { name: "Baby Sprout", color: "#4CAF50" },
    { name: "Happy Oak", color: "#2E7D32" },
    { name: "Sunny Birch", color: "#8BC34A" },
    { name: "Waving Willow", color: "#1B5E20" },
    { name: "Red Maple", color: "#E53935" },
    { name: "Blue Spruce", color: "#006064" },
    { name: "Golden Larch", color: "#FBC02D" },
    { name: "Pink Cherry", color: "#F06292" },
    { name: "Bishkek Elm", color: "#388E3C" },
    { name: "Sky Guardian", color: "#1565C0" }
];

let unlockedCount = 1;
let activeTreeIndex = 0;
let progress = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let hydration = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
let nutrition = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
let dancing = false;

let toolLevels = { water: 1, trim: 1, feed: 1 };
let toolCosts = { water: 100, trim: 150, feed: 200 };

// Economy
let coins = 0;

function init() {
    renderGrove();
    updateUI();
    startSimulationLoops();
    spawnExcessLeaves();
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
    document.querySelectorAll('.excess-leaf').forEach(l => l.remove());
    renderGrove();
    updateUI();
}

function updateUI() {
    const current = treeData[activeTreeIndex];
    const prog = progress[activeTreeIndex];
    
    // Top HUD
    const coinDisplay = document.getElementById('coinDisplay');
    if(coinDisplay) coinDisplay.innerText = coins;
    
    const countDisplay = document.getElementById('treeCountDisplay');
    if(countDisplay) countDisplay.innerHTML = `${unlockedCount}<span class="text-lg text-slate-400">/10</span>`;

    // Tree Stats
    const title = document.getElementById('treeTitle');
    if(title) title.innerText = current.name;
    
    const leavesPath = current.leaves;
    const trunkPath = current.trunk;
    
    document.getElementById('treeTitle').innerText = current.name;
    document.getElementById('treeCountDisplay').innerText = `${unlockedCount}/3`;
    
    const currentProg = progress[activeTreeIndex];
    const currentLevel = Math.floor(currentProg / 10) + 1;
    document.getElementById('growthLevel').innerText = `Lvl ${currentLevel} (${Math.floor(currentProg)}/100 XP)`;
    
    document.getElementById('barGrowth').style.width = currentProg + '%';
    document.getElementById('barHydration').style.width = hydration[activeTreeIndex] + '%';
    document.getElementById('barNutrition').style.width = nutrition[activeTreeIndex] + '%';
    
    document.getElementById('labelHydration').innerText = Math.floor(hydration[activeTreeIndex]) + '%';
    document.getElementById('labelNutrition').innerText = Math.floor(nutrition[activeTreeIndex]) + '%';
    
    // Scale Tree based on XP
    const scale = 0.9 + (currentProg / 400);
    const treeSVG = document.getElementById('treeSVG');
    
    // Urgency Droop Mechanic 🥀
    if(hydration[activeTreeIndex] < 20 || nutrition[activeTreeIndex] < 20) {
        if(treeSVG) {
            treeSVG.style.transform = `scale(${scale - 0.15})`;
            treeSVG.classList.add('grayscale', 'opacity-80', 'hue-rotate-15', 'brightness-75');
            treeSVG.classList.remove('animate-[sway_4s_ease-in-out_infinite]'); // Stop swaying when sad
        }
    } else {
        if(treeSVG) {
            treeSVG.style.transform = `scale(${scale})`;
            treeSVG.classList.remove('grayscale', 'opacity-80', 'hue-rotate-15', 'brightness-75');
            if(!treeSVG.classList.contains('animate-[sway_4s_ease-in-out_infinite]')) {
                treeSVG.classList.add('animate-[sway_4s_ease-in-out_infinite]');
            }
        }
    }
    
    const existingFruit = document.getElementById('fruitGroup');
    if (existingFruit) existingFruit.remove();
    
    const butterflies = document.getElementById('butterflyContainer');
    if(butterflies) butterflies.style.display = prog >= 100 ? 'block' : 'none';
    
    // Dynamic Cost Button UI
    const growBtnCost = document.getElementById('growBtnCost');
    if (growBtnCost) {
        if (unlockedCount === 1) growBtnCost.innerText = "500 🪙";
        else if (unlockedCount === 2) growBtnCost.innerText = "1000 🪙";
        else growBtnCost.innerText = "MAX";
    }

    // Check if Fruits should be available
    const fruitBtn = document.getElementById('btnPlantFruit');
    if (unlockedCount >= 2 && currentProg >= 50) {
        if(fruitBtn) {
            fruitBtn.classList.remove('hidden');
            fruitBtn.classList.add('flex');
        }
    } else {
        if(fruitBtn) {
            fruitBtn.classList.add('hidden');
            fruitBtn.classList.remove('flex');
        }
    }
}

// ==========================================
// Economy & Actions
// ==========================================

function addCoins(amount) {
    coins += amount;
    
    // Pop up effect visually
    const pop = document.createElement('div');
    pop.innerText = `+${amount} Coins`;
    pop.className = 'fixed text-3xl font-bold text-yellow-500 pointer-events-none z-50 animate-pop-in drop-shadow-lg';
    pop.style.left = '50%';
    pop.style.top = '60%';
    pop.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(pop);
    
    setTimeout(() => {
        pop.style.transform = 'translate(-50%, -150px) scale(0.8)';
        pop.style.opacity = '0';
        pop.style.transition = 'all 1s ease-out';
    }, 50);
    
    setTimeout(() => pop.remove(), 1050);
    
    updateUI();
}

window.buyTree = function() {
    const cost = unlockedCount === 1 ? 500 : 1000;
    if (coins >= cost) {
        if (unlockedCount < 3) {
            coins -= cost;
            unlockedCount++;
            progress[unlockedCount-1] = 0;
            hydration[unlockedCount-1] = 100; // Initialize hydration for new tree
            nutrition[unlockedCount-1] = 100; // Initialize nutrition for new tree
            switchTree(unlockedCount-1);
            toast("New Tree planted successfully! 🌱");
            // Update button UI if maxed
            if(unlockedCount >= 3) {
                const growBtn = document.getElementById('btnGrowTree');
                if(growBtn) growBtn.classList.add('opacity-50', 'pointer-events-none');
            }
            updateUI();
        } else {
            toast("You have reached the maximum of 3 planted trees! 🌳🌳🌳");
        }
    } else {
        toast(`Not enough coins! Need ${cost} 🪙. Keep caring for your trees!`);
    }
};

window.toggleCareMenu = function() {
    const menu = document.getElementById('careSubMenu');
    const mainActionRow = document.getElementById('mainActionRow');
    const btnUpgrade = document.getElementById('btnGrowTree');
    const btnTakeCare = document.getElementById('btnTakeCare');
    
    // Bottom panels to hide
    const panelTrees = document.getElementById('bottomPlantedTrees');
    const panelTools = document.getElementById('bottomToolUpgrades');
    
    if (menu) {
        if (menu.classList.contains('hidden')) {
            // SHOW TOOLBOX
            menu.classList.remove('hidden');
            menu.classList.add('grid');
            
            if (panelTrees) panelTrees.classList.add('hidden');
            if (panelTools) panelTools.classList.add('hidden');
            
            // Shrink main buttons to make room on mobile
            if (mainActionRow) {
                mainActionRow.classList.remove('gap-3');
                mainActionRow.classList.add('gap-2');
            }
            [btnUpgrade, btnTakeCare].forEach(btn => {
                if (btn) {
                    btn.classList.remove('py-3', 'sm:py-4', 'flex-col');
                    btn.classList.add('py-1', 'sm:py-2', 'flex-row', 'gap-2');
                }
            });
            // Hide sub-labels to save vertical space
            if (btnUpgrade) {
                const upCost = btnUpgrade.querySelector('span.font-mono');
                if (upCost) upCost.classList.add('hidden');
            }
            const careSub = document.getElementById('careToggleLabel');
            if (careSub) careSub.classList.add('hidden');
            
        } else {
            // HIDE TOOLBOX
            menu.classList.add('hidden');
            menu.classList.remove('grid');
            
            if (panelTrees) panelTrees.classList.remove('hidden');
            if (panelTools) panelTools.classList.remove('hidden');
            
            // Expand main buttons back
            if (mainActionRow) {
                mainActionRow.classList.remove('gap-2');
                mainActionRow.classList.add('gap-3');
            }
            [btnUpgrade, btnTakeCare].forEach(btn => {
                if(btn) {
                    btn.classList.add('py-3', 'sm:py-4', 'flex-col');
                    btn.classList.remove('py-1', 'sm:py-2', 'flex-row', 'gap-2');
                }
            });
            // Show sub-labels again
            if (btnUpgrade) {
                const upCost = btnUpgrade.querySelector('span.font-mono');
                if (upCost) upCost.classList.remove('hidden');
            }
            const careSub = document.getElementById('careToggleLabel');
            if (careSub) careSub.classList.remove('hidden');
        }
    }
};

window.showEcoModal = function() {
    document.getElementById('ecoModal').classList.remove('hidden');
};

window.simulateDonate = function() {
    document.getElementById('ecoModal').classList.add('hidden');
    toast("Thank you for your $5 simulated donation! +500 🪙");
    addCoins(500);
};

window.upgradeTool = function(type) {
    const cost = toolCosts[type];
    if (coins >= cost) {
        coins -= cost;
        toolLevels[type]++;
        toolCosts[type] = Math.floor(toolCosts[type] * 1.5);
        toast(`${type.toUpperCase()} Tool Upgraded to Lv ${toolLevels[type]}! ✨`);
        
        // Update UI Button text
        const btn = document.getElementById(`upg-${type}`);
        if(btn) {
            let emoji = type === 'water' ? '💧' : (type === 'trim' ? '✂️' : '🌾');
            btn.innerText = `${emoji} UPG (${toolCosts[type]} 🪙)`;
            // Highlight text temporarily
            btn.classList.add('bg-green-300', 'text-green-900');
            setTimeout(() => btn.classList.remove('bg-green-300', 'text-green-900'), 500);
        }
        updateUI();
    } else {
        toast(`Not enough coins! Need ${cost} 🪙`);
    }
};

// ==========================================
// Drag & Drop Mini-Games
// ==========================================

let ghost = null;
let currentTool = null;
let isFilled = false;
let fillTime = 0;
let shakeCount = 0;
let lastShakeX = 0;

window.startDrag = function(e, type) {
    if (dancing && type === 'trim') return; // Cannot trim while tree is dancing
    
    currentTool = type;
    
    // Create the draggable visual 'ghost'
    ghost = document.createElement('div');
    ghost.className = 'fixed pointer-events-none z-[100] flex items-center justify-center drop-shadow-2xl transition-transform';
    
    let content = '<span class="text-4xl">✂️</span>';
    if(type === 'water') {
        const fillPath = isFilled ? 'M12 20 L38 20 L38 38 L12 38 Z' : 'M12 38 L38 38 L38 38 L12 38 Z';
        content = `<div class="w-12 h-12"><svg viewBox="0 0 60 40" class="w-full h-full"><path d="M10 16 L40 16 L40 40 L10 40 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M40 25 L55 15 L55 20 L40 30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M10 20 Q0 20 0 30 Q0 40 10 40" fill="none" stroke="#cbd5e1" stroke-width="4"/><path id="ghostWater" d="${fillPath}" fill="#3b82f6" class="transition-all duration-300"/></svg></div>`;
        const well = document.getElementById('waterWell');
        if(well) {
            well.style.display = 'flex';
            setTimeout(() => well.classList.remove('scale-0'), 10);
        }
    }
    if(type === 'feed') content = '<span class="text-4xl">🌾</span>';
    
    ghost.innerHTML = content;
    document.body.appendChild(ghost);
    moveGhost(e);

    document.addEventListener('pointermove', handleDrag);
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);
    
    // Prevent default scroll behavior
    e.preventDefault();
};

function moveGhost(e) {
    if(!ghost) return;
    ghost.style.left = (e.clientX - 20) + 'px';
    ghost.style.top = (e.clientY - 20) + 'px';
}

function handleDrag(e) {
    moveGhost(e);
    
    if (currentTool === 'water') {
        const well = document.getElementById('waterWell').getBoundingClientRect();
        if (e.clientX > well.left && e.clientX < well.right && e.clientY > well.top && e.clientY < well.bottom) {
            if (!isFilled) {
                isFilled = true;
                fillTime = Date.now();
                const gw = document.getElementById('ghostWater');
                if(gw) gw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); // fill animation
                
                const cw = document.getElementById('canWaterFill');
                if(cw) cw.setAttribute('d', 'M12 20 L38 20 L38 38 L12 38 Z'); // update toolbox
                
                toast("Watering can filled! 💧");
                // Reveal the red 'EMPTY' badge on the source tool
                const wStatus = document.getElementById('waterStatus');
                if(wStatus) {
                    wStatus.innerText = 'FULL';
                    wStatus.classList.remove('bg-red-500', 'hidden');
                    wStatus.classList.add('bg-blue-500');
                }
            }
        }
        
        const tree = document.getElementById('treeSVG').getBoundingClientRect();
        if (isFilled && e.clientX > tree.left && e.clientX < tree.right && e.clientY > tree.top && e.clientY < tree.bottom) {
            if (Date.now() - fillTime < 1000) return; // Wait 1 second before pouring
            
            isFilled = false;
            const gw = document.getElementById('ghostWater');
            if(gw) gw.setAttribute('d', 'M12 38 L38 38 L38 38 L12 38 Z'); // pour animation
            
            const cw = document.getElementById('canWaterFill');
            if(cw) cw.setAttribute('d', 'M12 38 L38 38 L38 38 L12 38 Z'); // update toolbox
            
            const wStatus = document.getElementById('waterStatus');
            if(wStatus) {
                wStatus.innerText = 'EMPTY';
                wStatus.classList.add('bg-red-500');
                wStatus.classList.remove('bg-blue-500');
            }
            
            playPourAnimation(e.clientX, e.clientY);
            setTimeout(() => {
                const gain = 30 * toolLevels.water;
                hydration[activeTreeIndex] = Math.min(100, hydration[activeTreeIndex] + gain);
                toast(`+${gain} Hydration 💧 | +5 🪙`);
                addCoins(5);
                
                // Add sparkle effect to tree! ✨
                spawnActionFeedback(e.clientX, e.clientY, "✨");
                updateUI();
            }, 500);
            endDrag(); // Stop dragging after pouring
        }
    }
    
    if (currentTool === 'trim') {
        document.querySelectorAll('.excess-leaf').forEach(leaf => {
            const rect = leaf.getBoundingClientRect();
            // simple collision detection
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                snipLeaf(leaf, e.clientX, e.clientY);
            }
        });
    }
    
    if (currentTool === 'feed') {
        const trunk = document.getElementById('trunk').getBoundingClientRect();
        // check if dragging over the trunk area
        if (e.clientX > trunk.left - 20 && e.clientX < trunk.right + 20 && e.clientY > trunk.top && e.clientY < trunk.bottom + 20) {
            const deltaX = Math.abs(e.clientX - lastShakeX);
            if (deltaX > 15) {
                shakeCount++;
                lastShakeX = e.clientX;
                spawnFertilizerParticle(e.clientX, e.clientY);
                if (shakeCount > 10) {
                    const gain = 40 * toolLevels.feed;
                    nutrition[activeTreeIndex] = Math.min(100, nutrition[activeTreeIndex] + gain);
                    toast(`+${gain} Nutrition 🍎 | +10 🪙`);
                    addCoins(10);
                    
                    // Bounce animation for tree
                    const treeSVG = document.getElementById('treeSVG');
                    if(treeSVG) {
                        treeSVG.classList.add('scale-110');
                        setTimeout(() => treeSVG.classList.remove('scale-110'), 300);
                    }
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
    ghost = null;
    currentTool = null;
    shakeCount = 0;
    const well = document.getElementById('waterWell');
    if(well) {
        well.classList.add('scale-0');
        setTimeout(() => well.style.display = 'none', 300);
    }
    document.removeEventListener('pointermove', handleDrag);
    document.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointercancel', endDrag);
}

// Mini-game spawners and animations
function spawnExcessLeaves() {
    setInterval(() => {
        if(Math.random() > 0.4 && document.querySelectorAll('.excess-leaf').length < 6) {
            const treeTop = document.getElementById('treeSVG');
            if(!treeTop) return;
            const leaf = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            leaf.setAttribute('class', 'excess-leaf drop-shadow-sm cursor-crosshair');
            const x = Math.random() * 60 + 30; // Random position across canopy
            const y = Math.random() * 50 + 20; 
            leaf.setAttribute('d', `M ${x} ${y} l 12 -15 l 8 10 Z`);
            leaf.setAttribute('fill', '#059669');
            leaf.setAttribute('stroke', '#064e3b');
            leaf.setAttribute('stroke-width', '1');
            leaf.style.transition = 'all 0.3s ease';
            leaf.style.opacity = '0';
            treeTop.insertBefore(leaf, document.getElementById('face')); // Insert behind the face elements
            setTimeout(() => leaf.style.opacity = '1', 50);
        }
    }, 2000);
}

function spawnActionFeedback(x, y, text) {
    const feedback = document.createElement('div');
    feedback.innerText = text;
    feedback.className = 'fixed pointer-events-none z-[120] text-3xl font-bold font-mono animate-pop-in drop-shadow-lg';
    feedback.style.left = (x - 20) + 'px'; 
    feedback.style.top = (y - 30) + 'px';
    document.body.appendChild(feedback);
    setTimeout(() => { feedback.style.transform = `translateY(-30px) scale(1.5)`; feedback.style.opacity='0'; feedback.style.transition='all 0.6s ease-out'; }, 50);
    setTimeout(() => feedback.remove(), 700);
}

function snipLeaf(leaf, cx, cy) {
    leaf.style.transform = 'translateY(50px) rotate(45deg)';
    leaf.style.opacity = '0';
    leaf.classList.remove('excess-leaf');
    
    const gain = 10 * toolLevels.trim;
    spawnActionFeedback(Math.random() * innerWidth, Math.random() * innerHeight, `+${gain} XP`);
    setTimeout(() => { 
        leaf.remove(); 
        progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + gain);
        addCoins(2); 
    }, 300);
    
    const mouth = document.getElementById('mouth');
    if(mouth) {
        mouth.setAttribute('d', 'M 56 61 Q 60 70 64 61');
        setTimeout(() => mouth.setAttribute('d', 'M 56 61 Q 60 67 64 61'), 400);
    }
}

function spawnFertilizerParticle(x, y) {
    const p = document.createElement('div');
    p.innerText = '🟤';
    p.className = 'fixed pointer-events-none z-[110] text-[10px]';
    p.style.left = (x + Math.random()*20-10) + 'px'; 
    p.style.top = (y + Math.random()*20-10) + 'px';
    document.body.appendChild(p);
    setTimeout(() => { p.style.transform = `translateY(30px)`; p.style.opacity='0'; p.style.transition='all 0.5s'; }, 50);
    setTimeout(() => p.remove(), 550);
}

function playPourAnimation(x, y) {
    for(let i=0; i<6; i++) {
        const p = document.createElement('div');
        p.innerText = '💧';
        p.className = 'fixed pointer-events-none z-[110] text-[10px] sm:text-sm';
        p.style.left = (x + Math.random()*30-15) + 'px'; 
        p.style.top = y + 'px';
        document.body.appendChild(p);
        setTimeout(() => { p.style.transform = `translateY(50px)`; p.style.opacity='0'; p.style.transition='all 0.6s ease-in'; }, 50);
        setTimeout(() => p.remove(), 650);
    }
}

window.plantFruit = function() {
    if (unlockedCount <= 5) return;
    
    if (document.getElementById('fruitGroup')) {
        toast("Fruit has already been planted on this tree!");
        return;
    }
    
    toast("Fruits planted! Huge harvest! +50 Coins 🍎");
    addCoins(50);
    
    const treeSVG = document.getElementById('treeSVG');
    
    // Add permanent fruit to SVG
    const fruitGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    fruitGroup.id = 'fruitGroup';
    const coords = [[35, 30], [55, 20], [85, 35], [75, 55], [45, 50], [105, 45], [25, 60], [90, 75]];
    coords.forEach(pos => {
        // Red apple
        const apple = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        apple.setAttribute('cx', pos[0]);
        apple.setAttribute('cy', pos[1]);
        apple.setAttribute('r', '6');
        apple.setAttribute('fill', '#ef4444');
        apple.setAttribute('stroke', '#7f1d1d');
        apple.setAttribute('stroke-width', '1');
        fruitGroup.appendChild(apple);
        // Small leaf
        const leaf = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        leaf.setAttribute('d', `M ${pos[0]} ${pos[1]-6} Q ${pos[0]+4} ${pos[1]-10} ${pos[0]+6} ${pos[1]-6} Z`);
        leaf.setAttribute('fill', '#15803d');
        fruitGroup.appendChild(leaf);
    });
    treeSVG.appendChild(fruitGroup);
    
    // Spawn falling apples
    for(let i=0; i<8; i++) {
        const apple = document.createElement('div');
        apple.innerText = '🍎';
        apple.style.position = 'absolute';
        apple.style.left = (Math.random() * 60 + 20) + '%';
        apple.style.top = (Math.random() * 40 + 10) + '%';
        apple.style.fontSize = Math.random() * 15 + 15 + 'px';
        apple.style.zIndex = '100';
        apple.style.transition = 'all 1s ease-in';
        document.getElementById('stage').appendChild(apple);
        
        setTimeout(() => {
            apple.style.transform = `translateY(150px) rotate(${Math.random()*360}deg)`;
            apple.style.opacity = '0';
        }, 100);
        
        setTimeout(() => apple.remove(), 1100);
    }
};

window.handleTreeInteraction = function() {
    if (dancing) return;
    dancing = true;
    document.getElementById('treeSVG').classList.add('dancing');
    document.getElementById('mouth').setAttribute('d', 'M 56 61 Q 60 70 64 61'); // Open wide!
    setTimeout(() => {
        document.getElementById('treeSVG').classList.remove('dancing');
        document.getElementById('mouth').setAttribute('d', 'M 56 61 Q 60 67 64 61'); // Return to smile
        dancing = false;
    }, 600);
};

function toast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.innerText = msg; t.style.opacity = '1'; t.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, 0)'; }, 4000);
}

// ==========================================
// Background Environment (Running Independently)
// ==========================================
const SVG_NS = "http://www.w3.org/2000/svg";

function startSimulationLoops() {
    // Tamagotchi Idle Loop
    setInterval(() => {
        let changed = false;
        
        // Idle Decay
        if (hydration[activeTreeIndex] > 0) {
            hydration[activeTreeIndex] = Math.max(0, hydration[activeTreeIndex] - 0.5);
            changed = true;
        }
        if (nutrition[activeTreeIndex] > 0) {
            nutrition[activeTreeIndex] = Math.max(0, nutrition[activeTreeIndex] - 0.3);
            changed = true;
        }
        
        // Passive Idle Growth!
        if (hydration[activeTreeIndex] > 50 && nutrition[activeTreeIndex] > 50 && progress[activeTreeIndex] < 100) {
            progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + 0.3);
            changed = true;
        }
        
        if (changed) updateUI();
    }, 1000); // Ticks every 1 second

    // Car Spawner
    setInterval(() => {
        const car = document.createElementNS(SVG_NS, 'g');
        car.setAttribute('class', 'car-svg');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        car.innerHTML = `
            <g transform="translate(0, 142) scale(0.6)">
                <!-- Cute Beetle Car -->
                <path d="M10,20 Q10,10 25,10 Q40,10 40,20 L42,20 A3,3 0 0 1 45,23 L45,25 A2,2 0 0 1 43,27 L7,27 A2,2 0 0 1 5,25 L5,23 A3,3 0 0 1 8,20 Z" fill="${color}" />
                <path d="M15,19 Q15,12 25,12 Q35,12 35,19 Z" fill="#93c5fd" />
                <path d="M24,12 L24,19" fill="none" stroke="${color}" stroke-width="2" />
                <!-- Wheels -->
                <circle cx="15" cy="27" r="5" fill="#1e293b" /><circle cx="15" cy="27" r="2" fill="#cbd5e1" />
                <circle cx="35" cy="27" r="5" fill="#1e293b" /><circle cx="35" cy="27" r="2" fill="#cbd5e1" />
                <!-- Tailpipe -->
                <circle cx="1" cy="25" r="3" fill="#cbd5e1" class="smoke-puff" style="animation-duration: 1s;" />
            </g>`;
        if(carContainer) carContainer.appendChild(car);
        setTimeout(() => car.remove(), 10000);
    }, 3000);

    // Factory Puff Generator
    const smoke = document.getElementById('factorySmoke');
    if(smoke) smoke.classList.remove('opacity-0');
    
    const trafficLine = document.getElementById('trafficLine');
    if(trafficLine) trafficLine.classList.remove('opacity-0');
    
    setInterval(() => {
        const puff = document.createElementNS(SVG_NS, 'circle');
        puff.setAttribute('class', 'smoke-puff');
        const isLeft = Math.random() > 0.5;
        puff.setAttribute('cx', isLeft ? 767.5 : 802.5); // Center of pipes
        puff.setAttribute('cy', isLeft ? 60 : 40);       // Top height of pipes
        puff.setAttribute('r', 5);
        if(smoke) smoke.appendChild(puff);
        setTimeout(() => puff.remove(), 3000);
    }, 1500);

    // Background particles
    const field = document.getElementById('particleField');
    setInterval(() => {
        if (Math.random() > 0.5) return;
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random() * 3 + 1;
        p.style.width = s + 'px'; p.style.height = s + 'px';
        p.style.left = '-10px'; p.style.top = Math.random() * 100 + '%';
        p.style.animation = `drift ${Math.random()*4 + 2}s linear forwards`;
        if(field) field.appendChild(p);
        setTimeout(() => p.remove(), 6000);
    }, 500);
}

window.boostGrowth = function() {
    toast("Sunlight Power! +5% Growth ☀️");
    progress[activeTreeIndex] = Math.min(100, progress[activeTreeIndex] + 5);
    updateUI(); renderGrove();
};

// Initialize Game
updateUI();
renderGrove();
startSimulationLoops();
