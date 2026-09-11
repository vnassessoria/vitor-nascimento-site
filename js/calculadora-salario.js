/* ============================================================
   Calculadora de Salário Líquido (CLT)
   Tabelas vigentes a partir de janeiro/2026:
   - INSS: Portaria Interministerial MPS/MF nº 13/2026
   - IRRF: tabela progressiva (Lei 11.482/2007, valores vigentes desde
     05/2023) + redutor da Lei nº 15.270/2025 (isenção até R$5.000 e
     desconto parcial até R$7.350, calculado sobre o rendimento bruto
     tributável, antes das deduções).
   ============================================================ */

const INSS_FAIXAS_2026 = [
  { ate: 1621.00, aliquota: 0.075 },
  { ate: 2902.84, aliquota: 0.09 },
  { ate: 4354.27, aliquota: 0.12 },
  { ate: 8475.55, aliquota: 0.14 },
];
const INSS_TETO_2026 = 8475.55;

const IRRF_FAIXAS_2026 = [
  { ate: 2428.80, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 182.16 },
  { ate: 3751.05, aliquota: 0.15, deducao: 394.16 },
  { ate: 4664.68, aliquota: 0.225, deducao: 675.49 },
  { ate: Infinity, aliquota: 0.275, deducao: 908.73 },
];

const IRRF_DEDUCAO_DEPENDENTE = 189.59;
const IRRF_DESCONTO_SIMPLIFICADO = 607.20;
const IRRF_ISENCAO_2026 = 5000.00;
const IRRF_REDUTOR_LIMITE_2026 = 7350.00;

function calcularINSS(bruto) {
  const baseCalculo = Math.min(bruto, INSS_TETO_2026);
  let inss = 0;
  let anterior = 0;
  for (const faixa of INSS_FAIXAS_2026) {
    if (baseCalculo <= anterior) break;
    const valorFaixa = Math.min(baseCalculo, faixa.ate) - anterior;
    inss += valorFaixa * faixa.aliquota;
    anterior = faixa.ate;
  }
  return inss;
}

function calcularIRRFTabela(base) {
  for (const faixa of IRRF_FAIXAS_2026) {
    if (base <= faixa.ate) {
      return Math.max(0, base * faixa.aliquota - faixa.deducao);
    }
  }
  return 0;
}

function calcularRedutorLei15270(brutoTributavel) {
  if (brutoTributavel <= IRRF_ISENCAO_2026) return Infinity;
  if (brutoTributavel > IRRF_REDUTOR_LIMITE_2026) return 0;
  return Math.max(0, 978.62 - 0.133145 * brutoTributavel);
}

function calcularSalarioLiquido({ bruto, dependentes = 0, pensaoAlimenticia = 0, outrosDescontos = 0 }) {
  const inss = calcularINSS(bruto);
  const deducaoDependentes = dependentes * IRRF_DEDUCAO_DEPENDENTE;
  const deducaoPadrao = inss + deducaoDependentes + pensaoAlimenticia;
  const usaSimplificado = IRRF_DESCONTO_SIMPLIFICADO > deducaoPadrao;
  const deducaoUsada = Math.max(deducaoPadrao, IRRF_DESCONTO_SIMPLIFICADO);
  const baseIR = Math.max(0, bruto - deducaoUsada);

  let irrf;
  if (bruto <= IRRF_ISENCAO_2026) {
    irrf = 0;
  } else {
    const impostoProvisorio = calcularIRRFTabela(baseIR);
    const redutor = calcularRedutorLei15270(bruto);
    irrf = Math.max(0, impostoProvisorio - redutor);
  }

  const liquido = bruto - inss - irrf - pensaoAlimenticia - outrosDescontos;
  const fgts = bruto * 0.08;

  return {
    bruto,
    inss,
    deducaoDependentes,
    deducaoPadrao,
    usaSimplificado,
    deducaoUsada,
    baseIR,
    irrf,
    pensaoAlimenticia,
    outrosDescontos,
    liquido,
    fgts,
  };
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
