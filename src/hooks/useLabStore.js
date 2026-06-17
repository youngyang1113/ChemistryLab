import { useReducer, useCallback, useRef, useEffect } from "react";
import { labReducer, initialState, ACTION } from "../state/reducer";

export function useLabStore() {
  const [state, dispatch] = useReducer(labReducer, initialState);
  const colorTimersRef = useRef([]);

  const addReagent = useCallback((reagentId) => {
    dispatch({ type: ACTION.ADD_REAGENT, payload: reagentId });
  }, []);

  const resetBeaker = useCallback(() => {
    // 清除颜色渐变定时器
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];
    dispatch({ type: ACTION.RESET_BEAKER });
  }, []);

  // 处理颜色渐变序列
  useEffect(() => {
    if (state.currentReaction?.colorSequence && state.isReacting) {
      // 清除之前的定时器
      colorTimersRef.current.forEach(clearTimeout);
      colorTimersRef.current = [];

      const sequence = state.currentReaction.colorSequence;
      sequence.forEach(({ color, duration }) => {
        if (duration === 0) {
          dispatch({ type: ACTION.UPDATE_LIQUID_COLOR, payload: { color } });
        } else {
          const timer = setTimeout(() => {
            dispatch({ type: ACTION.UPDATE_LIQUID_COLOR, payload: { color } });
          }, duration);
          colorTimersRef.current.push(timer);
        }
      });
    }

    return () => {
      colorTimersRef.current.forEach(clearTimeout);
      colorTimersRef.current = [];
    };
  }, [state.currentReaction, state.isReacting]);

  // Auto-complete reaction animation after delay
  useEffect(() => {
    if (state.isReacting) {
      const timer = setTimeout(() => {
        dispatch({ type: ACTION.SET_REACTION_COMPLETE });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.isReacting]);

  return { state, addReagent, resetBeaker };
}
