import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Section";
import { Accent, rich } from "@/components/ui/rich";

type PageHeroProps = {
  path: string; // for the breadcrumb trail
  eyebrow?: string;
  title: string;
  sub?: string;
  children?: ReactNode; // actions under the copy
  aside?: ReactNode; // optional right-hand column (UI collage, stat)
  next?: "paper" | "paper-2"; // the surface that follows, which rises over the hero as a sheet
  size?: "display" | "h1";
  className?: string;
};

// The opening block for pages without a hero video: a lit, dark surface with the breadcrumb, a
// left-aligned headline and one lead. The next section rises over it as a rounded sheet (the cap
// uses literal light colours: inside .dark-vars the paper tokens are dark).
export function PageHero({ path, eyebrow, title, sub, children, aside, next = "paper", size = "display", className }: PageHeroProps) {
  return (
    <section className={cn("on-dark dark-vars surface-dark overflow-hidden pt-[calc(var(--header-h)+40px)] pb-20 lg:pt-[calc(var(--header-h)+72px)] lg:pb-28", className)}>
      <div className="container-x">
        <Breadcrumbs path={path} tone="dark" />
        <div className={cn("grid-12 mt-10 gap-y-12 lg:mt-14", aside ? "items-center" : "items-end")}>
          <div className={cn("col-span-12", aside ? "lg:col-span-6" : "lg:col-span-9")}>
            {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
            <h1 className={size === "display" ? "t-display" : "t-h1"}>
              <Accent text={title} />
            </h1>
            {sub ? <p className="t-lead mt-6 max-w-[38rem] text-ink-2">{rich(sub)}</p> : null}
            {children ? <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">{children}</div> : null}
          </div>
          {aside ? <div className="col-span-12 lg:col-span-6">{aside}</div> : null}
        </div>
      </div>
      <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-8 rounded-t-[2rem] lg:h-10 lg:rounded-t-[2.5rem]", next === "paper-2" ? "bg-[#f3f6fa]" : "bg-white")} />
    </section>
  );
}
