import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

/**
 * Server-side Supabase client.
 *
 * - Prefers SUPABASE_SERVICE_ROLE_KEY when present (server-only).
 * - Falls back to SUPABASE_ANON_KEY for read-only deployments.
 *
 * IMPORTANT: This module must only be imported from Server Components / Route Handlers.
 */
if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Don't crash at build-time; show a clear hint in logs.
  // The pages will render an error message if queries fail.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabaseAdmin] Missing SUPABASE_URL and/or SUPABASE_*_KEY in this environment."
  );
}

export const supabaseAdmin = createClient(SUPABASE_URL ?? "", SUPABASE_KEY ?? "", {
  auth: { persistSession: false },
  global: { headers: { "X-Client-Info": "bigo-catalog-web" } },
});
