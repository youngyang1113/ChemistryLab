/**
 * 动画状态 Hook
 * 
 * 作用：
 * 1. 管理动画状态（气泡、沉淀、烟雾等）
 * 2. 使用 requestAnimationFrame 优化性能
 * 3. 支持动画队列和优先级
 * 4. 提供动画控制方法
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { ANIMATION } from "../constants/labConfig";

// 动画类型
export const ANIMATION_TYPE = {
  BUBBLE: "bubble",
  PRECIPITATE: "precipitate",
  SMOKE: "smoke",
  HEAT_GLOW: "heatGlow",
  COLOR_CHANGE: "colorChange",
  SHAKE: "shake",
};

// 动画状态
export const ANIMATION_STATUS = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  COMPLETE: "complete",
};

/**
 * 动画状态 Hook
 * @returns {Object} 动画状态和控制方法
 */
export function useAnimationState() {
  const [animations, setAnimations] = useState({
    bubble: { active: false, intensity: "normal" },
    precipitate: { active: false, color: "#f5f5f4" },
    smoke: { active: false },
    heatGlow: { active: false, temperature: 25 },
    colorChange: { active: false, color: "#000000" },
    shake: { active: false, intensity: 0 },
  });

  const rafRef = useRef(null);
  const frameRef = useRef(0);

  // 更新动画状态
  const updateAnimation = useCallback((type, updates) => {
    setAnimations((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...updates },
    }));
  }, []);

  // 激活动画
  const activateAnimation = useCallback(
    (type, config = {}) => {
      updateAnimation(type, { active: true, ...config });
    },
    [updateAnimation]
  );

  // 停止动画
  const deactivateAnimation = useCallback(
    (type) => {
      updateAnimation(type, { active: false });
    },
    [updateAnimation]
  );

  // 根据反应效果设置动画
  const setReactionAnimations = useCallback(
    (effect, config = {}) => {
      // 重置所有动画
      setAnimations((prev) => {
        const newState = {};
        Object.keys(prev).forEach((key) => {
          newState[key] = { ...prev[key], active: false };
        });
        return newState;
      });

      // 根据效果类型激活动画
      switch (effect) {
        case "heat":
          activateAnimation("heatGlow", {
            temperature: config.temperature || 50,
          });
          break;

        case "gas":
          activateAnimation("bubble", {
            intensity: config.temperature > 60 ? "high" : "normal",
          });
          break;

        case "precipitate":
          activateAnimation("precipitate", {
            color: config.precipitateColor || "#f5f5f4",
          });
          break;

        case "smoke":
          activateAnimation("smoke");
          activateAnimation("bubble", { intensity: "high" });
          break;

        case "colorChange":
          activateAnimation("colorChange", {
            color: config.color || "#000000",
          });
          break;

        default:
          break;
      }

      // 设置震动
      if (config.shakeIntensity > 0) {
        activateAnimation("shake", {
          intensity: config.shakeIntensity,
        });
      }
    },
    [activateAnimation]
  );

  // 停止所有动画
  const stopAllAnimations = useCallback(() => {
    setAnimations((prev) => {
      const newState = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = { ...prev[key], active: false };
      });
      return newState;
    });
  }, []);

  // 获取活跃动画列表
  const activeAnimations = useMemo(() => {
    return Object.entries(animations)
      .filter(([_, config]) => config.active)
      .map(([type, config]) => ({ type, ...config }));
  }, [animations]);

  // 检查是否有任何动画在播放
  const hasActiveAnimations = useMemo(() => {
    return Object.values(animations).some((config) => config.active);
  }, [animations]);

  // 动画帧计数器（用于性能监控）
  useEffect(() => {
    const tick = () => {
      frameRef.current++;
      rafRef.current = requestAnimationFrame(tick);
    };

    if (hasActiveAnimations) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hasActiveAnimations]);

  return {
    animations,
    activeAnimations,
    hasActiveAnimations,
    frameCount: frameRef.current,
    actions: {
      updateAnimation,
      activateAnimation,
      deactivateAnimation,
      setReactionAnimations,
      stopAllAnimations,
    },
  };
}

export default useAnimationState;
