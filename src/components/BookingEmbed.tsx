"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
/** The calendar iframe sets third-party cookies, so it loads on the visitor's click rather than on page load. */
export function BookingEmbed({ url, email }: { url: string; email: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <iframe src={url} title="Book a workflow discussion" className="h-[720px] w-full card rounded-3xl" />;
  return (
    <div className="flex flex-col items-start gap-4 card rounded-3xl p-6">
      <p className="font-display text-[length:var(--text-step-2)]">A conversation about your workflow.</p>
      <p className="prose-x text-muted">The calendar loads when you open it, so nothing from the booking provider runs until you ask.</p>
      <button onClick={() => { track("booking_opened", { path: "/contact" }); setOpen(true); }} data-cta="primary" className="btn btn-primary">Open the calendar</button>
      <p className="text-sm text-muted">Or <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline">open it in a new tab</a>{email && <>, or email <a href={`mailto:${email}`} className="text-accent underline">{email}</a></>}.</p>
    </div>
  );
}
