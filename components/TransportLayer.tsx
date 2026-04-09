"use client";
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Share2, Activity, ShieldCheck } from 'lucide-react';

export default function TransportLayer() {
  const [step, setStep] = useState('Idle');
  const [isConnecting, setIsConnecting] = useState(false);
  const packetRef = useRef(null);

  const startHandshake = () => {
    setIsConnecting(true);
    const tl = gsap.timeline({
      onComplete: () => {
        setStep('Established');
        setIsConnecting(false);
      }
    });

    // 1. SYN
    setStep('Sending SYN...');
    tl.to(".tcp-packet", { x: 400, opacity: 1, duration: 0.8, ease: "power2.out" });
    tl.set(".tcp-packet", { opacity: 0, x: 0 });

    // 2. SYN-ACK
    tl.call(() => setStep('Received SYN-ACK...'));
    tl.fromTo(".tcp-packet", { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
    tl.set(".tcp-packet", { opacity: 0 });

    // 3. ACK
    tl.call(() => setStep('Sending ACK...'));
    tl.fromTo(".tcp-packet", { x: 0, opacity: 0 }, { x: 400, opacity: 1, duration: 0.8, ease: "power2.out" });
    
    // Established
    tl.to(".status-glow", { boxShadow: "0 0 20px #8b5cf6", duration: 0.5 });
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button 
          onClick={startHandshake}
          disabled={isConnecting}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-all font-bold shadow-lg shadow-purple-900/20"
        >
          <Share2 size={18} /> Establish TCP Connection
        </button>
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/5 p-12 min-h-[400px] flex flex-col justify-center items-center overflow-hidden shadow-2xl">
        
        {/* Connection Visualizer */}
        <div className="w-full max-w-lg flex justify-between items-center relative">
          {/* Client */}
          <div className={`status-glow w-24 h-24 rounded-2xl bg-slate-900 border-2 flex flex-col items-center justify-center gap-2 transition-all ${step === 'Established' ? 'border-purple-500' : 'border-slate-700'}`}>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Client</div>
            <ShieldCheck className={step === 'Established' ? 'text-purple-500' : 'text-slate-700'} />
          </div>

          {/* The Wire & Traveling Packet */}
          <div className="flex-1 h-[2px] bg-slate-800 mx-4 relative">
             <div className="tcp-packet absolute -top-2 left-0 w-4 h-4 bg-purple-500 rounded-full opacity-0 blur-[2px]" />
          </div>

          {/* Server */}
          <div className={`status-glow w-24 h-24 rounded-2xl bg-slate-900 border-2 flex flex-col items-center justify-center gap-2 transition-all ${step === 'Established' ? 'border-purple-500' : 'border-slate-700'}`}>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Server</div>
            <Activity className={step === 'Established' ? 'text-purple-500' : 'text-slate-700'} />
          </div>
        </div>

        {/* Handshake Text Log */}
        <div className="mt-12 w-full max-w-md bg-slate-950/80 rounded-xl p-4 border border-white/5 font-mono text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-xs">Protocol Stack: TCP/IP</span>
            <span className="text-purple-400 text-xs animate-pulse">{step}</span>
          </div>
          <div className="space-y-1">
            <p className={`text-xs transition-opacity ${step.includes('SYN') ? 'text-purple-300' : 'text-slate-700'}`}>[1] → SYN (Seq=0)</p>
            <p className={`text-xs transition-opacity ${step.includes('SYN-ACK') ? 'text-purple-300' : 'text-slate-700'}`}>[2] ← SYN-ACK (Seq=0, Ack=1)</p>
            <p className={`text-xs transition-opacity ${step.includes('ACK') ? 'text-purple-300' : 'text-slate-700'}`}>[3] → ACK (Seq=1, Ack=1)</p>
          </div>
        </div>

        {/* Window Size Simulation Placeholder */}
        <div className="absolute bottom-6 left-12 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Window Size</span>
            <span className="text-xl font-black text-purple-500">65535 <span className="text-xs font-normal">bytes</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}