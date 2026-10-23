import Link from "next/link";
import { siteConfig } from "@site-config";
import { getIndustries, getServices } from "@/content/load";

const company = [
  { href: "/about", label: "About" },
  { href: "/agents", label: "Agents we build" },
  { href: "/case-studies", label: "Workflow examples" },
  { href: "/tools/ai-roi-calculator", label: "Workflow assessment" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const services = getServices();
  const industries = getIndustries();
  return (
    <footer className="border-t border-line bg-tint">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-display text-lg">
              <span className="gradient-brand inline-block h-6 w-6 rounded-lg" aria-hidden />
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-[36ch] text-sm text-muted">{siteConfig.positioning}</p>
            {siteConfig.contactEmail && <p className="mt-6 text-sm text-muted"><a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-ink">{siteConfig.contactEmail}</a></p>}
            {siteConfig.preview && <p className="mt-4 text-xs text-muted">Website preview. Live enquiry delivery and booking are not enabled.</p>}
          </div>
          <nav aria-label="Services">
            <p className="text-sm font-semibold">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="transition-colors hover:text-accent">{s.title}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Industries">
            <p className="text-sm font-semibold">Industries</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {industries.map((i) => <li key={i.slug}><Link href={`/industries/${i.slug}`} className="transition-colors hover:text-accent">{i.title}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Company">
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {company.map((c) => <li key={c.href}><Link href={c.href} className="transition-colors hover:text-accent">{c.label}</Link></li>)}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName || siteConfig.name}.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            {siteConfig.social.linkedin && <a href={siteConfig.social.linkedin} rel="noopener" className="inline-flex items-center gap-1.5 hover:text-ink" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
              LinkedIn
            </a>}
          </div>
        </div>
      </div>
    </footer>
  );
}
