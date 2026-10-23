"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { filterCaseStudies, type CaseStudyPreview } from "./library";
import { WorkflowCover } from "./WorkflowCover";
import styles from "./case-studies.module.css";

export function CaseStudyLibrary({ studies, featuredSlug }: { studies: CaseStudyPreview[]; featuredSlug: string }) {
  const [industry, setIndustry] = useState("all");
  const id = useId();
  const sectors = [...new Map(studies.map((study) => [study.industry, { value: study.industry, label: study.editorial.label }])).values()];
  const filtered = filterCaseStudies(studies, industry, featuredSlug);
  const reset = () => setIndustry("all");

  return <section id="case-library" className={`container-x ${styles.library}`} aria-labelledby={`${id}-title`}>
    <div className={styles.libraryHeading}>
      <div><p className={styles.eyebrow}>The collection</p><h2 id={`${id}-title`} className="font-display">Find a familiar challenge.</h2></div>
      <p>Compare the process, the human decision and what needs evaluation.</p>
    </div>
    <div className={styles.tools}>
      <div className={styles.filters} role="group" aria-label="Filter case studies by industry">
        {[{ value: "all", label: "All industries" }, ...sectors].map((sector) => <button type="button" key={sector.value}
          aria-pressed={industry === sector.value} aria-controls={`${id}-results`} onClick={() => setIndustry(sector.value)}>{sector.label}</button>)}
      </div>
      <label className={styles.mobileFilter}>Industry
        <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
          <option value="all">All industries</option>
          {sectors.map((sector) => <option key={sector.value} value={sector.value}>{sector.label}</option>)}
        </select>
      </label>
      <div className={styles.searchRow}>
        <div className={styles.resultInfo}>
          <p role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "example" : "examples"}</p>
          {industry === "all" && <span>Plus the featured workflow above</span>}
          {industry !== "all" && <button type="button" onClick={reset}>Reset filters</button>}
        </div>
      </div>
    </div>
    <div id={`${id}-results`} className={styles.grid} aria-label="Case study results">
      {filtered.map((study) => <article key={study.slug} className={styles.story} data-case-study={study.slug}>
        <WorkflowCover study={study} />
        <div className={styles.storyBody}>
          <div className={styles.storyMeta}><span>{study.editorial.label}</span></div>
          <h3 className="font-display"><Link href={`/case-studies/${study.slug}`}>{study.title}</Link></h3>
          <p className={styles.deck}>{study.editorial.deck}</p>
          <p className={styles.readLink} aria-hidden="true">Explore the approach <span>&#8599;</span></p>
        </div>
      </article>)}
      {filtered.length === 0 && <div className={styles.empty}>
        <p className={styles.eyebrow}>A different starting point</p>
        <h3 className="font-display">No matching examples.</h3>
        <p>Choose a different industry or return to the collection.</p>
        <button type="button" className="btn btn-secondary" onClick={reset}>Show all examples</button>
      </div>}
    </div>
  </section>;
}
