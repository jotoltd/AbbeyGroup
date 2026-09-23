import { getDoc } from "./store";
import { properties as fallbackProperties, type Property } from "./properties";
import {
  developments as fallbackDevelopments,
  type Development,
} from "./developments";
import { content as fallbackContent, type SiteContent } from "./content";

export type Viewing = {
  id: string;
  slug: string;
  property: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  createdAt: string;
};

export const getProperties = () =>
  getDoc<Property[]>("properties", fallbackProperties);

export const getDevelopments = () =>
  getDoc<Development[]>("developments", fallbackDevelopments);

export const getContent = () => getDoc<SiteContent>("content", fallbackContent);

export const getViewings = () => getDoc<Viewing[]>("viewings", []);
