"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Block } from "@/components/office/OfficeFurniture";
import type { WorkbenchKind } from "./showcase";

function Parcel({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <Block size={[.6, .48, .55]} position={[0, .24, 0]} color="#c9a77b" radius={.025} />
    <Block size={[.12, .008, .56]} position={[0, .485, 0]} color="#eedbb5" radius={.002} />
    <Block size={[.3, .2, .015]} position={[0, .27, -.285]} color="#fff8e8" radius={.008} />
    {[0, 1, 2].map((i) => <Block key={i} size={[.025, .12, .005]}
      position={[-.08 + i * .065, .27, -.296]} color="#668273" radius={.001} />)}
  </group>;
}

export function AgentWorkspace({ kind, color, running, reviewing, complete }: {
  kind: WorkbenchKind; color: string; running: boolean; reviewing: boolean; complete: boolean;
}) {
  const moving = useRef<Group>(null);
  const time = useRef(running ? 0 : 2);
  useFrame((_, delta) => {
    if (running && !reviewing && !complete) time.current += Math.min(delta, .05);
    if (!moving.current) return;
    const t = time.current;
    switch (kind) {
      case "claims": moving.current.position.y = .9 + Math.sin(t * 2) * .2; break;
      case "returns": moving.current.position.z = -.52 + (t % 4) / 4 * 1.04; break;
      case "billing": moving.current.scale.y = .95 + Math.sin(t * 2) * .05; break;
      case "healthcare": moving.current.position.y = 1.05 + Math.sin(t * 2) * .04; break;
      case "maintenance": moving.current.rotation.z = t * .55; break;
      case "outage": moving.current.scale.setScalar(1 + Math.sin(t * 3) * .12); break;
      case "permits": moving.current.position.y = .62 + Math.max(0, Math.sin(t * 2)) * .22; break;
    }
  });

  return <group position={[-1.8, .1, -.3]} name={`workspace-${kind}`}>
    {kind === "claims" && <>
      <Block size={[1.35, .12, 1.4]} color="#a9bda9" position={[0, .12, 0]} />
      <Parcel position={[-.28, .19, -.27]} /><Parcel position={[.3, .19, .38]} scale={.85} />
      <Parcel position={[-.28, .67, -.27]} scale={.65} />
      {[-.55, .55].map((x) => <Block key={x} size={[.07, 1.6, .09]} position={[x, .95, .55]} color={color} radius={.015} />)}
      <Block size={[1.17, .16, .15]} position={[0, 1.72, .55]} color={color} radius={.025} />
      <Block size={[.35, .09, .03]} position={[0, 1.72, .46]} color="#dff4d9" radius={.012} />
      <group ref={moving}>
        <Block size={[1.03, .035, 1.18]} color={color} opacity={.25} radius={.005} />
        <Block size={[1.04, .035, .025]} position={[0, 0, -.59]} color="#d6f2c7" radius={.003} />
      </group>
    </>}
    {kind === "returns" && <>
      <Block size={[1.05, .16, 1.75]} position={[0, .5, 0]} color={color} radius={.035} />
      {[-.38, .38].map((x) => <Block key={x} size={[.08, .45, 1.35]} position={[x, .23, 0]} color="#9fb39d" radius={.012} />)}
      {[-.68, -.45, -.22, .01, .24, .47, .7].map((z) => <mesh key={z} position={[0, .6, z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[.065, .065, .95, 12]} /><meshStandardMaterial color="#ccd4bc" />
      </mesh>)}
      <group ref={moving} position={[0, .65, 0]}><Parcel position={[0, 0, 0]} scale={.85} /></group>
      <group position={[.3, .75, .87]}>
        <Block size={[.72, .48, .38]} color={color} />
        <Block size={[.48, .04, .02]} position={[0, .04, -.2]} color="#304f40" radius={.006} />
        <Block size={[.37, .4, .012]} position={[0, -.14, -.23]} color="#fcf9eb" radius={.008} />
        {[0, 1, 2].map((i) => <Block key={i} size={[.025, .17, .008]} position={[-.09 + i * .085, -.16, -.242]} color={color} radius={.001} />)}
      </group>
    </>}
    {kind === "billing" && <>
      <Block size={[1.35, .08, 1.25]} color="#b7cad1" />
      <Block size={[.1, .7, .1]} position={[0, .4, .3]} color="#7e9ba2" />
      <group position={[0, 1.15, .28]}>
        <Block size={[1.35, 1.13, .13]} color={color} radius={.05} />
        <Block size={[1.19, .97, .02]} position={[0, 0, -.08]} color="#f7f7ea" radius={.025} />
        <group ref={moving}>
          {[.28, .53, .39].map((height, i) => <Block key={i} size={[.19, height, .03]}
            position={[-.37 + i * .35, -.1 + height / 2, -.105]} color={color} radius={.015} />)}
        </group>
        {[0, 1].map((i) => <Block key={i} size={[.84 - i * .2, .03, .02]}
          position={[-.04, -.25 - i * .11, -.105]} color="#a8bec5" radius={.003} />)}
      </group>
      {[0, 1, 2].map((i) => <mesh key={i} position={[.4, .1 + i * .065, -.38]}>
        <cylinderGeometry args={[.22, .22, .05, 24]} /><meshStandardMaterial color="#d6b971" />
      </mesh>)}
    </>}
    {kind === "healthcare" && <>
      <Block size={[1.3, .08, 1.25]} color="#c3d1df" />
      <group ref={moving} position={[0, 1.05, .22]} rotation={[.12, .12, 0]}>
        <Block size={[1.02, 1.55, .12]} color={color} radius={.05} />
        <Block size={[.86, 1.37, .025]} position={[0, 0, -.08]} color="#faf9ed" radius={.025} />
        <Block size={[.42, .18, .05]} position={[0, .76, -.03]} color="#a5b9c9" />
        <Block size={[.5, .13, .02]} position={[0, .32, -.105]} color={color} radius={.015} />
        <Block size={[.13, .5, .02]} position={[0, .32, -.105]} color={color} radius={.015} />
        {[0, 1, 2].map((i) => <Block key={i} size={[.6 - i * .1, .035, .02]}
          position={[-.04, -.17 - i * .16, -.105]} color="#acbdc8" radius={.003} />)}
      </group>
      <Block size={[.54, .58, .45]} position={[.45, .34, -.4]} color="#e4e9db" />
      <Block size={[.3, .08, .02]} position={[.45, .4, -.635]} color={color} radius={.008} />
      <Block size={[.08, .3, .02]} position={[.45, .4, -.635]} color={color} radius={.008} />
    </>}
    {kind === "maintenance" && <>
      <Block size={[1.4, .18, 1.3]} position={[0, .45, 0]} color="#8a9e8e" />
      {[-.5, .5].map((x) => <Block key={x} size={[.1, .4, 1.03]} position={[x, .2, 0]} color="#6d8777" />)}
      <Block size={[.8, .65, .16]} position={[0, .9, .38]} color="#c0c9b3" />
      <group ref={moving} position={[0, 1.13, -.04]}>
        <mesh><torusGeometry args={[.37, .12, 10, 32]} /><meshStandardMaterial color={color} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <group key={i} rotation={[0, 0, i * Math.PI / 5]}>
          <Block size={[.18, .24, .2]} position={[0, .45, 0]} color={color} radius={.02} />
        </group>)}
      </group>
      <group position={[.45, .67, -.4]} rotation={[0, .3, -.5]}>
        <Block size={[.08, .48, .08]} color="#d2b378" radius={.015} />
        {[-.1, .1].map((x) => <Block key={x} size={[.08, .16, .08]} position={[x, .28, 0]} color="#d2b378" radius={.012} />)}
        <Block size={[.28, .08, .08]} position={[0, .19, 0]} color="#d2b378" radius={.012} />
      </group>
    </>}
    {kind === "outage" && <>
      <Block size={[1.45, .1, 1.5]} color={color} />
      <Block size={[1.15, .012, .025]} position={[0, .061, -.22]} color="#e3eed8" radius={.002} />
      <Block size={[.025, .012, 1.2]} position={[.26, .061, 0]} color="#e3eed8" radius={.002} />
      {[-.45, .4].map((x, i) => <group key={x} position={[x, 0, i ? .48 : -.4]}>
        <Block size={[.07, 1.45, .07]} position={[0, .76, 0]} color="#6d8578" radius={.012} />
        <Block size={[.55, .07, .07]} position={[0, 1.27, 0]} color="#91ab95" radius={.012} />
        {[-.22, .22].map((offset) => <mesh key={offset} position={[offset, 1.35, 0]}>
          <sphereGeometry args={[.07, 12, 8]} /><meshStandardMaterial color="#e1c37c" />
        </mesh>)}
      </group>)}
      <group ref={moving} position={[.26, .1, -.22]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.23, .025, 8, 32]} /><meshStandardMaterial color="#ecd391" /></mesh>
        <mesh><sphereGeometry args={[.085, 12, 8]} /><meshStandardMaterial color="#ecd391" /></mesh>
      </group>
    </>}
    {kind === "permits" && <>
      <Block size={[1.5, .08, 1.4]} color="#adc9c6" />
      {[-.5, 0, .5].map((x) => <Block key={x} size={[.015, .008, 1.2]} position={[x, .046, 0]} color="#e5eee0" radius={.001} />)}
      {[-.4, .1, .5].map((z) => <Block key={z} size={[1.3, .008, .015]} position={[0, .046, z]} color="#e5eee0" radius={.001} />)}
      {[-.32, .29].map((x, i) => <group key={x} position={[x, 0, .22]}>
        <Block size={[.5, i ? .76 : 1.16, .55]} position={[0, i ? .44 : .64, 0]} color={i ? color : "#d7c6a7"} radius={.018} />
        {[.34, .62].map((y) => <Block key={y} size={[.27, .14, .02]} position={[0, y, -.285]} color="#f5f4e7" radius={.008} />)}
      </group>)}
      <Block size={[.65, .02, .42]} position={[.25, .08, -.45]} color="#f9f8ec" radius={.005} />
      <group ref={moving} position={[.25, .62, -.45]}>
        <Block size={[.36, .1, .28]} color="#587967" radius={.02} />
        <Block size={[.08, .3, .08]} position={[0, .17, 0]} color={color} />
        <Block size={[.3, .12, .16]} position={[0, .35, 0]} color={color} radius={.035} />
      </group>
    </>}
  </group>;
}
