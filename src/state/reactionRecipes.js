// 试剂定义 - 高中化学常见物质
export const reagents = [
  // 酸类
  { id: "HCl", name: "盐酸", formula: "HCl", category: "acid", color: "#facc15" },
  { id: "H2SO4", name: "硫酸", formula: "H₂SO₄", category: "acid", color: "#f97316" },
  { id: "HNO3", name: "硝酸", formula: "HNO₃", category: "acid", color: "#fb923c" },
  { id: "CH3COOH", name: "醋酸", formula: "CH₃COOH", category: "acid", color: "#fbbf24" },
  { id: "H3PO4", name: "磷酸", formula: "H₃PO₄", category: "acid", color: "#f59e0b" },
  { id: "H2CO3", name: "碳酸", formula: "H₂CO₃", category: "acid", color: "#d97706" },
  
  // 碱类
  { id: "NaOH", name: "氢氧化钠", formula: "NaOH", category: "base", color: "#818cf8" },
  { id: "KOH", name: "氢氧化钾", formula: "KOH", category: "base", color: "#a78bfa" },
  { id: "Ca(OH)2", name: "氢氧化钙", formula: "Ca(OH)₂", category: "base", color: "#c4b5fd" },
  { id: "Ba(OH)2", name: "氢氧化钡", formula: "Ba(OH)₂", category: "base", color: "#ddd6fe" },
  { id: "NH3H2O", name: "氨水", formula: "NH₃·H₂O", category: "base", color: "#67e8f9" },
  { id: "Mg(OH)2", name: "氢氧化镁", formula: "Mg(OH)₂", category: "base", color: "#e0e7ff" },
  { id: "Al(OH)3", name: "氢氧化铝", formula: "Al(OH)₃", category: "base", color: "#dbeafe" },
  { id: "Fe(OH)3", name: "氢氧化铁", formula: "Fe(OH)₃", category: "base", color: "#fecaca" },
  { id: "Cu(OH)2", name: "氢氧化铜", formula: "Cu(OH)₂", category: "base", color: "#93c5fd" },
  
  // 盐类
  { id: "NaCl", name: "氯化钠", formula: "NaCl", category: "salt", color: "#fef9c3" },
  { id: "Na2CO3", name: "碳酸钠", formula: "Na₂CO₃", category: "salt", color: "#fde68a" },
  { id: "NaHCO3", name: "碳酸氢钠", formula: "NaHCO₃", category: "salt", color: "#fef08a" },
  { id: "CaCO3", name: "碳酸钙", formula: "CaCO₃", category: "salt", color: "#d9f99d" },
  { id: "BaCO3", name: "碳酸钡", formula: "BaCO₃", category: "salt", color: "#ecfccb" },
  { id: "AgNO3", name: "硝酸银", formula: "AgNO₃", category: "salt", color: "#e5e7eb" },
  { id: "BaCl2", name: "氯化钡", formula: "BaCl₂", category: "salt", color: "#bbf7d0" },
  { id: "CaCl2", name: "氯化钙", formula: "CaCl₂", category: "salt", color: "#a7f3d0" },
  { id: "CuSO4", name: "硫酸铜", formula: "CuSO₄", category: "salt", color: "#38bdf8" },
  { id: "FeSO4", name: "硫酸亚铁", formula: "FeSO₄", category: "salt", color: "#86efac" },
  { id: "Fe2(SO4)3", name: "硫酸铁", formula: "Fe₂(SO₄)₃", category: "salt", color: "#fca5a5" },
  { id: "FeCl3", name: "氯化铁", formula: "FeCl₃", category: "salt", color: "#fca5a5" },
  { id: "AlCl3", name: "氯化铝", formula: "AlCl₃", category: "salt", color: "#e0e7ff" },
  { id: "Na2SO4", name: "硫酸钠", formula: "Na₂SO₄", category: "salt", color: "#dbeafe" },
  { id: "KI", name: "碘化钾", formula: "KI", category: "salt", color: "#fef3c7" },
  { id: "KMnO4", name: "高锰酸钾", formula: "KMnO₄", category: "salt", color: "#c084fc" },
  { id: "NH4Cl", name: "氯化铵", formula: "NH₄Cl", category: "salt", color: "#fef9c3" },
  { id: "(NH4)2SO4", name: "硫酸铵", formula: "(NH₄)₂SO₄", category: "salt", color: "#fef08a" },
  { id: "Na2SiO3", name: "硅酸钠", formula: "Na₂SiO₃", category: "salt", color: "#d1fae5" },
  { id: "Na2S", name: "硫化钠", formula: "Na₂S", category: "salt", color: "#fef3c7" },
  { id: "KSCN", name: "硫氰化钾", formula: "KSCN", category: "salt", color: "#fce7f3" },
  
  // 金属单质
  { id: "Na", name: "钠", formula: "Na", category: "metal", color: "#e2e8f0" },
  { id: "Mg", name: "镁", formula: "Mg", category: "metal", color: "#e2e8f0" },
  { id: "Al", name: "铝", formula: "Al", category: "metal", color: "#d1d5db" },
  { id: "Fe", name: "铁", formula: "Fe", category: "metal", color: "#94a3b8" },
  { id: "Zn", name: "锌", formula: "Zn", category: "metal", color: "#cbd5e1" },
  { id: "Cu", name: "铜", formula: "Cu", category: "metal", color: "#f59e0b" },
  { id: "Ag", name: "银", formula: "Ag", category: "metal", color: "#e5e7eb" },
  
  // 非金属单质
  { id: "C", name: "碳", formula: "C", category: "nonmetal", color: "#1e293b" },
  { id: "S", name: "硫", formula: "S", category: "nonmetal", color: "#fbbf24" },
  { id: "Si", name: "硅", formula: "Si", category: "nonmetal", color: "#6b7280" },
  { id: "Cl2", name: "氯气", formula: "Cl₂", category: "nonmetal", color: "#4ade80" },
  
  // 氧化物
  { id: "CaO", name: "氧化钙", formula: "CaO", category: "oxide", color: "#f1f5f9" },
  { id: "Na2O", name: "氧化钠", formula: "Na₂O", category: "oxide", color: "#e2e8f0" },
  { id: "Na2O2", name: "过氧化钠", formula: "Na₂O₂", category: "oxide", color: "#fef08a" },
  { id: "MgO", name: "氧化镁", formula: "MgO", category: "oxide", color: "#f1f5f9" },
  { id: "Al2O3", name: "氧化铝", formula: "Al₂O₃", category: "oxide", color: "#e2e8f0" },
  { id: "Fe2O3", name: "氧化铁", formula: "Fe₂O₃", category: "oxide", color: "#b91c1c" },
  { id: "CuO", name: "氧化铜", formula: "CuO", category: "oxide", color: "#1e293b" },
  { id: "CO2", name: "二氧化碳", formula: "CO₂", category: "oxide", color: "#9ca3af" },
  { id: "SO2", name: "二氧化硫", formula: "SO₂", category: "oxide", color: "#d1d5db" },
  { id: "NO2", name: "二氧化氮", formula: "NO₂", category: "oxide", color: "#92400e" },
  { id: "SiO2", name: "二氧化硅", formula: "SiO₂", category: "oxide", color: "#f3f4f6" },
  { id: "H2O", name: "水", formula: "H₂O", category: "oxide", color: "#60a5fa" },
  { id: "H2O2", name: "过氧化氢", formula: "H₂O₂", category: "oxide", color: "#bfdbfe" },
  
  // 指示剂
  { id: "酚酞", name: "酚酞", formula: "C₂₀H₁₄O₄", category: "indicator", color: "#ec4899" },
  { id: "石蕊", name: "石蕊", formula: "Litmus", category: "indicator", color: "#7c3aed" },
  { id: "甲基橙", name: "甲基橙", formula: "C₁₄H₁₄N₃NaO₃S", category: "indicator", color: "#f97316" },
  { id: "品红", name: "品红", formula: "Fuchsin", category: "indicator", color: "#be185d" },
];

