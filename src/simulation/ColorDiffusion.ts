import type { ColorState, VesselGeometry } from "./types";
import { simEventBus } from "./SimEventBus";

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
}

function lerpColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

// Simplex-like noise (fast 2D)
const PERM = new Uint8Array(512);
for (let i = 0; i < 256; i++) PERM[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [PERM[i], PERM[j]] = [PERM[j], PERM[i]];
}
for (let i = 0; i < 256; i++) PERM[i + 256] = PERM[i];

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function noise2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];
  const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
  const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
  return lerp(x1, x2, v);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export class ColorDiffusion {
  state: ColorState = {
    current: "#1e293b",
    target: "#1e293b",
    progress: 1,
    diffusionOrigin: { x: 0.5, y: 0.5 },
    diffusionRadius: 0,
    noiseScale: 3,
    noiseSpeed: 0.5,
  };

  private time = 0;
  private animating = false;
  private fromColor = "#1e293b";
  private speed = 0.003;

  setTarget(color: string, origin?: { x: number; y: number }): void {
    if (color === this.state.target) return;
    this.fromColor = this.state.current;
    this.state.target = color;
    this.state.progress = 0;
    this.state.diffusionRadius = 0;
    if (origin) this.state.diffusionOrigin = origin;
    this.animating = true;
    simEventBus.emit("COLOR_CHANGED", {
      fromColor: this.fromColor,
      toColor: color,
      progress: 0,
    });
  }

  update(deltaTime: number): void {
    this.time += deltaTime * 0.001;

    if (!this.animating) return;

    this.state.progress = Math.min(1, this.state.progress + this.speed * (deltaTime / 16));
    this.state.diffusionRadius = smoothstep(this.state.progress) * 1.5;

    const t = smoothstep(this.state.progress);
    this.state.current = lerpColor(this.fromColor, this.state.target, t);

    simEventBus.emit("COLOR_CHANGED", {
      fromColor: this.fromColor,
      toColor: this.state.target,
      progress: this.state.progress,
    });

    if (this.state.progress >= 1) {
      this.animating = false;
      this.state.current = this.state.target;
    }
  }

  renderTo(
    ctx: CanvasRenderingContext2D,
    vessel: VesselGeometry,
    liquidLevel: number
  ): void {
    const { x, y, width, height } = vessel.liquidArea;
    const liquidH = height * liquidLevel;
    if (liquidH <= 0) return;

    const drawY = y + height - liquidH;
    const drawH = liquidH;

    if (!this.animating) {
      ctx.fillStyle = this.state.current;
      ctx.fillRect(x, drawY, width, drawH);
      return;
    }

    const imageData = ctx.createImageData(width, Math.ceil(drawH));
    const data = imageData.data;
    const [r1, g1, b1] = hexToRgb(this.fromColor);
    const [r2, g2, b2] = hexToRgb(this.state.target);
    const t = smoothstep(this.state.progress);
    const noiseScale = this.state.noiseScale;
    const noiseTime = this.time * this.state.noiseSpeed;
    const ox = this.state.diffusionOrigin.x * width;
    const oy = this.state.diffusionOrigin.y * drawH;
    const maxDist = Math.sqrt(width * width + drawH * drawH);

    for (let py = 0; py < drawH; py++) {
      for (let px = 0; px < width; px++) {
        const dx = px - ox;
        const dy = py - oy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;

        const n = noise2D(px * 0.02 * noiseScale + noiseTime, py * 0.02 * noiseScale + noiseTime) * 0.3;
        const wave = dist * 0.5 + n;
        const localT = smoothstep(Math.max(0, Math.min(1, t * 1.8 - wave * 0.5)));

        const idx = (py * width + px) * 4;
        data[idx] = r1 + (r2 - r1) * localT;
        data[idx + 1] = g1 + (g2 - g1) * localT;
        data[idx + 2] = b1 + (b2 - b1) * localT;
        data[idx + 3] = 190;
      }
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, drawY, width, drawH);
    ctx.clip();
    ctx.putImageData(imageData, x, drawY);
    ctx.restore();
  }

  get current(): string {
    return this.state.current;
  }

  get isAnimating(): boolean {
    return this.animating;
  }

  reset(): void {
    this.state = {
      current: "#1e293b",
      target: "#1e293b",
      progress: 1,
      diffusionOrigin: { x: 0.5, y: 0.5 },
      diffusionRadius: 0,
      noiseScale: 3,
      noiseSpeed: 0.5,
    };
    this.animating = false;
    this.time = 0;
  }
}
