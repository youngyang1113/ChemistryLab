import type { SimEvent, SimEventType, SimEventHandler } from "./types";

type ListenerSet = Set<SimEventHandler>;

export class SimEventBus {
  private listeners = new Map<SimEventType, ListenerSet>();
  private onceListeners = new Map<SimEventType, ListenerSet>();
  private history: SimEvent[] = [];
  private maxHistory = 500;

  on<T = unknown>(type: SimEventType, handler: SimEventHandler<T>): () => void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(handler as SimEventHandler);
    return () => this.off(type, handler);
  }

  once<T = unknown>(type: SimEventType, handler: SimEventHandler<T>): () => void {
    if (!this.onceListeners.has(type)) this.onceListeners.set(type, new Set());
    this.onceListeners.get(type)!.add(handler as SimEventHandler);
    return () => this.onceListeners.get(type)?.delete(handler as SimEventHandler);
  }

  off<T = unknown>(type: SimEventType, handler: SimEventHandler<T>): void {
    this.listeners.get(type)?.delete(handler as SimEventHandler);
    this.onceListeners.get(type)?.delete(handler as SimEventHandler);
  }

  emit<T = unknown>(type: SimEventType, payload: T): void {
    const event: SimEvent<T> = { type, payload, timestamp: performance.now() };

    this.history.push(event as SimEvent);
    if (this.history.length > this.maxHistory) this.history.shift();

    const handlers = this.listeners.get(type);
    if (handlers) {
      for (const h of handlers) {
        try { h(event); } catch (e) { console.error(`[SimEventBus] ${type}:`, e); }
      }
    }

    const once = this.onceListeners.get(type);
    if (once) {
      for (const h of once) {
        try { h(event); } catch (e) { console.error(`[SimEventBus] once ${type}:`, e); }
      }
      this.onceListeners.delete(type);
    }
  }

  getHistory(type?: SimEventType, limit = 50): SimEvent[] {
    const filtered = type ? this.history.filter((e) => e.type === type) : this.history;
    return filtered.slice(-limit);
  }

  clear(): void {
    this.listeners.clear();
    this.onceListeners.clear();
    this.history = [];
  }
}

export const simEventBus = new SimEventBus();
