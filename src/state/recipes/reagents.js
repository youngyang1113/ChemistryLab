// 试剂定义 - 高中化学常见物质
// phase: solid(固体) | liquid(液体) | gas(气体) — 常温常压下的状态

// 试剂图片映射 (emoji)
const REAGENT_IMAGE_MAP = {
  // 酸
  HCl: "🧪", H2SO4: "🫗", HNO3: "🧪", CH3COOH: "🫗", H3PO4: "🧪",
  H2CO3: "💧", HF: "🧪", H2SiO3: "🫧",
  // 碱
  NaOH: "🧊", KOH: "🧊", "Ca(OH)2": "🪨", "Ba(OH)2": "🧊",
  NH3H2O: "💧", "Mg(OH)2": "🥛", "Al(OH)3": "🧊",
  "Fe(OH)3": "🟫", "Fe(OH)2": "⬜", "Cu(OH)2": "🔵", "Zn(OH)2": "⬜",
  // 盐
  NaCl: "🧂", Na2CO3: "🧊", NaHCO3: "🧂", CaCO3: "🪨", BaCO3: "🪨",
  AgNO3: "🧊", BaCl2: "🧊", "Ba(NO3)2": "🧊", CaCl2: "🧊",
  CuSO4: "💎", "Cu(NO3)2": "💎", FeSO4: "🟢", "Fe2(SO4)3": "🟤",
  FeCl3: "🟤", FeCl2: "🟢", "Fe(NO3)3": "🟤", AlCl3: "🧊",
  "Al2(SO4)3": "🧊", Na2SO4: "🧂", Na2SiO3: "🧊", NaAlO2: "🧊",
  KI: "🧂", KCl: "🧂", KClO3: "🧂", KMnO4: "💜", K2MnO4: "💚",
  K2CrO4: "🟡", K2Cr2O7: "🟠", NH4Cl: "🧂", "(NH4)2SO4": "🧂",
  NH4NO3: "🧂", NH4HCO3: "🧂", Na2S: "🧊", Na2SO3: "🧊",
  NaF: "🧊", CaF2: "🪨", KSCN: "🧊", "Pb(NO3)2": "🧊",
  AgCl: "⬜", BaSO4: "⬜", FeS: "🪨", CuCl2: "💎",
  MgCl2: "🧊", ZnSO4: "🧊", ZnCl2: "🧊", MnSO4: "🧊",
  Na2CO3_solution: "💧",
  // 金属
  Na: "⚙️", K: "⚙️", Mg: "⚙️", Al: "🔩", Fe: "⛓️",
  Fe_powder: "⬛", Zn: "🔩", Cu: "🟠", Ag: "🪙",
  // 非金属
  C: "🖤", S: "💛", P: "🔴", Si: "🪨", I2: "💜",
  Cl2: "🟢", N2: "💨", O2: "💙", H2: "💨",
  // 氧化物
  CaO: "🪨", Na2O: "🧊", Na2O2: "🟡", MgO: "🪨",
  Fe2O3: "🟤", Fe3O4: "⬛", CuO: "⬛", ZnO: "🪨",
  Al2O3: "🪨", MnO2: "⬛", SiO2: "🪨", P2O5: "🪨",
  CO2: "💨", CO: "💨", SO2: "💨", SO3: "💨",
  NO: "💨", NO2: "🟤", H2O: "💧", H2O2: "💧",
  // 气体
  CH4: "🔥", C2H4: "🔥", C2H2: "🔥", NH3: "💨",
  HCl_gas: "💨", H2S: "💨",
  // 指示剂
  酚酞: "🩷", 石蕊: "💜", 甲基橙: "🟠", 品红: "❤️",
  淀粉: "🥛", 溴水: "🟤", 酸性KMnO4: "💜", 澄清石灰水: "🥛",
};

export function getReagentImage(reagent) {
  return REAGENT_IMAGE_MAP[reagent.id] || "🧪";
}

