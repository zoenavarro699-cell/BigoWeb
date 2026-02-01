export const dynamic = "force-dynamic";

import Image from "next/image";
import { getCollabByKey, listBatchesForCollab } from "@/lib/queries";

export const revalidate = 30;

function Stars({ n }: { n: number | null }) {
  const v = typeof n === "number" ? n : 0;
  return <span className="pill">⭐ {v}</span>;
}

export default async function CollabPage({ params }: { params: { collabKey: string } }) {
  const collabKey = decodeURIComponent(params.collabKey);
  const collab = await getCollabByKey(collabKey);

  if (!collab) {
    return (
      <main>
        <a className="btn" href="/">← Volver</a>
        <div className="h1">No encontrado</div>
        <div className="h2">No existe la collab: {collabKey}</div>
      </main>
    );
  }

  const batches = await listBatchesForCollab(collab.id);

  return (
    <main>
      <div className="row" style={{justifyContent:"space-between"}}>
        <a className="btn" href="/">← Volver</a>
        <span className="pill">Collab</span>
      </div>

      <div style={{height:12}} />

      <div className="card">
        <div style={{display:"grid", gridTemplateColumns:"280px 1fr", gap:14}}>
          <div style={{position:"relative", width:"100%", aspectRatio:"1/1", background:"#0f0f12"}}>
            {collab.cover_url ? (
              <Image src={collab.cover_url} alt={collab.collab_key} fill style={{objectFit:"cover"}} />
            ) : null}
          </div>
          <div className="cardBody">
            <div className="h1" style={{marginTop:0}}>Collab {collab.collab_key}</div>
            <div className="h2" style={{marginBottom:10}}>{collab.title || "COLABORACIÓN"}</div>
            <div className="row">
              {Array.isArray(collab.model_keys) ? (
                <span className="pill">Modelos: {collab.model_keys.slice(0, 10).join(", ")}{collab.model_keys.length>10?"...":""}</span>
              ) : null}
            </div>
            <div className="hr" />
            <div className="small">Si aún no ves packs, es porque el worker sigue publicando. Actualiza en unos segundos.</div>
          </div>
        </div>
      </div>

      <div className="hr" />

      <div className="row" style={{justifyContent:"space-between"}}>
        <div className="k">Packs</div>
        <div className="pill">{batches.length} publicados</div>
      </div>

      <div style={{height:8}} />

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Precio</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td>{b.item_count ?? "-"}</td>
                <td><Stars n={b.price_stars} /></td>
                <td>
                  {b.sale_url ? (
                    <a className="btn" href={b.sale_url} target="_blank" rel="noreferrer">Abrir en Telegram</a>
                  ) : (
                    <span className="small">Sin link (aún)</span>
                  )}
                </td>
              </tr>
            ))}
            {!batches.length ? (
              <tr>
                <td colSpan={3} className="small">Todavía no hay packs publicados para esta collab.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
