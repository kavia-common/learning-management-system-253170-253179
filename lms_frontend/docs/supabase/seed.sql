-- Seed demo users and data (adjust UUIDs to actual auth.users IDs)
-- Replace YOUR_ADMIN_USER_ID and YOUR_STUDENT_USER_ID with real UUIDs from auth.users

insert into public.users (id, email, full_name, role)
values 
  ('YOUR_ADMIN_USER_ID', 'admin@example.com', 'Admin User', 'admin'),
  ('YOUR_STUDENT_USER_ID', 'student@example.com', 'Student User', 'student')
on conflict (id) do nothing;

insert into public.courses (title, description, level, created_by)
values ('Ocean LMS 101', 'A starter course to explore the LMS.', 'Beginner', 'YOUR_ADMIN_USER_ID')
on conflict do nothing;

-- Create a sample quiz after creating the course; update COURSE_ID accordingly
-- insert into public.quizzes (course_id, title) values ('COURSE_ID', 'Intro Quiz');
-- insert into public.quiz_questions (quiz_id, position, text, options, correct_index)
-- values ('QUIZ_ID', 1, 'What color is the ocean?', array['Green','Blue','Red','Yellow'], 1);
