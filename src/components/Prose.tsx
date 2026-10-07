export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-x [&_h2]:font-display [&_h2]:text-[length:var(--text-step-2)] [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:mt-6 [&_h3]:font-medium [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold">{children}</div>;
}
