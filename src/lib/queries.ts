import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { ModelRow, BatchRow, CollabRow, CollabBatchRow } from "@/lib/db";

export async function listModels(): Promise<ModelRow[]> {
  const { data, error } = await supabaseAdmin
    .from("models")
    .select("id, model_key, name, cover_url, id_hash_canonical")
    .order("model_key", { ascending: true });
  if (error) throw error;
  return (data || []) as ModelRow[];
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
  const { data, error } = await supabaseAdmin
    .from("batches")
    .select("id, model_id, batch_type, price_stars, item_count, sale_url, sale_msg_id, batch_key")
    .eq("model_id", modelId)
    .order("sale_msg_id", { ascending: true });
  if (error) throw error;
  return (data || []) as BatchRow[];
}

export async function listCollabs(): Promise<CollabRow[]> {
  const { data, error } = await supabaseAdmin
    .from("collabs")
    .select("id, collab_key, title, cover_url, model_keys")
    .order("collab_key", { ascending: true });
  if (error) throw error;
  return (data || []) as CollabRow[];
}

export async function getCollabByKey(collabKey: string): Promise<CollabRow | null> {
  const { data, error } = await supabaseAdmin
    .from("collabs")
    .select("id, collab_key, title, cover_url, model_keys")
    .eq("collab_key", collabKey)
    .limit(1);
  if (error) throw error;
  return ((data || [])[0] as CollabRow) || null;
}

export async function listBatchesForCollab(collabId: string): Promise<CollabBatchRow[]> {
  const { data, error } = await supabaseAdmin
    .from("collab_batches")
    .select("id, collab_id, price_stars, item_count, sale_url, sale_msg_id, batch_key")
    .eq("collab_id", collabId)
    .order("sale_msg_id", { ascending: true });
  if (error) throw error;
  return (data || []) as CollabBatchRow[];
}
