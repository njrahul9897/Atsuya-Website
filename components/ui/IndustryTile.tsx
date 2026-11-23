import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Industry } from "@/content/industries";
import { industries, industryProofLines } from "@/content/industries";
import { ArrowRight } from "./icons";

const scrim = "absolute inset-0 bg-[linear-gradient(to_top,rgba(5,14,28,0.94)_0%,rgba(5,14,28,0.5)_45%,rgba(5,14,28,0.2)_100%)]";
const pad = (n: number) => String(n).padStart(2, "0");

// An industry as a photo card: real footage from that industry's film, its name and its proof.
export function IndustryTile({ industry, size = "rail", className }: { industry: Industry; size?: "rail" | "large"; className?: string }) {
  const [first, second] = industryProofLines[industry.slug];
  const index = industries.findIndex((entry) => entry.slug === industry.slug) + 1;

  if (size === "large") {
    return (
      <Link href={`/industries/${industry.slug}`} className={cn("card group flex h-full flex-col overflow-hidden !rounded-[1.25rem]", className)}>
        <div className="relative aspect-[16/9] overflow-hidden bg-navy-900 text-white">
          <Image src={industry.video.poster} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
          <span aria-hidden="true" className={scrim} />
          <span className="glass t-label absolute top-5 left-5 inline-flex h-7 items-center rounded-full px-3">
            {pad(index)} / {pad(industries.length)}
          </span>
          <span className="glass absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 group-hover:border-transparent group-hover:bg-brand">
            <ArrowRight />
          </span>
          <h2 className="t-h2 absolute inset-x-0 bottom-0 p-6 lg:p-8">{industry.name}</h2>
        </div>
        <div className="flex flex-1 flex-col p-6 lg:p-8">
          <p className="text-[1.0625rem] leading-7 text-ink-2">{industry.promise}</p>
          <ul className="mt-auto space-y-1.5 border-t border-line pt-5 [margin-block-start:1.5rem]">
            <li className="t-label text-brand-ink">{first}</li>
            <li className="t-label text-ink-2">{second}</li>
          </ul>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/industries/${industry.slug}`} className={cn("group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-navy-900 text-white shadow-card transition-shadow duration-300 hover:shadow-hover", className)}>
      <Image src={industry.video.posterMobile ?? industry.video.poster} alt="" fill sizes="(min-width: 1024px) 344px, 50vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
      <span aria-hidden="true" className={scrim} />
      <span className="glass t-label absolute top-4 left-4 hidden h-7 items-center rounded-full px-3 sm:inline-flex">
        {pad(index)} / {pad(industries.length)}
      </span>
      <span className="glass absolute top-4 right-4 hidden h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 group-hover:border-transparent group-hover:bg-brand sm:flex">
        <ArrowRight />
      </span>
      <span className="absolute inset-x-0 bottom-0 block p-4 lg:p-6">
        <span className="block text-[1.0625rem] leading-6 font-semibold tracking-[-0.01em] lg:text-2xl lg:leading-[1.875rem]">{industry.name}</span>
        <span className="t-label mt-2 block text-white/85">{first}</span>
      </span>
    </Link>
  );
}
