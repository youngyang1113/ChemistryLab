import { useState, useEffect, useCallback, useRef } from "react";
import type {
  VesselState,
  ActiveEffect,
  EffectType,
  ReactionResult,
  ParticleState,
} from "./types";
import { globalEventBus } from "./EventBus";
import { ReactionEngine } from "./ReactionEngine";
import type { ReactionEngineConfig } from "./ReactionEngine";
import { initMaterials, initReactionRules } from "./ChemistryData";

// ==================== 3D 视觉状态 ====================

export interface VisualState3D {
  liquidColor: string;
  liquidLevel: number;
  liquidHeight: number;
  temperature: number;
  ph: number;
  isReacting: boolean;
  shakeIntensity: number;

  precipitates: { color: string; amount: number; settledRatio: number }[];
  gases: { color: string; bubbleCount: number; riseSpeed: number }[];
  effects: VisualEffect3D[];
}

export interface VisualEffect3D {
  type: EffectType;
  intensity: number;
  color: string;
  particles: ParticleState[];
  progress: number;
}

const BEAKER_HEIGHT = 1.2;

function vesselToVisual(vessel: VesselState, isReacting: boolean, reaction: ReactionResult | null): VisualState3D {
  const shakeIntensity = isReacting && reaction
    ? Math.min(3, Math.floor(Math.abs(reaction.tempDelta) / 15))
    : 0;

  return {
    liquidColor: vessel.liquidColor,
    liquidLevel: vessel.liquidLevel,
    liquidHeight: vessel.liquidLevel * BEAKER_HEIGHT,
    temperature: vessel.temperature,
    ph: vessel.ph,
    isReacting,
    shakeIntensity,

    precipitates: vessel.precipitates.map((p) => ({
      color: p.color,
      amount: p.amount,
      settledRatio: p.settledRatio,
    })),

    gases: vessel.gases.map((g) => ({
      color: g.color,
      bubbleCount: g.bubbleCount,
      riseSpeed: g.riseSpeed,
    })),

    effects: vessel.effects.map((e) => ({
      type: e.type,
      intensity: e.intensity,
      color: e.color ?? "#ffffff",
      particles: e.particles,
      progress: e.duration > 0 ? e.elapsed / e.duration : 0,
    })),
  };
}

// ==================== Hook ====================

export function useVisualEngine(config?: Partial<ReactionEngineConfig>) {
  const engineRef = useRef<ReactionEngine | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<ReactionResult | null>(null);
  const [visual, setVisual] = useState<VisualState3D>(() => ({
    liquidColor: "#1e293b",
    liquidLevel: 0,
    liquidHeight: 0,
    temperature: 25,
    ph: 7,
    isReacting: false,
    shakeIntensity: 0,
    precipitates: [],
    gases: [],
    effects: [],
  }));

  if (!engineRef.current) {
    initMaterials();
    const rules = initReactionRules();
    engineRef.current = new ReactionEngine(config);
    engineRef.current.ruleEngine.registerRules(rules);
  }

  const engine = engineRef.current;

  const sync = useCallback(() => {
    const vesselState = engine.getState();
    setVisual(vesselToVisual(vesselState, isReacting, currentReaction));
  }, [engine, isReacting, currentReaction]);

  useEffect(() => {
    const unsub1 = globalEventBus.on("reaction:started", (e) => {
      setIsReacting(true);
    });

    const unsub2 = globalEventBus.on("reaction:completed", (e) => {
      const result = e.payload as ReactionResult;
      setCurrentReaction(result);
      setIsReacting(true);
      sync();

      setTimeout(() => {
        setIsReacting(false);
        setCurrentReaction(null);
        engine.vessel.effects = [];
        sync();
      }, 3000);
    });

    const unsub3 = globalEventBus.on("material:added", () => sync());
    const unsub4 = globalEventBus.on("material:removed", () => sync());
    const unsub5 = globalEventBus.on("vessel:temperature_changed", () => sync());
    const unsub6 = globalEventBus.on("vessel:ph_changed", () => sync());
    const unsub7 = globalEventBus.on("state:reset", () => {
      setIsReacting(false);
      setCurrentReaction(null);
      sync();
    });

    return () => {
      unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7();
    };
  }, [engine, sync]);

  const addMaterial = useCallback(
    (materialId: string, amount?: number) => {
      engine.addMaterial(materialId, amount);
      sync();
    },
    [engine, sync]
  );

  const removeMaterial = useCallback(
    (materialId: string) => {
      engine.removeMaterial(materialId);
      sync();
    },
    [engine, sync]
  );

  const setTemperature = useCallback(
    (temp: number) => {
      engine.setTemperature(temp);
      sync();
    },
    [engine, sync]
  );

  const setPh = useCallback(
    (ph: number) => {
      engine.setPh(ph);
      sync();
    },
    [engine, sync]
  );

  const reset = useCallback(() => {
    engine.reset();
    setIsReacting(false);
    setCurrentReaction(null);
    sync();
  }, [engine, sync]);

  const undo = useCallback(() => {
    engine.undo();
    sync();
  }, [engine, sync]);

  return {
    visual,
    currentReaction,
    isReacting,
    addMaterial,
    removeMaterial,
    setTemperature,
    setPh,
    reset,
    undo,
    canUndo: engine.canUndo(),
    reactionLog: engine.getReactionLog(),
    engine,
  };
}
