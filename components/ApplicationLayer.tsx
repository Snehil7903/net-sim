"use client";
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Globe, Server, Database, Search, ArrowRight, Layout, ShieldCheck, Cpu } from 'lucide-react';

export default function ApplicationLayer() {
  const [url, setUrl] = useState("niamt.ac.in");
  const [status, setStatus] = useState("Ready");
  const [resolvedIP, setResolvedIP] = useState("");
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef(null);

  const startRequest = () => {
    const tl = gsap.timeline();
    setShowContent(false);
    setResolvedIP("");
    
    // Initial Reset
    tl.set(".request-packet", { xPercent: 0, yPercent: 0, opacity: 0, scale: 1 });

    // 1. DNS Lookup Phase (Client to DNS)
    setStatus("DNS Lookup...");
    tl.to(".request-packet", { 
      opacity: 1, 
      xPercent: 150, // Moves to center (DNS)
      yPercent: -150, 
      duration: 0.8, 
      ease: "power2.inOut" 
    });
    
    tl.to(".dns-card", { scale: 1.1, borderColor: "#f97316", duration: 0.3 });
    tl.call(() => {
      setResolvedIP("14.139.226.10");
      setStatus("IP Resolved: 14.139.226.10");
    });
    tl.to(".dns-card", { scale: 1, borderColor: "rgba(255,255,255,0.1)", duration: 0.3 });

    // 2. Return to Client with IP
    tl.to(".request-packet", { xPercent: 0, yPercent: 0, duration: 0.6, ease: "back.in(1.7)" });

    // 3. HTTP GET Request (Client to Web Server)
    tl.call(() => setStatus("HTTP GET /index.html"));
    tl.to(".request-packet", { 
      xPercent: 300, // Moves to far right (Server)
      yPercent: 0, 
      duration: 1, 
      ease: "power3.inOut" 
    }, "+=0.2");
    
    tl.to(".server-card", { scale: 1.1, borderColor: "#10b981", duration: 0.3 });

    // 4. Response & Rendering
    tl.to(".request-packet", { 
      xPercent: 0, 
      opacity: 1, 
      duration: 0.8, 
      onComplete: () => {
        setStatus("200 OK - Rendering Page");
        setShowContent(true);
      }
    });

    // 5. Build Website Animation
    tl.fromTo(".web-element", 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }
    );
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-2">
      {/* Premium Browser Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="hidden sm:flex gap-1.5 px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 bg-black/40 rounded-xl border border-white/5">
          <Globe size={14} className="text-slate-500" />
          <input 
            type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-mono text-blue-400 w-full py-2.5 uppercase tracking-wider" 
          />
        </div>
        <button onClick={startRequest} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-[10px] tracking-widest">
          REQUEST <ArrowRight size={14} />
        </button>
      </div>

      <div ref={containerRef} className="relative bg-[#020617] rounded-[2.5rem] border border-white/5 p-6 md:p-12 min-h-[500px] flex flex-col justify-between overflow-hidden shadow-inner">
        
        {/* The Node Grid */}
        <div className="relative z-10 grid grid-cols-3 w-full h-48 md:h-64 pt-10">
          {/* Client Node */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-4 md:p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <Globe size={32} className="text-blue-500 animate-pulse" />
            </div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Client</p>
          </div>

          {/* DNS Center Node (Offset higher) */}
          <div className="flex flex-col items-center justify-start -mt-10">
            <div className="dns-card p-4 md:p-6 bg-orange-500/5 border border-white/10 rounded-[2rem] backdrop-blur-md transition-all">
              <Database size={32} className="text-orange-500" />
            </div>
            <p className="text-[9px] font-bold text-slate-500 uppercase mt-3 tracking-widest">DNS Root</p>
            <p className="text-[8px] font-mono text-orange-400 mt-1 h-3">{resolvedIP}</p>
          </div>

          {/* Web Server Node */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="server-card p-4 md:p-6 bg-emerald-500/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
              <Server size={32} className="text-emerald-500" />
            </div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Origin Server</p>
          </div>
        </div>

        {/* The Request Packet (Visualized as a sleek bar) */}
        <div className="absolute top-[35%] md:top-[42%] left-[12%] md:left-[15%] w-10 md:w-16 h-1.5 bg-blue-500 rounded-full request-packet opacity-0 shadow-[0_0_20px_#3b82f6] z-20">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
        </div>

        {/* Browser Content Render */}
        <div className="relative z-20 w-full max-w-lg mx-auto mt-[-20px] md:mt-0">
          {showContent && (
            <div className="bg-white rounded-3xl p-5 shadow-2xl transform-gpu overflow-hidden">
               <div className="web-element flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                  <ShieldCheck size={14} className="text-emerald-500" />
               </div>
               
               <div className="web-element h-3 w-2/3 bg-slate-100 rounded-full mb-3" />
               <div className="web-element h-3 w-full bg-slate-100 rounded-full mb-6" />
               
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="web-element h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Layout size={20} className="text-blue-200" />
                  </div>
                  <div className="web-element h-20 bg-slate-50 rounded-2xl" />
               </div>
               
               <div className="web-element h-10 w-full bg-blue-600 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
               </div>
            </div>
          )}
        </div>

        {/* Status Dashboard Footer */}
        <div className="mt-8 md:mt-0 flex justify-between items-center border-t border-white/5 pt-6">
           <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Current Status</span>
              <span className="text-xs font-bold text-blue-400 font-mono italic tracking-tight">{status}</span>
           </div>
           <div className="hidden sm:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Latency</span>
                <span className="text-[10px] text-slate-400 font-mono">14ms</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <Cpu size={14} className="text-slate-600" />
              </div>
           </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}