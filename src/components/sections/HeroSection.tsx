import React, { useState } from 'react';
import { ArrowRight, Terminal, ShieldAlert, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { CyberScene } from '../3d/CyberScene';
import { CyberHUDControls } from '../3d/CyberHUDControls';
import { SceneMode } from '../../types';
import { OrbitalNodeData } from '../3d/CyberGlobe';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  sceneMode: SceneMode;
  onSceneModeChange: (mode: SceneMode) => void;
  attackTrigger: number;
  onSimulateAttack: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenTerminal,
  sceneMode,
  onSceneModeChange,
  attackTrigger,
  onSimulateAttack,
}) => {
  const [selectedNode, setSelectedNode] = useState<OrbitalNodeData | null>(null);
  const [interceptNotice, setInterceptNotice] = useState<string | null>(null);

  const handleIntercepted = (msg: string) => {
    setInterceptNotice(msg);
    setTimeout(() => setInterceptNotice(null), 4000);
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden" aria-label="Cyberforage Hero">
      {/* Background Cyber Ambient Lights */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#00F0C0]/[0.05] blur-[150px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-purple-500/[0.04] blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Top Chip */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#00F0C0]/5 border border-[#00F0C0]/25 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-pulse" />
              <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.14em] sm:tracking-[0.22em] text-[#00E5BE] font-semibold uppercase">
                CYBERSECURITY / RESEARCH / AI / AUTOMATION
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 font-mono">
              <span className="text-white">CYBER</span>
              <span className="text-[#00F0C0] drop-shadow-[0_0_20px_rgba(0,240,192,0.4)]">FORAGE</span>
            </h1>

            {/* Motto */}
            <p className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4 tracking-tight">
              Explore. Build. Defend.
            </p>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed font-normal">
              A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#projects"
                onClick={() => cyberSound.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00E5BE] text-[#04131E] font-bold text-sm sm:text-base transition-all duration-200 hover:bg-[#00F0C0] shadow-[0_0_25px_rgba(0,229,190,0.35)] hover:shadow-[0_0_35px_rgba(0,240,192,0.55)] cursor-pointer group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#labs"
                onClick={() => cyberSound.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#06101E]/80 hover:bg-[#09172B] text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#00E5BE]/60 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer"
              >
                <span>Explore Labs</span>
              </a>

              <button
                onClick={() => {
                  cyberSound.playClick();
                  onOpenTerminal();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#00F0C0] border border-white/10 hover:border-[#00F0C0]/40 text-sm font-mono transition-all cursor-pointer"
                title="Launch Tactical Terminal"
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">CLI Console</span>
              </button>
            </div>

            {/* Live Telemetry Notice */}
            {interceptNotice && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 animate-bounce">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{interceptNotice}</span>
              </div>
            )}

            {/* Quick Metrics Ticker */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/[0.06] w-full max-w-xl text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
                <span className="text-slate-300">Real tools</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                <span className="text-slate-300">Practical security</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
                <span className="text-slate-300">Open source</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas & Orbital Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* 3D Canvas Box */}
            <div className="relative w-full aspect-square max-w-[480px] lg:max-w-[560px] mx-auto flex items-center justify-center rounded-2xl bg-[#030914]/70 border border-white/[0.06] backdrop-blur-sm shadow-[0_0_50px_rgba(0,240,192,0.06)] overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background: 'radial-gradient(circle at center, rgba(0, 240, 192, 0.15) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 75%)'
                }}
                aria-hidden="true"
              />

              {/* Master 3D WebGL Canvas */}
              <CyberScene
                mode={sceneMode}
                onSelectNode={(node) => setSelectedNode(node)}
                onAttackIntercepted={handleIntercepted}
                attackTrigger={attackTrigger}
                className="relative z-10"
              />

              {/* Floating Holographic Cyber Badges */}
              <div className="absolute top-[10%] left-[28%] z-20 pointer-events-none transform -translate-x-1/2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                    SECURITY
                  </span>
                </div>
              </div>

              <div className="absolute top-[22%] right-[8%] z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                    AI
                  </span>
                </div>
              </div>

              <div className="absolute bottom-[30%] left-[10%] z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                    RESEARCH
                  </span>
                </div>
              </div>

              <div className="absolute bottom-[16%] right-[5%] z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] shadow-[0_0_6px_#00E5BE]" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                    AUTOMATION
                  </span>
                </div>
              </div>

              {/* Node Inspection Holographic Drawer */}
              {selectedNode && (
                <div className="absolute bottom-4 left-4 right-4 z-30 p-3 rounded-xl bg-[#040E1C]/95 border border-[#00F0C0]/50 backdrop-blur-xl shadow-2xl flex items-center justify-between animate-fadeIn">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.hex }} />
                      <span className="text-xs font-mono font-bold text-white tracking-wider">
                        {selectedNode.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">({selectedNode.category})</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">{selectedNode.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 3D Mode & Simulation Controls */}
            <div className="mt-4 w-full flex justify-center">
              <CyberHUDControls
                currentMode={sceneMode}
                onModeChange={onSceneModeChange}
                onSimulateAttack={onSimulateAttack}
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-slate-400 text-center">
              Drag to orbit 360° | Scroll to zoom | Click nodes to inspect
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
