export function Quote({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <figure className="border-l-2 border-accent pl-6">
      <blockquote className="font-display text-[length:var(--text-step-2)] leading-snug">“{text}”</blockquote>
      <figcaption className="mt-3 text-sm text-muted">{name}, {role}</figcaption>
    </figure>
  );
}
