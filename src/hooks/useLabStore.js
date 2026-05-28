import { useReducer, useCallback, useRef, useEffect } from "react";
import { labReducer, initialState, ACTION } from "../state/reducer";

export function useLabStore() {
  const [state, dispatch] = useReducer(labReducer, initialState);

  const addReagent = useCallback((reagentId) => {
    dispatch({ type: ACTION.ADD_REAGENT, payload: reagentId });
  }, []);

  const resetBeaker = useCallback(() => {
    dispatch({ type: ACTION.RESET_BEAKER });
  }, []);

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
