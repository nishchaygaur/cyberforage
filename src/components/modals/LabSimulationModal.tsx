import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle2, ShieldAlert, Terminal, ShieldCheck, Activity } from 'lucide-react';
import { Lab } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface LabSimulationModalProps {
  lab: Lab | null;
  onClose: () => void;
}

export const LabSimulationModal: React.FC<LabSimulationModalProps> = ({ lab, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (lab) {
      setCurrentStep(0);
      setIsRunning(false);
      setLogs([
        `[LAB INITIALIZED] ${lab.name.toUpperCase()} - CATEGORY: ${lab.category.toUpperCase()}`,
        `[SANDBOX] Ready to emulate adversary vector: "${lab.attackVectors[0]}"`,
        `[STATUS] Awaiting operator detonation signal...`
      ]);
    }
  }, [lab]);

  const steps = [
    'Initialize Isolated Sandbox Testbed',
    'Execute Adversary Vector',
    'Ingest Live Telemetry & Process Lineage',
    'Correlate Sigma & YARA Heuristic Rules',
    'Apply Automated Containment Countermeasure'
  ];

  const handleStartSimulation = () => {
    if (isRunning || !lab) return;
    setIsRunning(true);
    setCurrentStep(1);
    cyberSound.playAlert();

    // Step by step simulation
    setTimeout(() => {
      setCurrentStep(2);
      cyberSound.playLaser();
      setLogs((prev) => [
        ...prev,
        `[VECTOR-EXEC] Emulating ${lab.attackVectors[0]}...`,
        `[ATTACK-STATUS] Synthetic payload detonated in isolated hypervisor container.`
      ]);
    }, 1200);

    setTimeout(() => {
      setCurrentStep(3);
      cyberSound.playClick();
      setLogs((prev) => [
        ...prev,
        ...lab.simulatedLogs.slice(0, 2),
        `[TELEMETRY] Sensor socket captured 18 event envelopes with cryptographic trace tokens.`
      ]);
    }, 2500);

    setTimeout(() => {
      setCurrentStep(4);
      cyberSound.playClick();
      setLogs((prev) => [
        ...prev,
        ...lab.simulatedLogs.slice(2),
        `[DEFENSE] Matched defensive technique: "${lab.defenseTechniques[0]}"`
      ]);
    }, 3800);

    setTimeout(() => {
      setCurrentStep(5);
      setIsRunning(false);
      cyberSound.playPulse();
      setLogs((prev) => [
        ...prev,
        `[CONTAINMENT SUCCESS] Threat vector neutralized. 0 Hostile persistence mechanisms survived.`,
        `[AUDIT SEAL] Lab scenario marked COMPLETE with 100% telemetry capture fidelity.`
      ]);
    }, 5000);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    if (lab) {
      setLogs([
        `[LAB INITIALIZED] ${lab.name.toUpperCase()} - CATEGORY: ${lab.category.toUpperCase()}`,
        `[SANDBOX] Ready to emulate adversary vector: "${lab.attackVectors[0]}"`,
        `[STATUS] Awaiting operator detonation signal...`
      ]);
    }
  };

  if (!lab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#030914] border border-[#00F0C0]/40 shadow-[0_0_60px_rgba(0,240,192,0.15)] overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#051122] border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">{lab.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/30">
                  {lab.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {lab.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Live Interactive Adversary Emulation Sandbox</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Overview */}
          <div className="p-4 rounded-xl bg-[#061426]/70 border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {lab.fullOverview}
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Simulation Execution Pipeline</span>
              <span className="text-[#00F0C0]">
                {currentStep === 5 ? 'COMPLETED' : isRunning ? `EXECUTING (STEP ${currentStep}/5)` : 'STANDBY'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {steps.map((st, i) => {
                const stepNum = i + 1;
                const isDone = currentStep > stepNum || currentStep === 5;
                const isCurrent = currentStep === stepNum;
                return (
                  <div
                    key={st}
                    className={`p-2.5 rounded-xl border transition-all text-center ${
                      isDone
                        ? 'bg-[#00F0C0]/15 border-[#00F0C0]/50 text-[#00F0C0]'
                        : isCurrent
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 animate-pulse'
                        : 'bg-white/[0.02] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold mb-1">STAGE 0{stepNum}</div>
                    <div className="text-[10px] leading-tight line-clamp-2">{st}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry Console Log Terminal */}
          <div className="rounded-xl bg-[#02060e] border border-white/10 p-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00F0C0]" />
                <span className="text-[#00F0C0] font-semibold">SANDBOX TELEMETRY STREAM</span>
              </div>
              <span className="text-[10px] text-slate-500">FORMAT: CEF / SYSMON / ZEEK</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('SUCCESS') || log.includes('COMPLETE')
                      ? 'text-[#00F0C0]'
                      : log.includes('ALERT') || log.includes('EXEC')
                      ? 'text-rose-400'
                      : log.includes('DEFENSE')
                      ? 'text-purple-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Defense Techniques Applied */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#061426]/60 border border-white/5">
              <div className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Simulated Attack Vectors</span>
              </div>
              <ul className="space-y-1.5">
                {lab.attackVectors.map((v) => (
                  <li key={v} className="text-xs text-slate-300 font-mono flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#061426]/60 border border-white/5">
              <div className="text-xs font-mono font-semibold text-[#00F0C0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00F0C0]" />
                <span>Defensive Countermeasures</span>
              </div>
              <ul className="space-y-1.5">
                {lab.defenseTechniques.map((d) => (
                  <li key={d} className="text-xs text-slate-300 font-mono flex items-start gap-2">
                    <span className="text-[#00F0C0] font-bold">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-[#051122] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>

          <button
            onClick={handleStartSimulation}
            disabled={isRunning}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-not-allowed'
                : 'bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] shadow-[0_0_20px_rgba(0,229,190,0.35)]'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunning ? 'Emulation in Progress...' : 'Detonate Attack Scenario'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
