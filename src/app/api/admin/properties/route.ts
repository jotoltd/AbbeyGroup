import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDoc, setDoc, audit } from "@/data/store";
import { authorised, caller } from "../_auth";

export async function GET(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await getDoc("properties", []));
}

export async function PUT(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Expected an array of properties" },
      { status: 400 },
    );
  }

  const slugs = new Set<string>();
  for (const p of body) {
    if (!p?.name?.trim())
      return NextResponse.json(
        { error: "Every listing needs a name" },
        { status: 400 },
      );
    if (!p?.slug?.trim() || slugs.has(p.slug))
      return NextResponse.json(
        { error: `Duplicate or empty slug: "${p?.slug}"` },
        { status: 400 },
      );
    slugs.add(p.slug);
  }

  try {
    await setDoc("properties", body);
    await audit(caller(req) ?? "admin", "save listings", `${body.length} items`);
    revalidatePath("/", "layout");
  } catch {
    return NextResponse.json(
      { error: "Could not save properties — check Supabase configuration." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
