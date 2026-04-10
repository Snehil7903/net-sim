"use client";
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const TOPOLOGIES = {
  P2P: 'Point-to-Point',
  BUS: 'Bus',
  STAR: 'Star',
  RING: 'Ring',
  MESH: 'Mesh'
};

export default function PhysicalLayer() {
  const [topology, setTopology] = useState(TOPOLOGIES.BUS);
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Reset and Entrance for Nodes
    gsap.fromTo(".node",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.05, ease: "back.out(1.7)", duration: 0.5 }
    );

    // 2. Clear previous animations to prevent "stuck" signals
    gsap.killTweensOf(".signal-pulse");

    const tl = gsap.timeline({ repeat: -1 });

    if (topology === TOPOLOGIES.P2P) {
      // Moves from Left Node (20%) to Right Node (80%)
      tl.fromTo(".sig-p2p",
        { attr: { cx: "20%", opacity: 1 } },
        { attr: { cx: "80%" }, duration: 1.5, ease: "power1.inOut" }
      );
    }

    else if (topology === TOPOLOGIES.BUS) {
      // 1. Reset all bus signals
      tl.set(".sig-bus-main", { attr: { cx: "15%" }, opacity: 1 });
      tl.set(".sig-bus-branch", { opacity: 0, attr: { cy: "50%" } });

      // 2. Animate main signal across the backbone
      tl.to(".sig-bus-main", {
        attr: { cx: "85%" },
        duration: 3,
        ease: "none"
      });

      // 3. Trigger branch pulses at specific times (25%, 50%, 75% of 3 seconds)
      [25, 50, 75].forEach((pos, i) => {
        const timeAtPos = (pos - 15) / (85 - 15) * 3; // Calculate timing relative to 3s duration

        tl.to(`#sig-branch-${i}`, {
          opacity: 1,
          attr: { cy: "35%" },
          duration: 0.4,
          ease: "power1.out"
        }, timeAtPos); // Insert at the exact moment the main signal passes
      });

      tl.to(".signal-pulse", { opacity: 0, duration: 0.3 }); // Fade out at the end
    }

    else if (topology === TOPOLOGIES.STAR) {
      // Radiates from center (50,50) to all outer nodes
      tl.fromTo(".sig-star",
        { attr: { cx: "50%", cy: "50%" }, opacity: 1 },
        {
          attr: {
            cx: (i, target) => target.getAttribute('data-target-x'),
            cy: (i, target) => target.getAttribute('data-target-y')
          },
          stagger: 0.1,
          duration: 1,
          ease: "power2.out"
        }
      );
    }

    else if (topology === TOPOLOGIES.MESH) {
      // Pulses through all wires by animating opacity and stroke dash
      tl.fromTo(".sig-mesh",
        { strokeDashoffset: 100, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, stagger: 0.05, duration: 0.8 }
      );
      tl.to(".sig-mesh", { opacity: 0, duration: 0.5 });
    }

    else if (topology === TOPOLOGIES.RING) {
      // Use svgOrigin to rotate around the absolute center of the SVG (200, 200 for a 400x400 viewBox)
      tl.to(".sig-ring-group", {
        rotation: 360,
        svgOrigin: "200 200",
        duration: 4,
        ease: "none"
      });
    }

  }, [topology]);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-xl w-fit border border-white/5">
        {Object.values(TOPOLOGIES).map((t) => (
          <button key={t} onClick={() => setTopology(t)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${topology === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          > {t} </button>
        ))}
      </div>

      <div className="relative bg-[#030712] rounded-3xl border border-white/10 h-[500px] overflow-hidden shadow-2xl">
        <svg className="w-full h-full p-10" viewBox="0 0 400 400">
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {/* 1. Point-to-Point */}
          {topology === TOPOLOGIES.P2P && (
            <g>
              <line className="stroke-slate-800" x1="20%" y1="50%" x2="80%" y2="50%" strokeWidth="4" />
              <circle className="signal-pulse sig-p2p fill-blue-400" cx="20%" cy="50%" r="6" filter="url(#glow)" />
              <circle className="node fill-slate-700" cx="20%" cy="50%" r="15" />
              <circle className="node fill-slate-700" cx="80%" cy="50%" r="15" />
            </g>
          )}

          {/* 2. Bus */}
          {topology === TOPOLOGIES.BUS && (
            <g>
              {/* Main Backbone Wire */}
              <line className="stroke-slate-800" x1="15%" y1="50%" x2="85%" y2="50%" strokeWidth="6" strokeLinecap="round" />

              {/* Main Traveling Signal */}
              <circle className="signal-pulse sig-bus-main fill-blue-400" cx="15%" cy="50%" r="5" filter="url(#glow)" />

              {[25, 50, 75].map((pos, i) => (
                <g key={i}>
                  {/* Branch Wire */}
                  <line className="stroke-slate-800" x1={`${pos}%`} y1="50%" x2={`${pos}%`} y2="35%" strokeWidth="2" />

                  {/* Branch Signal (starts at backbone, moves to node) */}
                  <circle
                    id={`sig-branch-${i}`}
                    className="signal-pulse sig-bus-branch fill-blue-400 opacity-0"
                    cx={`${pos}%`} cy="50%" r="4"
                    filter="url(#glow)"
                  />

                  {/* The Node */}
                  <circle className="node fill-slate-700" cx={`${pos}%`} cy="35%" r="12" />
                </g>
              ))}
            </g>
          )}

          {/* 3. Star */}
          {topology === TOPOLOGIES.STAR && (
            <g>
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const x2 = 50 + 35 * Math.cos(angle * Math.PI / 180);
                const y2 = 50 + 35 * Math.sin(angle * Math.PI / 180);
                return (
                  <g key={i}>
                    <line className="stroke-slate-800" x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} strokeWidth="2" />
                    <circle className="signal-pulse sig-star fill-blue-400" cx="50%" cy="50%" r="4"
                      data-target-x={`${x2}%`} data-target-y={`${y2}%`} filter="url(#glow)" />
                    <circle className="node fill-slate-700" cx={`${x2}%`} cy={`${y2}%`} r="12" />
                  </g>
                );
              })}
              <circle className="node fill-blue-500" cx="50%" cy="50%" r="20" filter="url(#glow)" />
            </g>
          )}

          {/* 5. Mesh */}
          {topology === TOPOLOGIES.MESH && (
            <g>
              {[
                { x: 20, y: 30 }, { x: 80, y: 30 },
                { x: 20, y: 70 }, { x: 80, y: 70 },
                { x: 50, y: 50 }
              ].map((n1, i, arr) => (
                arr.slice(i + 1).map((n2, j) => (
                  <g key={`${i}-${j}`}>
                    <line className="wire stroke-slate-800" x1={`${n1.x}%`} y1={`${n1.y}%`} x2={`${n2.x}%`} y2={`${n2.y}%`} strokeWidth="1" />
                    <line className="signal sig-mesh stroke-blue-500/30 opacity-0" x1={`${n1.x}%`} y1={`${n1.y}%`} x2={`${n2.x}%`} y2={`${n2.y}%`} strokeWidth="2" filter="url(#glow)" />
                  </g>
                ))
              ))}
              {[
                { x: 20, y: 30 }, { x: 80, y: 30 },
                { x: 20, y: 70 }, { x: 80, y: 70 },
                { x: 50, y: 50 }
              ].map((n, i) => (
                <circle key={i} className="node fill-slate-700" cx={`${n.x}%`} cy={`${n.y}%`} r="12" />
              ))}
            </g>
          )}

          {/* 5. Ring */}
          {topology === TOPOLOGIES.RING && (
            <g>
              {/* The Wire - Radius 120, Center 200 */}
              <circle
                className="stroke-slate-800 fill-transparent"
                cx="200" cy="200" r="120"
                strokeWidth="3"
              />

              {/* The Rotating Signal Group */}
              <g className="sig-ring-group">
                {/* Positioned exactly at the top of the ring (200, 80) */}
                <circle
                  className="signal-pulse fill-blue-400"
                  cx="200" cy="80" r="6"
                  filter="url(#glow)"
                />
              </g>

              {/* The Nodes */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                // Convert polar to cartesian: x = center + r * cos(theta)
                const x = 200 + 120 * Math.cos((angle - 90) * Math.PI / 180);
                const y = 200 + 120 * Math.sin((angle - 90) * Math.PI / 180);
                return (
                  <circle
                    key={i}
                    className="node fill-slate-700"
                    cx={x} cy={y} r="12"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}