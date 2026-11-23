import Link from "next/link";
import { cn } from "@/lib/cn";
import { breadcrumbJsonLd, routeFor } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

// Visible breadcrumb trail plus its BreadcrumbList JSON-LD, both from the route registry.
export function Breadcrumbs({ path, tone = "light", className }: { path: string; tone?: "light" | "dark"; className?: string }) {
  const route = routeFor(path);
  const muted = tone === "dark" ? "text-white/70" : "text-ink-3";
  const current = tone === "dark" ? "text-white" : "text-ink";
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("t-label", muted, className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {route.crumbs.map((crumb) => (
            <li key={crumb.path} className="flex items-center gap-2">
              <Link href={crumb.path} className={cn("transition-colors duration-200", tone === "dark" ? "hover:text-white" : "hover:text-ink")}>
                {crumb.name}
              </Link>
              <span aria-hidden="true">/</span>
            </li>
          ))}
          <li aria-current="page" className={current}>
            {route.crumbName}
          </li>
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(path)} />
    </>
  );
}
