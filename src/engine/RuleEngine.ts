import type {
  ReactionRule,
  ReactionCondition,
  ReactionResult,
  ReactionType,
  EffectType,
  MaterialState,
  VesselState,
  ActiveEffect,
  ParticleState,
  RuleMatchResult,
  RuleEngineConfig,
} from "./types";
import { globalEventBus } from "./EventBus";
import { getMaterial } from "./MaterialState";

// ==================== 默认配置 ====================
const DEFAULT_CONFIG: RuleEngineConfig = {
  enableAI: false,
  maxConcurrentReactions: 5,
  defaultPriority: 0,
  enableReversible: true,
  enableKinetics: false,
};

// ==================== 规则引擎 ====================
export class RuleEngine {
  private rules = new Map<string, ReactionRule>();
  private rulesByReactant = new Map<string, Set<string>>();
  private activeReactions = new Map<string, { rule: ReactionRule; startTime: number }>();
  private config: RuleEngineConfig;

  constructor(config: Partial<RuleEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ==================== 规则注册 ====================

  registerRule(rule: ReactionRule): void {
    this.rules.set(rule.id, rule);
    for (const r of rule.reactants) {
      if (!this.rulesByReactant.has(r.materialId)) {
        this.rulesByReactant.set(r.materialId, new Set());
      }
      this.rulesByReactant.get(r.materialId)!.add(rule.id);
    }
  }

  registerRules(rules: ReactionRule[]): void {
    for (const rule of rules) this.registerRule(rule);
  }

  removeRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) return;
    for (const r of rule.reactants) {
      this.rulesByReactant.get(r.materialId)?.delete(ruleId);
    }
    this.rules.delete(ruleId);
  }

  getRule(ruleId: string): ReactionRule | undefined {
    return this.rules.get(ruleId);
  }

  getAllRules(): ReactionRule[] {
    return Array.from(this.rules.values());
  }

  // ==================== 反应匹配 ====================

  findMatchingRules(materialIds: string[]): RuleMatchResult[] {
    const candidateRuleIds = new Set<string>();
    for (const id of materialIds) {
      const ruleIds = this.rulesByReactant.get(id);
      if (ruleIds) {
        for (const rid of ruleIds) candidateRuleIds.add(rid);
      }
    }

    const results: RuleMatchResult[] = [];

    for (const ruleId of candidateRuleIds) {
      const rule = this.rules.get(ruleId);
      if (!rule) continue;

      const reactantIds = rule.reactants.map((r) => r.materialId);
      const allPresent = reactantIds.every((id) => materialIds.includes(id));
      if (!allPresent) continue;

      const matchResult = this.evaluateConditions(rule, materialIds);
      results.push({
        rule,
        confidence: matchResult.satisfied ? 1 : 0.5,
        missingConditions: matchResult.missing,
      });
    }

    results.sort((a, b) => {
      if (a.confidence !== b.confidence) return b.confidence - a.confidence;
      return b.rule.priority - a.rule.priority;
    });

    return results;
  }

  // ==================== 条件评估 ====================

  evaluateConditions(
    rule: ReactionRule,
    materialIds: string[],
    vessel?: VesselState
  ): { satisfied: boolean; missing: ReactionCondition[] } {
    const missing: ReactionCondition[] = [];

    for (const cond of rule.conditions) {
      if (!this.checkCondition(cond, vessel)) {
        missing.push(cond);
      }
    }

    return { satisfied: missing.length === 0, missing };
  }

  private checkCondition(cond: ReactionCondition, vessel?: VesselState): boolean {
    switch (cond.type) {
      case "temperature":
        if (!vessel) return true;
        return this.checkNumeric(vessel.temperature, cond);
      case "pressure":
        if (!vessel) return true;
        return this.checkNumeric(vessel.pressure, cond);
      case "ph":
        if (!vessel) return true;
        return this.checkNumeric(vessel.ph, cond);
      case "catalyst":
        if (!vessel || !cond.catalystId) return false;
        return vessel.materials.some((m) => m.materialId === cond.catalystId);
      case "concentration":
        return true;
      case "light":
        return true;
      default:
        return true;
    }
  }

  private checkNumeric(value: number, cond: ReactionCondition): boolean {
    switch (cond.operator) {
      case "gt": return value > (cond.value as number);
      case "lt": return value < (cond.value as number);
      case "eq": return Math.abs(value - (cond.value as number)) < 0.01;
      case "gte": return value >= (cond.value as number);
      case "lte": return value <= (cond.value as number);
      case "between": {
        const [min, max] = cond.value as [number, number];
        return value >= min && value <= max;
      }
      default:
        return true;
    }
  }

  // ==================== 执行反应 ====================

  executeReaction(ruleId: string, vessel: VesselState): ReactionResult | null {
    const rule = this.rules.get(ruleId);
    if (!rule) return null;

    if (this.activeReactions.size >= this.config.maxConcurrentReactions) {
      return null;
    }

    for (const reactant of rule.reactants) {
      const ms = vessel.materialManager.get(reactant.materialId);
      if (!ms || ms.amount < reactant.stoichiometry) {
        return null;
      }
    }

    globalEventBus.emit("reaction:started", { ruleId, equation: rule.equation }, "RuleEngine");

    for (const reactant of rule.reactants) {
      vessel.materialManager.remove(reactant.materialId, reactant.stoichiometry);
    }

    const products: MaterialState[] = [];
    for (const product of rule.products) {
      const ms = vessel.materialManager.add(product.materialId, product.stoichiometry);
      if (ms && product.phase) {
        vessel.materialManager.changePhase(product.materialId, product.phase, "reaction");
      }
      if (ms) products.push(ms);
    }

    const effects = this.createEffects(rule.effects, rule, vessel);

    const tempDelta = rule.tempDelta;
    if (tempDelta !== 0) {
      vessel.setTemperature(vessel.temperature + tempDelta);
    }

    if (rule.phChange !== 0) {
      vessel.setPh(vessel.ph + rule.phChange);
    }

    this.activeReactions.set(ruleId, { rule, startTime: Date.now() });

    const result: ReactionResult = {
      ruleId,
      success: true,
      products,
      effects,
      tempDelta,
      phChange: rule.phChange,
      equation: rule.equation,
      description: rule.description,
    };

    globalEventBus.emit("reaction:completed", result, "RuleEngine");

    setTimeout(() => {
      this.activeReactions.delete(ruleId);
      for (const effect of effects) {
        globalEventBus.emit("effect:ended", { type: effect.type }, "RuleEngine");
      }
    }, 3000);

    return result;
  }

  // ==================== 效果创建 ====================

  private createEffects(types: EffectType[], rule: ReactionRule, vessel: VesselState): ActiveEffect[] {
    return types.map((type) => {
      const effect: ActiveEffect = {
        type,
        intensity: this.calculateIntensity(rule),
        color: this.getEffectColor(type, rule),
        duration: 3000,
        elapsed: 0,
        particles: this.generateParticles(type, vessel),
      };
      globalEventBus.emit("effect:started", effect, "RuleEngine");
      return effect;
    });
  }

  private calculateIntensity(rule: ReactionRule): number {
    return Math.min(1, Math.abs(rule.tempDelta) / 50 + 0.3);
  }

  private getEffectColor(type: EffectType, rule: ReactionRule): string {
    const defaultColors: Record<string, string> = {
      bubble: "#aaddff",
      precipitate: "#f5f5f4",
      smoke: "#aaaaaa",
      heat_glow: "#ff6600",
      color_change: rule.products[0]?.color ?? "#ffffff",
      spark: "#ffcc00",
      steam: "#ffffff",
      explosion: "#ff4400",
    };
    return defaultColors[type] ?? "#ffffff";
  }

  private generateParticles(type: EffectType, vessel: VesselState): ParticleState[] {
    const count = type === "bubble" ? 20 : type === "smoke" ? 15 : 10;
    const particles: ParticleState[] = [];

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      particles.push({
        id: `p_${Date.now()}_${i}`,
        position: [Math.cos(theta) * r, -0.5 + Math.random() * 0.2, Math.sin(theta) * r],
        velocity: [
          (Math.random() - 0.5) * 0.1,
          type === "precipitate" ? -(0.2 + Math.random() * 0.3) : 0.2 + Math.random() * 0.3,
          (Math.random() - 0.5) * 0.1,
        ],
        size: 0.02 + Math.random() * 0.03,
        opacity: 0.6 + Math.random() * 0.3,
        life: 0,
        maxLife: 2 + Math.random() * 2,
        color: "#ffffff",
      });
    }

    return particles;
  }

  // ==================== 自动匹配执行 ====================

  autoMatch(vessel: VesselState): ReactionResult | null {
    const materialIds = vessel.materials.map((m) => m.materialId);
    const matches = this.findMatchingRules(materialIds);

    for (const match of matches) {
      if (match.confidence >= 1) {
        const result = this.executeReaction(match.rule.id, vessel);
        if (result) return result;
      }
    }

    return null;
  }

  // ==================== 状态管理 ====================

  getActiveReactions(): { ruleId: string; rule: ReactionRule; elapsed: number }[] {
    const now = Date.now();
    return Array.from(this.activeReactions.entries()).map(([id, { rule, startTime }]) => ({
      ruleId: id,
      rule,
      elapsed: now - startTime,
    }));
  }

  reset(): void {
    this.activeReactions.clear();
  }

  getConfig(): RuleEngineConfig {
    return { ...this.config };
  }
}

// ==================== 规则工厂 ====================
export function createReactionRule(
  partial: Omit<ReactionRule, "priority" | "reversible"> & Partial<Pick<ReactionRule, "priority" | "reversible">>
): ReactionRule {
  return {
    priority: 0,
    reversible: false,
    ...partial,
  };
}
