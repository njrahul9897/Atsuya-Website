"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitAssessment, type AssessmentState } from "@/app/actions";
import { validateAssessment, validateField, type AssessmentErrors, type AssessmentFields } from "@/lib/validation";
import { cn } from "@/lib/cn";
import { Check } from "@/components/ui/icons";

type Option = { value: string; label: string };
type AssessmentFormProps = { industries: Option[]; siteCounts: string[]; success: string; source: string; submitLabel?: string };

const initial: AssessmentState = { status: "idle" };
const order: (keyof AssessmentFields)[] = ["name", "email", "company", "industry", "sites", "message"];

const control = "h-12 w-full rounded-lg border bg-paper px-4 text-[1.0625rem] text-ink transition-colors duration-200 placeholder:text-ink-3 hover:border-ink-3 focus:border-brand focus:outline-none focus-visible:outline-2";

// Name, work email, company, industry, number of sites and an optional message.
// Validates inline as each field is left, again on submit, and again in the server action.
export function AssessmentForm({ industries, siteCounts, success, source, submitLabel = "Book a site assessment" }: AssessmentFormProps) {
  const [state, action, pending] = useActionState(submitAssessment, initial);
  const [errors, setErrors] = useState<AssessmentErrors>({});
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  // Arriving from an industry page: preselect that industry.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("industry");
    const select = form.current?.elements.namedItem("industry") as HTMLSelectElement | null;
    if (wanted && select && industries.some((option) => option.value === wanted)) select.value = wanted;
  }, [industries]);

  useEffect(() => {
    if (state.status === "error" && state.errors) setErrors(state.errors);
    if (state.status === "success") done.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="rounded-card bg-brand-tint p-8 outline-none lg:p-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
          <Check size={18} />
        </span>
        <p className="t-h3 mt-6 max-w-[26rem]">{success}</p>
      </div>
    );
  }

  const check = (field: keyof AssessmentFields, value: string) => setErrors((current) => ({ ...current, [field]: validateField(field, value) }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const fields = Object.fromEntries(order.map((field) => [field, String(data.get(field) ?? "")])) as AssessmentFields;
    const found = validateAssessment(fields);
    setErrors(found);
    const first = order.find((field) => found[field]);
    if (first) {
      event.preventDefault();
      (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
    }
  };

  const field = (name: keyof AssessmentFields, label: string, input: (props: { id: string; name: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => React.ReactNode, optional = false) => {
    const error = errors[name];
    const id = `assessment-${name}`;
    return (
      <div>
        <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[0.9375rem] leading-[1.375rem] font-medium text-ink">
          {label}
          {optional ? <span className="t-label text-ink-3">Optional</span> : null}
        </label>
        {input({ id, name, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined, className: cn(control, error ? "border-alert" : "border-line") })}
        {error ? (
          <p id={`${id}-error`} className="mt-2 text-[0.875rem] leading-5 text-ink">
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-alert" />
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form ref={form} action={action} onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {field("name", "Name", (props) => <input {...props} type="text" autoComplete="name" required onBlur={(event) => check("name", event.target.value)} />)}
        {field("email", "Work email", (props) => <input {...props} type="email" autoComplete="email" inputMode="email" required onBlur={(event) => check("email", event.target.value)} />)}
      </div>
      {field("company", "Company", (props) => <input {...props} type="text" autoComplete="organization" required onBlur={(event) => check("company", event.target.value)} />)}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {field("industry", "Industry", (props) => (
          <select {...props} required defaultValue="" onBlur={(event) => check("industry", event.target.value)} onChange={(event) => check("industry", event.target.value)}>
            <option value="" disabled>
              Select
            </option>
            {industries.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        ))}
        {field("sites", "Number of sites", (props) => (
          <select {...props} required defaultValue="" onBlur={(event) => check("sites", event.target.value)} onChange={(event) => check("sites", event.target.value)}>
            <option value="" disabled>
              Select
            </option>
            {siteCounts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        ))}
      </div>
      {field("message", "Message", (props) => <textarea {...props} rows={4} className={cn(props.className, "h-auto py-3")} onBlur={(event) => check("message", event.target.value)} />, true)}

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-[0.9375rem] leading-[1.375rem] text-ink">
          <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-alert" />
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="inline-flex h-14 w-full items-center justify-center rounded-full bg-brand px-8 text-[1.0625rem] font-medium text-white transition-colors duration-200 hover:bg-brand-ink disabled:opacity-60 sm:w-auto">
        {pending ? "Sending" : submitLabel}
      </button>
    </form>
  );
}
