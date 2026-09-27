import React, { useState } from 'react';
import { Box, Shield, Search, Bug, Network, Play, Server } from 'lucide-react';
import { labsData } from '../../data/labsData';
import { Lab } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';

interface LabsSectionProps {
  onRunLabSimulation: (lab: Lab) => void;
  onFocusBlade3D: (labId: string) => void;
}

export const LabsSection: React.FC<LabsSectionProps> = ({
  onRunLabSimulation,
  onFocusBlade3D,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Attack Simulation', 'SOC', 'Forensics', 'Analysis', 'Networking'];

  const filteredLabs = activeCategory === 'All'
    ? labsData
    : labsData.filter((l) => l.category === activeCategory);

  const getLabIcon = (cat: string) => {
    switch (cat) {
      case 'Attack Simulation':
        return <Box className="w-5 h-5 text-purple-400" />;
      case 'SOC':
        return <Shield className="w-5 h-5 text-[#00F0C0]" />;
      case 'Forensics':
        return <Search className="w-5 h-5 text-sky-400" />;
      case 'Analysis':
        return <Bug className="w-5 h-5 text-rose-400" />;
      case 'Networking':
        return <Network className="w-5 h-5 text-emerald-400" />;
      default:
        return <Server className="w-5 h-5 text-[#00E5BE]" />;
    }
  };

  return (
    <section id="labs" className="relative py-16 md:py-24 border-t border-white/[0.04] overflow-hidden cyber-section-visibility" aria-label="Cyberforage Labs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              EXPERIMENTATION & VALIDATION
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Cyberforage Labs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Practical attack simulation, detection validation, forensic triage, and telemetry analysis environments engineered to stress-test real-world defenses.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    cyberSound.playClick();
                    setActiveCategory(cat);
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

        {/* Labs Grid with Hyper-3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => {
            const colorHex = lab.accent;
            return (
              <Cyber3DCard
                key={lab.id}
                customColor={colorHex}
                maxTilt={16}
                lift={20}
                className="p-6 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon and Badges (Stereoscopic layer) */}
                  <div
                    style={{ transform: 'translateZ(38px)' }}
                    className="flex items-start justify-between gap-3 mb-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl bg-white/[0.04] border flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                      style={{ borderColor: `${colorHex}40`, boxShadow: `0 0 15px ${colorHex}25` }}
                    >
                      {getLabIcon(lab.category)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${
                          lab.difficulty === 'Advanced'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : lab.difficulty === 'Intermediate'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {lab.difficulty}
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm"
                        style={{
                          backgroundColor: `${colorHex}15`,
                          color: colorHex,
                          borderColor: `${colorHex}40`,
                        }}
                      >
                        {lab.status}
                      </span>
                    </div>
                  </div>

                  {/* Category & Title (Layered depth) */}
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <span className="text-[11px] font-mono block mb-1 font-semibold" style={{ color: colorHex }}>
                      {lab.category}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-[#00F0C0] transition-colors">
                      {lab.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    style={{ transform: 'translateZ(18px)' }}
                    className="text-xs text-slate-300 leading-relaxed font-normal mb-5"
                  >
                    {lab.description}
                  </p>

                  {/* Attack Vectors Preview */}
                  <div
                    style={{ transform: 'translateZ(24px)' }}
                    className="space-y-1.5 mb-5 p-2.5 rounded-xl bg-[#050D18]/90 border border-white/5 shadow-inner"
                  >
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Target Vector:</span>
                      <span className="text-[9px] font-mono" style={{ color: colorHex }}>READY</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 truncate">
                      {lab.attackVectors[0]}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions (High elevation 3D layer) */}
                <div
                  style={{ transform: 'translateZ(42px)' }}
                  className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2"
                >
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onRunLabSimulation(lab);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: `${colorHex}15`,
                      borderColor: `${colorHex}50`,
                      borderWidth: 1,
                      color: colorHex,
                      boxShadow: `0 0 15px ${colorHex}25`
                    }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Simulation</span>
                  </button>

                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onFocusBlade3D(lab.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="Inspect Blade in 3D Server Rack"
                  >
                    <Server className="w-3.5 h-3.5" style={{ color: colorHex }} />
                    <span className="hidden sm:inline">3D Blade</span>
                  </button>
                </div>
              </Cyber3DCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
