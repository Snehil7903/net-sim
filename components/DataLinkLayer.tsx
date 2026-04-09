"use client";
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

type Packet = { id: number; status: 'idle' | 'sending' | 'ack' | 'lost' };

export default function DataLinkLayer() {
  const [packets, setPackets] = useState<Packet[]>([
    { id: 1, status: 'idle' }, { id: 2, status: 'idle' }, { id: 3, status: 'idle' }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef(null);

  const startSimulation = async () => {
    setIsSimulating(true);
    for (let i = 0; i < packets.length; i++) {
      await sendPacket(i);
    }
    setIsSimulating(false);
  };

  const sendPacket = (index: number) => {
    return new Promise((resolve) => {
      // Update state to sending
      setPackets(prev => prev.map((p, i) => i === index ? { ...p, status: 'sending' } : p));

      const tl = gsap.timeline({
        onComplete: () => {
          setPackets(prev => prev.map((p, i) => i === index ? { ...p, status: 'ack' } : p));
          resolve(true);
        }
      });

      // Packet travels to receiver
      tl.to(`#packet-${index}`, { x: 350, duration: 1.5, ease: "power1.inOut" });
      // Small pause for "processing"
      tl.to({}, { duration: 0.2 });
      // ACK travels back
      tl.to(`#packet-${index}`, { x: 0, duration: 1, ease: "power1.in" });
    });
  };

  const reset = () => {
    setPackets(packets.map(p => ({ ...p, status: 'idle' })));
    gsap.set(".packet-box", { x: 0 });
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4 items-center">
        <button 
          onClick={startSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2 rounded-xl transition-all font-bold"
        >
          <Play size={18} /> Start Stop-and-Wait
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl transition-all"
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      <div ref={containerRef} className="relative bg-[#030712] rounded-3xl border border-white/10 p-12 min-h-[400px] flex flex-col justify-around overflow-hidden shadow-2xl">
        {/* Visual Labels */}
        <div className="flex justify-between text-xs font-mono text-slate-500 uppercase tracking-widest absolute top-6 left-12 right-12">
          <span>Sender (NIAMT-Node-A)</span>
          <span>Receiver (NIAMT-Node-B)</span>
        </div>

        {/* The Channel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[2px] bg-slate-800/50 dash-line" />

        {packets.map((packet, i) => (
          <div key={packet.id} className="relative flex items-center h-16">
            {/* Packet Visual */}
            <div 
              id={`packet-${i}`}
              className={`packet-box w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs border-2 z-10 transition-colors duration-300 ${
                packet.status === 'idle' ? 'bg-slate-800 border-slate-600' :
                packet.status === 'sending' ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_#3b82f6]' :
                'bg-emerald-600 border-emerald-400 shadow-[0_0_15px_#10b981]'
              }`}
            >
              P{packet.id}
            </div>
            
            {/* Status Indicator */}
            <div className="ml-4 text-[10px] font-mono text-slate-500">
              {packet.status.toUpperCase()}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-6 left-12 flex gap-6 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-600 rounded-full" /> Data Segment</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-600 rounded-full" /> Acknowledgement</div>
        </div>
      </div>
    </div>
  );
}