import Image from "next/image";
import { customers } from "@/content/site";

// A static grid of customer marks: greyscale at 60%, full colour on hover. No carousel.
// Until a logo file is cleared and added in content/site.ts, the name is set in type.
export function LogoWall({ label }: { label: string }) {
  return (
    <div className="container-x">
      <p className="t-label text-ink-3" data-reveal="">
        {label}
      </p>
      <ul className="mt-6 grid grid-cols-2 overflow-hidden rounded-card border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6" data-reveal="">
        {customers.map((customer) => (
          <li key={customer.name} className="group flex h-20 items-center justify-center border-r border-b border-line px-4 transition-colors duration-300 hover:bg-paper lg:h-24">
            {customer.logo ? (
              <Image src={customer.logo} alt={customer.name} width={140} height={48} className="max-h-10 w-auto opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
            ) : (
              <span className="text-center text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink opacity-70 transition-opacity duration-300 group-hover:opacity-100">{customer.name}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <span className="tbd">[TBD: confirm each logo is cleared for public use, then add the logo files]</span>
      </p>
    </div>
  );
}
