import { NextResponse } from "next/server";
import { getDoc } from "@/data/store";
import { signToken, verifyPassword, type UserRec } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { username, password } = body ?? {};
  if (!username || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const users = await getDoc<UserRec[]>("users", []);
  const user = users.find(
    (u) => u.username.toLowerCase() === String(username).toLowerCase(),
  );
  if (!user || !verifyPassword(user, String(password))) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const token = signToken(user.username);
  if (!token)
    return NextResponse.json(
      { error: "Auth not configured on this host" },
      { status: 500 },
    );

  return NextResponse.json({ token, username: user.username });
}
