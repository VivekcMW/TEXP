import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

const paths = sitemap().map((e) => e.url.replace(siteConfig.domain, ""));

for (const path of paths) {
  test(`route ${path} meets the page contract`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical").toBe(siteConfig.domain + (path === "/" ? "" : path) || siteConfig.domain + "/");
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    // Not every page needs a structured-data type; validate every published block.
    for (const s of ld) expect(() => JSON.parse(s)).not.toThrow();
    if (!["/privacy", "/terms", "/contact"].includes(path)) await expect(page.locator('[data-cta="primary"]').first()).toBeVisible();
    if (path === "/contact") await expect(page.getByRole("link", { name: "Email hello@technocient.ai" })).toBeVisible();
    expect(errors, "no console errors").toEqual([]);
  });
}
