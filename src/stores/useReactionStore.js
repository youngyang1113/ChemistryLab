/**
 * 反应逻辑 Store
 * 
 * 职责：
 * 1. 管理反应日志
 * 2. 提供反应查询功能
 * 3. 管理反应历史
 * 
 * 为什么独立：
 * - 反应日志是追加型数据，变化频率低
 * - 与烧杯状态解耦，避免每次反应都触发日志组件重渲染
 * - 便于未来扩展（如导出日志、统计分析）
 */

import { create } from "zustand";
import { findReaction } from "../state/recipes";
import { SHAKE_THRESHOLDS } from "../constants/labConfig";

// 创建 store
const useReactionStore = create((set, get) => ({
  // 状态
  reactionLog: [],           // 反应日志
  currentReaction: null,     // 当前反应
  reactionCount: 0,          // 反应总数
  lastReactionTime: null,    // 最后反应时间

  // ==================== 反应匹配 ====================

  /**
   * 查找匹配的反应
   * @param {Array} existing - 已有试剂
   * @param {string} incoming - 新试剂
   * @returns {Object|null} 反应结果
   */
  findReaction: (existing, incoming) => {
    return findReaction(existing, incoming);
  },

  /**
   * 计算震动强度
   * @param {number} tempDelta - 温度变化
   * @returns {number} 震动强度 (0-3)
   */
  calculateShakeIntensity: (tempDelta) => {
    if (tempDelta >= SHAKE_THRESHOLDS.HIGH) return 3;
    if (tempDelta >= SHAKE_THRESHOLDS.MEDIUM) return 2;
    if (tempDelta >= SHAKE_THRESHOLDS.LOW) return 1;
    return 0;
  },

  // ==================== 反应日志 ====================

  /**
   * 记录反应
   * @param {Object} reaction - 反应信息
   * @param {Array} reagents - 参与反应的试剂
   */
  logReaction: (reaction, reagents) => {
    set((state) => ({
      reactionLog: [
        ...state.reactionLog,
        {
          ...reaction,
          reagents: [...reagents],
          timestamp: Date.now(),
        },
      ],
      reactionCount: state.reactionCount + 1,
      lastReactionTime: Date.now(),
    }));
  },

  /**
   * 设置当前反应
   * @param {Object|null} reaction - 反应信息
   */
  setCurrentReaction: (reaction) => {
    set({ currentReaction: reaction });
  },

  /**
   * 清空反应日志
   */
  clearLog: () => {
    set({
      reactionLog: [],
      reactionCount: 0,
      lastReactionTime: null,
    });
  },

  // ==================== 查询功能 ====================

  /**
   * 获取最近的反应
   * @param {number} count - 数量
   * @returns {Array} 最近的反应
   */
  getRecentReactions: (count = 10) => {
    const state = get();
    return state.reactionLog.slice(-count);
  },

  /**
   * 按类型筛选反应
   * @param {string} type - 反应类型
   * @returns {Array} 筛选结果
   */
  getReactionsByType: (type) => {
    const state = get();
    return state.reactionLog.filter((r) => r.type === type);
  },

  /**
   * 获取反应统计
   * @returns {Object} 统计信息
   */
  getReactionStats: () => {
    const state = get();
    const stats = {};

    state.reactionLog.forEach((reaction) => {
      const type = reaction.type || "未知";
      if (!stats[type]) {
        stats[type] = 0;
      }
      stats[type]++;
    });

    return {
      total: state.reactionCount,
      byType: stats,
      lastReactionTime: state.lastReactionTime,
    };
  },

  /**
   * 检查是否发生过特定反应
   * @param {string} reactionKey - 反应键
   * @returns {boolean} 是否发生过
   */
  hasReactionOccurred: (reactionKey) => {
    const state = get();
    return state.reactionLog.some((r) => r.key === reactionKey);
  },

  /**
   * 创建快照
   * @returns {Object} 状态快照
   */
  createSnapshot: () => {
    const state = get();
    return {
      reactionLog: [...state.reactionLog],
      reactionCount: state.reactionCount,
    };
  },

  /**
   * 恢复快照
   * @param {Object} snapshot - 状态快照
   */
  restoreSnapshot: (snapshot) => {
    if (snapshot) {
      set({
        reactionLog: snapshot.reactionLog || [],
        reactionCount: snapshot.reactionCount || 0,
        currentReaction: null,
      });
    }
  },
}));

export default useReactionStore;

// ==================== 导出 Selector Hooks ====================

/** 仅订阅反应日志 */
export const useReactionLog = () =>
  useReactionStore((state) => state.reactionLog);

/** 仅订阅当前反应 */
export const useCurrentReaction = () =>
  useReactionStore((state) => state.currentReaction);

/** 仅订阅反应总数 */
export const useReactionCount = () =>
  useReactionStore((state) => state.reactionCount);

/** 订阅最近 N 条反应 */
export const useRecentReactions = (count = 10) =>
  useReactionStore((state) => state.reactionLog.slice(-count));
