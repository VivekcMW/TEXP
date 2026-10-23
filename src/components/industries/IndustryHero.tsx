"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SceneBoundary } from "@/components/scenes/SceneBoundary";
import { useSceneAllowed } from "@/components/scenes/useSceneAllowed";
import { useSceneActivity } from "@/components/scenes/useSceneActivity";
import type { IndustryExperience } from "./experiences";
import styles from "./industry.module.css";

const IndustryScene = dynamic(() => import("./IndustryScene"), { ssr: false });

export function IndustryHero({ industries }: { industries: IndustryExperience[] }) {
  const [selected, setSelected] = useState(0);
  const [spot, setSpot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [angle, setAngle] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const pause = useCallback(() => setPlaying(false), []);
  const { reducedMotion, hydrated, started, setStarted, active } = useSceneActivity(stage, pause);
  const allowed = useSceneAllowed();
  const id = useId();
  const industry = industries[selected];
  if (!industry) throw new Error("An industry hero requires at least one mapped industry.");
  const { scene } = industry;
  const overview = industries.length > 1;
  const renderScene = hydrated && !reducedMotion && started && (allowed || requested) && !unavailable;
  const running = active && playing;
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false); }, []);

  useEffect(() => {
    if (!renderScene || ready) return;
    const timer = window.setTimeout(() => {
      console.warn("Industry scene did not become ready; showing its static preview.");
      onUnavailable();
    }, 20_000);
    return () => window.clearTimeout(timer);
  }, [renderScene, ready, onUnavailable]);

  function select(index: number) {
    setSelected(index);
    setSpot(0);
    setAngle(0);
    setStarted(true);
  }

  return <section className={styles.hero} aria-label="Industry experience" data-industry={industry.slug}>
    <div className={`container-x ${styles.copy}`}>
      <p className={styles.eyebrow}>{overview ? industry.title : "AI for your industry"}</p>
      <h1 className="font-display">{overview ? "AI built around your industry." : industry.title}</h1>
      <p className={styles.summary}>{industry.summary}</p>
      <Link href={overview ? `/industries/${industry.slug}` : "#industry-workflows"} className="btn btn-primary">
        {overview ? `Explore ${scene.label}` : "Explore the workflows"} <span aria-hidden="true">&#8599;</span>
      </Link>
    </div>
    <div ref={stage} className={styles.visual} role="region" aria-label={`${industry.title} environment`}
      aria-busy={!hydrated || (renderScene && !ready)} data-scene={scene.id} data-playing={running} data-angle={angle} data-focus={spot}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/posters/industry-${scene.id}.svg`} alt={scene.alt} width="1000" height="600" fetchPriority="high"
        className={`${styles.poster} ${renderScene && ready ? styles.hidden : ""}`} />
      {renderScene && <div className={styles.canvas} aria-hidden="true">
        <SceneBoundary name={`${industry.title} environment`} onUnavailable={onUnavailable}>
          <IndustryScene scene={scene} running={running} angle={angle} spot={spot} onSelect={setSpot} onReady={onReady} onLost={onUnavailable} />
        </SceneBoundary>
      </div>}
      <p className={styles.environment}>{scene.environment}</p>
      {renderScene && !ready && <div className={styles.loading} role="status">
        <span className={styles.orbit} style={{ animationPlayState: running ? "running" : "paused" }} aria-hidden="true" />
        <p>Bringing your industry into view</p>
      </div>}
    </div>
    <div className={styles.controls} role="group" aria-label="Industry scene controls">
      {hydrated && !reducedMotion && !unavailable && <>
        {!allowed && !requested && <button type="button" onClick={() => { setRequested(true); setStarted(true); }}>Load 3D view</button>}
        {renderScene && ready && <>
          <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
          <button type="button" aria-label="Rotate industry left" disabled={angle <= -.6} onClick={() => setAngle((a) => Math.max(-.6, a - .3))}>&#8630;</button>
          <button type="button" aria-label="Reset industry view" onClick={() => setAngle(0)}>&#8962;</button>
          <button type="button" aria-label="Rotate industry right" disabled={angle >= .6} onClick={() => setAngle((a) => Math.min(.6, a + .3))}>&#8631;</button>
        </>}
      </>}
      {unavailable && <p role="status">The 3D view is unavailable. Explore this industry using the preview and workflow controls.</p>}
    </div>
    {overview && <div className={`container-x ${styles.pickerWrap}`}>
      <div className={styles.picker} role="group" aria-label="Choose an industry">
        {industries.map((item, index) => <button type="button" key={item.slug} aria-pressed={index === selected}
          disabled={!hydrated} onClick={() => select(index)}>{item.scene.label}</button>)}
      </div>
      <label className={styles.mobilePicker}>Choose an industry
        <select value={selected} disabled={!hydrated} onChange={(event) => select(Number(event.target.value))}>
          {industries.map((item, index) => <option key={item.slug} value={index}>{item.title}</option>)}
        </select>
      </label>
    </div>}
    <div className={`container-x ${styles.workflows}`}>
      <p className={styles.eyebrow}>Choose an area to explore</p>
      <div className={styles.spots} role="group" aria-label="Industry workflow areas">
        {scene.spots.map((item, index) => <button type="button" key={item.title} aria-pressed={index === spot}
          aria-controls={`${id}-workflow`} onClick={() => setSpot(index)}>
          <span aria-hidden="true" style={{ background: scene.color }} />{item.title}
        </button>)}
      </div>
      <div id={`${id}-workflow`} className={styles.workflowDetail} role="status" aria-live="polite" aria-atomic="true">
        <h2 className="font-display">{scene.spots[spot].title}</h2>
        <p>{scene.spots[spot].detail}</p>
      </div>
      <p className={styles.boundary}>{scene.boundary}</p>
    </div>
  </section>;
}
