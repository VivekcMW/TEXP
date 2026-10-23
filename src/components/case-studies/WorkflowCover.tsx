import type { CaseStudyPreview } from "./library";
import styles from "./case-studies.module.css";

export function WorkflowCover({ study }: { study: CaseStudyPreview }) {
  const { editorial } = study;
  return <div className={styles.cover} data-theme={editorial.theme} role="img"
    aria-label={`Workflow: ${editorial.sources.join(", ")} inform a ${editorial.draft.toLowerCase()}, with ${editorial.reviewer.toLowerCase()}.`}>
    <div className={styles.coverContent} aria-hidden="true">
      <div className={styles.coverHeading}><span>Workflow sketch</span><span className={styles.coverDot} /></div>
      <div className={styles.flow}>
        <div className={styles.sources}>
          <p>Approved sources</p>
          {editorial.sources.map((source) => <div key={source}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M3 1h6l4 4v12H3zM9 1v4h4M6 9h4M6 12h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            <span>{source}</span>
          </div>)}
        </div>
        <span className={styles.connector}>&rarr;</span>
        <div className={styles.draft}>
          <svg width="27" height="27" viewBox="0 0 28 28" fill="none"><path d="m14 2 3.2 8.8L26 14l-8.8 3.2L14 26l-3.2-8.8L2 14l8.8-3.2z" stroke="currentColor" strokeWidth="1.3" /></svg>
          <p>Agent-prepared</p><strong>{editorial.draft}</strong>
          <span className={styles.draftLine} /><span className={styles.draftLine} />
        </div>
      </div>
      <div className={styles.review}>
        <span className={styles.person}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M4 17v-1a6 6 0 0 1 12 0v1" stroke="currentColor" strokeWidth="1.3" /></svg>
        </span>
        <div><span>Human checkpoint</span><strong>{editorial.reviewer}</strong></div>
        <span className={styles.reviewDot} />
      </div>
      <p className={styles.coverNote}>Proposed design &middot; not a live system</p>
    </div>
  </div>;
}
