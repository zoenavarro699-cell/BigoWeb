import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { ModelRow, BatchRow, CollabRow, CollabBatchRow } from "@/lib/db";

export async function listModels(): Promise<ModelRow[]> {
  // Only show models that have at least one published batch
  const { data, error } = await supabaseAdmin
    .from("models")
    .select("id, model_key, name, cover_url, id_hash_canonical, batches!inner(id)")
    .order("model_key", { ascending: true });
  if (error) throw error;

  // Deduplicate models (since join with batches creates multiple rows)
  const seen = new Set<string>();
  const models: ModelRow[] = [];
  for (const row of (data || [])) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      models.push({
        id: row.id,
        model_key: row.model_key,
        name: row.name,
        cover_url: row.cover_url,
        id_hash_canonical: row.id_hash_canonical
      });
    }
  }
  return models;
}

export async function getModelByKey(modelKey: string): Promise<ModelRow | null> {
  const { data, error } = await supabaseAdmin
    .from("models")
    .select("id, model_key, name, cover_url, id_hash_canonical")
    .eq("model_key", modelKey)
    .limit(1);
  if (error) throw error;
  return ((data || [])[0] as ModelRow) || null;
}

export async function listBatchesForModel(modelId: string): Promise<BatchRow[]> {
  // 1. Get Batches
  const { data: batchesData, error: batchError } = await supabaseAdmin
    .from("batches")
    .select(
      "id, model_id, batch_type, price_stars, item_count, sale_url, sale_msg_id, batch_key"
    )
    .eq("model_id", modelId)
    .order("sale_msg_id", { ascending: true });

  if (batchError) throw batchError;
  const batches = (batchesData || []) as BatchRow[];

  if (batches.length === 0) return [];

  // 2. Get Thumbnails manually (avoids missing FK issues)
  const batchIds = batches.map(b => b.id);
  const { data: assetsData } = await supabaseAdmin
    .from("assets")
    .select("batch_id, thumb_url")
    .in("batch_id", batchIds)
    .eq("published", true)
    .not("thumb_url", "is", null)
    .limit(1000); // Sanity limit

  // 3. Group thumbnails by batch
  const thumbMap: Record<string, string[]> = {};
  if (assetsData) {
    for (const a of assetsData) {
      if (!a.batch_id || !a.thumb_url) continue;
      if (!thumbMap[a.batch_id]) thumbMap[a.batch_id] = [];
      // Limit to 4 per batch
      if (thumbMap[a.batch_id].length < 4) {
        thumbMap[a.batch_id].push(a.thumb_url);
      }
    }
  }

  // 4. Attach
  return batches.map(b => ({
    ...b,
    thumbnails: thumbMap[b.id] || []
  }));
}

function chooseBestCollabRow(existing: CollabRow, incoming: CollabRow): CollabRow {
  // Preferimos el que tenga cover_url
  if (!existing.cover_url && incoming.cover_url) return incoming;
  // Si ambos (o ninguno) tienen cover, preferimos el que tenga más model_keys
  const exLen = Array.isArray(existing.model_keys) ? existing.model_keys.length : 0;
  const inLen = Array.isArray(incoming.model_keys) ? incoming.model_keys.length : 0;
  if (inLen > exLen) return incoming;
  return existing;
}

export async function listCollabs(): Promise<CollabRow[]> {
  // Only fetch collabs that have at least one batch
  const { data, error } = await supabaseAdmin
    .from("collabs")
    .select("id, collab_key, title, cover_url, model_keys, collab_batches!inner(id)")
    .order("collab_key", { ascending: true });
  if (error) throw error;

  const rows = (data || []) as unknown as (CollabRow & { collab_batches: any })[];

  // Deduplicar por la COMBINACION de modelos
  const map = new Map<string, CollabRow>();

  for (const r of rows) {
    if (!r.model_keys || !Array.isArray(r.model_keys) || r.model_keys.length === 0) continue;

    const sortedModels = [...r.model_keys].map(m => m.toLowerCase().trim()).sort();
    const uniqueKey = sortedModels.join("|");

    if (!map.has(uniqueKey)) {
      map.set(uniqueKey, r);
    } else {
      map.set(uniqueKey, chooseBestCollabRow(map.get(uniqueKey)!, r));
    }
  }

  const dedupedCollabs = Array.from(map.values());

  // Fetch profile images for all collaborators
  const allModelKeys = new Set<string>();
  for (const collab of dedupedCollabs) {
    if (collab.model_keys) {
      collab.model_keys.forEach(k => allModelKeys.add(k));
    }
  }

  const { data: modelData } = await supabaseAdmin
    .from("models")
    .select("model_key, cover_url")
    .in("model_key", Array.from(allModelKeys));

  const modelProfileMap = new Map<string, string | null>();
  if (modelData) {
    for (const m of modelData) {
      modelProfileMap.set(m.model_key, m.cover_url);
    }
  }

  // Attach collaborator profiles
  for (const collab of dedupedCollabs) {
    if (collab.model_keys) {
      collab.collaborator_profiles = collab.model_keys.map(key => ({
        model_key: key,
        cover_url: modelProfileMap.get(key) || null
      }));
    }
  }

  return dedupedCollabs.sort((a, b) => {
    const aKey = a.model_keys?.join(",") || "";
    const bKey = b.model_keys?.join(",") || "";
    return aKey.localeCompare(bKey);
  });
}

export async function getCollabByKey(collabKey: string): Promise<CollabRow | null> {
  const { data, error } = await supabaseAdmin
    .from("collabs")
    .select("id, collab_key, title, cover_url, model_keys")
    .eq("collab_key", collabKey);
  if (error) throw error;
  const rows = (data || []) as CollabRow[];
  if (!rows.length) return null;

  // Misma lógica: si hay duplicados, elegimos el mejor.
  let best = rows[0];
  for (const r of rows.slice(1)) best = chooseBestCollabRow(best, r);
  return best;
}

export async function listBatchesForCollab(collabId: string): Promise<CollabBatchRow[]> {
  // 1. Get Batches
  const { data: batchesData, error } = await supabaseAdmin
    .from("collab_batches")
    .select("id, collab_id, price_stars, item_count, sale_url, sale_msg_id, batch_key")
    .eq("collab_id", collabId)
    .order("sale_msg_id", { ascending: true });
  if (error) throw error;

  const batches = (batchesData || []) as CollabBatchRow[];
  if (batches.length === 0) return [];

  // 2. Get Thumbnails manually
  const batchIds = batches.map(b => b.id);
  const { data: assetsData } = await supabaseAdmin
    .from("collab_assets")
    .select("batch_id, thumb_url")
    .in("batch_id", batchIds)
    .eq("published", true)
    .not("thumb_url", "is", null)
    .limit(1000);

  // 3. Group
  const thumbMap: Record<string, string[]> = {};
  if (assetsData) {
    for (const a of assetsData) {
      if (!a.batch_id || !a.thumb_url) continue;
      if (!thumbMap[a.batch_id]) thumbMap[a.batch_id] = [];
      if (thumbMap[a.batch_id].length < 4) {
        thumbMap[a.batch_id].push(a.thumb_url);
      }
    }
  }

  // 4. Attach
  return batches.map(b => ({
    ...b,
    thumbnails: thumbMap[b.id] || []
  }));
}
