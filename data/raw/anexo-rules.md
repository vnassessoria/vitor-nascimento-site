# Regras de enquadramento nos Anexos do Simples Nacional

**Compilado em:** 25/08/2026 · **Última auditoria:** 03/09/2026 (ver seção "Auditoria de 03/09/2026" abaixo)
**Fontes primárias:**
- Lei Complementar nº 123/2006 — texto consolidado do Planalto: <https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm>
- Resolução CGSN nº 140/2018 — texto compilado pela Receita Estadual/RS (GES-SIM), atualizado em 02/02/2023: <https://admin.atendimento.receita.rs.gov.br/upload/arquivos/202508/22150110-legislacao-setorial-consolidada-ges-sn-v01.pdf>
- Anexo VI da Res. CGSN 140/2018 (CNAEs impeditivos): <https://www.gov.br/empresas-e-negocios/pt-br/drei/arquivos/AnexoVI.pdf> e <https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=48435>
- Anexo VII da Res. CGSN 140/2018 (CNAEs ambíguos): <https://www.gov.br/empresas-e-negocios/pt-br/drei/arquivos/AnexoVII.pdf>

---

## Auditoria de 03/09/2026

Auditoria completa do documento contra as fontes primárias (Planalto — LC 123/2006 e LC 214/2025 na íntegra, navegador; Res. CGSN 140/2018 via compilado RS/GES-SIM já citado; Anexos VI e VII via PDFs oficiais do DREI, reextraídos com `pdftotext`; descrições de CNAE via `ibge-cnae-subclasses.json`). Todas as citações em bloco (`>`) foram conferidas literalmente; as listas dos Anexos VI e VII foram recontadas código a código; os mapeamentos CNAE↔inciso das seções 2 a 5 foram checados por amostragem ampla (as ~110 associações citadas foram revisadas contra a descrição oficial IBGE de cada código).

**Resultado:** nenhuma citação legal de LC 123/2006 estava transcrita errada — todas batem com o texto vigente do Planalto. Os erros encontrados foram (a) uma questão de vigência que o documento original deixara em aberto e que esta auditoria resolveu com fonte primária, e (b) seis erros pontuais de rotulagem/mapeamento derivado (não nas citações legais em si).

**Erros corrigidos nesta auditoria:**

1. **Vigência do art. 17, II e XV (LC 214/2025)** — o documento original marcava como "⚠️ conferir vigência" / "não apurada". Conferido: o art. 516 da LC 214/2025 (que dá a nova redação a esses incisos) entrou em vigor em **01/01/2025**, por força do art. 544, II, da própria LC 214/2025 (`"a partir de 1º de janeiro de 2025, em relação aos arts. (...) 516 (...)"`). Ou seja, já está em vigor há mais de um ano e meio: (i) o inciso II vale na redação "cujo titular ou sócio seja domiciliado no exterior"; (ii) o inciso XV vale na redação "que realize atividade de locação de imóveis próprios", **sem** a antiga ressalva "exceto quando se referir a prestação de serviços tributados pelo ISS". Ver seção 8 e nota adicionada logo após a tabela do art. 17.
2. **Anexo VI — rótulo "Combustíveis (atacado/importação): 4636-2/02" estava errado.** O código 4636-2/02 é "COMÉRCIO ATACADISTA DE CIGARROS, CIGARRILHAS E CHARUTOS" (confirmado no PDF oficial do Anexo VI e na base IBGE) — não tem nenhuma relação com combustíveis. Reclassificado para o grupo "Fumo, armas e explosivos". Não há, no Anexo VI vigente, nenhum código específico para "importação de combustíveis" (art. 17, IX) — ponto sinalizado como não resolvido.
3. **Anexo VI — rótulo "Ensino superior: 8550-3/01" estava errado.** O código 8550-3/01 é "ADMINISTRAÇÃO DE CAIXAS ESCOLARES" (confirmado no PDF oficial e na base IBGE) — não é ensino superior. Não existe, de resto, nenhum CNAE de ensino superior (ex.: 8531-7/00, 8532-5/00) no Anexo VI. Rótulo corrigido.
4. **§ 5º-B, XXI — faltava o CNAE 8690-9/02** ("ATIVIDADES DE BANCO DE LEITE HUMANO") na lista de códigos derivados, embora o próprio texto legal do inciso cite expressamente "bancos de leite". Adicionado.
5. **§ 5º-I, VIII ("perícia, leilão e avaliação") — código errado.** O documento citava 6821-8/02 ("CORRETAGEM NO ALUGUEL DE IMÓVEIS", sem nenhuma relação com perícia/avaliação). O código correto para a componente "avaliação de imóveis" é **6821-8/01** ("CORRETAGEM NA COMPRA E VENDA E AVALIAÇÃO DE IMÓVEIS"). Também estava faltando **6621-5/01** ("PERITOS E AVALIADORES DE SEGUROS"), que corresponde diretamente a "perícia" e "avaliação". Corrigido.
6. **§ 5º-D, XIV ("serviços de prótese em geral") — código incorreto.** O documento citava 3250-7/07 ("FABRICAÇÃO DE ARTIGOS ÓPTICOS" — óculos, não prótese). Os códigos que de fato correspondem a "prótese em geral" (aparelhos ortopédicos/correção de defeitos físicos) são **3250-7/03** e **3250-7/04**. Corrigido (3250-7/06, prótese dentária, permanece correto).

**Confirmado correto (sem alteração), apesar de merecer registro:**

- Todas as citações em bloco da LC 123/2006 (art. 18, §§4º, 5º-B, 5º-C, 5º-D, 5º-H, 5º-I, 5º-J, 5º-K, 5º-M; art. 17 caput e § 1º) batem literalmente com o texto vigente no Planalto em 03/09/2026.
- As listas completas dos Anexos VI (101 códigos) e VII (22 códigos) batem exatamente com os PDFs oficiais do DREI reextraídos nesta auditoria — nenhum código a mais, a menos ou trocado. O arquivo `data/raw/anexo-vi-vii-cnae-vedados.json` também bate integralmente (inclusive as denominações, que já estavam corretas mesmo onde o texto solto do `.md` errava — ver itens 2 e 3 acima).
- O texto do art. 25, § 1º, III, alíneas "j" a "m", e do art. 26 da Res. CGSN 140/2018 (seções 2 e 6), reconferido contra o mesmo compilado RS/GES-SIM, bate literalmente. A contradição já apontada entre 8299-7/04 (leiloeiros, impeditivo no Anexo VI) e o art. 18, §5º-I, VIII (leilão listado como atividade do Anexo III/V) foi reconfirmada como real e permanece sem solução — é uma aparente antinomia entre a lei e o regulamento, não um erro deste documento.
- `data/raw/anexo-xi-mei.json` (lista de ocupações do MEI, Anexo XI) foi conferido por amostragem contra o PDF oficial vigente (`www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/anexo_xi.pdf`): contém corretamente a ocupação "MOTORISTA (POR APLICATIVO OU NÃO) INDEPENDENTE" → CNAE 4923-0/02 (incluída pela Resolução CGSN nº 182/2025, DOU 01/10/2025) e não contém mais "CONTADOR OU TÉCNICO CONTÁBIL" (CNAE 6920-6/01), consistente com sua exclusão da lista de ocupações do MEI. **Atenção:** essa remoção do contador é frequentemente atribuída pela imprensa especializada à Resolução CGSN nº 183/2025, mas o texto da 183/2025 parece tratar de matéria puramente procedimental (ver ponto 3 da seção seguinte) — o mais provável é que a alteração do Anexo XI tenha vindo da Resolução CGSN nº 182/2025 (26/09/2025), não da 183/2025; **não consegui confirmar isso no texto oficial consolidado** (o portal normas.receita.fazenda.gov.br não pôde ser acessado nesta auditoria — ver ponto 1 abaixo). O arquivo JSON em si não é referenciado por este documento de regras e não precisou de correção.

