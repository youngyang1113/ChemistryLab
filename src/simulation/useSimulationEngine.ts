import { useRef, useEffect, useCallback, useState } from "react";
import { SimulationEngine } from "./SimulationEngine";
import type { GasType, ReactionKinetics, SimulationState } from "./types";
import { simEventBus } from "./SimEventBus";

export function useSimulationEngine(containerRef: React.RefObject<HTMLElement | null>) {
  const engineRef = useRef<SimulationEngine | null>(null);
  const [state, setState] = useState<SimulationState | null>(null);

  if (!engineRef.current && containerRef.current) {
    engineRef.current = new SimulationEngine({ container: containerRef.current });
  }

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !containerRef.current) return;

    engine.start();

    const interval = setInterval(() => {
      setState({ ...engine.state });
    }, 50);

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [containerRef.current]);

  const setLiquidLevel = useCallback((level: number) => {
    engineRef.current?.setLiquidLevel(level);
  }, []);

  const setColor = useCallback((color: string, origin?: { x: number; y: number }) => {
    engineRef.current?.setColor(color, origin);
  }, []);

  const setTemperature = useCallback((temp: number) => {
    engineRef.current?.setTemperature(temp);
  }, []);

  const addReaction = useCallback(
    (id: string, equation: string, description: string, kinetics?: ReactionKinetics) => {
      engineRef.current?.addReaction(id, equation, description, kinetics);
    },
    []
  );

  const addGasEmitter = useCallback((type: GasType, rate: number) => {
    engineRef.current?.addGasEmitter(type, rate);
  }, []);

  const removeGasEmitter = useCallback((type: GasType) => {
    engineRef.current?.removeGasEmitter(type);
  }, []);

  const addSolid = useCallback((x: number, y: number, size: number, color: string) => {
    return engineRef.current?.addSolid(x, y, size, color) ?? "";
  }, []);

  const dissolveSolid = useCallback((id: string, rate?: number) => {
    engineRef.current?.dissolveSolid(id, rate);
  }, []);

  const addPrecipitate = useCallback((x: number, y: number, color: string, amount: number) => {
    engineRef.current?.addPrecipitate(x, y, color, amount);
  }, []);

  const setVesselSize = useCallback((w: number, h: number) => {
    engineRef.current?.setVesselSize(w, h);
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    setState(null);
  }, []);

  return {
    engine: engineRef.current,
    state,
    setLiquidLevel,
    setColor,
    setTemperature,
    addReaction,
    addGasEmitter,
    removeGasEmitter,
    addSolid,
    dissolveSolid,
    addPrecipitate,
    setVesselSize,
    reset,
  };
}
