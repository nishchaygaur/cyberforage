import React from 'react';
import { Globe, Server, Network, Compass, ShieldAlert, RotateCcw } from 'lucide-react';
import { SceneMode } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface CyberHUDControlsProps {
  currentMode: SceneMode;
  onModeChange: (mode: SceneMode) => void;
  onSimulateAttack: () => void;
}

export const CyberHUDControls: React.FC<CyberHUDControlsProps> = ({
  currentMode,
  onModeChange,
  onSimulateAttack,
}) => {
  const modes: { id: SceneMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'globe', label: 'Defense Globe', icon: <Globe className="w-4 h-4" />, color: 'text-[#00F0C0]' },
    { id: 'server', label: 'Lab Blades', icon: <Server className="w-4 h-4" />, color: 'text-[#A855F7]' },
    { id: 'mesh', label: 'Security Mesh', icon: <Network className="w-4 h-4" />, color: 'text-[#38BDF8]' },
    { id: 'free', label: 'Free Orbit', icon: <Compass className="w-4 h-4" />, color: 'text-[#00E5BE]' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#06101e]/90 border border-white/10 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-1">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                cyberSound.playClick();
                onModeChange(m.id);
              }}
              onMouseEnter={() => cyberSound.playBlip()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#00F0C0]/15 border border-[#00F0C0]/50 text-white shadow-[0_0_12px_rgba(0,240,192,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title={`Switch 3D View to ${m.label}`}
            >
              <span className={isActive ? 'text-[#00F0C0]' : m.color}>{m.icon}</span>
              <span className="hidden sm:inline font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

      {/* Hostile Vector Simulation Trigger */}
      <button
        onClick={() => {
          cyberSound.playAlert();
          onSimulateAttack();
        }}
        onMouseEnter={() => cyberSound.playBlip()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 hover:border-rose-400 text-rose-300 text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
        title="Trigger simulated red-team cyber attack in 3D"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <span>SIMULATE ATTACK</span>
      </button>
    </div>
  );
};
