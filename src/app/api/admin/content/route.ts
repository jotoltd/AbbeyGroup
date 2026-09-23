import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { authorised } from "../_auth";

const DATA_FILE = path.join(process.cwd(), "src/data/content.json");
const BACKUP_DIR = path.join(process.cwd(), "src/data/backups");

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an object" }, { status: 400 });
  }

  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const existing = await fs.readFile(DATA_FILE, "utf8").catch(() => null);
    if (existing) {
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      await fs.writeFile(path.join(BACKUP_DIR, `content-${ts}.json`), existing);
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2) + "\n", "utf8");
  } catch {
    return NextResponse.json(
      { error: "Could not write data file — host may be read-only." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
