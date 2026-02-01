1) Crear proyecto Next.js (Vercel):
   - npm create next-app@latest web
2) Instalar supabase-js:
   - npm i @supabase/supabase-js
3) Crear tabla pública o vista para lectura:
   - models: cover_url, name, model_key, id_hash_canonical
   - batches: model_id, batch_type, price_stars, item_count, sale_url
4) Hacer UI:
   - Home: grid/cards + búsqueda
   - Perfil: portada + lista de batches (links)
5) Deploy en Vercel.
