"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions";
import { validateEmail } from "@/lib/validation";
import { cn } from "@/lib/cn";
import { ArrowRight, Check } from "@/components/ui/icons";

const initial: NewsletterState = { status: "idle" };
const ID = "newsletter-email";

// One email field and a subscribe button. Validates on submit (and on leaving the field once an
// error is showing), then again in the server action.
export function NewsletterForm({ success, consent }: { success: string; consent: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  const [error, setError] = useState<string>();
  const pathname = usePathname();
  const input = useRef<HTMLInputElement>(null);
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error" && state.error) {
      setError(state.error);
      input.current?.focus();
    }
    if (state.status === "success") done.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="flex items-center gap-4 rounded-card border border-line bg-paper p-6 outline-none">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <Check size={18} />
        </span>
        <p className="t-h3">{success}</p>
      </div>
    );
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const found = validateEmail(String(new FormData(event.currentTarget).get("email") ?? ""));
    setError(found);
    if (found) {
      event.preventDefault();
      input.current?.focus();
    }
  };

  return (
    <form action={action} onSubmit={onSubmit} noValidate>
      <input type="hidden" name="source" value={pathname} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor={ID} className="mb-2 block text-[0.9375rem] leading-[1.375rem] font-medium text-ink">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={input}
          id={ID}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="name@company.com"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={cn(error && `${ID}-error`, `${ID}-consent`)}
          onBlur={(event) => error && setError(validateEmail(event.target.value))}
          className={cn(
            "h-14 w-full min-w-0 rounded-full sm:flex-1 border bg-paper px-6 text-[1.0625rem] text-ink transition-colors duration-200 placeholder:text-ink-3 hover:border-ink-3 focus:border-brand focus:outline-none focus-visible:outline-2",
            error ? "border-alert" : "border-line",
          )}
        />
        <button type="submit" disabled={pending} className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-7 text-[1.0625rem] font-medium text-white transition-colors duration-200 hover:bg-brand-ink disabled:opacity-60">
          {pending ? "Subscribing" : "Subscribe"}
          <ArrowRight size={18} />
        </button>
      </div>

      {error ? (
        <p id={`${ID}-error`} className="mt-3 text-[0.875rem] leading-5 text-ink">
          <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-alert" />
          {error}
        </p>
      ) : null}
      {state.status === "error" && state.message ? (
        <p role="alert" className="mt-3 text-[0.875rem] leading-5 text-ink">
          <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-alert" />
          {state.message}
        </p>
      ) : null}

      <p id={`${ID}-consent`} className="mt-4 text-[0.875rem] leading-5 text-ink-3">
        {consent}{" "}
        <Link href="/privacy" className="text-ink-2 underline underline-offset-2 transition-colors duration-200 hover:text-ink">
          Read our privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
