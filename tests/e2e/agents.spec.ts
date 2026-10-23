import { test, expect, type Locator, type Page } from "@playwright/test";
import { agentPresentations, DEMO_STEP_MS } from "../../src/components/agents/showcase";
import { getAgents } from "../../src/content/load";

const agents = getAgents();
async function choose(page: Page, title: string) {
  const select = page.getByRole("combobox", { name: "Choose your specialist" });
  if (await select.isVisible()) await select.selectOption({ label: title });
  else await page.getByRole("button", { name: title, exact: true }).click();
}

async function captureArtwork(artwork: Locator) {
  await artwork.evaluate((element) => element.scrollIntoView({ block: "center" }));
  return artwork.screenshot({ scale: "css" });
}

async function changedPixels(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(async ([first, second]) => {
    const decode = async (base64: string) => {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const image = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Screenshot comparison requires a 2D context.");
      context.drawImage(image, 0, 0);
      image.close();
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const [a, b] = await Promise.all([decode(first), decode(second)]);
    if (a.length !== b.length) throw new Error("Artwork dimensions changed during selection.");
    let changed = 0;
    for (let i = 0; i < a.length; i += 4) {
      if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) > 24) changed++;
    }
    return changed / (a.length / 4);
  }, [first.toString("base64"), second.toString("base64")]);
}

test.describe("accessible Agents showroom", () => {
  test.use({ reducedMotion: "reduce" });

  test("is frameless, centered and responsive without loading WebGL", async ({ page }) => {
    await page.goto("/agents");
    const workbench = page.getByRole("region", { name: "Interactive agent workbench" });
    await expect(workbench).toHaveAttribute("aria-busy", "false");
    await expect(page.getByText("Illustrative demonstration", { exact: true })).toHaveCount(0);
    await expect(page.getByText(/A scripted example, not a live system/)).toHaveCount(0);
    await expect(workbench.getByRole("status")).toHaveClass("sr-only");
    await expect(workbench.getByRole("status")).toHaveCSS("clip-path", "inset(50%)");
    await expect(workbench.getByRole("status")).toHaveCSS("width", "1px");
    await expect(workbench.getByRole("button", { name: /replay agent/i })).toBeVisible();
    await expect(workbench.getByRole("img")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "One agent, one process, one number" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "All agent guides" }).getByRole("link")).toHaveCount(7);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("text-align", "center");
      const artwork = page.getByRole("group", { name: "Claims intake agent workspace" });
      const name = workbench.locator("p").filter({ hasText: /^Claims intake agent$/ });
      await expect(name).toHaveCSS("text-align", "center");
      const artBox = (await artwork.boundingBox())!;
      const workbenchBox = (await workbench.boundingBox())!;
      expect(Math.abs(artBox.x + artBox.width / 2 - workbenchBox.x - workbenchBox.width / 2)).toBeLessThan(1);
      expect((await name.boundingBox())!.y).toBeGreaterThan(artBox.y + artBox.height);
      for (const surface of [workbench, page.getByRole("group", { name: "Claims intake agent workspace" })]) {
        await expect(surface).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(surface).toHaveCSS("box-shadow", "none");
        await expect(surface).toHaveCSS("border-top-width", "0px");
      }
      await expect(page.getByText(/&nearr;/)).toHaveCount(0);
      if (width < 768) await expect(page.getByRole("combobox", { name: "Choose your specialist" })).toBeVisible();
      else await expect(page.getByRole("group", { name: "Choose a specialist" })).toBeVisible();
    }
  });

  test("selects all seven specialists with their own permissions and detail links", async ({ page }) => {
    await page.goto("/agents");
    const frames: Buffer[] = [];
    const workbench = page.getByRole("region", { name: "Interactive agent workbench" });
    for (const presentation of agentPresentations) {
      const agent = agents.find((a) => a.slug === presentation.slug)!;
      await choose(page, agent.title);
      await expect(page.getByRole("region", { name: "Interactive agent workbench" })).toHaveAttribute("data-agent", agent.slug);
      await expect(page.locator("#agent-example")).toHaveAttribute("data-agent", agent.slug);
      await expect(page.getByText(presentation.request, { exact: false })).toBeVisible();
      await expect(page.getByRole("link", { name: "View full agent details" })).toHaveAttribute("href", `/agents/${agent.slug}`);
      await expect(page.getByText(agent.gates[0], { exact: true })).toBeVisible();
      await page.getByText("See tools and permissions", { exact: true }).click();
      for (const tool of agent.tools) await expect(page.getByText(tool.name, { exact: true })).toBeVisible();
      await expect(page.getByText("Illustrative workflow example", { exact: true })).toBeVisible();
      const poster = workbench.getByRole("img", { name: presentation.artwork });
      await expect(poster).toHaveAttribute("src", `/posters/agent-${presentation.kind}.svg`);
      await expect(poster).toHaveJSProperty("complete", true);
      expect(await poster.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      frames.push(await captureArtwork(poster));
    }
    for (let i = 1; i < frames.length; i++) {
      expect(await changedPixels(page, frames[i - 1], frames[i]), "Static artwork must visibly change, not just its label").toBeGreaterThan(.015);
    }
    const response = await page.request.get("/agents/permit-checks");
    expect(response.ok()).toBe(true);
  });

  test("keeps manual decisions before execution and ends permits at a human handoff", async ({ page }) => {
    await page.goto("/agents");
    await choose(page, "Prior authorisation agent");
    const office = page.getByRole("region", { name: "Interactive agent workbench" });
    for (let i = 0; i < 3; i++) await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toHaveText("Simulated human approval.");
    await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toHaveText("Submits to the payer portal");
    await choose(page, "Permit completeness agent");
    for (let i = 0; i < 5; i++) await office.getByRole("button", { name: /next scene/i }).click();
    await expect(office.getByRole("status")).toHaveText("Ready for your team's decision.");
    await expect(office.getByRole("button", { name: /next scene/i })).toBeDisabled();
    await office.getByRole("button", { name: /replay agent/i }).click();
    await expect(office.getByRole("status")).toHaveText("Reads the application");
  });
});

