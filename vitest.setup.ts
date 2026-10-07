import "@testing-library/jest-dom/vitest";

// jsdom has no IntersectionObserver; motion's whileInView needs one.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class IO {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) { this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    root = null; rootMargin = ""; thresholds = [];
  }
  globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;
}

// jsdom has no matchMedia; scene gating reads prefers-reduced-motion through it.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }) as MediaQueryList;
}
