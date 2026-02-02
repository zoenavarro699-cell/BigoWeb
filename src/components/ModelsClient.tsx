"use client";

import { useEffect, useMemo, useState } from "react";

type ModelForGrid = {
  id: string;
  model_key: string;
  name: string | null;
  cover_url: string | null;
  id_hash_canonical: string | null;
};

function makeHashtag(s: string) {
  let out = (s || "").trim().toLowerCase();
  out = out.replace(/\s+/g, "_");
  out = out.replace(/\./g, "");
  if (/^\d/.test(out)) out = `id${out}`;
  // allow letters, digits, underscore only
  out = out.replace(/[^a-z0-9_]+/g, "_");
  out = out.replace(/_+/g, "_");
  out = out.replace(/^_+|_+$/g, "");
  return out;
}

function cleanDisplayName(name: string | null, fallback: string) {
  const raw = (name ?? "").trim();
  if (!raw) return fallback;
  // Examples we see: "Modelo _colombianita_", "Modelo 0831AM", "MODELO - xyz"
  let out = raw.replace(/^modelo\s*[-_:]*\s*/i, "");
  out = out.replace(/_/g, " ");
  out = out.replace(/\s+/g, " ").trim();
  return out || fallback;
}

function buildPagination(current: number, total: number) {
  const delta = 2;
  const range: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  const out: Array<number | "…"> = [];
  let last: number | undefined;
  for (const n of range) {
    if (last !== undefined) {
      if (n - last === 2) out.push(last + 1);
      else if (n - last > 2) out.push("…");
    }
    out.push(n);
    last = n;
  }
  return out;
}

export default function ModelsClient({ models }: { models: ModelForGrid[] }) {
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return models;
    return models.filter((m) => {
      const name = cleanDisplayName(m.name, m.model_key).toLowerCase();
      const ids = [m.model_key, m.id_hash_canonical ?? ""].join(" ").toLowerCase();
      return name.includes(qq) || ids.includes(qq);
    });
  }, [models, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    // When search / size changes, reset to first page.
    setPage(1);
  }, [q, pageSize]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(filtered.length, page * pageSize);

  const pageButtons = useMemo(() => buildPagination(page, pageCount), [page, pageCount]);

  function goToPage(p: number) {
    const safe = Math.min(pageCount, Math.max(1, p));
    setPage(safe);
    // nice UX: when changing pages, go back near the top of the grid
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <div className="modelsHeaderRow">
        <div className="modelsHeaderLeft">
          <div className="searchBar">
            <span className="searchIcon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              className="searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o ID…"
              spellCheck={false}
            />
            {q.trim() ? (
              <button
                type="button"
                className="clearBtn"
                onClick={() => setQ("")}
                aria-label="Limpiar búsqueda"
                title="Limpiar"
              >
                ✕
              </button>
            ) : null}
          </div>

          <div className="pageSizeWrap">
            <span className="mutedSm">Por página:</span>
            <select
              className="pageSizeSelect"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="modelsHeaderRight">
          <div className="pill">
            {filtered.length.toLocaleString()} / {models.length.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="modelsMeta">
        <span className="mutedSm">Mostrando {startIdx}-{endIdx} de {filtered.length.toLocaleString()}</span>
      </div>

      <div className="grid">
        {pageItems.map((m) => {
          const title = cleanDisplayName(m.name, m.model_key);
          const tags = [`#${makeHashtag(`id_${m.model_key}`)}`];
          if (m.id_hash_canonical) tags.push(`#${makeHashtag(m.id_hash_canonical)}`);

          return (
            <a key={m.id} className="card" href={`/models/${encodeURIComponent(m.model_key)}`}>
              <div className="thumb">
                {m.cover_url ? (
                  <img
                    src={m.cover_url}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  />
                ) : (
                  <div className="thumbPlaceholder" />
                )}
              </div>
              <div className="cardBody">
                <div className="cardTitle">{title}</div>
                <div className="meta">
                  <div>
                    <span className="muted">Alias:</span> {m.model_key}
                  </div>
                  <div>
                    <span className="muted">Tag:</span> {tags.join(" ")}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {pageCount > 1 ? (
        <nav className="pagination" aria-label="Paginación">
          <button className="pageNav" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
            ← Anterior
          </button>

          <div className="pageNums" aria-label="Páginas">
            {pageButtons.map((x, idx) =>
              x === "…" ? (
                <span key={`e-${idx}`} className="ellipsis" aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={x}
                  className={`pageBtn ${x === page ? "active" : ""}`}
                  onClick={() => goToPage(x)}
                  aria-current={x === page ? "page" : undefined}
                >
                  {x}
                </button>
              )
            )}
          </div>

          <button className="pageNav" onClick={() => goToPage(page + 1)} disabled={page >= pageCount}>
            Siguiente →
          </button>
        </nav>
      ) : null}
    </>
  );
}
