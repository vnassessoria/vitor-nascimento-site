const fs = require("fs");
const path = require("path");
const dir = __dirname;
const OUT = path.join(dir, "..", "cnaes.json");

const cnaes = JSON.parse(fs.readFileSync(path.join(dir, "ibge-cnae-subclasses.json"), "utf8"));
const mei = JSON.parse(fs.readFileSync(path.join(dir, "anexo-xi-mei.json"), "utf8"));
const vedados = JSON.parse(fs.readFileSync(path.join(dir, "anexo-vi-vii-cnae-vedados.json"), "utf8"));
const existing = JSON.parse(fs.readFileSync(path.join(dir, "..", "cnaes.json"), "utf8"));

// ---------------------------------------------------------------------------
// Fontes (URLs reutilizadas em várias entradas)
// ---------------------------------------------------------------------------
const FONTE_IBGE = (codigoNumerico) => `https://servicodados.ibge.gov.br/api/v2/cnae/subclasses/${codigoNumerico}`;
const FONTE_LC123 = "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm";
const FONTE_ANEXO_XI = "https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/anexo_xi.pdf";
const FONTE_ANEXO_VI = "https://www.gov.br/empresas-e-negocios/pt-br/drei/arquivos/AnexoVI.pdf";
const FONTE_ANEXO_VII = "https://www.gov.br/empresas-e-negocios/pt-br/drei/arquivos/AnexoVII.pdf";
const FONTE_CGSN140 = "https://admin.atendimento.receita.rs.gov.br/upload/arquivos/202508/22150110-legislacao-setorial-consolidada-ges-sn-v01.pdf";

// ---------------------------------------------------------------------------
// 1. Overrides manuais (as 18 entradas já pesquisadas individualmente,
//    com notas e ressalvas específicas). Essas prevalecem sobre a
//    classificação mecânica abaixo.
// ---------------------------------------------------------------------------
const MANUAL_OVERRIDES = {};
for (const e of existing) MANUAL_OVERRIDES[e.codigo] = e;

// ---------------------------------------------------------------------------
// 2. Anexo VI (impeditivos) e Anexo VII (ambíguos) — fonte oficial, confiança ALTA
// ---------------------------------------------------------------------------
const IMPEDITIVOS = new Map();
for (const item of vedados.anexoVI_impeditivos) IMPEDITIVOS.set(item.codigo, item.denominacao);

const AMBIGUOS = new Map();
for (const item of vedados.anexoVII_ambiguos) AMBIGUOS.set(item.codigo, item.denominacao || item.Denominação);

// ---------------------------------------------------------------------------
// 3. Anexo XI (MEI) — agrupar por código, pode haver várias ocupações por CNAE
// ---------------------------------------------------------------------------
const MEI_MAP = new Map();
for (const item of mei) {
  if (!MEI_MAP.has(item.codigo)) MEI_MAP.set(item.codigo, []);
  MEI_MAP.get(item.codigo).push(item.ocupacao);
}

// ---------------------------------------------------------------------------
// 4. Regras de serviço derivadas do art. 18 da LC 123/2006 (data/raw/anexo-rules.md)
//    Confiança MÉDIA/BAIXA — mapeamento CNAE<->inciso feito por correspondência
//    textual, não é lista oficial. Precisa de revisão contábil.
//    Ordem de prioridade: a primeira regra cuja lista contenha o código vence.
// ---------------------------------------------------------------------------
function expandFamily(prefix, list) {
  // prefixo tipo "3314-7" cobre todos os sufixos "/xx" daquela classe
  return list.filter((c) => c.codigo.startsWith(prefix));
}

