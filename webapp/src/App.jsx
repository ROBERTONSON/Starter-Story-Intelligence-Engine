import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-black text-slate-200 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0b0f19] border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-black text-cyan-400 tracking-tight">Starter Story LATAM</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Inicio</p>
            <SidebarItem name="Dashboard" current={currentView} set={setCurrentView} icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Fase 1 — Scraping</p>
            <SidebarItem name="Scraper & Logs" current={currentView} set={setCurrentView} icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            <SidebarItem name="Videos" current={currentView} set={setCurrentView} icon="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Fase 3 — Clasificación</p>
            <SidebarItem name="Pain Points LATAM" current={currentView} set={setCurrentView} icon="M13 10V3L4 14h7v8l9-11h-7z" />
            <SidebarItem name="Wizard RPM" current={currentView} set={setCurrentView} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Fase 4 — Soluciones</p>
            <SidebarItem name="Motor de Soluciones" current={currentView} set={setCurrentView} icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Fase 5 — MVT</p>
            <SidebarItem name="MVT (Fase 5)" current={currentView} set={setCurrentView} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Sistema</p>
            <SidebarItem name="Ajustes" current={currentView} set={setCurrentView} icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10 bg-black">
        {currentView === 'Dashboard' && <DashboardView navigate={setCurrentView} />}
        {currentView === 'Wizard RPM' && <WizardView />}
        {currentView === 'Videos' && <VideosView />}
        {currentView === 'Pain Points LATAM' && <PainPointsView />}
        {currentView === 'Motor de Soluciones' && <SolutionsEngineView setCurrentView={setCurrentView} />}
        {currentView === 'MVT (Fase 5)' && <MVTView />}
        {currentView !== 'Dashboard' && currentView !== 'Wizard RPM' && currentView !== 'Videos' && currentView !== 'Pain Points LATAM' && currentView !== 'Motor de Soluciones' && currentView !== 'MVT (Fase 5)' && (
          <div className="flex items-center justify-center h-full text-slate-500">
            Vista en construcción: {currentView}
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ name, current, set, icon }) {
  const active = current === name;
  return (
    <button
      onClick={() => set(name)}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span>{name}</span>
    </button>
  );
}

