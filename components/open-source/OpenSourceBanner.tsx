"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactModal } from "@/components/contact/ContactModal";
import { SocialRow } from "@/lib/data/social";
import { ContactInfoRow } from "@/lib/data/contact";

interface OpenSourceBannerProps {
  socialLinks?: SocialRow[];
  contactInfo?: ContactInfoRow | null;
}

export const OpenSourceBanner: React.FC<OpenSourceBannerProps> = ({
  socialLinks,
  contactInfo,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const githubSocial = socialLinks?.find(
    (l) => l.platform.toLowerCase() === "github" && l.enabled !== false
  );

  return (
    <section
      id="contact"
      className="relative py-14 sm:py-20 border-t border-white/[0.04]"
      aria-label="Open Source and Contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#060D19]/90 border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Side: Open Source & GitHub */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
              <div className="flex items-start gap-5">
                {/* Large GitHub Octocat */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </div>

                <div>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-1.5 block">
                    OPEN SOURCE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                    Built in public. Secured in public.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed mb-6 font-normal">
                    Explore our repositories, contribute and be part of the journey.
                  </p>

                  {githubSocial?.url ? (
                    <a
                      href={githubSocial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/10 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-medium text-white transition-all group"
                    >
                      <span>Visit GitHub</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/10 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-medium text-white transition-all group"
                    >
                      <span>Explore Projects</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Curved Divider Line for Desktop */}
            <div
              className="hidden lg:block absolute left-[58.33%] top-0 bottom-0 w-[40px] pointer-events-none z-20"
              aria-hidden="true"
            >
              <svg viewBox="0 0 40 250" preserveAspectRatio="none" className="w-full h-full">
                <path
                  d="M10 0 C 35 70, 5 180, 25 250"
                  fill="none"
                  stroke="#00F0C0"
                  strokeWidth="1.2"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Right Side: Build Something Secure CTA */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden bg-[#040A14]">
              {/* Mountain/Cyber Landscape Silhouette Backdrop */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 500 250"
                  fill="none"
                  className="w-full h-full object-cover"
                >
                  <path
                    d="M0 250 L120 130 L220 180 L350 90 L500 250 Z"
                    fill="#081E38"
                  />
                  <path
                    d="M100 250 L260 110 L380 170 L500 120 L500 250 Z"
                    fill="#0D2E54"
                    opacity="0.5"
                  />
                  <line
                    x1="0"
                    y1="248"
                    x2="500"
                    y2="248"
                    stroke="#00F0C0"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <h4 className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2">
                  BUILD SOMETHING SECURE.
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Have an idea, research, collaboration, or just want to connect?
                </p>
              </div>

              <div className="relative z-10 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/10 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-medium text-white transition-all group cursor-pointer"
                >
                  <span>Get in touch</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contactInfo={contactInfo}
      />
    </section>
  );
};
