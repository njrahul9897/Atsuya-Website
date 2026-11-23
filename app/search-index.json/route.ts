import { allRoutes } from "@/lib/seo";

// The site search index: one entry per page, built from the route registry at build time and
// fetched by the search dialog the first time it opens (see components/layout/SiteSearch.tsx).
export const dynamic = "force-static";

export type SearchEntry = { path: string; title: string; section: string; description: string };

export function GET() {
  const entries: SearchEntry[] = allRoutes()
    .filter((route) => !route.title.startsWith("[TBD")) // placeholder posts are not content yet
    .map((route) => ({
      path: route.path,
      title: route.path === "/" ? "Home" : route.title.replace(/ \| AOne$/, ""),
      // Case studies carry their industry ("Case study · QSR"); other pages their parent section.
      section: route.og.eyebrow.startsWith("Case study") ? route.og.eyebrow : (route.crumbs[route.crumbs.length - 1]?.name ?? ""),
      description: route.description,
    }));
  return Response.json(entries);
}
