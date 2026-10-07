import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { loadCollection, getBySlug } from "@/content/load";
import { validateContent } from "@/content/validate";

const fixtures = path.resolve(__dirname, "../fixtures/content");

describe("loadCollection", () => {
  it("loads services with slug and body", () => {
    const services = loadCollection("services", fixtures);
    expect(services).toHaveLength(1);
    expect(services[0].slug).toBe("ai-automation");
    expect(services[0].body).toContain("Body text here.");
  });
  it("getBySlug returns undefined for unknown slug", () => {
    expect(getBySlug("services", "nope", fixtures)).toBeUndefined();
  });
  it("throws with file path and field on invalid frontmatter", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.mkdirSync(path.join(tmp, "services"));
    const src = fs.readFileSync(path.join(fixtures, "services/ai-automation.mdx"), "utf8");
    fs.writeFileSync(path.join(tmp, "services/bad.mdx"), src.replace("title: AI Automation Consulting for Enterprises", "title: " + "x".repeat(61)));
    expect(() => loadCollection("services", tmp)).toThrow(/services\/bad\.mdx: seo\.title must be 60 characters or fewer/);
  });
});

describe("validateContent", () => {
  it("passes on consistent fixtures", () => {
    expect(validateContent(fixtures)).toEqual({ ok: true });
  });
  it("fails on a dangling case study reference", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.cpSync(fixtures, tmp, { recursive: true });
    const p = path.join(tmp, "services/ai-automation.mdx");
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("caseStudy: logistics-claims-automation", "caseStudy: missing-study"));
    const r = validateContent(tmp);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/services\/ai-automation\.mdx: caseStudy "missing-study" does not exist/);
  });
  it("allows a service to link a case study tagged with a different service", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.cpSync(fixtures, tmp, { recursive: true });
    const p = path.join(tmp, "case-studies/logistics-claims-automation.mdx");
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("service: ai-automation", "service: custom-ai-agents"));
    fs.copyFileSync(path.join(tmp, "services/ai-automation.mdx"), path.join(tmp, "services/custom-ai-agents.mdx"));
    expect(validateContent(tmp)).toEqual({ ok: true });
  });
});
