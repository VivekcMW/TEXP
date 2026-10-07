import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
import { siteConfig } from "@site-config";
import { formatMoney } from "@/lib/utils";
export function EngagementModelDiagram() {
  const c = siteConfig.pricing.currency;
  const steps = [
    { label: "Discovery sprint", sub: `2 weeks · from ${formatMoney(siteConfig.pricing.discoverySprint, c)}` },
    { label: "Pilot", sub: `6–8 weeks · from ${formatMoney(siteConfig.pricing.pilot, c)}` },
    { label: "Scale", sub: `quarterly · from ${formatMoney(siteConfig.pricing.scale, c)}` },
  ];
  return (
    <Diagram title="Engagement model" description="Three stages left to right: a two-week discovery sprint, a six to eight week pilot, and quarterly scale, each with a from-price." caption="Every engagement runs the same three stages, each with a published starting price." viewBox="0 0 860 120">
      {steps.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.12}>
          <Box x={20 + i * 290} y={30} w={240} h={56} label={s.label} sub={s.sub} accent={i === 1} />
          {i < 2 && <Arrow x1={260 + i * 290} y1={58} x2={308 + i * 290} y2={58} />}
        </Reveal>
      ))}
    </Diagram>
  );
}
