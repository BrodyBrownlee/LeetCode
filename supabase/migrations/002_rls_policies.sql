-- Enable RLS on every user-owned table
alter table public.profiles     enable row level security;
alter table public.problems     enable row level security;
alter table public.attempts     enable row level security;
alter table public.tags         enable row level security;
alter table public.problem_tags enable row level security;
alter table public.friendships  enable row level security;

-- ── Profiles ──────────────────────────────────────────────────────────────────
create policy "profiles: any authed user can read"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles: owner can insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles: owner can update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- ── Problems ──────────────────────────────────────────────────────────────────
create policy "problems: owner full access"
  on public.problems for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Attempts ──────────────────────────────────────────────────────────────────
create policy "attempts: owner full access"
  on public.attempts for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Tags ──────────────────────────────────────────────────────────────────────
create policy "tags: read seed tags and own tags"
  on public.tags for select
  to authenticated
  using (user_id is null or user_id = auth.uid());

create policy "tags: owner can insert"
  on public.tags for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "tags: owner can update"
  on public.tags for update
  to authenticated
  using (user_id = auth.uid());

create policy "tags: owner can delete"
  on public.tags for delete
  to authenticated
  using (user_id = auth.uid());

-- ── Problem Tags ──────────────────────────────────────────────────────────────
create policy "problem_tags: access through problem ownership"
  on public.problem_tags for all
  to authenticated
  using (
    exists (
      select 1 from public.problems p
      where p.id = problem_id and p.user_id = auth.uid()
    )
  );

-- ── Friendships ───────────────────────────────────────────────────────────────
create policy "friendships: visible to both parties"
  on public.friendships for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "friendships: requester can insert"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = requester_id);

create policy "friendships: addressee can accept (update status)"
  on public.friendships for update
  to authenticated
  using (auth.uid() = addressee_id);

create policy "friendships: either party can delete"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
