import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import LabBench from "./LabBench";
import Beaker3D from "./Beaker3D";
import Lighting from "./Lighting";

function SceneContent({ state }) {
  return (
    <>
      <Lighting />
      <LabBench />
      <Beaker3D state={state} />
      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={8}
        enablePan={false}
        target={[0, 0.8, 0]}
      />
    </>
  );
}

function WebGLCheck() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  return !!gl;
}

export default function Scene3D({ state }) {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!WebGLCheck()) {
      setSupported(false);
    }
  }, []);

  if (!supported) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm mb-2">您的浏览器不支持 WebGL</p>
          <p className="text-xs text-gray-400">请使用 Chrome 或 Firefox 浏览器</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <Canvas
        shadows
        camera={{ position: [0, 3, 5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "linear-gradient(180deg, #e8f0fe 0%, #f0f4f8 100%)" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f0f4f8");
        }}
      >
        <color attach="background" args={["#f0f4f8"]} />
        <fog attach="fog" args={["#f0f4f8", 8, 25]} />
        <SceneContent state={state} />
      </Canvas>
    </div>
  );
}
