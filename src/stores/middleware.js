/**
 * Store 中间件
 * 
 * 职责：
 * 1. 提供持久化中间件
 * 2. 提供防抖中间件
 * 3. 提供日志中间件（开发环境）
 */

/**
 * 防抖持久化中间件
 * 
 * 为什么需要：
 * - 避免频繁写入 localStorage
 * - 减少 IO 操作，提升性能
 * 
 * @param {Object} config - 配置
 * @returns {Function} Zustand 中间件
 */
export const debouncePersist = (config) => (set, get, api) => {
  const {
    name,
    storage = localStorage,
    debounceTime = 500,
    partialize = (state) => state,
    version = 1,
    migrate,
  } = config;

  let debounceTimer = null;

  // 从存储加载
  const loadFromStorage = () => {
    try {
      const stored = storage.getItem(name);
      if (stored) {
        const parsed = JSON.parse(stored);

        // 版本检查
        if (parsed.version !== version && migrate) {
          return migrate(parsed.state, parsed.version);
        }

        return parsed.state;
      }
    } catch (e) {
      console.warn(`[Persist] 加载 ${name} 失败:`, e);
    }
    return null;
  };

  // 保存到存储（防抖）
  const saveToStorage = (state) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
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
  };

  // 包装 set 函数
  const wrappedSet = (...args) => {
    set(...args);
    saveToStorage(get());
  };

  // 初始化时加载
  const initialState = loadFromStorage();
  if (initialState) {
    set(initialState);
  }

  return api;
};

/**
 * 开发日志中间件
 * 
 * 为什么需要：
 * - 追踪状态变化
 * - 调试性能问题
 * 
 * @param {string} storeName - Store 名称
 * @returns {Function} Zustand 中间件
 */
export const devLogger = (storeName) => (config) => (set, get, api) =>
  config(
    (...args) => {
      if (import.meta.env.DEV) {
        const prevState = get();
        set(...args);
        const nextState = get();
        console.group(`[${storeName}] State Update`);
        console.log("Previous:", prevState);
        console.log("Next:", nextState);
        console.groupEnd();
      } else {
        set(...args);
      }
    },
    get,
    api
  );

/**
 * 性能监控中间件
 * 
 * 为什么需要：
 * - 监控状态更新频率
 * - 发现性能瓶颈
 * 
 * @param {string} storeName - Store 名称
 * @returns {Function} Zustand 中间件
 */
export const performanceMonitor = (storeName) => (config) => (set, get, api) => {
  let updateCount = 0;
  let lastUpdateTime = Date.now();

  return config(
    (...args) => {
      updateCount++;
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTime;

      if (import.meta.env.DEV && timeSinceLastUpdate < 16) {
        // 小于一帧时间，可能是性能问题
        console.warn(
          `[${storeName}] 高频更新: ${timeSinceLastUpdate}ms since last update`
        );
      }

      lastUpdateTime = now;
      set(...args);
    },
    get,
    api
  );
};

export default {
  debouncePersist,
  devLogger,
  performanceMonitor,
};
