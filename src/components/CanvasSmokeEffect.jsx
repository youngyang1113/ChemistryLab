/**
 * Canvas 烟雾特效
 * 
 * 性能优化：
 * - 从 12 个 React 组件 → 1 个 Canvas 元素
 * - 使用 requestAnimationFrame
 * - 支持大量粒子而不影响性能
 */

import { useEffect, useRef, useCallback } from "react";

// 烟雾粒子类
class SmokeParticle {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight);
  }

  reset(canvasWidth, canvasHeight) {
    this.x = canvasWidth * 0.3 + Math.random() * canvasWidth * 0.4;
    this.y = canvasHeight * 0.4 + Math.random() * canvasHeight * 0.2;
    this.size = 10 + Math.random() * 20;
    this.speedY = -(1 + Math.random() * 2);
    this.speedX = (Math.random() - 0.5) * 1;
    this.opacity = 0.15 + Math.random() * 0.2;
    this.life = 0;
    this.maxLife = 80 + Math.random() * 40;
    this.growRate = 0.3 + Math.random() * 0.2;
  }

  update() {
    this.life++;
    this.y += this.speedY;
    this.x += this.speedX;
    this.size += this.growRate;

    // 生命周期淡出
    if (this.life > this.maxLife * 0.5) {
      this.opacity *= 0.97;
    }

    return this.life < this.maxLife && this.opacity > 0.01;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    // 画一个模糊的圆形
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0, "rgba(180, 180, 180, 0.3)");
    gradient.addColorStop(1, "rgba(180, 180, 180, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 火花粒子类
class SparkParticle {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight);
  }

  reset(canvasWidth, canvasHeight) {
    this.x = canvasWidth * 0.3 + Math.random() * canvasWidth * 0.4;
    this.y = canvasHeight * 0.4 + Math.random() * canvasHeight * 0.2;
    this.size = 1 + Math.random() * 2;
    this.speedY = -(3 + Math.random() * 5);
    this.speedX = (Math.random() - 0.5) * 3;
    this.opacity = 0.8 + Math.random() * 0.2;
    this.life = 0;
    this.maxLife = 20 + Math.random() * 20;
    this.color = Math.random() > 0.5 ? "#fbbf24" : "#f59e0b";
  }

  update() {
    this.life++;
    this.y += this.speedY;
    this.x += this.speedX;
    this.speedY += 0.1; // 重力

    this.opacity = 1 - (this.life / this.maxLife);

    return this.life < this.maxLife;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export default function CanvasSmokeEffect({ active }) {
  const canvasRef = useRef(null);
  const smokeRef = useRef([]);
  const sparksRef = useRef([]);
  const animationRef = useRef(null);
  const isActiveRef = useRef(false);

  // 初始化粒子
  const initParticles = useCallback((canvas) => {
    smokeRef.current = Array.from({ length: 12 }, () =>
      new SmokeParticle(canvas.width, canvas.height)
    );
    sparksRef.current = Array.from({ length: 8 }, () =>
      new SparkParticle(canvas.width, canvas.height)
    );
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActiveRef.current) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制烟雾
    smokeRef.current = smokeRef.current.filter((p) => {
      const alive = p.update();
      if (alive) p.draw(ctx);
      return alive;
    });

    // 补充烟雾粒子
    while (smokeRef.current.length < 12) {
      smokeRef.current.push(new SmokeParticle(canvas.width, canvas.height));
    }

    // 更新和绘制火花
    sparksRef.current = sparksRef.current.filter((p) => {
      const alive = p.update();
      if (alive) p.draw(ctx);
      return alive;
    });

    // 补充火花粒子
    while (sparksRef.current.length < 8) {
      sparksRef.current.push(new SparkParticle(canvas.width, canvas.height));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    updateSize();

    if (active) {
      isActiveRef.current = true;
      initParticles(canvas);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      smokeRef.current = [];
      sparksRef.current = [];
    }

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, initParticles, animate]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
