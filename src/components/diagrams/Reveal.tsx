"use client";
import { useEffect, useRef, useState } from "react";
/** Fades a diagram group in when it scrolls into view. No animation library: a few lines of IntersectionObserver.
 *  Under prefers-reduced-motion the global stylesheet disables transitions, so the group simply appears. */
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<SVGGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <g ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(6px)", transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` }}>
      {children}
    </g>
  );
}
