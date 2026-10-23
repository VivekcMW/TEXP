import { test, expect, type Page } from "@playwright/test";

async function disableWebGL(page: Page) {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, id: string, options?: unknown) {
        return id === "webgl" || id === "webgl2" ? null : getContext.call(this, id, options);
      },
    });
  });
}

test.describe("office layout and accessible scenes", () => {
  test.use({ reducedMotion: "reduce" });

  test("leads with the office, centers the copy and removes steps and sample text", async ({ page }) => {
    await page.goto("/");
    const office = page.getByRole("region", { name: "Interactive AI operations office" });
    await expect(office.getByRole("img")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(office.getByText("Sample workflow")).toHaveCount(0);
    await expect(office.getByText("The operations floor")).toHaveCount(0);
    await expect(office.getByText("n.", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Trusted by operations leaders at")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Proof", exact: true })).toHaveCount(0);
    await expect(page.locator('img[src^="/logos/"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Recognisable work. A different approach." })).toBeVisible();
    await expect(office.getByRole("group", { name: "Explore an office role" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Same process. Less busywork." })).toHaveCount(0);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      const officeBox = await office.boundingBox();
      const headline = page.getByRole("heading", { level: 1 });
      expect((await headline.boundingBox())!.y).toBeGreaterThan(officeBox!.y + officeBox!.height);
      await expect(headline).toHaveCSS("text-align", "center");
      for (const surface of [office, office.getByRole("img").locator("..")]) {
        await expect(surface).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(surface).toHaveCSS("background-image", "none");
        await expect(surface).toHaveCSS("box-shadow", "none");
        await expect(surface).toHaveCSS("border-radius", "0px");
        for (const side of ["top", "right", "bottom", "left"]) {
          await expect(surface).toHaveCSS(`border-${side}-width`, "0px");
        }
      }
    }
  });

  test("keeps role inspection keyboard accessible without a numbered strip", async ({ page }) => {
    await page.goto("/");
    const office = page.getByRole("region", { name: "Interactive AI operations office" });
    await office.getByRole("combobox", { name: "Meet the team" }).selectOption("review");
    await expect(office.getByText("Required approval cannot be skipped.")).toBeVisible();
    await office.getByRole("combobox", { name: "Meet the team" }).focus();
    await page.keyboard.press("Escape");
    await expect(office.getByText("Required approval cannot be skipped.")).toHaveCount(0);
    await office.getByRole("combobox", { name: "Meet the team" }).selectOption("research");
    await expect(office.getByText("Only accesses records you have permitted.")).toBeVisible();
  });

  test("manually explores simulated review and exceptions with reduced motion", async ({ page }) => {
    await page.goto("/");
    const office = page.getByRole("region", { name: "Interactive AI operations office" });
    await office.getByRole("button", { name: "Prior authorisation", exact: true }).click();
    for (let i = 0; i < 3; i++) await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toContainText("Simulated human approval");
    for (let i = 0; i < 2; i++) await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toContainText("Payer decision pending.");
    await office.getByRole("button", { name: "Returns", exact: true }).click();
    await office.getByRole("button", { name: "Show an exception" }).click();
    for (let i = 0; i < 4; i++) await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toContainText("No label or refund is issued.");
    await expect(office.getByRole("status")).toContainText("Safely handed to your team.");
    await expect(office.getByRole("button", { name: /next scene/i })).toHaveCount(0);
    await expect(office.getByText("Opening your AI office", { exact: false })).toHaveCount(0);
  });
});

test("automatically reviews, completes and loops without WebGL or user approval", async ({ page }) => {
  await disableWebGL(page);
  await page.clock.install();
  await page.goto("/");
  const office = page.getByRole("region", { name: "Interactive AI operations office" });
  await expect(office.getByRole("button", { name: "Pause" })).toBeEnabled();
  await page.clock.runFor(2000);
  await page.clock.runFor(18_000);
  await expect(office.getByRole("status")).toContainText("Simulated human approval");
  await page.clock.runFor(12_000);
  await expect(office.getByRole("status")).toContainText("Workflow complete.");
  await page.clock.runFor(5000);
  await expect(office.getByRole("status")).toContainText("Turning an email into a claim");
  await office.getByRole("button", { name: "Pause" }).click();
  await page.clock.runFor(30_000);
  await expect(office.getByRole("status")).toContainText("Turning an email into a claim");
  await expect(office.locator("canvas")).toHaveCount(0);
  await expect(office.getByRole("img")).toHaveCSS("opacity", "1");
});

test("renders moving agents, clickable desks and view controls; recovers on context loss", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  const office = page.getByRole("region", { name: "Interactive AI operations office" });
  const webgl = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl2"));
  test.skip(!webgl, "WebGL2 is unavailable");
  await office.scrollIntoViewIfNeeded();
  await expect(office.getByRole("button", { name: "Pause", exact: true })).toBeEnabled();
  const load = office.getByRole("button", { name: "Load 3D office" });
  if (await load.count()) await load.click();
  await expect(office.getByText("Interactive 3D")).toBeVisible({ timeout: 30_000 });
  const canvas = office.locator("canvas");
  await expect(canvas).toBeVisible();
  const first = await canvas.screenshot();
  await page.waitForTimeout(1400);
  expect((await canvas.screenshot()).equals(first), "the rendered office actually animates").toBe(false);
  await office.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await canvas.screenshot();
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(paused), "Pause freezes the 3D animation").toBe(true);
  await office.getByRole("button", { name: "Meet Research", exact: true }).click();
  await expect(office.getByText("Only accesses records you have permitted.")).toBeVisible();
  await office.getByRole("button", { name: "Close role details" }).click();
  const initialView = await canvas.screenshot();
  await office.getByRole("button", { name: "Rotate office left" }).click();
  expect((await canvas.screenshot()).equals(initialView), "view controls rotate the office").toBe(false);
  await office.getByRole("button", { name: "Reset office view" }).click();
  expect(errors).toEqual([]);
  await canvas.evaluate((element) => element.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(office.getByText(/3D view unavailable/)).toBeVisible();
  await expect(office.getByRole("img")).toHaveCSS("opacity", "1");
  await expect(canvas).toHaveCount(0);
  await office.getByRole("button", { name: /next scene/i }).click();
  await expect(office.getByRole("combobox", { name: "Meet the team" })).toBeEnabled();
});
