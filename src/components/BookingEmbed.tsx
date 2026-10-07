"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
/** The calendar iframe sets third-party cookies, so it loads on the visitor's click rather than on page load. */
export function BookingEmbed({ url, email }: { url: string; email: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <iframe src={url} title="Book a 30-minute AI audit" className="h-[720px] w-full rounded-2xl border border-line bg-surface" />;
  return (
    <div className="flex h-[420px] flex-col items-start justify-center gap-4 rounded-2xl border border-line bg-surface p-8">
      <p className="font-display text-[length:var(--text-step-2)]">30 minutes, your calendar, no pitch.</p>
      <p className="prose-x text-muted">The calendar loads when you open it, so nothing from the booking provider runs until you ask.</p>
      <button onClick={() => { track("booking_opened", { path: "/contact" }); setOpen(true); }} data-cta="primary" className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Open the calendar</button>
      <p className="text-sm text-muted">Or <a href={url} className="text-accent underline">open it in a new tab</a>, or email <a href={`mailto:${email}`} className="text-accent underline">{email}</a>.</p>
    </div>
  );
}
