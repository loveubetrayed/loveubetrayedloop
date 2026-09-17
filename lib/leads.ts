import { kv, kvConfigured } from "./kv";

const LEADS_KEY = "leads";

export type Lead = {
  email: string;
  // "free-kit-requested": email submitted, confirmation email sent, not yet
  // clicked (double opt-in pending) — they have NOT received the file yet.
  // "free-kit-confirmed": the file was actually delivered — either they
  // clicked the confirmation link, or email wasn't configured so it was
  // handed over instantly. Only this counts as a real download.
  source: "free-kit-requested" | "free-kit-confirmed" | "newsletter";
  productSlug?: string;
  date: string; // ISO string
};

export async function recordLead(email: string, source: Lead["source"], productSlug?: string) {
  const lead: Lead = { email, source, productSlug, date: new Date().toISOString() };
  const ok = await kv.lpush(LEADS_KEY, lead);
  if (!ok) {
    // KV not configured yet — at least keep it visible in server logs so
    // nothing is silently lost while you're getting set up.
    console.log("New lead (not persisted — KV not configured):", lead);
  }
  return lead;
}

export async function getLeads(limit = 500): Promise<Lead[]> {
  return kv.lrange<Lead>(LEADS_KEY, 0, limit - 1);
}

// Real, non-fabricated "X people got this kit" counts — only counts leads
// that actually received the file (see the "free-kit-confirmed" note above).
export async function getDownloadCounts(): Promise<Record<string, number>> {
  const leads = await kv.lrange<Lead>(LEADS_KEY, 0, 4999);
  const counts: Record<string, number> = {};
  for (const lead of leads) {
    if (lead.source !== "free-kit-confirmed" || !lead.productSlug) continue;
    counts[lead.productSlug] = (counts[lead.productSlug] || 0) + 1;
  }
  return counts;
}
