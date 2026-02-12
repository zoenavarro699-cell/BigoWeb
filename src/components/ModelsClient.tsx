'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { sanitizeKeyForTag, makeHashtag } from '@/lib/tag';
import { useAuth } from '@/lib/AuthContext';
import { isNameSimilar } from '@/lib/stringUtils';
import ClientText from './ClientText';
import { useLanguage } from '@/lib/LanguageContext';

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
  const { profile, user } = useAuth(); // Destructure user for simple auth check
  const { t } = useLanguage();
  const isVerified = profile?.is_verified ?? false;
  const isFemale = profile?.gender_detected === 'female';

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

    // 1. First filter by Competitor Blocking (if female)
    let candidates = models;
    if (isVerified && isFemale) {
      const username = profile?.username;
      const fullName = profile?.full_name;

      candidates = models.filter(m => {
        const modelName = m.name || m.model_key;

        // 1. Check Username
        if (username) {
          if (isNameSimilar(modelName, username)) return false;
          // Check parts of username
          const parts = username.split(/[\s_\-\.]+/).filter(p => p.length > 3);
          for (const p of parts) if (isNameSimilar(modelName, p)) return false;
        }

        // 2. Check Full Name (More robust)
        if (fullName) {
          if (isNameSimilar(modelName, fullName)) return false;
          // Check parts of full name (First name, Last name)
          const parts = fullName.split(/[\s_\-\.]+/).filter(p => p.length > 3);
          for (const p of parts) if (isNameSimilar(modelName, p)) return false;
        }

        return true;
      });
    }



    if (!q) return candidates;

    // 2. Then filter by search query
    return candidates.filter((m) => {
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
  }, [models, query, isVerified, isFemale, profile]);

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
            {total} <ClientText k="nav_models" defaultText="Modelos" />
          </span>
          <span className="text-muted" style={{ fontSize: 13 }}>
            <ClientText k="showing_count" defaultText="Mostrando" /> {current.length}
          </span>
        </div>

        <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid">
        {current.map((m) => {
          const title = displayTitle(m);
          const tags = buildTags(m);

          // Access Control Logic
          const isLoggedIn = !!profile; // or user

          let blurAmount = '0px';
          let showLock = false;

          if (!isLoggedIn) {
            // Guest: Heavy blur + Lock
            blurAmount = '20px';
            showLock = true;
          } else if (!isVerified) {
            // User but not verified: Medium blur
            blurAmount = '15px';
            showLock = true;
          } else if (isFemale) {
            // Female Verified: Weak blur (Competitor protection?)
            blurAmount = '5px';
          }

          return (
            <div
              key={m.model_key}
              className="card glass"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Wrap with anchor only if allowed, or always allow click to go to detail (which will also be protected)? 
                 Let's allow click but show visual restriction.
             */}
              <a href={`/models/${encodeURIComponent(m.model_key)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className="card-image-wrap">
                  {m.cover_url ? (
                    <img
                      className="card-image"
                      src={m.cover_url}
                      alt={title}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{
                        objectFit: 'cover',
                        objectPosition: '50% 0%',
                        filter: `blur(${blurAmount})`,
                        transition: 'filter 0.3s ease',
                        userSelect: 'none',
                        pointerEvents: 'none' // Prevent interaction
                      }}
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

                  {/* Optional: Add Lock Icon/Text overlay if restricted */}
                  {showLock && (
                    <div className="card-overlay-lock" style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)', zIndex: 10
                    }}>
                      <span style={{ fontSize: 24 }}>🔒</span>
                      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        <ClientText k="register_to_view" defaultText="REGÍSTRATE PARA VER" />
                      </span>
                    </div>
                  )}

                  <div className="card-overlay" style={{ zIndex: 3 }}>
                    <div className="card-title">{title}</div>
                    <div className="card-subtitle">
                      {tags.slice(0, 3).join(' ')}
                    </div>
                  </div>
                </div>
              </a>
            </div>
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