**Pontos que permanecem não verificados nesta auditoria:**

1. O portal `normas.receita.fazenda.gov.br` (SIJUT) continuou inacessível a ferramentas automatizadas (navegação bloqueada). Não foi possível ler ali o texto consolidado oficial da Res. CGSN 140/2018 com todas as alterações (inclusive 182/2025 e 183/2025). A verificação desta auditoria usou como melhor fonte disponível o mesmo compilado RS/GES-SIM (base 02/2023) já citado no documento original, mais fontes secundárias (LegisWeb) para o conteúdo específico da Res. 183/2025 — portanto o conteúdo exato da Res. CGSN 183/2025 continua **não confirmado em fonte primária**.
2. Não foi possível confirmar em fonte primária se a Res. CGSN 140/2018 (art. 5º, XI, ou art. 15, XXIII, ou art. 25, §1º, III, "l") já foi atualizada para refletir a supressão, pela LC 214/2025, da ressalva do ISS no art. 17, XV. Como a lei complementar prevalece sobre a resolução, e a mudança já está em vigor desde 01/01/2025 (achado nº 1 acima), isso pode ter um efeito prático relevante sobre atividades de "locação de imóveis próprios" que antes eram salvas pela ressalva do ISS (ex.: alínea "l" da seção 2, salões de festas/centros de convenções/etc. quando prestados mediante locação de imóvel próprio) — **recomenda-se levar isso ao contador antes de publicar qualquer orientação sobre essas atividades**, pois é uma questão interpretativa que vai além de conferência de transcrição.
3. Os mapeamentos CNAE↔inciso das seções 2 a 5 foram checados por amostragem ampla (todos os ~110 pares foram olhados), não um a um com profundidade jurídica — permanecem "derivados, não oficiais" como já alertado no documento original, e a correção de 6 itens específicos (achados 4, 5 e 6 acima) não esgota a possibilidade de haver outras associações discutíveis.
4. O restante do `anexo-xi-mei.json` (471 ocupações) não foi conferido linha a linha contra a fonte oficial — apenas por amostragem dirigida (ver acima).

---

## ⚠️ Leia antes de usar

1. **Não existe tabela oficial CNAE → Anexo.** O enquadramento decorre da **natureza da atividade** descrita na lei, não do código CNAE. O CNAE é indício, não regra. As listas de CNAE marcadas como *derivadas* abaixo são sugestões de mapeamento construídas por correspondência textual entre o texto legal e as descrições oficiais do IBGE — **precisam de revisão contábil antes de irem ao ar**.
2. **Dois níveis de confiança neste documento:**
   - **ALTA** — texto legal transcrito de fonte primária (LC 123/2006 via Planalto) e as listas dos Anexos VI/VII da Res. CGSN 140/2018 (baixadas de duas fontes oficiais independentes que conferem exatamente).
   - **MÉDIA/BAIXA** — o mapeamento CNAE↔inciso (derivado por mim) e o texto do art. 25 da Res. CGSN 140/2018 (compilação estadual atualizada só até 02/02/2023).
3. **Limitação de vigência conhecida:** a compilação da Res. CGSN 140/2018 usada aqui não incorpora alterações posteriores a fev/2023 — em especial a **Resolução CGSN nº 183/2025** (publicada em 13/10/2025, efeitos parciais a partir de 01/01/2026). Pelo que apurei, a Res. 183/2025 alterou sobretudo regras procedimentais (opção, PGDAS-D, Defis) e não as listas de atividades por Anexo do art. 25, §1º, nem o Anexo XI (ocupações do MEI) — mas **não consegui confirmar isso no texto consolidado oficial** (o portal normas.receita.fazenda.gov.br permaneceu inacessível também na auditoria de 03/09/2026) e você deve validar. Fonte da notícia oficial: <https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/novembro/simples-nacional-entenda-as-regras-da-resolucao-cgsn-no-183-2025-e-se-proteja-contra-fake-news>. **Atualização da auditoria de 03/09/2026:** a alteração do Anexo XI (ocupações do MEI) que a imprensa especializada às vezes atribui à Res. 183/2025 é provavelmente da **Resolução CGSN nº 182/2025** (assinada 26/09/2025, DOU 01/10/2025), uma resolução distinta — ver nota sobre `anexo-xi-mei.json` na seção de auditoria acima. Também não confirmado em fonte primária.
4. **Reforma tributária em curso — parcialmente resolvido na auditoria de 03/09/2026:** o texto do Planalto traz alterações da **LC 214/2025** (art. 17, incisos II e XV) e remissões à **LC 227/2026**. A vigência do art. 17, II e XV **foi confirmada**: pelo art. 544, II, da LC 214/2025, a nova redação desses incisos (dada pelo art. 516 da mesma lei) está em vigor desde **01/01/2025** — portanto já plenamente vigente e não mais uma incerteza (ver seção 8). As demais alterações da LC 214/2025 que tocam o art. 18 (arts. 517 a 520, que substituem os Anexos I a V e mexem na estrutura de IBS/CBS) só entram em vigor em **01/01/2027** (art. 544, III) — fora, portanto, do horizonte de vigência deste documento em 03/09/2026, mas relevantes a partir daquela data e não cobertas por esta auditoria.

---

## 1. Regra geral — LC 123/2006, art. 18, § 4º

Confiança: **ALTA** (Planalto). Redação dada pela LC 147/2014.

