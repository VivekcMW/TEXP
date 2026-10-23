import { RoundedBox } from "@react-three/drei";
import type { Point } from "./motion";

export function Block({ size, position, color, radius = 0.05, rotation, emissive, opacity }: {
  size: Point; position?: Point; color: string; radius?: number;
  rotation?: Point; emissive?: string; opacity?: number;
}) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={2} position={position} rotation={rotation} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.72} emissive={emissive ?? "#000000"}
        emissiveIntensity={0.4} transparent={opacity !== undefined} opacity={opacity ?? 1} />
    </RoundedBox>
  );
}

export function Plant({ position, scale = 1 }: { position: Point; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, .24, 0]} castShadow><cylinderGeometry args={[.23, .17, .45, 12]} /><meshStandardMaterial color="#dbd5c3" /></mesh>
      <mesh position={[0, .46, 0]}><cylinderGeometry args={[.18, .18, .02, 12]} /><meshStandardMaterial color="#526448" /></mesh>
      {[-.7, 0, .7].map((angle, index) => <mesh key={angle} position={[Math.sin(angle) * .16, .8 + (index === 1 ? .14 : 0), 0]}
        scale={[.17, .48, .1]} rotation={[.2, angle, -angle * .55]} castShadow>
        <sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={index === 1 ? "#48774f" : "#7a9b67"} />
      </mesh>)}
    </group>
  );
}

