import React, { useState } from 'react';
import { Search, Terminal, Cpu, Database, Box, GitBranch, ShieldAlert, Target, FileText, Cloud, Brain, Network, ArrowRight } from 'lucide-react';
import { techTools } from '../../data/techStackData';
import { TechTool } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';

interface TechStackSectionProps {
  onFocusMesh3D: () => void;
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({ onFocusMesh3D }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<TechTool | null>(null);

  const categories = ['All', 'Core', 'Systems', 'Database', 'Container', 'VCS', 'Detection', 'Framework', 'Standards', 'Infra', 'Intelligence'];

  const filteredTools = techTools.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getToolIcon = (icon: string, color: string) => {
    switch (icon) {
      case 'terminal':
        return <Terminal className="w-5 h-5" style={{ color }} />;
      case 'cpu':
        return <Cpu className="w-5 h-5" style={{ color }} />;
      case 'database':
        return <Database className="w-5 h-5" style={{ color }} />;
      case 'box':
        return <Box className="w-5 h-5" style={{ color }} />;
      case 'git-branch':
        return <GitBranch className="w-5 h-5" style={{ color }} />;
      case 'shield-alert':
        return <ShieldAlert className="w-5 h-5" style={{ color }} />;
      case 'target':
        return <Target className="w-5 h-5" style={{ color }} />;
      case 'file-text':
        return <FileText className="w-5 h-5" style={{ color }} />;
      case 'cloud':
        return <Cloud className="w-5 h-5" style={{ color }} />;
      case 'brain':
        return <Brain className="w-5 h-5" style={{ color }} />;
      default:
        return <Cpu className="w-5 h-5" style={{ color }} />;
    }
  };

  return (
    <section id="technologies" className="relative py-16 md:py-24 border-t border-white/[0.04] cyber-section-visibility" aria-label="Technologies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Overview Card with Animated Signal Bars */}
          <div className="lg:col-span-3">
            <Cyber3DCard
              customColor="#00F0C0"
              maxTilt={14}
              lift={18}
              className="p-6 flex flex-col justify-between"
            >
              <div style={{ transform: 'translateZ(30px)' }}>
                <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                  TECHNOLOGIES
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Powered by Modern Tools.
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Battle-tested frameworks, telemetry pipelines, and detection agents driving Cyberforage operations.
                </p>
              </div>

              {/* Glowing animated visual audio/telemetry bars (elevated layer) */}
              <div
                style={{ transform: 'translateZ(38px)' }}
                className="pt-8 pb-2 flex items-end justify-center gap-3"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]" />
                  <div
                    className="w-5 rounded-t-sm bg-gradient-to-t from-transparent via-[#00F0C0]/20 to-[#00F0C0]/60 border-t border-l border-r border-[#00F0C0]/40 transition-all duration-500 hover:brightness-125"
                    style={{ height: '45px' }}
                  />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E5BE] shadow-[0_0_8px_#00E5BE]" />
                  <div
                    className="w-5 rounded-t-sm bg-gradient-to-t from-transparent via-[#00E5BE]/20 to-[#00E5BE]/60 border-t border-l border-r border-[#00E5BE]/40 transition-all duration-500 hover:brightness-125"
                    style={{ height: '70px' }}
                  />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]" />
                  <div
                    className="w-5 rounded-t-sm bg-gradient-to-t from-transparent via-[#00F0C0]/20 to-[#00F0C0]/60 border-t border-l border-r border-[#00F0C0]/40 transition-all duration-500 hover:brightness-125"
                    style={{ height: '95px' }}
                  />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  <div
                    className="w-5 rounded-t-sm bg-gradient-to-t from-transparent via-[#38BDF8]/20 to-[#38BDF8]/60 border-t border-l border-r border-[#38BDF8]/40 transition-all duration-500 hover:brightness-125"
                    style={{ height: '60px' }}
                  />
                </div>
              </div>
            </Cyber3DCard>
          </div>

          {/* Center Column: Search & Tools Grid */}
          <div className="lg:col-span-6">
            <Cyber3DCard
              customColor="#38BDF8"
              maxTilt={12}
              lift={16}
              className="p-6 flex flex-col justify-between"
            >
              {/* Search Input */}
              <div style={{ transform: 'translateZ(30px)' }} className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools (Python, YARA, MITRE, Docker...)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#091424]/90 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors font-mono"
                />
              </div>

              {/* Quick 5x2 Icon Grid */}
              <div
                style={{ transform: 'translateZ(26px)' }}
                className="grid grid-cols-5 gap-2.5 sm:gap-3 my-auto"
              >
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      cyberSound.playClick();
                      setSelectedTool(tool);
                    }}
                    onMouseEnter={() => cyberSound.playBlip()}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#091424]/70 border border-white/[0.06] hover:border-[#00F0C0]/50 transition-all duration-200 group hover:shadow-[0_0_15px_rgba(0,240,192,0.15)] cursor-pointer hover:scale-105 active:scale-95"
                    title={`${tool.name} (${tool.category}): ${tool.description}`}
                  >
                    <div className="group-hover:scale-110 transition-transform mb-1.5">
                      {getToolIcon(tool.icon, tool.accentColor)}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 group-hover:text-white transition-colors truncate max-w-full text-center">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tool Detail Drawer if Selected */}
              {selectedTool && (
                <div
                  style={{ transform: 'translateZ(34px)' }}
                  className="mt-4 p-3 rounded-xl bg-[#071322] border border-[#00F0C0]/40 text-xs font-mono shadow-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: selectedTool.accentColor, color: selectedTool.accentColor }} />
                      {selectedTool.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {selectedTool.category}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{selectedTool.defenseRole}</p>
                </div>
              )}
            </Cyber3DCard>
          </div>

          {/* Right Column: "The Big Picture" Interconnected Security Mesh */}
          <div id="architecture" className="lg:col-span-3">
            <Cyber3DCard
              customColor="#A855F7"
              maxTilt={14}
              lift={18}
              className="p-6 flex flex-col justify-between"
            >
              <div style={{ transform: 'translateZ(30px)' }}>
                <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-3">
                  THE BIG PICTURE
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-4">
                  Interconnected Security Mesh
                </h3>
              </div>

              {/* 3 Interconnected Layers */}
              <div
                style={{ transform: 'translateZ(34px)' }}
                className="space-y-3 my-auto"
              >
                <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <span className="text-xs font-semibold text-white">Defense Core</span>
                  <span className="px-2 py-0.5 rounded bg-[#00F0C0]/15 text-[#00F0C0] text-[10px] font-mono border border-[#00F0C0]/30">
                    Active
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="w-[1px] h-3 bg-[#00F0C0]/40" />
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <span className="text-xs font-semibold text-white">Threat Stream</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-mono border border-blue-500/30">
                    Telemetry
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="w-[1px] h-3 bg-[#00F0C0]/40" />
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between shadow-sm">
                  <span className="text-xs font-semibold text-white">AI Automation</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 text-[10px] font-mono border border-purple-500/30">
                    Response
                  </span>
                </div>
              </div>

              {/* Button with high 3D pop */}
              <div
                style={{ transform: 'translateZ(42px)' }}
                className="pt-4 border-t border-white/[0.06]"
              >
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onFocusMesh3D();
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#A855F7]/15 hover:bg-[#A855F7]/25 border border-[#A855F7]/40 hover:border-[#A855F7] text-purple-300 text-xs font-mono font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105 active:scale-95"
                >
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspect Mesh in 3D</span>
                </button>
              </div>
            </Cyber3DCard>
          </div>
        </div>
      </div>
    </section>
  );
};
