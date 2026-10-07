import { NextResponse } from "next/server";
import { LeadSchema, saveLead } from "@/lib/leads/provider";

async function parseBody(req: Request): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return req.json();
  if (type.includes("form")) {
    const fd = await req.formData();
    return Object.fromEntries(Array.from(fd.entries()).filter(([, v]) => typeof v === "string" && v !== ""));
  }
  return req.json();
}

export async function POST(req: Request) {
  let json: unknown;
  try { json = await parseBody(req); } catch { return NextResponse.json({ ok: false, errors: { _: "Body must be JSON or form data" } }, { status: 400 }); }
  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".") || "_"] = i.message;
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }
  try { await saveLead(parsed.data); } catch (e) {
    console.error("lead save failed", e);
    return NextResponse.json({ ok: false, errors: { _: "Could not save" } }, { status: 500 });
  }
  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("application/json") && (req.headers.get("content-type") ?? "").includes("form")) {
    return NextResponse.redirect(new URL("/contact?sent=1", req.url), 303);
  }
  return NextResponse.json({ ok: true });
}
