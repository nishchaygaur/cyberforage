import React, { useState } from 'react';
import { Cpu, ShieldAlert, CheckCircle2, Search, ArrowRight, X, Sparkles, AlertTriangle, Code } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface ThreatAnalysis {
  cve: string;
  title: string;
  cvss: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  actor: string;
  attackVector: string;
  mitreTechniques: string[];
  summary: string;
  detectionRule: string;
  remediation: string;
}

const PRESET_THREATS: Record<string, ThreatAnalysis> = {
  'CVE-2024-3094': {
    cve: 'CVE-2024-3094',
    title: 'XZ Utils / Liblzma SSH Authentication Bypass Backdoor',
    cvss: 10.0,
    severity: 'CRITICAL',
    actor: 'Jia Tan / Sophisticated State-Sponsored Actor',
    attackVector: 'Multi-stage tarball m4 build script injection targeting OpenSSH via libsystemd link',
    mitreTechniques: ['T1195.001 Supply Chain Compromise', 'T1574.006 Dynamic Linker Hijacking', 'T1059.004 Unix Shell'],
    summary: 'A sophisticated multi-year supply chain backdoor inserted into upstream xz tarballs modifying liblzma ELF symbols (RSA_public_decrypt) allowing unauthorized remote pre-auth code execution over SSH.',
    detectionRule: `yara: rule Suspicious_XZ_Liblzma_Backdoor {
  strings: $hex = { F3 0F 1E FA 55 48 89 E5 41 57 41 56 }
  condition: uint32(0) == 0x464C457F and $hex in (0x1000..0x3000)
}`,
    remediation: 'Immediately downgrade xz-utils to 5.4.x, sanitize build pipeline runner cache, and inspect all SSH host keys.',
  },
  'CVE-2021-44228': {
    cve: 'CVE-2021-44228',
    title: 'Log4Shell: Apache Log4j2 JNDI Remote Code Execution',
    cvss: 10.0,
    severity: 'CRITICAL',
    actor: 'Widespread Exploitation (Ransomware, APT41, Miner Botnets)',
    attackVector: 'JNDI lookups in logged user-controlled strings (e.g., User-Agent or URI) loading remote Java classes',
    mitreTechniques: ['T1190 Exploit Public-Facing App', 'T1059.007 JavaScript/JNDI', 'T1105 Ingress Tool Transfer'],
    summary: 'Insecure JNDI lookup evaluation in log messages allowing unauthenticated arbitrary code execution via malicious LDAP, RMI, or DNS endpoints.',
    detectionRule: `sigma:
  selection:
    c-uri|contains: '\${jndi:ldap:'
  condition: selection`,
    remediation: 'Upgrade to Log4j 2.17.1+, set log4j2.formatMsgNoLookups=true, or strip JndiLookup.class from classpaths.',
  },
  'CVE-2023-38606': {
    cve: 'CVE-2023-38606',
    title: 'Operation Triangulation: Apple XNU Kernel Memory Map Zero-Day',
    cvss: 8.8,
    severity: 'HIGH',
    actor: 'Advanced Persistent Threat (APT / Operation Triangulation)',
    attackVector: 'Hardware MMIO registers accessed through unmapped physical memory pages to bypass Page Protection Layer (PPL)',
    mitreTechniques: ['T1068 Privilege Escalation', 'T1542.001 Firmware/Hardware Register Hijack', 'T1055 Process Injection'],
    summary: 'Abuse of hidden undocumented hardware memory-mapped I/O registers in Apple silicon to modify page tables and execute kernel-level code without triggering PPL hardware traps.',
    detectionRule: `yara: rule Apple_Kernel_MMIO_Bypass {
  strings: $reg = { 02 00 00 20 00 00 00 00 }
  condition: all of them
}`,
    remediation: 'Deploy vendor iOS 16.5.1/macOS 13.4.1 updates and enforce lockdown mode on high-threat mission devices.',
  },
  'STAGER-POWERSHELL': {
    cve: 'C2-STAGER',
    title: 'Obfuscated PowerShell In-Memory Cobalt Strike Beacon',
    cvss: 9.3,
    severity: 'CRITICAL',
    actor: 'FIN7 / BlackCat Ransomware Affiliates',
    attackVector: 'Base64 encoded GZip stream invoking VirtualAlloc, WriteProcessMemory, and CreateThread in unbacked memory',
    mitreTechniques: ['T1059.001 PowerShell', 'T1027 Obfuscated Files', 'T1055.002 PE Injection'],
    summary: 'A fileless stager payload that allocates executable RWX virtual memory directly inside powershell.exe and injects reflective DLL loader code communicating with external C2 servers.',
    detectionRule: `sigma:
  selection:
    CommandLine|contains:
      - 'powershell -nop -w hidden -enc'
      - 'FromBase64String'
      - 'VirtualAlloc'
  condition: selection`,
    remediation: 'Enforce PowerShell Constrained Language Mode, enable Script Block Logging (EID 4104), and block unbacked RWX allocations via AMSI.',
  }
};

