import { findReaction } from "./recipes";
import {
  TEMPERATURE,
  LIQUID_LEVEL,
  PH,
  DEFAULT_COLORS,
  SHAKE_THRESHOLDS,
} from "../constants/labConfig";

// 实验室初始状态
export const initialState = {
  beakerContents: [],       // 烧杯中的试剂 ID 数组
  liquidColor: DEFAULT_COLORS.LIQUID,
  liquidLevel: LIQUID_LEVEL.INITIAL,
  temperature: TEMPERATURE.ROOM_TEMP,
  ph: PH.NEUTRAL,
  effect: "none",
  precipitateColor: DEFAULT_COLORS.PRECIPITATE,
  reactionLog: [],
  currentReaction: null,
  isReacting: false,
  shakeIntensity: 0,
};

// Action 类型
export const ACTION = {
  ADD_REAGENT: "ADD_REAGENT",
  RESET_BEAKER: "RESET_BEAKER",
  SET_REACTION_COMPLETE: "SET_REACTION_COMPLETE",
  UPDATE_LIQUID_COLOR: "UPDATE_LIQUID_COLOR",
  RESTORE_STATE: "RESTORE_STATE",
};

// Lookup function for reaction matching
function tryReaction(existing, incoming, state) {
  // 构建上下文信息
  const context = {
    temperature: state ? state.temperature : TEMPERATURE.ROOM_TEMP,
    beakerContents: [...existing, incoming],
  };
  
  // 尝试所有可能的二元组合
  for (const reagent of existing) {
    const reaction = findReaction([reagent], incoming, context);
    if (reaction) return reaction;
  }
  
  // 尝试完整组合（支持三元及以上反应）
  const fullReaction = findReaction(existing, incoming, context);
  if (fullReaction) return fullReaction;
  
  return null;
}

export function labReducer(state, action) {
  switch (action.type) {
    case ACTION.ADD_REAGENT: {
      const reagentId = action.payload;

      // Don't add duplicates
      if (state.beakerContents.includes(reagentId)) return state;

      const newContents = [...state.beakerContents, reagentId];

      // If only one reagent, just add it
      if (state.beakerContents.length === 0) {
        return {
          ...state,
          beakerContents: newContents,
          liquidLevel: Math.min(state.liquidLevel + LIQUID_LEVEL.ADD_REAGENT, LIQUID_LEVEL.MAX_LEVEL),
        };
      }

      // Try to find a reaction
      const reaction = tryReaction(state.beakerContents, reagentId, state);

      if (reaction) {
        const newTemp = Math.max(
          TEMPERATURE.MIN_TEMP,
          Math.min(TEMPERATURE.MAX_TEMP, state.temperature + reaction.tempDelta)
        );
        const shakeIntensity =
          reaction.tempDelta >= SHAKE_THRESHOLDS.HIGH
            ? 3
            : reaction.tempDelta >= SHAKE_THRESHOLDS.MEDIUM
            ? 2
            : reaction.tempDelta >= SHAKE_THRESHOLDS.LOW
            ? 1
            : 0;

        return {
          ...state,
          beakerContents: newContents,
          liquidColor: reaction.color,
          liquidLevel: Math.min(state.liquidLevel + LIQUID_LEVEL.REACTION_BONUS, LIQUID_LEVEL.MAX_LEVEL),
          temperature: newTemp,
          ph: reaction.ph,
          effect: reaction.effect,
          precipitateColor: reaction.precipitateColor || state.precipitateColor,
          currentReaction: reaction,
          isReacting: true,
          shakeIntensity,
          reactionLog: [
            ...state.reactionLog,
            {
              ...reaction,
              reagents: [...state.beakerContents, reagentId],
              timestamp: Date.now(),
            },
          ],
        };
      }

      // No reaction - just add reagent
      return {
        ...state,
        beakerContents: newContents,
        liquidLevel: Math.min(state.liquidLevel + LIQUID_LEVEL.ADD_REAGENT, LIQUID_LEVEL.MAX_LEVEL),
      };
    }

    case ACTION.RESET_BEAKER:
      return { ...initialState };

    case ACTION.SET_REACTION_COMPLETE:
      return {
        ...state,
        isReacting: false,
        shakeIntensity: 0,
      };

    case ACTION.UPDATE_LIQUID_COLOR:
      return {
        ...state,
        liquidColor: action.payload.color,
      };

    case ACTION.RESTORE_STATE:
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
