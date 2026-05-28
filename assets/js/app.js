// app.js - 主程序（集成所有新功能）

// 全局状态
let pendingReagent = null;
let totalScore = 0;
let expCount = 0;
let taskMode = false;
let currentTaskIdx = 0;
let currentTask = taskBank[currentTaskIdx];
let completedKeys = new Set();
let lastReaction = { type: '', phen: '', eq: '', pair: '' };
let currentTemp = 25;
let currentPH = 7.0;
let liquidLevel = 38;
let reactionHistory = [];

// DOM元素
const vesselWaiting = document.getElementById('vesselWaiting');
const resultArea = document.getElementById('resultArea');
const explainArea = document.getElementById('explainArea');
const scoreValueSpan = document.getElementById('scoreValue');
const expCountSpan = document.getElementById('expCount');
const taskDoneCountSpan = document.getElementById('taskDoneCount');
const tempDisplay = document.getElementById('tempDisplay');
const phDisplay = document.getElementById('phDisplay');
const phBar = document.getElementById('phBar');

// 更新温度、pH、液位
function updateVesselStatus() {
    if (tempDisplay) tempDisplay.textContent = Math.round(currentTemp) + '°C';
    if (phDisplay) phDisplay.textContent = currentPH.toFixed(1);
    if (phBar) {
        const percent = Math.max(0, Math.min(100, (currentPH / 14) * 100));
        phBar.style.left = `calc(${percent}% - 5px)`;
    }
    updateLiquidLevel(liquidLevel);
}

function updateWaitingDisplay() {
    if (!vesselWaiting) return;
    if (pendingReagent) {
        const r = reagents.find(x => x.id === pendingReagent);
        vesselWaiting.innerHTML = `<div style="text-align:center;"><i class="fas ${r.icon}" style="font-size:2rem;"></i><div>${r.name}</div><div style="font-size:12px;color:#aaa;">等待第二种试剂...</div></div>`;
    } else {
        vesselWaiting.innerHTML = `<div class="empty-message"><i class="fas fa-droplet"></i><p>拖放试剂至烧杯中</p></div>`;
    }
}

function showNoReactionAlert(a, b) {
    const nameA = getReagentName(a);
    const nameB = getReagentName(b);
    const suggestions = getSuggestionsForReagent(a);
    let msg = `⚠️ "${nameA}" 和 "${nameB}" 在当前条件下不发生明显反应。\n\n`;
    if (suggestions.length > 0) msg += `💡 建议尝试：${suggestions.slice(0,5).join('、')}`;
    alert(msg);
}

function performReaction(a, b) {
    clearAnimations();
    expCount++;
    expCountSpan.textContent = expCount;

    const reaction = reactions.find(r => 
        (r.a === a && r.b === b) || (r.a === b && r.b === a)
    );

    // 保存历史用于撤销
    reactionHistory.push({
        temp: currentTemp,
        ph: currentPH,
        level: liquidLevel,
        logHTML: document.getElementById('logBody').innerHTML
    });

    if (!reaction) {
        showNoReactionAlert(a, b);
        addLogRow(a, b, '无明显反应', '无可见现象', '——');
        resultArea.innerHTML = `<i class="fas fa-microscope"></i> <strong>无明显反应</strong>`;
        resultArea.className = 'status warn';
        return;
    }

    const { type, phen, eq, anim, heat, colorTint } = reaction;
    totalScore += 10;
    let taskCompleted = false;

    if (taskMode && currentTask && currentTask.type === type) {
        const key = `${a}|${b}::${type}`;
        if (!completedKeys.has(key)) {
            completedKeys.add(key);
            totalScore += 10;
            taskCompleted = true;
        }
    }

    lastReaction = { type, phen, eq, pair: `${getReagentName(a)} + ${getReagentName(b)}` };

    resultArea.innerHTML = `<i class="fas fa-microscope"></i> <strong>${type}</strong> | ${phen}`;
    resultArea.className = 'status ok';

    // 更新温度、pH、液位
    if (heat) currentTemp = Math.min(88, currentTemp + 22);
    else currentTemp = Math.max(18, currentTemp - 5);

    if (type.includes('中和')) currentPH = 7.0;
    else if (type.includes('酸') || type.includes('置换')) currentPH = Math.max(2.5, currentPH - 2.8);
    else if (type.includes('碱')) currentPH = Math.min(12.5, currentPH + 2.5);

    liquidLevel = Math.min(92, liquidLevel + 13);

    updateVesselStatus();

    // 动画效果
    // 在 performReaction 中，替换原有动画调用部分：
    // 动画效果（增强版）
    if (heat) addExothermicEffect();
    if (anim === 'precipitate') startPrecipitate();
    if (anim === 'bubble') startBubbles(5000, 2.0);
    if (type.includes('置换') || type.includes('金属')) addMetalShine();
    if (type.includes('氧化还原') || type.includes('分解')) startSmoke(3500);
    if (colorTint) changeLiquidColor(colorTint, 4500);
    
    // 新增：辉光粒子与流体波动
    createGlowParticles(28);
    triggerFluidRipple();
    
    // 临时镜头光晕（反应高光）
    const vessel = document.getElementById('reactionVessel');
    const flare = document.createElement('div');
    flare.className = 'lens-flare';
    vessel.appendChild(flare);
    setTimeout(() => flare.remove(), 2000);

    updateScoreAndTask();
    addLogRow(a, b, type, phen, eq);
}

