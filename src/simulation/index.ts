// ==================== 类型 ====================
export type {
  ReactionPhase,
  ReactionState,
  ReactionKinetics,
  PhaseRange,
  Reaction,
  SimEventType,
  SimEvent,
  SimEventHandler,
  GasType,
  GasParticle,
  GasEmitterConfig,
  ColorState,
  SolidState,
  SolidParticle,
  PrecipitateLayer,
  HeatLevel,
  HeatState,
  LayerId,
  RenderLayer,
  VesselGeometry,
  SimulationState,
} from "./types";

// ==================== 事件系统 ====================
export { SimEventBus, simEventBus } from "./SimEventBus";

// ==================== 反应时间线 ====================
export { ReactionTimeline, createReaction, getReactionPhase, getPhaseProgress, isReactionActive } from "./ReactionTimeline";

// ==================== 颜色扩散 ====================
export { ColorDiffusion, noise2D } from "./ColorDiffusion";

// ==================== 气体粒子 ====================
export { GasParticleSystem } from "./GasParticleSystem";

// ==================== 热力系统 ====================
export { HeatTemperature } from "./HeatTemperature";

// ==================== 固体/沉淀 ====================
export { SolidPrecipitate } from "./SolidPrecipitate";

// ==================== 层渲染器 ====================
export { LayerRenderer } from "./LayerRenderer";

// ==================== 仿真引擎 ====================
export { SimulationEngine } from "./SimulationEngine";
export type { SimulationConfig } from "./SimulationEngine";

// ==================== React 绑定 ====================
export { useSimulationEngine } from "./useSimulationEngine";
