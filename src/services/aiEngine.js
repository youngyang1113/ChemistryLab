/**
 * AI 驱动实验引擎
 * 
 * 职责：
 * 1. 反应推理（作为本地 reactionEngine 的 fallback）
 * 2. 实验步骤生成
 * 3. 学生操作评估
 * 
 * 策略：
 * 1. 优先使用本地 reactionEngine
 * 2. 若无匹配 → 调用 AI
 * 3. AI 返回结构必须标准化
 */

import { getReactionEngine } from "./reactionEngine";
import {
  validateReactionResult,
  validateExperimentSteps,
  validateEvaluation,
  sanitizeReactionData,
  createDefaultReactionResult,
} from "./aiValidator";
import {
  SYSTEM_PROMPT,
  createReactionInferencePrompt,
  createExperimentStepsPrompt,
  createEvaluationPrompt,
  createSafetyAnalysisPrompt,
  createSuggestionPrompt,
} from "./aiPrompts";
import { getAIServiceManager } from "./aiService";
import { getReagentById } from "../state/recipes/reagentIndex";

// AI 引擎配置
const DEFAULT_CONFIG = {
  enableAI: true,
  confidenceThreshold: 0.5,
  maxRetries: 2,
  timeout: 30000,
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 分钟
};

/**
 * AI 驱动实验引擎类
 */