interface SentinelThreatScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SentinelThreatScannerModal: React.FC<SentinelThreatScannerModalProps> = ({ isOpen, onClose }) => {
  const [selectedKey, setSelectedKey] = useState<string>('CVE-2024-3094');
  const [customInput, setCustomInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(PRESET_THREATS['CVE-2024-3094']);

  if (!isOpen) return null;

  const handleSelectPreset = (key: string) => {
    cyberSound.playClick();
    setSelectedKey(key);
    setIsScanning(true);
    setAnalysis(null);

    setTimeout(() => {
      setAnalysis(PRESET_THREATS[key]);
      setIsScanning(false);
      cyberSound.playLaser();
      cyberSound.speakVoice(`Analysis complete for ${key}`);
    }, 600);
  };

  const handleCustomAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    cyberSound.playClick();
    setIsScanning(true);
    setAnalysis(null);

    setTimeout(() => {
      const generated: ThreatAnalysis = {
        cve: customInput.toUpperCase(),
        title: `AI Triage: ${customInput.trim()}`,
        cvss: 9.1,
        severity: 'CRITICAL',
        actor: 'Threat Intelligence Correlation Pool (Zero-Trust Heuristics)',
        attackVector: 'Observed anomalous behavioral heuristic: Remote code execution pattern detected in payload structure.',
        mitreTechniques: ['T1059 Execution', 'T1190 Exploit Public-Facing App', 'T1071 Application Layer Protocol'],
        summary: `Sentinel AI analyzed "${customInput.trim()}". Identified indicators consistent with weaponized remote access payloads requiring immediate network boundary quarantine.`,
        detectionRule: `rule Sentinel_Custom_Heuristic_${Math.floor(Math.random() * 1000)} {
  meta: confidence = "98.4%"
  strings: $target = "${customInput.trim().slice(0, 20)}"
  condition: $target
}`,
        remediation: 'Quarantine ingress gateway, review VPC firewall policies, and deploy signature to perimeter WAF / SIEM.',
      };
      setAnalysis(generated);
      setIsScanning(false);
      cyberSound.playLaser();
      cyberSound.speakVoice("Custom telemetry scan verified");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#030914] border border-[#00F0C0]/50 shadow-[0_0_50px_rgba(0,240,192,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#061224]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00F0C0]/15 border border-[#00F0C0]/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#00F0C0] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                  Sentinel Core AI Threat Triage
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/40">
                  v3.8-AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Automated CVE attribution, MITRE technique mapping, and Zero-Trust patch synthesis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="p-4 bg-[#051122]/70 border-b border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0C0]" /> Presets:
          </span>
          {Object.keys(PRESET_THREATS).map((k) => (
            <button
              key={k}
              onClick={() => handleSelectPreset(k)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedKey === k
                  ? 'bg-[#00F0C0]/20 border border-[#00F0C0] text-[#00F0C0] shadow-[0_0_10px_rgba(0,240,192,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Custom Input Bar */}
        <form onSubmit={handleCustomAnalyze} className="p-4 border-b border-white/5 flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00F0C0]/60">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Query any CVE (e.g., CVE-2024-6387) or paste suspicious shellcode..."
              className="w-full bg-transparent text-xs font-mono text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#00F0C0] hover:bg-[#00E5BE] text-[#040812] font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>ANALYZE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Analysis Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isScanning && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Cpu className="w-10 h-10 text-[#00F0C0] animate-spin mb-3" />
              <div className="text-xs font-mono text-[#00F0C0] font-bold tracking-widest uppercase">
                Correlating Threat Intelligence Nodes...
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Decompiling signatures, mapping CVE taxonomies, generating sigma rules
              </p>
            </div>
          )}

          {!isScanning && analysis && (
            <div className="space-y-4 animate-fadeIn">
              {/* Top Banner Card */}
              <div className="p-4 rounded-xl bg-[#07152B] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      {analysis.cve}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      CVSS {analysis.cvss.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <h3 className="text-base font-mono font-bold text-white">
                    {analysis.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold self-start sm:self-auto">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{analysis.severity} THREAT</span>
                </div>
              </div>

              {/* Attribution & Vector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                    Attributed Actor
                  </div>
                  <div className="text-[#38BDF8] font-bold">{analysis.actor}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                    Attack Vector
                  </div>
                  <div className="text-slate-200">{analysis.attackVector}</div>
                </div>
              </div>

              {/* MITRE ATT&CK Matrix */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-[#00F0C0]" />
                  <span>MITRE ATT&CK Tactics Mapped</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.mitreTechniques.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#00F0C0]/10 border border-[#00F0C0]/30 text-[#00F0C0] font-mono text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-[#040D1B] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                {analysis.summary}
              </div>

              {/* Sigma / YARA Rule Box */}
              <div className="p-4 rounded-xl bg-[#02060E] border border-white/10">
                <div className="text-[11px] font-mono font-bold text-[#00F0C0] mb-2 uppercase tracking-wider">
                  Synthesized Detection Rule (YARA / Sigma)
                </div>
                <pre className="text-[11px] font-mono text-slate-300 bg-black/60 p-3 rounded-lg border border-white/5 overflow-x-auto">
                  {analysis.detectionRule}
                </pre>
              </div>

              {/* Zero-Trust Remediation Patch */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recommended Zero-Trust Remediation</span>
                </div>
                <p className="text-xs font-mono text-emerald-200/90 leading-relaxed">
                  {analysis.remediation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
