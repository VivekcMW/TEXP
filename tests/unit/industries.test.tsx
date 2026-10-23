import fs from "node:fs";
import path from "node:path";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import IndustriesPage from "@/app/industries/page";
import IndustryPage, { generateStaticParams } from "@/app/industries/[slug]/page";
import { getIndustries } from "@/content/load";
import { industryScenes, toIndustryExperience } from "@/components/industries/experiences";

vi.mock("@/components/scenes/useSceneAllowed", () => ({ useSceneAllowed: () => false }));
vi.mock("@/components/Mdx", () => ({ Mdx: () => <p>Industry guidance</p> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("industry-specific experiences", () => {
  it("maps every industry to a unique environment and matching static asset", () => {
    expect(industryScenes.map((scene) => scene.id).sort()).toEqual(getIndustries().map((industry) => industry.slug).sort());
    expect(new Set(industryScenes.map((scene) => scene.alt)).size).toBe(7);
    const posters = industryScenes.map((scene) => {
      expect(scene.spots).toHaveLength(3);
      expect(JSON.stringify(scene)).not.toMatch(/[$£€]\s*\d|\d+\s*%/);
      return fs.readFileSync(path.join(process.cwd(), "public", "posters", `industry-${scene.id}.svg`), "utf8");
    });
    expect(new Set(posters).size).toBe(7);
    expect(() => toIndustryExperience({ ...getIndustries()[0], slug: "unmapped-sector" })).toThrow(/needs its own 3D environment/);
  });

  it("starts with a centered logistics preview and preserves all dedicated links", () => {
    render(IndustriesPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("AI built around your industry.");
    expect(screen.getByRole("region", { name: "Industry experience" })).toHaveAttribute("data-industry", "logistics");
    expect(within(screen.getByRole("navigation", { name: "All industry guides" })).getAllByRole("link")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "Explore Logistics" })).toHaveAttribute("href", "/industries/logistics");
    expect(document.querySelector("canvas")).toBeNull();
  });

  it.each(industryScenes)("selects $label with its own art, workflows, boundary and landing link", (scene) => {
    render(IndustriesPage());
    fireEvent.click(within(screen.getByRole("group", { name: "Choose an industry" })).getByRole("button", { name: scene.label }));
    const industry = getIndustries().find((item) => item.slug === scene.id)!;
    const environment = screen.getByRole("region", { name: `${industry.title} environment` });
    expect(environment).toHaveAttribute("data-scene", scene.id);
    expect(within(environment).getByRole("img")).toHaveAttribute("src", `/posters/industry-${scene.id}.svg`);
    expect(screen.getByRole("link", { name: `Explore ${scene.label}` })).toHaveAttribute("href", `/industries/${scene.id}`);
    expect(screen.getByText(scene.boundary)).toBeVisible();
    for (const spot of scene.spots) {
      fireEvent.click(screen.getByRole("button", { name: spot.title }));
      expect(screen.getByRole("status")).toHaveTextContent(spot.detail);
    }
  });

  it("keeps mobile selection synchronised and remains useful with reduced motion", () => {
    const original = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ ...original(query), matches: true }));
    render(IndustriesPage());
    const select = screen.getByRole("combobox", { name: "Choose an industry" });
    const option = within(select).getByRole("option", { name: "Healthcare" }) as HTMLOptionElement;
    fireEvent.change(select, { target: { value: option.value } });
    expect(screen.getByRole("button", { name: "Healthcare" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Load 3D view" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Documentation" }));
    expect(screen.getByRole("status")).toHaveTextContent("clinical documents");
  });

  it.each(getIndustries())("gives $title its own hero while retaining domain guidance", async (industry) => {
    render(await IndustryPage({ params: Promise.resolve({ slug: industry.slug }) }));
    expect(generateStaticParams()).toContainEqual({ slug: industry.slug });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(industry.title);
    expect(screen.getByRole("region", { name: `${industry.title} environment` })).toHaveAttribute("data-scene", industry.slug);
    expect(screen.getByRole("link", { name: "Explore the workflows" })).toHaveAttribute("href", "#industry-workflows");
    expect(screen.getByText(industry.compliance[0])).toBeVisible();
    expect(screen.getByText(industry.pains[0])).toBeVisible();
    expect(screen.queryByRole("group", { name: "Choose an industry" })).not.toBeInTheDocument();
  });
});
