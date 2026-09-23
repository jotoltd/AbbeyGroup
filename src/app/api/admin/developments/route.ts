import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { authorised } from "../_auth";

const DEV_FILE = path.join(process.cwd(), "src/data/developments.json");
const PROP_FILE = path.join(process.cwd(), "src/data/properties.json");
const BACKUP_DIR = path.join(process.cwd(), "src/data/backups");

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const raw = await fs.readFile(DEV_FILE, "utf8");
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Expected an array of developments" },
      { status: 400 },
    );
  }

  const slugs = new Set<string>();
  for (const d of body) {
    if (!d?.name?.trim())
      return NextResponse.json(
        { error: "Every development needs a name" },
        { status: 400 },
      );
    if (!d?.slug?.trim() || slugs.has(d.slug))
      return NextResponse.json(
        { error: `Duplicate or empty slug: "${d?.slug}"` },
        { status: 400 },
      );
    slugs.add(d.slug);
  }

  const label = (d: { name: string; location: string }) =>
    `${d.name}, ${d.location}`;

  try {
    const oldRaw = await fs.readFile(DEV_FILE, "utf8").catch(() => null);
    const propsRaw = await fs.readFile(PROP_FILE, "utf8").catch(() => "[]");
    const oldDevs = oldRaw ? JSON.parse(oldRaw) : [];
    const props = JSON.parse(propsRaw);
    const usedBy = (l: string) =>
      props.filter((p: { development: string }) => p.development === l).length;

    // Block deleting a development that still has listings
    for (const old of oldDevs) {
      const stillThere = body.some((d) => d.slug === old.slug);
      const n = usedBy(label(old));
      if (!stillThere && n > 0) {
        return NextResponse.json(
          {
            error: `"${label(old)}" has ${n} listing${n > 1 ? "s" : ""} — reassign or remove them first.`,
          },
          { status: 400 },
        );
      }
    }

    // If a development's name/location changed, re-point its listings
    let propsChanged = false;
    for (const d of body) {
      const old = oldDevs.find(
        (o: { slug: string }) => o.slug === d.slug,
      );
      if (old && label(old) !== label(d)) {
        for (const p of props) {
          if (p.development === label(old)) {
            p.development = label(d);
            propsChanged = true;
          }
        }
      }
    }

    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    if (oldRaw)
      await fs.writeFile(
        path.join(BACKUP_DIR, `developments-${ts}.json`),
        oldRaw,
      );
    if (propsChanged)
      await fs.writeFile(
        path.join(BACKUP_DIR, `properties-${ts}.json`),
        propsRaw,
      );

    await fs.writeFile(DEV_FILE, JSON.stringify(body, null, 2) + "\n", "utf8");
    if (propsChanged)
      await fs.writeFile(
        PROP_FILE,
        JSON.stringify(props, null, 2) + "\n",
        "utf8",
      );
  } catch {
    return NextResponse.json(
      { error: "Could not write data files — host may be read-only." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
