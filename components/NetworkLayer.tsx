"use client";
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { MapPin, Zap } from 'lucide-react';

const ROUTERS = [
  { id: 'R1', x: 10, y: 50, connections: ['R2', 'R3'] },
  { id: 'R2', x: 40, y: 20, connections: ['R1', 'R4', 'R5'] },
  { id: 'R3', x: 40, y: 80, connections: ['R1', 'R5'] },
  { id: 'R4', x: 80, y: 20, connections: ['R2', 'R6'] },
  { id: 'R5', x: 70, y: 60, connections: ['R2', 'R3', 'R6'] },
  { id: 'R6', x: 90, y: 50, connections: ['R4', 'R5'] },
];

export default function NetworkLayer() {
  const [target, setTarget] = useState('R6');
  const [path, setPath] = useState(['R1', 'R2', 'R4', 'R6']); // Example Dijkstra result

  const animatePath = () => {
    const tl = gsap.timeline();
    // Reset all wires
    tl.set(".route-line", { stroke: "#1e293b", strokeWidth: 2 });
    
    // Animate the specific path
    path.forEach((nodeId, i) => {
      if (i < path.length - 1) {
        const lineId = `#line-${nodeId}-${path[i+1]}` || `#line-${path[i+1]}-${nodeId}`;
        tl.to(`.node-${nodeId}`, { scale: 1.3, fill: "#f97316", duration: 0.3 });
        tl.to(`.line-${nodeId}-${path[i+1]}, .line-${path[i+1]}-${nodeId}`, { 
          stroke: "#f97316", 
          strokeWidth: 4, 
          duration: 0.5 
        }, "-=0.2");
      } else {
        tl.to(`.node-${nodeId}`, { scale: 1.3, fill: "#f97316", duration: 0.3 });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <span className="text-xs font-mono text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Protocol: OSPF (Link State)
          </span>
        </div>
        <button 
          onClick={animatePath}
          className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-orange-900/20"
        >
          <Zap size={16} /> Trace Route
        </button>
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/5 h-[450px] overflow-hidden shadow-inner">
        <svg className="w-full h-full p-10">
          {/* Draw Wires First (Background) */}
          {ROUTERS.map(router => 
            router.connections.map(connId => {
              const targetRouter = ROUTERS.find(r => r.id === connId);
              if (!targetRouter) return null;
              return (
                <line 
                  key={`${router.id}-${connId}`}
                  className={`route-line line-${router.id}-${connId} stroke-slate-800`}
                  x1={`${router.x}%`} y1={`${router.y}%`}
                  x2={`${targetRouter.x}%`} y2={`${targetRouter.y}%`}
                  strokeWidth="2"
                />
              );
            })
          )}

          {/* Draw Router Nodes */}
          {ROUTERS.map((router) => (
            <g key={router.id} className="cursor-pointer" onClick={() => setTarget(router.id)}>
              <circle 
                className={`node-${router.id} fill-slate-700 transition-colors duration-300`}
                cx={`${router.x}%`} cy={`${router.y}%`} r="14" 
              />
              <text 
                x={`${router.x}%`} y={`${router.y}%`} 
                dy=".3em" textAnchor="middle" 
                className="fill-white text-[10px] font-bold pointer-events-none"
              >
                {router.id}
              </text>
              <text 
                x={`${router.x}%`} y={`${router.y + 6}%`} 
                textAnchor="middle" 
                className="fill-slate-500 text-[8px] font-mono"
              >
                192.168.1.{router.id.slice(1)}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-6 right-8 text-right">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Target Destination</p>
          <p className="text-xl font-bold text-orange-500">Node {target}</p>
        </div>
      </div>
    </div>
  );
}