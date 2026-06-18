/**
 * 持久化 Hook
 * 
 * 作用：
 * 1. 统一管理数据持久化
 * 2. 支持防抖写入
 * 3. 支持数据版本控制
 * 4. 支持多种存储后端
 */

import { useCallback, useRef, useEffect } from "react";
import { storageService } from "../services/storageService";
import { STORAGE, HISTORY } from "../constants/labConfig";

/**
 * 持久化 Hook
 * @param {string} storageKey - 存储键
 * @param {Object} options - 配置选项
 * @returns {Object} 持久化操作方法
 */
export function usePersistence(storageKey = STORAGE.LAB_STATE_KEY, options = {}) {
  const {
    debounceDelay = 500,
    autoSave = true,
    maxHistorySteps = HISTORY.MAX_STEPS,
  } = options;

  const writerRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // 初始化防抖写入器
  useEffect(() => {
    writerRef.current = storageService.createDebouncedWriter(debounceDelay);
    return () => {
      if (writerRef.current) {
        writerRef.current.cancel();
      }
    };
  }, [debounceDelay]);

  // 保存数据
  const save = useCallback(
    async (data) => {
      try {
        await storageService.set(storageKey, data);
        return true;
      } catch (e) {
        console.warn("[Persistence] 保存失败:", e);
        return false;
      }
    },
    [storageKey]
  );

  // 防抖保存
  const debouncedSave = useCallback(
    (data) => {
      if (writerRef.current) {
        writerRef.current.write(storageKey, data);
      }
    },
    [storageKey]
  );

  // 加载数据
  const load = useCallback(async () => {
    try {
      const data = await storageService.get(storageKey);
      return data?.data || null;
    } catch (e) {
      console.warn("[Persistence] 加载失败:", e);
      return null;
    }
  }, [storageKey]);

  // 删除数据
  const remove = useCallback(async () => {
    try {
      await storageService.remove(storageKey);
      return true;
    } catch (e) {
      console.warn("[Persistence] 删除失败:", e);
      return false;
    }
  }, [storageKey]);

  // 历史记录管理
  const pushHistory = useCallback(
    (state) => {
      const snapshot = {
        beakerContents: [...state.beakerContents],
        liquidColor: state.liquidColor,
        liquidLevel: state.liquidLevel,
        temperature: state.temperature,
        ph: state.ph,
        effect: state.effect,
        precipitateColor: state.precipitateColor,
        timestamp: Date.now(),
      };

      // 清除当前位置之后的历史
      historyRef.current = historyRef.current.slice(
        0,
        historyIndexRef.current + 1
      );
      historyRef.current.push(snapshot);

      // 限制历史记录数量
      if (historyRef.current.length > maxHistorySteps) {
        historyRef.current.shift();
      } else {
        historyIndexRef.current = historyRef.current.length - 1;
      }

      // 自动保存
      if (autoSave) {
        debouncedSave(snapshot);
      }
    },
    [autoSave, debouncedSave, maxHistorySteps]
  );

  // 撤销
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      return historyRef.current[historyIndexRef.current];
    }
    return null;
  }, []);

  // 重做
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      return historyRef.current[historyIndexRef.current];
    }
    return null;
  }, []);

  // 是否可以撤销/重做
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // 获取历史记录
  const getHistory = useCallback(() => {
    return [...historyRef.current];
  }, []);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    historyIndexRef.current = -1;
  }, []);

  // 导出数据
  const exportData = useCallback(
    async (format = "json") => {
      const data = await load();
      if (!data) return null;

      if (format === "json") {
        return JSON.stringify(data, null, 2);
      }

      // 可以扩展其他格式
      return data;
    },
    [load]
  );

  // 导入数据
  const importData = useCallback(
    async (data, format = "json") => {
      try {
        let parsed;
        if (format === "json") {
          parsed = JSON.parse(data);
        } else {
          parsed = data;
        }

        await save(parsed);
        return true;
      } catch (e) {
        console.warn("[Persistence] 导入失败:", e);
        return false;
      }
    },
    [save]
  );

  return {
    save,
    debouncedSave,
    load,
    remove,
    history: {
      push: pushHistory,
      undo,
      redo,
      canUndo,
      canRedo,
      getAll: getHistory,
      clear: clearHistory,
    },
    exportData,
    importData,
  };
}

export default usePersistence;