> O contribuinte deverá considerar, destacadamente, para fim de pagamento, as receitas decorrentes da:
> **I** - revenda de mercadorias, que serão tributadas na forma do **Anexo I**;
> **II** - venda de mercadorias industrializadas pelo contribuinte, que serão tributadas na forma do **Anexo II**;
> **III** - prestação de serviços de que trata o § 5º-B deste artigo e dos serviços vinculados à locação de bens imóveis e corretagem de imóveis desde que observado o disposto no inciso XV do art. 17, que serão tributados na forma do **Anexo III**;
> **IV** - prestação de serviços de que tratam os §§ 5º-C a 5º-F e 5º-I deste artigo, que serão tributadas na forma prevista naqueles parágrafos;
> **V** - locação de bens móveis, que serão tributadas na forma do **Anexo III**, deduzida a parcela correspondente ao ISS;
> **VI** - atividade com incidência simultânea de IPI e de ISS, que serão tributadas na forma do **Anexo II**, deduzida a parcela correspondente ao ICMS e acrescida a parcela correspondente ao ISS prevista no Anexo III;
> **VII** - comercialização de medicamentos e produtos magistrais produzidos por manipulação de fórmulas […]

Regulamentação (Res. CGSN 140/2018, art. 25, §2º): a comercialização de medicamentos manipulados é tributada **pelo Anexo III** quando sob encomenda para entrega posterior ao adquirente, em caráter pessoal, mediante prescrição de profissional habilitado ou indicação do farmacêutico, produzidos no próprio estabelecimento após atendimento inicial; **pelo Anexo I** nos demais casos.

---

## 2. § 5º-B — Anexo III **FIXO** (sem fator R)

Confiança: **ALTA** (texto Planalto).

> **§ 5º-B.** Sem prejuízo do disposto no § 1º do art. 17 desta Lei Complementar, serão tributadas na forma do **Anexo III** desta Lei Complementar as seguintes atividades de prestação de serviços:

> ⚠️ **Atenção — nem todos os incisos do § 5º-B são "fixos".** O § 5º-M manda os incisos **XVI, XVIII, XIX, XX e XXI** para o **Anexo V** quando o fator "r" < 28%. Ou seja, apenas os incisos **I a XV e XVII** são Anexo III incondicional. Os cinco marcados com 🔄 abaixo estão sujeitos ao fator R e aparecem também na seção 5.

| Inciso | Texto legal | Fator R? | CNAEs associados (derivados — revisar) |
|---|---|---|---|
| **I** | creche, pré-escola e estabelecimento de ensino fundamental, escolas técnicas, profissionais e de ensino médio, de línguas estrangeiras, de artes, cursos técnicos de pilotagem, preparatórios para concursos, gerenciais e escolas livres, exceto as previstas nos incisos II e III do § 5º-D deste artigo | Não | 8511-2/00, 8513-9/00, 8520-1/00, 8541-4/00, 8542-2/00, 8593-7/00, 8592-9/02, 8592-9/03, 8592-9/99, 8599-6/02, 8599-6/03, 8599-6/04, 8599-6/05, 8599-6/99 |
| **II** | agência terceirizada de correios | Não | 5310-5/02 |
| **III** | agência de viagem e turismo | Não | 7911-2/00, 7912-1/00 |
| **IV** | centro de formação de condutores de veículos automotores de transporte terrestre de passageiros e de carga | Não | 8599-6/01 |
| **V** | agência lotérica | Não | 8299-7/06 |
| **VI, VII, VIII** | (REVOGADOS) | — | — |
| **IX** | serviços de instalação, de reparos e de manutenção em geral, bem como de usinagem, solda, tratamento e revestimento em metais | Não | 2539-0/01, 2539-0/02, 3321-0/00, e a família 3314-7/xx (manutenção e reparação), 9521-5/00, 9529-1/xx |
| **X, XI, XII** | (REVOGADOS) | — | — |
| **XIII** | transporte municipal de passageiros | Não | 4921-3/01, 4921-3/02, 4923-0/01, 4923-0/02, 4929-9/01 |
| **XIV** | escritórios de serviços contábeis, observado o disposto nos §§ 22-B e 22-C deste artigo | Não | 6920-6/01 |
| **XV** | produções cinematográficas, audiovisuais, artísticas e culturais, sua exibição ou apresentação, inclusive no caso de música, literatura, artes cênicas, artes visuais, cinematográficas e audiovisuais | Não | 5911-1/01, 5911-1/99, 5912-0/xx, 5913-8/00, 5914-6/00, 5920-1/00, 9001-9/xx, 9002-7/01, 9003-5/00 |
| **XVI** 🔄 | fisioterapia *(incluído pela LC 147/2014)* | **Sim** | 8650-0/04 |
| **XVII** | corretagem de seguros *(incluído pela LC 147/2014)* | Não | 6622-3/00 |
| **XVIII** 🔄 | arquitetura e urbanismo *(incluído pela LC 155/2016)* | **Sim** | 7111-1/00 |
| **XIX** 🔄 | medicina, inclusive laboratorial, e enfermagem *(LC 155/2016)* | **Sim** | 8630-5/01, 8630-5/02, 8630-5/03, 8630-5/99, 8650-0/01, 8610-1/01, 8610-1/02 |
| **XX** 🔄 | odontologia e prótese dentária *(LC 155/2016)* | **Sim** | 8630-5/04, 3250-7/06 |
| **XXI** 🔄 | psicologia, psicanálise, terapia ocupacional, acupuntura, podologia, fonoaudiologia, clínicas de nutrição e de vacinação e bancos de leite *(LC 155/2016)* | **Sim** | 8650-0/02, 8650-0/03, 8650-0/05, 8650-0/06, 8650-0/07, 8690-9/03, 8690-9/04, 8630-5/06, 8690-9/02 *(banco de leite humano — faltava, adicionado na auditoria de 03/09/2026)* |

**Nota sobre o inciso XIV (contabilidade):** Res. CGSN 140/2018, art. 25, §1º, VIII — tributado pelo Anexo III **desconsiderando-se o percentual relativo ao ISS** quando o imposto for fixado pela legislação municipal e recolhido diretamente ao Município em valor fixo (art. 34).

### Itens que a Res. CGSN 140/2018 acrescenta ao Anexo III fixo

Confiança: **MÉDIA** (compilação estadual, base 02/2023 — texto reconferido literalmente contra a mesma fonte na auditoria de 03/09/2026, bate exatamente; mas a base segue sem cobertura de eventuais alterações da Res. CGSN posteriores a 02/2023, incluindo a 183/2025). Art. 25, §1º, III, alíneas "j" a "m" — não estão no § 5º-B mas decorrem do art. 17, XV c/c art. 18, § 4º, III:

