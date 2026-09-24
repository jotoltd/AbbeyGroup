import { promises as fs } from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";

export type DataKey =
  | "properties"
  | "developments"
  | "content"
  | "viewings"
  | "users";

const FILES: Record<DataKey, string> = {
  properties: "properties.json",
  developments: "developments.json",
  content: "content.json",
  viewings: "viewings.json",
  users: "users.json",
};

const BUCKET = "data";

const filePath = (key: DataKey) =>
  path.join(process.cwd(), "src/data", FILES[key]);

async function readFile<T>(key: DataKey, fallback: T): Promise<T> {
  const raw = await fs.readFile(filePath(key), "utf8").catch(() => null);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeFile(key: DataKey, value: unknown): Promise<void> {
  const file = filePath(key);
  const existing = await fs.readFile(file, "utf8").catch(() => null);
  if (existing) {
    const dir = path.join(process.cwd(), "src/data/backups");
    await fs.mkdir(dir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.writeFile(
      path.join(dir, `${FILES[key].replace(/\.json$/, "")}-${ts}.json`),
      existing,
    );
  }
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}

/**
 * Read a data document. Uses the private `data` Supabase storage bucket when
 * configured; otherwise (or when the object is missing) falls back to the
 * bundled JSON files so the site keeps working.
 */
export async function getDoc<T>(key: DataKey, fallback: T): Promise<T> {
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.storage
      .from(BUCKET)
      .download(`${key}.json`);
    if (!error && data) {
      try {
        return JSON.parse(await data.text()) as T;
      } catch {
        // fall through to file fallback
      }
    }
  }
  return readFile(key, fallback);
}

/**
 * Persist a data document. Backs up the previous version first — to
 * backups/ inside the bucket in Supabase, or src/data/backups/ in file mode.
 */
export async function setDoc(key: DataKey, value: unknown): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return writeFile(key, value);

  const { data: existing } = await sb.storage
    .from(BUCKET)
    .download(`${key}.json`);
  if (existing) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    await sb.storage
      .from(BUCKET)
      .upload(`backups/${key}-${ts}.json`, existing, {
        contentType: "application/json",
      });
  }
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(`${key}.json`, JSON.stringify(value, null, 2) + "\n", {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw new Error(error.message);
}
