import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { authorised } from "../_auth";

const IMG_DIR = path.join(process.cwd(), "public/images");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

async function scan(dir: string, prefix: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out: string[] = [];
    for (const e of entries) {
      if (e.isDirectory()) {
        out.push(...(await scan(path.join(dir, e.name), `${prefix}${e.name}/`)));
      } else if (ALLOWED.has(path.extname(e.name).toLowerCase())) {
        out.push(`${prefix}${e.name}`);
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const images = await scan(IMG_DIR, "/images/");
  return NextResponse.json(images.sort());
}
