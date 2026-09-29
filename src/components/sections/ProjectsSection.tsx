import React, { useState } from 'react';
import { FileSearch, Box, ShieldCheck, ExternalLink, BookOpen, Layers, Binary } from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';
import { Project } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';
import { useSiteContent } from '../../context/SiteContentContext';

interface ProjectsSectionProps {
  onInspect3D?: (project: Project) => void;
  onInspectBinary?: (binaryName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onInspect3D, onInspectBinary }) => {
  const { content } = useSiteContent();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const allProjects = content.projects || [];
  const dynamicCategories = ['All', ...Array.from(new Set(allProjects.map((p) => p.category)))];

  const filteredProjects = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="relative py-16 md:py-24 border-t border-white/[0.04] cyber-section-visibility" aria-label="Featured Projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              FEATURED PROJECTS & DEFENSES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Built for Real-World Security
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {dynamicCategories.map((cat) => {
              const isSelected = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    cyberSound.playClick();
                    setActiveFilter(cat);
                  }}
                  onMouseEnter={() => cyberSound.playBlip()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid with 3D Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
          {filteredProjects.map((project) => {
            const isRose = project.accent === 'rose';
            const isPurple = project.accent === 'purple';
            const accentColor = isRose ? '#F43F5E' : isPurple ? '#A855F7' : '#00F0C0';

            return (
              <Cyber3DCard
                key={project.id}
                accent={project.accent}
                maxTilt={16}
                glareOpacity={0.3}
                className="p-7 min-h-[420px]"
              >
                {/* Background Holographic Concentric Circles (Recessed in 3D) */}
                <div
                  style={{ transform: 'translateZ(-15px)' }}
                  className="absolute -top-6 -right-6 w-40 h-40 rounded-full pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: accentColor, borderWidth: 1 }}
                  />
                  <div
                    className="absolute inset-4 rounded-full opacity-60"
                    style={{ borderColor: accentColor, borderWidth: 1 }}
                  />
                  <div
                    className="absolute inset-8 rounded-full opacity-40"
                    style={{ borderColor: accentColor, borderWidth: 1 }}
                  />
                </div>

                {/* Card Top Header & Icons (Popping out in 3D space) */}
                <div>
                  <div
                    style={{ transform: 'translateZ(38px)' }}
                    className="flex items-start justify-between gap-3 mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-lg"
                        style={{
                          backgroundColor: `${accentColor}20`,
                          borderColor: `${accentColor}50`,
                          borderWidth: 1,
                          color: accentColor,
                          boxShadow: `0 0 15px ${accentColor}30`,
                        }}
                      >
                        {project.category === 'Auditing' && <FileSearch className="w-6 h-6" />}
                        {project.category === 'Attack Simulation' && <Box className="w-6 h-6" />}
                        {project.category === 'Malware Analysis' && <FileSearch className="w-6 h-6" />}
                        {project.category === 'SOC Platform' && <ShieldCheck className="w-6 h-6" />}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#00F0C0] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs font-mono font-medium tracking-wide truncate" style={{ color: accentColor }}>
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border shadow-sm"
                      style={{
                        transform: 'translateZ(35px)',
                        backgroundColor: `${accentColor}18`,
                        color: accentColor,
                        borderColor: `${accentColor}50`
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description (Layered depth) */}
                  <p
                    style={{ transform: 'translateZ(22px)' }}
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal"
                  >
                    {project.description}
                  </p>

                  {/* Metrics Badges (Popping out) */}
                  {Array.isArray(project.metrics) && project.metrics.length > 0 && (
                    <div
                      style={{ transform: 'translateZ(30px)' }}
                      className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-[#050D18]/90 border border-white/10 shadow-inner"
                    >
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <div className="text-[12px] font-mono font-bold text-white tracking-wider">{m.value}</div>
                          <div className="text-[9px] font-mono text-slate-400">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div
                    style={{ transform: 'translateZ(24px)' }}
                    className="flex items-center flex-wrap gap-1.5 mb-6"
                  >
                    {(Array.isArray(project.tags) ? project.tags : []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#060D17] text-slate-300 border border-white/10 text-[10px] sm:text-[11px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links (Highest 3D layer for effortless interaction) */}
                <div
                  style={{ transform: 'translateZ(45px)' }}
                  className="pt-4 border-t border-white/[0.06] mt-auto flex flex-wrap items-center gap-3"
                >
                  {(project.demo_url || project.project_url || (project as any).demoUrl) && (
                    <a
                      href={project.demo_url || project.project_url || (project as any).demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => cyberSound.playClick()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold text-slate-100 hover:text-white transition-all shadow-md group/btn cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: `${accentColor}18`,
                        borderColor: `${accentColor}70`,
                        borderWidth: 1,
                      }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" style={{ color: accentColor }} />
                    </a>
                  )}

                  {(project.github_url || (project as any).githubUrl) && (
                    <a
                      href={project.github_url || (project as any).githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => cyberSound.playClick()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#050E1A] hover:bg-white/10 border border-white/15 hover:border-[#00F0C0]/50 text-xs font-mono font-medium text-slate-300 hover:text-[#00F0C0] transition-all cursor-pointer hover:scale-105 active:scale-95"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                  )}

                  {project.documentation_url && (
                    <a
                      href={project.documentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => cyberSound.playClick()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#050E1A] hover:bg-white/10 border border-white/15 hover:border-[#00F0C0]/50 text-xs font-mono font-medium text-slate-300 hover:text-[#00F0C0] transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#00E5BE]" />
                      <span>Docs</span>
                    </a>
                  )}

                  {onInspectBinary && (
                    <button
                      onClick={() => {
                        cyberSound.playClick();
                        onInspectBinary(`${project.slug}_payload.elf`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 border border-[#00F0C0]/40 text-xs font-mono font-semibold text-[#00F0C0] transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(0,240,192,0.3)]"
                      title="Inspect x86_64 Opcodes & Hex Dump"
                    >
                      <Binary className="w-3.5 h-3.5" />
                      <span>Inspect Binary</span>
                    </button>
                  )}

                  {onInspect3D && (
                    <button
                      onClick={() => {
                        cyberSound.playClick();
                        onInspect3D(project);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer ml-auto"
                      title="Inspect Details in 3D"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Details</span>
                    </button>
                  )}
                </div>
              </Cyber3DCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
