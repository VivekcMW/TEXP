"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@site-config";
import { MobileMenu } from "./MobileMenu";

const links = [
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Examples" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <nav aria-label="Primary" className="container-x flex min-h-16 flex-wrap items-center justify-between gap-4 py-2">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="flex min-w-[min(100%,10rem)] items-center gap-2 font-display text-xl tracking-tight">
          <span className="gradient-brand inline-block h-6 w-6 shrink-0 rounded-lg" aria-hidden />
          <span className="min-w-0">{siteConfig.name}</span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} aria-current={pathname === l.href || pathname.startsWith(`${l.href}/`) ? "page" : undefined} className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-tint hover:text-ink aria-[current=page]:bg-tint aria-[current=page]:text-accent">{l.label}</Link></li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block"><Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} className="btn btn-primary btn-sm">Discuss your workflow</Link></div>
          <MobileMenu links={links} cta={{ href: "/contact", label: "Discuss your workflow" }} />
        </div>
      </nav>
    </header>
  );
}
