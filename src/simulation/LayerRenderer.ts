import type { RenderLayer, LayerId, VesselGeometry } from "./types";

const LAYER_ORDER: LayerId[] = ["background", "liquid", "solid", "gas", "effect", "ui"];

export class LayerRenderer {
  layers = new Map<LayerId, RenderLayer>();
  private container: HTMLElement;
  private width = 0;
  private height = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.resize();
  }

  resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    for (const [, layer] of this.layers) {
      layer.canvas.width = this.width;
      layer.canvas.height = this.height;
    }
  }

  initLayers(): void {
    for (const id of LAYER_ORDER) {
      if (this.layers.has(id)) continue;
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";

      const ctx = canvas.getContext("2d")!;
      this.layers.set(id, {
        id,
        canvas,
        ctx,
        visible: true,
        opacity: 1,
        zIndex: LAYER_ORDER.indexOf(id),
      });
      this.container.appendChild(canvas);
    }

    this.applyZOrder();
  }

  private applyZOrder(): void {
    for (const [, layer] of this.layers) {
      layer.canvas.style.zIndex = String(layer.zIndex * 10);
    }
  }

  getLayer(id: LayerId): RenderLayer | undefined {
    return this.layers.get(id);
  }

  clearLayer(id: LayerId): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clearAll(): void {
    for (const id of LAYER_ORDER) this.clearLayer(id);
  }

  setVisibility(id: LayerId, visible: boolean): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.visible = visible;
      layer.canvas.style.display = visible ? "block" : "none";
    }
  }

  setOpacity(id: LayerId, opacity: number): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
      layer.canvas.style.opacity = String(layer.opacity);
    }
  }

  renderBackground(vessel: VesselGeometry): void {
    const layer = this.layers.get("background");
    if (!layer || !layer.visible) return;
    const ctx = layer.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.strokeStyle = "rgba(200, 220, 240, 0.3)";
    ctx.lineWidth = vessel.wallThickness;

    const { x, y, width, height, cornerRadius } = vessel;

    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "rgba(200, 220, 240, 0.08)";
    ctx.fill();

    ctx.strokeStyle = "rgba(180, 200, 220, 0.15)";
    ctx.lineWidth = 0.5;
    const marks = [0.2, 0.4, 0.6, 0.8];
    for (const pct of marks) {
      const markY = y + height * (1 - pct);
      ctx.beginPath();
      ctx.moveTo(x + 2, markY);
      ctx.lineTo(x + 15, markY);
      ctx.stroke();

      ctx.fillStyle = "rgba(160, 180, 200, 0.4)";
      ctx.font = "9px monospace";
      ctx.fillText(`${Math.round(pct * 100)}`, x + 17, markY + 3);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 20);
    ctx.lineTo(x + 8, y + height - 20);
    ctx.stroke();

    ctx.restore();
  }

  destroy(): void {
    for (const [, layer] of this.layers) {
      layer.canvas.remove();
    }
    this.layers.clear();
  }

  get width_(): number { return this.width; }
  get height_(): number { return this.height; }
}
