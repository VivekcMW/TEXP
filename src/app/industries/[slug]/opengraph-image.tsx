import { ogImage, OG_SIZE } from "@/lib/og";
import { getBySlug, loadCollection } from "@/content/load";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() { return loadCollection("industries").map((e) => ({ slug: e.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getBySlug("industries", slug);
  return ogImage({ title: e?.title ?? "", kicker: e?.targetQuery ?? "" });
}
