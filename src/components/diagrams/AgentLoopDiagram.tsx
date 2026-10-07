import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
const stages = ["Goal", "Plan", "Call tools", "Observe", "Verify", "Done"];
export function AgentLoopDiagram() {
  const cx = 260, cy = 200, r = 140, w = 100, h = 40;
  const pts = stages.map((_, i) => { const a = (-90 + i * 60) * (Math.PI / 180); return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; });
  return (
    <Diagram title="Agent loop with a human checkpoint" description="Six stages arranged in a ring: goal, plan, call tools, observe, verify, done. Arrows run clockwise. A human checkpoint is attached to the verify stage, and a loop-back arrow returns from verify to plan when the result is not good enough." caption="The loop every agent we ship runs, with a person at the verify step until the metrics earn autonomy." viewBox="0 0 520 420">
      {pts.map((p, i) => {
        const n = pts[(i + 1) % pts.length];
        const dx = n.x - p.x, dy = n.y - p.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
        return (
          <Reveal key={stages[i]} delay={i * 0.08}>
            <Box x={p.x - w / 2} y={p.y - h / 2} w={w} h={h} label={stages[i]} accent={i === 4} />
            {i < pts.length - 1 && <Arrow x1={p.x + ux * 58} y1={p.y + uy * 58} x2={n.x - ux * 58} y2={n.y - uy * 58} />}
          </Reveal>
        );
      })}
      <Reveal delay={0.55}>
        <Box x={400} y={290} w={110} h={40} label="Human" sub="checkpoint" accent />
        <Arrow x1={pts[4].x + 50} y1={pts[4].y} x2={400} y2={310} />
        <path d={`M ${pts[4].x - 40} ${pts[4].y - 10} Q ${cx} ${cy} ${pts[1].x - 10} ${pts[1].y + 22}`} fill="none" stroke="var(--color-diagram)" strokeDasharray="4 4" />
        <text x={cx - 40} y={cy + 4} fill="var(--color-muted)" fontSize="10">retry</text>
      </Reveal>
    </Diagram>
  );
}
