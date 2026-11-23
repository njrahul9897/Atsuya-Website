// The site's few icons, drawn on a 16px grid with a 1.5px stroke. Arrows are SVG rather than
// glyphs so they do not depend on the webfont subset.

type IconProps = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const ArrowRight = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);
export const ArrowDown = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
  </svg>
);
export const ArrowLeft = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" />
  </svg>
);
export const ChevronDown = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m4 6 4 4 4-4" />
  </svg>
);
export const Check = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m3 8.5 3.2 3.2L13 4.8" />
  </svg>
);
export const Close = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
  </svg>
);
export const Menu = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2 5h12M2 11h12" />
  </svg>
);
export const Play = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden focusable={false} className={className}>
    <path d="M5 3.2v9.6a.6.6 0 0 0 .92.5l7.3-4.8a.6.6 0 0 0 0-1L5.92 2.7A.6.6 0 0 0 5 3.2Z" />
  </svg>
);
export const Pause = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden focusable={false} className={className}>
    <rect x="3.5" y="3" width="3" height="10" rx="0.8" />
    <rect x="9.5" y="3" width="3" height="10" rx="0.8" />
  </svg>
);
export const Search = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.4 10.4 3.1 3.1" />
  </svg>
);
