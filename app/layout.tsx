import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Motion } from "@/components/providers/Motion";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { RevealObserver } from "@/components/providers/RevealObserver";

// Fonts are self-hosted (assets/fonts, SIL OFL), so a build never fetches from Google Fonts:
// a bad Google Fonts response once failed the Vercel build inside next/font/google.

// One typeface family for headings and body: variable, weights 400–900, Latin and Latin
// Extended (which carries the rupee sign).
// [TBD: confirm whether Atsuya has a brand typeface; if so, swap it in here]
const schibsted = localFont({ src: "../assets/fonts/SchibstedGrotesk.woff2", weight: "400 900", variable: "--font-schibsted", display: "swap" });
// Data labels: sensor readouts, timestamps, stat captions. Latin, weights 400–500.
const jetbrains = localFont({ src: "../assets/fonts/JetBrainsMono.woff2", weight: "400 500", variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "AOne by Atsuya | See every asset. Act before it costs you.", template: "%s | AOne by Atsuya" },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${schibsted.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that scripts run, so entrance motion only hides content when it can reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-ink">
          Skip to content
        </a>
        <Motion>{children}</Motion>
        <SmoothScroll />
        <RevealObserver />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
