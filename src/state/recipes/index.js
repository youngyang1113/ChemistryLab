// 反应配方统一导出
// 按反应类型拆分，便于维护

import { REACTION_TYPES } from "../../constants/labConfig";

// 试剂定义
export { reagents } from "./reagents";

// ==================== 酸碱中和反应 ====================
const acidBaseRecipes = {
  "HCl+NaOH": {
    type: REACTION_TYPES.Neutralization,
    equation: "HCl + NaOH → NaCl + H₂O",
    color: "#f472b6",
    ph: 7,
    tempDelta: 15,
    effect: "heat",
    description: "强酸强碱中和，放热明显，溶液呈中性",
  },
  "H2SO4+NaOH": {
    type: REACTION_TYPES.Neutralization,
    equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
    color: "#fb7185",
    ph: 7,
    tempDelta: 18,
    effect: "heat",
    description: "硫酸与氢氧化钠中和",
  },
  "HCl+KOH": {
    type: REACTION_TYPES.Neutralization,
    equation: "HCl + KOH → KCl + H₂O",
    color: "#e879f9",
    ph: 7,
    tempDelta: 14,
    effect: "heat",
    description: "盐酸与氢氧化钾中和",
  },
  "HNO3+NaOH": {
    type: REACTION_TYPES.Neutralization,
    equation: "HNO₃ + NaOH → NaNO₃ + H₂O",
    color: "#f9a8d4",
    ph: 7,
    tempDelta: 13,
    effect: "heat",
    description: "硝酸与氢氧化钠中和",
  },
  "CH3COOH+NaOH": {
    type: REACTION_TYPES.Neutralization,
    equation: "CH₃COOH + NaOH → CH₃COONa + H₂O",
    color: "#fbbf24",
    ph: 8,
    tempDelta: 8,
    effect: "heat",
    description: "弱酸强碱中和，溶液呈碱性",
  },
  "HCl+NH3H2O": {
    type: REACTION_TYPES.Neutralization,
    equation: "HCl + NH₃·H₂O → NH₄Cl + H₂O",
    color: "#67e8f9",
    ph: 6,
    tempDelta: 10,
    effect: "heat",
    description: "强酸弱碱中和",
  },
  "H2SO4+Ba(OH)2": {
    type: REACTION_TYPES.Neutralization,
    equation: "H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O",
    color: "#dbeafe",
    ph: 7,
    tempDelta: 16,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色硫酸钡沉淀",
  },
  "H2SO4+Ca(OH)2": {
    type: REACTION_TYPES.Neutralization,
    equation: "H₂SO₄ + Ca(OH)₂ → CaSO₄↓ + 2H₂O",
    color: "#c4b5fd",
    ph: 7,
    tempDelta: 12,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "生成微溶的硫酸钙沉淀",
  },
};

// ==================== 产气反应 ====================
const gasProductionRecipes = {
  "HCl+Na2CO3": {
    type: REACTION_TYPES["Gas Production"],
    equation: "2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑",
    color: "#a5f3fc",
    ph: 4,
    tempDelta: -3,
    effect: "gas",
    description: "盐酸与碳酸钠反应，产生二氧化碳",
  },
  "HCl+NaHCO3": {
    type: REACTION_TYPES["Gas Production"],
    equation: "HCl + NaHCO₃ → NaCl + H₂O + CO₂↑",
    color: "#a5f3fc",
    ph: 5,
    tempDelta: -5,
    effect: "gas",
    description: "盐酸与碳酸氢钠反应",
  },
  "HCl+CaCO3": {
    type: REACTION_TYPES["Gas Production"],
    equation: "2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑",
    color: "#7dd3fc",
    ph: 4,
    tempDelta: 5,
    effect: "gas",
    description: "盐酸与碳酸钙反应",
  },
  "HCl+BaCO3": {
    type: REACTION_TYPES["Gas Production"],
    equation: "2HCl + BaCO₃ → BaCl₂ + H₂O + CO₂↑",
    color: "#93c5fd",
    ph: 4,
    tempDelta: 3,
    effect: "gas",
    description: "盐酸与碳酸钡反应",
  },
  "NH4Cl+NaOH": {
    type: REACTION_TYPES["Gas Production"],
    equation: "NH₄Cl + NaOH →(加热) NaCl + H₂O + NH₃↑",
    color: "#67e8f9",
    ph: 12,
    tempDelta: 15,
    effect: "gas",
    description: "铵盐与碱加热产生氨气",
  },
};

