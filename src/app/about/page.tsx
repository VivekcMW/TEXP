import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: `About ${siteConfig.name} — who we are and why`, description: "Our approach to AI workflows: understand the process, establish boundaries and evaluate the evidence before wider rollout.", path: "/about" });

export default function AboutPage() {
  return (
    <main>
      <section className="container-x section-space text-center">
        <SectionHeading as="h1" eyebrow="About" title="Why this company exists" className="mx-auto [&>.prose-x]:mx-auto">{siteConfig.positioning}</SectionHeading>
        <div className="prose-x mx-auto mt-10 space-y-5 text-[length:var(--text-step-0)]">
          <p>Useful AI starts with understanding the work. A compelling demonstration is not enough: the process, information access and ownership all need to be clear before an organisation can rely on it.</p>
          <p>Our approach is to understand the process, define what an agent may do, and evaluate it alongside the existing workflow. Potential benefits need evidence; pricing and delivery depend on the agreed scope rather than a generic promise.</p>
          <p>The aim is a workflow your team can understand and operate, with documented responsibilities, escalation paths and evidence to decide what should happen next.</p>
        </div>
        <Link href="/contact" data-cta="primary" className="btn btn-primary mt-8">Discuss your workflow</Link>
      </section>
    </main>
  );
}
