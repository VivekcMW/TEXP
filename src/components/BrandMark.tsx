import { existsSync } from "node:fs";
import { join } from "node:path";
import { iconFor, type Brand } from "./brands";

/** A brand chip: official SVG from public/brands if present, else the Simple Icons mark, else a wordmark.
 *  Marks are grey until hovered, then take the brand colour. */
export function BrandMark({ brand: b }: { brand: Brand }) {
  const asset = existsSync(join(process.cwd(), "public", "brands", `${b.slug}.svg`));
  const icon = asset ? null : iconFor(b);
  return (
    <li className="brand-chip" style={icon ? ({ "--brand": `#${icon.hex}` } as React.CSSProperties) : undefined}>
      {asset ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/brands/${b.slug}.svg`} alt="" width={20} height={20} className="h-5 w-5" />
      ) : icon ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="brand-mark"><path d={icon.path} fill="currentColor" /></svg>
      ) : (
        <span aria-hidden className="brand-mark flex h-5 w-5 items-center justify-center rounded-md bg-ink/80 text-[10px] font-semibold text-white">{b.name[0]}</span>
      )}
      <span className="whitespace-nowrap text-sm font-medium text-ink">{b.name}</span>
    </li>
  );
}
