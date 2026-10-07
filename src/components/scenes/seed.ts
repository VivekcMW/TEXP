/** Deterministic PRNG so scenes render identically on every load. */
export function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const ACCENT = "#0f5c4a";
export const ACCENT_LIGHT = "#6fd3b4";
export const MUTED = "#8a8378";
