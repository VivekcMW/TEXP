"use client";
import { useEffect, useState } from "react";
export type SceneEnv = { reducedMotion: boolean; webgl: boolean; deviceMemory?: number; saveData: boolean; effectiveType?: string };
export function evaluateSceneAllowed(env: SceneEnv): boolean {
  if (env.reducedMotion || !env.webgl || env.saveData) return false;
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return false;
  if (env.effectiveType && /(^|-)2g$|^3g$/.test(env.effectiveType)) return false;
  return true;
}
function readEnv(): SceneEnv {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  let webgl = false;
  try { const c = document.createElement("canvas"); webgl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { webgl = false; }
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl, deviceMemory: nav.deviceMemory, saveData: !!nav.connection?.saveData, effectiveType: nav.connection?.effectiveType,
  };
}
export function useSceneAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => { setAllowed(evaluateSceneAllowed(readEnv())); }, []);
  return allowed;
}
