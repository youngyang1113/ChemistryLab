import type {
  ReactionRule,
  ReactionResult,
  VesselState,
  StateSnapshot,
  RuleEngineConfig,
} from "./types";
import { ChemistryEventBus, globalEventBus } from "./EventBus";
import { MaterialStateManager, VesselStateManager, registerMaterial, getMaterial } from "./MaterialState";
import { RuleEngine, createReactionRule } from "./RuleEngine";

// ==================== 化学反应引擎 ====================

export interface ReactionEngineConfig {
  vesselId: string;
  vesselType: "beaker" | "testTube" | "flask";
  ruleConfig?: Partial<RuleEngineConfig>;
  enableHistory: boolean;
  maxHistory: number;
}

const DEFAULT_ENGINE_CONFIG: ReactionEngineConfig = {
  vesselId: "beaker_1",
  vesselType: "beaker",
  enableHistory: true,
  maxHistory: 50,
};

export class ReactionEngine {
  readonly vessel: VesselStateManager;
  readonly ruleEngine: RuleEngine;
  readonly eventBus: ChemistryEventBus;

  private reactionLog: ReactionResult[] = [];
  private snapshots: StateSnapshot[] = [];
  private config: ReactionEngineConfig;

  constructor(config: Partial<ReactionEngineConfig> = {}) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.eventBus = globalEventBus;
    this.vessel = new VesselStateManager(this.config.vesselId, this.config.vesselType);
    this.ruleEngine = new RuleEngine(this.config.ruleConfig);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on("reaction:completed", (event) => {
      const result = event.payload as ReactionResult;
      if (this.config.enableHistory) {
        this.reactionLog.push(result);
        if (this.reactionLog.length > this.config.maxHistory) {
          this.reactionLog.shift();
        }
      }
    });
  }

  // ==================== 物质管理 ====================

  addMaterial(materialId: string, amount?: number): boolean {
    this.saveSnapshot();
    const result = this.vessel.addMaterial(materialId, amount);
    if (!result) return false;

    setTimeout(() => this.tryReactions(), 50);
    return true;
  }

  removeMaterial(materialId: string): boolean {
    this.saveSnapshot();
    return this.vessel.removeMaterial(materialId);
  }

  // ==================== 反应执行 ====================

  tryReactions(): ReactionResult | null {
    return this.ruleEngine.autoMatch(this.vessel);
  }

  executeReaction(ruleId: string): ReactionResult | null {
    this.saveSnapshot();
    return this.ruleEngine.executeReaction(ruleId, this.vessel);
  }

  // ==================== 温度 / pH ====================

  setTemperature(temp: number): void {
    this.vessel.setTemperature(temp);
  }

  adjustTemperature(delta: number): void {
    this.vessel.setTemperature(this.vessel.temperature + delta);
  }

  setPh(ph: number): void {
    this.vessel.setPh(ph);
  }

  // ==================== 快照 / 撤销 ====================

  private saveSnapshot(): void {
    if (!this.config.enableHistory) return;
    this.snapshots.push(this.vessel.snapshot());
    if (this.snapshots.length > this.config.maxHistory) {
      this.snapshots.shift();
    }
  }

  undo(): boolean {
    const snap = this.snapshots.pop();
    if (!snap) return false;
    this.vessel.restore(snap);
    return true;
  }

  canUndo(): boolean {
    return this.snapshots.length > 0;
  }

  // ==================== 查询 ====================

  getReactionLog(): ReactionResult[] {
    return [...this.reactionLog];
  }

  getState(): VesselState {
    return {
      id: this.vessel.id,
      type: this.vessel.type,
      materials: this.vessel.materials,
      totalVolume: this.vessel.totalVolume,
      temperature: this.vessel.temperature,
      pressure: this.vessel.pressure,
      ph: this.vessel.ph,
      liquidLevel: this.vessel.liquidLevel,
      liquidColor: this.vessel.liquidColor,
      precipitates: this.vessel.precipitates,
      gases: this.vessel.gases,
      effects: this.vessel.effects,
    };
  }

  // ==================== 重置 ====================

  reset(): void {
    this.vessel.reset();
    this.reactionLog = [];
    this.snapshots = [];
    this.ruleEngine.reset();
    this.eventBus.emit("state:reset", { vesselId: this.vessel.id }, "ReactionEngine");
  }
}

// ==================== React Hook ====================
import { useCallback, useRef, useState, useEffect } from "react";

export function useReactionEngine(config?: Partial<ReactionEngineConfig>) {
  const engineRef = useRef<ReactionEngine | null>(null);
  const [, forceUpdate] = useState(0);

  if (!engineRef.current) {
    engineRef.current = new ReactionEngine(config);
  }

  const engine = engineRef.current;

  useEffect(() => {
    const unsub1 = globalEventBus.on("reaction:completed", () => forceUpdate((n) => n + 1));
    const unsub2 = globalEventBus.on("material:added", () => forceUpdate((n) => n + 1));
    const unsub3 = globalEventBus.on("material:removed", () => forceUpdate((n) => n + 1));
    const unsub4 = globalEventBus.on("vessel:temperature_changed", () => forceUpdate((n) => n + 1));
    const unsub5 = globalEventBus.on("state:reset", () => forceUpdate((n) => n + 1));
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); };
  }, []);

  const addMaterial = useCallback(
    (id: string, amount?: number) => engine.addMaterial(id, amount),
    [engine]
  );

  const removeMaterial = useCallback(
    (id: string) => engine.removeMaterial(id),
    [engine]
  );

  const setTemperature = useCallback(
    (t: number) => engine.setTemperature(t),
    [engine]
  );

  const reset = useCallback(() => engine.reset(), [engine]);
  const undo = useCallback(() => engine.undo(), [engine]);

  return {
    engine,
    state: engine.getState(),
    addMaterial,
    removeMaterial,
    setTemperature,
    reset,
    undo,
    canUndo: engine.canUndo(),
    reactionLog: engine.getReactionLog(),
  };
}

// ==================== 导出工具 ====================
export { registerMaterial, getMaterial, createReactionRule };
export type { ReactionEngineConfig };
