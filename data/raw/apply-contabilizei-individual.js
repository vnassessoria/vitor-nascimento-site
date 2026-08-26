const fs = require("fs");
const path = require("path");
const dir = __dirname;
const CNAES_PATH = path.join(dir, "..", "cnaes.json");

const data = JSON.parse(fs.readFileSync(CNAES_PATH, "utf8"));
const byCodigo = new Map(data.map((d) => [d.codigo, d]));

const results = [];
for (let i = 0; i < 5; i++) {
  const chunk = JSON.parse(fs.readFileSync(path.join(dir, `result-${i}.json`), "utf8"));
  results.push(...chunk);
}
console.log("Total de resultados carregados:", results.length);

const FONTE_CONTABILIZEI_CONSULTA = "https://www.contabilizei.com.br/consulta-cnae/";

let aplicados = 0, comErro = 0, naoEncontrados = [];

for (const r of results) {
  const item = byCodigo.get(r.codigo);
  if (!item) { naoEncontrados.push(r.codigo); continue; }

  const eraAmbiguo = item.anexo === "Depende da atividade efetiva exercida";

  if (r.erro) {
    comErro++;
    item.observacoes = `⚠️ Não foi possível determinar a classificação automaticamente, nem via regras da LC 123/2006, nem via Contabilizei (erro na pesquisa: ${r.erro}). Requer análise contábil individual.`;
    continue;
  }

  if (r.simples === false) {
    item.simples = false;
    item.anexo = "Não se aplica";
    item.fator_r = false;
    item.simples_nota = "Segundo a consulta individual de CNAE do Contabilizei, esta atividade não está incluída no Simples Nacional.";
    item.observacoes = `⚠️ Fonte secundária (Contabilizei, consulta individual de CNAE) indica que esta atividade NÃO está incluída no Simples Nacional — mas este código não consta nas listas oficiais de impeditivos (Anexo VI/VII da Res. CGSN 140/2018) nem nos dispositivos mapeados da LC 123/2006. Essa divergência precisa ser confirmada com o contador antes de qualquer publicação.`;
  } else {
    item.simples = true;
    item.anexo = r.anexo || item.anexo;
    item.fator_r = !!r.fator_r;
    const baseObs = `Classificação baseada em fonte secundária — consulta individual de CNAE do Contabilizei (${FONTE_CONTABILIZEI_CONSULTA}), não é lista oficial.${r.aliquota ? ` Alíquota informada: ${r.aliquota}.` : ""} Precisa de confirmação contábil antes de publicar.`;
    item.observacoes = eraAmbiguo
      ? `⚠️ Código ambíguo no Anexo VII da Res. CGSN 140/2018 (abrange atividade impeditiva e permitida ao Simples, dependendo do que a empresa efetivamente faz). ${baseObs} O enquadramento acima reflete o tratamento-padrão dado pelo Contabilizei para este código, mas confirme a atividade efetiva antes de aplicar.`
      : baseObs;
  }

  if (typeof r.mei === "boolean" && item.mei !== r.mei) {
    // A base MEI oficial (Anexo XI) já foi aplicada antes; só complementamos se a base oficial não tinha dado nenhuma info
    // (item.mei já vem calculado do Anexo XI oficial — não sobrescrever com a info do Contabilizei, que é menos confiável para MEI)
  }

  if (!item.fontes.includes(FONTE_CONTABILIZEI_CONSULTA)) item.fontes.push(FONTE_CONTABILIZEI_CONSULTA);

  aplicados++;
}

fs.writeFileSync(CNAES_PATH, JSON.stringify(data, null, 2), "utf8");
console.log("Aplicados:", aplicados, "| Com erro (mantidos como não determinado):", comErro, "| Não encontrados no dataset:", naoEncontrados.length);
if (naoEncontrados.length) console.log(naoEncontrados);

const restantes = data.filter((d) => d.anexo === "Não determinado automaticamente" || d.anexo === "Depende da atividade efetiva exercida");
console.log("Códigos ainda sem classificação:", restantes.length);
