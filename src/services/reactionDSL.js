/**
 * 反应规则 DSL (Domain Specific Language)
 * 
 * 作用：
 * 1. 提供声明式的反应规则定义
 * 2. 支持复杂条件和约束
 * 3. 支持反应链和级联反应
 * 4. 便于 AI 生成反应规则
 */

// 条件操作符
export const CONDITION_OP = {
  EQ: "eq",           // 等于
  NEQ: "neq",         // 不等于
  GT: "gt",           // 大于
  GTE: "gte",         // 大于等于
  LT: "lt",           // 小于
  LTE: "lte",         // 小于等于
  IN: "in",           // 在范围内
  NOT_IN: "not_in",   // 不在范围内
  CONTAINS: "contains", // 包含
};

// 逻辑操作符
export const LOGIC_OP = {
  AND: "and",
  OR: "or",
  NOT: "not",
};

/**
 * 创建条件表达式
 */
export function condition(field, op, value) {
  return { type: "condition", field, op, value };
}

/**
 * 创建逻辑表达式
 */
export function logic(op, ...conditions) {
  return { type: "logic", op, conditions };
}

/**
 * 便捷条件创建函数
 */
export const when = {
  temperature: {
    above: (temp) => condition("temperature", CONDITION_OP.GT, temp),
    below: (temp) => condition("temperature", CONDITION_OP.LT, temp),
    between: (min, max) => logic(LOGIC_OP.AND, 
      condition("temperature", CONDITION_OP.GTE, min),
      condition("temperature", CONDITION_OP.LTE, max)
    ),
  },
  ph: {
    acidic: () => condition("ph", CONDITION_OP.LT, 7),
    basic: () => condition("ph", CONDITION_OP.GT, 7),
    neutral: () => condition("ph", CONDITION_OP.EQ, 7),
    range: (min, max) => logic(LOGIC_OP.AND,
      condition("ph", CONDITION_OP.GTE, min),
      condition("ph", CONDITION_OP.LTE, max)
    ),
  },
  catalyst: (id) => condition("beakerContents", CONDITION_OP.CONTAINS, id),
  pressure: {
    above: (p) => condition("pressure", CONDITION_OP.GT, p),
    below: (p) => condition("pressure", CONDITION_OP.LT, p),
  },
  light: () => condition("light", CONDITION_OP.EQ, true),
};

/**
 * 评估条件表达式
 */
