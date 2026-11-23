import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft } from "@/components/ui/icons";

// Focused conversion pages: no navigation, just the logo and a way back.
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="Atsuya Technologies, home">
            <Logo className="h-8 w-auto lg:h-9" />
          </Link>
          <Link href="/" className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink-2 transition-colors duration-200 hover:text-ink">
            <ArrowLeft className="transition-transform duration-300 ease-soft group-hover:-translate-x-1" />
            Back to site
          </Link>
        </div>
      </header>
      <main id="main">{children}</main>
    </>
  );
}
