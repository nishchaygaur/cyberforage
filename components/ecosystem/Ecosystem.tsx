import React from "react";
import Link from "next/link";
import { Shield, Brain, Cog, ArrowRight } from "lucide-react";
import { ECOSYSTEM_CARDS } from "@/lib/constants/siteData";
import { SiteSettingsRow } from "@/lib/data/site";

interface EcosystemProps {
  siteSettings?: SiteSettingsRow | null;
}

export const Ecosystem: React.FC<EcosystemProps> = ({ siteSettings }) => {
  const getCardIcon = (icon: string) => {
    switch (icon) {
      case "security":
        return <Shield className="w-5 h-5 text-[#00F0C0]" />;
      case "ai":
        return <Brain className="w-5 h-5 text-[#A855F7]" />;
      case "automation":
        return <Cog className="w-5 h-5 text-[#00E5BE]" />;
      default:
        return <Shield className="w-5 h-5 text-[#00F0C0]" />;
    }
  };

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case "purple":
        return {
          iconBox: "bg-[#A855F7]/10 border-[#A855F7]/30 text-[#A855F7]",
          bullet: "bg-[#A855F7]",
          hoverBorder: "hover:border-[#A855F7]/40",
          glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        };
      case "teal":
      case "cyan":
      default:
        return {
          iconBox: "bg-[#00F0C0]/10 border-[#00F0C0]/30 text-[#00F0C0]",
          bullet: "bg-[#00F0C0]",
          hoverBorder: "hover:border-[#00F0C0]/40",
          glow: "hover:shadow-[0_0_20px_rgba(0,240,192,0.15)]",
        };
    }
  };

  return (
    <section
      id="ecosystem"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="The Cyberforage Ecosystem"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Intro Column (About) */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-3">
              THE CYBERFORAGE ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              More Than Just Projects
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Cyberforage brings together security, AI and automation into a
              unified ecosystem — building tools, labs and research for a safer
              digital world.
            </p>

            {/* Configured Owner/Creator Secondary Attribution (Only if configured) */}
            {siteSettings?.owner_name && (
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0]" />
                <span className="text-xs font-mono text-slate-300">
                  Directed by <span className="text-white font-medium">{siteSettings.owner_name}</span>
                  {siteSettings.owner_title && (
                    <span className="text-slate-400"> • {siteSettings.owner_title}</span>
                  )}
                </span>
              </div>
            )}

            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#06101E]/90 hover:bg-[#0A182E] text-slate-200 hover:text-white border border-[#00E5BE]/30 hover:border-[#00E5BE] text-sm font-medium transition-all group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-[#00E5BE] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right 3 Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ECOSYSTEM_CARDS.map((card) => {
              const styles = getAccentStyles(card.accent);
              return (
                <div
                  key={card.title}
                  className={`relative p-6 rounded-xl bg-[#081120]/80 border border-white/[0.07] backdrop-blur-sm transition-all duration-300 ${styles.hoverBorder} ${styles.glow} group flex flex-col`}
                >
                  {/* Top Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-5 ${styles.iconBox} transition-transform group-hover:scale-105`}
                  >
                    {getCardIcon(card.icon)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white tracking-tight mb-4">
                    {card.title}
                  </h3>

                  {/* Bullets List */}
                  <ul className="space-y-2.5 mt-auto">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center text-xs sm:text-sm text-slate-300 tracking-wide"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-2.5 flex-shrink-0 ${styles.bullet} opacity-80`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
