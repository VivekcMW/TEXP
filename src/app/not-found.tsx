import Link from "next/link";
import { CTABand } from "@/components/CTABand";
export default function NotFound() {
  return (
    <main>
      <section className="container-x py-24">
        <h1 className="font-display text-[length:var(--text-step-4)] tracking-tight">That page does not exist</h1>
        <p className="prose-x mt-4 text-muted">The link may be old. Explore our services or workflow examples.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/services" className="btn btn-secondary">Services</Link>
          <Link href="/case-studies" className="btn btn-secondary">Workflow examples</Link>
        </div>
      </section>
      <CTABand />
    </main>
  );
}
