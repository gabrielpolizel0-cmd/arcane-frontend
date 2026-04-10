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

  .animate-fadeUp { animation: fadeUp 0.8s ease forwards; }
  .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }

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
  }
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
  }
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
`;

// ═══════════════════════════════════════════════
// DADOS
// ═══════════════════════════════════════════════

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

const PLANS = [
  { id: "free", name: "Free", price: "R$ 0", period: "", gens: "5 gerações/mês", users: "1 usuário", highlight: false, features: ["4 módulos completos", "Acesso básico", "Suporte por e-mail"] },
  { id: "starter", name: "Starter", price: "R$ 97", period: "/mês", gens: "150 gerações/mês", users: "3 usuários", highlight: false, features: ["Tudo do Free", "3 usuários", "Suporte prioritário", "Histórico 30 dias"] },
  { id: "business", name: "Business", price: "R$ 297", period: "/mês", gens: "500 gerações/mês", users: "15 usuários", highlight: true, features: ["Tudo do Starter", "15 usuários", "Acesso à API", "Histórico completo", "Suporte dedicado"] },
  { id: "unlimited", name: "Unlimited", price: "R$ 897", period: "/mês", gens: "Gerações ilimitadas", users: "Usuários ilimitados", highlight: false, features: ["Tudo do Business", "Usuários ilimitados", "IA personalizada", "SLA dedicado", "Integração customizada", "Treinamento da equipe"] },
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
  { feature: "Templates prontos", arcane: "✓", chatgpt: "✗", concorrente: "✓" },
  { feature: "Histórico de gerações", arcane: "✓", chatgpt: "✓", concorrente: "✗" },
  { feature: "Multi-usuários", arcane: "✓", chatgpt: "✗", concorrente: "✓" },
  { feature: "Suporte em português", arcane: "✓", chatgpt: "Parcial", concorrente: "✗" },
  { feature: "Preço acessível", arcane: "✓", chatgpt: "✗", concorrente: "✗" },
];

// ═══════════════════════════════════════════════
// COMPONENTES
// ═══════════════════════════════════════════════

function Logo({ size = 24 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size + 8, height: size + 8,
        background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.6, fontWeight: 700, color: COLORS.navy,
        fontFamily: "Cormorant Garamond, serif",
      }}>A</div>
      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: size, fontWeight: 400, letterSpacing: 2, color: COLORS.white }}>ARCANE</span>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{message}</div>;
}

// ═══════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════

function LandingPage({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: COLORS.navy, minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(201,168,76,0.15)`,
        padding: "0 40px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo size={22} />
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Módulos", "Planos", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: COLORS.gray, textDecoration: "none", fontSize: 14, letterSpacing: 0.5, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = COLORS.gray}>
              {item}
            </a>
          ))}
          <button className="btn-outline" onClick={onLogin} style={{ padding: "10px 24px" }}>Entrar</button>
          <button className="btn-gold" onClick={onRegister} style={{ padding: "10px 24px" }}>Começar Grátis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 40px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background ornaments */}
        <div style={{
          position: "absolute", top: "20%", right: "10%",
          width: 400, height: 400,
          background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 300, height: 300,
          background: `radial-gradient(circle, rgba(107,181,255,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(${COLORS.gold} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gold} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, textAlign: "center", position: "relative" }}>
          <div className="tag">Workspace Inteligente para Empresas</div>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 300, lineHeight: 1.1,
            marginBottom: 28,
            animation: "fadeUp 0.8s ease forwards",
          }}>
            Automatize o trabalho<br />que consome <em style={{ color: COLORS.gold, fontStyle: "italic" }}>horas</em>
          </h1>
          <p style={{
            color: COLORS.gray, fontSize: 18, lineHeight: 1.8,
            maxWidth: 600, margin: "0 auto 48px",
            animation: "fadeUp 0.8s 0.2s ease both",
          }}>
            Documentos, dados, produtividade e conteúdo — tudo com inteligência artificial de última geração, numa única plataforma.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.8s 0.4s ease both" }}>
            <button className="btn-gold" onClick={onRegister} style={{ fontSize: 15 }}>Criar Conta Grátis</button>
            <button className="btn-outline" onClick={onLogin} style={{ fontSize: 15 }}>Ver Demonstração</button>
          </div>
          <p style={{ marginTop: 20, color: COLORS.gray, fontSize: 13 }}>
            Sem cartão de crédito · 5 gerações grátis · Cancele quando quiser
          </p>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 48, justifyContent: "center", marginTop: 72,
            padding: "40px 0", borderTop: `1px solid rgba(201,168,76,0.15)`,
            animation: "fadeIn 1s 0.6s ease both",
          }}>
            {[["16", "Ferramentas"], ["4", "Módulos"], ["500+", "Empresas"], ["98%", "Satisfação"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 42, fontWeight: 300, color: COLORS.gold }}>{num}</div>
                <div style={{ color: COLORS.gray, fontSize: 13, letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="módulos" style={{ padding: "100px 40px", background: COLORS.navyLight }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag">Módulos</div>
          <h2 className="section-title">Tudo que sua empresa precisa,<br /><em className="gold">numa só plataforma</em></h2>
          <div className="gold-line" />
          <p className="section-subtitle" style={{ marginBottom: 60 }}>
            16 ferramentas de IA organizadas em 4 módulos estratégicos para acelerar cada área do seu negócio.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {MODULES.map(mod => (
              <div key={mod.id} className="card" onClick={onRegister} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 16, color: mod.color }}>{mod.icon}</div>
                <h3 style={{ fontSize: 20, fontFamily: "Cormorant Garamond, serif", fontWeight: 400, marginBottom: 8 }}>{mod.label}</h3>
                <div style={{ width: 32, height: 1, background: mod.color, marginBottom: 16 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mod.tools.map(t => (
                    <div key={t.id} style={{ color: COLORS.gray, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: mod.color, fontSize: 10 }}>▸</span>
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag">Depoimentos</div>
          <h2 className="section-title">O que nossos clientes<br /><em className="gold">estão dizendo</em></h2>
          <div className="gold-line" style={{ marginBottom: 60 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: 40, color: COLORS.gold, fontFamily: "serif", lineHeight: 1, marginBottom: 16 }}>"</div>
                <p style={{ color: COLORS.grayLight, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: COLORS.navy, fontWeight: 700, fontSize: 16,
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
      <section style={{ padding: "100px 40px", background: COLORS.navyLight }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="tag">Comparativo</div>
          <h2 className="section-title">Por que escolher<br /><em className="gold">o Arcane?</em></h2>
          <div className="gold-line" style={{ marginBottom: 48 }} />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: COLORS.gray, fontSize: 13, fontWeight: 400, letterSpacing: 1, borderBottom: `1px solid rgba(201,168,76,0.15)` }}>RECURSO</th>
                  {["Arcane", "ChatGPT", "Concorrentes"].map(h => (
                    <th key={h} style={{
                      padding: "16px 20px", textAlign: "center",
                      color: h === "Arcane" ? COLORS.gold : COLORS.gray,
                      fontSize: 13, fontWeight: h === "Arcane" ? 600 : 400,
                      letterSpacing: 1,
                      borderBottom: `1px solid rgba(201,168,76,0.15)`,
                      background: h === "Arcane" ? "rgba(201,168,76,0.05)" : "transparent",
                    }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: "14px 20px", color: COLORS.grayLight, fontSize: 14 }}>{row.feature}</td>
                    {[row.arcane, row.chatgpt, row.concorrente].map((val, j) => (
                      <td key={j} style={{
                        padding: "14px 20px", textAlign: "center",
                        color: j === 0 ? COLORS.gold : val === "✗" ? "#ff6b6b" : COLORS.gray,
                        fontSize: 14, fontWeight: j === 0 ? 500 : 400,
                        background: j === 0 ? "rgba(201,168,76,0.03)" : "transparent",
                      }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="tag">Planos</div>
          <h2 className="section-title">Escolha o plano<br /><em className="gold">ideal para você</em></h2>
          <div className="gold-line" style={{ marginBottom: 60 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan.highlight ? COLORS.gold : "rgba(201,168,76,0.15)"}`,
                borderRadius: 8, padding: 32,
                position: "relative",
                transform: plan.highlight ? "scale(1.02)" : "scale(1)",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.navy, fontSize: 11, fontWeight: 700,
                    padding: "4px 16px", borderRadius: 20, letterSpacing: 1,
                    whiteSpace: "nowrap",
                  }}>RECOMENDADO</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 44, fontWeight: 300, color: plan.highlight ? COLORS.gold : COLORS.white }}>{plan.price}</span>
                  <span style={{ color: COLORS.gray, fontSize: 14 }}>{plan.period}</span>
                </div>
                <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 24 }}>{plan.gens} · {plan.users}</div>
                <div style={{ height: 1, background: "rgba(201,168,76,0.15)", marginBottom: 24 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: COLORS.grayLight }}>
                      <span style={{ color: COLORS.gold, fontSize: 10 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={plan.id === "free" ? onRegister : onRegister}
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
                  {plan.id === "free" ? "Começar Grátis" : "Escolher Plano"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 40px", background: COLORS.navyLight }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="tag">FAQ</div>
          <h2 className="section-title">Perguntas<br /><em className="gold">frequentes</em></h2>
          <div className="gold-line" style={{ marginBottom: 48 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                border: `1px solid rgba(201,168,76,${openFaq === i ? "0.3" : "0.12"})`,
                borderRadius: 6, overflow: "hidden",
                background: openFaq === i ? "rgba(201,168,76,0.05)" : "transparent",
                transition: "all 0.3s",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: "100%", padding: "20px 24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "transparent", color: COLORS.white,
                  fontSize: 15, textAlign: "left", fontWeight: 400,
                }}>
                  {faq.q}
                  <span style={{ color: COLORS.gold, fontSize: 20, lineHeight: 1, flexShrink: 0, marginLeft: 16 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", color: COLORS.gray, fontSize: 14, lineHeight: 1.8 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Pronto para transformar<br />sua <em style={{ color: COLORS.gold }}>produtividade?</em>
          </div>
          <p style={{ color: COLORS.gray, fontSize: 16, marginBottom: 40 }}>
            Junte-se a centenas de empresas que já usam o Arcane para trabalhar de forma mais inteligente.
          </p>
          <button className="btn-gold" onClick={onRegister} style={{ fontSize: 16, padding: "18px 48px" }}>
            Criar Conta Grátis Agora
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid rgba(201,168,76,0.15)`,
        padding: "40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20,
      }}>
        <Logo size={18} />
        <div style={{ color: COLORS.gray, fontSize: 13 }}>
          © 2026 Arcane. Todos os direitos reservados.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacidade", "Termos", "Contato"].map(item => (
            <span key={item} style={{ color: COLORS.gray, fontSize: 13, cursor: "pointer" }}
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

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════

function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setLoading(true); setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email: form.email, password: form.password } : form;
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Erro");
      localStorage.setItem("arcane_token", data.access_token);
      localStorage.setItem("arcane_user", JSON.stringify(data.user));
      onSuccess(data.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.navy,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${COLORS.gold} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gold} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        background: COLORS.navyLight, border: `1px solid rgba(201,168,76,0.2)`,
        borderRadius: 12, padding: "48px 40px", width: "100%", maxWidth: 440,
        position: "relative", animation: "fadeUp 0.5s ease",
      }}>
        <div style={{ marginBottom: 32 }}>
          <Logo size={20} />
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
          {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
        </h2>
        <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 32 }}>
          {mode === "login" ? "Entre para continuar no Arcane" : "Comece grátis, sem cartão de crédito"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <>
              <input placeholder="Seu nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Nome da empresa" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </>
          )}
          <input placeholder="E-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Senha" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handle()} />
        </div>

        {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12, padding: "10px 14px", background: "rgba(255,107,107,0.1)", borderRadius: 6 }}>{error}</div>}

        <button className="btn-gold" onClick={handle} disabled={loading}
          style={{ width: "100%", marginTop: 24, padding: 16, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar Conta Grátis"}
        </button>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: COLORS.gray }}>
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <span style={{ color: COLORS.gold, cursor: "pointer" }} onClick={onSwitch}>
            {mode === "login" ? "Criar agora" : "Entrar"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// DASHBOARD APP
// ═══════════════════════════════════════════════

async function callAI(toolId, userInput) {
  const token = localStorage.getItem("arcane_token");
  const res = await fetch(`${BACKEND_URL}/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tool: toolId, input: userInput }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na geração");
  return data.output;
}

function AppDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [view, setView] = useState("dashboard");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [usage, setUsage] = useState({ current: 0, limit: 500 });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => { setToast(msg); }, []);

  useEffect(() => {
    const token = localStorage.getItem("arcane_token");
    if (!token) return;
    fetch(`${BACKEND_URL}/billing/usage`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.current !== undefined) setUsage(d); }).catch(() => {});
    fetch(`${BACKEND_URL}/ai/history?per_page=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.history) setHistory(d.history); }).catch(() => {});
  }, []);

  const generate = async () => {
    if (!input.trim() || !activeTool) return;
    setLoading(true); setResult("");
    try {
      const text = await callAI(activeTool.id, input);
      setResult(text);
      setUsage(u => ({ ...u, current: u.current + 1 }));
      setHistory(h => [{ tool_name: activeTool.name, input: input.slice(0, 60), output: text, created_at: new Date().toISOString() }, ...h]);
      showToast("Conteúdo gerado com sucesso!");
    } catch (e) { setResult(`Erro: ${e.message}`); }
    setLoading(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    ...MODULES.map(m => ({ id: m.id, label: m.label, icon: m.icon, module: m })),
    { id: "historico", label: "Histórico", icon: "◷" },
    { id: "planos", label: "Planos", icon: "◈" },
  ];

  const usagePct = Math.min((usage.current / (usage.limit || 1)) * 100, 100);
  const planLabel = user?.plan?.toUpperCase() || "FREE";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <Logo size={18} />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "0 20px 8px", fontSize: 10, letterSpacing: 2, color: COLORS.gray, textTransform: "uppercase" }}>Módulos</div>
          {navItems.filter(n => n.module).map(item => (
            <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => { setView(item.id); setActiveModule(item.module); setActiveTool(null); setResult(""); }}>
              <span style={{ color: item.module.color }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ height: 1, background: "rgba(201,168,76,0.1)", margin: "16px 20px" }} />
          <div style={{ padding: "0 20px 8px", fontSize: 10, letterSpacing: 2, color: COLORS.gray, textTransform: "uppercase" }}>Geral</div>
          {[{ id: "dashboard", label: "Dashboard", icon: "⊞" }, { id: "historico", label: "Histórico", icon: "◷" }, { id: "planos", label: "Planos", icon: "◈" }].map(item => (
            <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => { setView(item.id); setActiveModule(null); setActiveTool(null); }}>
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Usage */}
        <div style={{ padding: "20px 24px", borderTop: `1px solid rgba(201,168,76,0.15)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.gray, marginBottom: 6 }}>
            <span>Uso este mês</span>
            <span style={{ color: COLORS.gold }}>{usage.current}/{usage.limit}</span>
          </div>
          <div className="usage-bar">
            <div className="usage-fill" style={{ width: `${usagePct}%` }} />
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name || "Usuário"}</div>
              <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 1 }}>{planLabel}</div>
            </div>
            <button onClick={onLogout} style={{ background: "none", color: COLORS.gray, fontSize: 18, padding: 4 }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = COLORS.gray}>↗</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 300 }}>
            {view === "dashboard" ? "Dashboard" : view === "historico" ? "Histórico" : view === "planos" ? "Planos" : activeModule?.label}
            {activeTool && <span style={{ color: COLORS.gold }}> / {activeTool.name}</span>}
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
            color: COLORS.navy, fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: 20, letterSpacing: 1,
          }}>{planLabel}</div>
        </div>

        <div style={{ padding: 32 }}>
          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
                  Olá, <span style={{ color: COLORS.gold }}>{user?.name?.split(" ")[0]}</span>
                </h2>
                <p style={{ color: COLORS.gray }}>O que vamos criar hoje?</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                {MODULES.map(mod => (
                  <div key={mod.id} className="tool-card"
                    onClick={() => { setView(mod.id); setActiveModule(mod); }}>
                    <div style={{ fontSize: 36, marginBottom: 16, color: mod.color }}>{mod.icon}</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, marginBottom: 8 }}>{mod.label}</div>
                    <div style={{ width: 28, height: 1, background: mod.color, marginBottom: 12 }} />
                    <div style={{ color: COLORS.gray, fontSize: 13 }}>{mod.tools.length} ferramentas disponíveis</div>
                  </div>
                ))}
              </div>

              {history.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 300, marginBottom: 20 }}>Gerações recentes</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {history.slice(0, 4).map((h, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.02)", border: `1px solid rgba(201,168,76,0.1)`,
                        borderRadius: 6, padding: "14px 20px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <div>
                          <span style={{ color: COLORS.gold, fontSize: 13, fontWeight: 500 }}>{h.tool_name}</span>
                          <span style={{ color: COLORS.gray, fontSize: 13, marginLeft: 12 }}>{h.input}</span>
                        </div>
                        <span style={{ color: COLORS.gray, fontSize: 12 }}>{new Date(h.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE VIEW */}
          {activeModule && view === activeModule.id && !activeTool && (
            <div>
              <p style={{ color: COLORS.gray, marginBottom: 32 }}>Selecione uma ferramenta para começar</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {activeModule.tools.map(tool => (
                  <div key={tool.id} className="tool-card"
                    onClick={() => { setActiveTool(tool); setResult(""); setInput(""); }}>
                    <div style={{ color: activeModule.color, fontSize: 24, marginBottom: 12 }}>◈</div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{tool.name}</div>
                    <div style={{ color: COLORS.gray, fontSize: 13 }}>{tool.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOOL VIEW */}
          {activeTool && (
            <div style={{ maxWidth: 800 }}>
              <button onClick={() => { setActiveTool(null); setResult(""); }}
                style={{ background: "none", color: COLORS.gray, fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                ← Voltar
              </button>
              <p style={{ color: COLORS.gray, marginBottom: 20 }}>{activeTool.desc}</p>
              <textarea
                placeholder={`Descreva o que você precisa para ${activeTool.name.toLowerCase()}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={5}
                style={{ resize: "vertical", marginBottom: 16 }}
              />
              <button className="btn-gold" onClick={generate} disabled={loading || !input.trim()}
                style={{ opacity: loading || !input.trim() ? 0.6 : 1 }}>
                {loading ? "Gerando..." : "Gerar com IA"}
              </button>

              {(result || loading) && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ color: COLORS.gold, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? COLORS.gold : "#4caf50", display: "inline-block", animation: loading ? "pulse 1s infinite" : "none" }} />
                      {loading ? "Gerando..." : "Resultado"}
                    </span>
                    {result && !loading && (
                      <button className="btn-outline" onClick={() => { navigator.clipboard.writeText(result); showToast("Copiado!"); }}
                        style={{ padding: "6px 16px", fontSize: 12 }}>Copiar</button>
                    )}
                  </div>
                  <div className="result-box">{loading ? "Aguarde..." : result}</div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY */}
          {view === "historico" && (
            <div>
              <p style={{ color: COLORS.gray, marginBottom: 32 }}>Todas as suas gerações anteriores</p>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", color: COLORS.gray, padding: 60 }}>Nenhuma geração ainda</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {history.map((h, i) => (
                    <div key={i} className="card">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ color: COLORS.gold, fontSize: 13 }}>{h.tool_name}</span>
                        <span style={{ color: COLORS.gray, fontSize: 12 }}>{new Date(h.created_at).toLocaleString("pt-BR")}</span>
                      </div>
                      <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 12 }}>{h.input}</div>
                      <div style={{ color: COLORS.grayLight, fontSize: 13, lineHeight: 1.7 }}>{h.output?.slice(0, 200)}...</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PLANS */}
          {view === "planos" && (
            <div>
              <p style={{ color: COLORS.gray, marginBottom: 40 }}>Escolha o plano ideal para o seu negócio</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                {PLANS.map(plan => (
                  <div key={plan.id} style={{
                    background: plan.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${plan.highlight ? COLORS.gold : "rgba(201,168,76,0.15)"}`,
                    borderRadius: 8, padding: 28, position: "relative",
                  }}>
                    {plan.highlight && (
                      <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: COLORS.gold, color: COLORS.navy, fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>RECOMENDADO</div>
                    )}
                    {user?.plan === plan.id && (
                      <div style={{ position: "absolute", top: -10, right: 16, background: "#4caf50", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>ATUAL</div>
                    )}
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 300, color: plan.highlight ? COLORS.gold : COLORS.white }}>{plan.price}<span style={{ fontSize: 14, color: COLORS.gray }}>{plan.period}</span></div>
                    <div style={{ fontSize: 16, fontWeight: 500, margin: "8px 0 16px" }}>{plan.name}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, color: COLORS.gray, display: "flex", gap: 8 }}>
                          <span style={{ color: COLORS.gold }}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => showToast("Em breve: integração com Stripe!")}
                      style={{ width: "100%", padding: 12, background: plan.highlight ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})` : "transparent", color: plan.highlight ? COLORS.navy : COLORS.gold, border: plan.highlight ? "none" : `1px solid ${COLORS.gold}`, borderRadius: 4, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>
                      {user?.plan === plan.id ? "Plano Atual" : "Escolher"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("arcane_token");
    const savedUser = localStorage.getItem("arcane_user");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); setScreen("app"); } catch (e) {}
    }
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleAuthSuccess = (u) => { setUser(u); setScreen("app"); };
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
