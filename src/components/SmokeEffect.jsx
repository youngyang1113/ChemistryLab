import { motion } from "framer-motion";
import { useMemo } from "react";

function SmokeParticle({ delay, x, size, duration, xOffsets }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "20%",
        background: "radial-gradient(circle, rgba(200,200,200,0.3), transparent)",
        filter: "blur(3px)",
      }}
      initial={{ y: 0, opacity: 0, scale: 1 }}
      animate={{
        y: [0, -60, -150, -250],
        opacity: [0, 0.5, 0.3, 0],
        scale: [1, 1.5, 2.5, 3],
        x: xOffsets,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

function SparkParticle({ delay, x, y, yOffset, xOffset, dur, repeatDur }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-yellow-300"
      style={{
        left: `${x}%`,
        bottom: `${y}%`,
        boxShadow: "0 0 6px #fbbf24, 0 0 12px #f59e0b",
      }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [1, 0.5, 0],
        y: [0, yOffset],
        x: [0, xOffset],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        repeatDelay: repeatDur,
      }}
    />
  );
}

export default function SmokeEffect({ active }) {
  const smokes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: Math.random() * 1.5,
        x: 10 + Math.random() * 80,
        size: 20 + Math.random() * 40,
        duration: 2 + Math.random() * 2,
        xOffsets: [0, Math.random() * 30 - 15, Math.random() * 50 - 25, Math.random() * 60 - 30],
      })),
    []
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: Math.random() * 1,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 20,
        yOffset: -(40 + Math.random() * 60),
        xOffset: Math.random() * 40 - 20,
        dur: 0.6 + Math.random() * 0.4,
        repeatDur: Math.random() * 0.5,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {smokes.map((s) => (
        <SmokeParticle key={s.id} {...s} />
      ))}
      {sparks.map((s) => (
        <SparkParticle key={`spark-${s.id}`} {...s} />
      ))}
    </div>
  );
}
