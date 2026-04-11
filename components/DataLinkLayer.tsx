"use client";
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Play, RotateCcw, Settings2 } from 'lucide-react';

type Protocol = 'STOP_WAIT' | 'GBN' | 'SELECTIVE';
type Packet = { id: number; status: 'idle' | 'sending' | 'ack' | 'lost' };

export default function DataLinkLayer() {
  const [protocol, setProtocol] = useState<Protocol>('STOP_WAIT');
  const [packets, setPackets] = useState<Packet[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i + 1, status: 'idle' }))
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive logic: Calculate distance based on container width
  const getTravelDistance = () => {
    if (!containerRef.current) return 300;
    const width = containerRef.current.offsetWidth;
    return width > 768 ? width * 0.6 : width * 0.5;
  };

  const reset = () => {
    gsap.killTweensOf(".packet-box");
    setPackets(prev => prev.map(p => ({ ...p, status: 'idle' })));
    gsap.set(".packet-box", { x: 0, opacity: 1 });
    setIsSimulating(false);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    const distance = getTravelDistance();

    if (protocol === 'STOP_WAIT') {
      for (let i = 0; i < packets.length; i++) {
        await animatePacket(i, distance);
      }
    } else if (protocol === 'GBN') {
      // Simple GBN Visualization: Send window of 4
      const windowSize = 4;
      for (let i = 0; i < packets.length; i += windowSize) {
        const promises = [];
        for (let j = 0; j < windowSize && i + j < packets.length; j++) {
          promises.push(animatePacket(i + j, distance, j * 0.2));
        }
        await Promise.all(promises);
      }
    } else {
      // Selective Repeat: Simultaneous but independent
      const promises = packets.map((_, i) => animatePacket(i, distance, i * 0.3));
      await Promise.all(promises);
    }
    setIsSimulating(false);
  };

  const animatePacket = (index: number, xDist: number, delay = 0) => {
    return new Promise((resolve) => {
      setPackets(prev => prev.map((p, i) => i === index ? { ...p, status: 'sending' } : p));

      const tl = gsap.timeline({
        delay,
        onComplete: () => {
          setPackets(prev => prev.map((p, i) => i === index ? { ...p, status: 'ack' } : p));
          resolve(true);
        }
      });

      // Forward to Receiver
      tl.to(`#packet-${index}`, { x: xDist, duration: 1.2, ease: "power2.inOut" });
      // Back to Sender (ACK)
      tl.to(`#packet-${index}`, { x: 0, duration: 1, ease: "power2.in", delay: 0.1 });
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Controls Area */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex p-1 bg-black rounded-xl border border-white/10 overflow-x-auto whitespace-nowrap">
          {(['STOP_WAIT', 'GBN', 'SELECTIVE'] as Protocol[]).map((p) => (
            <button
              key={p}
              onClick={() => { setProtocol(p); reset(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${protocol === p ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={runSimulation} disabled={isSimulating} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2 rounded-xl text-sm font-bold transition-all">
            <Play size={16} /> Run
          </button>
          <button onClick={reset} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Simulation Canvas */}
      <div ref={containerRef} className="relative bg-[#030712] rounded-3xl border border-white/10 p-4 md:p-8 min-h-[500px] overflow-hidden shadow-2xl">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-8 px-2 md:px-10">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Sender</span>
          <span className="flex items-center gap-2">Receiver <div className="w-2 h-2 bg-emerald-500 rounded-full" /></span>
        </div>

        <div className="grid grid-cols-1 gap-3 max-w-4xl mx-auto">
          {packets.map((packet, i) => (
            <div key={packet.id} className="relative flex items-center group h-10 border-b border-white/[0.03]">
              {/* Packet */}
              <div 
                id={`packet-${i}`}
                className={`packet-box w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center font-bold text-[10px] border-2 z-10 transition-colors duration-300 ${
                  packet.status === 'idle' ? 'bg-slate-800 border-slate-700 text-slate-500' :
                  packet.status === 'sending' ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_#3b82f6]' :
                  'bg-emerald-600 border-emerald-400 text-white'
                }`}
              >
                {packet.id}
              </div>

              {/* Path Line (Visual only) */}
              <div className="absolute left-0 right-0 h-[1px] bg-white/5 -z-0" />
              
              <div className={`ml-auto text-[8px] font-mono px-2 py-0.5 rounded ${packet.status === 'ack' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-600'}`}>
                {packet.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Context Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] text-slate-400 font-mono">
          {protocol === 'STOP_WAIT' && "Wait for ACK before sending next."}
          {protocol === 'GBN' && "Window Size: 4 | Pipelined transmission."}
          {protocol === 'SELECTIVE' && "Independent ACKs for each segment."}
        </div>
      </div>
    </div>
  );
}