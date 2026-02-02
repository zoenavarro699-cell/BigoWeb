"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { makeHashtag } from "@/lib/tag";

export type ModelForGrid = {
  id: string;
  model_key: string;
  name: string | null;
  cover_url: string | null;
  id_hash_canonical: string | null;
};

function uniq(list: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const k = item.trim();
    if (!k) continue;
    const kk = k.toLowerCase();
    if (seen.has(kk)) continue;
    seen.add(kk);
    out.push(k);
  }
  return out;
}

function splitIds(raw: string | null): string[] {
  if (!raw) return [];
  // Separadores comunes: coma, punto y coma, pipe, saltos, espacios múltiples.
  const parts = raw
    .split(/[\s,;|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}

function buildTags(m: ModelForGrid): string[] {
  const base = makeHashtag(m.model_key);
  const extra = splitIds(m.id_hash_canonical)
    .map((x) => makeHashtag(x))
    .filter(Boolean);
  return uniq([base, ...extra]);
}

function norm(s: string): string {
  return s.toLowerCase();
}

function searchableText(m: ModelForGrid): string {
  const tags = buildTags(m).join(" ");
  return norm(`${m.name ?? ""} ${m.model_key} ${m.id_hash_canonical ?? ""} ${tags}`);
}

export default function ModelsClient({ models }: { models: ModelForGrid[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    if (!needle) return models;
    return models.filter((m) => searchableText(m).includes(needle));
  }, [models, q]);

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div className="k">Modelos</div>
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <input
            className="search"
            placeholder="Buscar por nombre o ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar modelos"
          />
          <div className="pill">
            {filtered.length} / {models.length}
          </div>
        </div>
      </div>

      <div style={{ height: 10 }} />

      <div className="grid">
        {filtered.map((m) => {
          const tags = buildTags(m);
          const title = (m.name ?? m.model_key).trim() || m.model_key;
          return (
            <Link key={m.id} href={`/models/${m.model_key}`} className="card">
              <div className="cover">
                {m.cover_url ? (
                  <Image
                    src={m.cover_url}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ objectFit: "cover", objectPosition: "50% 0%" }}
                    priority={false}
                  />
                ) : (
                  <div className="blank" />
                )}
              </div>

              <div className="cardBody">
                <div className="t">{title}</div>
                <div className="sub">ID: {m.model_key}</div>
                <div className="sub">
                  Tag:{" "}
                  <span className="mono">{tags.join(" ")}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
