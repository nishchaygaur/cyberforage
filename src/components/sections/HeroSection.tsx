import React, { useState, useRef } from 'react';
import { ArrowRight, Terminal, ShieldAlert, CheckCircle2, ChevronDown, Network, Radio, Mic, MicOff, Volume2 } from 'lucide-react';
import { CyberScene } from '../3d/CyberScene';
import { CyberHUDControls } from '../3d/CyberHUDControls';
import { SceneMode, SimulatedIncident } from '../../types';
import { OrbitalNodeData } from '../3d/CyberGlobe';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { useSiteContent } from '../../context/SiteContentContext';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  sceneMode: SceneMode;
  onSceneModeChange: (mode: SceneMode) => void;
  attackTrigger: number;
  onSimulateAttack: () => void;
  incident?: SimulatedIncident | null;
  onDismissIncident?: () => void;
  onOpenNmap?: () => void;
  onOpenAudioConsole?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenTerminal,
  sceneMode,
  onSceneModeChange,
  attackTrigger,
  onSimulateAttack,
  incident,
  onDismissIncident,
  onOpenNmap,
  onOpenAudioConsole,
}) => {
  const { content } = useSiteContent();
  const [selectedNode, setSelectedNode] = useState<OrbitalNodeData | null>(null);
  const [voiceActive, setVoiceActive] = useState(cyberSound.voiceEnabled);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleToggleVoice = () => {
    cyberSound.playClick();
    const nextState = !voiceActive;
    cyberSound.voiceEnabled = nextState;
    setVoiceActive(nextState);

    if (nextState) {
      if (cyberSound.isMuted) {
        cyberSound.setMuted(false);
      }
      cyberSound.speakVoice('Voice synthesizer online. Tactical voice control engaged.');

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript.toLowerCase();
              if (transcript.includes('welcome') || transcript.includes('greet') || transcript.includes('hello')) {
                cyberSound.replayWelcome();
              } else if (transcript.includes('terminal') || transcript.includes('console') || transcript.includes('cli')) {
                cyberSound.speakVoice('Launching terminal console');
                onOpenTerminal();
              } else if (transcript.includes('scan') || transcript.includes('nmap') || transcript.includes('network')) {
                if (onOpenNmap) {
                  cyberSound.speakVoice('Launching network scanner');
                  onOpenNmap();
                }
              } else if (transcript.includes('attack') || transcript.includes('simulate') || transcript.includes('breach')) {
                cyberSound.speakVoice('Simulating threat vector');
                onSimulateAttack();
              } else if (transcript.includes('project')) {
                cyberSound.speakVoice('Navigating to projects');
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (transcript.includes('lab')) {
                cyberSound.speakVoice('Navigating to labs');
                const el = document.getElementById('labs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
              setIsListening(false);
            };

            recognition.onerror = () => {
              setIsListening(false);
            };

            recognition.onend = () => {
              setIsListening(false);
            };

            recognitionRef.current = recognition;
          }

          setIsListening(true);
          recognitionRef.current.start();
        } catch {
          setIsListening(false);
        }
      }
    } else {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      cyberSound.speakVoice('Voice control offline');
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center pt-16 pb-6 sm:pt-20 sm:pb-8 lg:pt-16 lg:pb-6 overflow-x-clip"
      aria-label="Cyberforage Hero"
    >
      {/* Background Cyber Ambient Lights */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#00F0C0]/[0.05] blur-[150px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-purple-500/[0.04] blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        {/* Global Emergency Alert Banner (Controlled via Admin Panel) */}
        {content.telemetry?.isAlertActive && (
          <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-red-950/70 to-rose-950/80 border border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.3)] backdrop-blur-md animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold tracking-widest uppercase border border-rose-500/40">
                  DEFCON {content.telemetry?.defconLevel || 5} ALERT
                </span>
                <p className="text-xs sm:text-sm font-mono text-rose-100 font-medium">
                  {content.telemetry.broadcastAlert}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-rose-300/80 self-end sm:self-auto flex-shrink-0">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>LIVE BROADCAST</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left Column: Hero Content */}
          <div className="flex flex-col items-start z-10 w-full max-w-xl mx-auto lg:mx-0">
            {/* Top Chip */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#00F0C0]/5 border border-[#00F0C0]/25 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-pulse" />
              <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.14em] sm:tracking-[0.22em] text-[#00E5BE] font-semibold uppercase">
                {content.hero?.badge || 'CYBERSECURITY / RESEARCH / AI / AUTOMATION'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-1.5 sm:mb-2 font-mono">
              <span className="text-white">{content.hero?.brandPrefix || 'CYBER'}</span>
              <span className="text-[#00F0C0] drop-shadow-[0_0_20px_rgba(0,240,192,0.4)]">
                {content.hero?.brandSuffix || 'FORAGE'}
              </span>
            </h1>

            {/* Motto */}
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 mb-2 sm:mb-2.5 tracking-tight">
              {content.hero?.motto || 'Explore. Build. Defend.'}
            </p>

            {/* Subtext */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-lg mb-4 sm:mb-5 leading-relaxed font-normal">
              {content.hero?.description || 'A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
              <a
                href="#projects"
                onClick={() => cyberSound.playClick()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#00E5BE] text-[#04131E] font-bold text-xs sm:text-sm transition-all duration-200 hover:bg-[#00F0C0] shadow-[0_0_25px_rgba(0,229,190,0.35)] hover:shadow-[0_0_35px_rgba(0,240,192,0.55)] cursor-pointer group hover:scale-105 active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#labs"
                onClick={() => cyberSound.playClick()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#06101E]/80 hover:bg-[#09172B] text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#00E5BE]/60 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Explore Labs</span>
              </a>

              <button
                onClick={() => {
                  cyberSound.playClick();
                  onOpenTerminal();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#00F0C0] border border-white/10 hover:border-[#00F0C0]/40 text-xs font-mono transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Launch Tactical Terminal (Ctrl+K or `~`)"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CLI Console</span>
              </button>

              {onOpenNmap && (
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onOpenNmap();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#10B981]/10 hover:bg-[#10B981]/25 text-emerald-300 border border-[#10B981]/40 text-xs font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  title="Launch Live Nmap Network Port Scanner"
                >
                  <Network className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Nmap</span>
                </button>
              )}

              {/* Tactical AI Voice Control & Synthesizer Button */}
              <button
                onClick={handleToggleVoice}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse'
                    : voiceActive
                    ? 'bg-[#A855F7]/15 hover:bg-[#A855F7]/25 text-purple-300 border-[#A855F7]/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border-white/10 hover:border-white/20'
                }`}
                title="Toggle Tactical AI Voice Synthesizer & Speech Recognition"
              >
                {isListening ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    <span>Listening...</span>
                  </>
                ) : voiceActive ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span>Voice: ON</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Voice: OFF</span>
                  </>
                )}
              </button>

              {/* Audio HUD Console Button */}
              {onOpenAudioConsole && (
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onOpenAudioConsole();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-sky-300 border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 text-xs font-mono transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                  title="Open Tactical Soundscape & Audio Console"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Audio HUD</span>
                </button>
              )}
            </div>

            {/* Live Automated Incident Response HUD Banner */}
            {incident && (
              <div
                className={`mb-6 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 w-full max-w-xl animate-fadeIn ${
                  incident.stage === 'resolved'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : incident.stage === 'containing'
                    ? 'bg-sky-950/40 border-sky-500/50 text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      {incident.stage !== 'resolved' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          incident.stage === 'resolved' ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase">
                      {incident.stage === 'resolved'
                        ? `INCIDENT #${incident.id} RESOLVED & CONTAINED`
                        : incident.stage === 'containing'
                        ? `ACTIVE CONTAINMENT: #${incident.id}`
                        : `CRITICAL INCIDENT #${incident.id} ACTIVE`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        incident.stage === 'resolved'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      }`}
                    >
                      {incident.severity}
                    </span>
                    {onDismissIncident && (
                      <button
                        onClick={onDismissIncident}
                        className="text-xs font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Dismiss Incident"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-200 mb-3 leading-relaxed">
                  {incident.message}
                </p>

                {/* Live Progress Bar with Phase Details */}
                <div className="space-y-1.5 pt-2 border-t border-white/10 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>
                      Target: <span className="text-white font-semibold">{incident.targetNode}</span> ({incident.targetIp})
                    </span>
                    <span>
                      {incident.stage === 'resolved'
                        ? '100% Remediated (Auto-stopping)'
                        : `Progress: ${incident.progress}%`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        incident.stage === 'resolved'
                          ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                          : incident.stage === 'containing'
                          ? 'bg-sky-400 shadow-[0_0_8px_#38BDF8]'
                          : 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'
                      }`}
                      style={{ width: `${incident.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Metrics Ticker */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/[0.06] w-full max-w-xl text-xs font-mono text-slate-400">
              {(content.hero?.metrics || [
                { label: 'Real tools', color: '#00F0C0' },
                { label: 'Practical security', color: '#38BDF8' },
                { label: 'Open source', color: '#A855F7' },
              ]).map((pill: { label: string; color: string }, idx: number, arr: { label: string; color: string }[]) => (
                <React.Fragment key={pill.label + idx}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: pill.color,
                        boxShadow: `0 0 6px ${pill.color}`,
                      }}
                    />
                    <span className="text-slate-300">{pill.label}</span>
                  </div>
                  {idx < arr.length - 1 && <span className="text-slate-600">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas & Orbital Badges */}
          <div className="relative flex flex-col items-center justify-center w-full">
            {/* Free-Floating 3D Globe Wrapper - Zero square bounding box */}
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] md:max-w-[370px] lg:max-w-[390px] xl:max-w-[430px] max-h-[42vh] sm:max-h-[45vh] mx-auto flex items-center justify-center select-none">
              {/* Soft Ambient Holographic Energy Halo (Diffused, zero hard edges) */}
              <div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 192, 0.18) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 68%)',
                  filter: 'blur(35px)',
                }}
                aria-hidden="true"
              />

              {/* Zero-G Anti-Gravity Levitation Shadow / Energy Field */}
              <div
                className="absolute -bottom-3 left-1/2 w-[70%] h-8 bg-gradient-to-r from-transparent via-[#00F0C0]/35 to-transparent blur-xl rounded-full pointer-events-none transform -translate-x-1/2 scale-y-50 animate-float-shadow"
                aria-hidden="true"
              />

              {/* Floating Globe Body (Zero-G Levitation Animation) */}
              <div className="relative w-full h-full flex items-center justify-center animate-float-levitate">
                {/* Master 3D WebGL Canvas */}
                <CyberScene
                  mode={sceneMode}
                  onSelectNode={(node) => setSelectedNode(node)}
                  attackTrigger={attackTrigger}
                  className="relative z-10 w-full h-full"
                />

                {/* Floating Holographic Cyber Badges with Individual Floating Offsets */}
                <div className="absolute top-[10%] left-[24%] z-20 pointer-events-none transform -translate-x-1/2 animate-badge-float-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071322]/85 border border-[#00F0C0]/35 backdrop-blur-md shadow-[0_0_18px_rgba(0,240,192,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                      SECURITY
                    </span>
                  </div>
                </div>

                <div className="absolute top-[22%] right-[5%] z-20 pointer-events-none animate-badge-float-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071322]/85 border border-[#A855F7]/35 backdrop-blur-md shadow-[0_0_18px_rgba(168,85,247,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                      AI
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-[30%] left-[8%] z-20 pointer-events-none animate-badge-float-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071322]/85 border border-[#38BDF8]/35 backdrop-blur-md shadow-[0_0_18px_rgba(56,189,248,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                      RESEARCH
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-[16%] right-[3%] z-20 pointer-events-none animate-badge-float-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071322]/85 border border-[#00E5BE]/35 backdrop-blur-md shadow-[0_0_18px_rgba(0,229,190,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] shadow-[0_0_6px_#00E5BE]" />
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
                      AUTOMATION
                    </span>
                  </div>
                </div>
              </div>

              {/* Node Inspection Holographic Drawer */}
              {selectedNode && (
                <div className="absolute -bottom-2 left-2 right-2 sm:left-4 sm:right-4 z-30 p-3 rounded-xl bg-[#040E1C]/95 border border-[#00F0C0]/50 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,192,0.2)] flex items-center justify-between animate-fadeIn">
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
                    className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 3D Mode & Simulation Controls */}
            <div className="mt-2.5 sm:mt-3 w-full flex justify-center">
              <CyberHUDControls
                currentMode={sceneMode}
                onModeChange={onSceneModeChange}
                onSimulateAttack={onSimulateAttack}
                incident={incident}
              />
            </div>
            <p className="mt-1 text-[10px] sm:text-[11px] font-mono text-slate-400 text-center">
              Drag to orbit 360° | Ctrl + Scroll to zoom | Click nodes to inspect
            </p>
          </div>
        </div>
      </div>

      {/* Cyber Scroll-Down Indicator */}
      <div className="hidden md:flex absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex-col items-center">
        <a
          href="#ecosystem"
          onClick={() => cyberSound.playBlip()}
          className="group flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#00F0C0] transition-colors cursor-pointer py-0.5 px-3 rounded-full hover:bg-white/[0.04]"
          aria-label="Scroll to explore ecosystem"
        >
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#00F0C0] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
