import { test, expect } from "@playwright/test";
import { getAgents, getCaseStudies, getIndustries, getServices } from "../../src/content/load";
import { assessmentQuestions } from "../../src/lib/workflow-assessment";

const numericClaim = /[$£€]\s*\d|\b\d[\d,.]*\s*(?:%|percent\b)|\b(?:\d+(?:[–-]\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|twelve|sixteen|twenty|thirty|forty|ninety)[ -](?:working[ -])?(?:days?|hrs?|hours?|weeks?|months?|minutes?|mins?|seconds?)\b/i;
const routes = [
  "/", "/agents", "/services", "/industries", "/case-studies", "/about", "/contact", "/privacy", "/terms", "/tools/ai-roi-calculator",
  ...getServices().map((e) => `/services/${e.slug}`),
  ...getIndustries().map((e) => `/industries/${e.slug}`),
  ...getCaseStudies().map((e) => `/case-studies/${e.slug}`),
  ...getAgents().map((e) => `/agents/${e.slug}`),
];

test("public pages and metadata contain no fixed cost or turnaround claims", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Content is identical across browsers.");
  test.setTimeout(180_000);
  await page.goto("/agents");
  for (const route of routes) {
    const response = await page.request.get(route);
    expect(response.ok(), route).toBe(true);
    const copy = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const visibleCopy = [...doc.querySelectorAll("main, footer, header")].map((el) => {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("script, style").forEach((node) => node.remove());
        return clone.textContent ?? "";
      }).join(" ");
      const metadata = [...doc.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')].map((el) => el.getAttribute("content")).join(" ");
      const structured = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((el) => el.textContent).join(" ");
      return `${doc.title} ${visibleCopy} ${metadata} ${structured}`.replace(/\s+/g, " ");
    }, await response.text());
    const marketingCopy = route === "/privacy" ? copy.replace("24 months", "the retention period").replace("30 days", "the legal response period") : copy;
    expect(marketingCopy, route).not.toMatch(numericClaim);
    expect(copy, route).not.toMatch(/AI ROI calculator|Estimated annual saving|three measured results|from \$|before: hours per case|after: minutes per case/i);
  }
});

for (const route of ["/tools/ai-roi-calculator"]) {
  test(`qualitative assessment works without numeric defaults or an email gate on ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "View discussion guide" }) });
    await expect(form.getByRole("radio")).toHaveCount(9);
    await expect(form.locator('input:checked, input[type="number"], input[type="range"], input[type="email"]')).toHaveCount(0);
    await form.getByRole("button", { name: "View discussion guide" }).click();
    await expect(page.getByText("Explore a carefully scoped pilot.", { exact: true })).toHaveCount(0);
    for (const question of assessmentQuestions) {
      await form.getByRole("group", { name: question.question }).getByRole("radio", { name: question.options[0].label }).check();
    }
    await form.getByRole("button", { name: "View discussion guide" }).click();
    await expect(page.getByText("Explore a carefully scoped pilot.", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Assessment guidance" })).toBeFocused();
    await form.getByRole("radio", { name: "Data or access gaps remain" }).check();
    await expect(page.getByText("Explore a carefully scoped pilot.", { exact: true })).toHaveCount(0);
    await form.getByRole("button", { name: "View discussion guide" }).click();
    await expect(page.getByText("Prepare the foundations first.", { exact: true })).toBeVisible();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
    expect(await page.getByRole("region", { name: "Assessment guidance" }).innerText()).not.toMatch(numericClaim);
  });
}
