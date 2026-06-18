import { DragDropContext } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
// 使用新的 V3 Store（基于 Zustand）
import { useLabStore } from "./stores/useLabStore";
// 子 Store 可以按需直接导入以获得更好的性能
import useUIStore, {
  useShowTeacherConsole,
  useShowAIExplanation,
} from "./stores/useUIStore";
import ReagentShelf from "./components/ReagentShelf";
import Beaker from "./components/Beaker";
import DataDashboard from "./components/DataDashboard";
import TeacherConsole from "./components/TeacherConsole";
import AIExplanation from "./components/AIExplanation";
import AIExperimentPanel from "./components/AIExperimentPanel";
import { ToastContainer, toast } from "./components/Toast";
import { reagents } from "./state/recipes";

function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let rafId = null;
    const handler = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow-light"
      style={{ left: 0, top: 0, transform: "translate(-300px, -300px)" }}
    />
  );
}

function Header({ onTeacherOpen, onAIOpen, onAIExperimentOpen }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 shrink-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6v4l3 8H6l3-8V3z" />
            <path d="M8 15h8v5a1 1 0 01-1 1H9a1 1 0 01-1-1v-5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 tracking-tight">AI 虚拟化学实验室</h1>
          <p className="text-[10px] text-gray-500">交互式分子模拟</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAIExperimentOpen}
          className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-sm"
        >
          AI 实验引擎
        </button>
        <button
          onClick={onAIOpen}
          className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm"
        >
          AI 讲解
        </button>
        <button
          onClick={onTeacherOpen}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
        >
          教师控制台
        </button>
        <div className="text-[10px] text-gray-500 font-mono ml-2">v3.0</div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </header>
  );
}

function StatusBanner({ reaction }) {
  if (!reaction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className="mx-6 mt-4"
    >
      <div
        className="glass-light rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          borderLeft: `3px solid ${reaction.color}`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: reaction.color,
            boxShadow: `0 0 8px ${reaction.color}`,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-gray-700">{reaction.type}</div>
          <div className="text-[10px] font-mono text-gray-500 truncate">{reaction.equation}</div>
        </div>
        <div className="text-[10px] text-gray-400 shrink-0">{reaction.description}</div>
      </div>
    </motion.div>
  );
}

