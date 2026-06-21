/**
 * 烧杯状态 Store
 * 
 * 职责：
 * 1. 管理烧杯的物理状态（试剂、液体、温度等）
 * 2. 提供细粒度的 selector 订阅
 * 3. 支持状态快照和恢复
 * 
 * 为什么独立：
 * - 烧杯状态变化频率最高
 * - 与 UI 状态完全解耦
 * - 避免试剂变化触发其他无关组件重渲染
 */

import { create } from "zustand";
import {
  TEMPERATURE,
  LIQUID_LEVEL,
  PH,
  DEFAULT_COLORS,
} from "../constants/labConfig";

// 初始状态
const initialState = {
  beakerContents: [],       // 试剂 ID 数组
  liquidColor: DEFAULT_COLORS.LIQUID,
  liquidLevel: 0,           // 初始液位为 0，添加液体试剂后才增加
  temperature: TEMPERATURE.ROOM_TEMP,
  ph: PH.NEUTRAL,
  effect: "none",
  precipitateColor: DEFAULT_COLORS.PRECIPITATE,
  isReacting: false,
  shakeIntensity: 0,
  currentReaction: null,
};

// 创建 store
const useBeakerStore = create((set, get) => ({
  ...initialState,

  // ==================== 基础操作 ====================

  /**
   * 添加试剂
   * @param {string} reagentId - 试剂 ID
   * @returns {boolean} 是否添加成功
   */
  addReagent: (reagentId) => {
    const state = get();
    if (state.beakerContents.includes(reagentId)) {
      return false; // 已存在，不重复添加
    }
    set({
      beakerContents: [...state.beakerContents, reagentId],
    });
    return true;
  },

  /**
   * 移除试剂
   * @param {string} reagentId - 试剂 ID
   */
  removeReagent: (reagentId) => {
    set((state) => ({
      beakerContents: state.beakerContents.filter((id) => id !== reagentId),
    }));
  },

  /**
   * 设置液体颜色
   * @param {string} color - 颜色值
   */
  setLiquidColor: (color) => {
    set({ liquidColor: color });
  },

  /**
   * 设置液位
   * @param {number} level - 液位百分比
   */
  setLiquidLevel: (level) => {
    set({
      liquidLevel: Math.max(
        LIQUID_LEVEL.MIN_LEVEL,
        Math.min(LIQUID_LEVEL.MAX_LEVEL, level)
      ),
    });
  },

  /**
   * 增加液位
   * @param {number} amount - 增加量
   */
  increaseLiquidLevel: (amount) => {
    set((state) => ({
      liquidLevel: Math.min(
        state.liquidLevel + amount,
        LIQUID_LEVEL.MAX_LEVEL
      ),
    }));
  },

  /**
   * 设置温度
   * @param {number} temp - 温度值
   */
  setTemperature: (temp) => {
    set({
      temperature: Math.max(
        TEMPERATURE.MIN_TEMP,
        Math.min(TEMPERATURE.MAX_TEMP, temp)
      ),
    });
  },

  /**
   * 设置 pH 值
   * @param {number} ph - pH 值
   */
  setPh: (ph) => {
    set({
      ph: Math.max(PH.MIN_PH, Math.min(PH.MAX_PH, ph)),
    });
  },

  /**
   * 设置特效类型
   * @param {string} effect - 特效类型
   */
  setEffect: (effect) => {
    set({ effect });
  },

  /**
   * 设置反应状态
   * @param {boolean} isReacting - 是否正在反应
   * @param {Object|null} reaction - 反应信息
   * @param {number} shakeIntensity - 震动强度
   */
  setReactionState: (isReacting, reaction = null, shakeIntensity = 0) => {
    set({
      isReacting,
      currentReaction: reaction,
      shakeIntensity,
    });
  },

  /**
   * 设置震动强度
   * @param {number} intensity - 震动强度
   */
  setShakeIntensity: (intensity) => {
    set({ shakeIntensity: intensity });
  },

  /**
   * 设置沉淀颜色
   * @param {string} color - 颜色值
   */
  setPrecipitateColor: (color) => {
    set({ precipitateColor: color });
  },

  // ==================== 高级操作 ====================

  /**
   * 应用反应结果
   * @param {Object} reactionResult - 反应结果
   */
  applyReactionResult: (reactionResult) => {
    const state = get();
    const updates = {
      liquidColor: reactionResult.liquidColor || state.liquidColor,
      temperature: reactionResult.temperature || state.temperature,
      ph: reactionResult.ph ?? state.ph,
      effect: reactionResult.effect || state.effect,
    };

    if (reactionResult.precipitateColor) {
      updates.precipitateColor = reactionResult.precipitateColor;
    }

    set(updates);
  },

  /**
   * 重置烧杯
   */
  reset: () => {
    set(initialState);
  },

  /**
   * 创建快照
   * @returns {Object} 状态快照
   */
  createSnapshot: () => {
    const state = get();
    return {
      beakerContents: [...state.beakerContents],
      liquidColor: state.liquidColor,
      liquidLevel: state.liquidLevel,
      temperature: state.temperature,
      ph: state.ph,
      effect: state.effect,
      precipitateColor: state.precipitateColor,
    };
  },

  /**
   * 恢复快照
   * @param {Object} snapshot - 状态快照
   */
  restoreSnapshot: (snapshot) => {
    set({
      ...snapshot,
      isReacting: false,
      shakeIntensity: 0,
      currentReaction: null,
    });
  },
}));

export default useBeakerStore;

// ==================== 导出 Selector Hooks ====================
// 使用 selector 避免无关渲染

/** 仅订阅试剂列表 */
export const useBeakerContents = () =>
  useBeakerStore((state) => state.beakerContents);

/** 仅订阅液体颜色 */
export const useLiquidColor = () =>
  useBeakerStore((state) => state.liquidColor);

/** 仅订阅液位 */
export const useLiquidLevel = () =>
  useBeakerStore((state) => state.liquidLevel);

/** 仅订阅温度 */
export const useTemperature = () =>
  useBeakerStore((state) => state.temperature);

/** 仅订阅 pH */
export const usePh = () =>
  useBeakerStore((state) => state.ph);

/** 仅订阅特效类型 */
export const useEffect = () =>
  useBeakerStore((state) => state.effect);

/** 仅订阅反应状态 */
export const useIsReacting = () =>
  useBeakerStore((state) => state.isReacting);

/** 仅订阅当前反应 */
export const useCurrentReaction = () =>
  useBeakerStore((state) => state.currentReaction);

/** 仅订阅震动强度 */
export const useShakeIntensity = () =>
  useBeakerStore((state) => state.shakeIntensity);

/** 订阅派生状态：是否有内容 */
export const useHasContents = () =>
  useBeakerStore((state) => state.beakerContents.length > 0);

/** 订阅派生状态：是否高温 */
export const useIsHot = () =>
  useBeakerStore((state) => state.temperature > 50);

/** 订阅派生状态：是否酸性 */
export const useIsAcidic = () =>
  useBeakerStore((state) => state.ph < 4);

/** 订阅派生状态：是否碱性 */
export const useIsBasic = () =>
  useBeakerStore((state) => state.ph > 10);
