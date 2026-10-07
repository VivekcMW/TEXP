"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";
import type { SceneProps } from "./registry";
import { ACCENT, ACCENT_LIGHT, MUTED } from "./seed";

const R = 1.9;
const ease = (x: number) => x * x * (3 - 2 * x);
function Loop() {
  const item = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    const t = (clock.elapsedTime * 0.12) % 1;
    const stage = Math.floor(t * 4), local = (t * 4) % 1;
    const a = ((stage + ease(local)) / 4) * Math.PI * 2;
    if (item.current) item.current.position.set(Math.cos(a) * R, Math.sin(a) * R, 0.15);
    if (ring.current) { ring.current.rotation.x = -0.9 + pointer.y * 0.15; ring.current.rotation.z = pointer.x * 0.1; }
  });
  return (
    <group ref={ring} rotation={[-0.9, 0, 0]}>
      <mesh><torusGeometry args={[R, 0.03, 8, 96]} /><meshStandardMaterial color={MUTED} /></mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.5, 0.34, 0.05]} />
            <meshStandardMaterial color={i === 3 ? ACCENT : "#ffffff"} />
          </mesh>
        );
      })}
      <mesh ref={item}><sphereGeometry args={[0.09, 12, 12]} /><meshBasicMaterial color={ACCENT_LIGHT} /></mesh>
    </group>
  );
}
export default function AutomationLoopScene(props: SceneProps) {
  return <SceneFrame {...props} camera={{ position: [0, 0, 6], fov: 42 }}><Loop /></SceneFrame>;
}