const SERVICE_RULES = [
  // --- §5º-B, Anexo III FIXO (sem fator R) ---
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, I, LC 123/2006",
    codigos: ["8511-2/00","8513-9/00","8520-1/00","8541-4/00","8542-2/00","8593-7/00","8592-9/02","8592-9/03","8592-9/99","8599-6/02","8599-6/03","8599-6/04","8599-6/05","8599-6/99"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, II, LC 123/2006", codigos: ["5310-5/02"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, III, LC 123/2006", codigos: ["7911-2/00","7912-1/00"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, IV, LC 123/2006", codigos: ["8599-6/01"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, V, LC 123/2006", codigos: ["8299-7/06"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, IX, LC 123/2006",
    codigos: ["2539-0/01","2539-0/02","3321-0/00","9521-5/00"], prefixos: ["3314-7","9529-1"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, XIII, LC 123/2006", codigos: ["4921-3/01","4921-3/02","4923-0/01","4923-0/02","4929-9/01"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, XIV, LC 123/2006", codigos: ["6920-6/01"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 18, §5º-B, XV, LC 123/2006",
    codigos: ["5911-1/01","5911-1/99","5913-8/00","5914-6/00","5920-1/00","9002-7/01","9003-5/00"], prefixos: ["5912-0","9001-9"] },
  { anexo: "III (fixo)", fatorR: false, base: "art. 25, §1º, III, alínea j, Res. CGSN 140/2018 (corretagem de imóveis)", codigos: ["6821-8/01"] },

  // --- §5º-B, incisos sujeitos ao fator R (III se ≥28%, V se <28%) ---
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-B, XVI c/c §5º-M, LC 123/2006 (fisioterapia)", codigos: ["8650-0/04"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-B, XVIII c/c §5º-M, LC 123/2006 (arquitetura)", codigos: ["7111-1/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-B, XIX c/c §5º-M, LC 123/2006 (medicina/enfermagem)", codigos: ["8630-5/01","8630-5/02","8630-5/03","8630-5/99","8650-0/01","8610-1/01","8610-1/02"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-B, XX c/c §5º-M, LC 123/2006 (odontologia e prótese dentária)", codigos: ["8630-5/04","3250-7/06"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-B, XXI c/c §5º-M, LC 123/2006 (psicologia e afins)", codigos: ["8650-0/02","8650-0/03","8650-0/05","8650-0/06","8650-0/07","8690-9/03","8690-9/04","8630-5/06"] },

  // --- §5º-C, Anexo IV ---
  { anexo: "IV", fatorR: false, base: "art. 18, §5º-C, I, LC 123/2006 (construção)",
    codigos: ["4120-4/00","4211-1/01","4212-0/00","4213-8/00","4222-7/01","4222-7/02","4292-8/02","4299-5/99","4311-8/01","4313-4/00","4321-5/00","4322-3/01","4329-1/99","4330-4/01","4330-4/03","4330-4/99","4391-6/00","4399-1/03","8130-3/00","7410-2/02"] },
  { anexo: "IV", fatorR: false, base: "art. 18, §5º-C, VI, LC 123/2006 (vigilância, limpeza ou conservação)",
    codigos: ["8011-1/01","8011-1/02","8012-9/00","8020-0/01","8121-4/00","8122-2/00","8129-0/00","8111-7/00"] },
  { anexo: "IV", fatorR: false, base: "art. 18, §5º-C, VII, LC 123/2006 (advocacia)", codigos: ["6911-7/01"] },

  // --- §5º-D, Anexo III com fator R (III se ≥28%, V se <28%) ---
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, I, LC 123/2006 (administração e locação de imóveis de terceiros)", codigos: ["6822-6/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, II, LC 123/2006 (dança, capoeira, ioga, artes marciais)", codigos: ["8592-9/01","8591-1/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, III, LC 123/2006 (academias de atividades físicas)", codigos: ["9313-1/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, IV, LC 123/2006 (elaboração de programas de computador, no estabelecimento do optante)", codigos: ["6201-5/01","6202-3/00","6203-1/00","6209-1/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, VI, LC 123/2006 (páginas eletrônicas, no estabelecimento do optante)", codigos: ["6201-5/02","6319-4/00"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, IX, LC 123/2006 (montagem de estandes para feiras)", codigos: ["7319-0/01"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, XII, LC 123/2006 (laboratórios de análises clínicas)", codigos: ["8640-2/01","8640-2/02"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, XIII, LC 123/2006 (tomografia, diagnóstico por imagem, ressonância)", codigos: ["8640-2/04","8640-2/05","8640-2/06","8640-2/07","8640-2/08","8640-2/09"] },
  { anexo: "III ou V, conforme o Fator R", fatorR: true, base: "art. 18, §5º-D, XIV, LC 123/2006 (prótese em geral)", codigos: ["3250-7/07"] },

  // --- §5º-I, Anexo V (migra para III se fator R ≥28%) ---
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, II, LC 123/2006 (medicina veterinária)", codigos: ["7500-1/00"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, V, LC 123/2006 (comissaria, despachantes, tradução e interpretação)", codigos: ["5250-8/01","5250-8/02","7490-1/01"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, VI, LC 123/2006 (engenharia, medição, cartografia, topografia, testes, design, agronomia)", codigos: ["7112-0/00","7119-7/01","7119-7/02","7119-7/03","7119-7/99","7120-1/00","7210-0/00","7220-7/00","7410-2/03","7410-2/99","7490-1/03"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, VII, LC 123/2006 (representação comercial e intermediação de negócios)",
    codigos: ["4512-9/01","4530-7/06","4542-1/01","7490-1/04"], prefixos: ["461"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, IX, LC 123/2006 (auditoria, economia, consultoria, gestão, organização e administração)", codigos: ["6920-6/02","7020-4/00","6204-0/00","6621-5/02"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, X, LC 123/2006 (jornalismo e publicidade)", codigos: ["6391-7/00","7311-4/00","7312-2/00","7319-0/02","7319-0/03","7319-0/04","7319-0/99"] },
  { anexo: "V ou III, conforme o Fator R", fatorR: true, base: "art. 18, §5º-I, XI, LC 123/2006 (agenciamento, exceto de mão de obra)", codigos: ["7490-1/05","5232-0/00","5250-8/03"] },
];

// Códigos com conflito identificado entre fontes derivadas — flag explícito
const CONFLITOS = {
  "7410-2/02": "A fonte derivada lista este código tanto no art. 18, §5º-C, I (\"design de interiores\", Anexo IV) quanto no §5º-I, VI (\"design, desenho\", Anexo V/III conforme Fator R). Adotou-se aqui o Anexo IV (design de interiores) por ser a leitura mais literal da descrição do CNAE, mas há divergência entre as fontes — confirme com o contador.",
  "9002-7/01": "A fonte derivada lista este código tanto no §5º-B, XV (Anexo III fixo, produções artísticas/apresentação) quanto no §5º-I, X (jornalismo e publicidade, Anexo V/III). Adotou-se aqui o Anexo III fixo, por ser a leitura mais próxima da descrição do CNAE — confirme com o contador.",
  "8299-7/04": "Contradição identificada nas próprias fontes oficiais: este código consta do Anexo VI (CNAEs impeditivos do Simples Nacional) e, ao mesmo tempo, o art. 18, §5º-I, VIII da LC 123/2006 lista \"perícia, leilão e avaliação\" como atividade do Anexo V. Como o Anexo VI é lista oficial e mais específica, tratou-se aqui como impeditivo — mas essa contradição precisa ser levada ao contador antes de publicar qualquer orientação sobre leiloeiros.",
};

function findServiceRule(codigo) {
  for (const rule of SERVICE_RULES) {
    if (rule.codigos && rule.codigos.includes(codigo)) return rule;
    if (rule.prefixos && rule.prefixos.some((p) => codigo.startsWith(p))) return rule;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 5. Classificação mecânica por seção/divisão (comércio, indústria, construção)
// ---------------------------------------------------------------------------
function divisao(codigo) {
  return codigo.slice(0, 2);
}

function toSentenceCase(str) {
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ---------------------------------------------------------------------------
// 6. Montagem final
// ---------------------------------------------------------------------------
const result = [];
let stats = { manual: 0, impeditivo: 0, ambiguo: 0, servico: 0, comercio: 0, industria: 0, construcao: 0, naoDeterminado: 0 };

for (const c of cnaes) {
  const codigo = c.codigo;

  if (MANUAL_OVERRIDES[codigo]) {
    result.push(MANUAL_OVERRIDES[codigo]);
    stats.manual++;
    continue;
  }

  const descricao = toSentenceCase(c.descricao);
  const fontes = [FONTE_IBGE(c.codigo_numerico)];
  const meiOcupacoes = MEI_MAP.get(codigo);
  const meiFlag = !!meiOcupacoes;
  const meiNota = meiFlag
    ? `Consta no Anexo XI da Resolução CGSN 140/2018 (ocupaç${meiOcupacoes.length > 1 ? "ões" : "ão"}: ${meiOcupacoes.join("; ")}).`
    : "Não consta no Anexo XI da Resolução CGSN 140/2018 (lista oficial de ocupações permitidas ao MEI).";
  if (meiFlag) fontes.push(FONTE_ANEXO_XI);

  let entry;

  if (IMPEDITIVOS.has(codigo)) {
    fontes.push(FONTE_ANEXO_VI, FONTE_LC123);
    entry = {
      codigo, descricao,
      mei: meiFlag, mei_nota: meiNota,
      simples: false,
      simples_nota: "Atividade impeditiva do Simples Nacional — consta na lista oficial de CNAEs impeditivos do Anexo VI da Resolução CGSN 140/2018 (base: art. 17, LC 123/2006). A empresa deve optar por Lucro Presumido ou Lucro Real.",
      anexo: "Não se aplica",
      fator_r: false,
      observacoes: CONFLITOS[codigo] || "Classificação com confiança ALTA (lista oficial do Anexo VI da Res. CGSN 140/2018).",
      fontes,
    };
    stats.impeditivo++;
  } else if (AMBIGUOS.has(codigo)) {
    fontes.push(FONTE_ANEXO_VII, FONTE_LC123);
    entry = {
      codigo, descricao,
      mei: meiFlag, mei_nota: meiNota,
      simples: true,
      simples_nota: "Código ambíguo (Anexo VII da Res. CGSN 140/2018): abrange concomitantemente atividade impeditiva e atividade permitida ao Simples Nacional. O enquadramento depende da atividade efetivamente exercida pela empresa, não apenas do código CNAE.",
      anexo: "Depende da atividade efetiva exercida",
      fator_r: false,
      observacoes: "⚠️ Requer análise individual do objeto social e da atividade efetivamente exercida antes de qualquer orientação ao cliente. Classificação com confiança ALTA quanto à ambiguidade (lista oficial do Anexo VII), mas o enquadramento final depende do caso concreto.",
      fontes,
    };
    stats.ambiguo++;
  } else {
    const rule = findServiceRule(codigo);
    if (rule) {
      fontes.push(FONTE_LC123, FONTE_CGSN140);
      entry = {
        codigo, descricao,
        mei: meiFlag, mei_nota: meiNota,
        simples: true,
        simples_nota: "",
        anexo: rule.anexo,
        fator_r: rule.fatorR,
        observacoes: `Base legal: ${rule.base}. ⚠️ Mapeamento CNAE↔dispositivo legal derivado por correspondência textual (confiança MÉDIA) — ainda não conferido individualmente por profissional contábil.${CONFLITOS[codigo] ? " " + CONFLITOS[codigo] : ""}`,
        fontes,
      };
      stats.servico++;
    } else {
      const d = divisao(codigo);
      fontes.push(FONTE_LC123);
      if (["45", "46", "47"].includes(d)) {
        entry = {
          codigo, descricao,
          mei: meiFlag, mei_nota: meiNota,
          simples: true,
          simples_nota: "",
          anexo: "I",
          fator_r: false,
          observacoes: "Tributação pelo Anexo I por se tratar de revenda de mercadorias (art. 18, §4º, I, LC 123/2006). Classificação mecânica por seção de comércio (confiança MÉDIA) — não conferida individualmente.",
          fontes,
        };
        stats.comercio++;
      } else if (parseInt(d, 10) >= 5 && parseInt(d, 10) <= 33) {
        entry = {
          codigo, descricao,
          mei: meiFlag, mei_nota: meiNota,
          simples: true,
          simples_nota: "",
          anexo: "II",
          fator_r: false,
          observacoes: "Tributação pelo Anexo II por se tratar de venda de mercadorias industrializadas pelo contribuinte (art. 18, §4º, II, LC 123/2006). Classificação mecânica por seção de indústria (confiança MÉDIA) — não conferida individualmente.",
          fontes,
        };
        stats.industria++;
      } else if (["41", "42", "43"].includes(d)) {
        entry = {
          codigo, descricao,
          mei: meiFlag, mei_nota: meiNota,
          simples: true,
          simples_nota: "",
          anexo: "IV",
          fator_r: false,
          observacoes: "Tributação pelo Anexo IV por se tratar de construção de imóveis e obras de engenharia em geral (art. 18, §5º-C, I, LC 123/2006). Classificação mecânica por divisão de construção (confiança MÉDIA-BAIXA) — a lista de CNAEs do §5º-C, I é derivada, não oficial; não conferida individualmente. Atenção: a CPP (INSS patronal) não é recolhida via DAS neste Anexo.",
          fontes,
        };
        stats.construcao++;
      } else {
        entry = {
          codigo, descricao,
          mei: meiFlag, mei_nota: meiNota,
          simples: true,
          simples_nota: "",
          anexo: "Não determinado automaticamente",
          fator_r: false,
          observacoes: "⚠️ Este código não pôde ser classificado automaticamente com confiança suficiente (não consta nas listas oficiais dos Anexos VI/VII, nem nos mapeamentos derivados dos §§5º-B a 5º-I, nem nas seções mecânicas de comércio/indústria/construção). Requer análise contábil individual antes de qualquer publicação.",
          fontes,
        };
        stats.naoDeterminado++;
      }
    }
  }

  result.push(entry);
}

fs.writeFileSync(OUT, JSON.stringify(result, null, 2), "utf8");

console.log("Total de entradas:", result.length);
console.log(stats);
