import Image from "next/image";
import { customers, type Customer } from "@/content/site";

// Marks are sized by area, not by a shared height, so a square emblem and a long wordmark carry
// the same visual weight: height = √(area ÷ aspect ratio), capped for the squarest marks. A
// logo's optional `scale` corrects for an unusually heavy or light mark.
const AREA = 3000; // px² at CSS size
const MAX_HEIGHT = 48;
function displaySize(logo: NonNullable<Customer["logo"]>) {
  const ratio = logo.width / logo.height;
  const height = Math.min(MAX_HEIGHT, Math.sqrt(AREA / ratio)) * (logo.scale ?? 1);
  return { width: Math.round(height * ratio), height: Math.round(height) };
}

// A static grid of customer marks. No carousel. The wall sits on the dark band, so at rest each
// mark is a light silhouette at 60%; on hover its cell turns white and the mark shows in full
// colour. Without a logo file (bigbasket and Grandiose, for now), the name is set in type.
export function LogoWall({ label }: { label: string }) {
  return (
    <div className="container-x">
      <p className="t-label text-ink-3" data-reveal="">
        {label}
      </p>
      <ul className="mt-6 grid grid-cols-2 overflow-hidden rounded-card border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6" data-reveal="">
        {customers.map((customer) => {
          const size = customer.logo && displaySize(customer.logo);
          return (
            <li key={customer.name} className={`group flex h-20 items-center justify-center border-r border-b border-line px-4 transition-colors duration-300 lg:h-24 ${customer.logo ? "hover:bg-white" : "hover:bg-paper"}`}>
              {customer.logo && size ? (
                <Image
                  src={customer.logo.src}
                  alt={customer.name}
                  width={size.width}
                  height={size.height}
                  className="opacity-60 brightness-0 invert transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
                />
              ) : (
                <span className="text-center text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink opacity-70 transition-opacity duration-300 group-hover:opacity-100">{customer.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
