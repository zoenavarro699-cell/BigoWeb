import Image from "next/image";
import { Suspense } from "react";
import { listModels, listCollabs } from "@/lib/queries";
import ModelsClient from "@/components/ModelsClient";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import VIPSection from "@/components/VIPSection";

export const revalidate = 30;

export default async function HomePage() {
  const [models, collabs] = await Promise.all([listModels(), listCollabs()]);

  return (
    <main>
      <AgeVerificationModal />

      <div className="nav glass">
        <div className="brand">
          <div className="brand-dot" />
          <div className="brand-name text-gradient">Bigo Hot 🔥</div>
        </div>
        <div className="nav-links">
          <a className="nav-btn" href="#models">Modelos</a>
          <a className="nav-btn" href="#collabs">Collabs</a>
        </div>
      </div>

      <div className="hero">
        <h1 className="text-gradient">Catálogo Exclusivo</h1>
        <p>Explora nuestra colección premium. Entra por modelo y accede a sus packs privados en Telegram.</p>
      </div>

      <div className="divider" />

      <section id="models">
        <div className="section-header">
          <div className="section-title">
            Modelos <span className="badge-pill">{models.length}</span>
          </div>
        </div>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>}>
          <ModelsClient models={models} />
        </Suspense>
      </section>

      <div className="divider" />

      <VIPSection />

      <div className="divider" />

      <section id="collabs">
        <div className="section-header">
          <div className="section-title">
            Colaboraciones <span className="badge-pill">{collabs.length}</span>
          </div>
        </div>

        <div className="grid">
          {collabs.map((c) => (
            <a key={c.collab_key} className="card glass" href={`/collabs/${encodeURIComponent(c.collab_key)}`}>
              <div className="card-image-wrap">
                {c.cover_url ? (
                  <Image
                    className="card-image"
                    src={c.cover_url}
                    alt={c.collab_key}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
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
                  <div className="card-title">
                    {c.title || `Collab ${c.collab_key}`}
                  </div>

                  {/* Collaborator Profile Images */}
                  {c.collaborator_profiles && c.collaborator_profiles.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {c.collaborator_profiles.map((profile, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid rgba(255,255,255,0.3)",
                            background: "#1a1a20"
                          }}
                          title={profile.model_key}
                        >
                          {profile.cover_url ? (
                            <Image
                              src={profile.cover_url}
                              alt={profile.model_key}
                              width={32}
                              height={32}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#666" }}>
                              ?
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="card-subtitle" style={{ marginTop: 8 }}>
                    {Array.isArray(c.model_keys)
                      ? `${c.model_keys.slice(0, 3).join(", ")}${c.model_keys.length > 3 ? "..." : ""}`
                      : "Multi-Model"}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="footer">
        <div>Actualización automática desde Telegram Worker</div>
        <div style={{ opacity: 0.5, marginTop: 4 }}>Revalidate: 30s</div>
      </div>
    </main>
  );
}
