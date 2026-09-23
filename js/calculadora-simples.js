/* ============================================================
   Calculadora do Simples Nacional (modelo atual, LC 123/2006,
   redação dada pela LC 155/2016 — Anexos I a V).

   Fórmula da alíquota efetiva (art. 18, § 1º-A):
     Aliq. efetiva = (RBT12 x Aliq. nominal da faixa - Parcela a deduzir) / RBT12

   Repartição dos tributos (art. 18, §§ 1º a 3º-A): o valor do DAS do
   mês é dividido entre os tributos pelos percentuais da FAIXA em que
   a RBT12 se encontra (não é uma partilha por faixa acumulada).

   Limite de 5% para ISS/ICMS (art. 18, § 17): quando o percentual
   efetivo do ISS (ou do ICMS) sobre a receita do mês superar 5%, o
   excedente é redistribuído proporcionalmente entre os tributos
   federais da mesma faixa.

   Não cobre: sublimites estaduais de ICMS/ISS para RBT12 acima de
   R$3.600.000,00, nem a incidência simultânea de mais de uma
   atividade (receitas mistas).
   ============================================================ */

const SIMPLES_TABELAS = {
  I: {
    nome: "Anexo I — Comércio",
    faixas: [
      { ate: 180000, aliquota: 0.04, deducao: 0, partilha: { irpj: 5.5, csll: 3.5, cofins: 12.74, pis: 2.76, cpp: 41.5, icms: 34.0 } },
      { ate: 360000, aliquota: 0.073, deducao: 5940, partilha: { irpj: 5.5, csll: 3.5, cofins: 12.74, pis: 2.76, cpp: 41.5, icms: 34.0 } },
      { ate: 720000, aliquota: 0.095, deducao: 13860, partilha: { irpj: 5.5, csll: 3.5, cofins: 12.74, pis: 2.76, cpp: 42.0, icms: 33.5 } },
      { ate: 1800000, aliquota: 0.107, deducao: 22500, partilha: { irpj: 5.5, csll: 3.5, cofins: 12.74, pis: 2.76, cpp: 42.0, icms: 33.5 } },
      { ate: 3600000, aliquota: 0.143, deducao: 87300, partilha: { irpj: 5.5, csll: 3.5, cofins: 12.74, pis: 2.76, cpp: 42.0, icms: 33.5 } },
      { ate: 4800000, aliquota: 0.19, deducao: 378000, partilha: { irpj: 13.5, csll: 10.0, cofins: 28.27, pis: 6.13, cpp: 42.1 } },
    ],
  },
  II: {
    nome: "Anexo II — Indústria",
    faixas: [
      { ate: 180000, aliquota: 0.045, deducao: 0, partilha: { irpj: 5.5, csll: 3.5, cofins: 11.51, pis: 2.49, cpp: 37.5, ipi: 7.5, icms: 32.0 } },
      { ate: 360000, aliquota: 0.078, deducao: 5940, partilha: { irpj: 5.5, csll: 3.5, cofins: 11.51, pis: 2.49, cpp: 37.5, ipi: 7.5, icms: 32.0 } },
      { ate: 720000, aliquota: 0.10, deducao: 13860, partilha: { irpj: 5.5, csll: 3.5, cofins: 11.51, pis: 2.49, cpp: 37.5, ipi: 7.5, icms: 32.0 } },
      { ate: 1800000, aliquota: 0.112, deducao: 22500, partilha: { irpj: 5.5, csll: 3.5, cofins: 11.51, pis: 2.49, cpp: 37.5, ipi: 7.5, icms: 32.0 } },
      { ate: 3600000, aliquota: 0.147, deducao: 85500, partilha: { irpj: 5.5, csll: 3.5, cofins: 11.51, pis: 2.49, cpp: 37.5, ipi: 7.5, icms: 32.0 } },
      { ate: 4800000, aliquota: 0.30, deducao: 720000, partilha: { irpj: 8.5, csll: 7.5, cofins: 20.96, pis: 4.54, cpp: 23.5, ipi: 35.0 } },
    ],
  },
  III: {
    nome: "Anexo III — Serviços",
    faixas: [
      { ate: 180000, aliquota: 0.06, deducao: 0, partilha: { irpj: 4.0, csll: 3.5, cofins: 12.82, pis: 2.78, cpp: 43.4, iss: 33.5 } },
      { ate: 360000, aliquota: 0.112, deducao: 9360, partilha: { irpj: 4.0, csll: 3.5, cofins: 14.05, pis: 3.05, cpp: 43.4, iss: 32.0 } },
      { ate: 720000, aliquota: 0.135, deducao: 17640, partilha: { irpj: 4.0, csll: 3.5, cofins: 13.64, pis: 2.96, cpp: 43.4, iss: 32.5 } },
      { ate: 1800000, aliquota: 0.16, deducao: 35640, partilha: { irpj: 4.0, csll: 3.5, cofins: 13.64, pis: 2.96, cpp: 43.4, iss: 32.5 } },
      { ate: 3600000, aliquota: 0.21, deducao: 125640, partilha: { irpj: 4.0, csll: 3.5, cofins: 12.82, pis: 2.78, cpp: 43.4, iss: 33.5 } },
      { ate: 4800000, aliquota: 0.33, deducao: 648000, partilha: { irpj: 35.0, csll: 15.0, cofins: 16.03, pis: 3.47, cpp: 30.5 } },
    ],
  },
  IV: {
    nome: "Anexo IV — Serviços (sem CPP no DAS)",
    faixas: [
      { ate: 180000, aliquota: 0.045, deducao: 0, partilha: { irpj: 18.8, csll: 15.2, cofins: 17.67, pis: 3.83, iss: 44.5 } },
      { ate: 360000, aliquota: 0.09, deducao: 8100, partilha: { irpj: 19.8, csll: 15.2, cofins: 20.55, pis: 4.45, iss: 40.0 } },
      { ate: 720000, aliquota: 0.102, deducao: 12420, partilha: { irpj: 20.8, csll: 15.2, cofins: 19.73, pis: 4.27, iss: 40.0 } },
      { ate: 1800000, aliquota: 0.14, deducao: 39780, partilha: { irpj: 17.8, csll: 19.2, cofins: 18.90, pis: 4.10, iss: 40.0 } },
      { ate: 3600000, aliquota: 0.22, deducao: 183780, partilha: { irpj: 18.8, csll: 19.2, cofins: 18.08, pis: 3.92, iss: 40.0 } },
      { ate: 4800000, aliquota: 0.33, deducao: 828000, partilha: { irpj: 53.5, csll: 21.5, cofins: 20.55, pis: 4.45 } },
    ],
  },
  V: {
    nome: "Anexo V — Serviços",
    faixas: [
      { ate: 180000, aliquota: 0.155, deducao: 0, partilha: { irpj: 25.0, csll: 15.0, cofins: 14.10, pis: 3.05, cpp: 28.85, iss: 14.0 } },
      { ate: 360000, aliquota: 0.18, deducao: 4500, partilha: { irpj: 23.0, csll: 15.0, cofins: 14.10, pis: 3.05, cpp: 27.85, iss: 17.0 } },
      { ate: 720000, aliquota: 0.195, deducao: 9900, partilha: { irpj: 24.0, csll: 15.0, cofins: 14.92, pis: 3.23, cpp: 23.85, iss: 19.0 } },
      { ate: 1800000, aliquota: 0.205, deducao: 17100, partilha: { irpj: 21.0, csll: 15.0, cofins: 15.74, pis: 3.41, cpp: 23.85, iss: 21.0 } },
      { ate: 3600000, aliquota: 0.23, deducao: 62100, partilha: { irpj: 23.0, csll: 12.5, cofins: 14.10, pis: 3.05, cpp: 23.85, iss: 23.5 } },
      { ate: 4800000, aliquota: 0.305, deducao: 540000, partilha: { irpj: 35.0, csll: 15.5, cofins: 16.44, pis: 3.56, cpp: 29.5 } },
    ],
  },
};

