"use client";
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Zap, Share2, Navigation, MousePointer2 } from 'lucide-react';

type RoutingMode = 'OSPF' | 'RIP' | 'FLOODING';

const ROUTERS = [
  { id: 'R1', x: 10, y: 50, connections: ['R2', 'R3'] },
  { id: 'R2', x: 40, y: 20, connections: ['R1', 'R4', 'R5'] },
  { id: 'R3', x: 40, y: 80, connections: ['R1', 'R5'] },
  { id: 'R4', x: 75, y: 25, connections: ['R2', 'R6'] },
  { id: 'R5', x: 70, y: 75, connections: ['R2', 'R3', 'R6'] },
  { id: 'R6', x: 92, y: 50, connections: ['R4', 'R5'] },
];

export default function NetworkLayer() {
  const [mode, setMode] = useState<RoutingMode>('OSPF');
  const [isSimulating, setIsSimulating] = useState(false);
  const [startNode, setStartNode] = useState('R1');
  const [endNode, setEndNode] = useState('R6');

  // Simple Dijkstra for OSPF / RIP (RIP uses hop count, OSPF uses cost - simplified here)
  const findPath = (start: string, end: string) => {
    const queue = [[start]];
    const visited = new Set();
    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];
      if (node === end) return path;
      if (!visited.has(node)) {
        visited.add(node);
        const neighbors = ROUTERS.find(r => r.id === node)?.connections || [];
        for (const neighbor of neighbors) {
          queue.push([...path, neighbor]);
        }
      }
    }
    return [];
  };

  const resetSimulation = () => {
    gsap.killTweensOf(".route-line, .node-circle, .packet-dot");
    gsap.set(".route-line", { stroke: "#1e293b", strokeWidth: 2, opacity: 0.5 });
    gsap.set(".node-circle", { fill: "#334155", scale: 1 });
  };

  const startSimulation = () => {
    resetSimulation();
    setIsSimulating(true);
    const tl = gsap.timeline({ onComplete: () => setIsSimulating(false) });

    if (mode === 'OSPF' || mode === 'RIP') {
      const path = findPath(startNode, endNode);
      path.forEach((nodeId, i) => {
        // Highlight Node
        tl.to(`.node-${nodeId}`, { fill: "#f97316", scale: 1.2, duration: 0.3 });
        
        // Highlight Path Line
        if (i < path.length - 1) {
          const nextNode = path[i+1];
          tl.to(`.line-${nodeId}-${nextNode}, .line-${nextNode}-${nodeId}`, { 
            stroke: "#f97316", strokeWidth: 4, opacity: 1, duration: 0.4 
          }, "-=0.1");
        }
      });
    } else if (mode === 'FLOODING') {
      // Recursive animation for flooding
      const flood = (currentNode: string, visited = new Set(), depth = 0) => {
        if (visited.has(currentNode) || depth > 3) return;
        visited.add(currentNode);
        
        tl.to(`.node-${currentNode}`, { fill: "#3b82f6", duration: 0.2 }, depth * 0.3);
        
        const connections = ROUTERS.find(r => r.id === currentNode)?.connections || [];
        connections.forEach(neighbor => {
          tl.to(`.line-${currentNode}-${neighbor}, .line-${neighbor}-${currentNode}`, { 
            stroke: "#3b82f6", opacity: 1, duration: 0.3 
          }, depth * 0.3);
          flood(neighbor, visited, depth + 1);
        });
      };
      flood(startNode);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Protocol Selection & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex flex-wrap gap-2">
          {(['OSPF', 'RIP', 'FLOODING'] as RoutingMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); resetSimulation(); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${mode === m ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <button 
          onClick={startSimulation}
          disabled={isSimulating}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
        >
          <Zap size={16} /> Run {mode} Logic
        </button>
      </div>

      <div className="relative bg-[#020617] rounded-3xl border border-white/10 h-[400px] md:h-[500px] overflow-hidden">
        {/* Helper text for Mobile */}
        <div className="absolute top-4 left-4 z-10 md:hidden flex items-center gap-2 text-[10px] text-slate-500">
          <MousePointer2 size={12} /> Tap nodes to set Start/End
        </div>

        <svg className="w-full h-full p-6 md:p-12" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Background Wires */}
          {ROUTERS.map(router => 
            router.connections.map(connId => {
              const target = ROUTERS.find(r => r.id === connId);
              if (!target) return null;
              return (
                <line 
                  key={`${router.id}-${connId}`}
                  className={`route-line line-${router.id}-${connId} stroke-slate-800`}
                  x1={`${router.x}%`} y1={`${router.y}%`}
                  x2={`${target.x}%`} y2={`${target.y}%`}
                  strokeWidth="1.5"
                />
              );
            })
          )}
        </svg>

        {/* Router Nodes (Absolute Pos for Mobile Scaling) */}
        {ROUTERS.map((router) => (
          <div 
            key={router.id}
            onClick={() => isSimulating ? null : setEndNode(router.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${router.x}%`, top: `${router.y}%` }}
          >
            <div className={`node-circle node-${router.id} w-10 h-10 md:w-14 md:h-14 bg-slate-800 border-2 rounded-xl flex flex-col items-center justify-center transition-all 
              ${startNode === router.id ? 'border-orange-500 bg-orange-500/10' : 
                endNode === router.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'}`}
            >
              <span className="text-[10px] md:text-xs font-bold text-white">{router.id}</span>
              <span className="text-[6px] md:text-[8px] font-mono text-slate-500">.1.{router.id.slice(1)}</span>
            </div>
            
            {/* Label Tooltips */}
            {startNode === router.id && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-orange-500 font-bold uppercase tracking-tighter">Source</span>}
            {endNode === router.id && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">Dest</span>}
          </div>
        ))}

        {/* Protocol Metadata Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/5 space-y-1 w-full md:w-auto">
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{mode} Details</p>
            <p className="text-[9px] text-slate-400 font-mono">
              {mode === 'OSPF' && "> Dijkstra's Algorithm | Best Cost Path"}
              {mode === 'RIP' && "> Distance Vector | Bellman-Ford | Hop Count: " + (findPath(startNode, endNode).length - 1)}
              {mode === 'FLOODING' && "> Packet Broadcast | TTL: 3 | Every link used"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}