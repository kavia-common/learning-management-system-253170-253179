# Ocean LMS Frontend (Vite + React + Supabase)

A modern Learning Management System frontend built with React (Vite), Tailwind CSS, and Supabase for authentication, database, and storage. Includes charts, media viewers, and admin tools.

## Features

- Supabase authentication (email/password), profile, and role support (student/trainer/admin)
- Course management, content upload (video/pdf to Supabase Storage), and viewing
- Quizzes with submissions and progress visualization (Recharts)
- Protected routes and role-based routes
- Tailwind CSS styling with Ocean Professional theme
- Edge Function stub for certificate generation
- Schema and RLS SQL for Supabase

## Prerequisites

- Node.js 18+
- Supabase account and project
- supabase CLI (for deploying SQL and Edge Functions)

## Setup

1) Install dependencies:

```bash
cd lms_frontend
npm install
```

2) Configure environment variables:

Copy `.env.example` to `.env` and set the values:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FRONTEND_URL=http://localhost:3000

# (Optional) Compatibility if other parts rely on CRA-style vars:
REACT_APP_FRONTEND_URL=http://localhost:3000

# Keep existing values if already used elsewhere in the container:
REACT_APP_API_BASE=
REACT_APP_BACKEND_URL=
REACT_APP_WS_URL=
...
```

3) Tailwind CSS (already configured):

- `tailwind.config.js` and `postcss.config.js` included.
- Global styles wired in `src/index.css`.
- Content globs include `./index.html` and `./src/**/*.{js,jsx,ts,tsx}`.

4) Start the app (Vite):

```bash
# dev server on port 3000
npm run dev
# or
npm start
```

Open http://localhost:3000

Build and preview:

```bash
npm run build
npm run preview
```

## Supabase Setup

1) Initialize schema and RLS:

```bash
# From lms_frontend folder (or repo root adjust paths)
supabase db push --file docs/supabase/schema.sql
supabase db push --file docs/supabase/rls.sql
```

Alternatively, run in Studio SQL editor by copying contents of the files.

2) Storage buckets:

Create two buckets (public or restricted per your needs):
- `course-media` (for videos and PDFs)
- `certificates` (for generated certificates)

3) Edge Function deployment (stub):

```bash
# From lms_frontend/docs/supabase/edge
supabase functions deploy certificates
```

The function is a stub that validates input and returns a JSON placeholder.

## Seeding Data (optional)

In Supabase SQL editor, you can add minimal seed rows after creating a user:

```sql
-- Assume an auth user exists with UUID 'YOUR_USER_ID'
insert into public.users (id, email, full_name, role)
values ('YOUR_USER_ID', 'you@example.com', 'You', 'admin')
on conflict (id) do nothing;

insert into public.courses (title, description, level, created_by)
values ('Intro to Ocean LMS', 'Getting started course', 'Beginner', 'YOUR_USER_ID');
```

## Security Notes

- Do not commit real keys. Use environment variables.
- Input validation is performed client-side for UX. Enforce access control via Supabase RLS.
- Avoid logging sensitive data in the browser console.

## Project Structure

- `src/main.jsx` - Vite entrypoint (mounts BrowserRouter and App)
- `index.html` - Root HTML (Vite)
- `src/supabase/client.js` - Supabase initialization (uses VITE_ envs, falls back to CRA)
- `src/context/AuthContext.jsx` - Auth/session/roles
- `src/routes/ProtectedRoute.jsx` - Auth guard
- `src/routes/RoleRoute.jsx` - Role guard
- Components: Navbar, Sidebar, CourseCard, VideoPlayer, PdfViewer, Quiz, ProgressChart
- Pages: Login, Signup, Dashboard, Courses, CourseDetails, TakeQuiz, AdminPanel, CreateCourse, CreateQuiz, AssignCourses

## Notes

- This frontend assumes the provided schema and RLS policies are applied in your Supabase project.
- Certificates Edge Function is a placeholder and should be extended to generate PDFs and write to `certificates` storage bucket.
