import React, { useState, useEffect } from 'react';

interface PrismMonolithStageProps {
  className?: string;
  mouseParallax?: boolean;
}

export const PrismMonolithStage: React.FC<PrismMonolithStageProps> = ({
  className = '',
  mouseParallax = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseParallax]);

  // Stepped pillar heights (symmetrical amphitheater V-shape from reference video)
  // Left side steps DOWN towards center, right side steps UP towards outer edge
  const leftPillars = [
    { heightPercent: 68, depth: 32, label: 'ALPHA-01' },
    { heightPercent: 54, depth: 24, label: 'ALPHA-02' },
    { heightPercent: 42, depth: 16, label: 'ALPHA-03' },
    { heightPercent: 30, depth: 8, label: 'ALPHA-04' },
    { heightPercent: 18, depth: 2, label: 'ALPHA-05' },
  ];

  const rightPillars = [
    { heightPercent: 18, depth: 2, label: 'OMEGA-05' },
    { heightPercent: 30, depth: 8, label: 'OMEGA-04' },
    { heightPercent: 42, depth: 16, label: 'OMEGA-03' },
    { heightPercent: 54, depth: 24, label: 'OMEGA-02' },
    { heightPercent: 68, depth: 32, label: 'OMEGA-01' },
  ];

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Deep Obsidian Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[750px] bg-gradient-to-b from-blue-600/[0.04] via-purple-600/[0.03] to-transparent blur-[160px] rounded-full pointer-events-none" />

      {/* Symmetrical Stepped Monolith Stage Pillars */}
      <div className="absolute inset-x-0 bottom-0 h-[82%] sm:h-[86%] flex items-end justify-between px-2 sm:px-6 lg:px-12 gap-1.5 sm:gap-3 lg:gap-4 opacity-90 transition-transform duration-700 ease-out">
        {/* Left Amphitheater Pillars (Stepping down to center) */}
        <div className="flex-1 flex items-end justify-end gap-1.5 sm:gap-2.5 lg:gap-3.5 h-full">
          {leftPillars.map((pillar, idx) => {
            const parallaxX = mousePos.x * (pillar.depth * 0.25);
            const parallaxY = mousePos.y * (pillar.depth * 0.15);

            return (
              <div
                key={`left-${idx}`}
                style={{
                  height: `${pillar.heightPercent}%`,
                  transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative flex-1 max-w-[85px] sm:max-w-[110px] lg:max-w-[130px] rounded-t-lg bg-gradient-to-b from-[#0f172a] via-[#070c18] to-[#020408] border-t border-l border-r border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.85)] group pointer-events-auto cursor-pointer"
              >
                {/* Iridescent Rainbow Prismatic Top Edge Refraction Line */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#ff0055] via-[#ffaa00] via-[#00ffaa] via-[#00e5ff] to-[#8b5cf6] shadow-[0_0_12px_rgba(0,229,255,0.8),0_0_24px_rgba(255,0,85,0.5)] z-20" />

                {/* Vertical Prism Light Beam Aura */}
                <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-t from-[#00F0C0]/[0.08] to-transparent blur-sm pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Subtle Pillar Technical Coordinates */}
                <div className="hidden lg:block absolute bottom-6 inset-x-0 text-center font-mono text-[9px] text-slate-600 tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">
                  {pillar.label}
                </div>

                {/* Subtle Inner Face Sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/60 pointer-events-none rounded-t-lg" />
              </div>
            );
          })}
        </div>

        {/* Center Chasm Gap for 3D Defense Core & Stage Center */}
        <div className="w-12 sm:w-24 md:w-36 lg:w-48 xl:w-64 flex-shrink-0 relative h-full flex flex-col justify-end items-center">
          {/* Base Platform Horizon Line */}
          <div className="w-full h-[6%] rounded-t-lg bg-gradient-to-b from-[#0a1224] to-[#020408] border-t border-white/[0.08] relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0C0]/60 to-transparent shadow-[0_0_12px_rgba(0,240,192,0.6)]" />
          </div>
        </div>

        {/* Right Amphitheater Pillars (Stepping up from center) */}
        <div className="flex-1 flex items-end justify-start gap-1.5 sm:gap-2.5 lg:gap-3.5 h-full">
          {rightPillars.map((pillar, idx) => {
            const parallaxX = mousePos.x * (pillar.depth * 0.25);
            const parallaxY = mousePos.y * (pillar.depth * 0.15);

            return (
              <div
                key={`right-${idx}`}
                style={{
                  height: `${pillar.heightPercent}%`,
                  transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative flex-1 max-w-[85px] sm:max-w-[110px] lg:max-w-[130px] rounded-t-lg bg-gradient-to-b from-[#0f172a] via-[#070c18] to-[#020408] border-t border-l border-r border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.85)] group pointer-events-auto cursor-pointer"
              >
                {/* Iridescent Rainbow Prismatic Top Edge Refraction Line */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#8b5cf6] via-[#00e5ff] via-[#00ffaa] via-[#ffaa00] to-[#ff0055] shadow-[0_0_12px_rgba(0,229,255,0.8),0_0_24px_rgba(255,0,85,0.5)] z-20" />

                {/* Vertical Prism Light Beam Aura */}
                <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-t from-[#A855F7]/[0.08] to-transparent blur-sm pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Subtle Pillar Technical Coordinates */}
                <div className="hidden lg:block absolute bottom-6 inset-x-0 text-center font-mono text-[9px] text-slate-600 tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">
                  {pillar.label}
                </div>

                {/* Subtle Inner Face Sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/60 pointer-events-none rounded-t-lg" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
