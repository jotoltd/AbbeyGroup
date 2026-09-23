import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDoc, setDoc } from "@/data/store";
import { authorised } from "../_auth";

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await getDoc("content", {}));
}

export async function PUT(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an object" }, { status: 400 });
  }

  try {
    await setDoc("content", body);
    revalidatePath("/", "layout");
  } catch {
    return NextResponse.json(
      { error: "Could not save content — check Supabase configuration." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
