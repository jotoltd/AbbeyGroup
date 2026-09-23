import { promises as fs } from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";

export type DataKey = "properties" | "developments" | "content" | "viewings";

const FILES: Record<DataKey, string> = {
  properties: "properties.json",
  developments: "developments.json",
  content: "content.json",
  viewings: "viewings.json",
};

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
 * Read a data document. Uses Supabase when configured; otherwise (or when the
 * row/table is missing, e.g. setup.sql not yet run) falls back to the bundled
 * JSON files so the site keeps working.
 */
export async function getDoc<T>(key: DataKey, fallback: T): Promise<T> {
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("site_data")
      .select("data")
      .eq("key", key)
      .maybeSingle();
    if (!error && data) return data.data as T;
  }
  return readFile(key, fallback);
}

/**
 * Persist a data document. Backs up the previous version first —
 * to site_data_backups in Supabase, or src/data/backups/ in file mode.
 */
export async function setDoc(key: DataKey, value: unknown): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return writeFile(key, value);

  const { data: existing } = await sb
    .from("site_data")
    .select("data")
    .eq("key", key)
    .maybeSingle();
  if (existing) {
    await sb.from("site_data_backups").insert({ key, data: existing.data });
  }
  const { error } = await sb.from("site_data").upsert({ key, data: value });
  if (error) throw new Error(error.message);
}
