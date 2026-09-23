import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDoc, setDoc } from "@/data/store";
import { authorised } from "../_auth";

type Dev = { slug: string; name: string; location: string };
type Prop = { development: string };

const label = (d: { name: string; location: string }) =>
  `${d.name}, ${d.location}`;

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await getDoc("developments", []));
}

export async function PUT(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Expected an array of developments" },
      { status: 400 },
    );
  }

  const slugs = new Set<string>();
  for (const d of body) {
    if (!d?.name?.trim())
      return NextResponse.json(
        { error: "Every development needs a name" },
        { status: 400 },
      );
    if (!d?.slug?.trim() || slugs.has(d.slug))
      return NextResponse.json(
        { error: `Duplicate or empty slug: "${d?.slug}"` },
        { status: 400 },
      );
    slugs.add(d.slug);
  }

  try {
    const oldDevs = await getDoc<Dev[]>("developments", []);
    const props = await getDoc<Prop[]>("properties", []);
    const usedBy = (l: string) =>
      props.filter((p) => p.development === l).length;

    // Block deleting a development that still has listings
    for (const old of oldDevs) {
      const stillThere = body.some((d) => d.slug === old.slug);
      const n = usedBy(label(old));
      if (!stillThere && n > 0) {
        return NextResponse.json(
          {
            error: `"${label(old)}" has ${n} listing${n > 1 ? "s" : ""} — reassign or remove them first.`,
          },
          { status: 400 },
        );
      }
    }

    // If a development's name/location changed, re-point its listings
    let propsChanged = false;
    for (const d of body) {
      const old = oldDevs.find((o) => o.slug === d.slug);
      if (old && label(old) !== label(d)) {
        for (const p of props) {
          if (p.development === label(old)) {
            p.development = label(d);
            propsChanged = true;
          }
        }
      }
    }

    await setDoc("developments", body);
    if (propsChanged) await setDoc("properties", props);
    revalidatePath("/", "layout");
  } catch {
    return NextResponse.json(
      { error: "Could not save developments — check Supabase configuration." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