// ==================== 沉淀反应 ====================
const precipitationRecipes = {
  "AgNO3+NaCl": {
    type: REACTION_TYPES.Precipitation,
    equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
    color: "#e5e7eb",
    ph: 5,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色氯化银沉淀",
  },
  "BaCl2+Na2SO4": {
    type: REACTION_TYPES.Precipitation,
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl",
    color: "#f1f5f9",
    ph: 7,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "生成白色硫酸钡沉淀",
  },
  "CuSO4+NaOH": {
    type: REACTION_TYPES.Precipitation,
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    color: "#38bdf8",
    ph: 10,
    tempDelta: 2,
    effect: "precipitate",
    precipitateColor: "#0ea5e9",
    description: "生成蓝色氢氧化铜沉淀",
  },
  "FeCl3+NaOH": {
    type: REACTION_TYPES.Precipitation,
    equation: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
    color: "#fca5a5",
    ph: 11,
    tempDelta: 3,
    effect: "precipitate",
    precipitateColor: "#b45309",
    description: "生成红褐色氢氧化铁沉淀",
  },
  "FeSO4+NaOH": {
    type: REACTION_TYPES.Precipitation,
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
  "AgNO3+HCl": {
    type: REACTION_TYPES.Precipitation,
    equation: "AgNO₃ + HCl → AgCl↓ + HNO₃",
    color: "#e5e7eb",
    ph: 1,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "检验氯离子：生成白色沉淀",
  },
  "BaCl2+H2SO4": {
    type: REACTION_TYPES.Precipitation,
    equation: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl",
    color: "#f1f5f9",
    ph: 1,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f8fafc",
    description: "检验硫酸根离子：生成白色沉淀",
  },
};

// ==================== 络合反应 ====================
const complexationRecipes = {
  "FeCl3+KSCN": {
    type: REACTION_TYPES.Complexation,
    equation: "FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl",
    color: "#ef4444",
    ph: 5,
    tempDelta: 0,
    effect: "colorChange",
    precipitateColor: "#dc2626",
    description: "铁离子与硫氰酸根络合，溶液变为血红色",
  },
};

// ==================== 置换反应 ====================
const displacementRecipes = {
  "HCl+Mg": {
    type: REACTION_TYPES.Displacement,
    equation: "2HCl + Mg → MgCl₂ + H₂↑",
    color: "#d8b4fe",
    ph: 3,
    tempDelta: 25,
    effect: "gas",
    description: "镁与盐酸反应剧烈，产生氢气",
  },
  "HCl+Zn": {
    type: REACTION_TYPES.Displacement,
    equation: "2HCl + Zn → ZnCl₂ + H₂↑",
    color: "#c4b5fd",
    ph: 3,
    tempDelta: 15,
    effect: "gas",
    description: "锌与盐酸反应产生氢气",
  },
  "HCl+Fe": {
    type: REACTION_TYPES.Displacement,
    equation: "2HCl + Fe → FeCl₂ + H₂↑",
    color: "#86efac",
    ph: 3,
    tempDelta: 12,
    effect: "gas",
    description: "铁与盐酸反应，溶液变为浅绿色",
  },
  "CuSO4+Fe": {
    type: REACTION_TYPES.Displacement,
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    color: "#4ade80",
    ph: 5,
    tempDelta: 3,
    effect: "precipitate",
    precipitateColor: "#f59e0b",
    description: "铁置换出铜，铁表面出现红色固体",
  },
  "CuSO4+Zn": {
    type: REACTION_TYPES.Displacement,
    equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
    color: "#d1d5db",
    ph: 5,
    tempDelta: 5,
    effect: "precipitate",
    precipitateColor: "#f59e0b",
    description: "锌置换出铜",
  },
  "AgNO3+Cu": {
    type: REACTION_TYPES.Displacement,
    equation: "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
    color: "#60a5fa",
    ph: 5,
    tempDelta: 8,
    effect: "precipitate",
    precipitateColor: "#e5e7eb",
    description: "铜置换出银",
  },
  "NaOH+Al": {
    type: REACTION_TYPES.Displacement,
    equation: "2NaOH + 2Al + 2H₂O → 2NaAlO₂ + 3H₂↑",
    color: "#dbeafe",
    ph: 12,
    tempDelta: 20,
    effect: "gas",
    description: "铝与氢氧化钠溶液反应（铝的两性）",
  },
};

// ==================== 氧化物反应 ====================
const oxideRecipes = {
  "CuO+HCl": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "CuO + 2HCl → CuCl₂ + H₂O",
    color: "#22d3ee",
    ph: 3,
    tempDelta: 10,
    effect: "heat",
    description: "黑色氧化铜溶解，溶液变为蓝绿色",
  },
  "CuO+H2SO4": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "CuO + H₂SO₄ → CuSO₄ + H₂O",
    color: "#38bdf8",
    ph: 3,
    tempDelta: 12,
    effect: "heat",
    description: "黑色氧化铜溶解，溶液变为蓝色",
  },
  "Fe2O3+HCl": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O",
    color: "#fbbf24",
    ph: 2,
    tempDelta: 8,
    effect: "heat",
    description: "铁锈溶解，溶液变为黄色",
  },
  "Al2O3+NaOH": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O",
    color: "#dbeafe",
    ph: 12,
    tempDelta: 5,
    effect: "heat",
    description: "氧化铝溶于氢氧化钠（两性氧化物）",
  },
  "CaO+H2O": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "CaO + H₂O → Ca(OH)₂",
    color: "#fef9c3",
    ph: 12,
    tempDelta: 65,
    effect: "heat",
    description: "生石灰遇水剧烈放热",
  },
  "Na2O2+H2O": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "2Na₂O₂ + 2H₂O → 4NaOH + O₂↑",
    color: "#fef08a",
    ph: 14,
    tempDelta: 45,
    effect: "gas",
    description: "过氧化钠与水反应，产生氧气",
  },
  "CO2+Ca(OH)2": {
    type: REACTION_TYPES["Oxide Reaction"],
    equation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O",
    color: "#f5f5f4",
    ph: 8,
    tempDelta: 0,
    effect: "precipitate",
    precipitateColor: "#f5f5f4",
    description: "检验二氧化碳：石灰水变浑浊",
  },
};

