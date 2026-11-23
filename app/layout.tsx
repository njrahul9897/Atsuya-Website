import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Motion } from "@/components/providers/Motion";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { RevealObserver } from "@/components/providers/RevealObserver";

// One typeface family for headings and body. latin-ext carries the rupee sign.
// [TBD: confirm whether Atsuya has a brand typeface; if so, swap it in here]
const schibsted = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-schibsted", display: "swap" });
// Data labels: sensor readouts, timestamps, stat captions.
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

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
