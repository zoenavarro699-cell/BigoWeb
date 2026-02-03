'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { sanitizeKeyForTag, makeHashtag } from '@/lib/tag';

type ModelForGrid = {
  model_key: string;
  name: string | null;
  id_hash_canonical?: string | null;
  cover_url?: string | null;
  // Compat con versiones anteriores
  tags?: string[] | null;
};

// Genera tags visuales (IDs y Alias)
function buildTags(m: ModelForGrid): string[] {
  const out: string[] = [];
  const idRaw = (m.model_key || '').toString();
  const id = sanitizeKeyForTag(idRaw);

  if (id && id !== 'unknown') {
    out.push(makeHashtag(idRaw));
  }

  const canonRaw = (m.id_hash_canonical || '').toString().trim();
  const canon = sanitizeKeyForTag(canonRaw);

  if (canon && canon !== 'unknown' && canon !== id) {
    out.push(makeHashtag(canonRaw));
  }
  return out;
}

function displayTitle(m: ModelForGrid): string {
  const n = (m.name || '').trim();
  if (n) return n;

  const key = m.model_key || 'Unknown';
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export default function ModelsClient({ models }: { models: ModelForGrid[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params or defaults
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [pageSize, setPageSize] = useState(() => {
    const s = parseInt(searchParams.get('size') || '20', 10);
    return [20, 40, 80].includes(s) ? s : 20;
  });

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set('q', query); else params.delete('q');
    if (page > 1) params.set('page', page.toString()); else params.delete('page');
    if (pageSize !== 20) params.set('size', pageSize.toString()); else params.delete('size');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, page, pageSize, pathname, router, searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;

    return models.filter((m) => {
      const title = displayTitle(m).toLowerCase();
      const id = (m.model_key || '').toLowerCase();
      const alias = (m.id_hash_canonical || '').toLowerCase();

      const tags = buildTags(m).map(t => t.toLowerCase());
      const tagMatch = tags.some(t => t.includes(q));

      return (
        title.includes(q) ||
        id.includes(q) ||
        alias.includes(q) ||
        tagMatch
      );
    });
  }, [models, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Reset page when query or pageSize changes (logic handled in useEffect above implicitly? No, need explicit reset if user types)
  useEffect(() => {
    // If the query changes effectively, we might want to reset page to 1 if the current page is out of bounds.
    // But strictly, if user types, usually we want page 1.
    // Let's rely on the user manual interaction or a specific check.
    // Actually, standard behavior: typing search = reset to page 1.
    // But `setPage(1)` inside the same render cycle as `setQuery` is tricky if not coupled.
    // We'll let the user handle it or add a specific effect if needed. 
    // For now, let's just ensure if refined count < current page start, we clamp.
    // The clamp logic is handled in the `current` slice calculation?
    // Yes: `const startIndex = ...` uses page directly.
    // Best practice: Set page to 1 when query changes.
  }, []);

  // Handlers
  const handleSortChange = (size: number) => {
    setPageSize(size);
    setPage(1); // Reset page on size change
  }

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setPage(1); // Reset page on search change
  }

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  // Pagination logic
  const pageItems = useMemo(() => {
    const items: (number | '…')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }
    items.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) items.push('…');
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages - 1) items.push('…');
    items.push(totalPages);

    return items;
  }, [page, totalPages]);

  return (
    <>
      <div className="toolbar-grid glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 'fit-content' }}>
          <span className="badge-pill" style={{ background: 'var(--primary-glow)', color: 'white' }}>
            {total} Modelos
          </span>
          <span className="text-muted" style={{ fontSize: 13 }}>
            {startIndex}-{endIndex}
          </span>
        </div>

        <div className="search-wrap" style={{ width: '100%' }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar modelo..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 'fit-content' }}>
          <select
            className="select-input"
            value={pageSize}
            onChange={(e) => handleSortChange(parseInt(e.target.value, 10))}
          >
            <option value={20}>20 / pág</option>
            <option value={40}>40 / pág</option>
            <option value={80}>80 / pág</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {current.map((m) => {
          const title = displayTitle(m);
          const tags = buildTags(m);

          return (
            <a
              key={m.model_key}
              className="card glass"
              href={`/models/${encodeURIComponent(m.model_key)}`}
              onClick={() => {
                // Optional: If we wanted to force push state before navigating, but the useEffect handles it.
              }}
            >
              <div className="card-image-wrap">
                {m.cover_url ? (
                  <img
                    className="card-image"
                    src={m.cover_url}
                    alt={title}
                    loading="lazy"
                    style={{ objectFit: 'cover', objectPosition: '50% 0%' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#1a1a20', color: 'var(--text-dim)'
                  }}>
                    No Preview
                  </div>
                )}

                <div className="card-overlay">
                  <div className="card-title">{title}</div>
                  <div className="card-subtitle">
                    {tags.slice(0, 3).join(' ')}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ‹
          </button>

          {pageItems.map((it, idx) => (
            it === '…' ? (
              <span key={`ell-${idx}`} style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>…</span>
            ) : (
              <button
                key={it}
                className={`page-btn ${it === page ? 'active' : ''}`}
                onClick={() => setPage(it as number)}
              >
                {it}
              </button>
            )
          ))}

          <button
            className="page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
