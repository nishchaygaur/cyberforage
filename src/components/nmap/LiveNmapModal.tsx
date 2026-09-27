import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Network,
  X,
  Maximize2,
  Minimize2,
  Play,
  ShieldAlert,
  Cpu,
  Terminal,
  Server,
  Layers,
  Search,
  ExternalLink,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Radio,
  Activity,
  Filter,
} from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';
import {
  NMAP_PRESETS,
  NmapTargetPreset,
  NmapPort,
  resolveTarget,
  filterPortsForScan,
} from '../../data/nmapData';

interface LiveNmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: string;
}

export const LiveNmapModal: React.FC<LiveNmapModalProps> = ({
  isOpen,
  onClose,
  initialTarget,
}) => {
  // Preset Selection or Custom Target
  const [selectedPresetId, setSelectedPresetId] = useState<string>('gateway');
  const [customInput, setCustomInput] = useState<string>(initialTarget || '192.168.1.1');
  const [isCustom, setIsCustom] = useState(false);

  // Scan Flags
  const [scanType, setScanType] = useState<'-sS' | '-sT' | '-sU'>('-sS');
  const [flagVersion, setFlagVersion] = useState(true);
  const [flagScripts, setFlagScripts] = useState(true);
  const [flagOs, setFlagOs] = useState(true);
  const [flagTraceroute, setFlagTraceroute] = useState(true);
  const [portPreset, setPortPreset] = useState<'top20' | 'top100' | 'web' | 'database' | 'all'>('top100');

  // Scanner State & Tabs
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'terminal' | 'ports' | 'topology'>('terminal');
  const [selectedPort, setSelectedPort] = useState<NmapPort | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Streamed Terminal Lines
  const [terminalLines, setTerminalLines] = useState<{ id: string; text: string; color?: string }[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const scanTimerRef = useRef<number[]>([]);

  // Synchronize when initialTarget or modal opens
  useEffect(() => {
    if (isOpen && initialTarget) {
      const resolved = resolveTarget(initialTarget);
      const isPreset = NMAP_PRESETS.some((p) => p.id === resolved.id);
      if (isPreset) {
        setSelectedPresetId(resolved.id);
        setCustomInput(resolved.ip);
        setIsCustom(false);
      } else {
        setIsCustom(true);
        setCustomInput(initialTarget);
      }
      setSelectedPort(null);
    }
  }, [isOpen, initialTarget]);

  // Current Target Object (Dynamic based on selected preset or custom input)
  const currentTarget: NmapTargetPreset = useMemo(() => {
    if (isCustom && customInput.trim()) {
      return resolveTarget(customInput);
    }
    return NMAP_PRESETS.find((p) => p.id === selectedPresetId) || NMAP_PRESETS[0];
  }, [selectedPresetId, isCustom, customInput]);

  // Dynamically Filtered Ports based on Scan Type (-sU vs TCP) and Port Preset (web, db, top20, etc.)
  const activePorts: NmapPort[] = useMemo(() => {
    return filterPortsForScan(currentTarget, scanType, portPreset);
  }, [currentTarget, scanType, portPreset]);

  // Compute live command string
  const commandString = useMemo(() => {
    const parts = ['nmap', scanType];
    if (flagVersion) parts.push('-sV');
    if (flagScripts) parts.push('-sC');
    if (flagOs) parts.push('-O');
    if (flagTraceroute) parts.push('--traceroute');

    if (portPreset === 'top20') parts.push('--top-ports 20');
    else if (portPreset === 'top100') parts.push('-F');
    else if (portPreset === 'web') parts.push('-p 80,443,8080,8443');
    else if (portPreset === 'database') parts.push('-p 1433,3306,5432,6379');
    else if (portPreset === 'all') parts.push('-p-');

    parts.push('-T4');
    parts.push(currentTarget.ip);
    return parts.join(' ');
  }, [scanType, flagVersion, flagScripts, flagOs, flagTraceroute, portPreset, currentTarget]);

  // Initial terminal welcome lines
  useEffect(() => {
    if (isOpen && terminalLines.length === 0) {
      setTerminalLines([
        { id: '1', text: 'NMAP NETWORK EXPLORATION ENGINE v7.94 ( https://nmap.org )', color: '#10B981' },
        { id: '2', text: 'Stealth SYN half-open scanner, service version probing, and NSE script triage.', color: '#94A3B8' },
        { id: '3', text: 'Select target or customize IP/CIDR, toggle flags (-sV, -sC, -O, --traceroute), then click "START NMAP SCAN".', color: '#38BDF8' },
      ]);
    }
  }, [isOpen, terminalLines.length]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      scanTimerRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines, activeTab]);

  const handleStartScan = () => {
    if (isScanning) return;

    // Clear previous timers
    scanTimerRef.current.forEach((t) => clearTimeout(t));
    scanTimerRef.current = [];

    setIsScanning(true);
    setScanProgress(5);
    cyberSound.playClick();

    // Calculate dynamic jitter for this specific execution
    const dynamicLatency = +(currentTarget.latencyMs * (0.88 + Math.random() * 0.24)).toFixed(2);
    const startTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const scanMethodText =
      scanType === '-sU'
        ? 'UDP Scan'
        : scanType === '-sT'
        ? 'TCP Connect() Scan'
        : 'SYN Stealth Scan';

    const closedPortsCount =
      portPreset === 'all'
        ? 65535 - activePorts.length
        : portPreset === 'top20'
        ? 20 - activePorts.length
        : 1000 - activePorts.length;

    const newLines = [
      { id: `start-${Date.now()}`, text: `$ ${commandString}`, color: '#00F0C0' },
      { id: `init-${Date.now()}`, text: `Starting Nmap 7.94 ( https://nmap.org ) at ${startTime} UTC`, color: '#E2E8F0' },
      {
        id: `nse-${Date.now()}`,
        text: flagScripts
          ? 'NSE: Loaded 48 scripts for scanning.'
          : 'NSE: Script engine disabled (-sC not set).',
        color: '#94A3B8',
      },
      {
        id: `ping-${Date.now()}`,
        text: `Initiating ARP / ICMP Echo Discovery at ${new Date().toLocaleTimeString()}...`,
        color: '#64748B',
      },
      {
        id: `hostup-${Date.now()}`,
        text: currentTarget.isSubnet
          ? `Subnet sweep completed: 4 responsive hosts discovered across ${currentTarget.ip}`
          : `Host is up (${dynamicLatency}ms latency). Hostname: ${currentTarget.hostname}`,
        color: '#10B981',
      },
    ];
    setTerminalLines(newLines);

    // Step 1: Port Sweep (at 700ms)
    const t1 = window.setTimeout(() => {
      setScanProgress(25);
      cyberSound.playBlip();
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `syn-${Date.now()}`,
          text: `Initiating ${scanMethodText} on ${currentTarget.ip}...`,
          color: '#38BDF8',
        },
      ]);
    }, 700);

    // Step 2: Discovered Ports (at 1700ms)
    const t2 = window.setTimeout(() => {
      setScanProgress(55);
      cyberSound.playBlip();

      const discoveredMsgs = activePorts.map((p, idx) => ({
        id: `port-${idx}-${Date.now()}`,
        text: `Discovered open port ${p.port}/${p.protocol} on ${currentTarget.ip} [${p.service}]`,
        color: p.state === 'open' ? '#00F0C0' : '#F59E0B',
      }));

      setTerminalLines((prev) => [
        ...prev,
        ...discoveredMsgs,
        {
          id: `not-shown-${Date.now()}`,
          text: `Not shown: ${closedPortsCount} closed ${scanType === '-sU' ? 'udp' : 'tcp'} ports (reset)`,
          color: '#64748B',
        },
        {
          id: `syn-done-${Date.now()}`,
          text: `Completed ${scanMethodText} in ${(dynamicLatency * 1.5).toFixed(2)}s`,
          color: '#94A3B8',
        },
      ]);
    }, 1700);

    // Step 3: Service Version Detection & NSE Scripts (at 2800ms)
    const t3 = window.setTimeout(() => {
      setScanProgress(75);
      cyberSound.playLaser();

      const portReportHeader = [
        {
          id: `hdr-${Date.now()}`,
          text: `\nPORT      STATE    SERVICE        ${flagVersion ? 'VERSION' : ''}`,
          color: '#38BDF8',
        },
      ];

      const portReportRows = activePorts.map((p, idx) => {
        const versionString = flagVersion ? p.version : '';
        return {
          id: `row-${idx}-${Date.now()}`,
          text: `${(p.port + '/' + p.protocol).padEnd(9)} ${(p.state).padEnd(8)} ${(p.service).padEnd(14)} ${versionString}`,
          color: p.state === 'open' ? '#34D399' : '#FBBF24',
        };
      });

      // NSE scripts and vulnerability alerts ONLY IF flagScripts is TRUE
      const vulnReports: { id: string; text: string; color: string }[] = [];
      if (flagScripts) {
        activePorts.forEach((p) => {
          if (p.cveList && p.cveList.length > 0) {
            p.cveList.forEach((cve, cveIdx) => {
              vulnReports.push({
                id: `vuln-${p.port}-${cveIdx}-${Date.now()}`,
                text: `| [!] VULNERABILITY ALERT on port ${p.port}: ${cve.id} (${cve.severity} - CVSS ${cve.cvss})\n|_   ${cve.title}`,
                color: '#F43F5E',
              });
            });
          }
          if (p.scripts && p.scripts.length > 0) {
            p.scripts.forEach((scr, sIdx) => {
              vulnReports.push({
                id: `scr-${p.port}-${sIdx}-${Date.now()}`,
                text: `|_ ${scr.name}: ${scr.output.replace(/\n/g, '\n|_   ')}`,
                color: '#93C5FD',
              });
            });
          }
        });
      }

      setTerminalLines((prev) => [
        ...prev,
        ...portReportHeader,
        ...portReportRows,
        ...vulnReports,
      ]);
    }, 2800);

    // Step 4: OS Detection & Traceroute (at 3900ms)
    const t4 = window.setTimeout(() => {
      setScanProgress(90);
      cyberSound.playBlip();

      const additionalLines: { id: string; text: string; color: string }[] = [];

      // OS Detection ONLY IF flagOs is TRUE
      if (flagOs) {
        additionalLines.push(
          { id: `os-hdr-${Date.now()}`, text: '\nDevice type: ' + currentTarget.os.deviceType, color: '#E2E8F0' },
          { id: `os-run-${Date.now()}`, text: 'Running: ' + currentTarget.os.running, color: '#E2E8F0' },
          { id: `os-cpe-${Date.now()}`, text: 'OS CPE: ' + currentTarget.os.osCpe, color: '#94A3B8' },
          { id: `os-det-${Date.now()}`, text: 'OS details: ' + currentTarget.os.osDetails, color: '#38BDF8' },
          { id: `os-seq-${Date.now()}`, text: 'TCP Sequence Prediction: ' + currentTarget.os.tcpSequence, color: '#94A3B8' },
          { id: `os-up-${Date.now()}`, text: 'Uptime guess: ' + currentTarget.os.uptime, color: '#94A3B8' }
        );
      }

      // Traceroute ONLY IF flagTraceroute is TRUE
      if (flagTraceroute && currentTarget.traceroute.length > 0) {
        additionalLines.push(
          { id: `tr-hdr-${Date.now()}`, text: `\nTRACEROUTE (using port ${activePorts[0]?.port || 80}/${scanType === '-sU' ? 'udp' : 'tcp'})`, color: '#38BDF8' },
          { id: `tr-sub-${Date.now()}`, text: 'HOP RTT      ADDRESS', color: '#64748B' }
        );

        currentTarget.traceroute.forEach((hop, idx) => {
          const jitterRtt = (parseFloat(hop.rtt) * (0.92 + Math.random() * 0.16)).toFixed(2) + ' ms';
          additionalLines.push({
            id: `tr-hop-${idx}-${Date.now()}`,
            text: `${hop.hop.toString().padEnd(3)} ${jitterRtt.padEnd(8)} ${hop.address} (${hop.host || 'unknown'})`,
            color: '#CBD5E1',
          });
        });
      }

      setTerminalLines((prev) => [...prev, ...additionalLines]);
    }, 3900);

    // Step 5: Scan Complete (at 4900ms)
    const t5 = window.setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      cyberSound.playPulse();

      const hasCriticalVuln =
        flagScripts &&
        activePorts.some((p) => p.cveList && p.cveList.some((c) => c.severity === 'CRITICAL'));

      if (hasCriticalVuln) {
        cyberSound.speak('Warning. Critical service vulnerability detected in target.');
      } else {
        cyberSound.speak('Scan complete. Network topology and services mapped.');
      }

      const totalScanTime = (3.6 + dynamicLatency * 0.08).toFixed(2);
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `done-${Date.now()}`,
          text: `\nNmap done: ${currentTarget.isSubnet ? '4 hosts up' : '1 IP address (1 host up)'} scanned in ${totalScanTime} seconds`,
          color: '#10B981',
        },
      ]);
    }, 4900);

    scanTimerRef.current = [t1, t2, t3, t4, t5];
  };

  const handleCopyTerminal = () => {
    const raw = terminalLines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    cyberSound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNmap = () => {
    const raw = terminalLines.map((l) => l.text).join('\n');
    const blob = new Blob([raw], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nmap_${currentTarget.ip.replace(/[^a-zA-Z0-9]/g, '_')}.nmap`;
    a.click();
    URL.revokeObjectURL(url);
    cyberSound.playClick();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nmap-title"
    >
      <div
        className={`w-full bg-[#030914]/95 border border-[#10B981]/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'h-[96vh] max-w-[98vw]'
            : 'h-[90vh] max-h-[860px] max-w-6xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#050E1C] border-b border-white/[0.08] select-none">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Network className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="nmap-title" className="text-sm sm:text-base font-bold text-white font-mono tracking-wider">
                  NMAP NETWORK SCANNER <span className="text-[#10B981]">v7.94</span>
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {isScanning ? 'PROBING SOCKETS...' : 'STEALTH ENGINE READY'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden md:block">
                Dynamic Port Filtering, Service Banners, OS Fingerprinting & Script Exploits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMaximized ? 'Restore View' : 'Maximize'}
              aria-label={isMaximized ? 'Restore View' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Close Scanner"
              aria-label="Close Scanner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scan Control Header: Target Selection & Flag Switches */}
        <div className="p-4 sm:p-5 bg-[#051122]/90 border-b border-white/[0.08] space-y-4">
          {/* Target Presets & Custom Input Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#10B981]" /> Targets:
              </span>
              {NMAP_PRESETS.map((preset) => {
                const isSelected = !isCustom && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedPresetId(preset.id);
                      setCustomInput(preset.ip);
                      setSelectedPort(null);
                      cyberSound.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            {/* Custom Input Field */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    setIsCustom(true);
                    setSelectedPort(null);
                  }}
                  placeholder="Target IP / CIDR (e.g. 192.168.1.0/24)"
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#10B981] text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-white/5 border border-white/10 hidden sm:inline">
                {currentTarget.category}
              </span>
            </div>
          </div>

          {/* Scan Profile Flags & Port Range */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
            {/* Scan Profile Flags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Scan Type */}
              <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
                {(['-sS', '-sT', '-sU'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setScanType(t);
                      setSelectedPort(null);
                      cyberSound.playBlip();
                    }}
                    className={`px-2.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      scanType === t
                        ? 'bg-[#10B981] text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={
                      t === '-sS'
                        ? 'TCP SYN Stealth Scan (Half-open)'
                        : t === '-sT'
                        ? 'TCP Connect Scan (Full handshake)'
                        : 'UDP Protocol Scan'
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <button
                onClick={() => {
                  setFlagVersion((v) => !v);
                  cyberSound.playBlip();
                }}
                className={`px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                  flagVersion
                    ? 'bg-[#00F0C0]/15 border-[#00F0C0]/50 text-[#00F0C0]'
                    : 'bg-white/5 border-white/10 text-slate-500 line-through'
                }`}
                title="Toggle Service Version Detection (-sV)"
              >
                -sV (Version)
              </button>

              <button
                onClick={() => {
                  setFlagScripts((v) => !v);
                  cyberSound.playBlip();
                }}
                className={`px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                  flagScripts
                    ? 'bg-[#38BDF8]/15 border-[#38BDF8]/50 text-[#38BDF8]'
                    : 'bg-white/5 border-white/10 text-slate-500 line-through'
                }`}
                title="Toggle Default NSE Script Engine (-sC)"
              >
                -sC (NSE Scripts)
              </button>

              <button
                onClick={() => {
                  setFlagOs((v) => !v);
                  cyberSound.playBlip();
                }}
                className={`px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                  flagOs
                    ? 'bg-[#A855F7]/15 border-[#A855F7]/50 text-[#A855F7]'
                    : 'bg-white/5 border-white/10 text-slate-500 line-through'
                }`}
                title="Toggle OS Fingerprint Detection (-O)"
              >
                -O (OS Detect)
              </button>

              <button
                onClick={() => {
                  setFlagTraceroute((v) => !v);
                  cyberSound.playBlip();
                }}
                className={`px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                  flagTraceroute
                    ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-500 line-through'
                }`}
                title="Toggle Hop Route (--traceroute)"
              >
                --traceroute
              </button>
            </div>

            {/* Port Presets */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Port Range:</span>
              <select
                value={portPreset}
                onChange={(e) => {
                  setPortPreset(e.target.value as any);
                  setSelectedPort(null);
                  cyberSound.playBlip();
                }}
                className="px-2.5 py-1 rounded-md bg-[#07172C] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#10B981] cursor-pointer"
              >
                <option value="top20">Top 20 Ports (Fast)</option>
                <option value="top100">Top 100 Ports (-F)</option>
                <option value="web">Web Focus (80, 443, 8080)</option>
                <option value="database">Database Focus (3306, 5432, 6379)</option>
                <option value="all">Full 65,535 Ports (-p-)</option>
              </select>
            </div>
          </div>

          {/* Command Preview & Initiate Scan Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto py-1 px-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-[#00F0C0]">
              <span className="text-slate-500 select-none">$</span>
              <span className="whitespace-nowrap">{commandString}</span>
            </div>

            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer shadow-lg ${
                isScanning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#10B981] to-[#00F0C0] text-[#030914] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95'
              }`}
            >
              {isScanning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>PROBING SOCKETS ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START NMAP SCAN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        {isScanning && (
          <div className="w-full h-1 bg-black/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] via-[#00F0C0] to-[#38BDF8] transition-all duration-300 shadow-[0_0_10px_#10B981]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        )}

        {/* View Mode Tabs & Action Tools */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#030B17] border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setActiveTab('terminal');
                cyberSound.playBlip();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-white/10 text-white border border-white/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Raw Nmap Output</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ports');
                cyberSound.playBlip();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'ports'
                  ? 'bg-white/10 text-white border border-white/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00F0C0]" />
              <span>Visual Port Matrix</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                {activePorts.filter((p) => p.state === 'open').length} Open ({scanType === '-sU' ? 'UDP' : 'TCP'})
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('topology');
                cyberSound.playBlip();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'topology'
                  ? 'bg-white/10 text-white border border-white/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">Hop Traceroute & OS</span>
              <span className="sm:hidden">Route</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTerminal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Copy Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadNmap}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Download .nmap report"
            >
              <Download className="w-3.5 h-3.5 text-[#00F0C0]" />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Raw Terminal Output Stream */}
        {activeTab === 'terminal' && (
          <div className="flex-1 p-4 font-mono text-xs bg-[#02060F] overflow-y-auto space-y-1 select-text">
            {terminalLines.map((line) => (
              <div
                key={line.id}
                style={{ color: line.color || '#E2E8F0' }}
                className="leading-relaxed whitespace-pre-wrap font-mono transition-opacity duration-200"
              >
                {line.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}

        {/* Tab 2: Visual Port Matrix & Service Deep Dive */}
        {activeTab === 'ports' && (
          <div className="flex-1 p-4 sm:p-6 bg-[#02060F] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                Active Target: <span className="text-white font-bold">{currentTarget.name}</span> ({currentTarget.ip})
              </span>
              <span>
                Filter: <span className="text-[#00F0C0] uppercase">{portPreset}</span> | Protocol: <span className="text-[#10B981]">{scanType === '-sU' ? 'UDP' : 'TCP'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activePorts.map((port) => {
                const isSelected = selectedPort?.port === port.port;
                const hasVuln = flagScripts && port.cveList && port.cveList.length > 0;

                return (
                  <div
                    key={`${port.port}-${port.protocol}`}
                    onClick={() => {
                      setSelectedPort(port);
                      cyberSound.playClick();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#091D33] border-[#00F0C0] shadow-[0_0_20px_rgba(0,240,192,0.2)]'
                        : 'bg-[#051122]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#07162C]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              port.state === 'open'
                                ? 'bg-[#10B981] shadow-[0_0_8px_#10B981]'
                                : port.state === 'filtered'
                                ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                                : 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'
                            }`}
                          />
                          <span className="font-mono text-base font-bold text-white tracking-wider">
                            {port.port}
                            <span className="text-xs text-slate-400 font-normal">/{port.protocol}</span>
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            port.state === 'open'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : port.state === 'filtered'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {port.state}
                        </span>
                      </div>

                      <div className="text-xs font-mono font-semibold text-[#00F0C0] mb-1">
                        {port.service}
                      </div>

                      <div className="text-[11px] font-mono text-slate-300 truncate mb-2">
                        {flagVersion ? port.version : '[Version probe omitted (-sV not set)]'}
                      </div>

                      {hasVuln && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] font-mono mt-2">
                          <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          <span className="truncate font-semibold">
                            {port.cveList![0].id} ({port.cveList![0].severity})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Click to inspect banner</span>
                      <ExternalLink className="w-3 h-3 text-[#00F0C0] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Port Inspection Drawer */}
            {selectedPort && (
              <div className="mt-6 p-4 rounded-xl bg-[#051124] border border-[#00F0C0]/50 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                    <h3 className="font-mono text-sm font-bold text-white">
                      Deep Inspection: Port {selectedPort.port}/{selectedPort.protocol} ({selectedPort.service})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPort(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Service Banner & Fingerprint */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Service Banner:</span>
                    <p className="text-white font-semibold">
                      {flagVersion ? selectedPort.version : 'Version probe omitted (-sV not enabled)'}
                    </p>
                    {selectedPort.banner && (
                      <p className="text-slate-300 text-[11px] bg-white/[0.03] p-2 rounded border border-white/5 whitespace-pre-wrap">
                        {selectedPort.banner}
                      </p>
                    )}
                  </div>

                  {/* NSE Script Outputs */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">NSE Scripts Executed:</span>
                    {!flagScripts ? (
                      <p className="text-slate-500 text-[11px] italic">NSE Script scanning disabled (-sC not enabled during scan).</p>
                    ) : selectedPort.scripts && selectedPort.scripts.length > 0 ? (
                      selectedPort.scripts.map((s, idx) => (
                        <div key={idx} className="bg-white/[0.03] p-2 rounded border border-white/5 space-y-0.5">
                          <span className="text-[#38BDF8] font-bold text-[11px]">{s.name}</span>
                          <p className="text-slate-300 text-[10px] whitespace-pre-wrap">{s.output}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-[11px]">No script anomalies or vulnerabilities reported on this socket.</p>
                    )}
                  </div>
                </div>

                {/* CVE List if Vulnerable */}
                {flagScripts && selectedPort.cveList && selectedPort.cveList.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
                      <ShieldAlert className="w-4 h-4" />
                      <span>KNOWN CVE VULNERABILITIES IDENTIFIED</span>
                    </div>
                    {selectedPort.cveList.map((cve) => (
                      <div key={cve.id} className="p-2 rounded bg-rose-950/40 border border-rose-500/20 text-xs font-mono">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-bold">{cve.id}</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px]">
                            CVSS {cve.cvss} ({cve.severity})
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{cve.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Hop Traceroute & OS Fingerprint */}
        {activeTab === 'topology' && (
          <div className="flex-1 p-4 sm:p-6 bg-[#02060F] overflow-y-auto space-y-6">
            {/* Target OS Fingerprint Box */}
            <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#A855F7]" />
                  <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                    TCP/IP STACK OS FINGERPRINT HEURISTICS (-O)
                  </h3>
                </div>
                {!flagOs && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                    -O disabled in scan
                  </span>
                )}
              </div>

              {!flagOs ? (
                <div className="p-6 rounded-lg bg-black/40 border border-white/5 text-center font-mono text-xs text-slate-400">
                  <p>OS Detection was not requested for this scan run.</p>
                  <p className="text-slate-500 text-[11px] mt-1">Enable <span className="text-[#A855F7]">-O (OS Detect)</span> and re-run scan to extract TCP window size and IP stack heuristics.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">DEVICE TYPE</span>
                    <span className="text-white font-semibold">{currentTarget.os.deviceType}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">RUNNING OS KERNEL</span>
                    <span className="text-[#00F0C0] font-semibold">{currentTarget.os.running}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">OS CPE</span>
                    <span className="text-slate-300 font-semibold">{currentTarget.os.osCpe}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">DETAILS</span>
                    <span className="text-white font-semibold">{currentTarget.os.osDetails}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">UPTIME</span>
                    <span className="text-emerald-400 font-semibold">{currentTarget.os.uptime}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">TCP SEQUENCE PREDICTION</span>
                    <span className="text-amber-300 font-semibold">{currentTarget.os.tcpSequence}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hop Traceroute Visualization */}
            <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                    HOP TRACEROUTE & RTT LATENCY (--traceroute)
                  </h3>
                </div>
                {!flagTraceroute && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                    --traceroute disabled
                  </span>
                )}
              </div>

              {!flagTraceroute ? (
                <div className="p-6 rounded-lg bg-black/40 border border-white/5 text-center font-mono text-xs text-slate-400">
                  <p>Traceroute mapping was not requested for this scan run.</p>
                  <p className="text-slate-500 text-[11px] mt-1">Enable <span className="text-amber-300">--traceroute</span> and re-run scan to map intermediate network routing hops.</p>
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {currentTarget.traceroute.map((hop, idx) => {
                    const isLastHop = idx === currentTarget.traceroute.length - 1;

                    return (
                      <div
                        key={hop.hop}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                          isLastHop
                            ? 'bg-[#10B981]/10 border-[#10B981]/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-black/30 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {hop.hop}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{hop.address}</span>
                            {hop.host && (
                              <span className="text-[11px] text-slate-400">({hop.host})</span>
                            )}
                            {isLastHop && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold">
                                TARGET
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#00F0C0]">{hop.rtt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Status Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#050E1C] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-ping' : 'bg-[#10B981]'}`} />
              <span className="text-slate-300">{isScanning ? 'Scan in progress...' : 'Engine Ready'}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Target: <span className="text-white">{currentTarget.ip}</span> ({currentTarget.name})</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Ports: <span className="text-[#00F0C0]">{activePorts.length} mapped ({scanType === '-sU' ? 'UDP' : 'TCP'})</span></span>
            <span className="hidden sm:inline">Base Latency: <span className="text-white">{currentTarget.latencyMs}ms</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
