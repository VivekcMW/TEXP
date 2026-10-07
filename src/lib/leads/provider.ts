import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

export const LeadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  source: z.enum(["roi", "contact", "subscribe"]),
  payload: z.record(z.string(), z.unknown()).optional(),
});
export type Lead = z.infer<typeof LeadSchema>;
export interface LeadProvider { save(lead: Lead & { receivedAt: string }): Promise<void> }

const fileProvider: LeadProvider = {
  async save(lead) {
    const dir = path.join(process.cwd(), ".leads");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n");
  },
};
const logProvider: LeadProvider = { async save(lead) { console.log("[lead]", JSON.stringify(lead)); } };

export const provider: LeadProvider = process.env.NODE_ENV === "production" ? logProvider : fileProvider;
export async function saveLead(lead: Lead): Promise<void> {
  await provider.save({ ...lead, receivedAt: new Date().toISOString() });
}
