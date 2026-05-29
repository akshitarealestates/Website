-- Admin check helper (SECURITY DEFINER avoids RLS recursion on profiles)
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table profiles        enable row level security;
alter table localities      enable row level security;
alter table properties      enable row level security;
alter table property_images enable row level security;
alter table project_details enable row level security;
alter table leads           enable row level security;
alter table valuations      enable row level security;
alter table favorites       enable row level security;
alter table saved_searches  enable row level security;
alter table chat_sessions   enable row level security;
alter table chat_messages   enable row level security;
alter table blog_posts      enable row level security;

-- profiles
create policy "profiles self read"  on profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy "profiles admin all" on profiles for all using (public.is_admin()) with check (public.is_admin());

-- localities
create policy "localities public read" on localities for select using (true);
create policy "localities admin write" on localities for all using (public.is_admin()) with check (public.is_admin());

-- properties
create policy "properties public read" on properties for select
  using (status = 'published' or owner_id = auth.uid() or public.is_admin());
create policy "properties seller insert" on properties for insert
  with check (auth.uid() = owner_id and category = 'resell' and source = 'user');
create policy "properties seller update" on properties for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid() and category = 'resell');
create policy "properties admin all" on properties for all
  using (public.is_admin()) with check (public.is_admin());

-- property_images
create policy "images read" on property_images for select using (
  exists (select 1 from properties p where p.id = property_id
          and (p.status = 'published' or p.owner_id = auth.uid() or public.is_admin())));
create policy "images owner write" on property_images for all using (
  exists (select 1 from properties p where p.id = property_id
          and (p.owner_id = auth.uid() or public.is_admin())))
  with check (
  exists (select 1 from properties p where p.id = property_id
          and (p.owner_id = auth.uid() or public.is_admin())));

-- project_details
create policy "project read" on project_details for select using (
  exists (select 1 from properties p where p.id = property_id
          and (p.status = 'published' or public.is_admin())));
create policy "project admin write" on project_details for all using (public.is_admin()) with check (public.is_admin());

-- leads + valuations
create policy "leads public insert" on leads for insert with check (true);
create policy "leads admin manage" on leads for all using (public.is_admin()) with check (public.is_admin());
create policy "valuations public insert" on valuations for insert with check (true);
create policy "valuations admin manage" on valuations for all using (public.is_admin()) with check (public.is_admin());

-- favorites / saved_searches
create policy "favorites owner" on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "saved owner" on saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- chat
create policy "chat sessions owner" on chat_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "chat messages owner" on chat_messages for all using (
  exists (select 1 from chat_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (
  exists (select 1 from chat_sessions s where s.id = session_id and s.user_id = auth.uid()));

-- blog
create policy "blog public read" on blog_posts for select using (status = 'published' or public.is_admin());
create policy "blog admin write" on blog_posts for all using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for property images
insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true)
  on conflict (id) do nothing;
create policy "property images public read" on storage.objects for select
  using (bucket_id = 'property-images');
create policy "property images auth write" on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
create policy "property images auth update" on storage.objects for update
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
create policy "property images auth delete" on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
