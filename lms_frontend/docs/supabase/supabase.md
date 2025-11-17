# Supabase Setup Guide

1) Install CLI
npm i -g supabase

2) Login and link project
supabase login
supabase link --project-ref <project-ref>

3) Apply schema and RLS
supabase db push --file docs/supabase/schema.sql
supabase db push --file docs/supabase/rls.sql

4) Create storage buckets
- course-media
- certificates

5) Deploy Edge Function (stub)
cd docs/supabase/edge
supabase functions deploy certificates

6) Seeding (optional)
Use docs/supabase/seed.sql in SQL editor and replace placeholder UUIDs.
