"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, OrthographicCamera } from "three";
import { Block, Plant } from "@/components/office/OfficeFurniture";
import type { Point } from "@/components/office/motion";
import type { IndustrySceneDefinition } from "./experiences";

type Props = {
  scene: IndustrySceneDefinition;
  running: boolean;
  angle: number;
  spot: number;
  onSelect: (index: number) => void;
  onReady: () => void;
  onLost: () => void;
};
type MovingParts = { belt: RefObject<Group | null>; rotor: RefObject<Group | null>; vehicle: RefObject<Group | null> };

function Solid({ size, at = [0, 0, 0], color = "#e1e8df", rotation }: { size: Point; at?: Point; color?: string; rotation?: Point }) {
  return <Block size={size} position={at} color={color} rotation={rotation} radius={Math.min(.05, ...size.map((v) => v / 4))} />;
}
function Cylinder({ at, radius, height, color, rotation }: { at: Point; radius: number; height: number; color: string; rotation?: Point }) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow>
    <cylinderGeometry args={[radius, radius, height, 16]} /><meshStandardMaterial color={color} roughness={.65} />
  </mesh>;
}
function Parcel({ at = [0, 0, 0], scale = 1 }: { at?: Point; scale?: number }) {
  return <group position={at} scale={scale}>
    <Solid size={[.6, .48, .5]} at={[0, .24, 0]} color="#c8a574" />
    <Solid size={[.1, .014, .51]} at={[0, .488, 0]} color="#f1e4c8" />
    <Solid size={[.2, .14, .014]} at={[.08, .25, .26]} color="#faf6e9" />
  </group>;
}
function Screen({ at, color }: { at: Point; color: string }) {
  return <group position={at}>
    <Solid size={[.15, .35, .15]} at={[0, -.25, 0]} color="#69877d" />
    <Solid size={[.9, .6, .09]} color="#294d45" />
    <Solid size={[.77, .47, .015]} at={[0, 0, .053]} color={color} />
    {[0, 1, 2].map((i) => <Solid key={i} size={[.52 - i * .09, .025, .008]} at={[-.05, .12 - i * .11, .066]} color="#e0efe7" />)}
  </group>;
}
function Counter({ at, color }: { at: Point; color: string }) {
  return <group position={at}>
    <Solid size={[1.7, .9, .85]} at={[0, .45, 0]} color={color} />
    <Solid size={[1.85, .12, .98]} at={[0, .97, 0]} color="#f3eddf" />
    <Screen at={[.2, 1.43, -.05]} color={color} />
    <Solid size={[.45, .04, .26]} at={[.15, 1.06, .23]} color="#c2d1c4" />
  </group>;
}
function Conveyor({ belt, color }: { belt: RefObject<Group | null>; color: string }) {
  return <group>
    <Solid size={[3.8, .16, 1.08]} at={[0, .63, 0]} color={color} />
    {[-1.6, 1.6].map((x) => <Solid key={x} size={[.1, .6, .83]} at={[x, .3, 0]} color="#7f968e" />)}
    {Array.from({ length: 12 }, (_, i) => <Cylinder key={i} at={[-1.65 + i * .3, .76, 0]} radius={.065} height={.93} color="#b5c5b7" rotation={[Math.PI / 2, 0, 0]} />)}
    <group ref={belt}>{[0, 1, 2].map((i) => <group key={i} position={[-1.2 + i, .82, 0]}><Parcel scale={.75} /></group>)}</group>
  </group>;
}
function Truck({ vehicle, color }: { vehicle: RefObject<Group | null>; color: string }) {
  return <group ref={vehicle} position={[3, 0, 1.3]}>
    <Solid size={[1.65, .18, 1]} at={[0, .4, 0]} color="#60796c" />
    <Solid size={[1.14, .98, 1]} at={[-.27, .98, 0]} color="#faf4e7" />
    <Solid size={[.65, .65, .95]} at={[.65, .83, 0]} color={color} />
    <Solid size={[.36, .25, .02]} at={[.64, .99, .49]} color="#c0dcde" />
    <Solid size={[.05, .2, .6]} at={[.99, 1, 0]} color="#c0dcde" />
    {[-.6, .65].flatMap((x) => [-.52, .52].map((z) => <Cylinder key={`${x}-${z}`} at={[x, .3, z]} radius={.24} height={.13} color="#3c5149" rotation={[Math.PI / 2, 0, 0]} />))}
  </group>;
}
function Logistics({ motion, color }: { motion: MovingParts; color: string }) {
  return <group>
    <group position={[-2.7, 0, -1.4]}>
      {[-1.1, 1.1].map((x) => <Solid key={x} size={[.09, 2.7, 1.05]} at={[x, 1.35, 0]} color={color} />)}
      {[.25, 1.2, 2.15].map((y) => <group key={y}>
        <Solid size={[2.4, .1, 1.15]} at={[0, y, 0]} color="#839e91" />
        {[-.7, 0, .7].map((x) => <Parcel key={x} at={[x, y + .06, 0]} scale={.95} />)}
      </group>)}
    </group>
    <group position={[.25, 0, -.35]} rotation={[0, Math.PI / 2, 0]}><Conveyor belt={motion.belt} color={color} /></group>
    <Truck vehicle={motion.vehicle} color={color} />
    <Counter at={[3, 0, -1.65]} color="#9eafa0" />
    <Solid size={[4.4, .02, 1.45]} at={[2.4, .02, 1.3]} color="#e2e6dd" />
    {[-.5, .7, 1.9, 3.1, 4.3].map((x) => <Solid key={x} size={[.45, .008, .045]} at={[x, .04, 2.05]} color={color} />)}
  </group>;
}
function Healthcare({ color }: { color: string }) {
  return <group>
    <Counter at={[-2.8, 0, .2]} color={color} />
    <Solid size={[3.1, 2.2, .12]} at={[-2.3, 1.1, -1.75]} color="#e0eeee" />
    <Solid size={[.8, .22, .05]} at={[-2.3, 1.6, -1.66]} color={color} />
    <Solid size={[.22, .8, .05]} at={[-2.3, 1.6, -1.66]} color={color} />
    <group position={[.1, 0, .1]}>
      <Solid size={[1.25, .5, 2.1]} at={[0, .4, 0]} color="#c4d5d1" />
      <Solid size={[1.3, .17, 2.15]} at={[0, .74, 0]} color="#fff8ed" />
      <Solid size={[1.16, .09, 1.15]} at={[0, .86, .37]} color="#b4d4d8" />
      <Solid size={[.82, .13, .47]} at={[0, .9, -.65]} color="#fffaf0" />
      <Cylinder at={[.91, 1.05, -.68]} radius={.025} height={2.1} color="#829f99" />
      <Solid size={[.27, .42, .15]} at={[.91, 1.74, -.65]} color="#d4e7df" />
    </group>
    <group position={[2.9, 1.16, -.7]}>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[.82, .26, 12, 32]} /><meshStandardMaterial color="#d9e7df" /></mesh>
      <Solid size={[1.1, .23, 1.2]} at={[0, -1.04, 0]} color={color} />
      <Solid size={[1.9, .18, .63]} at={[-.25, -.36, 0]} color="#f9f7e9" />
    </group>
    <Screen at={[1.8, 1.85, -1.7]} color={color} />
  </group>;
}
function Retail({ color }: { color: string }) {
  return <group>
    <group position={[-1.5, 0, -1.6]}>
      <Solid size={[4.2, 2.2, .15]} at={[0, 1.1, 0]} color="#eaded0" />
      <Solid size={[4.5, .18, 1.4]} at={[0, 2.5, .3]} color="#fbf5e5" />
      {Array.from({ length: 9 }, (_, i) => <Solid key={i} size={[.27, .19, 1.42]} at={[-2 + i * .5, 2.51, .3]} color={color} />)}
      {[.5, 1.2].map((y) => <group key={y}>
        <Solid size={[3.8, .08, .6]} at={[0, y, .3]} color="#a78b70" />
        {[-1.4, -.7, 0, .7, 1.4].map((x, index) => <Solid key={x} size={[.38, .43, .34]} at={[x, y + .26, .3]} color={["#96b7a2", "#ebc787", "#dba895"][index % 3]} />)}
      </group>)}
    </group>
    <Counter at={[2.7, 0, .3]} color={color} />
    <group position={[-.7, 0, .7]}>
      <Solid size={[1.3, .12, 1.1]} at={[0, .9, 0]} color="#bfa787" />
      <Solid size={[.75, .8, .65]} at={[0, .45, 0]} color="#eee6d7" />
      <Parcel at={[.15, .97, 0]} scale={.85} />
    </group>
    <group position={[3.6, .3, 1.25]}>
      <Solid size={[.55, .7, .38]} at={[0, .35, 0]} color="#d1ad83" />
      <mesh position={[0, .75, 0]}><torusGeometry args={[.13, .025, 8, 20]} /><meshStandardMaterial color="#9e805c" /></mesh>
    </group>
  </group>;
}
function Manufacturing({ motion, color }: { motion: MovingParts; color: string }) {
  return <group>
    <Solid size={[2, 2.2, 1.55]} at={[-2.9, 1.1, -1]} color="#9fb0b2" />
    <Solid size={[1.5, 1.3, .07]} at={[-2.9, 1.2, -.2]} color="#314f4c" />
    <Solid size={[1.13, .96, .08]} at={[-2.9, 1.2, -.15]} color="#80a9a4" />
    <Screen at={[-1.9, 1.8, .1]} color={color} />
    <group position={[0, 0, .7]}><Conveyor belt={motion.belt} color={color} /></group>
    <group position={[.1, 0, -1.3]}>
      <Cylinder at={[0, .2, 0]} radius={.5} height={.4} color="#b1bfb5" />
      <group ref={motion.rotor} position={[0, .45, 0]}>
        <Solid size={[.35, .95, .35]} at={[0, .4, 0]} color="#d2ab6e" rotation={[0, 0, -.3]} />
        <Cylinder at={[.2, .94, 0]} radius={.22} height={.42} color={color} rotation={[Math.PI / 2, 0, 0]} />
        <Solid size={[1.3, .23, .28]} at={[.78, .96, 0]} color="#d2ab6e" />
        <Solid size={[.18, .48, .2]} at={[1.35, .67, 0]} color="#708981" />
      </group>
    </group>
    <Counter at={[3, 0, -.4]} color={color} />
    {[-1, 0, 1].map((i) => <Solid key={i} size={[.4, .014, .08]} at={[i, .03, 1.63]} color="#b8a164" rotation={[0, .5, 0]} />)}
  </group>;
}
function Energy({ motion, color }: { motion: MovingParts; color: string }) {
  return <group>
    <group position={[-2.9, 0, -.8]}>
      <Cylinder at={[0, .16, 0]} radius={.65} height={.32} color="#c8d3bd" />
      <Cylinder at={[0, 1.65, 0]} radius={.095} height={3.2} color="#cbd9ce" />
      <group position={[0, 3.3, .1]}>
        <Cylinder at={[0, 0, 0]} radius={.17} height={.44} color={color} rotation={[Math.PI / 2, 0, 0]} />
        <group ref={motion.rotor} position={[0, 0, .24]}>
          {[0, 1, 2].map((i) => <group key={i} rotation={[0, 0, i * Math.PI * 2 / 3]}>
            <Solid size={[.16, 1.2, .06]} at={[0, .74, 0]} color="#f3f5e9" rotation={[0, 0, -.12]} />
          </group>)}
        </group>
      </group>
    </group>
    {[-.5, .8].map((x) => <group key={x} position={[x, 0, .2]}>
      <Solid size={[.08, .65, .08]} at={[0, .32, 0]} color="#8fa69d" />
      <Solid size={[.55, .08, .65]} at={[0, .04, 0]} color="#bacbbb" />
      <group position={[0, .7, 0]} rotation={[-.38, 0, 0]}>
        <Solid size={[1.1, .07, 1.8]} color="#426c7b" />
        {[-.37, 0, .37].map((z) => <Solid key={z} size={[1.04, .012, .012]} at={[0, .043, z * 1.5]} color="#a1bfc1" />)}
        <Solid size={[.02, .012, 1.76]} at={[0, .044, 0]} color="#a1bfc1" />
      </group>
    </group>)}
    <group position={[3, 0, -.75]}>
      <Solid size={[1.9, .18, 1.8]} at={[0, .09, 0]} color="#c8d4bf" />
      <Solid size={[1.3, 1.15, 1.2]} at={[0, .78, 0]} color="#9eb2a0" />
      {[-.42, 0, .42].map((x) => <group key={x}>
        <Cylinder at={[x, 1.5, 0]} radius={.1} height={.5} color="#7d8d75" />
        <Solid size={[.08, 1.85, .08]} at={[x, 1.12, -.75]} color={color} />
      </group>)}
      <Solid size={[1.7, .08, .08]} at={[0, 2, -.75]} color={color} />
    </group>
  </group>;
}
function Telecoms({ color }: { color: string }) {
  return <group>
    <group position={[-3, 0, -.75]}>
      {[-.32, .32].map((x) => <Solid key={x} size={[.07, 3.35, .07]} at={[x, 1.7, 0]} color="#9bada5" rotation={[0, 0, x * .1]} />)}
      {[.6, 1.4, 2.2].map((y) => <Solid key={y} size={[.72, .05, .05]} at={[0, y, 0]} color="#80968d" rotation={[0, 0, .35]} />)}
      {[-.48, .48].map((x) => <Solid key={x} size={[.25, .85, .2]} at={[x, 2.9, 0]} color="#deded2" />)}
      {[.65, 1.02].map((r) => <mesh key={r} position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, .012, 6, 48]} /><meshStandardMaterial color={color} transparent opacity={.45} />
      </mesh>)}
    </group>
    {[-.85, .35].map((x) => <group key={x} position={[x, 0, -.8]}>
      <Solid size={[.88, 2.3, 1]} at={[0, 1.15, 0]} color="#3c5a55" />
      {[.35, .75, 1.15, 1.55, 1.95].map((y) => <group key={y}>
        <Solid size={[.73, .29, .025]} at={[0, y, .515]} color="#8da8a0" />
        <Solid size={[.09, .05, .014]} at={[-.23, y, .54]} color="#b9e0b2" />
        <Solid size={[.3, .025, .014]} at={[.12, y, .54]} color="#536f64" />
      </group>)}
    </group>)}
    <Counter at={[2.9, 0, .5]} color={color} />
    <Screen at={[2.9, 2.2, -1.4]} color={color} />
  </group>;
}
function Civic({ color }: { color: string }) {
  return <group>
    <group position={[-2.1, 0, -.8]}>
      <Solid size={[3.4, .2, 2.2]} at={[0, .1, .1]} color="#d0c6af" />
      <Solid size={[3.15, 1.8, 1.2]} at={[0, 1.08, -.2]} color="#e0d8c4" />
      {[-1.2, -.4, .4, 1.2].map((x) => <Cylinder key={x} at={[x, 1.05, .72]} radius={.12} height={1.7} color="#f9f3df" />)}
      <Solid size={[3.55, .2, 2]} at={[0, 1.97, .15]} color={color} />
      <mesh position={[0, 2.29, .15]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.05, .55, 4]} /><meshStandardMaterial color="#b4a284" />
      </mesh>
      <Solid size={[.52, .9, .05]} at={[0, .65, .43]} color="#78988b" />
      <Solid size={[2.6, .12, .6]} at={[0, .06, 1.43]} color="#e1d9c7" />
    </group>
    <group position={[.5, 0, 1]}>
      <Solid size={[.95, 1.25, .8]} at={[0, .62, 0]} color="#b5c6b3" />
      {[.3, .65, 1].map((y) => <group key={y}>
        <Solid size={[.85, .27, .04]} at={[0, y, .42]} color="#dce3cd" />
        <Solid size={[.23, .04, .04]} at={[0, y, .45]} color={color} />
      </group>)}
    </group>
    <Counter at={[3, 0, -.1]} color={color} />
    <Plant position={[3.7, 0, -1.85]} scale={1.3} />
  </group>;
}

