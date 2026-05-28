import { motion, AnimatePresence } from "framer-motion";
import { Droppable } from "@hello-pangea/dnd";
import BubbleEffect from "./BubbleEffect";
import PrecipitateEffect from "./PrecipitateEffect";
import SmokeEffect from "./SmokeEffect";

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
    </motion.div>
  );
}

export default function Beaker({ state }) {
  const { liquidColor, liquidLevel, effect, precipitateColor, isReacting, shakeIntensity, temperature } = state;
  const hasContents = state.beakerContents.length > 0;

  return (
    <Droppable droppableId="beaker">
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="relative w-full max-w-[320px] mx-auto"
          style={{ height: 'calc(100vh - 300px)', minHeight: '280px', maxHeight: '500px' }}
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

            {/* Liquid */}
            <AnimatePresence>
              {hasContents && (
                <WavyLiquid color={liquidColor} level={liquidLevel} />
              )}
            </AnimatePresence>

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
          </div>

          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
}
