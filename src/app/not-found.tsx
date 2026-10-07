import Link from "next/link";
import { CTABand } from "@/components/CTABand";
export default function NotFound() {
  return (
    <main>
      <section className="container-x py-24">
        <h1 className="font-display text-[length:var(--text-step-4)] tracking-tight">That page does not exist</h1>
        <p className="prose-x mt-4 text-muted">The link may be old. Try the services or the case studies.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/services" className="rounded-full border border-line px-5 py-2">Services</Link>
          <Link href="/case-studies" className="rounded-full border border-line px-5 py-2">Case studies</Link>
        </div>
      </section>
      <CTABand />
    </main>
  );
}
