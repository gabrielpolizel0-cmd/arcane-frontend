import "./mobile-fix.css";
import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

const BACKEND_URL = "https://web-production-ddbd9.up.railway.app/api";

// ─── CORES ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#060608",
  surface: "#0c0c10",
  card: "#111116",
  elevated: "#18181f",
  accent: "#38bdf8",
  accentD: "#0ea5e9",
  accentGlow: "rgba(56,189,248,0.2)",
  accentDim: "rgba(56,189,248,0.08)",
  text: "#EAEAEA",
  muted: "#888",
  hint: "#444",
  border: "rgba(255,255,255,0.06)",
  borderHi: "rgba(255,255,255,0.12)",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "16px",
};

// ─── ESTILOS GLOBAIS ─────────────────────────────────────────────────────────
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
  @keyframes spin{to{transform:rotate(360deg)}}
  .anim-in{animation:fadeUp 0.7s ease-out both;}
  .anim-fi{animation:fadeIn 0.5s ease-out both;}
  .reveal{opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .reveal.vis{opacity:1;transform:translateY(0);}
  input,textarea,select{background:#111116;border:1px solid rgba(255,255,255,0.06);color:#EAEAEA;border-radius:8px;padding:12px 16px;font-family:'Inter',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
  input:focus,textarea:focus,select:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,0.08);}
  input::placeholder,textarea::placeholder{color:#444;}
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
  .badge-starter{background:rgba(99,179,237,0.1);color:#63b3ed;}
  .badge-business{background:rgba(56,189,248,0.12);color:#38bdf8;}
  .badge-unlimited{background:rgba(167,139,250,0.12);color:#a78bfa;}
  .star{color:#f59e0b;font-size:14px;}
  .history-item{background:#111116;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 18px;margin-bottom:10px;cursor:pointer;transition:border-color 0.2s;}
  .history-item:hover{border-color:rgba(56,189,248,0.3);}
`;

// ─── MÓDULOS ─────────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: "documentos", icon: "◈", label: "Documentos", color: "#38bdf8", plan: "free",
    tools: [
      { id: "contrato",   name: "Gerar Contrato",        desc: "Contratos profissionais personalizados",   plan: "free" },
      { id: "proposta",   name: "Proposta Comercial",     desc: "Propostas persuasivas e profissionais",    plan: "free" },
      { id: "relatorio",  name: "Relatório Executivo",    desc: "Relatórios claros e impactantes",          plan: "free" },
      { id: "email_corp", name: "E-mail Corporativo",     desc: "Comunicações formais e práticas",          plan: "free" },
    ],
  },
  {
    id: "dados", icon: "◇", label: "Dados", color: "#a78bfa", plan: "free",
    tools: [
      { id: "analise",  name: "Análise de Dados",       desc: "Insights estratégicos dos seus dados",      plan: "free" },
      { id: "query",    name: "Gerar Query SQL",         desc: "Consultas SQL otimizadas",                  plan: "starter" },
      { id: "previsao", name: "Previsão e Tendências",   desc: "Antecipe cenários do seu negócio",          plan: "starter" },
      { id: "kpis",     name: "Definir KPIs",            desc: "Métricas certas para seu negócio",          plan: "free" },
    ],
  },
  {
    id: "produtividade", icon: "◉", label: "Produtividade", color: "#34d399", plan: "free",
    tools: [
      { id: "ata",              name: "Ata de Reunião",         desc: "Documente decisões com clareza",          plan: "free" },
      { id: "resumo",           name: "Resumir Documento",      desc: "Sínteses executivas precisas",            plan: "free" },
      { id: "onboarding",       name: "Plano de Onboarding",    desc: "Integre novos colaboradores",             plan: "starter" },
      { id: "base_conhecimento",name: "Base de Conhecimento",   desc: "Organize o saber da empresa",             plan: "starter" },
    ],
  },
  {
    id: "conteudo", icon: "◆", label: "Conteúdo", color: "#f472b6", plan: "free",
    tools: [
      { id: "post_social", name: "Post para Redes Sociais", desc: "Conteúdo que engaja e converte",          plan: "free" },
      { id: "blog",        name: "Artigo para Blog",        desc: "Conteúdo que posiciona sua marca",        plan: "free" },
      { id: "email_mkt",   name: "E-mail Marketing",        desc: "Campanhas que geram resultados",          plan: "starter" },
      { id: "descricao",   name: "Descrição de Produto",    desc: "Textos que vendem mais",                  plan: "free" },
    ],
  },
  {
    id: "financeiro", icon: "◎", label: "Financeiro", color: "#fbbf24", plan: "starter",
    tools: [
      { id: "orcamento",    name: "Gerar Orçamento",             desc: "Orçamentos profissionais prontos para envio",    plan: "starter" },
      { id: "fluxo_caixa",  name: "Modelo de Fluxo de Caixa",    desc: "Organize as finanças do seu negócio",            plan: "starter" },
      { id: "precificacao", name: "Calculadora de Precificação",  desc: "Precifique seus serviços corretamente",          plan: "starter" },
      { id: "nf_descritiva",name: "Descrição para NF",           desc: "Texto profissional para notas fiscais",          plan: "free" },
    ],
  },
  {
    id: "juridico", icon: "⬡", label: "Jurídico", color: "#fb923c", plan: "starter",
    tools: [
      { id: "lgpd",      name: "Política de Privacidade (LGPD)", desc: "Política adequada à legislação brasileira",  plan: "starter" },
      { id: "termos_uso",name: "Termos de Uso",                  desc: "Termos claros e juridicamente seguros",      plan: "starter" },
      { id: "nda",       name: "Contrato de NDA",                desc: "Acordo de confidencialidade profissional",   plan: "starter" },
      { id: "distrato",  name: "Distrato Comercial",             desc: "Encerre contratos com segurança jurídica",   plan: "business" },
    ],
  },
  {
    id: "rh", icon: "⬟", label: "RH & Pessoas", color: "#e879f9", plan: "starter",
    tools: [
      { id: "descricao_vaga",    name: "Descrição de Vaga",         desc: "Atraia os melhores talentos",               plan: "free" },
      { id: "avaliacao_desemp",  name: "Avaliação de Desempenho",   desc: "Formulário de avaliação estruturado",       plan: "starter" },
      { id: "politica_interna",  name: "Política Interna",          desc: "Regulamentos claros para sua equipe",       plan: "starter" },
      { id: "roteiro_entrevista",name: "Roteiro de Entrevista",     desc: "Entrevistas mais eficazes e justas",        plan: "free" },
    ],
  },
  {
    id: "vendas", icon: "⬢", label: "Vendas & CRM", color: "#2dd4bf", plan: "starter",
    tools: [
      { id: "cold_call",    name: "Script de Cold Call",      desc: "Abordagens que geram interesse real",         plan: "starter" },
      { id: "proposta_parc",name: "Proposta de Parceria",     desc: "Parcerias estratégicas bem apresentadas",     plan: "starter" },
      { id: "followup",     name: "Follow-up de Cliente",     desc: "Mensagens que reativam negócios",             plan: "free" },
      { id: "analise_conc", name: "Análise de Concorrente",   desc: "Mapeie seus concorrentes estrategicamente",   plan: "business" },
    ],
  },
  {
    id: "freelancer", icon: "◐", label: "Freelancer", color: "#60a5fa", plan: "free",
    tools: [
      { id: "briefing",     name: "Briefing de Projeto",          desc: "Alinhe expectativas com o cliente",          plan: "free" },
      { id: "proposta_free",name: "Proposta de Freelance",        desc: "Propostas que vencem a concorrência",        plan: "free" },
      { id: "contrato_free",name: "Contrato Simples de Serviço",  desc: "Proteja-se juridicamente em cada projeto",   plan: "free" },
      { id: "bio_prof",     name: "Bio Profissional",             desc: "Apresentação que gera credibilidade",        plan: "free" },
    ],
  },
  {
    id: "atendimento", icon: "◑", label: "Atendimento", color: "#34d399", plan: "starter",
    tools: [
      { id: "roteiro_suporte", name: "Roteiro de Suporte",         desc: "Padronize e melhore seu atendimento",      plan: "starter" },
      { id: "resp_reclamacao", name: "Resposta para Reclamação",   desc: "Resolva conflitos com profissionalismo",   plan: "free" },
      { id: "pesq_satisfacao", name: "Pesquisa de Satisfação NPS", desc: "Meça a lealdade dos seus clientes",        plan: "starter" },
      { id: "faq_produto",     name: "FAQ do Produto",             desc: "Responda as dúvidas antes que surjam",     plan: "free" },
    ],
  },
  {
    id: "premium", icon: "★", label: "Premium (Arquivos)", color: "#f59e0b", plan: "business",
    tools: [
      { id: "planilha_orcamento", name: "Planilha de Orçamento (Excel)",  desc: "Orçamento profissional em .xlsx",              plan: "business", output: "xlsx" },
      { id: "planilha_fluxo",     name: "Planilha Fluxo de Caixa (Excel)",desc: "Fluxo de caixa em .xlsx pronto para uso",      plan: "business", output: "xlsx" },
      { id: "apresentacao_ppt",   name: "Apresentação (PowerPoint)",       desc: "Slides profissionais em .pptx",                plan: "business", output: "pptx" },
      { id: "relatorio_pdf",      name: "Relatório Executivo (PDF)",       desc: "Relatório formatado em .pdf para download",    plan: "business", output: "pdf" },
    ],
  },
];

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
const TOOL_PROMPTS = {
  contrato: "Você é especialista em direito empresarial brasileiro. Gere um contrato profissional e completo com todas as cláusulas necessárias. Use linguagem jurídica adequada, inclua: partes envolvidas, objeto, valor, prazo, obrigações, rescisão e foro.",
  proposta: "Você é especialista em vendas B2B. Crie uma proposta comercial persuasiva, estruturada e profissional. Inclua: apresentação, problema, solução, benefícios, investimento, próximo passo.",
  relatorio: "Você é especialista em comunicação executiva. Crie um relatório executivo claro, estruturado e impactante com sumário, análise e recomendações.",
  email_corp: "Você é especialista em comunicação corporativa. Escreva um e-mail profissional, claro e persuasivo.",
  analise: "Você é analista de dados sênior. Analise os dados fornecidos, identifique padrões e gere insights estratégicos acionáveis.",
  query: "Você é especialista em banco de dados. Gere uma query SQL otimizada, bem comentada e eficiente.",
  previsao: "Você é especialista em business intelligence. Analise e projete tendências e cenários com base nos dados.",
  kpis: "Você é especialista em gestão por indicadores. Sugira KPIs relevantes, como mensurar cada um e metas recomendadas.",
  ata: "Você é especialista em comunicação empresarial. Gere uma ata de reunião profissional com pauta, decisões e próximos passos.",
  resumo: "Você é especialista em síntese de informações. Resuma o conteúdo destacando pontos-chave, insights e ações recomendadas.",
  onboarding: "Você é especialista em gestão de pessoas. Crie um plano de onboarding completo e acolhedor para novo colaborador.",
  base_conhecimento: "Você é especialista em gestão do conhecimento. Estruture as informações em categorias e artigos claros.",
  post_social: "Você é especialista em marketing digital. Crie posts envolventes para as redes sociais com hashtags e CTA.",
  blog: "Você é especialista em content marketing e SEO. Escreva artigo completo, otimizado, com introdução, desenvolvimento e conclusão.",
  email_mkt: "Você é especialista em e-mail marketing. Escreva campanha persuasiva com assunto, corpo e CTA eficazes.",
  descricao: "Você é especialista em copywriting. Escreva descrição de produto irresistível focando em benefícios e valor.",
  orcamento: "Você é especialista financeiro. Gere um orçamento profissional detalhado com itens, valores, condições e validade.",
  fluxo_caixa: "Você é especialista em finanças empresariais. Crie um modelo de fluxo de caixa mensal estruturado com entradas, saídas e saldo.",
  precificacao: "Você é especialista em precificação de serviços. Calcule e justifique o preço ideal considerando custos, margem e mercado.",
  nf_descritiva: "Você é especialista fiscal. Escreva descrição clara e adequada para emissão de nota fiscal de serviço.",
  lgpd: "Você é especialista em LGPD e direito digital. Gere política de privacidade completa e adequada à legislação brasileira.",
  termos_uso: "Você é especialista em direito digital. Escreva termos de uso claros, completos e juridicamente adequados.",
  nda: "Você é especialista em contratos. Gere um acordo de confidencialidade (NDA) profissional e robusto.",
  distrato: "Você é especialista em contratos. Gere um distrato comercial formal encerrando o contrato original com segurança.",
  descricao_vaga: "Você é especialista em recrutamento. Escreva descrição de vaga atrativa com requisitos, benefícios e cultura.",
  avaliacao_desemp: "Você é especialista em RH. Crie formulário de avaliação de desempenho completo com critérios e escala.",
  politica_interna: "Você é especialista em gestão de pessoas. Escreva política interna clara e objetiva para a empresa.",
  roteiro_entrevista: "Você é especialista em seleção. Crie roteiro de entrevista estruturado com perguntas comportamentais e técnicas.",
  cold_call: "Você é especialista em vendas. Crie script de cold call eficaz com abertura, qualificação, pitch e fechamento.",
  proposta_parc: "Você é especialista em parcerias comerciais. Crie proposta de parceria estratégica clara e convincente.",
  followup: "Você é especialista em CRM. Escreva mensagem de follow-up eficaz que reativa o interesse do cliente.",
  analise_conc: "Você é especialista em inteligência competitiva. Faça análise estruturada do concorrente com pontos fortes, fracos e oportunidades.",
  briefing: "Você é especialista em gestão de projetos. Crie briefing completo alinhando escopo, prazo, entregáveis e expectativas.",
  proposta_free: "Você é especialista em freelance. Escreva proposta profissional que destaca valor, metodologia e diferenciais.",
  contrato_free: "Você é especialista em contratos. Gere contrato simples de prestação de serviços para freelancers com todas cláusulas.",
  bio_prof: "Você é especialista em personal branding. Escreva bio profissional impactante para LinkedIn, site ou apresentações.",
  roteiro_suporte: "Você é especialista em customer success. Crie roteiro de atendimento padronizado para diferentes situações.",
  resp_reclamacao: "Você é especialista em gestão de conflitos. Escreva resposta profissional e empática para reclamação de cliente.",
  pesq_satisfacao: "Você é especialista em NPS. Crie pesquisa de satisfação com perguntas estratégicas e escala de avaliação.",
  faq_produto: "Você é especialista em produto. Crie FAQ completo respondendo as principais dúvidas dos usuários.",
  planilha_orcamento: "Você é especialista financeiro. Crie um orçamento detalhado em formato CSV com: Item, Descrição, Quantidade, Valor Unitário, Valor Total. Inclua cabeçalho com dados da empresa, cliente, data e validade. Ao final, inclua totais e condições de pagamento.",
  planilha_fluxo: "Você é especialista financeiro. Crie fluxo de caixa mensal em formato CSV com colunas: Categoria, Tipo (Entrada/Saída), Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez, Total. NUNCA use blocos de código markdown. Apenas texto bruto.",
  apresentacao_ppt: "Você é especialista em apresentações executivas. Crie roteiro detalhado de apresentação profissional com: Título de cada slide, Conteúdo principal (tópicos), Nota do apresentador.",
  relatorio_pdf: "Você é especialista em comunicação executiva. Gere relatório executivo completo com: Sumário Executivo, Análise Detalhada, Conclusões e Recomendações.",
};

// ─── PLANOS ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "",
    gens: "5 gerações/mês",
    gensLimit: 5,
    users: "1 usuário",
    highlight: false,
    features: ["Módulos básicos", "5 gerações por mês", "Acesso a ferramentas Free", "Suporte por e-mail"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    gens: "150 gerações/mês",
    gensLimit: 150,
    users: "5 usuários",
    highlight: false,
    features: ["Tudo do Free", "150 gerações/mês", "5 usuários", "Módulos Financeiro e Jurídico", "Suporte prioritário", "Histórico 30 dias"],
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 297",
    period: "/mês",
    gens: "500 gerações/mês",
    gensLimit: 500,
    users: "15 usuários",
    highlight: true,
    features: ["Tudo do Starter", "500 gerações/mês", "15 usuários", "Download Excel, PPT e PDF", "Análise de Concorrente", "Distrato Comercial", "Suporte dedicado"],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "R$ 897",
    period: "/mês",
    gens: "Gerações ilimitadas",
    gensLimit: 99999,
    users: "Usuários ilimitados",
    highlight: false,
    features: ["Tudo do Business", "Gerações ilimitadas", "Usuários ilimitados", "IA personalizada", "SLA dedicado", "Integração customizada", "Treinamento da equipe"],
  },
];

const PLAN_ORDER = { free: 0, starter: 1, business: 2, unlimited: 3 };

// ─── LINKS MERCADO PAGO ───────────────────────────────────────────────────────
const MP_LINKS = {
  starter:   "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=f33b7ffb9fc5463f82b079e24dfa9e43",
  business:  "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=60b050ff92e44a178b1a0b009cb140e0",
  unlimited: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=5e5810b4f083411fb6aaf6f0cbb9eed5",
};

// ─── CONTEÚDO DA LANDING ──────────────────────────────────────────────────────
const FAQS = [
  { q: "Preciso saber programar para usar o Arcane?", a: "Não! O Arcane foi desenvolvido para qualquer profissional e autônomo. A interface é intuitiva e você começa a gerar resultados em minutos." },
  { q: "Os dados da minha empresa ficam seguros?", a: "Sim. Utilizamos criptografia e seus dados nunca são usados para treinar modelos de IA. Seguimos todas as diretrizes da LGPD." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem taxas ou burocracia. Você pode cancelar sua assinatura quando quiser diretamente pelo painel." },
  { q: "O plano Free tem limitações?", a: "O plano Free oferece 5 gerações por mês para você experimentar. Para uso profissional, recomendamos o Starter ou Business." },
  { q: "Como funcionam os downloads de Excel, PPT e PDF?", a: "No plano Business, a IA gera o conteúdo estruturado e o sistema converte automaticamente para o formato escolhido. Você faz o download direto pelo navegador." },
];

const HOW_STEPS = [
  { n: "01", title: "Crie sua conta",       desc: "Cadastre-se gratuitamente em menos de 1 minuto. Sem cartão necessário." },
  { n: "02", title: "Escolha a ferramenta", desc: "Selecione entre mais de 40 ferramentas em 10 módulos especializados." },
  { n: "03", title: "Insira seus dados",    desc: "Descreva o que você precisa. Quanto mais detalhes, melhor o resultado." },
  { n: "04", title: "Receba o resultado",   desc: "A IA gera seu conteúdo profissional em segundos. Copie ou faça download." },
];

const REVIEWS = [
  { name: "Carlos M.",   role: "CEO - Agência Digital",    stars: 5, text: "Economizo pelo menos 3 horas por dia gerando propostas e contratos. O Arcane virou ferramenta essencial da nossa agência." },
  { name: "Fernanda L.", role: "Advogada Autônoma",         stars: 5, text: "Os contratos e NDA gerados são de altíssima qualidade. Adapto em minutos e mando direto pro cliente. Impressionante!" },
  { name: "Rodrigo S.",  role: "Gerente Comercial",         stars: 5, text: "Os scripts de cold call e follow-up melhoraram muito nossa taxa de conversão. Vale cada centavo do Business." },
  { name: "Mariana T.",  role: "Designer Freelancer",       stars: 5, text: "Como autônoma, uso os modelos de proposta e contrato toda semana. Profissional, rápido e em português. Amei!" },
  { name: "Pedro A.",    role: "Analista de Dados",         stars: 5, text: "As queries SQL e análises de KPIs são incrivelmente precisas. Poupei horas de trabalho só nessa semana." },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function canUseTool(userPlan, toolPlan) {
  return PLAN_ORDER[userPlan || "free"] >= PLAN_ORDER[toolPlan || "free"];
}

function Stars({ n }) {
  return <span>{Array.from({ length: n }).map((_, i) => <span key={i} className="star">★</span>)}</span>;
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{message}</div>;
}

function Logo({ size = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size + 10, height: size + 10, background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
        <span style={{ fontFamily: "Space Mono,monospace", fontSize: size * 0.55, fontWeight: 700, color: "#000" }}>A</span>
      </div>
      <span style={{ fontFamily: "Space Mono,monospace", fontSize: size, fontWeight: 700, letterSpacing: 4, color: "#EAEAEA", textTransform: "uppercase" }}>ARCANE</span>
    </div>
  );
}

function PlanBadge({ plan }) {
  return <span className={`badge badge-${plan}`}>{plan}</span>;
}

// ─── DOWNLOAD HELPERS ─────────────────────────────────────────────────────────
async function downloadAsExcel(content, filename) {
  try {
    let cleanContent = content.replace(/```(csv|text)?/g, "").replace(/```/g, "").trim();
    const lines = cleanContent.split("\n").filter((l) => l.trim());
    const data = lines.map((l) =>
      l.split(",").map((c) => {
        let val = c.trim().replace(/^"|"$/g, "");
        if (val.startsWith("=")) return { f: val.substring(1) };
        if (!isNaN(val) && val !== "") return Number(val);
        return val;
      })
    );
    const ws = window.XLSX.utils.aoa_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Arcane");
    window.XLSX.writeFile(wb, filename + ".xlsx");
  } catch (e) {
    console.error(e);
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename + ".csv"; a.click();
    URL.revokeObjectURL(url);
  }
}

function downloadAsText(content, filename, ext, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename + "." + ext; a.click();
  URL.revokeObjectURL(url);
}

async function handlePremiumDownload(tool, content) {
  if (!content) return;
  const filename = "arcane-" + tool.id + "-" + Date.now();
  if (tool.output === "xlsx") { await downloadAsExcel(content, filename); }
  else if (tool.output === "pdf") { downloadAsText(content, filename, "txt", "text/plain"); }
  else if (tool.output === "pptx") { downloadAsText(content, filename, "txt", "text/plain"); }
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name } },
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Verifique seu e-mail para confirmar o cadastro.");
        onSuccess({ email: data.user.email, name: form.name, plan: "free", id: data.user.id });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw new Error(error.message);
        const u = data.user;
        onSuccess({ email: u.email, name: u.user_metadata?.name || u.email, plan: u.user_metadata?.plan || "free", id: u.id });
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.bg }}>
      <style>{G}</style>
      {/* LADO ESQUERDO */}
      <div style={{ width: "44%", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px" }}>
        <Logo size={18} />
        <div style={{ marginTop: 64 }}>
          <div className="tag">Plataforma de IA</div>
          <h2 style={{ fontSize: 32, fontWeight: 300, lineHeight: 1.2, marginBottom: 20, color: C.text }}>
            Conteúdo profissional<br />em <span style={{ color: C.accent }}>segundos</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 36 }}>
            Mais de 40 ferramentas de IA para empresas e autônomos brasileiros.
          </p>
          {["40+ ferramentas em 10 módulos", "Resultados em menos de 30 segundos", "100% em português, focado no Brasil"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ color: C.accent, fontSize: 10 }}>▶</span>
              <span style={{ color: C.muted, fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
          <div style={{ color: C.hint, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Plano gratuito incluído</div>
          <div style={{ color: C.muted, fontSize: 13 }}>5 gerações/mês · Todos os módulos básicos · Sem cartão</div>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8, color: C.text }}>
              {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
            </h3>
            <p style={{ color: C.muted, fontSize: 14 }}>
              {mode === "login" ? "Entre para continuar usando o Arcane" : "Comece gratuitamente, sem cartão de crédito"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nome completo</label>
                <input placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>E-mail</label>
              <input type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handle()}
              />
            </div>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: 13, color: "#fca5a5", borderRadius: 8 }}>
                ⚠ {error}
              </div>
            )}
            <button className="btn-primary" onClick={handle} disabled={loading} style={{ width: "100%", height: 48, fontSize: 13, marginTop: 4 }}>
              {loading ? "Aguarde..." : mode === "login" ? "ENTRAR NA PLATAFORMA" : "CRIAR CONTA GRÁTIS"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            <span style={{ color: C.muted, fontSize: 14 }}>{mode === "login" ? "Não tem conta? " : "Já tem conta? "}</span>
            <span onClick={onSwitch} style={{ color: C.accent, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              {mode === "login" ? "Criar gratuitamente →" : "Entrar →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP DASHBOARD ────────────────────────────────────────────────────────────
function AppDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [usedCount, setUsedCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [profile, setProfile] = useState({ plan: "free" });

  const currentModule = MODULES.find((m) => m.id === activeModule);
  const plan = PLANS.find((p) => p.id === (profile.plan || "free")) || PLANS[0];
  const limitCount = plan.gensLimit;
  const usagePct = limitCount >= 99999 ? 0 : Math.min((usedCount / limitCount) * 100, 100);
  const remaining = limitCount >= 99999 ? "inf" : Math.max(limitCount - usedCount, 0);

  useEffect(() => {
    loadProfile();
    loadHistory();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) { setProfile(data); setUsedCount(data.generations_used || 0); }
  };

  const loadHistory = async () => {
    const { data } = await supabase.from("generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (data) setHistory(data);
  };

  const saveHistory = async (tool, inp, res) => {
    const entry = { user_id: user.id, tool: tool.name, module: currentModule?.label, input: inp, result: res };
    const { data } = await supabase.from("generations").insert(entry).select().single();
    if (data) setHistory((prev) => [data, ...prev].slice(0, 50));
    await supabase.from("profiles").update({ generations_used: usedCount + 1 }).eq("id", user.id);
    setUsedCount((prev) => prev + 1);
  };

  const generate = async () => {
    if (!activeTool || !input.trim()) return;
    if (!canUseTool(profile.plan, activeTool.plan)) {
      setToast(`Esta ferramenta requer o plano ${activeTool.plan.toUpperCase()} ou superior!`);
      return;
    }
    if (remaining !== "inf" && remaining <= 0) { setToast("Limite atingido. Faça um upgrade!"); return; }
    setLoading(true);
    setResult("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const systemPrompt = TOOL_PROMPTS[activeTool.id] || "Você é um assistente especializado. Gere o conteúdo solicitado de forma profissional.";
      const res = await fetch(BACKEND_URL + "/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tool: activeTool.id, input, system_prompt: systemPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar");
      const output = data.output || data.result || data.content || "";
      setResult(output);
      await saveHistory(activeTool, input, output);
    } catch (e) {
      setToast(e.message);
    }
    setLoading(false);
  };

  const copyResult = () => { navigator.clipboard.writeText(result); setToast("Copiado para área de transferência!"); };

  const navTo = (tab) => {
    setActiveTab(tab);
    setActiveModule(null);
    setActiveTool(null);
    setResult("");
    setInput("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{G}</style>

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}><Logo size={14} /></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          <div style={{ padding: "0 20px 6px", fontSize: 9, color: C.hint, letterSpacing: 3, textTransform: "uppercase" }}>Principal</div>
          <div className={`nav-item ${activeTab === "dashboard" && !activeModule ? "active" : ""}`} onClick={() => navTo("dashboard")}>
            <span style={{ fontSize: 14 }}>⊞</span><span>Painel</span>
          </div>
          <div className={`nav-item ${activeTab === "history" ? "active" : ""}`} onClick={() => navTo("history")}>
            <span style={{ fontSize: 14 }}>◷</span><span>Histórico</span>
            {history.length > 0 && <span style={{ marginLeft: "auto", fontSize: 10, background: C.accentDim, color: C.accent, padding: "1px 7px", borderRadius: 20 }}>{history.length}</span>}
          </div>
          <div className={`nav-item ${activeTab === "upgrade" ? "active" : ""}`} onClick={() => navTo("upgrade")}>
            <span style={{ fontSize: 14 }}>⬆</span><span>Upgrade</span>
            {plan.id === "free" && <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(251,191,36,0.12)", color: "#fbbf24", padding: "1px 7px", borderRadius: 20 }}>PRO</span>}
          </div>
          <div style={{ padding: "12px 20px 6px", fontSize: 9, color: C.hint, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>Módulos</div>
          {MODULES.map((mod) => (
            <div key={mod.id} className={`nav-item ${activeModule === mod.id ? "active" : ""}`}
              onClick={() => { setActiveModule(mod.id); setActiveTool(null); setResult(""); setActiveTab("module"); }}>
              <span style={{ color: mod.color, fontSize: 13 }}>{mod.icon}</span>
              <span style={{ flex: 1 }}>{mod.label}</span>
              {!canUseTool(profile.plan, mod.plan) && <span style={{ fontSize: 8, color: C.hint }}>🔒</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.hint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Plano {plan.name}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{remaining === "inf" ? "Ilimitado" : `${remaining} de ${limitCount} restantes`}</div>
          <div className="usage-bar"><div className="usage-fill" style={{ width: `${usagePct}%` }} /></div>
          {plan.id !== "unlimited" && <div onClick={() => navTo("upgrade")} style={{ marginTop: 10, fontSize: 11, color: C.accent, cursor: "pointer" }}>↑ Fazer upgrade</div>}
          <div onClick={onLogout} style={{ marginTop: 8, fontSize: 12, color: C.hint, cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.color = C.text)} onMouseLeave={(e) => (e.target.style.color = C.hint)}>← Sair</div>
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>
              {activeTab === "history" ? "Histórico" : activeTab === "upgrade" ? "Fazer Upgrade" : activeModule ? currentModule?.label : "Painel de Controle"}
            </div>
            <div style={{ fontSize: 11, color: C.hint }}>
              {activeTab === "history" ? "Suas gerações recentes" : activeTab === "upgrade" ? "Desbloqueie mais ferramentas" : activeModule ? `${currentModule?.tools.length} ferramentas` : "Bem-vindo ao Arcane"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: C.muted }}>{user.name || user.email}</div>
              <div style={{ fontSize: 10, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>{plan.name}</div>
            </div>
            <div style={{ width: 34, height: 34, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000", borderRadius: 8 }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && !activeModule && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div className="section-label">Visão Geral</div>
                <h2 style={{ fontSize: 26, fontWeight: 400, color: C.text, marginBottom: 4 }}>Olá, <span style={{ color: C.accent }}>{user.name || "bem-vindo"}</span> 👋</h2>
                <p style={{ color: C.muted, fontSize: 13 }}>O que vamos criar hoje?</p>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "3px solid #38bdf8", borderRadius: C.radius }}>
                <div>
                  <div style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Uso este mês — Plano {plan.name}</div>
                  <div style={{ fontSize: 20, fontFamily: "Space Mono,monospace", color: C.accent }}>{usedCount} <span style={{ fontSize: 13, color: C.muted }}>de {limitCount === 99999 ? "ilimitado" : limitCount} gerações</span></div>
                </div>
                <div style={{ width: 140 }}>
                  <div style={{ fontSize: 11, color: C.muted, textAlign: "right", marginBottom: 4 }}>{remaining === "inf" ? "Ilimitado" : `${remaining} restante`}</div>
                  <div className="usage-bar"><div className="usage-fill" style={{ width: `${usagePct}%` }} /></div>
                  {plan.id !== "unlimited" && <div onClick={() => navTo("upgrade")} style={{ fontSize: 10, color: C.accent, cursor: "pointer", textAlign: "right", marginTop: 4 }}>Fazer upgrade →</div>}
                </div>
              </div>

              {history.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div className="section-label" style={{ margin: 0 }}>Recentes</div>
                    <span onClick={() => navTo("history")} style={{ fontSize: 11, color: C.accent, cursor: "pointer" }}>Ver todos →</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {history.slice(0, 3).map((h) => (
                      <div key={h.id} className="history-item" onClick={() => { setSelectedHistory(h); navTo("history"); }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{h.tool}</span>
                          <span style={{ fontSize: 10, color: C.hint }}>{h.created_at ? new Date(h.created_at).toLocaleDateString("pt-BR") : ""}</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.input}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="section-label">Módulos disponíveis</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {MODULES.map((mod) => (
                  <div key={mod.id} className="tool-card" onClick={() => { setActiveModule(mod.id); setActiveTool(null); setActiveTab("module"); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, borderRadius: 8 }}>
                        <span style={{ color: mod.color }}>{mod.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 2 }}>{mod.label}</div>
                        <div style={{ fontSize: 11, color: C.hint }}>{mod.tools.length} ferramentas</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {mod.tools.slice(0, 3).map((tool) => (
                        <span key={tool.id} style={{ fontSize: 10, color: C.hint, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, padding: "3px 8px", borderRadius: 20 }}>{tool.name}</span>
                      ))}
                      {mod.tools.length > 3 && <span style={{ fontSize: 10, color: C.accent, padding: "3px 8px" }}>+{mod.tools.length - 3}</span>}
                    </div>
                    <div style={{ marginTop: 14, fontSize: 10, color: mod.color, letterSpacing: 1 }}>ABRIR MÓDULO →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── HISTÓRICO ── */}
          {activeTab === "history" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div className="section-label">Histórico</div>
                <h2 style={{ fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 4 }}>Suas gerações</h2>
                <p style={{ color: C.muted, fontSize: 13 }}>Últimas {history.length} gerações salvas</p>
              </div>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: C.hint }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>◷</div>
                  <p>Nenhuma geração ainda.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selectedHistory ? "1fr 1fr" : "1fr", gap: 20 }}>
                  <div>
                    {history.map((h) => (
                      <div key={h.id} className="history-item"
                        style={{ borderColor: selectedHistory?.id === h.id ? C.accent : C.border }}
                        onClick={() => setSelectedHistory(selectedHistory?.id === h.id ? null : h)}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div>
                            <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{h.tool}</span>
                            {h.module && <span style={{ fontSize: 10, color: C.muted, marginLeft: 8 }}>— {h.module}</span>}
                          </div>
                          <span style={{ fontSize: 10, color: C.hint }}>{h.created_at ? new Date(h.created_at).toLocaleDateString("pt-BR") : ""}</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.input}</div>
                      </div>
                    ))}
                  </div>
                  {selectedHistory && (
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: 20, height: "fit-content", position: "sticky", top: 90 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{selectedHistory.tool}</div>
                        <button onClick={() => { navigator.clipboard.writeText(selectedHistory.result); setToast("Copiado!"); }} style={{ background: "transparent", color: C.accent, fontSize: 11, padding: 0 }}>COPIAR</button>
                      </div>
                      <div style={{ fontSize: 11, color: C.hint, marginBottom: 10 }}>Entrada: {selectedHistory.input}</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 400, overflowY: "auto" }}>{selectedHistory.result}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── UPGRADE ── */}
          {activeTab === "upgrade" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <div className="section-label">Planos</div>
                <h2 style={{ fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 4 }}>Escolha seu plano</h2>
                <p style={{ color: C.muted, fontSize: 13 }}>Você está no plano <span style={{ color: C.accent, fontWeight: 500 }}>{plan.name}</span>. Faça upgrade para desbloquear mais ferramentas.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32 }}>
                {PLANS.map((p) => (
                  <div key={p.id} style={{ background: p.highlight ? C.accentDim : C.card, border: `1.5px solid ${p.id === plan.id ? C.accent : p.highlight ? C.accentD : C.border}`, padding: 22, borderRadius: C.radius, position: "relative", boxShadow: p.highlight ? "0 0 32px rgba(56,189,248,0.12)" : "none" }}>
                    {p.highlight && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#000", fontSize: 9, fontWeight: 700, padding: "3px 14px", letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase", borderRadius: 20 }}>RECOMENDADO</div>}
                    {p.id === plan.id && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 9, color: C.accent, fontWeight: 600, letterSpacing: 1 }}>SEU PLANO</div>}
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{p.name}</div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontFamily: "Space Mono,monospace", fontSize: 26, fontWeight: 400, color: p.highlight ? C.accent : C.text }}>{p.price}</span>
                      <span style={{ color: C.muted, fontSize: 12 }}>{p.period}</span>
                    </div>
                    <div style={{ color: C.hint, fontSize: 10, marginBottom: 16 }}>{p.gens} · {p.users}</div>
                    <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                      {p.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, color: C.muted }}>
                          <span style={{ color: C.accent, fontSize: 8, marginTop: 3 }}>▶</span>{f}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { if (p.id === "free") return; window.open(MP_LINKS[p.id], "_blank"); }}
                      disabled={p.id === plan.id}
                      className={p.highlight ? "btn-primary" : "btn-ghost"}
                      style={{ width: "100%", height: 40, fontSize: 11, letterSpacing: 1 }}>
                      {p.id === plan.id ? "PLANO ATUAL" : p.id === "free" ? "GRÁTIS" : "ASSINAR"}
                    </button>
                    {p.id !== "free" && p.id !== plan.id && <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: C.hint }}>PIX · Cartão · Boleto</div>}
                  </div>
                ))}
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 16 }}>Ferramentas por plano</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {MODULES.map((mod) => (
                    <div key={mod.id} style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 11, color: mod.color, marginBottom: 4 }}>{mod.icon} {mod.label}</div>
                      {mod.tools.map((t) => (
                        <div key={t.id} style={{ fontSize: 10, color: canUseTool(plan.id, t.plan) ? C.muted : C.hint, display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                          <span style={{ fontSize: 7 }}>{canUseTool(plan.id, t.plan) ? "✓" : "🔒"}</span>{t.name}
                          {!canUseTool(plan.id, t.plan) && <PlanBadge plan={t.plan} />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── MÓDULO ── */}
          {activeTab === "module" && activeModule && !activeTool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <button onClick={() => navTo("dashboard")} style={{ background: "transparent", color: C.muted, fontSize: 11, padding: 0, letterSpacing: 1 }}>← PAINEL</button>
                <span style={{ color: C.border }}>|</span>
                <span style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{currentModule?.label}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 4 }}>{currentModule?.label}</h2>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Selecione uma ferramenta para começar</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                {currentModule?.tools.map((tool) => {
                  const locked = !canUseTool(profile.plan, tool.plan);
                  return (
                    <div key={tool.id} className="tool-card"
                      onClick={() => { if (locked) { setToast(`Requer plano ${tool.plan.toUpperCase()}. Faça um upgrade!`); navTo("upgrade"); } else { setActiveTool(tool); } }}
                      style={{ opacity: locked ? 0.7 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ fontSize: 9, color: currentModule.color, letterSpacing: 2, textTransform: "uppercase" }}>{currentModule.icon} {currentModule.label}</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <PlanBadge plan={tool.plan} />
                          {tool.output && <span style={{ fontSize: 9, color: "#fbbf24", background: "rgba(251,191,36,0.1)", padding: "2px 6px", borderRadius: 4 }}>{tool.output.toUpperCase()}</span>}
                          {locked && <span>🔒</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 6 }}>{tool.name}</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{tool.desc}</div>
                      <div style={{ marginTop: 14, fontSize: 10, color: locked ? C.hint : C.accent, letterSpacing: 1 }}>{locked ? "REQUER UPGRADE →" : "USAR FERRAMENTA →"}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── FERRAMENTA ── */}
          {activeTab === "module" && activeModule && activeTool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <button onClick={() => { setActiveTool(null); setResult(""); setInput(""); }} style={{ background: "transparent", color: C.muted, fontSize: 11, padding: 0, letterSpacing: 1 }}>← VOLTAR</button>
                <span style={{ color: C.border }}>|</span>
                <span style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{activeTool.name}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                <div className="section-label" style={{ margin: 0 }}>{currentModule?.label}</div>
                <PlanBadge plan={activeTool.plan} />
                {activeTool.output && <span style={{ fontSize: 9, color: "#fbbf24", background: "rgba(251,191,36,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>GERA {activeTool.output.toUpperCase()}</span>}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 4 }}>{activeTool.name}</h2>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{activeTool.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Descreva o que você precisa</label>
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex: Contrato de prestação de serviços entre empresa X e Y, valor R$ 5.000, prazo 3 meses..." rows={9} style={{ resize: "vertical" }} />
                  <button className="btn-primary" onClick={generate} disabled={loading || !input.trim()} style={{ marginTop: 12, width: "100%", height: 48, fontSize: 12 }}>
                    {loading ? "GERANDO..." : "▶ GERAR COM IA"}
                  </button>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <label style={{ fontSize: 10, color: C.hint, letterSpacing: 2, textTransform: "uppercase" }}>Resultado</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {result && <button onClick={copyResult} style={{ background: "transparent", color: C.accent, fontSize: 10, padding: 0, letterSpacing: 1 }}>COPIAR</button>}
                      {result && activeTool.output && (
                        <button onClick={() => handlePremiumDownload(activeTool, result)} style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", fontSize: 10, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(251,191,36,0.2)" }}>
                          ⬇ BAIXAR {activeTool.output.toUpperCase()}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="result-box">
                    {loading
                      ? <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted }}><div style={{ animation: "pulse 1.2s ease infinite", color: C.accent }}>▶</div>Gerando seu conteúdo...</div>
                      : result || <span style={{ color: C.hint }}>O resultado aparecerá aqui...</span>}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{G}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(6,6,8,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.3s" }}>
        <Logo size={17} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {["Como Funciona", "Ferramentas", "Planos", "FAQ"].map((item) => (
            <a key={item} className="nav-link" href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a>
          ))}
          <div style={{ width: 1, height: 20, background: C.border, margin: "0 10px" }} />
          <button className="btn-ghost" onClick={onLogin} style={{ height: 38, padding: "0 20px", fontSize: 11 }}>Entrar</button>
          <button className="btn-primary" onClick={onRegister} style={{ height: 38, padding: "0 20px", fontSize: 11 }}>Começar Grátis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.35, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820 }}>
            <div className="tag anim-fi" style={{ animationDelay: "0.1s", opacity: 0 }}>▶ Plataforma de IA para Empresas e Autônomos</div>
            <h1 className="anim-in" style={{ fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 28, animationDelay: "0.2s", opacity: 0, color: C.text }}>
              Gere conteúdo<br />profissional com<br /><span style={{ color: C.accent, fontWeight: 500 }}>inteligência artificial</span>
            </h1>
            <p className="anim-in" style={{ color: C.muted, fontSize: 17, lineHeight: 1.8, marginBottom: 44, maxWidth: 540, animationDelay: "0.4s", opacity: 0 }}>
              Mais de 40 ferramentas especializadas em documentos, dados, produtividade e conteúdo. Para empresas e autônomos. Resultados profissionais em segundos.
            </p>
            <div className="anim-in" style={{ display: "flex", gap: 14, animationDelay: "0.6s", opacity: 0 }}>
              <button className="btn-primary" onClick={onRegister} style={{ height: 52, padding: "0 36px", fontSize: 12 }}>Começar Gratuitamente</button>
              <button className="btn-ghost" onClick={onLogin} style={{ height: 52, padding: "0 36px", fontSize: 12 }}>Já tenho conta</button>
            </div>
            <div className="anim-in" style={{ display: "flex", gap: 48, marginTop: 64, animationDelay: "0.8s", opacity: 0 }}>
              {[{ n: "40+", label: "Ferramentas de IA" }, { n: "10", label: "Módulos especializados" }, { n: "< 30s", label: "Tempo de geração" }].map((s) => (
                <div key={s.n}>
                  <div style={{ fontFamily: "Space Mono,monospace", fontSize: 30, fontWeight: 400, color: C.accent }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: C.hint, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "100px 48px", background: C.surface, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.accent},transparent)`, opacity: 0.3 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag reveal">Como Funciona</div>
            <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text, marginBottom: 12 }}>
              Do zero ao resultado<br /><span style={{ color: C.accent }}>em 4 passos</span>
            </h2>
            <p className="reveal" style={{ color: C.muted, fontSize: 15, maxWidth: 440, margin: "0 auto" }}>Sem curva de aprendizado. Você começa a usar em minutos.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="reveal card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontFamily: "Space Mono,monospace", fontSize: 24, fontWeight: 400, color: "rgba(56,189,248,0.18)", marginBottom: 14 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FERRAMENTAS */}
      <section id="ferramentas" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div className="tag reveal">Ferramentas</div>
            <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text }}>
              Tudo que seu negócio<br /><span style={{ color: C.accent }}>precisa</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
            {MODULES.map((mod, i) => (
              <div key={mod.id} className="reveal card" style={{ transitionDelay: `${i * 0.05}s`, padding: 20 }}>
                <div style={{ fontSize: 20, color: mod.color, marginBottom: 10 }}>{mod.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 3, letterSpacing: 0.5, textTransform: "uppercase" }}>{mod.label}</div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 14 }}>{mod.tools.length} ferramentas</div>
                {mod.tools.slice(0, 3).map((t) => (
                  <div key={t.id} style={{ fontSize: 10, color: C.hint, padding: "4px 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: mod.color, fontSize: 7 }}>▶</span>{t.name}
                  </div>
                ))}
                {mod.tools.length > 3 && <div style={{ fontSize: 10, color: C.accent, marginTop: 6 }}>+{mod.tools.length - 3} mais</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section style={{ padding: "100px 48px", background: C.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag reveal">Avaliações</div>
            <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text }}>
              O que nossos<br /><span style={{ color: C.accent }}>clientes dizem</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="reveal card" style={{ transitionDelay: `${i * 0.1}s`, padding: 22 }}>
                <Stars n={r.stars} />
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: "12px 0 16px" }}>"{r.text}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: C.hint, marginTop: 2 }}>{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag reveal">Planos</div>
            <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text }}>
              Escolha o plano<br /><span style={{ color: C.accent }}>ideal para você</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {PLANS.map((p, i) => (
              <div key={p.id} className="reveal" style={{ background: p.highlight ? C.accentDim : C.card, border: `1.5px solid ${p.highlight ? C.accent : C.border}`, padding: 26, position: "relative", transitionDelay: `${i * 0.1}s`, boxShadow: p.highlight ? "0 0 40px rgba(56,189,248,0.15)" : "none", borderRadius: C.radiusLg }}>
                {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#000", fontSize: 9, fontWeight: 700, padding: "4px 16px", letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase", borderRadius: 20 }}>RECOMENDADO</div>}
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{p.name}</div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "Space Mono,monospace", fontSize: 28, fontWeight: 400, color: p.highlight ? C.accent : C.text }}>{p.price}</span>
                  <span style={{ color: C.muted, fontSize: 12 }}>{p.period}</span>
                </div>
                <div style={{ color: C.hint, fontSize: 10, marginBottom: 18 }}>{p.gens} · {p.users}</div>
                <div style={{ height: 1, background: C.border, marginBottom: 18 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {p.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, color: C.muted }}>
                      <span style={{ color: C.accent, fontSize: 8, marginTop: 3 }}>▶</span>{f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { if (p.id === "free") { onRegister(); } else { window.open(MP_LINKS[p.id], "_blank"); } }}
                  className={p.highlight ? "btn-primary" : "btn-ghost"}
                  style={{ width: "100%", height: 42, fontSize: 11, letterSpacing: 1 }}>
                  {p.id === "free" ? "COMEÇAR GRÁTIS" : "ASSINAR AGORA"}
                </button>
                {p.id !== "free" && <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: C.hint }}>PIX · Cartão · Boleto</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 48px", background: C.surface }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="tag reveal">FAQ</div>
          <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text, marginBottom: 44 }}>
            Perguntas <span style={{ color: C.accent }}>frequentes</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="reveal" style={{ border: `1px solid ${openFaq === i ? C.accentD : C.border}`, background: openFaq === i ? C.accentDim : "transparent", transition: "all 0.2s", transitionDelay: `${i * 0.05}s`, borderRadius: C.radius }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", color: C.text, fontSize: 14, textAlign: "left", fontWeight: 400 }}>
                  {faq.q}<span style={{ color: C.accent, fontSize: 20, flexShrink: 0, marginLeft: 16 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div style={{ padding: "0 22px 18px", color: C.muted, fontSize: 13, lineHeight: 1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "100px 48px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle,rgba(56,189,248,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="tag reveal">Comece Agora</div>
          <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text, marginBottom: 20 }}>
            Pronto para economizar<br /><span style={{ color: C.accent }}>horas todo dia?</span>
          </h2>
          <p className="reveal" style={{ color: C.muted, fontSize: 16, marginBottom: 40, maxWidth: 460, margin: "0 auto 40px" }}>
            Junte-se a profissionais que já usam o Arcane para gerar conteúdo de qualidade em segundos.
          </p>
          <div className="reveal" style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button className="btn-primary" onClick={onRegister} style={{ height: 52, padding: "0 40px", fontSize: 12 }}>COMEÇAR GRATUITAMENTE</button>
            <button className="btn-ghost" onClick={onLogin} style={{ height: 52, padding: "0 40px", fontSize: 12 }}>JÁ TENHO CONTA</button>
          </div>
          <p className="reveal" style={{ color: C.hint, fontSize: 11, marginTop: 20 }}>Sem cartão de crédito · Cancele quando quiser</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={14} />
        <div style={{ fontSize: 11, color: C.hint }}>© 2024 Arcane. Todos os direitos reservados.</div>
        <div style={{ fontSize: 11, color: C.hint }}>Feito com IA · LGPD Compliant</div>
      </footer>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing"); // landing | login | register | app
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({ email: u.email, name: u.user_metadata?.name || u.email, plan: u.user_metadata?.plan || "free", id: u.id });
        setPage("app");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({ email: u.email, name: u.user_metadata?.name || u.email, plan: u.user_metadata?.plan || "free", id: u.id });
        setPage("app");
      } else {
        setUser(null);
        setPage("landing");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage("landing");
  };

  if (page === "landing") return <LandingPage onLogin={() => setPage("login")} onRegister={() => setPage("register")} />;
  if (page === "login")   return <AuthPage mode="login"    onSuccess={(u) => { setUser(u); setPage("app"); }} onSwitch={() => setPage("register")} />;
  if (page === "register")return <AuthPage mode="register" onSuccess={(u) => { setUser(u); setPage("app"); }} onSwitch={() => setPage("login")} />;
  if (page === "app" && user) return <AppDashboard user={user} onLogout={handleLogout} />;

  return null;
}
