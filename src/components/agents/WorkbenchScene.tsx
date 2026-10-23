"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, OrthographicCamera } from "three";
import { Block, Chair, Plant } from "@/components/office/OfficeFurniture";
import type { WorkbenchKind } from "./showcase";
import { AgentWorkspace } from "./AgentWorkspace";

type Props = {
  kind: WorkbenchKind;
  color: string;
  running: boolean;
  reviewing: boolean;
  complete: boolean;
  step: number;
  angle: number;
  replay: number;
  onReady: () => void;
  onLost: () => void;
};

function Paper({ color = "#719585" }: { color?: string }) {
  return <group>
    <Block size={[.42, .025, .56]} color="#faf8ed" radius={.012} />
    {[0, 1, 2].map((i) => <Block key={i} size={[.27 - i * .045, .005, .022]}
      position={[-.025, .017, -.13 + i * .1]} color={color} radius={.002} />)}
  </group>;
}

function World(props: Props) {
  const { onLost } = props;
  const world = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const packet = useRef<Group>(null);
  const halo = useRef<Group>(null);
  const time = useRef(props.running ? 0 : 2);
  const firstFrame = useRef(true);
  const { camera, size, gl, invalidate } = useThree();
  const color = props.reviewing ? "#bd9253" : props.color;

  useLayoutEffect(() => {
    invalidate();
  }, [props.angle, props.step, props.reviewing, props.complete, invalidate]);

  useLayoutEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(size.width / 6.8, size.height / 4.6);
      camera.lookAt(0, .7, .05);
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      console.warn("Agent workbench WebGL context lost; showing preview.");
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);

  useFrame((_, delta) => {
    if (firstFrame.current) { firstFrame.current = false; props.onReady(); }
    if (props.running) time.current += Math.min(delta, .05);
    const t = time.current;
    const arrival = 1 - Math.pow(1 - Math.min(t / 1.35, 1), 3);
    if (world.current) {
      world.current.scale.setScalar(.85 + arrival * .15);
      world.current.position.y = -.3 * (1 - arrival);
      world.current.rotation.y = props.angle + (1 - arrival) * .2;
    }
    if (head.current) {
      head.current.rotation.x = props.reviewing ? -.08 : .08 + Math.sin(t * 2.5) * .045;
      head.current.rotation.y = Math.sin(t * .8) * .12;
    }
    if (leftArm.current) leftArm.current.rotation.x = props.reviewing ? -.35 : -1.45 + Math.sin(t * 12) * .09;
    if (rightArm.current) rightArm.current.rotation.x = props.complete ? -2.1 : props.reviewing ? -.35 : -1.45 - Math.sin(t * 12) * .09;
    if (packet.current) {
      const progress = (t % 8) / 8;
      packet.current.position.set(-1.15 + progress * 2.3, 1.4 + Math.sin(progress * Math.PI) * .45, -.55);
      packet.current.rotation.set(.15, progress * .3, -.07);
      packet.current.visible = !props.reviewing && !props.complete;
    }
    if (halo.current) halo.current.rotation.y = t * .25;
  });

  return <group ref={world}>
    <Block size={[5.6, .18, 3.5]} position={[0, -.05, 0]} color="#dce6d8" radius={.07} />
    <Block size={[5.5, .04, 3.4]} position={[0, .06, 0]} color="#f0efe3" radius={.018} />
    {[-1.7, -.8, .1, 1, 1.9].map((x) => <Block key={x} size={[.009, .004, 3.15]} position={[x, .084, 0]} color="#dedfcc" radius={.001} />)}
    <Block size={[4.9, .24, .1]} position={[0, .2, 1.58]} color="#bccfbf" radius={.03} />
    <Block size={[3.4, 1.4, .035]} position={[-.65, 1.02, 1.58]} color="#acd0ba" opacity={.24} radius={.01} />
    {[-2.35, -.65, 1.05].map((x) => <Block key={x} size={[.03, 1.6, .04]} position={[x, .88, 1.6]} color="#a3bdab" radius={.004} />)}
    <Block size={[3.45, .03, .05]} position={[-.65, 1.7, 1.6]} color="#a3bdab" radius={.007} />
    <Plant position={[2.15, .08, 1.05]} scale={1.2} />
    <Plant position={[-2.2, .08, 1.05]} scale={.72} />
    <Block size={[2.55, .13, 1.03]} position={[0, 1.12, 0]} color="#e4d2af" radius={.07} />
    {[-1.02, 1.02].map((x) => <Block key={x} size={[.12, 1, .84]} position={[x, .55, 0]} color="#a6b7a9" radius={.025} />)}
    <Block size={[.36, .035, .25]} position={[.65, 1.21, -.16]} color="#8c9f90" radius={.012} />
    <Block size={[.05, .22, .05]} position={[.65, 1.31, -.24]} color="#839a8a" radius={.01} />
    <group position={[.65, 1.59, -.2]} rotation={[0, -.22, 0]}>
      <Block size={[.92, .58, .065]} color="#345c49" radius={.04} />
      <Block size={[.81, .47, .012]} position={[0, 0, .04]} color={color} radius={.025} />
      {[0, 1, 2].map((i) => <Block key={i} size={[.51 - i * .09, .03, .01]}
        position={[-.07, .13 - i * .1, .05]} color={i <= props.step % 3 ? "#e5f5da" : "#a9c8af"} radius={.004} />)}
      <Block size={[.12, .12, .012]} position={[0, 0, -.04]} color="#8bab93" radius={.035} />
    </group>
    <Block size={[.62, .03, .22]} position={[0, 1.205, .14]} color="#c0cfba" radius={.015} />
    {[0, 1, 2, 3, 4].map((i) => <Block key={i} size={[.008, .004, .17]} position={[-.22 + i * .11, 1.223, .14]} color="#98b29f" radius={.001} />)}
    <group position={[-.8, 1.215, -.14]} rotation={[0, -.2, 0]}><Paper color={color} /></group>
    <mesh position={[1.03, 1.3, .1]} castShadow><cylinderGeometry args={[.08, .065, .21, 12]} /><meshStandardMaterial color={color} /></mesh>
    <Chair position={[.9, .08, 1.04]} rotation={-.4} />
    <AgentWorkspace kind={props.kind} color={props.color} running={props.running}
      reviewing={props.reviewing} complete={props.complete} />
    <group position={[1.8, .1, -.5]}>
      <Block size={[.62, .67, .55]} position={[0, .34, 0]} color="#bcc9b3" />
      {[.15, .38, .61].map((y) => <Block key={y} size={[.12, .022, .02]} position={[0, y, -.285]} color="#6e8c77" radius={.003} />)}
      <group position={[0, .7, 0]}><Paper color={color} /></group>
    </group>
    <group position={[-.1, .08, .65]} rotation={[0, Math.PI, 0]}>
      <Block size={[.48, .49, .36]} position={[0, .96, 0]} color="#e7ece0" radius={.12} />
      <Block size={[.24, .12, .016]} position={[0, .99, .19]} color={color} radius={.025} />
      <group ref={head} position={[0, 1.46, 0]}>
        <Block size={[.57, .42, .44]} color="#f7f6e9" radius={.13} />
        <Block size={[.42, .18, .02]} position={[0, -.01, .226]} color="#264c3c" radius={.06} />
        {[-.1, .1].map((x) => <mesh key={x} position={[x, 0, .243]}>
          <sphereGeometry args={[.032, 12, 10]} /><meshBasicMaterial color="#cbf5d3" />
        </mesh>)}
        <mesh position={[0, .28, 0]}><sphereGeometry args={[.055, 10, 8]} /><meshStandardMaterial color={color} /></mesh>
      </group>
      {[-.14, .14].map((x) => <group key={x}>
        <Block size={[.17, .44, .18]} position={[x, .51, 0]} color="#aac0ab" radius={.045} />
        <Block size={[.22, .14, .3]} position={[x, .23, .055]} color="#6b8771" radius={.05} />
      </group>)}
      {[leftArm, rightArm].map((ref, i) => <group key={i} ref={ref} position={[i ? .32 : -.32, 1.11, 0]}>
        <Block size={[.15, .4, .15]} position={[0, -.18, 0]} color="#e7ece0" radius={.05} />
        <mesh position={[0, -.42, 0]} castShadow><sphereGeometry args={[.085, 12, 10]} /><meshStandardMaterial color="#afc7ac" /></mesh>
      </group>)}
    </group>
    <group ref={packet}><Paper color={color} /></group>
    <group ref={halo} position={[0, .105, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.45, .012, 6, 64]} /><meshStandardMaterial color={color} transparent opacity={.5} /></mesh>
      <mesh position={[1.45, .01, 0]}><sphereGeometry args={[.045, 10, 8]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  </group>;
}

export default function WorkbenchScene(props: Props) {
  return <Canvas orthographic camera={{ position: [-6, 5, -8], zoom: 70, near: .1, far: 50 }}
    dpr={[1, 1.5]} shadows="percentage" frameloop={props.running ? "always" : "demand"}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} style={{ touchAction: "pan-y" }}>
    <ambientLight intensity={1.2} />
    <hemisphereLight args={["#fff8e9", "#a5bda5", 1.2]} />
    <directionalLight position={[-3, 7, -5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={.035} />
    <World key={`${props.kind}-${props.replay}`} {...props} />
  </Canvas>;
}
