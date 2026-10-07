import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-8 text-sm text-muted">
      <ol className="flex flex-wrap gap-2">
        {all.map((it, i) => (
          <li key={`${it.path}-${i}`} className="flex gap-2">
            {i < all.length - 1 ? <Link href={it.path} className="hover:text-ink">{it.name}</Link> : <span aria-current="page" className="text-ink">{it.name}</span>}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </nav>
  );
}
