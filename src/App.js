import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   ARCANE — App.js  (Nexus Design System v2 — Full Redesign)
   ───────────────────────────────────────────────────────────── */

// ── SUPABASE ──
import { supabase } from "./supabase";

const BACKEND_URL = "https://web-production-ddbd9.up.railway.app/api";

// ── DESIGN TOKENS (Nexus v2) ──
const C = {
  bg: "#030303",
  bgAlt: "#0a0a0a",
  surface: "rgba(26,26,26,0.4)",
  card: "rgba(255,255,255,0.02)",
  cardHover: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.1)",
  borderHover: "rgba(255,255,255,0.2)",
  borderSubtle: "rgba(255,255,255,0.05)",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "rgba(59,130,246,0.15)",
  accentB: "#10b981",
  accentBGlow: "rgba(16,185,129,0.8)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.5)",
  textDim: "rgba(255,255,255,0.4)",
  hint: "#71717a",
  hint2: "#52525b",
  red: "#f43f5e",
  amber: "#f59e0b",
  green: "#10b981",
  rose: "#f43f5e",
  purple: "#a78bfa",
  radius: "12px",
  radiusMd: "16px",
  radiusLg: "24px",
  radiusFull: "9999px",
};

// ── GLOBAL STYLES ──
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  html,body{height:100%;font-size:14px;}
  body{
    background:linear-gradient(to bottom,#030303,#0a0a0a);
    color:#fff;
    font-family:'Inter',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;
    overscroll-behavior:none;
  }
  ::selection{background:#fff;color:#000;}
  ::-webkit-scrollbar{width:8px;}
  ::-webkit-scrollbar-track{background:#000;}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:#555;}

  .glass-panel{
    background:rgba(26,26,26,0.4);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.05);
  }
  .glow-button{
    box-shadow:0 0 20px rgba(255,255,255,0.15);
    transition:box-shadow 0.3s ease,transform 0.3s ease;
  }
  .glow-button:hover{
    box-shadow:0 0 30px rgba(255,255,255,0.3);
    transform:scale(1.03);
  }

  @keyframes fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  @keyframes ping{75%,100%{transform:scale(2);opacity:0;}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradientShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}

  .gs-reveal{opacity:0;transform:translateY(50px);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);}
  .gs-reveal.vis{opacity:1;transform:none;}

  button{cursor:pointer;font-family:'Inter',system-ui,sans-serif;border:none;transition:all 0.3s;}
  input,textarea,select{
    font-family:'Inter',system-ui,sans-serif;
    font-size:14px;
    background:rgba(255,255,255,0.05);
    backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.1);
    color:#fff;
    border-radius:12px;
    padding:12px 16px;
    width:100%;
    outline:none;
    transition:border-color 0.3s,background 0.3s;
  }
  input:focus,textarea:focus,select:focus{
    border-color:rgba(59,130,246,0.5);
    background:rgba(255,255,255,0.08);
  }
  input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25);}
  select option{background:#1a1a1a;}

  .btn-primary{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:0 28px;height:44px;
    background:#fff;color:#000;
    font-size:14px;font-weight:600;
    border-radius:9999px;
    box-shadow:0 0 15px rgba(255,255,255,0.2);
    transition:all 0.3s;
  }
  .btn-primary:hover{background:#e5e5e5;box-shadow:0 0 30px rgba(255,255,255,0.3);}
  .btn-primary:disabled{opacity:0.4;pointer-events:none;}

  .btn-ghost{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:0 24px;height:44px;
    background:transparent;color:rgba(255,255,255,0.5);
    font-size:14px;font-weight:500;
    border-radius:9999px;
    transition:all 0.3s;
  }
  .btn-ghost:hover{color:#fff;}

  .btn-cta{
    position:relative;display:inline-flex;align-items:center;justify-content:center;
  }
  .btn-cta .cta-glow{
    position:absolute;inset:0;border-radius:9999px;
    filter:blur(24px);opacity:0.5;
    background:rgba(59,130,246,0.25);
    transition:opacity 0.5s,transform 0.5s;z-index:0;
  }
  .btn-cta:hover .cta-glow{opacity:1;transform:scale(1.25);}
  .btn-cta .cta-border{
    position:relative;z-index:10;padding:1.5px;border-radius:9999px;overflow:hidden;
    background:linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.8),rgba(255,255,255,0.1));
    box-shadow:0 10px 30px rgba(0,0,0,0.5);
  }
  .btn-cta .cta-inner{
    position:relative;display:flex;align-items:center;justify-content:center;
    padding:16px 40px;border-radius:9999px;
    background:#020617;overflow:hidden;
  }
  .btn-cta .cta-bg{
    position:absolute;inset:0;
    background:radial-gradient(circle at 50% 40%,#1e40af 0%,#020617 100%);
  }
  .btn-cta .cta-text{
    position:relative;z-index:30;color:#fff;font-weight:700;
    letter-spacing:0.2em;text-transform:uppercase;font-size:14px;
  }

  .section-label{
    font-size:10px;text-transform:uppercase;font-weight:700;
    color:#60a5fa;letter-spacing:0.3em;margin-bottom:16px;display:block;
  }

  .sidebar-modern{
    width:260px;min-height:100vh;
    background:rgba(255,255,255,0.02);backdrop-filter:blur(40px);
    border-right:1px solid rgba(255,255,255,0.1);
    display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;
    transition:transform 0.3s ease;
  }
  .nav-item-modern{
    display:flex;align-items:center;gap:12px;padding:10px 12px;
    color:#71717a;cursor:pointer;transition:all 0.2s;
    font-size:14px;font-weight:400;border-radius:10px;margin:2px 8px;
  }
  .nav-item-modern:hover{color:#fff;background:rgba(255,255,255,0.06);}
  .nav-item-modern.act{
    color:#60a5fa;
    background:rgba(59,130,246,0.1);
    border:1px solid rgba(59,130,246,0.2);
    backdrop-filter:blur(8px);
    box-shadow:0 0 15px rgba(99,102,241,0.1);
  }

  .main-modern{margin-left:260px;min-height:100vh;background:transparent;}

  .topbar-modern{
    height:64px;
    background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.1);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 24px;position:sticky;top:0;z-index:50;
  }

  .card-modern{
    background:rgba(255,255,255,0.02);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1);border-radius:16px;
    position:relative;overflow:hidden;
    transition:all 0.5s;
  }
  .card-modern:hover{
    background:rgba(255,255,255,0.04);
    border-color:rgba(255,255,255,0.2);
    transform:translateY(-2px);
  }

  .mod-card-modern{
    background:rgba(255,255,255,0.02);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1);border-radius:24px;
    padding:32px;cursor:pointer;transition:all 0.5s;position:relative;overflow:hidden;
  }
  .mod-card-modern:hover{
    border-color:rgba(59,130,246,0.3);
    background:rgba(255,255,255,0.04);
    transform:translateY(-4px);
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
  }

  .tool-row-modern{
    display:flex;align-items:center;gap:12px;padding:16px 20px;
    background:rgba(255,255,255,0.02);backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.08);border-radius:12px;
    cursor:pointer;transition:all 0.3s;margin-bottom:8px;
  }
  .tool-row-modern:hover{
    background:rgba(59,130,246,0.07);
    border-color:rgba(59,130,246,0.25);
    transform:translateX(4px);
  }

  .result-box-modern{
    background:rgba(0,0,0,0.4);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1);border-radius:16px;
    padding:24px;min-height:300px;font-size:14px;line-height:1.85;
    white-space:pre-wrap;color:rgba(255,255,255,0.5);
  }

  .toast-modern{
    position:fixed;bottom:24px;right:24px;
    background:rgba(26,26,26,0.9);backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.1);
    border-left:3px solid #3b82f6;
    color:#fff;padding:16px 24px;font-size:13px;z-index:9999;
    animation:fadeUp 0.3s ease;border-radius:16px;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
  }

  .upload-zone-modern{
    border:1px dashed rgba(255,255,255,0.15);border-radius:16px;
    padding:32px;text-align:center;cursor:pointer;transition:all 0.3s;
    background:rgba(255,255,255,0.01);
  }
  .upload-zone-modern:hover,.upload-zone-modern.drag{
    border-color:rgba(59,130,246,0.4);background:rgba(59,130,246,0.04);
  }

  .modal-overlay-modern{
    position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);
    z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;
  }
  .modal-modern{
    background:rgba(26,26,26,0.9);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.1);border-radius:24px;
    padding:40px;width:100%;max-width:560px;
    box-shadow:0 32px 64px rgba(0,0,0,0.5);
    animation:fadeUp 0.4s cubic-bezier(.16,1,.3,1);
  }

  #webgl-canvas{
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    z-index:-1;pointer-events:none;
  }

  .mobile-menu-btn{
    display:none;position:fixed;top:16px;left:16px;z-index:200;
    width:44px;height:44px;border-radius:12px;
    background:rgba(26,26,26,0.8);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1);
    align-items:center;justify-content:center;
    color:#fff;font-size:20px;
  }

  @media(max-width:768px){
    .sidebar-modern{transform:translateX(-100%);}
    .sidebar-modern.open{transform:translateX(0);}
    .main-modern{margin-left:0;}
    .mobile-menu-btn{display:flex;}
    .landing-nav-links{display:none !important;}
    .landing-hero-stats{gap:24px !important;}
    .landing-hero-stats>div{min-width:80px;}
    .pricing-split{flex-direction:column !important;}
    .pricing-split .pricing-left{width:100% !important;padding:32px !important;}
    .pricing-split .pricing-right{width:100% !important;flex-direction:column !important;border-left:none !important;border-top:1px solid rgba(255,255,255,0.1) !important;}
    .how-grid{grid-template-columns:1fr 1fr !important;}
    .modules-grid{grid-template-columns:1fr !important;}
    .plans-extra-grid{grid-template-columns:1fr !important;}
    .tool-grid-2col{grid-template-columns:1fr !important;}
    .plans-dash-grid{grid-template-columns:1fr 1fr !important;}
    .auth-split{flex-direction:column !important;}
    .auth-left{width:100% !important;padding:40px 24px !important;min-height:auto !important;}
    .auth-right{padding:24px !important;}
  }

  @media(max-width:480px){
    .how-grid{grid-template-columns:1fr !important;}
    .plans-dash-grid{grid-template-columns:1fr !important;}
  }