// ==================== 氧化还原反应 ====================
const redoxRecipes = {
  "C+CuO": {
    type: REACTION_TYPES.Redox,
    equation: "C + 2CuO →(高温) 2Cu + CO₂↑",
    color: "#f59e0b",
    ph: 7,
    tempDelta: 85,
    effect: "smoke",
    description: "碳还原氧化铜",
  },
  "CO+CuO": {
    type: REACTION_TYPES.Redox,
    equation: "CO + CuO →(加热) Cu + CO₂",
    color: "#f59e0b",
    ph: 7,
    tempDelta: 40,
    effect: "heat",
    description: "一氧化碳还原氧化铜",
  },
  "H2+CuO": {
    type: REACTION_TYPES.Redox,
    equation: "H₂ + CuO →(加热) Cu + H₂O",
    color: "#60a5fa",
    ph: 7,
    tempDelta: 35,
    effect: "heat",
    description: "氢气还原氧化铜",
  },
  "Fe2O3+CO": {
    type: REACTION_TYPES.Redox,
    equation: "Fe₂O₃ + 3CO →(高温) 2Fe + 3CO₂",
    color: "#b91c1c",
    ph: 7,
    tempDelta: 75,
    effect: "heat",
    description: "高炉炼铁",
  },
  "Cl2+NaOH": {
    type: REACTION_TYPES.Redox,
    equation: "Cl₂ + 2NaOH → NaCl + NaClO + H₂O",
    color: "#4ade80",
    ph: 12,
    tempDelta: 10,
    effect: "heat",
    description: "氯气与氢氧化钠反应（制备漂白液）",
  },
};

// ==================== 化合反应 ====================
const combinationRecipes = {
  "Na+Cl2": {
    type: REACTION_TYPES.Combination,
    equation: "2Na + Cl₂ →(点燃) 2NaCl",
    color: "#fef9c3",
    ph: 7,
    tempDelta: 70,
    effect: "smoke",
    description: "钠在氯气中燃烧",
  },
  "S+Fe": {
    type: REACTION_TYPES.Combination,
    equation: "Fe + S →(加热) FeS",
    color: "#94a3b8",
    ph: 7,
    tempDelta: 45,
    effect: "heat",
    description: "铁粉与硫粉混合加热",
  },
};

