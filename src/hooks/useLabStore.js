import { useReducer, useCallback, useRef, useEffect } from "react";
import { labReducer, initialState, ACTION } from "../state/reducer";
import { ANIMATION, STORAGE, HISTORY } from "../constants/labConfig";

// 从 localStorage 加载状态
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE.LAB_STATE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === STORAGE.CURRENT_VERSION) {
        return {
          ...parsed.state,
          isReacting: false,
          shakeIntensity: 0,
          currentReaction: null,
        };
      }
    }
  } catch (e) {
    console.warn("加载实验室状态失败:", e);
  }
  return null;
}

// 保存状态到 localStorage
function saveState(state) {
  try {
    const toSave = {
      version: STORAGE.CURRENT_VERSION,
      state: {
        beakerContents: state.beakerContents,
        liquidColor: state.liquidColor,
        liquidLevel: state.liquidLevel,
        temperature: state.temperature,
        ph: state.ph,
        reactionLog: state.reactionLog,
      },
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE.LAB_STATE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn("保存实验室状态失败:", e);
  }
}

export function useLabStore() {
  const savedState = loadState();
  const initial = savedState ? { ...initialState, ...savedState } : initialState;

  const [state, dispatch] = useReducer(labReducer, initial);
  const colorTimersRef = useRef([]);
  const saveTimerRef = useRef(null);
  
  // 历史记录栈
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // 保存当前状态到历史记录
  const pushHistory = useCallback((currentState) => {
    const snapshot = {
      beakerContents: [...currentState.beakerContents],
      liquidColor: currentState.liquidColor,
      liquidLevel: currentState.liquidLevel,
      temperature: currentState.temperature,
      ph: currentState.ph,
      reactionLog: [...currentState.reactionLog],
    };

    // 清除当前位置之后的历史
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);

    // 限制历史记录数量
    if (historyRef.current.length > HISTORY.MAX_STEPS) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current = historyRef.current.length - 1;
    }
  }, []);

  // 在添加试剂时保存历史
  const addReagent = useCallback((reagentId) => {
    pushHistory(state);
    dispatch({ type: ACTION.ADD_REAGENT, payload: reagentId });
  }, [state, pushHistory]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const snapshot = historyRef.current[historyIndexRef.current];
      dispatch({ type: ACTION.RESTORE_STATE, payload: snapshot });
    }
  }, []);

  // 重做
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const snapshot = historyRef.current[historyIndexRef.current];
      dispatch({ type: ACTION.RESTORE_STATE, payload: snapshot });
    }
  }, []);

  // 是否可以撤销/重做
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // 防抖保存状态
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveState(state);
    }, 500);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state]);

  const resetBeaker = useCallback(() => {
    pushHistory(state);
    colorTimersRef.current.forEach(clearTimeout);
    colorTimersRef.current = [];
    try {
      localStorage.removeItem(STORAGE.LAB_STATE_KEY);
    } catch (e) {
      console.warn("清除实验室状态失败:", e);
    }
    dispatch({ type: ACTION.RESET_BEAKER });
  }, [state, pushHistory]);

  // 处理颜色渐变序列
  useEffect(() => {
    if (state.currentReaction?.colorSequence && state.isReacting) {
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
      }, ANIMATION.REACTION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [state.isReacting]);

  return { 
    state, 
    addReagent, 
    resetBeaker, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  };
}
