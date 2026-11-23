import { NextResponse } from "next/server";

// Stub endpoint for assessment requests.
// TODO: connect CRM. Replace this handler (or point ASSESSMENT_ENDPOINT at the CRM) so leads are
// stored and routed to sales. Nothing is persisted here.
export async function POST(request: Request) {
  const lead = (await request.json().catch(() => null)) as { company?: string; industry?: string; sites?: string } | null;
  if (!lead) return NextResponse.json({ ok: false }, { status: 400 });
  console.info("[assessment] lead received (stub, not stored)", { company: lead.company, industry: lead.industry, sites: lead.sites });
  return NextResponse.json({ ok: true });
}
