/* ============================================================
   Calculadora de 13º Salário (CLT)
   Reaproveita as funções de INSS/IRRF de calculadora-salario.js
   (mesma tabela progressiva, tratando o 13º como um pagamento
   tributado isoladamente do salário do mês — tributação exclusiva
   na fonte, IN RFB nº 1.500/2014, art. 12).

   Regras específicas do 13º:
   - Valor integral = salário bruto x (meses trabalhados / 12), com
     fração igual ou superior a 15 dias contando como mês completo.
   - 1ª parcela (adiantamento, até 30/11): 50% do valor integral, sem
     nenhum desconto de INSS ou IRRF.
   - 2ª parcela (até 20/12): os 50% restantes, com o desconto de INSS
     e IRRF calculados sobre o valor INTEGRAL do 13º (não apenas
     sobre a 2ª parcela), descontados de uma só vez nela.
   - O redutor da Lei nº 15.270/2025 e o desconto simplificado mensal
     se aplicam ao 13º normalmente, cada um com sua própria base
     isolada (independente do salário do mês).
   ============================================================ */

function calcularDecimoTerceiro({ bruto, mesesTrabalhados = 12, dependentes = 0, pensaoAlimenticia = 0 }) {
  const integral = bruto * (mesesTrabalhados / 12);
  const primeiraParcela = integral / 2;
  const segundaParcelaBruta = integral / 2;

  const inssDetalhe = calcularINSSDetalhado(integral);
  const inss = inssDetalhe.total;

  const deducaoDependentes = dependentes * IRRF_DEDUCAO_DEPENDENTE;
  const deducaoPadrao = inss + deducaoDependentes + pensaoAlimenticia;
  const usaSimplificado = IRRF_DESCONTO_SIMPLIFICADO > deducaoPadrao;
  const deducaoUsada = Math.max(deducaoPadrao, IRRF_DESCONTO_SIMPLIFICADO);
  const baseIR = Math.max(0, integral - deducaoUsada);
  const irrfFaixa = encontrarFaixaIRRF(baseIR);
  const isentoPorLei15270 = integral <= IRRF_ISENCAO_2026;

  let irrf;
  let redutorAplicado = 0;
  if (isentoPorLei15270) {
    irrf = 0;
  } else {
    const impostoProvisorio = calcularIRRFTabela(baseIR);
    redutorAplicado = Math.min(calcularRedutorLei15270(integral), impostoProvisorio);
    irrf = Math.max(0, impostoProvisorio - redutorAplicado);
  }

  const segundaParcelaLiquida = segundaParcelaBruta - inss - irrf - pensaoAlimenticia;
  const liquido = primeiraParcela + segundaParcelaLiquida;
  const fgts = integral * 0.08;

  return {
    integral,
    primeiraParcela,
    segundaParcelaBruta,
    segundaParcelaLiquida,
    inss,
    inssFaixas: inssDetalhe.faixas,
    inssAliquotaMarginal: inssDetalhe.aliquotaMarginal,
    inssAliquotaEfetiva: integral > 0 ? inss / integral : 0,
    deducaoDependentes,
    deducaoPadrao,
    usaSimplificado,
    deducaoUsada,
    baseIR,
    irrfFaixaAliquota: irrfFaixa.aliquota,
    irrfFaixaDeducao: irrfFaixa.deducao,
    isentoPorLei15270,
    redutorAplicado,
    irrf,
    irrfAliquotaEfetiva: integral > 0 ? irrf / integral : 0,
    pensaoAlimenticia,
    liquido,
    fgts,
  };
}