export default function App() {
  // 使用新的 V3 Store（基于 Zustand）
  const { state, addReagent, resetBeaker, undo, redo, canUndo, canRedo } = useLabStore();

  // UI 状态使用独立的 store，避免业务状态变化触发 UI 重渲染
  const showTeacher = useShowTeacherConsole();
  const showAI = useShowAIExplanation();
  const { openTeacherConsole, openAIExplanation, closeAIExplanation } = useUIStore();

  // AI 实验面板状态
  const [showAIExperiment, setShowAIExperiment] = useState(false);

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      if (result.destination.droppableId === "beaker") {
        addReagent(result.draggableId);
      }
    },
    [addReagent]
  );

  // 反应发生时显示 Toast
  const prevReactionRef = useRef(null);
  useEffect(() => {
    if (state.currentReaction && state.isReacting && state.currentReaction !== prevReactionRef.current) {
      prevReactionRef.current = state.currentReaction;
      toast.reaction(state.currentReaction, {
        action: {
          label: "查看 AI 讲解",
          onClick: () => openAIExplanation(),
        },
      });
    }
    if (!state.isReacting) {
      prevReactionRef.current = null;
    }
  }, [state.currentReaction, state.isReacting, openAIExplanation]);

  return (
    <div className="h-screen w-screen overflow-hidden text-gray-900 relative" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #f1f5f9 100%)" }}>
      <CursorGlow />

      <div className="relative z-10 h-full flex flex-col">
        <Header
          onTeacherOpen={() => openTeacherConsole()}
          onAIOpen={() => showAI ? closeAIExplanation() : openAIExplanation()}
          onAIExperimentOpen={() => setShowAIExperiment(!showAIExperiment)}
        />

        {/* Status banner */}
        <AnimatePresence>
          {state.currentReaction && state.isReacting && (
            <StatusBanner reaction={state.currentReaction} />
          )}
        </AnimatePresence>

        {/* Main 3-column layout */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Reagent Shelf */}
            <aside className="w-[200px] shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm">
              <ReagentShelf
                onAddReagent={addReagent}
                beakerContents={state.beakerContents}
              />
            </aside>

            {/* Center: Beaker workspace */}
            <main className="flex-1 flex flex-col items-center justify-center relative p-8" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(219,234,254,0.4) 0%, transparent 70%)" }}>
              {/* Control buttons */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                {/* Undo button */}
                <motion.button
                  onClick={undo}
                  disabled={!canUndo}
                  whileHover={canUndo ? { scale: 1.05 } : {}}
                  whileTap={canUndo ? { scale: 0.95 } : {}}
                  className={`text-[11px] font-medium glass-light rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5
                    ${canUndo ? "text-gray-500 hover:text-gray-700" : "text-gray-300 cursor-not-allowed"}`}
                  title="撤销 (Ctrl+Z)"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h10a5 5 0 015 5v2" />
                    <path d="M3 10l4-4M3 10l4 4" />
                  </svg>
                  撤销
                </motion.button>

                {/* Redo button */}
                <motion.button
                  onClick={redo}
                  disabled={!canRedo}
                  whileHover={canRedo ? { scale: 1.05 } : {}}
                  whileTap={canRedo ? { scale: 0.95 } : {}}
                  className={`text-[11px] font-medium glass-light rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5
                    ${canRedo ? "text-gray-500 hover:text-gray-700" : "text-gray-300 cursor-not-allowed"}`}
                  title="重做 (Ctrl+Y)"
                >
                  重做
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10H11a5 5 0 00-5 5v2" />
                    <path d="M21 10l-4-4M21 10l-4 4" />
                  </svg>
                </motion.button>

                {/* Reset button */}
                <motion.button
                  onClick={resetBeaker}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[11px] font-medium text-gray-500 hover:text-gray-700 
                    glass-light rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  重置
                </motion.button>
              </div>

              {/* Reaction type indicator */}
              <AnimatePresence>
                {state.currentReaction && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 text-center"
                  >
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: `${state.currentReaction.color}15`,
                        color: state.currentReaction.color,
                        border: `1px solid ${state.currentReaction.color}30`,
                      }}
                    >
                      {state.currentReaction.type}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Beaker */}
              <Beaker state={state} reagents={reagents} />

              {/* Equation display below beaker */}
              <AnimatePresence>
                {state.currentReaction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 text-center"
                  >
                    <div className="text-xs font-mono text-gray-600 bg-white/80 rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                      {state.currentReaction.equation}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5 max-w-xs">
                      {state.currentReaction.description}
                    </p>
                    <button
                      onClick={() => openAIExplanation()}
                      className="mt-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      查看 AI 讲解
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Right: Data Dashboard */}
            <aside className="w-[280px] shrink-0 border-l border-gray-200 bg-white/80 backdrop-blur-sm">
              <DataDashboard state={state} />
            </aside>
          </div>
        </DragDropContext>
      </div>

      {/* Teacher Console Modal */}
      <AnimatePresence>
        {showTeacher && (
          <TeacherConsole
            state={state}
            isOpen={showTeacher}
            onClose={() => useUIStore.getState().closeTeacherConsole()}
          />
        )}
      </AnimatePresence>

      {/* AI Explanation Panel */}
      <AnimatePresence>
        {showAI && state.currentReaction && (
          <AIExplanation
            reaction={state.currentReaction}
            onClose={() => closeAIExplanation()}
          />
        )}
      </AnimatePresence>

      {/* AI Experiment Panel */}
      <AnimatePresence>
        {showAIExperiment && (
          <AIExperimentPanel
            state={state}
            onClose={() => setShowAIExperiment(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
