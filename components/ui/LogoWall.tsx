import Image from "next/image";
import { customers, type Customer } from "@/content/site";
import { Accent } from "./rich";

// Marks are sized by area, not by a shared height, so a square emblem and a long wordmark carry
// the same visual weight: height = √(area ÷ aspect ratio), capped for the squarest marks. A
// logo's optional `scale` corrects for an unusually heavy or light mark.
const AREA = 4000; // px² at CSS size
const MAX_HEIGHT = 58;
function displaySize(logo: NonNullable<Customer["logo"]>) {
  const ratio = logo.width / logo.height;
  const height = Math.min(MAX_HEIGHT, Math.sqrt(AREA / ratio)) * (logo.scale ?? 1);
  return { width: Math.round(height * ratio), height: Math.round(height) };
}

// The customers, in full colour, each on a white tile: six to a row on desktop with the last row
// centred, four on tablets, three on phones (a mark shrinks to fit a narrow tile). No carousel.
// Without a logo file (Grandiose, for now), the name is set in type.
export function LogoWall({ label }: { label: string }) {
  return (
    <div className="container-x">
      <p className="t-label text-center text-ink-3" data-reveal="">
        <Accent text={label} />
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 lg:mt-10" data-reveal="">
        {customers.map((customer) => {
          const size = customer.logo && displaySize(customer.logo);
          return (
            <li key={customer.name} className="flex h-16 w-[calc((100%-1.5rem)/3)] items-center justify-center rounded-2xl border border-line bg-white px-3 transition-shadow duration-300 hover:shadow-card sm:h-24 sm:w-[calc((100%-3rem)/4)] sm:px-5 lg:w-[calc((100%-5rem)/6)]">
              {customer.logo && size ? (
                <Image src={customer.logo.src} alt={customer.name} width={size.width} height={size.height} className="h-auto max-h-full max-w-full" />
              ) : (
                <span className="text-center text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">{customer.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