- **j)** corretagem de imóveis de terceiros, assim entendida a intermediação na compra, venda, permuta e locação de imóveis — *CNAE 6821-8/01*
- **k)** serviços vinculados à locação de bens imóveis, assim entendidos o assessoramento locatício e a avaliação de imóveis para fins de locação
- **l)** locação, cessão de uso e congêneres, de bens imóveis próprios com a finalidade de exploração de salões de festas, centro de convenções, escritórios virtuais, stands, quadras esportivas, estádios, ginásios, auditórios, casas de espetáculos, parques de diversões, canchas e congêneres, para realização de eventos ou negócios de qualquer natureza
- **m)** outros serviços que, cumulativamente: **1.** não tenham por finalidade a prestação de serviços decorrentes do exercício de atividade intelectual, de natureza técnica, científica, desportiva, artística ou cultural, que constitua profissão regulamentada ou não; e **2.** não estejam relacionados nos incisos IV a IX

> A alínea "m" é a **cláusula residual do Anexo III**: serviço não-intelectual e não listado em outro lugar cai no Anexo III. Sua contrapartida é a alínea "x" do inciso V (cláusula residual do Anexo V, para serviços intelectuais). Essas duas alíneas são o que decide a maioria dos casos duvidosos.

---

## 3. § 5º-C — Anexo IV

Confiança: **ALTA** (texto Planalto).

> **§ 5º-C.** Sem prejuízo do disposto no § 1º do art. 17 desta Lei Complementar, as atividades de prestação de serviços seguintes serão tributadas na forma do **Anexo IV** desta Lei Complementar, hipótese em que **não estará incluída no Simples Nacional a contribuição prevista no inciso VI do caput do art. 13** desta Lei Complementar, devendo ela ser recolhida segundo a legislação prevista para os demais contribuintes ou responsáveis:

| Inciso | Texto legal | CNAEs associados (derivados — revisar) |
|---|---|---|
| **I** | construção de imóveis e obras de engenharia em geral, inclusive sob a forma de subempreitada, execução de projetos e serviços de paisagismo, bem como decoração de interiores | 4120-4/00, 4211-1/01, 4212-0/00, 4213-8/00, 4222-7/01, 4222-7/02, 4292-8/02, 4299-5/99, 4311-8/01, 4313-4/00, 4321-5/00, 4322-3/01, 4329-1/99, 4330-4/01, 4330-4/03, 4330-4/99, 4391-6/00, 4399-1/03, 8130-3/00, 7410-2/02 (design de interiores) |
| **II a V** | (REVOGADOS) | — |
| **VI** | serviço de vigilância, limpeza ou conservação | 8011-1/01, 8011-1/02, 8012-9/00, 8020-0/01, 8121-4/00, 8122-2/00, 8129-0/00, 8111-7/00 |
| **VII** | serviços advocatícios *(incluído pela LC 147/2014)* | 6911-7/01 |

> ⚠️ **Consequência prática do Anexo IV:** a CPP (INSS patronal, 20%) **não** está no DAS — é recolhida à parte pela legislação geral. Isso costuma ser a maior fonte de erro em sites de orientação.

> ⚠️ **6911-7/02 (atividades auxiliares da justiça) e 6912-5/00 (cartórios) NÃO são Anexo IV — são atividades IMPEDITIVAS** (constam do Anexo VI da Res. CGSN 140/2018). Só 6911-7/01 é advocacia.

---

## 4. § 5º-D — Anexo III **COM** fator R

Confiança: **ALTA** (texto Planalto).

> **§ 5º-D.** Sem prejuízo do disposto no § 1º do art. 17 desta Lei Complementar, as seguintes atividades de prestação de serviços serão tributadas na forma do **Anexo III** desta Lei Complementar: *(Redação dada pela LC 155/2016)*

> ⚠️ **Armadilha de leitura:** a redação **original** do § 5º-D dizia "Anexo V". A LC 155/2016 inverteu para "Anexo III". O Planalto exibe as duas — a válida é a de 2016 (Anexo III). Mas pelo § 5º-M, II, **todo** o § 5º-D vai para o **Anexo V** se o fator "r" < 28%. Na prática: começa no III, cai para o V se a folha for baixa.

| Inciso | Texto legal | CNAEs associados (derivados — revisar) |
|---|---|---|
| **I** | administração e locação de imóveis de terceiros *(Redação LC 147/2014; original: "cumulativamente administração e locação")* | 6822-6/00 |
| **II** | academias de dança, de capoeira, de ioga e de artes marciais | 8592-9/01, 8591-1/00 |
| **III** | academias de atividades físicas, desportivas, de natação e escolas de esportes | 9313-1/00, 8591-1/00 |
| **IV** | elaboração de programas de computadores, inclusive jogos eletrônicos, desde que desenvolvidos em estabelecimento do optante | 6201-5/01, 6202-3/00, 6203-1/00, 6209-1/00 |
| **V** | licenciamento ou cessão de direito de uso de programas de computação | 6203-1/00, 6202-3/00 |
| **VI** | planejamento, confecção, manutenção e atualização de páginas eletrônicas, desde que realizados em estabelecimento do optante | 6201-5/02, 6319-4/00 |
| **VII, VIII** | (REVOGADOS) | — |
| **IX** | empresas montadoras de estandes para feiras | 7319-0/01 |
| **X, XI** | (REVOGADOS) | — |
| **XII** | laboratórios de análises clínicas ou de patologia clínica | 8640-2/01, 8640-2/02 |
| **XIII** | serviços de tomografia, diagnósticos médicos por imagem, registros gráficos e métodos óticos, bem como ressonância magnética | 8640-2/04, 8640-2/05, 8640-2/06, 8640-2/07, 8640-2/08, 8640-2/09 |
| **XIV** | serviços de prótese em geral | 3250-7/06, 3250-7/03, 3250-7/04 *(corrigido na auditoria de 03/09/2026: o código 3250-7/07 citado antes é "fabricação de artigos ópticos", sem relação com prótese — os códigos corretos para "aparelhos ortopédicos e correção de defeitos físicos" são 3250-7/03 e 3250-7/04)* |

> **Condição de estabelecimento (incisos IV e VI):** o benefício exige que o desenvolvimento/manutenção seja feito **em estabelecimento do optante**. Software desenvolvido fora do estabelecimento não se enquadra aqui.

---

## 5. § 5º-I — Anexo V (migra para III se fator R ≥ 28%)

Confiança: **ALTA** (texto Planalto).

> **§ 5º-I.** Sem prejuízo do disposto no § 1º do art. 17 desta Lei Complementar, as seguintes atividades de prestação de serviços serão tributadas na forma do **Anexo V** desta Lei Complementar: *(Redação dada pela LC 155/2016)*

