import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Radio, Zap, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';
import { LivePacketSniffer } from '../telemetry/LivePacketSniffer';
import { SimulatedIncident } from '../../types';

interface TelemetryHUDSectionProps {
  onSimulateAttack: () => void;
  incident?: SimulatedIncident | null;
}

export const TelemetryHUDSection: React.FC<TelemetryHUDSectionProps> = ({
  onSimulateAttack,
  incident,
}) => {
  const [telemetryEvents, setTelemetryEvents] = useState<string[]>([
    '[SOCKET-IN] 192.0.2.45:443 -> TCP SYN Packet filtered by Zero-Trust ACL',
    '[SIEM-CORR] Sysmon ID 1: Process lineage validated (no parent spoofing)',
    '[SENSOR-EU] Heartbeat check ACK (11.2ms latency) - All defenses green',
    '[YARA-HEUR] Evaluated 42 binary objects in memory pool - Clean'
  ]);

  const [counter, setCounter] = useState(14290);

  // Background random telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c + Math.floor(Math.random() * 3));
      const pool = [
        `[INTRUSION-DROP] Blocked port scan from ${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.14.88`,
        `[AUDIT-LOG] Cryptographic evidence block hashed: 0x${Math.random().toString(16).slice(2, 10)}`,
        `[ZEEK-FLOW] TLS 1.3 handshake verified with strict certificate pinning`,
        `[SIGMA-SCAN] 41 rules evaluated against streaming Sysmon socket`,
        `[AI-AGENT] Automated triage completed with 99.1% threat elimination score`
      ];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setTelemetryEvents((prev) => [randomMsg, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // React to incident lifecycle stages
  useEffect(() => {
    if (!incident) return;

    let logMsg = '';
    if (incident.stage === 'inbound') {
      logMsg = `[INTRUSION-DETECT] Hostile vector ${incident.vector} targeting Node ${incident.targetNode}`;
    } else if (incident.stage === 'incident_generated') {
      logMsg = `[CRIT-INCIDENT] #${incident.id} generated - Active payload alert at ${incident.targetIp}`;
    } else if (incident.stage === 'containing') {
      logMsg = `[ZERO-TRUST-ACL] Automated isolation policy executed on ${incident.targetNode} socket`;
    } else if (incident.stage === 'resolved') {
      logMsg = `[INCIDENT-CLOSED] #${incident.id} neutralized. Telemetry restored to NOMINAL.`;
    }

    if (logMsg) {
      setTelemetryEvents((prev) => [logMsg, ...prev.slice(0, 4)]);
    }
  }, [incident]);

  return (
    <section id="telemetry" className="relative py-12 border-t border-white/[0.04] bg-[#030814]/90 cyber-section-visibility" aria-label="Live Telemetry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#061020]/90 border border-[#00F0C0]/25 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Top Label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0C0] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0C0]" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>GLOBAL DEFENSE TELEMETRY HUD</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00F0C0]/15 text-[#00E5BE] border border-[#00F0C0]/30 hidden sm:inline">
                    LIVE STREAM
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">Autonomous threat mitigation &amp; sensor telemetry network</p>
              </div>
            </div>

            {/* Test Red-Team Intrusion with Incident Lifecycle */}
            <button
              onClick={() => {
                if (!incident) {
                  cyberSound.playAlert();
                  onSimulateAttack();
                }
              }}
              disabled={!!incident}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-bold transition-all shadow-lg self-start sm:self-auto cursor-pointer ${
                incident?.stage === 'inbound'
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-wait'
                  : incident?.stage === 'incident_generated'
                  ? 'bg-rose-500/25 border border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse cursor-wait'
                  : incident?.stage === 'containing'
                  ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-wait'
                  : incident?.stage === 'resolved'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 hover:border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:scale-105 active:scale-95'
              }`}
            >
              {incident?.stage === 'inbound' ? (
                <>
                  <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>INTRUSION INBOUND...</span>
                </>
              ) : incident?.stage === 'incident_generated' ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>INCIDENT #{incident.id} ACTIVE</span>
                </>
              ) : incident?.stage === 'containing' ? (
                <>
                  <RotateCcw className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>CONTAINING THREAT...</span>
                </>
              ) : incident?.stage === 'resolved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✓ INCIDENT CONTAINED</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>TEST RED-TEAM INTRUSION</span>
                </>
              )}
            </button>
          </div>

          {/* 3D Reactive Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-white/[0.08]">
            {/* Metric 1 */}
            <Cyber3DCard
              customColor="#00F0C0"
              maxTilt={16}
              lift={14}
              className="p-4"
            >
              <div style={{ transform: 'translateZ(24px)' }}>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0C0]" />
                  <span>Threats Neutralized</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  {counter.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-[#00F0C0] mt-1 flex items-center gap-1">
                  <span>↑</span>
                  <span>Active Real-Time</span>
                </div>
              </div>
            </Cyber3DCard>

            {/* Metric 2 */}
            <Cyber3DCard
              customColor="#38BDF8"
              maxTilt={16}
              lift={14}
              className="p-4"
            >
              <div style={{ transform: 'translateZ(24px)' }}>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                  <span>Detection Latency</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  {incident ? '4.2 ms' : '11.8 ms'}
                </div>
                <div className="text-[10px] font-mono text-sky-400 mt-1 flex items-center gap-1">
                  <span>✓</span>
                  <span>{incident ? 'Intrusion Tracked' : 'Nominal Response'}</span>
                </div>
              </div>
            </Cyber3DCard>

            {/* Metric 3 */}
            <Cyber3DCard
              customColor="#A855F7"
              maxTilt={16}
              lift={14}
              className="p-4"
            >
              <div style={{ transform: 'translateZ(24px)' }}>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>MITRE ATT&amp;CK Coverage</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  87.4%
                </div>
                <div className="text-[10px] font-mono text-purple-400 mt-1">
                  {incident ? `Evaluated ${incident.technique}` : 'v14 Enterprise Matrix'}
                </div>
              </div>
            </Cyber3DCard>

            {/* Metric 4 */}
            <Cyber3DCard
              customColor="#FBBF24"
              maxTilt={16}
              lift={14}
              className="p-4"
            >
              <div style={{ transform: 'translateZ(24px)' }}>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sensor Relays</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  4 Nodes
                </div>
                <div className="text-[10px] font-mono text-amber-400 mt-1">
                  Global Mesh Healthy
                </div>
              </div>
            </Cyber3DCard>
          </div>

          {/* Promiscuous Live Network Packet Sniffer (Wireshark-style Dissector) */}
          <div className="pt-6">
            <LivePacketSniffer />
          </div>

          {/* Real-Time Event Feed */}
          <div className="pt-4 font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] animate-ping" />
              <span>Live Stream Ticker:</span>
            </div>
            <div className="space-y-1.5">
              {telemetryEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      evt.includes('CRIT') || evt.includes('INTRUSION')
                        ? 'bg-rose-500 animate-pulse'
                        : evt.includes('CONTAINED') || evt.includes('CLOSED')
                        ? 'bg-emerald-400'
                        : 'bg-[#00F0C0]'
                    }`}
                  />
                  <span className="truncate">{evt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
