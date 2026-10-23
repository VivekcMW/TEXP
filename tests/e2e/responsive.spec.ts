import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

/** Every route, at phone, tablet and desktop widths, in every configured browser:
 *  no horizontal overflow, one visible h1, the primary nav reachable (menu on small screens, links on large). */
const paths = sitemap().map((e) => e.url.replace(siteConfig.domain, ""));
const widths = [320, 390, 768, 1024, 1440];

for (const path of paths) {
  test(`route ${path} lays out at every width`, async ({ page }) => {
    await page.goto(path);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(150);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(scrollWidth, `${path} overflows at ${width}px`).toBeLessThanOrEqual(clientWidth);
      await expect(page.locator("h1").first(), `${path} h1 at ${width}px`).toBeVisible();
      if (width < 1024) {
        await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
      } else {
        await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })).toBeVisible();
      }
    }
  });
}

test("mobile menu opens, lists the primary links and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const label of ["Services", "Agents", "Industries", "Examples", "About"]) {
    await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
