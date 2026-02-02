# Bigo Catalog Web (Vercel + Supabase)

MVP con Next.js (App Router) para:
- Listar **Modelos** y **Collabs**
- Ver **packs** (batches) con link directo a Telegram (sale_url)
- Mostrar hashtag sanitizado (sin puntos; si empieza por número => prefijo ID)

## Variables de entorno
Crea `.env.local`:

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

> La SERVICE ROLE KEY **no debe** ir al navegador. Este proyecto la usa solo en Server Components.

## Local
npm i
npm run dev

## Vercel
- Importa repo desde GitHub
- Agrega env vars: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
- Deploy
