import { NextResponse } from "next/server";
import { getDoc } from "@/data/store";
import { signToken, verifyPassword, type UserRec } from "@/lib/auth";

// Fixed dummy record so an unknown username still runs scrypt — prevents
// enumerating valid usernames via response timing.
const DUMMY: UserRec = {
  id: "",
  username: "",
  salt: "6576616e747265736974",
  hash: "0".repeat(128),
  createdAt: "",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { username, password } = body ?? {};
  if (!username || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const users = await getDoc<UserRec[]>("users", []);
  const user = users.find(
    (u) => u.username.toLowerCase() === String(username).toLowerCase(),
  );

  if (user && verifyPassword(user, String(password))) {
    const token = signToken(user.username);
    if (!token)
      return NextResponse.json(
        { error: "Auth not configured on this host" },
        { status: 500 },
      );
    return NextResponse.json({ token, username: user.username });
  }

  // Recovery path: the shared ADMIN_PASSWORD signs in as "admin", which
  // restores access if the users document is ever lost or every account
  // is removed. It also works as a bearer token on the admin APIs.
  const master = process.env.ADMIN_PASSWORD;
  if (master && String(password) === master)
    return NextResponse.json({ token: master, username: "admin" });

  // Dev bootstrap: no users and no password configured locally — let the
  // developer in so they can create the first account.
  if (process.env.NODE_ENV !== "production" && !master && users.length === 0) {
    const token = signToken(String(username)) ?? "dev";
    return NextResponse.json({ token, username: String(username) });
  }

  verifyPassword(DUMMY, String(password));
  return NextResponse.json(
    { error: "Invalid username or password" },
    { status: 401 },
  );
}
