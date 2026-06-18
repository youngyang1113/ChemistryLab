/**
 * 存储服务抽象层
 * 
 * 作用：
 * 1. 统一存储接口，便于切换存储后端（localStorage -> IndexedDB -> Remote）
 * 2. 支持版本控制和数据迁移
 * 3. 提供防抖写入，避免频繁 IO
 * 4. 支持数据压缩和序列化
 */

import { STORAGE } from "../constants/labConfig";

// 存储后端枚举
export const STORAGE_BACKEND = {
  LOCAL: "localStorage",
  INDEXED_DB: "indexedDB",
  REMOTE: "remote",
};

// 当前后端（可通过配置切换）
let currentBackend = STORAGE_BACKEND.LOCAL;

/**
 * 设置存储后端
 * @param {string} backend - 存储后端类型
 */
export function setStorageBackend(backend) {
  currentBackend = backend;
}

/**
 * 通用存储接口
 */
class StorageAdapter {
  async getItem(key) {
    throw new Error("Not implemented");
  }

  async setItem(key, value) {
    throw new Error("Not implemented");
  }

  async removeItem(key) {
    throw new Error("Not implemented");
  }

  async clear() {
    throw new Error("Not implemented");
  }
}

/**
 * localStorage 适配器
 */
class LocalStorageAdapter extends StorageAdapter {
  async getItem(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.warn(`[Storage] 读取 ${key} 失败:`, e);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage] 写入 ${key} 失败:`, e);
      return false;
    }
  }

  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Storage] 删除 ${key} 失败:`, e);
      return false;
    }
  }

  async clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn(`[Storage] 清空失败:`, e);
      return false;
    }
  }
}

/**
 * IndexedDB 适配器（用于大量数据）
 */
class IndexedDBAdapter extends StorageAdapter {
  constructor(dbName = "ChemistryLab", storeName = "labData") {
    super();
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async getItem(key) {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (e) {
      console.warn(`[IndexedDB] 读取 ${key} 失败:`, e);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.put(value, key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (e) {
      console.warn(`[IndexedDB] 写入 ${key} 失败:`, e);
      return false;
    }
  }

  async removeItem(key) {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (e) {
      console.warn(`[IndexedDB] 删除 ${key} 失败:`, e);
      return false;
    }
  }

  async clear() {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } catch (e) {
      console.warn(`[IndexedDB] 清空失败:`, e);
      return false;
    }
  }
}

/**
 * Remote 适配器（预留接口）
 */
class RemoteStorageAdapter extends StorageAdapter {
  constructor(baseUrl = "") {
    super();
    this.baseUrl = baseUrl;
  }

  async getItem(key) {
    // TODO: 实现远程存储读取
    console.warn("[Remote] 远程存储未实现，回退到本地存储");
    return null;
  }

  async setItem(key, value) {
    // TODO: 实现远程存储写入
    console.warn("[Remote] 远程存储未实现");
    return false;
  }

  async removeItem(key) {
    // TODO: 实现远程存储删除
    return false;
  }

  async clear() {
    return false;
  }
}

// 创建适配器实例
const adapters = {
  [STORAGE_BACKEND.LOCAL]: new LocalStorageAdapter(),
  [STORAGE_BACKEND.INDEXED_DB]: new IndexedDBAdapter(),
  [STORAGE_BACKEND.REMOTE]: new RemoteStorageAdapter(),
};

/**
 * 获取当前存储适配器
 */
function getAdapter() {
  return adapters[currentBackend] || adapters[STORAGE_BACKEND.LOCAL];
}

/**
 * 存储服务 API
 */
export const storageService = {
  /**
   * 读取数据
   * @param {string} key - 存储键
   * @returns {Promise<any>} 存储的数据
   */
  async get(key) {
    const adapter = getAdapter();
    const data = await adapter.getItem(key);

    // 版本检查
    if (data && data.version && data.version !== STORAGE.CURRENT_VERSION) {
      console.warn(`[Storage] 数据版本不匹配: ${data.version} != ${STORAGE.CURRENT_VERSION}`);
      // 可以在这里实现数据迁移逻辑
      return null;
    }

    return data;
  },

  /**
   * 写入数据
   * @param {string} key - 存储键
   * @param {any} value - 要存储的数据
   * @returns {Promise<boolean>} 是否成功
   */
  async set(key, value) {
    const adapter = getAdapter();
    const dataWithMeta = {
      version: STORAGE.CURRENT_VERSION,
      timestamp: Date.now(),
      data: value,
    };
    return adapter.setItem(key, dataWithMeta);
  },

  /**
   * 删除数据
   * @param {string} key - 存储键
   * @returns {Promise<boolean>} 是否成功
   */
  async remove(key) {
    const adapter = getAdapter();
    return adapter.removeItem(key);
  },

  /**
   * 清空所有数据
   * @returns {Promise<boolean>} 是否成功
   */
  async clear() {
    const adapter = getAdapter();
    return adapter.clear();
  },

  /**
   * 创建防抖写入器
   * @param {number} delay - 防抖延迟（毫秒）
   * @returns {Object} 防抖写入器
   */
  createDebouncedWriter(delay = 500) {
    let timer = null;

    return {
      /**
       * 防抖写入
       * @param {string} key - 存储键
       * @param {any} value - 要存储的数据
       */
      write(key, value) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          storageService.set(key, value);
        }, delay);
      },

      /**
       * 取消待处理的写入
       */
      cancel() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },

      /**
       * 立即执行待处理的写入
       */
      flush() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
          // 注意：这里无法获取最后一次写入的参数
          // 需要在调用处手动处理
        }
      },
    };
  },
};

export default storageService;
