import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_PARTICLES = 40;
const SETTLE_Y = -0.58;

export default function PrecipitateParticles({ active, color, radius, liquidHeight }) {
  const pointsRef = useRef();
  const velocitiesRef = useRef(new Float32Array(MAX_PARTICLES));
  const settledRef = useRef(new Uint8Array(MAX_PARTICLES));
  const settleCountRef = useRef(0);
  const layerRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(MAX_PARTICLES * 3);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      resetParticle(arr, i, radius, liquidHeight);
      velocitiesRef.current[i] = 0.15 + Math.random() * 0.25;
      settledRef.current[i] = 0;
    }
    return arr;
  }, [radius, liquidHeight]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;

    const pos = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (settledRef.current[i]) continue;

      pos.array[i * 3 + 1] -= velocitiesRef.current[i] * delta;
      pos.array[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.001;
      pos.array[i * 3 + 2] += Math.cos(Date.now() * 0.001 + i * 0.7) * 0.001;

      if (pos.array[i * 3 + 1] <= SETTLE_Y + settleCountRef.current * 0.003) {
        pos.array[i * 3 + 1] = SETTLE_Y + settleCountRef.current * 0.003;
        settledRef.current[i] = 1;
        settleCountRef.current++;
      }
    }

    pos.needsUpdate = true;

    if (layerRef.current && settleCountRef.current > 0) {
      layerRef.current.material.opacity = Math.min(0.7, settleCountRef.current * 0.05);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={MAX_PARTICLES}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh ref={layerRef} position={[0, SETTLE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 0.01, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

function resetParticle(arr, index, radius, liquidHeight) {
  const r = Math.random() * radius * 0.7;
  const theta = Math.random() * Math.PI * 2;
  arr[index * 3] = Math.cos(theta) * r;
  arr[index * 3 + 1] = -0.6 + liquidHeight * (0.3 + Math.random() * 0.6);
  arr[index * 3 + 2] = Math.sin(theta) * r;
}