| Inciso | Texto legal | CNAEs associados (derivados — revisar) |
|---|---|---|
| **I** | medicina, inclusive laboratorial e enfermagem — **REVOGADO pela LC 155/2016** (migrou para § 5º-B, XIX) | — |
| **II** | medicina veterinária | 7500-1/00 |
| **III** | odontologia — **REVOGADO pela LC 155/2016** (migrou para § 5º-B, XX) | — |
| **IV** | psicologia, psicanálise, terapia ocupacional, acupuntura, podologia, fonoaudiologia, clínicas de nutrição e de vacinação e bancos de leite — **REVOGADO pela LC 155/2016** (migrou para § 5º-B, XXI) | — |
| **V** | serviços de comissaria, de despachantes, de tradução e de interpretação | 5250-8/01, 5250-8/02, 7490-1/01 |
| **VI** | engenharia, medição, cartografia, topografia, geologia, geodésia, testes, suporte e análises técnicas e tecnológicas, pesquisa, design, desenho e agronomia *(Redação LC 155/2016 — a redação anterior, da LC 147/2014, incluía "arquitetura", que a LC 155/2016 moveu para o § 5º-B, XVIII)* | 7112-0/00, 7119-7/01, 7119-7/02, 7119-7/03, 7119-7/99, 7120-1/00, 7210-0/00, 7220-7/00, 7410-2/02, 7410-2/03, 7410-2/99, 7490-1/03 |
| **VII** | representação comercial e demais atividades de intermediação de negócios e serviços de terceiros | 4512-9/01, 4530-7/06, 4542-1/01, 4611-7/00 … 4619-2/00 (toda a família 46xx de representantes comerciais), 7490-1/04 |
| **VIII** | perícia, leilão e avaliação | 8299-7/04, 6821-8/01, 6621-5/01 *(corrigido na auditoria de 03/09/2026: 6821-8/02, citado antes, é "corretagem no aluguel de imóveis" — sem relação com perícia/avaliação; o código correto é 6821-8/01, "corretagem na compra e venda e avaliação de imóveis"; adicionado também 6621-5/01, "peritos e avaliadores de seguros")* |
| **IX** | auditoria, economia, consultoria, gestão, organização, controle e administração | 6920-6/02, 7020-4/00, 6204-0/00, 6621-5/02 |
| **X** | jornalismo e publicidade | 6391-7/00, 7311-4/00, 7312-2/00, 7319-0/02, 7319-0/03, 7319-0/04, 7319-0/99, 9002-7/01 |
| **XI** | agenciamento, **exceto de mão de obra** | 7490-1/04, 7490-1/05, 5232-0/00, 5250-8/03, 7312-2/00 |
| **XII** | outras atividades do setor de serviços que tenham por finalidade a prestação de serviços decorrentes do exercício de atividade intelectual, de natureza técnica, científica, desportiva, artística ou cultural, que constitua profissão regulamentada ou não, **desde que não sujeitas à tributação na forma dos Anexos III ou IV** desta Lei Complementar *(Redação LC 155/2016)* | *(cláusula residual — sem CNAE fixo)* |

> **Exceção crítica no inciso XI:** agenciamento **de mão de obra** está fora. Cai na vedação do art. 17, XII (cessão/locação de mão de obra) — CNAEs 7810-8/00, 7820-5/00 e 7830-2/00, sendo que **7820-5/00 e 7830-2/00 constam expressamente do Anexo VI (impeditivos)**.

---

## 6. § 5º-J, § 5º-K e § 5º-M — o fator "r"

Confiança: **ALTA** (texto Planalto).

> **§ 5º-J.** As atividades de prestação de serviços a que se refere o § 5º-I serão tributadas na forma do **Anexo III** desta Lei Complementar caso a razão entre a folha de salários e a receita bruta da pessoa jurídica seja **igual ou superior a 28%** (vinte e oito por cento).

> **§ 5º-K.** Para o cálculo da razão a que se referem os §§ 5º-J e 5º-M, serão considerados, respectivamente, os montantes pagos e auferidos **nos doze meses anteriores ao período de apuração** para fins de enquadramento no regime tributário do Simples Nacional.

> **§ 5º-M.** Quando a relação entre a folha de salários e a receita bruta da microempresa ou da empresa de pequeno porte for **inferior a 28%** (vinte e oito por cento), serão tributadas na forma do **Anexo V** desta Lei Complementar as atividades previstas:
> **I** - nos incisos **XVI, XVIII, XIX, XX e XXI do § 5º-B** deste artigo;
> **II** - no **§ 5º-D** deste artigo.

### Resumo operacional do fator R

| Origem | fator r ≥ 28% | fator r < 28% |
|---|---|---|
| § 5º-B, incisos XVI, XVIII, XIX, XX, XXI | Anexo III | **Anexo V** |
| § 5º-D (todos os incisos) | Anexo III | **Anexo V** |
| § 5º-I (todos os incisos) | **Anexo III** | Anexo V |

> Ou seja: os três blocos convergem para o mesmo resultado (III se ≥28%, V se <28%). A diferença é apenas o "ponto de partida" narrativo. A Res. CGSN 140/2018, art. 25, §1º, V consolida os três blocos numa lista única de 24 alíneas ("a" a "x") — confirmando que o tratamento é idêntico.

### Composição da folha (Res. CGSN 140/2018, art. 26) — confiança MÉDIA (base 02/2023; reconferida literalmente na auditoria de 03/09/2026 contra a mesma fonte, bate exatamente)

- **Numerador:** folha de salários dos 12 meses anteriores, incluídos encargos = remuneração a pessoas físicas decorrente do trabalho **+ pró-labore**, acrescido do montante **efetivamente recolhido** a título de CPP e FGTS.
- **Denominador:** receita bruta total acumulada nos 12 meses anteriores, mercados interno **e** externo.
- **Não entram:** aluguéis e distribuição de lucros (art. 26, §3º).
- Só contam remunerações informadas na forma do art. 32, IV da Lei 8.212/1991 (eSocial/GFIP).
- Empresa com menos de 13 meses de atividade: anualização pelos critérios do art. 22 (art. 26, §4º).

---

## 7. § 5º-H — exceção da cessão de mão de obra

Confiança: **ALTA** (texto Planalto) + **MÉDIA** para a regulamentação (reconferida literalmente na auditoria de 03/09/2026 contra o compilado RS/GES-SIM — bate exatamente, incluindo a alínea "d" sobre MEI).

> **§ 5º-H.** A vedação de que trata o inciso XII do caput do art. 17 desta Lei Complementar **não se aplica às atividades referidas no § 5º-C** deste artigo.

> ⚠️ **Correção importante:** a exceção alcança **apenas o § 5º-C (Anexo IV)** — **não** o § 5º-B. É comum encontrar a afirmação errada de que atividades do Anexo III também podem ceder mão de obra.

