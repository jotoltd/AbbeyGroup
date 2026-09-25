import { NextResponse } from "next/server";
import { getDoc, setDoc } from "@/data/store";
import type { Enquiry } from "@/data/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, phone, subject, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const entry: Enquiry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone || "").slice(0, 50),
    subject: String(subject || "").slice(0, 200),
    message: String(message).slice(0, 5000),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  // Persist the enquiry first so it is never lost, even if email delivery
  // isn't configured or fails.
  let saved = false;
  try {
    const list = await getDoc<Enquiry[]>("enquiries", []);
    list.push(entry);
    await setDoc("enquiries", list);
    saved = true;
  } catch {
    // fall through — email may still deliver
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  let emailed = false;
  if (apiKey && to && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: subject || `Website enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`,
      }),
    }).catch(() => null);
    emailed = !!res?.ok;
  }

  // ok as long as the enquiry landed somewhere; `emailed` lets the client
  // decide whether to also offer a mailto fallback.
  if (!saved && !emailed)
    return NextResponse.json({ error: "Send failed" }, { status: 502 });

  return NextResponse.json({ ok: true, emailed });
}
