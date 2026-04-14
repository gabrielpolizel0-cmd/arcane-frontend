import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const BACKEND_URL = "https://web-production-ddbd9.up.railway.app/api";

const C = {
  bg:"#080810", surface:"#0d0d18", card:"#111120", border:"rgba(255,255,255,0.07)",
  borderHi:"rgba(255,255,255,0.12)", accent:"#106EBE", accentB:"#0FFCBE",
  text:"#e5e5e5", muted:"#a1a1aa", hint:"#52525b", hint2:"#3f3f46",
  red:"#ef4444", amber:"#f59e0b", green:"#22c55e",
  radius:"6px", radiusMd:"8px", radiusLg:"10px",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;font-size:14px;}
  body{background:#080810;color:#e5e5e5;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  .mono{font-family:'JetBrains Mono',monospace;}
  ::selection{background:#106EBE;color:#fff;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(16,110,190,0.2);border-radius:2px;}
  ::-webkit-scrollbar-thumb:hover{background:rgba(16,110,190,0.4);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  .anim-up{animation:fadeUp 0.6s ease both;}
  .anim-fi{animation:fadeIn 0.5s ease both;}
  .reveal{opacity:0;transform:translateY(18px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .reveal.vis{opacity:1;transform:none;}
  button{cursor:pointer;font-family:'Inter',sans-serif;border:none;transition:all 0.15s;}
  input,textarea,select{font-family:'Inter',sans-serif;font-size:13px;background:#111120;border:1px solid rgba(255,255,255,0.08);color:#e5e5e5;border-radius:6px;padding:10px 14px;width:100%;outline:none;transition:border-color 0.2s;}
  input:focus,textarea:focus,select:focus{border-color:#106EBE;}
  input::placeholder,textarea::placeholder{color:#3f3f46;}
  select option{background:#111120;}
  .btn-p{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 20px;height:38px;background:rgba(16,110,190,0.12);color:#106EBE;border:1px solid rgba(16,110,190,0.35);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border-radius:6px;}
  .btn-p:hover{background:#106EBE;color:#fff;box-shadow:0 0 20px rgba(16,110,190,0.25);}
  .btn-p:disabled{opacity:0.4;pointer-events:none;}
  .btn-g{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 20px;height:38px;background:rgba(255,255,255,0.04);color:#71717a;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border-radius:6px;}
  .btn-g:hover{background:rgba(255,255,255,0.07);color:#e5e5e5;border-color:rgba(255,255,255,0.14);}
  .sidebar{width:220px;min-height:100vh;background:#0d0d18;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;color:#52525b;cursor:pointer;transition:all 0.12s;font-size:12px;font-weight:400;border-radius:6px;margin:1px 6px;position:relative;}
  .nav-item:hover{color:#e5e5e5;background:rgba(255,255,255,0.04);}
  .nav-item.act{color:#106EBE;background:rgba(16,110,190,0.1);}
  .nav-item .ndot{position:absolute;top:10px;right:14px;width:5px;height:5px;border-radius:50%;}
  .main{margin-left:220px;min-height:100vh;background:#080810;}
  .topbar{height:46px;background:#0d0d18;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;padding:0 22px;position:sticky;top:0;z-index:50;}
  .card{background:#111120;border:1px solid rgba(255,255,255,0.07);border-radius:8px;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:rgba(255,255,255,0.05);}
  .mod-card{background:#111120;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:20px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;}
  .mod-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:rgba(255,255,255,0.05);transition:background 0.2s;}
  .mod-card:hover{border-color:rgba(16,110,190,0.25);background:#141428;}
  .mod-card:hover::before{background:linear-gradient(90deg,transparent,rgba(16,110,190,0.25),transparent);}
  .tool-row{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;cursor:pointer;transition:all 0.15s;margin-bottom:6px;}
  .tool-row:hover{background:rgba(16,110,190,0.07);border-color:rgba(16,110,190,0.25);}
  .result-box{background:#0d0d18;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:20px;min-height:280px;font-size:13px;line-height:1.85;white-space:pre-wrap;color:#a1a1aa;}
  .toast{position:fixed;bottom:24px;right:24px;background:#111120;border:1px solid rgba(255,255,255,0.1);border-left:3px solid #106EBE;color:#e5e5e5;padding:12px 20px;font-size:12px;z-index:9999;animation:fadeUp 0.3s ease;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .lbl{font-size:9px;color:#3f3f46;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;}
  .tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
  .tag-free{background:rgba(255,255,255,0.05);color:#52525b;}
  .tag-essencial{background:rgba(16,110,190,0.1);color:#106EBE;}
  .tag-profissional{background:rgba(15,252,190,0.08);color:#0FFCBE;}
  .tag-gestao{background:rgba(167,139,250,0.1);color:#a78bfa;}
  .upload-zone{border:1px dashed rgba(255,255,255,0.12);border-radius:8px;padding:28px;text-align:center;cursor:pointer;transition:all 0.2s;}
  .upload-zone:hover,.upload-zone.drag{border-color:rgba(16,110,190,0.4);background:rgba(16,110,190,0.04);}
  .s-dot{width:5px;height:5px;border-radius:50%;background:#0FFCBE;animation:blink 2.5s ease infinite;flex-shrink:0;}
  .alert-strip{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:8px;padding:12px 16px;display:flex;align-items:flex-start;gap:10px;}
  .opp-strip{background:rgba(15,252,190,0.04);border:1px solid rgba(15,252,190,0.12);border-radius:8px;padding:12px 16px;display:flex;align-items:flex-start;gap:10px;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal{background:#111120;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:32px;width:100%;max-width:520px;}
`;

const MODULES = [
  { id:"diagnostico_financeiro", icon:"◎", label:"Financeiro", plan:"free", color:"#fbbf24", desc:"Diagnostico real das suas financas",
    tools:[
      { id:"analisar_planilha",       name:"Analisar Planilha / Extrato",  desc:"Envie seus dados e receba diagnostico completo", upload:true },
      { id:"fluxo_caixa_diagnostico", name:"Diagnosticar Fluxo de Caixa", desc:"Identifique riscos e gaps no seu caixa" },
      { id:"identificar_desperdicio", name:"Identificar Desperdicios",     desc:"Onde voce esta perdendo dinheiro" },
      { id:"projecao_cenarios",       name:"Projecao de Cenarios",         desc:"Pessimista, realista e otimista para 6 meses" },
    ]},
  { id:"juridico", icon:"⬡", label:"Juridico", plan:"essencial", color:"#fb923c", desc:"Protecao juridica sem advogado retido",
    tools:[
      { id:"revisar_contrato", name:"Revisar Contrato",           desc:"Identifique riscos antes de assinar", upload:true },
      { id:"gerar_contrato",   name:"Gerar Contrato",             desc:"Contrato profissional em minutos" },
      { id:"lgpd_diagnostico", name:"Diagnostico LGPD",           desc:"Nivel de conformidade e plano de adequacao" },
      { id:"nda",              name:"Acordo de Confidencialidade", desc:"NDA robusto para proteger seu negocio" },
    ]},
  { id:"rh", icon:"⬟", label:"RH & Pessoas", plan:"free", color:"#e879f9", desc:"Gerencie seu time sem departamento de RH",
    tools:[
      { id:"diagnostico_time",     name:"Diagnosticar o Time",     desc:"Riscos, gaps e plano de retencao" },
      { id:"descricao_vaga",       name:"Criar Descricao de Vaga", desc:"Atraia os candidatos certos" },
      { id:"avaliacao_desempenho", name:"Avaliacao de Desempenho", desc:"Formulario estruturado com plano de metas" },
      { id:"plano_onboarding",     name:"Plano de Onboarding",     desc:"Integre novos colaboradores com eficiencia" },
      { id:"politica_interna",     name:"Politica Interna",        desc:"Regras claras que alinham a equipe" },
    ]},
  { id:"marketing", icon:"◆", label:"Marketing Digital", plan:"free", color:"#f472b6", desc:"Estrategia e conteudo sem agencia",
    tools:[
      { id:"diagnostico_marketing", name:"Diagnosticar Marketing",  desc:"Gaps, oportunidades e estrategia de 90 dias" },
      { id:"estrategia_conteudo",   name:"Estrategia de Conteudo",  desc:"Plano editorial de 30 dias por canal" },
      { id:"copy_vendas",           name:"Copy de Vendas",          desc:"Textos que convertem para produto ou servico" },
      { id:"post_redes_sociais",    name:"Posts para Redes Sociais",desc:"LinkedIn, Instagram e WhatsApp prontos" },
    ]},
  { id:"operacoes", icon:"◈", label:"Operacoes", plan:"free", color:"#38bdf8", desc:"Documente e organize o dia a dia",
    tools:[
      { id:"diagnostico_processos", name:"Diagnosticar Processos", desc:"Gargalos, desperdicios e mapa do processo ideal" },
      { id:"proposta_comercial",    name:"Proposta Comercial",     desc:"Proposta consultiva que fecha negocio" },
      { id:"ata_reuniao",           name:"Ata de Reuniao",         desc:"Decisoes e tarefas documentadas com precisao" },
      { id:"email_profissional",    name:"E-mail Profissional",    desc:"Comunicacao corporativa clara e eficaz" },
    ]},
  { id:"consultoria", icon:"★", label:"Consultoria Estrategica", plan:"profissional", color:"#a78bfa", desc:"Consultoria de alto nivel para decisoes criticas",
    tools:[
      { id:"diagnostico_completo", name:"Diagnostico Completo do Negocio", desc:"Visao 360 com prioridades e roteiro de 90 dias" },
      { id:"plano_crescimento",    name:"Plano de Crescimento",            desc:"Estrategia para dobrar o negocio em 12 meses" },
      { id:"analise_concorrentes", name:"Analise de Concorrentes",         desc:"Inteligencia competitiva e posicionamento" },
    ]},
];

const TOOL_TIME = {
  analisar_planilha:180, fluxo_caixa_diagnostico:120, identificar_desperdicio:90, projecao_cenarios:150,
  revisar_contrato:180, gerar_contrato:120, lgpd_diagnostico:240, nda:90,
  diagnostico_time:120, descricao_vaga:60, avaliacao_desempenho:90, plano_onboarding:120, politica_interna:150,
  diagnostico_marketing:120, estrategia_conteudo:90, copy_vendas:60, post_redes_sociais:45,
  diagnostico_processos:150, proposta_comercial:90, ata_reuniao:30, email_profissional:20,
  diagnostico_completo:300, plano_crescimento:240, analise_concorrentes:180,
};
const HOURLY_RATE = 80;

const PLANS = [
  { id:"free",         name:"Basico",       price:"R$ 0",   period:"",     limit:10,    highlight:false, features:["10 analises/mes","Modulos: Financeiro, RH, Marketing, Operacoes","Upload de planilhas e contratos","Historico de 7 dias"] },
  { id:"essencial",    name:"Essencial",    price:"R$ 147", period:"/mes", limit:200,   highlight:false, features:["200 analises/mes","Todos os modulos basicos","Modulo Juridico","Historico completo","Suporte prioritario"] },
  { id:"profissional", name:"Profissional", price:"R$ 347", period:"/mes", limit:600,   highlight:true,  features:["600 analises/mes","Todos os modulos","Consultoria Estrategica","Diagnostico Completo do Negocio","Suporte dedicado"] },
  { id:"gestao",       name:"Gestao",       price:"R$ 597", period:"/mes", limit:99999, highlight:false, features:["Analises ilimitadas","Tudo do Profissional","Multiplos usuarios","API de integracao","SLA garantido"] },
];
const PLAN_ORDER = { free:0, essencial:1, starter:1, profissional:2, business:2, gestao:3, unlimited:3 };
const MP_LINKS = {
  essencial:   "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=f33b7ffb9fc5463f82b079e24dfa9e43",
  profissional:"https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=60b050ff92e44a178b1a0b009cb140e0",
  gestao:      "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=5e5810b4f083411fb6aaf6f0cbb9eed5",
};
const FAQS = [
  { q:"O Arcane substitui um funcionario?", a:"Para pequenas empresas, sim. O Arcane concentra juridico, financeiro, RH e marketing — areas que normalmente exigiriam ao menos 2-3 profissionais. Voce paga uma fracao do salario e tem acesso 24 horas." },
  { q:"Posso enviar minhas planilhas para analise?", a:"Sim. No modulo Financeiro voce faz upload de planilhas Excel ou CSV, ou cola os dados diretamente. O sistema le, interpreta e entrega um diagnostico detalhado com acoes concretas." },
  { q:"Os meus dados ficam seguros?", a:"Sim. Utilizamos criptografia e seus dados nunca sao usados para treinar modelos. Seguimos integralmente a LGPD." },
  { q:"Posso cancelar quando quiser?", a:"Sim, sem burocracia. O cancelamento e imediato e voce mantem acesso ate o final do periodo pago." },
  { q:"O sistema funciona para qualquer tipo de negocio?", a:"Sim. Atende desde MEIs e autonomos ate empresas com equipes de 50+ pessoas. Quanto mais contexto voce fornecer, mais precisa e especifica sera a analise." },
];
const SECTORS = ["Varejo","Servicos","Tecnologia","Saude","Educacao","Construcao","Alimentacao","Agronegocio","Logistica","Consultoria","Juridico","Contabilidade","Marketing / Agencia","Outro"];
const SIZES = ["MEI / Autonomo","Microempresa (2-9 funcionarios)","Pequena empresa (10-49 funcionarios)","Media empresa (50+ funcionarios)"];
const TONES = ["Formal e tecnico","Neutro e profissional","Descontraido e proximo"];

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }), { threshold:0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
function canUse(userPlan, reqPlan) { return (PLAN_ORDER[userPlan]||0) >= (PLAN_ORDER[reqPlan]||0); }
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{msg}</div>;
}
function Logo({ size=16 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
      <div style={{ width:size+8, height:size+8, background:"#106EBE", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4 }}>
        <svg viewBox="0 0 14 14" fill="none" width={size*0.7} height={size*0.7}>
          <rect x="1" y="1" width="5" height="5" stroke="#fff" strokeWidth="1.2"/>
          <rect x="8" y="1" width="5" height="5" stroke="#fff" strokeWidth="1.2" opacity=".5"/>
          <rect x="1" y="8" width="5" height="5" stroke="#fff" strokeWidth="1.2" opacity=".3"/>
          <rect x="8" y="8" width="5" height="5" stroke="#fff" strokeWidth="1.2" opacity=".15"/>
        </svg>
      </div>
      <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:size, fontWeight:700, letterSpacing:4, color:"#e5e5e5", textTransform:"uppercase" }}>ARCANE</span>
    </div>
  );
}
function PlanTag({ plan }) {
  const map = { free:"free", essencial:"essencial", starter:"essencial", profissional:"profissional", business:"profissional", gestao:"gestao", unlimited:"gestao" };
  const key = map[plan]||"free";
  const labels = { free:"Basico", essencial:"Essencial", profissional:"Profissional", gestao:"Gestao" };
  return <span className={`tag tag-${key}`}>{labels[key]||plan}</span>;
}
function readFileAsText(file) {
  return new Promise((resolve,reject) => { const r = new FileReader(); r.onload=e=>resolve(e.target.result); r.onerror=reject; r.readAsText(file,"UTF-8"); });
}
function calcSaved(history) {
  const mins = history.reduce((a,h)=>a+(TOOL_TIME[h.tool]||60),0);
  const hours = Math.round(mins/60*10)/10;
  return { hours, value: Math.round(hours*HOURLY_RATE) };
}

// ─── MODAL PERFIL ─────────────────────────────────────────────────────────────
function CompanyProfileModal({ userId, onComplete }) {
  const [form, setForm] = useState({ company_name:"", sector:"", company_size:"", tone:"Neutro e profissional", city:"" });
  const [loading, setLoading] = useState(false);
  const save = async () => {
    if (!form.company_name.trim()) return;
    setLoading(true);
    await supabase.from("profiles").update({ ...form, profile_complete:true }).eq("id", userId);
    setLoading(false);
    onComplete(form);
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ marginBottom:24 }}>
          <div className="lbl" style={{ marginBottom:8 }}>Bem-vindo ao Arcane</div>
          <div style={{ fontSize:20, fontWeight:400, color:"#e5e5e5", marginBottom:8 }}>Conte-nos sobre sua empresa</div>
          <p style={{ fontSize:13, color:"#52525b", lineHeight:1.7 }}>Essas informacoes personalizam todas as analises para o contexto do seu negocio. Voce so preenche uma vez.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div className="lbl" style={{ marginBottom:6 }}>Nome da empresa *</div>
            <input placeholder="Ex: Studio Criativo Ltda" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Setor</div>
              <select value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})}>
                <option value="">Selecione...</option>
                {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Tamanho</div>
              <select value={form.company_size} onChange={e=>setForm({...form,company_size:e.target.value})}>
                <option value="">Selecione...</option>
                {SIZES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Cidade</div>
              <input placeholder="Ex: Sao Paulo, SP" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
            </div>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Tom de comunicacao</div>
              <select value={form.tone} onChange={e=>setForm({...form,tone:e.target.value})}>
                {TONES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background:"rgba(16,110,190,0.06)", border:"1px solid rgba(16,110,190,0.15)", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#52525b" }}>
            💡 <strong style={{ color:"#a1a1aa" }}>Tom de comunicacao</strong> define como os textos serao redigidos em cada analise — formal para contratos, descontraido para redes sociais.
          </div>
          <button className="btn-p" onClick={save} disabled={loading||!form.company_name.trim()} style={{ height:44, fontSize:12, marginTop:4 }}>
            {loading?"SALVANDO...":"COMECAR A USAR O ARCANE →"}
          </button>
          <button onClick={()=>onComplete(null)} style={{ background:"transparent", color:"#3f3f46", fontSize:11, padding:"4px 0" }}>Pular por agora</button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ mode, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handle = async () => {
    setLoading(true); setError("");
    try {
      if (mode==="register") {
        const { data, error } = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{ name:form.name } } });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Verifique seu e-mail para confirmar o cadastro.");
        onSuccess({ email:data.user.email, name:form.name, plan:"free", id:data.user.id });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw new Error(error.message);
        const u = data.user;
        onSuccess({ email:u.email, name:u.user_metadata?.name||u.email, plan:u.user_metadata?.plan||"free", id:u.id });
      }
    } catch(e) { setError(e.message); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", background:C.bg }}>
      <style>{G}</style>
      <div style={{ width:"42%", background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 56px" }}>
        <Logo size={16}/>
        <div style={{ marginTop:56 }}>
          <div style={{ fontSize:9, color:C.hint, letterSpacing:"2.5px", textTransform:"uppercase", fontWeight:600, marginBottom:16 }}>Sistema de Gestao</div>
          <h2 style={{ fontSize:30, fontWeight:300, lineHeight:1.15, marginBottom:16, color:C.text }}>O departamento que<br />sua empresa <span style={{ color:C.accent }}>nao pode pagar</span></h2>
          <p style={{ color:C.hint, fontSize:13, lineHeight:1.8, marginBottom:32 }}>Juridico, financeiro, RH e marketing em um sistema. Para quem precisa operar como grande empresa pagando muito menos.</p>
          {["Diagnostico financeiro com upload de planilha","Revisao e geracao de contratos juridicos","RH, marketing e operacoes em um lugar","Funciona para MEI, autonomo e empresas ate 50 pessoas"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:C.accent, flexShrink:0 }}/>
              <span style={{ color:C.hint, fontSize:12 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:40, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9, color:C.hint2, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>Plano basico inclui</div>
          <div style={{ color:C.hint, fontSize:12 }}>10 analises/mes · Upload de arquivos · Sem cartao</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 56px" }}>
        <div style={{ width:"100%", maxWidth:360 }}>
          <h3 style={{ fontSize:22, fontWeight:500, marginBottom:6, color:C.text }}>{mode==="login"?"Acessar o sistema":"Criar conta"}</h3>
          <p style={{ color:C.hint, fontSize:13, marginBottom:28 }}>{mode==="login"?"Entre para continuar no Arcane":"Comece sem custo, sem cartao de credito"}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {mode==="register"&&<div><div style={{ fontSize:9, color:C.hint2, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>Nome</div><input placeholder="Seu nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
            <div><div style={{ fontSize:9, color:C.hint2, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>E-mail</div><input type="email" placeholder="seu@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div><div style={{ fontSize:9, color:C.hint2, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>Senha</div><input type="password" placeholder="Minimo 6 caracteres" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
            {error&&<div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", padding:"10px 14px", fontSize:12, color:"#fca5a5", borderRadius:6 }}>⚠ {error}</div>}
            <button className="btn-p" onClick={handle} disabled={loading} style={{ width:"100%", height:42, fontSize:12, marginTop:4 }}>{loading?"Aguarde...":mode==="login"?"ACESSAR O SISTEMA":"CRIAR CONTA GRATIS"}</button>
          </div>
          <div style={{ textAlign:"center", marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
            <span style={{ color:C.hint, fontSize:13 }}>{mode==="login"?"Nao tem conta? ":"Ja tem conta? "}</span>
            <span onClick={onSwitch} style={{ color:C.accent, cursor:"pointer", fontSize:13, fontWeight:500 }}>{mode==="login"?"Criar gratuitamente →":"Acessar →"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE EDITOR ──────────────────────────────────────────────────────────
function ProfileEditor({ userId, profile, onSave, setToast }) {
  const [form, setForm] = useState({ company_name:profile.company_name||"", sector:profile.sector||"", company_size:profile.company_size||"", tone:profile.tone||"Neutro e profissional", city:profile.city||"" });
  const [loading, setLoading] = useState(false);
  const save = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ ...form, profile_complete:true }).eq("id", userId);
    onSave(form); setToast("Perfil da empresa salvo!"); setLoading(false);
  };
  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:24 }}>
        <div className="lbl" style={{ marginBottom:4 }}>Minha Empresa</div>
        <div style={{ fontSize:18, fontWeight:400, color:"#e5e5e5", marginBottom:6 }}>Perfil da empresa</div>
        <p style={{ fontSize:13, color:"#52525b", lineHeight:1.7 }}>Esses dados personalizam todas as analises automaticamente. Voce nao precisa repetir o contexto em cada uso.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div><div className="lbl" style={{ marginBottom:6 }}>Nome da empresa</div><input placeholder="Ex: Studio Criativo Ltda" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})}/></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><div className="lbl" style={{ marginBottom:6 }}>Setor</div><select value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})}><option value="">Selecione...</option>{SECTORS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><div className="lbl" style={{ marginBottom:6 }}>Tamanho</div><select value={form.company_size} onChange={e=>setForm({...form,company_size:e.target.value})}><option value="">Selecione...</option>{SIZES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><div className="lbl" style={{ marginBottom:6 }}>Cidade</div><input placeholder="Ex: Sao Paulo, SP" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></div>
          <div><div className="lbl" style={{ marginBottom:6 }}>Tom de comunicacao</div><select value={form.tone} onChange={e=>setForm({...form,tone:e.target.value})}>{TONES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div style={{ background:"rgba(16,110,190,0.06)", border:"1px solid rgba(16,110,190,0.15)", borderRadius:8, padding:"12px 16px", fontSize:12, color:"#52525b", lineHeight:1.7 }}>
          💡 <strong style={{ color:"#a1a1aa" }}>Tom de comunicacao:</strong> Formal para contratos e relatorios. Descontraido para posts e comunicacao com clientes.
        </div>
        <button className="btn-p" onClick={save} disabled={loading} style={{ height:42, fontSize:12 }}>{loading?"SALVANDO...":"SALVAR PERFIL DA EMPRESA"}</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab]           = useState("home");
  const [modId, setModId]       = useState(null);
  const [tool, setTool]         = useState(null);
  const [input, setInput]       = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState("");
  const [history, setHistory]   = useState([]);
  const [selHist, setSelHist]   = useState(null);
  const [profile, setProfile]   = useState({ plan:user.plan||"free", generations_used:0 });
  const [drag, setDrag]         = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef();

  const mod   = MODULES.find(m=>m.id===modId);
  const plan  = PLANS.find(p=>p.id===(profile.plan||"free"))||PLANS[0];
  const used  = profile.generations_used||0;
  const limit = plan.limit;
  const pct   = limit>=99999?0:Math.min((used/limit)*100,100);
  const left  = limit>=99999?"inf":Math.max(limit-used,0);
  const saved = calcSaved(history);

  useEffect(()=>{ loadProfile(); loadHistory(); },[]);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id",user.id).single();
    if (data) { setProfile(data); if (!data.profile_complete) setShowModal(true); }
  };
  const loadHistory = async () => {
    const { data } = await supabase.from("generations").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(40);
    if (data) setHistory(data);
  };
  const getToken = async () => { const { data:{session} } = await supabase.auth.getSession(); return session?.access_token; };
  const buildCtx = () => {
    const p = profile;
    if (!p.company_name) return "";
    return `\n\n[CONTEXTO DA EMPRESA]\nEmpresa: ${p.company_name}${p.sector?`\nSetor: ${p.sector}`:""}${p.company_size?`\nPorte: ${p.company_size}`:""}${p.city?`\nCidade: ${p.city}`:""}${p.tone?`\nTom: ${p.tone}`:""}`;
  };

  const run = async () => {
    if (!tool) return;
    if (left!=="inf"&&left<=0) { setToast("Limite atingido. Faca upgrade!"); return; }
    if (!input.trim()&&!fileText) { setToast("Descreva o contexto ou envie um arquivo."); return; }
    setLoading(true); setResult("");
    try {
      const token = await getToken();
      const ctx = buildCtx();
      let res, data;
      if (fileText) {
        res = await fetch(BACKEND_URL+"/ai/analyze-file", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({file_text:fileText,context:input+ctx,tool:tool.id}) });
      } else {
        res = await fetch(BACKEND_URL+"/ai/generate", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({tool:tool.id,module:modId,input:input+ctx}) });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.error||"Erro ao processar");
      setResult(data.output||"");
      await supabase.from("generations").insert({ user_id:user.id, tool:tool.id, module:modId, input, result:data.output||"" });
      await supabase.from("profiles").update({ generations_used:used+1 }).eq("id",user.id);
      setProfile(p=>({...p,generations_used:p.generations_used+1}));
      await loadHistory();
    } catch(e) { setToast(e.message); }
    setLoading(false);
  };

  const handleFile = async (file) => {
    if (!file) return;
    try { const text = await readFileAsText(file); setFileText(text); setFileName(file.name); setToast(`Arquivo "${file.name}" carregado.`); }
    catch { setToast("Erro ao ler o arquivo. Use .txt, .csv ou .xlsx convertido."); }
  };
  const navTo = (t,m=null) => { setTab(t); setModId(m); setTool(null); setResult(""); setInput(""); setFileText(""); setFileName(""); };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <style>{G}</style>
      {showModal&&<CompanyProfileModal userId={user.id} onComplete={(d)=>{ setShowModal(false); if(d) setProfile(p=>({...p,...d,profile_complete:true})); }}/>}

      {/* SIDEBAR */}
      <div className="sidebar">
        <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${C.border}` }}><Logo size={13}/></div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          <div style={{ padding:"0 16px 5px", fontSize:9, color:C.hint2, letterSpacing:"2.5px", textTransform:"uppercase" }}>Principal</div>
          {[
            { id:"home", label:"Painel", icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="1" width="4.5" height="4.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/><rect x="1" y="7.5" width="4.5" height="4.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="7.5" width="4.5" height="4.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/></svg> },
            { id:"hist", label:"Historico", icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 3.5v3l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>, badge:history.length>0?history.length:null },
            { id:"plans", label:"Planos", icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5l2.5-2.5 2 2 3-4 2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>, dot:plan.id==="free" },
            { id:"perfil", label:"Minha Empresa", icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 11.5c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
          ].map(item=>(
            <div key={item.id} className={`nav-item ${tab===item.id&&!modId?"act":""}`} onClick={()=>navTo(item.id)}>
              {item.icon}<span style={{ flex:1 }}>{item.label}</span>
              {item.badge&&<span style={{ marginLeft:"auto", fontSize:9, background:"rgba(16,110,190,0.1)", color:C.accent, padding:"1px 6px", borderRadius:20 }}>{item.badge}</span>}
              {item.dot&&<span className="ndot" style={{ background:C.amber }}/>}
            </div>
          ))}
          <div style={{ padding:"12px 16px 5px", fontSize:9, color:C.hint2, letterSpacing:"2.5px", textTransform:"uppercase", marginTop:4 }}>Modulos</div>
          {MODULES.map(m=>(
            <div key={m.id} className={`nav-item ${modId===m.id?"act":""}`} onClick={()=>navTo("mod",m.id)} style={{ paddingLeft:14 }}>
              <span style={{ color:m.color, fontSize:12 }}>{m.icon}</span>
              <span style={{ flex:1, fontSize:11.5 }}>{m.label}</span>
              {!canUse(profile.plan,m.plan)&&<span style={{ fontSize:9 }}>🔒</span>}
            </div>
          ))}
        </div>
        <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9, color:C.hint2, letterSpacing:"2px", textTransform:"uppercase", marginBottom:4 }}>Plano {plan.name}</div>
          <div style={{ fontSize:11, color:C.hint, marginBottom:4 }}>{left==="inf"?"Ilimitado":`${left} de ${limit} restantes`}</div>
          <div style={{ height:2, background:"rgba(255,255,255,0.06)", borderRadius:1, overflow:"hidden", marginBottom:10 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:C.accent, borderRadius:1, transition:"width 0.5s" }}/>
          </div>
          {plan.id!=="gestao"&&<div onClick={()=>navTo("plans")} style={{ fontSize:11, color:C.accent, cursor:"pointer", marginBottom:8 }}>Fazer upgrade →</div>}
          <button onClick={onLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:7, padding:"8px 10px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.14)", borderRadius:6, color:"#f87171", fontSize:11, fontWeight:500 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 5.5H1M4.5 8L1 5.5 4.5 3M7 1h2a1 1 0 011 1v7a1 1 0 01-1 1H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            Sair da conta
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{tab==="hist"?"Historico":tab==="plans"?"Planos":tab==="perfil"?"Minha Empresa":modId?mod?.label:"Painel de Controle"}</div>
            <div style={{ fontSize:10, color:C.hint2 }}>{tab==="hist"?"Suas analises recentes":tab==="plans"?"Gerencie seu plano":tab==="perfil"?"Dados da sua empresa":modId?mod?.desc:"Situacao do seu negocio"}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:"1px solid rgba(15,252,190,0.14)", borderRadius:4 }}>
              <div className="s-dot"/><span style={{ fontSize:9, color:"rgba(15,252,190,0.7)", letterSpacing:"1.5px", fontWeight:600 }}>OPERACIONAL</span>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, color:C.muted }}>{profile.company_name||user.name||user.email}</div>
              <div style={{ fontSize:9, color:C.accent, letterSpacing:1, textTransform:"uppercase" }}>{plan.name}</div>
            </div>
            <div style={{ width:30, height:30, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", borderRadius:6 }}>
              {(user.name||user.email||"U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding:24 }}>

          {/* HOME */}
          {tab==="home"&&(
            <>
              <div className="card" style={{ padding:22, marginBottom:16, position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(16,110,190,0.4),transparent)" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                  <div>
                    <div className="lbl" style={{ marginBottom:5 }}>Centro de Comando</div>
                    <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{profile.company_name?`${profile.company_name} — situacao hoje`:"Situacao do seu negocio hoje"}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:"1px solid rgba(15,252,190,0.14)", borderRadius:4 }}>
                    <div className="s-dot"/><span style={{ fontSize:9, color:"rgba(15,252,190,0.7)", letterSpacing:"1.5px" }}>SISTEMA ATIVO</span>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:0 }}>
                  {[
                    { lbl:"Analises este mes", val:used, color:C.accent },
                    { lbl:"Restantes no plano", val:left==="inf"?"Ilim.":left, color:C.text },
                    { lbl:"Horas economizadas", val:`${saved.hours}h`, color:"#0FFCBE" },
                    { lbl:"Valor economizado", val:`R$${saved.value}`, color:"#22c55e" },
                  ].map((item,i)=>(
                    <div key={i} style={{ padding:"0 20px", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
                      <div className="lbl" style={{ marginBottom:7 }}>{item.lbl}</div>
                      <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:22, fontWeight:700, color:item.color, letterSpacing:"-1px" }}>{item.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                  {saved.hours>0?(
                    <div className="opp-strip">
                      <span>✓</span>
                      <div style={{ fontSize:12, color:"#a1a1aa" }}>Voce economizou <strong style={{ color:"#0FFCBE" }}>{saved.hours}h</strong> de trabalho manual esse mes, equivalente a <strong style={{ color:"#22c55e" }}>R$ {saved.value}</strong> em horas profissionais.</div>
                    </div>
                  ):(
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:11, color:C.hint }}>Acoes rapidas:</span>
                      {[{l:"Analisar planilha",m:"diagnostico_financeiro",t:"analisar_planilha"},{l:"Revisar contrato",m:"juridico",t:"revisar_contrato"},{l:"Posts para redes",m:"marketing",t:"post_redes_sociais"}].map((a,i)=>(
                        <button key={i} className="btn-g" style={{ height:30, fontSize:10 }} onClick={()=>{ if(!canUse(profile.plan,MODULES.find(m=>m.id===a.m)?.plan||"free")){setToast("Esta funcionalidade requer upgrade.");navTo("plans");return;} setModId(a.m);setTool(MODULES.find(m=>m.id===a.m)?.tools.find(t=>t.id===a.t));setTab("mod"); }}>{a.l}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {history.length>0&&(
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div className="lbl">Analises recentes</div>
                    <span onClick={()=>navTo("hist")} style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>Ver todas →</span>
                  </div>
                  {history.slice(0,3).map(h=>(
                    <div key={h.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:C.radiusMd, cursor:"pointer", marginBottom:6 }} onClick={()=>{ setSelHist(h); navTo("hist"); }}>
                      <div style={{ width:4, height:4, borderRadius:"50%", background:C.accent, flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{h.tool?.replace(/_/g," ")}</span>
                        {h.module&&<span style={{ fontSize:10, color:C.hint, marginLeft:8 }}>— {h.module?.replace(/_/g," ")}</span>}
                      </div>
                      <span style={{ fontSize:10, color:"#0FFCBE" }}>+{Math.round((TOOL_TIME[h.tool]||60)/60*10)/10}h</span>
                      <span style={{ fontSize:10, color:C.hint2 }}>{h.created_at?new Date(h.created_at).toLocaleDateString("pt-BR"):""}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="lbl" style={{ marginBottom:10 }}>Modulos do Sistema</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {MODULES.map(m=>{ const locked=!canUse(profile.plan,m.plan); return (
                  <div key={m.id} className="mod-card" onClick={()=>{ if(locked){setToast(`Requer plano ${m.plan}.`);navTo("plans");return;} navTo("mod",m.id); }} style={{ opacity:locked?0.65:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div style={{ width:32, height:32, border:`1px solid rgba(255,255,255,0.08)`, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, fontSize:16 }}><span style={{ color:m.color }}>{m.icon}</span></div>
                      <div style={{ display:"flex", gap:5, alignItems:"center" }}><PlanTag plan={m.plan}/>{locked&&<span style={{ fontSize:10 }}>🔒</span>}</div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:5 }}>{m.label}</div>
                    <div style={{ fontSize:12, color:C.hint, lineHeight:1.5, marginBottom:12 }}>{m.desc}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {m.tools.slice(0,3).map(t=>(
                        <div key={t.id} style={{ fontSize:12, color:C.hint2, padding:"4px 0", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ color:m.color, fontSize:8 }}>▶</span>{t.name}</div>
                          <span style={{ fontSize:10, color:"#0FFCBE" }}>~{Math.round((TOOL_TIME[t.id]||60)/60*10)/10}h</span>
                        </div>
                      ))}
                    </div>
                    {m.tools.length>3&&<div style={{ fontSize:11, color:C.accent, marginTop:8 }}>+{m.tools.length-3} funcoes</div>}
                  </div>
                ); })}
              </div>
            </>
          )}

          {/* HISTORICO */}
          {tab==="hist"&&(
            <>
              <div style={{ marginBottom:20 }}>
                <div className="lbl" style={{ marginBottom:4 }}>Historico de Analises</div>
                <div style={{ fontSize:18, fontWeight:400, color:C.text }}>{history.length} analises registradas</div>
                {saved.hours>0&&<div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", background:"rgba(15,252,190,0.06)", border:"1px solid rgba(15,252,190,0.15)", borderRadius:20 }}>
                  <span style={{ fontSize:12, color:"#0FFCBE", fontWeight:600 }}>✓ {saved.hours}h economizadas · R$ {saved.value} em valor profissional</span>
                </div>}
              </div>
              {history.length===0?(
                <div style={{ textAlign:"center", padding:"60px 0", color:C.hint2 }}><div style={{ fontSize:28, marginBottom:10 }}>◷</div><p style={{ fontSize:13 }}>Nenhuma analise ainda.</p></div>
              ):(
                <div style={{ display:"grid", gridTemplateColumns:selHist?"1fr 1fr":"1fr", gap:16, alignItems:"start" }}>
                  <div>
                    {history.map(h=>(
                      <div key={h.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:C.card, border:`1px solid ${selHist?.id===h.id?C.accent:C.border}`, borderRadius:C.radiusMd, cursor:"pointer", marginBottom:6, transition:"border-color 0.15s" }} onClick={()=>setSelHist(selHist?.id===h.id?null:h)}>
                        <div style={{ width:4, height:4, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:5 }}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{h.tool?.replace(/_/g," ")}</span>
                            <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                              <span style={{ fontSize:10, color:"#0FFCBE" }}>+{Math.round((TOOL_TIME[h.tool]||60)/60*10)/10}h</span>
                              <span style={{ fontSize:10, color:C.hint2 }}>{h.created_at?new Date(h.created_at).toLocaleDateString("pt-BR"):""}</span>
                            </div>
                          </div>
                          <div style={{ fontSize:11, color:C.hint, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.input}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selHist&&(
                    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:C.radiusMd, padding:18, position:"sticky", top:70 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{selHist.tool?.replace(/_/g," ")}</div>
                        <button onClick={()=>{navigator.clipboard.writeText(selHist.result);setToast("Copiado!");}} style={{ background:"transparent", color:C.accent, fontSize:10, padding:0 }}>COPIAR</button>
                      </div>
                      <div style={{ fontSize:11, color:C.hint, fontStyle:"italic", marginBottom:10 }}>{selHist.input}</div>
                      <div style={{ fontSize:12, color:C.muted, lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:420, overflowY:"auto" }}>{selHist.result}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tab==="perfil"&&<ProfileEditor userId={user.id} profile={profile} onSave={(d)=>setProfile(p=>({...p,...d}))} setToast={setToast}/>}

          {/* PLANOS */}
          {tab==="plans"&&(
            <>
              <div style={{ marginBottom:24 }}>
                <div className="lbl" style={{ marginBottom:4 }}>Planos</div>
                <div style={{ fontSize:18, fontWeight:400, color:C.text, marginBottom:6 }}>Gerencie seu plano</div>
                <p style={{ color:C.hint, fontSize:13 }}>Voce esta no plano <span style={{ color:C.accent, fontWeight:500 }}>{plan.name}</span>.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {PLANS.map(p=>(
                  <div key={p.id} style={{ background:p.highlight?"rgba(16,110,190,0.06)":C.card, border:`1.5px solid ${p.id===profile.plan?C.accent:p.highlight?"rgba(16,110,190,0.3)":C.border}`, borderRadius:C.radiusMd, padding:20, position:"relative", boxShadow:p.highlight?"0 0 28px rgba(16,110,190,0.1)":"none" }}>
                    {p.highlight&&<div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#fff", fontSize:8, fontWeight:700, padding:"2px 12px", letterSpacing:2, borderRadius:20, whiteSpace:"nowrap" }}>MAIS ESCOLHIDO</div>}
                    {p.id===profile.plan&&<div style={{ position:"absolute", top:10, right:10, fontSize:8, color:C.accent, fontWeight:700, letterSpacing:1 }}>ATUAL</div>}
                    <div style={{ fontSize:10, fontWeight:600, color:C.text, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{p.name}</div>
                    <div style={{ marginBottom:4 }}><span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:22, fontWeight:700, color:p.highlight?C.accent:C.text }}>{p.price}</span><span style={{ color:C.hint, fontSize:11 }}>{p.period}</span></div>
                    <div style={{ height:1, background:C.border, margin:"14px 0" }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:18 }}>
                      {p.features.map((f,i)=><div key={i} style={{ display:"flex", gap:7, fontSize:11, color:C.hint }}><span style={{ color:C.accentB, flexShrink:0 }}>✓</span>{f}</div>)}
                    </div>
                    <button onClick={()=>{ if(p.id==="free")return; window.open(MP_LINKS[p.id],"_blank"); }} disabled={p.id===profile.plan} className={p.highlight?"btn-p":"btn-g"} style={{ width:"100%", height:36, fontSize:10, letterSpacing:1 }}>{p.id===profile.plan?"PLANO ATUAL":p.id==="free"?"GRATIS":"ASSINAR"}</button>
                    {p.id!=="free"&&p.id!==profile.plan&&<div style={{ textAlign:"center", marginTop:7, fontSize:9, color:C.hint2 }}>PIX · Cartao · Boleto</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MODULO */}
          {tab==="mod"&&modId&&!tool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <button onClick={()=>navTo("home")} style={{ background:"transparent", color:C.hint, fontSize:11, padding:0 }}>← Painel</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.hint, textTransform:"uppercase", letterSpacing:1 }}>{mod?.label}</span>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:18, fontWeight:400, color:C.text, marginBottom:4 }}>{mod?.label}</div>
                <p style={{ color:C.hint, fontSize:13 }}>{mod?.desc}</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {mod?.tools.map(t=>{ const locked=!canUse(profile.plan,mod.plan); return (
                  <div key={t.id} className="tool-row" onClick={()=>{ if(locked){setToast(`Requer plano ${mod.plan.toUpperCase()}.`);navTo("plans");return;} setTool(t); }} style={{ opacity:locked?0.6:1 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:3 }}>{t.name}</div>
                      <div style={{ fontSize:12, color:C.hint }}>{t.desc}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:11, color:"#0FFCBE" }}>~{Math.round((TOOL_TIME[t.id]||60)/60*10)/10}h ec.</span>
                      {t.upload&&<span style={{ fontSize:9, background:"rgba(15,252,190,0.08)", color:C.accentB, padding:"2px 7px", borderRadius:4, fontWeight:600 }}>UPLOAD</span>}
                      {locked?<span style={{ fontSize:11 }}>🔒</span>:<span style={{ fontSize:11, color:C.hint2 }}>→</span>}
                    </div>
                  </div>
                ); })}
              </div>
            </>
          )}

          {/* FERRAMENTA */}
          {tab==="mod"&&modId&&tool&&(
            <>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <button onClick={()=>setTool(null)} style={{ background:"transparent", color:C.hint, fontSize:11, padding:0 }}>← {mod?.label}</button>
                <span style={{ color:C.border }}>|</span>
                <span style={{ fontSize:11, color:C.hint, textTransform:"uppercase", letterSpacing:1 }}>{tool.name}</span>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:17, fontWeight:400, color:C.text, marginBottom:4 }}>{tool.name}</div>
                <p style={{ color:C.hint, fontSize:13 }}>{tool.desc}</p>
                {profile.company_name&&<div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", background:"rgba(16,110,190,0.06)", border:"1px solid rgba(16,110,190,0.15)", borderRadius:20, fontSize:11, color:C.accent }}>✓ Personalizado para {profile.company_name}</div>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div>
                  {tool.upload&&(
                    <div style={{ marginBottom:14 }}>
                      <div className="lbl" style={{ marginBottom:8 }}>Arquivo (opcional)</div>
                      <div className={`upload-zone${drag?" drag":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept=".txt,.csv,.xlsx,.xls,.pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
                        {fileName?(<div><div style={{ fontSize:13, color:C.accentB, fontWeight:500, marginBottom:4 }}>✓ {fileName}</div><div style={{ fontSize:11, color:C.hint }}>Clique para trocar</div><button onClick={e=>{e.stopPropagation();setFileText("");setFileName("");}} style={{ marginTop:8, background:"transparent", color:C.red, fontSize:10, padding:0 }}>Remover</button></div>):(<div><div style={{ fontSize:13, color:C.hint, marginBottom:6 }}>Arraste o arquivo ou clique para selecionar</div><div style={{ fontSize:11, color:C.hint2 }}>Suporta: .txt, .csv, .xlsx, .pdf</div></div>)}
                      </div>
                    </div>
                  )}
                  <div className="lbl" style={{ marginBottom:8 }}>{tool.upload?"Contexto adicional":"Descreva o cenario"}</div>
                  <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tool.upload?"Descreva o contexto do arquivo: tipo de negocio, periodo, principais duvidas...":"Descreva com detalhes a situacao. Quanto mais contexto, mais precisa sera a analise."} rows={tool.upload?5:10} style={{ resize:"vertical" }}/>
                  <button className="btn-p" onClick={run} disabled={loading||(!input.trim()&&!fileText)} style={{ marginTop:12, width:"100%", height:42, fontSize:11 }}>{loading?"PROCESSANDO...":"EXECUTAR ANALISE"}</button>
                  {loading&&<div style={{ marginTop:10, fontSize:11, color:C.hint, display:"flex", alignItems:"center", gap:8 }}><div style={{ animation:"pulse 1.2s ease infinite", color:C.accent, fontSize:14 }}>▶</div>Analisando...</div>}
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div className="lbl">Resultado da Analise</div>
                    {result&&<button onClick={()=>{navigator.clipboard.writeText(result);setToast("Copiado!");}} style={{ background:"transparent", color:C.accent, fontSize:10, padding:0, letterSpacing:1 }}>COPIAR</button>}
                  </div>
                  <div className="result-box">{result||<span style={{ color:C.hint2, fontSize:12 }}>O resultado aparecera aqui. Descreva o cenario e clique em Executar.</span>}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {toast&&<Toast msg={toast} onClose={()=>setToast("")}/>}
    </div>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onLogin, onRegister }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ hours:0, value:0, users:0 });
  useScrollReveal();

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const load = async () => {
      const { data } = await supabase.from("generations").select("tool, user_id");
      if (data&&data.length>0) {
        const mins = data.reduce((a,g)=>a+(TOOL_TIME[g.tool]||60),0);
        const hours = Math.round(mins/60);
        setStats({ hours, value:Math.round(hours*HOURLY_RATE), users:new Set(data.map(g=>g.user_id)).size });
      }
    };
    load();
  },[]);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", overflowX:"hidden" }}>
      <style>{G}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 44px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(8,8,16,0.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all 0.3s" }}>
        <Logo size={15}/>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {["Como Funciona","Modulos","Planos","FAQ"].map(item=>(
            <a key={item} href={`#${item.toLowerCase().replace(" ","-")}`} style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".08em", color:C.hint2, padding:"5px 12px", textDecoration:"none", borderRadius:5, transition:"all 0.2s" }} onMouseEnter={e=>{e.target.style.color=C.text;e.target.style.background="rgba(255,255,255,0.04)"}} onMouseLeave={e=>{e.target.style.color=C.hint2;e.target.style.background="transparent"}}>{item}</a>
          ))}
          <div style={{ width:1, height:16, background:C.border, margin:"0 8px" }}/>
          <button className="btn-g" onClick={onLogin} style={{ height:34, padding:"0 16px", fontSize:10 }}>Entrar</button>
          <button className="btn-p" onClick={onRegister} style={{ height:34, padding:"0 16px", fontSize:10 }}>Comecar gratis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:56 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.3, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle,rgba(16,110,190,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 44px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:780 }}>
            <div className="anim-fi" style={{ animationDelay:"0.1s", display:"inline-block", fontSize:9, color:C.hint, letterSpacing:"2.5px", textTransform:"uppercase", fontWeight:600, marginBottom:18, padding:"4px 14px", border:`1px solid ${C.border}`, borderRadius:20 }}>Sistema de Gestao para Empresas e Autonomos</div>
            <h1 className="anim-up" style={{ fontSize:"clamp(36px,5.5vw,70px)", fontWeight:300, lineHeight:0.95, textTransform:"uppercase", letterSpacing:"-0.02em", marginBottom:24, animationDelay:"0.2s", color:C.text }}>
              O departamento<br />que sua empresa<br /><span style={{ color:C.accent, fontWeight:500 }}>nao pode contratar</span>
            </h1>
            <p className="anim-up" style={{ color:C.hint, fontSize:16, lineHeight:1.8, marginBottom:36, maxWidth:500, animationDelay:"0.35s" }}>
              Juridico, financeiro, RH e marketing em um sistema. Faca upload da sua planilha, envie seu contrato — o Arcane le, diagnostica e diz exatamente o que fazer.
            </p>
            <div className="anim-up" style={{ display:"flex", gap:12, animationDelay:"0.5s" }}>
              <button className="btn-p" onClick={onRegister} style={{ height:46, padding:"0 32px", fontSize:11 }}>Comecar sem custo</button>
              <button className="btn-g" onClick={onLogin} style={{ height:46, padding:"0 32px", fontSize:11 }}>Ja tenho conta</button>
            </div>
            <div className="anim-up" style={{ display:"flex", gap:40, marginTop:56, animationDelay:"0.65s" }}>
              {[{n:"6",l:"Modulos especializados"},{n:"Upload",l:"Planilhas e contratos"},{n:"< 30s",l:"Por diagnostico"}].map(s=>(
                <div key={s.n}><div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:26, fontWeight:700, color:C.accent, letterSpacing:"-1px" }}>{s.n}</div><div style={{ fontSize:10, color:C.hint2, marginTop:3, letterSpacing:"1px", textTransform:"uppercase" }}>{s.l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTADOR GLOBAL */}
      {stats.hours>0&&(
        <section style={{ padding:"36px 44px", background:"rgba(16,110,190,0.04)", borderTop:`1px solid rgba(16,110,190,0.1)`, borderBottom:`1px solid rgba(16,110,190,0.1)` }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:60, flexWrap:"wrap" }}>
            {[
              { lbl:"Horas economizadas pelos nossos clientes", val:`${stats.hours}h`, color:"#0FFCBE" },
              { lbl:"Em valor de trabalho profissional", val:`R$ ${stats.value.toLocaleString("pt-BR")}`, color:"#22c55e" },
              { lbl:"Empresas usando o Arcane", val:String(stats.users), color:C.accent },
            ].map((s,i)=>(
              <React.Fragment key={i}>
                {i>0&&<div style={{ width:1, height:50, background:C.border }}/>}
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:9, color:C.hint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>{s.lbl}</div>
                  <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:36, fontWeight:700, color:s.color }}>{s.val}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding:"90px 44px", background:C.surface, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(16,110,190,0.3),transparent)" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="lbl reveal" style={{ marginBottom:12 }}>Como Funciona</div>
            <h2 className="reveal" style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:10 }}>Operacional desde<br /><span style={{ color:C.accent }}>o primeiro acesso</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { n:"01", t:"Acesse o sistema",      d:"Cadastro em menos de 2 minutos. Sem cartao." },
              { n:"02", t:"Configure sua empresa", d:"Nome, setor e tom de comunicacao. So uma vez." },
              { n:"03", t:"Envie seus dados",      d:"Planilha, contrato ou descricao da situacao." },
              { n:"04", t:"Receba o diagnostico",  d:"Analise completa com acoes concretas em segundos." },
            ].map((s,i)=>(
              <div key={i} className="reveal card" style={{ padding:22, transitionDelay:`${i*0.1}s` }}>
                <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:22, fontWeight:700, color:"rgba(16,110,190,0.15)", marginBottom:12 }}>{s.n}</div>
                <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:7 }}>{s.t}</div>
                <div style={{ fontSize:12, color:C.hint, lineHeight:1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section id="modulos" style={{ padding:"90px 44px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:48 }}>
            <div className="lbl reveal" style={{ marginBottom:10 }}>Modulos</div>
            <h2 className="reveal" style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Todas as areas<br /><span style={{ color:C.accent }}>do seu negocio</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {MODULES.map((m,i)=>(
              <div key={m.id} className="reveal mod-card" style={{ transitionDelay:`${i*0.07}s` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{ color:m.color, fontSize:20 }}>{m.icon}</span>
                  <PlanTag plan={m.plan}/>
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>{m.label}</div>
                <div style={{ fontSize:12, color:C.hint, marginBottom:14, lineHeight:1.55 }}>{m.desc}</div>
                {m.tools.slice(0,3).map(t=>(
                  <div key={t.id} style={{ fontSize:12, color:C.hint2, padding:"6px 0", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}><span style={{ color:m.color, fontSize:8 }}>▶</span>{t.name}</div>
                    <span style={{ fontSize:10, color:"#0FFCBE" }}>~{Math.round((TOOL_TIME[t.id]||60)/60*10)/10}h</span>
                  </div>
                ))}
                {m.tools.length>3&&<div style={{ fontSize:11, color:C.accent, marginTop:8 }}>+{m.tools.length-3} funcoes</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding:"90px 44px", background:C.surface }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="lbl reveal" style={{ marginBottom:10 }}>Planos</div>
            <h2 className="reveal" style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text }}>Menos que um salario,<br /><span style={{ color:C.accent }}>mais que um departamento</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {PLANS.map((p,i)=>(
              <div key={p.id} className="reveal" style={{ background:p.highlight?"rgba(16,110,190,0.05)":C.card, border:`1.5px solid ${p.highlight?"rgba(16,110,190,0.3)":C.border}`, borderRadius:C.radiusLg, padding:22, position:"relative", transitionDelay:`${i*0.1}s`, boxShadow:p.highlight?"0 0 32px rgba(16,110,190,0.1)":"none" }}>
                {p.highlight&&<div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#fff", fontSize:8, fontWeight:700, padding:"2px 12px", letterSpacing:2, borderRadius:20, whiteSpace:"nowrap" }}>MAIS ESCOLHIDO</div>}
                <div style={{ fontSize:10, fontWeight:600, color:C.text, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{p.name}</div>
                <div style={{ marginBottom:4 }}><span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:24, fontWeight:700, color:p.highlight?C.accent:C.text }}>{p.price}</span><span style={{ color:C.hint, fontSize:11 }}>{p.period}</span></div>
                <div style={{ height:1, background:C.border, margin:"14px 0" }}/>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>{p.features.map((f,fi)=><div key={fi} style={{ display:"flex", gap:7, fontSize:11, color:C.hint }}><span style={{ color:C.accentB, flexShrink:0 }}>✓</span>{f}</div>)}</div>
                <button onClick={()=>{ if(p.id==="free"){onRegister();}else{window.open(MP_LINKS[p.id],"_blank");} }} className={p.highlight?"btn-p":"btn-g"} style={{ width:"100%", height:36, fontSize:10, letterSpacing:1 }}>{p.id==="free"?"COMECAR GRATIS":"ASSINAR AGORA"}</button>
                {p.id!=="free"&&<div style={{ textAlign:"center", marginTop:7, fontSize:9, color:C.hint2 }}>PIX · Cartao · Boleto</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding:"90px 44px" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div className="lbl reveal" style={{ marginBottom:10 }}>FAQ</div>
          <h2 className="reveal" style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:36 }}>Perguntas <span style={{ color:C.accent }}>frequentes</span></h2>
          {FAQS.map((faq,i)=>(
            <div key={i} className="reveal" style={{ border:`1px solid ${openFaq===i?"rgba(16,110,190,0.25)":C.border}`, background:openFaq===i?"rgba(16,110,190,0.04)":"transparent", borderRadius:C.radiusMd, transition:"all 0.2s", marginBottom:3 }}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"transparent", color:C.text, fontSize:13, textAlign:"left" }}>
                {faq.q}<span style={{ color:C.accent, fontSize:18, flexShrink:0, marginLeft:14 }}>{openFaq===i?"−":"+"}</span>
              </button>
              {openFaq===i&&<div style={{ padding:"0 20px 16px", color:C.hint, fontSize:13, lineHeight:1.8 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"90px 44px", background:C.surface, textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:0.2, pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 className="reveal" style={{ fontSize:"clamp(26px,4vw,48px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"-0.02em", color:C.text, marginBottom:16 }}>Sua empresa merece<br /><span style={{ color:C.accent }}>operar em outro nivel</span></h2>
          <p className="reveal" style={{ color:C.hint, fontSize:14, marginBottom:28 }}>Sem cartao de credito. Cancele quando quiser.</p>
          <button className="btn-p reveal" onClick={onRegister} style={{ height:46, padding:"0 36px", fontSize:11 }}>CRIAR CONTA SEM CUSTO</button>
        </div>
      </section>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px 44px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo size={13}/>
        <div style={{ fontSize:10, color:C.hint2 }}>© 2026 Arcane · LGPD Compliant</div>
        <div style={{ fontSize:10, color:C.hint2 }}>Feito para empresas brasileiras</div>
      </footer>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({ data:{ session } })=>{
      if (session?.user) { const u=session.user; setUser({ email:u.email, name:u.user_metadata?.name||u.email, plan:u.user_metadata?.plan||"free", id:u.id }); setPage("app"); }
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_e,session)=>{
      if (session?.user) { const u=session.user; setUser({ email:u.email, name:u.user_metadata?.name||u.email, plan:u.user_metadata?.plan||"free", id:u.id }); setPage("app"); }
      else { setUser(null); setPage("landing"); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (page==="app"&&user)    return <Dashboard user={user} onLogout={handleLogout}/>;
  if (page==="login")        return <AuthPage mode="login"    onSuccess={u=>{setUser(u);setPage("app");}} onSwitch={()=>setPage("register")}/>;
  if (page==="register")     return <AuthPage mode="register" onSuccess={u=>{setUser(u);setPage("app");}} onSwitch={()=>setPage("login")}/>;
  return <Landing onLogin={()=>setPage("login")} onRegister={()=>setPage("register")}/>;
}
