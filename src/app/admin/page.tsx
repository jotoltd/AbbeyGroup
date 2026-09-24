"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Property = {
  slug: string;
  name: string;
  development: string;
  price: number;
  beds: number;
  type: string;
  status: string;
  img: string;
  gallery: string[];
  blurb: string;
};

type Development = {
  slug: string;
  name: string;
  location: string;
  strapline: string;
  hero: string;
  description: string[];
  facts: [string, string][];
  nearby: string[];
  mapQuery: string;
};

type Viewing = {
  id: string;
  slug: string;
  property: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  createdAt: string;
};

type SiteContent = {
  home: { heroSubline: string; aboutP1: string; aboutP2: string };
  story: {
    intro1: string;
    intro2: string;
    intro3: string;
    founderJonathan: string;
    founderAdam: string;
  };
};

const input =
  "w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-rust focus:outline-none";
const label = "mb-1 block text-[10px] uppercase tracking-[0.18em] text-ink/50";
const statusCls: Record<string, string> = {
  "For Sale": "bg-sage/15 text-sage-dark",
  "Sold STC": "bg-rust/10 text-rust",
  Sold: "bg-ink/10 text-ink/50",
  Draft: "bg-mist text-ink/60",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type AdminUser = { id: string; username: string; createdAt: string };

export default function Admin() {
  const [token, setToken] = useState(
    () =>
      (typeof window !== "undefined" &&
        sessionStorage.getItem("abbey-admin")) ||
      "",
  );
  const [username, setUsername] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<
    "listings" | "developments" | "content" | "viewings" | "users"
  >("listings");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [items, setItems] = useState<Property[]>([]);
  const [savedItems, setSavedItems] = useState<Property[]>([]);
  const [devs, setDevs] = useState<Development[]>([]);
  const [savedDevs, setSavedDevs] = useState<Development[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [savedContent, setSavedContent] = useState<SiteContent | null>(null);
  const [viewings, setViewings] = useState<Viewing[]>([]);

  const [selected, setSelected] = useState<Property | null>(null);
  const [selectedDev, setSelectedDev] = useState<Development | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [picker, setPicker] = useState<
    null | "main" | "gallery" | "dev-hero"
  >(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}` };
  const dirty =
    JSON.stringify(items) !== JSON.stringify(savedItems) ||
    JSON.stringify(devs) !== JSON.stringify(savedDevs) ||
    JSON.stringify(siteContent) !== JSON.stringify(savedContent);

  const devLabels = devs.map((d) => `${d.name}, ${d.location}`);

  const stats = useMemo(
    () => ({
      total: items.filter((p) => p.status !== "Draft").length,
      drafts: items.filter((p) => p.status === "Draft").length,
      available: items.filter((p) => p.status === "For Sale").length,
      value: items
        .filter((p) => p.status === "For Sale")
        .reduce((s, p) => s + p.price, 0),
    }),
    [items],
  );

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.development.toLowerCase().includes(query.toLowerCase()),
  );

  const homesAt = (dev: Development) =>
    items.filter((p) => p.development === `${dev.name}, ${dev.location}`)
      .length;

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: loginPass }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Sign in failed");
      return;
    }
    setToken(data.token);
    setLoginPass("");
    await load(data.token);
  }

  async function load(pw: string) {
    const h = { Authorization: `Bearer ${pw}` };
    const [pRes, dRes, cRes, iRes, vRes, uRes] = await Promise.all([
      fetch("/api/admin/properties", { headers: h }),
      fetch("/api/admin/developments", { headers: h }),
      fetch("/api/admin/content", { headers: h }),
      fetch("/api/admin/images", { headers: h }),
      fetch("/api/admin/viewings", { headers: h }),
      fetch("/api/admin/users", { headers: h }),
    ]);
    if (!pRes.ok) {
      setMsg("Session expired — sign in again");
      sessionStorage.removeItem("abbey-admin");
      setToken("");
      return;
    }
    const pData = await pRes.json();
    setItems(pData);
    setSavedItems(pData);
    if (dRes.ok) {
      const dData = await dRes.json();
      setDevs(dData);
      setSavedDevs(dData);
    }
    if (cRes.ok) {
      const cData = await cRes.json();
      setSiteContent(cData);
      setSavedContent(cData);
    }
    if (iRes.ok) setImages(await iRes.json());
    if (vRes.ok) setViewings(await vRes.json());
    if (uRes.ok) setUsers(await uRes.json());
    setAuthed(true);
    sessionStorage.setItem("abbey-admin", pw);
    setMsg("");
  }

  useEffect(() => {
    const t = sessionStorage.getItem("abbey-admin");
    if (t) void load(t);
  }, []);

  async function addUser() {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Could not save user");
      return;
    }
    const list = await fetch("/api/admin/users", { headers });
    if (list.ok) setUsers(await list.json());
    setMsg(`User "${newUsername}" saved.`);
    setNewUsername("");
    setNewPassword("");
  }

  async function removeUser(name: string) {
    const res = await fetch(
      `/api/admin/users?username=${encodeURIComponent(name)}`,
      { method: "DELETE", headers },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Could not remove user");
      return;
    }
    setUsers(users.filter((u) => u.username !== name));
  }

  function validate(): string | null {
    const slugs = new Set<string>();
    for (const p of items) {
      if (!p.name.trim()) return "Every listing needs a name.";
      if (!p.slug.trim()) return `"${p.name}" needs a slug.`;
      if (slugs.has(p.slug)) return `Duplicate listing slug: "${p.slug}".`;
      slugs.add(p.slug);
      if (p.status === "For Sale" && (!p.price || p.price <= 0))
        return `"${p.name}" is For Sale but has no price.`;
      if (devLabels.length && !devLabels.includes(p.development))
        return `"${p.name}" belongs to "${p.development}", which isn't a known development.`;
    }
    const devSlugs = new Set<string>();
    for (const d of devs) {
      if (!d.name.trim()) return "Every development needs a name.";
      if (!d.slug.trim()) return `"${d.name}" needs a slug.`;
      if (devSlugs.has(d.slug)) return `Duplicate development slug: "${d.slug}".`;
      devSlugs.add(d.slug);
    }
    return null;
  }

  async function save() {
    const err = validate();
    if (err) {
      setMsg(err);
      return;
    }
    setSaving(true);
    setMsg("");
    const put = (url: string, body: unknown) =>
      fetch(url, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    try {
      const results = await Promise.all([
        items !== savedItems
          ? put("/api/admin/properties", items)
          : Promise.resolve(null),
        devs !== savedDevs ? put("/api/admin/developments", devs) : null,
        siteContent !== savedContent && siteContent
          ? put("/api/admin/content", siteContent)
          : Promise.resolve(null),
      ]);
      const failed = results.find((r) => r && !r.ok);
      if (!failed) {
        setSavedItems(items);
        setSavedDevs(devs);
        setSavedContent(siteContent);
        setMsg("Saved — changes are live.");
      } else {
        const { error } = await failed.json().catch(() => ({}));
        setMsg(error || "Save failed (read-only host?)");
      }
    } finally {
      setSaving(false);
    }
  }

  function update(field: keyof Property, value: string | number | string[]) {
    if (!selected) return;
    const next = { ...selected, [field]: value };
    if (field === "name" && !slugTouched) next.slug = slugify(String(value));
    setSelected(next);
    setItems(items.map((p) => (p.slug === selected.slug ? next : p)));
  }

  function updateDev(
    field: keyof Development,
    value: string | string[] | [string, string][],
  ) {
    if (!selectedDev) return;
    const next = { ...selectedDev, [field]: value };
    if (field === "name" && !slugTouched) next.slug = slugify(String(value));
    setSelectedDev(next);
    setDevs(devs.map((d) => (d.slug === selectedDev.slug ? next : d)));
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
  }

  function addProperty() {
    const p: Property = {
      slug: `new-property-${Date.now()}`,
      name: "New property",
      development: devLabels[0] ?? "",
      price: 0,
      beds: 3,
      type: "Barn conversion",
      status: "Draft",
      img: "/images/sale-1.jpg",
      gallery: [],
      blurb: "",
    };
    setItems([p, ...items]);
    setSelected(p);
    setSlugTouched(true);
  }

  function removeProperty(slug: string) {
    setItems(items.filter((p) => p.slug !== slug));
    setSelected(null);
    setConfirmDelete(false);
  }

  function addDevelopment() {
    const d: Development = {
      slug: `new-development-${Date.now()}`,
      name: "New development",
      location: "",
      strapline: "",
      hero: "/images/hero.jpg",
      description: [],
      facts: [],
      nearby: [],
      mapQuery: "Norfolk",
    };
    setDevs([d, ...devs]);
    setSelectedDev(d);
    setSlugTouched(true);
  }

  function removeDevelopment(slug: string) {
    const d = devs.find((x) => x.slug === slug);
    if (d && homesAt(d) > 0) {
      setMsg(
        `"${d.name}, ${d.location}" has ${homesAt(d)} listing(s) — reassign them first.`,
      );
      return;
    }
    setDevs(devs.filter((x) => x.slug !== slug));
    setSelectedDev(null);
    setConfirmDelete(false);
  }

  async function removeViewing(id: string) {
    const res = await fetch(
      `/api/admin/viewings?id=${encodeURIComponent(id)}`,
      { method: "DELETE", headers },
    );
    if (res.ok) setViewings(viewings.filter((v) => v.id !== id));
    else setMsg("Could not remove viewing request");
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Upload failed");
        return;
      }
      setImages((imgs) => [...imgs, data.path]);
      if (picker === "main") update("img", data.path);
      if (picker === "gallery")
        update("gallery", [...(selected?.gallery ?? []), data.path]);
      if (picker === "dev-hero") updateDev("hero", data.path);
      setPicker(null);
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  }

  function pickImage(path: string) {
    if (picker === "main") update("img", path);
    if (picker === "gallery")
      update("gallery", [...(selected?.gallery ?? []), path]);
    if (picker === "dev-hero") updateDev("hero", path);
    setPicker(null);
  }

  if (!authed) {
    return (
      <section className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-6">
        <h1 className="font-display mb-8 text-4xl font-medium">Site admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="space-y-4"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className={input}
          />
          <input
            type="password"
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className={input}
          />
          <button className="w-full bg-sage px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-white hover:bg-sage-dark">
            Sign in
          </button>
          {msg && <p className="text-sm text-rust">{msg}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-medium">Site admin</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/50">
            {stats.available} of {stats.total} live · £
            {stats.value.toLocaleString("en-GB")} on market
            {stats.drafts > 0 &&
              ` · ${stats.drafts} draft${stats.drafts > 1 ? "s" : ""}`}
            {" · "}
            {devs.length} development{devs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-rust">
              Unsaved changes
            </span>
          )}
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="bg-sage px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-sage-dark disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save all changes"}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("abbey-admin");
              setAuthed(false);
              setToken("");
            }}
            className="text-xs uppercase tracking-[0.18em] text-ink/50 underline hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-6 border-b border-mist">
        {(
          [
            ["listings", "Listings"],
            ["developments", "Developments"],
            ["content", "Site content"],
            [
              "viewings",
              `Viewings${viewings.length ? ` (${viewings.length})` : ""}`,
            ],
            ["users", "Users"],
          ] as const
        ).map(([key, labelText]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === key
                ? "border-rust text-ink"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {labelText}
          </button>
        ))}
      </div>

      {msg && (
        <p
          className={`mb-6 text-sm ${msg.startsWith("Saved") ? "text-sage-dark" : "text-rust"}`}
        >
          {msg}
        </p>
      )}

      {tab === "listings" && (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search listings…"
              className={`${input} max-w-sm`}
            />
            <button
              onClick={addProperty}
              className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-ink hover:text-white"
            >
              + Add property
            </button>
            <p className="text-[11px] text-ink/45">
              New properties are created as Drafts — set status to For Sale to
              publish.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <ul className="divide-y divide-mist self-start border-y border-mist">
              {filtered.map((p) => {
                const i = items.findIndex((x) => x.slug === p.slug);
                return (
                  <li
                    key={p.slug}
                    className={`flex items-center gap-3 px-3 py-3 transition-colors ${
                      selected?.slug === p.slug
                        ? "bg-sage/15"
                        : "hover:bg-sage/10"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelected(p);
                        setConfirmDelete(false);
                        setSlugTouched(true);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-mist">
                        <Image
                          src={p.img}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-ink/50">
                          {p.development} · £{p.price.toLocaleString("en-GB")}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 px-2 py-1 text-[10px] uppercase tracking-[0.15em] ${statusCls[p.status] || ""}`}
                      >
                        {p.status}
                      </span>
                    </button>
                    <span className="flex shrink-0 flex-col">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i <= 0}
                        aria-label="Move up"
                        className="px-1 text-ink/40 hover:text-ink disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i >= items.length - 1}
                        aria-label="Move down"
                        className="px-1 text-ink/40 hover:text-ink disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </span>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-sm text-ink/50">
                  No listings match &ldquo;{query}&rdquo;.
                </li>
              )}
            </ul>

            {selected ? (
              <div className="grid content-start gap-4 self-start border border-mist bg-white/60 p-6 sm:grid-cols-2">
                <button
                  onClick={() => setPicker("main")}
                  className="group relative aspect-[16/9] overflow-hidden bg-mist sm:col-span-2"
                  title="Change main image"
                >
                  <Image
                    src={selected.img}
                    alt={selected.name}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-xs uppercase tracking-[0.2em] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Change image
                  </span>
                </button>

                <div>
                  <label className={label}>Name</label>
                  <input
                    className={input}
                    value={selected.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>Slug (URL)</label>
                  <input
                    className={input}
                    value={selected.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update("slug", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className={label}>Development</label>
                  <select
                    className={input}
                    value={selected.development}
                    onChange={(e) => update("development", e.target.value)}
                  >
                    {devLabels.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                    {!devLabels.includes(selected.development) && (
                      <option>{selected.development}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className={label}>Status</label>
                  <select
                    className={input}
                    value={selected.status}
                    onChange={(e) => update("status", e.target.value)}
                  >
                    <option>Draft</option>
                    <option>For Sale</option>
                    <option>Sold STC</option>
                    <option>Sold</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Guide price (£)</label>
                  <input
                    className={input}
                    type="number"
                    value={selected.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={label}>Bedrooms</label>
                  <input
                    className={input}
                    type="number"
                    value={selected.beds}
                    onChange={(e) => update("beds", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={label}>Type</label>
                  <input
                    className={input}
                    value={selected.type}
                    onChange={(e) => update("type", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>Main image</label>
                  <div className="flex gap-2">
                    <input
                      className={input}
                      value={selected.img}
                      onChange={(e) => update("img", e.target.value)}
                    />
                    <button
                      onClick={() => setPicker("main")}
                      className="shrink-0 border border-ink/30 px-3 text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-white"
                    >
                      Pick
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Gallery</label>
                  <div className="flex flex-wrap gap-2">
                    {selected.gallery.map((g, gi) => (
                      <span
                        key={`${g}-${gi}`}
                        className="group relative h-16 w-24 overflow-hidden bg-mist"
                      >
                        <Image
                          src={g}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                        <button
                          onClick={() =>
                            update(
                              "gallery",
                              selected.gallery.filter((_, x) => x !== gi),
                            )
                          }
                          className="absolute right-0 top-0 bg-ink/70 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => setPicker("gallery")}
                      className="flex h-16 w-24 items-center justify-center border border-dashed border-ink/30 text-xs text-ink/50 hover:border-ink hover:text-ink"
                    >
                      + Add
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Description</label>
                  <textarea
                    className={`${input} resize-none`}
                    rows={5}
                    value={selected.blurb}
                    onChange={(e) => update("blurb", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <a
                    href={`/for-sale/${selected.slug}`}
                    target="_blank"
                    className="text-xs uppercase tracking-[0.18em] text-sage-dark underline"
                  >
                    Preview listing →
                  </a>
                  {confirmDelete ? (
                    <span className="flex items-center gap-3 text-xs">
                      Sure?
                      <button
                        onClick={() => removeProperty(selected.slug)}
                        className="uppercase tracking-[0.15em] text-rust underline"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="uppercase tracking-[0.15em] text-ink/50 underline"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-xs uppercase tracking-[0.18em] text-rust underline"
                    >
                      Delete this property
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="self-start text-sm text-ink/50">
                Select a listing to edit it, then press &ldquo;Save all
                changes&rdquo;.
              </p>
            )}
          </div>
        </>
      )}

      {tab === "developments" && (
        <>
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={addDevelopment}
              className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-ink hover:text-white"
            >
              + Add development
            </button>
            <p className="text-[11px] text-ink/45">
              New developments get their own page at /developments/slug
              automatically.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <ul className="divide-y divide-mist self-start border-y border-mist">
              {devs.map((d) => (
                <li key={d.slug}>
                  <button
                    onClick={() => {
                      setSelectedDev(d);
                      setConfirmDelete(false);
                      setSlugTouched(true);
                    }}
                    className={`flex w-full items-center gap-4 px-3 py-3 text-left transition-colors hover:bg-sage/10 ${
                      selectedDev?.slug === d.slug ? "bg-sage/15" : ""
                    }`}
                  >
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-mist">
                      <Image
                        src={d.hero}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {d.name}
                      </span>
                      <span className="block truncate text-xs text-ink/50">
                        {d.location} · {homesAt(d)} listing
                        {homesAt(d) === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {selectedDev ? (
              <div className="grid content-start gap-4 self-start border border-mist bg-white/60 p-6">
                <button
                  onClick={() => setPicker("dev-hero")}
                  className="group relative aspect-[16/9] overflow-hidden bg-mist"
                  title="Change hero image"
                >
                  <Image
                    src={selectedDev.hero}
                    alt={selectedDev.name}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-xs uppercase tracking-[0.2em] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Change hero image
                  </span>
                </button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Name</label>
                    <input
                      className={input}
                      value={selectedDev.name}
                      onChange={(e) => updateDev("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={label}>Slug (URL)</label>
                    <input
                      className={input}
                      value={selectedDev.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        updateDev("slug", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className={label}>Location</label>
                    <input
                      className={input}
                      value={selectedDev.location}
                      onChange={(e) => updateDev("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={label}>Map search query</label>
                    <input
                      className={input}
                      value={selectedDev.mapQuery}
                      onChange={(e) => updateDev("mapQuery", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={label}>Strapline</label>
                  <input
                    className={input}
                    value={selectedDev.strapline}
                    onChange={(e) => updateDev("strapline", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>
                    Description (one paragraph per line)
                  </label>
                  <textarea
                    className={`${input} resize-none`}
                    rows={6}
                    value={selectedDev.description.join("\n\n")}
                    onChange={(e) =>
                      updateDev(
                        "description",
                        e.target.value
                          .split(/\n\s*\n/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </div>

                <div>
                  <label className={label}>Key facts (label : value)</label>
                  {selectedDev.facts.map(([k, v], fi) => (
                    <div key={fi} className="mb-2 flex gap-2">
                      <input
                        className={input}
                        value={k}
                        placeholder="Label"
                        onChange={(e) => {
                          const f = [...selectedDev.facts];
                          f[fi] = [e.target.value, v];
                          updateDev("facts", f);
                        }}
                      />
                      <input
                        className={input}
                        value={v}
                        placeholder="Value"
                        onChange={(e) => {
                          const f = [...selectedDev.facts];
                          f[fi] = [k, e.target.value];
                          updateDev("facts", f);
                        }}
                      />
                      <button
                        onClick={() =>
                          updateDev(
                            "facts",
                            selectedDev.facts.filter((_, x) => x !== fi),
                          )
                        }
                        className="shrink-0 px-2 text-ink/40 hover:text-rust"
                        aria-label="Remove fact"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      updateDev("facts", [...selectedDev.facts, ["", ""]])
                    }
                    className="mt-1 text-xs uppercase tracking-[0.15em] text-sage-dark underline"
                  >
                    + Add fact
                  </button>
                </div>

                <div>
                  <label className={label}>
                    Nearby places (one per line)
                  </label>
                  <textarea
                    className={`${input} resize-none`}
                    rows={4}
                    value={selectedDev.nearby.join("\n")}
                    onChange={(e) =>
                      updateDev(
                        "nearby",
                        e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={`/developments/${selectedDev.slug}`}
                    target="_blank"
                    className="text-xs uppercase tracking-[0.18em] text-sage-dark underline"
                  >
                    Preview page →
                  </a>
                  {confirmDelete ? (
                    <span className="flex items-center gap-3 text-xs">
                      Sure?
                      <button
                        onClick={() => removeDevelopment(selectedDev.slug)}
                        className="uppercase tracking-[0.15em] text-rust underline"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="uppercase tracking-[0.15em] text-ink/50 underline"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-xs uppercase tracking-[0.18em] text-rust underline"
                    >
                      Delete this development
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="self-start text-sm text-ink/50">
                Select a development to edit it.
              </p>
            )}
          </div>
        </>
      )}

      {tab === "content" && siteContent && (
        <div className="grid max-w-4xl gap-10">
          <section>
            <h2 className="mb-4 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
              Homepage
            </h2>
            <div className="grid gap-4">
              <div>
                <label className={label}>Hero subline</label>
                <input
                  className={input}
                  value={siteContent.home.heroSubline}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      home: {
                        ...siteContent.home,
                        heroSubline: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className={label}>About paragraph 1</label>
                <textarea
                  className={`${input} resize-none`}
                  rows={3}
                  value={siteContent.home.aboutP1}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      home: { ...siteContent.home, aboutP1: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className={label}>About paragraph 2</label>
                <textarea
                  className={`${input} resize-none`}
                  rows={3}
                  value={siteContent.home.aboutP2}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      home: { ...siteContent.home, aboutP2: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
              Our Story
            </h2>
            <div className="grid gap-4">
              {(["intro1", "intro2", "intro3"] as const).map((k, i) => (
                <div key={k}>
                  <label className={label}>Intro paragraph {i + 1}</label>
                  <textarea
                    className={`${input} resize-none`}
                    rows={3}
                    value={siteContent.story[k]}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        story: { ...siteContent.story, [k]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
              {(
                [
                  ["founderJonathan", "Jonathan — bio"],
                  ["founderAdam", "Adam — bio"],
                ] as const
              ).map(([k, labelText]) => (
                <div key={k}>
                  <label className={label}>{labelText}</label>
                  <textarea
                    className={`${input} resize-none`}
                    rows={2}
                    value={siteContent.story[k]}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        story: { ...siteContent.story, [k]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "viewings" && (
        <div>
          {viewings.length === 0 ? (
            <p className="text-sm text-ink/50">No viewing requests yet.</p>
          ) : (
            Object.entries(
              viewings.reduce<Record<string, Viewing[]>>((acc, v) => {
                (acc[v.property] ??= []).push(v);
                return acc;
              }, {}),
            ).map(([property, reqs]) => (
              <section key={property} className="mb-10">
                <h2 className="mb-4 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
                  {property}
                  <span className="ml-3 text-rust">
                    {reqs.length} request{reqs.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <ul className="divide-y divide-mist border-y border-mist">
                  {reqs.map((v) => (
                    <li key={v.id} className="flex gap-6 px-3 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {v.email}
                          {v.phone && ` · ${v.phone}`}
                        </p>
                        {v.date && (
                          <p className="mt-1.5 text-[11px] uppercase tracking-[0.15em] text-rust">
                            Preferred date: {v.date}
                          </p>
                        )}
                        {v.message && (
                          <p className="mt-2 text-sm leading-relaxed text-ink/70">
                            {v.message}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <p className="text-[11px] text-ink/45">
                          {new Date(v.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <button
                          onClick={() => removeViewing(v.id)}
                          className="text-[11px] uppercase tracking-[0.15em] text-ink/50 underline hover:text-rust"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="max-w-xl">
          <h2 className="mb-4 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
            Admin users
          </h2>
          {users.length === 0 ? (
            <p className="text-sm text-ink/50">No users yet.</p>
          ) : (
            <ul className="mb-8 divide-y divide-mist border-y border-mist">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-4 px-3 py-4"
                >
                  <div>
                    <p className="text-sm font-medium">{u.username}</p>
                    <p className="mt-0.5 text-[11px] text-ink/45">
                      Added{" "}
                      {new Date(u.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => removeUser(u.username)}
                    className="text-[11px] uppercase tracking-[0.15em] text-ink/50 underline hover:text-rust"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mb-3 text-xs font-normal uppercase tracking-[0.25em] text-ink/50">
            Add or reset a user
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
            className="space-y-3"
          >
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
              autoComplete="off"
              className={input}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              autoComplete="new-password"
              className={input}
            />
            <button className="bg-sage px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-sage-dark">
              Save user
            </button>
          </form>
          {msg && <p className="mt-4 text-sm text-rust">{msg}</p>}
        </div>
      )}

      {/* Image picker modal */}
      {picker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-6">
          <div className="flex max-h-[80vh] w-full max-w-4xl flex-col bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl font-medium">
                Choose an image
              </h3>
              <button
                onClick={() => setPicker(null)}
                className="text-ink/50 hover:text-ink"
              >
                ✕ Close
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) upload(f);
              }}
              className={`mb-4 flex items-center justify-center border border-dashed px-6 py-8 text-sm transition-colors ${
                dragOver ? "border-sage bg-sage/10" : "border-mist text-ink/50"
              }`}
            >
              {uploading ? (
                "Uploading…"
              ) : (
                <>
                  Drag an image here or{" "}
                  <button
                    onClick={() => fileInput.current?.click()}
                    className="ml-1 underline"
                  >
                    browse
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) upload(f);
                      e.target.value = "";
                    }}
                  />
                </>
              )}
            </div>

            <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => pickImage(src)}
                  className="group relative aspect-[4/3] overflow-hidden bg-mist"
                  title={src}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
