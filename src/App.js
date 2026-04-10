import React, { useState, useEffect, useRef, useCallback } from "react";

const MODE = "prod";
const BACKEND_URL = "https://arcane-backend-production-d37b.up.railway.app/api";

const COLORS = {
  navy: "#0a0f1e",
  navyLight: "#0d1528",
  navyMid: "#111c35",
  gold: "#c9a84c",
  goldLight: "#e2c47a",
  goldDark: "#a07830",
  white: "#f0ece0",
  gray: "#8892a4",
  grayLight: "#c8d0dc",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${COLORS.navy};
    color: ${COLORS.white};
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.navy}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.gold}; border-radius: 3px; }

  .gold { color: ${COLORS.gold}; }
  .serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    50% { box-shadow: 0 0 20px 4px rgba(201,168,76,0.3); }
  }
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.3); }
  }

  .animate-fadeUp { animation: fadeUp 0.8s ease forwards; }
  .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease forwards; }
  .animate-scaleIn { animation: scaleIn 0.6s ease forwards; }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal-left.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .reveal-right {
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal-right.visible {
    opacity: 1;
    transform: translateX(0);
  }

  input, textarea, select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(201,168,76,0.3);
    color: ${COLORS.white};
    border-radius: 6px;
    padding: 12px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.3s;
  }
  input:focus, textarea:focus {
    border-color: ${COLORS.gold};
    background: rgba(201,168,76,0.05);
  }
  input::placeholder, textarea::placeholder { color: ${COLORS.gray}; }

  button {
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    border: none;
    transition: all 0.3s ease;
  }

  .btn-gold {
    background: linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark});
    color: ${COLORS.navy};
    padding: 14px 32px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
  }
  .btn-gold::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .btn-gold:hover::after { left: 100%; }
  .btn-gold:hover {
    background: linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold});
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201,168,76,0.4);
  }

  .btn-outline {
    background: transparent;
    color: ${COLORS.gold};
    padding: 13px 32px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid ${COLORS.gold};
  }
  .btn-outline:hover {
    background: rgba(201,168,76,0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(201,168,76,0.2);
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, ${COLORS.gold}, transparent);
    margin: 60px auto;
    max-width: 400px;
  }

  .gold-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight});
    margin: 16px 0;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 8px;
    padding: 32px;
    transition: all 0.3s;
  }
  .card:hover {
    border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.05);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  }

  .section {
    padding: 100px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .section-subtitle {
    color: ${COLORS.gray};
    font-size: 16px;
    line-height: 1.7;
    max-width: 560px;
  }

  .tag {
    display: inline-block;
    background: rgba(201,168,76,0.1);
    color: ${COLORS.gold};
    border: 1px solid rgba(201,168,76,0.3);
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .sidebar {
    width: 260px;
    min-height: 100vh;
    background: ${COLORS.navyLight};
    border-right: 1px solid rgba(201,168,76,0.15);
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .sidebar-logo {
    padding: 0 28px 32px;
    border-bottom: 1px solid rgba(201,168,76,0.15);
    margin-bottom: 32px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 28px;
    color: ${COLORS.gray};
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    letter-spacing: 0.5px;
    border-left: 2px solid transparent;
  }
  .nav-item:hover { color: ${COLORS.white}; background: rgba(255,255,255,0.03); }
  .nav-item.active { color: ${COLORS.gold}; border-left-color: ${COLORS.gold}; background: rgba(201,168,76,0.05); }

  .main-content {
    margin-left: 260px;
    min-height: 100vh;
    background: ${COLORS.navy};
  }

  .topbar {
    height: 64px;
    background: ${COLORS.navyLight};
    border-bottom: 1px solid rgba(201,168,76,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .usage-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 6px;
  }
  .usage-fill {
    height: 100%;
    background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight});
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  .tool-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 8px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .tool-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight});
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  .tool-card:hover::before { transform: scaleX(1); }
  .tool-card:hover {
    border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.05);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }

  .result-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 8px;
    padding: 24px;
    min-height: 200px;
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    color: ${COLORS.grayLight};
  }

  .toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: ${COLORS.navyMid};
    border: 1px solid ${COLORS.gold};
    color: ${COLORS.white};
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    animation: fadeUp 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  /* Particle dots */
  .particle {
    position: absolute;
    border-radius: 50%;
    background: ${COLORS.gold};
    animation: starTwinkle var(--duration, 3s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
  }

  /* Step connector line */
  .step-line {
    position: absolute;
    top: 40px;
    left: calc(50% + 40px);
    width: calc(100% - 80px);
    height: 1px;
    background: linear-gradient(90deg, ${COLORS.gold}, transparent);
    opacity: 0.3;
  }
`;

// ── SCROLL REVEAL HOOK ──────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── LOGO ────────────────────────────────────────────────────────
function Logo({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size + 8, height: size + 8,
        background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
        borderRadius: 3,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.6, color: COLORS.navy, fontWeight: 700,
        boxShadow: `0 4px 15px rgba(201,168,76,0.4)`,
      }}>◆</div>
      <span style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: size, fontWeight: 600, letterSpacing: 3,
        color: COLORS.white, textTransform: "uppercase",
      }}>Arcane</span>
    </div>
  );
}

// ── TOAST ───────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className="toast">{message}</div>;
}

// ── MODULES & DATA ───────────────────────────────────────────────
const MODULES = [
  {
    id: "documentos", icon: "◈", label: "Documentos", color: COLORS.gold,
    tools: [
      { id: "contrato", name: "Gerar Contrato", desc: "Contratos profissionais personalizados", prompt: "Você é especialista em direito empresarial brasileiro. Gere um contrato profissional e completo baseado nas informações fornecidas. Use linguagem jurídica adequada." },
      { id: "proposta", name: "Proposta Comercial", desc: "Propostas persuasivas e profissionais", prompt: "Você é especialista em vendas B2B. Crie uma proposta comercial persuasiva, estruturada e profissional." },
      { id: "relatorio", name: "Relatório Executivo", desc: "Relatórios claros e impactantes", prompt: "Você é especialista em comunicação executiva. Crie um relatório executivo claro, estruturado e impactante." },
      { id: "email_corp", name: "E-mail Corporativo", desc: "Comunicações formais e eficazes", prompt: "Você é especialista em comunicação corporativa. Escreva um e-mail profissional, claro e persuasivo." },
    ]
  },
  {
    id: "dados", icon: "◇", label: "Dados", color: "#6bb5ff",
    tools: [
      { id: "analise", name: "Análise de Dados", desc: "Insights estratégicos dos seus dados", prompt: "Você é analista de dados sênior. Analise os dados fornecidos e gere insights estratégicos com linguagem clara para gestores." },
      { id: "query", name: "Gerar Query SQL", desc: "Consultas SQL otimizadas", prompt: "Você é especialista em banco de dados. Gere uma query SQL otimizada e bem comentada." },
      { id: "previsao", name: "Previsão e Tendências", desc: "Antecipe cenários do seu negócio", prompt: "Você é especialista em business intelligence. Analise e projete tendências com base nos dados fornecidos." },
      { id: "kpis", name: "Definir KPIs", desc: "Métricas certas para seu negócio", prompt: "Você é especialista em gestão por indicadores. Sugira KPIs relevantes e como mensurá-los." },
    ]
  },
  {
    id: "produtividade", icon: "◉", label: "Produtividade", color: "#7ed89a",
    tools: [
      { id: "ata", name: "Ata de Reunião", desc: "Documente decisões com clareza", prompt: "Você é especialista em comunicação empresarial. Gere uma ata de reunião profissional e estruturada." },
      { id: "resumo", name: "Resumir Documento", desc: "Sínteses executivas precisas", prompt: "Você é especialista em síntese de informações. Resuma o conteúdo de forma clara, destacando pontos-chave." },
      { id: "onboarding", name: "Plano de Onboarding", desc: "Integre novos colaboradores", prompt: "Você é especialista em gestão de pessoas. Crie um plano de onboarding estruturado e acolhedor." },
      { id: "base_conhecimento", name: "Base de Conhecimento", desc: "Organize o saber da empresa", prompt: "Você é especialista em gestão do conhecimento. Estruture as informações em uma base de conhecimento clara." },
    ]
  },
  {
    id: "conteudo", icon: "◆", label: "Conteúdo", color: "#c78fff",
    tools: [
      { id: "post_social", name: "Post para Redes Sociais", desc: "Conteúdo que engaja e converte", prompt: "Você é especialista em marketing digital. Crie posts envolventes e estratégicos para redes sociais." },
      { id: "blog", name: "Artigo para Blog", desc: "Conteúdo que posiciona sua marca", prompt: "Você é especialista em content marketing e SEO. Escreva um artigo completo, envolvente e otimizado." },
      { id: "email_mkt", name: "E-mail Marketing", desc: "Campanhas que geram resultados", prompt: "Você é especialista em e-mail marketing. Escreva um e-mail de campanha persuasivo e com alto potencial de conversão." },
      { id: "descricao", name: "Descrição de Produto", desc: "Textos que vendem mais", prompt: "Você é especialista em copywriting. Escreva uma descrição de produto irresistível que destaca benefícios e gera desejo." },
    ]
  },
];

// PLANO FREE = 5 gerações, corrigido aqui no frontend
const PLANS = [
  { id: "free", name: "Free", price: "R$ 0", period: "", gens: "5 gerações/mês", gensLimit: 5, users: "1 usuário", highlight: false, features: ["4 módulos completos", "Acesso básico", "Suporte por e-mail"] },
  { id: "starter", name: "Starter", price: "R$ 97", period: "/mês", gens: "150 gerações/mês", gensLimit: 150, users: "3 usuários", highlight: false, features: ["Tudo do Free", "3 usuários", "Suporte prioritário", "Histórico 30 dias"] },
  { id: "business", name: "Business", price: "R$ 297", period: "/mês", gens: "500 gerações/mês", gensLimit: 500, users: "15 usuários", highlight: true, features: ["Tudo do Starter", "15 usuários", "Acesso à API", "Histórico completo", "Suporte dedicado"] },
  { id: "unlimited", name: "Unlimited", price: "R$ 897", period: "/mês", gens: "Gerações ilimitadas", gensLimit: 99999, users: "Usuários ilimitados", highlight: false, features: ["Tudo do Business", "Usuários ilimitados", "IA personalizada", "SLA dedicado", "Integração customizada", "Treinamento da equipe"] },
];

const TESTIMONIALS = [
  { name: "Fernanda Oliveira", role: "CEO, Construtora Horizonte", text: "O Arcane transformou nossa produção de contratos. O que levava 2 horas, agora fazemos em 5 minutos. Impressionante.", avatar: "F" },
  { name: "Rafael Mendes", role: "Diretor Comercial, LogTech", text: "Nossas propostas ficaram muito mais profissionais. Fechamos 40% mais negócios no primeiro mês usando o Arcane.", avatar: "R" },
  { name: "Camila Santos", role: "Gerente de Marketing, Viva Moda", text: "A qualidade do conteúdo gerado é surpreendente. Economizamos R$ 8.000/mês em agência de conteúdo.", avatar: "C" },
];

const FAQS = [
  { q: "Preciso saber programar para usar o Arcane?", a: "Não! O Arcane foi desenvolvido para qualquer profissional. A interface é intuitiva e você começa a gerar resultados em minutos, sem nenhum conhecimento técnico." },
  { q: "Os dados da minha empresa ficam seguros?", a: "Sim. Utilizamos criptografia de ponta a ponta e seus dados nunca são usados para treinar modelos de IA. Seguimos todas as diretrizes da LGPD." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem taxas ou burocracia. Você pode cancelar sua assinatura quando quiser diretamente pelo painel." },
  { q: "O plano Free tem limitações?", a: "O plano Free oferece 5 gerações por mês para você experimentar a plataforma. Para uso profissional, recomendamos o Starter ou Business." },
  { q: "Como funciona o suporte?", a: "Planos pagos têm suporte via e-mail com resposta em até 24h. O plano Business inclui suporte prioritário e o Unlimited tem gerente de conta dedicado." },
];

const COMPARISON = [
  { feature: "Gerações mensais", arcane: "Até ilimitado", chatgpt: "Limitado", concorrente: "Limitado" },
  { feature: "Focado em empresas", arcane: "✓", chatgpt: "✗", concorrente: "Parcial" },
  { feature: "Português nativo", arcane: "✓", chatgpt: "Parcial", concorrente: "✗" },
  { feature: "Módulos especializados", arcane: "✓", chatgpt: "✗", concorrente: "✗" },
  { feature: "Suporte dedicado", arcane: "✓", chatgpt: "✗", concorrente: "Parcial" },
  { feature: "Conformidade LGPD", arcane: "✓", chatgpt: "✗", concorrente: "✗" },
  { feature: "Preço acessível", arcane: "✓", chatgpt: "✗", concorrente: "Parcial" },
];

const HOW_IT_WORKS_STEPS = [
  { number: "01", title: "Crie sua conta", desc: "Cadastre-se gratuitamente em menos de 1 minuto. Sem cartão de crédito necessário.", icon: "◎" },
  { number: "02", title: "Escolha a ferramenta", desc: "Selecione entre 16 ferramentas especializadas em 4 módulos de negócio.", icon: "◈" },
  { number: "03", title: "Insira suas informações", desc: "Descreva o que você precisa. Quanto mais detalhes, melhor o resultado.", icon: "◇" },
  { number: "04", title: "Receba o resultado", desc: "A IA gera seu conteúdo profissional em segundos. Copie, edite e use.", icon: "◆" },
];

// ── PARTICLES BACKGROUND ─────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: (Math.random() * 3 + 2).toFixed(1),
    delay: (Math.random() * 4).toFixed(1),
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          top: `${p.top}%`, left: `${p.left}%`,
          opacity: p.opacity,
          "--duration": `${p.duration}s`,
          "--delay": `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ── MERCADO PAGO LINKS (substitua pelos seus links reais do MP) ──
const MP_LINKS = {
  starter: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_STARTER",
  business: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_BUSINESS",
  unlimited: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_UNLIMITED",
};

// ── AUTH PAGE ────────────────────────────────────────────────────
function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setLoading(true); setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await fetch(BACKEND_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao autenticar");
      localStorage.setItem("arcane_token", data.access_token);
      localStorage.setItem("arcane_user", JSON.stringify(data.user));
      onSuccess(data.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", background: COLORS.navy,
      position: "relative", overflow: "hidden",
    }}>
      <style>{globalStyles}</style>

      {/* Left panel — branding */}
      <div style={{
        width: "45%", background: `linear-gradient(160deg, ${COLORS.navyMid} 0%, ${COLORS.navy} 100%)`,
        borderRight: `1px solid rgba(201,168,76,0.12)`,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 64px", position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 400, height: 400,
          background: `radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <Particles />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Logo size={22} />

          <div style={{ marginTop: 64 }}>
            <div className="tag" style={{ marginBottom: 24 }}>Plataforma de IA</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
              Conteúdo profissional<br />
              em <em style={{ color: COLORS.gold }}>segundos</em>
            </h2>
            <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.8, marginBottom: 48 }}>
              16 ferramentas de IA especializadas para empresas brasileiras. Documentos, dados, conteúdo e muito mais.
            </p>

            {/* Mini features */}
            {[
              { icon: "◈", text: "16 ferramentas especializadas" },
              { icon: "◇", text: "Resultados em menos de 30 segundos" },
              { icon: "◆", text: "100% em português, focado no Brasil" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <span style={{ color: COLORS.gold, fontSize: 16 }}>{f.icon}</span>
                <span style={{ color: COLORS.grayLight, fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ color: COLORS.gray, fontSize: 12, marginBottom: 12 }}>PLANO GRATUITO INCLUI</div>
            <div style={{ color: COLORS.grayLight, fontSize: 14 }}>✓ 5 gerações por mês &nbsp;·&nbsp; ✓ Todos os módulos &nbsp;·&nbsp; ✓ Sem cartão</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 64px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
              {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
            </h3>
            <p style={{ color: COLORS.gray, fontSize: 14 }}>
              {mode === "login" ? "Entre para continuar usando o Arcane" : "Comece gratuitamente, sem cartão de crédito"}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Nome completo
                </label>
                <input
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ fontSize: 15, padding: "14px 18px" }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, color: COLORS.gray, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ fontSize: 15, padding: "14px 18px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, color: COLORS.gray, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handle()}
                style={{ fontSize: 15, padding: "14px 18px" }}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)",
                borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "#ff9090",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              className="btn-gold"
              onClick={handle}
              disabled={loading}
              style={{ width: "100%", fontSize: 14, padding: "16px", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar na plataforma" : "Criar conta grátis"}
            </button>

            {mode === "register" && (
              <p style={{ fontSize: 12, color: COLORS.gray, textAlign: "center", lineHeight: 1.6 }}>
                Ao criar uma conta você concorda com nossos{" "}
                <span style={{ color: COLORS.gold, cursor: "pointer" }}>Termos de Uso</span>{" "}
                e{" "}
                <span style={{ color: COLORS.gold, cursor: "pointer" }}>Política de Privacidade</span>.
              </p>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 32, paddingTop: 32, borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            <span style={{ color: COLORS.gray, fontSize: 14 }}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            </span>
            <span
              onClick={onSwitch}
              style={{ color: COLORS.gold, cursor: "pointer", fontSize: 14, fontWeight: 500 }}
            >
              {mode === "login" ? "Criar gratuitamente →" : "Entrar →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP DASHBOARD ────────────────────────────────────────────────
function AppDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [usageData, setUsageData] = useState(null);

  const currentModule = MODULES.find(m => m.id === activeModule);
  const plan = PLANS.find(p => p.id === (user.plan || "free")) || PLANS[0];

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem("arcane_token");
      const res = await fetch(BACKEND_URL + "/user/usage", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsageData(data);
      }
    } catch (e) {}
  };

  // Force frontend plan limits — ignore whatever the backend says for limit
  // Backend may return: used, generations_used, count — try all
  const usedCount = usageData?.used ?? usageData?.generations_used ?? usageData?.count ?? 0;
  const limitCount = plan.gensLimit; // Always use frontend value (5 for free)
  const usagePct = limitCount >= 99999 ? 0 : Math.min((usedCount / limitCount) * 100, 100);
  const remaining = limitCount >= 99999 ? "∞" : Math.max(limitCount - usedCount, 0);

  const generate = async () => {
    if (!activeTool || !input.trim()) return;
    if (remaining !== "∞" && remaining <= 0) {
      setToast("Limite de gerações atingido. Faça upgrade do plano!");
      return;
    }
    setLoading(true); setResult("");
    try {
      const token = localStorage.getItem("arcane_token");
      const res = await fetch(BACKEND_URL + "/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tool_id: activeTool.id, prompt: activeTool.prompt, user_input: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar");
      setResult(data.result || data.content || "");
      fetchUsage();
    } catch (e) { setToast(e.message); }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setToast("Copiado para a área de transferência!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{globalStyles}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <Logo size={17} />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "8px 16px", fontSize: 10, color: COLORS.gray, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Módulos</div>
          {MODULES.map(mod => (
            <div key={mod.id} className={`nav-item ${activeModule === mod.id ? "active" : ""}`}
              onClick={() => { setActiveModule(mod.id); setActiveTool(null); setResult(""); }}>
              <span style={{ color: mod.color, fontSize: 16 }}>{mod.icon}</span>
              <span>{mod.label}</span>
            </div>
          ))}
          <div style={{ padding: "16px 16px 4px", fontSize: 10, color: COLORS.gray, letterSpacing: 2, textTransform: "uppercase", marginTop: 8 }}>Geral</div>
          <div className={`nav-item ${activeModule === null ? "active" : ""}`}
            onClick={() => { setActiveModule(null); setActiveTool(null); setResult(""); }}>
            <span style={{ fontSize: 16 }}>⊞</span>
            <span>Dashboard</span>
          </div>
        </div>

        <div style={{ padding: "24px 28px", borderTop: `1px solid rgba(201,168,76,0.15)` }}>
          <div style={{ fontSize: 11, color: COLORS.gray, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            Plano {plan.name}
          </div>
          <div style={{ fontSize: 12, color: COLORS.grayLight, marginBottom: 6 }}>
            {remaining === "∞" ? "Ilimitado" : `${remaining} de ${limitCount} restantes`}
          </div>
          <div className="usage-bar">
            <div className="usage-fill" style={{ width: `${usagePct}%` }} />
          </div>
          <div onClick={onLogout} style={{ marginTop: 20, fontSize: 13, color: COLORS.gray, cursor: "pointer" }}
            onMouseEnter={e => e.target.style.color = COLORS.white}
            onMouseLeave={e => e.target.style.color = COLORS.gray}>
            ← Sair
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>
              {activeModule ? currentModule?.label : "Dashboard"}
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>
              {activeModule ? `${currentModule?.tools.length} ferramentas disponíveis` : "Bem-vindo ao Arcane"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: COLORS.grayLight }}>{user.name || user.email}</div>
              <div style={{ fontSize: 11, color: COLORS.gold }}>{plan.name}</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, color: COLORS.navy,
            }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding: 32 }}>
          {/* DASHBOARD HOME */}
          {!activeModule && (
            <>
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
                  Olá, <em style={{ color: COLORS.gold }}>{user.name || "bem-vindo"}</em>
                </h2>
                <p style={{ color: COLORS.gray, fontSize: 14 }}>O que vamos criar hoje?</p>
              </div>

              {/* Usage card */}
              <div style={{
                background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 8, padding: "20px 24px", marginBottom: 32,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>
                    Uso este mês — Plano {plan.name}
                  </div>
                  <div style={{ fontSize: 22, fontFamily: "Cormorant Garamond, serif", color: COLORS.gold }}>
                    {usedCount} <span style={{ fontSize: 14, color: COLORS.gray }}>de {limitCount === 99999 ? "∞" : limitCount} gerações</span>
                  </div>
                </div>
                <div style={{ width: 160 }}>
                  <div style={{ fontSize: 12, color: COLORS.gray, textAlign: "right", marginBottom: 6 }}>
                    {remaining === "∞" ? "Ilimitado" : `${remaining} restantes`}
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{ width: `${usagePct}%` }} />
                  </div>
                </div>
              </div>

              {/* Module grid 2x2 */}
              <div style={{ fontSize: 12, color: COLORS.gray, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                Módulos disponíveis
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {MODULES.map(mod => (
                  <div key={mod.id} className="tool-card"
                    onClick={() => { setActiveModule(mod.id); setActiveTool(null); }}
                    style={{ padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 8,
                        background: `rgba(${mod.color === COLORS.gold ? "201,168,76" : mod.color === "#6bb5ff" ? "107,181,255" : mod.color === "#7ed89a" ? "126,216,154" : "199,143,255"},0.12)`,
                        border: `1px solid rgba(${mod.color === COLORS.gold ? "201,168,76" : mod.color === "#6bb5ff" ? "107,181,255" : mod.color === "#7ed89a" ? "126,216,154" : "199,143,255"},0.3)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>
                        <span style={{ color: mod.color }}>{mod.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{mod.label}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray }}>{mod.tools.length} ferramentas</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {mod.tools.map(tool => (
                        <span key={tool.id} style={{
                          fontSize: 11, color: COLORS.gray,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 4, padding: "3px 8px",
                        }}>{tool.name}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, fontSize: 12, color: mod.color }}>Abrir módulo →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MODULE TOOLS LIST */}
          {activeModule && !activeTool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <button onClick={() => { setActiveModule(null); }}
                  style={{ background: "transparent", color: COLORS.gray, fontSize: 13, padding: 0 }}
                  onMouseEnter={e => e.target.style.color = COLORS.white}
                  onMouseLeave={e => e.target.style.color = COLORS.gray}>
                  ← Dashboard
                </button>
                <div style={{ width: 1, height: 16, background: "rgba(201,168,76,0.2)" }} />
                <div style={{ fontSize: 14, color: COLORS.grayLight }}>{currentModule?.label}</div>
              </div>

              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>
                Módulo de <em style={{ color: COLORS.gold }}>{currentModule?.label}</em>
              </h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 32 }}>Selecione uma ferramenta para começar a gerar</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {currentModule?.tools.map(tool => (
                  <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool)}>
                    <div style={{ fontSize: 10, color: currentModule.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                      {currentModule.icon} {currentModule.label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{tool.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray, lineHeight: 1.6 }}>{tool.desc}</div>
                    <div style={{ marginTop: 20, fontSize: 12, color: COLORS.gold }}>Usar ferramenta →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ACTIVE TOOL */}
          {activeModule && activeTool && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <button onClick={() => { setActiveTool(null); setResult(""); setInput(""); }}
                  style={{ background: "transparent", color: COLORS.gray, fontSize: 13, padding: 0 }}
                  onMouseEnter={e => e.target.style.color = COLORS.white}
                  onMouseLeave={e => e.target.style.color = COLORS.gray}>
                  ← Voltar
                </button>
                <div style={{ width: 1, height: 16, background: "rgba(201,168,76,0.2)" }} />
                <div style={{ fontSize: 14, color: COLORS.grayLight }}>{activeTool.name}</div>
              </div>

              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>
                {activeTool.name}
              </h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 32 }}>{activeTool.desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <label style={{ fontSize: 12, color: COLORS.gray, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                    Descreva o que você precisa
                  </label>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ex: Contrato de prestação de serviços entre empresa X e Y, valor R$ 5.000, prazo 3 meses..."
                    rows={8}
                    style={{ resize: "vertical" }}
                  />
                  <button className="btn-gold" onClick={generate} disabled={loading || !input.trim()}
                    style={{ marginTop: 16, width: "100%", opacity: loading || !input.trim() ? 0.6 : 1 }}>
                    {loading ? "Gerando..." : "✦ Gerar com IA"}
                  </button>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: COLORS.gray, letterSpacing: 1, textTransform: "uppercase" }}>Resultado</label>
                    {result && (
                      <button onClick={copyResult} style={{ background: "transparent", color: COLORS.gold, fontSize: 12, padding: 0 }}>
                        Copiar ↗
                      </button>
                    )}
                  </div>
                  <div className="result-box">
                    {loading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.gray }}>
                        <div style={{ animation: "pulse 1.5s ease infinite" }}>✦</div>
                        Gerando seu conteúdo...
                      </div>
                    ) : result || (
                      <span style={{ color: COLORS.gray }}>O resultado aparecerá aqui...</span>
                    )}
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

