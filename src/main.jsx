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
    // 移除 fallback
    const fallback = document.getElementById("fallback");
    if (fallback) fallback.remove();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#a1a1aa", fontFamily: "sans-serif", fontSize: "14px", flexDirection: "column", gap: "8px", textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>加载出错</div>
          <div style={{ color: "#ef4444", fontSize: "12px", maxWidth: "400px" }}>{this.state.error?.message}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "16px", padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
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
    fallback.remove();
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// 应用加载成功后移除 fallback
removeFallback();
