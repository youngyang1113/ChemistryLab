/**
 * 统一实验室状态管理 Hook (V2)
 * 
 * 作用：
 * 1. 组合所有子 Hooks，提供统一接口
 * 2. 保持向后兼容，支持原有 API
 * 3. 提供额外的扩展功能
 * 4. 作为新架构的入口点
 */

import { useCallback, useEffect, useRef } from "react";
import { useBeakerState } from "./useBeakerState";
import { useReactionEngine } from "./useReactionEngine";
import { useAnimationState } from "./useAnimationState";
import { usePersistence } from "./usePersistence";
import { storageService } from "../services/storageService";

/**
 * 统一实验室状态管理 Hook
 * @param {Object} options - 配置选项
 * @returns {Object} 完整的实验室状态和操作方法
 */
export function useLabStoreV2(options = {}) {
  const {
    storageKey = "chemistryLab_state",
    autoSave = true,
    enableAnimations = true,
  } = options;

  // 初始化子 Hooks
  const beaker = useBeakerState();
  const engine = useReactionEngine(beaker.state, beaker.actions);
  const animation = useAnimationState();
  const persistence = usePersistence(storageKey, { autoSave });

  const isInitializedRef = useRef(false);

  // 初始化：从存储加载状态
  useEffect(() => {
    if (isInitializedRef.current) return;

    const init = async () => {
      try {
        const savedState = await persistence.load();
        if (savedState) {
          beaker.actions.restore(savedState);
          console.log("[LabStore] 从存储恢复状态");
        }
      } catch (e) {
        console.warn("[LabStore] 初始化失败:", e);
      } finally {
        isInitializedRef.current = true;
      }
    };

    init();
  }, []);

  // 监听反应状态变化，更新动画
  useEffect(() => {
    if (!enableAnimations) return;

    if (beaker.state.isReacting && beaker.state.currentReaction) {
      animation.actions.setReactionAnimations(beaker.state.effect, {
        temperature: beaker.state.temperature,
        precipitateColor: beaker.state.precipitateColor,
        color: beaker.state.liquidColor,
        shakeIntensity: beaker.state.shakeIntensity,
      });
    } else {
      animation.actions.stopAllAnimations();
    }
  }, [
    beaker.state.isReacting,
    beaker.state.currentReaction,
    beaker.state.effect,
    beaker.state.temperature,
    beaker.state.precipitateColor,
    beaker.state.liquidColor,
    beaker.state.shakeIntensity,
    enableAnimations,
    animation.actions,
  ]);

  // 添加试剂（统一入口）
  const addReagent = useCallback(
    (reagentId) => {
      // 保存历史
      persistence.history.push(beaker.state);

      // 调用反应引擎
      return engine.addReagent(reagentId);
    },
    [beaker.state, engine, persistence.history]
  );

  // 重置烧杯
  const resetBeaker = useCallback(() => {
    // 保存历史
    persistence.history.push(beaker.state);

    // 停止动画
    animation.actions.stopAllAnimations();

    // 调用引擎重置
    engine.resetBeaker();
  }, [beaker.state, engine, animation.actions, persistence.history]);

  // 撤销
  const undo = useCallback(() => {
    const snapshot = persistence.history.undo();
    if (snapshot) {
      beaker.actions.restore(snapshot);
      return true;
    }
    return false;
  }, [beaker.actions, persistence.history]);

  // 重做
  const redo = useCallback(() => {
    const snapshot = persistence.history.redo();
    if (snapshot) {
      beaker.actions.restore(snapshot);
      return true;
    }
    return false;
  }, [beaker.actions, persistence.history]);

  // 导出状态
  const exportState = useCallback(() => {
    return {
      beaker: beaker.utils.createSnapshot(),
      history: persistence.history.getAll(),
      timestamp: Date.now(),
    };
  }, [beaker.utils, persistence.history]);

  // 导入状态
  const importState = useCallback(
    async (data) => {
      if (data.beaker) {
        beaker.actions.restore(data.beaker);
      }
      return true;
    },
    [beaker.actions]
  );

  // 获取状态信息
  const getStateInfo = useCallback(() => {
    return engine.getStateInfo();
  }, [engine]);

  // 搜索反应
  const searchReactions = useCallback(
    (query) => {
      return engine.searchReactions(query);
    },
    [engine]
  );

  // 返回统一接口
  return {
    // 状态
    state: beaker.state,
    derivedState: beaker.derivedState,
    animations: animation.animations,
    activeAnimations: animation.activeAnimations,
    hasActiveAnimations: animation.hasActiveAnimations,

    // 操作方法
    addReagent,
    resetBeaker,
    undo,
    redo,
    canUndo: persistence.history.canUndo,
    canRedo: persistence.history.canRedo,

    // 扩展功能
    exportState,
    importState,
    getStateInfo,
    searchReactions,
    getReactionLog: engine.getReactionLog,

    // 子系统访问（高级用法）
    beaker,
    engine,
    animation,
    persistence,
  };
}

export default useLabStoreV2;
