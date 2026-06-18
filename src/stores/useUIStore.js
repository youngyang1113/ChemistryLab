/**
 * UI 状态 Store
 * 
 * 职责：
 * 1. 管理 UI 相关状态（弹窗、面板、主题等）
 * 2. 管理用户偏好设置
 * 3. 管理加载状态
 * 
 * 为什么独立：
 * - UI 状态与业务逻辑完全解耦
 * - 避免业务状态变化触发 UI 组件重渲染
 * - 便于未来扩展（主题切换、多语言等）
 */

import { create } from "zustand";

// 创建 store
const useUIStore = create((set, get) => ({
  // ==================== 弹窗状态 ====================
  showTeacherConsole: false,
  showAIExplanation: false,
  showKnowledgeBase: false,
  showSettings: false,

  // ==================== 面板状态 ====================
  isSidebarOpen: true,
  isDashboardOpen: true,
  sidebarWidth: 200,
  dashboardWidth: 280,

  // ==================== 主题设置 ====================
  theme: "light", // "light" | "dark" | "auto"
  accentColor: "#3b82f6",

  // ==================== 加载状态 ====================
  isLoading: false,
  loadingMessage: "",
  error: null,

  // ==================== 提示状态 ====================
  toast: null,

  // ==================== 拖拽状态 ====================
  isDragging: false,
  draggedItem: null,

  // ==================== 弹窗操作 ====================

  /**
   * 切换教师控制台显示
   */
  toggleTeacherConsole: () => {
    set((state) => ({ showTeacherConsole: !state.showTeacherConsole }));
  },

  /**
   * 打开教师控制台
   */
  openTeacherConsole: () => {
    set({ showTeacherConsole: true });
  },

  /**
   * 关闭教师控制台
   */
  closeTeacherConsole: () => {
    set({ showTeacherConsole: false });
  },

  /**
   * 切换 AI 讲解显示
   */
  toggleAIExplanation: () => {
    set((state) => ({ showAIExplanation: !state.showAIExplanation }));
  },

  /**
   * 打开 AI 讲解
   */
  openAIExplanation: () => {
    set({ showAIExplanation: true });
  },

  /**
   * 关闭 AI 讲解
   */
  closeAIExplanation: () => {
    set({ showAIExplanation: false });
  },

  /**
   * 切换知识库显示
   */
  toggleKnowledgeBase: () => {
    set((state) => ({ showKnowledgeBase: !state.showKnowledgeBase }));
  },

  /**
   * 切换设置显示
   */
  toggleSettings: () => {
    set((state) => ({ showSettings: !state.showSettings }));
  },

  // ==================== 面板操作 ====================

  /**
   * 切换侧边栏
   */
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  /**
   * 切换仪表盘
   */
  toggleDashboard: () => {
    set((state) => ({ isDashboardOpen: !state.isDashboardOpen }));
  },

  /**
   * 设置侧边栏宽度
   */
  setSidebarWidth: (width) => {
    set({ sidebarWidth: width });
  },

  /**
   * 设置仪表盘宽度
   */
  setDashboardWidth: (width) => {
    set({ dashboardWidth: width });
  },

  // ==================== 主题操作 ====================

  /**
   * 设置主题
   */
  setTheme: (theme) => {
    set({ theme });
  },

  /**
   * 设置强调色
   */
  setAccentColor: (color) => {
    set({ accentColor: color });
  },

  // ==================== 加载状态操作 ====================

  /**
   * 开始加载
   */
  startLoading: (message = "") => {
    set({
      isLoading: true,
      loadingMessage: message,
      error: null,
    });
  },

  /**
   * 停止加载
   */
  stopLoading: () => {
    set({
      isLoading: false,
      loadingMessage: "",
    });
  },

  /**
   * 设置错误
   */
  setError: (error) => {
    set({
      error,
      isLoading: false,
      loadingMessage: "",
    });
  },

  /**
   * 清除错误
   */
  clearError: () => {
    set({ error: null });
  },

  // ==================== 提示操作 ====================

  /**
   * 显示提示
   */
  showToast: (toast) => {
    set({ toast });
  },

  /**
   * 隐藏提示
   */
  hideToast: () => {
    set({ toast: null });
  },

  // ==================== 拖拽操作 ====================

  /**
   * 设置拖拽状态
   */
  setDragging: (isDragging, draggedItem = null) => {
    set({
      isDragging,
      draggedItem,
    });
  },

  // ==================== 重置 ====================

  /**
   * 重置 UI 状态
   */
  reset: () => {
    set({
      showTeacherConsole: false,
      showAIExplanation: false,
      showKnowledgeBase: false,
      showSettings: false,
      isLoading: false,
      loadingMessage: "",
      error: null,
      toast: null,
      isDragging: false,
      draggedItem: null,
    });
  },
}));

export default useUIStore;

// ==================== 导出 Selector Hooks ====================

/** 仅订阅弹窗状态 */
export const useModals = () =>
  useUIStore((state) => ({
    showTeacherConsole: state.showTeacherConsole,
    showAIExplanation: state.showAIExplanation,
    showKnowledgeBase: state.showKnowledgeBase,
    showSettings: state.showSettings,
  }));

/** 仅订阅教师控制台状态 */
export const useShowTeacherConsole = () =>
  useUIStore((state) => state.showTeacherConsole);

/** 仅订阅 AI 讲解状态 */
export const useShowAIExplanation = () =>
  useUIStore((state) => state.showAIExplanation);

/** 仅订阅面板状态 */
export const usePanelState = () =>
  useUIStore((state) => ({
    isSidebarOpen: state.isSidebarOpen,
    isDashboardOpen: state.isDashboardOpen,
    sidebarWidth: state.sidebarWidth,
    dashboardWidth: state.dashboardWidth,
  }));

/** 仅订阅加载状态 */
export const useLoadingState = () =>
  useUIStore((state) => ({
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
    error: state.error,
  }));

/** 仅订阅拖拽状态 */
export const useDragState = () =>
  useUIStore((state) => ({
    isDragging: state.isDragging,
    draggedItem: state.draggedItem,
  }));
