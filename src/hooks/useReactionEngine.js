/**
 * 反应引擎 Hook
 * 
 * 作用：
 * 1. 连接反应引擎服务和 React 状态
 * 2. 处理反应逻辑和副作用
 * 3. 管理反应历史和日志
 * 4. 支持 AI 驱动的反应
 */

import { useCallback, useRef, useEffect } from "react";
import { getReactionEngine, REACTION_STATUS } from "../services/reactionEngine";
import { ANIMATION, SHAKE_THRESHOLDS } from "../constants/labConfig";

/**
 * 反应引擎 Hook
 * @param {Object} beakerState - 烧杯状态
 * @param {Object} beakerActions - 烧杯操作方法
 * @returns {Object} 反应引擎操作方法
 */
export function useReactionEngine(beakerState, beakerActions) {
  const engineRef = useRef(null);
  const reactionLogRef = useRef([]);
  const colorTimersRef = useRef([]);

  // 获取反应引擎实例
  useEffect(() => {
    engineRef.current = getReactionEngine();
  }, []);

  // 计算震动强度
  const calculateShakeIntensity = useCallback((tempDelta) => {
    if (tempDelta >= SHAKE_THRESHOLDS.HIGH) return 3;
    if (tempDelta >= SHAKE_THRESHOLDS.MEDIUM) return 2;
    if (tempDelta >= SHAKE_THRESHOLDS.LOW) return 1;
    return 0;
  }, []);

  // 处理颜色渐变序列
  const handleColorSequence = useCallback(
    (sequence, onComplete) => {
      // 清除之前的定时器
      colorTimersRef.current.forEach(clearTimeout);
      colorTimersRef.current = [];

      if (!sequence || sequence.length === 0) return;

      sequence.forEach(({ color, duration }) => {
        if (duration === 0) {
          beakerActions.setLiquidColor(color);
        } else {
          const timer = setTimeout(() => {
            beakerActions.setLiquidColor(color);
          }, duration);
          colorTimersRef.current.push(timer);
        }
      });

      // 设置完成定时器
      const lastDuration = Math.max(...sequence.map((s) => s.duration));
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, lastDuration + 500);
      colorTimersRef.current.push(completeTimer);
    },
    [beakerActions]
  );

  // 添加试剂并触发反应
  const addReagent = useCallback(
    (reagentId) => {
      const engine = engineRef.current;
      if (!engine) return false;

      // 检查是否重复
      if (beakerState.beakerContents.includes(reagentId)) {
        return false;
      }

      // 保存当前状态到历史
      const snapshot = {
        beakerContents: [...beakerState.beakerContents],
        liquidColor: beakerState.liquidColor,
        liquidLevel: beakerState.liquidLevel,
        temperature: beakerState.temperature,
        ph: beakerState.ph,
        effect: beakerState.effect,
        precipitateColor: beakerState.precipitateColor,
        timestamp: Date.now(),
      };
      reactionLogRef.current.push(snapshot);

      // 如果是第一个试剂，直接添加
      if (beakerState.beakerContents.length === 0) {
        beakerActions.addReagent(reagentId);
        beakerActions.increaseLiquidLevel(8);
        return true;
      }

      // 尝试反应
      const result = engine.executeReaction(
        beakerState.beakerContents,
        reagentId,
        beakerState
      );

      if (result) {
        // 添加试剂
        beakerActions.addReagent(reagentId);

        // 应用反应结果
        beakerActions.setLiquidColor(result.liquidColor);
        beakerActions.increaseLiquidLevel(12);
        beakerActions.setTemperature(result.temperature);
        beakerActions.setPh(result.ph);
        beakerActions.setEffect(result.effect);

        if (result.precipitateColor) {
          beakerActions.setPrecipitateColor(result.precipitateColor);
        }

        // 计算震动强度
        const shakeIntensity = calculateShakeIntensity(
          result.temperature - beakerState.temperature
        );

        // 设置反应状态
        beakerActions.setReactionState(true, result.reaction, shakeIntensity);

        // 处理颜色渐变序列
        if (result.colorSequence) {
          handleColorSequence(result.colorSequence);
        }

        return true;
      } else {
        // 没有反应，只添加试剂
        beakerActions.addReagent(reagentId);
        beakerActions.increaseLiquidLevel(8);
        return true;
      }
    },
    [beakerState, beakerActions, calculateShakeIntensity, handleColorSequence]
  );

  // 完成反应
  const completeReaction = useCallback(() => {
    beakerActions.setReactionState(false, null, 0);
    beakerActions.setEffect("none");

    // 清除颜色渐变定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];
  }, [beakerActions]);

  // 重置烧杯
  const resetBeaker = useCallback(() => {
    // 清除所有定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];

    // 重置状态
    beakerActions.reset();

    // 清空日志
    reactionLogRef.current = [];
  }, [beakerActions]);

  // 获取反应日志
  const getReactionLog = useCallback(() => {
    return [...reactionLogRef.current];
  }, []);

  // 获取当前状态信息
  const getStateInfo = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return null;

    return {
      reagents: beakerState.beakerContents,
      temperature: beakerState.temperature,
      ph: beakerState.ph,
      effect: beakerState.effect,
      isReacting: beakerState.isReacting,
      currentReaction: beakerState.currentReaction,
      possibleReactions: beakerState.beakerContents.flatMap((id) =>
        engine.getReactionsForReagent(id)
      ),
    };
  }, [beakerState]);

  // 搜索反应
  const searchReactions = useCallback((query) => {
    const engine = engineRef.current;
    if (!engine) return [];
    return engine.searchReactions(query);
  }, []);

  // 获取试剂相关的反应
  const getReactionsForReagent = useCallback((reagentId) => {
    const engine = engineRef.current;
    if (!engine) return [];
    return engine.getReactionsForReagent(reagentId);
  }, []);

  // 自动完成反应
  useEffect(() => {
    if (beakerState.isReacting) {
      const timer = setTimeout(() => {
        completeReaction();
      }, ANIMATION.REACTION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [beakerState.isReacting, completeReaction]);

  // 清理定时器
  useEffect(() => {
    return () => {
      colorTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  return {
    addReagent,
    completeReaction,
    resetBeaker,
    getReactionLog,
    getStateInfo,
    searchReactions,
    getReactionsForReagent,
  };
}

export default useReactionEngine;
