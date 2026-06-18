/**
 * AI 输出校验器
 * 
 * 职责：
 * 1. 校验 AI 返回数据的结构完整性
 * 2. 防止非法数据污染状态
 * 3. 提供数据清理和规范化
 */

// 允许的反应类型
const VALID_REACTION_TYPES = [
  "中和反应", "产气反应", "沉淀反应", "置换反应",
  "氧化物反应", "氧化还原反应", "分解反应", "化合反应",
  "络合反应", "复分解反应", "单置换反应", "双置换反应",
];

// 允许的风险等级
const VALID_RISK_LEVELS = ["low", "medium", "high"];

// 允许的特效类型
const VALID_EFFECTS = [
  "none", "heat", "gas", "precipitate", "smoke", "colorChange",
];

// 允许的颜色格式（十六进制）
const COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

// pH 范围
const PH_MIN = 0;
const PH_MAX = 14;

// 温度变化范围
const TEMP_DELTA_MIN = -100;
const TEMP_DELTA_MAX = 200;

/**
 * 校验反应推理结果
 * @param {Object} data - AI 返回的数据
 * @returns {Object} 校验结果
 */
export function validateReactionResult(data) {
  const errors = [];
  const warnings = [];

  // 基础结构检查
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["返回数据不是有效的对象"],
      data: null,
    };
  }

  // reactants 检查
  if (!Array.isArray(data.reactants)) {
    errors.push("reactants 必须是数组");
  } else if (data.reactants.length === 0) {
    errors.push("reactants 不能为空");
  } else if (data.reactants.length > 5) {
    errors.push("reactants 数量不能超过 5");
  } else {
    // 检查每个反应物
    data.reactants.forEach((r, i) => {
      if (typeof r !== "string" || r.length === 0) {
        errors.push(`reactants[${i}] 必须是非空字符串`);
      } else if (r.length > 50) {
        errors.push(`reactants[${i}] 长度不能超过 50`);
      }
    });
  }

  // products 检查
  if (!Array.isArray(data.products)) {
    errors.push("products 必须是数组");
  } else if (data.products.length === 0) {
    errors.push("products 不能为空");
  } else {
    data.products.forEach((p, i) => {
      if (typeof p !== "string" || p.length === 0) {
        errors.push(`products[${i}] 必须是非空字符串`);
      }
    });
  }

  // equation 检查
  if (data.equation !== undefined) {
    if (typeof data.equation !== "string") {
      warnings.push("equation 应该是字符串");
    } else if (data.equation.length > 200) {
      warnings.push("equation 长度过长");
    }
  }

  // type 检查
  if (data.type !== undefined) {
    if (!VALID_REACTION_TYPES.includes(data.type)) {
      warnings.push(`type "${data.type}" 不在预定义列表中`);
    }
  }

  // effect 检查
  if (data.effect !== undefined) {
    if (!VALID_EFFECTS.includes(data.effect)) {
      warnings.push(`effect "${data.effect}" 无效，已重置为 "none"`);
      data.effect = "none";
    }
  }

  // color 检查
  if (data.color !== undefined) {
    if (!COLOR_REGEX.test(data.color)) {
      warnings.push("color 格式无效，应为 #RRGGBB");
      data.color = "#6b7280"; // 默认灰色
    }
  }

  // ph 检查
  if (data.ph !== undefined) {
    if (typeof data.ph !== "number" || data.ph < PH_MIN || data.ph > PH_MAX) {
      warnings.push(`ph 应在 ${PH_MIN}-${PH_MAX} 之间`);
      data.ph = Math.max(PH_MIN, Math.min(PH_MAX, Number(data.ph) || 7));
    }
  }

  // tempDelta 检查
  if (data.tempDelta !== undefined) {
    if (typeof data.tempDelta !== "number") {
      warnings.push("tempDelta 应该是数字");
      data.tempDelta = 0;
    } else if (data.tempDelta < TEMP_DELTA_MIN || data.tempDelta > TEMP_DELTA_MAX) {
      warnings.push(`tempDelta 应在 ${TEMP_DELTA_MIN}-${TEMP_DELTA_MAX} 之间`);
      data.tempDelta = Math.max(TEMP_DELTA_MIN, Math.min(TEMP_DELTA_MAX, data.tempDelta));
    }
  }

  // riskLevel 检查
  if (data.riskLevel !== undefined) {
    if (!VALID_RISK_LEVELS.includes(data.riskLevel)) {
      warnings.push(`riskLevel "${data.riskLevel}" 无效，已重置为 "medium"`);
      data.riskLevel = "medium";
    }
  }

  // explanation 检查
  if (data.explanation !== undefined) {
    if (typeof data.explanation !== "string") {
      warnings.push("explanation 应该是字符串");
    } else if (data.explanation.length > 2000) {
      data.explanation = data.explanation.substring(0, 2000);
      warnings.push("explanation 已截断至 2000 字符");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: errors.length === 0 ? data : null,
  };
}

