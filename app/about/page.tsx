import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Cpu, Zap, ArrowRight, CheckCircle2, User } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ContactCard } from "@/components/contact/ContactCard";
import { getSiteSettings } from "@/lib/data/site";
import { getContactInfo } from "@/lib/data/contact";
import { getPublicSocialLinks } from "@/lib/data/social";
import { ECOSYSTEM_CARDS } from "@/lib/constants/siteData";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `About — ${brand}`,
    description: siteSettings.short_description || "About the Cyberforage cybersecurity, security research, and AI technology ecosystem.",
  };
}

export default async function AboutPage() {
  const [siteSettings, contactInfo, socialLinks] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getPublicSocialLinks(),
  ]);

  const brand = siteSettings.site_name || "Cyberforage";

  return (
    <main className="min-h-screen bg-[#040812] text-white flex flex-col">
      <Navbar socialLinks={socialLinks} />

      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header & Mission */}
          <div className="max-w-3xl">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2.5 block">
              ECOSYSTEM & MISSION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              About {brand}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              {siteSettings.long_description ||
                "Cyberforage is an independent technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering."}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00F0C0]/10 border border-[#00F0C0]/30 text-xs font-mono text-[#00F0C0]">
              <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-pulse" />
              <span>Explore. Build. Defend.</span>
            </div>
          </div>

          {/* Creator / Leadership Identity (if configured in CMS) */}
          {siteSettings.owner_name && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#071220]/90 border border-white/[0.08] backdrop-blur-md">
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-3 block">
                LEADERSHIP & DIRECTION
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#00F0C0]/10 border border-[#00F0C0]/30 flex items-center justify-center flex-shrink-0 text-[#00F0C0]">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {siteSettings.owner_name}
                  </h2>
                  {siteSettings.owner_title && (
                    <p className="text-xs sm:text-sm font-mono text-[#00E5BE] mt-0.5">
                      {siteSettings.owner_title}
                    </p>
                  )}
                  {siteSettings.owner_description && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      {siteSettings.owner_description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Three Pillars */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                ARCHITECTURAL PILLARS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How Cyberforage Operates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ECOSYSTEM_CARDS.map((card) => {
                const isCyan = card.accent === "cyan";
                const isPurple = card.accent === "purple";
                const borderClass = isCyan
                  ? "border-[#00F0C0]/20 hover:border-[#00F0C0]/50"
                  : isPurple
                  ? "border-purple-500/20 hover:border-purple-500/50"
                  : "border-teal-500/20 hover:border-teal-500/50";

                const badgeColor = isCyan
                  ? "text-[#00F0C0] bg-[#00F0C0]/10 border-[#00F0C0]/30"
                  : isPurple
                  ? "text-purple-400 bg-purple-500/10 border-purple-500/30"
                  : "text-teal-400 bg-teal-500/10 border-teal-500/30";

                return (
                  <div
                    key={card.title}
                    className={`p-6 rounded-2xl bg-[#071220]/80 border ${borderClass} backdrop-blur-sm transition-all duration-300 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-[#00F0C0]">
                        {card.icon === "security" ? (
                          <Shield className="w-6 h-6 text-[#00F0C0]" />
                        ) : card.icon === "ai" ? (
                          <Cpu className="w-6 h-6 text-purple-400" />
                        ) : (
                          <Zap className="w-6 h-6 text-teal-400" />
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>

                      <ul className="space-y-2 mt-4">
                        {card.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5BE] flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/[0.06]">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        Core Capability
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Contact Card */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                DIRECT CONTACT & CHANNELS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Verified Communication Identity
              </h2>
            </div>

            <ContactCard
              siteSettings={siteSettings}
              contactInfo={contactInfo}
              socialLinks={socialLinks}
            />
          </div>

          {/* CTA Footer Row */}
          <div className="p-8 rounded-2xl bg-[#060D19]/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Explore Our Repositories & Defenses
              </h3>
              <p className="text-xs text-slate-300">
                Discover active projects, interactive simulation labs, and research reports.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-full bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/30 hover:border-[#00F0C0] text-xs font-semibold transition-all inline-flex items-center gap-1.5"
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] text-white border border-white/10 text-xs font-medium transition-colors"
              >
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
