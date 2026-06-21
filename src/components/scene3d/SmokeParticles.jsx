import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_SMOKE = 30;

export default function SmokeParticles({ active, radius, height }) {
  const pointsRef = useRef();
  const lifetimesRef = useRef(new Float32Array(MAX_SMOKE));
  const speedsRef = useRef(new Float32Array(MAX_SMOKE));

  const positions = useMemo(() => {
    const arr = new Float32Array(MAX_SMOKE * 3);
    for (let i = 0; i < MAX_SMOKE; i++) {
      resetSmoke(arr, i, radius, height);
      lifetimesRef.current[i] = Math.random() * 2;
      speedsRef.current[i] = 0.2 + Math.random() * 0.3;
    }
    return arr;
  }, [radius, height]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(MAX_SMOKE);
    for (let i = 0; i < MAX_SMOKE; i++) {
      arr[i] = 0.05 + Math.random() * 0.05;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;

    const pos = pointsRef.current.geometry.attributes.position;
    const life = lifetimesRef.current;
    const speed = speedsRef.current;

    for (let i = 0; i < MAX_SMOKE; i++) {
      life[i] += delta;

      pos.array[i * 3 + 1] += speed[i] * delta;
      pos.array[i * 3] += Math.sin(life[i] * 1.5 + i) * 0.003;
      pos.array[i * 3 + 2] += Math.cos(life[i] * 1.2 + i * 0.3) * 0.003;

      if (life[i] > 2.5 || pos.array[i * 3 + 1] > -0.6 + height + 1.5) {
        resetSmoke(pos.array, i, radius, height);
        life[i] = 0;
        speed[i] = 0.2 + Math.random() * 0.3;
      }
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_SMOKE}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#aaaaaa"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function resetSmoke(arr, index, radius, height) {
  const r = Math.random() * radius * 0.6;
  const theta = Math.random() * Math.PI * 2;
  arr[index * 3] = Math.cos(theta) * r;
  arr[index * 3 + 1] = -0.6 + height + Math.random() * 0.2;
  arr[index * 3 + 2] = Math.sin(theta) * r;
}
