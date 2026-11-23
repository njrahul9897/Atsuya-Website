import Link from "next/link";
import { industries, industryProofLines } from "@/content/industries";
import { layers } from "@/content/platform";
import { solutions } from "@/content/solutions";
import type { NavLink } from "@/content/site";
import { scenes } from "@/components/iso/scenes";
import { MiniScene } from "@/components/iso/SceneSvg";
import { ArrowLink } from "@/components/ui/Button";

const PanelLabel = ({ children }: { children: string }) => <p className="t-label text-ink-3">{children}</p>;

// Industries: eight tiles (4×2), each with a small isometric icon, the name and one proof line.
export function MegaIndustries() {
  return (
    <div className="container-x pt-8 pb-7">
      <ul className="grid grid-cols-4 gap-x-6 gap-y-2">
        {industries.map((industry) => (
          <li key={industry.slug}>
            <Link href={`/industries/${industry.slug}`} className="iso-host group -mx-3 flex items-center gap-4 rounded-card p-3">
              <span className="h-[4.5rem] w-24 shrink-0 rounded-xl bg-paper-2 p-1.5 transition-colors duration-200 group-hover:bg-brand-tint">
                <MiniScene art={scenes[industry.slug].icon} liveScale={2.2} className="!h-full" />
              </span>
              <span>
                <span className="block text-[1.0625rem] leading-6 font-semibold text-ink">{industry.name}</span>
                <span className="t-label mt-1 block text-ink-3 transition-colors duration-200 group-hover:text-brand-ink">{industryProofLines[industry.slug][0]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-line pt-5 text-[0.9375rem]">
        <ArrowLink href="/industries">All industries</ArrowLink>
        <ArrowLink href="/industries/manufacturing#sub-sectors">Manufacturing sub-sectors</ArrowLink>
        <ArrowLink href="/customers">All case studies</ArrowLink>
      </div>
    </div>
  );
}

// Platform: the three layers on the left, the six solutions on the right.
export function MegaPlatform() {
  return (
    <div className="container-x pt-8 pb-7">
      <div className="grid-12">
        <div className="col-span-6">
          <PanelLabel>Three layers</PanelLabel>
          <ul className="mt-3">
            {layers.map((layer) => (
              <li key={layer.slug}>
                <Link href={`/platform/${layer.slug}`} className="group -mx-3 block rounded-card p-3 transition-colors duration-200 hover:bg-paper-2">
                  <span className="block text-[1.0625rem] leading-6 font-semibold text-ink">{layer.name}</span>
                  <span className="mt-0.5 block text-[0.9375rem] leading-[1.375rem] text-ink-2">{layer.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-6 border-l border-line pl-6">
          <PanelLabel>Six solutions</PanelLabel>
          <ul className="mt-3 grid grid-cols-2 gap-x-6">
            {solutions.map((solution) => (
              <li key={solution.slug}>
                <Link href={`/solutions/${solution.slug}`} className="-mx-3 flex min-h-12 items-center rounded-card px-3 py-2 text-[1.0625rem] leading-6 font-semibold text-ink transition-colors duration-200 hover:bg-paper-2">
                  {solution.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 border-t border-line pt-5 text-[0.9375rem]">
        <ArrowLink href="/platform">How AOne works</ArrowLink>
      </div>
    </div>
  );
}

// Resources and Company: a plain list.
export function MegaList({ label, links }: { label: string; links: NavLink[] }) {
  return (
    <div className="container-x pt-8 pb-8">
      <PanelLabel>{label}</PanelLabel>
      <ul className="mt-3 grid grid-cols-4 gap-x-6 gap-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="-mx-3 block rounded-card p-3 transition-colors duration-200 hover:bg-paper-2">
              <span className="block text-[1.0625rem] leading-6 font-semibold text-ink">{link.label}</span>
              {link.note ? <span className="mt-0.5 block text-[0.9375rem] leading-[1.375rem] text-ink-2">{link.note}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
