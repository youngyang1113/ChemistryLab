import { DragDropContext } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useLabStore } from "./hooks/useLabStore";
import ReagentShelf from "./components/ReagentShelf";
import Beaker from "./components/Beaker";
import DataDashboard from "./components/DataDashboard";
import TeacherConsole from "./components/TeacherConsole";
import AIExplanation from "./components/AIExplanation";

function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });

  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="cursor-glow-light"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

function Header({ onTeacherOpen, onAIOpen }) {
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
        <div className="text-[10px] text-gray-500 font-mono ml-2">v2.0</div>
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
  const { state, addReagent, resetBeaker } = useLabStore();
  const [showTeacher, setShowTeacher] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      if (result.destination.droppableId === "beaker") {
        addReagent(result.draggableId);
      }
    },
    [addReagent]
  );

  return (
    <div className="h-screen w-screen overflow-hidden text-gray-900 relative" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #f1f5f9 100%)" }}>
      <CursorGlow />

      <div className="relative z-10 h-full flex flex-col">
        <Header
          onTeacherOpen={() => setShowTeacher(true)}
          onAIOpen={() => setShowAI(!showAI)}
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
            <aside className="w-[260px] shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm">
              <ReagentShelf
                onAddReagent={addReagent}
                beakerContents={state.beakerContents}
              />
            </aside>

            {/* Center: Beaker workspace */}
            <main className="flex-1 flex flex-col items-center justify-center relative p-8" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(219,234,254,0.4) 0%, transparent 70%)" }}>
              {/* Reset button */}
              <motion.button
                onClick={resetBeaker}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-6 right-6 text-[11px] font-medium text-gray-500 hover:text-gray-700 
                  glass-light rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                重置
              </motion.button>

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
              <Beaker state={state} />

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
                      onClick={() => setShowAI(true)}
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
            onClose={() => setShowTeacher(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Explanation Panel */}
      <AnimatePresence>
        {showAI && state.currentReaction && (
          <AIExplanation
            reaction={state.currentReaction}
            onClose={() => setShowAI(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
