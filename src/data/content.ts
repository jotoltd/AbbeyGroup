import data from "./content.json";

export type SiteContent = {
  home: {
    heroSubline: string;
    aboutP1: string;
    aboutP2: string;
  };
  story: {
    intro1: string;
    intro2: string;
    intro3: string;
    founderJonathan: string;
    founderAdam: string;
  };
};

export const content = data as SiteContent;
