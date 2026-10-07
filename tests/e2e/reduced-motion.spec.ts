import { test, expect } from "@playwright/test";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  for (const path of ["/", "/services/llm-rag-integration"]) {
    test(`${path} shows posters and mounts no canvas`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(2500);
      await expect(page.locator('img[src^="/posters/"]').first()).toBeVisible();
      await expect(page.locator("canvas")).toHaveCount(0);
    });
  }
});

test("/ mounts a canvas when motion is allowed and WebGL exists", async ({ page }) => {
  await page.goto("/");
  const webgl = await page.evaluate(() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } });
  test.skip(!webgl, "no WebGL in this browser build");
  await expect(page.locator("canvas").first()).toBeAttached({ timeout: 15_000 });
});
