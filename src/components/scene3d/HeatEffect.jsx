import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HeatEffect({ active, temperature, radius, height }) {
  const glowRef = useRef();
  const timeRef = useRef(0);

  const intensity = Math.min(1, (temperature - 50) / 50);
  const heatColor = useMemo(
    () => new THREE.Color().setHSL(0.08 - intensity * 0.08, 1, 0.5 + intensity * 0.2),
    [intensity]
  );

  useFrame((_, delta) => {
    if (!glowRef.current || !active) return;

    timeRef.current += delta;
    const t = timeRef.current;

    const pulse = 0.5 + Math.sin(t * 3) * 0.2;
    glowRef.current.material.opacity = pulse * intensity * 0.4;

    glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
  });

  return (
    <group>
      {/* 底部热源发光 */}
      <mesh ref={glowRef} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 1.2, 32]} />
        <meshBasicMaterial
          color={heatColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 热浪扭曲效果（使用垂直光柱模拟） */}
      <HeatShimmer height={height} radius={radius} temperature={temperature} />
    </group>
  );
}

function HeatShimmer({ height, radius, temperature }) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  const intensity = Math.min(1, (temperature - 60) / 40);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    meshRef.current.material.opacity = Math.sin(t * 4) * 0.05 * intensity;
    meshRef.current.scale.x = 1 + Math.sin(t * 2) * 0.02;
    meshRef.current.scale.z = 1 + Math.cos(t * 2.5) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.6 + height / 2, 0]}>
      <cylinderGeometry args={[radius * 0.8, radius * 1.1, height * 0.5, 16, 1, true]} />
      <meshBasicMaterial
        color="#ff8844"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
