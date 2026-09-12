import React from "react";
import { ArrowRight } from "lucide-react";
import { ARTICLE_PREVIEWS, ArticlePreview } from "@/lib/constants/siteData";

export const ResearchInsights: React.FC = () => {
  const renderThumbnail = (type: ArticlePreview["imageType"]) => {
    switch (type) {
      case "phishing":
        return (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#05111F] border border-[#00F0C0]/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
            {/* Hooded silhouette in cyan neon */}
            <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
              <path
                d="M32 10C24 10 20 18 20 28C20 38 24 44 26 46L14 54V58H50V54L38 46C40 44 44 38 44 28C44 18 40 10 32 10Z"
                stroke="#00F0C0"
                strokeWidth="2"
                fill="#00F0C0"
                fillOpacity="0.1"
              />
              <circle cx="28" cy="27" r="2" fill="#00F0C0" />
              <circle cx="36" cy="27" r="2" fill="#00F0C0" />
            </svg>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#05111F]/80" />
          </div>
        );
      case "stealer":
        return (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#15070B] border border-[#F43F5E]/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative font-mono text-[8px] text-[#F43F5E]/70 p-1.5 leading-none">
            {/* Red terminal matrix code */}
            <div className="w-full space-y-1">
              <div className="text-[#F43F5E] font-bold">0x4F: STEAL</div>
              <div className="truncate opacity-75">token: *******</div>
              <div className="truncate opacity-50">cookie: dump</div>
              <div className="truncate opacity-60">exfil: 10.0.4.1</div>
              <div className="truncate opacity-40">sha256: 9b2d..</div>
            </div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#15070B]/70" />
          </div>
        );
      case "llm":
        return (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#061224] border border-blue-400/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
            {/* AI neural network sphere in cyan/blue */}
            <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
              <circle cx="32" cy="32" r="18" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="32" cy="32" r="10" stroke="#00F0C0" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="4" fill="#00F0C0" />
              <line x1="22" y1="22" x2="42" y2="42" stroke="#38BDF8" strokeWidth="1" />
              <line x1="22" y1="42" x2="42" y2="22" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="22" cy="22" r="2" fill="#38BDF8" />
              <circle cx="42" cy="42" r="2" fill="#38BDF8" />
              <circle cx="22" cy="42" r="2" fill="#00F0C0" />
              <circle cx="42" cy="22" r="2" fill="#00F0C0" />
            </svg>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#061224]/80" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="research"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="Research and Insights"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              LATEST FROM CYBERFORAGE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Research & Insights
            </h2>
          </div>
          <a
            href="#research"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-[#00F0C0] transition-colors self-start sm:self-auto"
          >
            <span>Visit Research</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Article Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ARTICLE_PREVIEWS.map((article) => (
            <div
              key={article.title}
              className="p-5 rounded-2xl bg-[#071120]/80 border border-white/[0.07] hover:border-white/[0.15] backdrop-blur-sm transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-[0_0_20px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-start gap-4 mb-4">
                {renderThumbnail(article.imageType)}
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-mono font-medium text-[#00E5BE] tracking-wide block mb-1">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#00F0C0] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4 font-normal">
                {article.description}
              </p>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{article.date}</span>
                <span className="inline-flex items-center gap-1 text-[#00E5BE] group-hover:text-[#00F0C0] font-medium">
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
