import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ContactCard } from "@/components/contact/ContactCard";
import { ContactPageForm } from "@/components/contact/ContactPageForm";
import { getSiteSettings } from "@/lib/data/site";
import { getContactInfo } from "@/lib/data/contact";
import { getPublicSocialLinks } from "@/lib/data/social";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brand = siteSettings.site_name || "Cyberforage";

  return {
    title: `Contact — ${brand}`,
    description: "Contact the Cyberforage ecosystem for security research, projects, or collaborations.",
  };
}

export default async function ContactPage() {
  const [siteSettings, contactInfo, socialLinks] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
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
              COMMUNICATION & INQUIRIES
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Connect with Cyberforage regarding security research, telemetry tools, platform architectures, or defensive engineering collaborations.
            </p>
          </div>

          {/* Two Columns: Verified Contact Card & Direct Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <ContactCard
                siteSettings={siteSettings}
                contactInfo={contactInfo}
                socialLinks={socialLinks}
              />
            </div>

            <div className="lg:col-span-7">
              <ContactPageForm />
            </div>
          </div>
        </div>
      </div>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </main>
  );
}
