import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function AnimatedValue({ value, suffix = "", decimals = 1 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 800;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    }

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <>{display.toFixed(decimals)}{suffix}</>;
}

function MiniChart({ data, color, max, label, unit }) {
  const width = 200;
  const height = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        <span className="text-[10px] text-zinc-600">{unit}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-14">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${label})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current value dot */}
        {data.length > 0 && (
          <circle
            cx={(data.length - 1) / (data.length - 1) * width}
            cy={height - (data[data.length - 1] / max) * height}
            r="3"
            fill={color}
            stroke={color}
            strokeWidth="2"
            opacity="0.8"
          >
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}

export default function DataDashboard({ state }) {
  const [phHistory, setPhHistory] = useState([7]);
  const [tempHistory, setTempHistory] = useState([25]);
  const [speedHistory, setSpeedHistory] = useState([0]);

  useEffect(() => {
    setPhHistory((prev) => {
      const next = [...prev, state.ph];
      return next.slice(-30);
    });
    setTempHistory((prev) => {
      const next = [...prev, state.temperature];
      return next.slice(-30);
    });

    const speed = state.isReacting
      ? state.effect === "gas" ? 85 : state.effect === "smoke" ? 95 : state.effect === "heat" ? 60 : 40
      : 0;
    setSpeedHistory((prev) => {
      const next = [...prev, speed];
      return next.slice(-30);
    });
  }, [state.ph, state.temperature, state.isReacting, state.effect]);

  const phColor = state.ph < 4 ? "#ef4444" : state.ph < 6 ? "#f97316" : state.ph < 8 ? "#22c55e" : state.ph < 10 ? "#3b82f6" : "#8b5cf6";

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          实时数据
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {/* Big value displays */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-light rounded-xl p-3 text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">pH</div>
            <motion.div
              className="text-xl font-mono font-bold"
              style={{ color: phColor }}
              key={state.ph}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              <AnimatedValue value={state.ph} suffix="" decimals={1} />
            </motion.div>
          </div>
          <div className="glass-light rounded-xl p-3 text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">温度</div>
            <motion.div
              className="text-xl font-mono font-bold text-orange-500"
              key={state.temperature}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              <AnimatedValue value={state.temperature} suffix="°" decimals={0} />
            </motion.div>
          </div>
          <div className="glass-light rounded-xl p-3 text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">速率</div>
            <motion.div
              className="text-xl font-mono font-bold text-cyan-600"
              key={speedHistory[speedHistory.length - 1]}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              <AnimatedValue value={speedHistory[speedHistory.length - 1]} suffix="%" decimals={0} />
            </motion.div>
          </div>
        </div>

        {/* Charts */}
        <div className="glass-light rounded-xl p-4 mb-4">
          <MiniChart data={phHistory} color={phColor} max={14} label="pH 值" unit="0-14" />
          <MiniChart data={tempHistory} color="#f97316" max={100} label="温度" unit="°C" />
          <MiniChart data={speedHistory} color="#0891b2" max={100} label="反应速率" unit="arb." />
        </div>

        {/* Reaction log */}
        <div className="glass-light rounded-xl p-4">
          <h3 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">
            反应日志
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {state.reactionLog.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic">暂无反应记录...</p>
              ) : (
                state.reactionLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-2 border-gray-200 pl-3 py-1"
                  >
                    <div className="text-[10px] text-gray-500 font-medium">{log.type}</div>
                    <div className="text-[11px] text-gray-700 font-mono">{log.equation}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{log.description}</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Current beaker contents */}
        <div className="glass-light rounded-xl p-4 mt-4">
          <h3 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">
            烧杯内容物
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {state.beakerContents.length === 0 ? (
              <span className="text-[11px] text-gray-400 italic">空</span>
            ) : (
              state.beakerContents.map((id) => (
                <span
                  key={id}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-600"
                >
                  {id}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
