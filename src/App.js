import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════
const MODE = "prod";
const BACKEND_URL = "https://arcane-backend-production-d37b.up.railway.app/api";

// ═══════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════
async function callAI(toolId, userInput) {
  if (MODE === "prod") {
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

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: toolId,
      messages: [{ role: "user", content: userInput }],
    }),
  });
  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("\n") || "Erro ao processar.";
}

async function apiCall(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BACKEND_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// ═══════════════════════════════════════════════
// DADOS DOS MÓDULOS
// ═══════════════════════════════════════════════
const MODULES = [
  {
    id: "docs", icon: "◆", label: "Documentos", title: "Automação de Documentos",
    desc: "Contratos, propostas, relatórios e e-mails corporativos", accent: "#2563EB",
    tools: [
      { id: "contrato", name: "Gerar Contrato", icon: "📜", ph: "Descreva o tipo de contrato, partes envolvidas e cláusulas principais...", prompt: "Você é um assistente jurídico empresarial. Gere um modelo de contrato profissional baseado na descrição. Inclua cláusulas padrão, obrigações das partes e condições gerais. Responda em português do Brasil." },
      { id: "proposta", name: "Proposta Comercial", icon: "💼", ph: "Descreva o serviço/produto, cliente-alvo e condições...", prompt: "Você é um consultor comercial. Crie uma proposta comercial profissional e persuasiva. Inclua escopo, benefícios, investimento e próximos passos. Responda em português do Brasil." },
      { id: "relatorio", name: "Relatório Executivo", icon: "📊", ph: "Descreva os dados ou o tema do relatório...", prompt: "Você é um analista de negócios. Gere um relatório executivo profissional com introdução, análise, conclusões e recomendações. Responda em português do Brasil." },
      { id: "email_corp", name: "E-mail Corporativo", icon: "✉️", ph: "Descreva o contexto, destinatário e objetivo do e-mail...", prompt: "Você é um comunicador corporativo. Escreva um e-mail profissional, claro e objetivo. Adapte o tom ao contexto. Responda em português do Brasil." },
    ],
  },
  {
    id: "data", icon: "◈", label: "Dados", title: "Análise de Dados",
    desc: "Converse com seus dados em linguagem natural", accent: "#059669",
    tools: [
      { id: "analise", name: "Analisar Dados", icon: "📈", ph: "Cole dados ou descreva a planilha...", prompt: "Você é um analista de dados sênior. Analise os dados fornecidos, identifique tendências, outliers e insights acionáveis. Responda em português do Brasil." },
      { id: "dashboard_text", name: "Gerar Insights", icon: "🔍", ph: "Descreva seus KPIs ou cole métricas...", prompt: "Você é um consultor de BI. Gere insights estratégicos a partir dos KPIs fornecidos. Responda em português do Brasil." },
      { id: "sql", name: "Gerar Query SQL", icon: "🗄️", ph: "Descreva as tabelas e o que quer consultar...", prompt: "Você é um DBA experiente. Gere queries SQL otimizadas. Explique a lógica. Responda em português do Brasil." },
      { id: "previsao", name: "Previsão e Tendência", icon: "🔮", ph: "Forneça dados históricos e o que deseja prever...", prompt: "Você é um estatístico. Analise os dados e forneça previsão com cenários otimista, realista e pessimista. Responda em português do Brasil." },
    ],
  },
  {
    id: "produtividade", icon: "◇", label: "Produtividade", title: "Hub de Produtividade",
    desc: "Reuniões, atas, onboarding e base de conhecimento", accent: "#D97706",
    tools: [
      { id: "ata", name: "Ata de Reunião", icon: "📝", ph: "Cole as anotações ou transcrição da reunião...", prompt: "Você é um assistente executivo. Transforme as anotações em ata profissional com participantes, pauta, decisões e ações pendentes. Responda em português do Brasil." },
      { id: "resumo_reuniao", name: "Resumir Reunião", icon: "⚡", ph: "Cole a transcrição ou pontos discutidos...", prompt: "Você é um assistente executivo. Resuma a reunião de forma objetiva: decisões, próximos passos e responsáveis. Responda em português do Brasil." },
      { id: "onboarding", name: "Guia de Onboarding", icon: "🚀", ph: "Descreva o cargo e processos da empresa...", prompt: "Você é especialista em RH. Crie um guia de onboarding completo para novo colaborador. Responda em português do Brasil." },
      { id: "knowledge", name: "Base de Conhecimento", icon: "📚", ph: "Descreva o processo ou política a documentar...", prompt: "Você é um technical writer. Crie documentação clara e estruturada do processo descrito. Responda em português do Brasil." },
    ],
  },
  {
    id: "conteudo", icon: "◉", label: "Conteúdo", title: "Geração de Conteúdo",
    desc: "Marketing, redes sociais, SEO e copywriting", accent: "#DB2777",
    tools: [
      { id: "post_social", name: "Post Redes Sociais", icon: "📱", ph: "Descreva o produto/serviço e rede social...", prompt: "Você é um social media manager. Crie posts engajantes com texto, hashtags e CTA. Responda em português do Brasil." },
      { id: "blog", name: "Artigo para Blog", icon: "✍️", ph: "Tema, público-alvo e palavras-chave...", prompt: "Você é redator SEO. Escreva artigo otimizado com título atrativo, subtítulos estratégicos e CTA. Responda em português do Brasil." },
      { id: "email_mkt", name: "E-mail Marketing", icon: "📧", ph: "Descreva a campanha e público-alvo...", prompt: "Você é copywriter de e-mail marketing. Crie e-mail com assunto irresistível, corpo persuasivo e CTA claro. Responda em português do Brasil." },
      { id: "descricao", name: "Descrição de Produto", icon: "🏷️", ph: "Descreva o produto e público-alvo...", prompt: "Você é copywriter de e-commerce. Crie descrição persuasiva e otimizada para SEO. Responda em português do Brasil." },
    ],
  },
];

const PLANS = [
  { id: "free", name: "Free", price: "R$ 0", sub: "", users: "1 user", gens: "5 generations/month", features: ["4 modules", "Basic access"], hl: false },
  { id: "starter", name: "Starter", price: "R$ 97", sub: "/mo", users: "3 users", gens: "150 generations/month", features: ["Everything in Free", "3 users", "Email support", "30-day history"], hl: false },
  { id: "business", name: "Business", price: "R$ 297", sub: "/mo", users: "15 users", gens: "500 generations/month", features: ["Everything in Starter", "15 users", "API access", "Priority support", "Full history"], hl: true },
  { id: "unlimited", name: "Unlimited", price: "R$ 897", sub: "/mo", users: "Unlimited", gens: "Unlimited", features: ["Everything in Business", "Unlimited users", "Unlimited generations", "Custom AI", "Dedicated SLA", "Custom integration"], hl: false },
];

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════
function StreamText({ text }) {
  const [s, setS] = useState("");
  const i = useRef(0);
  useEffect(() => {
    setS(""); i.current = 0;
    const t = setInterval(() => { if (i.current < text.length) setS(text.slice(0, ++i.current)); else clearInterval(t); }, 6);
    return () => clearInterval(t);
  }, [text]);
  return <span>{s}{i.current < text.length && <span style={{ animation: "blink .6s infinite" }}>▎</span>}</span>;
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [authPage, setAuthPage] = useState("login");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ current: 0, limit: 500, remaining: 500 });
  const [history, setHistory] = useState([]);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", team_name: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const resRef = useRef(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // Auth
  const handleLogin = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const d = await apiCall("/auth/login", { method: "POST", body: { email: authForm.email, password: authForm.password } });
      setToken(d.access_token); setUser(d.user); setPage("dashboard");
      localStorage.setItem("arcane_token", d.access_token);
      showToast(`Bem-vindo, ${d.user.name}!`);
    } catch (e) { setAuthError(e.error || "Erro ao fazer login"); }
    setAuthLoading(false);
  };

  const handleRegister = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const d = await apiCall("/auth/register", { method: "POST", body: authForm });
      setToken(d.access_token); setUser(d.user); setPage("dashboard");
      localStorage.setItem("arcane_token", d.access_token);
      showToast("Conta criada!");
    } catch (e) { setAuthError(e.error || "Erro ao criar conta"); }
    setAuthLoading(false);
  };

  const logout = () => { setUser(null); setToken(null); setPage("landing"); setActiveModule(null); setActiveTool(null); setOutput(""); setInput(""); localStorage.removeItem("arcane_token"); };

  // Navigation
  const goModule = (m) => { setActiveModule(m); setActiveTool(null); setOutput(""); setInput(""); setPage("module"); };
  const goTool = (t) => { setActiveTool(t); setOutput(""); setInput(""); setPage("tool"); };
  const goBack = () => { if (page === "tool") { setActiveTool(null); setPage("module"); } else { setActiveModule(null); setPage("dashboard"); } setOutput(""); setInput(""); };

  // Generate
  const generate = async () => {
    if (!input.trim() || loading || !activeTool) return;
    setLoading(true); setOutput("");
    try {
      const text = await callAI(activeTool.id, input);
      setOutput(text);
      setUsage(u => ({ ...u, current: u.current + 1, remaining: Math.max(0, u.remaining - 1) }));
      setHistory(h => [{ tool: activeTool.name, module: activeModule.label, date: new Date().toLocaleString("pt-BR"), preview: text.slice(0, 80) + "..." }, ...h].slice(0, 30));
      showToast("Gerado com sucesso!");
    } catch (e) { setOutput("Erro: " + (e.message || "Falha na geração")); }
    setLoading(false);
  };

  useEffect(() => { if (output && resRef.current) resRef.current.scrollIntoView({ behavior: "smooth" }); }, [output]);

  const breadcrumb = () => {
    if (page === "dashboard") return "Dashboard";
    if (page === "module") return activeModule?.label;
    if (page === "tool") return `${activeModule?.label} / ${activeTool?.name}`;
    if (page === "history") return "Histórico";
    if (page === "plans") return "Planos";
    return "";
  };

  // ═══════════════════════════════════════════
  // LANDING PAGE
  // ═══════════════════════════════════════════
  if (page === "landing") {
    return (
      <div>
        <style>{CSS}</style>
        <nav className="landing-nav">
          <div className="landing-nav-inner">
            <div className="nav-logo"><div className="nav-logo-mark">A</div><span className="nav-logo-text">Arcane</span></div>
            <div className="nav-links">
              <span className="nav-link" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Módulos</span>
              <span className="nav-link" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>Planos</span>
              <button className="nav-cta" onClick={() => { setPage("auth"); setAuthPage("login"); }}>Entrar</button>
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-inner">
            <p className="hero-tag">WORKSPACE INTELIGENTE PARA EMPRESAS</p>
            <h1 className="hero-title">Automatize o trabalho<br />que consome <em>horas</em></h1>
            <p className="hero-sub">Documentos, dados, produtividade e conteúdo — tudo com inteligência artificial de última geração, numa única plataforma.</p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => { setPage("auth"); setAuthPage("register"); }}>Começar grátis</button>
              <button className="hero-btn-secondary" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Ver módulos</button>
            </div>
            <p className="hero-note">Sem cartão de crédito · Setup em 2 minutos · 500 gerações grátis</p>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="features-inner">
            <p className="section-tag">MÓDULOS</p>
            <h2 className="section-headline">16 ferramentas de IA.<br /><em>4 módulos poderosos.</em></h2>
            <div className="features-grid">
              {MODULES.map((m, i) => (
                <div key={m.id} className="feature-card" style={{ borderTopColor: m.accent, animationDelay: `${i * 100}ms` }}>
                  <div className="feature-icon" style={{ color: m.accent }}>{m.icon}</div>
                  <h3 className="feature-title">{m.title}</h3>
                  <p className="feature-desc">{m.desc}</p>
                  <div className="feature-tools">
                    {m.tools.map(t => <span key={t.id} className="feature-tool-tag">{t.icon} {t.name}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="pricing-inner">
            <p className="section-tag">PLANOS</p>
            <h2 className="section-headline">Simples, transparente.<br /><em>Escale quando precisar.</em></h2>
            <div className="pricing-grid">
              {PLANS.map((p, i) => (
                <div key={p.id} className={`price-card ${p.hl ? "price-hl" : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
                  {p.hl && <div className="price-badge">MAIS POPULAR</div>}
                  <h3 className="price-name">{p.name}</h3>
                  <div className="price-amount">{p.price}<span className="price-period">{p.sub}</span></div>
                  <div className="price-meta">{p.users} · {p.gens}</div>
                  <div className="price-features">{p.features.map(f => <div key={f} className="price-feature">✓ {f}</div>)}</div>
                  <button className={`price-cta ${p.hl ? "price-cta-primary" : ""}`} onClick={() => { setPage("auth"); setAuthPage("register"); }}>
                    {p.id === "enterprise" ? "Falar com Vendas" : "Começar agora"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="footer-inner">
            <div className="footer-logo"><div className="nav-logo-mark">A</div><span className="nav-logo-text">Arcane</span></div>
            <p className="footer-text">© 2026 Arcane · Workspace inteligente com IA para empresas</p>
          </div>
        </footer>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // AUTH SCREEN
  // ═══════════════════════════════════════════
  if (page === "auth") {
    const isLogin = authPage === "login";
    return (
      <div className="auth-wrap">
        <style>{CSS}</style>
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo" onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
              <div className="nav-logo-mark">A</div><span style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 500, color: "#F7F6F3" }}>Arcane</span>
            </div>
            <h1 className="auth-headline">O workspace inteligente<br /><em>que sua empresa precisa</em></h1>
            <p className="auth-sub">16 ferramentas de IA organizadas em 4 módulos — documentos, dados, produtividade e conteúdo.</p>
            <div className="auth-features">{MODULES.map(m => (
              <div key={m.id} className="auth-feat"><span style={{ color: m.accent, fontWeight: 700, fontSize: 16 }}>{m.icon}</span><div><strong>{m.label}</strong><span className="auth-feat-sub">{m.tools.length} ferramentas</span></div></div>
            ))}</div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-box">
            <h2 className="auth-form-title">{isLogin ? "Entrar" : "Criar conta"}</h2>
            <p className="auth-form-sub">{isLogin ? "Acesse sua conta para continuar" : "Comece gratuitamente"}</p>
            {authError && <div className="auth-error">{authError}</div>}
            <div className="auth-fields">
              {!isLogin && (<><label className="fl">Seu nome</label><input className="fi" placeholder="João Silva" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} /></>)}
              {!isLogin && (<><label className="fl">Nome da empresa</label><input className="fi" placeholder="Minha Empresa" value={authForm.team_name} onChange={e => setAuthForm({ ...authForm, team_name: e.target.value })} /></>)}
              <label className="fl">E-mail</label><input className="fi" type="email" placeholder="voce@empresa.com" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} onKeyDown={e => e.key === "Enter" && (isLogin ? handleLogin() : handleRegister())} />
              <label className="fl">Senha</label><input className="fi" type="password" placeholder="Mínimo 6 caracteres" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} onKeyDown={e => e.key === "Enter" && (isLogin ? handleLogin() : handleRegister())} />
            </div>
            <button className="auth-btn" onClick={isLogin ? handleLogin : handleRegister} disabled={authLoading}>
              {authLoading ? <span className="dots"><span /><span /><span /></span> : isLogin ? "Entrar" : "Criar conta grátis"}
            </button>
            <p className="auth-switch">{isLogin ? "Não tem conta? " : "Já tem conta? "}<span className="auth-switch-link" onClick={() => { setAuthPage(isLogin ? "register" : "login"); setAuthError(""); }}>{isLogin ? "Criar agora" : "Fazer login"}</span></p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // DASHBOARD (logged in)
  // ═══════════════════════════════════════════
  return (
    <div className="app-wrap">
      <style>{CSS}</style>
      {toast && <div className={`toast ${toast.type === "error" ? "toast-err" : ""}`}>{toast.type === "success" ? "✓" : "!"} {toast.msg}</div>}

      <aside className={`sb ${sideOpen ? "sb-open" : "sb-closed"}`}>
        <div className="sb-head"><div className="sb-logo">A</div>{sideOpen && <span className="sb-logo-text">Arcane</span>}</div>
        {sideOpen && <>
          <div className="sb-label">Módulos</div>
          {MODULES.map(m => (
            <div key={m.id} className={`sb-item ${activeModule?.id === m.id ? "sb-active" : ""}`} onClick={() => goModule(m)}>
              <span className="sb-icon" style={{ color: m.accent }}>{m.icon}</span><span>{m.label}</span>
            </div>
          ))}
          <div className="sb-label" style={{ marginTop: 20 }}>Geral</div>
          <div className={`sb-item ${page === "dashboard" && !activeModule ? "sb-active" : ""}`} onClick={() => { setActiveModule(null); setActiveTool(null); setPage("dashboard"); }}><span className="sb-icon">⊞</span><span>Dashboard</span></div>
          <div className={`sb-item ${page === "history" ? "sb-active" : ""}`} onClick={() => { setActiveModule(null); setPage("history"); }}><span className="sb-icon">◔</span><span>Histórico</span></div>
          <div className={`sb-item ${page === "plans" ? "sb-active" : ""}`} onClick={() => { setActiveModule(null); setPage("plans"); }}><span className="sb-icon">◈</span><span>Planos</span></div>

          <div className="sb-usage">
            <div className="sb-usage-lbl">Uso este mês</div>
            <div className="sb-usage-num">{usage.current}<span className="sb-usage-max"> / {usage.limit >= 999999 ? "∞" : usage.limit}</span></div>
            <div className="sb-bar"><div className="sb-fill" style={{ width: `${Math.min((usage.current / usage.limit) * 100, 100)}%` }} /></div>
          </div>

          <div className="sb-user">
            <div className="sb-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div className="sb-user-info"><div className="sb-user-name">{user?.name}</div><div className="sb-user-plan">{(user?.plan || "starter").toUpperCase()}</div></div>
            <button className="sb-logout" onClick={logout}>↗</button>
          </div>
        </>}
      </aside>

      <main className="mn">
        <div className="topbar">
          <button className="tb-toggle" onClick={() => setSideOpen(!sideOpen)}>{sideOpen ? "◂" : "▸"}</button>
          <span className="tb-bc">{breadcrumb()}</span>
          <span className="tb-badge">{(user?.plan || "STARTER").toUpperCase()}</span>
        </div>
        <div className="mn-content">

          {page === "dashboard" && (
            <div className="fade-in">
              <h1 className="dash-title">Olá, {user?.name?.split(" ")[0]}. <em>O que vamos criar?</em></h1>
              <p className="dash-sub">Escolha um módulo para começar</p>
              <div className="m-grid">
                {MODULES.map((m, i) => (
                  <div key={m.id} className="m-card" style={{ borderTopColor: m.accent, animationDelay: `${i * 60}ms` }} onClick={() => goModule(m)}>
                    <div className="m-card-icon" style={{ color: m.accent }}>{m.icon}</div>
                    <h3 className="m-card-title">{m.title}</h3>
                    <p className="m-card-desc">{m.desc}</p>
                    <div className="m-card-foot" style={{ color: m.accent }}>{m.tools.length} ferramentas →</div>
                  </div>
                ))}
              </div>
              <div className="stats-row">
                {[{ n: usage.current, l: "Gerações" }, { n: usage.remaining >= 999999 ? "∞" : usage.remaining, l: "Restantes" }, { n: "16", l: "Ferramentas" }, { n: history.length, l: "No histórico" }].map((s, i) => (
                  <div key={i} className="stat-box"><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>
                ))}
              </div>
              {history.length > 0 && <div style={{ marginTop: 32 }}>
                <h3 className="sec-title">Atividade recente</h3>
                {history.slice(0, 5).map((h, i) => <div key={i} className="h-row"><span className="h-date">{h.date}</span><span className="h-badge">{h.module}</span><span className="h-tool">{h.tool}</span><span className="h-prev">{h.preview}</span></div>)}
              </div>}
            </div>
          )}

          {page === "module" && activeModule && (
            <div className="fade-in">
              <button className="back" onClick={goBack}>← Voltar</button>
              <div className="mod-head"><span className="mod-icon" style={{ color: activeModule.accent }}>{activeModule.icon}</span><div><h2 className="mod-title">{activeModule.title}</h2><p className="mod-desc">{activeModule.desc}</p></div></div>
              <div className="t-grid">{activeModule.tools.map((t, i) => (
                <div key={t.id} className="t-card" style={{ animationDelay: `${i * 50}ms` }} onClick={() => goTool(t)}>
                  <div className="t-card-icon">{t.icon}</div><div className="t-card-name">{t.name}</div>
                </div>
              ))}</div>
            </div>
          )}

          {page === "tool" && activeTool && activeModule && (
            <div className="fade-in">
              <button className="back" onClick={goBack}>← {activeModule.label}</button>
              <div className="tool-head"><span style={{ fontSize: 32 }}>{activeTool.icon}</span><h2 className="tool-title">{activeTool.name}</h2></div>
              <div className="tool-box">
                <textarea className="tool-ta" value={input} onChange={e => setInput(e.target.value)} placeholder={activeTool.ph} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }} />
                <div className="tool-footer">
                  <span className="tool-chars">{input.length} caracteres</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="tool-shortcut">Ctrl+Enter</span>
                    <button className="tool-btn" onClick={generate} disabled={loading || !input.trim()} style={{ background: loading || !input.trim() ? undefined : activeModule.accent }}>
                      {loading ? <span className="dots"><span /><span /><span /></span> : "Gerar com IA"}
                    </button>
                  </div>
                </div>
              </div>
              {output && (
                <div ref={resRef} className="tool-out fade-in">
                  <div className="tool-out-head"><div className="tool-dot" /><span className="tool-out-lbl">Resultado</span></div>
                  <div className="tool-out-text"><StreamText text={output} /></div>
                  <div className="tool-out-actions">
                    <button className="tool-act" onClick={() => { navigator.clipboard?.writeText(output); showToast("Copiado!"); }}>📋 Copiar</button>
                    <button className="tool-act" onClick={() => { setInput(""); setOutput(""); }}>🔄 Novo</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {page === "history" && (
            <div className="fade-in">
              <h2 className="pg-title">Histórico de Gerações</h2>
              {history.length === 0 ? <p className="empty">Nenhuma geração ainda.</p> : (
                <div className="h-table">{history.map((h, i) => <div key={i} className="h-row"><span className="h-date">{h.date}</span><span className="h-badge">{h.module}</span><span className="h-tool">{h.tool}</span><span className="h-prev">{h.preview}</span></div>)}</div>
              )}
            </div>
          )}

          {page === "plans" && (
            <div className="fade-in">
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 className="pg-title">Planos</h2>
                <p className="pg-sub">Escale conforme sua empresa cresce</p>
              </div>
              <div className="pl-grid">
                {PLANS.map((p, i) => (
                  <div key={p.id} className={`pl-card ${p.hl ? "pl-hl" : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
                    {p.hl && <div className="pl-badge">RECOMENDADO</div>}
                    <h3 className="pl-name">{p.name}</h3>
                    <div className="pl-price">{p.price}<span className="pl-period">{p.sub}</span></div>
                    <div className="pl-meta">{p.users} · {p.gens}</div>
                    <div className="pl-feats">{p.features.map(f => <div key={f} className="pl-feat">✓ {f}</div>)}</div>
                    <button className={`pl-cta ${p.hl ? "pl-cta-p" : ""}`}>{p.id === "enterprise" ? "Falar com Vendas" : user?.plan === p.id ? "Plano atual" : "Escolher"}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════
const CSS = `
:root{--bg:#F7F6F3;--sf:#FFF;--bd:#E5E2DC;--bl:#EDEAE5;--tx:#1B1B18;--ts:#65635D;--td:#9C9A94;--ac:#1B1B18;--as:#F2F0EC;--hv:#F9F8F5;--ok:#16A34A;--er:#DC2626;--f:'Libre Franklin',sans-serif;--fd:'Playfair Display',serif;--r:12px;--rs:8px;--sh:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--sl:0 4px 24px rgba(0,0,0,.06)}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--f);background:var(--bg);color:var(--tx)}
::selection{background:var(--ac);color:#fff}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}
textarea:focus,input:focus,button:focus{outline:none}
@keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes dotP{0%,80%,100%{opacity:.2}40%{opacity:1}}
@keyframes toastIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .45s ease both}
.dots{display:inline-flex;gap:4px;align-items:center}.dots span{width:5px;height:5px;border-radius:50%;background:currentColor;animation:dotP 1.2s infinite}.dots span:nth-child(2){animation-delay:.15s}.dots span:nth-child(3){animation-delay:.3s}
.toast{position:fixed;top:20px;right:20px;z-index:9999;padding:12px 20px;border-radius:var(--rs);font-size:13px;font-weight:500;animation:toastIn .3s ease;box-shadow:var(--sl);background:var(--ok);color:#fff}
.toast-err{background:var(--er)}
.landing-nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(247,246,243,.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--bl)}
.landing-nav-inner{max-width:1100px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;gap:10px}
.nav-logo-mark{width:34px;height:34px;border-radius:9px;background:var(--ac);color:#F7F6F3;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:600;font-size:16px}
.nav-logo-text{font-family:var(--fd);font-size:20px;font-weight:500}
.nav-links{display:flex;align-items:center;gap:24px}
.nav-link{font-size:14px;color:var(--ts);cursor:pointer;transition:color .2s}.nav-link:hover{color:var(--tx)}
.nav-cta{padding:8px 20px;border:1px solid var(--ac);border-radius:var(--rs);background:transparent;font-family:var(--f);font-size:13px;font-weight:500;cursor:pointer;color:var(--tx);transition:all .2s}
.nav-cta:hover{background:var(--ac);color:#fff}
.hero{padding:140px 32px 80px;text-align:center}
.hero-inner{max-width:680px;margin:0 auto}
.hero-tag{font-size:11px;font-weight:600;letter-spacing:.14em;color:var(--td);margin-bottom:20px}
.hero-title{font-family:var(--fd);font-size:clamp(36px,5.5vw,58px);line-height:1.1;font-weight:400;letter-spacing:-.03em;margin-bottom:22px}
.hero-title em{font-style:italic;color:var(--ts)}
.hero-sub{font-size:17px;color:var(--ts);line-height:1.65;margin-bottom:36px;font-weight:300}
.hero-actions{display:flex;gap:12px;justify-content:center;margin-bottom:20px}
.hero-btn-primary{padding:14px 32px;border:none;border-radius:var(--rs);background:var(--ac);color:#fff;font-family:var(--f);font-size:15px;font-weight:600;cursor:pointer;transition:opacity .2s}.hero-btn-primary:hover{opacity:.9}
.hero-btn-secondary{padding:14px 32px;border:1px solid var(--bd);border-radius:var(--rs);background:transparent;font-family:var(--f);font-size:15px;font-weight:500;cursor:pointer;color:var(--tx);transition:all .2s}.hero-btn-secondary:hover{border-color:var(--ac)}
.hero-note{font-size:12px;color:var(--td)}
.features-section{padding:80px 32px;background:var(--sf);border-top:1px solid var(--bl);border-bottom:1px solid var(--bl)}
.features-inner{max-width:1000px;margin:0 auto}
.section-tag{font-size:11px;font-weight:600;letter-spacing:.14em;color:var(--td);text-align:center;margin-bottom:12px}
.section-headline{font-family:var(--fd);font-size:32px;font-weight:400;text-align:center;margin-bottom:48px;letter-spacing:-.02em;line-height:1.2}
.section-headline em{font-style:italic;color:var(--ts)}
.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.feature-card{background:var(--bg);border:1px solid var(--bd);border-top:3px solid;border-radius:var(--r);padding:28px 24px;animation:fadeIn .5s ease both}
.feature-icon{font-size:22px;font-weight:700;margin-bottom:14px}
.feature-title{font-family:var(--fd);font-size:19px;font-weight:500;margin-bottom:6px}
.feature-desc{font-size:13px;color:var(--ts);line-height:1.5;margin-bottom:16px}
.feature-tools{display:flex;flex-wrap:wrap;gap:6px}
.feature-tool-tag{font-size:11px;background:var(--sf);border:1px solid var(--bl);padding:4px 10px;border-radius:5px;color:var(--ts)}
.pricing-section{padding:80px 32px}
.pricing-inner{max-width:800px;margin:0 auto}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.price-card{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:30px 24px;animation:fadeIn .4s ease both;position:relative}
.price-hl{border-color:var(--ac);box-shadow:var(--sl)}
.price-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--ac);color:#fff;font-size:10px;font-weight:600;padding:3px 12px;border-radius:0 0 6px 6px;letter-spacing:.06em}
.price-name{font-size:16px;font-weight:600;margin-bottom:4px}
.price-amount{font-family:var(--fd);font-size:34px;font-weight:500;margin-bottom:4px}
.price-period{font-size:14px;color:var(--td);font-weight:400;font-family:var(--f)}
.price-meta{font-size:12px;color:var(--ts);margin-bottom:22px}
.price-features{display:flex;flex-direction:column;gap:9px;margin-bottom:26px}
.price-feature{font-size:13px;color:var(--ts)}
.price-cta{width:100%;padding:11px;border:1px solid var(--bd);border-radius:var(--rs);background:transparent;font-family:var(--f);font-size:13px;font-weight:500;cursor:pointer;color:var(--tx);transition:all .2s}
.price-cta:hover{border-color:var(--ac)}.price-cta-primary{background:var(--ac);color:#fff;border:none}.price-cta-primary:hover{opacity:.9}
.landing-footer{padding:32px;border-top:1px solid var(--bl);text-align:center}
.footer-inner{max-width:1000px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.footer-text{font-size:12px;color:var(--td)}
.auth-wrap{display:flex;min-height:100vh}
.auth-left{flex:1;background:var(--ac);color:#F7F6F3;display:flex;align-items:center;justify-content:center;padding:48px;position:relative;overflow:hidden}
.auth-left::before{content:'';position:absolute;top:-30%;right:-20%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.03)}
.auth-left-content{position:relative;z-index:1;max-width:440px}
.auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:48px}
.auth-headline{font-family:var(--fd);font-size:36px;line-height:1.15;font-weight:400;margin-bottom:20px;letter-spacing:-.02em}
.auth-headline em{font-style:italic;opacity:.7}
.auth-sub{font-size:15px;line-height:1.6;opacity:.6;margin-bottom:40px;font-weight:300}
.auth-features{display:flex;flex-direction:column;gap:14px}
.auth-feat{display:flex;align-items:center;gap:12px;font-size:14px}.auth-feat strong{display:block}
.auth-feat-sub{font-size:12px;opacity:.5}
.auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:var(--bg)}
.auth-form-box{width:100%;max-width:380px}
.auth-form-title{font-family:var(--fd);font-size:28px;font-weight:500;margin-bottom:6px;letter-spacing:-.02em}
.auth-form-sub{font-size:14px;color:var(--ts);margin-bottom:28px}
.auth-error{background:#FEF2F2;border:1px solid #FECACA;color:var(--er);padding:10px 14px;border-radius:var(--rs);font-size:13px;margin-bottom:18px}
.auth-fields{display:flex;flex-direction:column;gap:6px;margin-bottom:24px}
.fl{font-size:12px;font-weight:500;color:var(--ts);margin-top:10px;margin-bottom:2px}
.fi{width:100%;padding:11px 14px;border:1px solid var(--bd);border-radius:var(--rs);font-family:var(--f);font-size:14px;color:var(--tx);background:var(--sf);transition:border-color .2s}
.fi:focus{border-color:var(--ac)}.fi::placeholder{color:var(--td)}
.auth-btn{width:100%;padding:13px;border:none;border-radius:var(--rs);background:var(--ac);color:#fff;font-family:var(--f);font-size:14px;font-weight:600;cursor:pointer;transition:opacity .2s}
.auth-btn:hover{opacity:.9}.auth-btn:disabled{opacity:.5;cursor:not-allowed}
.auth-switch{text-align:center;margin-top:20px;font-size:13px;color:var(--ts)}
.auth-switch-link{color:var(--ac);font-weight:600;cursor:pointer;text-decoration:underline}
.app-wrap{display:flex;min-height:100vh;background:var(--bg)}
.sb{background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;transition:width .25s ease;overflow:hidden;flex-shrink:0}
.sb-open{width:256px}.sb-closed{width:56px}
.sb-head{display:flex;align-items:center;gap:10px;padding:20px 16px;border-bottom:1px solid var(--bl)}
.sb-logo{width:28px;height:28px;border-radius:7px;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:600;font-size:14px;flex-shrink:0}
.sb-logo-text{font-family:var(--fd);font-size:18px;font-weight:500}
.sb-label{font-size:10px;font-weight:600;color:var(--td);letter-spacing:.1em;text-transform:uppercase;padding:20px 18px 8px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 16px;margin:1px 8px;border-radius:7px;cursor:pointer;font-size:13.5px;color:var(--ts);transition:all .15s}
.sb-item:hover{background:var(--hv);color:var(--tx)}.sb-active{background:var(--as)!important;color:var(--tx)!important;font-weight:500}
.sb-icon{font-size:14px;font-weight:700;width:20px;text-align:center;flex-shrink:0}
.sb-usage{margin:auto 14px 0;padding:16px;background:var(--as);border-radius:var(--rs)}
.sb-usage-lbl{font-size:11px;color:var(--td);margin-bottom:6px}
.sb-usage-num{font-family:var(--fd);font-size:26px;font-weight:500}.sb-usage-max{font-size:14px;color:var(--td);font-weight:400}
.sb-bar{margin-top:8px;height:4px;background:var(--bd);border-radius:2px;overflow:hidden}
.sb-fill{height:100%;background:var(--ac);border-radius:2px;transition:width .5s ease}
.sb-user{display:flex;align-items:center;gap:10px;padding:16px;border-top:1px solid var(--bl);margin-top:12px}
.sb-avatar{width:32px;height:32px;border-radius:8px;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;flex-shrink:0}
.sb-user-info{flex:1;min-width:0}.sb-user-name{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-user-plan{font-size:10px;color:var(--td);font-weight:600;letter-spacing:.05em}
.sb-logout{background:none;border:none;color:var(--td);cursor:pointer;font-size:16px;padding:4px;transition:color .2s}.sb-logout:hover{color:var(--er)}
.mn{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow-x:hidden}
.topbar{display:flex;align-items:center;gap:12px;padding:14px 24px;border-bottom:1px solid var(--bl);background:var(--sf)}
.tb-toggle{background:none;border:none;font-size:16px;color:var(--ts);cursor:pointer;padding:2px 6px}
.tb-bc{font-size:12px;color:var(--td)}.tb-badge{margin-left:auto;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--td);background:var(--as);padding:4px 10px;border-radius:5px}
.mn-content{flex:1;padding:32px 36px 64px;max-width:880px}
.dash-title{font-family:var(--fd);font-size:30px;font-weight:400;letter-spacing:-.02em;line-height:1.2;margin-bottom:8px}.dash-title em{font-style:italic;color:var(--ts)}
.dash-sub{color:var(--td);font-size:14px;margin-bottom:32px}
.m-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:32px}
.m-card{background:var(--sf);border:1px solid var(--bd);border-top:3px solid;border-radius:var(--r);padding:26px 22px;cursor:pointer;transition:all .25s ease;animation:fadeIn .4s ease both;box-shadow:var(--sh)}
.m-card:hover{transform:translateY(-3px);box-shadow:var(--sl)}
.m-card-icon{font-size:24px;font-weight:700;margin-bottom:14px}.m-card-title{font-family:var(--fd);font-size:18px;font-weight:500;margin-bottom:6px}
.m-card-desc{font-size:13px;color:var(--ts);line-height:1.5}.m-card-foot{margin-top:16px;font-size:12px;font-weight:500}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
.stat-box{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rs);padding:20px;text-align:center}
.stat-n{font-family:var(--fd);font-size:32px;font-weight:500}.stat-l{font-size:12px;color:var(--td);margin-top:4px}
.sec-title{font-family:var(--fd);font-size:20px;font-weight:500;margin-bottom:16px}
.back{background:none;border:none;font-family:var(--f);font-size:13px;color:var(--ts);cursor:pointer;margin-bottom:28px;padding:0}.back:hover{color:var(--tx)}
.mod-head{display:flex;align-items:center;gap:14px;margin-bottom:28px}.mod-icon{font-size:30px;font-weight:700}
.mod-title{font-family:var(--fd);font-size:24px;font-weight:500}.mod-desc{font-size:13px;color:var(--ts);margin-top:2px}
.t-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.t-card{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:22px 20px;cursor:pointer;transition:all .2s;animation:fadeIn .35s ease both}
.t-card:hover{border-color:var(--ac);background:var(--hv);transform:translateY(-2px);box-shadow:var(--sh)}
.t-card-icon{font-size:26px;margin-bottom:10px}.t-card-name{font-size:14px;font-weight:500}
.tool-head{display:flex;align-items:center;gap:12px;margin-bottom:24px}.tool-title{font-family:var(--fd);font-size:22px;font-weight:500}
.tool-box{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.tool-ta{width:100%;min-height:170px;padding:22px;border:none;background:transparent;font-family:var(--f);font-size:14px;color:var(--tx);line-height:1.7;resize:vertical}.tool-ta::placeholder{color:var(--td)}
.tool-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 22px;border-top:1px solid var(--bl)}
.tool-chars{font-size:12px;color:var(--td)}.tool-shortcut{font-size:11px;color:var(--td);background:var(--as);padding:3px 8px;border-radius:4px}
.tool-btn{padding:9px 22px;border:none;border-radius:var(--rs);background:var(--bd);color:var(--td);font-family:var(--f);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.tool-btn:not(:disabled){color:#fff}.tool-btn:disabled{cursor:not-allowed}
.tool-out{margin-top:20px;background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:26px;box-shadow:var(--sh)}
.tool-out-head{display:flex;align-items:center;gap:8px;margin-bottom:18px}.tool-dot{width:7px;height:7px;border-radius:50%;background:var(--ok)}
.tool-out-lbl{font-size:12px;font-weight:500;color:var(--ok)}.tool-out-text{font-size:14px;line-height:1.85;white-space:pre-wrap}
.tool-out-actions{display:flex;gap:10px;margin-top:22px;padding-top:14px;border-top:1px solid var(--bl)}
.tool-act{padding:7px 16px;border:1px solid var(--bd);border-radius:7px;background:transparent;color:var(--ts);font-family:var(--f);font-size:12px;cursor:pointer;transition:all .2s}
.tool-act:hover{border-color:var(--ac);color:var(--tx)}
.pg-title{font-family:var(--fd);font-size:26px;font-weight:500;margin-bottom:8px}.pg-sub{font-size:14px;color:var(--ts)}
.empty{color:var(--td);font-size:14px;padding:40px 0}
.h-table{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden}
.h-row{display:flex;align-items:center;gap:14px;padding:12px 18px;border-bottom:1px solid var(--bl);font-size:13px;animation:slideIn .3s ease both}.h-row:last-child{border-bottom:none}
.h-date{color:var(--td);min-width:110px;font-size:12px}
.h-badge{background:var(--as);padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;color:var(--ts);text-transform:capitalize}
.h-tool{font-weight:500;min-width:100px}.h-prev{color:var(--ts);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
.pl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;max-width:780px;margin:0 auto}
.pl-card{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:30px 24px;animation:fadeIn .4s ease both;position:relative}
.pl-hl{border-color:var(--ac);box-shadow:var(--sl)}
.pl-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--ac);color:#fff;font-size:10px;font-weight:600;padding:3px 12px;border-radius:0 0 6px 6px;letter-spacing:.06em}
.pl-name{font-size:16px;font-weight:600;margin-bottom:4px}
.pl-price{font-family:var(--fd);font-size:34px;font-weight:500;margin-bottom:4px}.pl-period{font-size:14px;color:var(--td);font-weight:400;font-family:var(--f)}
.pl-meta{font-size:12px;color:var(--ts);margin-bottom:22px}
.pl-feats{display:flex;flex-direction:column;gap:9px;margin-bottom:26px}.pl-feat{font-size:13px;color:var(--ts)}
.pl-cta{width:100%;padding:11px;border:1px solid var(--bd);border-radius:var(--rs);background:transparent;font-family:var(--f);font-size:13px;font-weight:500;cursor:pointer;color:var(--tx);transition:all .2s}
.pl-cta:hover{border-color:var(--ac)}.pl-cta-p{background:var(--ac);color:#fff;border:none}.pl-cta-p:hover{opacity:.9}
@media(max-width:768px){
  .auth-wrap{flex-direction:column}.auth-left{display:none}
  .sb-open{width:220px;position:fixed;z-index:100;height:100vh;box-shadow:var(--sl)}
  .m-grid,.t-grid,.features-grid{grid-template-columns:1fr}.stats-row{grid-template-columns:1fr 1fr}
  .pl-grid,.pricing-grid{grid-template-columns:1fr}.mn-content{padding:24px 18px}
  .h-row{flex-wrap:wrap;gap:6px}.h-prev{width:100%}
  .hero-title{font-size:32px}.hero-actions{flex-direction:column;align-items:center}
  .footer-inner{flex-direction:column;gap:12px}
  .landing-nav-inner{padding:12px 16px}.nav-links{gap:14px}
}
`;
