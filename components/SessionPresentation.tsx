"use client";
import { useState } from 'react';
import gsap from 'gsap';
import { Lock, Unlock, RefreshCw, Key } from 'lucide-react';

export default function SessionPresentation() {
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [text, setText] = useState("NIAMT_DATA_2026");

  const startSecureSession = () => {
    const tl = gsap.timeline();
    
    // 1. Session Layer: Negotiation
    setSessionActive(true);
    tl.to(".session-indicator", { backgroundColor: "#facc15", scale: 1.2, duration: 0.3 });
    
    // 2. Presentation Layer: Encryption
    tl.to(".encryption-gear", { rotate: 360, duration: 1, ease: "power2.inOut" });
    tl.call(() => setIsEncrypted(true));
    
    // 3. Complete
    tl.to(".session-indicator", { backgroundColor: "#22c55e", scale: 1, duration: 0.3 });
  };

  const reset = () => {
    setIsEncrypted(false);
    setSessionActive(false);
    gsap.set(".encryption-gear", { rotate: 0 });
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button 
          onClick={startSecureSession}
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-yellow-900/20"
        >
          <Lock size={16} /> Init SSL/TLS Session
        </button>
        <button onClick={reset} className="text-slate-500 hover:text-white transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/5 p-8 min-h-[350px] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
        
        {/* Session Status Bubble */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className={`session-indicator w-3 h-3 rounded-full bg-slate-700 transition-colors duration-500`} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {sessionActive ? 'Session: Active (ID: #8821)' : 'Session: Closed'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-2xl">
          {/* Plain Text (Application Source) */}
          <div className="flex-1 text-center">
            <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase">Original Data</p>
            <div className="p-4 bg-slate-900 border border-white/5 rounded-xl font-mono text-blue-400">
              {text}
            </div>
          </div>

          {/* Encryption Engine */}
          <div className="relative">
            <div className="encryption-gear p-4 rounded-full bg-yellow-500/10 border-2 border-dashed border-yellow-500/30">
              <Key size={32} className="text-yellow-500" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-yellow-500 uppercase italic">
              RSA 2048-bit
            </div>
          </div>

          {/* Formatted Data (Presentation Output) */}
          <div className="flex-1 text-center">
            <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase">Presentation Layer (SSL)</p>
            <div className={`p-4 border transition-all duration-500 rounded-xl font-mono truncate ${isEncrypted ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
              {isEncrypted ? 'Ø×²À79!$#æ' : 'Waiting...'}
            </div>
          </div>
        </div>

        {/* MIME Visualization */}
        <div className="mt-12 flex gap-4">
            <span className="px-3 py-1 rounded bg-slate-800 text-[9px] font-mono text-slate-400 border border-white/5 uppercase">MIME: application/json</span>
            <span className="px-3 py-1 rounded bg-slate-800 text-[9px] font-mono text-slate-400 border border-white/5 uppercase">Encoding: Base64</span>
        </div>
      </div>
    </div>
  );
}