test("autoplays and pauses with a static fallback when WebGL is absent", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, id: string, options?: unknown) {
        return id === "webgl" || id === "webgl2" ? null : original.call(this, id, options);
      },
    });
  });
  await page.goto("/agents");
  const workbench = page.getByRole("region", { name: "Interactive agent workbench" });
  await expect(workbench).toHaveAttribute("aria-busy", "false");
  await page.clock.install();
  await workbench.getByRole("button", { name: /replay agent/i }).click();
  await page.clock.runFor(DEMO_STEP_MS);
  await expect(workbench.getByRole("status")).toHaveText("Checks policy and cover");
  await workbench.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.runFor(DEMO_STEP_MS * 2);
  await expect(workbench.getByRole("status")).toHaveText("Checks policy and cover");
  await expect(page.locator("canvas")).toHaveCount(0);
  await workbench.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(DEMO_STEP_MS * 5);
  await expect(workbench.getByRole("status")).toHaveText("Example complete. Every action leaves a trail.");
  await page.clock.runFor(DEMO_STEP_MS);
  await expect(workbench.getByRole("status")).toHaveText("Reads the claim pack");
  for (const presentation of agentPresentations) {
    await choose(page, agents.find((agent) => agent.slug === presentation.slug)!.title);
    await expect(workbench.getByRole("img", { name: presentation.artwork })).toHaveAttribute("src", `/posters/agent-${presentation.kind}.svg`);
    await expect(workbench.locator("canvas")).toHaveCount(0);
  }
});

