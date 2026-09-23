import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";
import { authorised } from "../_auth";

const IMG_DIR = path.join(process.cwd(), "public/images");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const BUCKET = "images";

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

async function scanBucket(prefix: string): Promise<string[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, {
    limit: 1000,
  });
  if (error || !data) return [];
  const out: string[] = [];
  for (const e of data) {
    const name = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.id === null) {
      out.push(...(await scanBucket(name)));
    } else if (ALLOWED.has(path.extname(e.name).toLowerCase())) {
      out.push(sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl);
    }
  }
  return out;
}

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const [local, remote] = await Promise.all([
    scan(IMG_DIR, "/images/"),
    scanBucket(""),
  ]);
  return NextResponse.json([...new Set([...local, ...remote])].sort());
}
