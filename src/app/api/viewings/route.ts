import { NextResponse } from "next/server";
import { getDoc, setDoc } from "@/data/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { slug, property, name, email, phone, date, message } = body ?? {};

  if (!slug || !property || !name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug: String(slug).slice(0, 100),
    property: String(property).slice(0, 200),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone || "").slice(0, 50),
    date: String(date || "").slice(0, 50),
    message: String(message || "").slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  try {
    const list = await getDoc<unknown[]>("viewings", []);
    list.push(entry);
    await setDoc("viewings", list);
  } catch {
    return NextResponse.json({ error: "Could not save request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
