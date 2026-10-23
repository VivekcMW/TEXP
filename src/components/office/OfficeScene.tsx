"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Group, OrthographicCamera, MathUtils, Vector3 } from "three";
import { stations, type StationId } from "./workflows";
import { agentPose, deskPositions } from "./motion";
import { Block, Room, Workstation } from "./OfficeFurniture";
import styles from "./scene.module.css";

type OfficeSceneProps = {
  active: StationId; selected: StationId | null; running: boolean; complete: boolean; exception: boolean;
  onSelect: (id: StationId | null) => void; onReady: () => void; onLost: () => void;
};
const colors: Record<StationId, string> = {
  intake: "#549784", research: "#709cac", policy: "#8b9f61", review: "#c29252", execution: "#6f8eb5",
};
const ease = (value: number) => 1 - (1 - MathUtils.clamp(value, 0, 1)) ** 3;

function Agent({ id, index, time, active, selected, onSelect }: {
  id: StationId; index: number; time: RefObject<number>; active: boolean; selected: boolean;
  onSelect: OfficeSceneProps["onSelect"];
}) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const parcel = useRef<Group>(null);
  const lastTime = useRef(-1);
  const human = id === "review";
  const color = colors[id];

  useFrame(() => {
    const t = time.current;
    if (lastTime.current === t) return;
    lastTime.current = t;
    const seconds = t < 2.5 + index * 1.8 ? 12 : t - 2.5 - index * 1.8;
    const pose = agentPose(id, seconds);
    const gait = Math.sin(t * 10);
    if (root.current) {
      root.current.position.set(pose.x, .055, pose.z);
      const difference = Math.atan2(Math.sin(pose.heading - root.current.rotation.y), Math.cos(pose.heading - root.current.rotation.y));
      root.current.rotation.y += difference * .18;
      root.current.scale.setScalar(ease((t - .55 - index * .1) / .7));
    }
    if (body.current) body.current.position.y = pose.walking ? Math.abs(gait) * .055 : Math.sin(t * 2) * .012;
    if (head.current) head.current.rotation.x = pose.working ? .12 + Math.sin(t * 3) * .04 : -.03;
    if (leftLeg.current) leftLeg.current.rotation.x = pose.walking ? gait * .55 : 0;
    if (rightLeg.current) rightLeg.current.rotation.x = pose.walking ? -gait * .55 : 0;
    if (leftArm.current) leftArm.current.rotation.x = pose.carrying ? -.9 : pose.working ? -1.5 + Math.sin(t * 13) * .1 : -gait * (pose.walking ? .5 : .04);
    if (rightArm.current) rightArm.current.rotation.x = pose.carrying ? -.9 : pose.working ? -1.5 - Math.sin(t * 13) * .1 : gait * (pose.walking ? .5 : .04);
    if (parcel.current) parcel.current.visible = pose.carrying;
  });
  const choose = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(id); };
  return (
    <group ref={root} position={deskPositions[id]} onClick={choose}>
      {(selected || active) && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .14, 0]}>
        <ringGeometry args={[.35, .39, 32]} /><meshBasicMaterial color={human ? "#bc9552" : "#4c9b73"} transparent opacity={.8} />
      </mesh>}
      <group ref={body}>
        <Block size={[.43, .48, .33]} position={[0, .95, 0]} color={human ? color : "#e8eee3"} radius={.12} />
        {!human && <Block size={[.23, .13, .018]} position={[0, .99, .18]} color={color} radius={.035} />}
        <group ref={head} position={[0, 1.38, 0]}>
          {human ? <>
            <mesh castShadow><sphereGeometry args={[.22, 16, 12]} /><meshStandardMaterial color="#d4ad86" /></mesh>
            <mesh position={[0, .08, -.01]} rotation={[.2, 0, 0]} castShadow>
              <sphereGeometry args={[.23, 16, 10, 0, Math.PI * 2, 0, Math.PI * .57]} /><meshStandardMaterial color="#48463a" />
            </mesh>
          </> : <>
            <Block size={[.49, .38, .4]} color="#f5f6ec" radius={.13} />
            <Block size={[.35, .17, .025]} position={[0, 0, .2]} color="#294f41" radius={.05} />
            {[-.085, .085].map((x) => <mesh key={x} position={[x, .01, .219]}>
              <sphereGeometry args={[.024, 8, 8]} /><meshBasicMaterial color="#c2f7d6" />
            </mesh>)}
            <mesh position={[0, .26, 0]}><sphereGeometry args={[.046, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
          </>}
        </group>
        {[leftLeg, rightLeg].map((ref, side) => <group key={side} ref={ref} position={[side ? .13 : -.13, .69, 0]}>
          <Block size={[.15, .45, .16]} position={[0, -.22, 0]} color={human ? "#52685c" : "#a3b9aa"} radius={.045} />
          <Block size={[.2, .12, .3]} position={[0, -.5, .065]} color="#566f62" radius={.045} />
        </group>)}
        {[leftArm, rightArm].map((ref, side) => <group key={side} ref={ref} position={[side ? .3 : -.3, 1.1, 0]}>
          <Block size={[.14, .38, .14]} position={[0, -.17, 0]} color={human ? color : "#e8eee3"} radius={.055} />
          <mesh position={[0, -.38, 0]} castShadow><sphereGeometry args={[.084, 10, 8]} /><meshStandardMaterial color={human ? "#d4ad86" : "#b5ccba"} /></mesh>
        </group>)}
        <group ref={parcel} position={[0, .93, .44]}>
          <Block size={[.53, .33, .06]} color={active ? "#eac578" : "#f6f7e5"} radius={.025} />
          <Block size={[.3, .025, .01]} position={[-.025, .05, .037]} color={color} radius={.003} />
          <Block size={[.2, .025, .01]} position={[-.075, -.03, .037]} color={color} radius={.003} />
        </group>
      </group>
    </group>
  );
}

