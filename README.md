# Learning Management System

This repository contains a React-based LMS frontend.

- Frontend: `lms_frontend` (Vite + React + Tailwind + Supabase)
- Docs: Supabase schema, RLS, and Edge Function stubs under `lms_frontend/docs/supabase`

Frontend quick start (see `lms_frontend/README.md` for full details):

```bash
cd lms_frontend
cp .env.example .env
# set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev   # http://localhost:3000
```