`;

// ── DATA ──
const MODULES = [
  { id: "diagnostico_financeiro", icon: "◎", label: "Financeiro", plan: "free", color: "#fbbf24", desc: "Diagnostico real das suas financas",
    tools: [
      { id: "analisar_planilha", name: "Analisar Planilha / Extrato", desc: "Envie seus dados e receba diagnostico completo", upload: true },
      { id: "fluxo_caixa_diagnostico", name: "Diagnosticar Fluxo de Caixa", desc: "Identifique riscos e gaps no seu caixa" },
      { id: "identificar_desperdicio", name: "Identificar Desperdicios", desc: "Onde voce esta perdendo dinheiro" },
      { id: "projecao_cenarios", name: "Projecao de Cenarios", desc: "Pessimista, realista e otimista para 6 meses" },
    ] },
  { id: "juridico", icon: "⬡", label: "Juridico", plan: "essencial", color: "#fb923c", desc: "Protecao juridica sem advogado retido",
    tools: [
      { id: "revisar_contrato", name: "Revisar Contrato", desc: "Identifique riscos antes de assinar", upload: true },
      { id: "gerar_contrato", name: "Gerar Contrato", desc: "Contrato profissional em minutos" },
      { id: "lgpd_diagnostico", name: "Diagnostico LGPD", desc: "Nivel de conformidade e plano de adequacao" },
      { id: "nda", name: "Acordo de Confidencialidade", desc: "NDA robusto para proteger seu negocio" },
    ] },
  { id: "rh", icon: "⬟", label: "RH & Pessoas", plan: "free", color: "#e879f9", desc: "Gerencie seu time sem departamento de RH",
    tools: [
      { id: "diagnostico_time", name: "Diagnosticar o Time", desc: "Riscos, gaps e plano de retencao" },
      { id: "descricao_vaga", name: "Criar Descricao de Vaga", desc: "Atraia os candidatos certos" },
      { id: "avaliacao_desempenho", name: "Avaliacao de Desempenho", desc: "Formulario estruturado com plano de metas" },
      { id: "plano_onboarding", name: "Plano de Onboarding", desc: "Integre novos colaboradores com eficiencia" },
      { id: "politica_interna", name: "Politica Interna", desc: "Regras claras que alinham a equipe" },
    ] },
  { id: "marketing", icon: "◆", label: "Marketing Digital", plan: "free", color: "#f472b6", desc: "Estrategia e conteudo sem agencia",
    tools: [
      { id: "diagnostico_marketing", name: "Diagnosticar Marketing", desc: "Gaps, oportunidades e estrategia de 90 dias" },
      { id: "estrategia_conteudo", name: "Estrategia de Conteudo", desc: "Plano editorial de 30 dias por canal" },
      { id: "copy_vendas", name: "Copy de Vendas", desc: "Textos que convertem para produto ou servico" },
      { id: "post_redes_sociais", name: "Posts para Redes Sociais", desc: "LinkedIn, Instagram e WhatsApp prontos" },
    ] },
  { id: "operacoes", icon: "◈", label: "Operacoes", plan: "free", color: "#38bdf8", desc: "Documente e organize o dia a dia",
    tools: [
      { id: "diagnostico_processos", name: "Diagnosticar Processos", desc: "Gargalos, desperdicios e mapa do processo ideal" },
      { id: "proposta_comercial", name: "Proposta Comercial", desc: "Proposta consultiva que fecha negocio" },
      { id: "ata_reuniao", name: "Ata de Reuniao", desc: "Decisoes e tarefas documentadas com precisao" },
      { id: "email_profissional", name: "E-mail Profissional", desc: "Comunicacao corporativa clara e eficaz" },
    ] },
  { id: "consultoria", icon: "★", label: "Consultoria Estrategica", plan: "profissional", color: "#a78bfa", desc: "Consultoria de alto nivel para decisoes criticas",
    tools: [
      { id: "diagnostico_completo", name: "Diagnostico Completo do Negocio", desc: "Visao 360 com prioridades e roteiro de 90 dias" },
      { id: "plano_crescimento", name: "Plano de Crescimento", desc: "Estrategia para dobrar o negocio em 12 meses" },
      { id: "analise_concorrentes", name: "Analise de Concorrentes", desc: "Inteligencia competitiva e posicionamento" },
    ] },
];

const TOOL_TIME = {
  analisar_planilha: 180, fluxo_caixa_diagnostico: 120, identificar_desperdicio: 90, projecao_cenarios: 150,
  revisar_contrato: 180, gerar_contrato: 120, lgpd_diagnostico: 240, nda: 90,
  diagnostico_time: 120, descricao_vaga: 60, avaliacao_desempenho: 90, plano_onboarding: 120, politica_interna: 150,
  diagnostico_marketing: 120, estrategia_conteudo: 90, copy_vendas: 60, post_redes_sociais: 45,
  diagnostico_processos: 150, proposta_comercial: 90, ata_reuniao: 30, email_profissional: 20,
  diagnostico_completo: 300, plano_crescimento: 240, analise_concorrentes: 180,
};
const HOURLY_RATE = 80;

const PLANS = [
  { id: "free", name: "Basico", price: "R$ 0", period: "", limit: 10, highlight: false,
    features: ["10 analises/mes", "Modulos: Financeiro, RH, Marketing, Operacoes", "Upload de planilhas e contratos", "Historico de 7 dias"] },
  { id: "essencial", name: "Essencial", price: "R$ 147", period: "/mes", limit: 200, highlight: false,
    features: ["200 analises/mes", "Todos os modulos basicos", "Modulo Juridico", "Historico completo", "Suporte prioritario"] },
  { id: "profissional", name: "Profissional", price: "R$ 347", period: "/mes", limit: 600, highlight: true,
    features: ["600 analises/mes", "Todos os modulos", "Consultoria Estrategica", "Diagnostico Completo do Negocio", "Suporte dedicado"] },
  { id: "gestao", name: "Gestao", price: "R$ 597", period: "/mes", limit: 99999, highlight: false,
    features: ["Analises ilimitadas", "Tudo do Profissional", "Multiplos usuarios", "API de integracao", "SLA garantido"] },
];

const PLAN_ORDER = { free: 0, essencial: 1, starter: 1, profissional: 2, business: 2, gestao: 3, unlimited: 3 };
const MP_LINKS = {
  essencial: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=f33b7ffb9fc5463f82b079e24dfa9e43",
  profissional: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=60b050ff92e44a178b1a0b009cb140e0",
  gestao: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=5e5810b4f083411fb6aaf6f0cbb9eed5",
};

const FAQS = [
  { q: "O Arcane substitui um funcionario?", a: "Para pequenas empresas, sim. O Arcane concentra juridico, financeiro, RH e marketing — areas que normalmente exigiriam ao menos 2-3 profissionais. Voce paga uma fracao do salario e tem acesso 24 horas." },
  { q: "Posso enviar minhas planilhas para analise?", a: "Sim. No modulo Financeiro voce faz upload de planilhas Excel ou CSV, ou cola os dados diretamente. O sistema le, interpreta e entrega um diagnostico detalhado com acoes concretas." },
  { q: "Os meus dados ficam seguros?", a: "Sim. Utilizamos criptografia e seus dados nunca sao usados para treinar modelos. Seguimos integralmente a LGPD." },
  { q: "Posso cancelar quando quiser?", a: "Sim, sem burocracia. O cancelamento e imediato e voce mantem acesso ate o final do periodo pago." },
  { q: "O sistema funciona para qualquer tipo de negocio?", a: "Sim. Atende desde MEIs e autonomos ate empresas com equipes de 50+ pessoas. Quanto mais contexto voce fornecer, mais precisa e especifica sera a analise." },
];

const SECTORS = ["Varejo", "Servicos", "Tecnologia", "Saude", "Educacao", "Construcao", "Alimentacao", "Agronegocio", "Logistica", "Consultoria", "Juridico", "Contabilidade", "Marketing / Agencia", "Outro"];
const SIZES = ["MEI / Autonomo", "Microempresa (2-9 funcionarios)", "Pequena empresa (10-49 funcionarios)", "Media empresa (50+ funcionarios)"];
const TONES = ["Formal e tecnico", "Neutro e profissional", "Descontraido e proximo"];

// ── UTILITIES ──
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".gs-reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function canUse(userPlan, reqPlan) { return (PLAN_ORDER[userPlan] || 0) >= (PLAN_ORDER[reqPlan] || 0); }

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsText(file, "UTF-8");
  });
}

function calcSaved(history) {
  const mins = history.reduce((a, h) => a + (TOOL_TIME[h.tool] || 60), 0);
  const hours = Math.round(mins / 60 * 10) / 10;
  return { hours, value: Math.round(hours * HOURLY_RATE) };
}

// ── SMALL COMPONENTS ──
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast-modern">{msg}</div>;
}

function Logo({ size = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontSize: size, fontWeight: 800, letterSpacing: "0.25em",
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        backgroundImage: "linear-gradient(to right, #fff, #94a3b8, #64748b)",
      }}>ARCANE</span>
    </div>
  );
}

function PlanTag({ plan }) {
  const map = { free: "free", essencial: "essencial", starter: "essencial", profissional: "profissional", business: "profissional", gestao: "gestao", unlimited: "gestao" };
  const key = map[plan] || "free";
  const labels = { free: "Basico", essencial: "Essencial", profissional: "Profissional", gestao: "Gestao" };
  const colors = {
    free: { bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)" },
    essencial: { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
    profissional: { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
    gestao: { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.2)" },
  };
  const c = colors[key];
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 9999,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
      background: c.bg, color: c.text, border: `1px solid ${c.border}`, backdropFilter: "blur(4px)",
    }}>{labels[key] || plan}</span>
  );
}

// ── THREE.JS HERO BACKGROUND ──
function ThreeBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamic import Three.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 18);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // Core wireframe sphere
      const geometry = new THREE.IcosahedronGeometry(5, 2);
      const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x0f4c81, wireframe: true, transparent: true, opacity: 0.8 });
      const coreSphere = new THREE.Mesh(geometry, wireframeMaterial);
      globeGroup.add(coreSphere);

      // Shield with fresnel effect
      const shieldGeometry = new THREE.IcosahedronGeometry(5.15, 4);
      const vertexShader = `
        varying vec3 vNormal; varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const fragmentShader = `
        varying vec3 vNormal; varying vec3 vPosition;
        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = clamp(1.0 - dot(viewDirection, vNormal), 0.0, 1.0);
          fresnel = pow(fresnel, 6.0);
          vec3 rimColor = vec3(0.1, 0.4, 0.8);
          gl_FragColor = vec4(rimColor, fresnel * 0.9);
        }
      `;
      const shieldMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      globeGroup.add(new THREE.Mesh(shieldGeometry, shieldMaterial));

      // Particles
      const particleCount = 150;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const r = 6.5 + Math.random() * 7.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = r * Math.cos(phi);
      }
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 0.04, color: 0x00e5ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
      globeGroup.add(particles);

      const clock = new THREE.Clock();
      function animate() {
        const t = clock.getElapsedTime();
        globeGroup.rotation.y = t * 0.05;
        globeGroup.rotation.x = t * 0.02;
        const s = 1 + Math.sin(t * 0.5) * 0.015;
        globeGroup.scale.set(s, s, s);
        particles.rotation.y = t * -0.02;
        particles.rotation.z = t * 0.01;
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      }
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);
      canvas._cleanup = () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        renderer.dispose();
      };
    };
    document.head.appendChild(script);

    return () => {
      if (canvas._cleanup) canvas._cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} id="webgl-canvas" />;
}

