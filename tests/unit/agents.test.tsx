import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AgentsPage from "@/app/agents/page";
import { agentPresentations, DEMO_STEP_MS } from "@/components/agents/showcase";
import { getAgents, getCaseStudies } from "@/content/load";
import { SceneBoundary } from "@/components/scenes/SceneBoundary";
import { readFileSync } from "node:fs";

vi.mock("@/components/scenes/useSceneAllowed", () => ({ useSceneAllowed: () => false }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

function reduceMotion() {
  const original = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ ...original(query), matches: true }));
}
const workbench = () => screen.getByRole("region", { name: "Interactive agent workbench" });
const status = () => within(workbench()).getByRole("status");
const select = (name: string) => fireEvent.click(within(screen.getByRole("group", { name: "Choose a specialist" })).getByRole("button", { name }));

describe("Agents showroom content", () => {
  it("replaces the card wall with a poster-first workbench and preserves every guide", async () => {
    const { container } = render(AgentsPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Meet the agents.Made for your everyday work.");
    expect(screen.queryByText("One agent, one process, one number")).not.toBeInTheDocument();
    expect(screen.queryByText("Illustrative demonstration")).not.toBeInTheDocument();
    expect(screen.queryByText(/A scripted example, not a live system/)).not.toBeInTheDocument();
    expect(status()).toHaveClass("sr-only");
    expect(within(workbench()).getByRole("button", { name: /replay agent/i })).toBeVisible();
    expect(container.querySelector("canvas")).toBeNull();
    expect(within(workbench()).getByRole("img")).toHaveAttribute("src", "/posters/agent-claims.svg");
    expect(screen.getByRole("button", { name: "Claims intake agent" })).toHaveAttribute("aria-pressed", "true");
    expect(within(screen.getByRole("navigation", { name: "All agent guides" })).getAllByRole("link")).toHaveLength(7);
    expect(agentPresentations.map((p) => p.slug).sort()).toEqual(getAgents().map((a) => a.slug).sort());
    expect(await screen.findByText("A day at the claims desk.")).toBeVisible();
    expect(screen.getByText("Related workflow")).toBeVisible();
  });

  it.each(agentPresentations)("wires $label to its own example, boundaries, permissions and proof", async (presentation) => {
    render(AgentsPage());
    const agent = getAgents().find((a) => a.slug === presentation.slug)!;
    const proof = getCaseStudies().find((c) => c.slug === agent.caseStudy)!;
    select(agent.title);
    expect(workbench()).toHaveAttribute("data-agent", agent.slug);
    expect(within(workbench()).getByRole("img", { name: presentation.artwork }))
      .toHaveAttribute("src", `/posters/agent-${presentation.kind}.svg`);
    expect(readFileSync(`public/posters/agent-${presentation.kind}.svg`, "utf8")).toContain(presentation.artwork);
    expect(await screen.findByText(presentation.request, { exact: false })).toBeVisible();
    expect(screen.getByText(agent.autonomy)).toBeVisible();
    expect(screen.getByRole("link", { name: "View full agent details" })).toHaveAttribute("href", `/agents/${agent.slug}`);
    for (const gate of agent.gates) expect(screen.getByText(gate)).toBeVisible();
    for (const evidence of agent.evidence) expect(screen.getByText(evidence)).toBeVisible();
    expect(screen.getByRole("link", { name: new RegExp(proof.title) })).toHaveAttribute("href", `/case-studies/${proof.slug}`);
    fireEvent.click(screen.getByText("See tools and permissions"));
    for (const tool of agent.tools) expect(screen.getByText(tool.name)).toBeInTheDocument();
    expect(screen.queryByText(/illustrative/i)).not.toBeInTheDocument();
  });

  it("keeps native mobile selection in sync and resets the example", async () => {
    reduceMotion();
    render(AgentsPage());
    fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    fireEvent.change(screen.getByRole("combobox", { name: "Choose your specialist" }), { target: { value: "3" } });
    expect(workbench()).toHaveAttribute("data-agent", "prior-authorisation");
    expect(within(workbench()).getByRole("img")).toHaveAttribute("src", "/posters/agent-healthcare.svg");
    expect(screen.getByRole("button", { name: "Prior authorisation agent" })).toHaveAttribute("aria-pressed", "true");
    expect(status()).toHaveTextContent("Reads the referral and notes");
    expect(await screen.findByText("A clinician signs every request before submission")).toBeVisible();
  });
});

describe("demonstration playback", () => {
  it("autoplays, pauses, resumes and replays without WebGL", () => {
    vi.useFakeTimers();
    render(AgentsPage());
    act(() => vi.advanceTimersByTime(1800));
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS));
    expect(status()).toHaveTextContent("Checks policy and cover");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS * 3));
    expect(status()).toHaveTextContent("Checks policy and cover");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS * 3));
    expect(status()).toHaveTextContent("Simulated human approval.");
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS * 2));
    expect(status()).toHaveTextContent("Example complete.");
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS));
    expect(status()).toHaveTextContent("Reads the claim pack");
    fireEvent.click(screen.getByRole("button", { name: /replay agent/i }));
    expect(status()).toHaveTextContent("Reads the claim pack");
  });

  it("stops playback in a hidden tab and preserves a deliberate pause when switching", () => {
    vi.useFakeTimers();
    render(AgentsPage());
    act(() => vi.advanceTimersByTime(1800));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS * 3));
    expect(status()).toHaveTextContent("Reads the claim pack");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    select("Returns desk agent");
    expect(screen.getByRole("button", { name: "Play" })).toBeVisible();
    expect(status()).toHaveTextContent("Reads the customer's message");
  });

  it("uses manual reduced-motion playback and keeps clinician approval before submission", () => {
    reduceMotion();
    vi.useFakeTimers();
    render(AgentsPage());
    select("Prior authorisation agent");
    act(() => vi.advanceTimersByTime(DEMO_STEP_MS * 8));
    expect(status()).toHaveTextContent("Reads the referral and notes");
    expect(screen.queryByRole("button", { name: /^(play|pause)$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load 3D view" })).not.toBeInTheDocument();
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    expect(status()).toHaveTextContent("Simulated human approval.");
    fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    expect(status()).toHaveTextContent("Submits to the payer portal");
  });

  it.each(["Permit completeness agent", "Billing dispute agent"])("ends %s at a handoff, not an executed decision", (name) => {
    reduceMotion();
    render(AgentsPage());
    select(name);
    const agent = getAgents().find((a) => a.title === name)!;
    for (let i = 0; i < agent.steps.length - 1; i++) fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    expect(status()).toHaveTextContent("Human decision required. The agent hands over.");
    fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    expect(status()).toHaveTextContent("Ready for your team's decision.");
    expect(screen.getByRole("button", { name: /next scene/i })).toBeDisabled();
  });

  it("logs a renderer failure and notifies the parent instead of hiding it silently", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const onUnavailable = vi.fn();
    function FailedRenderer(): never { throw new Error("GPU unavailable"); }
    render(<SceneBoundary name="Test workbench" onUnavailable={onUnavailable}><FailedRenderer /></SceneBoundary>);
    expect(onUnavailable).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith("Test workbench WebGL failed; showing preview.", expect.any(Error), expect.any(String));
  });
});
