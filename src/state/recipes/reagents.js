// 试剂定义 - 高中化学常见物质
// phase: solid(固体) | liquid(液体) | gas(气体) — 常温常压下的状态
// color: 基于真实物理外观

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
  // 盐酸: 无色透明液体
  { id: "HCl", name: "盐酸", formula: "HCl(aq)", category: "acid", phase: "liquid", color: "#dce8f0" },
  // 浓硫酸: 无色油状液体，略带淡黄
  { id: "H2SO4", name: "硫酸", formula: "H₂SO₄", category: "acid", phase: "liquid", color: "#e8dcc8" },
  // 浓硝酸: 无色液体，久置微黄
  { id: "HNO3", name: "硝酸", formula: "HNO₃", category: "acid", phase: "liquid", color: "#e8e0c8" },
  // 醋酸: 无色液体，刺激性酸味
  { id: "CH3COOH", name: "醋酸", formula: "CH₃COOH", category: "acid", phase: "liquid", color: "#ece4d0" },
  // 磷酸: 无色透明粘稠液体
  { id: "H3PO4", name: "磷酸", formula: "H₃PO₄", category: "acid", phase: "liquid", color: "#e8e0cc" },
  // 碳酸: 仅存在于溶液中，极淡
  { id: "H2CO3", name: "碳酸", formula: "H₂CO₃", category: "acid", phase: "liquid", color: "#e0e8e4" },
  // 氢氟酸: 无色透明液体
  { id: "HF", name: "氢氟酸", formula: "HF(aq)", category: "acid", phase: "liquid", color: "#e0e8ec" },
  // 硅酸: 白色胶状沉淀
  { id: "H2SiO3", name: "硅酸", formula: "H₂SiO₃", category: "acid", phase: "solid", color: "#f0ede8" },

  // ==================== 碱类 ====================
  // 氢氧化钠: 白色固体
  { id: "NaOH", name: "氢氧化钠", formula: "NaOH", category: "base", phase: "solid", color: "#f0ede8" },
  // 氢氧化钾: 白色固体
  { id: "KOH", name: "氢氧化钾", formula: "KOH", category: "base", phase: "solid", color: "#f0ede8" },
  // 氢氧化钙(熟石灰): 白色粉末
  { id: "Ca(OH)2", name: "氢氧化钙", formula: "Ca(OH)₂", category: "base", phase: "solid", color: "#f5f2ec" },
  // 氢氧化钡: 白色固体
  { id: "Ba(OH)2", name: "氢氧化钡", formula: "Ba(OH)₂", category: "base", phase: "solid", color: "#f0ede8" },
  // 氨水: 无色透明液体
  { id: "NH3H2O", name: "氨水", formula: "NH₃·H₂O", category: "base", phase: "liquid", color: "#dce8ec" },
  // 氢氧化镁: 白色固体
  { id: "Mg(OH)2", name: "氢氧化镁", formula: "Mg(OH)₂", category: "base", phase: "solid", color: "#f8f6f0" },
  // 氢氧化铝: 白色胶状沉淀
  { id: "Al(OH)3", name: "氢氧化铝", formula: "Al(OH)₃", category: "base", phase: "solid", color: "#f0ede8" },
  // 氢氧化铁: 红褐色沉淀
  { id: "Fe(OH)3", name: "氢氧化铁", formula: "Fe(OH)₃", category: "base", phase: "solid", color: "#8b4513" },
  // 氢氧化亚铁: 白色→灰绿色沉淀
  { id: "Fe(OH)2", name: "氢氧化亚铁", formula: "Fe(OH)₂", category: "base", phase: "solid", color: "#90c890" },
  // 氢氧化铜: 蓝色沉淀
  { id: "Cu(OH)2", name: "氢氧化铜", formula: "Cu(OH)₂", category: "base", phase: "solid", color: "#4169e1" },
  // 氢氧化锌: 白色沉淀
  { id: "Zn(OH)2", name: "氢氧化锌", formula: "Zn(OH)₂", category: "base", phase: "solid", color: "#f0ede8" },

  // ==================== 盐类 (固体) ====================
  // 氯化钠: 白色晶体
  { id: "NaCl", name: "氯化钠", formula: "NaCl", category: "salt", phase: "solid", color: "#f8f6f0" },
  // 碳酸钠(纯碱): 白色粉末
  { id: "Na2CO3", name: "碳酸钠", formula: "Na₂CO₃", category: "salt", phase: "solid", color: "#f5f2ec" },
  // 碳酸氢钠(小苏打): 白色细粒
  { id: "NaHCO3", name: "碳酸氢钠", formula: "NaHCO₃", category: "salt", phase: "solid", color: "#f8f6f0" },
  // 碳�ite钙(石灰石): 白色固体
  { id: "CaCO3", name: "碳酸钙", formula: "CaCO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 碳酸钡: 白色粉末
  { id: "BaCO3", name: "碳酸钡", formula: "BaCO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硝酸银: 无色晶体
  { id: "AgNO3", name: "硝酸银", formula: "AgNO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯化钡: 白色晶体
  { id: "BaCl2", name: "氯化钡", formula: "BaCl₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硝酸钡: 白色晶体
  { id: "Ba(NO3)2", name: "硝酸钡", formula: "Ba(NO₃)₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯化钙: 白色多孔固体
  { id: "CaCl2", name: "氯化钙", formula: "CaCl₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸铜(无水): 白色粉末；五水硫酸铜: 蓝色晶体
  { id: "CuSO4", name: "硫酸铜", formula: "CuSO₄", category: "salt", phase: "solid", color: "#5b9ec9" },
  // 硝酸铜: 蓝色晶体
  { id: "Cu(NO3)2", name: "硝酸铜", formula: "Cu(NO₃)₂", category: "salt", phase: "solid", color: "#4a8db5" },
  // 硫酸亚铁(绿矾): 浅绿色晶体
  { id: "FeSO4", name: "硫酸亚铁", formula: "FeSO₄", category: "salt", phase: "solid", color: "#7db87d" },
  // 硫酸铁: 黄褐色粉末
  { id: "Fe2(SO4)3", name: "硫酸铁", formula: "Fe₂(SO₄)₃", category: "salt", phase: "solid", color: "#c8a050" },
  // 氯化铁: 黑棕色固体
  { id: "FeCl3", name: "氯化铁", formula: "FeCl₃", category: "salt", phase: "solid", color: "#a07828" },
  // 氯化亚铁: 绿灰色晶体
  { id: "FeCl2", name: "氯化亚铁", formula: "FeCl₂", category: "salt", phase: "solid", color: "#88b088" },
  // 硝酸铁: 淡紫色晶体
  { id: "Fe(NO3)3", name: "硝酸铁", formula: "Fe(NO₃)₃", category: "salt", phase: "solid", color: "#c0a060" },
  // 氯化铝: 白色晶体
  { id: "AlCl3", name: "氯化铝", formula: "AlCl₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸铝: 白色晶体
  { id: "Al2(SO4)3", name: "硫酸铝", formula: "Al₂(SO₄)₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸钠: 白色晶体
  { id: "Na2SO4", name: "硫酸钠", formula: "Na₂SO₄", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硅酸钠(水玻璃): 白色固体
  { id: "Na2SiO3", name: "硅酸钠", formula: "Na₂SiO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 偏铝酸钠: 白色固体
  { id: "NaAlO2", name: "偏铝酸钠", formula: "NaAlO₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 碘化钾: 白色晶体
  { id: "KI", name: "碘化钾", formula: "KI", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯化钾: 白色晶体
  { id: "KCl", name: "氯化钾", formula: "KCl", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯酸钾: 白色晶体
  { id: "KClO3", name: "氯酸钾", formula: "KClO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 高锰酸钾: 暗紫色晶体
  { id: "KMnO4", name: "高锰酸钾", formula: "KMnO₄", category: "salt", phase: "solid", color: "#6b21a8" },
  // 锰酸钾: 暗绿色晶体
  { id: "K2MnO4", name: "锰酸钾", formula: "K₂MnO₄", category: "salt", phase: "solid", color: "#3d7a3d" },
  // 铬酸钾: 黄色晶体
  { id: "K2CrO4", name: "铬酸钾", formula: "K₂CrO₄", category: "salt", phase: "solid", color: "#d4a017" },
  // 重铬酸钾: 橙红色晶体
  { id: "K2Cr2O7", name: "重铬酸钾", formula: "K₂Cr₂O₇", category: "salt", phase: "solid", color: "#c0501d" },
  // 氯化铵: 白色晶体
  { id: "NH4Cl", name: "氯化铵", formula: "NH₄Cl", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸铵: 白色晶体
  { id: "(NH4)2SO4", name: "硫酸铵", formula: "(NH₄)₂SO₄", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硝酸铵: 白色晶体
  { id: "NH4NO3", name: "硝酸铵", formula: "NH₄NO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 碳酸氢铵: 白色晶体
  { id: "NH4HCO3", name: "碳酸氢铵", formula: "NH₄HCO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫化钠: 白色固体
  { id: "Na2S", name: "硫化钠", formula: "Na₂S", category: "salt", phase: "solid", color: "#f0ede8" },
  // 亚硫酸钠: 白色晶体
  { id: "Na2SO3", name: "亚硫酸钠", formula: "Na₂SO₃", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氟化钠: 白色固体
  { id: "NaF", name: "氟化钠", formula: "NaF", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氟化钙(萤石): 白色/紫色晶体
  { id: "CaF2", name: "氟化钙(萤石)", formula: "CaF₂", category: "salt", phase: "solid", color: "#d8d0e0" },
  // 硫氰化钾: 无色晶体
  { id: "KSCN", name: "硫氰化钾", formula: "KSCN", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硝酸铅: 无色晶体
  { id: "Pb(NO3)2", name: "硝酸铅", formula: "Pb(NO₃)₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯化银: 白色凝乳状沉淀
  { id: "AgCl", name: "氯化银", formula: "AgCl", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸钡: 白色沉淀
  { id: "BaSO4", name: "硫酸钡", formula: "BaSO₄", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫化亚铁: 黑褐色固体
  { id: "FeS", name: "硫化亚铁", formula: "FeS", category: "salt", phase: "solid", color: "#4a3c30" },
  // 氯化铜: 绿色晶体(无水棕黄色)
  { id: "CuCl2", name: "氯化铜", formula: "CuCl₂", category: "salt", phase: "solid", color: "#4a8a5a" },
  // 氯化镁: 白色晶体
  { id: "MgCl2", name: "氯化镁", formula: "MgCl₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸锌: 白色晶体
  { id: "ZnSO4", name: "硫酸锌", formula: "ZnSO₄", category: "salt", phase: "solid", color: "#f0ede8" },
  // 氯化锌: 白色固体
  { id: "ZnCl2", name: "氯化锌", formula: "ZnCl₂", category: "salt", phase: "solid", color: "#f0ede8" },
  // 硫酸锰: 淡粉红色晶体
  { id: "MnSO4", name: "硫酸锰", formula: "MnSO₄", category: "salt", phase: "solid", color: "#e8b0b0" },
  // 碳酸钠溶液: 无色透明
  { id: "Na2CO3_solution", name: "碳酸钠溶液", formula: "Na₂CO₃(aq)", category: "salt", phase: "liquid", color: "#dce8ec" },

  // ==================== 金属单质 (固体) ====================
  // 钠: 银白色柔软金属
  { id: "Na", name: "钠", formula: "Na", category: "metal", phase: "solid", color: "#c0c0c0" },
  // 钾: 银白色金属，比钠更软
  { id: "K", name: "钾", formula: "K", category: "metal", phase: "solid", color: "#b8b8b8" },
  // 镁: 银白色金属
  { id: "Mg", name: "镁", formula: "Mg", category: "metal", phase: "solid", color: "#d0d0d0" },
  // 铝: 银白色轻金属
  { id: "Al", name: "铝", formula: "Al", category: "metal", phase: "solid", color: "#c8c8c8" },
  // 铁: 银灰色金属
  { id: "Fe", name: "铁", formula: "Fe", category: "metal", phase: "solid", color: "#707070" },
  // 铁粉: 黑灰色粉末
  { id: "Fe_powder", name: "铁粉", formula: "Fe(粉)", category: "metal", phase: "solid", color: "#484848" },
  // 锌: 青白色金属
  { id: "Zn", name: "锌", formula: "Zn", category: "metal", phase: "solid", color: "#a8b0b8" },
  // 铜: 紫红色金属
  { id: "Cu", name: "铜", formula: "Cu", category: "metal", phase: "solid", color: "#b87333" },
  // 银: 银白色金属
  { id: "Ag", name: "银", formula: "Ag", category: "metal", phase: "solid", color: "#c0c0c0" },

  // ==================== 非金属单质 ====================
  // 碳(活性炭): 黑色固体
  { id: "C", name: "碳(活性炭)", formula: "C", category: "nonmetal", phase: "solid", color: "#1a1a1a" },
  // 硫: 黄色固体
  { id: "S", name: "硫", formula: "S", category: "nonmetal", phase: "solid", color: "#e8c820" },
  // 红磷: 暗红色粉末
  { id: "P", name: "磷(红磷)", formula: "P", category: "nonmetal", phase: "solid", color: "#a03020" },
  // 硅: 灰黑色固体，有金属光泽
  { id: "Si", name: "硅", formula: "Si", category: "nonmetal", phase: "solid", color: "#606870" },
  // 碘: 紫黑色晶体，有金属光泽
  { id: "I2", name: "碘", formula: "I₂", category: "nonmetal", phase: "solid", color: "#2d1a4e" },
  // 氯气: 黄绿色气体
  { id: "Cl2", name: "氯气", formula: "Cl₂", category: "nonmetal", phase: "gas", color: "#a8c830" },
  // 氮气: 无色无味气体
  { id: "N2", name: "氮气", formula: "N₂", category: "nonmetal", phase: "gas", color: "#d0d8dc" },
  // 氧气: 无色无味气体
  { id: "O2", name: "氧气", formula: "O₂", category: "nonmetal", phase: "gas", color: "#c8d8e8" },
  // 氢气: 无色无味气体
  { id: "H2", name: "氢气", formula: "H₂", category: "nonmetal", phase: "gas", color: "#dce0e4" },

  // ==================== 氧化物 ====================
  // 氧化钙(生石灰): 白色固体
  { id: "CaO", name: "氧化钙(生石灰)", formula: "CaO", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 氧化钠: 白色固体
  { id: "Na2O", name: "氧化钠", formula: "Na₂O", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 过氧化钠: 淡黄色粉末
  { id: "Na2O2", name: "过氧化钠", formula: "Na₂O₂", category: "oxide", phase: "solid", color: "#e0d080" },
  // 氧化镁: 白色固体
  { id: "MgO", name: "氧化镁", formula: "MgO", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 氧化铁(铁锈): 红棕色粉末
  { id: "Fe2O3", name: "氧化铁(铁锈)", formula: "Fe₂O₃", category: "oxide", phase: "solid", color: "#8b2500" },
  // 四氧化三铁: 黑色固体
  { id: "Fe3O4", name: "四氧化三铁", formula: "Fe₃O₄", category: "oxide", phase: "solid", color: "#1a1a1a" },
  // 氧化铜: 黑色粉末
  { id: "CuO", name: "氧化铜", formula: "CuO", category: "oxide", phase: "solid", color: "#1a1a1a" },
  // 氧化锌: 白色固体
  { id: "ZnO", name: "氧化锌", formula: "ZnO", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 氧化铝: 白色固体(刚玉极硬)
  { id: "Al2O3", name: "氧化铝", formula: "Al₂O₃", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 二氧化锰: 黑色粉末
  { id: "MnO2", name: "二氧化锰", formula: "MnO₂", category: "oxide", phase: "solid", color: "#1a1a1a" },
  // 二氧化硅(石英): 无色/白色固体
  { id: "SiO2", name: "二氧化硅", formula: "SiO₂", category: "oxide", phase: "solid", color: "#e8e4dc" },
  // 五氧化二磷: 白色粉末
  { id: "P2O5", name: "五氧化二磷", formula: "P₂O₅", category: "oxide", phase: "solid", color: "#f0ede8" },
  // 二氧化碳: 无色无味气体
  { id: "CO2", name: "二氧化碳", formula: "CO₂", category: "oxide", phase: "gas", color: "#d0d8dc" },
  // 一氧化碳: 无色无味有毒气体
  { id: "CO", name: "一氧化碳", formula: "CO", category: "oxide", phase: "gas", color: "#d0d8dc" },
  // 二氧化硫: 无色有刺激性气味气体
  { id: "SO2", name: "二氧化硫", formula: "SO₂", category: "oxide", phase: "gas", color: "#d0d8dc" },
  // 三氧化硫: 无色固体(常温)，刺激性
  { id: "SO3", name: "三氧化硫", formula: "SO₃", category: "oxide", phase: "solid", color: "#e8e0d0" },
  // 一氧化氮: 无色气体(遇空气变红棕)
  { id: "NO", name: "一氧化氮", formula: "NO", category: "oxide", phase: "gas", color: "#d0d8dc" },
  // 二氧化氮: 红棕色刺激性气体
  { id: "NO2", name: "二氧化氮", formula: "NO₂", category: "oxide", phase: "gas", color: "#8b4513" },
  // 水: 无色透明液体
  { id: "H2O", name: "水", formula: "H₂O", category: "oxide", phase: "liquid", color: "#d0e0f0" },
  // 过氧化氢(双氧水): 无色透明液体
  { id: "H2O2", name: "过氧化氢(双氧水)", formula: "H₂O₂", category: "oxide", phase: "liquid", color: "#d8e4f0" },

  // ==================== 气体 ====================
  // 甲烷: 无色无味气体
  { id: "CH4", name: "甲烷", formula: "CH₄", category: "gas", phase: "gas", color: "#dce0e4" },
  // 乙烯: 略有甜味的无色气体
  { id: "C2H4", name: "乙烯", formula: "C₂H₄", category: "gas", phase: "gas", color: "#dce0e4" },
  // 乙炔: 无色气体，微溶于水
  { id: "C2H2", name: "乙炔", formula: "C₂H₂", category: "gas", phase: "gas", color: "#dce0e4" },
  // 氨气: 无色有刺激性气味气体
  { id: "NH3", name: "氨气", formula: "NH₃", category: "gas", phase: "gas", color: "#d0dce0" },
  // 氯化氢: 无色有刺激性气味气体
  { id: "HCl_gas", name: "氯化氢(气)", formula: "HCl(g)", category: "gas", phase: "gas", color: "#d0d8dc" },
  // 硫化氢: 无色有臭鸡蛋气味气体
  { id: "H2S", name: "硫化氢", formula: "H₂S", category: "gas", phase: "gas", color: "#d0d890" },

  // ==================== 指示剂 (溶液→液体) ====================
  // 酚酞试液: 无色(碱中变红)
  { id: "酚酞", name: "酚酞试液", formula: "C₂₀H₁₄O₄", category: "indicator", phase: "liquid", color: "#e8e0d8" },
  // 石蕊试液: 紫色溶液
  { id: "石蕊", name: "石蕊试液", formula: "Litmus", category: "indicator", phase: "liquid", color: "#7040a0" },
  // 甲基橙: 橙黄色溶液
  { id: "甲基橙", name: "甲基橙指示剂", formula: "C₁₄H₁₄N₃NaO₃S", category: "indicator", phase: "liquid", color: "#d08020" },
  // 品红: 红色溶液
  { id: "品红", name: "品红溶液", formula: "Fuchsin", category: "indicator", phase: "liquid", color: "#a01030" },
  // 淀粉溶液: 白色乳状液体
  { id: "淀粉", name: "淀粉溶液", formula: "(C₆H₁₀O₅)ₙ", category: "indicator", phase: "liquid", color: "#f0ece0" },
  // 溴水: 橙黄色溶液
  { id: "溴水", name: "溴水", formula: "Br₂(aq)", category: "indicator", phase: "liquid", color: "#c07020" },
  // 酸性高锰酸钾: 深紫色溶液
  { id: "酸性KMnO4", name: "酸性高锰酸钾", formula: "KMnO₄/H₂SO₄", category: "indicator", phase: "liquid", color: "#5010a0" },
  // 澄清石灰水: 无色透明液体
  { id: "澄清石灰水", name: "澄清石灰水", formula: "Ca(OH)₂(aq)", category: "indicator", phase: "liquid", color: "#e0e8e0" },
];
