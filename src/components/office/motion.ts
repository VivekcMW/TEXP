import type { StationId } from "./workflows";

export type Point = [number, number, number];
export type FloorPoint = [number, number];
export const deskPositions: Record<StationId, Point> = {
  intake: [-3.6, 0, 1.6], research: [-3.6, 0, -2.65], policy: [0, 0, -2.65],
  review: [3.6, 0, -2.65], execution: [3.6, 0, 1.6],
};

// Front desks are reached through the outer aisles, never through the furniture.
export const walkingRoutes: Record<StationId, FloorPoint[]> = {
  intake: [[-3.6, 2.45], [-3.6, 3.15], [-5, 3.15], [-5, .25], [-1, .25]],
  research: [[-3.6, -1.8], [-3.6, .25], [-1, .25]],
  policy: [[0, -1.8], [0, -.55]],
  review: [[3.6, -1.8], [3.6, .25], [1, .25]],
  execution: [[3.6, 2.45], [3.6, 3.15], [5, 3.15], [5, .25], [1, .25]],
};
export const WALK_SECONDS = 4;
export const AGENT_CYCLE_SECONDS = 16;

export function pointAlongRoute(route: FloorPoint[], progress: number) {
  const lengths = route.slice(1).map(([x, z], i) => Math.hypot(x - route[i][0], z - route[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const fraction = distance / lengths[i];
      const [x, z] = route[i];
      const [nextX, nextZ] = route[i + 1];
      return { x: x + (nextX - x) * fraction, z: z + (nextZ - z) * fraction, heading: Math.atan2(nextX - x, nextZ - z) };
    }
    distance -= lengths[i];
  }
  throw new Error("An office walking route needs at least two distinct points.");
}

export function agentPose(id: StationId, seconds: number, offset = 0) {
  const phase = (seconds + offset) % AGENT_CYCLE_SECONDS;
  const outbound = phase < WALK_SECONDS;
  const returning = phase >= 5 && phase < 9;
  const progress = outbound ? phase / WALK_SECONDS : returning ? 1 - (phase - 5) / WALK_SECONDS : phase < 5 ? 1 : 0;
  const point = pointAlongRoute(walkingRoutes[id], progress);
  return {
    ...point,
    heading: returning ? point.heading + Math.PI : phase >= 9 ? Math.PI : point.heading,
    walking: outbound || returning,
    working: phase >= 9,
    carrying: phase >= 4 && phase < 9,
  };
}
