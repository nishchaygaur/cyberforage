import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { getPublishedTechRows, getEnabledTechnologies } from "@/lib/data/technologies";
import { getSiteSettings } from "@/lib/data/site";
import { getPublicSocialLinks } from "@/lib/data/social";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `Tools & Tech Stack — ${brand}`,
    description: "Battle-tested technologies, frameworks, and detection utilities powering Cyberforage.",
  };
}

export default async function ToolsPage() {
  const [techRows, fallbackTechs, siteSettings, socialLinks] = await Promise.all([
    getPublishedTechRows(),
    getEnabledTechnologies(),
    getSiteSettings(),
    getPublicSocialLinks(),
  ]);

  return (
    <main className="min-h-screen bg-[#040812] text-white flex flex-col">
      <Navbar socialLinks={socialLinks} />

      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2.5 block">
              TECHNOLOGY & STACK
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Tools & Technologies
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              The frameworks, telemetry agents, analysis engines, and cloud infrastructures powering Cyberforage defenses, labs, and research pipelines.
            </p>
          </div>

          {/* Directory */}
          <ToolsDirectory techRows={techRows} fallbackTechs={fallbackTechs} />
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
