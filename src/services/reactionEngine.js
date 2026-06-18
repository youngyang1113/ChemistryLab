/**
 * 反应引擎服务
 * 
 * 作用：
 * 1. 提供可扩展的反应匹配算法
 * 2. 支持条件反应（温度、浓度、催化剂等）
 * 3. 支持反应优先级和竞争反应
 * 4. 为 AI 驱动反应预留接口
 * 5. 支持动态加载反应规则
 */

import { reactionRecipes, reagents } from "../state/recipes";
import { TEMPERATURE, PH } from "../constants/labConfig";

// 反应条件类型
export const CONDITION_TYPE = {
  TEMPERATURE: "temperature",    // 温度条件
  PH: "ph",                      // pH 条件
  CONCENTRATION: "concentration", // 浓度条件
  CATALYST: "catalyst",          // 催化剂条件
  PRESSURE: "pressure",          // 压力条件
  LIGHT: "light",                // 光照条件
};

// 反应状态枚举
export const REACTION_STATUS = {
  PENDING: "pending",
  REACTING: "reacting",
  COMPLETE: "complete",
  FAILED: "failed",
};

/**
 * 反应规则类
 */
class ReactionRule {
  constructor(recipe, key) {
    this.key = key;
    this.type = recipe.type;
    this.equation = recipe.equation;
    this.color = recipe.color;
    this.ph = recipe.ph;
    this.tempDelta = recipe.tempDelta;
    this.effect = recipe.effect;
    this.description = recipe.description;
    this.precipitateColor = recipe.precipitateColor;
    this.colorSequence = recipe.colorSequence;
    this.reactants = recipe.reactants || key.split("+");
    this.conditions = recipe.conditions || [];
    this.priority = recipe.priority || 0;
    this.catalyst = recipe.catalyst || null;
    this.reversible = recipe.reversible || false;
    this.equilibrium = recipe.equilibrium || null;
  }

  /**
   * 检查条件是否满足
   * @param {Object} context - 反应上下文
   * @returns {boolean} 条件是否满足
   */
  checkConditions(context) {
    if (this.conditions.length === 0) return true;

    return this.conditions.every((condition) => {
      switch (condition.type) {
        case CONDITION_TYPE.TEMPERATURE:
          return this.checkRange(context.temperature, condition);
        case CONDITION_TYPE.PH:
          return this.checkRange(context.ph, condition);
        case CONDITION_TYPE.CONCENTRATION:
          return this.checkConcentration(context, condition);
        case CONDITION_TYPE.CATALYST:
          return this.checkCatalyst(context, condition);
        case CONDITION_TYPE.PRESSURE:
          return this.checkRange(context.pressure || 1, condition);
        case CONDITION_TYPE.LIGHT:
          return context.light !== false;
        default:
          return true;
      }
    });
  }

  checkRange(value, condition) {
    if (condition.min !== undefined && value < condition.min) return false;
    if (condition.max !== undefined && value > condition.max) return false;
    return true;
  }

  checkConcentration(context, condition) {
    // 检查反应物浓度
    const reagent = context.beakerContents.find((r) => r === condition.reagent);
    return !!reagent;
  }

  checkCatalyst(context, condition) {
    // 检查催化剂是否存在
    return context.beakerContents.includes(condition.reagent);
  }

  /**
   * 计算反应结果
   * @param {Object} currentState - 当前状态
   * @returns {Object} 反应结果
   */
  calculateResult(currentState) {
    const newTemp = Math.max(
      TEMPERATURE.MIN_TEMP,
      Math.min(TEMPERATURE.MAX_TEMP, currentState.temperature + this.tempDelta)
    );

    return {
      liquidColor: this.color,
      temperature: newTemp,
      ph: this.ph,
      effect: this.effect,
      precipitateColor: this.precipitateColor,
      colorSequence: this.colorSequence,
      reaction: {
        key: this.key,
        type: this.type,
        equation: this.equation,
        description: this.description,
        color: this.color,
      },
    };
  }
}

/**
 * 反应引擎类
 */
class ReactionEngine {
  constructor() {
    this.rules = new Map();
    this.aiProvider = null;
    this.middleware = [];
    this.init();
  }

  /**
   * 初始化引擎，加载所有反应规则
   */
  init() {
    Object.entries(reactionRecipes).forEach(([key, recipe]) => {
      this.addRule(recipe, key);
    });
    console.log(`[ReactionEngine] 加载 ${this.rules.size} 条反应规则`);
  }

  /**
   * 添加反应规则
   * @param {Object} recipe - 反应配方
   * @param {string} key - 反应键
   */
  addRule(recipe, key) {
    const rule = new ReactionRule(recipe, key);
    this.rules.set(key, rule);

    // 为每个反应物建立索引
    rule.reactants.forEach((reagent) => {
      if (!this.reagentIndex) this.reagentIndex = new Map();
      if (!this.reagentIndex.has(reagent)) {
        this.reagentIndex.set(reagent, []);
      }
      this.reagentIndex.get(reagent).push(key);
    });
  }

  /**
   * 移除反应规则
   * @param {string} key - 反应键
   */
  removeRule(key) {
    this.rules.delete(key);
  }

  /**
   * 动态加载反应规则
   * @param {Array} recipes - 反应配方数组
   */
  loadRules(recipes) {
    recipes.forEach(({ recipe, key }) => {
      this.addRule(recipe, key);
    });
  }

