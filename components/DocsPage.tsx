import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ChevronRight, Cpu, Book, History, Shield, Zap, Terminal, Code2, Layers, CheckCircle2 } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const { docType, goToLanding, goToAuth } = useAuth();

  const renderContent = () => {
    switch (docType) {
      case 'documentation':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Book className="text-blue-500" /> Getting Started
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Orbit is designed to be your primary interface for Web3 activity. It combines a database, a project tracker, and an AI assistant into one local-first application.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <h4 className="font-bold mb-2">Folders (Contexts)</h4>
                  <p className="text-sm text-zinc-500">Categorize your work by high-level domains like "Airdrops", "Yield Farming", or "DAOs".</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <h4 className="font-bold mb-2">Projects (Units)</h4>
                  <p className="text-sm text-zinc-500">Each protocol or idea is a Project. Projects hold your links, notes, and milestones.</p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-xl font-bold mb-4">The Vault</h3>
              <p className="text-zinc-400 mb-6">When you open a project, you enter "The Vault". This is where execution happens.</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                  <span className="text-sm text-zinc-400"><strong>Daily Logs:</strong> Record swaps, bridges, and transactions to maintain an audit trail.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                  <span className="text-sm text-zinc-400"><strong>Milestones:</strong> Use the progress slider to visually track how close you are to completing your goal.</span>
                </li>
              </ul>
            </section>
          </div>
        );
      case 'architecture':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Cpu className="text-purple-500" /> System Architecture
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8 font-mono text-sm">
                Orbit operates as a Local-First Operating System. Your data never leaves your device unless you explicitly interact with the AI assistant.
              </p>
              <div className="space-y-8">
                <div className="border-l-2 border-purple-500/30 pl-6 py-2">
                  <h4 className="font-mono text-sm font-bold text-white mb-2 uppercase tracking-tighter">I. Persistence Layer</h4>
                  <p className="text-sm text-zinc-500">Orbit utilizes LocalStorage for millisecond retrieval times. In future versions, this will transition to an encrypted IndexedDB structure for larger attachments.</p>
                </div>
                <div className="border-l-2 border-purple-500/30 pl-6 py-2">
                  <h4 className="font-mono text-sm font-bold text-white mb-2 uppercase tracking-tighter">II. Intelligence Engine (Gemini)</h4>
                  <p className="text-sm text-zinc-500">Integrated with Google's Gemini-3 series. The "Live Assistant" uses native audio streaming (PCM 16k/24k) to provide sub-second latency voice responses based on your current vault context.</p>
                </div>
                <div className="border-l-2 border-purple-500/30 pl-6 py-2">
                  <h4 className="font-mono text-sm font-bold text-white mb-2 uppercase tracking-tighter">III. Design System</h4>
                  <p className="text-sm text-zinc-500">Built on a "Glassmorphic Neobrutalist" framework, prioritizing high-contrast accessibility and spatial hierarchy.</p>
                </div>
              </div>
            </section>
            <div className="p-8 bg-black border border-white/5 rounded-[2rem] font-mono text-xs text-zinc-500">
               <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
                  <span>MODULE: ORBIT_CORE</span>
                  <span className="text-green-500">STATUS: STABLE</span>
               </div>
               <div className="space-y-1">
                  <p><span className="text-purple-400">import</span> &#123; GoogleGenAI &#125; <span className="text-purple-400">from</span> "@google/genai";</p>
                  <p><span className="text-blue-400">const</span> vault = localStorage.getItem(<span className="text-orange-300">'vault'</span>);</p>
                  <p><span className="text-zinc-700">// System utilizing 2.5-flash-native-audio-preview for Assistant</span></p>
                  <p>session.connect(&#123; model: <span className="text-orange-300">'gemini-2.5-flash-native-audio'</span> &#125;);</p>
               </div>
            </div>
          </div>
        );
      case 'changelog':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <History className="text-emerald-500" /> Version History
            </h2>
            <div className="space-y-16">
              <div className="relative pl-8 border-l border-emerald-500/20">
                <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black">v1.2.5 - Stability & Performance</h4>
                    <span className="text-xs font-mono text-zinc-500">MARCH 2024</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded">Current</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                  <li>Improved Voice Assistant context injection.</li>
                  <li>New "Power Mode" aesthetic theme.</li>
                  <li>Optimized local database reconciliation.</li>
                  <li>Responsive landing page overhaul.</li>
                </ul>
              </div>

              <div className="relative pl-8 border-l border-zinc-800">
                <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-zinc-300">v1.1.0 - The Intelligence Update</h4>
                    <span className="text-xs font-mono text-zinc-600">FEBRUARY 2024</span>
                  </div>
                </div>
                <ul className="text-sm text-zinc-500 space-y-2 list-disc pl-4">
                  <li>Initial integration of Gemini Live Assistant.</li>
                  <li>Added multimodality support (Notes to Speech).</li>
                </ul>
              </div>

              <div className="relative pl-8 border-l border-zinc-800">
                <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-zinc-300">v1.0.0 - Genesis</h4>
                    <span className="text-xs font-mono text-zinc-600">JANUARY 2024</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500">Official launch of the Orbit Command Center core MVP.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const titles = {
    documentation: "System Documentation",
    architecture: "Architecture Blueprint",
    changelog: "System Logs & Changelog"
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="stars-bg opacity-10 absolute inset-0" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <button onClick={goToLanding} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest hidden sm:block">Return to Orbit</span>
          </button>
          <div className="flex items-center gap-6">
            <button onClick={goToAuth} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Enter App</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-40 pb-32 px-6 max-w-4xl mx-auto">
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">
            <Terminal size={12} className="text-blue-500" /> Core OS / {docType}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase">
            {titles[docType || 'documentation']}
          </h1>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
        </header>

        <div className="grid lg:grid-cols-[1fr_250px] gap-16">
          <div className="min-w-0">
            {renderContent()}
          </div>
          
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-12">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Explore</h5>
                <nav className="flex flex-col gap-4">
                  <button onClick={() => goToLanding()} className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">Landing Page <ChevronRight size={14}/></button>
                  <button onClick={() => goToAuth()} className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">System Login <ChevronRight size={14}/></button>
                </nav>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                <Shield className="text-blue-500 mb-4" size={24} />
                <h6 className="text-xs font-bold mb-2">Private by Default</h6>
                <p className="text-[11px] text-zinc-500 leading-relaxed">No data is sent to external servers unless using specific AI functions.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="relative py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center text-[10px] font-mono text-zinc-700 tracking-[0.2em] uppercase">
          Orbit Systems • High-Performance Web3 Operating Environment • 2024
        </div>
      </footer>
    </div>
  );
};