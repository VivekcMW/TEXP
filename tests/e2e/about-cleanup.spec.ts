import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

test("all public pages omit breadcrumbs and retired statements", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "The server-rendered content is shared between browsers.");
  test.setTimeout(180_000);
  for (const entry of sitemap()) {
    const route = entry.url.replace(siteConfig.domain, "");
    const response = await page.request.get(route);
    expect(response.ok(), route).toBe(true);
    const html = await response.text();
    expect(html, route).not.toMatch(/aria-label="Breadcrumb"|BreadcrumbList|GDPR-aligned|SOC 2 on the roadmap|Working across|Markets:|areaServed/);
    expect(html, route).not.toContain("Founder Name");
  }
});

test("About copy is centered at every width and retains its contact action", async ({ page }) => {
  await page.goto("/about");
  const heading = page.getByRole("heading", { name: "Why this company exists", exact: true });
  const intro = page.locator("section").filter({ has: heading });
  await expect(page.getByRole("heading", { name: "The team", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Meet the team", exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toHaveCount(0);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const block of [heading, intro.getByText(siteConfig.positioning, { exact: true }), intro.getByText(/Useful AI starts/).locator("..")]) {
      await expect(block).toHaveCSS("text-align", "center");
      const box = (await block.boundingBox())!;
      expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(1);
    }
    for (const paragraph of await intro.locator("p").all()) await expect(paragraph).toHaveCSS("text-align", "center");
  }
  await intro.getByRole("link", { name: "Discuss your workflow", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("workflow");
});
