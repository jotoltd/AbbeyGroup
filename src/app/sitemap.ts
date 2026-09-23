import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { developments } from "@/data/developments";

const BASE = "https://www.theabbeygroupnorfolk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/our-story",
    "/for-sale",
    "/new-projects",
    "/contact",
    ...developments.map((d) => `/developments/${d.slug}`),
    ...properties
      .filter((p) => p.status !== "Draft")
      .map((p) => `/for-sale/${p.slug}`),
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));
}
