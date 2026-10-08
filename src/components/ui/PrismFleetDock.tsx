import React from 'react';
import { Terminal, Cpu, Database, Box, ShieldAlert, Target, Network, Layers, Code, Zap } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface FleetToolItem {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
}

export const PrismFleetDock: React.FC = () => {
  const fleetTools: FleetToolItem[] = [
    { id: 'linux', name: 'Linux eBPF', role: 'Kernel Sensor', icon: <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00F0C0]" /> },
    { id: 'python', name: 'Python Sec', role: 'Automation Engine', icon: <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> },
    { id: 'docker', name: 'Docker', role: 'Detonation Sandbox', icon: <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> },
    { id: 'postgres', name: 'PostgreSQL', role: 'Telemetry Store', icon: <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" /> },
    { id: 'yara', name: 'YARA', role: 'Pattern Matching', icon: <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> },
    { id: 'mitre', name: 'MITRE ATT&CK', role: 'Threat Matrix', icon: <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> },
    { id: 'wireshark', name: 'Wireshark', role: 'Packet Dissection', icon: <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" /> },
    { id: 'nmap', name: 'Nmap Engine', role: 'Port Recon', icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" /> },
    { id: 'ghidra', name: 'Ghidra Decompiler', role: 'Reverse Eng', icon: <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" /> },
    { id: 'supabase', name: 'Supabase', role: 'Zero-Trust DB', icon: <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5BE]" /> },
  ];

  // Duplicate for seamless infinite loop (0% to -50%)
  const marqueeItems = [...fleetTools, ...fleetTools];

  const handleToolClick = (id: string) => {
    cyberSound.playClick();
    const el = document.getElementById('technologies');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex justify-center py-2 relative z-20">
      <div className="prism-dock relative w-full max-w-5xl mx-auto py-2 sm:py-2.5 rounded-full overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)] bg-[#040814]/85 backdrop-blur-xl">
        {/* Subtle top prismatic hairline accent */}
        <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff]/40 via-[#ff0055]/30 to-transparent pointer-events-none" />

        {/* Left & Right Soft Fade Masks so items gracefully enter and exit without hard clipping */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#030610] to-transparent z-10 pointer-events-none rounded-l-full" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#030610] to-transparent z-10 pointer-events-none rounded-r-full" />

        {/* Infinite Seamless Marquee Track */}
        <div className="animate-marquee-smooth flex items-center gap-6 sm:gap-8 md:gap-10">
          {marqueeItems.map((tool, idx) => (
            <button
              key={`${tool.id}-${idx}`}
              onClick={() => handleToolClick(tool.id)}
              onMouseEnter={() => cyberSound.playBlip()}
              className="group relative flex items-center gap-2 text-slate-400 hover:text-white transition-all cursor-pointer flex-shrink-0 py-1 px-2.5 rounded-full hover:bg-white/[0.06]"
              title={`${tool.name} — ${tool.role}`}
            >
              <div className="transition-transform duration-200 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(0,240,192,0.8)]">
                {tool.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-medium tracking-tight text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                {tool.name}
              </span>

              {/* Hover Tooltip / Role Indicator */}
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#030712]/95 border border-white/20 text-[9px] font-mono text-[#00E5BE] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-30">
                {tool.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
