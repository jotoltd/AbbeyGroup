export function authorised(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  // No password configured: only allow in local development
  if (!password) return process.env.NODE_ENV !== "production";
  return req.headers.get("authorization") === `Bearer ${password}`;
}
