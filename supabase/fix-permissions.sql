-- ============================================================
-- Correção de permissões
-- Necessário porque a opção "Expor automaticamente novas tabelas"
-- foi desmarcada na criação do projeto (o que é bom pra segurança,
-- mas exige conceder essas permissões manualmente uma vez).
-- Cole este arquivo no SQL Editor do Supabase e clique em "Run".
-- ============================================================

grant usage on schema public to anon, authenticated;

grant select on public.news to anon, authenticated;
grant all on public.news to authenticated;

grant select on public.services to anon, authenticated;
grant all on public.services to authenticated;

grant select on public.settings to anon, authenticated;
grant all on public.settings to authenticated;

grant insert on public.messages to anon;
grant select, update, delete on public.messages to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;