export const reagents = [
  // ==================== 酸类 (溶液→液体) ====================
  { id: "HCl", name: "盐酸", formula: "HCl(aq)", category: "acid", phase: "liquid", color: "#facc15" },
  { id: "H2SO4", name: "硫酸", formula: "H₂SO₄", category: "acid", phase: "liquid", color: "#f97316" },
  { id: "HNO3", name: "硝酸", formula: "HNO₃", category: "acid", phase: "liquid", color: "#fb923c" },
  { id: "CH3COOH", name: "醋酸", formula: "CH₃COOH", category: "acid", phase: "liquid", color: "#fbbf24" },
  { id: "H3PO4", name: "磷酸", formula: "H₃PO₄", category: "acid", phase: "liquid", color: "#f59e0b" },
  { id: "H2CO3", name: "碳酸", formula: "H₂CO₃", category: "acid", phase: "liquid", color: "#d97706" },
  { id: "HF", name: "氢氟酸", formula: "HF(aq)", category: "acid", phase: "liquid", color: "#e5e7eb" },
  { id: "H2SiO3", name: "硅酸", formula: "H₂SiO₃", category: "acid", phase: "solid", color: "#f1f5f9" },

  // ==================== 碱类 ====================
  { id: "NaOH", name: "氢氧化钠", formula: "NaOH", category: "base", phase: "solid", color: "#818cf8" },
  { id: "KOH", name: "氢氧化钾", formula: "KOH", category: "base", phase: "solid", color: "#a78bfa" },
  { id: "Ca(OH)2", name: "氢氧化钙", formula: "Ca(OH)₂", category: "base", phase: "solid", color: "#c4b5fd" },
  { id: "Ba(OH)2", name: "氢氧化钡", formula: "Ba(OH)₂", category: "base", phase: "solid", color: "#ddd6fe" },
  { id: "NH3H2O", name: "氨水", formula: "NH₃·H₂O", category: "base", phase: "liquid", color: "#67e8f9" },
  { id: "Mg(OH)2", name: "氢氧化镁", formula: "Mg(OH)₂", category: "base", phase: "solid", color: "#e0e7ff" },
  { id: "Al(OH)3", name: "氢氧化铝", formula: "Al(OH)₃", category: "base", phase: "solid", color: "#dbeafe" },
  { id: "Fe(OH)3", name: "氢氧化铁", formula: "Fe(OH)₃", category: "base", phase: "solid", color: "#fecaca" },
  { id: "Fe(OH)2", name: "氢氧化亚铁", formula: "Fe(OH)₂", category: "base", phase: "solid", color: "#d1fae5" },
  { id: "Cu(OH)2", name: "氢氧化铜", formula: "Cu(OH)₂", category: "base", phase: "solid", color: "#93c5fd" },
  { id: "Zn(OH)2", name: "氢氧化锌", formula: "Zn(OH)₂", category: "base", phase: "solid", color: "#dbeafe" },

  // ==================== 盐类 (固体) ====================
  { id: "NaCl", name: "氯化钠", formula: "NaCl", category: "salt", phase: "solid", color: "#fef9c3" },
  { id: "Na2CO3", name: "碳酸钠", formula: "Na₂CO₃", category: "salt", phase: "solid", color: "#fde68a" },
  { id: "NaHCO3", name: "碳酸氢钠", formula: "NaHCO₃", category: "salt", phase: "solid", color: "#fef08a" },
  { id: "CaCO3", name: "碳酸钙", formula: "CaCO₃", category: "salt", phase: "solid", color: "#d9f99d" },
  { id: "BaCO3", name: "碳酸钡", formula: "BaCO₃", category: "salt", phase: "solid", color: "#ecfccb" },
  { id: "AgNO3", name: "硝酸银", formula: "AgNO₃", category: "salt", phase: "solid", color: "#e5e7eb" },
  { id: "BaCl2", name: "氯化钡", formula: "BaCl₂", category: "salt", phase: "solid", color: "#bbf7d0" },
  { id: "Ba(NO3)2", name: "硝酸钡", formula: "Ba(NO₃)₂", category: "salt", phase: "solid", color: "#d1fae5" },
  { id: "CaCl2", name: "氯化钙", formula: "CaCl₂", category: "salt", phase: "solid", color: "#a7f3d0" },
  { id: "CuSO4", name: "硫酸铜", formula: "CuSO₄", category: "salt", phase: "solid", color: "#38bdf8" },
  { id: "Cu(NO3)2", name: "硝酸铜", formula: "Cu(NO₃)₂", category: "salt", phase: "solid", color: "#22d3ee" },
  { id: "FeSO4", name: "硫酸亚铁", formula: "FeSO₄", category: "salt", phase: "solid", color: "#86efac" },
  { id: "Fe2(SO4)3", name: "硫酸铁", formula: "Fe₂(SO₄)₃", category: "salt", phase: "solid", color: "#fca5a5" },
  { id: "FeCl3", name: "氯化铁", formula: "FeCl₃", category: "salt", phase: "solid", color: "#fca5a5" },
  { id: "FeCl2", name: "氯化亚铁", formula: "FeCl₂", category: "salt", phase: "solid", color: "#86efac" },
  { id: "Fe(NO3)3", name: "硝酸铁", formula: "Fe(NO₃)₃", category: "salt", phase: "solid", color: "#fca5a5" },
  { id: "AlCl3", name: "氯化铝", formula: "AlCl₃", category: "salt", phase: "solid", color: "#e0e7ff" },
  { id: "Al2(SO4)3", name: "硫酸铝", formula: "Al₂(SO₄)₃", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "Na2SO4", name: "硫酸钠", formula: "Na₂SO₄", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "Na2SiO3", name: "硅酸钠", formula: "Na₂SiO₃", category: "salt", phase: "solid", color: "#d1fae5" },
  { id: "NaAlO2", name: "偏铝酸钠", formula: "NaAlO₂", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "KI", name: "碘化钾", formula: "KI", category: "salt", phase: "solid", color: "#fef3c7" },
  { id: "KCl", name: "氯化钾", formula: "KCl", category: "salt", phase: "solid", color: "#f5f5f4" },
  { id: "KClO3", name: "氯酸钾", formula: "KClO₃", category: "salt", phase: "solid", color: "#f5f5f4" },
  { id: "KMnO4", name: "高锰酸钾", formula: "KMnO₄", category: "salt", phase: "solid", color: "#c084fc" },
  { id: "K2MnO4", name: "锰酸钾", formula: "K₂MnO₄", category: "salt", phase: "solid", color: "#a78bfa" },
  { id: "K2CrO4", name: "铬酸钾", formula: "K₂CrO₄", category: "salt", phase: "solid", color: "#fbbf24" },
  { id: "K2Cr2O7", name: "重铬酸钾", formula: "K₂Cr₂O₇", category: "salt", phase: "solid", color: "#f97316" },
  { id: "NH4Cl", name: "氯化铵", formula: "NH₄Cl", category: "salt", phase: "solid", color: "#fef9c3" },
  { id: "(NH4)2SO4", name: "硫酸铵", formula: "(NH₄)₂SO₄", category: "salt", phase: "solid", color: "#fef08a" },
  { id: "NH4NO3", name: "硝酸铵", formula: "NH₄NO₃", category: "salt", phase: "solid", color: "#fef9c3" },
  { id: "NH4HCO3", name: "碳酸氢铵", formula: "NH₄HCO₃", category: "salt", phase: "solid", color: "#fef08a" },
  { id: "Na2S", name: "硫化钠", formula: "Na₂S", category: "salt", phase: "solid", color: "#fef3c7" },
  { id: "Na2SO3", name: "亚硫酸钠", formula: "Na₂SO₃", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "NaF", name: "氟化钠", formula: "NaF", category: "salt", phase: "solid", color: "#e5e7eb" },
  { id: "CaF2", name: "氟化钙(萤石)", formula: "CaF₂", category: "salt", phase: "solid", color: "#e5e7eb" },
  { id: "KSCN", name: "硫氰化钾", formula: "KSCN", category: "salt", phase: "solid", color: "#fce7f3" },
  { id: "Pb(NO3)2", name: "硝酸铅", formula: "Pb(NO₃)₂", category: "salt", phase: "solid", color: "#fecaca" },
  { id: "AgCl", name: "氯化银", formula: "AgCl", category: "salt", phase: "solid", color: "#f8fafc" },
  { id: "BaSO4", name: "硫酸钡", formula: "BaSO₄", category: "salt", phase: "solid", color: "#f8fafc" },
  { id: "FeS", name: "硫化亚铁", formula: "FeS", category: "salt", phase: "solid", color: "#78716c" },
  { id: "CuCl2", name: "氯化铜", formula: "CuCl₂", category: "salt", phase: "solid", color: "#22d3ee" },
  { id: "MgCl2", name: "氯化镁", formula: "MgCl₂", category: "salt", phase: "solid", color: "#e0e7ff" },
  { id: "ZnSO4", name: "硫酸锌", formula: "ZnSO₄", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "ZnCl2", name: "氯化锌", formula: "ZnCl₂", category: "salt", phase: "solid", color: "#dbeafe" },
  { id: "MnSO4", name: "硫酸锰", formula: "MnSO₄", category: "salt", phase: "solid", color: "#fde68a" },
  { id: "Na2CO3_solution", name: "碳酸钠溶液", formula: "Na₂CO₃(aq)", category: "salt", phase: "liquid", color: "#fde68a" },

  // ==================== 金属单质 (固体) ====================
  { id: "Na", name: "钠", formula: "Na", category: "metal", phase: "solid", color: "#e2e8f0" },
  { id: "K", name: "钾", formula: "K", category: "metal", phase: "solid", color: "#e2e8f0" },
  { id: "Mg", name: "镁", formula: "Mg", category: "metal", phase: "solid", color: "#e2e8f0" },
  { id: "Al", name: "铝", formula: "Al", category: "metal", phase: "solid", color: "#d1d5db" },
  { id: "Fe", name: "铁", formula: "Fe", category: "metal", phase: "solid", color: "#94a3b8" },
  { id: "Fe_powder", name: "铁粉", formula: "Fe(粉)", category: "metal", phase: "solid", color: "#78716c" },
  { id: "Zn", name: "锌", formula: "Zn", category: "metal", phase: "solid", color: "#cbd5e1" },
  { id: "Cu", name: "铜", formula: "Cu", category: "metal", phase: "solid", color: "#f59e0b" },
  { id: "Ag", name: "银", formula: "Ag", category: "metal", phase: "solid", color: "#e5e7eb" },

  // ==================== 非金属单质 ====================
  { id: "C", name: "碳(活性炭)", formula: "C", category: "nonmetal", phase: "solid", color: "#1e293b" },
  { id: "S", name: "硫", formula: "S", category: "nonmetal", phase: "solid", color: "#fbbf24" },
  { id: "P", name: "磷(红磷)", formula: "P", category: "nonmetal", phase: "solid", color: "#fca5a5" },
  { id: "Si", name: "硅", formula: "Si", category: "nonmetal", phase: "solid", color: "#6b7280" },
  { id: "I2", name: "碘", formula: "I₂", category: "nonmetal", phase: "solid", color: "#6366f1" },
  { id: "Cl2", name: "氯气", formula: "Cl₂", category: "nonmetal", phase: "gas", color: "#4ade80" },
  { id: "N2", name: "氮气", formula: "N₂", category: "nonmetal", phase: "gas", color: "#9ca3af" },
  { id: "O2", name: "氧气", formula: "O₂", category: "nonmetal", phase: "gas", color: "#60a5fa" },
  { id: "H2", name: "氢气", formula: "H₂", category: "nonmetal", phase: "gas", color: "#e2e8f0" },

  // ==================== 氧化物 ====================
  { id: "CaO", name: "氧化钙(生石灰)", formula: "CaO", category: "oxide", phase: "solid", color: "#f1f5f9" },
  { id: "Na2O", name: "氧化钠", formula: "Na₂O", category: "oxide", phase: "solid", color: "#e2e8f0" },
  { id: "Na2O2", name: "过氧化钠", formula: "Na₂O₂", category: "oxide", phase: "solid", color: "#fef08a" },
  { id: "MgO", name: "氧化镁", formula: "MgO", category: "oxide", phase: "solid", color: "#f1f5f9" },
  { id: "Fe2O3", name: "氧化铁(铁锈)", formula: "Fe₂O₃", category: "oxide", phase: "solid", color: "#b91c1c" },
  { id: "Fe3O4", name: "四氧化三铁", formula: "Fe₃O₄", category: "oxide", phase: "solid", color: "#1e293b" },
  { id: "CuO", name: "氧化铜", formula: "CuO", category: "oxide", phase: "solid", color: "#1e293b" },
  { id: "ZnO", name: "氧化锌", formula: "ZnO", category: "oxide", phase: "solid", color: "#f1f5f9" },
  { id: "Al2O3", name: "氧化铝", formula: "Al₂O₃", category: "oxide", phase: "solid", color: "#e2e8f0" },
  { id: "MnO2", name: "二氧化锰", formula: "MnO₂", category: "oxide", phase: "solid", color: "#1e293b" },
  { id: "SiO2", name: "二氧化硅", formula: "SiO₂", category: "oxide", phase: "solid", color: "#f3f4f6" },
  { id: "P2O5", name: "五氧化二磷", formula: "P₂O₅", category: "oxide", phase: "solid", color: "#f5f5f4" },
  { id: "CO2", name: "二氧化碳", formula: "CO₂", category: "oxide", phase: "gas", color: "#9ca3af" },
  { id: "CO", name: "一氧化碳", formula: "CO", category: "oxide", phase: "gas", color: "#9ca3af" },
  { id: "SO2", name: "二氧化硫", formula: "SO₂", category: "oxide", phase: "gas", color: "#d1d5db" },
  { id: "SO3", name: "三氧化硫", formula: "SO₃", category: "oxide", phase: "gas", color: "#f97316" },
  { id: "NO", name: "一氧化氮", formula: "NO", category: "oxide", phase: "gas", color: "#9ca3af" },
  { id: "NO2", name: "二氧化氮", formula: "NO₂", category: "oxide", phase: "gas", color: "#92400e" },
  { id: "H2O", name: "水", formula: "H₂O", category: "oxide", phase: "liquid", color: "#60a5fa" },
  { id: "H2O2", name: "过氧化氢(双氧水)", formula: "H₂O₂", category: "oxide", phase: "liquid", color: "#bfdbfe" },

  // ==================== 气体 ====================
  { id: "CH4", name: "甲烷", formula: "CH₄", category: "gas", phase: "gas", color: "#f5f5f4" },
  { id: "C2H4", name: "乙烯", formula: "C₂H₄", category: "gas", phase: "gas", color: "#f5f5f4" },
  { id: "C2H2", name: "乙炔", formula: "C₂H₂", category: "gas", phase: "gas", color: "#f5f5f4" },
  { id: "NH3", name: "氨气", formula: "NH₃", category: "gas", phase: "gas", color: "#67e8f9" },
  { id: "HCl_gas", name: "氯化氢(气)", formula: "HCl(g)", category: "gas", phase: "gas", color: "#facc15" },
  { id: "H2S", name: "硫化氢", formula: "H₂S", category: "gas", phase: "gas", color: "#fbbf24" },

  // ==================== 指示剂 (溶液→液体) ====================
  { id: "酚酞", name: "酚酞试液", formula: "C₂₀H₁₄O₄", category: "indicator", phase: "liquid", color: "#ec4899" },
  { id: "石蕊", name: "石蕊试液", formula: "Litmus", category: "indicator", phase: "liquid", color: "#7c3aed" },
  { id: "甲基橙", name: "甲基橙指示剂", formula: "C₁₄H₁₄N₃NaO₃S", category: "indicator", phase: "liquid", color: "#f97316" },
  { id: "品红", name: "品红溶液", formula: "Fuchsin", category: "indicator", phase: "liquid", color: "#be185d" },
  { id: "淀粉", name: "淀粉溶液", formula: "(C₆H₁₀O₅)ₙ", category: "indicator", phase: "liquid", color: "#fefce8" },
  { id: "溴水", name: "溴水", formula: "Br₂(aq)", category: "indicator", phase: "liquid", color: "#b45309" },
  { id: "酸性KMnO4", name: "酸性高锰酸钾", formula: "KMnO₄/H₂SO₄", category: "indicator", phase: "liquid", color: "#a855f7" },
  { id: "澄清石灰水", name: "澄清石灰水", formula: "Ca(OH)₂(aq)", category: "indicator", phase: "liquid", color: "#f0fdf4" },
];
