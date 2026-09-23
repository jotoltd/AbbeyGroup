import type { MetadataRoute } from "next";
import { getDevelopments, getProperties } from "@/data/server";

const BASE = "https://www.theabbeygroupnorfolk.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [developments, properties] = await Promise.all([
    getDevelopments(),
    getProperties(),
  ]);
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
