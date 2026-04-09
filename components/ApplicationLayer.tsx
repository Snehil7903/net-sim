"use client";
import { useState } from 'react';
import gsap from 'gsap';
import { Globe, Server, Database, Search, ArrowRight } from 'lucide-react';

export default function ApplicationLayer() {
  const [url, setUrl] = useState("niamt.ac.in");
  const [status, setStatus] = useState("Idle");
  const [resolvedIP, setResolvedIP] = useState("");
  const [showContent, setShowContent] = useState(false);

  const startRequest = () => {
    const tl = gsap.timeline();
    setShowContent(false);
    setResolvedIP("");
    
    // 1. DNS Lookup
    setStatus("DNS Lookup...");
    tl.to(".request-dot", { x: 200, y: -50, opacity: 1, duration: 0.8 }); // To DNS Server
    tl.to(".request-dot", { x: 0, y: 0, duration: 0.8, onComplete: () => {
      setResolvedIP("14.139.226.10");
      setStatus("IP Resolved");
    }});

    // 2. HTTP GET Request
    tl.call(() => setStatus("HTTP GET /index.html"));
    tl.to(".request-dot", { x: 400, opacity: 1, duration: 1, ease: "power2.inOut" }); // To Web Server
    
    // 3. Response & Rendering
    tl.to(".request-dot", { x: 0, opacity: 1, duration: 1 });
    tl.call(() => {
      setStatus("200 OK - Rendering");
      setShowContent(true);
    });
  };

  return (
    <div className="space-y-8">
      {/* Mock Browser Bar */}
      <div className="flex gap-2 p-2 bg-slate-900 border border-white/10 rounded-2xl">
        <div className="flex-1 flex items-center gap-3 px-4 bg-slate-950 rounded-xl border border-white/5">
          <Search size={14} className="text-slate-500" />
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-mono text-blue-400 w-full py-2" 
          />
        </div>
        <button 
          onClick={startRequest}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all font-bold"
        >
          Go <ArrowRight size={16} />
        </button>
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/5 p-12 min-h-[450px] overflow-hidden">
        {/* Network Infrastructure */}
        <div className="flex justify-between items-start h-full">
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-slate-800 rounded-2xl border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Globe size={32} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">YOU (Client)</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-[-40px]">
            <div className="p-4 bg-slate-800 rounded-2xl border border-orange-500/50">
              <Database size={32} className="text-orange-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 text-center">DNS ROOT<br/>{resolvedIP}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-slate-800 rounded-2xl border border-emerald-500/50">
              <Server size={32} className="text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">WEB SERVER</span>
          </div>
        </div>

        {/* The Traveling Request */}
        <div className="request-dot absolute top-[75px] left-[75px] w-3 h-3 bg-blue-500 rounded-full opacity-0 shadow-[0_0_10px_#3b82f6]" />

        {/* Rendered Website Output */}
        <div className="mt-20 flex justify-center">
          <div className={`w-full max-w-md p-6 bg-white rounded-xl transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <div className="h-4 w-2/3 bg-slate-200 rounded mb-4" />
             <div className="h-24 w-full bg-slate-100 rounded mb-4 flex items-center justify-center text-slate-400 text-xs italic">
                {url} Content Loaded Successfully
             </div>
             <div className="flex gap-2">
                <div className="h-8 flex-1 bg-blue-100 rounded" />
                <div className="h-8 flex-1 bg-blue-100 rounded" />
             </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-12">
           <p className="text-[10px] font-mono text-slate-500 uppercase">Status</p>
           <p className="text-sm font-bold text-blue-400">{status}</p>
        </div>
      </div>
    </div>
  );
}