function Desk({ id, index, time, active, selected, onSelect }: {
  id: StationId; index: number; time: RefObject<number>; active: boolean; selected: boolean;
  onSelect: OfficeSceneProps["onSelect"];
}) {
  const root = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(() => {
    if (root.current) {
      const reveal = ease((time.current - index * .12) / 1.1);
      root.current.position.y = (1 - reveal) * -1.4;
      root.current.scale.setScalar(Math.max(.001, reveal));
    }
  });
  return <group ref={root} position={deskPositions[id]}
    onClick={(event) => { event.stopPropagation(); onSelect(id); }}
    onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
    <Workstation active={active || selected || hovered} human={id === "review"} color={colors[id]} />
  </group>;
}

function OfficeWorld(props: OfficeSceneProps & { angle: number; labels: RefObject<(HTMLButtonElement | null)[]> }) {
  const { onLost } = props;
  const world = useRef<Group>(null);
  const hub = useRef<Group>(null);
  const beacon = useRef<Group>(null);
  const time = useRef(0);
  const labelPosition = useRef(new Vector3());
  const frameReady = useRef(false);
  const { camera, size, gl, invalidate } = useThree();

  useLayoutEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.min(size.width / 15.5, size.height / 11);
      camera.lookAt(0, .6, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      console.warn("Office WebGL context lost; showing preview.");
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);

  useFrame(({ pointer }, delta) => {
    if (!frameReady.current) { frameReady.current = true; props.onReady(); }
    if (props.running) time.current += Math.min(delta, .05);
    else if (time.current < 2) time.current = 2;
    const opening = ease(time.current / 2.2);
    if (world.current) {
      world.current.position.y = (1 - opening) * -.65;
      world.current.rotation.y = props.angle + (1 - opening) * -.35 + (props.running ? pointer.x * .035 : 0);
      world.current.scale.setScalar(.9 + opening * .1);
      world.current.updateWorldMatrix(true, false);
      stations.forEach((station, index) => {
        const label = props.labels.current[index];
        if (!label || !world.current) return;
        const [x, , z] = deskPositions[station.id];
        const point = labelPosition.current.set(x, 2.12, z - .2);
        world.current.localToWorld(point).project(camera);
        label.style.left = `${(point.x + 1) * size.width / 2}px`;
        label.style.top = `${(1 - point.y) * size.height / 2}px`;
        label.style.visibility = time.current > 1 ? "visible" : "hidden";
      });
    }
    if (hub.current) hub.current.rotation.y = time.current * .35;
    if (beacon.current) {
      beacon.current.position.y = .62 + Math.sin(time.current * 2) * .06;
      beacon.current.rotation.y = time.current * .65;
    }
  });

  return <group ref={world}>
    <Room />
    <group position={[0, .23, .3]}>
      <mesh receiveShadow><cylinderGeometry args={[.63, .75, .22, 40]} /><meshStandardMaterial color="#a9cbb1" /></mesh>
      <mesh position={[0, .17, 0]}><cylinderGeometry args={[.58, .6, .12, 40]} /><meshStandardMaterial color="#f1f4e6" /></mesh>
      <group ref={hub} position={[0, .27, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.43, .018, 8, 40]} /><meshStandardMaterial color="#3a8d67" /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 3) * .43, 0, Math.sin(i * Math.PI * 2 / 3) * .43]}>
          <sphereGeometry args={[.04, 8, 8]} /><meshBasicMaterial color="#71b791" />
        </mesh>)}
      </group>
      <group ref={beacon}>
        <mesh><octahedronGeometry args={[.2]} /><meshStandardMaterial color={props.exception && props.active === "review" ? "#c79a54" : "#4d9c78"} metalness={.2} roughness={.3} /></mesh>
      </group>
    </group>
    {stations.map((station, index) => <group key={station.id}>
      <Desk id={station.id} index={index} time={time} active={props.active === station.id && !props.complete}
        selected={props.selected === station.id} onSelect={props.onSelect} />
      <Agent id={station.id} index={index} time={time} active={props.active === station.id && !props.complete}
        selected={props.selected === station.id} onSelect={props.onSelect} />
    </group>)}
  </group>;
}

