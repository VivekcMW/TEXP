"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSceneAllowed } from "./useSceneAllowed";
import { sceneMeta, type SceneId } from "./registry";
import { cn } from "@/lib/utils";

const loaders = {
  "agentic-field": dynamic(() => import("./AgenticFieldScene"), { ssr: false }),
  "rag-pipeline": dynamic(() => import("./RagPipelineScene"), { ssr: false }),
  "automation-loop": dynamic(() => import("./AutomationLoopScene"), { ssr: false }),
  "enterprise-stack": dynamic(() => import("./EnterpriseStackScene"), { ssr: false }),
} as const;

export function SceneSlot({ id, className = "rounded-3xl", priority = false }: { id: SceneId; className?: string; priority?: boolean }) {
  const allowed = useSceneAllowed();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [idle, setIdle] = useState(false);
  // Never compete with first paint or the load trace: mount on the first interaction
  // (pointer, scroll, touch, key) or 3.5 s after load, whichever comes first.
  useEffect(() => {
    let done = false;
    const events = ["pointermove", "pointerdown", "scroll", "touchstart", "keydown"] as const;
    const go = () => { if (done) return; done = true; setIdle(true); events.forEach((e) => window.removeEventListener(e, go)); };
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    const timer = setTimeout(go, 3500);
    return () => { clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, go)); };
  }, []);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "100% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => { setReady(false); setLost(true); }, []);
  const Scene = loaders[id];
  return (
    <div ref={ref} className={cn("relative h-full w-full overflow-hidden ", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/posters/${id}.svg`} alt={sceneMeta[id].alt} fetchPriority={priority ? "high" : undefined} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", ready && "opacity-0")} />
      {allowed && near && idle && !lost && <div className="absolute inset-0" aria-hidden><Scene onReady={onReady} onLost={onLost} /></div>}
    </div>
  );
}
