import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { LabsDirectory } from "@/components/labs/LabsDirectory";
import { getPublishedLabRows, getPublishedLabs } from "@/lib/data/labs";
import { getSiteSettings } from "@/lib/data/site";
import { getPublicSocialLinks } from "@/lib/data/social";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `Labs — ${brand}`,
    description: "Hands-on cybersecurity testbeds, attack simulation environments, and detection engineering scenarios.",
  };
}

export default async function LabsPage() {
  const [labRows, fallbackLabs, siteSettings, socialLinks] = await Promise.all([
    getPublishedLabRows(),
    getPublishedLabs(),
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
              EXPERIMENTATION & VALIDATION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Cyberforage Labs
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Practical attack simulation, detection validation, forensic triage, and telemetry analysis environments engineered to stress-test real-world defenses.
            </p>
          </div>

          {/* Directory */}
          <LabsDirectory labRows={labRows} fallbackLabs={fallbackLabs} />
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
