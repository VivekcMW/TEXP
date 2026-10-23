import Link from "next/link";
import { AgentOffice } from "./office/AgentOffice";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={`container-x ${styles.heroGrid}`}>
        <AgentOffice />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Custom AI workflows for operations teams</p>
          <h1 id="hero-heading" className={styles.headline}>Your work moves forward. <span>Your team stays in control.</span></h1>
          <p className={styles.intro}>An AI team for the work between the work. Agents gather information, check your rules and complete approved actions across your existing tools.</p>
          <div className={styles.actions}>
            <Link href="/contact" data-cta="primary" className="btn btn-primary">Discuss your workflow</Link>
            <Link href="/agents" className="btn btn-secondary">Explore the agents <span className="ml-2" aria-hidden>&#8599;</span></Link>
          </div>
          <p className={styles.promise}>
            <svg width="14" height="16" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="m10 2 7 3v6c0 4-7 9-7 9s-7-5-7-9V5z" /><path d="m6.5 10 2.5 2.5 4.5-5" /></svg>
            Your systems. Your permissions. Your final say.
          </p>
        </div>
      </div>
    </section>
  );
}
