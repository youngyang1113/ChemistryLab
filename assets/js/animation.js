// animation.js - 高级动画引擎（流体波动、辉光粒子）

let activeAnimInterval = null;

function clearAnimations() {
    const animLayer = document.getElementById('animationLayer');
    if (animLayer) animLayer.innerHTML = '';
    if (activeAnimInterval) clearInterval(activeAnimInterval);
    activeAnimInterval = null;
}

// 增强气泡
function startBubbles(duration = 4500, intensity = 1.8) {
    clearAnimations();
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;

    const interval = setInterval(() => {
        let count = Math.floor(5 * intensity);
        for (let i = 0; i < count; i++) {
            let bubble = document.createElement('div');
            bubble.className = 'bubble-sim';
            let sz = 5 + Math.random() * 26;
            bubble.style.width = sz + 'px';
            bubble.style.height = sz + 'px';
            bubble.style.left = Math.random() * 85 + 8 + '%';
            bubble.style.bottom = '0px';
            bubble.style.setProperty('--sway', (Math.random() * 60 - 30) + 'px');
            bubble.style.animationDuration = (1.0 + Math.random() * 2.5) + 's';
            animLayer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 4200);
        }
    }, 90);
    activeAnimInterval = interval;
    setTimeout(() => { if (activeAnimInterval) clearInterval(activeAnimInterval); }, duration);
}

// 沉淀升级：增加光晕颗粒
function startPrecipitate() {
    clearAnimations();
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;

    const precip = document.createElement('div');
    precip.className = 'precipitate-layer';
    animLayer.appendChild(precip);
    requestAnimationFrame(() => { precip.style.height = '70%'; });

    for (let i = 0; i < 60; i++) {
        let part = document.createElement('div');
        part.className = 'sediment-particle';
        part.style.left = (5 + Math.random() * 90) + '%';
        part.style.bottom = '0px';
        part.style.animationDuration = (0.7 + Math.random() * 1.2) + 's';
        part.style.background = `hsl(${120 + Math.random()*40}, 30%, 70%)`;
        animLayer.appendChild(part);
        setTimeout(() => part.remove(), 1500);
    }
    setTimeout(() => { if (precip && precip.parentNode) precip.remove(); }, 4000);
}

function addExothermicEffect() {
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;
    let flame = document.createElement('div');
    flame.className = 'flame-real';
    animLayer.appendChild(flame);
    // 热浪扭曲模拟
    let heat = document.createElement('div');
    heat.style.cssText = 'position:absolute; inset:0; background:radial-gradient(circle at 50% 80%, rgba(255,150,0,0.3), transparent); filter:blur(12px); z-index:6;';
    animLayer.appendChild(heat);
    setTimeout(() => { if (flame) flame.remove(); if (heat) heat.remove(); }, 2800);
}

function startSmoke(duration = 3000) {
    clearAnimations();
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;
    const interval = setInterval(() => {
        let smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.left = (30 + Math.random() * 40) + '%';
        animLayer.appendChild(smoke);
        setTimeout(() => smoke.remove(), 3400);
    }, 200);
    activeAnimInterval = interval;
    setTimeout(() => { if (activeAnimInterval) clearInterval(activeAnimInterval); }, duration);
}

function addMetalShine() {
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;
    let shine = document.createElement('div');
    shine.className = 'metal-shine';
    shine.style.background = 'radial-gradient(ellipse, rgba(255,215,0,0.9), rgba(205,127,50,0.2))';
    animLayer.appendChild(shine);
    setTimeout(() => shine.remove(), 2400);
}

// 光晕粒子（辉光）
function createGlowParticles(count = 25) {
    const animLayer = document.getElementById('animationLayer');
    if (!animLayer) return;
    for (let i = 0; i < count; i++) {
        let p = document.createElement('div');
        p.className = 'particle-glow';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '5px';
        p.style.animationDuration = (1.0 + Math.random() * 2) + 's';
        animLayer.appendChild(p);
        setTimeout(() => p.remove(), 3500);
    }
}

// 液体颜色渐变过程（更真实）
function changeLiquidColor(gradient, duration = 4000) {
    const liquid = document.querySelector('.vessel-liquid');
    const tint = document.getElementById('solutionTint');
    if (liquid) {
        liquid.style.transition = `background ${duration/1000}s ease`;
        liquid.style.background = gradient;
    }
    if (tint) {
        tint.style.transition = `background ${duration/1000}s ease, opacity 1s`;
        tint.style.background = gradient;
        tint.style.opacity = '0.6';
        setTimeout(() => tint.style.opacity = '0', duration-500);
    }
    setTimeout(() => {
        if (liquid) {
            liquid.style.background = 'linear-gradient(180deg, #4facfe, #00f2fe)';
            liquid.style.transition = '';
        }
    }, duration);
}

// 流体波动特效（模拟反应时震荡）
function triggerFluidRipple() {
    const liquid = document.querySelector('.vessel-liquid');
    if (liquid) {
        liquid.style.animation = 'none';
        liquid.offsetHeight; // reflow
        liquid.style.animation = 'liquidWave 1.2s 2 cubic-bezier(0.2,0.9,0.4,1)';
        setTimeout(() => liquid.style.animation = '', 2500);
    }
}

function updateLiquidLevel(level) {
    const liquid = document.getElementById('vesselLiquid');
    if (liquid) liquid.style.height = Math.min(92, level) + '%';
}