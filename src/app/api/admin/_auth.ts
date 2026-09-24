import { verifyToken } from "@/lib/auth";

export function authorised(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token && verifyToken(token)) return true;
  const password = process.env.ADMIN_PASSWORD;
  // No password configured: only allow in local development
  if (!password) return process.env.NODE_ENV !== "production";
  return token === password;
}
