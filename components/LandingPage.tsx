
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
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span className="text-2xl font-black tracking-tighter">ORBIT</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={goToAuth} className="hidden md:block text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-all">Login</button>
            <button 
              onClick={goToAuth}
              className="px-8 py-3 bg-white text-black rounded-full text-sm font-black hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/10 uppercase tracking-tight"
            >
              Enter Orbit
            </button>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative z-10 pt-48 pb-32 px-6 text-center max-w-6xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="text-blue-400 w-3 h-3" />
          <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">Personal Web3 Operating System</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          Your Web3 Projects.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400">One Command Center.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          Stop losing links. Stop forgetting projects. Orbit is the calm, organized home for everything you do in Web3.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-450 mb-12 w-full max-w-lg">
          <button 
            onClick={goToAuth}
            className="flex-1 px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_0_60px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-tight"
          >
            Cloud Login <ArrowRight size={24} />
          </button>
          <button 
            onClick={() => enterLocalMode()}
            className="flex-1 px-12 py-6 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-[2rem] font-black text-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-tight"
          >
            Try Local Mode <Database size={24} className="text-blue-500" />
          </button>
        </div>

        {/* --- Quick Navigation Shortcuts --- */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600">
          {[
            { id: 'problem', label: 'The Problem', icon: AlertCircle },
            { id: 'anatomy', label: 'Dashboard UI', icon: Layout },
            { id: 'process', label: 'The Process', icon: Zap },
            { id: 'example', label: 'Real Example', icon: Repeat },
            { id: 'ai', label: 'Voice AI', icon: Mic },
            { id: 'comparison', label: 'Why Orbit?', icon: Brain }
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollToSection(nav.id)}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
            >
              <nav.icon size={14} className="text-blue-500" />
              {nav.label}
            </button>
          ))}
        </div>

        {/* Hero Orbital Animation Visual */}
        <div className="mt-32 relative w-full h-[400px] flex items-center justify-center">
           <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-orbit pointer-events-none" />
           <div className="absolute w-[350px] h-[350px] border border-white/5 rounded-full animate-orbit opacity-50 pointer-events-none" style={{ animationDirection: 'reverse' }} />
           
           {/* UI Metaphor: The Sidebar */}
           <div className="absolute -left-10 top-20 glass-card p-4 rounded-2xl w-56 rotate-[-6deg] animate-float-slow hidden lg:block">
              <div className="text-[10px] font-black text-zinc-600 mb-3 uppercase tracking-widest">Contexts</div>
              <div className="space-y-2">
                 <div className="h-8 w-full bg-blue-600 rounded-lg flex items-center px-3 gap-2"><Folder size={12}/> <span className="text-[10px] font-bold">Airdrops</span></div>
                 <div className="h-8 w-full bg-zinc-800/50 rounded-lg flex items-center px-3 gap-2 opacity-50"><Folder size={12}/> <span className="text-[10px] font-bold">DAOs</span></div>
              </div>
           </div>

           {/* UI Metaphor: The Main Card */}
           <div className="absolute z-10 glass-card p-8 rounded-[2.5rem] border border-white/10 w-80 shadow-2xl transition-transform hover:scale-110">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-black text-xl">SO</div>
                 <div className="px-2 py-1 bg-blue-500/20 rounded text-[10px] font-black text-blue-400">45%</div>
              </div>
              <h4 className="text-xl font-black mb-1">Soccer Airdrop</h4>
              <p className="text-[10px] text-zinc-500 font-mono mb-6 uppercase tracking-widest">Status: Active</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full w-[45%] bg-blue-500" />
              </div>
           </div>

           {/* UI Metaphor: The AI Assistant */}
           <div className="absolute -right-10 bottom-10 glass-card p-4 rounded-2xl w-56 rotate-[4deg] animate-float-alt hidden lg:block">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"><Mic size={14}/></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Orbit AI</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">"Commander, you bridged to Berachain 2 days ago. Check for updates?"</p>
           </div>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section id="problem" className="relative z-10 py-40 border-y border-white/5 bg-zinc-950/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black mb-10 leading-tight">🚨 Web3 Isn’t Hard — <br/><span className="text-red-500">It’s Scattered</span></h2>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
               If you’re in Web3, this is your reality:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
             {[
               { title: "10+ Airdrops", desc: "You're farming multiple protocols across ecosystems simultaneously." },
               { title: "Links Everywhere", desc: "Discord links, dashboards, Twitter threads—scattered across 100 tabs." },
               { title: "Fragmented Tracking", desc: "Tracking in Sheets, notes in Docs, research in Notion, ideas in Apple Notes." },
               { title: "Lost Context", desc: "Returning to a project after a week and forgetting exactly where you left off." },
               { title: "Content Friction", desc: "Switching between 5 apps just to draft a thread about your latest research." },
               { title: "Mental Overload", desc: "Your brain is full of transaction hashes and bridge schedules." }
             ].map((item, idx) => (
               <div key={idx} className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-colors">
                  <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
                     <AlertCircle size={24}/>
                  </div>
                  <h3 className="text-xl font-black mb-4">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>

          <div className="text-center max-w-2xl mx-auto py-16 px-8 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-sm animate-collapse">
             <h3 className="text-3xl font-black mb-4 italic">You’re not disorganized.</h3>
             <p className="text-5xl font-black text-white leading-none tracking-tighter mb-6">Your tools are.</p>
             <p className="text-zinc-400 font-medium">And the more projects you touch, the more overwhelming it gets.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Meet Orbit - The UI Anatomy */}
      <section id="anatomy" className="relative z-10 py-40 max-w-7xl mx-auto px-6 scroll-mt-20">
         <div className="text-center mb-32">
            <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter italic">✨ Meet Orbit</h2>
            <p className="text-2xl text-zinc-400">A CRM designed for the speed of Web3.</p>
         </div>

         <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
               <div className="relative glass-card rounded-[3rem] border border-white/10 p-1 bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                  <div className="bg-[#050505] rounded-[2.8rem] overflow-hidden p-8">
                     <div className="flex gap-4 mb-8">
                        <div className="w-1/4 h-64 bg-zinc-900/50 rounded-2xl p-4 space-y-3">
                           <div className="h-6 w-full bg-blue-600 rounded-md" />
                           <div className="h-6 w-full bg-zinc-800 rounded-md" />
                           <div className="h-6 w-full bg-zinc-800 rounded-md" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <div className="aspect-square bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-pulse" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                           <div className="aspect-square bg-zinc-800/30 rounded-2xl" />
                        </div>
                     </div>
                  </div>
               </div>
               {/* Label Overlay */}
               <div className="absolute -top-6 -left-6 bg-white text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">The Command Center</div>
            </div>
            <div>
               <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">One Dashboard.<br/><span className="text-blue-500 italic">Total Control.</span></h2>
               <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                  Orbit replaces your messy bookmark folders and disjointed spreadsheets with a single, high-fidelity operating system.
               </p>
               <div className="grid gap-6">
                  {[
                    { t: "Track every project", d: "Categorize by ecosystem, goal, or client." },
                    { t: "Store every link", d: "Never search your Discord history for a dashboard again." },
                    { t: "Document every action", d: "Contextual logs that tell the story of your progress." },
                    { t: "Plan content updates", d: "Built-in social planners to share your alpha instantly." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-all">
                       <CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={20} />
                       <div>
                          <h4 className="font-bold text-lg">{item.t}</h4>
                          <p className="text-sm text-zinc-500">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Section 4: How It Works - Intuitive UI Storyboard */}
      <section id="process" className="relative z-10 py-40 bg-zinc-900/20 border-y border-white/5 scroll-mt-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-32">
               <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter italic">🧭 Simple by Design</h2>
               <p className="text-zinc-500 font-bold uppercase tracking-[0.4em]">Execution over Setup</p>
            </div>

            <div className="grid md:grid-cols-3 gap-16 relative">
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 hidden md:block" />
               
               {[
                  {
                     step: "1",
                     title: "Create Folders",
                     desc: "Organize by context: Airdrops, Research, Clients, or Testnets. Your sidebar stays clean and focused.",
                     icon: Folder,
                     ui: (
                        <div className="w-full h-40 bg-zinc-950 rounded-2xl border border-white/5 p-4 flex gap-3 opacity-60">
                           <div className="w-16 h-full bg-zinc-900 rounded-lg p-2 space-y-2">
                              <div className="h-4 w-full bg-blue-600 rounded" />
                              <div className="h-4 w-full bg-zinc-800 rounded" />
                           </div>
                           <div className="flex-1 grid grid-cols-2 gap-2">
                              <div className="h-full bg-zinc-900/50 rounded-lg" />
                              <div className="h-full bg-zinc-900/50 rounded-lg" />
                           </div>
                        </div>
                     )
                  },
                  {
                     step: "2",
                     title: "Deploy Projects",
                     desc: "Click ➕ Create Project. Instantly turn any protocol or idea into a visual card on your main dashboard.",
                     icon: Plus,
                     ui: (
                        <div className="w-full h-40 bg-zinc-950 rounded-2xl border border-white/5 p-6 flex items-center justify-center opacity-60">
                           <div className="w-32 h-20 glass-card rounded-xl border-white/20 flex flex-col items-center justify-center gap-2">
                              <Plus size={20} className="text-blue-500" />
                              <div className="h-1.5 w-16 bg-zinc-800 rounded-full" />
                           </div>
                        </div>
                     )
                  },
                  {
                     step: "3",
                     title: "Open The Vault",
                     desc: "Click any card to enter its workspace. Store links, log daily actions, and plan your execution.",
                     icon: Layout,
                     ui: (
                        <div className="w-full h-40 bg-zinc-950 rounded-2xl border border-white/5 p-4 flex flex-col gap-2 opacity-60">
                           <div className="flex gap-2">
                              <div className="w-8 h-8 rounded bg-blue-500" />
                              <div className="h-2 w-20 bg-zinc-800 rounded-full mt-3" />
                           </div>
                           <div className="flex-1 bg-zinc-900 rounded-xl" />
                        </div>
                     )
                  }
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center group relative z-10">
                     <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black mb-10 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                        {item.step}
                     </div>
                     <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                     <p className="text-zinc-500 leading-relaxed mb-10 text-sm">{item.desc}</p>
                     {item.ui}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Section 5: The "Soccer" Use Case Spotlight */}
      <section id="example" className="relative z-10 py-40 max-w-6xl mx-auto px-6 scroll-mt-20">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <div className="inline-flex px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Real Use Case</div>
               <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">🔁 Airdrop Farming <br/><span className="text-blue-500 italic">Without Stress</span></h2>
               <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                  Let’s say you’re farming multiple airdrops. Orbit becomes your memory so your brain doesn’t have to be.
               </p>
               <div className="space-y-6">
                  {[
                     { s: "Step 1", t: "Create 'Airdrops' Folder", d: "Initialize your workspace in seconds." },
                     { s: "Step 2", t: "Add 'Soccer' Project", d: "Include the website: soccer.com." },
                     { s: "Step 3", t: "Log Daily Notes", d: "Record bridges, swaps, and interactions." },
                     { s: "Step 4", t: "Track Progress", d: "Move the slider as you reach milestones." }
                  ].map((step, i) => (
                     <div key={i} className="flex gap-4 group">
                        <div className="text-blue-500 font-mono text-xs font-black pt-1">{step.s}</div>
                        <div>
                           <h4 className="font-black text-lg group-hover:text-blue-400 transition-colors">{step.t}</h4>
                           <p className="text-sm text-zinc-600">{step.d}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
               <div className="relative glass-card rounded-[3rem] p-10 border border-white/10 shadow-2xl bg-[#050505]">
                  <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl">SO</div>
                        <h3 className="text-2xl font-black">Soccer</h3>
                     </div>
                     <div className="text-[10px] font-mono text-zinc-500 uppercase">Vault Secure</div>
                  </div>
                  <div className="space-y-6">
                     <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 font-mono text-xs text-blue-400">
                        // 04-20-2024: Bridged 1.5 ETH. Swapped for SOCCER.
                     </div>
                     <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 font-mono text-xs text-zinc-500">
                        // 04-21-2024: Claimed faucet tokens. Joined Discord.
                     </div>
                     <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-white/5"><Twitter size={14} className="text-zinc-600"/></div>
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-white/5"><Globe size={14} className="text-zinc-600"/></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 6: Orbit AI Feature Spotlight */}
      <section id="ai" className="relative z-10 py-40 border-y border-white/5 bg-zinc-950/20 scroll-mt-20">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex p-4 bg-red-500/10 text-red-500 rounded-3xl mb-10">
               <Mic size={40} className="animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">Your Voice-Enabled <br/><span className="text-red-500">Second Brain</span></h2>
            <p className="text-2xl text-zinc-400 mb-12 leading-relaxed">
               Orbit isn't just a database. It's an intelligent assistant. Talk to your command center to get insights, open projects, and recall forgotten research instantly.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
               <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5">
                  <h4 className="font-black text-xl mb-3 flex items-center gap-2">
                     <Fingerprint size={20} className="text-red-500"/> Context Aware
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">The AI knows exactly what's in your vault. Ask "What was that Berachain note from last week?" and get an instant answer.</p>
               </div>
               <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5">
                  <h4 className="font-black text-xl mb-3 flex items-center gap-2">
                     <Command size={20} className="text-red-500"/> Hands-Free Navigation
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Navigate your projects using only your voice. "Orbit, open the Soccer project" instantly takes you to the right workspace.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Section 7: Comparison Table */}
      <section id="comparison" className="relative z-10 py-40 max-w-7xl mx-auto px-6 scroll-mt-20">
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-8xl font-black mb-6 tracking-tighter italic">🧠 Built for Performance</h2>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="border-b border-white/10">
                     <th className="pb-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Platform</th>
                     <th className="pb-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Core Problem</th>
                     <th className="pb-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Orbit Solution</th>
                  </tr>
               </thead>
               <tbody>
                  {[
                     { tool: "Google Sheets", prob: "Ugly, manual, easy to forget", sol: "Visual Executive Dashboard" },
                     { tool: "Notion", prob: "Overkill, too much setup time", sol: "Zero-friction Context Spaces" },
                     { tool: "Bookmarks", prob: "They go there to die", sol: "Active Project Persistence" },
                     { tool: "Notes Apps", prob: "No structure, messy links", sol: "Organized Multi-modality Vault" }
                  ].map((item, i) => (
                     <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="py-10 text-2xl font-black">{item.tool}</td>
                        <td className="py-10 text-zinc-500 font-medium">{item.prob}</td>
                        <td className="py-10 text-xl font-bold flex items-center gap-3">
                           <CheckCircle2 size={18} className="text-blue-500" />
                           {item.sol}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-60 text-center px-6 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
         <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-none relative z-10">🚀 Stop Managing Chaos. <br/><span className="text-blue-500">Start Orbiting.</span></h2>
         <div className="relative z-10 flex flex-col items-center gap-10">
            <button 
              onClick={goToAuth}
              className="px-16 py-8 bg-white text-black rounded-[3rem] font-black text-3xl hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_80px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-tighter"
            >
               Enter Orbit
            </button>
            <div className="flex flex-col gap-2 items-center opacity-40">
               <p className="font-black text-xs uppercase tracking-[0.5em] text-zinc-400">One dashboard. One flow. One orbit.</p>
               <p className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest mt-2">v1.2.5 STABLE • VAULT ENCRYPTED • AI ENABLED</p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-24 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-600" />
                  <span className="text-2xl font-black tracking-tighter">ORBIT</span>
               </div>
               <p className="text-zinc-500 max-w-sm leading-relaxed font-medium">
                  Centralize your Web3 workflow. Orbit is the project organizer for builders, founders, and hunters.
               </p>
            </div>
            <div>
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Product</h5>
               <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  <li><button onClick={() => goToDocs('documentation')} className="hover:text-white transition-colors">Documentation</button></li>
                  <li><button onClick={() => goToDocs('architecture')} className="hover:text-white transition-colors">OS Architecture</button></li>
                  <li><button onClick={() => goToDocs('changelog')} className="hover:text-white transition-colors">Changelog</button></li>
               </ul>
            </div>
            <div>
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Connect</h5>
               <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-widest opacity-30 cursor-not-allowed">
                  <li>X / Twitter (Pending)</li>
                  <li>Discord (Pending)</li>
                  <li>Telegram (Pending)</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-800">
            <span>© 2024 ORBIT SYSTEMS • DECENTRALIZED PRODUCTIVITY</span>
            <span className="uppercase tracking-[0.3em]">Built by HAMSTAR</span>
         </div>
      </footer>
    </div>
  );
};