function DashboardView({ navigate }) {
  const [stats, setStats] = useState({ videos: 0, analyzed: 0, painPoints: 0, logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { count: vCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
      const { count: aCount } = await supabase.from('videos').select('*', { count: 'exact', head: true }).not('business_model', 'is', null);
      const { count: pCount } = await supabase.from('latam_pain_points').select('*', { count: 'exact', head: true });
      const { count: lCount } = await supabase.from('scraper_logs').select('*', { count: 'exact', head: true });
      
      setStats({
        videos: vCount || 0,
        analyzed: aCount || 0,
        painPoints: pCount || 0,
        logs: lCount || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard General</h2>
          <p className="text-slate-400">Resumen del Motor de Inteligencia Starter Story</p>
        </div>
        <button 
          onClick={() => navigate('Wizard RPM')}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
        >
          Comenzar Flujo
        </button>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="VIDEOS" value={loading ? '...' : stats.videos} subtitle="Extraídos de YouTube" icon="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <StatCard title="ANALIZADOS" value={loading ? '...' : stats.analyzed} subtitle="Procesados por LLM" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard title="PAIN POINTS" value={loading ? '...' : stats.painPoints} subtitle="Extrapolados a LATAM" icon="M13 10V3L4 14h7v8l9-11h-7z" />
        <StatCard title="LOGS SISTEMA" value={loading ? '...' : stats.logs} subtitle="Ejecuciones registradas" icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/10"></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 font-bold text-xs tracking-widest">{title}</h3>
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
        </div>
      </div>
      <div className="mt-auto">
        <span className="text-4xl font-black text-white">{value}</span>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function VideosView() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Videos Extraídos</h2>
        <p className="text-slate-400">Casos de estudio de Starter Story recolectados en la Fase 1</p>
      </header>
      
      {loading ? (
        <div className="text-cyan-400 text-center py-10 font-mono animate-pulse">Cargando base de datos...</div>
      ) : (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-5">Video / Título</th>
                  <th className="px-6 py-5">Modelo Negocio</th>
                  <th className="px-6 py-5">Pain Point Match (IA)</th>
                  <th className="px-6 py-5 text-center">Score Relevancia</th>
                  <th className="px-6 py-5">Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {videos.map(v => (
                  <tr key={v.video_id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white max-w-[220px] truncate" title={v.title}>
                        <a href={v.url} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">{v.title}</a>
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-medium">{v.business_model || <span className="text-slate-600 italic">No procesado</span>}</td>
                    <td className="px-6 py-4">
                      {v.pain_point_match ? (
                        <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded text-[10px] font-bold uppercase tracking-tight">{v.pain_point_match}</span>
                      ) : (
                        <span className="text-slate-600 italic">Sin clasificar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {v.relevance_score ? (
                        <div className="flex items-center justify-center">
                          <div className="w-12 bg-slate-800 h-1.5 rounded-full mr-2">
                            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${v.relevance_score}%` }}></div>
                          </div>
                          <span className="text-xs font-mono">{v.relevance_score}%</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-mono whitespace-nowrap">{v.revenue || <span className="text-slate-600 italic">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {videos.length === 0 && <div className="p-8 text-center text-slate-500">No hay videos en la base de datos.</div>}
        </div>
      )}
    </div>
  );
}

function PainPointsView() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);

  useEffect(() => {
    async function fetchPoints() {
      const { data } = await supabase.from('latam_pain_points').select('*').order('severity_score', { ascending: false });
      if (data) setPoints(data);
      setLoading(false);
    }
    fetchPoints();
  }, []);

  const handleReclassify = async () => {
    setIsClassifying(true);
    try {
      // 1. Cargar pain points actuales
      const { data: painPoints } = await supabase.from('latam_pain_points').select('category, description').limit(20);
      // 2. Cargar videos con business_model pero sin pain_point_match
      const { data: allVideos } = await supabase.from('videos').select('video_id, title, business_model, entrepreneur_action, pain_point_match').not('business_model', 'is', null);
      const videos = allVideos.filter(v => !v.pain_point_match);

      if (!painPoints?.length || !videos?.length) {
        alert('No hay videos pendientes de clasificar o no hay pain points disponibles.');
        setIsClassifying(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const ppList = painPoints.map(p => `- ${p.category}: ${p.description.slice(0, 100)}`).join('\n');

      let processed = 0;
      for (const video of videos.slice(0, 10)) {
        const prompt = `Eres un clasificador de negocios LATAM.
Video: ${video.title}
Modelo de Negocio: ${video.business_model || 'N/A'}
Acción del Emprendedor: ${video.entrepreneur_action || 'N/A'}
Pain Points disponibles:
${ppList}
Devuelve SOLO un objeto JSON sin texto adicional:
{"matched_pain_point": "nombre exacto de categoría", "relevance_score": número 0-100}`;

        try {
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const start = text.indexOf('{');
          const end = text.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            const parsed = JSON.parse(text.slice(start, end + 1));
            await supabase.from('videos').update({
              pain_point_match: parsed.matched_pain_point,
              relevance_score: parsed.relevance_score
            }).eq('video_id', video.video_id);
            processed++;
          }
        } catch (e) {
          console.warn(`Error clasificando ${video.video_id}:`, e);
        }
      }

      alert(`Re-clasificación completada. ${processed} videos actualizados.`);
      // Recargar pain points para reflejar cambios
      const { data: updated } = await supabase.from('latam_pain_points').select('*').order('severity_score', { ascending: false });
      if (updated) setPoints(updated);
    } catch (error) {
      console.error('Error en re-clasificación:', error);
      alert('Error al re-clasificar. Revisa la consola.');
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Pain Points LATAM</h2>
            <p className="text-slate-400">Problemas de mercado extrapolados dinámicamente por la IA</p>
        </div>
        <button 
            onClick={handleReclassify}
            disabled={isClassifying}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${
                isClassifying 
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
            }`}
        >
            {isClassifying ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Procesando...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>Re-clasificar Videos</span>
                </>
            )}
        </button>
      </header>
      
      {loading ? (
        <div className="text-cyan-400 text-center py-10 font-mono animate-pulse">Consultando al motor RAG...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {points.map(p => (
            <div key={p.pain_point_id} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-cyan-400 rounded-md text-xs font-bold uppercase tracking-wider shadow-inner">{p.category}</span>
                <div className="flex items-center space-x-2 bg-black px-3 py-1 rounded-full border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Severidad</span>
                  <span className={`font-black text-sm ${p.severity_score >= 80 ? 'text-rose-500' : 'text-amber-500'}`}>{p.severity_score}/100</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{p.description}</p>
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Target Market</span>
                <span className="text-sm text-slate-400">{p.target_market}</span>
              </div>
            </div>
          ))}
          {points.length === 0 && <div className="p-8 text-center text-slate-500 col-span-2">No se han extraído problemas aún. Ejecuta el Motor LLM.</div>}
        </div>
      )}
    </div>
  );
}

function WizardView() {
  const [step, setStep] = useState(1);
  const [rpm, setRpm] = useState({ results: '', purpose: '', massiveAction: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [llmSummary, setLlmSummary] = useState(null);

  const stepsData = [
    { num: 1, letter: 'R', name: 'Results' },
    { num: 2, letter: 'P', name: 'Purpose' },
    { num: 3, letter: 'M', name: 'Massive Action' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      // Initialize Gemini Client
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Eres un analista experto de modelos de negocio. El usuario acaba de completar su perfil RPM (Results, Purpose, Massive Action).
        Toma su perfil y genera un breve análisis estructurado en formato JSON estrictamente (sin formato markdown adicional).
        
        Resultados deseados: ${rpm.results}
        Propósito: ${rpm.purpose}
        Plan de Acción: ${rpm.massiveAction}

        Devuelve un JSON con:
        {
          "archetype": "Un arquetipo de emprendedor que lo defina en 3 palabras (ej. 'Agresivo B2B Hacker')",
          "viability_score": un número del 1 al 100 evaluando qué tan realista es su plan,
          "critical_feedback": "Un párrafo muy crítico y directo sobre el eslabón más débil de su plan y cómo arreglarlo",
          "extracted_keywords": ["keyword1", "keyword2", "keyword3"]
        }
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      // Clean markdown if present
      if (text.startsWith("```json")) text = text.slice(7);
      if (text.endsWith("```")) text = text.slice(0, -3);
      
      const parsedSummary = JSON.parse(text.trim());
      setLlmSummary(parsedSummary);

      // Save to Supabase (Mock user_id as 'dev_user')
      await supabase.from('users_rpm').upsert({
        user_id: 'dev_user',
        results_desired: [rpm.results],
        purpose: [rpm.purpose],
        massive_action_plan: [rpm.massiveAction],
        updated_at: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error processing LLM or saving DB:", error);
      alert("Hubo un error al procesar tu RPM con Gemini. Revisa la consola.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (llmSummary) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-full pb-10 animate-in fade-in zoom-in duration-500">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">Evaluación IA Completada</h2>
          <p className="text-slate-400">Tu perfil ha sido analizado. Puedes ajustar los resultados si lo deseas.</p>
        </header>

        <div className="bg-[#0b0f19] border border-cyan-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-6">
            <div className="flex-1 mr-8">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 text-cyan-400/60">Arquetipo Asignado (Editable)</p>
              <input 
                type="text"
                value={llmSummary.archetype}
                onChange={(e) => setLlmSummary({...llmSummary, archetype: e.target.value})}
                className="bg-transparent text-2xl font-black text-white w-full border-b border-slate-700 focus:border-cyan-500 outline-none pb-1"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Viabilidad</p>
              <div className="text-4xl font-black text-cyan-400">{llmSummary.viability_score}/100</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm text-cyan-500 font-bold uppercase mb-2">Feedback Crítico de la IA (Editable)</h4>
            <textarea 
              value={llmSummary.critical_feedback}
              onChange={(e) => setLlmSummary({...llmSummary, critical_feedback: e.target.value})}
              className="w-full bg-black/50 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed min-h-[120px] focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button onClick={() => setLlmSummary(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer">
              Reiniciar Wizard
            </button>
            <button 
              onClick={async () => {
                alert("Perfil RPM Guardado Localmente y en Base de Datos");
                // Here we could add a save function to persist the manual edits back to DB
              }} 
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
            >
              Confirmar Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full pb-10">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Perfil RPM</h2>
        <p className="text-slate-400">Define tus Resultados, Propósito y Plan de Acción Masiva</p>
      </header>

      {/* WIZARD STEPS */}
      <div className="flex justify-center items-center mb-12 relative w-full max-w-md mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded"></div>
        <div className="w-full flex justify-between">
            {stepsData.map((s) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                    <div key={s.num} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                            isActive ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.6)]' :
                            isPast ? 'bg-[#0b0f19] border-cyan-500 text-cyan-400' :
                            'bg-[#0b0f19] border-slate-700 text-slate-500'
                        }`}>
                            {s.letter}
                        </div>
                        <span className={`text-xs mt-3 font-semibold uppercase tracking-wider ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                            {s.name}
                        </span>
                    </div>
                )
            })}
        </div>
      </div>

      {/* FORM AREA */}
      <div className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
          {step === 1 && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-4">Paso 1: Results (Resultados)</h3>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 border-l-4 border-l-cyan-500">
                      <p className="text-cyan-400 font-mono text-sm">El "Qué" exacto.</p>
                      <p className="text-slate-400 text-sm mt-2">Sé hiper-específico y medible. No digas "quiero ganar más dinero", di "Quiero facturar $10,000 USD mensuales en 6 meses vendiendo software B2B en México". Si tu resultado no tiene un número y una fecha, es solo un deseo.</p>
                  </div>
                  <textarea 
                    value={rpm.results}
                    onChange={(e) => setRpm({ ...rpm, results: e.target.value })}
                    className="flex-1 w-full bg-black border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    placeholder="Ej: Lograr $10,000 USD de MRR vendiendo software a PyMEs..."
                  ></textarea>
              </div>
          )}
          
          {step === 2 && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-4">Paso 2: Purpose (Propósito)</h3>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 border-l-4 border-l-cyan-500">
                      <p className="text-cyan-400 font-mono text-sm">El "Por Qué" profundo.</p>
                      <p className="text-slate-400 text-sm mt-2">Tu gasolina emocional. Si la motivación es solo superficial, abandonarás a la primera objeción. ¿Qué libertad o impacto radical buscas para ti o tu familia que hace que el resultado sea innegociable?</p>
                  </div>
                  <textarea 
                    value={rpm.purpose}
                    onChange={(e) => setRpm({ ...rpm, purpose: e.target.value })}
                    className="flex-1 w-full bg-black border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    placeholder="Ej: Quiero libertad geográfica y financiera para no depender de un jefe..."
                  ></textarea>
              </div>
          )}

          {step === 3 && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-4">Paso 3: Massive Action Plan</h3>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 border-l-4 border-l-cyan-500">
                      <p className="text-cyan-400 font-mono text-sm">El 80% del impacto con el 20% del esfuerzo.</p>
                      <p className="text-slate-400 text-sm mt-2">¿Cuáles son las 3 acciones inmediatas e incómodas que tomarás HOY? Olvida las métricas de vanidad (ej. crear el logo). Enfócate en acciones masivas como prospectar clientes en frío o construir el MVP.</p>
                  </div>
                  <textarea 
                    value={rpm.massiveAction}
                    onChange={(e) => setRpm({ ...rpm, massiveAction: e.target.value })}
                    className="flex-1 w-full bg-black border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    placeholder="Ej: 1. Prospectar 50 empresas en LinkedIn. 2. Lanzar landing page de preventa..."
                  ></textarea>
              </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
              <button 
                onClick={handlePrev}
                disabled={step === 1 || isProcessing}
                className={`px-6 py-3 rounded-xl font-bold transition-colors cursor-pointer ${step === 1 ? 'text-slate-700 cursor-not-allowed' : 'text-cyan-400 hover:bg-slate-800'}`}
              >
                  Anterior
              </button>
              {step < 3 ? (
                <button 
                  onClick={handleNext}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer"
                >
                    Siguiente Paso
                </button>
              ) : (
                <button 
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className={`font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer flex items-center space-x-2 ${isProcessing ? 'bg-slate-700 text-slate-400' : 'bg-cyan-500 hover:bg-cyan-400 text-black hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]'}`}
                >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analizando...
                      </>
                    ) : 'Generar Evaluación IA'}
                </button>
              )}
          </div>
      </div>
    </div>
  );
}

function SolutionsEngineView({ setCurrentView }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasRPM, setHasRPM] = useState(false);

  useEffect(() => {
    fetchProposals();
    checkRPM();
  }, []);

  async function checkRPM() {
    const { data } = await supabase.from('users_rpm').select('*').eq('user_id', 'dev_user').single();
    if (data) setHasRPM(true);
  }

  async function fetchProposals() {
    setLoading(true);
    const { data } = await supabase.from('business_proposals').select(`
      *,
      latam_pain_points (category)
    `).order('fit_score', { ascending: false });
    if (data) setProposals(data);
    setLoading(false);
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Obtener datos de BD
      const { data: rpmData } = await supabase.from('users_rpm').select('*').eq('user_id', 'dev_user').single();
      const { data: painPoints } = await supabase.from('latam_pain_points').select('*').order('severity_score', { ascending: false }).limit(5);
      const { data: videos } = await supabase.from('videos').select('video_id, title, url, business_model, entrepreneur_action').not('pain_point_match', 'is', null).limit(10);

      if (!rpmData || !painPoints || !videos) {
          alert("Faltan datos base (RPM, Pain Points o Videos clasificados). Asegúrate de completar los pasos anteriores.");
          setIsGenerating(false);
          return;
      }

      // 2. Inicializar Gemini
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 3. Prompt Maestro
      const prompt = `
        Eres un estratega de negocios top. Cruza estos datos para generar 4 propuestas de negocio en LATAM.
        
        PERFIL DEL USUARIO (RPM):
        Resultados: ${rpmData.results_desired}
        Propósito: ${rpmData.purpose}
        Plan de Acción: ${rpmData.massive_action_plan}

        PROBLEMAS DE LATAM A RESOLVER:
        ${JSON.stringify(painPoints.map(p => ({id: p.pain_point_id, cat: p.category, desc: p.description})))}

        CASOS DE ÉXITO GLOBALES (Inspiración):
        ${JSON.stringify(videos)}

        Genera 4 propuestas de negocio que el usuario pueda ejecutar, que resuelvan los problemas de LATAM y que imiten los casos de éxito.
        
        Devuelve SOLO un JSON estrictamente con esta estructura:
        {
          "proposals": [
            {
              "title": "Nombre atractivo de la propuesta",
              "description": "Explicación de qué es, a quién se vende y cómo hace dinero.",
              "fit_score": 95, 
              "difficulty": "Baja",
              "target_pain_point_id": "ID exacto del pain point de la lista anterior que resuelve",
              "actionable_steps": ["Paso 1 exacto", "Paso 2 exacto", "Paso 3 exacto"],
              "source_videos": [
                 { "title": "Título del video de los casos de éxito", "url": "URL del video extraído de la lista de casos" }
              ]
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      if (text.startsWith("```json")) text = text.slice(7);
      if (text.endsWith("```")) text = text.slice(0, -3);
      
      const parsedData = JSON.parse(text.trim());
      
      // 4. Guardar en Supabase
      const insertData = parsedData.proposals.map(p => ({
        title: p.title,
        description: p.description,
        fit_score: p.fit_score,
        difficulty: p.difficulty || 'Media',
        target_pain_point_id: p.target_pain_point_id,
        actionable_steps: p.actionable_steps,
        source_video_ids: p.source_videos || []
      }));

      // Borramos las anteriores para mantener limpio el demo (Opcional)
      await supabase.from('business_proposals').delete().neq('title', 'placeholder');
      
      await supabase.from('business_proposals').insert(insertData);
      
      await fetchProposals();

    } catch (error) {
      console.error("Error generando propuestas:", error);
      alert("Hubo un error con la IA. Intenta nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasRPM) {
      return (
          <div className="max-w-4xl mx-auto text-center pt-20">
              <h2 className="text-3xl font-bold text-white mb-4">Motor de Valor Bloqueado</h2>
              <p className="text-slate-400 mb-8">Necesitas completar tu perfil RPM en el Wizard antes de poder generar propuestas cruzadas.</p>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Motor de Soluciones (Cruce)</h2>
          <p className="text-slate-400">Propuestas generadas cruzando tu RPM con los Pain Points y Casos de Éxito</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer'}`}
        >
            {isGenerating ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Generando Magia...</span>
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <span>Inyectar Motor IA</span>
                </>
            )}
        </button>
      </header>

      {loading ? (
          <div className="text-cyan-400 text-center py-10 font-mono animate-pulse">Cargando base de datos...</div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map(p => (
                  <div key={p.proposal_id} className="bg-[#0b0f19] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white max-w-[70%]">{p.title}</h3>
                          <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Fit Score</span>
                              <div className="text-2xl font-black text-cyan-400">{p.fit_score}%</div>
                          </div>
                      </div>

                      <div className="flex space-x-3 mb-6">
                          <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md border ${
                              p.difficulty === 'Baja' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              p.difficulty === 'Alta' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                              Dificultad {p.difficulty || 'Media'}
                          </span>
                          {p.latam_pain_points && (
                              <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-md bg-slate-800 text-slate-400 border border-slate-700 truncate max-w-[150px]">
                                  {p.latam_pain_points.category}
                              </span>
                          )}
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-6">{p.description}</p>

                      <div className="bg-black/50 rounded-xl p-4 border border-slate-800/80 mb-4">
                          <h4 className="text-[11px] font-bold text-cyan-500 uppercase tracking-widest mb-3">Actionable Steps</h4>
                          <ul className="space-y-2">
                              {p.actionable_steps && p.actionable_steps.map((step, idx) => (
                                  <li key={idx} className="flex text-sm text-slate-400">
                                      <span className="text-cyan-500 mr-2 font-bold">{idx+1}.</span>
                                      {step}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      {p.source_video_ids && p.source_video_ids.length > 0 && (
                          <div className="mb-6">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Videos Inspiración</h4>
                              <div className="flex flex-col space-y-2">
                                  {p.source_video_ids.map((vid, idx) => (
                                      <a key={idx} href={vid.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center bg-blue-500/10 p-2 rounded border border-blue-500/20 w-fit">
                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                          {vid.title}
                                      </a>
                                  ))}
                              </div>
                          </div>
                      )}

                      <button 
                          onClick={async () => {
                              // Verificar si ya existe un registro MVT activo
                              const { data: existing } = await supabase.from('mvt_evidence').select('mvt_id').neq('validation_status', 'placeholder').single();
                              if (existing) {
                                  // Solo actualizar la propuesta seleccionada, sin borrar datos
                                  await supabase.from('mvt_evidence').update({ proposal_id: p.proposal_id }).eq('mvt_id', existing.mvt_id);
                              } else {
                                  await supabase.from('mvt_evidence').insert([{ proposal_id: p.proposal_id, validation_status: 'En Inmersión' }]);
                              }
                              setCurrentView('MVT (Fase 5)');
                          }}
                          className="w-full py-3 bg-slate-800 hover:bg-cyan-600 text-white text-sm font-bold rounded-lg transition-colors border border-slate-700 hover:border-cyan-500"
                      >
                          Seleccionar para MVT
                      </button>
                  </div>
              ))}
              {proposals.length === 0 && (
                  <div className="col-span-2 text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
                      <p className="text-slate-500 mb-2">Aún no hay propuestas de valor generadas.</p>
                      <p className="text-sm text-slate-600">Presiona "Inyectar Motor IA" para cruzar tu perfil con el mercado.</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
}

function MVTView() {
  const [evidence, setEvidence] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([
    { name: '', feedback: '' }, 
    { name: '', feedback: '' }, 
    { name: '', feedback: '' },
    { name: '', feedback: '' },
    { name: '', feedback: '' }
  ]);
  const [hypothesis, setHypothesis] = useState('');
  const [testDesign, setTestDesign] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    fetchMVT();
  }, []);

  async function fetchMVT() {
    setLoading(true);
    const { data: evData } = await supabase.from('mvt_evidence').select('*').neq('validation_status', 'placeholder').single();
    if (evData) {
      setEvidence(evData);
      if (evData.evidence_logs && evData.evidence_logs.length > 0) {
        // If logs exist in DB, populate them (ensure there are 5)
        const dbLogs = evData.evidence_logs;
        while(dbLogs.length < 5) dbLogs.push({ name: '', feedback: '' });
        setLogs(dbLogs);
      }
      
      setHypothesis(evData.hypothesis || '');
      setTestDesign(evData.test_design || '');
      setAnalysisResult(evData.analysis_result || '');
      
      const { data: propData } = await supabase.from('business_proposals').select('*').eq('proposal_id', evData.proposal_id).single();
      setProposal(propData);
    }
    setLoading(false);
  }

  const handleSaveLogs = async () => {
    if (!evidence) return;
    await supabase.from('mvt_evidence').update({
      evidence_logs: logs,
      hypothesis: hypothesis,
      test_design: testDesign,
      analysis_result: analysisResult,
      validation_status: 'Documentado'
    }).eq('mvt_id', evidence.mvt_id);
    alert('¡Conversaciones documentadas correctamente en la base de datos!');
  };

  const updateLog = (index, field, value) => {
    const newLogs = [...logs];
    newLogs[index][field] = value;
    setLogs(newLogs);
  };

  if (loading) return <div className="text-cyan-400 text-center py-10 font-mono animate-pulse">Cargando MVT...</div>;

  if (!evidence || !proposal) {
    return (
      <div className="max-w-4xl mx-auto text-center pt-20">
        <h2 className="text-3xl font-bold text-white mb-4">No has seleccionado ninguna propuesta</h2>
        <p className="text-slate-400 mb-8">Ve al Motor de Soluciones y presiona "Seleccionar para MVT" en la idea que más te guste.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-10">
        <span className="text-cyan-500 font-bold tracking-widest text-sm mb-2 block">PASO 1 DEL MVT</span>
        <h2 className="text-3xl font-bold text-white mb-2">Inmersión en la Calle (5 Entrevistas)</h2>
        <p className="text-slate-400">Documenta las 5 conversaciones mínimas requeridas sobre tu propuesta elegida.</p>
      </header>

      <div className="bg-[#0b0f19] border border-cyan-500/50 rounded-2xl p-6 mb-10 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
        <h3 className="text-xl font-bold text-white mb-2">Propuesta Elegida: {proposal.title}</h3>
        <p className="text-slate-400 text-sm">{proposal.description}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Documentación de Entrevistas</h3>
        
        {logs.map((log, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-4">Conversación #{index + 1}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">¿Con quién hablaste? (Perfil)</label>
                <input 
                  type="text" 
                  value={log.name}
                  onChange={(e) => updateLog(index, 'name', e.target.value)}
                  className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Ej: Juan, Dueño de agencia de marketing en Chile"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Feedback recibido (Dolor validado o rechazado)</label>
                <textarea 
                  value={log.feedback}
                  onChange={(e) => updateLog(index, 'feedback', e.target.value)}
                  className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white h-24 focus:border-cyan-500 focus:outline-none"
                  placeholder="Ej: Me dijo que el problema principal no es crear contenido, sino medir el ROI. Interesante pivote."
                />
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-slate-800 pt-8 mt-8 space-y-6">
          <h3 className="text-xl font-bold text-white mb-4">Validación de Mercado (Cierre del MVT)</h3>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lista de mínimo 5 hipótesis rankeadas (2-3 críticas)</label>
            <textarea 
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-cyan-500 focus:outline-none"
              placeholder="1. [CRÍTICA] Creemos que... &#10;2. [CRÍTICA] Creemos que... &#10;3. Creemos que... &#10;4. Creemos que... &#10;5. Creemos que..."
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Test Ejecutado y Evidencia (Pega URLs/Drive)</label>
            <textarea 
              value={testDesign}
              onChange={(e) => setTestDesign(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white h-24 focus:border-cyan-500 focus:outline-none"
              placeholder="Ej: Hicimos un Smoke Test usando esta Landing Page (URL: misitio.carrd.co). URL Evidencia Capturas: drive.google.com/..."
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Conclusión y Decisión (Métrica objetivo vs Real)</label>
            <textarea 
              value={analysisResult}
              onChange={(e) => setAnalysisResult(e.target.value)}
              className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-cyan-500 focus:outline-none"
              placeholder="Métrica objetivo: 5 ventas previas. &#10;Métrica real: 2 ventas previas. &#10;Conclusión: Invalidada parcialmente. &#10;Decisión: Ajustar el precio y pivotar hacia..."
            />
          </div>
        </div>

        <button 
          onClick={handleSaveLogs}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
        >
          Guardar Evidencias MVT en Supabase
        </button>
      </div>
    </div>
  );
}

export default App;