test("animates a single workbench, freezes on pause, switches props and recovers from context loss", async ({ page }) => {
  // Seven shader-heavy scenes and pairwise image comparisons also run on software-rendered CI.
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/agents");
  const workbench = page.getByRole("region", { name: "Interactive agent workbench" });
  await expect(workbench).toHaveAttribute("aria-busy", "false");
  const load = page.getByRole("button", { name: "Load 3D view" });
  if (await load.isVisible()) await load.click();
  await expect(page.getByRole("group", { name: "Workbench view" })).toBeVisible({ timeout: 30_000 });
  const canvas = workbench.locator("canvas");
  await expect(canvas).toHaveCount(1);
  await page.waitForTimeout(1600);
  const first = await captureArtwork(canvas);
  await page.waitForTimeout(600);
  expect((await captureArtwork(canvas)).equals(first)).toBe(false);
  await workbench.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await captureArtwork(canvas);
  await page.waitForTimeout(500);
  expect((await captureArtwork(canvas)).equals(paused), "Pause freezes the rendered frame").toBe(true);
  await workbench.getByRole("button", { name: "Rotate workbench left" }).click();
  expect(await changedPixels(page, paused, await captureArtwork(canvas)), "Paused rotation must redraw the workspace").toBeGreaterThan(.015);
  await workbench.getByRole("button", { name: "Reset workbench view" }).click();
  const frames: Buffer[] = [];
  for (const presentation of agentPresentations) {
    await choose(page, agents.find((a) => a.slug === presentation.slug)!.title);
    await expect(workbench).toHaveAttribute("aria-busy", "false");
    await expect(workbench.getByRole("img")).toHaveCSS("opacity", "0");
    await expect(workbench.getByRole("button", { name: "Play", exact: true })).toBeVisible();
    await expect(canvas).toHaveCount(1);
    await workbench.getByRole("button", { name: /replay agent/i }).click();
    frames.push(await captureArtwork(canvas));
    await workbench.getByRole("button", { name: "Play", exact: true }).click();
    const moving = await captureArtwork(canvas);
    await page.waitForTimeout(350);
    expect(await changedPixels(page, moving, await captureArtwork(canvas)), `${presentation.label} must animate`).toBeGreaterThan(.0001);
    await workbench.getByRole("button", { name: "Pause", exact: true }).click();
    const stopped = await captureArtwork(canvas);
    await page.waitForTimeout(200);
    expect((await captureArtwork(canvas)).equals(stopped), `${presentation.label} must stay still when paused`).toBe(true);
    await workbench.getByRole("button", { name: /replay agent/i }).click();
    expect(await changedPixels(page, frames.at(-1)!, await captureArtwork(canvas)), `${presentation.label} replay restores its starting pose`).toBeLessThan(.001);
  }
  for (let i = 0; i < frames.length; i++) {
    for (let j = i + 1; j < frames.length; j++) {
      expect(await changedPixels(page, frames[i], frames[j]),
        `${agentPresentations[i].label} and ${agentPresentations[j].label} need visibly different 3D geometry`).toBeGreaterThan(.015);
    }
  }
  await choose(page, "Claims intake agent");
  await expect(workbench.getByRole("img")).toHaveCSS("opacity", "0");
  expect(await changedPixels(page, frames[0], await captureArtwork(canvas)), "Switching back restores the claims scene").toBeLessThan(.001);
  expect(errors).toEqual([]);
  await canvas.evaluate((element) => element.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(workbench.getByText(/The 3D view is unavailable/)).toBeVisible();
  await expect(canvas).toHaveCount(0);
  await expect(workbench.getByRole("img")).toHaveCSS("opacity", "1");
  for (const presentation of agentPresentations) {
    await choose(page, agents.find((agent) => agent.slug === presentation.slug)!.title);
    await expect(workbench).toHaveAttribute("data-agent", presentation.slug);
    await expect(workbench.getByRole("img", { name: presentation.artwork })).toHaveAttribute("src", `/posters/agent-${presentation.kind}.svg`);
    await expect(workbench.getByRole("img")).toHaveCSS("opacity", "1");
    await expect(canvas).toHaveCount(0);
  }
});
