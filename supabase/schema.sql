-- IsoKidova database schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  age integer,
  grade text,
  subject text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  tutor_id uuid not null references auth.users (id) on delete cascade,
  strengths text,
  weaknesses text,
  topics_assessed text,
  results text,
  observations text,
  additional_notes text,
  created_at timestamptz not null default now()
);

-- A generated report. `child_name` / `child_age` / `child_grade` /
-- `child_subject` are captured at generation time so the parent view (and
-- the report itself) stay stable even if the child's profile changes later,
-- and so the parent-facing RPC never has to join back to `children` /
-- `profiles` (which would risk leaking tutor account info).
create table if not exists public.learning_reports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete set null,
  tutor_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'saved')),
  child_name text not null,
  child_age integer,
  child_grade text,
  child_subject text,
  strengths jsonb not null default '[]'::jsonb,
  learning_gaps jsonb not null default '[]'::jsonb,
  priority_goal text,
  recommended_practice text,
  ai_provider text not null default 'mock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_plan_days (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.learning_reports (id) on delete cascade,
  day_number integer not null check (day_number between 1 and 14),
  focus_skill text,
  activity text,
  estimated_time text,
  difficulty text,
  success_criterion text,
  unique (report_id, day_number)
);

create table if not exists public.parent_share_links (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.learning_reports (id) on delete cascade,
  tutor_id uuid not null references auth.users (id) on delete cascade,
  token text not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Progress tracking is out of scope for MVP 1's UI, but the table exists now
-- so the Child Learning Coach / Parent Dashboard features described in the
-- brief can be added later without a schema migration that touches
-- everything else.
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  report_id uuid references public.learning_reports (id) on delete cascade,
  plan_day_id uuid references public.learning_plan_days (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists children_tutor_id_idx on public.children (tutor_id);
create index if not exists assessments_child_id_idx on public.assessments (child_id);
create index if not exists assessments_tutor_id_idx on public.assessments (tutor_id);
create index if not exists learning_reports_child_id_idx on public.learning_reports (child_id);
create index if not exists learning_reports_tutor_id_idx on public.learning_reports (tutor_id);
create index if not exists learning_plan_days_report_id_idx on public.learning_plan_days (report_id);
create index if not exists parent_share_links_report_id_idx on public.parent_share_links (report_id);
create index if not exists progress_child_id_idx on public.progress (child_id);

create unique index if not exists parent_share_links_token_key on public.parent_share_links (token);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a tutor signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Every table is scoped to the tutor who owns it (tutor_id = auth.uid(), or
-- reachable from a row that is).
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.assessments enable row level security;
alter table public.learning_reports enable row level security;
alter table public.learning_plan_days enable row level security;
alter table public.parent_share_links enable row level security;
alter table public.progress enable row level security;

-- profiles: a user can only see/update their own profile row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- children: tutor-owned
drop policy if exists "children_select_own" on public.children;
create policy "children_select_own" on public.children
  for select using (tutor_id = auth.uid());

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own" on public.children
  for insert with check (tutor_id = auth.uid());

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own" on public.children
  for update using (tutor_id = auth.uid()) with check (tutor_id = auth.uid());

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own" on public.children
  for delete using (tutor_id = auth.uid());

-- assessments / learning_reports: tutor-owned directly (tutor_id column)
do $$
declare
  t text;
begin
  foreach t in array array['assessments', 'learning_reports']
  loop
    execute format('drop policy if exists "%1$s_select_own" on public.%1$s', t);
    execute format(
      'create policy "%1$s_select_own" on public.%1$s for select using (tutor_id = auth.uid())', t
    );

    execute format('drop policy if exists "%1$s_insert_own" on public.%1$s', t);
    execute format(
      'create policy "%1$s_insert_own" on public.%1$s for insert with check (tutor_id = auth.uid())', t
    );

    execute format('drop policy if exists "%1$s_update_own" on public.%1$s', t);
    execute format(
      'create policy "%1$s_update_own" on public.%1$s for update using (tutor_id = auth.uid()) with check (tutor_id = auth.uid())',
      t
    );

    execute format('drop policy if exists "%1$s_delete_own" on public.%1$s', t);
    execute format(
      'create policy "%1$s_delete_own" on public.%1$s for delete using (tutor_id = auth.uid())', t
    );
  end loop;
end $$;

-- learning_plan_days: access only through a report the current tutor owns
drop policy if exists "learning_plan_days_select_own" on public.learning_plan_days;
create policy "learning_plan_days_select_own" on public.learning_plan_days
  for select using (
    exists (select 1 from public.learning_reports r where r.id = learning_plan_days.report_id and r.tutor_id = auth.uid())
  );

drop policy if exists "learning_plan_days_insert_own" on public.learning_plan_days;
create policy "learning_plan_days_insert_own" on public.learning_plan_days
  for insert with check (
    exists (select 1 from public.learning_reports r where r.id = learning_plan_days.report_id and r.tutor_id = auth.uid())
  );

drop policy if exists "learning_plan_days_update_own" on public.learning_plan_days;
create policy "learning_plan_days_update_own" on public.learning_plan_days
  for update using (
    exists (select 1 from public.learning_reports r where r.id = learning_plan_days.report_id and r.tutor_id = auth.uid())
  ) with check (
    exists (select 1 from public.learning_reports r where r.id = learning_plan_days.report_id and r.tutor_id = auth.uid())
  );

drop policy if exists "learning_plan_days_delete_own" on public.learning_plan_days;
create policy "learning_plan_days_delete_own" on public.learning_plan_days
  for delete using (
    exists (select 1 from public.learning_reports r where r.id = learning_plan_days.report_id and r.tutor_id = auth.uid())
  );

-- parent_share_links: the tutor can manage their own links directly.
-- There is deliberately NO select policy for the anon/public role here --
-- parents never query this table (or learning_reports/learning_plan_days)
-- directly. They go through get_shared_report() below, a SECURITY DEFINER
-- function that returns only the fields a parent should see.
drop policy if exists "parent_share_links_select_own" on public.parent_share_links;
create policy "parent_share_links_select_own" on public.parent_share_links
  for select using (tutor_id = auth.uid());

drop policy if exists "parent_share_links_insert_own" on public.parent_share_links;
create policy "parent_share_links_insert_own" on public.parent_share_links
  for insert with check (tutor_id = auth.uid());

drop policy if exists "parent_share_links_update_own" on public.parent_share_links;
create policy "parent_share_links_update_own" on public.parent_share_links
  for update using (tutor_id = auth.uid()) with check (tutor_id = auth.uid());

drop policy if exists "parent_share_links_delete_own" on public.parent_share_links;
create policy "parent_share_links_delete_own" on public.parent_share_links
  for delete using (tutor_id = auth.uid());

-- progress: reachable through a child the current tutor owns (future use)
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select using (
    exists (select 1 from public.children c where c.id = progress.child_id and c.tutor_id = auth.uid())
  );

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert with check (
    exists (select 1 from public.children c where c.id = progress.child_id and c.tutor_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Parent share access
--
-- Parents open a link like /share/<token> with no account at all. This
-- function is the ONLY way that path reaches the database: it looks up the
-- token itself (bypassing RLS as SECURITY DEFINER, since there is no
-- auth.uid() for an anonymous visitor), confirms the link hasn't been
-- revoked, and returns a plain JSON object containing only what a parent
-- should see -- never tutor_id, tutor email, or any other tutor account
-- information.
-- ---------------------------------------------------------------------------

create or replace function public.get_shared_report(p_token text)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_report public.learning_reports%rowtype;
  v_days jsonb;
begin
  select r.* into v_report
  from public.learning_reports r
  join public.parent_share_links l on l.report_id = r.id
  where l.token = p_token
    and l.revoked_at is null
  limit 1;

  if not found then
    return null;
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'day_number', d.day_number,
      'focus_skill', d.focus_skill,
      'activity', d.activity,
      'estimated_time', d.estimated_time,
      'difficulty', d.difficulty,
      'success_criterion', d.success_criterion
    ) order by d.day_number
  ), '[]'::jsonb)
  into v_days
  from public.learning_plan_days d
  where d.report_id = v_report.id;

  return jsonb_build_object(
    'child_name', v_report.child_name,
    'child_age', v_report.child_age,
    'child_grade', v_report.child_grade,
    'child_subject', v_report.child_subject,
    'strengths', v_report.strengths,
    'learning_gaps', v_report.learning_gaps,
    'priority_goal', v_report.priority_goal,
    'recommended_practice', v_report.recommended_practice,
    'plan_days', v_days,
    'updated_at', v_report.updated_at
  );
end;
$$;

-- Callable by anyone with the link, signed in or not.
grant execute on function public.get_shared_report(text) to anon, authenticated;
