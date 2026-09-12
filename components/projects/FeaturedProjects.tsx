import React from "react";
import { ArrowRight, ShieldCheck, Box, FileSearch } from "lucide-react";
import { FEATURED_PROJECTS } from "@/lib/constants/siteData";

export const FeaturedProjects: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="Featured Projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              FEATURED PROJECTS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Built for Real-World Security
            </h2>
          </div>
          <a
            href="#projects"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-[#00F0C0] transition-colors self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROJECT 1: SentinelX */}
          <div className="relative p-7 rounded-2xl bg-[#081220]/90 border border-white/[0.08] hover:border-[#00F0C0]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,192,0.12)] flex flex-col overflow-hidden group">
            {/* Top Right Radar Watermark */}
            <div
              className="absolute -top-6 -right-6 w-36 h-36 border border-[#00F0C0]/10 rounded-full pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute inset-4 border border-[#00F0C0]/15 rounded-full" />
              <div className="absolute inset-8 border border-[#00F0C0]/20 rounded-full" />
            </div>

            {/* Header: Icon + Title + Subtitle */}
            <div className="flex items-start gap-3.5 mb-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#00F0C0]/10 border border-[#00F0C0]/30 flex items-center justify-center text-[#00F0C0] flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  SentinelX
                </h3>
                <p className="text-xs font-mono text-[#00E5BE] font-medium tracking-wide">
                  AI-Powered SOC & Threat Intelligence Platform
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
              Collects, normalizes and analyzes logs, detects threats, enriches
              with intelligence and maps to MITRE ATT&CK.
            </p>

            {/* Visual Workflow Pipeline */}
            <div className="my-auto py-3 relative z-10">
              <div className="flex items-center flex-wrap gap-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                {["Logs", "Detect", "Alert", "Enrich", "Risk", "MITRE", "Incident"].map(
                  (step, idx, arr) => (
                    <React.Fragment key={step}>
                      <span
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          step === "MITRE"
                            ? "bg-[#00F0C0]/15 text-[#00F0C0] font-semibold border border-[#00F0C0]/30 shadow-[0_0_8px_rgba(0,240,192,0.2)]"
                            : "bg-[#060D17] text-slate-300 border border-white/5 hover:border-[#00F0C0]/20"
                        }`}
                      >
                        {step}
                      </span>
                      {idx < arr.length - 1 && (
                        <span className="text-[#00F0C0]/60 text-[9px] px-0.5">›</span>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 relative z-10 mt-auto">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/10 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-medium text-slate-200 hover:text-white transition-all group/btn"
              >
                <span>View Project</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>

          {/* PROJECT 2: CyberForge */}
          <div className="relative p-7 rounded-2xl bg-[#081220]/90 border border-white/[0.08] hover:border-[#A855F7]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)] flex flex-col overflow-hidden group">
            {/* Top Right 3D Wireframe Cube Watermark */}
            <div
              className="absolute top-3 right-3 w-28 h-28 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none text-[#A855F7]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polygon points="50,10 90,32 90,75 50,97 10,75 10,32" />
                <line x1="50" y1="10" x2="50" y2="55" />
                <line x1="50" y1="55" x2="90" y2="32" />
                <line x1="50" y1="55" x2="10" y2="32" />
                <line x1="50" y1="55" x2="50" y2="97" />
              </svg>
            </div>

            {/* Header: Icon + Title + Subtitle */}
            <div className="flex items-start gap-3.5 mb-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  CyberForge
                </h3>
                <p className="text-xs font-mono text-[#A855F7] font-medium tracking-wide">
                  Advanced Attack Simulation & Defense Lab
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
              A controlled environment for attack simulation, defensive validation,
              telemetry and detection evaluation.
            </p>

            {/* Tags */}
            <div className="my-auto py-3 relative z-10">
              <div className="flex flex-wrap gap-2">
                {["Attack Simulation", "Defense Lab", "Telemetry"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#0D1829] border border-white/[0.06] text-[11px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 relative z-10 mt-auto">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] hover:bg-[#A855F7]/10 border border-[#A855F7]/40 hover:border-[#A855F7] text-xs font-medium text-slate-200 hover:text-white transition-all group/btn"
              >
                <span>View Project</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A855F7] transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>

          {/* PROJECT 3: PDF Malware Analyzer */}
          <div className="relative p-7 rounded-2xl bg-[#081220]/90 border border-white/[0.08] hover:border-[#F43F5E]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,63,94,0.12)] flex flex-col overflow-hidden group">
            {/* Top Right Document Watermark */}
            <div
              className="absolute top-4 right-4 w-24 h-24 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none text-[#F43F5E]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
            </div>

            {/* Header: Icon + Title + Subtitle */}
            <div className="flex items-start gap-3.5 mb-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 flex items-center justify-center text-[#F43F5E] flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  PDF Malware Analyzer
                </h3>
                <p className="text-xs font-mono text-[#F43F5E] font-medium tracking-wide">
                  Detects malicious behavior in PDF files.
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
              Analyzes PDF structure, behavior and indicators to identify
              potential threats.
            </p>

            {/* Tags */}
            <div className="my-auto py-3 relative z-10">
              <div className="flex flex-wrap gap-2">
                {["YARA", "Static Analysis", "Malware Detection"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#0D1829] border border-white/[0.06] text-[11px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 relative z-10 mt-auto">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] hover:bg-[#F43F5E]/10 border border-[#F43F5E]/40 hover:border-[#F43F5E] text-xs font-medium text-slate-200 hover:text-white transition-all group/btn"
              >
                <span>View Project</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F43F5E] transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