class AIEngine {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.reactionEngine = null;
    this.aiManager = null;
    this.cache = new Map();
    this.isInitialized = false;
  }

  /**
   * 初始化引擎
   */
  async initialize() {
    try {
      // 获取反应引擎实例
      this.reactionEngine = getReactionEngine();

      // 获取 AI 服务管理器
      this.aiManager = getAIServiceManager();

      // 初始化 AI 服务
      await this.aiManager.initialize();

      this.isInitialized = true;
      console.log("[AIEngine] 初始化成功");
      return true;
    } catch (error) {
      console.error("[AIEngine] 初始化失败:", error);
      this.isInitialized = false;
      return false;
    }
  }

  // ==================== 核心方法 ====================

  /**
   * 推理反应
   * 
   * 策略：
   * 1. 先尝试本地 reactionEngine
   * 2. 如果没有匹配且启用了 AI，调用 AI 推理
   * 3. 对 AI 输出进行校验
   * 
   * @param {Object} inputState - 输入状态
   * @returns {Promise<Object>} 反应结果
   */
  async inferReaction(inputState) {
    const { existing, incoming, context } = inputState;

    // 1. 先尝试本地反应引擎
    const localResult = this.tryLocalReaction(existing, incoming, context);
    if (localResult) {
      return {
        ...localResult,
        source: "local",
        confidence: 1.0,
      };
    }

    // 2. 如果未启用 AI，返回默认结果
    if (!this.config.enableAI) {
      return createDefaultReactionResult([...existing, incoming]);
    }

    // 3. 检查缓存
    const cacheKey = this.createCacheKey("reaction", [...existing, incoming].sort());
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, source: "cache" };
      }
    }

    // 4. 调用 AI 推理
    try {
      const aiResult = await this.callAIReaction(existing, incoming, context);

      // 校验 AI 输出
      const validation = validateReactionResult(aiResult);
      if (!validation.valid) {
        console.warn("[AIEngine] AI 输出校验失败:", validation.errors);
        return createDefaultReactionResult([...existing, incoming]);
      }

      // 规范化数据
      const sanitized = sanitizeReactionData(validation.data);

      // 缓存结果
      if (this.config.cacheEnabled && sanitized.confidence >= this.config.confidenceThreshold) {
        this.setCache(cacheKey, sanitized);
      }

      return {
        ...sanitized,
        source: "ai",
      };
    } catch (error) {
      console.error("[AIEngine] AI 推理失败:", error);
      return createDefaultReactionResult([...existing, incoming]);
    }
  }

  /**
   * 生成实验步骤
   * @param {string} goal - 实验目标
   * @param {Array} availableReagents - 可用试剂
   * @returns {Promise<Object>} 实验步骤
   */
  async generateExperiment(goal, availableReagents = []) {
    // 检查缓存
    const cacheKey = this.createCacheKey("experiment", goal);
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, source: "cache" };
      }
    }

    // 如果未启用 AI，返回默认模板
    if (!this.config.enableAI) {
      return this.createDefaultExperiment(goal);
    }

    try {
      // 获取可用试剂信息
      const reagentNames = availableReagents.map((id) => {
        const r = getReagentById(id);
        return r ? `${r.name}(${r.formula})` : id;
      });

      // 调用 AI 生成实验
      const aiResult = await this.callAIExperiment(goal, reagentNames);

      // 校验 AI 输出
      const validation = validateExperimentSteps(aiResult);
      if (!validation.valid) {
        console.warn("[AIEngine] 实验步骤校验失败:", validation.errors);
        return this.createDefaultExperiment(goal);
      }

      // 缓存结果
      if (this.config.cacheEnabled) {
        this.setCache(cacheKey, validation.data);
      }

      return {
        ...validation.data,
        source: "ai",
      };
    } catch (error) {
      console.error("[AIEngine] 实验生成失败:", error);
      return this.createDefaultExperiment(goal);
    }
  }

  /**
   * 评估学生实验操作
   * @param {Array} history - 操作历史
   * @param {string} goal - 实验目标
   * @returns {Promise<Object>} 评估结果
   */
  async evaluateExperiment(history, goal = "") {
    // 如果历史为空，返回默认评估
    if (!history || history.length === 0) {
      return {
        score: 0,
        feedback: "暂无操作记录",
        strengths: [],
        improvements: ["开始进行实验操作"],
        suggestions: [],
        safetyCompliance: true,
        source: "default",
      };
    }

    // 如果未启用 AI，返回基础评估
    if (!this.config.enableAI) {
      return this.createBasicEvaluation(history);
    }

    try {
      // 格式化历史数据
      const formattedHistory = this.formatHistory(history);

      // 调用 AI 评估
      const aiResult = await this.callAIEvaluation(formattedHistory, goal);

      // 校验 AI 输出
      const validation = validateEvaluation(aiResult);
      if (!validation.valid) {
        console.warn("[AIEngine] 评估结果校验失败:", validation.errors);
        return this.createBasicEvaluation(history);
      }

      return {
        ...validation.data,
        source: "ai",
      };
    } catch (error) {
      console.error("[AIEngine] 评估失败:", error);
      return this.createBasicEvaluation(history);
    }
  }

  /**
   * 获取实验建议
   * @param {Object} state - 当前实验状态
   * @returns {Promise<Object>} 建议
   */
  async getSuggestions(state) {
    if (!this.config.enableAI) {
      return {
        suggestions: [],
        currentAnalysis: "AI 功能未启用",
        source: "default",
      };
    }

    try {
      const prompt = createSuggestionPrompt(state);
      const result = await this.callAI(prompt);

      if (result && result.suggestions) {
        return {
          ...result,
          source: "ai",
        };
      }

      return {
        suggestions: [],
        currentAnalysis: "无法生成建议",
        source: "default",
      };
    } catch (error) {
      console.error("[AIEngine] 获取建议失败:", error);
      return {
        suggestions: [],
        currentAnalysis: "获取建议时出错",
        source: "error",
      };
    }
  }

  /**
   * 安全分析
   * @param {Object} reaction - 反应信息
   * @returns {Promise<Object>} 安全分析结果
   */
  async analyzeSafety(reaction) {
    if (!this.config.enableAI) {
      return {
        overallRisk: "medium",
        hazards: [],
        precautions: ["请在教师指导下进行实验"],
        source: "default",
      };
    }

    try {
      const prompt = createSafetyAnalysisPrompt(reaction);
      const result = await this.callAI(prompt);

      if (result && result.overallRisk) {
        return {
          ...result,
          source: "ai",
        };
      }

      return {
        overallRisk: "medium",
        hazards: [],
        precautions: ["无法进行安全分析，请咨询教师"],
        source: "default",
      };
    } catch (error) {
      console.error("[AIEngine] 安全分析失败:", error);
      return {
        overallRisk: "unknown",
        hazards: [],
        precautions: ["安全分析失败，请咨询教师"],
        source: "error",
      };
    }
  }

  // ==================== 内部方法 ====================

  /**
   * 尝试本地反应
   */
  tryLocalReaction(existing, incoming, context) {
    if (!this.reactionEngine) return null;

    try {
      const result = this.reactionEngine.findReaction(existing, incoming, context);
      return result;
    } catch (error) {
      console.warn("[AIEngine] 本地反应查找失败:", error);
      return null;
    }
  }

  /**
   * 调用 AI 反应推理
   */
  async callAIReaction(existing, incoming, context) {
    const reactants = [...existing, incoming];
    const prompt = createReactionInferencePrompt(reactants, context);
    return this.callAI(prompt);
  }

  /**
   * 调用 AI 生成实验
   */
  async callAIExperiment(goal, reagentNames) {
    const prompt = createExperimentStepsPrompt(goal, reagentNames);
    return this.callAI(prompt);
  }

  /**
   * 调用 AI 评估
   */
  async callAIEvaluation(history, goal) {
    const prompt = createEvaluationPrompt(history, goal);
    return this.callAI(prompt);
  }

  /**
   * 调用 AI 服务
   */
  async callAI(prompt) {
    if (!this.aiManager) {
      throw new Error("AI 服务未初始化");
    }

    const result = await this.aiManager.callService(
      "predictReaction",
      [], // reactants（已包含在 prompt 中）
      { prompt } // 传递完整 prompt
    );

    // 如果 AI 服务返回的是文本，尝试解析 JSON
    if (typeof result === "string") {
      return this.parseJSON(result);
    }

    return result;
  }

  /**
   * 解析 JSON 字符串
   */
  parseJSON(text) {
    try {
      // 尝试直接解析
      return JSON.parse(text);
    } catch {
      // 尝试提取 JSON 部分
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error("无法解析 AI 返回的 JSON");
        }
      }
      throw new Error("AI 返回的内容不包含有效的 JSON");
    }
  }

  /**
   * 格式化历史数据
   */
  formatHistory(history) {
    return history.map((h, i) => ({
      step: i + 1,
      reagentId: h.reagentId,
      reagentName: getReagentById(h.reagentId)?.name || h.reagentId,
      reaction: h.reaction
        ? {
            type: h.reaction.type,
            equation: h.reaction.equation,
          }
        : null,
      temperature: h.temperature,
      ph: h.ph,
      timestamp: h.timestamp,
    }));
  }

  /**
   * 创建默认实验模板
   */
  createDefaultExperiment(goal) {
    return {
      title: `实验：${goal}`,
      description: "请在教师指导下设计实验步骤",
      steps: [
        {
          order: 1,
          action: "准备实验器材和试剂",
          expectedResult: "器材和试剂准备就绪",
          riskLevel: "low",
        },
        {
          order: 2,
          action: "按照教师指导进行实验",
          expectedResult: "观察并记录实验现象",
          riskLevel: "low",
        },
      ],
      learningObjectives: ["理解化学反应原理", "掌握实验操作技能"],
      safetyNotes: ["佩戴护目镜", "在教师指导下进行"],
      source: "default",
    };
  }

  /**
   * 创建基础评估
   */
  createBasicEvaluation(history) {
    const reactionCount = history.filter((h) => h.reaction).length;
    const score = Math.min(100, reactionCount * 20);

    return {
      score,
      feedback: `完成了 ${history.length} 步操作，其中 ${reactionCount} 次发生反应`,
      strengths: history.length > 0 ? ["完成了实验操作"] : [],
      improvements: ["可以尝试更多的试剂组合"],
      suggestions: [],
      safetyCompliance: true,
      source: "basic",
    };
  }

  // ==================== 缓存管理 ====================

  createCacheKey(type, data) {
    const dataStr = Array.isArray(data) ? data.join(",") : String(data);
    return `${type}:${dataStr}`;
  }

  getFromCache(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.config.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // 限制缓存大小
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clearCache() {
    this.cache.clear();
  }

  // ==================== 配置管理 ====================

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig() {
    return { ...this.config };
  }

  isReady() {
    return this.isInitialized;
  }
}

// 创建单例
let engineInstance = null;

/**
 * 获取 AI 引擎实例
 */
export function getAIEngine(config) {
  if (!engineInstance) {
    engineInstance = new AIEngine(config);
  }
  return engineInstance;
}

/**
 * 重置 AI 引擎
 */
export function resetAIEngine() {
  if (engineInstance) {
    engineInstance.clearCache();
  }
  engineInstance = null;
}

export default {
  getAIEngine,
  resetAIEngine,
  AIEngine,
};
