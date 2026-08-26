const fs = require("fs");
const path = require("path");
const dir = __dirname;
const CNAES_PATH = path.join(dir, "..", "cnaes.json");

const data = JSON.parse(fs.readFileSync(CNAES_PATH, "utf8"));
const tabela = JSON.parse(fs.readFileSync(path.join(dir, "contabilizei-tabela.json"), "utf8"));

const FONTE_CONTABILIZEI_TABELA = "https://www.contabilizei.com.br/contabilidade-online/cnae/";

// Agrupar linhas da tabela por código numérico (um código pode ter 2 linhas: III/V por fator R)
const byCode = new Map();
for (const row of tabela) {
  const [codigoNum, , anexo, fatorR] = row;
  if (!byCode.has(codigoNum)) byCode.set(codigoNum, []);
  byCode.get(codigoNum).push({ anexo, fatorR: fatorR === "Sim" });
}

const ANEXO_ROMANO = { I: "I", II: "II", III: "III", IV: "IV", V: "V" };

let aplicados = 0;

for (const item of data) {
  if (item.anexo !== "Não determinado automaticamente" && item.anexo !== "Depende da atividade efetiva exercida") continue;
  const numCode = item.codigo.replace(/\D/g, "");
  const rows = byCode.get(numCode);
  if (!rows) continue;

  const eraAmbiguo = item.anexo === "Depende da atividade efetiva exercida";
  let anexoValue, fatorR;

  if (rows.length === 1) {
    anexoValue = ANEXO_ROMANO[rows[0].anexo] || rows[0].anexo;
    fatorR = rows[0].fatorR;
  } else {
    // Duas linhas (ex.: III e V) => atividade sujeita ao fator R migrando entre os dois anexos
    const anexos = [...new Set(rows.map((r) => r.anexo))];
    anexoValue = `${anexos[0]} ou ${anexos[1]}, conforme o Fator R`;
    fatorR = true;
  }

  item.anexo = anexoValue;
  item.fator_r = fatorR;
  item.simples = true;

  const baseObs = `Classificação baseada em fonte secundária — Tabela CNAE do Contabilizei (${FONTE_CONTABILIZEI_TABELA}, atualizada em 06/02/2026), não é lista oficial. Precisa de confirmação contábil antes de publicar.`;
  item.observacoes = eraAmbiguo
    ? `⚠️ Código ambíguo no Anexo VII da Res. CGSN 140/2018 (abrange atividade impeditiva e permitida ao Simples, dependendo do que a empresa efetivamente faz). ${baseObs} O enquadramento acima reflete o tratamento-padrão dado pelo Contabilizei para este código, mas confirme a atividade efetiva antes de aplicar.`
    : baseObs;

  if (!item.fontes.includes(FONTE_CONTABILIZEI_TABELA)) item.fontes.push(FONTE_CONTABILIZEI_TABELA);

  aplicados++;
}

fs.writeFileSync(CNAES_PATH, JSON.stringify(data, null, 2), "utf8");
console.log("Aplicados via tabela bulk do Contabilizei:", aplicados);

const restantes = data.filter((d) => d.anexo === "Não determinado automaticamente" || d.anexo === "Depende da atividade efetiva exercida");
console.log("Ainda restando:", restantes.length);
fs.writeFileSync(path.join(dir, "faltando.json"), JSON.stringify(restantes.map((d) => ({ codigo: d.codigo, descricao: d.descricao, tipo: d.anexo })), null, 2), "utf8");
