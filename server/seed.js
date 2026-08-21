const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db");

function nowIso() {
  return new Date().toISOString();
}

function seedAdminUser() {
  const existing = db.prepare("SELECT id FROM admin_users LIMIT 1").get();
  if (existing) {
    console.log("Usuário admin já existe — mantendo o atual.");
    return;
  }

  const username = "admin";
  const password = crypto.randomBytes(6).toString("base64url"); // senha aleatória forte
  const hash = bcrypt.hashSync(password, 10);

  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(username, hash);

  const credsPath = path.join(__dirname, "ADMIN_CREDENTIALS.txt");
  fs.writeFileSync(
    credsPath,
    `Usuário: ${username}\nSenha: ${password}\n\nGuarde este arquivo em local seguro e troque a senha após o primeiro login (aba "Minha conta" no painel).\n`,
    "utf8"
  );

  console.log("========================================");
  console.log("Usuário administrador criado:");
  console.log("  Usuário:", username);
  console.log("  Senha:  ", password);
  console.log("(também salvo em server/ADMIN_CREDENTIALS.txt)");
  console.log("========================================");
}

function seedSettings() {
  const existing = db.prepare("SELECT key FROM settings LIMIT 1").get();
  if (existing) return;

  const defaults = {
    whatsapp_number: "5571999517948",
    whatsapp_display: "(71) 99951-7948",
    whatsapp_message: "Olá! Vim pelo site e gostaria de saber mais sobre os serviços de contabilidade.",
    email: "vitorn.contabilidade@outlook.com",
    instagram_handle: "@vnassessoriacontabil",
    instagram_url: "https://instagram.com/vnassessoriacontabil",
    presencial_display: "Presencial: Salvador, BA",
    online_display: "Online: Em todo o Brasil",
    crc_display: "CONTADOR - CRC BA - N° 044908/O-9",
  };

  const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(defaults)) {
    stmt.run(key, value);
  }
  console.log("Configurações padrão inseridas.");
}

function seedServices() {
  const existing = db.prepare("SELECT id FROM services LIMIT 1").get();
  if (existing) return;

  const services = [
    ["building", "Abertura de Empresas", "Registro na Junta Comercial, Receita Federal, Estado e Município."],
    ["edit", "Alteração Contratual", "Atualização de dados da empresa, como mudança de endereço, sócios ou atividade (CNAE)."],
    ["x-circle", "Baixa e Encerramento", "Processo de fechamento definitivo e extinção do CNPJ."],
    ["shield-check", "Emissão de Certidões Negativas", "Obtenção de comprovantes de regularidade fiscal perante órgãos públicos."],
    ["lock", "Certificado Digital", "Emissão e renovação de e-CPF e e-CNPJ, essenciais para assinar documentos e acessar sistemas do governo com segurança."],
    ["grid", "Contabilidade Mensal (PJ)", "Escrituração contábil e fiscal, apuração de impostos e cumprimento de todas as obrigações acessórias da sua empresa."],
    ["users", "Folha de Pagamento e eSocial", "Admissões, rescisões, encargos trabalhistas e envio de eventos ao eSocial com total conformidade legal."],
    ["chart", "IR e Planejamento Tributário", "Declaração de Imposto de Renda para pessoa física e estratégias legais para reduzir a carga tributária do seu negócio."],
    ["bars", "Cálculo Revisional", "Revisão detalhada de cálculos contábeis e financeiros para identificar inconsistências e valores a recuperar."],
    ["doc-check", "Parecer Técnico-Contábil", "Laudos e pareceres técnicos elaborados para fins judiciais, societários ou negociais."],
    ["doc-lines", "Declarações", "Elaboração e entrega de declarações obrigatórias dentro dos prazos legais, com precisão e organização."],
    ["home", "Declaração para Financiamento Habitacional", "Documentação contábil para comprovação de renda em processos de financiamento imobiliário."],
  ];

  const stmt = db.prepare(
    "INSERT INTO services (icon_key, title, description, sort_order) VALUES (?, ?, ?, ?)"
  );
  services.forEach(([icon_key, title, description], i) => stmt.run(icon_key, title, description, i));
  console.log(`${services.length} serviços inseridos.`);
}

