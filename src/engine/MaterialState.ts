import type {
  Material,
  MaterialState,
  PhaseType,
  VesselState,
  PrecipitateState,
  GasState,
} from "./types";
import { globalEventBus } from "./EventBus";

// ==================== 相变规则 ====================
interface PhaseTransition {
  from: PhaseType;
  to: PhaseType;
  condition: "heat" | "cool" | "dissolve" | "precipitate" | "evaporate";
  threshold: number;
}

const PHASE_TRANSITIONS: PhaseTransition[] = [
  { from: "solid", to: "liquid", condition: "heat", threshold: 0 },    // meltingPoint
  { from: "liquid", to: "gas", condition: "heat", threshold: 0 },      // boilingPoint
  { from: "gas", to: "liquid", condition: "cool", threshold: 0 },
  { from: "liquid", to: "solid", condition: "cool", threshold: 0 },
  { from: "solid", to: "aqueous", condition: "dissolve", threshold: 0 },
  { from: "aqueous", to: "solid", condition: "precipitate", threshold: 0 },
  { from: "liquid", to: "gas", condition: "evaporate", threshold: 100 },
];

// ==================== 物质数据库 ====================
const MATERIAL_DB = new Map<string, Material>();

export function registerMaterial(material: Material): void {
  MATERIAL_DB.set(material.id, material);
}

export function getMaterial(id: string): Material | undefined {
  return MATERIAL_DB.get(id);
}

export function getAllMaterials(): Material[] {
  return Array.from(MATERIAL_DB.values());
}

// ==================== 物质状态管理器 ====================
export class MaterialStateManager {
  private states = new Map<string, MaterialState>();

  add(materialId: string, amount: number = 1, temperature: number = 25): MaterialState | null {
    const material = MATERIAL_DB.get(materialId);
    if (!material) {
      console.warn(`[MaterialState] Unknown material: ${materialId}`);
      return null;
    }

    const existing = this.states.get(materialId);
    if (existing) {
      existing.amount += amount;
      globalEventBus.emit("material:added", { materialId, amount, phase: existing.phase }, "MaterialState");
      return existing;
    }

    const state: MaterialState = {
      materialId,
      phase: material.phase,
      amount,
      temperature,
      color: material.color,
      isActive: true,
    };

    this.states.set(materialId, state);
    globalEventBus.emit("material:added", { materialId, amount, phase: material.phase }, "MaterialState");
    return state;
  }

  remove(materialId: string, amount?: number): boolean {
    const state = this.states.get(materialId);
    if (!state) return false;

    if (amount !== undefined && amount < state.amount) {
      state.amount -= amount;
    } else {
      this.states.delete(materialId);
    }

    globalEventBus.emit("material:removed", { materialId }, "MaterialState");
    return true;
  }

  get(materialId: string): MaterialState | undefined {
    return this.states.get(materialId);
  }

  getAll(): MaterialState[] {
    return Array.from(this.states.values());
  }

  getByPhase(phase: PhaseType): MaterialState[] {
    return this.getAll().filter((s) => s.phase === phase);
  }

  has(materialId: string): boolean {
    return this.states.has(materialId);
  }

  // ==================== 相变 ====================

  changePhase(materialId: string, newPhase: PhaseType, reason: string): boolean {
    const state = this.states.get(materialId);
    if (!state) return false;

    const oldPhase = state.phase;
    if (oldPhase === newPhase) return true;

    state.phase = newPhase;
    const material = MATERIAL_DB.get(materialId);
    if (material) {
      state.color = material.color;
    }

    globalEventBus.emit(
      "material:phase_changed",
      { materialId, from: oldPhase, to: newPhase, reason },
      "MaterialState"
    );
    return true;
  }

  updateTemperature(materialId: string, temp: number): void {
    const state = this.states.get(materialId);
    if (!state) return;
    state.temperature = temp;

    const material = MATERIAL_DB.get(materialId);
    if (!material) return;

    if (material.meltingPoint && temp >= material.meltingPoint && state.phase === "solid") {
      this.changePhase(materialId, "liquid", "melting");
    } else if (material.boilingPoint && temp >= material.boilingPoint && state.phase === "liquid") {
      this.changePhase(materialId, "gas", "boiling");
    } else if (material.boilingPoint && temp < material.boilingPoint && state.phase === "gas") {
      this.changePhase(materialId, "liquid", "condensation");
    } else if (material.meltingPoint && temp < material.meltingPoint && state.phase === "liquid") {
      this.changePhase(materialId, "solid", "freezing");
    }
  }

  clear(): void {
    this.states.clear();
  }

  // ==================== 快照 ====================

  snapshot(): Map<string, MaterialState> {
    const snap = new Map<string, MaterialState>();
    for (const [id, state] of this.states) {
      snap.set(id, { ...state });
    }
    return snap;
  }

  restore(snapshot: Map<string, MaterialState>): void {
    this.states.clear();
    for (const [id, state] of snapshot) {
      this.states.set(id, { ...state });
    }
  }
}

