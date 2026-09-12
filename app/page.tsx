import React from "react";
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#040812] text-white flex flex-col">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero */}
      <Hero />

      {/* 3. Cyberforage Ecosystem */}
      <Ecosystem />

      {/* 4. Featured Projects */}
      <FeaturedProjects />

      {/* 5. What We Explore */}
      <WhatWeExplore />

      {/* 6. Cyberforage Labs */}
      <CyberforageLabs />

      {/* 7. Technologies */}
      <Technologies />

      {/* 8. Research & Insights */}
      <ResearchInsights />

      {/* 9. Open Source & Contact CTA */}
      <OpenSourceBanner />

      {/* 10. Footer */}
      <Footer />
    </main>
  );
}
