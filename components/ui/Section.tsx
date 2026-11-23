import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Accent } from "./rich";

export type Tone = "paper" | "paper-2" | "dark" | "brand";

const tones: Record<Tone, string> = {
  paper: "bg-paper",
  "paper-2": "bg-paper-2",
  dark: "dark-vars surface-dark",
  brand: "surface-brand",
};

type SectionProps = {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  spacing?: "section" | "band" | "none";
  sheet?: boolean; // a light section that rises, with rounded corners, over the dark one above
  className?: string;
  labelledBy?: string;
};

// Light sections (paper, paper-2) alternate with dark navy and brand-blue ones.
export function Section({ children, id, tone = "paper", spacing = "section", sheet = false, className, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tones[tone], sheet && "sheet", spacing === "section" && "section-y", spacing === "band" && "band-y", className)}>
      {children}
    </section>
  );
}

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => <p className={cn("eyebrow", className)}>{children}</p>;

// Left-aligned section heading: the H2 (its last phrase picked out in the accent colour) and an
// optional lead. Sections carry no eyebrow tag; only page heroes do (PageHero).
export function SectionHeading({ id, title, lead, className, as: Tag = "h2" }: { id?: string; title: string; lead?: ReactNode; className?: string; as?: "h1" | "h2" }) {
  return (
    <div className={cn("max-w-[52rem]", className)} data-reveal="">
      <Tag id={id} className={Tag === "h1" ? "t-h1" : "t-h2"}>
        <Accent text={title} />
      </Tag>
      {lead ? <p className="t-lead mt-5 max-w-[40rem] text-ink-2">{lead}</p> : null}
    </div>
  );
}
