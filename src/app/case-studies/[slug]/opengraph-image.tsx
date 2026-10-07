import { ogImage, OG_SIZE } from "@/lib/og";
import { getBySlug, getCaseStudies } from "@/content/load";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() { return getCaseStudies().map((e) => ({ slug: e.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getBySlug("case-studies", slug);
  return ogImage({ title: c?.title ?? "", kicker: c ? `${c.result.value}${c.result.unit} ${c.result.metric} ${c.result.period}` : "" });
}
