import React from 'react';
import { Shield, Brain, Cog, ArrowRight, Layers } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';
import { useSiteContent } from '../../context/SiteContentContext';

export const EcosystemSection: React.FC = () => {
  const { content } = useSiteContent();
  const pillars = content.ecosystem?.pillars || [];

  return (
    <section id="ecosystem" className="relative py-16 md:py-24 border-t border-white/[0.04] cyber-section-visibility" aria-label="The Cyberforage Ecosystem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Description */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-3 block">
              THE CYBERFORAGE ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              {content.ecosystem?.title || 'More Than Just Projects'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {content.ecosystem?.description ||
                'Cyberforage brings together security, AI and automation into a unified ecosystem — building tools, labs and research for a safer digital world.'}
            </p>
            <div>
              <a
                href="#projects"
                onClick={() => cyberSound.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#06101E]/90 hover:bg-[#0A182E] text-slate-200 hover:text-white border border-[#00E5BE]/30 hover:border-[#00E5BE] text-sm font-medium transition-all group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,229,190,0.2)]"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-[#00E5BE] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right 3 Pillar 3D Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {pillars.map((pillar) => {
              const pillarColor = pillar.color || (pillar as any).accentColor || '#00F0C0';
              const pillarTagline = pillar.tagline || (pillar as any).subtitle || 'Defensive Engineering & Research';
              const pillarStats = pillar.stats || (pillar as any).stat || 'Nominal';
              const rawItems = Array.isArray(pillar.items) && pillar.items.length > 0
                ? pillar.items
                : [(pillar as any).subtitle, (pillar as any).badge, (pillar as any).stat, pillarStats].filter(Boolean);
              const items = rawItems.length > 0 ? rawItems : ['Defensive Engineering', 'Threat Detection', 'Security Research'];

              return (
                <Cyber3DCard
                  key={pillar.id}
                  customColor={pillarColor}
                  maxTilt={18}
                  lift={22}
                  className="p-6 group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon with 3D elevation */}
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-lg"
                      style={{
                        transform: 'translateZ(38px)',
                        backgroundColor: `${pillarColor}15`,
                        borderColor: `${pillarColor}40`,
                        color: pillarColor,
                        boxShadow: `0 0 20px ${pillarColor}25`
                      }}
                    >
                      {pillar.id === 'security' && <Shield className="w-6 h-6" />}
                      {pillar.id === 'ai' && <Brain className="w-6 h-6" />}
                      {pillar.id === 'automation' && <Cog className="w-6 h-6" />}
                      {!['security', 'ai', 'automation'].includes(pillar.id) && <Layers className="w-6 h-6" />}
                    </div>

                    {/* Title & Tagline */}
                    <div style={{ transform: 'translateZ(32px)' }}>
                      <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-white transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mb-4">{pillarTagline}</p>
                    </div>

                    {/* Feature List */}
                    <ul
                      style={{ transform: 'translateZ(24px)' }}
                      className="space-y-2.5 mt-auto pt-2 border-t border-white/[0.05]"
                    >
                      {items.map((item, idx) => (
                        <li key={item + idx} className="flex items-center text-xs sm:text-sm text-slate-300 tracking-wide">
                          <span
                            className="w-1.5 h-1.5 rounded-full mr-2.5 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: pillarColor, boxShadow: `0 0 6px ${pillarColor}` }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Performance Metric Bar */}
                  <div
                    style={{ transform: 'translateZ(36px)' }}
                    className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400"
                  >
                    <span>Performance</span>
                    <span
                      style={{ color: pillarColor }}
                      className="font-bold px-2 py-0.5 rounded bg-white/[0.03] border border-white/5"
                    >
                      {pillarStats}
                    </span>
                  </div>
                </Cyber3DCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
