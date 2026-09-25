import { NextResponse } from "next/server";
import { getDoc, type LogEntry } from "@/data/store";
import { authorised } from "../_auth";

export async function GET(req: Request) {
  if (!(await authorised(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await getDoc<LogEntry[]>("log", []));
}
