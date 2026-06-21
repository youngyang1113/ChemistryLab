import type { ChemistryEvent, ChemistryEventType, EventHandler } from "./types";

type ListenerMap = Map<ChemistryEventType, Set<EventHandler>>;

/**
 * 化学实验室事件总线
 *
 * 职责：
 * 1. 解耦引擎各模块（MaterialState / RuleEngine / Vessel / Renderer）
 * 2. 支持类型安全的事件订阅与发布
 * 3. 支持一次性监听、优先级、事件历史回放
 * 4. 为未来 AI 模块预留事件钩子
 */
export class ChemistryEventBus {
  private listeners: ListenerMap = new Map();
  private onceListeners: ListenerMap = new Map();
  private history: ChemistryEvent[] = [];
  private maxHistory: number;
  private enabled: boolean = true;

  constructor(maxHistory: number = 200) {
    this.maxHistory = maxHistory;
  }

  // ==================== 订阅 ====================

  on<T = unknown>(type: ChemistryEventType, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler as EventHandler);

    return () => this.off(type, handler);
  }

  once<T = unknown>(type: ChemistryEventType, handler: EventHandler<T>): () => void {
    if (!this.onceListeners.has(type)) {
      this.onceListeners.set(type, new Set());
    }
    this.onceListeners.get(type)!.add(handler as EventHandler);

    return () => {
      this.onceListeners.get(type)?.delete(handler as EventHandler);
    };
  }

  off<T = unknown>(type: ChemistryEventType, handler: EventHandler<T>): void {
    this.listeners.get(type)?.delete(handler as EventHandler);
    this.onceListeners.get(type)?.delete(handler as EventHandler);
  }

  // ==================== 发布 ====================

  emit<T = unknown>(type: ChemistryEventType, payload: T, source: string = "system"): void {
    if (!this.enabled) return;

    const event: ChemistryEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
      source,
    };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const handlers = this.listeners.get(type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${type}:`, err);
        }
      }
    }

    const onceHandlers = this.onceListeners.get(type);
    if (onceHandlers) {
      for (const handler of onceHandlers) {
        try {
          handler(event);
        } catch (err) {
          console.error(`[EventBus] Error in once-handler for ${type}:`, err);
        }
      }
      this.onceListeners.delete(type);
    }
  }

  // ==================== 工具方法 ====================

  getHistory(type?: ChemistryEventType, limit?: number): ChemistryEvent[] {
    let events = type ? this.history.filter((e) => e.type === type) : this.history;
    if (limit) events = events.slice(-limit);
    return events;
  }

  clearHistory(): void {
    this.history = [];
  }

  disable(): void {
    this.enabled = false;
  }

  enable(): void {
    this.enabled = true;
  }

  reset(): void {
    this.listeners.clear();
    this.onceListeners.clear();
    this.history = [];
    this.enabled = true;
  }

  getListenerCount(type?: ChemistryEventType): number {
    if (type) {
      return (this.listeners.get(type)?.size ?? 0) + (this.onceListeners.get(type)?.size ?? 0);
    }
    let count = 0;
    for (const set of this.listeners.values()) count += set.size;
    for (const set of this.onceListeners.values()) count += set.size;
    return count;
  }
}

// ==================== 全局单例 ====================
export const globalEventBus = new ChemistryEventBus();

// ==================== React Hook ====================
import { useEffect, useRef } from "react";

export function useChemistryEvent<T = unknown>(
  type: ChemistryEventType,
  handler: EventHandler<T>,
  deps: unknown[] = []
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const wrapped: EventHandler<T> = (event) => handlerRef.current(event);
    const unsub = globalEventBus.on<T>(type, wrapped);
    return unsub;
  }, [type, ...deps]);
}