// 反应类型中文名称
const reactionTypeNames = {
  "Neutralization": "中和反应",
  "Gas Production": "产气反应",
  "Precipitation": "沉淀反应",
  "Displacement": "置换反应",
  "Oxide Reaction": "氧化物反应",
  "Single Displacement": "置换反应",
  "Double Decomposition": "复分解反应",
  "Redox": "氧化还原反应",
  "Decomposition": "分解反应",
  "Combination": "化合反应",
  "Complexation": "络合反应",
};

// 反应配方 - 高中化学常见反应
export const reactionRecipes = {
  // ==================== 酸碱中和反应 ====================
  "HCl+NaOH": {
    type: reactionTypeNames["Neutralization"],
    equation: "HCl + NaOH → NaCl + H₂O",
    color: "#f472b6",
    ph: 7,
    tempDelta: 15,
    effect: "heat",
    description: "强酸强碱中和，放热明显，溶液呈中性",
  },
  "H2SO4+NaOH": {
    type: reactionTypeNames["Neutralization"],
    equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
    color: "#fb7185",
    ph: 7,
    tempDelta: 18,
    effect: "heat",
    description: "硫酸与氢氧化钠中和，生成硫酸钠和水",
  },
  "H2SO4+Ca(OH)2": {
    type: reactionTypeNames["Neutralization"],
    equation: "H₂SO₄ + Ca(OH)₂ → CaSO₄↓ + 2H₂O",
    color: "#c4b5fd",
    ph: 7,
    tempDelta: 12,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "生成微溶的硫酸钙沉淀",
  },
  "HCl+KOH": {
    type: reactionTypeNames["Neutralization"],
    equation: "HCl + KOH → KCl + H₂O",
    color: "#e879f9",
    ph: 7,
    tempDelta: 14,
    effect: "heat",
    description: "盐酸与氢氧化钾中和反应",
  },
  "HNO3+NaOH": {
    type: reactionTypeNames["Neutralization"],
    equation: "HNO₃ + NaOH → NaNO₃ + H₂O",
    color: "#f9a8d4",
    ph: 7,
    tempDelta: 13,
    effect: "heat",
    description: "硝酸与氢氧化钠中和反应",
  },
  "CH3COOH+NaOH": {
    type: reactionTypeNames["Neutralization"],
    equation: "CH₃COOH + NaOH → CH₃COONa + H₂O",
    color: "#fbbf24",
    ph: 8,
    tempDelta: 8,
    effect: "heat",
    description: "弱酸强碱中和，放热较少，溶液呈碱性",
  },
  "HCl+NH3H2O": {
    type: reactionTypeNames["Neutralization"],
    equation: "HCl + NH₃·H₂O → NH₄Cl + H₂O",
    color: "#67e8f9",
    ph: 6,
    tempDelta: 10,
    effect: "heat",
    description: "强酸弱碱中和，溶液呈弱酸性",
  },
  "H2SO4+Ba(OH)2": {
    type: reactionTypeNames["Neutralization"],
    equation: "H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O",
    color: "#dbeafe",
    ph: 7,
    tempDelta: 16,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色硫酸钡沉淀",
  },

  // ==================== 产气反应 ====================
  "HCl+Na2CO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑",
    color: "#a5f3fc",
    ph: 4,
    tempDelta: -3,
    effect: "gas",
    description: "盐酸与碳酸钠反应，产生二氧化碳气体",
  },
  "HCl+NaHCO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "HCl + NaHCO₃ → NaCl + H₂O + CO₂↑",
    color: "#a5f3fc",
    ph: 5,
    tempDelta: -5,
    effect: "gas",
    description: "盐酸与碳酸氢钠反应，产生二氧化碳",
  },
  "H2SO4+Na2CO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "H₂SO₄ + Na₂CO₃ → Na₂SO₄ + H₂O + CO₂↑",
    color: "#67e8f9",
    ph: 3,
    tempDelta: 2,
    effect: "gas",
    description: "硫酸与碳酸钠反应，产生二氧化碳",
  },
  "HCl+CaCO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑",
    color: "#7dd3fc",
    ph: 4,
    tempDelta: 5,
    effect: "gas",
    description: "盐酸与碳酸钙反应，固体溶解并产生气泡",
  },
  "HCl+BaCO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "2HCl + BaCO₃ → BaCl₂ + H₂O + CO₂↑",
    color: "#93c5fd",
    ph: 4,
    tempDelta: 3,
    effect: "gas",
    description: "盐酸与碳酸钡反应，产生二氧化碳",
  },
  "HNO3+Na2CO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "2HNO₃ + Na₂CO₃ → 2NaNO₃ + H₂O + CO₂↑",
    color: "#a5f3fc",
    ph: 4,
    tempDelta: -2,
    effect: "gas",
    description: "硝酸与碳酸钠反应",
  },
  "H2SO4+NaHCO3": {
    type: reactionTypeNames["Gas Production"],
    equation: "H₂SO₄ + 2NaHCO₃ → Na₂SO₄ + 2H₂O + 2CO₂↑",
    color: "#7dd3fc",
    ph: 4,
    tempDelta: -4,
    effect: "gas",
    description: "硫酸与碳酸氢钠反应",
  },

  // ==================== 置换反应 ====================
  "HCl+Mg": {
    type: reactionTypeNames["Displacement"],
    equation: "2HCl + Mg → MgCl₂ + H₂↑",
    color: "#d8b4fe",
    ph: 3,
    tempDelta: 25,
    effect: "gas",
    description: "镁与盐酸反应剧烈，产生氢气并放出大量热",
  },
  "HCl+Zn": {
    type: reactionTypeNames["Displacement"],
    equation: "2HCl + Zn → ZnCl₂ + H₂↑",
    color: "#c4b5fd",
    ph: 3,
    tempDelta: 15,
    effect: "gas",
    description: "锌与盐酸反应产生氢气",
  },
  "HCl+Fe": {
    type: reactionTypeNames["Displacement"],
    equation: "2HCl + Fe → FeCl₂ + H₂↑",
    color: "#86efac",
    ph: 3,
    tempDelta: 12,
    effect: "gas",
    description: "铁与盐酸反应，溶液变为浅绿色",
  },
  "H2SO4+Zn": {
    type: reactionTypeNames["Displacement"],
    equation: "H₂SO₄ + Zn → ZnSO₄ + H₂↑",
    color: "#a78bfa",
    ph: 2,
    tempDelta: 20,
    effect: "gas",
    description: "锌与稀硫酸反应产生氢气",
  },
  "H2SO4+Fe": {
    type: reactionTypeNames["Displacement"],
    equation: "H₂SO₄ + Fe → FeSO₄ + H₂↑",
    color: "#86efac",
    ph: 3,
    tempDelta: 12,
    effect: "gas",
    description: "铁与稀硫酸反应，溶液变为浅绿色",
  },
  "H2SO4+Mg": {
    type: reactionTypeNames["Displacement"],
    equation: "H₂SO₄ + Mg → MgSO₄ + H₂↑",
    color: "#d8b4fe",
    ph: 2,
    tempDelta: 28,
    effect: "gas",
    description: "镁与稀硫酸剧烈反应",
  },
  "CuSO4+Fe": {
    type: reactionTypeNames["Displacement"],
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    color: "#4ade80",
    ph: 5,
    tempDelta: 3,
    effect: "precipitate",
    precipitateColor: "#f59e0b",
    description: "铁置换出铜，铁表面出现红色固体，溶液变绿",
  },
  "CuSO4+Zn": {
    type: reactionTypeNames["Displacement"],
    equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
    color: "#d1d5db",
    ph: 5,
    tempDelta: 5,
    effect: "precipitate",
    precipitateColor: "#f59e0b",
    description: "锌置换出铜，锌表面出现红色固体",
  },
  "AgNO3+Cu": {
    type: reactionTypeNames["Displacement"],
    equation: "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
    color: "#60a5fa",
    ph: 5,
    tempDelta: 8,
    effect: "precipitate",
    precipitateColor: "#e5e7eb",
    description: "铜置换出银，铜表面出现银白色固体",
  },
  "AgNO3+Fe": {
    type: reactionTypeNames["Displacement"],
    equation: "Fe + 2AgNO₃ → Fe(NO₃)₂ + 2Ag",
    color: "#86efac",
    ph: 5,
    tempDelta: 6,
    effect: "precipitate",
    precipitateColor: "#e5e7eb",
    description: "铁置换出银",
  },
  "HCl+Al": {
    type: reactionTypeNames["Displacement"],
    equation: "6HCl + 2Al → 2AlCl₃ + 3H₂↑",
    color: "#93c5fd",
    ph: 3,
    tempDelta: 30,
    effect: "gas",
    description: "铝与盐酸反应，产生氢气",
  },
  "H2SO4+Al": {
    type: reactionTypeNames["Displacement"],
    equation: "3H₂SO₄ + 2Al → Al₂(SO₄)₃ + 3H₂↑",
    color: "#93c5fd",
    ph: 2,
    tempDelta: 35,
    effect: "gas",
    description: "铝与稀硫酸反应剧烈",
  },
  "NaOH+Al": {
    type: reactionTypeNames["Displacement"],
    equation: "2NaOH + 2Al + 2H₂O → 2NaAlO₂ + 3H₂↑",
    color: "#dbeafe",
    ph: 12,
    tempDelta: 20,
    effect: "gas",
    description: "铝与氢氧化钠溶液反应（铝的两性）",
  },

  // ==================== 沉淀反应 ====================
  "AgNO3+NaCl": {
    type: reactionTypeNames["Precipitation"],
    equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
    color: "#e5e7eb",
    ph: 5,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色氯化银沉淀，不溶于硝酸",
  },
  "BaCl2+Na2SO4": {
    type: reactionTypeNames["Precipitation"],
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl",
    color: "#f1f5f9",
    ph: 7,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色硫酸钡沉淀，不溶于酸",
  },
  "CaCl2+Na2CO3": {
    type: reactionTypeNames["Precipitation"],
    equation: "CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl",
    color: "#fefce8",
    ph: 8,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "生成白色碳酸钙沉淀",
  },
  "BaCl2+Na2CO3": {
    type: reactionTypeNames["Precipitation"],
    equation: "BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl",
    color: "#ecfccb",
    ph: 8,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "生成白色碳酸钡沉淀",
  },
  "CuSO4+NaOH": {
    type: reactionTypeNames["Precipitation"],
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    color: "#38bdf8",
    ph: 10,
    tempDelta: 2,
    effect: "precipitate",
    precipitateColor: "#0ea5e9",
    description: "生成蓝色氢氧化铜沉淀",
  },
  "FeCl3+NaOH": {
    type: reactionTypeNames["Precipitation"],
    equation: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
    color: "#fca5a5",
    ph: 11,
    tempDelta: 3,
    effect: "precipitate",
    precipitateColor: "#b45309",
    description: "生成红褐色氢氧化铁沉淀",
  },
  "FeSO4+NaOH": {
    type: reactionTypeNames["Precipitation"],
    equation: "FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄",
    color: "#86efac",
    ph: 10,
    tempDelta: 2,
    effect: "precipitate",
    precipitateColor: "#d1fae5",
    description: "生成白色氢氧化亚铁沉淀，迅速变灰绿色最终氧化为红褐色",
    colorSequence: [
      { color: "#f0fdf4", duration: 0, label: "白色絮状沉淀" },
      { color: "#bbf7d0", duration: 500, label: "开始变灰绿" },
      { color: "#86efac", duration: 1000, label: "灰绿色" },
      { color: "#fca5a5", duration: 2000, label: "氧化为红褐色" },
      { color: "#fecaca", duration: 3000, label: "最终红褐色 Fe(OH)₃" },
    ],
  },
  "AlCl3+NaOH": {
    type: reactionTypeNames["Precipitation"],
    equation: "AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl",
    color: "#dbeafe",
    ph: 9,
    tempDelta: 1,
    effect: "precipitate",
    precipitateColor: "#f1f5f9",
    description: "生成白色氢氧化铝沉淀（适量碱）",
  },
  "AlCl3+NH3H2O": {
    type: reactionTypeNames["Precipitation"],
    equation: "AlCl₃ + 3NH₃·H₂O → Al(OH)₃↓ + 3NH₄Cl",
    color: "#dbeafe",
    ph: 8,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f1f5f9",
    description: "铝盐与氨水反应生成氢氧化铝沉淀",
  },
  "AgNO3+HCl": {
    type: reactionTypeNames["Precipitation"],
    equation: "AgNO₃ + HCl → AgCl↓ + HNO₃",
    color: "#e5e7eb",
    ph: 1,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "检验氯离子：生成白色沉淀",
  },
  "BaCl2+H2SO4": {
    type: reactionTypeNames["Precipitation"],
    equation: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl",
    color: "#f1f5f9",
    ph: 1,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "检验硫酸根离子：生成白色沉淀",
  },
  "FeCl3+KSCN": {
    type: reactionTypeNames["Complexation"],
    equation: "FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl",
    color: "#ef4444",
    ph: 5,
    tempDelta: 0,
    effect: "colorChange",
    precipitateColor: "#dc2626",
    description: "铁离子与硫氰酸根络合，溶液变为血红色（特征显色反应）",
  },
  "Na2SiO3+HCl": {
    type: reactionTypeNames["Precipitation"],
    equation: "Na₂SiO₃ + 2HCl → 2NaCl + H₂SiO₃↓",
    color: "#d1fae5",
    ph: 2,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f1f5f9",
    description: "生成白色硅酸沉淀（凝胶状）",
  },

  // ==================== 氧化物反应 ====================
  "CuO+HCl": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "CuO + 2HCl → CuCl₂ + H₂O",
    color: "#22d3ee",
    ph: 3,
    tempDelta: 10,
    effect: "heat",
    description: "黑色氧化铜溶解，溶液变为蓝绿色",
  },
  "CuO+H2SO4": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "CuO + H₂SO₄ → CuSO₄ + H₂O",
    color: "#38bdf8",
    ph: 3,
    tempDelta: 12,
    effect: "heat",
    description: "黑色氧化铜溶解，溶液变为蓝色",
  },
  "Fe2O3+HCl": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O",
    color: "#fbbf24",
    ph: 2,
    tempDelta: 8,
    effect: "heat",
    description: "铁锈溶解，溶液变为黄色",
  },
  "Fe2O3+H2SO4": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "Fe₂O₃ + 3H₂SO₄ → Fe₂(SO₄)₃ + 3H₂O",
    color: "#fca5a5",
    ph: 2,
    tempDelta: 10,
    effect: "heat",
    description: "氧化铁与硫酸反应",
  },
  "Al2O3+HCl": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O",
    color: "#dbeafe",
    ph: 3,
    tempDelta: 8,
    effect: "heat",
    description: "氧化铝溶于盐酸（两性氧化物）",
  },
  "Al2O3+NaOH": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O",
    color: "#dbeafe",
    ph: 12,
    tempDelta: 5,
    effect: "heat",
    description: "氧化铝溶于氢氧化钠（两性氧化物）",
  },
  "CaO+H2O": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "CaO + H₂O → Ca(OH)₂",
    color: "#fef9c3",
    ph: 12,
    tempDelta: 65,
    effect: "heat",
    description: "生石灰遇水剧烈放热，生成熟石灰",
  },
  "Na2O+H2O": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "Na₂O + H₂O → 2NaOH",
    color: "#e2e8f0",
    ph: 14,
    tempDelta: 55,
    effect: "heat",
    description: "氧化钠与水反应生成氢氧化钠",
  },
  "Na2O2+H2O": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "2Na₂O₂ + 2H₂O → 4NaOH + O₂↑",
    color: "#fef08a",
    ph: 14,
    tempDelta: 45,
    effect: "gas",
    description: "过氧化钠与水反应，产生氧气并放热",
  },
  "CO2+NaOH": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "CO₂ + 2NaOH → Na₂CO₃ + H₂O",
    color: "#d1d5db",
    ph: 11,
    tempDelta: 5,
    effect: "heat",
    description: "二氧化碳与氢氧化钠反应",
  },
  "CO2+Ca(OH)2": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O",
    color: "#f5f5f4",
    ph: 8,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "检验二氧化碳：石灰水变浑浊",
  },
  "SO2+NaOH": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "SO₂ + 2NaOH → Na₂SO₃ + H₂O",
    color: "#d1d5db",
    ph: 10,
    tempDelta: 8,
    effect: "heat",
    description: "二氧化硫与氢氧化钠反应",
  },
  "NO2+H2O": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "3NO₂ + H₂O → 2HNO₃ + NO",
    color: "#92400e",
    ph: 1,
    tempDelta: 5,
    effect: "gas",
    description: "二氧化氮溶于水生成硝酸和一氧化氮",
  },
  "SiO2+NaOH": {
    type: reactionTypeNames["Oxide Reaction"],
    equation: "SiO₂ + 2NaOH → Na₂SiO₃ + H₂O",
    color: "#f3f4f6",
    ph: 12,
    tempDelta: 3,
    effect: "heat",
    description: "二氧化硅与氢氧化钠反应（玻璃瓶不能盛放碱液）",
  },

  // ==================== 分解反应 ====================
  "H2O2": {
    type: reactionTypeNames["Decomposition"],
    equation: "2H₂O₂ →(MnO₂) 2H₂O + O₂↑",
    color: "#bfdbfe",
    ph: 7,
    tempDelta: -5,
    effect: "gas",
    description: "过氧化氢分解（二氧化锰催化），产生氧气",
  },
  "CaCO3+heat": {
    type: reactionTypeNames["Decomposition"],
    equation: "CaCO₃ →(高温) CaO + CO₂↑",
    color: "#d9f99d",
    ph: 7,
    tempDelta: 80,
    effect: "gas",
    description: "石灰石高温分解（工业制生石灰）",
  },
  "NaHCO3+heat": {
    type: reactionTypeNames["Decomposition"],
    equation: "2NaHCO₃ →(加热) Na₂CO₃ + H₂O + CO₂↑",
    color: "#fef08a",
    ph: 9,
    tempDelta: 30,
    effect: "gas",
    description: "碳酸氢钠受热分解",
  },
  "NH4Cl+NaOH": {
    type: reactionTypeNames["Gas Production"],
    equation: "NH₄Cl + NaOH →(加热) NaCl + H₂O + NH₃↑",
    color: "#67e8f9",
    ph: 12,
    tempDelta: 15,
    effect: "gas",
    description: "铵盐与碱加热产生氨气（检验铵根离子）",
  },
  "(NH4)2SO4+NaOH": {
    type: reactionTypeNames["Gas Production"],
    equation: "(NH₄)₂SO₄ + 2NaOH →(加热) Na₂SO₄ + 2H₂O + 2NH₃↑",
    color: "#67e8f9",
    ph: 12,
    tempDelta: 18,
    effect: "gas",
    description: "硫酸铵与碱加热产生氨气",
  },

  // ==================== 氧化还原反应 ====================
  "C+CuO": {
    type: reactionTypeNames["Redox"],
    equation: "C + 2CuO →(高温) 2Cu + CO₂↑",
    color: "#f59e0b",
    ph: 7,
    tempDelta: 85,
    effect: "smoke",
    description: "碳还原氧化铜，黑色固体变红色",
  },
  "CO+CuO": {
    type: reactionTypeNames["Redox"],
    equation: "CO + CuO →(加热) Cu + CO₂",
    color: "#f59e0b",
    ph: 7,
    tempDelta: 40,
    effect: "heat",
    description: "一氧化碳还原氧化铜",
  },
  "H2+CuO": {
    type: reactionTypeNames["Redox"],
    equation: "H₂ + CuO →(加热) Cu + H₂O",
    color: "#60a5fa",
    ph: 7,
    tempDelta: 35,
    effect: "heat",
    description: "氢气还原氧化铜，黑色固体变红色",
  },
  "Fe2O3+CO": {
    type: reactionTypeNames["Redox"],
    equation: "Fe₂O₃ + 3CO →(高温) 2Fe + 3CO₂",
    color: "#b91c1c",
    ph: 7,
    tempDelta: 75,
    effect: "heat",
    description: "高炉炼铁：一氧化碳还原氧化铁",
  },
  "Fe2O3+C": {
    type: reactionTypeNames["Redox"],
    equation: "2Fe₂O₃ + 3C →(高温) 4Fe + 3CO₂↑",
    color: "#b91c1c",
    ph: 7,
    tempDelta: 90,
    effect: "smoke",
    description: "碳还原氧化铁",
  },
  "Fe+CuSO4_redox": {
    type: reactionTypeNames["Redox"],
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    color: "#4ade80",
    ph: 5,
    tempDelta: 3,
    effect: "precipitate",
    precipitateColor: "#f59e0b",
    description: "湿法炼铜：铁置换出铜",
  },

  // ==================== 钠与水/酸反应 ====================
  "Na+H2O": {
    type: reactionTypeNames["Single Displacement"],
    equation: "2Na + 2H₂O → 2NaOH + H₂↑",
    color: "#e2e8f0",
    ph: 13,
    tempDelta: 80,
    effect: "smoke",
    description: "钠与水剧烈反应，浮于水面，可能引燃氢气",
  },
  "Na+HCl": {
    type: reactionTypeNames["Single Displacement"],
    equation: "2Na + 2HCl → 2NaCl + H₂↑",
    color: "#fef08a",
    ph: 7,
    tempDelta: 85,
    effect: "smoke",
    description: "钠与盐酸剧烈反应，非常危险",
  },
  "Mg+H2O": {
    type: reactionTypeNames["Single Displacement"],
    equation: "Mg + 2H₂O →(加热) Mg(OH)₂ + H₂↑",
    color: "#f1f5f9",
    ph: 10,
    tempDelta: 30,
    effect: "gas",
    description: "镁与热水反应产生氢气",
  },

  // ==================== 其他重要反应 ====================
  "Cl2+NaOH": {
    type: reactionTypeNames["Redox"],
    equation: "Cl₂ + 2NaOH → NaCl + NaClO + H₂O",
    color: "#4ade80",
    ph: 12,
    tempDelta: 10,
    effect: "heat",
    description: "氯气与氢氧化钠反应（制备漂白液）",
  },
  "Cl2+Fe": {
    type: reactionTypeNames["Redox"],
    equation: "2Fe + 3Cl₂ →(点燃) 2FeCl₃",
    color: "#fca5a5",
    ph: 7,
    tempDelta: 60,
    effect: "smoke",
    description: "铁在氯气中燃烧，产生棕褐色烟",
  },
  "Cl2+Cu": {
    type: reactionTypeNames["Redox"],
    equation: "Cu + Cl₂ →(点燃) CuCl₂",
    color: "#38bdf8",
    ph: 7,
    tempDelta: 50,
    effect: "smoke",
    description: "铜在氯气中燃烧，产生棕黄色烟",
  },
  "S+Fe": {
    type: reactionTypeNames["Combination"],
    equation: "Fe + S →(加热) FeS",
    color: "#94a3b8",
    ph: 7,
    tempDelta: 45,
    effect: "heat",
    description: "铁粉与硫粉混合加热，剧烈反应",
  },
  "S+Cu": {
    type: reactionTypeNames["Combination"],
    equation: "2Cu + S →(加热) Cu₂S",
    color: "#f59e0b",
    ph: 7,
    tempDelta: 30,
    effect: "heat",
    description: "铜与硫反应生成硫化亚铜",
  },
  "Na+Cl2": {
    type: reactionTypeNames["Combination"],
    equation: "2Na + Cl₂ →(点燃) 2NaCl",
    color: "#fef9c3",
    ph: 7,
    tempDelta: 70,
    effect: "smoke",
    description: "钠在氯气中燃烧，产生白烟",
  },
  "H2+Cl2": {
    type: reactionTypeNames["Combination"],
    equation: "H₂ + Cl₂ →(光照) 2HCl",
    color: "#4ade80",
    ph: 1,
    tempDelta: 55,
    effect: "smoke",
    description: "氢气与氯气光照爆炸",
  },
  "N2+O2": {
    type: reactionTypeNames["Combination"],
    equation: "N₂ + O₂ →(放电) 2NO",
    color: "#9ca3af",
    ph: 7,
    tempDelta: 100,
    effect: "heat",
    description: "氮气与氧气在放电条件下反应",
  },
  "SO3+H2O": {
    type: reactionTypeNames["Combination"],
    equation: "SO₃ + H₂O → H₂SO₄",
    color: "#f97316",
    ph: 1,
    tempDelta: 40,
    effect: "heat",
    description: "三氧化硫溶于水生成硫酸",
  },

  // ==================== 三元反应 ====================
  "HCl+NaOH+酚酞": {
    type: reactionTypeNames["Neutralization"],
    equation: "HCl + NaOH → NaCl + H₂O（酚酞指示剂）",
    color: "#f472b6",
    ph: 7,
    tempDelta: 15,
    effect: "colorChange",
    description: "酸碱中和滴定，酚酞由红色变为无色",
    reactants: ["HCl", "NaOH", "酚酞"],
  },
  "Fe+CuSO4+AgNO3": {
    type: reactionTypeNames["Displacement"],
    equation: "Fe + CuSO₄ → FeSO₄ + Cu; Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
    color: "#e5e7eb",
    ph: 5,
    tempDelta: 8,
    effect: "precipitate",
    precipitateColor: "#e5e7eb",
    description: "铁先置换铜，铜再置换银（活动性顺序验证）",
    reactants: ["Fe", "CuSO4", "AgNO3"],
  },
  "NaOH+CuSO4+酒石酸钾钠": {
    type: reactionTypeNames["Complexation"],
    equation: "Cu²⁺ + 2OH⁻ + 酒石酸钾钠 → 络合物",
    color: "#a78bfa",
    ph: 12,
    tempDelta: 5,
    effect: "colorChange",
    description: "斐林试剂反应，生成深蓝色络合物",
    reactants: ["NaOH", "CuSO4", "酒石酸钾钠"],
  },
};

