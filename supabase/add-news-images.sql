-- ============================================================
-- Adiciona suporte a imagem nas notícias
-- Cole este arquivo no SQL Editor do Supabase e clique em "Run".
-- ============================================================

alter table news add column if not exists image_url text;

-- Cria o espaço de armazenamento (bucket) público para as imagens
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER as imagens
create policy "news_images_public_read"
on storage.objects for select
using (bucket_id = 'news-images');

-- Só quem está logado no painel pode enviar, substituir ou excluir imagens
create policy "news_images_admin_insert"
on storage.objects for insert
with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

create policy "news_images_admin_update"
on storage.objects for update
using (bucket_id = 'news-images' and auth.role() = 'authenticated');

create policy "news_images_admin_delete"
on storage.objects for delete
using (bucket_id = 'news-images' and auth.role() = 'authenticated');
