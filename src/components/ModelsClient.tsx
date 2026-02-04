'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { sanitizeKeyForTag, makeHashtag } from '@/lib/tag';

type ModelForGrid = {
  model_key: string;
  name: string | null;
  id_hash_canonical?: string | null;
  cover_url?: string | null;
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

  // Initialize state
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [visibleCount, setVisibleCount] = useState(20);

  // Sync query to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set('q', query); else params.delete('q');
    // We don't sync visibleCount to URL to keep "load more" simple (restoring scroll position is complex otherwise)

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, pathname, router, searchParams]);

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

  // Handlers
  const handleSearchChange = (val: string) => {
    setQuery(val);
    setVisibleCount(20); // Reset visible count on search
  }

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  }

  const current = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < total;

  return (
    <>
      <div className="toolbar-grid glass" style={{
        // Simplificar grid para evitar overlap: solo info y search
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 'fit-content' }}>
          <span className="badge-pill" style={{ background: 'var(--primary-glow)', color: 'white' }}>
            {total} Modelos
          </span>
          <span className="text-muted" style={{ fontSize: 13 }}>
            Mostrando {current.length}
          </span>
        </div>

        <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar modelo..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
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

      {hasMore && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            className="page-btn"
            style={{ width: 'auto', padding: '12px 32px', borderRadius: 999 }}
            onClick={handleLoadMore}
          >
            Ver más modelos ({total - current.length} restantes)
          </button>
        </div>
      )}
    </>
  );
}
