import { motion } from "framer-motion";
import { useMemo } from "react";

function PrecipitateParticle({ delay, x, size, color, duration }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: "30%",
        background: color,
        boxShadow: `0 0 4px ${color}`,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, 80, 160],
        opacity: [0, 0.9, 0.6],
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

function PrecipitateLayer({ color, height }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 rounded-b-[inherit]"
      style={{ background: color }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height, opacity: 0.7 }}
      transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
    />
  );
}

export default function PrecipitateEffect({ active, color = "#f5f5f4" }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        x: 5 + Math.random() * 90,
        size: 2 + Math.random() * 5,
        duration: 2 + Math.random() * 2,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <PrecipitateParticle key={p.id} {...p} color={color} />
      ))}
      <PrecipitateLayer color={color} height={25} />
    </div>
  );
}
