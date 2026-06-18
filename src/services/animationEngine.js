/**
 * Canvas 动画引擎
 * 
 * 作用：
 * 1. 使用 Canvas 2D 替代 React 组件渲染粒子
 * 2. 支持大量粒子（1000+）而不影响性能
 * 3. 提供统一的动画管理接口
 * 4. 支持动画暂停/恢复
 */

// 粒子类型
export const PARTICLE_TYPE = {
  BUBBLE: "bubble",
  PRECIPITATE: "precipitate",
  SMOKE: "smoke",
  SPARK: "spark",
};

/**
 * 粒子基类
 */
class Particle {
  constructor(x, y, type, config = {}) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = config.vx || 0;
    this.vy = config.vy || 0;
    this.size = config.size || 3;
    this.color = config.color || "#ffffff";
    this.opacity = config.opacity || 1;
    this.life = config.life || 1;
    this.maxLife = config.life || 1;
    this.gravity = config.gravity || 0;
    this.friction = config.friction || 0.99;
    this.isDead = false;
  }

  update(dt) {
    // 更新位置
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // 应用重力
    this.vy += this.gravity * dt;

    // 应用摩擦力
    this.vx *= this.friction;
    this.vy *= this.friction;

    // 更新生命值
    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
    }

    // 更新透明度（基于生命值）
    this.opacity = Math.max(0, this.life / this.maxLife);
  }

  draw(ctx) {
    // 由子类实现
  }
}

/**
 * 气泡粒子
 */
class BubbleParticle extends Particle {
  constructor(x, y, config = {}) {
    super(x, y, PARTICLE_TYPE.BUBBLE, {
      vx: (Math.random() - 0.5) * 20,
      vy: -50 - Math.random() * 50,
      size: 2 + Math.random() * 4,
      color: "rgba(255, 255, 255, 0.4)",
      life: 2 + Math.random() * 2,
      gravity: -10,
      friction: 0.98,
      ...config,
    });
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 2 + Math.random() * 3;
  }

