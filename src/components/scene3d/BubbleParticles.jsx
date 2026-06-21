import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_BUBBLES = 50;

export default function BubbleParticles({ active, intensity, radius, maxHeight }) {
  const pointsRef = useRef();
  const velocitiesRef = useRef(new Float32Array(MAX_BUBBLES));
  const lifetimesRef = useRef(new Float32Array(MAX_BUBBLES));

  const targetCount = Math.min(MAX_BUBBLES, 8 + intensity * 8);

  const positions = useMemo(() => {
    const arr = new Float32Array(MAX_BUBBLES * 3);
    for (let i = 0; i < MAX_BUBBLES; i++) {
      resetBubble(arr, i, radius, maxHeight);
      velocitiesRef.current[i] = 0.3 + Math.random() * 0.4;
      lifetimesRef.current[i] = Math.random() * 2;
    }
    return arr;
  }, [radius, maxHeight]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(MAX_BUBBLES);
    for (let i = 0; i < MAX_BUBBLES; i++) {
      arr[i] = 0.02 + Math.random() * 0.03;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;

    const pos = pointsRef.current.geometry.attributes.position;
    const vel = velocitiesRef.current;
    const life = lifetimesRef.current;

    for (let i = 0; i < MAX_BUBBLES; i++) {
      life[i] += delta;

      if (i < targetCount) {
        pos.array[i * 3 + 1] += vel[i] * delta;
        pos.array[i * 3] += Math.sin(life[i] * 3 + i) * 0.002;
        pos.array[i * 3 + 2] += Math.cos(life[i] * 2.5 + i * 0.5) * 0.002;

        const limit = -0.6 + maxHeight;
        if (pos.array[i * 3 + 1] > limit || life[i] > 3) {
          resetBubble(pos.array, i, radius, maxHeight);
          life[i] = 0;
          vel[i] = 0.3 + Math.random() * 0.4;
        }
      } else {
        pos.array[i * 3 + 1] = -10;
      }
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_BUBBLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={MAX_BUBBLES}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#aaddff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function resetBubble(arr, index, radius, maxHeight) {
  const r = Math.random() * radius * 0.8;
  const theta = Math.random() * Math.PI * 2;
  arr[index * 3] = Math.cos(theta) * r;
  arr[index * 3 + 1] = -0.6 + Math.random() * 0.1;
  arr[index * 3 + 2] = Math.sin(theta) * r;
}
