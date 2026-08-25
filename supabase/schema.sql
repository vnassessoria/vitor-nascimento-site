-- ============================================================
-- Vitor Nascimento Assessoria Contábil — Schema do Supabase
-- ============================================================
-- Como usar:
-- 1) Crie um projeto em https://supabase.com
-- 2) Abra "SQL Editor" no menu lateral
-- 3) Cole TODO este arquivo e clique em "Run"
-- Isso cria as tabelas, as regras de segurança (RLS) e já
-- popula o site com o conteúdo atual (notícias, serviços etc.)
-- ============================================================

create table if not exists news (
  id bigint generated always as identity primary key,
  tag text not null,
  title text not null,
  summary text not null,
  slug text not null unique,
  body text not null default '',
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id bigint generated always as identity primary key,
  icon_key text not null default 'building',
  title text not null,
  description text not null,
  sort_order integer not null default 0
);

create table if not exists settings (
  key text primary key,
  value text not null
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  nome text not null,
  email text,
  telefone text,
  mensagem text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  visitor_id text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Segurança (Row Level Security)
-- Qualquer visitante pode LER notícias/serviços/configurações
-- e ENVIAR mensagens de contato. Só um usuário logado (você,
-- no painel admin) pode criar, editar ou excluir conteúdo, e
-- só você pode ler as mensagens recebidas.
-- ============================================================

alter table news enable row level security;
alter table services enable row level security;
alter table settings enable row level security;
alter table messages enable row level security;

create policy "news_public_read" on news for select using (is_active = true);
create policy "news_admin_all" on news for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "services_public_read" on services for select using (true);
create policy "services_admin_all" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "settings_public_read" on settings for select using (true);
create policy "settings_admin_all" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "messages_public_insert" on messages for insert with check (true);
create policy "messages_admin_select" on messages for select using (auth.role() = 'authenticated');
create policy "messages_admin_update" on messages for update using (auth.role() = 'authenticated');
create policy "messages_admin_delete" on messages for delete using (auth.role() = 'authenticated');

alter table page_views enable row level security;
create policy "page_views_public_insert" on page_views for insert with check (true);
create policy "page_views_admin_select" on page_views for select using (auth.role() = 'authenticated');

-- Permissões de acesso às tabelas (necessário se a opção "Expor
-- automaticamente novas tabelas" estiver desmarcada no projeto).
grant usage on schema public to anon, authenticated;

grant select on public.news to anon, authenticated;
grant all on public.news to authenticated;

grant select on public.services to anon, authenticated;
grant all on public.services to authenticated;

grant select on public.settings to anon, authenticated;
grant all on public.settings to authenticated;

grant insert on public.messages to anon;
grant select, update, delete on public.messages to authenticated;

grant insert on public.page_views to anon;
grant select on public.page_views to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;

-- ============================================================
-- Conteúdo inicial (o que já está no site hoje)
-- ============================================================

insert into settings (key, value) values
  ('whatsapp_number', '5571999517948'),
  ('whatsapp_display', '(71) 99951-7948'),
  ('whatsapp_message', 'Olá! Vim pelo site e gostaria de saber mais sobre os serviços de contabilidade.'),
  ('email', 'vitorn.contabilidade@outlook.com'),
  ('instagram_handle', '@vnassessoriacontabil'),
  ('instagram_url', 'https://instagram.com/vnassessoriacontabil'),
  ('presencial_display', 'Presencial: Salvador, BA'),
  ('online_display', 'Online: Em todo o Brasil'),
  ('crc_display', 'CONTADOR - CRC BA - N° 044908/O-9')
on conflict (key) do nothing;

insert into services (icon_key, title, description, sort_order) values
  ('building', 'Abertura de Empresas', 'Registro na Junta Comercial, Receita Federal, Estado e Município.', 0),
  ('edit', 'Alteração Contratual', 'Atualização de dados da empresa, como mudança de endereço, sócios ou atividade (CNAE).', 1),
  ('x-circle', 'Baixa e Encerramento', 'Processo de fechamento definitivo e extinção do CNPJ.', 2),
  ('shield-check', 'Emissão de Certidões Negativas', 'Obtenção de comprovantes de regularidade fiscal perante órgãos públicos.', 3),
  ('lock', 'Certificado Digital', 'Emissão e renovação de e-CPF e e-CNPJ, essenciais para assinar documentos e acessar sistemas do governo com segurança.', 4),
  ('grid', 'Contabilidade Mensal (PJ)', 'Escrituração contábil e fiscal, apuração de impostos e cumprimento de todas as obrigações acessórias da sua empresa.', 5),
  ('users', 'Folha de Pagamento e eSocial', 'Admissões, rescisões, encargos trabalhistas e envio de eventos ao eSocial com total conformidade legal.', 6),
  ('chart', 'IR e Planejamento Tributário', 'Declaração de Imposto de Renda para pessoa física e estratégias legais para reduzir a carga tributária do seu negócio.', 7),
  ('bars', 'Cálculo Revisional', 'Revisão detalhada de cálculos contábeis e financeiros para identificar inconsistências e valores a recuperar.', 8),
  ('doc-check', 'Parecer Técnico-Contábil', 'Laudos e pareceres técnicos elaborados para fins judiciais, societários ou negociais.', 9),
  ('doc-lines', 'Declarações', 'Elaboração e entrega de declarações obrigatórias dentro dos prazos legais, com precisão e organização.', 10),
  ('home', 'Declaração para Financiamento Habitacional', 'Documentação contábil para comprovação de renda em processos de financiamento imobiliário.', 11);

insert into news (tag, title, summary, slug, body, is_active, sort_order) values
(
  'Simples Nacional',
  'Fique de olho nas mudanças do Simples Nacional',
  'Acompanhamos as atualizações de alíquotas, faixas de faturamento e obrigações acessórias que podem impactar o seu negócio.',
  'simples-nacional',
  E'O Simples Nacional é o regime tributário mais utilizado por micro e pequenas empresas no Brasil, justamente por unificar tributos e simplificar o pagamento de impostos em uma única guia. Mas essa simplicidade não significa que o regime seja estático: alíquotas, faixas de faturamento, anexos e obrigações acessórias podem passar por atualizações ao longo do tempo, e ficar de fora dessas mudanças pode custar caro.\n\n## Por que acompanhar as mudanças importa\n\nUma empresa que ultrapassa o limite de faturamento da sua faixa, muda de atividade ou deixa de observar uma nova exigência pode acabar pagando mais impostos do que deveria — ou, pior, ser desenquadrada do regime. Acompanhar de perto essas variações é o que garante que sua empresa continue no enquadramento tributário mais vantajoso.\n\n## Como a Vitor Nascimento pode ajudar\n\nCuidamos do acompanhamento contínuo do enquadramento tributário da sua empresa, avaliando se o Simples Nacional continua sendo a opção mais vantajosa e alertando você sobre qualquer mudança relevante antes que ela vire um problema.',
  true, 0
),
(
  'eSocial',
  'Novidades no eSocial e na folha de pagamento',
  'Prazos e resoluções mudam com frequência — mantemos sua empresa sempre em conformidade com as exigências trabalhistas.',
  'esocial',
  E'O eSocial unificou o envio de informações trabalhistas, previdenciárias e fiscais relacionadas aos funcionários de uma empresa. Isso trouxe mais organização, mas também exige atenção constante: os eventos, prazos e regras de preenchimento passam por ajustes periódicos, e qualquer inconsistência pode gerar pendências, multas ou retrabalho.\n\n## O que acompanhamos por você\n\nPrazos de envio de cada evento do eSocial, atualizações nas regras de preenchimento, cálculo correto de encargos trabalhistas e previdenciários, e consistência entre a folha de pagamento e as informações enviadas ao governo.\n\n## Como a Vitor Nascimento pode ajudar\n\nCuidamos de toda a rotina de departamento pessoal — da admissão à rescisão — garantindo que sua empresa permaneça em conformidade com as exigências trabalhistas, sem surpresas.',
  true, 1
),
(
  'IRPF',
  'Calendário e novidades do Imposto de Renda',
  'Saiba com antecedência o que muda na declaração anual e como se preparar para entregar tudo dentro do prazo.',
  'irpf',
  E'Todos os anos, a declaração de Imposto de Renda da Pessoa Física passa por ajustes no calendário, nas regras de obrigatoriedade e nos documentos exigidos. Chegar perto do prazo final sem ter organizado a documentação é uma das principais causas de erros, inconsistências e até queda na malha fina.\n\n## Por que vale a pena se antecipar\n\nReunir informes de rendimentos, comprovantes de despesas médicas e educacionais, dados de bens e direitos com calma reduz o risco de esquecer algo importante.\n\n## Como a Vitor Nascimento pode ajudar\n\nCuidamos da organização e do envio da sua declaração com atenção aos detalhes que fazem diferença no resultado final, buscando sempre a opção mais vantajosa.',
  true, 2
)
on conflict (slug) do nothing;

-- ============================================================
-- Imagens das notícias (Storage)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

create policy "news_images_public_read"
on storage.objects for select
using (bucket_id = 'news-images');

create policy "news_images_admin_insert"
on storage.objects for insert
with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

create policy "news_images_admin_update"
on storage.objects for update
using (bucket_id = 'news-images' and auth.role() = 'authenticated');

create policy "news_images_admin_delete"
on storage.objects for delete
using (bucket_id = 'news-images' and auth.role() = 'authenticated');
