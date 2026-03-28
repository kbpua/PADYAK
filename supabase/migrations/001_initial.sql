-- Run in Supabase SQL Editor (Dashboard → SQL) or via Supabase CLI.
-- Creates profiles, bike listings, reviews, and Kalsada tables with RLS for authenticated users.
--
-- If the auth trigger fails to create, change the last line to:
--   for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  barangay text default 'Brgy. UP Campus',
  city text default 'Quezon City',
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, barangay, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    'Brgy. UP Campus',
    'Quezon City'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bike listings (host-owned; seed bikes stay in the app bundle)
-- ---------------------------------------------------------------------------
create table if not exists public.bike_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null,
  condition text not null,
  gears text not null,
  frame_size text not null,
  price_per_hour int not null,
  price_per_day int not null,
  description text not null,
  color text not null,
  location jsonb not null default '{}',
  owner_snapshot jsonb not null default '{}',
  photos jsonb default '[]'::jsonb,
  listing_meta jsonb default '{}'::jsonb,
  availability jsonb default '{}'::jsonb,
  rating numeric default 0,
  total_rentals int default 0,
  created_at timestamptz default now()
);

create index if not exists bike_listings_owner_id_idx on public.bike_listings (owner_id);

alter table public.bike_listings enable row level security;

create policy "bike_listings_select_auth"
  on public.bike_listings for select
  to authenticated
  using (true);

create policy "bike_listings_insert_own"
  on public.bike_listings for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "bike_listings_update_own"
  on public.bike_listings for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "bike_listings_delete_own"
  on public.bike_listings for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Reviews (user-submitted; merged in app with seed reviews for demo bikes)
-- ---------------------------------------------------------------------------
create table if not exists public.bike_reviews (
  id uuid primary key default gen_random_uuid(),
  bike_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  rating numeric not null check (rating >= 1 and rating <= 5),
  body text not null,
  created_at timestamptz default now()
);

create index if not exists bike_reviews_bike_id_idx on public.bike_reviews (bike_id);

alter table public.bike_reviews enable row level security;

create policy "bike_reviews_select_auth"
  on public.bike_reviews for select
  to authenticated
  using (true);

create policy "bike_reviews_insert_own"
  on public.bike_reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "bike_reviews_update_own"
  on public.bike_reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "bike_reviews_delete_own"
  on public.bike_reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Kalsada reports
-- ---------------------------------------------------------------------------
create table if not exists public.kalsada_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  issue_type text not null,
  location text not null,
  severity text not null,
  description text default '',
  upvotes int not null default 0,
  created_at timestamptz default now()
);

alter table public.kalsada_reports enable row level security;

create policy "kalsada_select_auth"
  on public.kalsada_reports for select
  to authenticated
  using (true);

create policy "kalsada_insert_auth"
  on public.kalsada_reports for insert
  to authenticated
  with check (user_id is null or auth.uid() = user_id);

create policy "kalsada_update_auth"
  on public.kalsada_reports for update
  to authenticated
  using (true)
  with check (true);
