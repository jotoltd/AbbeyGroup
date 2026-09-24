import { NextResponse } from "next/server";
import { getDoc, setDoc } from "@/data/store";
import { newUser, type UserRec } from "@/lib/auth";
import { authorised } from "../_auth";

export async function GET(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const users = await getDoc<UserRec[]>("users", []);
  return NextResponse.json(
    users.map(({ id, username, createdAt }) => ({ id, username, createdAt })),
  );
}

export async function POST(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const username = String(body?.username ?? "").trim();
  const password = String(body?.password ?? "");
  if (!username || username.length > 50)
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );

  try {
    const users = await getDoc<UserRec[]>("users", []);
    const next = users.filter(
      (u) => u.username.toLowerCase() !== username.toLowerCase(),
    );
    next.push(newUser(username, password));
    await setDoc("users", next);
  } catch {
    return NextResponse.json(
      { error: "Could not save user — check Supabase configuration." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!authorised(req))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const username = new URL(req.url).searchParams.get("username");
  if (!username)
    return NextResponse.json({ error: "Missing username" }, { status: 400 });

  try {
    const users = await getDoc<UserRec[]>("users", []);
    const next = users.filter(
      (u) => u.username.toLowerCase() !== username.toLowerCase(),
    );
    if (next.length === users.length)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (next.length === 0)
      return NextResponse.json(
        { error: "Cannot delete the last user" },
        { status: 400 },
      );
    await setDoc("users", next);
  } catch {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
