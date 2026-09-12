import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CyberGlobe } from "./CyberGlobe";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      aria-label="Cyberforage Hero"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#00F0C0]/[0.04] blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.14em] sm:tracking-[0.22em] text-[#00E5BE] font-medium uppercase">
                CYBERSECURITY / RESEARCH / AI / AUTOMATION
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3">
              <span className="text-white">CYBER</span>
              <span className="text-[#00F0C0]">FORAGE</span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-5 tracking-tight">
              Explore. Build. Defend.
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed font-normal">
              A technology ecosystem for cybersecurity, security research,
              intelligent automation and defensive engineering.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00E5BE] text-[#04131E] font-semibold text-sm sm:text-base transition-all duration-200 hover:bg-[#00F0C0] shadow-[0_0_25px_rgba(0,229,190,0.35)] hover:shadow-[0_0_35px_rgba(0,240,192,0.5)] cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="#labs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#06101E]/80 hover:bg-[#09172B] text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#00E5BE]/60 text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer"
              >
                <span>Explore Labs</span>
              </a>
            </div>

            {/* Metadata Line */}
            <div className="flex items-center gap-3 pt-2">
              <span className="w-5 h-[2px] bg-[#00F0C0] rounded-full inline-block" aria-hidden="true" />
              <p className="text-xs sm:text-sm font-mono text-slate-400">
                <span className="text-slate-300">Real tools</span>
                <span className="mx-2 text-slate-600">/</span>
                <span className="text-slate-300">Practical security</span>
                <span className="mx-2 text-slate-600">/</span>
                <span className="text-slate-300">Open source</span>
              </p>
            </div>
          </div>

          {/* Right Column: 3D Cyber Globe & Orbiting Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <CyberGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};
