-- Add is_public flag to generated_images
alter table public.generated_images
add column if not exists is_public boolean default true;

-- Allow public to view only public generated images
create policy "Public can view public generated images" 
on public.generated_images
for select
using (is_public = true);

-- Likes table
create table if not exists public.community_likes (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.generated_images(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (image_id, user_id)
);

alter table public.community_likes enable row level security;

create policy "Anyone can read likes" 
on public.community_likes
for select
using (true);

create policy "Users can like images" 
on public.community_likes
for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can unlike their likes" 
on public.community_likes
for delete to authenticated
using (auth.uid() = user_id);

-- Comments table
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.generated_images(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) > 0 and char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.community_comments enable row level security;

create policy "Anyone can read comments" 
on public.community_comments
for select
using (true);

create policy "Users can comment" 
on public.community_comments
for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their comments" 
on public.community_comments
for delete to authenticated
using (auth.uid() = user_id);