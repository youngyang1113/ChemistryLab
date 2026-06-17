import { findReaction } from "./reactionRecipes";

// 实验室初始状态
export const initialState = {
  beakerContents: [],       // 烧杯中的试剂 ID 数组
  liquidColor: "#1e293b",   // 当前液体颜色
  liquidLevel: 10,          // 基础液位 (%)
  temperature: 25,          // 室温
  ph: 7,                    // 中性 pH
  effect: "none",           // "none" | "heat" | "gas" | "precipitate" | "smoke"
  precipitateColor: "#f5f5f4",
  reactionLog: [],          // 反应日志
  currentReaction: null,    // 当前活跃反应
  isReacting: false,        // 是否正在反应
  shakeIntensity: 0,        // 0 = 不摇晃, 1-3 = 强度
};

// Action 类型
export const ACTION = {
  ADD_REAGENT: "ADD_REAGENT",
  RESET_BEAKER: "RESET_BEAKER",
  SET_REACTION_COMPLETE: "SET_REACTION_COMPLETE",
  UPDATE_LIQUID_COLOR: "UPDATE_LIQUID_COLOR",
};

// Lookup function for reaction matching
function tryReaction(existing, incoming) {
  for (const reagent of existing) {
    const reaction = findReaction(reagent, incoming);
    if (reaction) return reaction;
  }
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
          liquidLevel: Math.min(state.liquidLevel + 8, 85),
        };
      }

      // Try to find a reaction
      const reaction = tryReaction(state.beakerContents, reagentId);

      if (reaction) {
        const newTemp = Math.max(5, Math.min(100, state.temperature + reaction.tempDelta));
        const shakeIntensity =
          reaction.tempDelta >= 50 ? 3 : reaction.tempDelta >= 25 ? 2 : reaction.tempDelta >= 15 ? 1 : 0;

        return {
          ...state,
          beakerContents: newContents,
          liquidColor: reaction.color,
          liquidLevel: Math.min(state.liquidLevel + 12, 85),
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
        liquidLevel: Math.min(state.liquidLevel + 8, 85),
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

    default:
      return state;
  }
}
