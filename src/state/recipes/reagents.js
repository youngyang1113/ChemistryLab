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
