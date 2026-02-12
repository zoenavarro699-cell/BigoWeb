import Link from "next/link";
import { getModelByKey, listBatchesForModel } from "@/lib/queries";
import { makeHashtag } from "@/lib/tag";
import { ProtectedCover, ProtectedImage } from "@/components/ProtectedContent";
import AccessButton from "@/components/AccessButton";
import LanguageSwitch from "@/components/LanguageSwitch";
import ClientText from "@/components/ClientText";

export const revalidate = 30;

// ... (PriceBadge, splitIds, buildTags functions remain same)

function PriceBadge({ price }: { price: number | null }) {
  const p = typeof price === "number" ? price : 0;
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "rgba(251, 191, 36, 0.1)",
      border: "1px solid rgba(251, 191, 36, 0.2)",
      borderRadius: 8,
      padding: "4px 10px",
      color: "#fbbf24",
      fontWeight: 700,
      fontSize: 14
    }}>
      <span>⭐</span>
      <span>{p} Stars</span>
    </div>
  );
}

function splitIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(/[\s,;|]+/g).map((s) => s.trim()).filter(Boolean);
}

function buildTags(modelKey: string, idHash: string | null): string[] {
  const base = [modelKey, ...splitIds(idHash)].map((s) => makeHashtag(s)).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of base) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

export default async function ModelPage({ params }: { params: Promise<{ modelKey: string }> }) {
  const { modelKey } = await params;
  const decodedKey = decodeURIComponent(modelKey);
  const model = await getModelByKey(decodedKey);

  if (!model) {
    return (
      <main style={{ textAlign: 'center', paddingTop: 100 }}>
        <a className="nav-btn glass" href="/">
          <ClientText k="back_home" defaultText="← Volver al Catálogo" />
        </a>
        <div className="h1" style={{ marginTop: 40 }}>Not Found</div>
        <div className="text-muted">Model not found: {modelKey}</div>
      </main>
    );
  }

  const batches = await listBatchesForModel(model.id);
  const tags = buildTags(model.model_key, model.id_hash_canonical);
  const title = (model.name ?? model.model_key).trim() || model.model_key;

  return (
    <main>
      <div className="nav glass">
        <a className="nav-btn" href="/">
          <ClientText k="back_home" defaultText="← Volver al Catálogo" />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <LanguageSwitch />
        </div>
      </div>

      <div className="card glass" style={{ padding: 24, marginTop: 24 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{
            position: "relative",
            width: "min(100%, 300px)",
            aspectRatio: "1/1",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
          }}>
            {model.cover_url ? (
              <ProtectedCover
                src={model.cover_url}
                alt={model.model_key}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#111' }} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1 className="text-gradient" style={{ fontSize: 42, fontWeight: 800, margin: "0 0 16px" }}>{title}</h1>

            <div style={{ marginBottom: 24 }}>
              <div className="text-muted" style={{ fontSize: 14, marginBottom: 8 }}><ClientText k="identifiers" defaultText="IDENTIFICADORES" /></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.map((t) => (
                  <span key={t} className="tag" style={{ padding: "6px 12px", fontSize: 13 }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                ℹ️ <ClientText k="auto_publish_notice" defaultText="Los packs se publican automáticamente desde Telegram..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="section-header">
        <div className="section-title">
          <ClientText k="packs_available" defaultText="Packs Disponibles" /> <span className="badge-pill">{batches.length}</span>
        </div>
      </div>

      <div className="grid">
        {batches.map((b) => (
          <div key={b.id} className="card glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Header: Type and Price */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "white", textTransform: "capitalize" }}>
                  {b.batch_type === 'exclusive' ? <ClientText k="pack_exclusive" defaultText="Pack Exclusivo" /> : <ClientText k="pack_normal" defaultText="Pack Normal" />}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                  {b.item_count ? `${b.item_count} ` : ''} <ClientText k="videos_count" defaultText="videos" />
                </div>
              </div>
              <PriceBadge price={b.price_stars} />
            </div>

            {/* Thumbnails */}
            {b.thumbnails && b.thumbnails.length > 0 && (
              <div className="thin-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {b.thumbnails.map((url, idx) => (
                  <div key={idx} style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#222"
                  }}>
                    <ProtectedImage
                      src={url}
                      alt={`Frame ${idx}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Button */}
            <div style={{ marginTop: "auto" }}>
              {b.sale_url ? (
                <AccessButton url={b.sale_url} />
              ) : (
                <div className="text-muted" style={{ textAlign: "center", padding: 12, fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
                  <ClientText k="unavailable" defaultText="No disponible" />
                </div>
              )}
            </div>
          </div>
        ))}

        {!batches.length && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            Este modelo aún no tiene packs públicos.
          </div>
        )}
      </div>

      <div className="footer">
        <a href="/" className="text-muted" style={{ borderBottom: "1px dotted #555" }}>
          <ClientText k="back_home" defaultText="← Volver al Catálogo" />
        </a>
      </div>
    </main>
  );
}
