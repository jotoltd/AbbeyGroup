"use client";

import { useState } from "react";

const input =
  "w-full border border-mist bg-white px-4 py-3 text-sm text-ink placeholder:text-taupe focus:border-rust focus:outline-none";

export default function ViewingRequest({
  slug,
  property,
  compact = false,
}: {
  slug: string;
  property: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          property,
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          date: String(data.get("date") || ""),
          message: String(data.get("message") || ""),
        }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  function close() {
    setOpen(false);
    if (state === "sent") setState("idle");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          compact
            ? "bg-sage px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white"
            : "mt-8 block w-full bg-sage px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark"
        }
      >
        Request a viewing
      </button>

      {open && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-6"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto bg-white p-8">
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-medium">
                  Request a viewing
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/50">
                  {property}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="text-ink/50 hover:text-ink"
              >
                ✕
              </button>
            </div>

            {state === "sent" ? (
              <div className="border border-sage/30 bg-sage/10 px-6 py-10 text-center">
                <p className="font-display text-xl font-medium">
                  Request received
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Thank you — we&rsquo;ll be in touch shortly to arrange your
                  viewing of {property}.
                </p>
                <button
                  onClick={close}
                  className="mt-6 border border-ink/20 px-8 py-3 text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  name="name"
                  required
                  placeholder="Full name"
                  className={input}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className={input}
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className={input}
                />
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    Preferred date (optional)
                  </label>
                  <input name="date" type="date" className={input} />
                </div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Anything we should know? (optional)"
                  className={`${input} resize-none`}
                />
                {state === "error" && (
                  <p className="text-sm text-rust">
                    Something went wrong — please call us instead.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-2 bg-sage px-6 py-4 text-xs font-normal uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Request viewing"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