// 预处理：生成反应物集合索引（用于无序子集匹配）
const reactionIndex = new Map();

Object.entries(reactionRecipes).forEach(([key, recipe]) => {
  // 解析反应物
  let reactants;
  if (recipe.reactants) {
    reactants = recipe.reactants;
  } else {
    reactants = key.split("+");
  }

  // 生成排序后的键（用于快速查找）
  const sortedKey = [...reactants].sort().join("+");
  reactionIndex.set(sortedKey, { key, recipe, reactants });
});

// 生成反应物集合的排序键
function getSortedKey(reactants) {
  return [...reactants].sort().join("+");
}

// 无序子集匹配算法
// 检查 existing + incoming 是否能匹配任何反应
export function findReaction(existing, incoming) {
  const allReactants = [...existing, incoming];
  const sortedKey = getSortedKey(allReactants);

  // 精确匹配：所有反应物完全匹配
  const exactMatch = reactionIndex.get(sortedKey);
  if (exactMatch) {
    return { key: exactMatch.key, ...exactMatch.recipe };
  }

  // 子集匹配：检查是否有反应是当前试剂的子集
  // 这允许用户分批添加试剂，只要最终包含所有反应物即可触发反应
  for (const [indexKey, { key, recipe, reactants }] of reactionIndex) {
    // 检查 reactants 是否是 allReactants 的子集
    const isSubset = reactants.every((r) => allReactants.includes(r));
    if (isSubset && reactants.length === allReactants.length) {
      return { key, ...recipe };
    }
  }

  // 向前兼容：尝试旧的二元匹配方式
  for (const reagent of existing) {
    const key1 = `${reagent}+${incoming}`;
    const key2 = `${incoming}+${reagent}`;
    if (reactionRecipes[key1]) return { key: key1, ...reactionRecipes[key1] };
    if (reactionRecipes[key2]) return { key: key2, ...reactionRecipes[key2] };
  }

  // 单物质反应（分解反应等）
  if (reactionRecipes[incoming]) {
    return { key: incoming, ...reactionRecipes[incoming] };
  }

  return null;
}

// 保留旧的 getReactionKey 函数以兼容其他代码
export function getReactionKey(a, b) {
  const key1 = `${a}+${b}`;
  const key2 = `${b}+${a}`;
  if (reactionRecipes[key1]) return key1;
  if (reactionRecipes[key2]) return key2;
  if (reactionRecipes[a]) return a;
  if (reactionRecipes[b]) return b;
  return null;
}

// 分类颜色（亮色主题）
export const categoryColors = {
  acid: "from-amber-100 to-orange-50",
  base: "from-indigo-100 to-violet-50",
  salt: "from-emerald-100 to-teal-50",
  metal: "from-slate-100 to-gray-50",
  nonmetal: "from-yellow-100 to-amber-50",
  oxide: "from-red-100 to-rose-50",
  indicator: "from-pink-100 to-fuchsia-50",
};

// 分类中文名称
export const categoryLabels = {
  acid: "酸",
  base: "碱",
  salt: "盐",
  metal: "金属",
  nonmetal: "非金属",
  oxide: "氧化物",
  indicator: "指示剂",
};
