import { loadCollection, CONTENT_ROOT } from "./load";
import { siteConfig } from "@site-config";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateContent(rootDir: string = CONTENT_ROOT): ValidationResult {
  const errors: string[] = [];
  let services, industries, caseStudies, insights;
  try {
    services = loadCollection("services", rootDir);
    industries = loadCollection("industries", rootDir);
    caseStudies = loadCollection("case-studies", rootDir);
    insights = loadCollection("insights", rootDir);
  } catch (e) {
    return { ok: false, errors: [(e as Error).message] };
  }
  const serviceSlugs = new Set(services.map((s) => s.slug));
  const industrySlugs = new Set(industries.map((s) => s.slug));
  const caseSlugs = new Set(caseStudies.map((s) => s.slug));
  const founderIds = new Set<string>(siteConfig.founders.map((f) => f.id));

  for (const s of services)
    if (!caseSlugs.has(s.caseStudy)) errors.push(`services/${s.slug}.mdx: caseStudy "${s.caseStudy}" does not exist`);
  for (const i of industries) {
    if (!caseSlugs.has(i.caseStudy)) errors.push(`industries/${i.slug}.mdx: caseStudy "${i.caseStudy}" does not exist`);
    for (const sv of i.services) if (!serviceSlugs.has(sv)) errors.push(`industries/${i.slug}.mdx: services "${sv}" does not exist`);
  }
  for (const c of caseStudies) {
    if (!industrySlugs.has(c.industry)) errors.push(`case-studies/${c.slug}.mdx: industry "${c.industry}" does not exist`);
    if (!serviceSlugs.has(c.service)) errors.push(`case-studies/${c.slug}.mdx: service "${c.service}" does not exist`);
  }
  for (const a of insights) {
    if (!founderIds.has(a.author)) errors.push(`insights/${a.slug}.mdx: author "${a.author}" is not in siteConfig.founders`);
    for (const sv of a.relatedServices) if (!serviceSlugs.has(sv)) errors.push(`insights/${a.slug}.mdx: relatedServices "${sv}" does not exist`);
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}
