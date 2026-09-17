/* ============================================================
   Calculadora de Férias (CLT)
   Reaproveita as funções de INSS/IRRF de calculadora-salario.js
   (mesma tabela progressiva, tratando o valor de férias como um
   pagamento tributado isoladamente, à parte do salário do mês,
   conforme permite a IN RFB nº 1.500/2014, art. 12).

   Regras específicas de férias:
   - Férias gozadas + 1/3 constitucional: sofrem INSS e IRRF.
   - Abono pecuniário (venda de até 10 dias, art. 143 da CLT): isento
     de INSS e de IRRF.
   - 1/3 constitucional sobre o abono pecuniário: isento de INSS, mas
     sujeito a IRRF (Solução de Consulta COSIT nº 209/2021).
   - FGTS (informativo) incide sobre férias gozadas + 1/3, mas não
     sobre o abono pecuniário nem seu terço (natureza indenizatória).
   ============================================================ */

function calcularFerias({ bruto, diasGozados, diasVendidos = 0, dependentes = 0, pensaoAlimenticia = 0 }) {
  const valorDiario = bruto / 30;
  const feriasGozadas = valorDiario * diasGozados;
  const tercoGozadas = feriasGozadas / 3;
  const abono = valorDiario * diasVendidos;
  const tercoAbono = abono / 3;

  const baseINSS = feriasGozadas + tercoGozadas;
  const inssDetalhe = calcularINSSDetalhado(baseINSS);
  const inss = inssDetalhe.total;

  const baseIRRFBruta = feriasGozadas + tercoGozadas + tercoAbono;
  const deducaoDependentes = dependentes * IRRF_DEDUCAO_DEPENDENTE;
  const deducaoPadrao = inss + deducaoDependentes + pensaoAlimenticia;
  const usaSimplificado = IRRF_DESCONTO_SIMPLIFICADO > deducaoPadrao;
  const deducaoUsada = Math.max(deducaoPadrao, IRRF_DESCONTO_SIMPLIFICADO);
  const baseIR = Math.max(0, baseIRRFBruta - deducaoUsada);
  const irrfFaixa = encontrarFaixaIRRF(baseIR);
  const isentoPorLei15270 = baseIRRFBruta <= IRRF_ISENCAO_2026;

  let irrf;
  let redutorAplicado = 0;
  if (isentoPorLei15270) {
    irrf = 0;
  } else {
    const impostoProvisorio = calcularIRRFTabela(baseIR);
    redutorAplicado = Math.min(calcularRedutorLei15270(baseIRRFBruta), impostoProvisorio);
    irrf = Math.max(0, impostoProvisorio - redutorAplicado);
  }

  const liquido = feriasGozadas + tercoGozadas + abono + tercoAbono - inss - irrf - pensaoAlimenticia;
  const fgts = (feriasGozadas + tercoGozadas) * 0.08;

  return {
    valorDiario,
    feriasGozadas,
    tercoGozadas,
    abono,
    tercoAbono,
    baseINSS,
    inss,
    inssFaixas: inssDetalhe.faixas,
    inssAliquotaMarginal: inssDetalhe.aliquotaMarginal,
    inssAliquotaEfetiva: baseINSS > 0 ? inss / baseINSS : 0,
    baseIRRFBruta,
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
    irrfAliquotaEfetiva: baseIRRFBruta > 0 ? irrf / baseIRRFBruta : 0,
    pensaoAlimenticia,
    liquido,
    fgts,
  };
}
