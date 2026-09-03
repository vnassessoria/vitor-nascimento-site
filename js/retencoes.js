/* ============================================================
   Consulta Retenções — carregamento, busca e exibição
   Os dados ficam em /data/retencoes.json (arquivo estático, editável
   diretamente ou futuramente migrado para o Supabase).
   Base: lista de serviços anexa à LC 116/2003.
   ============================================================ */

let _retencoesCache = null;

async function loadRetencoes() {
  if (_retencoesCache) return _retencoesCache;
  const res = await fetch("../data/retencoes.json");
  if (!res.ok) throw new Error("Falha ao carregar a base de Retenções.");
  _retencoesCache = await res.json();
  return _retencoesCache;
}

function normalizeRetencaoText(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function searchRetencoes(list, term) {
  const normalizedTerm = normalizeRetencaoText(term);
  return list.filter((item) => {
    if (item.item.toLowerCase().includes(term.toLowerCase())) return true;
    return (
      normalizeRetencaoText(item.descricao).includes(normalizedTerm) ||
      normalizeRetencaoText(item.item).includes(normalizedTerm)
    );
  });
}

function renderRetencaoDetail(item) {
  const badge = (label, value, tone, wide) => `
    <div class="retencao-badge retencao-badge--${tone}${wide ? " retencao-badge--wide" : ""}">
      <span class="retencao-badge__label">${label}</span>
      <span class="retencao-badge__value">${value}</span>
    </div>`;

  const retencaoValue = (sim, aliquota) => (sim ? `Sim${aliquota ? ` (${aliquota})` : ""}` : "Não");

  const badgesHtml = [
    badge("Retenção de IRRF", retencaoValue(item.irrf, item.irrf_aliquota), "neutral"),
    badge("Retenção de CSRF (PIS/COFINS/CSLL)", retencaoValue(item.csrf, item.csrf_aliquota), "neutral"),
    badge("Retenção de INSS", retencaoValue(item.inss, item.inss_aliquota), "neutral"),
    badge("Responsável pela retenção do ISS", escapeHtml(item.iss_responsavel || "—"), "neutral"),
    badge("Local onde o ISS é devido", escapeHtml(item.iss_local_devido || "—"), "neutral", true),
  ].join("");

  const irrfNote = item.irrf_nota ? `<p class="retencao-badge__note">${escapeHtml(item.irrf_nota)}</p>` : "";
  const csrfNote = item.csrf_nota ? `<p class="retencao-badge__note">${escapeHtml(item.csrf_nota)}</p>` : "";
  const inssNote = item.inss_nota ? `<p class="retencao-badge__note">${escapeHtml(item.inss_nota)}</p>` : "";
  const issNote = item.iss_local_nota ? `<p class="retencao-badge__note">${escapeHtml(item.iss_local_nota)}</p>` : "";

  return `
    <div class="retencao-badges">${badgesHtml}</div>
    ${irrfNote}
    ${csrfNote}
    ${inssNote}
    ${issNote}

    ${item.observacoes ? `<div class="retencao-note${precisaRevisao(item.observacoes) ? " retencao-note--warning" : ""}"><h3>Observações</h3><p>${escapeHtml(item.observacoes)}</p></div>` : ""}

    ${renderFontes(item.fontes)}

    <div class="retencao-disclaimer">
      <p>Essas informações são uma orientação geral com base no item da lista de serviços da LC 116/2003. A responsabilidade pela retenção do ISS varia conforme a legislação de cada município, e a definição final pode depender de fatores específicos do seu negócio. Fale com a gente para uma análise personalizada.</p>
      <a href="#" class="btn btn--gold btn--sm" data-contact="whatsapp-link" target="_blank" rel="noopener">Falar no WhatsApp</a>
    </div>
  `;
}