function World(props: Props) {
  const { scene, onLost } = props;
  const world = useRef<Group>(null);
  const belt = useRef<Group>(null);
  const rotor = useRef<Group>(null);
  const vehicle = useRef<Group>(null);
  const robot = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const time = useRef(0);
  const firstFrame = useRef(true);
  const { camera, size, invalidate, gl } = useThree();
  const motion = { belt, rotor, vehicle };
  const color = scene.color;

  useLayoutEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(size.width / 13.4, size.height / 9.5);
      camera.lookAt(0, 1.35, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      console.warn("Industry scene WebGL context lost; showing its static preview.");
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);

  useFrame((_, delta) => {
    if (firstFrame.current) { firstFrame.current = false; props.onReady(); }
    if (props.running) time.current += Math.min(delta, .05);
    const t = time.current;
    if (world.current) world.current.rotation.y = props.angle;
    if (belt.current) belt.current.children.forEach((child, i) => { child.position.x = ((t * .45 + i * 1.1) % 3.3) - 1.65; });
    if (rotor.current) {
      if (scene.id === "energy-utilities") rotor.current.rotation.z = -t * .65;
      else rotor.current.rotation.y = Math.sin(t * .6) * .65;
    }
    if (vehicle.current) vehicle.current.position.x = 2.6 + Math.sin(t * .45) * .5;
    if (robot.current) {
      robot.current.position.set(Math.sin(t * .35) * 3.2, .15 + Math.abs(Math.sin(t * 4)) * .025, 2.25);
      robot.current.rotation.y = Math.cos(t * .35) > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(t * 4) * .3;
    if (rightLeg.current) rightLeg.current.rotation.x = -Math.sin(t * 4) * .3;
  });

  return <group ref={world}>
    <Solid size={[10.5, .18, 6.1]} at={[0, -.12, 0]} color="#dce6d7" />
    <Solid size={[10.45, .04, 6.05]} at={[0, -.01, 0]} color="#f1f0e5" />
    {[-4, -2, 0, 2, 4].map((x) => <Solid key={x} size={[.009, .004, 5.8]} at={[x, .013, 0]} color="#dde1d4" />)}
    <Plant position={[-4.55, 0, -2.35]} scale={1.1} />
    <Plant position={[4.55, 0, 2.05]} scale={.75} />
    {scene.id === "logistics" && <Logistics motion={motion} color={color} />}
    {scene.id === "healthcare" && <Healthcare color={color} />}
    {scene.id === "retail" && <Retail color={color} />}
    {scene.id === "manufacturing" && <Manufacturing motion={motion} color={color} />}
    {scene.id === "energy-utilities" && <Energy motion={motion} color={color} />}
    {scene.id === "telecommunications" && <Telecoms color={color} />}
    {scene.id === "public-sector" && <Civic color={color} />}
    {scene.spots.map((spot, index) => <group key={spot.title} position={spot.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={(event) => { event.stopPropagation(); props.onSelect(index); }}>
        <torusGeometry args={[.62, props.spot === index ? .025 : .012, 6, 40]} />
        <meshStandardMaterial color={color} transparent opacity={props.spot === index ? .9 : .25} />
      </mesh>
      <mesh position={[0, 2.8, 0]} onClick={(event) => { event.stopPropagation(); props.onSelect(index); }}>
        <sphereGeometry args={[props.spot === index ? .12 : .075, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={props.spot === index ? .35 : 0} />
      </mesh>
    </group>)}
    <group ref={robot} scale={.75}>
      <Solid size={[.52, .53, .36]} at={[0, .88, 0]} color="#f5f3e5" />
      <Solid size={[.6, .42, .44]} at={[0, 1.39, 0]} color="#f5f3e5" />
      <Solid size={[.47, .19, .035]} at={[0, 1.4, .24]} color="#34594e" />
      {[-.12, .12].map((x) => <Solid key={x} size={[.055, .055, .015]} at={[x, 1.4, .263]} color="#b9dfb6" />)}
      <Solid size={[.16, .32, .18]} at={[-.37, .9, .04]} color={color} />
      <Solid size={[.16, .32, .18]} at={[.37, .9, .04]} color={color} />
      <Solid size={[.41, .32, .06]} at={[0, .84, .28]} color={color} />
      {[leftLeg, rightLeg].map((ref, index) => <group ref={ref} key={index} position={[index ? .16 : -.16, .63, 0]}>
        <Solid size={[.15, .42, .17]} at={[0, -.19, 0]} color="#bbcabc" />
        <Solid size={[.2, .1, .28]} at={[0, -.43, .045]} color="#76968c" />
      </group>)}
    </group>
  </group>;
}

export default function IndustryScene(props: Props) {
  return <Canvas orthographic camera={{ position: [9, 8, 11], zoom: 60, near: .1, far: 60 }} dpr={[1, 1.5]}
    shadows="percentage" frameloop={props.running ? "always" : "demand"}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} style={{ touchAction: "pan-y" }}>
    <ambientLight intensity={1.3} />
    <hemisphereLight args={["#fff9ed", "#a4bba7", 1.2]} />
    <directionalLight position={[-4, 9, 5]} intensity={2} castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.04} />
    <World key={props.scene.id} {...props} />
  </Canvas>;
}