function updateScoreAndTask() {
    scoreValueSpan.textContent = totalScore;
    taskDoneCountSpan.textContent = completedKeys.size;
    updateTaskUI();
}

function addReagentToVessel(id) {
    if (pendingReagent === null) {
        pendingReagent = id;
        updateWaitingDisplay();
    } else {
        const first = pendingReagent;
        pendingReagent = null;
        updateWaitingDisplay();
        performReaction(first, id);
    }
}

function resetExperiment() {
    pendingReagent = null;
    updateWaitingDisplay();
    clearAnimations();
    resultArea.innerHTML = '<i class="fas fa-info-circle"></i> 实验已重置';
    resultArea.className = 'status warn';
    explainArea.innerHTML = '<i class="fas fa-brain"></i> 点击「AI讲解」获得解析';
}

function toggleTaskMode() {
    taskMode = !taskMode;
    document.getElementById('taskToggleText').textContent = taskMode ? '开启' : '关闭';
    updateTaskUI();
}

function nextTask() {
    currentTaskIdx = (currentTaskIdx + 1) % taskBank.length;
    currentTask = taskBank[currentTaskIdx];
    completedKeys.clear();
    updateTaskUI();
}

function aiExplain() {
    if (!lastReaction.type || lastReaction.type === '无明显反应') {
        explainArea.innerHTML = `<i class="fas fa-robot"></i> 尝试酸+碱（中和）、酸+碳酸盐（产气）、可溶盐组合（沉淀）或金属与盐（置换）。`;
        return;
    }
    let msg = `反应类型：${lastReaction.type}<br>现象：${lastReaction.phen}<br>方程式：${lastReaction.eq}`;
    explainArea.innerHTML = `<i class="fas fa-robot"></i> <strong>AI讲解：</strong><br>${msg}`;
}

function undoLastReaction() {
    if (reactionHistory.length === 0) {
        alert('没有可撤销的反应了');
        return;
    }
    const last = reactionHistory.pop();
    currentTemp = last.temp;
    currentPH = last.ph;
    liquidLevel = last.level;
    document.getElementById('logBody').innerHTML = last.logHTML;
    updateVesselStatus();
    resultArea.innerHTML = `<i class="fas fa-undo"></i> 已撤销上一步反应`;
}

function init() {
    renderPalette();
    buildRefTable();
    fillCurrentURL();
    updateTaskUI();
    updateVesselStatus();
    updateWaitingDisplay();

    // 绑定全局函数
    window.addReagentToVessel = addReagentToVessel;
    window.resetExperiment = resetExperiment;
    window.toggleTaskMode = toggleTaskMode;
    window.nextTask = nextTask;
    window.aiExplain = aiExplain;
    window.undoLastReaction = undoLastReaction;

    // 按钮事件
    document.getElementById('resetBtn').addEventListener('click', resetExperiment);
    document.getElementById('taskToggleBtn').addEventListener('click', toggleTaskMode);
    document.getElementById('nextTaskBtn').addEventListener('click', nextTask);
    document.getElementById('aiExplainBtn').addEventListener('click', aiExplain);
    document.getElementById('undoBtn').addEventListener('click', undoLastReaction);
    document.getElementById('clearLogBtn').addEventListener('click', clearTeacherLog);
    document.getElementById('exportLogBtn').addEventListener('click', exportLogCSV);
    document.getElementById('genQRBtn').addEventListener('click', genQR);
    document.getElementById('currentUrlBtn').addEventListener('click', fillCurrentURL);
    document.getElementById('copyLinkBtn').addEventListener('click', copyLink);
    document.getElementById('closeTutorial').addEventListener('click', () => {
        document.getElementById('tutorialModal').style.display = 'none';
    });

    // 拖拽支持
    const vessel = document.getElementById('reactionVessel');
    vessel.addEventListener('dragover', e => e.preventDefault());
    vessel.addEventListener('drop', e => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (data) addReagentToVessel(data);
    });

    // 首次显示教程
    if (!localStorage.getItem('chemTutorialShown')) {
        showTutorial();
        localStorage.setItem('chemTutorialShown', 'true');
    }
}

// 启动
init();