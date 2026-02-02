import Image from "next/image";
import { getModelByKey, listBatchesForModel } from "@/lib/queries";
import { makeHashtag } from "@/lib/tag";

export const revalidate = 30;

function Stars({ n }: { n: number | null }) {
  const v = typeof n === "number" ? n : 0;
  return <span className="pill">⭐ {v}</span>;
}

function splitIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[\s,;|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
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

export default async function ModelPage({ params }: { params: { modelKey: string } }) {
  const modelKey = decodeURIComponent(params.modelKey);
  const model = await getModelByKey(modelKey);

  if (!model) {
    return (
      <main>
        <a className="btn" href="/">← Volver</a>
        <div className="h1">No encontrado</div>
        <div className="h2">No existe el modelo: {modelKey}</div>
      </main>
    );
  }

  const batches = await listBatchesForModel(model.id);
  const tags = buildTags(model.model_key, model.id_hash_canonical);

  return (
    <main>
      <div className="row" style={{justifyContent:"space-between"}}>
        <a className="btn" href="/">← Volver</a>
        <span className="pill">{tags[0] ?? makeHashtag(model.model_key)}</span>
      </div>

      <div style={{height:12}} />

      <div className="card">
        <div style={{display:"grid", gridTemplateColumns:"280px 1fr", gap:14}}>
          <div style={{position:"relative", width:"100%", aspectRatio:"1/1", background:"#0f0f12"}}>
            {model.cover_url ? (
              <Image src={model.cover_url} alt={model.model_key} fill style={{objectFit:"cover", objectPosition:"50% 0%"}} />
            ) : null}
          </div>
          <div className="cardBody">
            <div className="h1" style={{marginTop:0}}>{(model.name ?? model.model_key).trim() || model.model_key}</div>
            <div className="h2" style={{marginBottom:10}}>ID: {model.model_key}</div>
            <div className="row" style={{flexWrap:"wrap"}}>
              <span className="pill">Tags:</span>
              {tags.map((t) => (
                <span key={t} className="pill mono">{t}</span>
              ))}
              {model.id_hash_canonical ? <span className="pill">Hash: {model.id_hash_canonical}</span> : null}
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
              <th>Tipo</th>
              <th>Items</th>
              <th>Precio</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td style={{textTransform:"capitalize"}}>{b.batch_type}</td>
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
                <td colSpan={4} className="small">Todavía no hay packs publicados para este modelo.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
