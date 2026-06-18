/**
 * DSL 规则示例
 * 
 * 展示如何使用反应规则 DSL 定义复杂反应
 */

import { condition, logic, when, ReactionRuleDefinition, ReactionChain, LOGIC_OP, CONDITION_OP } from "../../services/reactionDSL";

// ==================== 条件反应示例 ====================

/**
 * 铝热反应（需要高温触发）
 */
export const aluminothermicReaction = new ReactionRuleDefinition({
  id: "aluminothermic_Fe2O3",
  name: "铝热反应",
  reactants: ["Al", "Fe2O3"],
  products: ["Fe", "Al2O3"],
  equation: "2Al + Fe₂O₃ →(高温) 2Fe + Al₂O₃",
  type: "氧化还原反应",
  effect: "smoke",
  color: "#ef4444",
  ph: 7,
  tempDelta: 100,
  description: "铝热反应，需要高温触发，可用于焊接铁轨",
  conditions: when.temperature.above(200), // 需要 200°C 以上
  priority: 10,
  kinetics: {
    activationEnergy: 50000, // 活化能
  },
  metadata: {
    precipitateColor: "#94a3b8",
    safetyLevel: "high",
    requiresProtectiveEquipment: true,
  },
});

/**
 * 电解水（需要通电条件）
 */
export const electrolysisWater = new ReactionRuleDefinition({
  id: "electrolysis_H2O",
  name: "电解水",
  reactants: ["H2O"],
  products: ["H2", "O2"],
  equation: "2H₂O →(通电) 2H₂↑ + O₂↑",
  type: "分解反应",
  effect: "gas",
  color: "#60a5fa",
  ph: 7,
  tempDelta: -10,
  description: "电解水产生氢气和氧气",
  conditions: condition("electricCurrent", CONDITION_OP.EQ, true),
  priority: 5,
  metadata: {
    gasProducts: ["H2", "O2"],
    volumeRatio: { H2: 2, O2: 1 },
  },
});

/**
 * 铁的锈蚀（需要氧气和水）
 */
export const ironRusting = new ReactionRuleDefinition({
  id: "rusting_Fe",
  name: "铁的锈蚀",
  reactants: ["Fe", "O2", "H2O"],
  products: ["Fe2O3"],
  equation: "4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ → 2Fe₂O₃·3H₂O",
  type: "氧化反应",
  effect: "none",
  color: "#b91c1c",
  ph: 7,
  tempDelta: 0,
  description: "铁在潮湿空气中缓慢氧化生锈",
  conditions: logic(LOGIC_OP.AND,
    when.catalyst("O2"),
    when.catalyst("H2O")
  ),
  priority: 1,
  probability: 0.1, // 低概率，模拟缓慢反应
  metadata: {
    timeScale: "slow",
    visualEffect: "gradualColorChange",
  },
});

/**
 * 浓硫酸稀释（放热反应，需要水）
 */
export const sulfuricAcidDilution = new ReactionRuleDefinition({
  id: "dilution_H2SO4",
  name: "浓硫酸稀释",
  reactants: ["H2SO4", "H2O"],
  products: ["H2SO4_dilute"],
  equation: "H₂SO₄(浓) + H₂O → H₂SO₄(稀) + 热量",
  type: "稀释反应",
  effect: "heat",
  color: "#f97316",
  ph: 1,
  tempDelta: 60,
  description: "浓硫酸稀释放出大量热，必须酸入水",
  conditions: when.catalyst("H2O"),
  priority: 8,
  metadata: {
    safetyWarning: "必须将酸缓慢加入水中，不能反加",
    mixingRatio: "1:10",
  },
});

/**
 * 催化分解过氧化氢（需要催化剂）
 */
export const catalyticDecompositionH2O2 = new ReactionRuleDefinition({
  id: "catalytic_H2O2",
  name: "催化分解过氧化氢",
  reactants: ["H2O2"],
  products: ["H2O", "O2"],
  equation: "2H₂O₂ →(MnO₂) 2H₂O + O₂↑",
  type: "分解反应",
  effect: "gas",
  color: "#bfdbfe",
  ph: 7,
  tempDelta: -5,
  description: "二氧化锰催化过氧化氢分解",
  conditions: when.catalyst("MnO2"),
  priority: 7,
  kinetics: {
    activationEnergy: 75000, // 催化剂降低活化能
  },
  metadata: {
    catalystRole: "降低活化能",
    gasProduct: "O2",
  },
});

// ==================== 反应链示例 ====================

/**
 * 铜与浓硝酸反应链
 * 第一步：铜与浓硝酸反应生成 NO₂
 * 第二步：NO₂ 溶于水生成 HNO₃ 和 NO
 */
export const copperNitricAcidChain = new ReactionChain({
  id: "chain_Cu_HNO3",
  name: "铜与浓硝酸反应链",
  steps: [
    {
      reaction: {
        id: "Cu_HNO3_concentrated",
        reactants: ["Cu", "HNO3"],
        equation: "Cu + 4HNO₃(浓) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O",
        type: "氧化还原反应",
        effect: "smoke",
        color: "#92400e",
        tempDelta: 30,
      },
      delay: 0,
    },
    {
      reaction: {
        id: "NO2_H2O",
        reactants: ["NO2", "H2O"],
        equation: "3NO₂ + H₂O → 2HNO₃ + NO",
        type: "氧化还原反应",
        effect: "gas",
        color: "#92400e",
        tempDelta: 5,
      },
      delay: 2000, // 2 秒后发生
      condition: when.catalyst("H2O"),
    },
  ],
});

/**
 * 氨的催化氧化链（工业制硝酸）
 */
export const ammoniaOxidationChain = new ReactionChain({
  id: "chain_NH3_oxidation",
  name: "氨的催化氧化链",
  steps: [
    {
      reaction: {
        id: "NH3_O2_catalytic",
        reactants: ["NH3", "O2"],
        equation: "4NH₃ + 5O₂ →(Pt/△) 4NO + 6H₂O",
        type: "氧化还原反应",
        effect: "heat",
        color: "#67e8f9",
        tempDelta: 50,
      },
      delay: 0,
      condition: when.catalyst("Pt"),
    },
    {
      reaction: {
        id: "NO_O2",
        reactants: ["NO", "O2"],
        equation: "2NO + O₂ → 2NO₂",
        type: "化合反应",
        effect: "none",
        color: "#92400e",
        tempDelta: 10,
      },
      delay: 1000,
    },
    {
      reaction: {
        id: "NO2_H2O",
        reactants: ["NO2", "H2O"],
        equation: "3NO₂ + H₂O → 2HNO₃ + NO",
        type: "氧化还原反应",
        effect: "none",
        color: "#92400e",
        tempDelta: 5,
      },
      delay: 1500,
      condition: when.catalyst("H2O"),
    },
  ],
});

// 导出所有 DSL 规则
export const dslRules = [
  aluminothermicReaction,
  electrolysisWater,
  ironRusting,
  sulfuricAcidDilution,
  catalyticDecompositionH2O2,
];

export const dslChains = [
  copperNitricAcidChain,
  ammoniaOxidationChain,
];

export default {
  dslRules,
  dslChains,
};
