import Link from "next/link";
import { siteConfig } from "@site-config";

const links = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="border-b border-line">
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-xl tracking-tight">{siteConfig.name}</Link>
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="text-sm text-muted hover:text-ink">{l.label}</Link></li>
          ))}
        </ul>
        <Link href="/contact" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink">Book a call</Link>
      </nav>
    </header>
  );
}
