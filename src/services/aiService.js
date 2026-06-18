/**
 * AI 服务接口
 * 
 * 作用：
 * 1. 定义 AI 服务的标准接口
 * 2. 支持多种 AI 后端（MIMO、OpenAI、本地模型）
 * 3. 提供 fallback 机制
 * 4. 支持流式响应
 */

import { CONDITION_OP } from "./reactionDSL";

// AI 后端类型
export const AI_BACKEND = {
  MIMO: "mimo",
  OPENAI: "openai",
  LOCAL: "local",
  CUSTOM: "custom",
};

// AI 任务类型
export const AI_TASK = {
  PREDICT_REACTION: "predict_reaction",
  EXPLAIN_REACTION: "explain_reaction",
  SUGGEST_NEXT: "suggest_next",
  VALIDATE_RULE: "validate_rule",
  GENERATE_RULE: "generate_rule",
  ANALYZE_SAFETY: "analyze_safety",
};

/**
 * AI 服务基类
 */
class AIServiceBase {
  constructor(config = {}) {
    this.config = config;
    this.isAvailable = false;
    this.lastError = null;
  }

  async initialize() {
    throw new Error("Not implemented");
  }

  async predictReaction(reactants, context) {
    throw new Error("Not implemented");
  }

  async explainReaction(reaction) {
    throw new Error("Not implemented");
  }

  async suggestNextStep(state) {
    throw new Error("Not implemented");
  }

  async validateRule(rule) {
    throw new Error("Not implemented");
  }

  async generateRule(description) {
    throw new Error("Not implemented");
  }

  async analyzeSafety(reaction) {
    throw new Error("Not implemented");
  }
}

/**
 * MIMO AI 服务
 */
