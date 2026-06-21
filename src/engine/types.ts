// ==================== 物质相态 ====================
export type PhaseType = "solid" | "liquid" | "gas" | "aqueous";

// ==================== 物质定义 ====================
export interface Material {
  id: string;
  name: string;
  formula: string;
  phase: PhaseType;
  color: string;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  molarMass?: number;
  hazards?: string[];
}

// ==================== 物质状态 ====================
export interface MaterialState {
  materialId: string;
  phase: PhaseType;
  amount: number;           // mol
  temperature: number;      // °C
  concentration?: number;   // mol/L
  color: string;
  isActive: boolean;
}

// ==================== 容器状态 ====================
export interface VesselState {
  id: string;
  type: "beaker" | "testTube" | "flask";
  materials: MaterialState[];
  totalVolume: number;      // mL
  temperature: number;      // °C
  pressure: number;         // atm
  ph: number;
  liquidLevel: number;      // 0-1
  liquidColor: string;
  precipitates: PrecipitateState[];
  gases: GasState[];
  effects: ActiveEffect[];
}

export interface PrecipitateState {
  materialId: string;
  color: string;
  amount: number;
  settledRatio: number;     // 0-1
}

export interface GasState {
  materialId: string;
  color: string;
  bubbleCount: number;
  riseSpeed: number;
}

// ==================== 效果系统 ====================
export type EffectType =
  | "none"
  | "bubble"
  | "precipitate"
  | "smoke"
  | "heat_glow"
  | "color_change"
  | "spark"
  | "steam"
  | "explosion";

export interface ActiveEffect {
  type: EffectType;
  intensity: number;        // 0-1
  color?: string;
  duration: number;         // ms
  elapsed: number;          // ms
  particles: ParticleState[];
}

export interface ParticleState {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

// ==================== 反应系统 ====================
export type ReactionType =
  | "neutralization"
  | "precipitation"
  | "gas_production"
  | "displacement"
  | "redox"
  | "decomposition"
  | "combination"
  | "complexation"
  | "combustion"
  | "acid_base";

export interface ReactionCondition {
  type: "temperature" | "pressure" | "catalyst" | "concentration" | "ph" | "light";
  operator: "gt" | "lt" | "eq" | "gte" | "lte" | "between";
  value: number | string | [number, number];
  catalystId?: string;
}

export interface ReactionProduct {
  materialId: string;
  phase: PhaseType;
  stoichiometry: number;
  color?: string;
}

export interface ReactionRule {
  id: string;
  name: string;
  type: ReactionType;
  reactants: { materialId: string; stoichiometry: number }[];
  products: ReactionProduct[];
  conditions: ReactionCondition[];
  effects: EffectType[];
  equation: string;
  description: string;
  tempDelta: number;
  phChange: number;
  priority: number;
  reversible: boolean;
  rateConstant?: number;
  activationEnergy?: number;
  metadata?: Record<string, unknown>;
}

export interface ReactionResult {
  ruleId: string;
  success: boolean;
  products: MaterialState[];
  effects: ActiveEffect[];
  tempDelta: number;
  phChange: number;
  equation: string;
  description: string;
}

// ==================== 事件系统 ====================
export type ChemistryEventType =
  | "material:added"
  | "material:removed"
  | "material:phase_changed"
  | "reaction:started"
  | "reaction:progress"
  | "reaction:completed"
  | "reaction:failed"
  | "vessel:temperature_changed"
  | "vessel:ph_changed"
  | "effect:started"
  | "effect:updated"
  | "effect:ended"
  | "state:reset"
  | "state:snapshot"
  | "state:restored";

export interface ChemistryEvent<T = unknown> {
  type: ChemistryEventType;
  payload: T;
  timestamp: number;
  source: string;
}

export type EventHandler<T = unknown> = (event: ChemistryEvent<T>) => void;

// ==================== 规则引擎 ====================
export interface RuleMatchResult {
  rule: ReactionRule;
  confidence: number;       // 0-1
  missingConditions: ReactionCondition[];
}

export interface RuleEngineConfig {
  enableAI: boolean;
  maxConcurrentReactions: number;
  defaultPriority: number;
  enableReversible: boolean;
  enableKinetics: boolean;
}

// ==================== 快照系统 ====================
export interface StateSnapshot {
  vessel: VesselState;
  timestamp: number;
  reactionLog: ReactionResult[];
}
