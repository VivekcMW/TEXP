"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";
import type { SceneProps } from "./registry";
import { mulberry32, ACCENT, MUTED } from "./seed";

const LAYERS = 4, GAP = 0.9;
function Stack() {
  const group = useRef<THREE.Group>(null);
  const connectors = useMemo(() => {
    const rnd = mulberry32(5);
    return Array.from({ length: 12 }, () => ({ x: (rnd() - 0.5) * 3.2, z: (rnd() - 0.5) * 1.8, from: Math.floor(rnd() * (LAYERS - 1)) }));
  }, []);
  useFrame(({ pointer }) => {
    if (group.current) { group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.5 + pointer.x * 0.3, 0.05); group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.35 + pointer.y * -0.15, 0.05); }
  });
  return (
    <group ref={group} rotation={[0.35, 0.5, 0]} position={[0, -0.2, 0]}>
      {Array.from({ length: LAYERS }, (_, i) => (
        <mesh key={i} position={[0, (i - (LAYERS - 1) / 2) * GAP, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 2.4]} />
          <meshStandardMaterial color={i === 2 ? ACCENT : "#ffffff"} transparent opacity={i === 2 ? 0.55 : 0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {connectors.map((c, i) => (
        <mesh key={i} position={[c.x, (c.from - (LAYERS - 1) / 2) * GAP + GAP / 2, c.z]}>
          <cylinderGeometry args={[0.012, 0.012, GAP, 6]} />
          <meshBasicMaterial color={MUTED} />
        </mesh>
      ))}
    </group>
  );
}
export default function EnterpriseStackScene(props: SceneProps) {
  return <SceneFrame {...props} camera={{ position: [0, 0, 6.5], fov: 40 }}><Stack /></SceneFrame>;
}
