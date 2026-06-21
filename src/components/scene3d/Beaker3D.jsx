import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import LiquidBody from "./LiquidBody";
import BubbleParticles from "./BubbleParticles";
import PrecipitateParticles from "./PrecipitateParticles";
import SmokeParticles from "./SmokeParticles";
import HeatEffect from "./HeatEffect";
import SolidChunks3D from "./SolidChunks3D";

const GLASS_COLOR = "#e8f4f8";
const BEAKER_RADIUS = 0.4;
const BEAKER_HEIGHT = 1.2;
const BEAKER_THICKNESS = 0.02;

export default function Beaker3D({ state }) {
  const groupRef = useRef();

  const {
    beakerContents,
    liquidColor,
    liquidLevel,
    temperature,
    effect,
    precipitateColor,
    isReacting,
    shakeIntensity,
  } = state;

  const hasContents = beakerContents.length > 0;
  const normalizedLevel = Math.min(liquidLevel / 100, 0.85);
  const liquidHeight = normalizedLevel * BEAKER_HEIGHT;

  const showBubbles = effect === "gas" || effect === "smoke";
  const showPrecipitate = effect === "precipitate";
  const showSmoke = effect === "smoke";
  const showHeat = effect === "heat" || temperature > 60;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (shakeIntensity > 0 && isReacting) {
      const t = Date.now() * 0.01 * shakeIntensity;
      groupRef.current.position.x = Math.sin(t) * 0.01 * shakeIntensity;
      groupRef.current.position.z = Math.cos(t * 0.7) * 0.005 * shakeIntensity;
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        0,
        delta * 5
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0,
        delta * 5
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.55, 0]}>
      <BeakerGlass />

      {hasContents && normalizedLevel > 0 && (
        <LiquidBody
          height={liquidHeight}
          color={liquidColor}
          radius={BEAKER_RADIUS - BEAKER_THICKNESS}
          temperature={temperature}
          isReacting={isReacting}
          effect={effect}
        />
      )}

      {hasContents && (
        <SolidChunks3D
          contents={beakerContents}
          liquidHeight={liquidHeight}
        />
      )}

      {isReacting && showBubbles && (
        <BubbleParticles
          active={true}
          intensity={shakeIntensity || 1}
          radius={BEAKER_RADIUS - BEAKER_THICKNESS}
          maxHeight={liquidHeight}
        />
      )}

      {isReacting && showPrecipitate && (
        <PrecipitateParticles
          active={true}
          color={precipitateColor || "#f5f5f4"}
          radius={BEAKER_RADIUS - BEAKER_THICKNESS}
          liquidHeight={liquidHeight}
        />
      )}

      {isReacting && showSmoke && (
        <SmokeParticles
          active={true}
          radius={BEAKER_RADIUS}
          height={BEAKER_HEIGHT}
        />
      )}

      {showHeat && (
        <HeatEffect
          active={true}
          temperature={temperature}
          radius={BEAKER_RADIUS}
          height={liquidHeight}
        />
      )}
    </group>
  );
}

function BeakerGlass() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[BEAKER_RADIUS, BEAKER_RADIUS, BEAKER_HEIGHT, 32, 1, true]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, -BEAKER_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[BEAKER_RADIUS, BEAKER_RADIUS, 0.03, 32]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0}
          transmission={0.8}
          thickness={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, BEAKER_HEIGHT / 2, 0]}>
        <torusGeometry args={[BEAKER_RADIUS, 0.015, 8, 32]} />
        <meshPhysicalMaterial
          color="#d0e8f0"
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, BEAKER_HEIGHT / 2 + 0.02, BEAKER_RADIUS - 0.01]}>
        <boxGeometry args={[0.15, 0.04, 0.06]} />
        <meshPhysicalMaterial
          color="#d0e8f0"
          transparent
          opacity={0.25}
          roughness={0.1}
        />
      </mesh>

      {[0.2, 0.4, 0.6, 0.8].map((pct, i) => {
        const y = -BEAKER_HEIGHT / 2 + pct * BEAKER_HEIGHT;
        return (
          <mesh key={i} position={[BEAKER_RADIUS - 0.005, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.002, 0.06, 0.01]} />
            <meshBasicMaterial color="#a0c0d0" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
