
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Layers, Zap, Brain, Shield, ChevronRight, 
  Globe, Database, Star, CheckCircle2, Layout, MousePointer2, 
  Sparkles, ListChecks, MessageSquare, Monitor, X, Play, 
  Twitter, Linkedin, Youtube, Instagram, Share2, Plus, 
  Trash2, Folder, ExternalLink, ArrowDown, AlertCircle, Pencil,
  Mic, Search, Fingerprint, Command, Repeat, Info
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { goToAuth, goToDocs, enterLocalMode } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Enable smooth scrolling on the html element while landing page is mounted
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-blue-500/30 overflow-visible">
      {/* Dynamic Cosmic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="stars-bg opacity-30 absolute inset-0" />
        <div 
          className="absolute top-[-15%] left-[-5%] w-[70%] h-[70%] bg-blue-900/10 blur-[180px] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.02}px)` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[180px] rounded-full"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.02}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/20 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span className="text-2xl font-black tracking-tighter">ORBIT</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={goToAuth} className="hidden md:block text-xs font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-all">Login</button>
            <button 
              onClick={goToAuth}
              className="px-8 py-3 bg-white text-black rounded-full text-sm font-black hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-white/10 uppercase tracking-tight"
            >
              Enter Orbit
            </button>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero - INITIAL BROAD VERSION */}
      <section className="relative z-10 pt-48 pb-32 px-6 text-center max-w-7xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Sparkles className="text-blue-400 w-4 h-4" />
          <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">Personal Web3 Operating System</span>
        </div>
        
        <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-12 leading-none animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Your Web3 Projects.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400">One Command Center.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Stop losing links and forgetting contexts. Orbit is the high-performance home for everything you build, farm, and research in the Web3 ecosystem.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 mb-20 w-full max-w-xl">
          <button 
            onClick={goToAuth}
            className="w-full sm:flex-1 px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl transition-all shadow-[0_0_50px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-tight"
          >
            Cloud Access <ArrowRight size={24} />
          </button>
          <button 
            onClick={() => enterLocalMode()}
            className="w-full sm:flex-1 px-10 py-6 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-2xl font-black text-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-tight"
          >
            Local Mode <Database size={24} className="text-blue-500" />
          </button>
        </div>

        {/* Quick Navigation Shortcuts */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
          {[
            { id: 'problem', label: 'The Problem', icon: AlertCircle },
            { id: 'anatomy', label: 'The Dashboard', icon: Layout },
            { id: 'process', label: 'The Process', icon: Zap },
            { id: 'example', label: 'The Soccer Case', icon: Repeat },
            { id: 'ai', label: 'Voice AI', icon: Mic },
            { id: 'comparison', label: 'Intelligence', icon: Brain }
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollToSection(nav.id)}
              className="px-5 py-2.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-blue-500/20 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white"
            >
              <nav.icon size={14} className="text-blue-500/70" />
              {nav.label}
            </button>
          ))}
        </div>

        {/* Hero Orbital Animation Visual - BROAD VERSION */}
        <div className="mt-40 relative w-full h-[600px] flex items-center justify-center">
           <div className="absolute w-[800px] h-[800px] border border-white/5 rounded-full animate-orbit pointer-events-none" />
           <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-orbit opacity-50 pointer-events-none" style={{ animationDirection: 'reverse' }} />
           
           {/* UI Metaphor: The Sidebar */}
           <div className="absolute -left-10 top-20 glass-card p-6 rounded-3xl w-64 rotate-[-6deg] animate-float-slow hidden lg:block border-white/10 shadow-2xl">
              <div className="text-xs font-black text-zinc-600 mb-4 uppercase tracking-widest">Contexts</div>
              <div className="space-y-3">
                 <div className="h-10 w-full bg-blue-600 rounded-lg flex items-center px-4 gap-3"><Folder size={16}/> <span className="text-xs font-bold">Airdrops</span></div>
                 <div className="h-10 w-full bg-zinc-800/50 rounded-lg flex items-center px-4 gap-3 opacity-50"><Folder size={16}/> <span className="text-xs font-bold">DAOs</span></div>
                 <div className="h-10 w-full bg-zinc-800/50 rounded-lg flex items-center px-4 gap-3 opacity-50"><Folder size={16}/> <span className="text-xs font-bold">NFT Research</span></div>
              </div>
           </div>

           {/* UI Metaphor: The Main Card */}
           <div className="absolute z-10 glass-card p-8 rounded-[3rem] border border-white/10 w-80 shadow-2xl transition-transform hover:scale-105">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-2xl">SO</div>
                 <div className="px-3 py-1 bg-blue-500/20 rounded text-xs font-black text-blue-400 tracking-tighter uppercase">Vault Deployment</div>
              </div>
              <h4 className="text-2xl font-black mb-1">Soccer Airdrop</h4>
              <p className="text-xs text-zinc-500 font-mono mb-6 uppercase tracking-widest">Status: Active Exploration</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full w-[45%] bg-blue-500" />
              </div>
           </div>

           {/* UI Metaphor: The AI Assistant */}
           <div className="absolute -right-10 bottom-20 glass-card p-6 rounded-3xl w-64 rotate-[4deg] animate-float-alt hidden lg:block border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"><Mic size={18}/></div>
                 <span className="text-xs font-black uppercase tracking-widest">Orbit AI</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">"Commander, you bridged to Berachain 2 days ago. Want to record a swap log?"</p>
           </div>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section id="problem" className="relative z-10 py-48 border-y border-white/5 bg-zinc-950/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-8xl font-black mb-10 leading-tight">🚨 Web3 Isn’t Hard — <br/><span className="text-red-500">It’s Scattered</span></h2>
            <p className="text-xl md:text-3xl text-zinc-400 leading-relaxed">
               Orbit solves the mental overhead of tracking a high-velocity portfolio across 20+ tabs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
             {[
               { title: "10+ Airdrops", desc: "Farming multiple protocols across different ecosystems simultaneously." },
               { title: "Links Everywhere", desc: "Discord links, dashboards, Twitter threads scattered across bookmarks." },
               { title: "Fragmented Tracking", desc: "Data stuck in Google Sheets, Apple Notes, and random browser tabs." },
               { title: "Lost Context", desc: "Forgetting exactly where you left off after a week away from a project." },
               { title: "Execution Friction", desc: "Switching between 5 apps just to find one piece of research." },
               { title: "Mental Overload", desc: "Your brain is full of transaction hashes and bridge schedules." }
             ].map((item, idx) => (
               <div key={idx} className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-all hover:scale-[1.02]">
                  <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/10">
                     <AlertCircle size={28}/>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>

          <div className="text-center max-w-2xl mx-auto py-20 px-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl animate-collapse relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <h3 className="text-2xl font-black mb-4 italic">You’re not disorganized.</h3>
             <p className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter mb-8">Your tools are.</p>
             <p className="text-zinc-400 text-lg font-medium">Orbit is the focus layer Web3 was missing.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Meet Orbit - The UI Anatomy */}
      <section id="anatomy" className="relative z-10 py-48 max-w-7xl mx-auto px-6 scroll-mt-20">
         <div className="text-center mb-32">
            <h2 className="text-5xl md:text-9xl font-black mb-8 tracking-tighter italic">✨ Meet Orbit</h2>
            <p className="text-2xl md:text-3xl text-zinc-400 font-medium">A high-performance workspace for Web3 builders.</p>
         </div>

         <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
               <div className="relative glass-card rounded-[3rem] border border-white/10 p-2 bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                  <div className="bg-[#050505] rounded-[2.8rem] overflow-hidden p-8">
                     <div className="flex gap-6 mb-8">
                        <div className="w-1/3 h-72 bg-zinc-900/50 rounded-2xl p-4 space-y-4">
                           <div className="h-8 w-full bg-blue-600 rounded-lg shadow-lg" />
                           <div className="h-8 w-full bg-zinc-800 rounded-lg" />
                           <div className="h-8 w-full bg-zinc-800 rounded-lg" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <div className="aspect-square bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-pulse shadow-xl shadow-blue-900/10" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute -top-6 -left-6 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl z-20">The Command Center</div>
            </div>
            <div>
               <h2 className="text-4xl md:text-7xl font-black mb-10 leading-tight">One Dashboard.<br/><span className="text-blue-500 italic">Total Control.</span></h2>
               <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                  Orbit replaces fragmented notes and infinite browser tabs with a dedicated operating system for your research and execution.
               </p>
               <div className="grid gap-6">
                  {[
                    { t: "Track every project", d: "Categorize by ecosystem, goal, or context." },
                    { t: "Store every link", d: "Never search your history for a dashboard again." },
                    { t: "Document every action", d: "Contextual logs that track your protocol progress." },
                    { t: "Plan social updates", d: "Social planners to share your alpha instantly." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-all hover:translate-x-2">
                       <CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={24} />
                       <div>
                          <h4 className="font-bold text-xl mb-1">{item.t}</h4>
                          <p className="text-sm text-zinc-500 leading-relaxed">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Section 4: How It Works - Initial Spacing */}
      <section id="process" className="relative z-10 py-48 bg-zinc-900/10 border-y border-white/5 scroll-mt-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-40">
               <h2 className="text-5xl md:text-9xl font-black mb-6 tracking-tighter italic">🧭 Simple by Design</h2>
               <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.4em]">Execution over Setup</p>
            </div>

            <div className="grid md:grid-cols-3 gap-24 relative">
               <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 hidden md:block" />
               
               {[
                  {
                     step: "1",
                     title: "Folders",
                     desc: "Organize by context: Airdrops, Research, or Testnets. Your sidebar stays clean while your vault grows.",
                     icon: Folder,
                     ui: (
                        <div className="w-full h-48 bg-zinc-950 rounded-[2rem] border border-white/5 p-6 flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                           <div className="w-20 h-full bg-zinc-900 rounded-xl p-3 space-y-3">
                              <div className="h-4 w-full bg-blue-600 rounded-md" />
                              <div className="h-4 w-full bg-zinc-800 rounded-md" />
                           </div>
                           <div className="flex-1 grid grid-cols-2 gap-3">
                              <div className="h-full bg-zinc-900/50 rounded-lg" />
                              <div className="h-full bg-zinc-900/50 rounded-lg" />
                           </div>
                        </div>
                     )
                  },
                  {
                     step: "2",
                     title: "Projects",
                     desc: "Click ➕ Create Project. Instantly turn any protocol into a visual unit with its own link and identity.",
                     icon: Plus,
                     ui: (
                        <div className="w-full h-48 bg-zinc-950 rounded-[2rem] border border-white/5 p-8 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                           <div className="w-32 h-20 glass-card rounded-2xl border-white/20 flex flex-col items-center justify-center gap-2 shadow-2xl">
                              <Plus size={24} className="text-blue-500" />
                              <div className="h-1.5 w-16 bg-zinc-800 rounded-full" />
                           </div>
                        </div>
                     )
                  },
                  {
                     step: "3",
                     title: "The Vault",
                     desc: "Enter your workspace. Store links, log daily actions, and plan your execution flow without friction.",
                     icon: Layout,
                     ui: (
                        <div className="w-full h-48 bg-zinc-950 rounded-[2rem] border border-white/5 p-6 flex flex-col gap-4 opacity-50 hover:opacity-100 transition-opacity">
                           <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-500 shadow-lg" />
                              <div className="h-3 w-32 bg-zinc-800 rounded-full mt-3.5" />
                           </div>
                           <div className="flex-1 bg-zinc-900 rounded-2xl" />
                        </div>
                     )
                  }
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center group relative z-10">
                     <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-3xl font-black mb-10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                        {item.step}
                     </div>
                     <h3 className="text-3xl font-black mb-4">{item.title}</h3>
                     <p className="text-zinc-500 leading-relaxed mb-10 text-sm px-4">{item.desc}</p>
                     {item.ui}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Section 5: The "Soccer" Use Case - Initial Scale */}
      <section id="example" className="relative z-10 py-48 max-w-7xl mx-auto px-6 scroll-mt-20">
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
               <div className="inline-flex px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">Real-World Execution</div>
               <h2 className="text-4xl md:text-8xl font-black mb-10 tracking-tighter leading-tight">🔁 High-Speed Farming <br/><span className="text-blue-500 italic">Without Stress</span></h2>
               <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                  Orbit becomes your secondary memory so your primary brain can focus on discovery and alpha generation.
               </p>
               <div className="space-y-6">
                  {[
                     { s: "Step 1", t: "Context Folder", d: "Initialize 'Airdrops' folder in seconds." },
                     { s: "Step 2", t: "Project Card", d: "Add 'Soccer' project with official website: soccer.com." },
                     { s: "Step 3", t: "Daily Logs", d: "Record bridges, swaps, and interactions as you go." },
                     { s: "Step 4", t: "Milestones", d: "Move the progress slider as you reach protocol goals." }
                  ].map((step, i) => (
                     <div key={i} className="flex gap-4 group">
                        <div className="text-blue-500 font-mono text-xs font-black pt-1.5">{step.s}</div>
                        <div>
                           <h4 className="font-black text-2xl group-hover:text-blue-400 transition-colors leading-tight">{step.t}</h4>
                           <p className="text-sm text-zinc-600 font-medium">{step.d}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
               <div className="relative glass-card rounded-[3.5rem] p-12 border border-white/10 shadow-2xl bg-[#050505]">
                  <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">SO</div>
                        <div>
                           <h3 className="text-3xl font-black">Soccer</h3>
                           <p className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">ACTIVE SESSION</p>
                        </div>
                     </div>
                     <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Vault Active</div>
                  </div>
                  <div className="space-y-6">
                     <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 font-mono text-xs text-blue-400 leading-relaxed">
                        // 04-20: Bridged 1.5 ETH from Mainnet. Swapped 1 ETH for SOCCER on DEX.
                     </div>
                     <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 font-mono text-xs text-zinc-500 leading-relaxed">
                        // 04-21: Joined Discord. Verified role. Claimed testnet faucet.
                     </div>
                     <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5 hover:border-blue-500/50 transition-colors cursor-pointer"><Twitter size={16} className="text-zinc-600"/></div>
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5 hover:border-blue-500/50 transition-colors cursor-pointer"><Globe size={16} className="text-zinc-600"/></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 6: Orbit AI Feature Spotlight */}
      <section id="ai" className="relative z-10 py-48 border-y border-white/5 bg-zinc-950/20 scroll-mt-20">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex p-5 bg-red-500/10 text-red-500 rounded-3xl mb-12 shadow-2xl shadow-red-900/10">
               <Mic size={48} className="animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-9xl font-black mb-10 tracking-tighter leading-tight">Your Voice-Enabled <br/><span className="text-red-500 italic">Second Brain</span></h2>
            <p className="text-2xl text-zinc-400 mb-16 leading-relaxed max-w-4xl mx-auto">
               Orbit isn't just a database. It's an intelligent assistant that knows your context. Talk to your command center to recall forgotten research or open folders instantly.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
               <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-red-500/20 transition-all">
                  <h4 className="font-black text-2xl mb-4 flex items-center gap-3">
                     <Fingerprint size={24} className="text-red-500"/> Context Aware
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">The AI knows exactly what's in your vault. Recall specific transaction dates or bridge notes with natural voice queries.</p>
               </div>
               <div className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-red-500/20 transition-all">
                  <h4 className="font-black text-2xl mb-4 flex items-center gap-3">
                     <Command size={24} className="text-red-500"/> Voice Navigation
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Open projects, switch folders, and navigate your command center hands-free while you're executing in other browser tabs.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Section 7: Comparison Table - Broad */}
      <section id="comparison" className="relative z-10 py-48 max-w-7xl mx-auto px-6 scroll-mt-20">
         <div className="text-center mb-32">
            <h2 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter italic">🧠 Built for Performance</h2>
            <p className="text-xl text-zinc-500 font-mono uppercase tracking-[0.3em]">vs Generic Tooling</p>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="border-b border-white/10">
                     <th className="pb-10 text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Platform</th>
                     <th className="pb-10 text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">The Core Problem</th>
                     <th className="pb-10 text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">The Orbit Solution</th>
                  </tr>
               </thead>
               <tbody>
                  {[
                     { tool: "Spreadsheets", prob: "Manual, fragile, and easy to forget", sol: "Visual Executive Command Flow" },
                     { tool: "Notion", prob: "Overkill, slow setup, high friction", sol: "Zero-friction Context Injection" },
                     { tool: "Bookmarks", prob: "Static links without active context", sol: "Active Persistence Layer" },
                     { tool: "Generic Notes", prob: "No structure, lost in the noise", sol: "Organized Multi-modal Vault" }
                  ].map((item, i) => (
                     <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="py-12 text-3xl font-black">{item.tool}</td>
                        <td className="py-12 text-zinc-500 text-lg font-medium">{item.prob}</td>
                        <td className="py-12 text-2xl font-bold flex items-center gap-4">
                           <CheckCircle2 size={24} className="text-blue-500 shadow-lg shadow-blue-900/20" />
                           {item.sol}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Final CTA - INITIAL BROAD VERSION */}
      <section className="relative z-10 py-64 text-center px-6 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/15 blur-[160px] rounded-full animate-pulse" />
         <h2 className="text-5xl md:text-9xl font-black mb-16 tracking-tighter leading-none relative z-10 uppercase">🚀 Start Orbiting.</h2>
         <div className="relative z-10 flex flex-col items-center gap-12">
            <button 
              onClick={goToAuth}
              className="px-16 py-8 bg-white text-black rounded-[2.5rem] font-black text-3xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-tighter"
            >
               Enter Orbit Command
            </button>
            <div className="flex flex-col gap-3 items-center opacity-40">
               <p className="font-black text-xs uppercase tracking-[0.5em] text-zinc-400">One dashboard. One flow. One orbit.</p>
               <p className="font-mono text-[10px] uppercase text-zinc-600 tracking-[0.3em] mt-2">v1.2.5 STABLE • VAULT ENCRYPTED • AI ENABLED • COMMANDER ACCESS</p>
            </div>
         </div>
      </section>

      {/* Footer - Initial Breadth */}
      <footer className="relative z-10 py-32 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-xl" />
                  <span className="text-2xl font-black tracking-tighter">ORBIT</span>
               </div>
               <p className="text-zinc-500 max-w-sm leading-relaxed font-medium">
                  Centralize your Web3 workflow. Orbit is the project organizer for high-velocity builders, founders, and hunters.
               </p>
            </div>
            <div>
               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">Product Context</h5>
               <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  <li><button onClick={() => goToDocs('documentation')} className="hover:text-white transition-colors">Documentation</button></li>
                  <li><button onClick={() => goToDocs('architecture')} className="hover:text-white transition-colors">Architecture</button></li>
                  <li><button onClick={() => goToDocs('changelog')} className="hover:text-white transition-colors">Changelog</button></li>
               </ul>
            </div>
            <div>
               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">Ecosystem Connect</h5>
               <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-widest opacity-30 cursor-not-allowed">
                  <li>Twitter / X</li>
                  <li>Discord Command</li>
                  <li>Telegram Portal</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-zinc-800 gap-6">
            <span className="uppercase tracking-[0.4em]">© 2024 ORBIT SYSTEMS • ALL ASSETS ENCRYPTED</span>
            <span className="uppercase tracking-[0.4em]">Designed & Engineered by HAMSTAR CORE</span>
         </div>
      </footer>
    </div>
  );
};
