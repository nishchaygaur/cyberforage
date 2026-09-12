import React from "react";
import { ArrowRight, ChevronRight, Box, Shield, Search, Bug, Network } from "lucide-react";
import { AVAILABLE_LABS, LabItem } from "@/lib/constants/siteData";

export const CyberforageLabs: React.FC<{ labs?: LabItem[] }> = ({ labs = AVAILABLE_LABS }) => {
  const getLabIcon = (iconType: LabItem["iconType"], accent: LabItem["accent"]) => {
    switch (iconType) {
      case "cube":
        return <Box className="w-4 h-4 text-[#A855F7]" />;
      case "shield":
        return <Shield className="w-4 h-4 text-[#00E5BE]" />;
      case "search":
        return <Search className="w-4 h-4 text-[#00F0C0]" />;
      case "bug":
        return <Bug className="w-4 h-4 text-blue-400" />;
      case "network":
        return <Network className="w-4 h-4 text-indigo-400" />;
      default:
        return <Box className="w-4 h-4 text-[#00F0C0]" />;
    }
  };

  return (
    <section
      id="labs"
      className="relative py-16 md:py-24 border-t border-white/[0.04] overflow-hidden"
      aria-label="Cyberforage Labs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#060D19]/90 border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
            {/* Left Visual: Cyber Security Lab / Command Center Art */}
            <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-auto lg:h-[320px] bg-[#030813] border border-white/[0.06] flex items-center justify-center">
              {/* SVG Server Room / Lab Atmosphere */}
              <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-cover"
                aria-hidden="true"
              >
                {/* Background Room Perspective */}
                <rect width="400" height="300" fill="#030813" />
                <path d="M0 0 L100 80 L300 80 L400 0 Z" fill="#060F22" opacity="0.4" />
                <path d="M0 300 L100 220 L300 220 L400 300 Z" fill="#040A18" />
                <line x1="100" y1="80" x2="100" y2="220" stroke="#00F0C0" strokeWidth="0.5" opacity="0.2" />
                <line x1="300" y1="80" x2="300" y2="220" stroke="#00F0C0" strokeWidth="0.5" opacity="0.2" />

                {/* Server Racks Left */}
                <rect x="20" y="70" width="60" height="170" fill="#071428" stroke="#102A4A" strokeWidth="1" />
                {[90, 110, 130, 150, 170, 190, 210].map((y, i) => (
                  <g key={y}>
                    <line x1="25" y1={y} x2="75" y2={y} stroke="#173E6D" strokeWidth="1" />
                    <circle cx="32" cy={y - 5} r="1.5" fill={i % 2 === 0 ? "#00F0C0" : "#38BDF8"} />
                    <circle cx="38" cy={y - 5} r="1.5" fill={i % 3 === 0 ? "#A855F7" : "#00F0C0"} />
                  </g>
                ))}

                {/* Server Racks Right */}
                <rect x="320" y="70" width="60" height="170" fill="#071428" stroke="#102A4A" strokeWidth="1" />
                {[90, 110, 130, 150, 170, 190, 210].map((y, i) => (
                  <g key={y}>
                    <line x1="325" y1={y} x2="375" y2={y} stroke="#173E6D" strokeWidth="1" />
                    <circle cx="368" cy={y - 5} r="1.5" fill={i % 2 === 0 ? "#00F0C0" : "#A855F7"} />
                    <circle cx="362" cy={y - 5} r="1.5" fill="#38BDF8" />
                  </g>
                ))}

                {/* Center Big SOC Operator Screen */}
                <rect x="120" y="90" width="160" height="100" rx="4" fill="#0A182F" stroke="#00F0C0" strokeWidth="1.5" opacity="0.8" />
                <rect x="130" y="100" width="140" height="80" fill="#050C1A" />
                {/* Screen Content: Hologram silhouette / node network */}
                <circle cx="200" cy="130" r="18" fill="none" stroke="#00F0C0" strokeWidth="1" opacity="0.6" />
                <circle cx="200" cy="130" r="8" fill="#00F0C0" opacity="0.3" />
                <path d="M185 160 C 190 145, 210 145, 215 160" stroke="#00F0C0" strokeWidth="1.5" opacity="0.7" />
                <line x1="140" y1="165" x2="260" y2="165" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
                <line x1="145" y1="172" x2="245" y2="172" stroke="#00F0C0" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 2" />

                {/* Desk Glow Reflection */}
                <ellipse cx="200" cy="240" rx="90" ry="20" fill="url(#deskGlow)" opacity="0.7" />
                <defs>
                  <radialGradient id="deskGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00F0C0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#030813" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D19] via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* Middle Column: Lab Overview Text & CTA */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2">
                CYBERFORAGE LABS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                Hands-On Security. Real Scenarios.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Explore controlled environments, build skills, test defenses and
                learn through real-world security scenarios.
              </p>
              <div>
                <a
                  href="#labs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/10 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-medium text-white transition-all group"
                >
                  <span>Explore Labs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right Column: Available Labs Panel */}
            <div className="lg:col-span-4 bg-[#081222] rounded-xl border border-white/[0.06] p-4 sm:p-5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 px-2">
                Available Labs
              </div>
              <div className="space-y-1.5">
                {labs.map((lab) => (
                  <div
                    key={lab.name}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.05]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                        {getLabIcon(lab.iconType, lab.accent)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {lab.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#0A182C] border border-white/[0.06] text-[10px] font-mono text-slate-400">
                        {lab.category}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00F0C0] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
