/**
 * 烧杯状态 Hook
 * 
 * 作用：
 * 1. 管理烧杯的物理状态（试剂、液体、温度等）
 * 2. 与反应引擎解耦，只关注状态管理
 * 3. 支持状态快照和恢复
 * 4. 提供选择性重渲染
 */

import { useReducer, useCallback, useMemo } from "react";
import {
  TEMPERATURE,
  LIQUID_LEVEL,
  PH,
  DEFAULT_COLORS,
  SHAKE_THRESHOLDS,
} from "../constants/labConfig";

// Action 类型
const BEAKER_ACTION = {
  ADD_REAGENT: "ADD_REAGENT",
  REMOVE_REAGENT: "REMOVE_REAGENT",
  SET_LIQUID_COLOR: "SET_LIQUID_COLOR",
  SET_LIQUID_LEVEL: "SET_LIQUID_LEVEL",
  SET_TEMPERATURE: "SET_TEMPERATURE",
  SET_PH: "SET_PH",
  SET_EFFECT: "SET_EFFECT",
  SET_REACTION_STATE: "SET_REACTION_STATE",
  SET_SHAKE_INTENSITY: "SET_SHAKE_INTENSITY",
  SET_PRECIPITATE_COLOR: "SET_PRECIPITATE_COLOR",
  RESET: "RESET",
  RESTORE: "RESTORE",
};

// 初始状态
const initialState = {
  beakerContents: [],
  liquidColor: DEFAULT_COLORS.LIQUID,
  liquidLevel: LIQUID_LEVEL.INITIAL,
  temperature: TEMPERATURE.ROOM_TEMP,
  ph: PH.NEUTRAL,
  effect: "none",
  precipitateColor: DEFAULT_COLORS.PRECIPITATE,
  isReacting: false,
  shakeIntensity: 0,
  currentReaction: null,
};

// Reducer
function beakerReducer(state, action) {
  switch (action.type) {
    case BEAKER_ACTION.ADD_REAGENT:
      return {
        ...state,
        beakerContents: [...state.beakerContents, action.payload],
      };

    case BEAKER_ACTION.REMOVE_REAGENT:
      return {
        ...state,
        beakerContents: state.beakerContents.filter(
          (id) => id !== action.payload
        ),
      };

    case BEAKER_ACTION.SET_LIQUID_COLOR:
      return {
        ...state,
        liquidColor: action.payload,
      };

    case BEAKER_ACTION.SET_LIQUID_LEVEL:
      return {
        ...state,
        liquidLevel: Math.max(
          LIQUID_LEVEL.MIN_LEVEL,
          Math.min(LIQUID_LEVEL.MAX_LEVEL, action.payload)
        ),
      };

    case BEAKER_ACTION.SET_TEMPERATURE:
      return {
        ...state,
        temperature: Math.max(
          TEMPERATURE.MIN_TEMP,
          Math.min(TEMPERATURE.MAX_TEMP, action.payload)
        ),
      };

    case BEAKER_ACTION.SET_PH:
      return {
        ...state,
        ph: Math.max(PH.MIN_PH, Math.min(PH.MAX_PH, action.payload)),
      };

    case BEAKER_ACTION.SET_EFFECT:
      return {
        ...state,
        effect: action.payload,
      };

    case BEAKER_ACTION.SET_REACTION_STATE:
      return {
        ...state,
        isReacting: action.payload.isReacting,
        currentReaction: action.payload.reaction || state.currentReaction,
        shakeIntensity: action.payload.shakeIntensity ?? state.shakeIntensity,
      };

    case BEAKER_ACTION.SET_SHAKE_INTENSITY:
      return {
        ...state,
        shakeIntensity: action.payload,
      };

    case BEAKER_ACTION.SET_PRECIPITATE_COLOR:
      return {
        ...state,
        precipitateColor: action.payload,
      };

    case BEAKER_ACTION.RESET:
      return { ...initialState };

    case BEAKER_ACTION.RESTORE:
      return {
        ...initialState,
        ...action.payload,
        isReacting: false,
        shakeIntensity: 0,
        currentReaction: null,
      };

    default:
      return state;
  }
}

