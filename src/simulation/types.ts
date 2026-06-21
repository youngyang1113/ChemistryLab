// ==================== 反应时间线 ====================

export type ReactionPhase = "init" | "early" | "active" | "decay" | "stable";
export type ReactionState = "idle" | "running" | "finished";
export type ReactionKinetics = "violent" | "normal" | "slow" | "equilibrium";

export interface PhaseRange {
  phase: ReactionPhase;
  range: [number, number];
}

export interface Reaction {
  id: string;
  progress: number;
  duration: number;
  rate: number;
  state: ReactionState;
  phases: PhaseRange[];
  kinetics: ReactionKinetics;
  equation: string;
  description: string;
}

// ==================== 事件系统 ====================

export type SimEventType =
  | "GAS_PRODUCED"
  | "COLOR_CHANGED"
  | "PRECIPITATE_FORMED"
  | "TEMPERATURE_CHANGED"
  | "REACTION_STARTED"
  | "REACTION_PROGRESS"
  | "REACTION_FINISHED"
  | "SOLID_DISSOLVING"
  | "BUBBLE_BURST"
  | "HEAT_SHIMMER"
  | "EQUILIBRIUM_SHIFT";

export interface SimEvent<T = unknown> {
  type: SimEventType;
  payload: T;
  timestamp: number;
}

export type SimEventHandler<T = unknown> = (event: SimEvent<T>) => void;

// ==================== 气体粒子 ====================

export type GasType = "CO2" | "H2" | "NH3" | "Cl2" | "O2" | "SO2" | "NO2";

export interface GasParticle {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: number;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
  type: GasType;
  color: string;
  turbulence: number;
}

export interface GasEmitterConfig {
  type: GasType;
  rate: number;
  origin: { x: number; y: number };
  spread: { x: number; y: number };
  particleConfig: {
    baseSize: number;
    sizeVariance: number;
    baseSpeed: number;
    speedVariance: number;
    baseLifetime: number;
    lifetimeVariance: number;
    color: string;
    opacity: number;
    turbulence: number;
  };
}

// ==================== 颜色扩散 ====================

export interface ColorState {
  current: string;
  target: string;
  progress: number;
  diffusionOrigin: { x: number; y: number };
  diffusionRadius: number;
  noiseScale: number;
  noiseSpeed: number;
}

// ==================== 固体/沉淀 ====================

export type SolidState = "intact" | "dissolving" | "dissolved" | "precipitating" | "settled";

export interface SolidParticle {
  id: string;
  position: { x: number; y: number };
  size: number;
  maxSize: number;
  opacity: number;
  color: string;
  state: SolidState;
  velocity: { x: number; y: number };
  dissolveRate: number;
  settleTarget: number;
  rotation: number;
  rotationSpeed: number;
}

export interface PrecipitateLayer {
  particles: SolidParticle[];
  height: number;
  color: string;
  density: number;
}

// ==================== 热力系统 ====================

export type HeatLevel = "frozen" | "cold" | "room" | "warm" | "hot" | "extreme";

export interface HeatState {
  temperature: number;
  level: HeatLevel;
  shimmerIntensity: number;
  waveAmplitude: number;
  waveFrequency: number;
  bubbleFrequencyMultiplier: number;
  steamIntensity: number;
  glowIntensity: number;
  glowColor: string;
}

// ==================== 渲染层 ====================

export type LayerId = "background" | "liquid" | "solid" | "gas" | "effect" | "ui";

export interface RenderLayer {
  id: LayerId;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  visible: boolean;
  opacity: number;
  zIndex: number;
}

// ==================== 容器 ====================

export interface VesselGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  wallThickness: number;
  bottomThickness: number;
  cornerRadius: number;
  liquidArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==================== 仿真状态 ====================

export interface SimulationState {
  reactions: Reaction[];
  color: ColorState;
  temperature: HeatState;
  gases: GasParticle[];
  solids: SolidParticle[];
  precipitateLayer: PrecipitateLayer;
  liquidLevel: number;
  isReacting: boolean;
  time: number;
  deltaTime: number;
}
