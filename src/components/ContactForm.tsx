"use client";

import { useState } from "react";

const input =
  "w-full border border-mist bg-white px-4 py-3.5 text-sm text-ink placeholder:text-taupe focus:border-rust focus:outline-none";

const label =
  "mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-ink/50";

export default function ContactForm({
  defaultSubject = "",
}: {
  defaultSubject?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [viaMailto, setViaMailto] = useState(false);

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
      setViaMailto(true);
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div
        role="status"
        className="border border-mist bg-sage/10 px-8 py-14 text-center"
      >
        <h3 className="font-display text-3xl font-medium">Thank you</h3>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          {viaMailto ? (
            <>
              Your email app should have opened with your message ready to send
              — just press send. If it didn&rsquo;t, email us directly at{" "}
            </>
          ) : (
            <>
              Your message is on its way. If you haven&rsquo;t heard back within
              a working day, email us directly at{" "}
            </>
          )}
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
      <div>
        <label htmlFor="firstName" className={label}>
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          autoComplete="given-name"
          className={input}
        />
      </div>
      <div>
        <label htmlFor="lastName" className={label}>
          Last name
        </label>
        <input
          id="lastName"
          name="lastName"
          required
          autoComplete="family-name"
          className={input}
        />
      </div>
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={input}
        />
      </div>
      <div>
        <label htmlFor="phone" className={label}>
          Phone <span className="normal-case">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={input}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="subject" className={label}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          defaultValue={defaultSubject}
          className={input}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Type your message here…"
          className={`${input} resize-none`}
        />
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-2 bg-sage px-10 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-fit"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
