import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ResearchDirectory } from "@/components/research/ResearchDirectory";
import { getPublishedResearchRows, getPublishedArticles } from "@/lib/data/research";
import { getSiteSettings } from "@/lib/data/site";
import { getPublicSocialLinks } from "@/lib/data/social";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `Research & Insights — ${brand}`,
    description: "Cybersecurity research, threat intelligence analysis, and defensive engineering briefs.",
  };
}

export default async function ResearchPage() {
  const [researchRows, fallbackArticles, siteSettings, socialLinks] = await Promise.all([
    getPublishedResearchRows(),
    getPublishedArticles(),
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
              ANALYSIS & INTELLIGENCE
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Research & Insights
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              In-depth threat intelligence reports, malware behavior analysis, LLM security evaluations, and defensive countermeasures published by Cyberforage.
            </p>
          </div>

          {/* Directory */}
          <ResearchDirectory
            researchRows={researchRows}
            fallbackArticles={fallbackArticles}
          />
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
