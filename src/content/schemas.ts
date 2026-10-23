import { z } from "zod";

export const DIAGRAM_IDS = ["rag-pipeline", "agent-loop", "automation-flow", "enterprise-stack", "engagement-model", "before-after"] as const;
export type DiagramId = (typeof DIAGRAM_IDS)[number];

const Seo = z.object({
  title: z.string().min(10).max(60, "must be 60 characters or fewer"),
  description: z.string().min(50).max(155, "must be 155 characters or fewer"),
});
const Faq = z.array(z.object({ q: z.string().min(5), a: z.string().min(10) })).min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a kebab-case slug");

export const ServiceSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  targetQuery: z.string().min(3),
  problem: z.string().min(20),
  approach: z.array(z.string().min(3)).min(3),
  deliverables: z.array(z.string().min(3)).min(2),
  timeline: z.string().min(20),
  caseStudy: slug,
  faq: Faq,
  diagram: z.enum(DIAGRAM_IDS),
  scene: z.enum(["agentic-field", "rag-pipeline", "automation-loop", "enterprise-stack"]).optional(),
  seo: Seo,
});

export const IndustrySchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  targetQuery: z.string().min(3),
  pains: z.array(z.string().min(10)).min(3),
  compliance: z.array(z.string().min(5)).min(1),
  caseStudy: slug,
  services: z.array(slug).min(1),
  faq: Faq,
  seo: Seo,
});

export const CaseStudySchema = z.object({
  title: z.string().min(3),
  client: z.string().min(3),
  industry: slug,
  service: slug,
  situation: z.string().min(40),
  built: z.string().min(40),
  result: z.object({
    summary: z.string().min(20),
    date: z.string().regex(/^\d{4}-\d{2}$/, "must be YYYY-MM"),
  }),
  before: z.string().min(2).optional(),
  after: z.string().min(2).optional(),
  illustrative: z.boolean(),
  diagram: z.enum(DIAGRAM_IDS),
  seo: Seo,
});

export const AgentSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  unit: z.string().min(3),
  trigger: z.string().min(10),
  autonomy: z.string().min(20),
  steps: z.array(z.object({ label: z.string().min(3), tool: z.string().min(3), detail: z.string().min(3) })).min(3),
  tools: z.array(z.object({ name: z.string().min(3), reads: z.string().min(3), writes: z.string().min(3), approval: z.enum(["none", "threshold", "always"]) })).min(2),
  gates: z.array(z.string().min(10)).min(1),
  evidence: z.array(z.string().min(10)).min(1),
  industry: slug,
  service: slug,
  caseStudy: slug,
  diagram: z.enum(DIAGRAM_IDS),
  seo: Seo,
});

export const InsightSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string().min(2),
  targetQuery: z.string().min(3),
  relatedServices: z.array(slug).min(1),
  faq: Faq,
  seo: Seo,
});

export type ServiceFrontmatter = z.infer<typeof ServiceSchema>;
export type IndustryFrontmatter = z.infer<typeof IndustrySchema>;
export type CaseStudyFrontmatter = z.infer<typeof CaseStudySchema>;
export type InsightFrontmatter = z.infer<typeof InsightSchema>;
export type AgentFrontmatter = z.infer<typeof AgentSchema>;

type WithSlugBody<T> = T & { slug: string; body: string };
export type Service = WithSlugBody<ServiceFrontmatter>;
export type Industry = WithSlugBody<IndustryFrontmatter>;
export type CaseStudy = WithSlugBody<CaseStudyFrontmatter>;
export type Insight = WithSlugBody<InsightFrontmatter>;
export type Agent = WithSlugBody<AgentFrontmatter>;

export const collections = {
  services: ServiceSchema,
  industries: IndustrySchema,
  "case-studies": CaseStudySchema,
  insights: InsightSchema,
  agents: AgentSchema,
} as const;
export type CollectionName = keyof typeof collections;
