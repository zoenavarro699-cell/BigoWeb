import { createClient } from "@supabase/supabase-js";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const supabaseAdmin = createClient(
  mustGet("SUPABASE_URL"),
  mustGet("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "bigo-catalog-web" } },
  }
);
