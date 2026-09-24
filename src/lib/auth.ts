import crypto from "crypto";

export type UserRec = {
  id: string;
  username: string;
  salt: string;
  hash: string;
  createdAt: string;
};

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const secret = () =>
  process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;

export function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function newUser(username: string, password: string): UserRec {
  const salt = crypto.randomBytes(16).toString("hex");
  return {
    id: crypto.randomBytes(8).toString("hex"),
    username,
    salt,
    hash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
}

export function verifyPassword(user: UserRec, password: string) {
  const a = Buffer.from(hashPassword(password, user.salt), "hex");
  const b = Buffer.from(user.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const b64u = (s: string | Buffer) =>
  Buffer.from(s).toString("base64url");

const sign = (payload: string, key: string) =>
  crypto.createHmac("sha256", key).update(payload).digest("base64url");

/** Stateless session token: base64url(`${username}:${exp}`).hmac */
export function signToken(username: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload = `${username}:${Date.now() + TOKEN_TTL_MS}`;
  return `${b64u(payload)}.${sign(payload, key)}`;
}

export function verifyToken(token: string): string | null {
  const key = secret();
  if (!key) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const payload = Buffer.from(payloadB64, "base64url").toString();
  const expected = sign(payload, key);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const sep = payload.lastIndexOf(":");
  if (sep < 0) return null;
  const username = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!username || !Number.isFinite(exp) || exp < Date.now()) return null;
  return username;
}
