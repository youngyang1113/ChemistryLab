// ==================== 类型 ====================
export type {
  PhaseType,
  Material,
  MaterialState,
  VesselState,
  PrecipitateState,
  GasState,
  EffectType,
  ActiveEffect,
  ParticleState,
  ReactionType,
  ReactionCondition,
  ReactionProduct,
  ReactionRule,
  ReactionResult,
  ChemistryEventType,
  ChemistryEvent,
  EventHandler,
  RuleMatchResult,
  RuleEngineConfig,
  StateSnapshot,
} from "./types";

// ==================== 事件系统 ====================
export { ChemistryEventBus, globalEventBus, useChemistryEvent } from "./EventBus";

// ==================== 物质状态 ====================
export {
  MaterialStateManager,
  VesselStateManager,
  registerMaterial,
  getMaterial,
  getAllMaterials,
} from "./MaterialState";

// ==================== 规则引擎 ====================
export { RuleEngine, createReactionRule } from "./RuleEngine";

// ==================== 反应引擎 ====================
export { ReactionEngine, useReactionEngine } from "./ReactionEngine";
export type { ReactionEngineConfig } from "./ReactionEngine";

// ==================== 化学数据 ====================
export { initMaterials, initReactionRules, REACTION_RULES } from "./ChemistryData";

// ==================== 视觉引擎 ====================
export { useVisualEngine } from "./useVisualEngine";
export type { VisualState3D, VisualEffect3D } from "./useVisualEngine";
