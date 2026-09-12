import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { Ecosystem } from "@/components/ecosystem/Ecosystem";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { WhatWeExplore } from "@/components/exploration/WhatWeExplore";
import { CyberforageLabs } from "@/components/labs/CyberforageLabs";
import { Technologies } from "@/components/technologies/Technologies";
import { ResearchInsights } from "@/components/research/ResearchInsights";
import { OpenSourceBanner } from "@/components/open-source/OpenSourceBanner";
import { Footer } from "@/components/footer/Footer";
import { getPublishedLabs } from "@/lib/data/labs";
import { getPublishedArticles } from "@/lib/data/research";
import { getSiteSettings } from "@/lib/data/site";
import { getContactInfo } from "@/lib/data/contact";
import { getPublicSocialLinks } from "@/lib/data/social";

export const revalidate = 60; // ISR revalidation every 60s or on-demand via revalidatePath

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const authors: Array<{ name: string; url?: string }> = [{ name: "Cyberforage" }];
  if (siteSettings.owner_name) {
    authors.push({ name: siteSettings.owner_name });
  }

  const brand = siteSettings.site_name || "Cyberforage";
  const tagline = siteSettings.tagline || "Explore. Build. Defend.";

  return {
    title: `${brand} — ${tagline}`,
    description:
      siteSettings.short_description ||
      "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
    authors,
    creator: siteSettings.owner_name
      ? `${brand} (${siteSettings.owner_name})`
      : brand,
  };
}

export default async function HomePage() {
  const [labs, articles, siteSettings, contactInfo, socialLinks] = await Promise.all([
    getPublishedLabs(),
    getPublishedArticles(),
    getSiteSettings(),
    getContactInfo(),
    getPublicSocialLinks(),
  ]);

  return (
    <main className="min-h-screen bg-[#040812] text-white flex flex-col">
      {/* 1. Navbar */}
      <Navbar socialLinks={socialLinks} />

      {/* 2. Hero */}
      <Hero siteSettings={siteSettings} />

      {/* 3. Cyberforage Ecosystem (About) */}
      <Ecosystem siteSettings={siteSettings} />

      {/* 4. Featured Projects */}
      <FeaturedProjects />

      {/* 5. What We Explore */}
      <WhatWeExplore />

      {/* 6. Cyberforage Labs */}
      <CyberforageLabs labs={labs} />

      {/* 7. Technologies */}
      <Technologies />

      {/* 8. Research & Insights */}
      <ResearchInsights articles={articles} />

      {/* 9. Open Source & Contact CTA */}
      <OpenSourceBanner socialLinks={socialLinks} contactInfo={contactInfo} />

      {/* 10. Footer */}
      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
