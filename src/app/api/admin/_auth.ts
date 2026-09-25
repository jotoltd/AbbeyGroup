import { getDoc } from "@/data/store";
import { verifyToken, type UserRec } from "@/lib/auth";

async function userExists(username: string) {
  const users = await getDoc<UserRec[]>("users", []);
  return users.some((u) => u.username === username);
}

export async function authorised(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const password = process.env.ADMIN_PASSWORD;

  // Recovery credential: the shared ADMIN_PASSWORD works as a bearer token.
  if (password && token === password) return true;

  // Session token: signature must verify AND the user must still exist —
  // removing a user revokes their access immediately.
  const username = token ? verifyToken(token) : null;
  if (username && (await userExists(username))) return true;

  // No password configured: only allow in local development
  if (!password) return process.env.NODE_ENV !== "production";
  return false;
}

/** Username of the token-authed caller, or null for password/dev auth. */
export function caller(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token ? verifyToken(token) : null;
}
