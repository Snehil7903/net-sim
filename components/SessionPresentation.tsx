"use client";
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Lock, Unlock, RefreshCw, Key, ShieldCheck, Database, FileCode } from 'lucide-react';

export default function SessionPresentation() {
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('Closed');
  const [text] = useState("NIAMT_SECURE_2026");
  const containerRef = useRef(null);

  const startSequence = () => {
    const tl = gsap.timeline();
    reset();

    // 1. Session Layer: Negotiation (Yellow)
    setSessionStatus('Negotiating...');
    tl.to(".session-indicator", { backgroundColor: "#facc15", scale: 1.5, duration: 0.4 });
    tl.fromTo(".session-log", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });

    // 2. Presentation Layer: Formatting/Compression (Blue)
    tl.to(".status-text", { textContent: "Formatting MIME...", duration: 0.5 });
    tl.to(".data-source", { scale: 0.9, opacity: 0.5, duration: 0.4 });
    tl.call(() => setIsFormatted(true));
    tl.to(".format-icon", { rotate: 180, color: "#60a5fa", duration: 0.5 });

    // 3. Presentation Layer: Encryption (Gold)
    tl.to(".encryption-gear", { rotate: 360, scale: 1.2, duration: 1, ease: "back.inOut(1.7)" });
    tl.call(() => {
      setIsEncrypted(true);
      setSessionStatus('Active');
    });
    
    // 4. Final: Session Established
    tl.to(".session-indicator", { backgroundColor: "#22c55e", scale: 1, duration: 0.3 });
    tl.to(".status-text", { textContent: "TLS 1.3 Tunnel Established", color: "#22c55e", duration: 0.5 });
  };

  const reset = () => {
    setIsEncrypted(false);
    setIsFormatted(false);
    setSessionStatus('Closed');
    gsap.set(".encryption-gear", { rotate: 0, scale: 1 });
    gsap.set(".format-icon", { rotate: 0, color: "#475569" });
    gsap.set(".data-source", { scale: 1, opacity: 1 });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-2">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <ShieldCheck className="text-yellow-500" size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Session & Presentation</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={startSequence}
            className="flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm shadow-lg shadow-yellow-900/20"
          >
            <Lock size={16} /> Secure Tunnel
          </button>
          <button onClick={reset} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-400">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative bg-[#020617] rounded-[2rem] border border-white/5 p-6 md:p-12 min-h-[500px] md:min-h-[400px] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
        
        {/* Session Badge */}
        <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/5">
          <div className="session-indicator w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Status: {sessionStatus}
          </span>
        </div>

        {/* The Pipeline */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-4xl relative z-10">
          
          {/* Step 1: Raw Data */}
          <div className="data-source flex-1 w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Database size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 font-mono uppercase">Raw App Data</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-white/5 rounded-2xl font-mono text-blue-400 text-sm shadow-inner">
              {text}
            </div>
          </div>

          {/* Transformation Center (Mobile Vertical / Desktop Horizontal) */}
          <div className="flex flex-row md:flex-col items-center gap-6 py-4 md:py-0">
            <div className="format-icon text-slate-600 transition-colors">
              <FileCode size={28} />
            </div>
            <div className="encryption-gear p-4 rounded-full bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.05)]">
              <Key size={32} className="text-yellow-500" />
            </div>
          </div>

          {/* Step 2: Formatted & Encrypted */}
          <div className="flex-1 w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Unlock size={14} className={isEncrypted ? "text-yellow-500" : "text-slate-500"} />
              <p className="text-[10px] text-slate-500 font-mono uppercase">Presentation Output</p>
            </div>
            <div className={`p-4 border-2 transition-all duration-700 rounded-2xl font-mono text-sm break-all min-h-[60px] flex items-center justify-center ${
              isEncrypted 
              ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
              : 'bg-slate-900 border-white/5 text-slate-600'
            }`}>
              {isEncrypted ? '0xEF_99_A1_7C_22' : isFormatted ? '{"data": "NIAMT..."}' : 'Waiting...'}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 w-full max-w-lg">
          <div className="status-text text-center text-[11px] font-mono text-slate-500 mb-6 uppercase tracking-widest h-4">
             {/* GSAP updates this text */}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "MIME", val: "app/json" },
              { label: "Enc", val: "AES-256" },
              { label: "Auth", val: "OAUTH2" }
            ].map((item, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 flex flex-col items-center min-w-[80px]">
                <span className="text-[8px] text-slate-500 font-bold uppercase">{item.label}</span>
                <span className="text-[10px] text-slate-300 font-mono">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10 pointer-events-none">
          <div className="absolute inset-0 border border-yellow-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-10 border border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </div>
      </div>
    </div>
  );
}