class MIMOService extends AIServiceBase {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || import.meta.env.VITE_MIMO_API_KEY;
    this.apiUrl = config.apiUrl || "https://api.mimo.ai/v1/chat/completions";
    this.model = config.model || "mimo-7b";
  }

  async initialize() {
    if (!this.apiKey) {
      this.isAvailable = false;
      this.lastError = "API Key 未配置";
      return false;
    }

    try {
      // 测试连接
      const response = await this.callAPI("测试连接", { max_tokens: 10 });
      this.isAvailable = true;
      return true;
    } catch (e) {
      this.isAvailable = false;
      this.lastError = e.message;
      return false;
    }
  }

  async callAPI(prompt, options = {}) {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的化学教师和化学反应专家。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: options.stream || false,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    return response.json();
  }

  async callAPIStream(prompt, onChunk, options = {}) {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的化学教师和化学反应专家。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            fullText += content;
            if (onChunk) onChunk(content, fullText);
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    return fullText;
  }

  async predictReaction(reactants, context) {
    const prompt = `预测以下化学反应：
反应物：${reactants.join(" + ")}
条件：温度 ${context.temperature}°C，pH ${context.ph}

请返回 JSON 格式：
{
  "canReact": true/false,
  "equation": "化学方程式",
  "type": "反应类型",
  "effect": "效果类型",
  "color": "颜色",
  "ph": pH值,
  "tempDelta": 温度变化,
  "description": "描述"
}`;

    try {
      const result = await this.callAPI(prompt);
      const content = result.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch (e) {
      console.warn("[AI] 预测反应失败:", e);
      return null;
    }
  }

  async explainReaction(reaction) {
    const prompt = `请详细解释以下化学反应：
方程式：${reaction.equation}
类型：${reaction.type}
描述：${reaction.description}

请从以下方面解释：
1. 反应原理
2. 实验现象
3. 注意事项
4. 实际应用`;

    try {
      const result = await this.callAPI(prompt);
      return result.choices?.[0]?.message?.content;
    } catch (e) {
      console.warn("[AI] 解释反应失败:", e);
      return null;
    }
  }

  async suggestNextStep(state) {
    const prompt = `当前实验状态：
烧杯内容物：${state.beakerContents.join(", ")}
温度：${state.temperature}°C
pH：${state.ph}
当前效果：${state.effect}

请建议下一步可以进行的实验操作，返回 JSON 格式：
{
  "suggestions": [
    {
      "reagent": "试剂ID",
      "reason": "原因",
      "expectedReaction": "预期反应"
    }
  ]
}`;

    try {
      const result = await this.callAPI(prompt);
      const content = result.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch (e) {
      console.warn("[AI] 获取建议失败:", e);
      return null;
    }
  }

  async analyzeSafety(reaction) {
    const prompt = `分析以下化学反应的安全性：
方程式：${reaction.equation}
类型：${reaction.type}

请返回 JSON 格式：
{
  "riskLevel": "low/medium/high",
  "hazards": ["危害1", "危害2"],
  "precautions": ["注意事项1", "注意事项2"],
  "emergencyMeasures": ["应急措施1", "应急措施2"]
}`;

    try {
      const result = await this.callAPI(prompt);
      const content = result.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch (e) {
      console.warn("[AI] 安全分析失败:", e);
      return null;
    }
  }
}

/**
 * 本地 AI 服务（基于规则）
 */
class LocalAIService extends AIServiceBase {
  constructor(config = {}) {
    super(config);
    this.isAvailable = true;
  }

  async initialize() {
    return true;
  }

  async predictReaction(reactants, context) {
    // 使用本地规则进行预测
    // 这里可以调用反应引擎
    return null;
  }

  async explainReaction(reaction) {
    // 使用本地模板生成解释
    return this.generateLocalExplanation(reaction);
  }

  generateLocalExplanation(reaction) {
    const parts = [];
    parts.push(`## ${reaction.type}讲解`);
    parts.push("");
    parts.push(`**化学方程式：** ${reaction.equation}`);
    parts.push("");
    parts.push("### 反应原理");
    parts.push(reaction.description);
    parts.push("");

    if (reaction.type.includes("中和")) {
      parts.push("### 知识点");
      parts.push("- 中和反应是酸和碱反应生成盐和水");
      parts.push("- 强酸强碱中和，溶液呈中性 (pH=7)");
      parts.push("- 中和反应都是放热反应");
    } else if (reaction.type.includes("置换")) {
      parts.push("### 知识点");
      parts.push("- 置换反应是单质与化合物反应生成新的单质和化合物");
      parts.push("- 活泼金属可以置换不活泼金属");
    }

    return parts.join("\n");
  }
}

/**
 * AI 服务管理器
 */
class AIServiceManager {
  constructor() {
    this.services = new Map();
    this.primaryService = null;
    this.fallbackService = null;
  }

  /**
   * 注册 AI 服务
   */
  registerService(name, service) {
    this.services.set(name, service);
  }

  /**
   * 设置主服务
   */
  setPrimaryService(name) {
    this.primaryService = this.services.get(name);
  }

  /**
   * 设置 fallback 服务
   */
  setFallbackService(name) {
    this.fallbackService = this.services.get(name);
  }

  /**
   * 初始化所有服务
   */
  async initialize() {
    const results = {};
    for (const [name, service] of this.services) {
      results[name] = await service.initialize();
    }
    return results;
  }

  /**
   * 调用 AI 服务（带 fallback）
   */
  async callService(method, ...args) {
    // 尝试主服务
    if (this.primaryService && this.primaryService.isAvailable) {
      try {
        return await this.primaryService[method](...args);
      } catch (e) {
        console.warn(`[AI] 主服务调用失败:`, e);
      }
    }

    // 尝试 fallback 服务
    if (this.fallbackService && this.fallbackService.isAvailable) {
      try {
        return await this.fallbackService[method](...args);
      } catch (e) {
        console.warn(`[AI] Fallback 服务调用失败:`, e);
      }
    }

    return null;
  }

  /**
   * 预测反应
   */
  async predictReaction(reactants, context) {
    return this.callService("predictReaction", reactants, context);
  }

  /**
   * 解释反应
   */
  async explainReaction(reaction) {
    return this.callService("explainReaction", reaction);
  }

  /**
   * 获取建议
   */
  async suggestNextStep(state) {
    return this.callService("suggestNextStep", state);
  }

  /**
   * 安全分析
   */
  async analyzeSafety(reaction) {
    return this.callService("analyzeSafety", reaction);
  }
}

// 创建全局实例
let managerInstance = null;

export function getAIServiceManager() {
  if (!managerInstance) {
    managerInstance = new AIServiceManager();

    // 注册默认服务
    const mimoService = new MIMOService();
    const localService = new LocalAIService();

    managerInstance.registerService("mimo", mimoService);
    managerInstance.registerService("local", localService);

    // 设置主服务和 fallback
    managerInstance.setPrimaryService("mimo");
    managerInstance.setFallbackService("local");
  }

  return managerInstance;
}

export function resetAIServiceManager() {
  managerInstance = null;
}

export default {
  getAIServiceManager,
  resetAIServiceManager,
  AI_BACKEND,
  AI_TASK,
  MIMOService,
  LocalAIService,
  AIServiceManager,
};
