import { motion, AnimatePresence } from "framer-motion";
import { Droppable } from "@hello-pangea/dnd";
import { useState, useEffect, useRef } from "react";
import BubbleEffect from "./BubbleEffect";
import PrecipitateEffect from "./PrecipitateEffect";
import SmokeEffect from "./SmokeEffect";
import { PHASE_CONFIG } from "../constants/labConfig";

function HeatGlow({ active, temperature }) {
  if (!active) return null;
  const intensity = Math.min((temperature - 25) / 75, 1);
  return (
    <motion.div
      className="absolute inset-0 rounded-[inherit] pointer-events-none z-5"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        boxShadow: [
          `inset 0 0 ${20 + intensity * 40}px rgba(251,146,60,${0.1 + intensity * 0.2})`,
          `inset 0 0 ${30 + intensity * 50}px rgba(251,146,60,${0.2 + intensity * 0.3})`,
          `inset 0 0 ${20 + intensity * 40}px rgba(251,146,60,${0.1 + intensity * 0.2})`,
        ],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

function ColorChangeGlow({ active, color }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute inset-0 rounded-[inherit] pointer-events-none z-5"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        boxShadow: [
          `inset 0 0 30px ${color}40, 0 0 20px ${color}20`,
          `inset 0 0 50px ${color}60, 0 0 40px ${color}30`,
          `inset 0 0 30px ${color}40, 0 0 20px ${color}20`,
        ],
      }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

function WavyLiquid({ color, level }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-1"
      style={{ height: `${level}%` }}
      initial={{ height: 0 }}
      animate={{ height: `${level}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Liquid body */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${color}cc, ${color})`,
          borderRadius: "0 0 inherit",
        }}
        animate={{
          background: `linear-gradient(180deg, ${color}cc, ${color})`,
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Wavy top surface */}
      <svg
        className="absolute -top-2 left-0 w-full h-4 z-2"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,5 Q25,0 50,5 Q75,10 100,5 Q125,0 150,5 Q175,10 200,5 L200,10 L0,10 Z"
          fill={color}
          animate={{
            d: [
              "M0,5 Q25,0 50,5 Q75,10 100,5 Q125,0 150,5 Q175,10 200,5 L200,10 L0,10 Z",
              "M0,5 Q25,10 50,5 Q75,0 100,5 Q125,10 150,5 Q175,0 200,5 L200,10 L0,10 Z",
              "M0,5 Q25,0 50,5 Q75,10 100,5 Q125,0 150,5 Q175,10 200,5 L200,10 L0,10 Z",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Glass refraction */}
      <div className="absolute top-0 left-[8%] w-[15%] h-full bg-gradient-to-r from-white/[0.06] to-transparent z-3" />
    </motion.div>
  );
}

function BeakerGlass() {
  return (
    <>
      {/* Main beaker body */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.8) 50%, rgba(255,255,255,0.85) 100%)",
          border: "1.5px solid rgba(0,0,0,0.1)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05), 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 60px rgba(56,189,248,0.08)",
        }}
      />

      {/* Glass reflection - left */}
      <div
        className="absolute top-[5%] left-[6%] w-[12%] h-[60%] rounded-full z-20"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
          filter: "blur(1px)",
        }}
      />

      {/* Glass reflection - top rim */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[2px] z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
        }}
      />

      {/* Pour spout */}
      <div
        className="absolute -top-[6px] left-[20%] w-[8%] h-[12px] rounded-t-md z-10"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1.5px solid rgba(0,0,0,0.1)",
          borderBottom: "none",
        }}
      />

      {/* Graduation marks */}
      {[25, 50, 75].map((mark) => (
        <div
          key={mark}
          className="absolute right-[8%] z-20"
          style={{ bottom: `${mark + 5}%` }}
        >
          <div className="w-4 h-[1px] bg-gray-300" />
          <span className="text-[7px] text-gray-400 absolute -left-5 -top-1 font-mono">
            {mark}
          </span>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-gray-400 mb-3"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6v4l3 8H6l3-8V3z" />
          <path d="M6 15h12v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" />
        </svg>
      </motion.div>
      <p className="text-xs text-gray-500 font-medium">拖放试剂到此处</p>
      <p className="text-[10px] text-gray-400 mt-0.5">或从左侧试剂架点击添加</p>
      <div className="flex gap-3 mt-3">
        {Object.entries(PHASE_CONFIG).map(([key, { label, icon }]) => (
          <div key={key} className="text-[10px] text-gray-400 flex items-center gap-1">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// 试剂添加时的物相特效
function PhaseAddEffect({ phase }) {
  if (!phase) return null;

  if (phase === "solid") {
    // 固体投入：从上方落入的小颗粒
    return (
      <motion.div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gray-400"
            initial={{ x: (i - 2) * 12, y: 0, opacity: 1 }}
            animate={{ y: 80, opacity: 0, x: (i - 2) * 18 }}
            transition={{ duration: 0.8 + i * 0.1, ease: "easeIn" }}
          />
        ))}
        <motion.div
          className="text-[10px] text-gray-500 font-medium whitespace-nowrap"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 30, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          🪨 固体投入
        </motion.div>
      </motion.div>
    );
  }

  if (phase === "gas") {
    // 气体通入：冒出气泡
    return (
      <motion.div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full border border-gray-300 bg-white/50"
            initial={{ x: (i - 3) * 10, y: 0, opacity: 0.8, scale: 0.5 + Math.random() * 0.5 }}
            animate={{ y: -60 - i * 15, opacity: 0, x: (i - 3) * 15 }}
            transition={{ duration: 1 + i * 0.15, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="text-[10px] text-gray-500 font-medium whitespace-nowrap"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -20, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          💨 气体通入
        </motion.div>
      </motion.div>
    );
  }

  // liquid: 无额外特效
  return null;
}

// 固体块状物显示
function SolidChunks({ solidReagents }) {
  if (!solidReagents || solidReagents.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-8 pointer-events-none">
      <div className="flex flex-wrap justify-center gap-1 px-4 pb-1">
        {solidReagents.map((r, i) => {
          // 根据试剂ID生成确定性的大小和形状
          const hash = r.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
          const w = 12 + (hash % 10);
          const h = 8 + (hash % 8);
          const br = 2 + (hash % 4);
          const rotate = -5 + (hash % 11);

          return (
            <motion.div
              key={r.id}
              initial={{ y: -30, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              title={r.name}
              style={{
                width: `${w}px`,
                height: `${h}px`,
                backgroundColor: r.color,
                borderRadius: `${br}px`,
                transform: `rotate(${rotate}deg)`,
                boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Beaker({ state, reagents: reagentList }) {
  const { liquidColor, liquidLevel, effect, precipitateColor, isReacting, shakeIntensity, temperature } = state;
  const hasContents = state.beakerContents.length > 0;

  // 用于追踪物相添加特效
  const [addPhase, setAddPhase] = useState(null);
  const prevContentsLenRef = useRef(state.beakerContents.length);

  useEffect(() => {
    const prevLen = prevContentsLenRef.current;
    const curLen = state.beakerContents.length;
    if (curLen > prevLen && reagentList) {
      const lastId = state.beakerContents[curLen - 1];
      const reagent = reagentList.find((r) => r.id === lastId);
      if (reagent && reagent.phase) {
        setAddPhase(reagent.phase);
        const timer = setTimeout(() => setAddPhase(null), 1500);
        return () => clearTimeout(timer);
      }
    }
    prevContentsLenRef.current = curLen;
  }, [state.beakerContents, reagentList]);

  return (
    <Droppable droppableId="beaker">
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="relative w-full max-w-[400px] mx-auto"
          style={{ height: 'calc(100vh - 250px)', minHeight: '350px', maxHeight: '600px' }}
          animate={
            shakeIntensity > 0
              ? {
                  x: [0, -3 * shakeIntensity, 3 * shakeIntensity, -2 * shakeIntensity, 2 * shakeIntensity, 0],
                  y: [0, 1, -1, 1, 0],
                }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Outer glow when dragging over */}
          {snapshot.isDraggingOver && (
            <motion.div
              className="absolute -inset-4 rounded-3xl z-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                boxShadow: "0 0 40px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)",
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "2px dashed rgba(59,130,246,0.4)",
              }}
            />
          )}

          {/* Beaker container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden z-10">
            <BeakerGlass />
            <HeatGlow active={effect === "heat"} temperature={temperature} />
            <ColorChangeGlow active={effect === "colorChange"} color={liquidColor} />

            {/* Liquid */}
            <AnimatePresence>
              {hasContents && (
                <WavyLiquid color={liquidColor} level={liquidLevel} />
              )}
            </AnimatePresence>

            {/* Solid chunks */}
            {reagentList && (
              <SolidChunks
                solidReagents={state.beakerContents
                  .map((id) => reagentList.find((r) => r.id === id))
                  .filter((r) => r && r.phase === "solid")}
              />
            )}

            {/* Effects layer - behind glass, above liquid */}
            <BubbleEffect
              active={isReacting && (effect === "gas" || effect === "smoke")}
              intensity={temperature > 60 ? "high" : "normal"}
            />
            <PrecipitateEffect
              active={isReacting && effect === "precipitate"}
              color={precipitateColor}
            />
            <SmokeEffect active={isReacting && effect === "smoke"} />

            {/* Empty state */}
            {!hasContents && <EmptyState />}

            {/* Phase add effect */}
            <AnimatePresence>
              {addPhase && <PhaseAddEffect phase={addPhase} />}
            </AnimatePresence>
          </div>

          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
}
