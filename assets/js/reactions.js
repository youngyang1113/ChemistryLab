// 反应库 - 包含所有试剂和反应数据

const reagents = [
    {id:'HCl', name:'盐酸 HCl', icon:'fa-flask'},{id:'H2SO4', name:'硫酸 H₂SO₄', icon:'fa-flask'},{id:'HNO3', name:'硝酸 HNO₃', icon:'fa-flask'},
    {id:'NaOH', name:'氢氧化钠 NaOH', icon:'fa-droplet'},{id:'KOH', name:'氢氧化钾 KOH', icon:'fa-droplet'},{id:'Ca(OH)2', name:'氢氧化钙 Ca(OH)₂', icon:'fa-droplet'},
    {id:'NH3H2O', name:'氨水 NH₃·H₂O', icon:'fa-water'},{id:'Na2CO3', name:'碳酸钠 Na₂CO₃', icon:'fa-cube'},{id:'NaHCO3', name:'碳酸氢钠 NaHCO₃', icon:'fa-cube'},
    {id:'CaCO3', name:'碳酸钙 CaCO₃', icon:'fa-mountain'},{id:'AgNO3', name:'硝酸银 AgNO₃', icon:'fa-gem'},{id:'BaCl2', name:'氯化钡 BaCl₂', icon:'fa-cubes'},
    {id:'CaCl2', name:'氯化钙 CaCl₂', icon:'fa-cubes'},{id:'NaCl', name:'氯化钠 NaCl', icon:'fa-cube'},{id:'Na2SO4', name:'硫酸钠 Na₂SO₄', icon:'fa-cube'},
    {id:'CuSO4', name:'硫酸铜 CuSO₄', icon:'fa-water'},{id:'FeSO4', name:'硫酸亚铁 FeSO₄', icon:'fa-leaf'},{id:'FeCl3', name:'氯化铁 FeCl₃', icon:'fa-biohazard'},
    {id:'Al2SO4_3', name:'硫酸铝 Al₂(SO₄)₃', icon:'fa-cube'},{id:'PbNO3_2', name:'硝酸铅 Pb(NO₃)₂', icon:'fa-weight-hanging'},{id:'KI', name:'碘化钾 KI', icon:'fa-cube'},
    {id:'Fe', name:'铁 Fe', icon:'fa-cog'},{id:'Zn', name:'锌 Zn', icon:'fa-cog'},{id:'Mg', name:'镁 Mg', icon:'fa-cog'},{id:'Al', name:'铝 Al', icon:'fa-cog'},
    {id:'Cu', name:'铜 Cu', icon:'fa-coins'},{id:'CuO', name:'氧化铜 CuO', icon:'fa-fire'},{id:'Fe2O3', name:'氧化铁 Fe₂O₃', icon:'fa-fire'},
    {id:'ZnO', name:'氧化锌 ZnO', icon:'fa-fire'},{id:'MgO', name:'氧化镁 MgO', icon:'fa-fire'}
];

