"use server";

import { headers } from "next/headers";
import { validateAssessment, type AssessmentErrors, type AssessmentFields } from "@/lib/validation";

export type AssessmentState = { status: "idle" | "success" | "error"; errors?: AssessmentErrors; message?: string };

const read = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

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
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
    const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    const endpoint = process.env.ASSESSMENT_ENDPOINT ?? `${protocol}://${host}/api/assessment`;
    const response = await fetch(endpoint, {
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
