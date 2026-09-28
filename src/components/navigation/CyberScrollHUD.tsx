import React, { useState, useEffect } from 'react';
import { ChevronUp, Compass } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface SectionItem {
  id: string;
  shortLabel: string;
  fullLabel: string;
  code: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'home', shortLabel: 'TOP', fullLabel: 'Mission Control', code: '01' },
  { id: 'ecosystem', shortLabel: 'ECO', fullLabel: 'Ecosystem Pillars', code: '02' },
  { id: 'projects', shortLabel: 'PROJ', fullLabel: 'Active Projects', code: '03' },
  { id: 'labs', shortLabel: 'LABS', fullLabel: 'Virtual Testbeds', code: '04' },
  { id: 'research', shortLabel: 'RSRCH', fullLabel: 'Research Vectors', code: '05' },
  { id: 'technologies', shortLabel: 'TECH', fullLabel: 'Tool Architecture', code: '06' },
  { id: 'telemetry', shortLabel: 'TELEM', fullLabel: 'Global Telemetry', code: '07' },
  { id: 'contact', shortLabel: 'COMMS', fullLabel: 'Secure Dispatch', code: '08' },
];

interface CyberScrollHUDProps {
  activeSection: string;
  onSectionChange?: (sectionId: string) => void;
}

export const CyberScrollHUD: React.FC<CyberScrollHUDProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastProgress = -1;
    let lastShow = false;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const currentScrollY = window.scrollY;
        const shouldShow = currentScrollY > 320;
        if (shouldShow !== lastShow) {
          lastShow = shouldShow;
          setShowScrollTop(shouldShow);
        }

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const pct = Math.min(100, Math.max(0, Math.round((currentScrollY / totalHeight) * 100)));
          if (pct !== lastProgress) {
            lastProgress = pct;
            setScrollProgress(pct);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    cyberSound.playClick();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onSectionChange) {
      onSectionChange(id);
    }
  };

  const scrollToTop = () => {
    cyberSound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSectionChange) {
      onSectionChange('home');
    }
  };

  return (
    <>
      {/* 1. Tactical Floating Scroll-To-Top Button (Bottom Left) */}
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          onMouseEnter={() => cyberSound.playBlip()}
          className="flex items-center gap-2 p-2 rounded-full bg-[#06101E]/90 hover:bg-[#0A1A2E] border border-[#00F0C0]/40 hover:border-[#00F0C0] text-[#00F0C0] font-mono text-xs font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(0,240,192,0.2)] hover:shadow-[0_0_30px_rgba(0,240,192,0.4)] transition-all cursor-pointer group"
          title="Scroll to Top"
          aria-label="Scroll to top of page"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#00F0C0]/10 border border-[#00F0C0]/30 group-hover:bg-[#00F0C0]/20 transition-colors">
            <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 text-[#00F0C0]" />
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono pr-2">
            {scrollProgress}%
          </span>
        </button>
      </div>

      {/* 2. Desktop Quick-Scroll Tactical Rail (Right Screen Edge) */}
      <nav
        aria-label="Section Quick Navigation"
        className="fixed right-3.5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-end gap-2 p-2 rounded-xl bg-[#030914]/80 backdrop-blur-md border border-white/[0.08] shadow-[0_0_25px_rgba(0,0,0,0.7)] group/rail"
      >
        {/* Rail Header Icon */}
        <div className="flex items-center justify-center w-full pb-1 mb-1 border-b border-white/[0.06] text-slate-500">
          <Compass className="w-3.5 h-3.5 text-[#00F0C0]/60 group-hover/rail:text-[#00F0C0] transition-colors" />
        </div>

        {/* Section Navigation Pips */}
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;

          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-end"
            >
              {/* Pip Button */}
              <button
                onClick={() => scrollToSection(sec.id)}
                onMouseEnter={() => cyberSound.playBlip()}
                aria-label={`Jump to ${sec.fullLabel}`}
                title={sec.fullLabel}
                className={`flex items-center justify-center transition-all cursor-pointer rounded-full ${
                  isActive
                    ? 'w-4 h-4 bg-[#00F0C0]/20 border border-[#00F0C0] shadow-[0_0_10px_#00F0C0]'
                    : 'w-2.5 h-2.5 mx-[3px] bg-slate-600/60 hover:bg-[#00F0C0]/70 hover:scale-125 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
                )}
              </button>
            </div>
          );
        })}

        {/* Rail Depth Readout */}
        <div className="pt-1 mt-1 border-t border-white/[0.06] text-center w-full">
          <span className="text-[8px] font-mono text-slate-400 font-bold block">
            {scrollProgress}%
          </span>
        </div>
      </nav>
    </>
  );
};
