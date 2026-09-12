import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ProjectsDirectory } from "@/components/projects/ProjectsDirectory";
import { getPublishedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site";
import { getPublicSocialLinks } from "@/lib/data/social";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `Projects — ${brand}`,
    description: "Explore our defensive security platforms, malware analysis systems, and intelligent detection engines.",
  };
}

export default async function ProjectsPage() {
  const [projects, siteSettings, socialLinks] = await Promise.all([
    getPublishedProjects(),
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
              SYSTEMS & TOOLING
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Security Projects & Defenses
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Applied cybersecurity platforms, AI-driven SOC telemetry systems, and defensive security architectures built and validated in public.
            </p>
          </div>

          {/* Directory */}
          <ProjectsDirectory projects={projects} />
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
