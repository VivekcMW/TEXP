import Link from "next/link";
import type { ShowcaseAgent } from "./showcase";
import { isHumanReview } from "./showcase";
import styles from "./showroom.module.css";

const approvalLabels = {
  none: "No approval needed",
  threshold: "Approval at configured limits",
  always: "Human approval required",
};

export default function AgentDetails({ agent }: { agent: ShowcaseAgent }) {
  const { presentation, proof } = agent;
  return <div className="container-x">
    <section id="agent-example" className={styles.example} aria-labelledby="example-title" data-agent={agent.slug}>
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>See the work, not just the promise</p>
          <h2 id="example-title">A day at the {presentation.label.toLowerCase()} desk.</h2></div>
        <Link href={`/agents/${agent.slug}`} className={styles.textLink}>View full agent details <span aria-hidden>&#8599;</span></Link>
      </div>
      <div className={styles.storyGrid}>
        <div className={styles.request}>
          <span className={styles.storyIcon} aria-hidden>&#9993;</span>
          <h3>It starts with a request.</h3>
          <blockquote>&ldquo;{presentation.request}&rdquo;</blockquote>
          <p>{agent.trigger}</p>
          <span className={styles.smallLabel}>Example input</span>
        </div>
        <div className={styles.handles}>
          <span className={styles.storyIcon} aria-hidden>&#10022;</span>
          <h3>The agent takes it from here.</h3>
          <ul>{agent.steps.filter((s) => !isHumanReview(s)).map((s) => <li key={s.tool}>
            <span aria-hidden>&#10003;</span><div><p>{s.label}</p><span>{s.detail}</span></div>
          </li>)}</ul>
        </div>
        <div className={styles.output}>
          <span className={styles.storyIcon} aria-hidden>&#8599;</span>
          <h3>A useful next step.</h3>
          <p>{presentation.output}</p>
          <div className={styles.handoff}><span className={styles.smallLabel}>Where your team decides</span><p>{agent.autonomy}</p></div>
        </div>
      </div>
      {proof && <aside className={styles.proof} aria-label="Related case study">
        <div>
          <span className={styles.smallLabel}>Related workflow</span>
          <Link href={`/case-studies/${proof.slug}`}>{proof.title} <span aria-hidden>&#8599;</span></Link>
        </div>
        {proof.before && proof.after && <div className={styles.comparison}>
          <div><span>Current challenge</span><strong>{proof.before}</strong></div>
          <span aria-hidden>&rarr;</span>
          <div><span>Proposed approach</span><strong>{proof.after}</strong></div>
        </div>}
      </aside>}
    </section>
    <section className={styles.boundaries} aria-labelledby="boundaries-title">
      <p className={styles.eyebrow}>Built to work with your people</p>
      <h2 id="boundaries-title">Useful autonomy.<br /><span>Clear boundaries.</span></h2>
      <p className={styles.boundariesIntro}>What the {agent.title.toLowerCase()} can access, when it hands over, and what it leaves behind.</p>
      <div className={styles.boundaryGrid}>
        <div>
          <span className={styles.boundaryIcon} aria-hidden>&#8984;</span><h3>Scoped access</h3>
          <p>Reading information and changing a record are separate permissions. This agent works through {agent.tools.length} defined tools.</p>
          <details className={styles.permissions} key={agent.slug}>
            <summary>See tools and permissions</summary>
            <ul>{agent.tools.map((tool) => <li key={tool.name}>
              <code>{tool.name}</code><p><b>Reads:</b> {tool.reads}</p><p><b>Writes:</b> {tool.writes}</p>
              <span>{approvalLabels[tool.approval]}</span>
            </li>)}</ul>
          </details>
        </div>
        <div>
          <span className={styles.boundaryIcon} aria-hidden>&#9671;</span><h3>Human decisions</h3>
          <ul>{agent.gates.map((gate) => <li key={gate}>{gate}</li>)}</ul>
        </div>
        <div>
          <span className={styles.boundaryIcon} aria-hidden>&#8801;</span><h3>Traceable work</h3>
          <ul>{agent.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  </div>;
}