// ==================== 分解反应 ====================
const decompositionRecipes = {
  "H2O2": {
    type: REACTION_TYPES.Decomposition,
    equation: "2H₂O₂ →(MnO₂) 2H₂O + O₂↑",
    color: "#bfdbfe",
    ph: 7,
    tempDelta: -5,
    effect: "gas",
    description: "过氧化氢分解产生氧气",
  },
  "CaCO3+heat": {
    type: REACTION_TYPES.Decomposition,
    equation: "CaCO₃ →(高温) CaO + CO₂↑",
    color: "#d9f99d",
    ph: 7,
    tempDelta: 80,
    effect: "gas",
    description: "石灰石高温分解",
  },
};

// ==================== 钠的特殊反应 ====================
const sodiumRecipes = {
  "Na+H2O": {
    type: REACTION_TYPES["Single Displacement"],
    equation: "2Na + 2H₂O → 2NaOH + H₂↑",
    color: "#e2e8f0",
    ph: 13,
    tempDelta: 80,
    effect: "smoke",
    description: "钠与水剧烈反应",
  },
  "Na+HCl": {
    type: REACTION_TYPES["Single Displacement"],
    equation: "2Na + 2HCl → 2NaCl + H₂↑",
    color: "#fef08a",
    ph: 7,
    tempDelta: 85,
    effect: "smoke",
    description: "钠与盐酸剧烈反应",
  },
};

// ==================== 三元反应 ====================
const ternaryRecipes = {
  "HCl+NaOH+酚酞": {
    type: REACTION_TYPES.Neutralization,
    equation: "HCl + NaOH → NaCl + H₂O（酚酞指示剂）",
    color: "#f472b6",
    ph: 7,
    tempDelta: 15,
    effect: "colorChange",
    description: "酸碱中和滴定，酚酞由红色变为无色",
    reactants: ["HCl", "NaOH", "酚酞"],
  },
  "Fe+CuSO4+AgNO3": {
    type: REACTION_TYPES.Displacement,
    equation: "Fe + CuSO₄ → FeSO₄ + Cu; Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
    color: "#e5e7eb",
    ph: 5,
    tempDelta: 8,
    effect: "precipitate",
    precipitateColor: "#e5e7eb",
    description: "铁先置换铜，铜再置换银",
    reactants: ["Fe", "CuSO4", "AgNO3"],
  },
};

// ==================== 合并所有反应 ====================
export const reactionRecipes = {
  ...acidBaseRecipes,
  ...gasProductionRecipes,
  ...precipitationRecipes,
  ...complexationRecipes,
  ...displacementRecipes,
  ...oxideRecipes,
  ...redoxRecipes,
  ...combinationRecipes,
  ...decompositionRecipes,
  ...sodiumRecipes,
  ...ternaryRecipes,
};

// ==================== 反应索引（用于快速匹配） ====================
const reactionIndex = new Map();

Object.entries(reactionRecipes).forEach(([key, recipe]) => {
  let reactants;
  if (recipe.reactants) {
    reactants = recipe.reactants;
  } else {
    reactants = key.split("+");
  }
  const sortedKey = [...reactants].sort().join("+");
  reactionIndex.set(sortedKey, { key, recipe, reactants });
});

// ==================== 匹配函数 ====================
function getSortedKey(reactants) {
  return [...reactants].sort().join("+");
}

export function findReaction(existing, incoming) {
  const allReactants = [...existing, incoming];
  const sortedKey = getSortedKey(allReactants);

  const exactMatch = reactionIndex.get(sortedKey);
  if (exactMatch) {
    return { key: exactMatch.key, ...exactMatch.recipe };
  }

  for (const [indexKey, { key, recipe, reactants }] of reactionIndex) {
    const isSubset = reactants.every((r) => allReactants.includes(r));
    if (isSubset && reactants.length === allReactants.length) {
      return { key, ...recipe };
    }
  }

  for (const reagent of existing) {
    const key1 = `${reagent}+${incoming}`;
    const key2 = `${incoming}+${reagent}`;
    if (reactionRecipes[key1]) return { key: key1, ...reactionRecipes[key1] };
    if (reactionRecipes[key2]) return { key: key2, ...reactionRecipes[key2] };
  }

  if (reactionRecipes[incoming]) {
    return { key: incoming, ...reactionRecipes[incoming] };
  }

  return null;
}

export function getReactionKey(a, b) {
  const key1 = `${a}+${b}`;
  const key2 = `${b}+${a}`;
  if (reactionRecipes[key1]) return key1;
  if (reactionRecipes[key2]) return key2;
  if (reactionRecipes[a]) return a;
  if (reactionRecipes[b]) return b;
  return null;
}
