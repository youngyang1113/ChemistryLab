import type {
  VesselGeometry,
  SimulationState,
  GasType,
  ReactionKinetics,
} from "./types";
import { simEventBus } from "./SimEventBus";
import { ReactionTimeline, createReaction } from "./ReactionTimeline";
import { ColorDiffusion } from "./ColorDiffusion";
import { GasParticleSystem } from "./GasParticleSystem";
import { HeatTemperature } from "./HeatTemperature";
import { SolidPrecipitate } from "./SolidPrecipitate";
import { LayerRenderer } from "./LayerRenderer";

export interface SimulationConfig {
  container: HTMLElement;
  vessel?: Partial<VesselGeometry>;
}

const DEFAULT_VESSEL: VesselGeometry = {
  x: 0,
  y: 0,
  width: 200,
  height: 300,
  wallThickness: 3,
  bottomThickness: 5,
  cornerRadius: 8,
  liquidArea: { x: 0, y: 0, width: 200, height: 300 },
};

export class SimulationEngine {
  readonly renderer: LayerRenderer;
  readonly timeline: ReactionTimeline;
  readonly color: ColorDiffusion;
  readonly gas: GasParticleSystem;
  readonly heat: HeatTemperature;
  readonly solids: SolidPrecipitate;

  vessel: VesselGeometry;
  state: SimulationState;
  liquidLevel = 0;

  private running = false;
  private lastTime = 0;
  private rafId = 0;

  constructor(config: SimulationConfig) {
    this.vessel = { ...DEFAULT_VESSEL, ...config.vessel };
    this.recalcVessel();

    this.renderer = new LayerRenderer(config.container);
    this.renderer.initLayers();

    this.timeline = new ReactionTimeline();
    this.color = new ColorDiffusion();
    this.gas = new GasParticleSystem();
    this.heat = new HeatTemperature();
    this.solids = new SolidPrecipitate();

    this.state = {
      reactions: [],
      color: this.color.state,
      temperature: this.heat.state,
      gases: [],
      solids: [],
      precipitateLayer: this.solids.layer,
      liquidLevel: 0,
      isReacting: false,
      time: 0,
      deltaTime: 0,
    };
  }

  private recalcVessel(): void {
    const pad = this.vessel.wallThickness + 5;
    this.vessel.liquidArea = {
      x: this.vessel.x + pad,
      y: this.vessel.y + pad,
      width: this.vessel.width - pad * 2,
      height: this.vessel.height - pad - this.vessel.bottomThickness,
    };
  }

  setVesselPosition(x: number, y: number): void {
    this.vessel.x = x;
    this.vessel.y = y;
    this.recalcVessel();
  }

  setVesselSize(width: number, height: number): void {
    this.vessel.width = width;
    this.vessel.height = height;
    this.recalcVessel();
  }

  setLiquidLevel(level: number): void {
    this.liquidLevel = Math.max(0, Math.min(0.85, level));
  }

  setColor(color: string, origin?: { x: number; y: number }): void {
    this.color.setTarget(color, origin);
  }

  setTemperature(temp: number): void {
    this.heat.setTemperature(temp);
  }

  addReaction(
    id: string,
    equation: string,
    description: string,
    kinetics: ReactionKinetics = "normal"
  ): void {
    const r = createReaction(id, equation, description, kinetics);
    this.timeline.add(r);
    this.timeline.start(id);
  }

  addGasEmitter(type: GasType, rate: number): void {
    this.gas.addEmitter({
      type,
      rate,
      origin: { x: 0.5, y: 0.8 },
      spread: { x: 0.3, y: 0.05 },
      particleConfig: {} as any,
    });
  }

  removeGasEmitter(type: GasType): void {
    this.gas.removeEmittersByType(type);
  }

  addSolid(x: number, y: number, size: number, color: string): string {
    const p = this.solids.addReactant(x, y, size, color);
    return p.id;
  }

