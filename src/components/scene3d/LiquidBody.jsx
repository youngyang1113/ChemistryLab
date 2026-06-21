import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LiquidBody({ height, color, radius, temperature, isReacting, effect }) {
  const meshRef = useRef();
  const matRef = useRef();
  const timeRef = useRef(0);

  const isHot = temperature > 50;
  const isBoiling = temperature > 85;

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;

    meshRef.current.position.y = -0.6 + height / 2;

    if (isBoiling && isReacting) {
      meshRef.current.position.y += Math.sin(t * 8) * 0.008;
      meshRef.current.rotation.y = Math.sin(t * 2) * 0.02;
    } else if (isHot) {
      meshRef.current.position.y += Math.sin(t * 3) * 0.003;
    }

    if (isReacting && effect === "colorChange") {
      matRef.current.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.15;
    } else {
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        0,
        delta * 3
      );
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, -0.6 + height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 32, 1, false]} />
        <meshPhysicalMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={0.75}
          roughness={0.3}
          metalness={0}
          transmission={0.3}
          thickness={0.5}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0}
        />
      </mesh>

      <mesh position={[0, -0.6 + height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 0.005, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {isHot && <SteamEffect height={height} radius={radius} temperature={temperature} />}
    </group>
  );
}

function SteamEffect({ height, radius, temperature }) {
  const pointsRef = useRef();
  const count = Math.min(Math.floor((temperature - 50) / 10), 8);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * radius * 1.5;
      arr[i * 3 + 1] = -0.6 + height + Math.random() * 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.5;
    }
    return arr;
  }, [count, radius, height]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += delta * (0.3 + Math.random() * 0.2);
      if (pos.array[i * 3 + 1] > -0.6 + height + 0.8) {
        pos.array[i * 3] = (Math.random() - 0.5) * radius * 1.5;
        pos.array[i * 3 + 1] = -0.6 + height;
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.5;
      }
    }
    pos.needsUpdate = true;
  });

  if (count <= 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}
