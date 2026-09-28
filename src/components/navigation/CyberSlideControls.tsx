import React from 'react';
import { ChevronLeft, ChevronRight, LayoutTemplate, Rows3 } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

export interface SlideSectionItem {
  id: string;
  shortLabel: string;
  fullLabel: string;
  code: string;
}

interface CyberSlideControlsProps {
  sections: SlideSectionItem[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
  viewMode: 'slide' | 'vertical';
  onToggleViewMode: () => void;
}

export const CyberSlideControls: React.FC<CyberSlideControlsProps> = ({
  sections,
  activeIndex,
  onPrev,
  onNext,
  onSelectIndex,
  viewMode,
  onToggleViewMode,
}) => {
  const currentSection = sections[activeIndex] || sections[0];
  const prevSection = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const nextSection = activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#030914]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(0,240,192,0.1)] select-none max-w-[96vw] overflow-x-auto scrollbar-none"
      aria-label="Tactical Slide Controls"
    >
      {/* View Mode Switcher Toggle */}
      <button
        onClick={() => {
          cyberSound.playClick();
          onToggleViewMode();
        }}
        onMouseEnter={() => cyberSound.playBlip()}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer border ${
          viewMode === 'slide'
            ? 'bg-[#00F0C0]/15 text-[#00F0C0] border-[#00F0C0]/40 shadow-[0_0_12px_rgba(0,240,192,0.25)]'
            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
        }`}
        title={viewMode === 'slide' ? 'Currently in Horizontal Slide Mode (Click for Classic Scroll)' : 'Switch to Horizontal Slide Mode'}
      >
        {viewMode === 'slide' ? (
          <>
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SLIDE DECK</span>
          </>
        ) : (
          <>
            <Rows3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VERTICAL</span>
          </>
        )}
      </button>

      <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

      {/* Prev Section Button */}
      <button
        onClick={() => {
          if (activeIndex > 0) {
            cyberSound.playClick();
            onPrev();
          }
        }}
        disabled={activeIndex === 0}
        onMouseEnter={() => activeIndex > 0 && cyberSound.playBlip()}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
          activeIndex > 0
            ? 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-[#00F0C0] border border-white/10 hover:border-[#00F0C0]/40 cursor-pointer hover:shadow-[0_0_12px_rgba(0,240,192,0.2)]'
            : 'opacity-30 text-slate-600 border border-transparent cursor-not-allowed'
        }`}
        title={prevSection ? `Previous: ${prevSection.fullLabel} (← / Up)` : 'At First Section'}
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden md:inline text-[11px] font-medium">
          {prevSection ? prevSection.shortLabel : 'START'}
        </span>
      </button>

      {/* Center Section HUD */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 rounded-xl bg-black/40 border border-white/5">
        {/* Section Counter & Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#00F0C0] font-bold">
              {currentSection.code}
            </span>
            <span className="text-[10px] font-mono text-slate-500">/</span>
            <span className="text-[10px] font-mono text-slate-400">
              0{sections.length}
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wide ml-1 hidden xs:inline">
              {currentSection.shortLabel}
            </span>
          </div>

          {/* Interactive Progress Segments */}
          <div className="flex items-center gap-1 mt-0.5">
            {sections.map((sec, idx) => {
              const isCurrent = idx === activeIndex;
              const isPassed = idx < activeIndex;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    cyberSound.playClick();
                    onSelectIndex(idx);
                  }}
                  onMouseEnter={() => cyberSound.playBlip()}
                  title={`${sec.code}: ${sec.fullLabel}`}
                  aria-label={`Jump to ${sec.fullLabel}`}
                  className={`h-1.5 transition-all cursor-pointer rounded-full ${
                    isCurrent
                      ? 'w-5 sm:w-6 bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]'
                      : isPassed
                      ? 'w-2 sm:w-2.5 bg-[#00E5BE]/50 hover:bg-[#00F0C0]'
                      : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Section Button */}
      <button
        onClick={() => {
          if (activeIndex < sections.length - 1) {
            cyberSound.playClick();
            onNext();
          }
        }}
        disabled={activeIndex >= sections.length - 1}
        onMouseEnter={() => activeIndex < sections.length - 1 && cyberSound.playBlip()}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
          activeIndex < sections.length - 1
            ? 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-[#00F0C0] border border-white/10 hover:border-[#00F0C0]/40 cursor-pointer hover:shadow-[0_0_12px_rgba(0,240,192,0.2)]'
            : 'opacity-30 text-slate-600 border border-transparent cursor-not-allowed'
        }`}
        title={nextSection ? `Next: ${nextSection.fullLabel} (→ / Down)` : 'At Last Section'}
        aria-label="Next Slide"
      >
        <span className="hidden md:inline text-[11px] font-medium">
          {nextSection ? nextSection.shortLabel : 'END'}
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Quick Keyboard/Scroll Hint */}
      <div className="hidden lg:flex items-center text-[10px] font-mono text-slate-500 pl-1">
        <span>Scroll / ← →</span>
      </div>
    </div>
  );
};
