import type { HeatState, HeatLevel, VesselGeometry } from "./types";
import { simEventBus } from "./SimEventBus";

function getHeatLevel(temp: number): HeatLevel {
  if (temp <= 0) return "frozen";
  if (temp < 20) return "cold";
  if (temp < 40) return "room";
  if (temp < 60) return "warm";
  if (temp < 85) return "hot";
  return "extreme";
}

export class HeatTemperature {
  state: HeatState = {
    temperature: 25,
    level: "room",
    shimmerIntensity: 0,
    waveAmplitude: 0,
    waveFrequency: 1,
    bubbleFrequencyMultiplier: 1,
    steamIntensity: 0,
    glowIntensity: 0,
    glowColor: "#ff6600",
  };

  private time = 0;
  private targetTemp = 25;
  private tempSmoothing = 0.05;

  setTemperature(temp: number): void {
    this.targetTemp = Math.max(-20, Math.min(1200, temp));
  }

  adjustTemperature(delta: number): void {
    this.setTemperature(this.state.temperature + delta);
  }

  update(deltaTime: number): void {
    this.time += deltaTime * 0.001;

    this.state.temperature += (this.targetTemp - this.state.temperature) * this.tempSmoothing;
    if (Math.abs(this.state.temperature - this.targetTemp) < 0.1) {
      this.state.temperature = this.targetTemp;
    }

    const temp = this.state.temperature;
    this.state.level = getHeatLevel(temp);

    const norm = Math.max(0, (temp - 25) / 75);
    this.state.shimmerIntensity = norm > 0.5 ? (norm - 0.5) * 2 : 0;
    this.state.waveAmplitude = norm * 0.015;
    this.state.waveFrequency = 1 + norm * 3;
    this.state.bubbleFrequencyMultiplier = 1 + norm * 3;
    this.state.steamIntensity = norm > 0.7 ? (norm - 0.7) * 3.33 : 0;
    this.state.glowIntensity = norm > 0.6 ? (norm - 0.6) * 2.5 : 0;

    if (temp > 300) {
      this.state.glowColor = "#ff2200";
    } else if (temp > 150) {
      this.state.glowColor = "#ff4400";
    } else if (temp > 80) {
      this.state.glowColor = "#ff6600";
    } else {
      this.state.glowColor = "#ff8800";
    }

    simEventBus.emit("TEMPERATURE_CHANGED", { currentTemp: this.state.temperature });
  }

  renderTo(ctx: CanvasRenderingContext2D, vessel: VesselGeometry, liquidLevel: number): void {
    const { x, y, width, height } = vessel.liquidArea;
    const liquidH = height * liquidLevel;
    if (liquidH <= 0) return;

    const drawY = y + height - liquidH;

    if (this.state.waveAmplitude > 0.001) {
      this.renderWaves(ctx, x, drawY, width, liquidH);
    }

    if (this.state.glowIntensity > 0) {
      this.renderGlow(ctx, x, drawY, width, liquidH);
    }

    if (this.state.steamIntensity > 0) {
      this.renderSteam(ctx, x, drawY, width);
    }
  }

  private renderWaves(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const amp = this.state.waveAmplitude * h * 0.3;
    const freq = this.state.waveFrequency;
    const t = this.time;

    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;

    for (let row = 0; row < 3; row++) {
      const rowY = y + h * (0.2 + row * 0.3);
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const wave = Math.sin((px / w) * Math.PI * 2 * freq + t * 3 + row) * amp;
        if (px === 0) ctx.moveTo(x + px, rowY + wave);
        else ctx.lineTo(x + px, rowY + wave);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderGlow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const intensity = this.state.glowIntensity;
    const glowH = h * 0.2;
    const t = this.time;
    const pulse = 0.7 + Math.sin(t * 4) * 0.3;

    ctx.save();

    const grad = ctx.createLinearGradient(x, y + h, x, y + h - glowH);
    grad.addColorStop(0, this.state.glowColor);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.globalAlpha = intensity * pulse * 0.4;
    ctx.fillRect(x, y + h - glowH, w, glowH);

    ctx.globalAlpha = intensity * 0.15;
    ctx.fillStyle = this.state.glowColor;
    const spread = Math.sin(t * 2) * 3;
    ctx.fillRect(x - spread, y + h - 2, w + spread * 2, 4);

    ctx.restore();
  }

  private renderSteam(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number
  ): void {
    const intensity = this.state.steamIntensity;
    const t = this.time;
    const count = Math.floor(intensity * 8);

    ctx.save();
    ctx.globalAlpha = intensity * 0.2;

    for (let i = 0; i < count; i++) {
      const px = x + (w * (i + 0.5)) / count + Math.sin(t * 2 + i * 1.5) * 8;
      const py = y - 10 - (t * 20 + i * 15) % 40;
      const size = 6 + Math.sin(t + i) * 3;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
      grad.addColorStop(0, "rgba(255,255,255,0.3)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderShimmerTo(
    ctx: CanvasRenderingContext2D,
    vessel: VesselGeometry,
    liquidLevel: number
  ): void {
    if (this.state.shimmerIntensity <= 0) return;

    const { x, y, width, height } = vessel.liquidArea;
    const liquidH = height * liquidLevel;
    if (liquidH <= 0) return;

    const drawY = y + height - liquidH;
    const t = this.time;
    const intensity = this.state.shimmerIntensity;

    ctx.save();
    ctx.globalAlpha = intensity * 0.12;

    const shimmerLines = Math.floor(intensity * 6) + 2;
    for (let i = 0; i < shimmerLines; i++) {
      const lineY = drawY + liquidH * ((i + t * 0.5) % shimmerLines) / shimmerLines;
      const offset = Math.sin(t * 4 + i * 2) * 3;

      ctx.strokeStyle = "rgba(255,200,100,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + offset, lineY);
      ctx.lineTo(x + width + offset, lineY);
      ctx.stroke();
    }

    ctx.restore();
  }

  reset(): void {
    this.state = {
      temperature: 25,
      level: "room",
      shimmerIntensity: 0,
      waveAmplitude: 0,
      waveFrequency: 1,
      bubbleFrequencyMultiplier: 1,
      steamIntensity: 0,
      glowIntensity: 0,
      glowColor: "#ff6600",
    };
    this.targetTemp = 25;
    this.time = 0;
  }
}