Regulamentação — Res. CGSN 140/2018, art. 15, §3º:
> **I** - considera-se cessão ou locação de mão de obra a atividade descrita no § 1º do art. 112; e
> **II** - a vedação não se aplica às atividades referidas nas alíneas "a" a "c" do inciso XI do art. 5º.

E o art. 5º, XI, alíneas "a" a "c", da mesma Resolução lista exatamente:
> **a)** construção de imóveis e obras de engenharia em geral, inclusive sob a forma de subempreitada, execução de projetos e serviços de paisagismo e decoração de interiores;
> **b)** serviço de vigilância, limpeza ou conservação;
> **c)** serviços advocatícios

**Conclusão:** as três atividades do Anexo IV — e só elas — podem operar mediante cessão de mão de obra sem perder a opção pelo Simples Nacional. *(A alínea "d" do mesmo inciso trata da contratação de empregado pelo MEI, contexto distinto.)*

---

## 8. Art. 17 — atividades e situações IMPEDITIVAS

Confiança: **ALTA** (texto Planalto).

> **Art. 17.** Não poderão recolher os impostos e contribuições na forma do Simples Nacional a microempresa ou empresa de pequeno porte:

| Inciso | Texto legal | Situação |
|---|---|---|
| **I** | que explore atividade de prestação cumulativa e contínua de serviços de assessoria creditícia, gestão de crédito, seleção e riscos, administração de contas a pagar e a receber, gerenciamento de ativos (*asset management*) ou compra de direitos creditórios resultantes de vendas mercantis a prazo ou de prestação de serviços (*factoring*) **ou que execute operações de empréstimo, de financiamento e de desconto de títulos de crédito, exclusivamente com recursos próprios, tendo como contrapartes MEI, ME e EPP, inclusive sob a forma de empresa simples de crédito** *(Redação LC 167/2019)* | Vigente |
| **II** | cujo titular ou sócio seja domiciliado no exterior *(Redação LC 214/2025; redação anterior: "que tenha sócio domiciliado no exterior")* | **Vigente desde 01/01/2025** (LC 214/2025, art. 516 c/c art. 544, II — confirmado na auditoria de 03/09/2026) |
| **III** | de cujo capital participe entidade da administração pública, direta ou indireta, federal, estadual ou municipal | Vigente |
| **IV** | (REVOGADO) | — |
| **V** | que possua débito com o INSS, ou com as Fazendas Públicas Federal, Estadual ou Municipal, cuja exigibilidade não esteja suspensa | Vigente |
| **VI** | que preste serviço de transporte intermunicipal e interestadual de passageiros, **exceto** quando na modalidade fluvial ou quando possuir características de transporte urbano ou metropolitano ou realizar-se sob fretamento contínuo em área metropolitana para o transporte de estudantes ou trabalhadores *(Redação LC 147/2014)* | Vigente |
| **VII** | que seja geradora, transmissora, distribuidora ou comercializadora de energia elétrica | Vigente |
| **VIII** | que exerça atividade de importação ou fabricação de automóveis e motocicletas | Vigente |
| **IX** | que exerça atividade de importação de combustíveis | Vigente |
| **X** | que exerça atividade de produção ou venda no atacado de: **a)** cigarros, cigarrilhas, charutos, filtros para cigarros, armas de fogo, munições e pólvoras, explosivos e detonantes; **b)** bebidas não alcoólicas: *(4)* cervejas sem álcool; **c)** bebidas alcoólicas, **exceto** aquelas produzidas ou vendidas no atacado por: *1.* micro e pequenas cervejarias; *2.* micro e pequenas vinícolas; *3.* produtores de licores; *4.* micro e pequenas destilarias *(Redação LC 155/2016)* | Vigente |
| **XI** | (REVOGADO pela LC 147/2014) — antes vedava atividade intelectual/profissão regulamentada | — |
| **XII** | que realize **cessão ou locação de mão-de-obra** | Vigente — ver § 5º-H (seção 7) |
| **XIII** | (REVOGADO pela LC 147/2014) — antes vedava consultoria | — |
| **XIV** | que se dedique ao **loteamento e à incorporação de imóveis** | Vigente |
| **XV** | que realize atividade de **locação de imóveis próprios** *(Redação LC 214/2025)*. Redação anterior: "…, **exceto quando se referir a prestação de serviços tributados pelo ISS**" | **Vigente desde 01/01/2025** (LC 214/2025, art. 516 c/c art. 544, II — confirmado na auditoria de 03/09/2026) |
| **XVI** | com ausência de inscrição ou com irregularidade em cadastro fiscal federal, municipal ou estadual, quando exigível | Vigente |

> ⚠️ **Achado da auditoria de 03/09/2026 — vigência do art. 17, II e XV confirmada, com possível efeito prático não resolvido.** O art. 516 da LC 214/2025 deu a estes dois incisos a redação acima, e o art. 544, II, da mesma lei fixa sua vigência em **1º de janeiro de 2025** — já em vigor, portanto, há mais de um ano e meio nesta data. A mudança relevante é a do inciso XV: a antiga ressalva ("exceto quando se referir a prestação de serviços tributados pelo ISS") **não existe mais**. Isso pode ter consequência prática sobre atividades de locação de imóvel próprio vinculada à prestação de serviço tributado pelo ISS — por exemplo, a alínea "l" da seção 2 deste documento (locação de bens imóveis próprios para salões de festas, centros de convenções, stands etc.), que era tradicionalmente enquadrada no Anexo III com base exatamente naquela ressalva do ISS (art. 18, §4º, III c/c art. 17, XV antigo). **Não foi possível confirmar em fonte primária** se a Res. CGSN 140/2018 (arts. 5º, XI, 15, XXIII, e 25, §1º, III, "l") já foi atualizada para refletir essa mudança da lei complementar — o compilado disponível (base 02/2023) ainda reflete a redação antiga. Como a LC prevalece sobre a Resolução, isto é uma questão interpretativa real, não apenas de redação, e deve ser levada ao contador antes de publicar qualquer orientação sobre CNAEs de locação de imóveis próprios (ex.: 6810-2/02, 6810-2/03 — hoje já listados como impeditivos no Anexo VI, o que sugere que a Res. CGSN já trata "aluguel de imóveis próprios" como vedado de forma ampla, mas não confirma o efeito específico sobre a alínea "l").

### Art. 17, § 1º — a válvula de escape

> As vedações relativas a exercício de atividades previstas no *caput* deste artigo **não se aplicam** às pessoas jurídicas que se dediquem **exclusivamente** às atividades referidas nos **§§ 5º-B a 5º-E do art. 18**, ou as exerçam **em conjunto com outras atividades que não tenham sido objeto de vedação** no *caput*.

> Isto é o que permite, p.ex., que uma empresa de consultoria ou de atividade intelectual regulamentada opte pelo Simples: as vedações genéricas cedem diante das listas dos §§ 5º-B a 5º-E.

