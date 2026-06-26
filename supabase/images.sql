create table if not exists public.images (
  id text primary key,
  character text not null check (length(trim(character)) > 0),
  title text not null check (length(trim(title)) > 0),
  storage_path text not null unique,
  video_url text,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg')),
  filename text not null,
  original_filename text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- If an earlier partial run created public.images without the full shape,
-- repair it in place before policies reference these columns.
alter table public.images add column if not exists id text;
alter table public.images add column if not exists character text;
alter table public.images add column if not exists title text;
alter table public.images add column if not exists storage_path text;
alter table public.images add column if not exists video_url text;
alter table public.images add column if not exists mime_type text;
alter table public.images add column if not exists filename text;
alter table public.images add column if not exists original_filename text;
alter table public.images add column if not exists created_by uuid references auth.users(id) on delete cascade;
alter table public.images add column if not exists created_at timestamptz default now();
alter table public.images alter column created_at set default now();

update public.images
set filename = coalesce(
  nullif(filename, ''),
  nullif(original_filename, ''),
  nullif(regexp_replace(coalesce(storage_path, ''), '^.*/', ''), ''),
  id,
  'uploaded-image'
)
where filename is null or filename = '';

update public.images
set original_filename = coalesce(
  nullif(original_filename, ''),
  nullif(filename, ''),
  nullif(regexp_replace(coalesce(storage_path, ''), '^.*/', ''), ''),
  id,
  'uploaded-image'
)
where original_filename is null or original_filename = '';

alter table public.images alter column filename set not null;
alter table public.images alter column original_filename set not null;

create unique index if not exists images_id_unique_idx on public.images (id);
create unique index if not exists images_storage_path_unique_idx on public.images (storage_path);

alter table public.images enable row level security;

drop policy if exists "Authenticated users can read images" on public.images;
drop policy if exists "Anyone can read shared images" on public.images;
create policy "Anyone can read shared images"
on public.images for select
to anon, authenticated
using (true);

drop policy if exists "Users can add their own images" on public.images;
create policy "Users can add their own images"
on public.images for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "Users can update their own images" on public.images;
create policy "Users can update their own images"
on public.images for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'expression-images',
  'expression-images',
  true,
  10485760,
  array['image/png', 'image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can view expression images" on storage.objects;
drop policy if exists "Anyone can view expression images" on storage.objects;
create policy "Anyone can view expression images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'expression-images');

drop policy if exists "Users can upload expression images to their folder" on storage.objects;
create policy "Users can upload expression images to their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'expression-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their expression images" on storage.objects;
create policy "Users can update their expression images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'expression-images'
  and owner_id = auth.uid()::text
)
with check (
  bucket_id = 'expression-images'
  and owner_id = auth.uid()::text
);

drop policy if exists "Users can delete their expression images" on storage.objects;
create policy "Users can delete their expression images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'expression-images'
  and owner_id = auth.uid()::text
);
