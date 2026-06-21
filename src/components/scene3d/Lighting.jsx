import { useRef } from "react";

export default function Lighting() {
  const dirLightRef = useRef();

  return (
    <>
      <ambientLight intensity={0.5} color="#e8f0fe" />

      <directionalLight
        ref={dirLightRef}
        position={[5, 8, 3]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />

      <pointLight position={[-3, 4, -2]} intensity={0.3} color="#a0c4ff" />
      <pointLight position={[2, 3, 4]} intensity={0.2} color="#ffd6a5" />

      <hemisphereLight
        skyColor="#87ceeb"
        groundColor="#362917"
        intensity={0.3}
      />
    </>
  );
}
