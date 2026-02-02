export type ModelRow = {
  id: string;
  model_key: string;
  name: string | null;
  cover_url: string | null;
  // Column exists on every row in Supabase (may be NULL). Keep it required so
  // ModelRow is assignable to UI types that require this field.
  id_hash_canonical: string | null;
};

export type BatchRow = {
  id: string;
  model_id: string;
  batch_type: "normal" | "exclusive" | string;
  price_stars: number | null;
  item_count: number | null;
  sale_url: string | null;
  sale_msg_id?: number | null;
  batch_key?: string | null;
};

export type CollabRow = {
  id: string;
  collab_key: string;
  title: string | null;
  cover_url: string | null;
  model_keys?: string[] | null;
};

export type CollabBatchRow = {
  id: string;
  collab_id: string;
  price_stars: number | null;
  item_count: number | null;
  sale_url: string | null;
  sale_msg_id?: number | null;
  batch_key?: string | null;
};
