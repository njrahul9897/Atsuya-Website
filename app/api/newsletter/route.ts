import { NextResponse } from "next/server";

// Stub endpoint for newsletter sign-ups.
// TODO: connect newsletter. Replace this handler (or point NEWSLETTER_ENDPOINT at the email
// provider) so addresses are stored. Nothing is persisted here, and the address is not logged.
export async function POST(request: Request) {
  const signup = (await request.json().catch(() => null)) as { email?: string; source?: string } | null;
  if (!signup?.email) return NextResponse.json({ ok: false }, { status: 400 });
  console.info("[newsletter] sign-up received (stub, not stored)", { source: signup.source });
  return NextResponse.json({ ok: true });
}
