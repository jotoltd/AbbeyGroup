import { NextResponse } from "next/server";
import { getDoc, setDoc, audit } from "@/data/store";
import type { Enquiry, EnquiryStatus } from "@/data/server";
import { authorised, caller } from "../_auth";

const STATUSES: EnquiryStatus[] = ["new", "in-progress", "done"];

export async function GET(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const list = await getDoc<Enquiry[]>("enquiries", []);
  return NextResponse.json(list.slice().reverse());
}

export async function PATCH(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { id, status, note } = body ?? {};
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (status && !STATUSES.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  try {
    const list = await getDoc<Enquiry[]>("enquiries", []);
    const entry = list.find((e) => e.id === id);
    if (!entry)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (status) entry.status = status;
    if (typeof note === "string") entry.note = note.slice(0, 2000);
    await setDoc("enquiries", list);
    await audit(caller(req) ?? "admin", "update enquiry", entry.name);
  } catch {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const list = await getDoc<Enquiry[]>("enquiries", []);
    const entry = list.find((e) => e.id === id);
    await setDoc(
      "enquiries",
      list.filter((e) => e.id !== id),
    );
    await audit(caller(req) ?? "admin", "delete enquiry", entry?.name ?? id);
  } catch {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
