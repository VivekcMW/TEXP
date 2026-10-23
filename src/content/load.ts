import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { collections, type CollectionName, type Service, type Industry, type CaseStudy, type Insight, type Agent } from "./schemas";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

type Loaded = { services: Service; industries: Industry; "case-studies": CaseStudy; insights: Insight; agents: Agent };

export function loadCollection<N extends CollectionName>(name: N, rootDir: string = CONTENT_ROOT): Loaded[N][] {
  const dir = path.join(rootDir, name);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = collections[name].safeParse(normalizeDates(data));
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(`${name}/${file}: ${issue.path.join(".")} ${issue.message}`);
    }
    return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), body: content.trim() } as Loaded[N];
  });
}

/** YAML parses unquoted dates (2026-10-07) as Date objects; schemas expect strings. */
function normalizeDates(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normalizeDates);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeDates(v)]));
  return value;
}

export function getBySlug<N extends CollectionName>(name: N, slug: string, rootDir?: string): Loaded[N] | undefined {
  return loadCollection(name, rootDir).find((e) => e.slug === slug);
}

export const getServices = () => loadCollection("services");
export const getIndustries = () => loadCollection("industries");
export const getCaseStudies = () => loadCollection("case-studies");
export const getAgents = () => loadCollection("agents");
export const getInsights = () =>
  loadCollection("insights").sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
