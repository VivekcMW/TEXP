import Link from "next/link";
import { AgentShowroom } from "@/components/agents/AgentShowroom";
import { agentPresentations, type ShowcaseAgent } from "@/components/agents/showcase";
import styles from "@/components/agents/showroom.module.css";
import { getAgents, getCaseStudies, getIndustries } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Meet the agents — made for your everyday work", description: "Explore seven AI agent specialists in an interactive workbench. See what they handle, the evidence they keep and where your team stays in control.", path: "/agents" });

export default function AgentsPage() {
  const agents = new Map(getAgents().map((a) => [a.slug, a]));
  const cases = new Map(getCaseStudies().map((c) => [c.slug, c]));
  const industries = new Map(getIndustries().map((i) => [i.slug, i.title]));
  const showroom: ShowcaseAgent[] = agentPresentations.map((presentation) => {
    const agent = agents.get(presentation.slug);
    if (!agent) throw new Error(`Missing showroom agent: ${presentation.slug}`);
    const industryName = industries.get(agent.industry);
    const proof = cases.get(agent.caseStudy);
    if (!industryName || !proof) throw new Error(`Missing showroom references for ${agent.slug}`);
    const { slug, title, trigger, unit, steps, autonomy, tools, gates, evidence } = agent;
    return {
      slug, title, trigger, unit, steps, autonomy, tools, gates, evidence, presentation, industryName,
      proof: {
        slug: proof.slug, title: proof.title, before: proof.before, after: proof.after,
        illustrative: proof.illustrative, result: proof.result,
      },
    };
  });
  return (
    <main className={styles.page}>
      <AgentShowroom agents={showroom}>
        <header className={styles.heroCopy}>
          <p className={styles.eyebrow}>A specialist for the work in your way</p>
          <h1>Meet the agents.<br /><span>Made for your everyday work.</span></h1>
          <p className={styles.intro}>From incoming requests to approved actions, explore how AI agents handle the busywork &mdash; while your people keep the decisions that matter.</p>
          <div className={styles.heroActions}>
            <a href="#agent-workbench" className="btn btn-primary">See an agent at work <span aria-hidden>&darr;</span></a>
            <Link href="/contact" className={styles.textLink} data-cta="primary">Discuss your workflow <span aria-hidden>&#8599;</span></Link>
          </div>
        </header>
      </AgentShowroom>
      <section className={`container-x ${styles.cta}`} aria-labelledby="agents-cta">
        <p className={styles.eyebrow}>Start with one process</p>
        <h2 id="agents-cta">Which work would you<br />hand over first?</h2>
        <p>Bring us one repetitive process. We&apos;ll map what an agent could handle and where your team should stay involved.</p>
        <div className={styles.heroActions}>
          <Link href="/contact" className="btn btn-primary" data-cta="primary">Discuss your workflow <span aria-hidden>&#8599;</span></Link>
          <Link href="/case-studies" className={styles.textLink}>Explore workflow examples <span aria-hidden>&rarr;</span></Link>
        </div>
        <nav className={styles.guides} aria-label="All agent guides">
          {showroom.map((agent) => <Link key={agent.slug} href={`/agents/${agent.slug}`}>{agent.presentation.label}</Link>)}
        </nav>
      </section>
    </main>
  );
}
