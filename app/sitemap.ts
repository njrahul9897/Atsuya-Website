import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { allRoutes } from "@/lib/seo";

export const dynamic = "force-static";

// Every route in the registry, minus the placeholder blog posts (noindex until they have content).
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes()
    .filter((route) => !route.path.startsWith("/resources/blog/"))
    .map((route) => ({
      url: `${site.url}${route.path === "/" ? "" : route.path}`,
      changeFrequency: route.priority >= 0.8 ? "weekly" : "monthly",
      priority: route.priority,
    }));
}