const SIMPLES_TRIBUTO_SUBNACIONAL = { I: "icms", II: "icms", III: "iss", IV: "iss", V: "iss" };

const SIMPLES_TRIBUTO_LABEL = {
  irpj: "IRPJ",
  csll: "CSLL",
  cofins: "COFINS",
  pis: "PIS/Pasep",
  cpp: "CPP (INSS patronal)",
  icms: "ICMS",
  iss: "ISS",
  ipi: "IPI",
};

function encontrarFaixaSimples(anexo, rbt12) {
  const faixas = SIMPLES_TABELAS[anexo].faixas;
  for (const faixa of faixas) {
    if (rbt12 <= faixa.ate) return faixa;
  }
  return faixas[faixas.length - 1];
}

function calcularSimplesNacional({ anexo, rbt12, faturamentoMes, issRetido = false }) {
  const faixa = encontrarFaixaSimples(anexo, rbt12);
  const aliquotaEfetiva = rbt12 > 0 ? Math.max(0, (rbt12 * faixa.aliquota - faixa.deducao) / rbt12) : faixa.aliquota;
  const dasCompleto = faturamentoMes * aliquotaEfetiva;

  const valores = {};
  Object.keys(faixa.partilha).forEach((tributo) => {
    valores[tributo] = dasCompleto * (faixa.partilha[tributo] / 100);
  });

  const capKey = SIMPLES_TRIBUTO_SUBNACIONAL[anexo];
  const temIss = capKey === "iss" && faixa.partilha.iss !== undefined;

  // Retenção na fonte / substituição tributária do ISS (art. 21, § 4º, da LC 123/2006):
  // o ISS sai INTEIRAMENTE do DAS (sem o limite de 5% com redistribuição, que só vale
  // para o ISS recolhido dentro do próprio DAS). O tomador retém, no máximo, 5% da
  // receita; se o percentual efetivo do ISS for maior que isso, a diferença não é
  // cobrada por ninguém.
  if (issRetido && temIss) {
    const valorIssExcluidoDoDAS = valores.iss;
    delete valores.iss;
    const dasMensal = dasCompleto - valorIssExcluidoDoDAS;
    const percentualEfetivoIss = aliquotaEfetiva * (faixa.partilha.iss / 100);
    const valorRetidoPeloTomador = faturamentoMes * Math.min(percentualEfetivoIss, 0.05);

    return {
      anexo,
      anexoNome: SIMPLES_TABELAS[anexo].nome,
      rbt12,
      faturamentoMes,
      faixaAliquota: faixa.aliquota,
      faixaDeducao: faixa.deducao,
      aliquotaEfetiva,
      dasMensal,
      partilha: faixa.partilha,
      valores,
      capKey,
      limiteAplicado: false,
      valorExcedente: 0,
      issRetido: true,
      valorIssExcluidoDoDAS,
      valorRetidoPeloTomador,
    };
  }

  let limiteAplicado = false;
  let valorExcedente = 0;
  if (faixa.partilha[capKey] !== undefined) {
    const percentualEfetivoSubnacional = aliquotaEfetiva * (faixa.partilha[capKey] / 100);
    if (percentualEfetivoSubnacional > 0.05) {
      const valorLimitado = faturamentoMes * 0.05;
      valorExcedente = valores[capKey] - valorLimitado;
      valores[capKey] = valorLimitado;
      limiteAplicado = true;

      const outrosKeys = Object.keys(faixa.partilha).filter((k) => k !== capKey);
      const somaOutros = outrosKeys.reduce((soma, k) => soma + faixa.partilha[k], 0);
      outrosKeys.forEach((k) => {
        valores[k] += valorExcedente * (faixa.partilha[k] / somaOutros);
      });
    }
  }

  return {
    anexo,
    anexoNome: SIMPLES_TABELAS[anexo].nome,
    rbt12,
    faturamentoMes,
    faixaAliquota: faixa.aliquota,
    faixaDeducao: faixa.deducao,
    aliquotaEfetiva,
    dasMensal: dasCompleto,
    partilha: faixa.partilha,
    valores,
    capKey,
    limiteAplicado,
    valorExcedente,
    issRetido: false,
  };
}

function calcularFatorR(folha12, rbt12) {
  if (rbt12 <= 0) return 0;
  return folha12 / rbt12;
}
