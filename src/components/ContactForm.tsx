"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ContactForm({ enabled, initiallySaved = false }: { enabled: boolean; initiallySaved?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "saved" | "error">(initiallySaved && enabled ? "saved" : "idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state === "sending") return;
    const form = event.currentTarget;
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body: unknown = await response.json();
      if (!response.ok || typeof body !== "object" || body === null || !("ok" in body) || body.ok !== true) {
        let message = "Your message was not saved. Check the fields and try again.";
        if (typeof body === "object" && body !== null && "errors" in body && typeof body.errors === "object" && body.errors !== null) {
          const messages = Object.values(body.errors).filter((value): value is string => typeof value === "string");
          if (messages.length) message = messages.join(" ");
        }
        setError(message);
        setState("error");
        return;
      }
      form.reset();
      setState("saved");
    } catch (error) {
      console.error("Contact submission failed", error);
      setError("We could not confirm that your message was saved. Check your connection before trying again.");
      setState("error");
    }
  }

  return <form action="/api/leads" method="post" onSubmit={submit} className="detail-panel" aria-label="Workflow enquiry">
    <h2 className="font-display text-2xl">Describe the work</h2>
    {!enabled && <p id="contact-unavailable" role="status" className="mt-4 rounded-xl bg-tint p-4 text-sm text-muted">This is a website preview. Enquiry delivery is not configured, so this form is disabled and does not collect your information.</p>}
    {enabled && <p className="mt-3 text-sm text-muted">Local testing only. Submissions are saved on this development machine; no email is sent. Use synthetic information.</p>}
    <fieldset disabled={!enabled || state === "sending"} aria-describedby={!enabled ? "contact-unavailable" : undefined} className="mt-6 grid gap-5 disabled:opacity-60">
      <label className="text-sm font-medium">Name<input name="name" autoComplete="name" required maxLength={120} className="mt-2 block min-h-11 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
      <label className="text-sm font-medium">Work email<input name="email" autoComplete="email" type="email" required className="mt-2 block min-h-11 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
      <label className="text-sm font-medium">Company <span className="font-normal text-muted">(optional)</span><input name="company" autoComplete="organization" maxLength={120} className="mt-2 block min-h-11 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
      <label className="text-sm font-medium">One process you would like to improve<textarea name="message" rows={4} required maxLength={2000} className="mt-2 block w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
      <input type="hidden" name="source" value="contact" />
      <p className="text-sm text-muted">Do not include confidential records, patient information or credentials. <Link href="/privacy" className="text-accent underline underline-offset-4">How information is handled</Link></p>
      <button className="btn btn-primary w-fit" type="submit">{state === "sending" ? "Saving..." : "Send enquiry"}</button>
    </fieldset>
    {state === "error" && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
    {state === "saved" && <p role="status" className="mt-5 rounded-xl bg-tint p-4 text-sm">Your test enquiry was saved locally. No email was sent. You can edit the form to save another test.</p>}
  </form>;
}
