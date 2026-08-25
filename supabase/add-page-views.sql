-- ============================================================
-- Adiciona contador de visitas ao site
-- Cole este arquivo no SQL Editor do Supabase e clique em "Run".
-- ============================================================

create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  visitor_id text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;

create policy "page_views_public_insert" on page_views for insert with check (true);
create policy "page_views_admin_select" on page_views for select using (auth.role() = 'authenticated');

grant usage on schema public to anon, authenticated;
grant insert on public.page_views to anon;
grant select on public.page_views to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