export function Chair({ position, rotation = 0 }: { position: Point; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <Block size={[.55, .12, .5]} position={[0, .53, 0]} color="#6d8c7c" />
    <Block size={[.57, .55, .12]} position={[0, .84, .25]} color="#86a48e" radius={.07} />
    <mesh position={[0, .3, 0]}><cylinderGeometry args={[.035, .035, .4, 8]} /><meshStandardMaterial color="#718b7b" /></mesh>
    <Block size={[.55, .05, .08]} position={[0, .12, 0]} color="#718b7b" radius={.015} />
    <Block size={[.08, .05, .5]} position={[0, .12, 0]} color="#718b7b" radius={.015} />
  </group>;
}

export function Workstation({ active, human, color }: { active: boolean; human: boolean; color: string }) {
  return <group>
    <Block size={[2.2, .025, 1.55]} position={[0, .17, .25]} color={active ? human ? "#f1dfb9" : "#cfebd5" : "#e0e8dc"} radius={.16} />
    <Block size={[1.95, .14, .8]} position={[0, 1.07, 0]} color="#ebd9b8" radius={.06} />
    {[-.73, .73].map((x) => <Block key={x} size={[.13, .88, .65]} position={[x, .59, 0]} color="#adbbb0" radius={.025} />)}
    <Block size={[.36, .04, .25]} position={[0, 1.17, -.14]} color="#8a9f90" radius={.015} />
    <Block size={[.045, .18, .05]} position={[0, 1.27, -.24]} color="#718b7b" radius={.01} />
    <Block size={[.9, .55, .06]} position={[0, 1.55, -.23]} color="#234d3d" radius={.035} />
    <Block size={[.8, .45, .01]} position={[0, 1.55, -.194]} color={active ? "#74ba99" : "#517d6c"} emissive={active ? "#68aa80" : undefined} radius={.02} />
    {[0, 1, 2].map((line) => <Block key={line} size={[.48 - line * .1, .025, .009]}
      position={[-.07, 1.66 - line * .09, -.185]} color="#d2e7d7" radius={.003} />)}
    <Block size={[.54, .025, .2]} position={[0, 1.16, .2]} color="#bbcbb9" radius={.01} />
    <Block size={[.13, .035, .19]} position={[.4, 1.17, .21]} color="#fbfcf0" radius={.025} />
    <mesh position={[.76, 1.25, -.2]} castShadow><cylinderGeometry args={[.07, .07, .16, 10]} /><meshStandardMaterial color={color} /></mesh>
    <Block size={[.27, .035, .35]} position={[-.7, 1.17, .05]} color={human ? "#be975f" : "#d9e7d0"} radius={.012} />
    <Chair position={[.72, 0, .98]} rotation={-.4} />
  </group>;
}

function Sofa({ position, rotation = 0 }: { position: Point; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <Block size={[1.9, .38, .7]} position={[0, .4, 0]} color="#65927b" radius={.12} />
    <Block size={[1.9, .6, .18]} position={[0, .8, -.32]} color="#82a58b" radius={.09} />
    {[-.85, .85].map((x) => <Block key={x} size={[.18, .43, .77]} position={[x, .65, 0]} color="#82a58b" radius={.08} />)}
    <Block size={[.42, .4, .16]} position={[-.44, .78, -.12]} rotation={[.15, 0, .15]} color="#e4d4af" radius={.08} />
  </group>;
}

export function Room() {
  return <group>
    <Block size={[12, .32, 8.5]} position={[0, -.02, 0]} color="#9ebaa6" radius={.2} />
    <Block size={[11.9, .13, 8.4]} position={[0, .12, 0]} color="#f0eee2" radius={.17} />
    {Array.from({ length: 13 }, (_, i) => <Block key={i} size={[.012, .006, 8.05]} position={[-5.55 + i * .925, .189, 0]} color="#dedfcd" radius={.002} />)}
    <Block size={[11.7, .5, .14]} position={[0, .43, -4]} color="#d0ded0" />
    <Block size={[.14, .5, 8]} position={[-5.8, .43, 0]} color="#d0ded0" />
    <Block size={[11.7, 1.65, .04]} position={[0, 1.5, -4]} color="#a9cbbb" opacity={.3} radius={.01} />
    <Block size={[.04, 1.65, 5.8]} position={[-5.8, 1.5, -1]} color="#b9d3c4" opacity={.28} radius={.01} />
    {[-5.8, -2.9, 0, 2.9, 5.8].map((x) => <Block key={x} size={[.045, 2.15, .06]} position={[x, 1.25, -4]} color="#8caa98" radius={.01} />)}
    <Block size={[11.7, .06, .06]} position={[0, 2.33, -4]} color="#8caa98" radius={.015} />
    <Block size={[.06, .06, 5.8]} position={[-5.8, 2.33, -1]} color="#8caa98" radius={.015} />
    <Plant position={[-5.3, .18, -3.5]} scale={1.25} />
    <Plant position={[5.3, .18, -3.5]} scale={1.25} />
    <Plant position={[-5.3, .18, 3.55]} scale={.8} />
    <Plant position={[5.3, .18, 3.55]} scale={.8} />
    <Block size={[2.9, .02, 2.35]} position={[0, .2, 2.7]} color="#d8cdb3" radius={.2} />
    <Sofa position={[0, .05, 3.6]} rotation={Math.PI} />
    <Block size={[1.2, .1, .55]} position={[0, .58, 2.4]} color="#f9f6e8" radius={.13} />
    <Block size={[.55, .35, .3]} position={[0, .34, 2.4]} color="#bcbda8" />
    <Block size={[.28, .04, .32]} position={[-.2, .66, 2.4]} rotation={[0, .2, 0]} color="#729c7b" radius={.01} />
    <Plant position={[.28, .65, 2.4]} scale={.25} />
    <group position={[-5.5, .2, -.9]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[1.5, 1.1, .5]} position={[0, .55, 0]} color="#c6ac86" />
      <Block size={[1.55, .08, .55]} position={[0, 1.13, 0]} color="#eee9d7" />
      <Block size={[.45, .55, .4]} position={[-.3, 1.44, 0]} color="#395749" />
      <Block size={[.27, .22, .02]} position={[-.3, 1.43, .215]} color="#9bbb9f" />
      <mesh position={[.35, 1.28, 0]}><cylinderGeometry args={[.09, .07, .23, 10]} /><meshStandardMaterial color="#eee9d7" /></mesh>
    </group>
    <group position={[5.5, .2, -.9]} rotation={[0, -Math.PI / 2, 0]}>
      <Block size={[1.6, 1.7, .4]} position={[0, .85, 0]} color="#c6b38e" />
      {[.45, 1.1, 1.7].map((y) => <Block key={y} size={[1.65, .065, .5]} position={[0, y, .04]} color="#eadfc7" />)}
      {Array.from({ length: 6 }, (_, i) => <Block key={i} size={[.12, .38 + i % 2 * .09, .26]}
        position={[-.58 + i * .2, .68, .06]} color={["#6f9583", "#e4c381", "#b3c4b2"][i % 3]} radius={.012} />)}
      <Plant position={[.38, 1.14, .03]} scale={.5} />
    </group>
    <group position={[0, 1.5, -3.92]}>
      <Block size={[2.25, .9, .045]} color="#f6f7ed" radius={.04} />
      {[-.7, -.25, .2, .65].map((x, i) => <Block key={x} size={[.3, .2, .018]} position={[x, .2 - i % 2 * .38, .035]}
        color={i % 2 ? "#c9b889" : "#97bda1"} radius={.015} />)}
    </group>
  </group>;
}
