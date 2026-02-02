import Image from "next/image";
import { listModels, listCollabs } from "@/lib/queries";
import ModelsClient from "@/components/ModelsClient";

export const revalidate = 30;

export default async function HomePage() {
  const [models, collabs] = await Promise.all([listModels(), listCollabs()]);

  return (
    <main>
      <div className="nav">
        <div className="brand">
          <div style={{width:10, height:10, borderRadius:999, background:"var(--accent)"}} />
          <div className="k">Bigo Catalog</div>
          <div className="badge">Web</div>
        </div>
        <div className="row">
          <a className="btn" href="#models">Modelos</a>
          <a className="btn" href="#collabs">Collabs</a>
        </div>
      </div>

      <div className="h1">Catálogo</div>
      <div className="h2">Entra por modelo y abre sus packs (links directos a Telegram).</div>

      <div className="hr" />

      <section id="models">
        <ModelsClient models={models} />
      </section>

      <div className="hr" />

      <section id="collabs">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div className="k">Collabs</div>
          <div className="pill">{collabs.length} total</div>
        </div>

        <div style={{height:10}} />

        <div className="grid">
          {collabs.map((c) => (
            <a key={c.id} className="card" href={`/collabs/${encodeURIComponent(c.collab_key)}`}>
              <div style={{position:"relative", width:"100%", aspectRatio:"1/1", background:"#0f0f12"}}>
                {c.cover_url ? (
                  <Image
                    src={c.cover_url}
                    alt={c.collab_key}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{objectFit:"cover"}}
                  />
                ) : null}
              </div>
              <div className="cardBody">
                <div className="k">Collab {c.collab_key}</div>
                <div className="m">{c.title || "COLABORACIÓN"}</div>
                <div className="m">
                  {Array.isArray(c.model_keys) ? `Modelos: ${c.model_keys.slice(0,4).join(", ")}${c.model_keys.length>4?"...":""}` : ""}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="footer">
        <div>Se actualiza conforme el worker publique batches en Supabase.</div>
        <div className="small">Revalidate: 30s</div>
      </div>
    </main>
  );
}
