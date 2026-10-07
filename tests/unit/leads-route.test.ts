import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/leads/provider", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/leads/provider")>();
  return { ...mod, saveLead: vi.fn(async () => undefined) };
});
import { POST } from "@/app/api/leads/route";
import { saveLead } from "@/lib/leads/provider";

const req = (body: unknown) => new Request("http://localhost/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) });

describe("POST /api/leads", () => {
  beforeEach(() => vi.mocked(saveLead).mockClear());
  it("saves a valid lead", async () => {
    const res = await POST(req({ email: "a@b.co", source: "roi", payload: { headcount: 3 } }));
    expect(res.status).toBe(200);
    expect(saveLead).toHaveBeenCalledOnce();
  });
  it("rejects a bad email with field errors", async () => {
    const res = await POST(req({ email: "nope", source: "roi" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.email).toBeDefined();
    expect(saveLead).not.toHaveBeenCalled();
  });
  it("rejects an empty or non-JSON body with 400, no stack", async () => {
    const res = await POST(req("not json"));
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).not.toMatch(/at .*\.ts/);
  });
  it("returns 500 without leaking provider errors", async () => {
    vi.mocked(saveLead).mockRejectedValueOnce(new Error("hubspot token invalid"));
    const res = await POST(req({ email: "a@b.co", source: "contact" }));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("hubspot");
  });
});
