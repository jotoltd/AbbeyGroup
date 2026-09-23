import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/viewings.json");

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
    const raw = await fs.readFile(DATA_FILE, "utf8").catch(() => "[]");
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) throw new Error();
    list.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2) + "\n", "utf8");
  } catch {
    return NextResponse.json({ error: "Could not save request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
