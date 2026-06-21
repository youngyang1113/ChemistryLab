import { useRef } from "react";
import * as THREE from "three";

export default function LabBench() {
  const benchRef = useRef();

  return (
    <group ref={benchRef}>
      {/* 实验台面 */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 2.5]} />
        <meshStandardMaterial
          color="#8b7355"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* 实验台前腿 */}
      <mesh position={[-1.7, -0.45, 1]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#6b5b45" roughness={0.7} />
      </mesh>
      <mesh position={[1.7, -0.45, 1]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#6b5b45" roughness={0.7} />
      </mesh>

      {/* 实验台后腿 */}
      <mesh position={[-1.7, -0.45, -1]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#6b5b45" roughness={0.7} />
      </mesh>
      <mesh position={[1.7, -0.45, -1]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#6b5b45" roughness={0.7} />
      </mesh>

      {/* 实验台前沿挡板 */}
      <mesh position={[0, -0.2, 1.15]}>
        <boxGeometry args={[3.6, 0.5, 0.05]} />
        <meshStandardMaterial color="#7a6b55" roughness={0.7} />
      </mesh>

      {/* 地面 */}
      <mesh position={[0, -0.95, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.9} />
      </mesh>

      {/* 背景墙 */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#f5f0eb" roughness={0.95} />
      </mesh>
    </group>
  );
}