/**
 * 校验实验步骤生成结果
 * @param {Object} data - AI 返回的数据
 * @returns {Object} 校验结果
 */
export function validateExperimentSteps(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["返回数据不是有效的对象"],
      data: null,
    };
  }

  // title 检查
  if (!data.title || typeof data.title !== "string") {
    errors.push("title 必须是非空字符串");
  } else if (data.title.length > 100) {
    data.title = data.title.substring(0, 100);
    warnings.push("title 已截断至 100 字符");
  }

  // description 检查
  if (data.description !== undefined && typeof data.description !== "string") {
    warnings.push("description 应该是字符串");
  }

  // steps 检查
  if (!Array.isArray(data.steps)) {
    errors.push("steps 必须是数组");
  } else if (data.steps.length === 0) {
    errors.push("steps 不能为空");
  } else if (data.steps.length > 20) {
    errors.push("steps 数量不能超过 20");
  } else {
    data.steps.forEach((step, i) => {
      if (!step || typeof step !== "object") {
        errors.push(`steps[${i}] 必须是对象`);
        return;
      }

      // step.order 检查
      if (step.order !== undefined && step.order !== i + 1) {
        warnings.push(`steps[${i}].order 应为 ${i + 1}`);
        step.order = i + 1;
      }

      // step.action 检查
      if (!step.action || typeof step.action !== "string") {
        errors.push(`steps[${i}].action 必须是非空字符串`);
      }

      // step.reagent 检查（如果存在）
      if (step.reagent !== undefined && typeof step.reagent !== "string") {
        warnings.push(`steps[${i}].reagent 应该是字符串`);
      }

      // step.expectedResult 检查（如果存在）
      if (step.expectedResult !== undefined && typeof step.expectedResult !== "string") {
        warnings.push(`steps[${i}].expectedResult 应该是字符串`);
      }

      // step.riskLevel 检查（如果存在）
      if (step.riskLevel !== undefined && !VALID_RISK_LEVELS.includes(step.riskLevel)) {
        warnings.push(`steps[${i}].riskLevel 无效`);
        step.riskLevel = "medium";
      }
    });
  }

  // learningObjectives 检查
  if (data.learningObjectives !== undefined) {
    if (!Array.isArray(data.learningObjectives)) {
      warnings.push("learningObjectives 应该是数组");
      data.learningObjectives = [];
    } else {
      data.learningObjectives = data.learningObjectives.filter(
        (obj) => typeof obj === "string" && obj.length <= 200
      );
    }
  }

  // safetyNotes 检查
  if (data.safetyNotes !== undefined) {
    if (!Array.isArray(data.safetyNotes)) {
      warnings.push("safetyNotes 应该是数组");
      data.safetyNotes = [];
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: errors.length === 0 ? data : null,
  };
}

/**
 * 校验学生操作评估结果
 * @param {Object} data - AI 返回的数据
 * @returns {Object} 校验结果
 */