### Res. CGSN 140/2018, art. 15 — vedações adicionais (não-CNAE)

Confiança: **MÉDIA** (compilação estadual, base 02/2023 — reconferida literalmente na auditoria de 03/09/2026 contra a mesma fonte, bate exatamente). Além das do art. 17 da LC, a Resolução consolida vedações estruturais oriundas do art. 3º, §4º da LC 123: receita bruta > R$ 4.800.000,00 (I); capital com participação de outra PJ ou SCP (II); filial de PJ com sede no exterior (III); sócio PF com participação em outra empresa beneficiada, se a receita global ultrapassar o limite (IV); titular/sócio com >10% do capital de outra empresa não beneficiada, idem (V); sócio/titular administrador em outra PJ com fins lucrativos, idem (VI); cooperativa, salvo de consumo (VII); que participe do capital de outra PJ ou SCP (VIII); banco/financeira/corretora/seguradora/previdência (IX); resultante de cisão nos últimos 5 anos-calendário (X); sociedade por ações (XI); **cujos titulares ou sócios mantenham com o contratante do serviço relação de pessoalidade, subordinação e habitualidade, cumulativamente (XXV)**; sociedade em conta de participação (XXVI).

---

## 9. Anexo VI da Res. CGSN 140/2018 — CNAEs impeditivos (lista completa)

Confiança: **ALTA**. 101 códigos. Baixado de duas fontes oficiais independentes (RFB/SIJUT e DREI/gov.br) — as duas listas conferem **exatamente**. Todos os 101 códigos foram validados contra a base de subclasses do IBGE (todos existem na CNAE vigente). Recontado e reconferido código a código na auditoria de 03/09/2026 direto do PDF oficial do DREI — lista idêntica, sem alteração desde a pesquisa original; duas denominações usadas nos rótulos de agrupamento abaixo estavam erradas e foram corrigidas (ver seção de auditoria no topo do documento).

Dados estruturados: `data/raw/anexo-vi-vii-cnae-vedados.json`

**Fumo, armas e explosivos:** 1220-4/01, 1220-4/02, 1220-4/03, 2092-4/01, 2550-1/01, 2550-1/02, 4636-2/02 *(comércio atacadista de cigarros, cigarrilhas e charutos — reclassificado para este grupo na auditoria de 03/09/2026; estava incorretamente rotulado como "Combustíveis" abaixo)*
**Automóveis e motocicletas (fabricação):** 2910-7/01, 3091-1/01
**Energia elétrica:** 3511-5/01, 3511-5/02, 3512-3/00, 3513-1/00, 3514-0/00
**Incorporação de imóveis:** 4110-7/00
**Transporte de passageiros interestadual/intermunicipal:** 4912-4/01, 4922-1/01, 4922-1/02
**Correio nacional:** 5310-5/01
**Setor financeiro (bancos, crédito, câmbio, consórcios, factoring, fomento):** 6410-7/00, 6421-2/00, 6422-1/00, 6423-9/00, 6424-7/01, 6424-7/02, 6424-7/03, 6424-7/04, 6431-0/00, 6432-8/00, 6433-6/00, 6434-4/00, 6435-2/01, 6435-2/02, 6435-2/03, 6436-1/00, 6437-9/00, 6438-7/01, 6438-7/99, 6440-9/00, 6450-6/00, 6461-1/00, 6462-0/00, 6463-8/00, 6470-1/01, 6470-1/02, 6470-1/03, 6491-3/00, 6492-1/00, 6499-9/01, 6499-9/02, 6499-9/03, 6499-9/04, 6499-9/05, 6499-9/99
**Seguros, previdência e saúde suplementar:** 6511-1/01, 6511-1/02, 6512-0/00, 6520-1/00, 6530-8/00, 6541-3/00, 6542-1/00
**Atividades auxiliares de financeiras e seguros:** 6611-8/01, 6611-8/02, 6611-8/03, 6611-8/04, 6612-6/01, 6612-6/02, 6612-6/03, 6612-6/04, 6612-6/05, 6619-3/01, 6619-3/03, 6619-3/04
**Imobiliárias (imóveis próprios) e loteamento:** 6810-2/02, 6810-2/03
**Justiça e cartórios:** 6911-7/02, 6912-5/00
**Cessão/locação de mão de obra:** 7820-5/00, 7830-2/00
**Condomínios prediais:** 8112-5/00
**Leiloeiros:** 8299-7/04
**Administração pública, defesa e seguridade social:** 8411-6/00, 8412-4/00, 8413-2/00, 8421-3/00, 8422-1/00, 8423-0/00, 8424-8/00, 8425-6/00, 8430-2/00
**Administração de caixas escolares:** 8550-3/01 *(rótulo corrigido na auditoria de 03/09/2026: o código é "administração de caixas escolares", não "ensino superior" — não há, de resto, nenhum CNAE de ensino superior no Anexo VI)*
**Organizações associativas, partidos, sindicatos, religiosas:** 9411-1/00, 9412-0/01, 9412-0/99, 9420-1/00, 9430-8/00, 9491-0/00, 9492-8/00, 9493-6/00, 9499-5/00
**Organismos internacionais:** 9900-8/00

> ⚠️ Notei que **8299-7/04 (leiloeiros independentes)** aparece no Anexo VI (impeditivo) **e** o art. 18, § 5º-I, VIII da LC 123 lista "perícia, leilão e avaliação" como atividade de Anexo V. Isso é uma contradição aparente entre a lei e o anexo regulamentar que **você deve levar ao contador** antes de publicar orientação sobre leiloeiros. Não a resolvi.

---

## 10. Anexo VII da Res. CGSN 140/2018 — CNAEs ambíguos

Confiança: **ALTA**. 22 códigos. "Códigos previstos na CNAE que abrangem **concomitantemente** atividade impeditiva e permitida ao Simples Nacional" (art. 8º, §2º). Todos validados contra a CNAE vigente. Recontado e reconferido (códigos e denominações) na auditoria de 03/09/2026 direto do PDF oficial do DREI — lista e descrições idênticas às abaixo, sem nenhum erro encontrado.

> Para estes, o CNAE **sozinho não decide**: depende do que a empresa efetivamente faz. São exatamente os casos em que um site de orientação automática erra.