  dissolveSolid(id: string, rate?: number): void {
    this.solids.startDissolving(id, rate);
  }

  addPrecipitate(x: number, y: number, color: string, amount: number): void {
    this.solids.addPrecipitate(x, y, color, amount);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number): void => {
    if (!this.running) return;

    const deltaTime = Math.min(now - this.lastTime, 50);
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number): void {
    this.timeline.update(deltaTime);
    this.color.update(deltaTime);
    this.gas.update(deltaTime, this.vessel);
    this.heat.update(deltaTime);
    this.solids.update(deltaTime, this.vessel);

    this.state = {
      reactions: this.timeline.getAll(),
      color: this.color.state,
      temperature: this.heat.state,
      gases: this.gas.particles,
      solids: this.solids.particles,
      precipitateLayer: this.solids.layer,
      liquidLevel: this.liquidLevel,
      isReacting: this.timeline.getActive().length > 0,
      time: now(),
      deltaTime,
    };
  }

  private render(): void {
    this.renderer.clearAll();

    this.renderer.renderBackground(this.vessel);

    const liquidLayer = this.renderer.getLayer("liquid");
    if (liquidLayer?.visible) {
      this.color.renderTo(liquidLayer.ctx, this.vessel, this.liquidLevel);
      this.heat.renderTo(liquidLayer.ctx, this.vessel, this.liquidLevel);
    }

    const solidLayer = this.renderer.getLayer("solid");
    if (solidLayer?.visible) {
      this.solids.renderTo(solidLayer.ctx, this.vessel);
    }

    const gasLayer = this.renderer.getLayer("gas");
    if (gasLayer?.visible) {
      this.gas.renderTo(gasLayer.ctx);
    }

    const effectLayer = this.renderer.getLayer("effect");
    if (effectLayer?.visible) {
      this.heat.renderShimmerTo(effectLayer.ctx, this.vessel, this.liquidLevel);
      this.renderReactionProgress(effectLayer.ctx);
    }

    const uiLayer = this.renderer.getLayer("ui");
    if (uiLayer?.visible) {
      this.renderUI(uiLayer.ctx);
    }
  }

  private renderReactionProgress(ctx: CanvasRenderingContext2D): void {
    const active = this.timeline.getActive();
    if (active.length === 0) return;

    const { x, y, width } = this.vessel;
    ctx.save();

    for (const r of active) {
      const barY = y - 20;
      const barW = width * 0.6;
      const barH = 4;
      const barX = x + (width - barW) / 2;

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(barX, barY, barW, barH);

      const progressColor = r.progress < 0.3 ? "#4ade80" : r.progress < 0.7 ? "#facc15" : "#f87171";
      ctx.fillStyle = progressColor;
      ctx.fillRect(barX, barY, barW * r.progress, barH);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `${r.equation} (${Math.round(r.progress * 100)}%)`,
        x + width / 2,
        barY - 6
      );
    }

    ctx.restore();
  }

  private renderUI(ctx: CanvasRenderingContext2D): void {
    const { x, y, width } = this.vessel;
    ctx.save();

    const temp = this.heat.state.temperature;
    const tempColor = temp > 80 ? "#ef4444" : temp > 50 ? "#f59e0b" : temp < 10 ? "#3b82f6" : "#6b7280";
    ctx.fillStyle = tempColor;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${temp.toFixed(1)}°C`, x + width - 5, y + 15);

    const ph = 7;
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px monospace";
    ctx.fillText(`pH ${ph.toFixed(1)}`, x + width - 5, y + 28);

    ctx.restore();
  }

  resize(): void {
    this.renderer.resize();
  }

  reset(): void {
    this.timeline.reset();
    this.color.reset();
    this.gas.reset();
    this.heat.reset();
    this.solids.reset();
    this.liquidLevel = 0;
    simEventBus.clear();
  }

  destroy(): void {
    this.stop();
    this.renderer.destroy();
    simEventBus.clear();
  }
}

function now(): number {
  return performance.now();
}
