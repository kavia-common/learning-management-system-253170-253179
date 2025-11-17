-- PUBLIC SCHEMA for LMS

-- Users profile table linked to auth.users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'student', -- 'student' | 'trainer' | 'admin'
  created_at timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  content_count int not null default 0,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- Course content (video/pdf)
create table if not exists public.course_content (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  type text not null check (type in ('video','pdf')),
  bucket text not null default 'course-media',
  storage_path text not null,
  position int not null default 1,
  created_at timestamptz not null default now()
);

-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- Quizzes
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

-- Quiz questions
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position int not null default 1,
  text text not null,
  options text[] not null,
  correct_index int not null check (correct_index >= 0)
);

-- Quiz submissions
create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  score int not null default 0,
  total int not null default 0,
  score_percent numeric not null default 0,
  answers_json jsonb,
  created_at timestamptz not null default now()
);

-- Manual course assignments (admin/trainer to users)
create table if not exists public.course_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

-- Buckets to create (via Supabase Storage UI/CLI)
-- course-media (for videos/pdfs)
-- certificates (for generated certificates)
