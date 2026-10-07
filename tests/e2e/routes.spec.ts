import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

const paths = sitemap().map((e) => e.url.replace(siteConfig.domain, ""));

for (const path of paths) {
  test(`route ${path} meets the page contract`, async ({ page }) => {
    const errors: string[] = [];
    // Same-origin errors only: the placeholder booking URL's iframe 404s from cal.com until a real one is configured.
    page.on("console", (m) => {
      const url = m.location().url ?? "";
      if (m.type() === "error" && (url === "" || url.startsWith("http://localhost:3100"))) errors.push(`${m.text()} (${url})`);
    });
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical").toBe(siteConfig.domain + (path === "/" ? "" : path) || siteConfig.domain + "/");
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length, "has json-ld").toBeGreaterThan(0);
    for (const s of ld) expect(() => JSON.parse(s)).not.toThrow();
    if (!["/privacy", "/terms"].includes(path)) await expect(page.locator('[data-cta="primary"]').first()).toBeVisible();
    expect(errors, "no console errors").toEqual([]);
  });
}
