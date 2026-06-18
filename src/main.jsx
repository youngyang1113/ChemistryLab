import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh", 
          background: "#f8fafc",
          color: "#374151", 
          fontFamily: "Inter, system-ui, sans-serif", 
          fontSize: "14px", 
          flexDirection: "column", 
          gap: "16px", 
          textAlign: "center", 
          padding: "20px" 
        }}>
          <div style={{ fontSize: "48px" }}>⚠️</div>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>加载出错</div>
          <div style={{ color: "#ef4444", fontSize: "13px", maxWidth: "400px", background: "#fef2f2", padding: "12px", borderRadius: "8px" }}>
            {this.state.error?.message || "未知错误"}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: "8px", 
              padding: "10px 24px", 
              background: "#3b82f6", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 移除 fallback 元素
const removeFallback = () => {
  const fallback = document.getElementById("fallback");
  if (fallback) {
    fallback.style.display = "none";
    fallback.remove();
  }
};

const rootElement = document.getElementById("root");

// 清空 root 内容（移除 fallback）
rootElement.innerHTML = "";

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
