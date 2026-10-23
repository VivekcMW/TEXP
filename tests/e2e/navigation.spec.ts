import { test, expect, type Page } from "@playwright/test";
import { siteConfig } from "../../site.config";

test.use({ reducedMotion: "reduce" });

async function navigate(page: Page, label: string) {
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  const toggle = nav.getByRole("button", { name: "Open menu" });
  if (await toggle.isVisible()) await toggle.click();
  await nav.getByRole("link", { name: label, exact: true }).click();
}

test("primary links, contact, home and browser history navigate to the correct content", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const destination of [
    { label: "Services", path: "/services", title: "Start with the work. Build what fits." },
    { label: "Agents", path: "/agents", title: /Meet the agents/ },
    { label: "Industries", path: "/industries", title: "AI built around your industry." },
    { label: "Examples", path: "/case-studies", title: /The work\. The thinking behind it/ },
    { label: "About", path: "/about", title: "Why this company exists" },
    { label: "Discuss your workflow", path: "/contact", title: "Let’s talk about your workflow" },
  ]) {
    await navigate(page, destination.label);
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(destination.title);
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    const nav = page.getByRole("navigation", { name: "Primary", exact: true });
    const narrow = await nav.getByRole("button", { name: "Open menu" }).isVisible();
    if (narrow) await nav.getByRole("button", { name: "Open menu" }).click();
    await expect(nav.getByRole("link", { name: destination.label, exact: true })).toHaveAttribute("aria-current", "page");
    if (narrow) await page.keyboard.press("Escape");
  }
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Why this company exists");
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let’s talk about your workflow");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: siteConfig.name, exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your work");
  expect(errors).toEqual([]);
});

test("current-page taps, resizing, keyboard and logo navigation never leave a blocking menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/agents");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  const toggle = nav.getByRole("button", { name: /menu$/i });
  await toggle.click();
  await nav.getByRole("link", { name: "Agents", exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.setViewportSize({ width: 975, height: 857 });
  await toggle.click();
  await expect(nav.getByRole("link", { name: "Discuss your workflow", exact: true })).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await nav.getByRole("link", { name: siteConfig.name, exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await nav.getByRole("link", { name: siteConfig.name, exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await page.setViewportSize({ width: 390, height: 844 });
  await toggle.click();
  await nav.getByRole("link", { name: "Discuss your workflow", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("footer destinations and nested-page navigation remain usable", async ({ page }) => {
  await page.goto("/services/ai-automation");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  if (await nav.getByRole("button", { name: "Open menu" }).isVisible()) {
    await nav.getByRole("button", { name: "Open menu" }).click();
  }
  await expect(nav.getByRole("link", { name: "Services", exact: true })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Start with the work. Build what fits.");

  const footer = page.getByRole("contentinfo");
  for (const destination of [
    { name: "Healthcare", path: "/industries/healthcare", title: "Healthcare" },
    { name: "Custom AI Agents", path: "/services/custom-ai-agents", title: "Custom AI Agents" },
    { name: "Agents we build", path: "/agents", title: /Meet the agents/ },
    { name: "Privacy", path: "/privacy", title: "Privacy information" },
    { name: "Terms", path: "/terms", title: "Terms of use" },
  ]) {
    await footer.getByRole("link", { name: destination.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(destination.title);
  }
});
