import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://web-production-ddbd9.up.railway.app/api";

const C = {
  bg:"#060608",surface:"#0c0c10",card:"#111116",elevated:"#18181f",
  accent:"#38bdf8",accentD:"#0ea5e9",
  accentGlow:"rgba(56,189,248,0.2)",accentDim:"rgba(56,189,248,0.08)",
  text:"#EAEAEA",muted:"#888",hint:"#444",
  border:"rgba(255,255,255,0.06)",borderHi:"rgba(255,255,255,0.12)",
  radius:"10px",radiusSm:"6px",radiusLg:"16px",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{font-size:16px;}
  body{background:#060608;color:#EAEAEA;font-family:'Inter',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  ::selection{background:#38bdf8;color:#000;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#060608;}
  ::-webkit-scrollbar-thumb{background:#1e1e28;border-radius:10px;}
  ::-webkit-scrollbar-thumb:hover{background:#38bdf8;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);filter:blur(6px);}to{opacity:1;transform:translateY(0);filter:blur(0);}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .anim-in{animation:fadeUp 0.7s ease-out both;}
  .anim-fi{animation:fadeIn 0.5s ease-out both;}
  .reveal{opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .reveal.vis{opacity:1;transform:translateY(0);}
  input,textarea,select{background:#111116;border:1px solid rgba(255,255,255,0.06);color:#EAEAEA;border-radius:8px;padding:12px 16px;font-family:'Inter',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
  input:focus,textarea:focus,select:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,0.08);}
  input::placeholder,textarea::placeholder{color:#444;font-style:italic;}
  select option{background:#111116;}
  button{cursor:pointer;font-family:'Inter',sans-serif;border:none;transition:all 0.2s;}
  .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 28px;background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid #38bdf8;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;border-radius:10px;}
  .btn-primary:hover{background:#38bdf8;color:#000;box-shadow:0 0 24px rgba(56,189,248,0.3);}
  .btn-primary:active{transform:scale(0.97);}
  .btn-primary:disabled{opacity:0.4;pointer-events:none;}
  .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 28px;background:rgba(255,255,255,0.04);color:#888;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;border-radius:10px;}
  .btn-ghost:hover{background:rgba(255,255,255,0.08);color:#EAEAEA;border-color:rgba(255,255,255,0.14);}
  .nav-link{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#555;padding:6px 14px;white-space:nowrap;transition:all 0.2s;text-decoration:none;font-weight:500;border-radius:6px;}
  .nav-link:hover{color:#EAEAEA;background:rgba(255,255,255,0.05);}
  .card{background:#111116;border:1px solid rgba(255,255,255,0.06);padding:28px;border-radius:12px;transition:border-color 0.2s,box-shadow 0.2s;}
  .card:hover{border-color:#0ea5e9;box-shadow:0 0 28px rgba(56,189,248,0.12);}
  .tool-card{background:#111116;border:1px solid rgba(255,255,255,0.06);padding:24px;cursor:pointer;border-radius:12px;transition:all 0.2s;position:relative;overflow:hidden;}
  .tool-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#38bdf8,transparent);transform:scaleX(0);transition:transform 0.3s;}
  .tool-card:hover::after{transform:scaleX(1);}
  .tool-card:hover{border-color:#0ea5e9;box-shadow:0 8px 32px rgba(56,189,248,0.12);transform:translateY(-2px);}
  .sidebar{width:248px;min-height:100vh;background:#0c0c10;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;}
  .nav-item{display:flex;align-items:center;gap:12px;padding:10px 20px;color:#555;cursor:pointer;transition:all 0.15s;font-size:13px;font-weight:400;border-radius:8px;margin:1px 8px;}
  .nav-item:hover{color:#EAEAEA;background:rgba(255,255,255,0.04);}
  .nav-item.active{color:#38bdf8;background:rgba(56,189,248,0.1);}
  .main-content{margin-left:248px;min-height:100vh;background:#060608;}
  .topbar{height:62px;background:#0c0c10;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:50;}
  .tag{display:inline-block;background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid rgba(56,189,248,0.2);padding:5px 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:500;margin-bottom:20px;border-radius:20px;}
  .result-box{background:#111116;border:1px solid rgba(255,255,255,0.06);padding:20px;min-height:200px;font-size:14px;line-height:1.8;white-space:pre-wrap;color:#888;border-radius:10px;}
  .usage-bar{height:3px;background:rgba(255,255,255,0.06);overflow:hidden;margin-top:6px;border-radius:3px;}
  .usage-fill{height:100%;background:linear-gradient(90deg,#38bdf8,#0ea5e9);transition:width 0.5s;border-radius:3px;}
  .toast{position:fixed;bottom:28px;right:28px;background:#111116;border:1px solid rgba(255,255,255,0.08);color:#EAEAEA;padding:14px 22px;font-size:13px;z-index:9999;animation:fadeUp 0.3s ease;border-left:3px solid #38bdf8;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
  .section-label{font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#444;font-weight:500;margin-bottom:12px;}
  .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;}
  .badge-free{background:rgba(255,255,255,0.06);color:#666;}
  .badge-essencial{background:rgba(99,179,237,0.1);color:#63b3ed;}
  .badge-starter{background:rgba(99,179,237,0.1);color:#63b3ed;}
  .badge-profissional{background:rgba(56,189,248,0.12);color:#38bdf8;}
  .badge-business{background:rgba(56,189,248,0.12);color:#38bdf8;}
  .badge-gestao{background:rgba(167,139,250,0.12);color:#a78bfa;}
  .badge-unlimited{background:rgba(167,139,250,0.12);color:#a78bfa;}
  .badge-enterprise{background:rgba(251,191,36,0.12);color:#fbbf24;}
  .star{color:#f59e0b;font-size:14px;}
  .history-item{background:#111116;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 18px;margin-bottom:10px;cursor:pointer;transition:border-color 0.2s;}
  .history-item:hover{border-color:rgba(56,189,248,0.3);}
  .logout-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;cursor:pointer;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);color:#f87171;font-size:12px;font-weight:500;transition:all 0.2s;margin-top:12px;width:100%;}
  .logout-btn:hover{background:rgba(239,68,68,0.14);}
`;

// ─── PLACEHOLDERS INTELIGENTES POR FERRAMENTA ────────────────────────────────

const TOOL_PLACEHOLDERS = {
  contrato: "Descreva as partes envolvidas, o objeto do contrato, o valor acordado, o prazo de execucao e qualquer condicao especial. Exemplo: Contrato de prestacao de servicos de marketing digital entre a empresa Alfa Ltda (contratante) e Joao Silva MEI (contratado), valor mensal de R$ 3.500, vigencia de 6 meses a partir de maio de 2026, com clausula de exclusividade.",
  proposta: "Informe o nome do cliente, o servico ou produto que esta sendo proposto, os principais beneficios, o investimento e as condicoes de pagamento. Exemplo: Proposta para a empresa Beta Comercio, implementacao de sistema de gestao de estoque, prazo de 45 dias, investimento de R$ 12.000 parcelado em 3x.",
  relatorio: "Descreva o periodo analisado, as principais metricas ou eventos ocorridos e o publico que ira receber o relatorio. Exemplo: Relatorio de desempenho comercial do primeiro trimestre de 2026, equipe de 5 vendedores, faturamento de R$ 280.000, meta era de R$ 320.000.",
  email_corp: "Informe o destinatario, o assunto principal, o tom desejado e o objetivo do e-mail. Exemplo: E-mail para o fornecedor XYZ comunicando atraso no pagamento de fatura vencida em abril, solicitando renegociacao do prazo por mais 15 dias.",
  analise: "Cole os dados que deseja analisar ou descreva o cenario. Exemplo: Vendas de janeiro R$ 45.000, fevereiro R$ 38.000, marco R$ 52.000. Ticket medio R$ 1.200. Taxa de cancelamento 8%. Quero entender a tendencia e os principais riscos.",
  query: "Descreva o banco de dados, as tabelas envolvidas e o que voce precisa consultar. Exemplo: Banco PostgreSQL com tabela 'pedidos' (id, cliente_id, valor, status, criado_em) e tabela 'clientes' (id, nome, cidade). Quero listar os 10 clientes com maior volume de compras nos ultimos 90 dias.",
  previsao: "Informe os dados historicos disponiveis e o que deseja projetar. Exemplo: Faturamento dos ultimos 6 meses: jan R$ 80k, fev R$ 75k, mar R$ 90k, abr R$ 85k, mai R$ 95k, jun R$ 100k. Quero projecao para os proximos 3 meses e os fatores de risco.",
  kpis: "Descreva o tipo de negocio, o setor e o principal objetivo estrategico do momento. Exemplo: Consultoria de RH com 3 consultores, foco em recrutamento para empresas de tecnologia, objetivo de crescer 40% no faturamento em 2026.",
  ata: "Informe os participantes, a pauta da reuniao, as decisoes tomadas e os responsaveis por cada acao. Exemplo: Reuniao de planejamento com Ana (diretora), Carlos (vendas) e Paula (financeiro). Pauta: lancamento do novo produto em julho, meta de 50 clientes no primeiro mes, orcamento de marketing de R$ 15.000.",
  resumo: "Cole o conteudo que deseja resumir ou descreva o documento. Exemplo: Resumir o contrato de locacao comercial de 8 paginas em ate 5 pontos principais, destacando prazo, valor, reajuste e clausulas de saida.",
  onboarding: "Informe o cargo do novo colaborador, as principais responsabilidades, as ferramentas que ira usar e o prazo de integracao desejado. Exemplo: Onboarding para assistente comercial, inicio em 02/06, responsavel por atendimento de leads e CRM, ferramentas: HubSpot e WhatsApp Business, integracao em 30 dias.",
  base_conhecimento: "Descreva o tema ou area que deseja documentar e o publico que ira consultar esse material. Exemplo: Base de conhecimento sobre o processo de atendimento ao cliente da empresa, desde a recepcao do lead ate o pos-venda, para ser consultada pelos novos colaboradores.",
  post_social: "Informe a rede social, o objetivo da publicacao e o tema. Exemplo: Post para LinkedIn anunciando a abertura de vaga para gerente comercial na nossa empresa, tom profissional mas acessivel, com chamada para candidatos enviarem curriculo.",
  blog: "Informe o tema do artigo, o publico-alvo e o objetivo. Exemplo: Artigo sobre como pequenas empresas podem reduzir a inadimplencia, publico: donos de comercio com equipe de ate 10 pessoas, objetivo: posicionar nossa consultoria financeira.",
  email_mkt: "Descreva o produto ou servico sendo promovido, a oferta especifica e o perfil do destinatario. Exemplo: Campanha para base de 500 clientes inativos, oferta de 20% de desconto na primeira recompra, prazo de 72 horas, produto: servicos de design grafico.",
  descricao: "Informe o nome do produto ou servico, suas principais caracteristicas, o publico-alvo e o canal onde sera publicado. Exemplo: Descricao para marketplace de curso online sobre gestao financeira para autonomos, carga horaria 8 horas, inclui planilhas e certificado.",
  orcamento: "Informe os itens do orcamento, quantidades, valores unitarios e o cliente. Exemplo: Orcamento para a empresa Gama SA: 1 projeto de identidade visual (R$ 4.500), 3 artes para redes sociais (R$ 300 cada), 1 manual de marca (R$ 1.200). Prazo de entrega: 20 dias. Validade do orcamento: 15 dias.",
  fluxo_caixa: "Descreva as principais entradas e saidas mensais do seu negocio. Exemplo: Receita mensal recorrente R$ 25.000, servicos avulsos media R$ 8.000. Custos fixos: aluguel R$ 3.500, folha R$ 12.000, ferramentas R$ 800. Custos variaveis: comissoes 5% sobre vendas, marketing R$ 2.000.",
  precificacao: "Informe os custos diretos, o tempo gasto, despesas fixas mensais e a margem desejada. Exemplo: Servico de consultoria financeira. Tempo medio por cliente: 8 horas/mes. Custo hora do meu tempo: R$ 120. Ferramentas e overhead: R$ 500/mes. Tenho 10 clientes. Quero margem de 40%.",
  nf_descritiva: "Informe o tipo de servico prestado, o cliente e qualquer detalhe relevante para a descricao fiscal. Exemplo: Servicos de consultoria em gestao de processos prestados a empresa Delta Ltda durante o mes de maio de 2026, conforme proposta comercial numero 047/2026.",
  lgpd: "Descreva sua empresa, os tipos de dados coletados e como sao utilizados. Exemplo: Empresa de software SaaS para pequenas empresas, coleta nome, email, CNPJ e dados de navegacao. Dados usados para prestacao do servico e envio de comunicacoes sobre o produto. Nao compartilhamos com terceiros.",
  termos_uso: "Descreva o produto ou servico, as principais regras de uso e as restricoes. Exemplo: Plataforma de gestao empresarial por assinatura mensal. Usuarios devem ser maiores de 18 anos. Proibido uso para fins ilegais. Cancelamento a qualquer momento com aviso de 30 dias.",
  nda: "Informe as partes envolvidas, o contexto da parceria e o tipo de informacao confidencial. Exemplo: NDA entre nossa empresa de tecnologia e um potencial parceiro de distribuicao. Informacoes confidenciais: base de clientes, codigos-fonte, estrategia de precificacao. Vigencia de 2 anos.",
  distrato: "Informe o contrato original que sera encerrado, as partes, o motivo e as condicoes de encerramento. Exemplo: Distrato do contrato de prestacao de servicos firmado em janeiro de 2026 entre a empresa Epsilon e o consultor Marcos Souza, encerramento amigavel por conclusao do projeto, sem pendencias financeiras.",
  descricao_vaga: "Informe o cargo, as principais responsabilidades, os requisitos e os beneficios oferecidos. Exemplo: Vaga para Analista Financeiro Junior, responsavel por contas a pagar e receber, conciliacao bancaria e relatorios. Requisitos: Excel avancado, curso superior em contabilidade ou administracao. Beneficios: VT, VR R$ 35/dia, plano de saude.",
  avaliacao_desemp: "Informe o cargo avaliado, o periodo de avaliacao e os criterios mais importantes para o negocio. Exemplo: Avaliacao semestral para vendedores. Criterios: atingimento de meta, qualidade no atendimento, prospecao ativa e uso do CRM. Escala de 1 a 5.",
  politica_interna: "Descreva o tema da politica e as principais regras que deseja documentar. Exemplo: Politica de uso de dispositivos moveis no ambiente de trabalho. Regras sobre uso de celular em reunioes, acesso a redes sociais no horario comercial e protecao de dados em aplicativos pessoais.",
  roteiro_entrevista: "Informe o cargo, o nivel de senioridade e as competencias mais importantes para a funcao. Exemplo: Entrevista para Coordenador de Atendimento ao Cliente, nivel pleno, competencias: lideranca de equipe, resolucao de conflitos, orientacao a resultados e comunicacao clara.",
  cold_call: "Informe o produto ou servico oferecido, o perfil do prospect e o principal problema que voce resolve. Exemplo: Script para oferecer servico de terceirizacao de departamento financeiro para donos de clinicas medicas com faturamento entre R$ 200k e R$ 800k/mes. Principal dor: falta de controle do fluxo de caixa.",
  proposta_parc: "Descreva as duas empresas, o modelo de parceria e os beneficios mutuos. Exemplo: Proposta de parceria entre nossa agencia de marketing digital e um escritorio de contabilidade. Modelo: indicacao mutua de clientes. Comissao de 10% sobre contratos fechados por indicacao. Publico em comum: MEIs e pequenas empresas.",
  followup: "Informe o contexto do contato anterior, o que foi discutido e o proximo passo desejado. Exemplo: Follow-up para cliente que assistiu nossa demonstracao do software ha 5 dias e nao respondeu. Ele mencionou interesse mas disse que precisava consultar o socio. Objetivo: marcar uma reuniao com os dois.",
  analise_conc: "Informe o nome do concorrente e o que deseja analisar. Exemplo: Analise da empresa ContaAzul em relacao ao nosso produto. Quero entender pontos fortes, fraquezas, posicionamento de preco, publico-alvo e oportunidades que eles nao estao atendendo.",
  briefing: "Descreva o projeto, o cliente, o objetivo, o prazo e o orcamento disponivel. Exemplo: Projeto de redesign do site institucional para escritorio de advocacia com 5 socios. Objetivo: transmitir credibilidade e gerar leads qualificados. Prazo: 45 dias. Orcamento: R$ 8.000. Entregaveis: layout, desenvolvimento e SEO basico.",
  proposta_free: "Informe o servico que sera prestado, o cliente, o escopo, o prazo e o valor. Exemplo: Proposta de gerenciamento de trafego pago para e-commerce de moda feminina. Escopo: gestao de Google Ads e Meta Ads, relatorio mensal. Duracao: 3 meses renovaveis. Investimento: R$ 1.800/mes + 10% sobre verba de midia.",
  contrato_free: "Descreva o servico, as partes envolvidas, o valor e as principais condicoes. Exemplo: Contrato de desenvolvimento de identidade visual entre Pedro Araujo (designer) e a empresa Zeta Comercio Ltda. Valor: R$ 5.500 em 2 parcelas. Prazo: 30 dias. Inclui: logo, paleta de cores, tipografia e manual de uso.",
  bio_prof: "Informe sua area de atuacao, principais conquistas, especialidades e onde a bio sera utilizada. Exemplo: Bio para LinkedIn de consultora de RH com 12 anos de experiencia, especializada em recrutamento para startups de tecnologia, responsavel pela contratacao de mais de 300 profissionais, palestrante e mentora de carreira.",
  roteiro_suporte: "Descreva o tipo de atendimento, os cenarios mais comuns e o tom de comunicacao da empresa. Exemplo: Roteiro para atendimento via WhatsApp de uma clinica odontologica. Cenarios: agendamento de consulta, cancelamento, duvidas sobre tratamentos e reclamacoes. Tom: acolhedor e profissional.",
  resp_reclamacao: "Descreva a reclamacao recebida e o contexto. Exemplo: Cliente reclamando que o servico de instalacao foi feito com atraso de 2 dias em relacao ao prazo combinado, causando transtorno em evento que ele havia organizado. Cliente esta irritado e ameaca cancelar o contrato anual.",
  pesq_satisfacao: "Informe o produto ou servico avaliado e o objetivo da pesquisa. Exemplo: Pesquisa de satisfacao para clientes do plano anual de nossa plataforma. Objetivo: identificar pontos de friccao antes da renovacao e coletar depoimentos para uso em marketing. Aplicar por email 30 dias antes do vencimento.",
  faq_produto: "Descreva o produto ou servico e as duvidas mais comuns que os clientes trazem. Exemplo: FAQ para plataforma de gestao de academias. Duvidas frequentes: como funciona o periodo de teste, quais formas de pagamento aceitas, como fazer backup dos dados, se funciona sem internet e como adicionar novos usuarios.",
  planilha_orcamento: "Informe os itens, quantidades e valores para montagem do orcamento. Exemplo: Orcamento de reforma comercial: demolicao de parede (R$ 2.800), pintura 200m2 (R$ 4.500), instalacao eletrica (R$ 6.200), forro de gesso 80m2 (R$ 3.100), piso vinilico 120m2 (R$ 7.800). Cliente: Farmacia Bem Estar. Validade: 10 dias.",
  planilha_fluxo: "Descreva as entradas e saidas mensais previstas para o periodo. Exemplo: Receitas: mensalidades R$ 35.000, projetos avulsos media R$ 12.000. Despesas fixas: folha R$ 18.000, aluguel R$ 4.200, softwares R$ 1.500, contador R$ 800. Despesas variaveis: comissoes 8%, material de escritorio media R$ 400.",
  apresentacao_ppt: "Descreva o objetivo da apresentacao, o publico e os topicos principais. Exemplo: Apresentacao para captar investidor anjo. Publico: 2 investidores do setor de tecnologia. Topicos: problema que resolvemos, solucao, mercado-alvo, modelo de receita, tracao atual (120 clientes, R$ 45k MRR) e uso do investimento.",
  relatorio_pdf: "Descreva o tipo de relatorio, o periodo e os dados relevantes. Exemplo: Relatorio executivo de desempenho comercial do segundo trimestre de 2026 para apresentacao ao conselho. Dados: faturamento R$ 1,2M (meta R$ 1,1M), 38 novos clientes, churn de 4%, NPS 72. Comparativo com Q1 e projecao Q3.",
};

// ─── MODULES ─────────────────────────────────────────────────────────────────

const MODULES = [
  { id:"operacoes", icon:"◈", label:"Operacoes", color:"#38bdf8", plan:"free",
    tools:[
      { id:"contrato",   name:"Emitir Contrato",       desc:"Contratos profissionais prontos para assinar",   plan:"free" },
      { id:"proposta",   name:"Proposta Comercial",     desc:"Propostas que fecham negocio",                  plan:"free" },
      { id:"relatorio",  name:"Relatorio Executivo",    desc:"Relatorios claros para decisoes rapidas",        plan:"free" },
      { id:"email_corp", name:"Comunicacao Corporativa",desc:"E-mails que representam sua empresa",           plan:"free" },
      { id:"ata",        name:"Registro de Reuniao",    desc:"Decisoes e tarefas documentadas com precisao",  plan:"free" },
      { id:"resumo",     name:"Sintese de Documento",   desc:"O essencial de qualquer documento em segundos", plan:"free" },
    ]},
  { id:"financeiro", icon:"◎", label:"Financeiro", color:"#fbbf24", plan:"free",
    tools:[
      { id:"orcamento",    name:"Elaborar Orcamento",       desc:"Orcamentos profissionais prontos para envio",  plan:"free" },
      { id:"fluxo_caixa",  name:"Fluxo de Caixa",           desc:"Controle financeiro do seu negocio",           plan:"essencial" },
      { id:"precificacao", name:"Calculo de Precificacao",   desc:"Preco justo com margem saudavel",              plan:"essencial" },
      { id:"nf_descritiva",name:"Descricao para Nota Fiscal",desc:"Texto adequado para emissao fiscal",          plan:"free" },
    ]},
  { id:"juridico", icon:"⬡", label:"Juridico", color:"#fb923c", plan:"essencial",
    tools:[
      { id:"lgpd",      name:"Politica de Privacidade", desc:"Adequacao a LGPD sem contratar advogado",      plan:"essencial" },
      { id:"termos_uso",name:"Termos de Uso",           desc:"Protecao juridica para seu produto ou servico", plan:"essencial" },
      { id:"nda",       name:"Acordo de Confidencialidade",desc:"Proteja suas informacoes estrategicas",      plan:"essencial" },
      { id:"distrato",  name:"Encerramento de Contrato",desc:"Finalize contratos com seguranca juridica",    plan:"profissional" },
    ]},
  { id:"pessoas", icon:"⬟", label:"Pessoas & RH", color:"#e879f9", plan:"free",
    tools:[
      { id:"descricao_vaga",    name:"Descricao de Vaga",       desc:"Atraia os profissionais certos",               plan:"free" },
      { id:"roteiro_entrevista",name:"Roteiro de Entrevista",   desc:"Selecao mais eficaz e estruturada",            plan:"free" },
      { id:"avaliacao_desemp",  name:"Avaliacao de Desempenho", desc:"Criterios claros para evolucao do time",       plan:"essencial" },
      { id:"politica_interna",  name:"Politica Interna",        desc:"Regras claras que alinham a equipe",           plan:"essencial" },
      { id:"onboarding",        name:"Plano de Integracao",     desc:"Novos colaboradores produtivos mais rapido",   plan:"essencial" },
    ]},
  { id:"crescimento", icon:"◆", label:"Crescimento", color:"#f472b6", plan:"free",
    tools:[
      { id:"post_social",   name:"Comunicacao de Marca",    desc:"Presenca digital que gera autoridade",         plan:"free" },
      { id:"blog",          name:"Artigo Institucional",    desc:"Conteudo que posiciona seu negocio",           plan:"free" },
      { id:"email_mkt",     name:"Campanha de E-mail",      desc:"Comunicacao direta que converte",              plan:"essencial" },
      { id:"descricao",     name:"Descricao de Produto",    desc:"Texto que comunica valor e gera venda",        plan:"free" },
    ]},
  { id:"vendas", icon:"⬢", label:"Vendas & CRM", color:"#2dd4bf", plan:"essencial",
    tools:[
      { id:"cold_call",     name:"Abordagem Comercial",     desc:"Scripts que geram interesse real",             plan:"essencial" },
      { id:"proposta_parc", name:"Proposta de Parceria",    desc:"Parcerias estrategicas bem estruturadas",      plan:"essencial" },
      { id:"followup",      name:"Reativacao de Cliente",   desc:"Mensagens que retomam negociacoes paradas",   plan:"free" },
      { id:"analise_conc",  name:"Inteligencia Competitiva",desc:"Mapeamento estrategico de concorrentes",      plan:"profissional" },
    ]},
  { id:"dados", icon:"◇", label:"Inteligencia", color:"#a78bfa", plan:"essencial",
    tools:[
      { id:"analise",  name:"Analise Estrategica",    desc:"Interpretacao de dados para decisoes precisas",  plan:"free" },
      { id:"kpis",     name:"Indicadores de Gestao",  desc:"Metricas certas para acompanhar seu negocio",   plan:"free" },
      { id:"previsao", name:"Projecao de Cenarios",   desc:"Antecipacao de tendencias e riscos",            plan:"essencial" },
      { id:"query",    name:"Consulta SQL",            desc:"Extraia o que precisa do seu banco de dados",   plan:"profissional" },
    ]},
  { id:"autonomo", icon:"◐", label:"Autonomo & Freelancer", color:"#60a5fa", plan:"free",
    tools:[
      { id:"briefing",      name:"Briefing de Projeto",      desc:"Alinhamento claro antes de comecar",           plan:"free" },
      { id:"proposta_free", name:"Proposta de Servico",      desc:"Propostas que se diferenciam da concorrencia", plan:"free" },
      { id:"contrato_free", name:"Contrato de Servico",      desc:"Protecao juridica em cada projeto",            plan:"free" },
      { id:"bio_prof",      name:"Perfil Profissional",      desc:"Apresentacao que gera credibilidade imediata", plan:"free" },
    ]},
  { id:"atendimento", icon:"◑", label:"Atendimento", color:"#34d399", plan:"free",
    tools:[
      { id:"resp_reclamacao", name:"Gestao de Reclamacao",   desc:"Resolucao de conflitos com profissionalismo",  plan:"free" },
      { id:"faq_produto",     name:"Central de Duvidas",     desc:"Respostas prontas para as duvidas frequentes", plan:"free" },
      { id:"roteiro_suporte", name:"Roteiro de Atendimento", desc:"Padrao de qualidade no suporte ao cliente",    plan:"essencial" },
      { id:"pesq_satisfacao", name:"Pesquisa de Satisfacao", desc:"Medicao de lealdade e pontos de melhoria",    plan:"essencial" },
    ]},
  { id:"premium", icon:"★", label:"Documentos & Planilhas", color:"#f59e0b", plan:"profissional",
    tools:[
      { id:"planilha_orcamento", name:"Planilha de Orcamento",   desc:"Orcamento em Excel pronto para download",     plan:"profissional", output:"xlsx" },
      { id:"planilha_fluxo",     name:"Planilha Fluxo de Caixa", desc:"Controle financeiro em Excel com formulas",   plan:"profissional", output:"xlsx" },
      { id:"apresentacao_ppt",   name:"Apresentacao Executiva",  desc:"Roteiro de slides para PowerPoint",           plan:"profissional", output:"pptx" },
      { id:"relatorio_pdf",      name:"Relatorio Formatado",     desc:"Relatorio completo em formato de documento",  plan:"profissional", output:"pdf"  },
    ]},
];

const TOOL_PROMPTS = {
  contrato:"Voce e especialista em direito empresarial brasileiro. Elabore um contrato profissional e completo. Inclua: qualificacao das partes, objeto, valor e condicoes de pagamento, prazo, obrigacoes de cada parte, confidencialidade, rescisao e foro. Linguagem juridica clara e objetiva.",
  proposta:"Voce e especialista em vendas consultivas. Elabore uma proposta comercial estruturada e persuasiva. Inclua: contexto do cliente, problema identificado, solucao proposta, diferenciais, investimento, condicoes e proximo passo. Tom profissional e direto.",
  relatorio:"Voce e especialista em comunicacao executiva. Elabore um relatorio executivo completo com sumario, analise dos dados, conclusoes e recomendacoes de acao. Linguagem direta, sem rodeios.",
  email_corp:"Voce e especialista em comunicacao corporativa. Escreva um e-mail profissional, claro e objetivo. Adeque o tom ao contexto descrito.",
  ata:"Voce e especialista em gestao empresarial. Elabore o registro da reuniao com: participantes, pauta, decisoes tomadas, responsaveis e prazos para cada acao. Formato claro e rastreavel.",
  resumo:"Voce e especialista em sintese executiva. Extraia os pontos essenciais do conteudo: principais conclusoes, decisoes, dados relevantes e acoes necessarias. Seja direto e objetivo.",
  orcamento:"Voce e especialista financeiro. Elabore um orcamento profissional detalhado com descricao dos itens, quantidades, valores unitarios e totais. Inclua condicoes de pagamento, prazo de entrega e validade do orcamento.",
  fluxo_caixa:"Voce e especialista em financas empresariais. Estruture um modelo de fluxo de caixa mensal organizado com entradas, saidas fixas, saidas variaveis, saldo operacional e saldo acumulado. Apresente em formato de tabela CSV.",
  precificacao:"Voce e especialista em precificacao de servicos e produtos. Calcule e justifique o preco adequado considerando custos diretos, overhead, margem de contribuicao e posicionamento de mercado. Apresente o raciocinio de forma clara.",
  nf_descritiva:"Voce e especialista em obrigacoes fiscais brasileiras. Escreva uma descricao tecnica e adequada para emissao de nota fiscal de servico, em conformidade com as exigencias municipais e federais.",
  lgpd:"Voce e especialista em LGPD e privacidade de dados. Elabore uma politica de privacidade completa e em conformidade com a Lei 13.709/2018. Inclua: dados coletados, finalidade, base legal, compartilhamento, direitos do titular e contato do DPO.",
  termos_uso:"Voce e especialista em direito digital. Elabore termos de uso completos e juridicamente adequados. Inclua: objeto, cadastro, responsabilidades, restricoes de uso, propriedade intelectual, limitacao de responsabilidade e foro.",
  nda:"Voce e especialista em contratos de confidencialidade. Elabore um NDA robusto e completo incluindo: definicao de informacao confidencial, obrigacoes das partes, excecoes, prazo, penalidades e foro.",
  distrato:"Voce e especialista em encerramento de contratos. Elabore um distrato formal documentando o encerramento do contrato original, quitacao mutua de obrigacoes e condicoes de transicao.",
  descricao_vaga:"Voce e especialista em atracacao de talentos. Escreva uma descricao de vaga clara e atrativa com: resumo da posicao, responsabilidades principais, requisitos obrigatorios e desejaveis, beneficios e cultura da empresa.",
  roteiro_entrevista:"Voce e especialista em selecao por competencias. Elabore um roteiro estruturado de entrevista com perguntas comportamentais, situacionais e tecnicas, adequadas ao perfil descrito. Inclua criterios de avaliacao para cada resposta.",
  avaliacao_desemp:"Voce e especialista em gestao de desempenho. Elabore um formulario de avaliacao completo com criterios objetivos, escala de pontuacao, espaco para evidencias e plano de desenvolvimento.",
  politica_interna:"Voce e especialista em gestao de pessoas e compliance. Elabore uma politica interna clara, objetiva e de facil aplicacao. Inclua objetivo, escopo, regras, responsabilidades e consequencias do descumprimento.",
  onboarding:"Voce e especialista em integracao de colaboradores. Elabore um plano de integracao estruturado com atividades por periodo (primeiro dia, primeira semana, primeiro mes), responsaveis, recursos necessarios e criterios de conclusao.",
  post_social:"Voce e especialista em comunicacao digital corporativa. Crie conteudo estrategico para redes sociais que construa autoridade e gere engajamento genuino. Adeque o formato e linguagem a rede descrita.",
  blog:"Voce e especialista em producao de conteudo institucional. Escreva um artigo completo, bem estruturado e tecnicamente preciso. Inclua introducao, desenvolvimento com subtopicos e conclusao com chamada para acao.",
  email_mkt:"Voce e especialista em comunicacao direta e conversao. Escreva uma campanha de e-mail com assunto de alta abertura, corpo persuasivo e chamada para acao clara. Tom adequado ao perfil do destinatario.",
  descricao:"Voce e especialista em comunicacao de valor. Escreva a descricao do produto ou servico focando nos beneficios reais ao usuario, nao apenas nas caracteristicas. Clara, objetiva e persuasiva.",
  analise:"Voce e analista de negocios senior. Analise os dados fornecidos, identifique padroes relevantes, riscos e oportunidades. Entregue insights acionaveis com recomendacoes claras.",
  kpis:"Voce e especialista em gestao por indicadores. Defina os KPIs mais relevantes para o contexto descrito. Para cada indicador: nome, como calcular, frequencia de medicao e meta recomendada.",
  previsao:"Voce e especialista em planejamento e cenarios. Com base nos dados fornecidos, projete cenarios pessimista, realista e otimista. Identifique os principais fatores de risco e oportunidade em cada cenario.",
  query:"Voce e especialista em banco de dados. Escreva a query SQL otimizada para o objetivo descrito. Inclua comentarios explicando a logica de cada parte relevante.",
  cold_call:"Voce e especialista em vendas consultivas. Elabore um script de abordagem comercial com: abertura que gera rapport, qualificacao rapida, pitch de valor e encaminhamento para proximo passo. Natural e sem ar de script decorado.",
  proposta_parc:"Voce e especialista em desenvolvimento de parcerias estrategicas. Elabore uma proposta de parceria com: contexto, beneficios mutuos, modelo operacional, responsabilidades de cada parte e criterios de sucesso.",
  followup:"Voce e especialista em reativacao comercial. Escreva uma mensagem de followup que retome o interesse sem pressionar. Tom natural, que demonstre valor e facilite o proximo passo.",
  analise_conc:"Voce e especialista em inteligencia competitiva. Conduza uma analise estruturada do concorrente descrito: posicionamento, pontos fortes, vulnerabilidades, publico-alvo, modelo de receita e oportunidades de diferenciacao.",
  briefing:"Voce e especialista em gestao de projetos. Elabore um briefing completo e rastreavel: objetivo do projeto, escopo, entregaveis, prazos, responsaveis, orcamento e criterios de aceite.",
  proposta_free:"Voce e especialista em precificacao e vendas para profissionais autonomos. Elabore uma proposta de servico profissional que comunique valor, detalhe o escopo, proteja o profissional e facilite o fechamento.",
  contrato_free:"Voce e especialista em contratos para profissionais autonomos e MEIs. Elabore um contrato de prestacao de servicos completo e equilibrado para ambas as partes. Inclua objeto, valor, prazo, entregas, revisoes, rescisao e propriedade intelectual.",
  bio_prof:"Voce e especialista em posicionamento e marca pessoal. Escreva um perfil profissional que comunique autoridade, especializacao e resultados reais. Adequado ao canal e publico descritos.",
  resp_reclamacao:"Voce e especialista em gestao de relacionamento com clientes. Elabore uma resposta profissional e empatica para a reclamacao descrita. Reconheca o problema, apresente solucao concreta e resgate a confianca do cliente.",
  faq_produto:"Voce e especialista em experiencia do cliente. Elabore uma central de duvidas completa e clara. Antecipe as questoes que geram atrito na jornada do cliente e responda de forma direta e util.",
  roteiro_suporte:"Voce e especialista em operacoes de atendimento. Elabore um roteiro de atendimento padronizado para os cenarios descritos. Inclua abertura, tratamento de cada situacao, escalada quando necessario e encerramento.",
  pesq_satisfacao:"Voce e especialista em voz do cliente e NPS. Elabore uma pesquisa de satisfacao estrategica com perguntas que revelem pontos de friccao, nivel de lealdade e oportunidades de melhoria. Inclua escala e logica de aplicacao.",
  planilha_orcamento:"Voce e especialista financeiro. Crie um orcamento detalhado em formato CSV com colunas: Item,Descricao,Quantidade,Valor Unitario,Valor Total. Inclua linha de cabecalho com empresa e cliente. Ao final adicione linha de TOTAL. Formate como CSV puro sem markdown.",
  planilha_fluxo:"Voce e especialista financeiro. Crie fluxo de caixa mensal em formato CSV com colunas: Categoria,Tipo,Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez,Total. Grupos: Receitas Operacionais, Custos Fixos, Custos Variaveis, Saldo. Para totais use formulas Excel. CSV puro sem markdown.",
  apresentacao_ppt:"Voce e especialista em apresentacoes executivas. Crie roteiro de apresentacao com estrutura: SLIDE [numero]: [Titulo] | Conteudo: [topicos em bullet] | Nota: [orientacao ao apresentador]. Um slide por linha. Linguagem executiva e direta.",
  relatorio_pdf:"Voce e especialista em comunicacao executiva. Elabore relatorio completo com secoes: SUMARIO EXECUTIVO, ANALISE DETALHADA, PRINCIPAIS INDICADORES, CONCLUSOES E RECOMENDACOES. Formatacao clara com titulos e subtitulos.",
};

const PLANS = [
  { id:"free",         name:"Basico",      price:"R$ 0",    period:"",     gens:"10 operacoes/mes",      gensLimit:10,    users:"1 usuario",           highlight:false, features:["Modulo Operacoes completo","Modulo Autonomo completo","10 operacoes por mes","Historico de 7 dias","Suporte por e-mail"] },
  { id:"essencial",    name:"Essencial",   price:"R$ 147",  period:"/mes", gens:"200 operacoes/mes",     gensLimit:200,   users:"2 usuarios",           highlight:false, features:["Tudo do Basico","Modulos Financeiro, Juridico e Vendas","200 operacoes/mes","2 usuarios","Historico completo","Suporte prioritario"] },
  { id:"profissional", name:"Profissional",price:"R$ 347",  period:"/mes", gens:"600 operacoes/mes",     gensLimit:600,   users:"5 usuarios",           highlight:true,  features:["Tudo do Essencial","Todos os modulos","600 operacoes/mes","5 usuarios","Download Excel e PDF","Inteligencia Competitiva","Suporte dedicado"] },
  { id:"gestao",       name:"Gestao",      price:"R$ 597",  period:"/mes", gens:"Operacoes ilimitadas",  gensLimit:99999, users:"15 usuarios",          highlight:false, features:["Tudo do Profissional","Operacoes ilimitadas","15 usuarios","Onboarding guiado","API de integracao","SLA garantido","Gerente de conta"] },
];

const PLAN_ORDER = { free:0, essencial:1, starter:1, profissional:2, business:2, gestao:3, unlimited:3, enterprise:3 };

const MP_LINKS = {
  essencial:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_ESSENCIAL",
  profissional:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_PROFISSIONAL",
  gestao:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_GESTAO",
};

const FAQS = [
  { q:"O Arcane substitui um funcionario ou departamento?", a:"O Arcane centraliza as operacoes que normalmente exigiriam um time dedicado de juridico, financeiro e marketing. Para empresas de ate 10 pessoas, ele funciona como um departamento completo disponivel 24 horas." },
  { q:"Os dados da minha empresa ficam protegidos?", a:"Sim. Utilizamos criptografia de ponta a ponta e seus dados nunca sao utilizados para nenhuma outra finalidade. Seguimos todas as diretrizes da LGPD." },
  { q:"Posso cancelar quando quiser?", a:"Sim, sem burocracia. O cancelamento e imediato e voce mantem acesso ate o final do periodo ja pago." },
  { q:"O plano Basico tem limitacoes?", a:"O plano Basico oferece 10 operacoes por mes nos modulos Operacoes e Autonomo. Para uso profissional com acesso completo, recomendamos o plano Essencial ou Profissional." },
  { q:"Como funcionam os downloads de planilha e documento?", a:"No plano Profissional, o sistema elabora o conteudo estruturado e converte automaticamente para Excel ou documento de texto. O download e feito diretamente pelo navegador em segundos." },
];

const HOW_STEPS = [
  { n:"01", title:"Acesse sua conta",       desc:"Cadastro em menos de 2 minutos. Sem cartao de credito para comecar." },
  { n:"02", title:"Selecione o modulo",     desc:"10 modulos especializados cobrindo todas as areas do seu negocio." },
  { n:"03", title:"Descreva sua demanda",   desc:"Informe os detalhes da sua necessidade. Quanto mais contexto, melhor o resultado." },
  { n:"04", title:"Receba e utilize",       desc:"Documento pronto em segundos. Copie, exporte ou encaminhe diretamente." },
];

const REVIEWS = [
  { name:"Carlos Mendonca", role:"Diretor Comercial", stars:5, text:"Reduzi o tempo de elaboracao de propostas de 2 horas para 8 minutos. O Arcane se pagou no primeiro dia de uso." },
  { name:"Fernanda Lima", role:"Advogada — OAB/SP", stars:5, text:"Os contratos e acordos de confidencialidade gerados sao de qualidade profissional. Adapto em minutos e encaminho ao cliente com total confianca." },
  { name:"Rodrigo Sampaio", role:"Gerente de Vendas", stars:5, text:"Os scripts de abordagem e os followups transformaram nossa taxa de conversao. Resultado mensuravel desde a primeira semana." },
  { name:"Mariana Torres", role:"Consultora de Marca", stars:5, text:"Como profissional autonoma, uso contratos e propostas toda semana. Profissional, rapido e sem nenhuma curva de aprendizado." },
  { name:"Pedro Alves", role:"Head de Dados", stars:5, text:"A qualidade das analises e das queries SQL e impressionante. Economizo horas de trabalho a cada operacao." },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function useScrollReveal() {
  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function canUseTool(userPlan, toolPlan) {
  return (PLAN_ORDER[userPlan] || 0) >= (PLAN_ORDER[toolPlan] || 0);
}

function Stars({ n }) {
  return <span>{Array.from({length:n}).map((_,i)=><span key={i} className="star">★</span>)}</span>;
}

function Toast({ message, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{message}</div>;
}

function Logo({ size = 18 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:size+10, height:size+10, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}>
        <span style={{ fontFamily:"Space Mono,monospace", fontSize:size*0.55, fontWeight:700, color:"#000" }}>A</span>
      </div>
      <span style={{ fontFamily:"Space Mono,monospace", fontSize:size, fontWeight:700, letterSpacing:4, color:"#EAEAEA", textTransform:"uppercase" }}>ARCANE</span>
    </div>
  );
}

function PlanBadge({ plan }) {
  const label = plan === "free" ? "basico" : plan;
  return <span className={`badge badge-${plan}`}>{label}</span>;
}

// ─── DOWNLOAD HELPERS ─────────────────────────────────────────────────────────

async function downloadAsExcel(content, filename) {
  try {
    const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
    const lines = content.split("\n").filter(l => l.trim() !== "" && !l.includes("```"));
    const data = lines.map(l => l.split(",").map(c => {
      let val = c.trim().replace(/^"|"$/g,"");
      if (val.startsWith("=")) return { f: val.substring(1) };
      if (!isNaN(val) && val !== "") return Number(val);
      return val;
    }));
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Arcane");
    XLSX.writeFile(wb, filename + ".xlsx");
  } catch(e) {
    const blob = new Blob([content], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=filename+".csv"; a.click();
    URL.revokeObjectURL(url);
  }
}

function downloadAsText(content, filename, ext, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename+"."+ext; a.click();
  URL.revokeObjectURL(url);
}

async function handlePremiumDownload(tool, content) {
  if (!content) return;
  const filename = "arcane-" + tool.id + "-" + Date.now();
  if (tool.output === "xlsx") await downloadAsExcel(content, filename);
  else downloadAsText(content, filename, "txt", "text/plain");
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────

function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setLoading(true); setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email:form.email, password:form.password } : { name:form.name, email:form.email, password:form.password };
      const res = await fetch(BACKEND_URL + endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao autenticar");
      localStorage.setItem("arcane_token", data.access_token);
      localStorage.setItem("arcane_user", JSON.stringify(data.user));
      onSuccess(data.user);
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:C.bg }}>
      <style>{G}</style>
      <div style={{ width:"44%", background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 64px" }}>
        <Logo size={18} />
        <div style={{ marginTop:64 }}>
          <div className="tag">Sistema de Gestao</div>
          <h2 style={{ fontSize:32, fontWeight:300, lineHeight:1.2, marginBottom:20, color:C.text }}>Sua empresa operando<br />em <span style={{ color:C.accent }}>outro nivel</span></h2>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.8, marginBottom:36 }}>Mais de 40 modulos especializados para empresas e profissionais autonomos brasileiros.</p>
          {["Operacoes, Financeiro, Juridico e RH em um sistema","Resultados prontos para uso em menos de 30 segundos","100% em portugues, desenvolvido para o mercado brasileiro"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <span style={{ color:C.accent, fontSize:10 }}>▶</span>
              <span style={{ color:C.muted, fontSize:13 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:48, paddingTop:28, borderTop:`1px solid ${C.border}` }}>
          <div style={{ color:C.hint, fontSize:10, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Acesso basico inclui</div>
          <div style={{ color:C.muted, fontSize:13 }}>10 operacoes/mes · Modulos essenciais · Sem cartao de credito</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 64px" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h3 style={{ fontSize:24, fontWeight:500, marginBottom:8, color:C.text }}>{mode==="login"?"Acesse sua conta":"Criar conta"}</h3>
            <p style={{ color:C.muted, fontSize:14 }}>{mode==="login"?"Entre para continuar no Arcane":"Comece sem custo, sem cartao de credito"}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {mode==="register"&&(
              <div>
                <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:8 }}>Nome completo</label>
                <input placeholder="Seu nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </div>
            )}
            <div>
              <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:8 }}>E-mail</label>
              <input type="email" placeholder="seu@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:8 }}>Senha</label>
              <input type="password" placeholder="Minimo 6 caracteres" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            {error&&<div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", padding:"12px 16px", fontSize:13, color:"#fca5a5", borderRadius:8 }}>⚠ {error}</div>}
            <button className="btn-primary" onClick={handle} disabled={loading} style={{ width:"100%", height:48, fontSize:13, marginTop:4 }}>
              {loading?"Aguarde...":mode==="login"?"ACESSAR O SISTEMA":"CRIAR CONTA"}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:24, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
            <span style={{ color:C.muted, fontSize:14 }}>{mode==="login"?"Ainda nao tem conta? ":"Ja tem conta? "}</span>
            <span onClick={onSwitch} style={{ color:C.accent, cursor:"pointer", fontSize:14, fontWeight:500 }}>{mode==="login"?"Criar agora →":"Acessar →"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP DASHBOARD ────────────────────────────────────────────────────────────

function AppDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool,   setActiveTool]   = useState(null);
  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [input,  setInput]  = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState("");
  const [usedCount, setUsedCount] = useState(0);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arcane_history") || "[]"); } catch{ return []; }
  });
  const [selectedHistory, setSelectedHistory] = useState(null);

  const currentModule = MODULES.find(m=>m.id===activeModule);
  const plan       = PLANS.find(p=>p.id===(user.plan||"free")) || PLANS[0];
  const limitCount = plan.gensLimit;
  const usagePct   = limitCount>=99999 ? 0 : Math.min((usedCount/limitCount)*100,100);
  const remaining  = limitCount>=99999 ? "inf" : Math.max(limitCount-usedCount,0);

  const saveHistory = (tool, inp, res) => {
    const entry = { id:Date.now(), tool:tool.name, module:currentModule?.label, input:inp, result:res, date: new Date().toLocaleDateString("pt-BR") };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem("arcane_history", JSON.stringify(updated));
  };

  const generate = async () => {
    if (!activeTool||!input.trim()) return;
    if (!canUseTool(user.plan, activeTool.plan)) {
      setToast(`Este modulo requer o plano ${activeTool.plan.toUpperCase()} ou superior.`);
      return;
    }
    if (remaining!=="inf"&&remaining<=0) { setToast("Limite do plano atingido. Considere fazer upgrade."); return; }
    setLoading(true); setResult("");
    try {
      const token = localStorage.getItem("arcane_token");
      const systemPrompt = TOOL_PROMPTS[activeTool.id] || "Voce e um especialista de negocios. Elabore o conteudo solicitado de forma profissional e objetiva.";
      const res = await fetch(BACKEND_URL+"/ai/generate",{
        method:"POST",
        headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
        body:JSON.stringify({ tool:activeTool.id, input, system_prompt:systemPrompt }),
      });
      const data = await res.json();
      if (res.status===422||res.status===401) { localStorage.removeItem("arcane_token"); localStorage.removeItem("arcane_user"); window.location.reload(); return; }
      if (!res.ok) throw new Error(data.error||"Erro ao processar a operacao");
      const output = data.output||data.result||data.content||"";
      setResult(output);
      if (data.used!==undefined) setUsedCount(data.used);
      saveHistory(activeTool, input, output);
    } catch(e) { setToast(e.message); }
    setLoading(false);
  };

  const copyResult = () => { navigator.clipboard.writeText(result); setToast("Conteudo copiado."); };
  const navTo = (tab) => { setActiveTab(tab); setActiveModule(null); setActiveTool(null); setResult(""); setInput(""); };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <style>{G}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}` }}><Logo size={14} /></div>
        <div style={{ flex:1, overflowY:"auto", padding:"10px 0" }}>
          <div style={{ padding:"0 20px 6px", fontSize:9, color:C.hint, letterSpacing:3, textTransform:"uppercase" }}>Principal</div>
          <div className={`nav-item ${activeTab==="dashboard"&&!activeModule?"active":""}`} onClick={()=>navTo("dashboard")}>
            <span style={{ fontSize:14 }}>⊞</span><span>Painel</span>
          </div>
          <div className={`nav-item ${activeTab==="history"?"active":""}`} onClick={()=>navTo("history")}>
            <span style={{ fontSize:14 }}>◷</span><span>Historico</span>
            {history.length>0&&<span style={{ marginLeft:"auto", fontSize:10, background:C.accentDim, color:C.accent, padding:"1px 7px", borderRadius:20 }}>{history.length}</span>}
          </div>
          <div className={`nav-item ${activeTab==="upgrade"?"active":""}`} onClick={()=>navTo("upgrade")}>
            <span style={{ fontSize:14 }}>⬆</span><span>Planos</span>
          </div>
          <div style={{ padding:"12px 20px 6px", fontSize:9, color:C.hint, letterSpacing:3, textTransform:"uppercase", marginTop:4 }}>Modulos</div>
          {MODULES.map(mod=>(
            <div key={mod.id} className={`nav-item ${activeModule===mod.id?"active":""}`}
              onClick={()=>{ setActiveModule(mod.id); setActiveTool(null); setResult(""); setActiveTab("module"); }}>
              <span style={{ color:mod.color, fontSize:13 }}>{mod.icon}</span>
              <span style={{ flex:1 }}>{mod.label}</span>
              {!canUseTool(user.plan, mod.plan)&&<span style={{ fontSize:10 }}>🔒</span>}
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9, color:C.hint, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Plano {plan.name}</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{remaining==="inf"?"Ilimitado":`${remaining} de ${limitCount} operacoes restantes`}</div>
          <div className="usage-bar"><div className="usage-fill" style={{ width:`${usagePct}%` }} /></div>
          {plan.id!=="gestao"&&<div onClick={()=>navTo("upgrade")} style={{ marginTop:10, fontSize:11, color:C.accent, cursor:"pointer" }}>Upgrade de plano →</div>}
          <button className="logout-btn" onClick={onLogout}>
            <span style={{ fontSize:13 }}>→</span> Sair da conta
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:C.text }}>
              {activeTab==="history"?"Historico":activeTab==="upgrade"?"Planos":activeModule?currentModule?.label:"Painel"}
            </div>
            <div style={{ fontSize:11, color:C.hint }}>
              {activeTab==="history"?"Operacoes realizadas":activeTab==="upgrade"?"Gerencie seu plano":activeModule?`${currentModule?.tools.length} modulos disponiveis`:"Visao geral do sistema"}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, color:C.muted }}>{user.name||user.email}</div>
              <div style={{ fontSize:10, color:C.accent, letterSpacing:1, textTransform:"uppercase" }}>{plan.name}</div>
            </div>
            <div style={{ width:34, height:34, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#000", borderRadius:8 }}>
              {(user.name||user.email||"U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding:28 }}>

          {/* PAINEL */}
          {activeTab==="dashboard"&&!activeModule&&(
            <>
              <div style={{ marginBottom:24 }}>
                <div className="section-label">Visao Geral</div>
                <h2 style={{ fontSize:26, fontWeight:400, color:C.text, marginBottom:4 }}>Bom dia, <span style={{ color:C.accent }}>{user.name||"bem-vindo"}</span></h2>
                <p style={{ color:C.muted, fontSize:13 }}>Selecione um modulo para comecar a operar.</p>
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"16px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", borderLeft:"3px solid #38bdf8", borderRadius:C.radius }}>
                <div>
                  <div style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Uso do periodo — Plano {plan.name}</div>
                  <div style={{ fontSize:20, fontFamily:"Space Mono,monospace", color:C.accent }}>{usedCount} <span style={{ fontSize:13, color:C.muted }}>de {limitCount===99999?"ilimitado":limitCount} operacoes</span></div>
                </div>
                <div style={{ width:160 }}>
                  <div style={{ fontSize:11, color:C.muted, textAlign:"right", marginBottom:4 }}>{remaining==="inf"?"Sem limite":`${remaining} restantes`}</div>
                  <div className="usage-bar"><div className="usage-fill" style={{ width:`${usagePct}%` }} /></div>
                  {plan.id!=="gestao"&&<div onClick={()=>navTo("upgrade")} style={{ fontSize:10, color:C.accent, cursor:"pointer", textAlign:"right", marginTop:4 }}>Ver planos →</div>}
                </div>
              </div>
              {history.length>0&&(
                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div className="section-label" style={{ margin:0 }}>Operacoes Recentes</div>
                    <span onClick={()=>navTo("history")} style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>Ver historico completo →</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {history.slice(0,3).map(h=>(
                      <div key={h.id} className="history-item" onClick={()=>{ setSelectedHistory(h); navTo("history"); }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{h.tool}</span>
                          <span style={{ fontSize:10, color:C.hint }}>{h.date}</span>
                        </div>
                        <div style={{ fontSize:11, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.input}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="section-label">Modulos do Sistema</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {MODULES.map(mod=>(
                  <div key={mod.id} className="tool-card" onClick={()=>{ setActiveModule(mod.id); setActiveTool(null); setActiveTab("module"); }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                      <div style={{ width:38, height:38, background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, borderRadius:8 }}>
                        <span style={{ color:mod.color }}>{mod.icon}</span>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{mod.label}</div>
                        <div style={{ fontSize:11, color:C.hint }}>{mod.tools.length} modulos</div>
                      </div>
                      {!canUseTool(user.plan, mod.plan)&&<span style={{ fontSize:10 }}>🔒</span>}
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {mod.tools.slice(0,3).map(tool=>(
                        <span key={tool.id} style={{ fontSize:10, color:C.hint, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, padding:"3px 8px", borderRadius:20 }}>{tool.name}</span>
                      ))}
                      {mod.tools.length>3&&<span style={{ fontSize:10, color:C.accent, padding:"3px 8px" }}>+{mod.tools.length-3}</span>}
                    </div>
                    <div style={{ marginTop:14, fontSize:10, color:mod.color, letterSpacing:1 }}>ACESSAR MODULO →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* HISTORICO */}
          {activeTab==="history"&&(
            <>
              <div style={{ marginBottom:24 }}>
                <div className="section-label">Historico</div>
                <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>Operacoes realizadas</h2>
                <p style={{ color:C.muted, fontSize:13 }}>{history.length} operacoes registradas neste dispositivo</p>
              </div>
              {history.length===0?(
                <div style={{ textAlign:"center", padding:"60px 0", color:C.hint }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>◷</div>
                  <p>Nenhuma operacao registrada. Acesse um modulo para comecar.</p>
                </div>
              ):(
                <div style={{ display:"grid", gridTemplateColumns:selectedHistory?"1fr 1fr":"1fr", gap:20 }}>
                  <div>
                    {history.map(h=>(
                      <div key={h.id} className="history-item" style={{ borderColor:selectedHistory?.id===h.id?C.accent:C.border }} onClick={()=>setSelectedHistory(selectedHistory?.id===h.id?null:h)}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <div>
                            <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{h.tool}</span>
                            {h.module&&<span style={{ fontSize:10, color:C.muted, marginLeft:8 }}>— {h.module}</span>}
                          </div>
                          <span style={{ fontSize:10, color:C.hint }}>{h.date}</span>
                        </div>
                        <div style={{ fontSize:11, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.input}</div>
                      </div>
                    ))}
                    {history.length>0&&<button onClick={()=>{ if(window.confirm("Limpar todo o historico?")){setHistory([]);localStorage.removeItem("arcane_history");setSelectedHistory(null);} }} style={{ background:"transparent", color:C.hint, fontSize:11, marginTop:12, padding:0 }}>Limpar historico</button>}
                  </div>
                  {selectedHistory&&(
                    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:C.radius, padding:20, height:"fit-content", position:"sticky", top:90 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                        <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{selectedHistory.tool}</div>
                        <button onClick={()=>{navigator.clipboard.writeText(selectedHistory.result);setToast("Conteudo copiado.");}} style={{ background:"transparent", color:C.accent, fontSize:11, padding:0 }}>COPIAR</button>
                      </div>
                      <div style={{ fontSize:11, color:C.hint, marginBottom:10, fontStyle:"italic" }}>{selectedHistory.input}</div>
                      <div style={{ fontSize:13, color:C.muted, lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:400, overflowY:"auto" }}>{selectedHistory.result}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* PLANOS */}
          {activeTab==="upgrade"&&(
            <>
              <div style={{ marginBottom:32 }}>
                <div className="section-label">Planos</div>
                <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>Gerencie seu plano</h2>
                <p style={{ color:C.muted, fontSize:13 }}>Voce esta no plano <span style={{ color:C.accent, fontWeight:500 }}>{plan.name}</span>.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:32 }}>
                {PLANS.map((p)=>(
                  <div key={p.id} style={{ background:p.highlight?C.accentDim:C.card, border:`1.5px solid ${p.id===plan.id?C.accent:p.highlight?C.accentD:C.border}`, padding:22, borderRadius:C.radius, position:"relative", boxShadow:p.highlight?"0 0 32px rgba(56,189,248,0.12)":"none" }}>
                    {p.highlight&&<div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#000", fontSize:9, fontWeight:700, padding:"3px 14px", letterSpacing:2, whiteSpace:"nowrap", textTransform:"uppercase", borderRadius:20 }}>MAIS ESCOLHIDO</div>}
                    {p.id===plan.id&&<div style={{ position:"absolute", top:12, right:12, fontSize:9, color:C.accent, fontWeight:600, letterSpacing:1 }}>ATUAL</div>}
                    <div style={{ fontSize:11, fontWeight:600, color:C.text, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{p.name}</div>
                    <div style={{ marginBottom:4 }}>
                      <span style={{ fontFamily:"Space Mono,monospace", fontSize:26, fontWeight:400, color:p.highlight?C.accent:C.text }}>{p.price}</span>
                      <span style={{ color:C.muted, fontSize:12 }}>{p.period}</span>
                    </div>
                    <div style={{ color:C.hint, fontSize:10, marginBottom:16 }}>{p.gens} · {p.users}</div>
                    <div style={{ height:1, background:C.border, marginBottom:16 }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                      {p.features.map((f,fi)=>(
                        <div key={fi} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:11, color:C.muted }}>
                          <span style={{ color:C.accent, fontSize:8, marginTop:3 }}>▶</span>{f}
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>{ if(p.id==="free"){return;}else{window.open(MP_LINKS[p.id],"_blank");} }}
                      disabled={p.id===plan.id}
                      className={p.highlight?"btn-primary":"btn-ghost"}
                      style={{ width:"100%", height:40, fontSize:11, letterSpacing:1 }}>
                      {p.id===plan.id?"PLANO ATUAL":p.id==="free"?"SEM CUSTO":"ASSINAR"}
                    </button>
                    {p.id!=="free"&&p.id!==plan.id&&<div style={{ textAlign:"center", marginTop:8, fontSize:10, color:C.hint }}>PIX · Cartao · Boleto</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MODULO */}
          {activeTab==="module"&&activeModule&&!activeTool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
                <button onClick={()=>navTo("dashboard")} style={{ background:"transparent", color:C.muted, fontSize:11, padding:0, letterSpacing:1 }}>← PAINEL</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{currentModule?.label}</span>
              </div>
              <div className="section-label">{currentModule?.label}</div>
              <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>{currentModule?.label}</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Selecione o modulo para iniciar a operacao.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
                {currentModule?.tools.map(tool=>{
                  const locked = !canUseTool(user.plan, tool.plan);
                  return (
                    <div key={tool.id} className="tool-card"
                      onClick={()=>{ if(locked){setToast(`Este modulo requer o plano ${tool.plan.toUpperCase()}.`);navTo("upgrade");}else{setActiveTool(tool);} }}
                      style={{ opacity:locked?0.65:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <div style={{ fontSize:9, color:currentModule.color, letterSpacing:2, textTransform:"uppercase" }}>{currentModule.icon} {currentModule.label}</div>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <PlanBadge plan={tool.plan}/>
                          {tool.output&&<span style={{ fontSize:9, color:"#fbbf24", background:"rgba(251,191,36,0.1)", padding:"2px 6px", borderRadius:4 }}>{tool.output.toUpperCase()}</span>}
                          {locked&&<span>🔒</span>}
                        </div>
                      </div>
                      <div style={{ fontSize:15, fontWeight:500, color:C.text, marginBottom:6 }}>{tool.name}</div>
                      <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{tool.desc}</div>
                      <div style={{ marginTop:14, fontSize:10, color:locked?C.hint:C.accent, letterSpacing:1 }}>{locked?"REQUER UPGRADE →":"INICIAR OPERACAO →"}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* FERRAMENTA */}
          {activeTab==="module"&&activeModule&&activeTool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
                <button onClick={()=>{ setActiveTool(null); setResult(""); setInput(""); }} style={{ background:"transparent", color:C.muted, fontSize:11, padding:0, letterSpacing:1 }}>← VOLTAR</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{activeTool.name}</span>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4 }}>
                <div className="section-label" style={{ margin:0 }}>{currentModule?.label}</div>
                <PlanBadge plan={activeTool.plan}/>
                {activeTool.output&&<span style={{ fontSize:9, color:"#fbbf24", background:"rgba(251,191,36,0.1)", padding:"2px 8px", borderRadius:4, fontWeight:600 }}>EXPORTA {activeTool.output.toUpperCase()}</span>}
              </div>
              <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>{activeTool.name}</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>{activeTool.desc}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div>
                  <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:10 }}>Informe os detalhes da operacao</label>
                  <textarea
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    placeholder={TOOL_PLACEHOLDERS[activeTool.id] || "Descreva com detalhes o que precisa. Quanto mais contexto voce fornecer, mais preciso sera o resultado."}
                    rows={10}
                    style={{ resize:"vertical" }}
                  />
                  <button className="btn-primary" onClick={generate} disabled={loading||!input.trim()} style={{ marginTop:12, width:"100%", height:48, fontSize:12 }}>
                    {loading?"PROCESSANDO...":"EXECUTAR"}
                  </button>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase" }}>Resultado</label>
                    <div style={{ display:"flex", gap:10 }}>
                      {result&&<button onClick={copyResult} style={{ background:"transparent", color:C.accent, fontSize:10, padding:0, letterSpacing:1 }}>COPIAR</button>}
                      {result&&activeTool.output&&<button onClick={()=>handlePremiumDownload(activeTool,result)} style={{ background:"rgba(251,191,36,0.1)", color:"#fbbf24", fontSize:10, padding:"4px 10px", borderRadius:6, border:"1px solid rgba(251,191,36,0.2)" }}>EXPORTAR {activeTool.output.toUpperCase()}</button>}
                    </div>
                  </div>
                  <div className="result-box">
                    {loading
                      ?<div style={{ display:"flex", alignItems:"center", gap:10, color:C.muted }}><div style={{ animation:"pulse 1.2s ease infinite", color:C.accent }}>▶</div>Processando...</div>
                      :result||<span style={{ color:C.hint }}>O resultado da operacao sera exibido aqui.</span>
                    }
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      {toast&&<Toast message={toast} onClose={()=>setToast("")} />}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  React.useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", overflowX:"hidden" }}>
      <style>{G}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(6,6,8,0.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all 0.3s" }}>
        <Logo size={17} />
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {["Como Funciona","Modulos","Planos","FAQ"].map(item=>(
            <a key={item} className="nav-link" href={`#${item.toLowerCase().replace(" ","-")}`}>{item}</a>
          ))}
          <div style={{ width:1, height:20, background:C.border, margin:"0 10px" }} />
          <button className="btn-ghost" onClick={onLogin} style={{ height:38, padding:"0 20px", fontSize:11 }}>Acessar</button>
          <button className="btn-primary" onClick={onRegister} style={{ height:38, padding:"0 20px", fontSize:11 }}>Comecar sem custo</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:64 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.35, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:700, height:700, background:"radial-gradient(circle,rgba(56,189,248,0.09) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 48px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:820 }}>
            <div className="tag anim-fi" style={{ animationDelay:"0.1s", opacity:0 }}>Sistema de Gestao para Empresas e Autonomos</div>
            <h1 className="anim-in" style={{ fontSize:"clamp(40px,6vw,76px)", fontWeight:300, lineHeight:0.95, textTransform:"uppercase", letterSpacing:"-0.02em", marginBottom:28, animationDelay:"0.2s", opacity:0, color:C.text }}>
              O departamento<br />que sua empresa<br /><span style={{ color:C.accent, fontWeight:500 }}>nao pode contratar</span>
            </h1>
            <p className="anim-in" style={{ color:C.muted, fontSize:17, lineHeight:1.8, marginBottom:44, maxWidth:560, animationDelay:"0.4s", opacity:0 }}>
              Juridico, financeiro, operacoes, vendas e comunicacao em um unico sistema. Para pequenas empresas e profissionais autonomos que precisam operar como grandes.
            </p>
            <div className="anim-in" style={{ display:"flex", gap:14, animationDelay:"0.6s", opacity:0 }}>
              <button className="btn-primary" onClick={onRegister} style={{ height:52, padding:"0 36px", fontSize:12 }}>Comecar sem custo</button>
              <button className="btn-ghost" onClick={onLogin} style={{ height:52, padding:"0 36px", fontSize:12 }}>Ja tenho conta</button>
            </div>
            <div className="anim-in" style={{ display:"flex", gap:48, marginTop:64, animationDelay:"0.8s", opacity:0 }}>
              {[{n:"40+",label:"Modulos especializados"},{n:"10",label:"Areas de gestao"},{n:"< 30s",label:"Por operacao"}].map(s=>(
                <div key={s.n}>
                  <div style={{ fontFamily:"Space Mono,monospace", fontSize:30, fontWeight:400, color:C.accent }}>{s.n}</div>
                  <div style={{ fontSize:11, color:C.hint, marginTop:4, letterSpacing:1, textTransform:"uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding:"100px 48px", background:C.surface, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.accent},transparent)`, opacity:0.3 }}/>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div className="tag reveal">Como Funciona</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:12 }}>Operacional desde<br /><span style={{ color:C.accent }}>o primeiro acesso</span></h2>
            <p className="reveal" style={{ color:C.muted, fontSize:15, maxWidth:440, margin:"0 auto" }}>Sem treinamento, sem implantacao. Voce comeca a operar em minutos.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {HOW_STEPS.map((s,i)=>(
              <div key={i} className="reveal card" style={{ transitionDelay:`${i*0.1}s` }}>
                <div style={{ fontFamily:"Space Mono,monospace", fontSize:24, fontWeight:400, color:"rgba(56,189,248,0.18)", marginBottom:14 }}>{s.n}</div>
                <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section id="modulos" style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:56 }}>
            <div className="tag reveal">Modulos</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Todas as areas<br /><span style={{ color:C.accent }}>do seu negocio</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
            {MODULES.map((mod,i)=>(
              <div key={mod.id} className="reveal card" style={{ transitionDelay:`${i*0.05}s`, padding:20 }}>
                <div style={{ fontSize:20, color:mod.color, marginBottom:10 }}>{mod.icon}</div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:3, letterSpacing:0.5, textTransform:"uppercase" }}>{mod.label}</div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:14 }}>{mod.tools.length} modulos</div>
                {mod.tools.slice(0,3).map(t=>(
                  <div key={t.id} style={{ fontSize:10, color:C.hint, padding:"4px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:mod.color, fontSize:7 }}>▶</span>{t.name}
                  </div>
                ))}
                {mod.tools.length>3&&<div style={{ fontSize:10, color:C.accent, marginTop:6 }}>+{mod.tools.length-3} modulos</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ padding:"100px 48px", background:C.surface }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="tag reveal">Resultados</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Quem ja opera<br /><span style={{ color:C.accent }}>com o Arcane</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16 }}>
            {REVIEWS.map((r,i)=>(
              <div key={i} className="reveal card" style={{ transitionDelay:`${i*0.1}s`, padding:22 }}>
                <Stars n={r.stars}/>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, margin:"12px 0 16px", fontStyle:"italic" }}>"{r.text}"</p>
                <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{r.name}</div>
                  <div style={{ fontSize:11, color:C.hint, marginTop:2 }}>{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="tag reveal">Planos</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Escolha o plano<br /><span style={{ color:C.accent }}>do seu negocio</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {PLANS.map((plan,i)=>(
              <div key={plan.id} className="reveal" style={{ background:plan.highlight?C.accentDim:C.card, border:`1.5px solid ${plan.highlight?C.accent:C.border}`, padding:26, position:"relative", transitionDelay:`${i*0.1}s`, boxShadow:plan.highlight?"0 0 40px rgba(56,189,248,0.15)":"none", borderRadius:C.radiusLg }}>
                {plan.highlight&&<div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#000", fontSize:9, fontWeight:700, padding:"4px 16px", letterSpacing:2, whiteSpace:"nowrap", textTransform:"uppercase", borderRadius:20 }}>MAIS ESCOLHIDO</div>}
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{plan.name}</div>
                <div style={{ marginBottom:4 }}>
                  <span style={{ fontFamily:"Space Mono,monospace", fontSize:28, fontWeight:400, color:plan.highlight?C.accent:C.text }}>{plan.price}</span>
                  <span style={{ color:C.muted, fontSize:12 }}>{plan.period}</span>
                </div>
                <div style={{ color:C.hint, fontSize:10, marginBottom:18 }}>{plan.gens} · {plan.users}</div>
                <div style={{ height:1, background:C.border, marginBottom:18 }}/>
                <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
                  {plan.features.map((f,fi)=>(
                    <div key={fi} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:11, color:C.muted }}>
                      <span style={{ color:C.accent, fontSize:8, marginTop:3 }}>▶</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ if(plan.id==="free"){onRegister();}else{window.open(MP_LINKS[plan.id],"_blank");} }}
                  className={plan.highlight?"btn-primary":"btn-ghost"}
                  style={{ width:"100%", height:42, fontSize:11, letterSpacing:1 }}>
                  {plan.id==="free"?"COMECAR SEM CUSTO":"ASSINAR AGORA"}
                </button>
                {plan.id!=="free"&&<div style={{ textAlign:"center", marginTop:8, fontSize:10, color:C.hint }}>PIX · Cartao · Boleto</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding:"100px 48px", background:C.surface }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div className="tag reveal">FAQ</div>
          <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:44 }}>Perguntas <span style={{ color:C.accent }}>frequentes</span></h2>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {FAQS.map((faq,i)=>(
              <div key={i} className="reveal" style={{ border:`1px solid ${openFaq===i?C.accentD:C.border}`, background:openFaq===i?C.accentDim:"transparent", transition:"all 0.2s", transitionDelay:`${i*0.05}s`, borderRadius:C.radius }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"transparent", color:C.text, fontSize:14, textAlign:"left", fontWeight:400 }}>
                  {faq.q}<span style={{ color:C.accent, fontSize:20, flexShrink:0, marginLeft:16 }}>{openFaq===i?"−":"+"}</span>
                </button>
                {openFaq===i&&<div style={{ padding:"0 22px 18px", color:C.muted, fontSize:13, lineHeight:1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"100px 48px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.25, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle,rgba(56,189,248,0.09) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:620, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="tag reveal" style={{ margin:"0 auto 20px" }}>Comece Agora</div>
          <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:18 }}>Sua empresa merece<br /><span style={{ color:C.accent }}>operar em outro nivel</span></h2>
          <p className="reveal" style={{ color:C.muted, fontSize:15, marginBottom:32 }}>Centenas de empresas e profissionais autonomos ja operam com o Arcane. O proximo pode ser voce.</p>
          <button className="btn-primary reveal" onClick={onRegister} style={{ height:52, padding:"0 44px", fontSize:12 }}>CRIAR CONTA SEM CUSTO</button>
          <p className="reveal" style={{ color:C.hint, fontSize:12, marginTop:12 }}>Sem cartao de credito · Cancele quando quiser · Sem fidelidade</p>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"28px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
        <Logo size={14} />
        <div style={{ color:C.hint, fontSize:10, fontFamily:"Space Mono,monospace" }}>2026 ARCANE // TODOS OS DIREITOS RESERVADOS</div>
        <div style={{ display:"flex", gap:20 }}>
          {["Privacidade","Termos","Contato"].map(item=>(
            <span key={item} style={{ color:C.hint, fontSize:10, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.hint}>{item}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user,   setUser]   = useState(null);

  React.useEffect(()=>{
    const token     = localStorage.getItem("arcane_token");
    const savedUser = localStorage.getItem("arcane_user");
    if (token&&savedUser) { try { setUser(JSON.parse(savedUser)); setScreen("app"); } catch(e){} }
  },[]);

  const handleAuthSuccess = (u) => { setUser(u); setScreen("app"); };
  const handleLogout = () => { localStorage.removeItem("arcane_token"); localStorage.removeItem("arcane_user"); setUser(null); setScreen("landing"); };

  if (screen==="app"&&user)    return <AppDashboard user={user} onLogout={handleLogout} />;
  if (screen==="login")        return <AuthPage mode="login"    onSuccess={handleAuthSuccess} onSwitch={()=>setScreen("register")} />;
  if (screen==="register")     return <AuthPage mode="register" onSuccess={handleAuthSuccess} onSwitch={()=>setScreen("login")} />;
  return <LandingPage onLogin={()=>setScreen("login")} onRegister={()=>setScreen("register")} />;
}