export function evaluateCondition(expr, context) {
  if (!expr) return true;

  if (expr.type === "condition") {
    const fieldValue = getNestedValue(context, expr.field);
    return compareValues(fieldValue, expr.op, expr.value);
  }

  if (expr.type === "logic") {
    switch (expr.op) {
      case LOGIC_OP.AND:
        return expr.conditions.every((c) => evaluateCondition(c, context));
      case LOGIC_OP.OR:
        return expr.conditions.some((c) => evaluateCondition(c, context));
      case LOGIC_OP.NOT:
        return !evaluateCondition(expr.conditions[0], context);
      default:
        return true;
    }
  }

  return true;
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * 比较值
 */
function compareValues(fieldValue, op, expectedValue) {
  switch (op) {
    case CONDITION_OP.EQ:
      return fieldValue === expectedValue;
    case CONDITION_OP.NEQ:
      return fieldValue !== expectedValue;
    case CONDITION_OP.GT:
      return fieldValue > expectedValue;
    case CONDITION_OP.GTE:
      return fieldValue >= expectedValue;
    case CONDITION_OP.LT:
      return fieldValue < expectedValue;
    case CONDITION_OP.LTE:
      return fieldValue <= expectedValue;
    case CONDITION_OP.IN:
      return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
    case CONDITION_OP.NOT_IN:
      return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
    case CONDITION_OP.CONTAINS:
      return Array.isArray(fieldValue) && fieldValue.includes(expectedValue);
    default:
      return true;
  }
}

/**
 * 反应规则定义
 */
export class ReactionRuleDefinition {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.reactants = config.reactants;
    this.products = config.products || [];
    this.equation = config.equation;
    this.type = config.type;
    this.effect = config.effect;
    this.color = config.color;
    this.ph = config.ph;
    this.tempDelta = config.tempDelta;
    this.description = config.description;
    this.conditions = config.conditions || null;
    this.priority = config.priority || 0;
    this.reversible = config.reversible || false;
    this.catalyst = config.catalyst || null;
    this.inhibitors = config.inhibitors || [];
    this.probability = config.probability || 1.0;
    this.energyChange = config.energyChange || 0;
    this.entropyChange = config.entropyChange || 0;
    this.kinetics = config.kinetics || {};
    this.metadata = config.metadata || {};
  }

  /**
   * 检查是否满足条件
   */
  canReact(context) {
    // 检查抑制剂
    if (this.inhibitors.length > 0) {
      const hasInhibitor = this.inhibitors.some((inhibitor) =>
        context.beakerContents?.includes(inhibitor)
      );
      if (hasInhibitor) return false;
    }

    // 检查催化剂（如果需要）
    if (this.catalyst && !context.beakerContents?.includes(this.catalyst)) {
      return false;
    }

    // 检查条件表达式
    if (this.conditions) {
      return evaluateCondition(this.conditions, context);
    }

    return true;
  }

  /**
   * 计算反应速率
   */
  calculateRate(context) {
    let rate = 1.0;

    // 温度影响（阿伦尼乌斯方程简化版）
    if (this.kinetics.activationEnergy) {
      const tempK = (context.temperature || 25) + 273.15;
      const ea = this.kinetics.activationEnergy;
      rate *= Math.exp(-ea / (8.314 * tempK));
    }

    // 浓度影响
    if (this.kinetics.order) {
      const concentration = context.beakerContents?.length || 1;
      rate *= Math.pow(concentration, this.kinetics.order);
    }

    // 概率影响
    rate *= this.probability;

    return rate;
  }

  /**
   * 转换为旧格式（向后兼容）
   */
  toLegacyFormat() {
    return {
      type: this.type,
      equation: this.equation,
      color: this.color,
      ph: this.ph,
      tempDelta: this.tempDelta,
      effect: this.effect,
      description: this.description,
      precipitateColor: this.metadata.precipitateColor,
      colorSequence: this.metadata.colorSequence,
    };
  }
}

/**
 * 反应链定义
 */
export class ReactionChain {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.steps = config.steps; // Array of { reaction, delay, condition }
    this.currentStep = 0;
    this.isActive = false;
  }

  /**
   * 开始反应链
   */
  start() {
    this.currentStep = 0;
    this.isActive = true;
  }

  /**
   * 获取下一步
   */
  getNextStep(context) {
    if (!this.isActive || this.currentStep >= this.steps.length) {
      return null;
    }

    const step = this.steps[this.currentStep];

    // 检查步骤条件
    if (step.condition && !evaluateCondition(step.condition, context)) {
      return null;
    }

    return step;
  }

  /**
   * 推进到下一步
   */
  advance() {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.isActive = false;
    }
  }

  /**
   * 重置
   */
  reset() {
    this.currentStep = 0;
    this.isActive = false;
  }
}

/**
 * 规则验证器
 */
export function validateRule(rule) {
  const errors = [];

  if (!rule.id) errors.push("规则缺少 id");
  if (!rule.reactants || rule.reactants.length === 0) errors.push("规则缺少反应物");
  if (!rule.equation) errors.push("规则缺少方程式");
  if (!rule.type) errors.push("规则缺少类型");
  if (!rule.effect) errors.push("规则缺少效果");

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  condition,
  logic,
  when,
  evaluateCondition,
  ReactionRuleDefinition,
  ReactionChain,
  validateRule,
  CONDITION_OP,
  LOGIC_OP,
};