export function validateEvaluation(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["返回数据不是有效的对象"],
      data: null,
    };
  }

  // score 检查
  if (data.score === undefined || data.score === null) {
    errors.push("score 是必填项");
  } else {
    const score = Number(data.score);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push("score 必须是 0-100 之间的数字");
    } else {
      data.score = Math.round(score);
    }
  }

  // feedback 检查
  if (!data.feedback || typeof data.feedback !== "string") {
    errors.push("feedback 必须是非空字符串");
  } else if (data.feedback.length > 1000) {
    data.feedback = data.feedback.substring(0, 1000);
    warnings.push("feedback 已截断至 1000 字符");
  }

  // strengths 检查
  if (data.strengths !== undefined) {
    if (!Array.isArray(data.strengths)) {
      warnings.push("strengths 应该是数组");
      data.strengths = [];
    } else {
      data.strengths = data.strengths.filter(
        (s) => typeof s === "string" && s.length <= 200
      );
    }
  }

  // improvements 检查
  if (data.improvements !== undefined) {
    if (!Array.isArray(data.improvements)) {
      warnings.push("improvements 应该是数组");
      data.improvements = [];
    } else {
      data.improvements = data.improvements.filter(
        (s) => typeof s === "string" && s.length <= 200
      );
    }
  }

  // suggestions 检查
  if (data.suggestions !== undefined) {
    if (!Array.isArray(data.suggestions)) {
      warnings.push("suggestions 应该是数组");
      data.suggestions = [];
    }
  }

  // safetyCompliance 检查
  if (data.safetyCompliance !== undefined) {
    if (typeof data.safetyCompliance !== "boolean") {
      warnings.push("safetyCompliance 应该是布尔值");
      data.safetyCompliance = Boolean(data.safetyCompliance);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: errors.length === 0 ? data : null,
  };
}

/**
 * 清理和规范化反应数据
 * @param {Object} data - 原始数据
 * @returns {Object} 清理后的数据
 */
export function sanitizeReactionData(data) {
  if (!data) return null;

  return {
    reactants: Array.isArray(data.reactants) 
      ? data.reactants.filter((r) => typeof r === "string").map((r) => r.trim())
      : [],
    products: Array.isArray(data.products)
      ? data.products.filter((p) => typeof p === "string").map((p) => p.trim())
      : [],
    equation: typeof data.equation === "string" ? data.equation.trim() : "",
    type: VALID_REACTION_TYPES.includes(data.type) ? data.type : "未知反应",
    effect: VALID_EFFECTS.includes(data.effect) ? data.effect : "none",
    color: COLOR_REGEX.test(data.color) ? data.color : "#6b7280",
    ph: typeof data.ph === "number" ? Math.max(0, Math.min(14, data.ph)) : 7,
    tempDelta: typeof data.tempDelta === "number" ? data.tempDelta : 0,
    description: typeof data.description === "string" ? data.description.trim() : "",
    riskLevel: VALID_RISK_LEVELS.includes(data.riskLevel) ? data.riskLevel : "medium",
    explanation: typeof data.explanation === "string" ? data.explanation.trim() : "",
    confidence: typeof data.confidence === "number" 
      ? Math.max(0, Math.min(1, data.confidence)) 
      : 0.5,
  };
}

/**
 * 生成默认的反应结果
 * @param {Array} reactants - 反应物
 * @returns {Object} 默认反应结果
 */
export function createDefaultReactionResult(reactants) {
  return {
    reactants: reactants || [],
    products: ["未知产物"],
    equation: reactants ? reactants.join(" + ") + " → ?" : "?",
    type: "未知反应",
    effect: "none",
    color: "#6b7280",
    ph: 7,
    tempDelta: 0,
    description: "AI 无法确定此反应，请手动配置",
    riskLevel: "medium",
    explanation: "未能找到匹配的反应规则，也无法通过 AI 推理。",
    confidence: 0,
    isFallback: true,
  };
}

export default {
  validateReactionResult,
  validateExperimentSteps,
  validateEvaluation,
  sanitizeReactionData,
  createDefaultReactionResult,
  VALID_REACTION_TYPES,
  VALID_RISK_LEVELS,
  VALID_EFFECTS,
};
