-- Run this in Supabase: SQL Editor → New query → paste → Run
-- Free tier: https://supabase.com/dashboard

-- Likes: one row per blog post id (content collection id / URL slug)
create table if not exists public.post_likes (
  slug text primary key,
  count bigint not null default 0
);

-- Subscribers: you view these in Table Editor or run SELECT in SQL Editor
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_lower
  on public.subscribers (lower(email));

alter table public.post_likes enable row level security;
alter table public.subscribers enable row level security;

-- Public can read like counts
drop policy if exists "public read post_likes" on public.post_likes;
create policy "public read post_likes"
  on public.post_likes
  for select
  to anon, authenticated
  using (true);

-- Anon can subscribe (no read — you use the Supabase dashboard to see who)
drop policy if exists "anon insert subscribers" on public.subscribers;
create policy "anon insert subscribers"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT for anon on subscribers (emails not exposed in the browser)
drop policy if exists "anon select subscribers" on public.subscribers;
-- (intentionally no select policy for anon)

-- Increment like count (only way clients mutate likes)
create or replace function public.increment_post_like(p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_slug is null or length(trim(p_slug)) = 0 or length(p_slug) > 512 then
    raise exception 'invalid slug';
  end if;
  insert into public.post_likes (slug, count)
  values (p_slug, 1)
  on conflict (slug) do update
  set count = public.post_likes.count + 1;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.post_likes to anon, authenticated;
grant insert on public.subscribers to anon, authenticated;
grant execute on function public.increment_post_like(text) to anon, authenticated;
