"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import type { SceneProps } from "./registry";
export function SceneFrame({ children, onReady, onLost, camera = { position: [0, 0, 6], fov: 45 } }: SceneProps & { children: React.ReactNode; camera?: { position: [number, number, number]; fov: number } }) {
  useEffect(() => { onReady?.(); }, [onReady]);
  return (
    <Canvas dpr={[1, 1.5]} camera={camera} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => { gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); onLost?.(); }); }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      {children}
    </Canvas>
  );
}
