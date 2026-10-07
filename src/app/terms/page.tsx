import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";
export const metadata = buildMetadata({ title: "Terms of use", description: "Terms for using this website: what the free tools and illustrative case studies are and are not, and how to contact us about them.", path: "/terms" });
export default function TermsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Terms", path: "/terms" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" title="Terms of use" />
        <div className="prose-x mt-8 space-y-4 text-muted">
          <p><strong className="text-ink">The site.</strong> This website is published by {siteConfig.legalName}. You may read and link to it freely. Content is ours or licensed to us; ask before reusing it commercially.</p>
          <p><strong className="text-ink">Free tools.</strong> The ROI calculator gives an estimate from the numbers you enter. It is not advice and not a quote. Engagement prices on this site are starting points and are confirmed in a written proposal.</p>
          <p><strong className="text-ink">Illustrative case studies.</strong> Studies labelled “Illustrative example” describe representative engagements of that type. Their numbers are representative, not audited results for a named client.</p>
          <p><strong className="text-ink">No warranty.</strong> We keep the site accurate but make no guarantee that it is complete or error-free, and we are not liable for decisions made on it alone.</p>
          <p><strong className="text-ink">Contact.</strong> Questions about these terms go to <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent underline">{siteConfig.contactEmail}</a>. Last updated 7 October 2026.</p>
        </div>
      </section>
    </main>
  );
}
