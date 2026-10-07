"use client";
import { CTABand } from "@/components/CTABand";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main>
      <section className="container-x py-24">
        <h1 className="font-display text-[length:var(--text-step-4)] tracking-tight">Something went wrong</h1>
        <p className="prose-x mt-4 text-muted">Reload the page or try again in a moment.</p>
        <button onClick={reset} className="mt-8 rounded-full border border-line px-5 py-2">Try again</button>
      </section>
      <CTABand />
    </main>
  );
}
