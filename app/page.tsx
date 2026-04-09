import Hero from "@/components/Hero";
import PhysicalLayer from "@/components/PhysicalLayer";
import DataLinkLayer from "@/components/DataLinkLayer";
import NetworkLayer from "@/components/NetworkLayer";
import TransportLayer from "@/components/TransportLayer";
import SessionPresentation from "@/components/SessionPresentation";
import ApplicationLayer from "@/components/ApplicationLayer";
import { RefreshCw, Unlock } from "lucide-react";

export default function Home() {
  return (
    <main className="relative">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <Hero />

      {/* Level 1: Physical Layer Section */}
      <section id="physical" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-2">Layer 01</span>
            <h2 className="text-5xl md:text-6xl font-bold">Physical Layer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* The Simulation Canvas (Takes up 2 columns) */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <PhysicalLayer />
            </div>

            {/* Documentation / Controls */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Topology & Media</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  The Physical Layer defines the electrical, mechanical, and functional specifications for activating and maintaining the physical link.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 font-mono">
                  <li>• Bit Stream Signaling</li>
                  <li>• Physical Topologies</li>
                  <li>• Transmission Modes (Simplex/Duplex)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-tighter text-slate-300 mb-2">Simulation Status</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-400 font-mono">Hardware Linked: 10Gbps Fiber Optic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Level 2: Data Link Layer Section */}
      <section id="datalink" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-emerald-500 font-mono text-sm tracking-widest uppercase mb-2">Layer 02</span>
            <h2 className="text-5xl md:text-6xl font-bold">Data Link Layer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Simulation */}
            <div className="lg:col-span-2">
              <DataLinkLayer />
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Flow Control Logic</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This layer ensures data is transferred reliably across the physical link. We're simulating **Stop-and-Wait ARQ**.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px]">1</div>
                    <p className="text-xs text-slate-500">Sender transmits one frame and waits.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px]">2</div>
                    <p className="text-xs text-slate-500">Receiver sends ACK if data is valid.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px]">3</div>
                    <p className="text-xs text-slate-500">Sender moves to next frame only after ACK arrives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="network" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-2">Layer 03</span>
            <h2 className="text-5xl md:text-6xl font-bold">Network Layer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <NetworkLayer />
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Routing & IP</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Network Layer is responsible for packet forwarding, including routing through intermediate routers.
                </p>

                <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 font-mono">Subnetting Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">IP Class:</span>
                      <span className="text-orange-400">Class C</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Subnet Mask:</span>
                      <span className="text-orange-400">255.255.255.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="transport" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2">Layer 04</span>
            <h2 className="text-5xl md:text-6xl font-bold">Transport Layer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <TransportLayer />
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Reliability & Flow</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Transport Layer provides end-to-end communication services. **TCP** ensures reliability, while **UDP** prioritizes speed.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                    <span className="block text-xs font-bold text-slate-300 mb-1">TCP</span>
                    <span className="text-[10px] text-slate-500 leading-tight">Connection-oriented, retransmits lost packets.</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                    <span className="block text-xs font-bold text-slate-300 mb-1">UDP</span>
                    <span className="text-[10px] text-slate-500 leading-tight">Connectionless, low latency (Gaming/Streaming).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="session-presentation" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-yellow-500 font-mono text-sm tracking-widest uppercase mb-2">Layers 05 & 06</span>
            <h2 className="text-5xl md:text-6xl font-bold">Session & Presentation</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SessionPresentation />
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Encryption & Control</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The **Presentation Layer** ensures that the information is in a readable format (Encryption/MIME), while the **Session Layer** manages the dialogue between computers.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Unlock size={14} className="text-yellow-600" />
                    <span className="text-xs text-slate-500 font-mono italic underline decoration-yellow-900">Compression & Encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw size={14} className="text-yellow-600" />
                    <span className="text-xs text-slate-500 font-mono italic underline decoration-yellow-900">Session Checkpoints & Recovery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="application" className="min-h-screen p-8 md:p-20 flex flex-col justify-center border-t border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-12">
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-2">Layer 07</span>
            <h2 className="text-5xl md:text-6xl font-bold">Application Layer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ApplicationLayer />
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">User Services</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This layer provides network services directly to applications. It handles DNS lookups, HTTP requests, and Email protocols.
                </p>

                <div className="mt-8 space-y-3">
                  {["HTTP/HTTPS", "DNS", "FTP", "SMTP"].map((proto) => (
                    <div key={proto} className="flex justify-between items-center p-2 bg-slate-900/50 rounded border border-white/5">
                      <span className="text-xs font-mono text-slate-300">{proto}</span>
                      <span className="text-[10px] text-blue-500 font-bold tracking-tighter uppercase underline decoration-blue-900">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}