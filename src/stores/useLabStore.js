/**
 * 统一实验室 Store (V3)
 * 
 * 职责：
 * 1. 组合所有子 Store，提供统一接口
 * 2. 保持向后兼容，支持原有 API
 * 3. 处理跨 Store 业务逻辑
 * 
 * 为什么需要：
 * - 提供向后兼容的 API
 * - 处理跨 Store 的业务逻辑
 * - 作为组件迁移的过渡层
 */

import { useCallback, useEffect, useRef } from "react";
import useBeakerStore from "./useBeakerStore";
import useReactionStore from "./useReactionStore";
import useUIStore from "./useUIStore";
import useHistoryStore from "./useHistoryStore";
import { ANIMATION } from "../constants/labConfig";

/**
 * 统一实验室 Hook
 * 
 * 这是一个 Hook 而不是 Store，因为它需要组合多个 Store 并处理副作用
 */
export function useLabStore() {
  const beakerStore = useBeakerStore();
  const reactionStore = useReactionStore();
  const uiStore = useUIStore();
  const historyStore = useHistoryStore();

  const colorTimersRef = useRef([]);
  const reactionTimerRef = useRef(null);

  // ==================== 核心操作 ====================

  /**
   * 添加试剂
   * @param {string} reagentId - 试剂 ID
   */
  const addReagent = useCallback((reagentId) => {
    // 1. 保存历史快照
    const snapshot = historyStore.createSnapshot(beakerStore, reactionStore);
    historyStore.push(snapshot);

    // 2. 尝试添加试剂
    const added = beakerStore.addReagent(reagentId);
    if (!added) return; // 重复试剂

    // 3. 如果是第一个试剂，只增加液位
    if (beakerStore.beakerContents.length === 0) {
      beakerStore.increaseLiquidLevel(8);
      return;
    }

    // 4. 尝试反应
    const reaction = reactionStore.findReaction(
      beakerStore.beakerContents.slice(0, -1), // 已有的试剂
      reagentId // 新试剂
    );

    if (reaction) {
      // 5a. 发生反应
      const shakeIntensity = reactionStore.calculateShakeIntensity(
        reaction.tempDelta
      );

      // 计算新温度
      const newTemp = Math.max(
        5,
        Math.min(100, beakerStore.temperature + reaction.tempDelta)
      );

      // 应用反应结果
      beakerStore.applyReactionResult({
        ...reaction,
        temperature: newTemp,
      });

      // 设置反应状态
      beakerStore.setReactionState(true, reaction, shakeIntensity);
      beakerStore.increaseLiquidLevel(12);

      // 记录反应
      reactionStore.logReaction(reaction, [
        ...beakerStore.beakerContents.slice(0, -1),
        reagentId,
      ]);
      reactionStore.setCurrentReaction(reaction);

      // 处理颜色渐变
      if (reaction.colorSequence) {
        handleColorSequence(reaction.colorSequence);
      }

      // 自动完成反应
      reactionTimerRef.current = setTimeout(() => {
        completeReaction();
      }, ANIMATION.REACTION_DURATION);
    } else {
      // 5b. 没有反应
      beakerStore.increaseLiquidLevel(8);
    }
  }, [beakerStore, reactionStore, historyStore]);

  /**
   * 处理颜色渐变序列
   */
  const handleColorSequence = useCallback((sequence) => {
    // 清除之前的定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];

    sequence.forEach(({ color, duration }) => {
      if (duration === 0) {
        beakerStore.setLiquidColor(color);
      } else {
        const timer = setTimeout(() => {
          beakerStore.setLiquidColor(color);
        }, duration);
        colorTimersRef.current.push(timer);
      }
    });
  }, [beakerStore]);

  /**
   * 完成反应
   */
  const completeReaction = useCallback(() => {
    beakerStore.setReactionState(false, null, 0);
    beakerStore.setEffect("none");
    reactionStore.setCurrentReaction(null);

    // 清除定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = null;
    }
  }, [beakerStore, reactionStore]);

  /**
   * 重置烧杯
   */
  const resetBeaker = useCallback(() => {
    // 保存历史
    const snapshot = historyStore.createSnapshot(beakerStore, reactionStore);
    historyStore.push(snapshot);

    // 清除定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = null;
    }

    // 重置状态
    beakerStore.reset();
    reactionStore.setCurrentReaction(null);
  }, [beakerStore, reactionStore, historyStore]);

  /**
   * 撤销
   */
  const undo = useCallback(() => {
    const snapshot = historyStore.undo();
    if (snapshot) {
      beakerStore.restoreSnapshot(snapshot.beaker);
      reactionStore.restoreSnapshot(snapshot.reaction);
    }
  }, [beakerStore, reactionStore, historyStore]);

  /**
   * 重做
   */
  const redo = useCallback(() => {
    const snapshot = historyStore.redo();
    if (snapshot) {
      beakerStore.restoreSnapshot(snapshot.beaker);
      reactionStore.restoreSnapshot(snapshot.reaction);
    }
  }, [beakerStore, reactionStore, historyStore]);

  // ==================== 清理 ====================

  useEffect(() => {
    return () => {
      colorTimersRef.current.forEach(clearTimeout);
      if (reactionTimerRef.current) {
        clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  // ==================== 返回统一接口 ====================

  // 从 historyStore 状态中读取 canUndo/canRedo，避免每次渲染都调用函数
  const canUndo = historyStore.currentIndex > 0;
  const canRedo = historyStore.currentIndex < historyStore.history.length - 1;

  return {
    // 烧杯状态
    state: {
      beakerContents: beakerStore.beakerContents,
      liquidColor: beakerStore.liquidColor,
      liquidLevel: beakerStore.liquidLevel,
      temperature: beakerStore.temperature,
      ph: beakerStore.ph,
      effect: beakerStore.effect,
      precipitateColor: beakerStore.precipitateColor,
      isReacting: beakerStore.isReacting,
      shakeIntensity: beakerStore.shakeIntensity,
      currentReaction: beakerStore.currentReaction,
      reactionLog: reactionStore.reactionLog,
    },

    // 操作方法
    addReagent,
    resetBeaker,
    undo,
    redo,
    canUndo,
    canRedo,

    // 子 Store 访问（高级用法）
    beakerStore,
    reactionStore,
    uiStore,
    historyStore,
  };
}

export default useLabStore;
