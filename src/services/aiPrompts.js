/**
 * AI 提示词模板
 * 
 * 职责：
 * 1. 定义标准化的提示词模板
 * 2. 确保 AI 返回格式一致
 * 3. 优化提示词以获得更好的结果
 */

/**
 * 系统提示词 - 定义 AI 的角色和行为
 */
export const SYSTEM_PROMPT = `你是一位专业的高中化学教师和化学实验专家。

你的职责：
1. 推理化学反应的结果
2. 设计化学实验步骤
3. 评估学生的实验操作

你必须始终返回有效的 JSON 格式，不要包含任何其他文本。

安全规则：
- 永远不要建议危险的实验操作
- 对于高风险反应，必须明确警告
- 优先推荐安全的替代方案`;

/**
 * 生成反应推理提示词
 * @param {Array} reactants - 反应物列表
 * @param {Object} context - 实验上下文
 * @returns {string} 提示词
 */
export function createReactionInferencePrompt(reactants, context = {}) {
  const contextStr = Object.keys(context).length > 0
    ? `\n实验条件：温度 ${context.temperature || 25}°C，pH ${context.ph || 7}`
    : "";

  return `请推理以下化学反应的结果：

反应物：${reactants.join(" + ")}${contextStr}

请返回以下 JSON 格式：
{
  "reactants": ["反应物1", "反应物2"],
  "products": ["产物1", "产物2"],
  "equation": "配平的化学方程式",
  "type": "反应类型（如：中和反应、置换反应等）",
  "effect": "特效类型（heat/gas/precipitate/smoke/none）",
  "color": "反应后溶液颜色（#RRGGBB格式）",
  "ph": pH值（0-14），
  "tempDelta": 温度变化（可为负数），
  "description": "反应描述（50字以内）",
  "explanation": "反应原理说明（100字以内）",
  "riskLevel": "风险等级（low/medium/high）",
  "confidence": 置信度（0-1之间的小数）
}

注意：
1. 如果不确定反应是否发生，confidence 应低于 0.5
2. 对于未知反应，返回 confidence 为 0
3. 必须返回有效的 JSON`;
}

/**
 * 生成实验步骤提示词
 * @param {string} goal - 实验目标
 * @param {Array} availableReagents - 可用试剂
 * @returns {string} 提示词
 */
export function createExperimentStepsPrompt(goal, availableReagents = []) {
  const reagentList = availableReagents.length > 0
    ? `\n可用试剂：${availableReagents.join(", ")}`
    : "";

  return `请设计一个化学实验来达成以下目标：

实验目标：${goal}${reagentList}

请返回以下 JSON 格式：
{
  "title": "实验名称",
  "description": "实验简介（50字以内）",
  "steps": [
    {
      "order": 1,
      "action": "操作描述",
      "reagent": "使用的试剂（如有）",
      "amount": "用量（如有）",
      "expectedResult": "预期结果",
      "riskLevel": "风险等级（low/medium/high）",
      "tip": "操作提示（如有）"
    }
  ],
  "learningObjectives": ["学习目标1", "学习目标2"],
  "safetyNotes": ["安全注意事项1", "安全注意事项2"],
  "expectedPhenomena": "预期观察到的现象",
  "principles": ["涉及的化学原理1", "原理2"]
}

要求：
1. 步骤必须清晰、可执行
2. 必须包含安全注意事项
3. 适合高中生操作
4. 返回有效的 JSON`;
}

/**
 * 生成学生操作评估提示词
 * @param {Array} history - 操作历史
 * @param {string} goal - 实验目标
 * @returns {string} 提示词
 */
export function createEvaluationPrompt(history, goal = "") {
  const historyStr = history.map((h, i) => {
    return `${i + 1}. 添加试剂: ${h.reagentId || "未知"}
   - 结果: ${h.reaction ? `发生反应 (${h.reaction.type})` : "无反应"}
   - 温度: ${h.temperature || 25}°C
   - pH: ${h.ph || 7}`;
  }).join("\n");

  const goalStr = goal ? `\n实验目标：${goal}` : "";

  return `请评估学生的化学实验操作：

操作历史：
${historyStr}${goalStr}

请返回以下 JSON 格式：
{
  "score": 分数（0-100），
  "feedback": "总体评价（100字以内）",
  "strengths": ["优点1", "优点2"],
  "improvements": ["改进建议1", "改进建议2"],
  "suggestions": [
    {
      "action": "建议的操作",
      "reason": "原因"
    }
  ],
  "safetyCompliance": true/false,
  "knowledgePoints": ["涉及的知识点1", "知识点2"],
  "commonMistakes": ["常见错误1（如有）"]
}

评估标准：
1. 操作是否符合化学实验规范
2. 是否理解反应原理
3. 安全意识
4. 实验效率
5. 返回有效的 JSON`;
}

/**
 * 生成安全分析提示词
 * @param {Object} reaction - 反应信息
 * @returns {string} 提示词
 */
export function createSafetyAnalysisPrompt(reaction) {
  return `请分析以下化学反应的安全性：

反应方程式：${reaction.equation || "未知"}
反应类型：${reaction.type || "未知"}
反应物：${(reaction.reactants || []).join(", ")}
产物：${(reaction.products || []).join(", ")}

请返回以下 JSON 格式：
{
  "overallRisk": "low/medium/high",
  "hazards": [
    {
      "type": "危害类型（如：腐蚀性、毒性、易燃性等）",
      "description": "具体危害",
      "severity": "low/medium/high"
    }
  ],
  "precautions": ["预防措施1", "预防措施2"],
  "emergencyMeasures": ["应急处理1", "应急处理2"],
  "requiredEquipment": ["需要的防护设备1", "设备2"],
  "disposalMethod": "废液处理方法",
  "ventilationRequired": true/false,
  "supervisionLevel": "none/recommended/required"
}

请务必全面考虑安全因素。`;
}

/**
 * 生成提示词（用于生成实验建议）
 * @param {Object} state - 当前实验状态
 * @returns {string} 提示词
 */
export function createSuggestionPrompt(state) {
  return `当前实验状态：
- 烧杯内容物：${(state.beakerContents || []).join(", ") || "空"}
- 温度：${state.temperature || 25}°C
- pH：${state.ph || 7}
- 液位：${state.liquidLevel || 0}%
- 当前反应：${state.currentReaction?.type || "无"}

请建议下一步可以进行的实验操作。

请返回以下 JSON 格式：
{
  "suggestions": [
    {
      "reagent": "建议添加的试剂",
      "reason": "原因说明",
      "expectedReaction": "预期反应",
      "learningGoal": "学习目标",
      "riskLevel": "low/medium/high"
    }
  ],
  "currentAnalysis": "当前实验状态分析",
  "alternativePaths": ["其他可行的实验方向"]
}

请提供 2-3 个建议，按推荐程度排序。`;
}

export default {
  SYSTEM_PROMPT,
  createReactionInferencePrompt,
  createExperimentStepsPrompt,
  createEvaluationPrompt,
  createSafetyAnalysisPrompt,
  createSuggestionPrompt,
};