/**
 * 烧杯状态 Hook
 * @param {Object} initialStateOverride - 初始状态覆盖
 * @returns {Object} 烧杯状态和操作方法
 */
export function useBeakerState(initialStateOverride = {}) {
  const [state, dispatch] = useReducer(beakerReducer, {
    ...initialState,
    ...initialStateOverride,
  });

  // 操作方法
  const addReagent = useCallback(
    (reagentId) => {
      if (state.beakerContents.includes(reagentId)) return false;
      dispatch({ type: BEAKER_ACTION.ADD_REAGENT, payload: reagentId });
      return true;
    },
    [state.beakerContents]
  );

  const removeReagent = useCallback((reagentId) => {
    dispatch({ type: BEAKER_ACTION.REMOVE_REAGENT, payload: reagentId });
  }, []);

  const setLiquidColor = useCallback((color) => {
    dispatch({ type: BEAKER_ACTION.SET_LIQUID_COLOR, payload: color });
  }, []);

  const setLiquidLevel = useCallback((level) => {
    dispatch({ type: BEAKER_ACTION.SET_LIQUID_LEVEL, payload: level });
  }, []);

  const increaseLiquidLevel = useCallback(
    (amount) => {
      dispatch({
        type: BEAKER_ACTION.SET_LIQUID_LEVEL,
        payload: state.liquidLevel + amount,
      });
    },
    [state.liquidLevel]
  );

  const setTemperature = useCallback((temp) => {
    dispatch({ type: BEAKER_ACTION.SET_TEMPERATURE, payload: temp });
  }, []);

  const setPh = useCallback((ph) => {
    dispatch({ type: BEAKER_ACTION.SET_PH, payload: ph });
  }, []);

  const setEffect = useCallback((effect) => {
    dispatch({ type: BEAKER_ACTION.SET_EFFECT, payload: effect });
  }, []);

  const setReactionState = useCallback((isReacting, reaction = null, shakeIntensity = 0) => {
    dispatch({
      type: BEAKER_ACTION.SET_REACTION_STATE,
      payload: { isReacting, reaction, shakeIntensity },
    });
  }, []);

  const setShakeIntensity = useCallback((intensity) => {
    dispatch({ type: BEAKER_ACTION.SET_SHAKE_INTENSITY, payload: intensity });
  }, []);

  const setPrecipitateColor = useCallback((color) => {
    dispatch({ type: BEAKER_ACTION.SET_PRECIPITATE_COLOR, payload: color });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: BEAKER_ACTION.RESET });
  }, []);

  const restore = useCallback((snapshot) => {
    dispatch({ type: BEAKER_ACTION.RESTORE, payload: snapshot });
  }, []);

  // 计算派生状态
  const derivedState = useMemo(
    () => ({
      hasContents: state.beakerContents.length > 0,
      reagentCount: state.beakerContents.length,
      isHot: state.temperature > 50,
      isCold: state.temperature < 10,
      isAcidic: state.ph < PH.ACID_THRESHOLD,
      isBasic: state.ph > PH.BASE_THRESHOLD,
      isNeutral:
        state.ph >= PH.ACID_THRESHOLD && state.ph <= PH.BASE_THRESHOLD,
    }),
    [state.beakerContents, state.temperature, state.ph]
  );

  // 创建快照
  const createSnapshot = useCallback(() => {
    return {
      beakerContents: [...state.beakerContents],
      liquidColor: state.liquidColor,
      liquidLevel: state.liquidLevel,
      temperature: state.temperature,
      ph: state.ph,
      effect: state.effect,
      precipitateColor: state.precipitateColor,
    };
  }, [state]);

  return {
    state,
    derivedState,
    actions: {
      addReagent,
      removeReagent,
      setLiquidColor,
      setLiquidLevel,
      increaseLiquidLevel,
      setTemperature,
      setPh,
      setEffect,
      setReactionState,
      setShakeIntensity,
      setPrecipitateColor,
      reset,
      restore,
    },
    utils: {
      createSnapshot,
    },
  };
}

export default useBeakerState;
