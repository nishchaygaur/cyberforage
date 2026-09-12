import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Crosshair, FlaskConical, Cpu, Cloud, Settings } from "lucide-react";
import { EXPLORATION_DOMAINS, ExplorationDomain } from "@/lib/constants/siteData";

interface WhatWeExploreProps {
  items?: ExplorationDomain[];
}

export const WhatWeExplore: React.FC<WhatWeExploreProps> = ({
  items = EXPLORATION_DOMAINS,
}) => {
  const explorationItems = items && items.length > 0 ? items : EXPLORATION_DOMAINS;
  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return <Shield className="w-5 h-5 text-[#00F0C0]" />;
      case "target":
        return <Crosshair className="w-5 h-5 text-blue-400" />;
      case "flask":
        return <FlaskConical className="w-5 h-5 text-purple-400" />;
      case "brain":
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case "gear":
        return <Settings className="w-5 h-5 text-amber-400" />;
      default:
        return <Shield className="w-5 h-5 text-[#00F0C0]" />;
    }
  };

  const getBorderHover = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return "hover:border-[#00F0C0]/50 hover:shadow-[0_0_20px_rgba(0,240,192,0.15)]";
      case "target":
        return "hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]";
      case "flask":
        return "hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]";
      case "brain":
        return "hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]";
      case "cloud":
        return "hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]";
      case "gear":
        return "hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]";
      default:
        return "hover:border-[#00F0C0]/50";
    }
  };

  return (
    <section
      id="research"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="What We Explore"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              WHAT WE EXPLORE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Research. Build. Innovate.
            </h2>
          </div>
          <Link
            href="/research"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-[#00F0C0] transition-colors self-start sm:self-auto"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {explorationItems.map((domain) => (
            <div
              key={domain.title}
              className={`p-5 rounded-xl bg-[#071220]/75 border border-white/[0.06] backdrop-blur-sm transition-all duration-300 ${getBorderHover(
                domain.icon
              )} flex flex-col group`}
            >
              {/* Icon Box */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                {getDomainIcon(domain.icon)}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white tracking-tight mb-2">
                {domain.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {domain.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
