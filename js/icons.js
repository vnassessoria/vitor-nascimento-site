/* Biblioteca de ícones compartilhada entre o site público e o painel
   administrativo. Cada chave corresponde ao "icon_key" salvo no banco
   de dados para cada serviço. */
const ICONS = {
  building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  "x-circle": '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
  "shield-check": '<path d="M12 2 3 6v6c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  grid: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  bars: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/>',
  "doc-check": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
  "doc-lines": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
  home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
};

const ICON_LABELS = {
  building: "Prédio (abertura/empresa)",
  edit: "Caneta (alteração/edição)",
  "x-circle": "X circulado (baixa/encerramento)",
  "shield-check": "Escudo com check (certidão/segurança)",
  lock: "Cadeado (certificado digital)",
  grid: "Grade (contabilidade)",
  users: "Pessoas (folha de pagamento)",
  chart: "Gráfico (tributário/IR)",
  bars: "Barras (cálculo/revisão)",
  "doc-check": "Documento com check (parecer)",
  "doc-lines": "Documento com linhas (declarações)",
  home: "Casa (financiamento habitacional)",
};

function iconSvg(key) {
  return `<svg viewBox="0 0 24 24">${ICONS[key] || ICONS.building}</svg>`;
}
