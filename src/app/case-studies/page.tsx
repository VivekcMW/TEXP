import Link from "next/link";
import { CTABand } from "@/components/CTABand";
import { CaseStudyLibrary } from "@/components/case-studies/CaseStudyLibrary";
import { WorkflowCover } from "@/components/case-studies/WorkflowCover";
import { toCaseStudyPreview } from "@/components/case-studies/library";
import styles from "@/components/case-studies/case-studies.module.css";
import { getCaseStudies, getIndustries, getServices } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI workflow examples and human review", description: "Explore illustrative AI workflows, their intended benefits and human review points. Scope, timing and outcomes depend on your requirements.", path: "/case-studies" });

export default function CaseStudiesPage() {
  const industries = getIndustries();
  const services = getServices();
  const studies = getCaseStudies().map((study) => toCaseStudyPreview(study, industries, services));
  const featured = studies.find((study) => study.slug === "logistics-claims-automation");
  if (!featured) throw new Error("The featured logistics case study is missing.");
  return (
    <main>
      <header className={`container-x ${styles.hero}`}>
        <div className={styles.intro}>
          <div><p className={styles.eyebrow}>Workflow examples / A closer look</p>
            <h1 className="font-display">The work.<span> The thinking behind it.</span></h1>
          </div>
          <div className={styles.introCopy}>
            <p>Explore how agents could support everyday operations. What they read. Where people decide. And what needs to be evaluated before anything goes live.</p>
            <a href="#case-library">Explore the collection <span aria-hidden="true">&darr;</span></a>
          </div>
        </div>
        <div className={styles.note}><strong>A note on these examples</strong><p>Illustrative designs, not verified customer results. Scope, timing and potential benefits depend on your requirements and evaluation.</p></div>
      </header>
      <section className="container-x" aria-label="Featured case study">
        <article className={styles.featured}>
          <div className={styles.featuredCopy}>
            <div className={styles.featureTop}><span>In focus</span>{featured.illustrative && <span>Illustrative example</span>}</div>
            <p className={styles.featureSector}>{featured.industryName}</p>
            <h2 className="font-display">{featured.title}</h2>
            <p>{featured.editorial.deck}</p>
            <Link href={`/case-studies/${featured.slug}`}>Read the workflow <span aria-hidden="true">&#8599;</span></Link>
          </div>
          <WorkflowCover study={featured} />
        </article>
      </section>
      <CaseStudyLibrary studies={studies} featuredSlug={featured.slug} />
      <CTABand title="Start with a process you know." body="Bring a workflow, a recurring exception or a difficult handoff. We will explore the requirements before proposing scope, pricing or timing." />
    </main>
  );
}
