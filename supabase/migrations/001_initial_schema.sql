-- Extensions
create extension if not exists "uuid-ossp";

-- Enums
create type difficulty as enum ('easy', 'medium', 'hard');
create type confidence as enum ('again', 'hard', 'good', 'easy');
create type friendship_status as enum ('pending', 'accepted');

-- Profiles (mirrors auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  display_name text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Problems (one row per unique problem per user)
create table public.problems (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  leetcode_number       int,
  title                 text not null,
  url                   text,
  difficulty            difficulty,
  ease_factor           numeric default 2.5,
  current_interval_days int default 0,
  next_review_at        timestamptz,
  created_at            timestamptz default now(),
  unique (user_id, leetcode_number)
);

-- Attempts (one row per solve, many per problem)
create table public.attempts (
  id                  uuid primary key default uuid_generate_v4(),
  problem_id          uuid not null references public.problems(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  solved_at           timestamptz default now(),
  time_spent_minutes  int,
  confidence          confidence not null,
  notes               text,
  solution_code       text,
  solution_language   text
);

-- Tags (user_id = null means a seed/global tag)
create table public.tags (
  id      uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  name    text not null,
  unique (user_id, name)
);

-- Problem ↔ Tag join
create table public.problem_tags (
  problem_id uuid not null references public.problems(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (problem_id, tag_id)
);

-- Friendships
create table public.friendships (
  id           uuid primary key default uuid_generate_v4(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status       friendship_status default 'pending',
  created_at   timestamptz default now(),
  -- prevent self-friendship
  check (requester_id != addressee_id)
);

-- Unique on the unordered pair so (A→B) and (B→A) can't both exist
create unique index friendships_pair_idx
  on public.friendships (
    least(requester_id::text, addressee_id::text),
    greatest(requester_id::text, addressee_id::text)
  );

-- Public stats view: only visible to self + accepted friends (enforced in app + RLS)
create or replace view public.public_profile_stats with (security_invoker = true) as
select
  p.id                      as user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  count(distinct pr.id)::int as total_problems_solved,
  0::int                    as current_streak  -- computed in app from attempts
from public.profiles p
left join public.problems pr on pr.user_id = p.id
where
  p.id = auth.uid()
  or exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = auth.uid() and f.addressee_id = p.id)
        or (f.addressee_id = auth.uid() and f.requester_id = p.id)
      )
  )
group by p.id, p.username, p.display_name, p.avatar_url;
