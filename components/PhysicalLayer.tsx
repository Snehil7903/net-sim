"use client";
import { useState, useEffect } from 'react';
import gsap from 'gsap';

const TOPOLOGIES = {
  BUS: 'Bus',
  STAR: 'Star',
  RING: 'Ring'
};

export default function PhysicalLayer() {
  const [topology, setTopology] = useState(TOPOLOGIES.BUS);

  useEffect(() => {
    // Entrance animation for nodes
    gsap.fromTo(".node", 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, stagger: 0.05, ease: "back.out(1.7)", duration: 0.5 }
    );

    // Animate "Electrical Signal" (The Packet)
    const tl = gsap.timeline({ repeat: -1 });
    
    if (topology === TOPOLOGIES.BUS) {
      tl.fromTo(".signal", { x: "15%", opacity: 0 }, { x: "85%", opacity: 1, duration: 2, ease: "none" });
    } else if (topology === TOPOLOGIES.STAR) {
      tl.fromTo(".signal", { attr: { x2: "50%", y2: "50%" } }, { attr: { x2: "80%", y2: "20%" }, duration: 1 });
    }
  }, [topology]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-900 rounded-xl w-fit border border-white/5">
        {Object.values(TOPOLOGIES).map((t) => (
          <button 
            key={t}
            onClick={() => setTopology(t)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              topology === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/10 h-[450px] overflow-hidden shadow-2xl">
        <svg className="w-full h-full p-10">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {topology === TOPOLOGIES.STAR && (
            <g>
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const x2 = 50 + 35 * Math.cos(angle * Math.PI/180);
                const y2 = 50 + 35 * Math.sin(angle * Math.PI/180);
                return (
                  <g key={i}>
                    <line className="wire stroke-slate-800" x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} strokeWidth="2" />
                    <circle className="node fill-slate-700" cx={`${x2}%`} cy={`${y2}%`} r="12" />
                  </g>
                );
              })}
              <circle className="node fill-blue-500" cx="50%" cy="50%" r="20" filter="url(#glow)" />
            </g>
          )}

          {topology === TOPOLOGIES.BUS && (
            <g>
              <line className="wire stroke-slate-800" x1="15%" y1="50%" x2="85%" y2="50%" strokeWidth="6" strokeLinecap="round" />
              <rect className="signal fill-blue-400" x="0" y="49%" width="20" height="2" filter="url(#glow)" />
              {[25, 50, 75].map((pos, i) => (
                <g key={i}>
                  <line className="wire stroke-slate-800" x1={`${pos}%`} y1="50%" x2={`${pos}%`} y2="35%" strokeWidth="2" />
                  <circle className="node fill-slate-700" cx={`${pos}%`} cy={`${pos}%`} r="12" />
                  <circle className="node fill-slate-700" cx={`${pos}%`} cy="35%" r="12" />
                </g>
              ))}
            </g>
          )}

          {topology === TOPOLOGIES.RING && (
            <g>
              <circle className="wire stroke-slate-800 fill-transparent" cx="50%" cy="50%" r="120" strokeWidth="2" />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                 const x = 50 + 32 * Math.cos(angle * Math.PI/180);
                 const y = 50 + 32 * Math.sin(angle * Math.PI/180);
                 return <circle key={i} className="node fill-slate-700" cx={`${x}%`} cy={`${y}%`} r="12" />;
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}