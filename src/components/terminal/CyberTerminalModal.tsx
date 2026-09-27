import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Shield, CheckCircle2 } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { SceneMode } from '../../types';
import { projectsData } from '../../data/projectsData';
import { labsData } from '../../data/labsData';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'system';
  text: string;
  timestamp?: string;
}

interface CyberTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModeChange: (mode: SceneMode) => void;
  onSimulateAttack: () => void;
}

export const CyberTerminalModal: React.FC<CyberTerminalModalProps> = ({
  isOpen,
  onClose,
  onModeChange,
  onSimulateAttack,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'CYBERFORAGE KERNEL v4.19-SEC [ESTABLISHED SECURE TLS SESSION]',
      timestamp: '00:00:01'
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" for a list of tactical defense commands or "scan" to inspect the grid.',
      timestamp: '00:00:02'
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const now = new Date().toTimeString().split(' ')[0];
    const newLines: TerminalLine[] = [
      { id: `cmd-${Date.now()}`, type: 'command', text: trimmed, timestamp: now }
    ];

    const args = trimmed.toLowerCase().split(' ');
    const root = args[0];

    switch (root) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `AVAILABLE CYBER COMMANDS:
  help                    - Display tactical command reference
  status                  - Readout live threat telemetry & defense grid
  scan                    - Execute network & telemetry vulnerability audit
  projects                - List active engineering projects & repos
  labs                    - Query experimental lab testbeds & blades
  simulate [attack]       - Trigger 3D red-team attack missile simulation
  mode <globe|server|mesh>- Switch 3D holographic environment perspective
  audio [on|off]          - Control native Web Audio cyber synthesizer
  intel                   - Read current threat intelligence advisory
  whoami                  - Inspect authenticated operator credentials
  contact                 - Open encrypted transmission coordinates
  clear                   - Purge console buffer
  exit                    - Terminate terminal console session`
        });
        break;

      case 'status':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `CYBERFORAGE GRID POSTURE:
  • Status:               OPTIMAL (DEFENSIVE MESH ACTIVE)
  • Uptime:               99.98% High Availability
  • Telemetry Nodes:      4 Active Global Relays (US, EU, AP, AU)
  • Attack Interceptions: 1,429 Hostile Packets Dropped
  • Latency:              12.4 ms Mean Inter-Node Round-Trip
  • Framework:            NIST CSF 2.0 / MITRE ATT&CK v14 Grounded`
        });
        break;

      case 'scan':
        setIsScanning(true);
        cyberSound.playLaser();
        newLines.push({
          id: `scan-${Date.now()}`,
          type: 'system',
          text: '[SCANNER] Initializing synthetic endpoint & socket vulnerability triage...'
        });
        setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            {
              id: `scan-res-${Date.now()}`,
              type: 'success',
              text: `[SCAN COMPLETE] 450 network endpoints surveyed:
  ✓ 0 Critical Zero-Day Exposures
  ✓ LSASS Memory Protection (RunAsPPL): ENFORCED
  ✓ FIDO2 WebAuthn Token Validation: ENFORCED
  ✓ Sysmon Process Correlation: HEALTHY (0 Dropped Buffers)`
            }
          ]);
          setIsScanning(false);
          cyberSound.playClick();
        }, 1200);
        break;

      case 'projects':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `CYBERFORAGE PROJECTS:
${projectsData
  .map(
    (p, i) =>
      `  [0${i + 1}] ${p.title} (${p.category}) - ${p.status.toUpperCase()}\n      URL: ${
        p.project_url || 'Internal Research'
      }`
  )
  .join('\n')}`
        });
        break;

      case 'labs':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `CYBER LAB TESTBEDS:
${labsData
  .map(
    (l, i) =>
      `  [0${i + 1}] ${l.name} - ${l.category} (${l.difficulty})\n      Status: ${l.status.toUpperCase()} | Vectors: ${l.attackVectors.length}`
  )
  .join('\n')}`
        });
        break;

      case 'simulate':
        cyberSound.playAlert();
        onSimulateAttack();
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: '[EMULATION TRIGGERED] Hostile trajectory fired toward 3D Defense Shield. Target node engaged!'
        });
        break;

      case 'mode':
        if (['globe', 'server', 'mesh', 'free'].includes(args[1])) {
          onModeChange(args[1] as SceneMode);
          cyberSound.playClick();
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: `[VIEWPORT] 3D Camera transitioned to perspective: "${args[1].toUpperCase()}"`
          });
        } else {
          newLines.push({
            id: `err-${Date.now()}`,
            type: 'error',
            text: 'Invalid mode. Options: globe | server | mesh | free'
          });
        }
        break;

      case 'audio':
        if (args[1] === 'on') {
          cyberSound.setMuted(false);
          newLines.push({ id: `out-${Date.now()}`, type: 'success', text: 'Audio synthesizer: ONLINE' });
        } else if (args[1] === 'off') {
          cyberSound.setMuted(true);
          newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'Audio synthesizer: MUTED' });
        } else {
          const state = cyberSound.toggleMute();
          newLines.push({
            id: `out-${Date.now()}`,
            type: state ? 'output' : 'success',
            text: `Audio synthesizer: ${state ? 'MUTED' : 'ONLINE'}`
          });
        }
        break;

      case 'intel':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `THREAT INTELLIGENCE DISPATCH:
  • Advisory: Modern AiTM Phishing Proxies bypassing legacy SMS MFA
  • Advisory: Stealer malware (RedLine / Lumma) leveraging unhooked NT syscalls
  • Advisory: LLM Security Operations Centers achieving 98.4% triage fidelity`
        });
        break;

      case 'whoami':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `OPERATOR IDENTITY:
  • Organization: Cyberforage Ecosystem (Nishchay Gaur)
  • Role:         Defensive Security Researcher / Engineer
  • Clearance:    LEVEL-5 AUTHORIZED
  • Motto:        Explore. Build. Defend.
  • GitHub:       https://github.com/nishchaygaur
  • LinkedIn:     https://www.linkedin.com/in/nishchay-gaur/`
        });
        break;

      case 'contact':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `COMMUNICATION CHANNELS:
  • Email:        contact@cyberforage.space
  • n8n Request:  https://n8nrequest.cyberforage.space/
  • Web:          https://cyberforage.space`
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Command not recognized: "${trimmed}". Type "help" for a list of commands.`
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    cyberSound.playTerminalKey();
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md transition-all">
      <div
        className={`relative flex flex-col rounded-2xl bg-[#030914] border border-[#00F0C0]/30 shadow-[0_0_50px_rgba(0,240,192,0.15)] overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-full h-full' : 'w-full max-w-3xl h-[540px]'
        }`}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#061224] border-b border-white/10 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-1" />
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0C0]">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider">CYBERFORAGE TACTICAL CONSOLE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00F0C0]/10 text-[#00E5BE] border border-[#00F0C0]/20 hidden sm:inline">
                SECURE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={isExpanded ? 'Restore' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Close Console (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs sm:text-sm space-y-2.5 scrollbar-thin">
          {history.map((line) => {
            if (line.type === 'command') {
              return (
                <div key={line.id} className="flex items-start gap-2 text-[#00F0C0]">
                  <span className="text-[#38BDF8] select-none font-bold">operator@cyberforage:~$</span>
                  <span className="text-white font-medium">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-[#38BDF8] opacity-90 pl-2 border-l-2 border-[#38BDF8]/40">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-[#00F0C0] bg-[#00F0C0]/5 p-2.5 rounded-lg border border-[#00F0C0]/20 whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {line.text}
              </div>
            );
          })}
          {isScanning && (
            <div className="flex items-center gap-2 text-[#00F0C0] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00F0C0]" />
              <span>Scanning defense perimeter telemetry...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#06101d] border-t border-white/10 flex items-center gap-2 relative z-10">
          <span className="text-xs font-mono font-bold text-[#38BDF8] select-none hidden sm:inline">
            operator@cyberforage:~$
          </span>
          <span className="text-xs font-mono font-bold text-[#00F0C0] select-none sm:hidden">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'status', 'scan', 'simulate', 'projects'..."
            className="flex-1 bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="p-1.5 rounded-lg bg-[#00F0C0]/15 hover:bg-[#00F0C0]/25 text-[#00F0C0] border border-[#00F0C0]/30 transition-colors cursor-pointer"
            title="Execute Command"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
