/**
 * 历史记录 Store
 * 
 * 职责：
 * 1. 管理撤销/重做历史栈
 * 2. 提供状态快照功能
 * 3. 支持防抖保存
 * 
 * 为什么独立：
 * - 历史记录是独立的功能模块
 * - 与具体状态解耦，可以记录任意状态快照
 * - 便于未来扩展（如分支历史、时间旅行调试）
 */

import { create } from "zustand";
import { HISTORY } from "../constants/labConfig";

// 创建 store
const useHistoryStore = create((set, get) => ({
  // 状态
  history: [],              // 历史记录栈
  currentIndex: -1,         // 当前位置
  maxSteps: HISTORY.MAX_STEPS,  // 最大步数

  // ==================== 历史操作 ====================

  /**
   * 推入历史记录
   * @param {Object} snapshot - 状态快照
   */
  push: (snapshot) => {
    const state = get();

    // 清除当前位置之后的历史
    const newHistory = state.history.slice(0, state.currentIndex + 1);

    // 添加新快照
    newHistory.push({
      ...snapshot,
      timestamp: Date.now(),
    });

    // 限制历史记录数量
    if (newHistory.length > state.maxSteps) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      currentIndex: newHistory.length - 1,
    });
  },

  /**
   * 撤销
   * @returns {Object|null} 上一个状态快照
   */
  undo: () => {
    const state = get();

    if (state.currentIndex <= 0) {
      return null; // 无法撤销
    }

    const newIndex = state.currentIndex - 1;
    set({ currentIndex: newIndex });

    return state.history[newIndex];
  },

  /**
   * 重做
   * @returns {Object|null} 下一个状态快照
   */
  redo: () => {
    const state = get();

    if (state.currentIndex >= state.history.length - 1) {
      return null; // 无法重做
    }

    const newIndex = state.currentIndex + 1;
    set({ currentIndex: newIndex });

    return state.history[newIndex];
  },

  /**
   * 跳转到指定位置
   * @param {number} index - 目标位置
   * @returns {Object|null} 目标状态快照
   */
  goTo: (index) => {
    const state = get();

    if (index < 0 || index >= state.history.length) {
      return null;
    }

    set({ currentIndex: index });
    return state.history[index];
  },

  // ==================== 查询功能 ====================

  /**
   * 是否可以撤销
   */
  canUndo: () => {
    const state = get();
    return state.currentIndex > 0;
  },

  /**
   * 是否可以重做
   */
  canRedo: () => {
    const state = get();
    return state.currentIndex < state.history.length - 1;
  },

  /**
   * 获取当前快照
   */
  getCurrentSnapshot: () => {
    const state = get();
    if (state.currentIndex >= 0 && state.currentIndex < state.history.length) {
      return state.history[state.currentIndex];
    }
    return null;
  },

  /**
   * 获取历史记录数量
   */
  getHistoryCount: () => {
    return get().history.length;
  },

  /**
   * 获取当前位置
   */
  getCurrentIndex: () => {
    return get().currentIndex;
  },

  /**
   * 获取历史摘要
   */
  getHistorySummary: () => {
    const state = get();
    return {
      total: state.history.length,
      current: state.currentIndex,
      canUndo: state.currentIndex > 0,
      canRedo: state.currentIndex < state.history.length - 1,
    };
  },

  // ==================== 管理功能 ====================

  /**
   * 清空历史记录
   */
  clear: () => {
    set({
      history: [],
      currentIndex: -1,
    });
  },

  /**
   * 设置最大步数
   */
  setMaxSteps: (maxSteps) => {
    set({ maxSteps });
  },

  /**
   * 创建快照（用于外部状态）
   * @param {Object} beakerState - 烧杯状态
   * @param {Object} reactionState - 反应状态
   */
  createSnapshot: (beakerState, reactionState) => {
    return {
      beaker: {
        beakerContents: [...beakerState.beakerContents],
        liquidColor: beakerState.liquidColor,
        liquidLevel: beakerState.liquidLevel,
        temperature: beakerState.temperature,
        ph: beakerState.ph,
        effect: beakerState.effect,
        precipitateColor: beakerState.precipitateColor,
      },
      reaction: reactionState ? {
        reactionLog: [...reactionState.reactionLog],
        reactionCount: reactionState.reactionCount,
      } : null,
      timestamp: Date.now(),
    };
  },
}));

export default useHistoryStore;

// ==================== 导出 Selector Hooks ====================

/** 仅订阅撤销/重做能力 */
export const useCanUndoRedo = () =>
  useHistoryStore((state) => ({
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
  }));

/** 仅订阅历史摘要 */
export const useHistorySummary = () =>
  useHistoryStore((state) => ({
    total: state.history.length,
    current: state.currentIndex,
  }));