// ── LANDING PAGE ─────────────────────────────────────────────────
function LandingPage({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{globalStyles}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? `rgba(10,15,30,0.95)` : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(201,168,76,0.15)` : "none",
        transition: "all 0.4s ease",
      }}>
        <Logo size={20} />
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Como Funciona", "Ferramentas", "Planos", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
              style={{ color: COLORS.gray, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = COLORS.gray}>
              {item}
            </a>
          ))}
          <button className="btn-outline" onClick={onLogin} style={{ padding: "10px 24px", fontSize: 13 }}>Entrar</button>
          <button className="btn-gold" onClick={onRegister} style={{ padding: "10px 24px", fontSize: 13 }}>Começar Grátis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 72 }}>
        <Particles />

        {/* Background glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600,
          background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 760 }}>
            <div className="tag animate-fadeIn" style={{ animationDelay: "0.2s", opacity: 0 }}>
              ✦ Plataforma de IA para Empresas
            </div>
            <h1 className="animate-fadeUp" style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 300, lineHeight: 1.1, marginBottom: 28,
              animationDelay: "0.3s", opacity: 0,
            }}>
              Gere conteúdo<br />
              profissional com<br />
              <em style={{
                color: COLORS.gold,
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}>inteligência artificial</em>
            </h1>
            <p className="animate-fadeUp" style={{
              color: COLORS.gray, fontSize: 18, lineHeight: 1.8, marginBottom: 48, maxWidth: 560,
              animationDelay: "0.5s", opacity: 0,
            }}>
              16 ferramentas especializadas em documentos, dados, produtividade e conteúdo. Resultados profissionais em segundos.
            </p>
            <div className="animate-fadeUp" style={{ display: "flex", gap: 16, animationDelay: "0.7s", opacity: 0 }}>
              <button className="btn-gold" onClick={onRegister} style={{ fontSize: 15, padding: "16px 40px" }}>
                Começar Gratuitamente
              </button>
              <button className="btn-outline" onClick={onLogin} style={{ fontSize: 15, padding: "16px 40px" }}>
                Já tenho conta
              </button>
            </div>

            {/* Stats */}
            <div className="animate-fadeUp" style={{
              display: "flex", gap: 48, marginTop: 64,
              animationDelay: "0.9s", opacity: 0,
            }}>
              {[
                { n: "16", label: "Ferramentas de IA" },
                { n: "4", label: "Módulos especializados" },
                { n: "< 30s", label: "Tempo de geração" },
              ].map(stat => (
                <div key={stat.n}>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 300, color: COLORS.gold }}>{stat.n}</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "120px 48px", background: COLORS.navyLight, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="tag reveal">Como Funciona</div>
            <h2 className="section-title reveal" style={{ textAlign: "center", marginBottom: 16 }}>
              Do zero ao resultado<br /><em style={{ color: COLORS.gold }}>em 4 passos simples</em>
            </h2>
            <p className="reveal" style={{ color: COLORS.gray, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Sem curva de aprendizado. Sem complicação. Você começa a usar em minutos.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative" }}>
            {/* Connector line */}
            <div style={{
              position: "absolute", top: 44, left: "12.5%", right: "12.5%",
              height: 1,
              background: `linear-gradient(90deg, ${COLORS.gold}, rgba(201,168,76,0.3), ${COLORS.gold})`,
              opacity: 0.3,
              zIndex: 0,
            }} />

            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={i} className="reveal" style={{
                textAlign: "center", position: "relative", zIndex: 1,
                transitionDelay: `${i * 0.15}s`,
              }}>
                {/* Circle */}
                <div style={{
                  width: 88, height: 88,
                  background: `linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`,
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  boxShadow: `0 0 40px rgba(201,168,76,0.1)`,
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 0 60px rgba(201,168,76,0.3)`;
                    e.currentTarget.style.borderColor = COLORS.gold;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = `0 0 40px rgba(201,168,76,0.1)`;
                    e.currentTarget.style.borderColor = `rgba(201,168,76,0.4)`;
                  }}
                >
                  <span style={{ color: COLORS.gold, fontSize: 28 }}>{step.icon}</span>
                </div>

                <div style={{
                  fontSize: 11, color: COLORS.gold, letterSpacing: 3,
                  textTransform: "uppercase", marginBottom: 12,
                }}>Passo {step.number}</div>
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 12 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div style={{ textAlign: "center", marginTop: 72 }}>
            <button className="btn-gold reveal" onClick={onRegister} style={{ fontSize: 15, padding: "16px 48px" }}>
              Experimentar Agora — É Grátis
            </button>
          </div>
        </div>
      </section>

      {/* FERRAMENTAS */}
      <section id="ferramentas" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div className="tag reveal">Ferramentas</div>
            <h2 className="section-title reveal">16 ferramentas para<br /><em style={{ color: COLORS.gold }}>cada necessidade</em></h2>
            <div className="gold-line reveal" />
            <p className="section-subtitle reveal">Módulos especializados para cobrir todas as áreas estratégicas do seu negócio.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {MODULES.map((mod, mi) => (
              <div key={mod.id} className={`card reveal${mi % 2 === 0 ? "-left" : "-right"}`}
                style={{ transitionDelay: `${mi * 0.1}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 24, color: mod.color }}>{mod.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{mod.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray }}>{mod.tools.length} ferramentas</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {mod.tools.map(tool => (
                    <div key={tool.id} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201,168,76,0.08)",
                      borderRadius: 6, padding: "10px 14px",
                      fontSize: 13, color: COLORS.grayLight,
                    }}>
                      {tool.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ padding: "120px 48px", background: COLORS.navyLight }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag reveal">Depoimentos</div>
            <h2 className="section-title reveal" style={{ textAlign: "center" }}>
              O que nossos clientes<br /><em style={{ color: COLORS.gold }}>estão dizendo</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div style={{ color: COLORS.gold, fontSize: 24, marginBottom: 16, letterSpacing: -2 }}>✦✦✦✦✦</div>
                <p style={{ fontSize: 15, color: COLORS.grayLight, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 600, color: COLORS.navy,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 64, textAlign: "center" }}>
            <div className="tag reveal">Comparativo</div>
            <h2 className="section-title reveal" style={{ textAlign: "center" }}>
              Por que escolher<br /><em style={{ color: COLORS.gold }}>o Arcane?</em>
            </h2>
          </div>
          <div className="reveal" style={{ borderRadius: 10, overflow: "hidden", border: `1px solid rgba(201,168,76,0.2)` }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `rgba(201,168,76,0.1)` }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, color: COLORS.gray, fontWeight: 400 }}>Recurso</th>
                  <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 13, color: COLORS.gold, fontWeight: 600 }}>Arcane</th>
                  <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 13, color: COLORS.gray, fontWeight: 400 }}>ChatGPT</th>
                  <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 13, color: COLORS.gray, fontWeight: 400 }}>Concorrentes</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid rgba(201,168,76,0.08)`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: COLORS.grayLight }}>{row.feature}</td>
                    <td style={{ padding: "14px 24px", textAlign: "center", fontSize: 14, color: COLORS.gold, fontWeight: 600 }}>{row.arcane}</td>
                    <td style={{ padding: "14px 24px", textAlign: "center", fontSize: 14, color: row.chatgpt === "✗" ? "#ff8080" : COLORS.gray }}>{row.chatgpt}</td>
                    <td style={{ padding: "14px 24px", textAlign: "center", fontSize: 14, color: row.concorrente === "✗" ? "#ff8080" : COLORS.gray }}>{row.concorrente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: "120px 48px", background: COLORS.navyLight }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag reveal">Planos</div>
            <h2 className="section-title reveal" style={{ textAlign: "center" }}>Escolha o plano<br /><em style={{ color: COLORS.gold }}>ideal para você</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {PLANS.map((plan, i) => (
              <div key={plan.id} className="reveal" style={{
                background: plan.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan.highlight ? COLORS.gold : "rgba(201,168,76,0.15)"}`,
                borderRadius: 8, padding: 32,
                position: "relative",
                transform: plan.highlight ? "scale(1.02)" : "scale(1)",
                animation: plan.highlight ? "borderGlow 3s ease-in-out infinite" : "none",
                transitionDelay: `${i * 0.1}s`,
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.navy, fontSize: 11, fontWeight: 700,
                    padding: "4px 16px", borderRadius: 20, letterSpacing: 1,
                    whiteSpace: "nowrap",
                  }}>⭐ RECOMENDADO</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 44, fontWeight: 300, color: plan.highlight ? COLORS.gold : COLORS.white }}>{plan.price}</span>
                  <span style={{ color: COLORS.gray, fontSize: 14 }}>{plan.period}</span>
                </div>
                <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 24 }}>{plan.gens} · {plan.users}</div>
                <div style={{ height: 1, background: "rgba(201,168,76,0.15)", marginBottom: 24 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: COLORS.grayLight }}>
                      <span style={{ color: COLORS.gold, fontSize: 10 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (plan.id === "free") { onRegister(); }
                    else { window.open(MP_LINKS[plan.id], "_blank"); }
                  }}
                  style={{
                    width: "100%", padding: "14px",
                    background: plan.highlight ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})` : "transparent",
                    color: plan.highlight ? COLORS.navy : COLORS.gold,
                    border: plan.highlight ? "none" : `1px solid ${COLORS.gold}`,
                    borderRadius: 4, fontWeight: plan.highlight ? 700 : 500,
                    fontSize: 14, letterSpacing: 1, textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.3s",
                  }}
                  onMouseEnter={e => { if (!plan.highlight) e.target.style.background = "rgba(201,168,76,0.1)"; }}
                  onMouseLeave={e => { if (!plan.highlight) e.target.style.background = "transparent"; }}
                >
                  {plan.id === "free" ? "Começar Grátis" : "💳 Assinar com Mercado Pago"}
                </button>
                {plan.id !== "free" && (
                  <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: COLORS.gray }}>
                    PIX · Cartão de crédito · Boleto
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="tag reveal">FAQ</div>
          <h2 className="section-title reveal">Perguntas<br /><em style={{ color: COLORS.gold }}>frequentes</em></h2>
          <div className="gold-line reveal" style={{ marginBottom: 48 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="reveal" style={{
                border: `1px solid rgba(201,168,76,${openFaq === i ? "0.3" : "0.12"})`,
                borderRadius: 6, overflow: "hidden",
                background: openFaq === i ? "rgba(201,168,76,0.05)" : "transparent",
                transition: "all 0.3s",
                transitionDelay: `${i * 0.05}s`,
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: "100%", padding: "20px 24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "transparent", color: COLORS.white,
                  fontSize: 15, textAlign: "left", fontWeight: 400,
                }}>
                  {faq.q}
                  <span style={{ color: COLORS.gold, fontSize: 20, lineHeight: 1, flexShrink: 0, marginLeft: 16 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", color: COLORS.gray, fontSize: 14, lineHeight: 1.8, animation: "fadeUp 0.3s ease" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "120px 48px", background: COLORS.navyLight, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500,
          background: `radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="tag reveal" style={{ margin: "0 auto 20px" }}>Comece Hoje</div>
          <div className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Pronto para transformar<br />sua <em style={{ color: COLORS.gold }}>produtividade?</em>
          </div>
          <p className="reveal" style={{ color: COLORS.gray, fontSize: 16, marginBottom: 40 }}>
            Junte-se a centenas de empresas que já usam o Arcane para trabalhar de forma mais inteligente.
          </p>
          <button className="btn-gold reveal" onClick={onRegister} style={{ fontSize: 16, padding: "18px 56px" }}>
            Criar Conta Grátis Agora
          </button>
          <p className="reveal" style={{ color: COLORS.gray, fontSize: 13, marginTop: 16 }}>
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid rgba(201,168,76,0.15)`,
        padding: "40px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20,
      }}>
        <Logo size={18} />
        <div style={{ color: COLORS.gray, fontSize: 13 }}>
          © 2026 Arcane. Todos os direitos reservados.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacidade", "Termos", "Contato"].map(item => (
            <span key={item} style={{ color: COLORS.gray, fontSize: 13, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = COLORS.gray}>
              {item}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("arcane_token");
    const savedUser = localStorage.getItem("arcane_user");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); setScreen("app"); } catch (e) {}
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen("app");
  };

  const handleLogout = () => {
    localStorage.removeItem("arcane_token");
    localStorage.removeItem("arcane_user");
    setUser(null); setScreen("landing");
  };

  if (screen === "app" && user) return <AppDashboard user={user} onLogout={handleLogout} />;
  if (screen === "login") return <AuthPage mode="login" onSuccess={handleAuthSuccess} onSwitch={() => setScreen("register")} />;
  if (screen === "register") return <AuthPage mode="register" onSuccess={handleAuthSuccess} onSwitch={() => setScreen("login")} />;
  return <LandingPage onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
}
