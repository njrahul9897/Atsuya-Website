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

// Brand marks for the footer social links, from Font Awesome Free 6.7.2 (icons CC BY 4.0,
// https://fontawesome.com/license/free). Filled, on each mark's own grid, sized by height.
const brand = (size: number, width: number, height: number) => ({
  width: Math.round((size * width) / height),
  height: size,
  viewBox: `0 0 ${width} ${height}`,
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
});
export const LinkedIn = ({ className, size = 16 }: IconProps) => (
  <svg {...brand(size, 448, 512)} className={className}>
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);
export const XLogo = ({ className, size = 16 }: IconProps) => (
  <svg {...brand(size, 512, 512)} className={className}>
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);
export const YouTube = ({ className, size = 16 }: IconProps) => (
  <svg {...brand(size, 576, 512)} className={className}>
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
  </svg>
);
export const Facebook = ({ className, size = 16 }: IconProps) => (
  <svg {...brand(size, 320, 512)} className={className}>
    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
  </svg>
);
