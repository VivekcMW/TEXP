import { test, expect } from "@playwright/test";
import { getInsights } from "../../src/content/load";

test("Insights is absent from navigation, public routes and the sitemap", async ({ page }) => {
  await page.goto("/case-studies");
  await expect(page.locator('a[href^="/insights"]')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Insights" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  for (const route of ["/insights", ...getInsights().flatMap((article) => [`/insights/${article.slug}`, `/insights/${article.slug}/opengraph-image`])]) {
    expect((await page.request.get(route)).status(), route).toBe(404);
  }
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("/insights");
});
