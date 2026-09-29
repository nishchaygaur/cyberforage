import React, { useState } from 'react';
import { Shield, Crosshair, FlaskConical, Cpu, Cloud, Settings, ArrowRight, Clock, Network } from 'lucide-react';
import { ResearchArticle } from '../../types';
import { ArticleReaderModal } from '../modals/ArticleReaderModal';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';
import { useSiteContent } from '../../context/SiteContentContext';

interface ResearchSectionProps {
  onOpenThreatGraph?: () => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ onOpenThreatGraph }) => {
  const { content } = useSiteContent();
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  const domains = content.researchDomains || [];
  const articles = content.researchArticles || [];

  const getDomainIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-5 h-5" style={{ color }} />;
      case 'crosshair':
        return <Crosshair className="w-5 h-5" style={{ color }} />;
      case 'flask-conical':
        return <FlaskConical className="w-5 h-5" style={{ color }} />;
      case 'cpu':
        return <Cpu className="w-5 h-5" style={{ color }} />;
      case 'cloud':
        return <Cloud className="w-5 h-5" style={{ color }} />;
      case 'settings':
        return <Settings className="w-5 h-5" style={{ color }} />;
      default:
        return <Shield className="w-5 h-5" style={{ color }} />;
    }
  };

  return (
    <section id="research" className="relative py-16 md:py-24 border-t border-white/[0.04] cyber-section-visibility" aria-label="What We Explore">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Part 1: Exploration Domains */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                WHAT WE EXPLORE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Research. Build. Innovate.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {onOpenThreatGraph && (
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onOpenThreatGraph();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 border border-[#00F0C0]/40 text-[#00F0C0] text-xs font-mono font-semibold transition-all hover:shadow-[0_0_15px_rgba(0,240,192,0.25)]"
                >
                  <Network className="w-4 h-4" />
                  <span>Threat Intel Graph</span>
                </button>
              )}
              <div className="text-xs font-mono text-slate-400 hidden sm:block">
                6 Core Exploration Disciplines
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
            {domains.map((domain) => (
              <Cyber3DCard
                key={domain.id}
                customColor={domain.color}
                maxTilt={20}
                lift={16}
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Domain Icon with 3D elevation */}
                  <div
                    className="w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-md"
                    style={{
                      transform: 'translateZ(36px)',
                      backgroundColor: `${domain.color}15`,
                      borderColor: `${domain.color}40`,
                      boxShadow: `0 0 15px ${domain.color}25`
                    }}
                  >
                    {getDomainIcon(domain.icon, domain.color)}
                  </div>

                  {/* Title & Description */}
                  <div style={{ transform: 'translateZ(28px)' }}>
                    <h3 className="text-sm font-bold text-white tracking-tight mb-2 group-hover:text-[#00F0C0] transition-colors">
                      {domain.title}
                    </h3>
                  </div>

                  <p
                    style={{ transform: 'translateZ(18px)' }}
                    className="text-xs text-slate-400 leading-relaxed font-normal mb-4"
                  >
                    {domain.description}
                  </p>
                </div>

                {/* Topics Preview */}
                <div
                  style={{ transform: 'translateZ(26px)' }}
                  className="mt-auto pt-3 border-t border-white/[0.04] space-y-1"
                >
                  {(Array.isArray(domain.topics) ? domain.topics : []).slice(0, 3).map((t) => (
                    <div key={t} className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: domain.color }} />
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </Cyber3DCard>
            ))}
          </div>
        </div>

        {/* Part 2: Latest Research & Insights Articles */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                LATEST FROM CYBERFORAGE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Research &amp; Insights
              </h2>
            </div>
            <div className="mt-3 sm:mt-0 text-xs font-mono text-[#00F0C0] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-pulse" />
              <span>Peer-Reviewed Intel</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Cyber3DCard
                key={article.id}
                customColor="#00F0C0"
                maxTilt={16}
                lift={22}
                className="p-6 flex flex-col justify-between group cursor-pointer"
                onClick={() => {
                  cyberSound.playClick();
                  setSelectedArticle(article);
                }}
              >
                <div>
                  {/* Category & Date */}
                  <div
                    style={{ transform: 'translateZ(32px)' }}
                    className="flex items-center justify-between text-xs font-mono mb-3"
                  >
                    <span className="text-[#00E5BE] font-medium px-2 py-0.5 rounded bg-[#00F0C0]/10 border border-[#00F0C0]/30 shadow-sm">
                      {article.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">{article.date}</span>
                  </div>

                  {/* Article Title */}
                  <h3
                    style={{ transform: 'translateZ(36px)' }}
                    className="text-base font-bold text-white leading-snug group-hover:text-[#00F0C0] transition-colors mb-3"
                  >
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p
                    style={{ transform: 'translateZ(20px)' }}
                    className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6 font-normal"
                  >
                    {article.summary}
                  </p>
                </div>

                {/* Footer with Read Article and Read Time */}
                <div
                  style={{ transform: 'translateZ(38px)' }}
                  className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#00F0C0]" />
                    <span>{article.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[#00E5BE] group-hover:text-[#00F0C0] font-semibold transition-transform group-hover:translate-x-0.5">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Cyber3DCard>
            ))}
          </div>
        </div>
      </div>

      {/* Full Modal Reader */}
      <ArticleReaderModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </section>
  );
};
