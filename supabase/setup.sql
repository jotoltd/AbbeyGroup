-- Abbey Group — Supabase setup
-- Run once in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/xrpwkaqzuupjctaxqisn/sql/new

-- Single-document store for site data managed via /admin
create table if not exists public.site_data (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Snapshot of the previous version before each admin save
create table if not exists public.site_data_backups (
  id bigint generated always as identity primary key,
  key text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.site_data enable row level security;
alter table public.site_data_backups enable row level security;
-- No public policies: reads/writes go through the service role key,
-- which bypasses RLS. The anon key cannot read these tables.

-- Public bucket for admin image uploads (site reads via public URLs)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Seed current site data
insert into public.site_data (key, data) values
  ('content', '{
  "home": {
    "heroSubline": "Design-led new-build homes and barn conversions, from £475,000 — private viewings by appointment.",
    "aboutP1": "The Abbey Group, with a combined 50 years of experience in the design and construction industries, excels in design-led luxury property development.",
    "aboutP2": "Our approach merges aesthetic architecture with practical construction to create superior projects that meet modern standards of living, sustainability and innovation — residential spaces that stand as landmarks of quality and design."
  },
  "story": {
    "intro1": "Welcome to The Abbey Group, a property development company based in the heart of Norfolk. Our passion for creating exceptional spaces and our commitment to excellence have established us as a trusted name in the industry.",
    "intro2": "We believe in the power of design to transform spaces and enrich lives. “Design-led construction” encapsulates our philosophy of placing design at the forefront of every project — crafting spaces that are beautiful, functional, sustainable and tailored to the people who live in them.",
    "intro3": "Founders Jonathan & Adam bring over 50 years of combined industry experience — designer and builder working seamlessly together to control the entire development process from concept to completion.",
    "founderJonathan": "Jonathan leads on design and vision for every Abbey Group project, shaping homes that sit naturally within Norfolk''s landscape.",
    "founderAdam": "Adam leads construction, bringing the craftsmanship and project management that turns each design into a finished home."
  }
}'::jsonb),
  ('developments', '[
  {
    "slug": "wood-farm",
    "name": "Wood Farm",
    "location": "Edgefield, Norfolk",
    "strapline": "Fifteen individually designed homes within 27 acres of North Norfolk countryside.",
    "hero": "/images/project-1.jpeg",
    "description": [
      "Set within 27 acres of beautiful North Norfolk countryside, Wood Farm is an exclusive collection of fifteen individually designed homes, combining the character of traditional Norfolk barns with the comfort, efficiency and quality expected of modern luxury living.",
      "The development comprises a carefully curated mix of extensively renovated barn conversions and newly created homes — every property finished to an exceptional standard with high-quality materials, energy-efficient construction, premium specifications and generous outdoor space.",
      "Extensive landscaping, native tree planting and carefully considered design have transformed the former farmstead into a distinctive collection of homes that respect their rural setting while delivering modern standards of living."
    ],
    "facts": [
      ["Location", "Edgefield, three miles from Holt"],
      ["Collection", "15 individually designed homes"],
      ["Guide price", "£545,000 – £1,095,000"],
      ["Agent", "Savills"]
    ],
    "nearby": [
      "Holt — 3 miles",
      "Blakeney & Cley — ~15 mins",
      "Wells-next-the-Sea — ~25 mins",
      "Norwich — ~40 mins"
    ],
    "mapQuery": "Wood Farm, Plumstead Road, Edgefield, Norfolk NR24 2AQ"
  },
  {
    "slug": "abbey-farm",
    "name": "Abbey Farm",
    "location": "Alby, Norfolk",
    "strapline": "A collection of beautifully converted barns blending rustic character with modern comfort.",
    "hero": "/images/story-barn-1.jpg",
    "description": [
      "Abbey Farm is a collection of thoughtfully converted barns and a substantial farmhouse in the village of Alby, in the heart of the North Norfolk countryside.",
      "Each home offers spacious open-plan living, en-suite bedrooms and picturesque gardens — rustic character balanced with modern comfort in a tranquil rural setting."
    ],
    "facts": [
      ["Location", "Alby, near Aylsham"],
      ["Collection", "Barn conversions & farmhouse"],
      ["Guide price", "£475,000 – £1,495,000"]
    ],
    "nearby": [
      "Aylsham — ~10 mins",
      "Holt — ~15 mins",
      "Cromer & the coast — ~20 mins",
      "Norwich — ~35 mins"
    ],
    "mapQuery": "Abbey Farm, Alby, Norfolk"
  }
]'::jsonb),
  ('properties', '[
  {
    "slug": "mulberry-house",
    "name": "Mulberry House",
    "development": "Abbey Farm, Alby",
    "price": 1495000,
    "beds": 5,
    "type": "Farmhouse",
    "status": "For Sale",
    "img": "/images/sale-1.jpg",
    "gallery": ["/images/sale-1.jpg", "/images/barn-12.jpg", "/images/barn-9.jpg"],
    "blurb": "An impressive 5,000 sq ft five-bedroom farmhouse offering a spacious open-plan kitchen and living area, utility, en-suites to every bedroom and a picturesque garden — rustic character meets modern comfort in a tranquil countryside setting."
  },
  {
    "slug": "meadow-view-barn",
    "name": "Meadow View Barn",
    "development": "Abbey Farm, Alby",
    "price": 645000,
    "beds": 4,
    "type": "Barn conversion",
    "status": "For Sale",
    "img": "/images/sale-2.jpg",
    "gallery": ["/images/sale-2.jpg", "/images/barn-14.jpg"],
    "blurb": "A beautifully converted four-bedroom barn at Abbey Farm, offering a spacious open-plan kitchen and living area, utility, en-suite bedrooms and a picturesque garden for outdoor enjoyment — a blend of rustic character and modern comfort in a tranquil countryside setting."
  },
  {
    "slug": "7-wood-farm-barns",
    "name": "7 Wood Farm Barns",
    "development": "Wood Farm, Edgefield",
    "price": 795000,
    "beds": 3,
    "type": "Barn conversion",
    "status": "Sold STC",
    "img": "/images/sale-3.jpg",
    "gallery": ["/images/sale-3.jpg"],
    "blurb": "A beautifully converted three-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "3-wood-farm-barns",
    "name": "3 Wood Farm Barns",
    "development": "Wood Farm, Edgefield",
    "price": 775000,
    "beds": 3,
    "type": "Barn conversion",
    "status": "Sold STC",
    "img": "/images/sale-4.jpg",
    "gallery": ["/images/sale-4.jpg"],
    "blurb": "A beautifully converted three-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "6-wood-farm-barns",
    "name": "6 Wood Farm Barns",
    "development": "Wood Farm, Edgefield",
    "price": 1095000,
    "beds": 4,
    "type": "Barn conversion",
    "status": "Sold STC",
    "img": "/images/sale-5.jpg",
    "gallery": ["/images/sale-5.jpg"],
    "blurb": "A beautifully converted four-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "4-wood-farm-barns",
    "name": "4 Wood Farm Barns",
    "development": "Wood Farm, Edgefield",
    "price": 575000,
    "beds": 2,
    "type": "Barn conversion",
    "status": "Sold STC",
    "img": "/images/sale-6.jpg",
    "gallery": ["/images/sale-6.jpg"],
    "blurb": "A beautifully converted two-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "field-view-barn",
    "name": "Field View Barn",
    "development": "Abbey Farm, Alby",
    "price": 995000,
    "beds": 5,
    "type": "Barn conversion",
    "status": "Sold",
    "img": "/images/sale-7.jpg",
    "gallery": ["/images/sale-7.jpg"],
    "blurb": "A beautifully converted five-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "deers-rest",
    "name": "Deers Rest",
    "development": "Abbey Farm, Alby",
    "price": 625000,
    "beds": 3,
    "type": "Barn conversion",
    "status": "Sold",
    "img": "/images/sale-8.jpeg",
    "gallery": ["/images/sale-8.jpeg"],
    "blurb": "A beautifully converted three-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "beechwood-barn",
    "name": "Beechwood Barn",
    "development": "Abbey Farm, Alby",
    "price": 595000,
    "beds": 3,
    "type": "Barn conversion",
    "status": "Sold",
    "img": "/images/sale-9.jpeg",
    "gallery": ["/images/sale-9.jpeg"],
    "blurb": "A beautifully converted three-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "westview-barn",
    "name": "Westview Barn",
    "development": "Abbey Farm, Alby",
    "price": 595000,
    "beds": 3,
    "type": "Barn conversion",
    "status": "Sold",
    "img": "/images/barn-9.jpg",
    "gallery": ["/images/barn-9.jpg"],
    "blurb": "A beautifully converted three-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  },
  {
    "slug": "courtyard-barn",
    "name": "Courtyard Barn",
    "development": "Abbey Farm, Alby",
    "price": 525000,
    "beds": 2,
    "type": "Barn conversion",
    "status": "Sold",
    "img": "/images/barn-14.jpg",
    "gallery": ["/images/barn-14.jpg"],
    "blurb": "A beautifully converted two-bedroom barn offering spacious open-plan living, en-suite bedrooms and a picturesque garden — a blend of rustic character and modern comfort."
  }
]'::jsonb),
  ('viewings', '[
  {
    "id": "1790164578300-4giz1e",
    "slug": "meadow-view-barn",
    "property": "Meadow View Barn",
    "name": "Josh",
    "email": "itsjm@icliud.com",
    "phone": "011320220",
    "date": "2026-09-24",
    "message": "",
    "createdAt": "2026-09-23T11:56:18.300Z"
  }
]'::jsonb)
on conflict (key) do nothing;
