"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function Hero() {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(".packet", {
      x: 400,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.6,
      opacity: 0,
    });
  }, []);

  return (
    <section className="h-screen flex flex-col items-center justify-center relative">
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter z-10">
        OSI<span className="text-blue-500 underline decoration-2">LAB</span>
      </h1>
      
      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-slate-400 font-mono">Transmission Medium Simulator</p>
        {/* The "Wire" */}
        <div className="w-[400px] h-[2px] bg-slate-800 relative overflow-hidden">
          <div className="packet absolute top-0 left-0 w-8 h-[2px] bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
          <div className="packet absolute top-0 left-0 w-8 h-[2px] bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
        </div>
      </div>

      <div className="absolute bottom-12 animate-bounce flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent" />
      </div>
    </section>
  );
}