import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Toast 容器
let toastId = 0;
const listeners = new Set();

function notify(toast) {
  const id = ++toastId;
  const data = { id, ...toast };
  listeners.forEach((listener) => listener(data));
  return id;
}

// 导出便捷方法
export const toast = {
  success: (message, options = {}) => notify({ type: "success", message, ...options }),
  error: (message, options = {}) => notify({ type: "error", message, ...options }),
  info: (message, options = {}) => notify({ type: "info", message, ...options }),
  reaction: (reaction, options = {}) =>
    notify({
      type: "reaction",
      message: reaction.equation,
      description: reaction.description,
      reactionType: reaction.type,
      ...options,
    }),
};

// Toast 图标
const icons = {
  success: (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  reaction: (
    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 3h6v4l3 8H6l3-8V3z" />
      <path d="M8 15h8v5a1 1 0 01-1 1H9a1 1 0 01-1-1v-5z" />
    </svg>
  ),
};

// 单个 Toast 组件
function ToastItem({ toast: toastData, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = toastData.duration || 5000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toastData.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toastData, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm"
        >
          <div className="shrink-0 mt-0.5">
            {icons[toastData.type] || icons.info}
          </div>
          <div className="flex-1 min-w-0">
            {toastData.reactionType && (
              <p className="text-xs font-medium text-purple-600 mb-1">{toastData.reactionType}</p>
            )}
            <p className="text-sm font-medium text-gray-900 font-mono">{toastData.message}</p>
            {toastData.description && (
              <p className="text-xs text-gray-500 mt-1">{toastData.description}</p>
            )}
            {toastData.action && (
              <button
                onClick={() => {
                  toastData.action.onClick();
                  setIsVisible(false);
                }}
                className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {toastData.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onDismiss(toastData.id), 300);
            }}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast 容器组件
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const handleDismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={handleDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
