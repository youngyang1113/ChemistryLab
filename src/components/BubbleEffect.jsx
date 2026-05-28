import { motion } from "framer-motion";
import { useMemo } from "react";

function Bubble({ delay, x, size, duration, xOffsets }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "5%",
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.05))",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
      initial={{ y: 0, opacity: 0, scale: 1 }}
      animate={{
        y: [0, -120, -200],
        opacity: [0, 0.8, 0],
        scale: [1, 0.8, 0.3],
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

export default function BubbleEffect({ active, intensity = "normal" }) {
  const bubbles = useMemo(() => {
    const count = intensity === "high" ? 25 : intensity === "normal" ? 15 : 8;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      x: 10 + Math.random() * 80,
      size: 3 + Math.random() * (intensity === "high" ? 8 : 5),
      duration: 1.5 + Math.random() * 2,
      xOffsets: [0, Math.random() * 20 - 10, Math.random() * 30 - 15],
    }));
  }, [intensity]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {bubbles.map((b) => (
        <Bubble key={b.id} {...b} />
      ))}
    </div>
  );
}
