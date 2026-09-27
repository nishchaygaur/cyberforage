import React, { useState } from 'react';
import { Network, ShieldAlert, ShieldCheck, Crosshair, ArrowRight, X, ExternalLink, Zap } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface APTProfile {
  id: string;
  name: string;
  aliases: string;
  origin: string;
  targetIndustries: string[];
  initialVector: string;
  primaryCVE: string;
  persistence: string;
  counterPlaybook: string;
  color: string;
}

const APT_GROUPS: APTProfile[] = [
  {
    id: 'apt29',
    name: 'APT29 (Cozy Bear / Midnight Blizzard)',
    aliases: 'Nobelium, Cloaked Ursa',
    origin: 'Eastern Europe / SVR',
    targetIndustries: ['Government', 'Defense Tech', 'Cloud Providers', 'Think Tanks'],
    initialVector: 'OAuth Token Theft & Malicious Azure App Registrations',
    primaryCVE: 'CVE-2023-38606 (Zero-Day Token Replay)',
    persistence: 'Federated Identity Trust Injection & Dormant App Permissions',
    counterPlaybook: 'Enforce strict FIDO2 WebAuthn keys, automated token revocation on anomaly, and continuous Cloud Identity posture audit.',
    color: '#00F0C0',
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group (HIDDEN COBRA)',
    aliases: 'Diamond Sleet, Zinc, APT38',
    origin: 'East Asia',
    targetIndustries: ['DeFi Platforms', 'Cryptocurrency Exchanges', 'Aerospace'],
    initialVector: 'Trojanized PDF Candidate Resumes & Weaponized npm Packages',
    primaryCVE: 'CVE-2024-3094 (Liblzma Backdoor Pattern)',
    persistence: 'Reflective In-Memory DLL Injection & Obfuscated PowerShell',
    counterPlaybook: 'Egress filtering with strict domain whitelisting, immutable container builds, and memory scanning via YARA.',
    color: '#A855F7',
  },
  {
    id: 'volt_typhoon',
    name: 'Volt Typhoon (Vanguard Panda)',
    aliases: 'Bronze Silhouette, Dev-0391',
    origin: 'East Asia',
    targetIndustries: ['Critical Infrastructure', 'Water Utilities', 'Ports', 'Power Grids'],
    initialVector: 'Edge Gateway & SOHO Router Exploitation (Ivanti/Fortinet)',
    primaryCVE: 'CVE-2024-21887 (Ivanti Connect Secure RCE)',
    persistence: 'Living-off-the-Land (LotL) using built-in WMI, Netsh, and PowerShell',
    counterPlaybook: 'Complete network microsegmentation, aggressive session timeout limits, and out-of-band firmware integrity attestation.',
    color: '#38BDF8',
  },
  {
    id: 'sandworm',
    name: 'Sandworm (Seashell Blizzard)',
    aliases: 'APT44, TeleBots, Voodoo Bear',
    origin: 'Eastern Europe / GRU Unit 74455',
    targetIndustries: ['Energy Grid', 'Railway Infrastructure', 'Telecoms'],
    initialVector: 'Compromised Firmware Updates & SCADA/ICS Protocol Hijack',
    primaryCVE: 'CVE-2022-30190 (Follina MSDT Execution)',
    persistence: 'HermeticWiper / CaddyWiper destructive disk corruption payloads',
    counterPlaybook: 'Air-gapped OT/IT operational boundaries, physical write-protect switches on PLC controllers, and automated cold backup replication.',
    color: '#F43F5E',
  },
];

interface ThreatIntelGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatIntelGraphModal: React.FC<ThreatIntelGraphModalProps> = ({ isOpen, onClose }) => {
  const [selectedApt, setSelectedApt] = useState<APTProfile>(APT_GROUPS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#030914] border border-[#00F0C0]/50 shadow-[0_0_50px_rgba(0,240,192,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#061224]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00F0C0]/15 border border-[#00F0C0]/40 flex items-center justify-center">
              <Network className="w-4 h-4 text-[#00F0C0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                  Global Threat Actor & Attack Graph Dossier
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#00F0C0]">
                  MITRE ATT&CK Framework
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Adversary profiles, attack chains, exploited CVEs, and defensive playbooks
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

        {/* Content Body: Left Column Selector, Right Column Attack Graph & Playbook */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden font-mono">
          {/* Left Column: Actor Selection Pills */}
          <div className="w-full md:w-72 border-r border-white/10 p-4 bg-[#051122]/60 overflow-y-auto space-y-2">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              Select Threat Actor
            </div>
            {APT_GROUPS.map((apt) => {
              const isSelected = selectedApt.id === apt.id;
              return (
                <button
                  key={apt.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedApt(apt);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white/10 border-white/40 shadow-lg'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? apt.color : undefined,
                    boxShadow: isSelected ? `0 0 15px ${apt.color}33` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">{apt.name.split('(')[0]}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: apt.color }} />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{apt.origin}</div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Attack Chain Breakdown */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#02060E]">
            {/* Actor Banner */}
            <div className="p-4 rounded-xl bg-[#061426] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Aliases: {selectedApt.aliases}</span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full border font-bold"
                  style={{
                    backgroundColor: `${selectedApt.color}22`,
                    borderColor: `${selectedApt.color}66`,
                    color: selectedApt.color,
                  }}
                >
                  Active Campaign
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{selectedApt.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedApt.targetIndustries.map((ind, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* Attack Chain Stages (Visual Pipeline) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#00F0C0] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Visualized Cyber Kill Chain</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Stage 1: Initial Ingress */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 relative">
                  <div className="text-[10px] text-slate-400 uppercase mb-1">Phase 1: Ingress</div>
                  <div className="text-xs font-bold text-white mb-1">Initial Access Vector</div>
                  <p className="text-[11px] text-slate-300 leading-tight">{selectedApt.initialVector}</p>
                </div>

                {/* Stage 2: Weaponized CVE */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-rose-500/30">
                  <div className="text-[10px] text-rose-400 uppercase mb-1">Phase 2: Exploit</div>
                  <div className="text-xs font-bold text-rose-300 mb-1">{selectedApt.primaryCVE}</div>
                  <p className="text-[11px] text-slate-300 leading-tight">Weaponized remote zero-day execution</p>
                </div>

                {/* Stage 3: Persistence */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase mb-1">Phase 3: C2 & Foothold</div>
                  <div className="text-xs font-bold text-white mb-1">Persistence Mechanism</div>
                  <p className="text-[11px] text-slate-300 leading-tight">{selectedApt.persistence}</p>
                </div>
              </div>
            </div>

            {/* Zero-Trust Counter-Playbook */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Cyberforage Zero-Trust Defensive Counter-Playbook</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {selectedApt.counterPlaybook}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
