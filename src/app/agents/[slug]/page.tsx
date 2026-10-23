import { notFound } from "next/navigation";
import Link from "next/link";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { Mdx } from "@/components/Mdx";
import { Glyph } from "@/components/Glyph";
import { getAgents, getBySlug } from "@/content/load";
import { buildMetadata, agentJsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return getAgents().map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getBySlug("agents", slug);
  return a ? buildMetadata({ title: a.seo.title, description: a.seo.description, path: `/agents/${slug}` }) : {};
}

const approvalLabel = { none: "No approval needed", threshold: "Person approves above a threshold", always: "Person approves every time" } as const;

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getBySlug("agents", slug);
  if (!a) notFound();
  const cs = getBySlug("case-studies", a.caseStudy);
  const industry = getBySlug("industries", a.industry);
  const service = getBySlug("services", a.service);
  return (
    <main>
      <section className="container-x detail-content">
        <header className="page-intro">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {industry && <Link href={`/industries/${industry.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-muted transition-colors hover:border-accent hover:text-ink"><Glyph id={industry.slug} className="inline-flex h-5 w-5 items-center justify-center text-accent" />{industry.title}</Link>}
          {service && <Link href={`/services/${service.slug}`} className="rounded-full border border-line bg-surface px-3 py-1 text-muted transition-colors hover:border-accent hover:text-ink">{service.title}</Link>}
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-[length:var(--text-step-4)] leading-[1.02] tracking-tight text-balance">{a.title}</h1>
        <p className="prose-x mx-auto mt-4 text-lg text-muted">{a.summary}</p>
        <p className="mt-4 text-sm text-muted">An illustrative agent design, configured and evaluated around your systems.</p>
        <Link href="/contact" className="btn btn-primary mt-6" data-cta="primary">Discuss your workflow</Link>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <div className="card overflow-hidden rounded-3xl">
              <div className="border-b border-line bg-tint px-6 py-4">
                <p className="text-xs font-medium text-muted">Starts when</p>
                <p className="mt-1 text-sm text-ink">{a.trigger}</p>
              </div>
              <ol className="divide-y divide-line">
                {a.steps.map((s, n) => (
                  <li key={s.label} className="flex items-start gap-4 px-4 py-4 sm:px-6">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white" aria-hidden>{n + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink">{s.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{s.tool}<span className="font-sans"> · {s.detail}</span></p>
                      {s.tool === "human.review" && <span className="mt-2 inline-block max-w-full rounded-full bg-glow px-2.5 py-1 text-xs font-medium text-accent">Human gate</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 rounded-3xl border border-accent/30 bg-glow/40 p-6">
              <p className="text-xs font-medium text-accent">How much it does on its own</p>
              <p className="mt-2 text-ink">{a.autonomy}</p>
            </div>
          </div>
          <div className="space-y-6">
            {cs && <CaseStudyCard caseStudy={cs} />}
            <div className="card rounded-3xl p-6">
              <p className="text-xs font-medium text-muted">Unit of work</p>
              <p className="mt-1 font-display text-xl">{a.unit}</p>
              <p className="mt-4 text-xs font-medium text-muted">Built as part of</p>
              {service && <Link href={`/services/${service.slug}`} className="mt-1 block text-accent hover:underline">{service.title}</Link>}
            </div>
          </div>
        </div>

        <details className="mt-12 rounded-3xl border border-line p-6">
        <summary className="cursor-pointer py-2 marker:text-accent"><h2 className="inline font-display section-title">Tools and permissions</h2></summary>
        <p className="prose-x mt-2 text-muted">Everything the agent can do, it does through one of these tools. Each is scoped to what it needs and logged.</p>
        <ul className="mt-6 space-y-3 md:hidden">
          {a.tools.map((t) => (
            <li key={t.name} className="card rounded-2xl p-4 text-sm">
              <p className="font-mono text-xs text-ink">{t.name}</p>
              <p className="mt-2 text-muted"><span className="font-medium text-ink">Reads</span> {t.reads}</p>
              <p className="mt-1 text-muted"><span className="font-medium text-ink">Writes</span> {t.writes}</p>
              <p className="mt-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${t.approval === "none" ? "bg-tint text-muted" : "bg-glow text-accent"}`}><span className={`h-1.5 w-1.5 rounded-full ${t.approval === "none" ? "bg-muted" : "bg-accent"}`} aria-hidden />{approvalLabel[t.approval]}</span></p>
            </li>
          ))}
        </ul>
        <div tabIndex={0} role="region" aria-label="Tools and permissions table" className="mt-6 hidden overflow-x-auto rounded-3xl border border-line md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-tint text-xs text-muted">
              <tr><th scope="col" className="px-5 py-3 font-medium">Tool</th><th scope="col" className="px-5 py-3 font-medium">Reads</th><th scope="col" className="px-5 py-3 font-medium">Writes</th><th scope="col" className="px-5 py-3 font-medium">Approval</th></tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {a.tools.map((t) => (
                <tr key={t.name}>
                  <td className="px-5 py-3 font-mono text-xs text-ink">{t.name}</td>
                  <td className="px-5 py-3 text-muted">{t.reads}</td>
                  <td className="px-5 py-3 text-muted">{t.writes}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${t.approval === "none" ? "bg-tint text-muted" : "bg-glow text-accent"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${t.approval === "none" ? "bg-muted" : "bg-accent"}`} aria-hidden />{approvalLabel[t.approval]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </details>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">Where a person decides</h2>
            <ul className="mt-4 space-y-3">
              {a.gates.map((g) => (
                <li key={g} className="flex gap-3 text-ink">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="mt-0.5 shrink-0 text-accent"><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">Evidence it keeps</h2>
            <ul className="mt-4 space-y-3">
              {a.evidence.map((e) => (
                <li key={e} className="flex gap-3 text-ink">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="mt-0.5 shrink-0 text-accent"><path d="M6 4h9l4 4v12H6z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M15 4v4h4M9 13h6M9 17h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Mdx source={a.body} />
      </section>
      <CTABand title="Explore how this agent could fit your workflow" body="Discuss your process, data access and approval needs. We will identify what needs evaluation before proposing scope, pricing or timing." />
      <JsonLd data={agentJsonLd(a)} />
    </main>
  );
}
