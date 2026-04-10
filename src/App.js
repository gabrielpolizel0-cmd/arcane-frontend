import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://web-production-ddbd9.up.railway.app/api";

const C = {
  bg:"#050505",surface:"#0A0A0A",card:"#111111",elevated:"#1a1a1a",
  accent:"#38bdf8",accentD:"#0ea5e9",
  accentGlow:"rgba(56,189,248,0.25)",accentDim:"rgba(56,189,248,0.12)",
  text:"#EAEAEA",muted:"#999999",hint:"#555555",
  border:"rgba(255,255,255,0.07)",borderHi:"rgba(255,255,255,0.14)",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{font-size:16px;}
  body{background:#050505;color:#EAEAEA;font-family:'Inter',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  ::selection{background:#38bdf8;color:#000;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:#050505;}
  ::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
  ::-webkit-scrollbar-thumb:hover{background:#38bdf8;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);filter:blur(8px);}to{opacity:1;transform:translateY(0);filter:blur(0);}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .anim-in{animation:fadeUp 0.7s ease-out both;}
  .anim-fi{animation:fadeIn 0.5s ease-out both;}
  .reveal{opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .reveal.vis{opacity:1;transform:translateY(0);}
  input,textarea{background:#111111;border:1px solid rgba(255,255,255,0.07);color:#EAEAEA;border-radius:0;padding:12px 16px;font-family:'Inter',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color 0.2s;}
  input:focus,textarea:focus{border-color:#38bdf8;}
  input::placeholder,textarea::placeholder{color:#555555;}
  button{cursor:pointer;font-family:'Inter',sans-serif;border:none;transition:all 0.2s;}
  .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 28px;background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid #38bdf8;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;border-radius:0;}
  .btn-primary:hover{background:#38bdf8;color:#000;box-shadow:0 0 24px rgba(56,189,248,0.25);}
  .btn-primary:active{transform:scale(0.97);}
  .btn-primary:disabled{opacity:0.5;pointer-events:none;}
  .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 28px;background:rgba(255,255,255,0.04);color:#999;border:1px solid rgba(255,255,255,0.07);font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;border-radius:0;}
  .btn-ghost:hover{background:rgba(255,255,255,0.08);color:#EAEAEA;border-color:rgba(255,255,255,0.14);}
  .nav-link{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#555;padding:6px 14px;white-space:nowrap;transition:all 0.2s;text-decoration:none;font-weight:500;}
  .nav-link:hover{color:#EAEAEA;background:rgba(255,255,255,0.05);}
  .card{background:#111111;border:1px solid rgba(255,255,255,0.07);padding:28px;transition:border-color 0.2s,box-shadow 0.2s;}
  .card:hover{border-color:#0ea5e9;box-shadow:0 0 24px rgba(56,189,248,0.25);}
  .tool-card{background:#111111;border:1px solid rgba(255,255,255,0.07);padding:24px;cursor:pointer;transition:border-color 0.2s,box-shadow 0.2s;position:relative;overflow:hidden;}
  .tool-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:#38bdf8;transform:scaleX(0);transition:transform 0.3s;}
  .tool-card:hover::before{transform:scaleX(1);}
  .tool-card:hover{border-color:#0ea5e9;box-shadow:0 0 20px rgba(56,189,248,0.25);}
  .sidebar{width:240px;min-height:100vh;background:#0A0A0A;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;}
  .nav-item{display:flex;align-items:center;gap:12px;padding:11px 24px;color:#555;cursor:pointer;transition:all 0.15s;font-size:13px;font-weight:400;border-left:2px solid transparent;}
  .nav-item:hover{color:#EAEAEA;background:rgba(255,255,255,0.03);}
  .nav-item.active{color:#38bdf8;border-left-color:#38bdf8;background:rgba(56,189,248,0.12);}
  .main-content{margin-left:240px;min-height:100vh;background:#050505;}
  .topbar{height:60px;background:#0A0A0A;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:50;}
  .tag{display:inline-block;background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.25);padding:4px 14px;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:500;margin-bottom:20px;}
  .result-box{background:#111111;border:1px solid rgba(255,255,255,0.07);padding:20px;min-height:200px;font-size:14px;line-height:1.8;white-space:pre-wrap;color:#999;}
  .usage-bar{height:2px;background:rgba(255,255,255,0.06);overflow:hidden;margin-top:6px;}
  .usage-fill{height:100%;background:#38bdf8;transition:width 0.5s;}
  .toast{position:fixed;bottom:28px;right:28px;background:#111111;border:1px solid rgba(255,255,255,0.07);color:#EAEAEA;padding:14px 22px;font-size:13px;z-index:9999;animation:fadeUp 0.3s ease;border-left:3px solid #38bdf8;}
  .section-label{font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#555;font-weight:500;margin-bottom:12px;}
`;

function useScrollReveal() {
  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Toast({ message, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{message}</div>;
}

function Logo({ size = 18 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:size+10, height:size+10, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"Space Mono,monospace", fontSize:size*0.55, fontWeight:700, color:"#000" }}>A</span>
      </div>
      <span style={{ fontFamily:"Space Mono,monospace", fontSize:size, fontWeight:700, letterSpacing:4, color:"#EAEAEA", textTransform:"uppercase" }}>ARCANE</span>
    </div>
  );
}

const MODULES = [
  { id:"documentos", icon:"◈", label:"Documentos", color:"#38bdf8",
    tools:[
      { id:"contrato",   name:"Gerar Contrato",      desc:"Contratos profissionais personalizados" },
      { id:"proposta",   name:"Proposta Comercial",   desc:"Propostas persuasivas e profissionais" },
      { id:"relatorio",  name:"Relatorio Executivo",  desc:"Relatorios claros e impactantes" },
      { id:"email_corp", name:"E-mail Corporativo",   desc:"Comunicacoes formais e eficazes" },
    ]},
  { id:"dados", icon:"◇", label:"Dados", color:"#a78bfa",
    tools:[
      { id:"analise",  name:"Analise de Dados",      desc:"Insights estrategicos dos seus dados" },
      { id:"query",    name:"Gerar Query SQL",        desc:"Consultas SQL otimizadas" },
      { id:"previsao", name:"Previsao e Tendencias",  desc:"Antecipe cenarios do seu negocio" },
      { id:"kpis",     name:"Definir KPIs",           desc:"Metricas certas para seu negocio" },
    ]},
  { id:"produtividade", icon:"◉", label:"Produtividade", color:"#34d399",
    tools:[
      { id:"ata",              name:"Ata de Reuniao",       desc:"Documente decisoes com clareza" },
      { id:"resumo",           name:"Resumir Documento",    desc:"Sinteses executivas precisas" },
      { id:"onboarding",       name:"Plano de Onboarding",  desc:"Integre novos colaboradores" },
      { id:"base_conhecimento",name:"Base de Conhecimento", desc:"Organize o saber da empresa" },
    ]},
  { id:"conteudo", icon:"◆", label:"Conteudo", color:"#f472b6",
    tools:[
      { id:"post_social", name:"Post para Redes Sociais", desc:"Conteudo que engaja e converte" },
      { id:"blog",        name:"Artigo para Blog",        desc:"Conteudo que posiciona sua marca" },
      { id:"email_mkt",   name:"E-mail Marketing",        desc:"Campanhas que geram resultados" },
      { id:"descricao",   name:"Descricao de Produto",    desc:"Textos que vendem mais" },
    ]},
];

const TOOL_PROMPTS = {
  contrato:"Voce e especialista em direito empresarial brasileiro. Gere um contrato profissional e completo. Use linguagem juridica adequada.",
  proposta:"Voce e especialista em vendas B2B. Crie uma proposta comercial persuasiva, estruturada e profissional.",
  relatorio:"Voce e especialista em comunicacao executiva. Crie um relatorio executivo claro, estruturado e impactante.",
  email_corp:"Voce e especialista em comunicacao corporativa. Escreva um e-mail profissional, claro e persuasivo.",
  analise:"Voce e analista de dados senior. Analise os dados fornecidos e gere insights estrategicos.",
  query:"Voce e especialista em banco de dados. Gere uma query SQL otimizada e bem comentada.",
  previsao:"Voce e especialista em business intelligence. Analise e projete tendencias com base nos dados fornecidos.",
  kpis:"Voce e especialista em gestao por indicadores. Sugira KPIs relevantes e como mensura-los.",
  ata:"Voce e especialista em comunicacao empresarial. Gere uma ata de reuniao profissional e estruturada.",
  resumo:"Voce e especialista em sintese de informacoes. Resuma o conteudo de forma clara, destacando pontos-chave.",
  onboarding:"Voce e especialista em gestao de pessoas. Crie um plano de onboarding estruturado e acolhedor.",
  base_conhecimento:"Voce e especialista em gestao do conhecimento. Estruture as informacoes em uma base de conhecimento clara.",
  post_social:"Voce e especialista em marketing digital. Crie posts envolventes e estrategicos para redes sociais.",
  blog:"Voce e especialista em content marketing e SEO. Escreva um artigo completo, envolvente e otimizado.",
  email_mkt:"Voce e especialista em e-mail marketing. Escreva um e-mail de campanha persuasivo.",
  descricao:"Voce e especialista em copywriting. Escreva uma descricao de produto irresistivel.",
};

const PLANS = [
  { id:"free",      name:"Free",      price:"R$ 0",   period:"",     gens:"5 geracoes/mes",      gensLimit:5,     users:"1 usuario",          highlight:false, features:["4 modulos completos","Acesso basico","Suporte por e-mail"] },
  { id:"starter",   name:"Starter",   price:"R$ 97",  period:"/mes", gens:"150 geracoes/mes",     gensLimit:150,   users:"5 usuarios",          highlight:false, features:["Tudo do Free","5 usuarios","Suporte prioritario","Historico 30 dias"] },
  { id:"business",  name:"Business",  price:"R$ 297", period:"/mes", gens:"500 geracoes/mes",     gensLimit:500,   users:"15 usuarios",         highlight:true,  features:["Tudo do Starter","15 usuarios","Excel com formulas","PowerPoint com IA","PDF profissional","Suporte dedicado"] },
  { id:"unlimited", name:"Unlimited", price:"R$ 897", period:"/mes", gens:"Geracoes ilimitadas",  gensLimit:99999, users:"Usuarios ilimitados",  highlight:false, features:["Tudo do Business","Usuarios ilimitados","IA personalizada","SLA dedicado","Integracao customizada","Treinamento da equipe"] },
];

const MP_LINKS = {
  starter:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_STARTER",
  business:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_BUSINESS",
  unlimited:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=SEU_ID_UNLIMITED",
};

const FAQS = [
  { q:"Preciso saber programar para usar o Arcane?", a:"Nao! O Arcane foi desenvolvido para qualquer profissional. A interface e intuitiva e voce comeca a gerar resultados em minutos." },
  { q:"Os dados da minha empresa ficam seguros?", a:"Sim. Utilizamos criptografia de ponta a ponta e seus dados nunca sao usados para treinar modelos de IA. Seguimos todas as diretrizes da LGPD." },
  { q:"Posso cancelar a qualquer momento?", a:"Sim, sem taxas ou burocracia. Voce pode cancelar sua assinatura quando quiser diretamente pelo painel." },
  { q:"O plano Free tem limitacoes?", a:"O plano Free oferece 5 geracoes por mes para voce experimentar a plataforma. Para uso profissional, recomendamos o Starter ou Business." },
  { q:"Como funciona o suporte?", a:"Planos pagos tem suporte via e-mail com resposta em ate 24h. O plano Business inclui suporte prioritario e o Unlimited tem gerente de conta dedicado." },
];

const HOW_STEPS = [
  { n:"01", title:"Crie sua conta",       desc:"Cadastre-se gratuitamente em menos de 1 minuto. Sem cartao necessario." },
  { n:"02", title:"Escolha a ferramenta", desc:"Selecione entre 16 ferramentas em 4 modulos de negocio." },
  { n:"03", title:"Insira seus dados",    desc:"Descreva o que voce precisa. Quanto mais detalhes, melhor o resultado." },
  { n:"04", title:"Receba o resultado",   desc:"A IA gera seu conteudo profissional em segundos. Copie e use." },
];

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
          <div className="tag">Plataforma de IA</div>
          <h2 style={{ fontSize:34, fontWeight:300, lineHeight:1.2, marginBottom:20, color:C.text }}>Conteudo profissional<br />em <span style={{ color:C.accent }}>segundos</span></h2>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.8, marginBottom:36 }}>16 ferramentas de IA especializadas para empresas brasileiras.</p>
          {["16 ferramentas especializadas","Resultados em menos de 30 segundos","100% em portugues, focado no Brasil"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <span style={{ color:C.accent, fontSize:10 }}>▶</span>
              <span style={{ color:C.muted, fontSize:13 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:48, paddingTop:28, borderTop:`1px solid ${C.border}` }}>
          <div style={{ color:C.hint, fontSize:10, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Plano gratuito inclui</div>
          <div style={{ color:C.muted, fontSize:13 }}>5 geracoes/mes · Todos os modulos · Sem cartao</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 64px" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h3 style={{ fontSize:24, fontWeight:500, marginBottom:8, color:C.text }}>{mode==="login"?"Bem-vindo de volta":"Criar sua conta"}</h3>
            <p style={{ color:C.muted, fontSize:14 }}>{mode==="login"?"Entre para continuar usando o Arcane":"Comece gratuitamente, sem cartao de credito"}</p>
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
            {error&&<div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", padding:"12px 16px", fontSize:13, color:"#fca5a5" }}>⚠ {error}</div>}
            <button className="btn-primary" onClick={handle} disabled={loading} style={{ width:"100%", height:48, fontSize:13, marginTop:4 }}>
              {loading?"Aguarde...":mode==="login"?"ENTRAR NA PLATAFORMA":"CRIAR CONTA GRATIS"}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:24, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
            <span style={{ color:C.muted, fontSize:14 }}>{mode==="login"?"Nao tem conta? ":"Ja tem conta? "}</span>
            <span onClick={onSwitch} style={{ color:C.accent, cursor:"pointer", fontSize:14, fontWeight:500 }}>{mode==="login"?"Criar gratuitamente →":"Entrar →"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTool,   setActiveTool]   = useState(null);
  const [input,  setInput]  = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState("");
  const [usedCount, setUsedCount] = useState(0);

  const currentModule = MODULES.find(m=>m.id===activeModule);
  const plan       = PLANS.find(p=>p.id===(user.plan||"free")) || PLANS[0];
  const limitCount = plan.gensLimit;
  const usagePct   = limitCount>=99999 ? 0 : Math.min((usedCount/limitCount)*100,100);
  const remaining  = limitCount>=99999 ? "inf" : Math.max(limitCount-usedCount,0);

  const generate = async () => {
    if (!activeTool||!input.trim()) return;
    if (remaining!=="inf"&&remaining<=0) { setToast("Limite atingido. Faca upgrade!"); return; }
    setLoading(true); setResult("");
    try {
      const token = localStorage.getItem("arcane_token");
      const res = await fetch(BACKEND_URL+"/ai/generate",{
        method:"POST",
        headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
        body:JSON.stringify({ tool:activeTool.id, input }),
      });
      const data = await res.json();
      if (res.status===422||res.status===401) { localStorage.removeItem("arcane_token"); localStorage.removeItem("arcane_user"); window.location.reload(); return; }
      if (!res.ok) throw new Error(data.error||"Erro ao gerar");
      setResult(data.output||data.result||data.content||"");
      if (data.used!==undefined) setUsedCount(data.used);
    } catch(e) { setToast(e.message); }
    setLoading(false);
  };

  const copyResult = () => { navigator.clipboard.writeText(result); setToast("Copiado!"); };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <style>{G}</style>
      <div className="sidebar">
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${C.border}` }}><Logo size={15} /></div>
        <div style={{ flex:1, overflowY:"auto", padding:"12px 0" }}>
          <div style={{ padding:"0 24px 6px", fontSize:9, color:C.hint, letterSpacing:3, textTransform:"uppercase" }}>Modulos</div>
          {MODULES.map(mod=>(
            <div key={mod.id} className={`nav-item ${activeModule===mod.id?"active":""}`} onClick={()=>{ setActiveModule(mod.id); setActiveTool(null); setResult(""); }}>
              <span style={{ color:mod.color, fontSize:14 }}>{mod.icon}</span><span>{mod.label}</span>
            </div>
          ))}
          <div style={{ padding:"14px 24px 6px", fontSize:9, color:C.hint, letterSpacing:3, textTransform:"uppercase", marginTop:8 }}>Geral</div>
          <div className={`nav-item ${activeModule===null?"active":""}`} onClick={()=>{ setActiveModule(null); setActiveTool(null); setResult(""); }}>
            <span style={{ fontSize:14 }}>⊞</span><span>Dashboard</span>
          </div>
        </div>
        <div style={{ padding:"18px 24px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9, color:C.hint, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Plano {plan.name}</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{remaining==="inf"?"Ilimitado":`${remaining} de ${limitCount} restantes`}</div>
          <div className="usage-bar"><div className="usage-fill" style={{ width:`${usagePct}%` }} /></div>
          <div onClick={onLogout} style={{ marginTop:14, fontSize:12, color:C.hint, cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.hint}>← Sair</div>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{activeModule?currentModule?.label:"Dashboard"}</div>
            <div style={{ fontSize:11, color:C.hint }}>{activeModule?`${currentModule?.tools.length} ferramentas disponiveis`:"Bem-vindo ao Arcane"}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, color:C.muted }}>{user.name||user.email}</div>
              <div style={{ fontSize:10, color:C.accent, letterSpacing:1, textTransform:"uppercase" }}>{plan.name}</div>
            </div>
            <div style={{ width:34, height:34, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#000" }}>
              {(user.name||user.email||"U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding:28 }}>
          {!activeModule&&(
            <>
              <div style={{ marginBottom:28 }}>
                <div className="section-label">Overview</div>
                <h2 style={{ fontSize:26, fontWeight:400, color:C.text, marginBottom:4 }}>Ola, <span style={{ color:C.accent }}>{user.name||"bem-vindo"}</span></h2>
                <p style={{ color:C.muted, fontSize:13 }}>O que vamos criar hoje?</p>
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"16px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", borderLeft:"3px solid #38bdf8" }}>
                <div>
                  <div style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Uso este mes — Plano {plan.name}</div>
                  <div style={{ fontSize:20, fontFamily:"Space Mono,monospace", color:C.accent }}>{usedCount} <span style={{ fontSize:13, color:C.muted }}>de {limitCount===99999?"ilimitado":limitCount} geracoes</span></div>
                </div>
                <div style={{ width:130 }}>
                  <div style={{ fontSize:11, color:C.muted, textAlign:"right", marginBottom:4 }}>{remaining==="inf"?"Ilimitado":`${remaining} restantes`}</div>
                  <div className="usage-bar"><div className="usage-fill" style={{ width:`${usagePct}%` }} /></div>
                </div>
              </div>
              <div className="section-label">Modulos disponiveis</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {MODULES.map(mod=>(
                  <div key={mod.id} className="tool-card" onClick={()=>{ setActiveModule(mod.id); setActiveTool(null); }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                      <div style={{ width:38, height:38, background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                        <span style={{ color:mod.color }}>{mod.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{mod.label}</div>
                        <div style={{ fontSize:11, color:C.hint }}>{mod.tools.length} ferramentas</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {mod.tools.map(tool=>(
                        <span key={tool.id} style={{ fontSize:10, color:C.hint, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, padding:"3px 8px" }}>{tool.name}</span>
                      ))}
                    </div>
                    <div style={{ marginTop:14, fontSize:10, color:mod.color, letterSpacing:1 }}>ABRIR MODULO →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeModule&&!activeTool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
                <button onClick={()=>setActiveModule(null)} style={{ background:"transparent", color:C.muted, fontSize:11, padding:0, letterSpacing:1 }} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>← DASHBOARD</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{currentModule?.label}</span>
              </div>
              <div className="section-label">Modulo de {currentModule?.label}</div>
              <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>{currentModule?.label}</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Selecione uma ferramenta para comecar</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
                {currentModule?.tools.map(tool=>(
                  <div key={tool.id} className="tool-card" onClick={()=>setActiveTool(tool)}>
                    <div style={{ fontSize:9, color:currentModule.color, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>{currentModule.icon} {currentModule.label}</div>
                    <div style={{ fontSize:15, fontWeight:500, color:C.text, marginBottom:8 }}>{tool.name}</div>
                    <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{tool.desc}</div>
                    <div style={{ marginTop:16, fontSize:10, color:C.accent, letterSpacing:1 }}>USAR FERRAMENTA →</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeModule&&activeTool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
                <button onClick={()=>{ setActiveTool(null); setResult(""); setInput(""); }} style={{ background:"transparent", color:C.muted, fontSize:11, padding:0, letterSpacing:1 }} onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>← VOLTAR</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{activeTool.name}</span>
              </div>
              <div className="section-label">{currentModule?.label}</div>
              <h2 style={{ fontSize:22, fontWeight:400, color:C.text, marginBottom:4 }}>{activeTool.name}</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>{activeTool.desc}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div>
                  <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:10 }}>Descreva o que voce precisa</label>
                  <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ex: Contrato de prestacao de servicos entre empresa X e Y, valor R$ 5.000, prazo 3 meses..." rows={9} style={{ resize:"vertical" }} />
                  <button className="btn-primary" onClick={generate} disabled={loading||!input.trim()} style={{ marginTop:12, width:"100%", height:48, fontSize:12 }}>
                    {loading?"GERANDO...":"▶ GERAR COM IA"}
                  </button>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <label style={{ fontSize:10, color:C.hint, letterSpacing:2, textTransform:"uppercase" }}>Resultado</label>
                    {result&&<button onClick={copyResult} style={{ background:"transparent", color:C.accent, fontSize:10, padding:0, letterSpacing:1 }}>COPIAR ↗</button>}
                  </div>
                  <div className="result-box">
                    {loading?<div style={{ display:"flex", alignItems:"center", gap:10, color:C.muted }}><div style={{ animation:"pulse 1.2s ease infinite", color:C.accent }}>▶</div>Gerando seu conteudo...</div>
                    :result||<span style={{ color:C.hint }}>O resultado aparecera aqui...</span>}
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

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(5,5,5,0.92)":"transparent", backdropFilter:scrolled?"blur(16px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all 0.3s" }}>
        <Logo size={17} />
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {["Como Funciona","Ferramentas","Planos","FAQ"].map(item=>(
            <a key={item} className="nav-link" href={`#${item.toLowerCase().replace(" ","-")}`}>{item}</a>
          ))}
          <div style={{ width:1, height:20, background:C.border, margin:"0 10px" }} />
          <button className="btn-ghost" onClick={onLogin} style={{ height:38, padding:"0 20px", fontSize:11 }}>Entrar</button>
          <button className="btn-primary" onClick={onRegister} style={{ height:38, padding:"0 20px", fontSize:11 }}>Comecar Gratis</button>
        </div>
      </nav>

      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:64 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.4, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 48px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:800 }}>
            <div className="tag anim-fi" style={{ animationDelay:"0.1s", opacity:0 }}>▶ Plataforma de IA para Empresas</div>
            <h1 className="anim-in" style={{ fontSize:"clamp(40px,6vw,80px)", fontWeight:300, lineHeight:0.95, textTransform:"uppercase", letterSpacing:"-0.02em", marginBottom:28, animationDelay:"0.2s", opacity:0, color:C.text }}>
              Gere conteudo<br />profissional com<br /><span style={{ color:C.accent, fontWeight:600 }}>inteligencia artificial</span>
            </h1>
            <p className="anim-in" style={{ color:C.muted, fontSize:17, lineHeight:1.8, marginBottom:44, maxWidth:520, animationDelay:"0.4s", opacity:0 }}>
              16 ferramentas especializadas em documentos, dados, produtividade e conteudo. Resultados profissionais em segundos.
            </p>
            <div className="anim-in" style={{ display:"flex", gap:14, animationDelay:"0.6s", opacity:0 }}>
              <button className="btn-primary" onClick={onRegister} style={{ height:52, padding:"0 36px", fontSize:12 }}>Comecar Gratuitamente</button>
              <button className="btn-ghost" onClick={onLogin} style={{ height:52, padding:"0 36px", fontSize:12 }}>Ja tenho conta</button>
            </div>
            <div className="anim-in" style={{ display:"flex", gap:48, marginTop:60, animationDelay:"0.8s", opacity:0 }}>
              {[{n:"16",label:"Ferramentas de IA"},{n:"4",label:"Modulos especializados"},{n:"< 30s",label:"Tempo de geracao"}].map(s=>(
                <div key={s.n}>
                  <div style={{ fontFamily:"Space Mono,monospace", fontSize:32, fontWeight:700, color:C.accent }}>{s.n}</div>
                  <div style={{ fontSize:11, color:C.hint, marginTop:4, letterSpacing:1, textTransform:"uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" style={{ padding:"100px 48px", background:C.surface, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.accent},transparent)`, opacity:0.4 }}/>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div className="tag reveal">Como Funciona</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:12 }}>Do zero ao resultado<br /><span style={{ color:C.accent }}>em 4 passos</span></h2>
            <p className="reveal" style={{ color:C.muted, fontSize:15, maxWidth:440, margin:"0 auto" }}>Sem curva de aprendizado. Voce comeca a usar em minutos.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {HOW_STEPS.map((s,i)=>(
              <div key={i} className="reveal card" style={{ transitionDelay:`${i*0.1}s` }}>
                <div style={{ fontFamily:"Space Mono,monospace", fontSize:26, fontWeight:700, color:"rgba(56,189,248,0.2)", marginBottom:14 }}>{s.n}</div>
                <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ferramentas" style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:56 }}>
            <div className="tag reveal">Ferramentas</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Tudo que seu negocio<br /><span style={{ color:C.accent }}>precisa</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {MODULES.map((mod,i)=>(
              <div key={mod.id} className="reveal card" style={{ transitionDelay:`${i*0.1}s` }}>
                <div style={{ fontSize:22, color:mod.color, marginBottom:12 }}>{mod.icon}</div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4, letterSpacing:1, textTransform:"uppercase" }}>{mod.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>{mod.tools.length} ferramentas especializadas</div>
                {mod.tools.map(t=>(
                  <div key={t.id} style={{ fontSize:11, color:C.muted, padding:"5px 0", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:mod.color, fontSize:8 }}>▶</span>{t.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" style={{ padding:"100px 48px", background:C.surface }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="tag reveal">Planos</div>
            <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Escolha o plano<br /><span style={{ color:C.accent }}>ideal para voce</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {PLANS.map((plan,i)=>(
              <div key={plan.id} className="reveal" style={{ background:plan.highlight?"rgba(56,189,248,0.06)":C.card, border:`1px solid ${plan.highlight?C.accent:C.border}`, padding:26, position:"relative", transitionDelay:`${i*0.1}s`, boxShadow:plan.highlight?"0 0 40px rgba(56,189,248,0.2)":"none" }}>
                {plan.highlight&&<div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#000", fontSize:9, fontWeight:700, padding:"3px 14px", letterSpacing:2, whiteSpace:"nowrap", textTransform:"uppercase" }}>RECOMENDADO</div>}
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{plan.name}</div>
                <div style={{ marginBottom:4 }}>
                  <span style={{ fontFamily:"Space Mono,monospace", fontSize:30, fontWeight:700, color:plan.highlight?C.accent:C.text }}>{plan.price}</span>
                  <span style={{ color:C.muted, fontSize:12 }}>{plan.period}</span>
                </div>
                <div style={{ color:C.hint, fontSize:10, marginBottom:18, letterSpacing:1 }}>{plan.gens} · {plan.users}</div>
                <div style={{ height:1, background:C.border, marginBottom:18 }}/>
                <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
                  {plan.features.map((f,fi)=>(
                    <div key={fi} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:C.muted }}>
                      <span style={{ color:C.accent, fontSize:8 }}>▶</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ if(plan.id==="free"){onRegister();}else{window.open(MP_LINKS[plan.id],"_blank");} }}
                  className={plan.highlight?"btn-primary":"btn-ghost"}
                  style={{ width:"100%", height:42, fontSize:11, letterSpacing:1 }}>
                  {plan.id==="free"?"COMECAR GRATIS":"ASSINAR AGORA"}
                </button>
                {plan.id!=="free"&&<div style={{ textAlign:"center", marginTop:8, fontSize:10, color:C.hint }}>PIX · Cartao · Boleto</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div className="tag reveal">FAQ</div>
          <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:44 }}>Perguntas <span style={{ color:C.accent }}>frequentes</span></h2>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {FAQS.map((faq,i)=>(
              <div key={i} className="reveal" style={{ border:`1px solid ${openFaq===i?C.accentD:C.border}`, background:openFaq===i?C.accentDim:"transparent", transition:"all 0.2s", transitionDelay:`${i*0.05}s` }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"transparent", color:C.text, fontSize:14, textAlign:"left", fontWeight:400 }}>
                  {faq.q}<span style={{ color:C.accent, fontSize:18, flexShrink:0, marginLeft:16 }}>{openFaq===i?"−":"+"}</span>
                </button>
                {openFaq===i&&<div style={{ padding:"0 22px 18px", color:C.muted, fontSize:13, lineHeight:1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"100px 48px", background:C.surface, textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.3, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:600, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="tag reveal" style={{ margin:"0 auto 20px" }}>Comece Hoje</div>
          <h2 className="reveal" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:18 }}>Pronto para transformar<br /><span style={{ color:C.accent }}>sua produtividade?</span></h2>
          <p className="reveal" style={{ color:C.muted, fontSize:15, marginBottom:32 }}>Junte-se a centenas de empresas que ja usam o Arcane para trabalhar de forma mais inteligente.</p>
          <button className="btn-primary reveal" onClick={onRegister} style={{ height:52, padding:"0 44px", fontSize:12 }}>CRIAR CONTA GRATIS AGORA</button>
          <p className="reveal" style={{ color:C.hint, fontSize:12, marginTop:12 }}>Sem cartao de credito · Cancele quando quiser</p>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"28px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
        <Logo size={14} />
        <div style={{ color:C.hint, fontSize:10, fontFamily:"Space Mono,monospace" }}>2026 ARCANE // ALL RIGHTS RESERVED</div>
        <div style={{ display:"flex", gap:20 }}>
          {["Privacidade","Termos","Contato"].map(item=>(
            <span key={item} style={{ color:C.hint, fontSize:10, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=C.accent} onMouseLeave={e=>e.target.style.color=C.hint}>{item}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

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
