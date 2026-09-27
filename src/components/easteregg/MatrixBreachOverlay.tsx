import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Terminal, Lock, Unlock, X, Download, FileText } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface MatrixBreachOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatrixBreachOverlay: React.FC<MatrixBreachOverlayProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    cyberSound.playAlert();
    cyberSound.speakVoice("Zero-day breach detected. Level five classified dossier unlocked.");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix characters: katakana + latin + hex + symbols
    const chars = '0123456789ABCDEFﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    let animationFrameId: number;

    const render = () => {
      // Semi-transparent black background to leave trails
      ctx.fillStyle = 'rgba(2, 6, 14, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright white-green head, cyan-green body
        if (Math.random() > 0.9) {
          ctx.fillStyle = '#FFFFFF';
        } else if (Math.random() > 0.4) {
          ctx.fillStyle = '#00F0C0';
        } else {
          ctx.fillStyle = '#10B981';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] overflow-hidden select-none bg-black/90 flex items-center justify-center p-4">
      {/* Canvas Matrix Rain */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />

      {/* Holographic Breach Dossier Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#030914]/95 border-2 border-[#00F0C0] shadow-[0_0_80px_rgba(0,240,192,0.4)] backdrop-blur-xl p-6 sm:p-8 animate-fadeIn text-white font-mono flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#00F0C0]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00F0C0]/20 border border-[#00F0C0] flex items-center justify-center shadow-[0_0_20px_#00F0C0]">
              <Unlock className="w-5 h-5 text-[#00F0C0] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/50 font-bold uppercase animate-pulse">
                  ROOT BREACH ACTIVE
                </span>
                <span className="text-xs text-slate-400">CLEARANCE: LEVEL 5</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                CLASSIFIED CYBERFORAGE DOSSIER
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
            title="Exit Matrix Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative / Context */}
        <p className="text-xs text-slate-300 leading-relaxed bg-[#02060E] p-3 rounded-lg border border-white/10">
          You unlocked the hidden zero-day research corridor. All internal kernel security advisories, memory corruption research papers, and experimental AI offensive telemetry are unlocked below.
        </p>

        {/* Secret Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00F0C0]/60 transition-colors">
            <div className="text-[10px] text-[#00F0C0] font-bold uppercase mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> DOSSIER 01
            </div>
            <div className="text-xs font-bold text-white mb-1">eBPF Memory Race 0-Day</div>
            <div className="text-[11px] text-slate-400">Kernel ring buffer arbitrary read/write POC.</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00F0C0]/60 transition-colors">
            <div className="text-[10px] text-[#A855F7] font-bold uppercase mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> DOSSIER 02
            </div>
            <div className="text-xs font-bold text-white mb-1">ML-KEM-768 Lattice Attack</div>
            <div className="text-[11px] text-slate-400">Post-quantum key-exchange side-channel study.</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00F0C0]/60 transition-colors">
            <div className="text-[10px] text-[#38BDF8] font-bold uppercase mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> DOSSIER 03
            </div>
            <div className="text-xs font-bold text-white mb-1">AI Sybil Agent Swarm</div>
            <div className="text-[11px] text-slate-400">Autonomous red-team multi-agent C2 framework.</div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">ESC</kbd> or click button to close
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00F0C0] hover:bg-[#00E5BE] text-[#040812] font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,192,0.4)]"
          >
            DISMISS BREACH OVERLAY
          </button>
        </div>
      </div>
    </div>
  );
};
