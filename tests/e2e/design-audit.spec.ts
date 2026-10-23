import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("homepage has a focused journey and brings its message into the opening screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main > section")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Four moves, repeated until the work is done" })).toHaveCount(0);
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.locator("footer .btn")).toHaveCount(0);
  const headline = (await page.locator("h1").boundingBox())!;
  expect(headline.y).toBeLessThan(800);
  await expect(page.getByRole("link", { name: "Use the workflow discussion guide" })).toHaveAttribute("href", "/tools/ai-roi-calculator");
  for (const link of await page.locator('main a[data-cta="primary"]').all()) await expect(link).toHaveAttribute("href", "/contact");
});

test("detail pages have unique headings, scoped content and expandable permissions", async ({ page }) => {
  for (const route of ["/services/ai-automation", "/industries/logistics", "/case-studies/logistics-claims-automation"]) {
    await page.goto(route);
    const headings = await page.locator("main h2").allTextContents();
    expect(new Set(headings).size, route).toBe(headings.length);
    await expect(page.getByRole("heading", { name: "Where the cost hides" })).toHaveCount(0);
  }
  await page.goto("/services/ai-automation");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.goto("/agents/claims-intake");
  const permissions = page.locator("details").filter({ has: page.getByRole("heading", { name: "Tools and permissions" }) });
  await expect(permissions).not.toHaveAttribute("open");
  await permissions.locator("summary").click();
  await expect(permissions).toHaveAttribute("open", "");
});

test("contact offers email when online enquiries are off and cannot fake a confirmation", async ({ page }) => {
  await page.goto("/contact?sent=1");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Email hello@technocient.ai" })).toHaveAttribute("href", /^mailto:hello@technocient\.ai/);
  await expect(page.getByText(/preview|Booking is not enabled/i)).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('a[href*="example.com"], a[href*="cal.com/example"]')).toHaveCount(0);
  await expect(page.getByText(/Your test enquiry was saved/)).toHaveCount(0);
  const response = await page.request.post("/api/leads", { data: { source: "contact", email: "synthetic@example.invalid" } });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ ok: false });
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
});

test("mobile navigation follows nested routes and the primary action stays on-site", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services/ai-automation");
  await page.getByRole("button", { name: "Open menu" }).click();
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Services", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Discuss your workflow" })).toHaveCount(1);
  await nav.getByRole("link", { name: "Discuss your workflow" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
