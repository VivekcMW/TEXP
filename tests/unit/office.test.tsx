import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AgentOffice } from "@/components/office/AgentOffice";
import OfficeArrival from "@/components/office/OfficeArrival";
import { initialOfficeState, officeReducer, officeWorkflows, HOLD_MS, STEP_MS, workflowFor, workflowSteps, type OfficeState } from "@/components/office/workflows";
import { agentPose, deskPositions, pointAlongRoute, walkingRoutes } from "@/components/office/motion";

vi.mock("@/components/scenes/useSceneAllowed", () => ({ useSceneAllowed: () => false }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("automatic office workflow", () => {
  it("includes the simulated human decision in claims and prior authorisation", () => {
    for (const id of ["claims", "prior-auth"] as const) {
      expect(workflowSteps(workflowFor(id), false)).toEqual(["intake", "research", "policy", "review", "execution"]);
      expect(workflowFor(id).activities.review.evidence).toContain("Simulated human approval");
    }
    expect(workflowSteps(workflowFor("returns"), false)).not.toContain("review");
  });

  it.each(officeWorkflows)("automatically completes and replays $id without a click", (workflow) => {
    let state: OfficeState = { ...initialOfficeState, workflowId: workflow.id };
    for (let i = 0; i < workflowSteps(workflow, false).length; i++) state = officeReducer(state, { type: "tick", ms: STEP_MS });
    expect(state).toMatchObject({ complete: true, playing: true });
    state = officeReducer(state, { type: "tick", ms: HOLD_MS - 1 });
    expect(state.complete).toBe(true);
    state = officeReducer(state, { type: "tick", ms: 1 });
    expect(state).toMatchObject({ step: 0, elapsed: 0, complete: false, playing: true });
  });

  it.each(officeWorkflows)("ends $id exceptions at review, never execution", (workflow) => {
    let state: OfficeState = { ...initialOfficeState, workflowId: workflow.id, exception: true };
    for (let i = 0; i < 4; i++) state = officeReducer(state, { type: "tick", ms: STEP_MS });
    expect(workflowSteps(workflow, true)[state.step]).toBe("review");
    expect(state.complete).toBe(true);
    expect(officeReducer(state, { type: "next" })).toEqual(state);
    state = officeReducer(state, { type: "tick", ms: HOLD_MS });
    expect(state).toMatchObject({ step: 0, exception: true, complete: false });
  });

  it("pauses both a workflow and the completed-work hold", () => {
    const state = officeReducer({ ...initialOfficeState, complete: true }, { type: "pause" });
    expect(officeReducer(state, { type: "tick", ms: 60_000 })).toEqual(state);
    expect(officeReducer(state, { type: "play" }).playing).toBe(true);
  });
});

describe("walking and working", () => {
  it.each(Object.keys(walkingRoutes) as (keyof typeof walkingRoutes)[])("%s leaves its desk, carries work back and types", (id) => {
    const route = walkingRoutes[id];
    const start = agentPose(id, 0);
    expect([start.x, start.z]).toEqual(route[0]);
    expect(start.walking).toBe(true);
    const handoff = agentPose(id, 4);
    expect(handoff.carrying).toBe(true);
    expect(handoff.x).toBeCloseTo(route[route.length - 1][0]);
    expect(handoff.z).toBeCloseTo(route[route.length - 1][1]);
    const returning = agentPose(id, 7);
    expect(returning.walking).toBe(true);
    expect(returning.carrying).toBe(true);
    const working = agentPose(id, 10);
    expect(working.working).toBe(true);
    expect(working.walking).toBe(false);
    expect([working.x, working.z]).toEqual(route[0]);
  });

  it("moves at an even speed along a multi-segment route", () => {
    const route: [number, number][] = [[0, 0], [0, 3], [4, 3]];
    expect(pointAlongRoute(route, .5)).toMatchObject({ x: .5, z: 3 });
    expect(pointAlongRoute(route, 2)).toMatchObject({ x: 4, z: 3 });
  });

  it("keeps walking routes outside desk tops and within the office floor", () => {
    for (const id of Object.keys(walkingRoutes) as (keyof typeof walkingRoutes)[]) {
      for (let step = 0; step <= 100; step++) {
        const pose = pointAlongRoute(walkingRoutes[id], step / 100);
        expect(Math.abs(pose.x)).toBeLessThan(5.8);
        expect(Math.abs(pose.z)).toBeLessThan(4);
        for (const [x, , z] of Object.values(deskPositions)) {
          expect(Math.abs(pose.x - x) < 1.13 && Math.abs(pose.z - z) < .56).toBe(false);
        }
      }
    }
  });
});

describe("office controls and fallback", () => {
  beforeEach(() => vi.useFakeTimers());
  it("shows a first-paint poster without the old steps or sample badge", () => {
    const { container } = render(<AgentOffice />);
    expect(screen.getByRole("img", { name: /isometric/i })).toHaveAttribute("src", "/posters/agent-office.svg");
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.queryByText("Sample workflow")).not.toBeInTheDocument();
    expect(screen.queryByText("The operations floor")).not.toBeInTheDocument();
    expect(screen.queryByText("n.")).not.toBeInTheDocument();
    expect(screen.getByText("Explore the workflow").closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("Illustrative AI office")).toBeVisible();
    expect(screen.getByRole("group", { name: "Choose an office workflow" })).not.toBeVisible();
    expect(screen.queryByRole("group", { name: "Explore an office role" })).not.toBeInTheDocument();
    expect(screen.getByText(/human approvals are simulated/i)).toBeInTheDocument();
  });

  it("switches workflows and keeps team details accessible without WebGL", async () => {
    vi.useRealTimers();
    render(<AgentOffice />);
    fireEvent.click(screen.getByText("Explore the workflow"));
    fireEvent.click(within(screen.getByRole("group", { name: "Choose an office workflow" })).getByRole("button", { name: "Returns" }));
    expect(screen.getByText("I'd like to return this order.")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Meet the team" }), { target: { value: "review" } });
    expect(await screen.findByText("Required approval cannot be skipped.")).toBeVisible();
    fireEvent.keyDown(screen.getByRole("region", { name: "Interactive AI operations office" }), { key: "Escape" });
    expect(screen.queryByText("Required approval cannot be skipped.")).not.toBeInTheDocument();
  });

  it("clears inspected role details when the workflow disclosure closes", async () => {
    vi.useRealTimers();
    render(<AgentOffice />);
    const summary = screen.getByText("Explore the workflow");
    fireEvent.click(summary);
    fireEvent.change(screen.getByRole("combobox", { name: "Meet the team" }), { target: { value: "research" } });
    expect(await screen.findByText("Only accesses records you have permitted.")).toBeVisible();
    const disclosure = summary.closest("details")!;
    fireEvent.click(summary);
    fireEvent(disclosure, new Event("toggle"));
    expect(disclosure).not.toHaveAttribute("open");
    expect(screen.queryByText("Only accesses records you have permitted.")).not.toBeInTheDocument();
  });

  it("automatically runs review and completion, then loops", () => {
    render(<AgentOffice />);
    fireEvent.click(screen.getByText("Explore the workflow"));
    act(() => vi.advanceTimersByTime(1800));
    act(() => vi.advanceTimersByTime(STEP_MS * 3));
    expect(screen.getByRole("status")).toHaveTextContent("Simulated human approval");
    act(() => vi.advanceTimersByTime(STEP_MS * 2));
    expect(screen.getByRole("status")).toHaveTextContent("Workflow complete.");
    act(() => vi.advanceTimersByTime(HOLD_MS));
    expect(screen.getByRole("status")).toHaveTextContent("Turning an email into a claim");
  });

  it("stops the autoplay clock when paused", () => {
    render(<AgentOffice />);
    fireEvent.click(screen.getByText("Explore the workflow"));
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByRole("status")).toHaveTextContent("Turning an email into a claim");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => vi.advanceTimersByTime(STEP_MS));
    expect(screen.getByRole("status")).toHaveTextContent("Finding the shipment's story");
  });

  it("uses manual scenes for reduced motion without automatically approving anything real", () => {
    const original = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ ...original(query), matches: true }));
    render(<AgentOffice />);
    fireEvent.click(screen.getByText("Explore the workflow"));
    act(() => vi.advanceTimersByTime(30_000));
    expect(screen.getByRole("status")).toHaveTextContent("Turning an email into a claim");
    expect(screen.queryByRole("button", { name: /^(play|pause)$/i })).not.toBeInTheDocument();
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole("button", { name: /next scene/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Simulated human approval");
  });

  it("suspends autoplay in hidden tabs", () => {
    render(<AgentOffice />);
    fireEvent.click(screen.getByText("Explore the workflow"));
    act(() => vi.advanceTimersByTime(1800));
    const visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(12_000));
    expect(screen.getByRole("status")).toHaveTextContent("Turning an email into a claim");
    visibility.mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(STEP_MS));
    expect(screen.getByRole("status")).toHaveTextContent("Finding the shipment's story");
  });

  it("shows a real loading state that pauses and disappears when ready", () => {
    const { rerender } = render(<OfficeArrival ready={false} playing={false} />);
    expect(screen.getByRole("status")).toHaveTextContent("Opening your AI office");
    expect(screen.getByRole("status").parentElement).toHaveStyle({ animationPlayState: "paused" });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    rerender(<OfficeArrival ready playing />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
