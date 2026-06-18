/**
 * Canvas 沉淀特效
 * 
 * 性能优化：
 * - 从 20 个 React 组件 → 1 个 Canvas 元素
 * - 使用 requestAnimationFrame
 * - 沉淀物堆积在底部，性能更好
 */

import { useEffect, useRef, useCallback } from "react";

// 沉淀颗粒类
class Particle {
  constructor(canvasWidth, canvasHeight, color) {
    this.reset(canvasWidth, canvasHeight, color);
  }

  reset(canvasWidth, canvasHeight, color) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight * 0.3 + Math.random() * canvasHeight * 0.2;
    this.size = 1 + Math.random() * 3;
    this.color = color;
    this.speedY = 0.5 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.opacity = 0.6 + Math.random() * 0.4;
    this.settled = false;
    this.settledY = canvasHeight - 20 - Math.random() * 10;
  }

  update(canvasHeight) {
    if (this.settled) return true;

    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    // 到达底部
    if (this.y >= this.settledY) {
      this.y = this.settledY;
      this.settled = true;
      this.speedY = 0;
      this.speedX = 0;
    }

    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // 画一个不规则的沉淀颗粒
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

    ctx.restore();
  }
}

export default function CanvasPrecipitateEffect({ active, color = "#f5f5f4" }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const isActiveRef = useRef(false);
  const settledCountRef = useRef(0);

  // 初始化颗粒
  const initParticles = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: 20 }, () =>
      new Particle(canvas.width, canvas.height, color)
    );
    settledCountRef.current = 0;
  }, [color]);

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActiveRef.current) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制沉淀层（如果有很多沉淀物）
    if (settledCountRef.current > 5) {
      const layerHeight = Math.min(settledCountRef.current * 2, 30);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(0, canvas.height - layerHeight - 10, canvas.width, layerHeight);
      ctx.globalAlpha = 1;
    }

    // 更新和绘制颗粒
    particlesRef.current.forEach((particle) => {
      const wasSettled = particle.settled;
      particle.update(canvas.height);
      if (!wasSettled && particle.settled) {
        settledCountRef.current++;
      }
      particle.draw(ctx);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置 canvas 尺寸
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
      particlesRef.current = [];
      settledCountRef.current = 0;
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