  update(dt) {
    super.update(dt);
    this.wobble += this.wobbleSpeed * dt;
    this.x += Math.sin(this.wobble) * 0.5;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity * 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(
      this.x - this.size * 0.3,
      this.y - this.size * 0.3,
      this.size * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 沉淀粒子
 */
class PrecipitateParticle extends Particle {
  constructor(x, y, config = {}) {
    super(x, y, PARTICLE_TYPE.PRECIPITATE, {
      vx: (Math.random() - 0.5) * 10,
      vy: 20 + Math.random() * 30,
      size: 1 + Math.random() * 3,
      color: config.color || "#f5f5f4",
      life: 3 + Math.random() * 2,
      gravity: 30,
      friction: 0.95,
      ...config,
    });
    this.settled = false;
    this.settledY = 0;
  }

  update(dt, canvasHeight) {
    if (this.settled) {
      return;
    }

    super.update(dt);

    // 检查是否到达底部
    if (this.y > canvasHeight - 20) {
      this.settled = true;
      this.settledY = canvasHeight - 20;
      this.y = this.settledY;
      this.vy = 0;
      this.vx = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    ctx.restore();
  }
}

/**
 * 烟雾粒子
 */
class SmokeParticle extends Particle {
  constructor(x, y, config = {}) {
    super(x, y, PARTICLE_TYPE.SMOKE, {
      vx: (Math.random() - 0.5) * 30,
      vy: -30 - Math.random() * 40,
      size: 10 + Math.random() * 20,
      color: "rgba(200, 200, 200, 0.3)",
      life: 2 + Math.random() * 2,
      gravity: -5,
      friction: 0.97,
      ...config,
    });
  }

  update(dt) {
    super.update(dt);
    this.size += dt * 10; // 烟雾扩散
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity * 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.filter = "blur(3px)";
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 火花粒子
 */
class SparkParticle extends Particle {
  constructor(x, y, config = {}) {
    super(x, y, PARTICLE_TYPE.SPARK, {
      vx: (Math.random() - 0.5) * 100,
      vy: -50 - Math.random() * 100,
      size: 1 + Math.random() * 2,
      color: "#fbbf24",
      life: 0.5 + Math.random() * 0.5,
      gravity: 50,
      friction: 0.99,
      ...config,
    });
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 动画引擎
 */
export class AnimationEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.emitters = [];
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.animationId = null;
    this.onUpdate = null;
    this.onRender = null;
  }

  /**
   * 启动引擎
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.tick();
  }

  /**
   * 停止引擎
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 暂停
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * 恢复
   */
  resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  /**
   * 主循环
   */
  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // 限制最大时间步长
    this.lastTime = now;

    if (!this.isPaused) {
      this.update(dt);
      this.render();
    }

    this.animationId = requestAnimationFrame(() => this.tick());
  }

  /**
   * 更新
   */
  update(dt) {
    // 更新发射器
    this.emitters.forEach((emitter) => emitter.update(dt));

    // 更新粒子
    this.particles.forEach((particle) => {
      particle.update(dt, this.canvas.height);
    });

    // 移除死亡粒子
    this.particles = this.particles.filter((p) => !p.isDead);

    // 回调
    if (this.onUpdate) {
      this.onUpdate(dt, this.particles.length);
    }
  }

  /**
   * 渲染
   */
  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 渲染粒子
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });

    // 回调
    if (this.onRender) {
      this.onRender(ctx, width, height);
    }
  }

  /**
   * 添加粒子
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * 添加发射器
   */
  addEmitter(emitter) {
    this.emitters.push(emitter);
  }

  /**
   * 移除发射器
   */
  removeEmitter(emitter) {
    const index = this.emitters.indexOf(emitter);
    if (index > -1) {
      this.emitters.splice(index, 1);
    }
  }

  /**
   * 清空所有粒子
   */
  clearParticles() {
    this.particles = [];
  }

  /**
   * 清空所有发射器
   */
  clearEmitters() {
    this.emitters = [];
  }

  /**
   * 获取粒子数量
   */
  getParticleCount() {
    return this.particles.length;
  }
}

/**
 * 粒子发射器
 */
export class ParticleEmitter {
  constructor(config = {}) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.rate = config.rate || 10; // 每秒发射数量
    this.type = config.type || PARTICLE_TYPE.BUBBLE;
    this.config = config.particleConfig || {};
    this.isActive = true;
    this.accumulator = 0;
    this.onCreateParticle = config.onCreateParticle || null;
  }

  update(dt) {
    if (!this.isActive) return;

    this.accumulator += this.rate * dt;

    while (this.accumulator >= 1) {
      this.emit();
      this.accumulator -= 1;
    }
  }

  emit() {
    const particle = this.createParticle();
    if (particle && this.onCreateParticle) {
      this.onCreateParticle(particle);
    }
    return particle;
  }

  createParticle() {
    const x = this.x + (Math.random() - 0.5) * 20;
    const y = this.y;

    switch (this.type) {
      case PARTICLE_TYPE.BUBBLE:
        return new BubbleParticle(x, y, this.config);
      case PARTICLE_TYPE.PRECIPITATE:
        return new PrecipitateParticle(x, y, this.config);
      case PARTICLE_TYPE.SMOKE:
        return new SmokeParticle(x, y, this.config);
      case PARTICLE_TYPE.SPARK:
        return new SparkParticle(x, y, this.config);
      default:
        return new BubbleParticle(x, y, this.config);
    }
  }
}

/**
 * 创建动画引擎实例
 */
export function createAnimationEngine(canvas) {
  return new AnimationEngine(canvas);
}

/**
 * 创建粒子发射器
 */
export function createEmitter(config) {
  return new ParticleEmitter(config);
}

/**
 * 创建不同类型的粒子
 */
export function createBubble(x, y, config) {
  return new BubbleParticle(x, y, config);
}

export function createPrecipitate(x, y, config) {
  return new PrecipitateParticle(x, y, config);
}

export function createSmoke(x, y, config) {
  return new SmokeParticle(x, y, config);
}

export function createSpark(x, y, config) {
  return new SparkParticle(x, y, config);
}

export default {
  AnimationEngine,
  ParticleEmitter,
  createAnimationEngine,
  createEmitter,
  createBubble,
  createPrecipitate,
  createSmoke,
  createSpark,
  PARTICLE_TYPE,
};
