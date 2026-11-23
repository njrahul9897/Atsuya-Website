import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight, ArrowDown } from "./icons";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outline-dark";
  size?: "md" | "lg";
  className?: string;
};

const variants = {
  primary: "btn-primary text-white",
  outline: "border border-line bg-paper text-ink shadow-card hover:border-ink",
  "outline-dark": "glass text-white hover:border-white/50",
};

// The pill button. Primary (brand blue) is used for one action per view.
export function Button({ href, children, variant = "primary", size = "md", className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap",
        size === "lg" ? "h-14 px-8 text-[1.0625rem]" : "h-12 px-6 text-base",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

// A text link with an arrow that nudges on hover. `tone="light"` is for dark surfaces.
export function ArrowLink({ href, children, direction = "right", tone = "blue", className }: { href: string; children: ReactNode; direction?: "right" | "down"; tone?: "blue" | "light" | "ink"; className?: string }) {
  const Icon = direction === "down" ? ArrowDown : ArrowRight;
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-2 font-medium",
        tone === "blue" && "text-brand-ink",
        tone === "light" && "text-white",
        tone === "ink" && "text-ink",
        className,
      )}
    >
      <span className="underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover/link:decoration-current">{children}</span>
      <Icon className={cn("transition-transform duration-300 ease-soft", direction === "down" ? "group-hover/link:translate-y-0.5" : "group-hover/link:translate-x-1")} />
    </Link>
  );
}

export function Chip({ children, className, href }: { children: ReactNode; className?: string; href?: string }) {
  const classes = cn("inline-flex h-8 items-center rounded-full border border-line bg-paper px-3.5 text-[0.8125rem] font-medium text-ink-2", href && "transition-colors duration-200 hover:border-brand-ink hover:text-brand-ink", className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
