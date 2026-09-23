import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { authorised } from "../_auth";

const DATA_FILE = path.join(process.cwd(), "src/data/viewings.json");

async function readAll() {
  const raw = await fs.readFile(DATA_FILE, "utf8").catch(() => "[]");
  const list = JSON.parse(raw);
  return Array.isArray(list) ? list : [];
}

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const list = await readAll();
  return NextResponse.json(list.slice().reverse());
}

export async function DELETE(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const list = await readAll();
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(list.filter((v) => v.id !== id), null, 2) + "\n",
      "utf8",
    );
  } catch {
    return NextResponse.json({ error: "Could not update file" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
