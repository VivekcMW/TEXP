"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useSceneAllowed } from "@/components/scenes/useSceneAllowed";
import { SceneBoundary } from "@/components/scenes/SceneBoundary";
import { useSceneActivity } from "@/components/scenes/useSceneActivity";
import { DEMO_STEP_MS, isHumanReview, type ShowcaseAgent } from "./showcase";
import styles from "./showroom.module.css";

const WorkbenchScene = dynamic(() => import("./WorkbenchScene"), { ssr: false });
const AgentDetails = dynamic(() => import("./AgentDetails"));

export function AgentShowroom({ agents, children }: { agents: ShowcaseAgent[]; children: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [angle, setAngle] = useState(0);
  const [replay, setReplay] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const pause = useCallback(() => setPlaying(false), []);
  const { reducedMotion, started, setStarted, hydrated, active: sceneActive } = useSceneActivity(stage, pause);
  const allowed = useSceneAllowed();
  const agent = agents[selected];
  const complete = step === agent.steps.length;
  const active = agent.steps[step];
  const reviewing = isHumanReview(active);
  const endsAtReview = isHumanReview(agent.steps.at(-1));
  const running = sceneActive && playing;
  const renderScene = hydrated && !reducedMotion && started && (allowed || requested) && !unavailable;
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false); }, []);

  useEffect(() => {
    if (!renderScene || ready) return;
    const timer = window.setTimeout(() => {
      console.warn("Agent workbench did not become ready; showing the accessible preview.");
      onUnavailable();
    }, 20_000);
    return () => window.clearTimeout(timer);
  }, [renderScene, ready, onUnavailable]);

  useEffect(() => {
    if (!running || (renderScene && !ready)) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % (agent.steps.length + 1)), DEMO_STEP_MS);
    return () => window.clearInterval(timer);
  }, [running, renderScene, ready, agent, replay]);

  function select(index: number) {
    setSelected(index);
    setStep(0);
    setAngle(0);
    if (renderScene) setReady(false);
    setReplay((value) => value + 1);
    setStarted(true);
  }

  const status = complete
    ? endsAtReview ? "Ready for your team's decision." : "Example complete. Every action leaves a trail."
    : reviewing
      ? endsAtReview ? "Human decision required. The agent hands over." : "Simulated human approval."
      : active.label;

  return <>
    <section className={styles.hero} aria-label="Agent showroom">
      <div className="container-x">
        {children}
        <div id="agent-workbench" ref={stage} className={styles.workbench} role="region" aria-label="Interactive agent workbench" aria-busy={!hydrated || (renderScene && !ready)}
          data-agent={agent.slug} data-playing={running}>
          <div className={styles.stageHeading}>
            <span className={styles.eyebrow}>Meet your next specialist</span>
          </div>
          <div className={styles.stageGrid}>
            <div className={styles.specialist} key={agent.slug}>
              <p className={styles.industry}>{agent.industryName}</p>
              <p className={styles.agentName}>{agent.title}</p>
              <p className={styles.purpose}>{agent.presentation.purpose}</p>
              <a href="#agent-example" className={styles.textLink}>Explore this agent <span aria-hidden>&darr;</span></a>
              <p className={styles.unit}><span>One piece of work</span>{agent.unit}</p>
            </div>
            <div className={styles.visual} role="group" aria-label={`${agent.title} workspace`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/posters/agent-${agent.presentation.kind}.svg`} alt={agent.presentation.artwork}
                width="800" height="480" fetchPriority="high"
                className={`${styles.poster} ${renderScene && ready ? styles.hiddenPoster : ""}`} />
              {renderScene && <div className={styles.canvas} aria-hidden="true">
                <SceneBoundary name="Agent workbench" onUnavailable={onUnavailable}>
                  <WorkbenchScene kind={agent.presentation.kind} color={agent.presentation.color} running={running}
                    reviewing={reviewing || (complete && endsAtReview)} complete={complete && !endsAtReview}
                    step={step} angle={angle} replay={replay} onReady={onReady} onLost={onUnavailable} />
                </SceneBoundary>
              </div>}
              {renderScene && !ready && <div className={styles.loading} role="status">
                <span className={styles.loadingOrbit} style={{ animationPlayState: running ? "running" : "paused" }} aria-hidden />
                <p>Preparing your agent&apos;s workspace</p><span>Bringing the work into view</span>
              </div>}
              <div className={styles.sceneTag}><span aria-hidden />{reviewing || (complete && endsAtReview) ? "Your team has the final say" : "A little less busywork"}</div>
              {renderScene && ready && <div className={styles.cameraControls} role="group" aria-label="Workbench view">
                <button type="button" aria-label="Rotate workbench left" disabled={angle <= -.5} onClick={() => setAngle((a) => Math.max(-.5, a - .25))}>&#8630;</button>
                <button type="button" aria-label="Reset workbench view" onClick={() => setAngle(0)}>&#8962;</button>
                <button type="button" aria-label="Rotate workbench right" disabled={angle >= .5} onClick={() => setAngle((a) => Math.min(.5, a + .25))}>&#8631;</button>
              </div>}
            </div>
          </div>
          <div className={styles.agentPicker} role="group" aria-label="Choose a specialist">
            {agents.map((item, index) => <button key={item.slug} type="button" disabled={!hydrated}
              aria-pressed={index === selected} aria-label={item.title} onClick={() => select(index)}>
              <span style={{ background: item.presentation.color }} aria-hidden />{item.presentation.label}
            </button>)}
          </div>
          <label className={styles.mobilePicker}>Choose your specialist
            <select value={selected} disabled={!hydrated} onChange={(event) => select(Number(event.target.value))}>
              {agents.map((item, index) => <option value={index} key={item.slug}>{item.title}</option>)}
            </select>
          </label>
          <div className={styles.playback}>
            <p className="sr-only" role="status" aria-live={running ? "off" : "polite"} aria-atomic="true">{status}</p>
            <div className={styles.playbackButtons}>
              {hydrated && !reducedMotion && !allowed && !requested && !unavailable &&
                <button type="button" onClick={() => { setRequested(true); setStarted(true); }}>Load 3D view</button>}
              {!reducedMotion && <button type="button" disabled={!hydrated} onClick={() => { setPlaying((p) => !p); setStarted(true); }}>
                <span aria-hidden>{playing ? "\u2161" : "\u25b7"}</span>{playing ? "Pause" : "Play"}
              </button>}
              {(reducedMotion || !playing) && <button type="button" disabled={!hydrated || complete}
                onClick={() => setStep((current) => Math.min(current + 1, agent.steps.length))}>Next scene <span aria-hidden>&rarr;</span></button>}
              <button type="button" disabled={!hydrated} aria-label="Replay agent demonstration"
                onClick={() => { setStep(0); setReplay((value) => value + 1); setStarted(true); }}>Replay <span aria-hidden>&#8634;</span></button>
            </div>
          </div>
          {unavailable && <p className={styles.sceneNotice} role="status">The 3D view is unavailable. You can still explore every agent and workflow below.</p>}
        </div>
      </div>
    </section>
    <AgentDetails agent={agent} />
  </>;
}
