import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { allRoutes, ogSegments } from "@/lib/seo";

// One Open Graph image per page, rendered at build time from the route registry:
// /og/home.png, /og/industries/manufacturing.png, /og/customers/dana.png …
export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = () => allRoutes().map((route) => ({ slug: ogSegments(route.path) }));

const font = (file: string) => readFile(join(process.cwd(), "assets", "fonts", file));

const BLUE = "#1f77bd";
const NIGHT = "#0a0e1a";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/");
  const route = allRoutes().find((entry) => ogSegments(entry.path).join("/") === key);
  if (!route) return new Response("Not found", { status: 404 });

  const [semibold, regular, mono] = await Promise.all([font("SchibstedGrotesk-SemiBold.ttf"), font("SchibstedGrotesk-Regular.ttf"), font("JetBrainsMono-Medium.ttf")]);
  const { eyebrow, title, stat } = route.og;
  const titleSize = title.length > 60 ? 56 : title.length > 36 ? 68 : 84;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: NIGHT, color: "#fff", padding: 72, fontFamily: "Schibsted" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Mono", fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.78)", textTransform: "uppercase" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: BLUE, marginRight: 16 }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.6)" }}>AONE · ATSUYA TECHNOLOGIES</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.06, letterSpacing: -2, fontWeight: 600, maxWidth: 1000 }}>{title}</div>
          {stat ? (
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 44, borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 32 }}>
              <div style={{ display: "flex", fontSize: 64, fontWeight: 600, letterSpacing: -2, color: "#fff", background: BLUE, padding: "4px 22px 8px", borderRadius: 12 }}>{stat.value.replace("→", "to")}</div>
              <div style={{ display: "flex", fontSize: 30, marginLeft: 28, color: "rgba(255,255,255,0.85)" }}>{stat.label}</div>
            </div>
          ) : (
            <div style={{ display: "flex", marginTop: 44, borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 32, fontSize: 28, color: "rgba(255,255,255,0.8)" }}>Operational intelligence: AOne IoT, Vision AI and BluSquad.</div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Schibsted", data: semibold, weight: 600, style: "normal" },
        { name: "Schibsted", data: regular, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