  /**
   * 设置 AI 提供者
   * @param {Object} provider - AI 提供者
   */
  setAIProvider(provider) {
    this.aiProvider = provider;
  }

  /**
   * 添加中间件
   * @param {Function} middleware - 中间件函数
   */
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * 查找匹配的反应
   * @param {Array} existing - 已有试剂
   * @param {string} incoming - 新试剂
   * @param {Object} context - 反应上下文
   * @returns {ReactionRule|null} 匹配的反应规则
   */
  findReaction(existing, incoming, context = {}) {
    const allReactants = [...existing, incoming];

    // 1. 精确匹配（优先级最高）
    const exactMatch = this.findExactMatch(allReactants);
    if (exactMatch && exactMatch.checkConditions(context)) {
      return exactMatch;
    }

    // 2. 子集匹配
    const subsetMatch = this.findSubsetMatch(allReactants, context);
    if (subsetMatch) return subsetMatch;

    // 3. 二元匹配（向前兼容）
    const binaryMatch = this.findBinaryMatch(existing, incoming, context);
    if (binaryMatch) return binaryMatch;

    // 4. AI 驱动匹配（如果配置了 AI）
    if (this.aiProvider) {
      return this.findAIReaction(existing, incoming, context);
    }

    return null;
  }

  /**
   * 精确匹配
   */
  findExactMatch(reactants) {
    const sortedKey = [...reactants].sort().join("+");
    return this.rules.get(sortedKey) || null;
  }

  /**
   * 子集匹配
   */
  findSubsetMatch(reactants, context) {
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, rule] of this.rules) {
      const isSubset = rule.reactants.every((r) => reactants.includes(r));
      if (isSubset && rule.reactants.length === reactants.length) {
        // 计算匹配分数（考虑优先级和条件）
        const score = this.calculateMatchScore(rule, context);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = rule;
        }
      }
    }

    return bestMatch;
  }

  /**
   * 二元匹配
   */
  findBinaryMatch(existing, incoming, context) {
    for (const reagent of existing) {
      const key1 = `${reagent}+${incoming}`;
      const key2 = `${incoming}+${reagent}`;

      const rule = this.rules.get(key1) || this.rules.get(key2);
      if (rule && rule.checkConditions(context)) {
        return rule;
      }
    }
    return null;
  }

  /**
   * AI 驱动匹配
   */
  findAIReaction(existing, incoming, context) {
    // 调用 AI 提供者进行反应预测
    if (this.aiProvider && this.aiProvider.predictReaction) {
      const prediction = this.aiProvider.predictReaction(existing, incoming, context);
      if (prediction && prediction.reaction) {
        // 将 AI 预测的反应转换为规则
        return new ReactionRule(prediction.reaction, prediction.key || "ai_reaction");
      }
    }
    return null;
  }

  /**
   * 计算匹配分数
   */
  calculateMatchScore(rule, context) {
    let score = rule.priority * 10;

    // 条件满足度
    if (rule.checkConditions(context)) {
      score += 100;
    }

    // 温度影响
    if (rule.tempDelta > 0 && context.temperature < 50) {
      score += 10;
    }

    return score;
  }

  /**
   * 执行反应
   * @param {Array} existing - 已有试剂
   * @param {string} incoming - 新试剂
   * @param {Object} currentState - 当前状态
   * @returns {Object|null} 反应结果
   */
  executeReaction(existing, incoming, currentState) {
    const context = {
      temperature: currentState.temperature,
      ph: currentState.ph,
      beakerContents: currentState.beakerContents,
      pressure: currentState.pressure,
      light: currentState.light,
    };

    // 执行中间件
    let canProceed = true;
    for (const middleware of this.middleware) {
      const result = middleware({ existing, incoming, context, currentState });
      if (result === false) {
        canProceed = false;
        break;
      }
    }

    if (!canProceed) return null;

    // 查找反应
    const rule = this.findReaction(existing, incoming, context);
    if (!rule) return null;

    // 计算结果
    const result = rule.calculateResult(currentState);

    return {
      ...result,
      status: REACTION_STATUS.REACTING,
      timestamp: Date.now(),
    };
  }

  /**
   * 获取所有反应规则
   */
  getAllRules() {
    return Array.from(this.rules.values());
  }

  /**
   * 获取试剂相关的所有反应
   */
  getReactionsForReagent(reagentId) {
    const reactions = [];
    for (const [key, rule] of this.rules) {
      if (rule.reactants.includes(reagentId)) {
        reactions.push(rule);
      }
    }
    return reactions;
  }

  /**
   * 搜索反应
   */
  searchReactions(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllRules().filter(
      (rule) =>
        rule.equation.toLowerCase().includes(lowerQuery) ||
        rule.description.toLowerCase().includes(lowerQuery) ||
        rule.type.toLowerCase().includes(lowerQuery)
    );
  }
}

// 创建单例
let engineInstance = null;

export function getReactionEngine() {
  if (!engineInstance) {
    engineInstance = new ReactionEngine();
  }
  return engineInstance;
}

export function resetReactionEngine() {
  engineInstance = null;
}

export default {
  getReactionEngine,
  resetReactionEngine,
  CONDITION_TYPE,
  REACTION_STATUS,
};
