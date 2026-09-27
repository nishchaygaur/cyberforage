import React from 'react';
import { Globe, Server, Network, Compass, ShieldAlert, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SceneMode, SimulatedIncident } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface CyberHUDControlsProps {
  currentMode: SceneMode;
  onModeChange: (mode: SceneMode) => void;
  onSimulateAttack: () => void;
  incident?: SimulatedIncident | null;
}

export const CyberHUDControls: React.FC<CyberHUDControlsProps> = ({
  currentMode,
  onModeChange,
  onSimulateAttack,
  incident,
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

      {/* Hostile Vector Simulation Trigger with Reactive Lifecycle */}
      <button
        onClick={() => {
          if (!incident) {
            cyberSound.playAlert();
            onSimulateAttack();
          }
        }}
        disabled={!!incident}
        onMouseEnter={() => cyberSound.playBlip()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
          incident?.stage === 'inbound'
            ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-wait'
            : incident?.stage === 'incident_generated'
            ? 'bg-rose-500/25 border border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse cursor-wait'
            : incident?.stage === 'containing'
            ? 'bg-sky-500/20 border border-sky-500/60 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-wait'
            : incident?.stage === 'resolved'
            ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 hover:border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
        }`}
        title="Trigger simulated red-team cyber attack in 3D"
      >
        {incident?.stage === 'inbound' ? (
          <>
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>INBOUND ({incident.progress}%)</span>
          </>
        ) : incident?.stage === 'incident_generated' ? (
          <>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>INCIDENT ACTIVE</span>
          </>
        ) : incident?.stage === 'containing' ? (
          <>
            <RotateCcw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            <span>CONTAINING ({incident.progress}%)</span>
          </>
        ) : incident?.stage === 'resolved' ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONTAINED</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>SIMULATE ATTACK</span>
          </>
        )}
      </button>
    </div>
  );
};
