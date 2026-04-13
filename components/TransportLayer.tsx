"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Share2, Activity, ShieldCheck, Zap, RefreshCw, AlertCircle } from 'lucide-react';

type Protocol = 'TCP' | 'UDP';

export default function TransportLayer() {
  const [protocol, setProtocol] = useState<Protocol>('TCP');
  const [step, setStep] = useState('Idle');
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    gsap.killTweensOf(".packet-dot");
    gsap.set(".packet-dot", { x: 0, opacity: 0 });
    setStep('Idle');
    setIsSimulating(false);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    const width = containerRef.current?.offsetWidth || 400;
    const travelDist = width > 600 ? 400 : width * 0.6; // Responsive distance

    const tl = gsap.timeline({
      onComplete: () => {
        setStep(protocol === 'TCP' ? 'Established' : 'Streaming...');
        setIsSimulating(protocol === 'UDP'); // UDP keeps "streaming"
      }
    });

    if (protocol === 'TCP') {
      // 1. SYN
      setStep('Sending SYN...');
      tl.to(".packet-dot", { x: travelDist, opacity: 1, duration: 0.8, ease: "power2.out" });
      tl.set(".packet-dot", { opacity: 0, x: 0 });

      // 2. SYN-ACK
      tl.call(() => setStep('Received SYN-ACK...'));
      tl.fromTo(".packet-dot", { x: travelDist, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
      tl.set(".packet-dot", { opacity: 0 });

      // 3. ACK
      tl.call(() => setStep('Sending ACK...'));
      tl.fromTo(".packet-dot", { x: 0, opacity: 0 }, { x: travelDist, opacity: 1, duration: 0.8, ease: "power2.out" });
      
      tl.to(".status-glow", { borderColor: "#a855f7", boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)", duration: 0.5 });
    } else {
      // UDP: Connectionless Fire and Forget
      setStep('Pushing Datagrams...');
      tl.to(".packet-dot", {
        x: travelDist,
        opacity: 1,
        duration: 0.4,
        stagger: { each: 0.2, repeat: -1 },
        ease: "none",
        onStart: () => {
           // Simulate packet loss visually for UDP
           gsap.to(".packet-dot:nth-child(odd)", { opacity: 0, delay: 0.2, duration: 0.1 });
        }
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-4 md:px-0">
      {/* Protocol Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-white/10 gap-4">
        <div className="flex p-1 bg-black rounded-xl border border-white/5 w-full md:w-auto">
          {(['TCP', 'UDP'] as Protocol[]).map((p) => (
            <button
              key={p}
              onClick={() => { setProtocol(p); reset(); }}
              className={`flex-1 md:flex-none px-8 py-2 rounded-lg text-xs font-bold transition-all ${protocol === p ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={startSimulation} 
            disabled={isSimulating && protocol === 'TCP'}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-bold"
          >
            {protocol === 'TCP' ? <Share2 size={16} /> : <Zap size={16} />}
            {protocol === 'TCP' ? 'Start Handshake' : 'Flood Datagrams'}
          </button>
          <button onClick={reset} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-400">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative bg-[#020617] rounded-[2rem] border border-white/5 p-8 md:p-16 min-h-[450px] flex flex-col justify-center items-center overflow-hidden shadow-2xl">
        
        {/* Connection Visualization */}
        <div className="w-full max-w-2xl flex justify-between items-center relative">
          {/* Client Node */}
          <div className={`status-glow w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-slate-900 border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${step === 'Established' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800'}`}>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Client</span>
            <ShieldCheck size={24} className={step === 'Established' ? 'text-purple-400' : 'text-slate-700'} />
          </div>

          {/* Transport Medium (Wire) */}
          <div className="flex-1 h-[2px] bg-slate-800/50 mx-4 relative">
             {/* Multiple dots for UDP stream, only one used for TCP handshake */}
             <div className="packet-dot absolute -top-1.5 left-0 w-3 h-3 bg-purple-500 rounded-full opacity-0 shadow-[0_0_10px_#a855f7]" />
             <div className="packet-dot absolute -top-1.5 left-0 w-3 h-3 bg-purple-500 rounded-full opacity-0 shadow-[0_0_10px_#a855f7]" />
             <div className="packet-dot absolute -top-1.5 left-0 w-3 h-3 bg-purple-500 rounded-full opacity-0 shadow-[0_0_10px_#a855f7]" />
          </div>

          {/* Server Node */}
          <div className={`status-glow w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-slate-900 border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${step === 'Established' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800'}`}>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Server</span>
            <Activity size={24} className={step === 'Established' ? 'text-purple-400' : 'text-slate-700'} />
          </div>
        </div>

        {/* Dynamic Metadata Panel */}
        <div className="mt-12 w-full max-w-md bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Status: {step}</span>
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{protocol} Mode</span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            {protocol === 'TCP' ? (
              <>
                <p className={step.includes('SYN') && !step.includes('ACK') ? 'text-purple-400' : 'text-slate-600'}>→ [SYN] Seq=0 Win=65535</p>
                <p className={step.includes('SYN-ACK') ? 'text-purple-400' : 'text-slate-600'}>← [SYN, ACK] Seq=0 Ack=1</p>
                <p className={step.includes('Sending ACK') || step === 'Established' ? 'text-purple-400' : 'text-slate-600'}>→ [ACK] Seq=1 Ack=1</p>
              </>
            ) : (
              <>
                <p className="text-purple-400">→ [DATAGRAM] Length=1472 (No Handshake)</p>
                <p className="text-slate-500 italic flex items-center gap-1">
                  <AlertCircle size={10} /> Checksum verified, delivery not guaranteed.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Performance Metrics Overlay (Mobile Friendly) */}
        <div className="absolute bottom-6 left-8 flex gap-8">
           <div className="hidden sm:flex flex-col">
              <span className="text-[8px] text-slate-500 uppercase font-bold">Latency</span>
              <span className="text-sm font-mono text-purple-400">{protocol === 'TCP' ? '28ms' : '12ms'}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 uppercase font-bold">Overhead</span>
              <span className="text-sm font-mono text-purple-400">{protocol === 'TCP' ? '20-bytes' : '8-bytes'}</span>
           </div>
        </div>
      </div>
    </div>
  );
}