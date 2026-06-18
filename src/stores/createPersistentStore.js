/**
 * 持久化 Store 创建器
 * 
 * 性能优化：
 * 1. 防抖写入：500ms 内多次写入只执行最后一次
 * 2. 部分持久化：只保存必要的状态
 * 3. 异步写入：不阻塞主线程
 */

import { create } from "zustand";

// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 创建带持久化的 store
export function createPersistentStore(config) {
  const {
    name,
    storage = localStorage,
    debounceTime = 500,
    partialize = (state) => state,
    version = 1,
  } = config;

  // 从存储加载
  const loadFromStorage = () => {
    try {
      const stored = storage.getItem(name);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === version) {
          return parsed.state;
        }
      }
    } catch (e) {
      console.warn(`[Persist] 加载 ${name} 失败:`, e);
    }
    return null;
  };

  // 保存到存储（防抖）
  const saveToStorage = debounce((state) => {
    try {
      const toStore = partialize(state);
      storage.setItem(
        name,
        JSON.stringify({
          version,
          state: toStore,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn(`[Persist] 保存 ${name} 失败:`, e);
    }
  }, debounceTime);

  // 创建 store
  return create((set, get, api) => {
    // 加载初始状态
    const initialState = loadFromStorage();

    // 包装 set 函数以自动保存
    const originalSet = set;
    const wrappedSet = (...args) => {
      originalSet(...args);
      saveToStorage(get());
    };

    // 返回 store 创建函数
    return config.fn(wrappedSet, get, api, initialState);
  });
}

// 清除存储
export function clearStorage(name, storage = localStorage) {
  try {
    storage.removeItem(name);
  } catch (e) {
    console.warn(`[Persist] 清除 ${name} 失败:`, e);
  }
}

// 导出存储工具
export const storageUtils = {
  debounce,
  clearStorage,
};

export default createPersistentStore;
