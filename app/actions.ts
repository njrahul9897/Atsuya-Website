"use server";

import { headers } from "next/headers";
import { validateAssessment, validateEmail, type AssessmentErrors, type AssessmentFields } from "@/lib/validation";

export type AssessmentState = { status: "idle" | "success" | "error"; errors?: AssessmentErrors; message?: string };
export type NewsletterState = { status: "idle" | "success" | "error"; error?: string; message?: string };

const read = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

// The configured endpoint, or this site's own stub route when none is set.
async function endpoint(configured: string | undefined, stub: string): Promise<string> {
  if (configured) return configured;
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}${stub}`;
}

// Handles the assessment form. Validates on the server, then posts the lead to a stub endpoint.
export async function submitAssessment(_previous: AssessmentState, form: FormData): Promise<AssessmentState> {
  const fields: AssessmentFields = {
    name: read(form, "name"),
    email: read(form, "email"),
    company: read(form, "company"),
    industry: read(form, "industry"),
    sites: read(form, "sites"),
    message: read(form, "message"),
  };

  const errors = validateAssessment(fields);
  if (Object.keys(errors).length) return { status: "error", errors };

  // Honeypot: real visitors never fill this field.
  if (read(form, "website")) return { status: "success" };

  try {
    // TODO: connect CRM. Set ASSESSMENT_ENDPOINT to the CRM's intake URL; until then the lead
    // goes to the local stub at /api/assessment, which only acknowledges it.
    const response = await fetch(await endpoint(process.env.ASSESSMENT_ENDPOINT, "/api/assessment"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, source: read(form, "source") || "website", submittedAt: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Endpoint replied ${response.status}`);
  } catch (error) {
    console.error("[assessment] could not deliver lead", error);
    return { status: "error", message: "We could not send that just now. Please try again in a moment." };
  }

  return { status: "success" };
}

// Handles the newsletter sign-up above the footer.
export async function subscribeNewsletter(_previous: NewsletterState, form: FormData): Promise<NewsletterState> {
  const email = read(form, "email");
  const error = validateEmail(email);
  if (error) return { status: "error", error };

  // Honeypot: real visitors never fill this field.
  if (read(form, "website")) return { status: "success" };

  try {
    // TODO: connect newsletter. Set NEWSLETTER_ENDPOINT to the email provider's sign-up URL;
    // until then the address goes to the local stub at /api/newsletter, which only acknowledges it.
    const response = await fetch(await endpoint(process.env.NEWSLETTER_ENDPOINT, "/api/newsletter"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: read(form, "source") || "website", subscribedAt: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Endpoint replied ${response.status}`);
  } catch (error) {
    console.error("[newsletter] could not deliver sign-up", error);
    return { status: "error", message: "We could not subscribe you just now. Please try again in a moment." };
  }

  return { status: "success" };
}
