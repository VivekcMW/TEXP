import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";
import { isLeadCaptureEnabled } from "@/lib/leads/provider";
import PrivacyPage from "@/app/privacy/page";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function fill() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test user" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "test@example.invalid" } });
  fireEvent.change(screen.getByLabelText("One process you would like to improve"), { target: { value: "Synthetic workflow" } });
}

describe("contact flow", () => {
  it("names the operator and contact address without preview wording", () => {
    render(PrivacyPage());
    expect(screen.getByText(/operated by Technocient AI Pvt Ltd/)).toBeVisible();
    expect(screen.getByRole("link", { name: "hello@technocient.ai" })).toHaveAttribute("href", "mailto:hello@technocient.ai");
    expect(screen.queryByText(/preview/i)).not.toBeInTheDocument();
  });

  it("offers email instead of an unconfigured form and ignores a forged success parameter", () => {
    render(<ContactForm enabled={false} email="hello@technocient.ai" initiallySaved />);
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send enquiry" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email hello@technocient.ai" })).toHaveAttribute("href", "mailto:hello@technocient.ai?subject=Workflow%20enquiry");
    expect(screen.queryByText(/Your test enquiry was saved/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How information is handled" })).toHaveAttribute("href", "/privacy");
  });

  it("confirms only acknowledged local saves and never claims an email was sent", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    render(<ContactForm enabled />);
    fill();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("status")).toHaveTextContent("No email was sent");
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({ name: "Test user", email: "test@example.invalid", source: "contact" });
  });

  it("keeps values and presents API errors without success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, errors: { _: "Storage unavailable" } }), { status: 503 })));
    render(<ContactForm enabled />);
    fill();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Storage unavailable");
    expect(screen.getByLabelText("Name")).toHaveValue("Test user");
    expect(screen.getByRole("button", { name: "Send enquiry" })).toBeEnabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not treat malformed responses or network failures as success", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));
    render(<ContactForm enabled />);
    fill();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not confirm");
    expect(log).toHaveBeenCalled();
    expect(screen.getByLabelText("Name")).toHaveValue("Test user");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Send enquiry" })).toBeEnabled());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("allows local testing only by explicit development opt-in", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ENABLE_LOCAL_LEAD_CAPTURE", "");
    expect(isLeadCaptureEnabled()).toBe(false);
    vi.stubEnv("ENABLE_LOCAL_LEAD_CAPTURE", "true");
    expect(isLeadCaptureEnabled()).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(isLeadCaptureEnabled()).toBe(false);
  });
});
