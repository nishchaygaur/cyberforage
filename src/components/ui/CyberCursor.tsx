import React, { useEffect, useState, useRef } from 'react';

export const CyberCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const hudPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only activate custom cursor on devices that support hover (non-touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('canvas')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for the trailing outer tactical HUD frame
    const render = () => {
      const ease = 0.2;
      hudPos.current.x += (targetPos.current.x - hudPos.current.x) * ease;
      hudPos.current.y += (targetPos.current.y - hudPos.current.y) * ease;

      const hudEl = document.getElementById('cyber-cursor-hud');
      if (hudEl) {
        hudEl.style.transform = `translate3d(${hudPos.current.x}px, ${hudPos.current.y}px, 0) translate(-50%, -50%) scale(${
          isClicked ? 0.8 : isHovered ? 1.3 : 1
        })`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible, isHovered, isClicked]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Central Precision Laser Diamond Pip (Zero circles, instant tracking) */}
      <div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none transition-colors duration-150"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(45deg)`,
          backgroundColor: isHovered ? '#00F0C0' : '#00E5BE',
          boxShadow: isHovered
            ? '0 0 10px #00F0C0, 0 0 20px rgba(0, 240, 192, 0.7)'
            : '0 0 5px rgba(0, 229, 190, 0.8)',
        }}
      />

      {/* Trailing Tactical Cybersecurity Targeting Frame (Corner Brackets & Crosshairs, Zero Circles) */}
      <div
        id="cyber-cursor-hud"
        className="fixed top-0 left-0 w-7 h-7 pointer-events-none transition-opacity duration-200"
      >
        {/* 4 Precision L-Shaped Corner Brackets (Target Lock-On) */}
        {/* Top-Left */}
        <span
          className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] transition-colors duration-150"
          style={{
            borderColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.45)',
            filter: isHovered ? 'drop-shadow(0 0 4px #00F0C0)' : 'none',
          }}
        />
        {/* Top-Right */}
        <span
          className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] transition-colors duration-150"
          style={{
            borderColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.45)',
            filter: isHovered ? 'drop-shadow(0 0 4px #00F0C0)' : 'none',
          }}
        />
        {/* Bottom-Left */}
        <span
          className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] transition-colors duration-150"
          style={{
            borderColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.45)',
            filter: isHovered ? 'drop-shadow(0 0 4px #00F0C0)' : 'none',
          }}
        />
        {/* Bottom-Right */}
        <span
          className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] transition-colors duration-150"
          style={{
            borderColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.45)',
            filter: isHovered ? 'drop-shadow(0 0 4px #00F0C0)' : 'none',
          }}
        />

        {/* Crosshair Cardinal Tick Marks */}
        <span
          className="absolute top-1/2 left-0 w-1 h-[1px] -translate-y-1/2 transition-colors duration-150"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.35)' }}
        />
        <span
          className="absolute top-1/2 right-0 w-1 h-[1px] -translate-y-1/2 transition-colors duration-150"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.35)' }}
        />
        <span
          className="absolute top-0 left-1/2 h-1 w-[1px] -translate-x-1/2 transition-colors duration-150"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.35)' }}
        />
        <span
          className="absolute bottom-0 left-1/2 h-1 w-[1px] -translate-x-1/2 transition-colors duration-150"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.35)' }}
        />

        {/* Micro Cybersecurity HUD Lock Badge (appears on interactive elements) */}
        {isHovered && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1 py-0.5 bg-[#040812]/95 border border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.4)]">
            <span className="w-1 h-1 bg-[#00F0C0] animate-pulse" />
            <span className="text-[7px] font-mono tracking-widest text-[#00F0C0] font-bold uppercase leading-none">
              LOCK
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
