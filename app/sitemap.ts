import type { MetadataRoute } from "next";
import { DOCS_FLAT } from "./_content/docs-nav";

export const dynamic = "force-static";

const SITE_URL = process.env.SITE_URL || "https://tibyaan-org.github.io";

// The docs routes come from the one docs tree, so a new page reaches the sitemap by itself.
const routes = ["/", "/how-it-works/", "/evidence/", "/landscape/", ...DOCS_FLAT.map((d) => d.href)];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    changeFrequency: "monthly",
    priority: r === "/" ? 1 : 0.7,
  }));
}