function seedNews() {
  const existing = db.prepare("SELECT id FROM news LIMIT 1").get();
  if (existing) return;

  const items = [
    {
      tag: "Simples Nacional",
      title: "Fique de olho nas mudanças do Simples Nacional",
      summary:
        "Acompanhamos as atualizações de alíquotas, faixas de faturamento e obrigações acessórias que podem impactar o seu negócio.",
      slug: "simples-nacional",
      body: [
        "O Simples Nacional é o regime tributário mais utilizado por micro e pequenas empresas no Brasil, justamente por unificar tributos e simplificar o pagamento de impostos em uma única guia. Mas essa simplicidade não significa que o regime seja estático: alíquotas, faixas de faturamento, anexos e obrigações acessórias podem passar por atualizações ao longo do tempo, e ficar de fora dessas mudanças pode custar caro.",
        "## Por que acompanhar as mudanças importa",
        "Uma empresa que ultrapassa o limite de faturamento da sua faixa, muda de atividade ou deixa de observar uma nova exigência pode acabar pagando mais impostos do que deveria — ou, pior, ser desenquadrada do regime. Acompanhar de perto essas variações é o que garante que sua empresa continue no enquadramento tributário mais vantajoso.",
        "## Como a Vitor Nascimento pode ajudar",
        "Cuidamos do acompanhamento contínuo do enquadramento tributário da sua empresa, avaliando se o Simples Nacional continua sendo a opção mais vantajosa e alertando você sobre qualquer mudança relevante antes que ela vire um problema.",
      ].join("\n\n"),
    },
    {
      tag: "eSocial",
      title: "Novidades no eSocial e na folha de pagamento",
      summary:
        "Prazos e resoluções mudam com frequência — mantemos sua empresa sempre em conformidade com as exigências trabalhistas.",
      slug: "esocial",
      body: [
        "O eSocial unificou o envio de informações trabalhistas, previdenciárias e fiscais relacionadas aos funcionários de uma empresa. Isso trouxe mais organização, mas também exige atenção constante: os eventos, prazos e regras de preenchimento passam por ajustes periódicos, e qualquer inconsistência pode gerar pendências, multas ou retrabalho.",
        "## O que acompanhamos por você",
        "Prazos de envio de cada evento do eSocial, atualizações nas regras de preenchimento, cálculo correto de encargos trabalhistas e previdenciários, e consistência entre a folha de pagamento e as informações enviadas ao governo.",
        "## Como a Vitor Nascimento pode ajudar",
        "Cuidamos de toda a rotina de departamento pessoal — da admissão à rescisão — garantindo que sua empresa permaneça em conformidade com as exigências trabalhistas, sem surpresas.",
      ].join("\n\n"),
    },
    {
      tag: "IRPF",
      title: "Calendário e novidades do Imposto de Renda",
      summary: "Saiba com antecedência o que muda na declaração anual e como se preparar para entregar tudo dentro do prazo.",
      slug: "irpf",
      body: [
        "Todos os anos, a declaração de Imposto de Renda da Pessoa Física passa por ajustes no calendário, nas regras de obrigatoriedade e nos documentos exigidos. Chegar perto do prazo final sem ter organizado a documentação é uma das principais causas de erros, inconsistências e até queda na malha fina.",
        "## Por que vale a pena se antecipar",
        "Reunir informes de rendimentos, comprovantes de despesas médicas e educacionais, dados de bens e direitos com calma reduz o risco de esquecer algo importante.",
        "## Como a Vitor Nascimento pode ajudar",
        "Cuidamos da organização e do envio da sua declaração com atenção aos detalhes que fazem diferença no resultado final, buscando sempre a opção mais vantajosa.",
      ].join("\n\n"),
    },
  ];

  const stmt = db.prepare(
    `INSERT INTO news (tag, title, summary, slug, body, is_active, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`
  );
  items.forEach((item, i) => {
    const ts = nowIso();
    stmt.run(item.tag, item.title, item.summary, item.slug, item.body, i, ts, ts);
  });
  console.log(`${items.length} notícias inseridas.`);
}

seedAdminUser();
seedSettings();
seedServices();
seedNews();

console.log("Seed concluído.");
