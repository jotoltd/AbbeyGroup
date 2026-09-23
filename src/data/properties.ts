import data from "./properties.json";

export type PropertyStatus = "For Sale" | "Sold STC" | "Sold" | "Draft";

export type Property = {
  slug: string;
  name: string;
  development: "Wood Farm, Edgefield" | "Abbey Farm, Alby";
  price: number;
  beds: number;
  type: string;
  status: PropertyStatus;
  img: string;
  gallery: string[];
  blurb: string;
};

export const properties: Property[] = data as Property[];

export const formatPrice = (n: number) => `£${n.toLocaleString("en-GB")}`;
