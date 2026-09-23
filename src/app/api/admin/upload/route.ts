import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { authorised } from "../_auth";

const UPLOAD_DIR = path.join(process.cwd(), "public/images/uploads");
const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export async function POST(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED.has(ext))
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });

  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filename = `${base || "image"}-${Date.now()}.${ext}`;

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(
      path.join(UPLOAD_DIR, filename),
      Buffer.from(await file.arrayBuffer()),
    );
  } catch {
    return NextResponse.json(
      { error: "Could not write file — host may be read-only" },
      { status: 500 },
    );
  }

  return NextResponse.json({ path: `/images/uploads/${filename}` });
}
