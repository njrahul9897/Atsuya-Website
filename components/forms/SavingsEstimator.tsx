"use client";

import { useId, useState } from "react";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export type EstimatorOption = { slug: string; name: string; min: number; max: number; label: string };

const control = "h-12 w-full rounded-lg border border-line bg-paper px-4 text-[1.0625rem] text-ink transition-colors duration-200 hover:border-ink-3 focus:border-brand focus:outline-none focus-visible:outline-2";

// A simple calculator: industry, number of sites and monthly electricity bill in, the typical
// savings range out. The range is the industry's own electricity/energy figure from its impact data.
export function SavingsEstimator({ options }: { options: EstimatorOption[] }) {
  const id = useId();
  const [slug, setSlug] = useState(options[0].slug);
  const [sites, setSites] = useState("10");
  const [bill, setBill] = useState("200000");

  const option = options.find((entry) => entry.slug === slug) ?? options[0];
  const siteCount = Math.max(0, Math.floor(Number(sites) || 0));
  const monthlyBill = Math.max(0, Number(bill) || 0);
  const yearly = siteCount * monthlyBill * 12;
  const low = (yearly * option.min) / 100;
  const high = (yearly * option.max) / 100;
  const ready = siteCount > 0 && monthlyBill > 0;

  return (
    <div className="grid-12 gap-y-10">
      <form className="col-span-12 space-y-5 lg:col-span-5" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor={`${id}-industry`} className="mb-2 block text-[0.9375rem] leading-[1.375rem] font-medium">
            Industry
          </label>
          <select id={`${id}-industry`} className={control} value={slug} onChange={(event) => setSlug(event.target.value)}>
            {options.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-sites`} className="mb-2 block text-[0.9375rem] leading-[1.375rem] font-medium">
            Number of sites
          </label>
          <input id={`${id}-sites`} className={control} type="number" inputMode="numeric" min={1} step={1} value={sites} onChange={(event) => setSites(event.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-bill`} className="mb-2 block text-[0.9375rem] leading-[1.375rem] font-medium">
            Monthly electricity bill per site (₹)
          </label>
          <input id={`${id}-bill`} className={control} type="number" inputMode="numeric" min={0} step={1000} value={bill} onChange={(event) => setBill(event.target.value)} aria-describedby={`${id}-bill-hint`} />
          <p id={`${id}-bill-hint`} className="t-label mt-2 text-ink-3">
            {monthlyBill > 0 ? `${formatINR(monthlyBill)} a month · ${formatINR(siteCount * monthlyBill * 12)} a year across ${siteCount || 0} ${siteCount === 1 ? "site" : "sites"}` : "Average across your sites"}
          </p>
        </div>
      </form>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <div className="rounded-card bg-brand-tint p-8 lg:p-10" role="status" aria-live="polite">
          <p className="t-label text-brand-ink">Typical savings range</p>
          <p className="t-stat-xl mt-5 text-brand">{ready ? `${formatINR(low)} – ${formatINR(high)}` : "—"}</p>
          <p className="mt-3 text-[1.0625rem] leading-7 text-ink">a year, across {siteCount || 0} {siteCount === 1 ? "site" : "sites"}</p>
          <dl className="mt-8 space-y-3 border-t border-brand/20 pt-6">
            <div className="flex items-baseline justify-between gap-6">
              <dt className="t-label text-ink-2">Basis</dt>
              <dd className="text-right text-[0.9375rem] leading-[1.375rem] text-ink">
                {option.label} ({option.name}, typical)
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="t-label text-ink-2">Per month</dt>
              <dd className="text-right text-[0.9375rem] leading-[1.375rem] text-ink">{ready ? `${formatINR(low / 12)} – ${formatINR(high / 12)}` : "—"}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-5 text-[0.9375rem] leading-[1.375rem] text-ink-2">Indicative range based on typical AOne deployments.</p>
        <div className="mt-8">
          <p className="mb-4 text-[1.0625rem] leading-7 font-medium text-ink">Get an exact number: book a site assessment.</p>
          <Button href={`/book-assessment?industry=${option.slug}`} size="lg">
            Book a site assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
