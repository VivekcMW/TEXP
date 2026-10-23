"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The blurred header contains fixed elements, so the panel is positioned against it instead.
export function MobileMenu({ links, cta }: { links: Array<{ href: string; label: string }>; cta: { href: string; label: string } }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pathname = usePathname() ?? "";
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    };
    const onOutsidePointer = (e: PointerEvent) => {
      if (e.target instanceof Node && !root.current?.contains(e.target)) setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    onResize();
    desktop.addEventListener("change", onResize);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutsidePointer);
    document.body.style.overflow = "hidden";
    return () => {
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutsidePointer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  return (
    <div ref={root} className="lg:hidden" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={toggle} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-tint">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id={id} className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg px-4 pt-4 pb-8">
          <ul className="flex flex-col divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} aria-current={pathname === l.href || pathname.startsWith(`${l.href}/`) ? "page" : undefined} className="block py-4 text-lg font-medium text-ink aria-[current=page]:text-accent">{l.label}</Link></li>
            ))}
          </ul>
          <div className="sm:hidden">
            <Link href={cta.href} onClick={() => setOpen(false)} aria-current={pathname === cta.href ? "page" : undefined} className="btn btn-primary mt-6 w-full">{cta.label}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
