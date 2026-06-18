/**
 * Canvas 动画 Hook
 * 
 * 作用：
 * 1. 将 Canvas 动画引擎集成到 React
 * 2. 管理 Canvas 生命周期
 * 3. 提供响应式动画控制
 */

import { useEffect, useRef, useCallback, useState } from "react";
import {
  AnimationEngine,
  ParticleEmitter,
  PARTICLE_TYPE,
  createBubble,
  createPrecipitate,
  createSmoke,
  createSpark,
} from "../services/animationEngine";

/**
 * Canvas 动画 Hook
 * @param {Object} options - 配置选项
 * @returns {Object} 动画控制方法
 */
export function useCanvasAnimation(options = {}) {
  const {
    width = 300,
    height = 400,
    maxParticles = 500,
    autoStart = false,
  } = options;

  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const emittersRef = useRef([]);
  const [particleCount, setParticleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // 初始化引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new AnimationEngine(canvas);
    engineRef.current = engine;

    // 设置更新回调
    engine.onUpdate = (dt, count) => {
      setParticleCount(count);
    };

    if (autoStart) {
      engine.start();
      setIsActive(true);
    }

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [autoStart]);

  // 更新 Canvas 尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
  }, [width, height]);

  // 启动动画
  const start = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.start();
      setIsActive(true);
    }
  }, []);

  // 停止动画
  const stop = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.stop();
      setIsActive(false);
    }
  }, []);

  // 暂停动画
  const pause = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.pause();
    }
  }, []);

  // 恢复动画
  const resume = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.resume();
    }
  }, []);

  // 清空粒子
  const clear = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.clearParticles();
      engine.clearEmitters();
      emittersRef.current = [];
    }
  }, []);

  // 添加气泡效果
  const addBubbles = useCallback((config = {}) => {
    const engine = engineRef.current;
    if (!engine) return;

    const canvas = canvasRef.current;
    const x = config.x || canvas.width / 2;
    const y = config.y || canvas.height - 20;

    const emitter = new ParticleEmitter({
      x,
      y,
      rate: config.rate || 15,
      type: PARTICLE_TYPE.BUBBLE,
      particleConfig: {
        size: config.size || 3,
        color: config.color || "rgba(255, 255, 255, 0.4)",
      },
      onCreateParticle: (particle) => {
        if (engine.getParticleCount() < maxParticles) {
          engine.addParticle(particle);
        }
      },
    });

    engine.addEmitter(emitter);
    emittersRef.current.push(emitter);

    return emitter;
  }, [maxParticles]);

  // 添加沉淀效果
  const addPrecipitate = useCallback((config = {}) => {
    const engine = engineRef.current;
    if (!engine) return;

    const canvas = canvasRef.current;
    const x = config.x || canvas.width / 2;
    const y = config.y || canvas.height / 3;

    const emitter = new ParticleEmitter({
      x,
      y,
      rate: config.rate || 20,
      type: PARTICLE_TYPE.PRECIPITATE,
      particleConfig: {
        color: config.color || "#f5f5f4",
        size: config.size || 2,
      },
      onCreateParticle: (particle) => {
        if (engine.getParticleCount() < maxParticles) {
          engine.addParticle(particle);
        }
      },
    });

    engine.addEmitter(emitter);
    emittersRef.current.push(emitter);

    return emitter;
  }, [maxParticles]);

  // 添加烟雾效果
  const addSmoke = useCallback((config = {}) => {
    const engine = engineRef.current;
    if (!engine) return;

    const canvas = canvasRef.current;
    const x = config.x || canvas.width / 2;
    const y = config.y || canvas.height / 2;

    const emitter = new ParticleEmitter({
      x,
      y,
      rate: config.rate || 8,
      type: PARTICLE_TYPE.SMOKE,
      particleConfig: {
        size: config.size || 15,
        color: config.color || "rgba(200, 200, 200, 0.3)",
      },
      onCreateParticle: (particle) => {
        if (engine.getParticleCount() < maxParticles) {
          engine.addParticle(particle);
        }
      },
    });

    engine.addEmitter(emitter);
    emittersRef.current.push(emitter);

    return emitter;
  }, [maxParticles]);

  // 添加火花效果
  const addSparks = useCallback((config = {}) => {
    const engine = engineRef.current;
    if (!engine) return;

    const canvas = canvasRef.current;
    const x = config.x || canvas.width / 2;
    const y = config.y || canvas.height / 2;

    const emitter = new ParticleEmitter({
      x,
      y,
      rate: config.rate || 30,
      type: PARTICLE_TYPE.SPARK,
      particleConfig: {
        color: config.color || "#fbbf24",
      },
      onCreateParticle: (particle) => {
        if (engine.getParticleCount() < maxParticles) {
          engine.addParticle(particle);
        }
      },
    });

    engine.addEmitter(emitter);
    emittersRef.current.push(emitter);

    return emitter;
  }, [maxParticles]);

  // 移除发射器
  const removeEmitter = useCallback((emitter) => {
    const engine = engineRef.current;
    if (engine && emitter) {
      engine.removeEmitter(emitter);
      emittersRef.current = emittersRef.current.filter((e) => e !== emitter);
    }
  }, []);

  // 根据反应类型设置效果
  const setReactionEffect = useCallback(
    (effect, config = {}) => {
      clear();

      switch (effect) {
        case "gas":
          addBubbles({
            rate: config.intensity === "high" ? 25 : 15,
            ...config,
          });
          break;

        case "precipitate":
          addPrecipitate({
            color: config.color || "#f5f5f4",
            ...config,
          });
          break;

        case "smoke":
          addSmoke({
            rate: 12,
            ...config,
          });
          addBubbles({
            rate: 20,
            ...config,
          });
          break;

        case "heat":
          addSparks({
            rate: 10,
            ...config,
          });
          break;

        default:
          break;
      }
    },
    [clear, addBubbles, addPrecipitate, addSmoke, addSparks]
  );

  return {
    canvasRef,
    particleCount,
    isActive,
    actions: {
      start,
      stop,
      pause,
      resume,
      clear,
      addBubbles,
      addPrecipitate,
      addSmoke,
      addSparks,
      removeEmitter,
      setReactionEffect,
    },
  };
}

export default useCanvasAnimation;
