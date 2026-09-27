import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Mic, X } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface CyberAudioConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberAudioConsole: React.FC<CyberAudioConsoleProps> = ({ isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(cyberSound.isMuted);
  const [isDroneActive, setIsDroneActive] = useState(cyberSound.isDroneActive);
  const [voiceEnabled, setVoiceEnabled] = useState(cyberSound.voiceEnabled);

  useEffect(() => {
    setIsMuted(cyberSound.isMuted);
    setIsDroneActive(cyberSound.isDroneActive);
    setVoiceEnabled(cyberSound.voiceEnabled);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const next = cyberSound.toggleMute();
    setIsMuted(next);
    setIsDroneActive(cyberSound.isDroneActive);
    if (!next) {
      cyberSound.speakVoice("Tactical audio online");
    }
  };

  const handleToggleDrone = () => {
    const next = cyberSound.toggleDrone();
    setIsDroneActive(next);
    setIsMuted(cyberSound.isMuted);
    if (next) {
      cyberSound.speakVoice("Sub-bass ambient drone engaged");
    }
  };

  const handleToggleVoice = () => {
    cyberSound.voiceEnabled = !cyberSound.voiceEnabled;
    setVoiceEnabled(cyberSound.voiceEnabled);
    if (cyberSound.voiceEnabled) {
      cyberSound.speakVoice("Voice synthesizer active");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 w-72 p-4 rounded-xl bg-[#050D1A]/95 border border-[#00F0C0]/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,192,0.25)] animate-fadeIn">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#00F0C0] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            Cyber Soundscape HUD
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Animated Mini Equalizer Spectrum */}
      <div className="flex items-end gap-1 h-6 mb-3 px-2 py-1 bg-[#02060E] border border-white/5 rounded">
        {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((val, idx) => (
          <div
            key={idx}
            className={`w-full transition-all duration-150 ${
              isMuted ? 'h-1 bg-slate-700' : 'bg-[#00F0C0]'
            }`}
            style={{
              height: isMuted ? '2px' : `${(val * (isDroneActive ? 1 : 0.4))}%`,
              opacity: isMuted ? 0.3 : 0.85,
            }}
          />
        ))}
      </div>

      <div className="space-y-2 text-xs font-mono">
        {/* Master Audio Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-slate-200">
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00F0C0]" />}
            <span>Master Audio</span>
          </div>
          <button
            onClick={handleToggleMute}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              !isMuted
                ? 'bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/50'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {!isMuted ? 'ONLINE' : 'MUTED'}
          </button>
        </div>

        {/* Ambient Drone Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-slate-200">
            <Radio className={`w-4 h-4 ${isDroneActive ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
            <span>Ambient Drone</span>
          </div>
          <button
            onClick={handleToggleDrone}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              isDroneActive
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {isDroneActive ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {/* Tactical Voice Alerts Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-slate-200">
            <Mic className={`w-4 h-4 ${voiceEnabled ? 'text-[#A855F7]' : 'text-slate-500'}`} />
            <span>Voice Synthesizer</span>
          </div>
          <button
            onClick={handleToggleVoice}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              voiceEnabled
                ? 'bg-[#A855F7]/20 text-purple-300 border border-[#A855F7]/50'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {voiceEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
