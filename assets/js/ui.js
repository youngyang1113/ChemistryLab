// ui.js - UI控制与辅助功能

function renderPalette() {
    const container = document.getElementById('reagentPalette');
    if (!container) return;
    container.innerHTML = '';
    reagents.forEach(r => {
        let div = document.createElement('div');
        div.className = 'chem-badge';
        div.setAttribute('data-id', r.id);
        div.draggable = true;
        div.innerHTML = `<i class="fas ${r.icon}"></i><span>${r.name}</span>`;
        div.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', r.id));
        div.addEventListener('click', () => window.addReagentToVessel(r.id));
        container.appendChild(div);
    });
}

function addLogRow(a, b, type, phen, eq) {
    const tbody = document.getElementById('logBody');
    if (!tbody) return;
    const idx = tbody.children.length + 1;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${idx}</td>
        <td>${getReagentName(a)} + ${getReagentName(b)}</td>
        <td>${type}</td>
        <td>${phen}</td>
        <td style="font-size:0.7rem;">${eq}</td>
    `;
    tbody.prepend(row);
}

function updateTaskUI() {
    const taskMode = window.taskMode || false;
    const currentTask = window.currentTask;
    const completedKeys = window.completedKeys || new Set();
    const taskText = document.getElementById('taskText');
    const taskHint = document.getElementById('taskHint');
    const taskProgress = document.getElementById('taskProgress');

    if (!taskText) return;
    if (!taskMode) {
        taskText.innerText = '✨ 自由探索模式';
        taskHint.innerText = '任意组合自动记录';
        taskProgress.style.width = '0%';
        return;
    }
    if (currentTask) {
        taskText.innerHTML = `<i class="fas fa-bullseye"></i> ${currentTask.name}`;
        taskHint.innerText = currentTask.hint;
        let total = reactions.filter(r => r.type === currentTask.type).length;
        let done = Array.from(completedKeys).filter(k => k.includes(currentTask.type)).length;
        let percent = total ? Math.min(100, Math.round(done / total * 100)) : 0;
        taskProgress.style.width = percent + '%';
    }
}

function buildRefTable() {
    const tbody = document.getElementById('refTableBody');
    if (!tbody) return;
    const data = [
        ['🧪 中和反应', '酸 + 碱', '放热', 'HCl + NaOH → NaCl + H₂O'],
        ['💨 产气反应', '酸 + 碳酸盐', '大量气泡', '2HCl + Na₂CO₃ → CO₂↑'],
        ['🧂 沉淀反应', '可溶盐 + 可溶盐', '底部生成沉淀', 'AgNO₃ + NaCl → AgCl↓'],
        ['⚙️ 置换反应', '金属 + 盐/酸', '金属析出或气体', 'Fe + CuSO₄ → Cu'],
        ['🔥 氧化还原/分解', 'H₂O₂ + MnO₂', '剧烈气泡', '2H₂O₂ → O₂↑']
    ];
    tbody.innerHTML = data.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
}

function genQR() {
    const input = document.getElementById('qrInput');
    const img = document.getElementById('qrImg');
    let url = input.value.trim();
    if (url) {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}`;
    } else {
        alert('请输入课堂链接地址');
    }
}

function fillCurrentURL() {
    document.getElementById('qrInput').value = location.href;
    genQR();
}

async function copyLink() {
    const val = document.getElementById('qrInput').value || location.href;
    try {
        await navigator.clipboard.writeText(val);
        alert('链接已复制到剪贴板');
    } catch(e) {
        alert('复制失败，请手动复制');
    }
}

function showTutorial() {
    const modal = document.getElementById('tutorialModal');
    if (modal) modal.style.display = 'flex';
}

function exportLogCSV() {
    const tbody = document.getElementById('logBody');
    if (!tbody || tbody.children.length === 0) {
        alert('暂无记录可导出');
        return;
    }
    let csv = '序号,反应物,类型,现象,方程式\n';
    Array.from(tbody.children).reverse().forEach(row => {
        const cells = Array.from(row.cells).map(cell => `"${cell.textContent.trim()}"`);
        csv += cells.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chemistry-lab-log-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
}

function clearTeacherLog() {
    if (confirm('确定要清空所有实验记录吗？')) {
        document.getElementById('logBody').innerHTML = '';
    }
}