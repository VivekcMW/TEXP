"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";
import type { SceneProps } from "./registry";
import { mulberry32, ACCENT, ACCENT_LIGHT, MUTED } from "./seed";

const COLS = 6, ROWS = 10, COUNT = COLS * ROWS;
function Pipeline() {
  const meshes = useRef<THREE.InstancedMesh>(null);
  const ray = useRef<THREE.Mesh>(null);
  const { from, to } = useMemo(() => {
    const rnd = mulberry32(11);
    const from: THREE.Vector3[] = [], to: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      from.push(new THREE.Vector3(-3 + (rnd() - 0.5) * 0.6, (i / COUNT - 0.5) * 3.2, (rnd() - 0.5) * 0.2));
      to.push(new THREE.Vector3(0.6 + (i % COLS) * 0.45, (Math.floor(i / COLS) - ROWS / 2) * 0.36, 0));
    }
    return { from, to };
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const k = THREE.MathUtils.smoothstep(0.15 + scroll * 0.85 + 0.15 * Math.sin(t * 0.4), 0, 1);
    const m = meshes.current; if (!m) return;
    const q = ((t * 0.5) % 1) * ROWS;
    for (let i = 0; i < COUNT; i++) {
      dummy.position.lerpVectors(from[i], to[i], k);
      dummy.rotation.set(0, 0, (1 - k) * (i % 3) * 0.4);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      const near = Math.abs(Math.floor(i / COLS) - q) < 1 && k > 0.8;
      m.setColorAt(i, color.set(near ? ACCENT_LIGHT : i % 9 === 0 ? ACCENT : MUTED));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (ray.current) { ray.current.position.set(1.7, (q - ROWS / 2) * 0.36, 0.3); ray.current.visible = k > 0.8; }
  });
  return (
    <group position={[0.4, 0, 0]}>
      <instancedMesh ref={meshes} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[0.3, 0.22, 0.06]} />
        <meshStandardMaterial />
      </instancedMesh>
      <mesh ref={ray} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 3.2, 6]} /><meshBasicMaterial color={ACCENT_LIGHT} /></mesh>
    </group>
  );
}
export default function RagPipelineScene(props: SceneProps) {
  return <SceneFrame {...props} camera={{ position: [0, 0, 6.5], fov: 40 }}><Pipeline /></SceneFrame>;
}