// ==================== 容器状态管理 ====================
export class VesselStateManager implements VesselState {
  id: string;
  type: "beaker" | "testTube" | "flask" = "beaker";
  materials: MaterialState[] = [];
  totalVolume: number = 500;
  temperature: number = 25;
  pressure: number = 1;
  ph: number = 7;
  liquidLevel: number = 0;
  liquidColor: string = "#1e293b";
  precipitates: PrecipitateState[] = [];
  gases: GasState[] = [];
  effects: import("./types").ActiveEffect[] = [];

  private materialMgr: MaterialStateManager;

  constructor(id: string, type: "beaker" | "testTube" | "flask" = "beaker") {
    this.id = id;
    this.type = type;
    this.materialMgr = new MaterialStateManager();
  }

  get materialManager(): MaterialStateManager {
    return this.materialMgr;
  }

  addMaterial(materialId: string, amount?: number): MaterialState | null {
    const state = this.materialMgr.add(materialId, amount, this.temperature);
    if (state) this.syncFromMaterials();
    return state;
  }

  removeMaterial(materialId: string): boolean {
    const ok = this.materialMgr.remove(materialId);
    if (ok) this.syncFromMaterials();
    return ok;
  }

  setTemperature(temp: number): void {
    const old = this.temperature;
    this.temperature = Math.max(-20, Math.min(1200, temp));

    for (const ms of this.materialMgr.getAll()) {
      this.materialMgr.updateTemperature(ms.materialId, this.temperature);
    }

    this.syncFromMaterials();

    globalEventBus.emit(
      "vessel:temperature_changed",
      { vesselId: this.id, from: old, to: this.temperature },
      "VesselState"
    );
  }

  setPh(ph: number): void {
    const old = this.ph;
    this.ph = Math.max(0, Math.min(14, ph));
    globalEventBus.emit("vessel:ph_changed", { vesselId: this.id, from: old, to: this.ph }, "VesselState");
  }

  private syncFromMaterials(): void {
    this.materials = this.materialMgr.getAll();

    this.precipitates = this.materialMgr
      .getByPhase("solid")
      .filter((ms) => {
        const mat = getMaterial(ms.materialId);
        return mat && ms.amount > 0;
      })
      .map((ms) => ({
        materialId: ms.materialId,
        color: ms.color,
        amount: ms.amount,
        settledRatio: 0,
      }));

    this.gases = this.materialMgr.getByPhase("gas").map((ms) => ({
      materialId: ms.materialId,
      color: ms.color,
      bubbleCount: Math.min(30, Math.floor(ms.amount * 10)),
      riseSpeed: 0.3 + Math.random() * 0.4,
    }));

    const liquids = this.materialMgr.getByPhase("liquid");
    const aqueous = this.materialMgr.getByPhase("aqueous");
    const allFluids = [...liquids, ...aqueous];

    if (allFluids.length > 0) {
      const totalAmount = allFluids.reduce((s, m) => s + m.amount, 0);
      const weightedColor = this.blendColors(allFluids.map((f) => ({ color: f.color, weight: f.amount / totalAmount })));
      this.liquidColor = weightedColor;
      this.liquidLevel = Math.min(0.85, totalAmount * 0.1);
    } else {
      this.liquidColor = "#1e293b";
      this.liquidLevel = 0;
    }
  }

  private blendColors(entries: { color: string; weight: number }[]): string {
    let r = 0, g = 0, b = 0;
    for (const { color, weight } of entries) {
      const c = hexToRgb(color);
      if (!c) continue;
      r += c.r * weight;
      g += c.g * weight;
      b += c.b * weight;
    }
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }

  reset(): void {
    this.materialMgr.clear();
    this.materials = [];
    this.precipitates = [];
    this.gases = [];
    this.effects = [];
    this.temperature = 25;
    this.ph = 7;
    this.liquidLevel = 0;
    this.liquidColor = "#1e293b";
    this.pressure = 1;
    globalEventBus.emit("state:reset", { vesselId: this.id }, "VesselState");
  }

  snapshot(): import("./types").StateSnapshot {
    return {
      vessel: {
        id: this.id,
        type: this.type,
        materials: this.materialMgr.getAll().map((m) => ({ ...m })),
        totalVolume: this.totalVolume,
        temperature: this.temperature,
        pressure: this.pressure,
        ph: this.ph,
        liquidLevel: this.liquidLevel,
        liquidColor: this.liquidColor,
        precipitates: [...this.precipitates],
        gases: [...this.gases],
        effects: this.effects.map((e) => ({ ...e, particles: [...e.particles] })),
      },
      timestamp: Date.now(),
      reactionLog: [],
    };
  }

  restore(snapshot: import("./types").StateSnapshot): void {
    const v = snapshot.vessel;
    this.materialMgr.clear();
    for (const ms of v.materials) {
      this.materialMgr.add(ms.materialId, ms.amount, ms.temperature);
    }
    this.temperature = v.temperature;
    this.ph = v.ph;
    this.pressure = v.pressure;
    this.liquidLevel = v.liquidLevel;
    this.liquidColor = v.liquidColor;
    this.precipitates = [...v.precipitates];
    this.gases = [...v.gases];
    this.effects = v.effects.map((e) => ({ ...e, particles: [...e.particles] }));
    globalEventBus.emit("state:restored", { vesselId: this.id }, "VesselState");
  }
}

// ==================== 颜色工具 ====================
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}
