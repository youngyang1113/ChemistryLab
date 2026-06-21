import type { SolidParticle, SolidState, PrecipitateLayer, VesselGeometry } from "./types";
import { simEventBus } from "./SimEventBus";

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

let solidId = 0;

export class SolidPrecipitate {
  particles: SolidParticle[] = [];
  layer: PrecipitateLayer = {
    particles: [],
    height: 0,
    color: "#f5f5f4",
    density: 0,
  };

  private gravity = 0.15;
  private maxLayerHeight = 40;

  addReactant(x: number, y: number, size: number, color: string): SolidParticle {
    const p: SolidParticle = {
      id: `solid_${solidId++}`,
      position: { x, y },
      size,
      maxSize: size,
      opacity: 1,
      color,
      state: "intact",
      velocity: { x: rand(-0.2, 0.2), y: 0 },
      dissolveRate: 0,
      settleTarget: 0,
      rotation: rand(0, Math.PI * 2),
      rotationSpeed: rand(-0.02, 0.02),
    };
    this.particles.push(p);
    return p;
  }

  startDissolving(id: string, rate: number = 0.002): void {
    const p = this.particles.find((pp) => pp.id === id);
    if (p && p.state === "intact") {
      p.state = "dissolving";
      p.dissolveRate = rate;
      simEventBus.emit("SOLID_DISSOLVING", { id, size: p.size });
    }
  }

  addPrecipitate(x: number, y: number, color: string, amount: number): void {
    const count = Math.min(20, Math.floor(amount * 5));
    for (let i = 0; i < count; i++) {
      const p: SolidParticle = {
        id: `prec_${solidId++}`,
        position: {
          x: x + rand(-10, 10),
          y: y + rand(-5, 5),
        },
        size: rand(1.5, 3.5),
        maxSize: rand(1.5, 3.5),
        opacity: 0,
        color,
        state: "precipitating",
        velocity: { x: rand(-0.3, 0.3), y: rand(0.2, 0.8) },
        dissolveRate: 0,
        settleTarget: 0,
        rotation: rand(0, Math.PI * 2),
        rotationSpeed: rand(-0.03, 0.03),
      };
      this.particles.push(p);
    }
    simEventBus.emit("PRECIPITATE_FORMED", { type: color, amount });
  }

  update(deltaTime: number, vessel: VesselGeometry): void {
    const dt = deltaTime / 16;
    const bottomY = vessel.liquidArea.y + vessel.liquidArea.height;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      switch (p.state) {
        case "intact":
          p.rotation += p.rotationSpeed * dt;
          break;

        case "dissolving":
          p.size -= p.dissolveRate * dt;
          p.opacity = Math.max(0, p.size / p.maxSize);
          p.rotation += p.rotationSpeed * dt * 0.5;

          if (p.size <= 0) {
            p.state = "dissolved";
            this.particles.splice(i, 1);
          }
          break;

        case "precipitating":
          p.velocity.y += this.gravity * dt;
          p.position.y += p.velocity.y * dt;
          p.position.x += p.velocity.x * dt;
          p.rotation += p.rotationSpeed * dt;
          p.opacity = Math.min(1, p.opacity + 0.03 * dt);

          if (p.position.y >= bottomY - 5) {
            p.position.y = bottomY - this.layer.height - 2;
            p.velocity = { x: 0, y: 0 };
            p.state = "settled";
            p.rotationSpeed = 0;
            this.addToLayer(p);
          }
          break;

        case "settled":
          break;
      }
    }

    this.updateLayer(vessel);
  }

  private addToLayer(particle: SolidParticle): void {
    this.layer.particles.push(particle);
    this.layer.density++;
    this.layer.height = Math.min(this.maxLayerHeight, this.layer.density * 0.8);
    this.layer.color = particle.color;
  }

  private updateLayer(vessel: VesselGeometry): void {
    if (this.layer.particles.length === 0) return;

    const bottomY = vessel.liquidArea.y + vessel.liquidArea.height;
    const layerTop = bottomY - this.layer.height;

    for (const p of this.layer.particles) {
      p.position.y = Math.max(layerTop, p.position.y - 0.02);
    }
  }

  renderTo(ctx: CanvasRenderingContext2D, vessel: VesselGeometry): void {
    if (this.layer.particles.length > 0 && this.layer.height > 0) {
      const { x, width } = vessel.liquidArea;
      const bottomY = vessel.liquidArea.y + vessel.liquidArea.height;
      const layerY = bottomY - this.layer.height;

      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = this.layer.color;
      ctx.beginPath();

      ctx.moveTo(x, bottomY);
      for (let px = 0; px <= width; px += 8) {
        const wave = Math.sin(px * 0.1) * 2 + Math.sin(px * 0.05) * 1;
        ctx.lineTo(x + px, layerY + wave);
      }
      ctx.lineTo(x + width, bottomY);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.3;
      for (let px = 0; px < width; px += 12) {
        const dotY = layerY + Math.random() * (this.layer.height * 0.3);
        ctx.fillStyle = this.layer.color;
        ctx.beginPath();
        ctx.arc(x + px + Math.random() * 6, dotY, 1 + Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    for (const p of this.particles) {
      if (p.state === "settled") continue;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.position.x, p.position.y);
      ctx.rotate(p.rotation);

      ctx.fillStyle = p.color;
      ctx.beginPath();
      const sides = 5 + Math.floor(p.size) % 3;
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const r = p.size * (0.8 + Math.sin(angle * 2) * 0.2);
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  reset(): void {
    this.particles = [];
    this.layer = { particles: [], height: 0, color: "#f5f5f4", density: 0 };
    solidId = 0;
  }
}
