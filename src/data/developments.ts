import data from "./developments.json";

export type Development = {
  slug: string;
  name: string;
  location: string;
  strapline: string;
  hero: string;
  description: string[];
  facts: [string, string][];
  nearby: string[];
  mapQuery: string;
};

export const developments: Development[] = data as Development[];

export const developmentLabel = (d: Development) => `${d.name}, ${d.location}`;