// 反应库：包含类型、现象、方程式、动画类型、是否发热、溶液颜色变化
const reactions = [
    {a:'HCl', b:'NaOH', type:'中和反应', phen:'放热，酸碱中和', eq:'HCl + NaOH → NaCl + H₂O', anim:'bubble', heat: true, colorTint:'linear-gradient(#ff9a9e, #fad0c4)'},
    {a:'H2SO4', b:'NaOH', type:'中和反应', phen:'放热，生成盐', eq:'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', anim:'bubble', heat: true, colorTint:'linear-gradient(#ff9a9e, #fad0c4)'},
    {a:'H2SO4', b:'Ca(OH)2', type:'中和反应', phen:'生成CaSO₄微溶', eq:'H₂SO₄ + Ca(OH)₂ → CaSO₄↓ + 2H₂O', anim:'precipitate', heat: true, colorTint:'linear-gradient(#e0c3fc, #8ec5fc)'},
    {a:'HCl', b:'Na2CO3', type:'产气反应', phen:'剧烈气泡，CO₂', eq:'2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑', anim:'bubble', heat: false, colorTint:'linear-gradient(#a1c4fd, #c2e9fb)'},
    {a:'HCl', b:'NaHCO3', type:'产气反应', phen:'大量气泡', eq:'HCl + NaHCO₃ → NaCl + H₂O + CO₂↑', anim:'bubble', heat: false, colorTint:'linear-gradient(#a1c4fd, #c2e9fb)'},
    {a:'H2SO4', b:'Na2CO3', type:'产气反应', phen:'产生气泡', eq:'H₂SO₄ + Na₂CO₃ → Na₂SO₄ + H₂O + CO₂↑', anim:'bubble', heat: false, colorTint:'linear-gradient(#a1c4fd, #c2e9fb)'},
    {a:'HCl', b:'CaCO3', type:'产气反应', phen:'冒泡，固体溶解', eq:'2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑', anim:'bubble', heat: false, colorTint:'linear-gradient(#a1c4fd, #c2e9fb)'},
    {a:'HCl', b:'Mg', type:'置换反应', phen:'产生H₂，镁溶解', eq:'2HCl + Mg → MgCl₂ + H₂↑', anim:'bubble', heat: true, colorTint:'linear-gradient(#fbc2eb, #a6c1ee)'},
    {a:'HCl', b:'Zn', type:'置换反应', phen:'产生氢气，锌溶解', eq:'2HCl + Zn → ZnCl₂ + H₂↑', anim:'bubble', heat: true, colorTint:'linear-gradient(#fbc2eb, #a6c1ee)'},
    {a:'CuSO4', b:'Fe', type:'置换反应', phen:'铁表面析出红色铜', eq:'Fe + CuSO₄ → FeSO₄ + Cu', anim:'metal', heat: false, colorTint:'linear-gradient(#f6d365, #fda085)'},
    {a:'AgNO3', b:'NaCl', type:'沉淀反应', phen:'白色沉淀AgCl', eq:'AgNO₃ + NaCl → AgCl↓ + NaNO₃', anim:'precipitate', heat: false, colorTint:'linear-gradient(#d4fcff, #d4f1f9)'},
    {a:'BaCl2', b:'Na2SO4', type:'沉淀反应', phen:'白色沉淀BaSO₄', eq:'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl', anim:'precipitate', heat: false, colorTint:'linear-gradient(#d4fcff, #d4f1f9)'},
    {a:'CaCl2', b:'Na2CO3', type:'沉淀反应', phen:'白色CaCO₃沉淀', eq:'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl', anim:'precipitate', heat: false, colorTint:'linear-gradient(#d4fcff, #d4f1f9)'},
    {a:'PbNO3_2', b:'KI', type:'沉淀反应', phen:'黄色PbI₂沉淀', eq:'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', anim:'precipitate', heat: false, colorTint:'linear-gradient(#fdfbfb, #ebedee)'},
    {a:'CuSO4', b:'NaOH', type:'沉淀反应', phen:'蓝色Cu(OH)₂沉淀', eq:'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄', anim:'precipitate', heat: false, colorTint:'linear-gradient(#a1c4fd, #c2e9fb)'},
    {a:'FeCl3', b:'NaOH', type:'沉淀反应', phen:'红褐色Fe(OH)₃沉淀', eq:'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl', anim:'precipitate', heat: false, colorTint:'linear-gradient(#fbc2eb, #a6c1ee)'},
    {a:'CuO', b:'HCl', type:'酸碱反应', phen:'黑色固体溶解，蓝绿', eq:'CuO + 2HCl → CuCl₂ + H₂O', anim:'bubble', heat: true, colorTint:'linear-gradient(#43e97b, #38f9d7)'}
];

const taskBank = [
    {name:'🧪 沉淀反应专家', type:'沉淀反应', hint:'生成不溶物 (AgCl, BaSO₄, Cu(OH)₂等)'},
    {name:'💨 产气反应大师', type:'产气反应', hint:'酸与碳酸盐产生CO₂气泡'},
    {name:'⚡ 置换反应猎人', type:'置换反应', hint:'金属置换或金属与酸出氢气'},
    {name:'🌡️ 中和反应先锋', type:'中和反应', hint:'酸+碱 → 盐+水，放热'}
];

// 辅助函数
function getReagentName(id) {
    let r = reagents.find(x => x.id === id);
    return r ? r.name : id;
}
function getIconClass(id) {
    let r = reagents.find(x => x.id === id);
    return r ? r.icon : 'fa-flask';
}

// 获取与某试剂可能发生反应的试剂列表（用于智能提示）
function getSuggestionsForReagent(id) {
    const suggestions = new Set();
    reactions.forEach(r => {
        if (r.a === id) suggestions.add(r.b);
        if (r.b === id) suggestions.add(r.a);
    });
    return Array.from(suggestions).map(sid => getReagentName(sid));
}