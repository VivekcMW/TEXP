import { test, expect } from "@playwright/test";
import { getCaseStudies } from "../../src/content/load";
import { caseStudyEditorials } from "../../src/components/case-studies/library";

test("editorial case studies remain responsive and do not request WebGL", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const requests: string[] = [];
    Object.defineProperty(window, "__requestedWebgl", { value: requests });
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, id: string, options?: unknown) {
        if (id === "webgl" || id === "webgl2") requests.push(id);
        return original.call(this, id, options);
      },
    });
  });
  await page.goto("/case-studies");
  const collection = page.getByLabel("Case study results", { exact: true });
  await expect(collection.getByRole("article")).toHaveCount(6);
  await expect(page.getByText(/illustrative/i)).toHaveCount(0);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const first = (await collection.getByRole("article").nth(0).boundingBox())!;
    const second = (await collection.getByRole("article").nth(1).boundingBox())!;
    if (width < 768) {
      expect(second.y).toBeGreaterThan(first.y + first.height);
      await expect(page.getByRole("combobox", { name: "Industry", exact: true })).toBeVisible();
    } else {
      expect(Math.abs(first.y - second.y)).toBeLessThan(1);
      expect(second.x).toBeGreaterThan(first.x);
    }
  }
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(await page.evaluate(() => Reflect.get(window, "__requestedWebgl"))).toEqual([]);
  expect(errors).toEqual([]);
});

test("filters and resets the library with working detail routes", async ({ page }) => {
  await page.goto("/case-studies");
  const collection = page.getByLabel("Case study results", { exact: true });
  for (const editorial of caseStudyEditorials) {
    const industry = getCaseStudies().find((study) => study.slug === editorial.slug)!.industry;
    const select = page.getByRole("combobox", { name: "Industry", exact: true });
    if (await select.isVisible()) await select.selectOption(industry);
    else await page.getByRole("group", { name: "Filter case studies by industry" }).getByRole("button", { name: editorial.label, exact: true }).click();
    await expect(collection.getByRole("article")).toHaveCount(1);
    await expect(collection.getByRole("article")).toHaveAttribute("data-case-study", editorial.slug);
    await expect(collection.getByRole("link")).toHaveAttribute("href", `/case-studies/${editorial.slug}`);
  }
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(collection.getByRole("article")).toHaveCount(6);
  const select = page.getByRole("combobox", { name: "Industry", exact: true });
  if (await select.isVisible()) await select.selectOption("healthcare");
  else await page.getByRole("button", { name: "Healthcare", exact: true }).click();
  const reset = page.getByRole("button", { name: "Reset filters", exact: true });
  await reset.focus();
  await expect(reset).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(collection.getByRole("article")).toHaveCount(6);
  await page.getByRole("link", { name: "Read the workflow" }).click();
  await expect(page).toHaveURL(/\/case-studies\/logistics-claims-automation$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Claims preparation with evidence and adjuster oversight");
});

test("the complete collection is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    const response = await page.goto("/case-studies");
    expect(response?.ok()).toBe(true);
    const collection = page.getByLabel("Case study results", { exact: true });
    await expect(collection.getByRole("link")).toHaveCount(6);
    await expect(page.getByRole("link", { name: "Read the workflow" })).toHaveAttribute("href", "/case-studies/logistics-claims-automation");
    await expect(collection.getByText("Illustrative example", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
