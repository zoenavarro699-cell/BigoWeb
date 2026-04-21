export const dynamic = "force-dynamic";
export const revalidate = 30;

import Image from "next/image";
import { getCollabByKey, listBatchesForCollab } from "@/lib/queries";

export default async function CollabPage({ params }: { params: Promise<{ collabKey: string }> }) {
  const { collabKey: rawKey } = await params;
  const collabKey = decodeURIComponent(rawKey);
  const collab = await getCollabByKey(collabKey);

  if (!collab) {
    return (
      <main style={{ padding: "60px 24px", textAlign: "center" }}>
        <a
          className="nav-btn glass"
          href="/"
          style={{ display: "inline-block", marginBottom: 32 }}
        >
          ← Volver al Catálogo
        </a>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
          No encontrado
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          No existe la collab: <code style={{ color: "var(--secondary)" }}>{collabKey}</code>
        </div>
      </main>
    );
  }

  const batches = await listBatchesForCollab(collab.id);

  /* Cover: use collab cover or first collaborator profile */
  const coverSrc =
    collab.cover_url ||
    (collab.collaborator_profiles && collab.collaborator_profiles[0]?.cover_url) ||
    null;

  const modelNames = Array.isArray(collab.model_keys) ? collab.model_keys : [];

  return (
    <main style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Top Nav */}
      <div className="nav glass" style={{ marginBottom: 32 }}>
        <a className="nav-btn" href="/">
          ← Volver
        </a>
        <span
          className="badge-pill"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            color: "white",
            padding: "6px 16px",
          }}
        >
          🎬 Collab
        </span>
      </div>

      {/* Hero Card */}
      <div
        className="glass"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          marginBottom: 32,
          display: "flex",
          gap: 0,
          flexWrap: "wrap",
        }}
      >
        {/* Cover */}
        <div
          style={{
            position: "relative",
            width: "min(100%, 280px)",
            aspectRatio: "1/1",
            background: "#0f0f12",
            flexShrink: 0,
          }}
        >
          {coverSrc ? (
            <Image src={coverSrc} alt={collab.collab_key} fill style={{ objectFit: "cover" }} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              🎬
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: "32px 28px", minWidth: 240 }}>
          <div className="text-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>
            COLABORACIÓN
          </div>
          <h1
            className="text-gradient"
            style={{ fontSize: 36, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 }}
          >
            {collab.title || `Collab ${collab.collab_key}`}
          </h1>
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 20 }}>
            ID: <code style={{ color: "var(--text-muted)" }}>{collab.collab_key}</code>
          </div>

          {/* Collaborator avatars + names */}
          {collab.collaborator_profiles && collab.collaborator_profiles.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="text-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>
                MODELOS
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {collab.collaborator_profiles.map((p: any, i: number) => (
                  <div
                    key={i}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid rgba(168,85,247,0.4)",
                        background: "#1a1a20",
                        position: "relative",
                      }}
                    >
                      {p.cover_url ? (
                        <Image
                          src={p.cover_url}
                          alt={p.model_key}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            color: "#666",
                          }}
                        >
                          👤
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.model_key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="badge-pill" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>
              {batches.length} {batches.length === 1 ? "pack" : "packs"} publicados
            </span>
            <span className="badge-pill" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
              {modelNames.length} modelos
            </span>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--text-dim)",
            }}
          >
            ℹ️ Si aún no ves packs, es porque el worker sigue publicando. Actualiza en unos segundos.
          </div>
        </div>
      </div>

      {/* Packs Section */}
      <div
        className="section-header"
        style={{ marginBottom: 20 }}
      >
        <div className="section-title">
          Packs disponibles
          <span className="badge-pill">{batches.length}</span>
        </div>
      </div>

      {batches.length === 0 ? (
        <div
          className="glass"
          style={{
            borderRadius: 20,
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Todavía no hay packs publicados para esta collab.
        </div>
      ) : (
        <div className="grid">
          {batches.map((b) => (
            <div key={b.id} className="card glass" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Thumbnails */}
              {b.thumbnails && b.thumbnails.length > 0 ? (
                <div
                  className="thin-scrollbar"
                  style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}
                >
                  {b.thumbnails.map((url: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#222",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    height: 80,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-dim)",
                    fontSize: 13,
                  }}
                >
                  Sin preview
                </div>
              )}

              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {b.item_count ?? "—"} items
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.2)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    color: "#fbbf24",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  ⭐ {b.price_stars ?? 0} Stars
                </div>
              </div>

              {/* CTA */}
              {b.sale_url ? (
                <a
                  href={b.sale_url}
                  target="_blank"
                  rel="noreferrer"
                  className="telegram-btn"
                  style={{ display: "block", textAlign: "center", fontSize: 14 }}
                >
                  Abrir en Telegram →
                </a>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: 12,
                    fontSize: 13,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 12,
                    color: "var(--text-dim)",
                  }}
                >
                  Sin link aún
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <a href="/" className="text-muted" style={{ borderBottom: "1px dotted #555" }}>
          ← Volver al Catálogo
        </a>
      </div>
    </main>
  );
}
