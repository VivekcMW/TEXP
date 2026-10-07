"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";
import type { SceneProps } from "./registry";
import { mulberry32, ACCENT, ACCENT_LIGHT, MUTED } from "./seed";

const COUNT = 46;
function Field() {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const nodes = useMemo(() => {
    const rnd = mulberry32(7);
    return Array.from({ length: COUNT }, () => new THREE.Vector3((rnd() - 0.5) * 5, (rnd() - 0.5) * 5, (rnd() - 0.5) * 3));
  }, []);
  const { edges, pairs } = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) if (nodes[i].distanceTo(nodes[j]) < 1.6) pairs.push([i, j]);
    const pos = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], k) => { nodes[a].toArray(pos, k * 6); nodes[b].toArray(pos, k * 6 + 3); });
    return { edges: pos, pairs };
  }, [nodes]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) { group.current.rotation.y = t * 0.08 + pointer.x * 0.3; group.current.rotation.x = pointer.y * -0.2; }
    if (pulse.current && pairs.length) {
      const prog = (t * 0.35) % pairs.length;
      const [a, b] = pairs[Math.floor(prog)];
      pulse.current.position.lerpVectors(nodes[a], nodes[b], prog % 1);
    }
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 7 === 0 ? 0.09 : 0.05, 12, 12]} />
          <meshStandardMaterial color={i % 7 === 0 ? ACCENT : MUTED} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry>
        <lineBasicMaterial color={MUTED} transparent opacity={0.35} />
      </lineSegments>
      <mesh ref={pulse}><sphereGeometry args={[0.07, 10, 10]} /><meshBasicMaterial color={ACCENT_LIGHT} /></mesh>
    </group>
  );
}
export default function AgenticFieldScene(props: SceneProps) {
  return <SceneFrame {...props}><Field /></SceneFrame>;
}
