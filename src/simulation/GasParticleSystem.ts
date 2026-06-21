import type {
  GasParticle,
  GasType,
  GasEmitterConfig,
  VesselGeometry,
} from "./types";
import { simEventBus } from "./SimEventBus";

const GAS_DEFAULTS: Record<GasType, GasEmitterConfig["particleConfig"]> = {
  CO2: {
    baseSize: 4,
    sizeVariance: 2,
    baseSpeed: 0.8,
    speedVariance: 0.3,
    baseLifetime: 2500,
    lifetimeVariance: 800,
    color: "#aaddff",
    opacity: 0.5,
    turbulence: 0.3,
  },
  H2: {
    baseSize: 2,
    sizeVariance: 1,
    baseSpeed: 2.5,
    speedVariance: 1,
    baseLifetime: 1500,
    lifetimeVariance: 500,
    color: "#e0f0ff",
    opacity: 0.35,
    turbulence: 0.8,
  },
  NH3: {
    baseSize: 6,
    sizeVariance: 3,
    baseSpeed: 0.4,
    speedVariance: 0.2,
    baseLifetime: 3000,
    lifetimeVariance: 1000,
    color: "#c8f0e8",
    opacity: 0.2,
    turbulence: 1.2,
  },
  Cl2: {
    baseSize: 5,
    sizeVariance: 2,
    baseSpeed: -0.3,
    speedVariance: 0.15,
    baseLifetime: 3500,
    lifetimeVariance: 1000,
    color: "#a8d848",
    opacity: 0.4,
    turbulence: 0.6,
  },
  O2: {
    baseSize: 3,
    sizeVariance: 1.5,
    baseSpeed: 1.2,
    speedVariance: 0.4,
    baseLifetime: 2000,
    lifetimeVariance: 600,
    color: "#b0d8ff",
    opacity: 0.45,
    turbulence: 0.5,
  },
  SO2: {
    baseSize: 5,
    sizeVariance: 2,
    baseSpeed: 0.2,
    speedVariance: 0.1,
    baseLifetime: 3000,
    lifetimeVariance: 800,
    color: "#d0d0d0",
    opacity: 0.35,
    turbulence: 0.9,
  },
  NO2: {
    baseSize: 4,
    sizeVariance: 2,
    baseSpeed: -0.1,
    speedVariance: 0.15,
    baseLifetime: 2800,
    lifetimeVariance: 700,
    color: "#8b6914",
    opacity: 0.45,
    turbulence: 0.7,
  },
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

let particleIdCounter = 0;

function createParticle(
  type: GasType,
  origin: { x: number; y: number },
  spread: { x: number; y: number }
): GasParticle {
  const cfg = GAS_DEFAULTS[type];
  return {
    id: `gas_${particleIdCounter++}`,
    position: {
      x: origin.x + rand(-spread.x, spread.x),
      y: origin.y + rand(-spread.y * 0.3, spread.y * 0.3),
    },
    velocity: {
      x: rand(-0.3, 0.3),
      y: -cfg.baseSpeed + rand(-cfg.speedVariance, cfg.speedVariance),
    },
    size: cfg.baseSize + rand(-cfg.sizeVariance, cfg.sizeVariance),
    opacity: cfg.opacity,
    lifetime: 0,
    maxLifetime: cfg.baseLifetime + rand(-cfg.lifetimeVariance, cfg.lifetimeVariance),
    type,
    color: cfg.color,
    turbulence: cfg.turbulence,
  };
}

export class GasParticleSystem {
  particles: GasParticle[] = [];
  emitters: GasEmitterConfig[] = [];
  private emitAccumulators = new Map<GasType, number>();

  addEmitter(config: GasEmitterConfig): void {
    this.emitters.push(config);
    this.emitAccumulators.set(config.type, 0);
  }

  removeEmittersByType(type: GasType): void {
    this.emitters = this.emitters.filter((e) => e.type !== type);
    this.emitAccumulators.delete(type);
  }

  clearEmitters(): void {
    this.emitters = [];
    this.emitAccumulators.clear();
  }

  update(deltaTime: number, vessel: VesselGeometry): void {
    for (const emitter of this.emitters) {
      let acc = this.emitAccumulators.get(emitter.type) ?? 0;
      acc += emitter.rate * (deltaTime / 16);
      const count = Math.floor(acc);
      acc -= count;
      this.emitAccumulators.set(emitter.type, acc);

      const origin = {
        x: vessel.liquidArea.x + vessel.liquidArea.width * emitter.origin.x,
        y: vessel.liquidArea.y + vessel.liquidArea.height * emitter.origin.y,
      };
      const spread = {
        x: vessel.liquidArea.width * emitter.spread.x,
        y: vessel.liquidArea.height * emitter.spread.y,
      };

      for (let i = 0; i < count; i++) {
        this.particles.push(createParticle(emitter.type, origin, spread));
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.lifetime += deltaTime;

      const lifeRatio = p.lifetime / p.maxLifetime;
      p.opacity = GAS_DEFAULTS[p.type].opacity * (1 - lifeRatio * lifeRatio);

      const turbX = Math.sin(p.lifetime * 0.003 * p.turbulence + p.position.y * 0.01) * p.turbulence;
      p.velocity.x += turbX * deltaTime * 0.001;
      p.velocity.x *= 0.98;

      p.position.x += p.velocity.x * (deltaTime / 16);
      p.position.y += p.velocity.y * (deltaTime / 16);

      if (p.type === "Cl2") {
        p.size = Math.min(p.size + deltaTime * 0.001, GAS_DEFAULTS[p.type].baseSize * 2.5);
      }

      if (p.lifetime >= p.maxLifetime || p.opacity < 0.01) {
        this.particles.splice(i, 1);
        simEventBus.emit("BUBBLE_BURST", { type: p.type, x: p.position.x, y: p.position.y });
      }
    }
  }

  renderTo(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.opacity;

      if (p.type === "NH3") {
        const grad = ctx.createRadialGradient(
          p.position.x, p.position.y, 0,
          p.position.x, p.position.y, p.size * 2
        );
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "Cl2") {
        const grad = ctx.createRadialGradient(
          p.position.x, p.position.y, 0,
          p.position.x, p.position.y, p.size
        );
        grad.addColorStop(0, p.color + "aa");
        grad.addColorStop(0.7, p.color + "44");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(
          p.position.x - p.size * 0.3,
          p.position.y - p.size * 0.3,
          p.size * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    }
  }

  reset(): void {
    this.particles = [];
    this.clearEmitters();
    particleIdCounter = 0;
  }
}
