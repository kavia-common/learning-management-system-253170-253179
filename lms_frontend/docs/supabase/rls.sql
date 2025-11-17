-- Enable RLS
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.course_content enable row level security;
alter table public.enrollments enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_submissions enable row level security;
alter table public.course_assignments enable row level security;

-- Helper: is admin/trainer
create or replace function public.is_admin_or_trainer(uid uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.users u
    where u.id = uid and u.role in ('admin','trainer')
  );
$$;

-- Users: users can see their own profile; admins can see all
create policy "Users select own or admin" on public.users
for select using (
  auth.uid() = id or public.is_admin_or_trainer(auth.uid())
);
create policy "Users update own or admin" on public.users
for update using (
  auth.uid() = id or public.is_admin_or_trainer(auth.uid())
);
create policy "Users insert admin only" on public.users
for insert with check ( public.is_admin_or_trainer(auth.uid()) );

-- Courses: readable to all authenticated; insert/update by admin/trainer
create policy "Courses read all" on public.courses for select using (auth.role() = 'authenticated');
create policy "Courses insert admin trainer" on public.courses for insert with check (public.is_admin_or_trainer(auth.uid()));
create policy "Courses update admin trainer" on public.courses for update using (public.is_admin_or_trainer(auth.uid()));
create policy "Courses delete admin trainer" on public.courses for delete using (public.is_admin_or_trainer(auth.uid()));

-- Course content: readable to enrolled users or admin/trainer
create policy "Content read enrolled or admin" on public.course_content
for select using (
  public.is_admin_or_trainer(auth.uid()) or
  exists(select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = course_id)
);
create policy "Content write admin trainer" on public.course_content
for all using (public.is_admin_or_trainer(auth.uid()))
with check (public.is_admin_or_trainer(auth.uid()));

-- Enrollments: user can see own; admin/trainer can manage
create policy "Enrollments select own or admin" on public.enrollments
for select using (user_id = auth.uid() or public.is_admin_or_trainer(auth.uid()));
create policy "Enrollments insert admin trainer" on public.enrollments
for insert with check (public.is_admin_or_trainer(auth.uid()));
create policy "Enrollments delete admin trainer" on public.enrollments
for delete using (public.is_admin_or_trainer(auth.uid()));

-- Quizzes: readable to enrolled users; write by admin/trainer
create policy "Quizzes read enrolled or admin" on public.quizzes
for select using (
  public.is_admin_or_trainer(auth.uid()) or
  exists(select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = quizzes.course_id)
);
create policy "Quizzes write admin trainer" on public.quizzes
for all using (public.is_admin_or_trainer(auth.uid()))
with check (public.is_admin_or_trainer(auth.uid()));

-- Quiz questions: same as quizzes
create policy "Questions read enrolled or admin" on public.quiz_questions
for select using (
  public.is_admin_or_trainer(auth.uid()) or
  exists(
    select 1 from public.quizzes q
    join public.enrollments e on e.course_id = q.course_id
    where q.id = quiz_questions.quiz_id and e.user_id = auth.uid()
  )
);
create policy "Questions write admin trainer" on public.quiz_questions
for all using (public.is_admin_or_trainer(auth.uid()))
with check (public.is_admin_or_trainer(auth.uid()));

-- Submissions: user can read own; insert own; admin/trainer can read all
create policy "Submissions select own or admin" on public.quiz_submissions
for select using (user_id = auth.uid() or public.is_admin_or_trainer(auth.uid()));
create policy "Submissions insert own" on public.quiz_submissions
for insert with check (user_id = auth.uid());
create policy "Submissions delete admin trainer" on public.quiz_submissions
for delete using (public.is_admin_or_trainer(auth.uid()));

-- Assignments: admin/trainer manage; user can read assignments for them
create policy "Assignments read own or admin" on public.course_assignments
for select using (user_id = auth.uid() or public.is_admin_or_trainer(auth.uid()));
create policy "Assignments write admin trainer" on public.course_assignments
for all using (public.is_admin_or_trainer(auth.uid()))
with check (public.is_admin_or_trainer(auth.uid()));
