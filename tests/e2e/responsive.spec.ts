import { test, expect, type Page } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

/** Every route, at phone, tablet and desktop widths, in every configured browser:
 *  no horizontal overflow, one visible h1, the primary nav reachable (menu on small screens, links on large). */
const paths = sitemap().map((e) => e.url.replace(siteConfig.domain, ""));
const widths = [320, 360, 390, 640, 767, 768, 1023, 1024, 1440, 1920, 2560];

async function expectReflow(page: Page, description: string) {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), {
    message: description,
  }).toBeLessThanOrEqual(0);
}

for (const path of paths) {
  test(`route ${path} lays out at every width`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    expect((await page.goto(path))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expectReflow(page, `${path} overflows at ${width}px`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1"), `${path} h1 at ${width}px`).toBeVisible();
      if (width < 1024) {
        await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
      } else {
        await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })).toBeVisible();
      }
    }
    expect(errors, path).toEqual([]);
  });

  test(`route ${path} reflows with 200 percent text`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    if (path.startsWith("/agents/")) {
      await page.locator("details > summary").click();
    }
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await expectReflow(page, `${path} overflows with enlarged text at ${width}px`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      for (const diagram of await page.getByRole("img", { name: /^Workflow:/ }).all()) {
        const clippedLabels = await diagram.locator("span").evaluateAll((spans) => spans
          .filter((span) => span.clientWidth > 0 && span.scrollWidth > span.clientWidth + 1)
          .map((span) => span.textContent));
        expect(clippedLabels, "workflow diagram labels must not be clipped").toEqual([]);
      }
      if (path.startsWith("/agents/")) {
        for (const gate of await page.getByText("Human gate", { exact: true }).all()) {
          const bounds = await gate.evaluate((element) => {
            const badge = element.getBoundingClientRect();
            const row = element.closest("li")!.getBoundingClientRect();
            return { left: badge.left - row.left, right: row.right - badge.right };
          });
          expect(bounds.left, "human approval labels must not be clipped").toBeGreaterThanOrEqual(0);
          expect(bounds.right, "human approval labels must not be clipped").toBeGreaterThanOrEqual(0);
        }
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

test("short landscape navigation remains scrollable after text enlargement", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 320 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.getByRole("button", { name: "Open menu" }).click();
  const panel = page.locator(".mobile-menu-panel");
  await expect.poll(async () => {
    const box = await panel.boundingBox();
    return box ? box.y + box.height : Infinity;
  }).toBeLessThanOrEqual(320);
  const about = panel.getByRole("link", { name: "About", exact: true });
  await about.scrollIntoViewIfNeeded();
  await about.click();
  await expect(page).toHaveURL(/\/about$/, { timeout: 15_000 });
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("mobile native fields avoid Safari focus zoom and role controls have touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/agents", "/industries", "/case-studies"]) {
    await page.goto(path);
    if (path === "/") await page.getByText("Explore the workflow", { exact: true }).click();
    const fields = await page.locator("select:visible, input:not([type=hidden]):not([type=radio]):visible, textarea:visible").all();
    expect(fields.length, `${path} exposes native fields`).toBeGreaterThan(0);
    for (const field of fields) {
      const size = await field.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      expect(size, `${path} native input text must be at least 16px`).toBeGreaterThanOrEqual(16);
      const box = (await field.boundingBox())!;
      expect(box.width).toBeGreaterThan(0);
      expect(box.x + box.width, `${path} input must fit the viewport`).toBeLessThanOrEqual(320);
    }
  }
  await page.goto("/");
  await page.getByText("Explore the workflow", { exact: true }).click();
  await page.getByRole("combobox", { name: "Meet the team" }).selectOption("review");
  const close = page.getByRole("button", { name: "Close role details" });
  const box = (await close.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await close.click();
  await expect(close).toHaveCount(0);
});
