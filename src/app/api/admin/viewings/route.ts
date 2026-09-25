import { NextResponse } from "next/server";
import { getDoc, setDoc } from "@/data/store";
import { authorised } from "../_auth";

type Viewing = { id: string };

export async function GET(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const list = await getDoc<Viewing[]>("viewings", []);
  return NextResponse.json(list.slice().reverse());
}

export async function DELETE(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const list = await getDoc<Viewing[]>("viewings", []);
    await setDoc(
      "viewings",
      list.filter((v) => v.id !== id),
    );
  } catch {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
