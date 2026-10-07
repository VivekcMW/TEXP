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

export function SceneSlot({ id, className, priority = false }: { id: SceneId; className?: string; priority?: boolean }) {
  const allowed = useSceneAllowed();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [idle, setIdle] = useState(false);
  // Never compete with first paint: wait for the load event, then an idle slot.
  useEffect(() => {
    let cancelled = false;
    const go = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      if (ric) ric(() => { if (!cancelled) setIdle(true); }, { timeout: 2000 });
      else setTimeout(() => { if (!cancelled) setIdle(true); }, 800);
    };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
    return () => { cancelled = true; window.removeEventListener("load", go); };
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
    <div ref={ref} className={cn("relative h-full w-full overflow-hidden rounded-3xl", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/posters/${id}.svg`} alt={sceneMeta[id].alt} fetchPriority={priority ? "high" : undefined} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", ready && "opacity-0")} />
      {allowed && near && idle && !lost && <div className="absolute inset-0" aria-hidden><Scene onReady={onReady} onLost={onLost} /></div>}
    </div>
  );
}
