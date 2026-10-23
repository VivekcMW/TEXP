"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useSceneAllowed } from "@/components/scenes/useSceneAllowed";
import { SceneBoundary } from "@/components/scenes/SceneBoundary";
import { initialOfficeState, officeReducer, officeWorkflows, stations, workflowFor, workflowSteps, type StationId } from "./workflows";
import styles from "./office.module.css";

const OfficeScene = dynamic(() => import("./OfficeScene"), { ssr: false });
const RoleDetails = dynamic(() => import("./RoleDetails"));
const OfficeArrival = dynamic(() => import("./OfficeArrival"));

export function AgentOffice() {
  const [state, dispatch] = useReducer(officeReducer, initialOfficeState);
  const [selected, setSelected] = useState<StationId | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [started, setStarted] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [requested, setRequested] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hydrated = reducedMotion !== null;
  const allowed = useSceneAllowed();
  const workflow = workflowFor(state.workflowId);
  const active = workflowSteps(workflow, state.exception)[state.step];
  const reviewing = active === "review";
  const running = state.playing && started && inView && pageVisible && !reducedMotion;
  const canRender = started && (allowed || requested) && !reducedMotion && !unavailable;
  const activity = reviewing && state.exception ? workflow.exception : workflow.activities[active];
  const onReady = useCallback(() => setSceneReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setSceneReady(false); }, []);
  const selectStation = useCallback((id: StationId | null) => {
    setSelected((current) => current === id ? null : id);
    if (id) setExpanded(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) dispatch({ type: "pause" });
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    const events = ["pointerdown", "pointermove", "keydown", "touchstart"] as const;
    const start = () => {
      setStarted(true);
      events.forEach((event) => window.removeEventListener(event, start));
    };
    events.forEach((event) => window.addEventListener(event, start, { once: true, passive: true }));
    const timer = window.setTimeout(start, 1800);
    return () => { window.clearTimeout(timer); events.forEach((event) => window.removeEventListener(event, start)); };
  }, []);

  useEffect(() => {
    if (!running || (canRender && !sceneReady)) return;
    const timer = window.setInterval(() => dispatch({ type: "tick", ms: 100 }), 100);
    return () => window.clearInterval(timer);
  }, [running, canRender, sceneReady]);

  const restart = () => { setStarted(true); dispatch({ type: "replay", autoPlay: !reducedMotion }); };

  return (
    <div ref={root} id="agent-office" className={styles.office} role="region" aria-label="Interactive AI operations office"
      aria-busy={!hydrated} onKeyDown={(event) => { if (event.key === "Escape") setSelected(null); }}>
      <div className={styles.scene}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/posters/agent-office.svg" alt="Isometric AI office with agent desks, a collaboration hub and human oversight."
          width="760" height="480" fetchPriority="high" className={`${styles.poster} ${sceneReady && canRender ? styles.posterHidden : ""}`} />
        {canRender && <div className={styles.canvas}>
          <SceneBoundary name="Office" onUnavailable={onUnavailable}>
            <OfficeScene active={active} selected={selected} running={running} complete={state.complete} showControls={expanded}
              exception={state.exception} onSelect={selectStation} onReady={onReady} onLost={onUnavailable} />
          </SceneBoundary>
        </div>}
        {(allowed || requested) && !reducedMotion && !unavailable && <OfficeArrival ready={sceneReady} playing={inView && pageVisible && state.playing} />}
      </div>
      <div className={styles.demoBar}>
        <span>AI office</span>
        {!reducedMotion && <button type="button" disabled={!hydrated} className={styles.playButton}
          onClick={() => { setStarted(true); dispatch({ type: state.playing ? "pause" : "play" }); }}>
          {state.playing ? "Pause" : "Play"}
        </button>}
      </div>
      <details className={styles.explorer} open={expanded} onToggle={(event) => {
        setExpanded(event.currentTarget.open);
        if (!event.currentTarget.open) setSelected(null);
      }}>
        <summary>Explore the workflow</summary>
        <div className={styles.workflowPicker} role="group" aria-label="Choose an office workflow">
          {officeWorkflows.map((item) => (
            <button key={item.id} type="button" disabled={!hydrated} aria-pressed={state.workflowId === item.id}
              onClick={() => { setSelected(null); setStarted(true); dispatch({ type: "workflow", id: item.id, autoPlay: !reducedMotion }); }}>
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.request}>
          <span className={styles.miniLabel}>Incoming request</span><p>{workflow.request}</p>
        </div>
      {selected && <RoleDetails id={selected} onClose={() => setSelected(null)} />}
      <div className={styles.activity} data-waiting={reviewing}>
        <span className={styles.activityIcon} aria-hidden>{reviewing && state.exception ? "!" : state.complete ? "\u2713" : "\u2197"}</span>
        <div className={styles.activityText} role="status" aria-live="polite" aria-atomic="true">
          <p>{state.complete ? state.exception ? "Safely handed to your team." : "Workflow complete." : activity.title}</p>
          <span>{state.complete && !state.exception ? workflow.result : activity.evidence}</span>
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.playback}>
          {hydrated && !allowed && !requested && !reducedMotion && !unavailable && <button type="button"
            onClick={() => { setRequested(true); setStarted(true); }}>Load 3D office</button>}
          {(reducedMotion || !state.playing) && !state.complete && <button type="button" disabled={!hydrated}
            onClick={() => dispatch({ type: "next" })}>Next scene <span aria-hidden>&rarr;</span></button>}
          <button type="button" disabled={!hydrated} onClick={restart} aria-label="Replay office workflow" className={styles.replay}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M4 10a8 8 0 1 1 1 8M4 3v7h7" /></svg>
          </button>
          <select aria-label="Meet the team" value={selected ?? ""} disabled={!hydrated} onChange={(event) => {
            const station = stations.find((item) => item.id === event.target.value);
            setSelected(station?.id ?? null);
          }}>
            <option value="">Meet the team</option>
            {stations.map((station) => <option key={station.id} value={station.id}>{station.name}</option>)}
          </select>
        </div>
        <button type="button" disabled={!hydrated} className={styles.exception} aria-pressed={state.exception}
          onClick={() => { setStarted(true); dispatch({ type: "exception", enabled: !state.exception, autoPlay: !reducedMotion }); }}>
          <span className={styles.toggle} aria-hidden><span /></span>Show an exception
        </button>
      </div>
      </details>
      {unavailable && <p className={styles.sceneNotice} role="status">3D view unavailable. Workflow controls still work.</p>}
    </div>
  );
}
