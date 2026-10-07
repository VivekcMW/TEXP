import Link from "next/link";
import { siteConfig } from "@site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg">{siteConfig.name}</p>
          <p className="prose-x mt-2 text-sm text-muted">{siteConfig.positioning}</p>
          {siteConfig.showSecurityPosture && <p className="mt-2 text-xs text-muted">{siteConfig.securityPosture}</p>}
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/industries">Industries</Link></li>
          <li><Link href="/case-studies">Case studies</Link></li>
          <li><Link href="/insights">Insights</Link></li>
          <li><Link href="/tools/ai-roi-calculator">AI ROI calculator</Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/privacy">Privacy</Link></li>
          <li><Link href="/terms">Terms</Link></li>
          <li><a href={siteConfig.social.linkedin} rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
      <div className="container-x pb-8 text-xs text-muted">© {new Date().getFullYear()} {siteConfig.legalName}</div>
    </footer>
  );
}
