import { promises as fs } from "fs";
import https from "https";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";

export type DataKey =
  | "properties"
  | "developments"
  | "content"
  | "viewings"
  | "enquiries"
  | "users"
  | "log";

const FILES: Record<DataKey, string> = {
  properties: "properties.json",
  developments: "developments.json",
  content: "content.json",
  viewings: "viewings.json",
  enquiries: "enquiries.json",
  users: "users.json",
  log: "log.json",
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
 * GET a URL via the https module instead of fetch(). Next.js patches global
 * fetch with its Data Cache, which can serve a stale copy of a storage
 * object after an overwrite — breaking read-after-write (e.g. signing in
 * right after a user is created) and corrupting read-modify-write saves.
 * https.request is untouched by Next and always hits the network.
 */
function httpsGet(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(null);
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
      })
      .on("error", () => resolve(null));
  });
}

/** Fresh read of a document straight from the bucket via a signed URL. */
async function downloadFresh(key: DataKey): Promise<string | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  const { data } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(`${key}.json`, 60);
  if (!data?.signedUrl) return null;
  return httpsGet(data.signedUrl);
}

/**
 * Read a data document. Uses the private `data` Supabase storage bucket when
 * configured; otherwise (or when the object is missing) falls back to the
 * bundled JSON files so the site keeps working.
 */
export async function getDoc<T>(key: DataKey, fallback: T): Promise<T> {
  const text = await downloadFresh(key);
  if (text !== null) {
    try {
      return JSON.parse(text) as T;
    } catch {
      // fall through to file fallback
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

  const existing = await downloadFresh(key);
  if (existing !== null) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    await sb.storage
      .from(BUCKET)
      .upload(`backups/${key}-${ts}.json`, existing, {
        contentType: "application/json",
      });
  }
  // cacheControl 0 on the object metadata as a second line of defence against
  // CDN-cached copies being served to anything that still uses download().
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(`${key}.json`, JSON.stringify(value, null, 2) + "\n", {
      contentType: "application/json",
      cacheControl: "0",
      upsert: true,
    });
  if (error) throw new Error(error.message);
}

export type LogEntry = {
  at: string;
  user: string;
  action: string;
  detail: string;
};

const LOG_CAP = 300;

/** Append an audit-log entry. Best-effort — never throws. */
export async function audit(
  user: string,
  action: string,
  detail = "",
): Promise<void> {
  try {
    const log = await getDoc<LogEntry[]>("log", []);
    log.unshift({ at: new Date().toISOString(), user, action, detail });
    await setDoc("log", log.slice(0, LOG_CAP));
  } catch {
    // logging must never break the underlying operation
  }
}