export default function OfficeScene(props: OfficeSceneProps) {
  const [angle, setAngle] = useState(0);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  return <>
    <Canvas orthographic camera={{ position: [11, 13, 16], zoom: 50, near: .1, far: 100 }}
      dpr={[1, 1.5]} shadows="percentage" frameloop={props.running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} style={{ touchAction: "pan-y" }}
      onPointerMissed={() => props.onSelect(null)}>
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#fff9ed", "#a8c2aa", 1.3]} />
      <directionalLight position={[-3, 10, 6]} intensity={2.4} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10} shadow-normalBias={.04} />
      <OfficeWorld {...props} angle={angle} labels={labels} />
    </Canvas>
    <div className={styles.labels} role="group" aria-label="Office desks">
      {stations.map((station, index) => <button key={station.id} ref={(element) => { labels.current[index] = element; }}
        type="button" className={styles.deskLabel} data-active={props.active === station.id && !props.complete}
        data-selected={props.selected === station.id} aria-label={`Meet ${station.name}`} aria-pressed={props.selected === station.id}
        onClick={() => props.onSelect(station.id)}>
        <span style={{ background: colors[station.id] }} />{station.name}
      </button>)}
    </div>
    <div className={styles.viewControls} role="group" aria-label="Office view">
      <button type="button" aria-label="Rotate office left" onClick={() => setAngle((a) => Math.max(-.55, a - .18))} disabled={angle <= -.55}>&#8630;</button>
      <button type="button" aria-label="Reset office view" onClick={() => setAngle(0)}>&#8962;</button>
      <button type="button" aria-label="Rotate office right" onClick={() => setAngle((a) => Math.min(.55, a + .18))} disabled={angle >= .55}>&#8631;</button>
    </div>
  </>;
}
