import { test, expect, type Page } from "@playwright/test";
import { getIndustries } from "../../src/content/load";
import { industryScenes } from "../../src/components/industries/experiences";

const industries = getIndustries();
async function choose(page: Page, id: string) {
  const industry = industries.find((item) => item.slug === id)!;
  const scene = industryScenes.find((item) => item.id === id)!;
  const select = page.getByRole("combobox", { name: "Choose an industry" });
  if (await select.isVisible()) await select.selectOption({ label: industry.title });
  else await page.getByRole("button", { name: scene.label, exact: true }).click();
}

test.describe("poster-first industry experiences", () => {
  test.use({ reducedMotion: "reduce" });

  test("keeps the art full-width, frameless and centered on every screen size", async ({ page }) => {
    await page.goto("/industries");
    const hero = page.getByRole("region", { name: "Industry experience" });
    const visual = page.getByRole("region", { name: "Logistics & Supply Chain environment" });
    await expect(visual).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "All industry guides" }).getByRole("link")).toHaveCount(7);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("text-align", "center");
      const box = (await visual.boundingBox())!;
      expect(Math.abs(box.x)).toBeLessThan(1);
      expect(Math.abs(box.width - width)).toBeLessThan(1);
      for (const surface of [hero, visual]) {
        await expect(surface).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(surface).toHaveCSS("box-shadow", "none");
        await expect(surface).toHaveCSS("border-top-width", "0px");
      }
      const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
      expect(title.y + title.height).toBeLessThan(box.y);
    }
    for (const scene of industryScenes) {
      await choose(page, scene.id);
      await expect(hero).toHaveAttribute("data-industry", scene.id);
      await expect(hero.getByRole("img")).toHaveAttribute("src", `/posters/industry-${scene.id}.svg`);
      await page.getByRole("button", { name: scene.spots[2].title, exact: true }).click();
      await expect(page.getByRole("status")).toContainText(scene.spots[2].detail);
      await expect(page.getByRole("link", { name: `Explore ${scene.label}` })).toHaveAttribute("href", `/industries/${scene.id}`);
    }
  });

  test("each dedicated landing page has its own centered hero and preserves its content", async ({ page }) => {
    for (const industry of industries) {
      await page.goto(`/industries/${industry.slug}`);
      const visual = page.getByRole("region", { name: `${industry.title} environment` });
      await expect(visual).toHaveAttribute("data-scene", industry.slug);
      await expect(visual.getByRole("img")).toHaveAttribute("src", `/posters/industry-${industry.slug}.svg`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(industry.title);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("text-align", "center");
      await expect(page.getByText(industry.compliance[0], { exact: true })).toBeVisible();
      await expect(page.locator("canvas")).toHaveCount(0);
      await page.getByRole("link", { name: "Explore the workflows" }).click();
      await expect(page).toHaveURL(new RegExp(`/industries/${industry.slug}#industry-workflows$`));
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
        expect(Math.abs((await visual.boundingBox())!.width - width)).toBeLessThan(1);
      }
    }
  });
});

test("keeps workflow exploration available without WebGL", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, id: string, options?: unknown) {
        return id === "webgl" || id === "webgl2" ? null : original.call(this, id, options);
      },
    });
  });
  await page.goto("/industries");
  await expect(page.getByRole("button", { name: "Load 3D view" })).toBeVisible();
  await choose(page, "public-sector");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Public Sector environment" }).getByRole("img")).toBeVisible();
  await page.getByRole("button", { name: "Records requests", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("preserving access and retention rules");
});

test("renders distinct animated worlds, pauses, rotates and handles context loss", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/industries");
  const hero = page.getByRole("region", { name: "Industry experience" });
  await expect(hero.getByRole("region")).toHaveAttribute("aria-busy", "false");
  const load = page.getByRole("button", { name: "Load 3D view" });
  if (await load.isVisible()) await load.click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const canvas = hero.locator("canvas");
  await expect(canvas).toHaveCount(1);
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const frozen = await canvas.screenshot();
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(frozen)).toBe(true);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(frozen)).toBe(false);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const images = new Set<string>();
  for (const scene of industryScenes) {
    await choose(page, scene.id);
    await canvas.scrollIntoViewIfNeeded();
    await expect(hero.getByRole("region")).toHaveAttribute("data-scene", scene.id);
    await expect(hero.getByRole("region")).toHaveAttribute("data-playing", "false");
    await page.waitForTimeout(200);
    images.add((await canvas.screenshot()).toString("base64"));
    await page.getByRole("button", { name: scene.spots[1].title, exact: true }).click();
    await expect(hero.getByRole("region")).toHaveAttribute("data-focus", "1");
  }
  expect(images.size).toBe(7);
  await page.getByRole("button", { name: "Rotate industry left" }).click();
  await expect(hero.getByRole("region")).toHaveAttribute("data-angle", "-0.3");
  await page.getByRole("button", { name: "Reset industry view" }).click();
  await expect(hero.getByRole("region")).toHaveAttribute("data-angle", "0");
  await canvas.evaluate((el) => el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.getByText(/The 3D view is unavailable/)).toBeVisible();
  await expect(canvas).toHaveCount(0);
  await expect(hero.getByRole("img")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});
