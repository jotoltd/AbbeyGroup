import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";
import { getDoc, audit } from "@/data/store";
import { authorised, caller } from "../_auth";

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
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const [local, remote] = await Promise.all([
    scan(IMG_DIR, "/images/"),
    scanBucket(""),
  ]);
  return NextResponse.json([...new Set([...local, ...remote])].sort());
}

type Prop = { name: string; img?: string; gallery?: string[] };
type Dev = { name: string; hero?: string };

/** Where is this image used? Returns human-readable labels. */
async function findUsages(src: string): Promise<string[]> {
  const [props, devs] = await Promise.all([
    getDoc<Prop[]>("properties", []),
    getDoc<Dev[]>("developments", []),
  ]);
  const used: string[] = [];
  for (const p of props) {
    if (p.img === src) used.push(`${p.name} (main image)`);
    if (p.gallery?.includes(src)) used.push(`${p.name} (gallery)`);
  }
  for (const d of devs) {
    if (d.hero === src) used.push(`${d.name} (hero)`);
  }
  return used;
}

export async function DELETE(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const url = new URL(req.url);
  const src = url.searchParams.get("src");
  const force = url.searchParams.get("force") === "1";
  if (!src)
    return NextResponse.json({ error: "Missing src" }, { status: 400 });

  // Only images uploaded through the CMS may be deleted — bundled assets
  // under public/images/ belong to the repo, not the CMS.
  const sb = supabaseAdmin();
  const publicBase = sb
    ? sb.storage.from(BUCKET).getPublicUrl("").data.publicUrl
    : "";
  const bucketKey =
    publicBase && src.startsWith(publicBase)
      ? src.slice(publicBase.length)
      : null;
  const localRel = src.startsWith("/images/") ? src.slice("/images/".length) : null;
  const isUploaded = bucketKey?.startsWith("uploads/") || localRel?.startsWith("uploads/");
  if (!isUploaded)
    return NextResponse.json(
      { error: "Only CMS-uploaded images can be deleted" },
      { status: 400 },
    );

  const usedBy = await findUsages(src);
  if (usedBy.length && !force)
    return NextResponse.json({ usedBy }, { status: 409 });

  try {
    if (bucketKey) {
      const { error } = await sb!.storage.from(BUCKET).remove([bucketKey]);
      if (error)
        return NextResponse.json(
          { error: `Delete failed: ${error.message}` },
          { status: 500 },
        );
    } else if (localRel) {
      await fs.unlink(path.join(IMG_DIR, localRel));
    }
    await audit(
      caller(req) ?? "admin",
      "delete image",
      bucketKey ?? localRel ?? src,
    );
  } catch {
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, usedBy });
}