| Código | Denominação |
|---|---|
| 1113-5/02 | Fabricação de cervejas e chopes |
| 4635-4/02 | Comércio atacadista de cerveja, chope e refrigerante |
| 4635-4/03 | Comércio atacadista de bebidas com atividade de fracionamento e acondicionamento associada |
| 4635-4/99 | Comércio atacadista de bebidas não especificadas anteriormente |
| 4684-2/99 | Comércio atacadista de outros produtos químicos e petroquímicos não especificados anteriormente |
| 4924-8/00 | Transporte escolar |
| 4929-9/02 | Transporte rodoviário coletivo de passageiros, sob regime de fretamento, intermunicipal, interestadual e internacional |
| 4929-9/04 | Organização de excursões em veículos rodoviários próprios, intermunicipal, interestadual e internacional |
| 4929-9/99 | Outros transportes rodoviários de passageiros não especificados anteriormente |
| 4950-7/00 | Trens turísticos, teleféricos e similares |
| 5011-4/02 | Transporte marítimo de cabotagem - passageiros |
| 5091-2/02 | Transporte por navegação de travessia, intermunicipal, interestadual e internacional |
| 5099-8/01 | Transporte aquaviário para passeios turísticos |
| 5099-8/99 | Outros transportes aquaviários não especificados anteriormente |
| 5111-1/00 | Transporte aéreo de passageiros regular |
| 5112-9/01 | Serviço de táxi aéreo e locação de aeronaves com tripulação |
| 5112-9/99 | Outros serviços de transporte aéreo de passageiros não regular |
| 5229-0/01 | Serviços de apoio ao transporte por táxi, inclusive centrais de chamada |
| 5229-0/99 | Outras atividades auxiliares dos transportes terrestres não especificadas anteriormente |
| 6619-3/02 | Correspondentes de instituições financeiras |
| 6619-3/99 | Outras atividades auxiliares dos serviços financeiros não especificadas anteriormente |
| 8299-7/99 | Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente |

---

## 11. Outras regras de tributação (art. 25, §1º, VI, VII e IX da Res. CGSN 140/2018)

Confiança: **MÉDIA** (compilação estadual, base 02/2023).

- **VI — Locação de bens móveis:** Anexo III, **deduzida a parcela do ISS**. O §5º do art. 25 esclarece que só se enquadra aqui a receita "oriunda da exploração de atividade **não definida** na lista de serviços anexa à LC 116/2003".
- **VII — Incidência simultânea de IPI e ISS:** Anexo II, deduzida a parcela do ICMS e acrescida a parcela do ISS prevista no Anexo III.
- **IX — Anexo III sem ISS e com ICMS do Anexo I** (base: LC 123, art. 18, §5º-E): **a)** transportes intermunicipais e interestaduais de cargas; **b)** transportes intermunicipais e interestaduais de passageiros, nas situações permitidas no inciso XVI e §§4º e 5º do art. 15; **c)** de comunicação.

---

## 12. Lacunas e pontos a validar com o contador

1. **Res. CGSN 183/2025 não verificada no texto oficial consolidado — status inalterado após a auditoria de 03/09/2026.** O portal SIJUT da RFB (`normas.receita.fazenda.gov.br`) continua bloqueado para ferramentas automatizadas. A compilação usada tem base 02/2023. Uma fonte secundária (LegisWeb) indica que a 183/2025 trata de matéria procedimental (opção, exclusão, Defis/DASN-Simei/PGDAS-D, integração de dados entre fiscos) e não mexe nos arts. 25/26 nem no Anexo XI — mas isso **não foi confirmado em fonte primária**.
2. ~~Vigência das alterações da LC 214/2025 (art. 17, II e XV) não apurada~~ — **RESOLVIDO na auditoria de 03/09/2026**: ambos os incisos estão em vigor desde 01/01/2025 (LC 214/2025, art. 516 c/c art. 544, II). Ver seção 8. O que **permanece em aberto**: se a supressão da ressalva do ISS no inciso XV já se refletiu na Res. CGSN 140/2018 (arts. 5º, XI; 15, XXIII; 25, §1º, III, "l") — não confirmado em fonte primária, e com efeito prático potencial sobre a alínea "l" da seção 2 (locação de imóveis próprios para eventos). As remissões da LC 214/2025 ao Anexo I-V (arts. 517-520) só produzem efeito em 01/01/2027, fora do horizonte deste documento.
3. **Contradição 8299-7/04 (leiloeiros)** entre o Anexo VI e o art. 18, §5º-I, VIII — reconfirmada na auditoria de 03/09/2026 (código presente no PDF oficial do Anexo VI como "LEILOEIROS INDEPENDENTES"), continua sem solução.
4. **Os mapeamentos CNAE↔inciso das seções 2 a 5 são derivados**, por correspondência textual com as descrições oficiais do IBGE. Não são oficiais. Na auditoria de 03/09/2026 todos os ~110 pares foram checados por amostragem ampla contra a descrição oficial IBGE de cada código; 3 associações estavam erradas ou incompletas e foram corrigidas (banco de leite faltando no § 5º-B, XXI; código de "avaliação de imóveis" trocado e "peritos de seguros" faltando no § 5º-I, VIII; código de "artigos ópticos" no lugar de "aparelhos ortopédicos" no § 5º-D, XIV — ver seção de auditoria no topo). Isso não esgota a possibilidade de haver outras associações discutíveis; segue recomendável revisão profissional linha a linha antes de uso em produção. As listas dos Anexos VI e VII (seções 9 e 10) são as únicas listas CNAE **oficiais** deste documento (e foram recontadas nesta auditoria — íntegras).
5. **Reticências "xx" e "…"** aparecem em algumas células de CNAE nas seções 2 e 5 onde a família inteira de subclasses é relevante; expanda a partir de `data/raw/ibge-cnae-subclasses.json` antes de usar programaticamente.
6. **`data/raw/anexo-xi-mei.json` (Anexo XI, ocupações do MEI) — checado por amostragem na auditoria de 03/09/2026, não linha a linha.** As 471 entradas do arquivo parecem refletir a Resolução CGSN nº 182/2025 (inclusão de "motorista por aplicativo", CNAE 4923-0/02, e ausência de "contador ou técnico contábil", CNAE 6920-6/01), mas isso não foi confirmado contra o texto oficial consolidado (item 1 acima). Este arquivo não é referenciado pelo corpo deste documento de regras — nenhuma correção textual foi necessária aqui, só o registro do spot-check.

## Fontes secundárias consultadas (cruzamento, prioridade menor que a lei)

- Contabilizei — Anexo IV: <https://www.contabilizei.com.br/contabilidade-online/anexo-4-simples-nacional/>
- e-Auditoria — Anexo III ou Anexo V / Fator R: <https://www.e-auditoria.com.br/blog/anexo-iii-ou-anexo-v-simples-nacional/>
- Contabilidade.com — tabela CNAE/anexo/fator R: <https://contabilidade.com/blog/tabela-simples-nacional-2026-completa-cnae-anexo-fator-r-e-aliquotas-atualizadas/>
- IBET — Res. CGSN 183/2025: <https://www.ibet.com.br/resolucao-cgsn-183-2025-alteracoes-na-resolucao-cgsn-140-2018/>
