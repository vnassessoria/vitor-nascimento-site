/* ============================================================
   Consulta CNAE — carregamento, busca e exibição
   Os dados ficam em /data/cnaes.json (arquivo estático, editável
   diretamente ou futuramente migrado para o Supabase).
   ============================================================ */

let _cnaesCache = null;

async function loadCnaes() {
  if (_cnaesCache) return _cnaesCache;
  const res = await fetch("../data/cnaes.json");
  if (!res.ok) throw new Error("Falha ao carregar a base de CNAEs.");
  _cnaesCache = await res.json();
  return _cnaesCache;
}

function normalizeCnaeText(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function searchCnaes(list, term) {
  const normalizedTerm = normalizeCnaeText(term);
  const digitsOnly = term.replace(/\D/g, "");
  return list.filter((item) => {
    if (digitsOnly && item.codigo.replace(/\D/g, "").includes(digitsOnly)) return true;
    return (
      normalizeCnaeText(item.descricao).includes(normalizedTerm) ||
      normalizeCnaeText(item.codigo).includes(normalizedTerm)
    );
  });
}

function renderCnaeDetail(item) {
  const badge = (label, value, tone) => `
    <div class="cnae-badge cnae-badge--${tone}">
      <span class="cnae-badge__label">${label}</span>
      <span class="cnae-badge__value">${value}</span>
    </div>`;

  const anexoIndefinido = item.anexo === "Não determinado automaticamente" || item.anexo === "Depende da atividade efetiva exercida";
  const anexoValue = item.simples ? item.anexo || "—" : "Não se aplica";
  const fatorRValue = !item.simples ? "Não se aplica" : anexoIndefinido ? "A definir" : (item.fator_r ? "Sim" : "Não");

  const badgesHtml = [
    badge("Permite MEI", item.mei ? "Sim" : "Não", item.mei ? "yes" : "no"),
    badge("Permite Simples Nacional", item.simples ? "Sim" : "Não", item.simples ? "yes" : "no"),
    badge("Anexo do Simples", escapeHtml(anexoValue), !item.simples ? "no" : anexoIndefinido ? "neutral" : "neutral"),
    badge("Sujeito ao Fator R", fatorRValue, item.simples && item.fator_r === true && !anexoIndefinido ? "yes" : "no"),
  ].join("");

  const meiNote = item.mei_nota ? `<p class="cnae-badge__note">${escapeHtml(item.mei_nota)}</p>` : "";
  const simplesNote = item.simples_nota ? `<p class="cnae-badge__note">${escapeHtml(item.simples_nota)}</p>` : "";

  return `
    <div class="cnae-badges">${badgesHtml}</div>
    ${meiNote}
    ${simplesNote}

    ${item.observacoes ? `<div class="cnae-note"><h3>Observações</h3><p>${escapeHtml(item.observacoes)}</p></div>` : ""}

    <div class="cnae-disclaimer">
      <p>Essas informações são uma orientação geral com base na atividade principal do CNAE. A classificação tributária definitiva pode depender de fatores específicos do seu negócio (atividades secundárias, faturamento, folha de pagamento, legislação municipal e estadual). Fale com a gente para uma análise personalizada.</p>
      <a href="#" class="btn btn--gold btn--sm" data-contact="whatsapp-link" target="_blank" rel="noopener">Falar no WhatsApp</a>
    </div>
  `;
}
