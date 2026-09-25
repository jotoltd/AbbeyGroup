"use client";

import { useState } from "react";

const input =
  "w-full border border-mist bg-white px-4 py-3.5 text-sm text-ink placeholder:text-taupe focus:border-rust focus:outline-none";

export default function ContactForm({
  defaultSubject = "",
}: {
  defaultSubject?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      subject: String(data.get("subject") || "Website enquiry"),
      message: String(data.get("message") || ""),
    };

    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      if (!data.emailed) throw new Error();
      setState("sent");
    } catch {
      // No email backend configured — fall back to the visitor's email client
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.phone && `Phone: ${payload.phone}`,
        "",
        payload.message,
      ]
        .filter((l) => l !== undefined)
        .join("\n");
      window.location.href = `mailto:jonathan@theabbeygroupnorfolk.com?subject=${encodeURIComponent(
        payload.subject,
      )}&body=${encodeURIComponent(body)}`;
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-mist bg-sage/10 px-8 py-14 text-center">
        <h3 className="font-display text-3xl font-medium">Thank you</h3>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          Your message is on its way. If you haven&rsquo;t heard back within a
          working day, email us directly at{" "}
          <a
            href="mailto:jonathan@theabbeygroupnorfolk.com"
            className="text-rust underline"
          >
            jonathan@theabbeygroupnorfolk.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input
        name="firstName"
        required
        placeholder="First name"
        className={input}
      />
      <input name="lastName" required placeholder="Last name" className={input} />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className={input}
      />
      <input name="phone" type="tel" placeholder="Phone" className={input} />
      <input
        name="subject"
        defaultValue={defaultSubject}
        placeholder="Subject"
        className={`${input} sm:col-span-2`}
      />
      <textarea
        name="message"
        required
        rows={6}
        placeholder="Type your message here…"
        className={`${input} resize-none sm:col-span-2`}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-2 bg-sage px-10 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark disabled:opacity-60 sm:col-span-2 sm:w-fit"
      >
        {state === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