// ── LANDING PAGE ──
function Landing({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: "linear-gradient(to bottom,#030303,#0a0a0a)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{G}</style>
      <ThreeBackground />

      {/* ── HEADER ── */}
      <header className="glass-panel" style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
        width: "92%", maxWidth: 960, zIndex: 50, borderRadius: 9999,
        padding: "12px 12px 12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        opacity: scrolled ? 1 : 0.95,
        transition: "all 0.3s",
      }}>
        <div style={{ flex: 1 }}><Logo size={16} /></div>
        <nav className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
          {["Como Funciona", "Modulos", "Planos", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>{item}</a>
          ))}
        </nav>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
          <a onClick={onLogin} style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "8px 16px", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>Entrar</a>
          <button onClick={onRegister} className="btn-primary" style={{ height: 36, padding: "0 20px", fontSize: 13 }}>Comecar gratis</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 16px 0" }}>
        <div className="gs-reveal" style={{ maxWidth: 860, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
          {/* Status badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9999,
            padding: "6px 16px", marginBottom: 32,
            background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
              Sistema de Gestao para Empresas e Autonomos
            </span>
          </div>

          {/* Main title */}
          <h1 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(48px,7vw,72px)", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em", fontWeight: 300 }}>
            O departamento<br />que sua empresa<br />
            <span style={{
              color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(to right, #fff, #6b7280)",
            }}>nao pode contratar.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: "clamp(18px,2vw,20px)", color: "rgba(255,255,255,0.5)", maxWidth: 640, marginBottom: 40, fontWeight: 300, lineHeight: 1.7 }}>
            Juridico, financeiro, RH e marketing em um sistema. Faca upload da sua planilha, envie seu contrato — o Arcane le, diagnostica e diz exatamente o que fazer.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center", marginBottom: 48 }}>
            <a onClick={onRegister} className="btn-cta" style={{ cursor: "pointer" }}>
              <div className="cta-glow" />
              <div className="cta-border">
                <div className="cta-inner">
                  <div className="cta-bg" />
                  <span className="cta-text">Comecar sem custo</span>
                </div>
              </div>
            </a>
          </div>

          {/* Stats row */}
          <div className="landing-hero-stats" style={{ display: "flex", gap: 48, justifyContent: "center" }}>
            {[
              { n: "6", l: "Modulos especializados" },
              { n: "Upload", l: "Planilhas e contratos" },
              { n: "< 30s", l: "Por diagnostico" },
            ].map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 32, fontWeight: 300, color: "#fff", fontVariantNumeric: "tabular-nums", marginBottom: 4, backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(to bottom, #fff, #d4d4d8)", WebkitTextFillColor: "transparent" }}>{s.n}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ position: "relative", zIndex: 10, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="gs-reveal" style={{ textAlign: "center", marginBottom: 64, maxWidth: 640, margin: "0 auto 64px" }}>
            <span className="section-label">Como Funciona</span>
            <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(36px,5vw,48px)", fontWeight: 300, marginBottom: 24 }}>
              Operacional desde<br /><span style={{ color: "rgba(255,255,255,0.4)" }}>o primeiro acesso.</span>
            </h2>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[
              { n: "01", t: "Acesse o sistema", d: "Cadastro em menos de 2 minutos. Sem cartao." },
              { n: "02", t: "Configure sua empresa", d: "Nome, setor e tom de comunicacao. So uma vez." },
              { n: "03", t: "Envie seus dados", d: "Planilha, contrato ou descricao da situacao." },
              { n: "04", t: "Receba o diagnostico", d: "Analise completa com acoes concretas em segundos." },
            ].map((s, i) => (
              <div key={i} className="gs-reveal" style={{
                background: i === 2 ? "rgba(59,130,246,0.03)" : "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${i === 2 ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 16, padding: 24, overflow: "hidden",
                transition: "all 0.5s",
                transitionDelay: `${i * 0.1}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = i === 2 ? "rgba(59,130,246,0.03)" : "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = i === 2 ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${i === 2 ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)"}`,
                  background: i === 2 ? "rgba(59,130,246,0.2)" : "rgba(0,0,0,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: i === 2 ? "#93c5fd" : "#fff",
                  marginBottom: 24, backdropFilter: "blur(8px)",
                  boxShadow: i === 2 ? "0 0 15px rgba(59,130,246,0.3)" : "none",
                }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: "-0.01em" }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontWeight: 300 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULOS ── */}
      <section id="modulos" style={{ position: "relative", zIndex: 10, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="gs-reveal" style={{ marginBottom: 64, maxWidth: 640 }}>
            <span className="section-label">Modulos</span>
            <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(36px,5vw,48px)", fontWeight: 300 }}>
              Todas as areas<br /><span style={{ color: "rgba(255,255,255,0.4)" }}>do seu negocio.</span>
            </h2>
          </div>
          <div className="modules-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {MODULES.map((m, i) => (
              <div key={m.id} className="gs-reveal glass-panel" style={{
                borderRadius: 24, padding: 32, cursor: "pointer",
                transition: "all 0.5s", transitionDelay: `${i * 0.07}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(26,26,26,0.4)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${m.color}15`, border: `1px solid ${m.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: m.color,
                  }}>{m.icon}</div>
                  <PlanTag plan={m.plan} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 8 }}>{m.label}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20, lineHeight: 1.6, fontWeight: 300 }}>{m.desc}</p>
                {m.tools.slice(0, 3).map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    <span style={{ color: m.color, fontSize: 8 }}>▶</span>{t.name}
                  </div>
                ))}
                {m.tools.length > 3 && <div style={{ fontSize: 12, color: "#60a5fa", marginTop: 12 }}>+{m.tools.length - 3} funcoes</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" style={{ position: "relative", zIndex: 10, padding: "96px 24px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="gs-reveal" style={{ textAlign: "center", marginBottom: 32, maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="section-label">Planos</span>
            <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(36px,5vw,48px)", fontWeight: 300, marginBottom: 24 }}>Simples, transparente.</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontWeight: 300 }}>
              Menos que um salario, mais que um departamento. Comece gratis, sem cartao.
            </p>
          </div>

          <div className="pricing-split" style={{
            display: "flex", flexDirection: "row", overflow: "hidden",
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)", position: "relative",
          }}>
            {/* Left panel */}
            <div className="pricing-left" style={{ width: "35%", padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", color: "#71717a", fontSize: 12, marginBottom: 32, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                  <svg style={{ width: 16, height: 16, marginRight: 12, color: "#60a5fa" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v18m9-9H3m13.5-6.5L4.5 17.5m15 0L4.5 6.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                  Para todas as escalas
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 300, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                  Recursos poderosos<br />para criadores poderosos
                </h2>
              </div>
              <div style={{ marginTop: 80, color: "#71717a", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>
                Comece sem custo.<br />Escale quando precisar.
              </div>
            </div>

            {/* Plans columns */}
            <div className="pricing-right" style={{ width: "65%", display: "flex", borderLeft: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", position: "relative", zIndex: 10 }}>
              {PLANS.slice(0, 2).map((p, idx) => (
                <div key={p.id} style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  borderRight: idx === 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  transition: "background 0.5s",
                  position: "relative",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {p.highlight && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(59,130,246,0.05),transparent)", pointerEvents: "none" }} />}
                  <div style={{ padding: "48px 32px 32px", position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 24, color: "#fff", fontWeight: 500 }}>{p.name}</h3>
                      {p.highlight && <span style={{ padding: "4px 12px", fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, color: "#93c5fd", background: "rgba(59,130,246,0.1)", backdropFilter: "blur(4px)" }}>Popular</span>}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", marginTop: 16 }}>
                      {p.price}<span style={{ fontSize: 14, color: "#71717a", fontWeight: 400, marginLeft: 4, fontFamily: "'Inter',sans-serif" }}>{p.period}</span>
                    </div>
                  </div>
                  <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)",
                    padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", transition: "background 0.3s", color: p.highlight ? "#000" : "#fff",
                    background: p.highlight ? "#fff" : "transparent",
                    boxShadow: p.highlight ? "0 0 20px rgba(255,255,255,0.1)" : "none",
                  }}
                    onClick={() => { if (p.id === "free") { onRegister(); } else { window.open(MP_LINKS[p.id], "_blank"); } }}
                    onMouseEnter={e => { if (!p.highlight) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { if (!p.highlight) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 14, fontWeight: p.highlight ? 600 : 500 }}>{p.id === "free" ? "Comecar gratis" : "Assinar agora"}</span>
                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div style={{ padding: "32px 32px 48px", flex: 1, position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {p.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "center", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                          <svg style={{ width: 20, height: 20, marginRight: 12, color: p.highlight ? "#60a5fa" : "#fff", filter: p.highlight ? "drop-shadow(0 0 8px rgba(96,165,250,0.5))" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                          <span style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra plans row */}
          <div className="plans-extra-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
            {PLANS.slice(2).map(p => (
              <div key={p.id} className="glass-panel" style={{ borderRadius: 24, padding: 32, transition: "all 0.5s", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}
              >
                {p.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "#fff", fontSize: 10, fontWeight: 600, padding: "4px 16px", letterSpacing: "0.15em", borderRadius: 9999, whiteSpace: "nowrap", textTransform: "uppercase" }}>Mais escolhido</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 500 }}>{p.name}</h3>
                  {p.highlight && <span style={{ padding: "4px 12px", fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, color: "#93c5fd", background: "rgba(59,130,246,0.1)" }}>Popular</span>}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 300, marginBottom: 20 }}>
                  {p.price}<span style={{ fontSize: 14, color: "#71717a", marginLeft: 4, fontFamily: "'Inter',sans-serif" }}>{p.period}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                  {p.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: "#10b981" }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={() => window.open(MP_LINKS[p.id], "_blank")} className={p.highlight ? "btn-primary" : "btn-ghost"} style={{ width: "100%", border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                  Assinar agora
                </button>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#52525b" }}>PIX · Cartao · Boleto</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ position: "relative", zIndex: 10, padding: "96px 24px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <div className="gs-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="section-label">FAQ</span>
            <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(30px,4vw,36px)", fontWeight: 300 }}>Perguntas frequentes.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-panel" style={{ borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: "100%", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "transparent", color: "#fff", fontSize: 15, fontWeight: 500, textAlign: "left",
                }}>
                  {faq.q}
                  <svg style={{ width: 20, height: 20, color: "rgba(255,255,255,0.4)", transition: "transform 0.3s", transform: openFaq === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 16 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 32px 24px", fontSize: 14, color: "rgba(148,163,184,1)", lineHeight: 1.7, fontWeight: 300 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ minHeight: "70vh", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "128px 24px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="gs-reveal" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(48px,7vw,72px)", marginBottom: 24, fontWeight: 300 }}>
            Sua empresa merece<br />operar em outro nivel.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 40, maxWidth: 480, lineHeight: 1.6 }}>
            Sem cartao de credito. Cancele quando quiser. Comece em menos de 2 minutos.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button onClick={onRegister} className="btn-primary glow-button" style={{ padding: "0 40px", height: 52, fontSize: 14 }}>Criar conta gratis</button>
            <button onClick={onLogin} className="btn-ghost" style={{ fontSize: 14 }}>Ja tenho conta</button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ width: "100%", paddingBottom: 32, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.05)", maxWidth: 1200, margin: "80px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 32, marginBottom: 32 }}>
            <div>
              <Logo size={16} />
              <p style={{ fontSize: 12, color: "#64748b", maxWidth: 280, marginTop: 12 }}>Sistema de gestao inteligente para empresas brasileiras.</p>
            </div>
            <div style={{ display: "flex", gap: 48, fontSize: 12, color: "#64748b" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 10 }}>Produto</p>
                <a href="#como-funciona" style={{ color: "inherit", textDecoration: "none" }}>Como Funciona</a>
                <a href="#modulos" style={{ color: "inherit", textDecoration: "none" }}>Modulos</a>
                <a href="#planos" style={{ color: "inherit", textDecoration: "none" }}>Planos</a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 10 }}>Legal</p>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacidade</a>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Termos</a>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>LGPD</a>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#475569", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p>© 2026 Arcane. Todos os direitos reservados.</p>
            <p>LGPD Compliant · Feito para empresas brasileiras</p>
          </div>
        </footer>
      </section>
    </div>
  );
}

// ── AUTH PAGE ──
function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name } },
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          // Create profile
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: form.email,
            name: form.name,
            plan: "free",
            generations_used: 0,
            profile_complete: false,
          });
          onSuccess({ id: data.user.id, email: form.email, name: form.name, plan: "free" });
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
        if (data.user) {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
          onSuccess({
            id: data.user.id,
            email: data.user.email,
            name: profileData?.name || data.user.user_metadata?.name || "",
            plan: profileData?.plan || "free",
          });
        }
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="auth-split" style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(to bottom,#030303,#0a0a0a)" }}>
      <style>{G}</style>
      <ThreeBackground />

      {/* Left panel */}
      <div className="auth-left" style={{ width: "45%", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px" }}>
        <Logo size={18} />
        <div style={{ marginTop: 64 }}>
          <span className="section-label">Sistema de Gestao</span>
          <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 36, fontWeight: 300, lineHeight: 1.15, marginBottom: 24 }}>
            O departamento que<br />sua empresa{" "}
            <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(to right, #fff, #6b7280)" }}>nao pode pagar</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
            Juridico, financeiro, RH e marketing em um sistema. Para quem precisa operar como grande empresa pagando muito menos.
          </p>
          {["Diagnostico financeiro com upload de planilha", "Revisao e geracao de contratos juridicos", "RH, marketing e operacoes em um lugar", "Funciona para MEI, autonomo e empresas"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 300 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 64px", position: "relative", zIndex: 10 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h3 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>{mode === "login" ? "Acessar o sistema" : "Criar conta"}</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 32, fontWeight: 300 }}>
            {mode === "login" ? "Entre para continuar no Arcane" : "Comece sem custo, sem cartao de credito"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Nome</div>
                <input placeholder="Seu nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>E-mail</div>
              <input type="email" placeholder="seu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Senha</div>
              <input type="password" placeholder="Minimo 6 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
            {error && (
              <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", padding: "12px 16px", fontSize: 13, color: "#fda4af", borderRadius: 12 }}>
                ⚠ {error}
              </div>
            )}
            <button className="btn-primary" onClick={handle} disabled={loading} style={{ width: "100%", height: 48, fontSize: 14, marginTop: 8 }}>
              {loading ? "Aguarde..." : mode === "login" ? "Acessar o sistema" : "Criar conta gratis"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{mode === "login" ? "Nao tem conta? " : "Ja tem conta? "}</span>
            <span onClick={onSwitch} style={{ color: "#60a5fa", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>{mode === "login" ? "Criar gratuitamente →" : "Acessar →"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPANY PROFILE MODAL ──
function CompanyProfileModal({ userId, onComplete }) {
  const [form, setForm] = useState({ company_name: "", sector: "", company_size: "", tone: "Neutro e profissional", city: "" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.company_name.trim()) return;
    setLoading(true);
    await supabase.from("profiles").update({ ...form, profile_complete: true }).eq("id", userId);
    setLoading(false);
    onComplete(form);
  };

  return (
    <div className="modal-overlay-modern">
      <div className="modal-modern">
        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Bem-vindo ao Arcane</span>
          <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 24, fontWeight: 300, marginBottom: 12 }}>Conte-nos sobre sua empresa</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300 }}>
            Essas informacoes personalizam todas as analises para o contexto do seu negocio. Voce so preenche uma vez.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Nome da empresa *</div>
            <input placeholder="Ex: Studio Criativo Ltda" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Setor</div>
              <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                <option value="">Selecione...</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Tamanho</div>
              <select value={form.company_size} onChange={e => setForm({ ...form, company_size: e.target.value })}>
                <option value="">Selecione...</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Cidade</div>
              <input placeholder="Ex: Sao Paulo, SP" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Tom de comunicacao</div>
              <select value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={save} disabled={loading || !form.company_name.trim()} style={{ width: "100%", height: 48, marginTop: 8 }}>
            {loading ? "Salvando..." : "Comecar a usar o Arcane →"}
          </button>
          <button onClick={() => onComplete(null)} style={{ background: "transparent", color: "rgba(255,255,255,0.3)", fontSize: 12, padding: "4px 0" }}>Pular por agora</button>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE EDITOR ──
function ProfileEditor({ userId, profile, onSave, setToast }) {
  const [form, setForm] = useState({
    company_name: profile.company_name || "", sector: profile.sector || "",
    company_size: profile.company_size || "", tone: profile.tone || "Neutro e profissional", city: profile.city || "",
  });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ ...form, profile_complete: true }).eq("id", userId);
    onSave(form); setToast("Perfil da empresa salvo!"); setLoading(false);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="section-label">Minha Empresa</span>
        <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 300, marginBottom: 8 }}>Perfil da empresa</div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300 }}>
          Esses dados personalizam todas as analises automaticamente. Voce nao precisa repetir o contexto em cada uso.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Nome da empresa</div>
          <input placeholder="Ex: Studio Criativo Ltda" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Setor</div>
            <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
              <option value="">Selecione...</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Tamanho</div>
            <select value={form.company_size} onChange={e => setForm({ ...form, company_size: e.target.value })}>
              <option value="">Selecione...</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Cidade</div>
            <input placeholder="Ex: Sao Paulo, SP" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Tom de comunicacao</div>
            <select value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })}>
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={save} disabled={loading} style={{ width: "100%", height: 48, marginTop: 8 }}>
          {loading ? "Salvando..." : "Salvar perfil da empresa"}
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [modId, setModId] = useState(null);
  const [tool, setTool] = useState(null);
  const [input, setInput] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState([]);
  const [selHist, setSelHist] = useState(null);
  const [profile, setProfile] = useState({ plan: user.plan || "free", generations_used: 0 });
  const [drag, setDrag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef();

  const mod = MODULES.find(m => m.id === modId);
  const plan = PLANS.find(p => p.id === (profile.plan || "free")) || PLANS[0];
  const used = profile.generations_used || 0;
  const limit = plan.limit;
  const pct = limit >= 99999 ? 0 : Math.min((used / limit) * 100, 100);
  const left = limit >= 99999 ? "inf" : Math.max(limit - used, 0);
  const saved = calcSaved(history);

  // Load profile and history from Supabase
  const loadProfile = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      setProfile(data);
      if (!data.profile_complete) setShowModal(true);
    }
  }, [user.id]);

  const loadHistory = useCallback(async () => {
    const { data } = await supabase.from("history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (data) setHistory(data);
  }, [user.id]);

  useEffect(() => {
    loadProfile();
    loadHistory();
  }, [loadProfile, loadHistory]);

  const handleFile = async (file) => {
    if (!file) return;
    try { const text = await readFileAsText(file); setFileText(text); setFileName(file.name); setToast(`Arquivo "${file.name}" carregado.`); }
    catch { setToast("Erro ao ler o arquivo."); }
  };

  const navTo = (t, m = null) => { setTab(t); setModId(m); setTool(null); setResult(""); setInput(""); setFileText(""); setFileName(""); setSidebarOpen(false); };

  const run = async () => {
    if (!tool) return;
    if (left !== "inf" && left <= 0) { setToast("Limite atingido. Faca upgrade!"); return; }
    if (!input.trim() && !fileText) { setToast("Descreva o contexto ou envie um arquivo."); return; }
    setLoading(true); setResult("");

    try {
      const payload = {
        tool: tool.id,
        module: modId,
        input: input,
        file_content: fileText || undefined,
        file_name: fileName || undefined,
        company_name: profile.company_name || undefined,
        sector: profile.sector || undefined,
        company_size: profile.company_size || undefined,
        tone: profile.tone || undefined,
        city: profile.city || undefined,
      };

      let response;
      if (tool.upload && fileText) {
        response = await fetch(BACKEND_URL + "/ai/analyze-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(BACKEND_URL + "/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      const resultText = data.result || data.response || data.text || JSON.stringify(data);
      setResult(resultText);

      // Save to history
      await supabase.from("history").insert({
        user_id: user.id,
        tool: tool.id,
        module: modId,
        input: input.substring(0, 500),
        result: resultText.substring(0, 10000),
      });

      // Increment usage
      await supabase.from("profiles").update({ generations_used: (profile.generations_used || 0) + 1 }).eq("id", user.id);
      setProfile(p => ({ ...p, generations_used: (p.generations_used || 0) + 1 }));

      // Reload history
      loadHistory();
    } catch (err) {
      setResult("Erro ao processar a analise. Tente novamente.\n\n" + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(to bottom,#030303,#0a0a0a)" }}>
      <style>{G}</style>
      {showModal && <CompanyProfileModal userId={user.id} onComplete={(d) => { setShowModal(false); if (d) setProfile(p => ({ ...p, ...d, profile_complete: true })); }} />}

      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar-modern ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}><Logo size={14} /></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div style={{ padding: "0 20px 6px", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Principal</div>
          {[
            { id: "home", label: "Painel", icon: "◎" },
            { id: "hist", label: "Historico", icon: "◷", badge: history.length > 0 ? history.length : null },
            { id: "plans", label: "Planos", icon: "△", dot: plan.id === "free" },
            { id: "perfil", label: "Minha Empresa", icon: "◉" },
          ].map(item => (
            <div key={item.id} className={`nav-item-modern ${tab === item.id && !modId ? "act" : ""}`} onClick={() => navTo(item.id)}>
              <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ marginLeft: "auto", fontSize: 10, background: "rgba(59,130,246,0.1)", color: "#60a5fa", padding: "2px 8px", borderRadius: 9999, border: "1px solid rgba(59,130,246,0.2)" }}>{item.badge}</span>}
              {item.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />}
            </div>
          ))}

          <div style={{ padding: "16px 20px 6px", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginTop: 4 }}>Modulos</div>
          {MODULES.map(m => (
            <div key={m.id} className={`nav-item-modern ${modId === m.id ? "act" : ""}`} onClick={() => navTo("mod", m.id)}>
              <span style={{ color: m.color, fontSize: 14, width: 16, textAlign: "center" }}>{m.icon}</span>
              <span style={{ flex: 1 }}>{m.label}</span>
              {!canUse(profile.plan, m.plan) && <span style={{ fontSize: 10 }}>🔒</span>}
            </div>
          ))}
        </div>

        {/* Plan info */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Plano {plan.name}</div>
          <div style={{ fontSize: 12, color: "#71717a", marginBottom: 6 }}>{left === "inf" ? "Ilimitado" : `${left} de ${limit} restantes`}</div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right,#3b82f6,#60a5fa)", borderRadius: 2, transition: "width 0.5s", boxShadow: "0 0 10px rgba(59,130,246,0.6)" }} />
          </div>
          {plan.id !== "gestao" && <div onClick={() => navTo("plans")} style={{ fontSize: 12, color: "#60a5fa", cursor: "pointer", marginBottom: 12 }}>Fazer upgrade →</div>}
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)", borderRadius: 10, color: "#fb7185", fontSize: 12, fontWeight: 500 }}>
            ← Sair da conta
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-modern">
        <div className="topbar-modern">
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {tab === "hist" ? "Historico" : tab === "plans" ? "Planos" : tab === "perfil" ? "Minha Empresa" : modId ? mod?.label : "Painel de Controle"}
            </div>
            <div style={{ fontSize: 12, color: "#71717a", fontWeight: 300 }}>
              {tab === "hist" ? "Suas analises recentes" : tab === "plans" ? "Gerencie seu plano" : tab === "perfil" ? "Dados da sua empresa" : modId ? mod?.desc : "Situacao do seu negocio"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8 }}>
              <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                <span style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "#34d399", opacity: 0.75, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              </span>
              <span style={{ fontSize: 10, color: "#34d399", letterSpacing: "0.15em", fontWeight: 600, textTransform: "uppercase" }}>Operacional</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{profile.company_name || user.name || user.email}</div>
              <div style={{ fontSize: 10, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>{plan.name}</div>
            </div>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", borderRadius: 10 }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "32px 32px" }}>
          {/* HOME */}
          {tab === "home" && !modId && (
            <>
              <div style={{ marginBottom: 32 }}>
                <span className="section-label">Painel</span>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Bem-vindo ao Arcane</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 300 }}>Selecione um modulo para comecar.</p>
              </div>

              {/* Quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
                <div className="glass-panel" style={{ borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Analises usadas</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{used}</div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{left === "inf" ? "Ilimitado" : `de ${limit} no plano`}</div>
                </div>
                <div className="glass-panel" style={{ borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Horas economizadas</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: "#10b981", fontVariantNumeric: "tabular-nums" }}>{saved.hours}h</div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>≈ R$ {saved.value} em servicos</div>
                </div>
                <div className="glass-panel" style={{ borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Seu plano</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: "#60a5fa" }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{plan.price}{plan.period}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {MODULES.map((m, i) => {
                  const locked = !canUse(profile.plan, m.plan);
                  return (
                    <div key={m.id} className="mod-card-modern" onClick={() => { if (locked) { setToast(`Requer plano ${m.plan.toUpperCase()}.`); navTo("plans"); return; } navTo("mod", m.id); }} style={{ opacity: locked ? 0.5 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${m.color}15`, border: `1px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: m.color }}>{m.icon}</div>
                        <PlanTag plan={m.plan} />
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{m.label}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontWeight: 300 }}>{m.desc}</p>
                      {locked && <div style={{ marginTop: 12, fontSize: 11, color: "#f59e0b" }}>🔒 Requer upgrade</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* MODULO LIST */}
          {tab === "mod" && modId && !tool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={() => navTo("home")} style={{ background: "transparent", color: "#71717a", fontSize: 12, padding: 0 }}>← Painel</button>
                <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                <span style={{ fontSize: 12, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{mod?.label}</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 300, marginBottom: 6 }}>{mod?.label}</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 300 }}>{mod?.desc}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mod?.tools.map(t => {
                  const locked = !canUse(profile.plan, mod.plan);
                  return (
                    <div key={t.id} className="tool-row-modern" onClick={() => { if (locked) { setToast(`Requer plano ${mod.plan.toUpperCase()}.`); navTo("plans"); return; } setTool(t); }} style={{ opacity: locked ? 0.5 : 1 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{t.name}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>{t.desc}</div>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#34d399" }}>~{Math.round((TOOL_TIME[t.id] || 60) / 60 * 10) / 10}h ec.</span>
                        {t.upload && <span style={{ fontSize: 10, background: "rgba(16,185,129,0.1)", color: "#34d399", padding: "3px 8px", borderRadius: 6, fontWeight: 600, border: "1px solid rgba(16,185,129,0.2)" }}>UPLOAD</span>}
                        {locked ? <span style={{ fontSize: 12 }}>🔒</span> : <span style={{ fontSize: 12, color: "#52525b" }}>→</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TOOL */}
          {tab === "mod" && modId && tool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setTool(null)} style={{ background: "transparent", color: "#71717a", fontSize: 12, padding: 0 }}>← {mod?.label}</button>
                <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                <span style={{ fontSize: 12, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{tool.name}</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 300, marginBottom: 6 }}>{tool.name}</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 300 }}>{tool.desc}</p>
                {profile.company_name && (
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 9999, fontSize: 12, color: "#60a5fa" }}>
                    ✓ Personalizado para {profile.company_name}
                  </div>
                )}
              </div>
              <div className="tool-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  {tool.upload && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Arquivo (opcional)</div>
                      <div className={`upload-zone-modern${drag ? " drag" : ""}`}
                        onDragOver={e => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept=".txt,.csv,.xlsx,.xls,.pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                        {fileName ? (
                          <div>
                            <div style={{ fontSize: 14, color: "#34d399", fontWeight: 500, marginBottom: 6 }}>✓ {fileName}</div>
                            <div style={{ fontSize: 12, color: "#71717a" }}>Clique para trocar</div>
                            <button onClick={e => { e.stopPropagation(); setFileText(""); setFileName(""); }} style={{ marginTop: 8, background: "transparent", color: "#f43f5e", fontSize: 11, padding: 0 }}>Remover</button>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 14, color: "#71717a", marginBottom: 8 }}>Arraste o arquivo ou clique para selecionar</div>
                            <div style={{ fontSize: 12, color: "#52525b" }}>Suporta: .txt, .csv, .xlsx, .pdf</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                    {tool.upload ? "Contexto adicional" : "Descreva o cenario"}
                  </div>
                  <textarea value={input} onChange={e => setInput(e.target.value)}
                    placeholder={tool.upload ? "Descreva o contexto do arquivo..." : "Descreva com detalhes a situacao..."}
                    rows={tool.upload ? 5 : 10} style={{ resize: "vertical" }} />
                  <button className="btn-primary" onClick={run} disabled={loading || (!input.trim() && !fileText)} style={{ marginTop: 16, width: "100%", height: 48, fontSize: 14 }}>
                    {loading ? "Processando..." : "Executar analise"}
                  </button>
                  {loading && (
                    <div style={{ marginTop: 12, fontSize: 12, color: "#71717a", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ animation: "pulse 1.2s ease infinite", color: "#3b82f6", fontSize: 14 }}>▶</span>Analisando...
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Resultado da Analise</div>
                    {result && <button onClick={() => { navigator.clipboard.writeText(result); setToast("Copiado!"); }} style={{ background: "transparent", color: "#60a5fa", fontSize: 11, padding: 0, letterSpacing: "0.1em" }}>COPIAR</button>}
                  </div>
                  <div className="result-box-modern">{result || <span style={{ color: "#52525b", fontSize: 13 }}>O resultado aparecera aqui.</span>}</div>
                </div>
              </div>
            </>
          )}

          {/* PERFIL */}
          {tab === "perfil" && <ProfileEditor userId={user.id} profile={profile} onSave={(d) => setProfile(p => ({ ...p, ...d }))} setToast={setToast} />}

          {/* PLANS */}
          {tab === "plans" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <span className="section-label">Planos</span>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 300, marginBottom: 8 }}>Gerencie seu plano</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 300 }}>
                  Voce esta no plano <span style={{ color: "#60a5fa", fontWeight: 500 }}>{plan.name}</span>.
                </p>
              </div>
              <div className="plans-dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {PLANS.map(p => (
                  <div key={p.id} className="glass-panel" style={{
                    borderRadius: 20, padding: 28, position: "relative",
                    borderColor: p.id === profile.plan ? "rgba(59,130,246,0.4)" : p.highlight ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)",
                    boxShadow: p.highlight ? "0 0 32px rgba(59,130,246,0.1)" : "none",
                    transition: "all 0.5s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = p.id === profile.plan ? "rgba(59,130,246,0.4)" : p.highlight ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)"; }}
                  >
                    {p.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "#fff", fontSize: 10, fontWeight: 600, padding: "4px 16px", letterSpacing: "0.15em", borderRadius: 9999, whiteSpace: "nowrap", textTransform: "uppercase" }}>Mais escolhido</div>}
                    {p.id === profile.plan && <div style={{ position: "absolute", top: 12, right: 16, fontSize: 10, color: "#60a5fa", fontWeight: 600, letterSpacing: "0.1em" }}>ATUAL</div>}
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.name}</div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 28, fontWeight: 700, color: p.highlight ? "#60a5fa" : "#fff" }}>{p.price}</span>
                      <span style={{ color: "#71717a", fontSize: 12 }}>{p.period}</span>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {p.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", gap: 8, fontSize: 12, color: "#71717a" }}>
                          <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { if (p.id === "free") return; window.open(MP_LINKS[p.id], "_blank"); }} disabled={p.id === profile.plan}
                      className={p.highlight ? "btn-primary" : "btn-ghost"}
                      style={{ width: "100%", height: 40, fontSize: 12, border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 9999 }}>
                      {p.id === profile.plan ? "Plano atual" : p.id === "free" ? "Gratis" : "Assinar"}
                    </button>
                    {p.id !== "free" && p.id !== profile.plan && <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#52525b" }}>PIX · Cartao · Boleto</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* HISTORICO */}
          {tab === "hist" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <span className="section-label">Historico</span>
                <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 300, marginBottom: 8 }}>Suas analises recentes</h2>
                {saved.hours > 0 && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 300 }}>Voce economizou ~{saved.hours}h (R$ {saved.value})</p>}
              </div>
              {history.length === 0 ? (
                <div className="glass-panel" style={{ borderRadius: 16, padding: 40, textAlign: "center" }}>
                  <p style={{ color: "#52525b", fontSize: 14, fontWeight: 300 }}>Nenhuma analise realizada ainda. Use um modulo para comecar.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selHist ? "1fr 1fr" : "1fr", gap: 16 }}>
                  <div>
                    {history.map(h => (
                      <div key={h.id} className="tool-row-modern" onClick={() => setSelHist(selHist?.id === h.id ? null : h)} style={{ borderColor: selHist?.id === h.id ? "rgba(59,130,246,0.3)" : undefined }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{h.tool?.replace(/_/g, " ")}</span>
                            <span style={{ fontSize: 11, color: "#34d399" }}>+{Math.round((TOOL_TIME[h.tool] || 60) / 60 * 10) / 10}h</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#71717a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 300 }}>{h.input}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selHist && (
                    <div className="glass-panel" style={{ borderRadius: 16, padding: 24, position: "sticky", top: 80 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{selHist.tool?.replace(/_/g, " ")}</div>
                        <button onClick={() => { navigator.clipboard.writeText(selHist.result); setToast("Copiado!"); }} style={{ background: "transparent", color: "#60a5fa", fontSize: 11, padding: 0 }}>COPIAR</button>
                      </div>
                      <div style={{ fontSize: 12, color: "#71717a", fontStyle: "italic", marginBottom: 12, fontWeight: 300 }}>{selHist.input}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 420, overflowY: "auto", fontWeight: 300 }}>{selHist.result}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Supabase auth state listener
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profileData?.name || session.user.user_metadata?.name || "",
          plan: profileData?.plan || "free",
        });
        setPage("app");
      }
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profileData?.name || session.user.user_metadata?.name || "",
          plan: profileData?.plan || "free",
        });
        setPage("app");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setPage("landing");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setPage("landing");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom,#030303,#0a0a0a)" }}>
        <style>{G}</style>
        <div style={{ textAlign: "center" }}>
          <Logo size={24} />
          <div style={{ marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (page === "app" && user) return <Dashboard user={user} onLogout={handleLogout} />;
  if (page === "login") return <AuthPage mode="login" onSuccess={u => { setUser(u); setPage("app"); }} onSwitch={() => setPage("register")} />;
  if (page === "register") return <AuthPage mode="register" onSuccess={u => { setUser(u); setPage("app"); }} onSwitch={() => setPage("login")} />;
  return <Landing onLogin={() => setPage("login")} onRegister={() => setPage("register")} />;
}