import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.SITE_URL || "https://tibyaan-org.github.io";

const routes = [
  "/",
  "/how-it-works/",
  "/evidence/",
  "/landscape/",
  "/docs/",
  "/docs/getting-started/",
  "/docs/security/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    changeFrequency: "monthly",
    priority: r === "/" ? 1 : 0.7,
  }));
}
