"use client";

import { useEffect, useState, type RefObject } from "react";

export function useSceneActivity(stage: RefObject<HTMLDivElement | null>, onReducedMotion: () => void) {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) onReducedMotion();
    };
    update();
    media.addEventListener("change", update);
    const visibility = () => setPageVisible(document.visibilityState !== "hidden");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (stage.current) observer.observe(stage.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, [stage, onReducedMotion]);

  useEffect(() => {
    const events = ["pointerdown", "pointermove", "keydown", "touchstart"] as const;
    const start = () => {
      setStarted(true);
      events.forEach((event) => window.removeEventListener(event, start));
    };
    events.forEach((event) => window.addEventListener(event, start, { passive: true, once: true }));
    const timer = window.setTimeout(start, 1800);
    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, start));
    };
  }, []);

  return {
    reducedMotion, started, setStarted,
    hydrated: reducedMotion !== null,
    active: reducedMotion === false && started && visible && pageVisible,
  };
}
