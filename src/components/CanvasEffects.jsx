/**
 * Canvas 特效组件
 * 
 * 作用：
 * 1. 使用 Canvas 渲染粒子特效
 * 2. 替代原有的 React 组件动画
 * 3. 提供更好的性能
 */

import { useEffect, useRef } from "react";
import { useCanvasAnimation } from "../hooks/useCanvasAnimation";

/**
 * Canvas 特效组件
 * @param {Object} props - 组件属性
 */
export default function CanvasEffects({
  active = false,
  effect = "none",
  config = {},
  width = 300,
  height = 400,
  className = "",
  style = {},
}) {
  const prevEffectRef = useRef(null);
  const {
    canvasRef,
    particleCount,
    isActive,
    actions,
  } = useCanvasAnimation({
    width,
    height,
    autoStart: false,
    maxParticles: 500,
  });

  // 当效果改变时更新
  useEffect(() => {
    if (active && effect !== "none") {
      if (!isActive) {
        actions.start();
      }

      // 只在效果改变时更新
      if (effect !== prevEffectRef.current) {
        actions.setReactionEffect(effect, config);
        prevEffectRef.current = effect;
      }
    } else {
      if (isActive) {
        actions.stop();
        actions.clear();
        prevEffectRef.current = null;
      }
    }
  }, [active, effect, config, isActive, actions]);

  // 清理
  useEffect(() => {
    return () => {
      if (isActive) {
        actions.stop();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`pointer-events-none ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
}

/**
 * 气泡特效组件
 */
export function BubbleCanvas({ active, intensity = "normal", width, height }) {
  return (
    <CanvasEffects
      active={active}
      effect="gas"
      config={{
        rate: intensity === "high" ? 25 : 15,
        intensity,
      }}
      width={width}
      height={height}
    />
  );
}

/**
 * 沉淀特效组件
 */
export function PrecipitateCanvas({ active, color = "#f5f5f4", width, height }) {
  return (
    <CanvasEffects
      active={active}
      effect="precipitate"
      config={{ color }}
      width={width}
      height={height}
    />
  );
}

/**
 * 烟雾特效组件
 */
export function SmokeCanvas({ active, width, height }) {
  return (
    <CanvasEffects
      active={active}
      effect="smoke"
      width={width}
      height={height}
    />
  );
}
